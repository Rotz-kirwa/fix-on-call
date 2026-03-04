import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Headset, LocateFixed, Send, ShieldCheck, Share2, Timer, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supportAPI } from "@/lib/api";

type ChatMessage = {
  id: number;
  sender: "user" | "operator";
  text: string;
  time: string;
};

type LivePayload = {
  requestId: string;
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  ts: number;
};

const operatorReplies = [
  "Thanks for reaching out. Please share your location or nearest landmark so we can dispatch quickly.",
  "We have received your request. A support operator is checking available responders near you.",
  "Understood. Please keep your phone line open while we coordinate your rescue team.",
  "You're covered. We are escalating this as priority support and will update you shortly.",
];

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getPrecisePosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    let bestPosition: GeolocationPosition | null = null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }

        // Only auto-accept when GPS is very accurate.
        if (position.coords.accuracy <= 30) {
          navigator.geolocation.clearWatch(watchId);
          resolve(position);
        }
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    window.setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      // Do not send coarse fallback positions (often IP-based and wrong city/country).
      if (bestPosition && bestPosition.coords.accuracy <= 200) {
        resolve(bestPosition);
      } else {
        reject(new Error("Low accuracy location"));
      }
    }, 12000);
  });

const reverseGeocode = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    {
      headers: {
        "Accept-Language": "en",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await response.json();
  const address = data?.address || {};
  const placeName =
    address?.road ||
    address?.suburb ||
    address?.neighbourhood ||
    address?.village ||
    address?.town ||
    address?.city ||
    "Unknown place";
  const area =
    address?.city ||
    address?.town ||
    address?.county ||
    address?.state ||
    "Unknown area";

  return {
    displayName: data?.display_name || "Address unavailable",
    placeName,
    area,
    countryCode: (address?.country_code || "").toLowerCase(),
    country: address?.country || "Unknown country",
  };
};

const Contact = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [isOperatorTyping, setIsOperatorTyping] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [isLiveSharing, setIsLiveSharing] = useState(false);
  const [liveRequestId, setLiveRequestId] = useState<string | null>(null);
  const [lastLiveUpdate, setLastLiveUpdate] = useState<LivePayload | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "operator",
      text: "Hello, welcome to Fix On Call live support. Tell us what happened with your vehicle.",
      time: getTime(),
    },
  ]);

  const queuePosition = useMemo(() => (isOperatorTyping ? 1 : 0), [isOperatorTyping]);
  const conversationStorageKey = user?.id ? `fixoncall-live-chat-conversation-${user.id}` : "";
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    if (!conversationStorageKey) return;
    const saved = localStorage.getItem(conversationStorageKey);
    if (saved) setConversationId(Number(saved));
  }, [conversationStorageKey]);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_LIVE_LOCATION_WS_URL as string | undefined;
    if (!wsUrl) return;

    try {
      socketRef.current = new WebSocket(wsUrl);
    } catch {
      socketRef.current = null;
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
      socketRef.current?.close();
    };
  }, []);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    if (!user) return null;

    const response = await supportAPI.createConversation({
      channel: "live_chat",
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone,
      user_id: Number(user.id) || undefined,
      tags: ["live-chat", "roadside-support"],
      message: "Customer started live support chat.",
      sender: "user",
    });

    const createdId = response.data?.conversation?.id as number | undefined;
    if (!createdId) return null;
    setConversationId(createdId);
    if (conversationStorageKey) localStorage.setItem(conversationStorageKey, String(createdId));
    return createdId;
  };

  const pushUserMessageToSupport = async (text: string) => {
    try {
      const id = await ensureConversation();
      if (!id) return;
      await supportAPI.createMessage(id, { sender: "user", body: text });
    } catch {
      // Keep chat UX responsive even if API temporarily fails.
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    void pushUserMessageToSupport(userMessage.text);
    setMessage("");
    setIsOperatorTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        sender: "operator",
        text: operatorReplies[Math.floor(Math.random() * operatorReplies.length)],
        time: getTime(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsOperatorTyping(false);
    }, 1200);
  };

  const shareMyInfo = () => {
    if (!isAuthenticated || !user) return;

    const infoMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text:
        `Share My Info\n` +
        `Name: ${user.name}\n` +
        `Phone: ${user.phone || "Not provided"}\n` +
        `Email: ${user.email}\n` +
        `Role: ${user.role}`,
      time: getTime(),
    };

    setMessages((prev) => [...prev, infoMessage]);
    void pushUserMessageToSupport(infoMessage.text);
    setIsOperatorTyping(true);

    window.setTimeout(() => {
      const ack: ChatMessage = {
        id: Date.now() + 1,
        sender: "operator",
        text: "Thanks, we’ve received your account details. Please now share your exact location or nearest landmark.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, ack]);
      setIsOperatorTyping(false);
    }, 900);
  };

  const shareExactLocation = async () => {
    if (!isAuthenticated) return;
    if (!navigator.geolocation) {
      const unsupportedMessage: ChatMessage = {
        id: Date.now(),
        sender: "operator",
        text: "Location sharing is not supported on this device/browser.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, unsupportedMessage]);
      return;
    }

    setIsSharingLocation(true);

    try {
      const position = await getPrecisePosition();
      const { latitude, longitude, accuracy } = position.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      const reverse = await reverseGeocode(latitude, longitude);

      // Guardrail for this Kenya-focused app: avoid sending clearly wrong geocodes.
      if (reverse.countryCode && reverse.countryCode !== "ke") {
        throw new Error("OutsideKenya");
      }

      const locationMessage: ChatMessage = {
        id: Date.now(),
        sender: "user",
        text:
          `Exact Location Shared\n` +
          `Place: ${reverse.placeName}\n` +
          `Area: ${reverse.area}\n` +
          `Address: ${reverse.displayName}\n` +
          `Latitude: ${latitude.toFixed(6)}\n` +
          `Longitude: ${longitude.toFixed(6)}\n` +
          `Accuracy: ±${Math.round(accuracy)}m\n` +
          `Google Maps: ${mapsLink}`,
        time: getTime(),
      };

      setMessages((prev) => [...prev, locationMessage]);
      void pushUserMessageToSupport(locationMessage.text);
      setIsOperatorTyping(true);

      window.setTimeout(() => {
        const ack: ChatMessage = {
          id: Date.now() + 1,
          sender: "operator",
          text: "Perfect. We’ve received your precise coordinates and location name. Dispatching the nearest responder now.",
          time: getTime(),
        };
        setMessages((prev) => [...prev, ack]);
        setIsOperatorTyping(false);
      }, 900);
    } catch (error: any) {
      let errorText = "Unable to fetch your location. Please enable location permission and try again.";
      if (error?.code === 1) {
        errorText = "Location permission was denied. Please allow location access to share your exact pin.";
      } else if (error?.code === 3) {
        errorText = "Location request timed out. Please retry where GPS signal is stronger.";
      } else if (error?.message === "Low accuracy location") {
        errorText =
          "Your device returned low-accuracy location (possibly IP/VPN based). Move outdoors, enable precise GPS, then try again.";
      } else if (error?.message === "OutsideKenya") {
        errorText =
          "Detected location is outside Kenya. Please disable VPN/mock location and retry to share your exact Nairobi position.";
      }

      const failedMessage: ChatMessage = {
        id: Date.now(),
        sender: "operator",
        text: errorText,
        time: getTime(),
      };
      setMessages((prev) => [...prev, failedMessage]);
    } finally {
      setIsSharingLocation(false);
    }
  };

  const locationErrorMessage = (code?: number) => {
    if (code === 1) return "Location permission denied.";
    if (code === 2) return "Location unavailable. Check GPS/network.";
    if (code === 3) return "Location request timed out. Try again.";
    return "Location error occurred.";
  };

  const canUseGeolocationSecurely = () => {
    const isLocalhost =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return window.isSecureContext || isLocalhost;
  };

  const shouldSendLiveUpdate = (ts: number) => {
    if (ts - lastSentRef.current > 3000) {
      lastSentRef.current = ts;
      return true;
    }
    return false;
  };

  const sendSocketEvent = (type: string, payload: Record<string, unknown>) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type, payload }));
  };

  const stopLiveLocation = (systemReason?: string) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (liveRequestId) {
      sendSocketEvent("stop_live_location", { requestId: liveRequestId });
    }

    if (isLiveSharing) {
      const stopMsg: ChatMessage = {
        id: Date.now(),
        sender: "operator",
        text: systemReason || "Live location sharing stopped.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, stopMsg]);
    }

    setIsLiveSharing(false);
    setLiveRequestId(null);
    setLastLiveUpdate(null);
  };

  const startLiveLocation = () => {
    if (!isAuthenticated || !user) return;
    if (!("geolocation" in navigator)) {
      const msg: ChatMessage = {
        id: Date.now(),
        sender: "operator",
        text: "Geolocation is not supported on this device/browser.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, msg]);
      return;
    }
    if (!canUseGeolocationSecurely()) {
      const msg: ChatMessage = {
        id: Date.now(),
        sender: "operator",
        text: "Live location requires HTTPS (localhost is allowed for development).",
        time: getTime(),
      };
      setMessages((prev) => [...prev, msg]);
      return;
    }

    const requestId = `req-${user.id}-${Date.now()}`;
    setLiveRequestId(requestId);
    setIsLiveSharing(true);
    lastSentRef.current = 0;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: "Live location sharing started. I consent to share my location for this request.",
        time: getTime(),
      },
    ]);
    void pushUserMessageToSupport("Live location sharing started. Customer consent recorded.");

    sendSocketEvent("join_request_room", { requestId });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const payload: LivePayload = {
          requestId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? null,
          speed: pos.coords.speed ?? null,
          ts: pos.timestamp,
        };

        setLastLiveUpdate(payload);
        if (!shouldSendLiveUpdate(payload.ts)) return;

        const mapsLink = `https://maps.google.com/?q=${payload.lat},${payload.lng}`;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "user",
            text:
              `Live location update\n` +
              `Accuracy: ±${Math.round(payload.accuracy)}m\n` +
              `Google Maps: ${mapsLink}`,
            time: getTime(),
          },
        ]);
        void pushUserMessageToSupport(
          `Live location update: lat ${payload.lat.toFixed(6)}, lng ${payload.lng.toFixed(6)}, accuracy ±${Math.round(
            payload.accuracy
          )}m`
        );

        sendSocketEvent("live_location_update", payload as unknown as Record<string, unknown>);
      },
      (err) => {
        const msg: ChatMessage = {
          id: Date.now(),
          sender: "operator",
          text: locationErrorMessage(err.code),
          time: getTime(),
        };
        setMessages((prev) => [...prev, msg]);
        stopLiveLocation("Live location stopped due to location error.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    // Auto-stop to reduce battery drain and enforce consent window.
    stopTimerRef.current = window.setTimeout(() => {
      stopLiveLocation("Live location auto-stopped after 30 minutes.");
    }, 30 * 60 * 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Live Operator Support</h1>
              <p className="text-lg text-muted-foreground">Secure assistance for registered Fix On Call users.</p>
            </div>

            {!isAuthenticated ? (
              <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 shadow-card text-center">
                <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to start live chat</h2>
                <p className="text-muted-foreground mb-6">
                  Live operator chat is available to users who have created an account.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/login">
                    <Button variant="hero" size="lg" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1 rounded-2xl border border-border bg-card p-5 shadow-card h-fit">
                  <div className="flex items-center gap-2 mb-4">
                    <Headset className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">Support Status</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="rounded-xl bg-muted/70 p-3">
                      <div className="text-muted-foreground mb-1">Signed in as</div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <UserRound className="w-4 h-4 text-primary" />
                        {user?.name}
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/70 p-3">
                      <div className="text-muted-foreground mb-1">Operator</div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/70 p-3">
                      <div className="text-muted-foreground mb-1">Queue Position</div>
                      <div className="font-semibold text-foreground">{queuePosition === 0 ? "Connected" : `#${queuePosition}`}</div>
                    </div>
                    <div className="rounded-xl bg-muted/70 p-3">
                      <div className="text-muted-foreground mb-1">Average response</div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <Timer className="w-4 h-4 text-primary" />
                        1 - 2 min
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/70 p-3">
                      <div className="text-muted-foreground mb-1">Live location</div>
                      <div className="font-semibold text-foreground">
                        {isLiveSharing ? "Sharing now" : "Not sharing"}
                      </div>
                      {lastLiveUpdate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Last accuracy: ±{Math.round(lastLiveUpdate.accuracy)}m
                        </div>
                      )}
                    </div>
                  </div>
                </aside>

                <section className="lg:col-span-3 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                  <div className="border-b border-border px-5 py-4 flex items-center justify-between">
                    <div className="font-bold text-foreground">Fix On Call Live Chat</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                      Verified support
                    </div>
                  </div>

                  <div className="h-[420px] overflow-y-auto p-5 space-y-3 bg-muted/30">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-background border border-border text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              msg.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isOperatorTyping && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-background border border-border text-sm text-muted-foreground">
                          Operator is typing...
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="border-t border-border p-4 flex items-center gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message to support operator..."
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant={isLiveSharing ? "destructive" : "outline"}
                      size="lg"
                      className="h-11 px-4"
                      onClick={isLiveSharing ? () => stopLiveLocation() : startLiveLocation}
                    >
                      {isLiveSharing ? "Stop Live" : "Live"}
                    </Button>
                    <Button type="button" variant="outline" size="lg" className="h-11 px-4" onClick={shareMyInfo}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-11 px-4"
                      onClick={shareExactLocation}
                      disabled={isSharingLocation}
                    >
                      <LocateFixed className="w-4 h-4" />
                    </Button>
                    <Button type="submit" variant="hero" size="lg" className="h-11 px-5">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
