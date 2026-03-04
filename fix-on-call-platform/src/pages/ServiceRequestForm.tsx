import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { servicesAPI } from "@/lib/api";
import { Loader2, LocateFixed, ExternalLink } from "lucide-react";

const services = [
  "Battery Jump Start",
  "Flat Tire Fix",
  "Engine Repair",
  "Towing Service",
  "Brake Service",
  "Fuel Delivery",
  "Locksmith / Key Retrieval",
  "Accident Recovery",
];

const priorities = ["Low", "Medium", "High", "Emergency"];
const serviceTypeMap: Record<string, string> = {
  "Battery Jump Start": "battery_jump",
  "Flat Tire Fix": "tyre_change",
  "Engine Repair": "mechanic_dispatch",
  "Towing Service": "towing",
  "Brake Service": "mechanic_dispatch",
  "Fuel Delivery": "fuel_delivery",
  "Locksmith / Key Retrieval": "lockout",
  "Accident Recovery": "breakdown",
};
const KENYA_BOUNDS = {
  minLat: -4.9,
  maxLat: 5.2,
  minLng: 33.4,
  maxLng: 41.95,
};

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedService, setSelectedService] = useState(services[0]);
  const [location, setLocation] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState("");

  const isWithinKenya = (lat: number, lng: number) =>
    lat >= KENYA_BOUNDS.minLat &&
    lat <= KENYA_BOUNDS.maxLat &&
    lng >= KENYA_BOUNDS.minLng &&
    lng <= KENYA_BOUNDS.maxLng;

  const reverseGeocode = async (lat: number, lng: number) => {
    const reverseRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    if (!reverseRes.ok) return null;
    const data = await reverseRes.json();
    const displayName = (data?.display_name as string | undefined) || "";
    const countryCode = String(data?.address?.country_code || "").toLowerCase();
    return { displayName, countryCode };
  };

  const locationErrorMessage = (err: GeolocationPositionError) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return "Location permission denied. Please allow access and try again.";
      case err.POSITION_UNAVAILABLE:
        return "Location unavailable. Turn on GPS/mobile data and retry.";
      case err.TIMEOUT:
        return "Location request timed out. Move to open sky and retry.";
      default:
        return "Could not fetch your location.";
    }
  };

  const handleUseLiveLocation = () => {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser/device does not support live location.",
        variant: "destructive",
      });
      return;
    }

    setLocating(true);
    let watchId: number | null = null;
    let bestPosition: GeolocationPosition | null = null;
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId) clearTimeout(timeoutId);
    };

    const applyPosition = async (position: GeolocationPosition) => {
      if (resolved) return;
      resolved = true;
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));
      const accuracy = Math.round(position.coords.accuracy);

      if (!isWithinKenya(lat, lng)) {
        setLocating(false);
        toast({
          title: "Wrong location detected",
          description:
            "Detected coordinates are outside Kenya. Turn off VPN/mock location, enable GPS, then retry.",
          variant: "destructive",
        });
        return;
      }

      setCoordinates({ lat, lng });
      setLocation(`Lat ${lat}, Lng ${lng} (±${accuracy}m accuracy)`);
      setLocationLabel("");

      try {
        const geo = await reverseGeocode(lat, lng);
        if (geo?.countryCode && geo.countryCode !== "ke") {
          setCoordinates(null);
          setLocating(false);
          toast({
            title: "Wrong country location",
            description:
              "Reverse geocoding shows a non-Kenya location. Please retry with device GPS enabled.",
            variant: "destructive",
          });
          return;
        }

        if (geo?.displayName) {
          const readable = geo.displayName.split(",").slice(0, 4).join(", ").trim();
          setLocationLabel(readable);
          setLocation(`${readable} (Lat ${lat}, Lng ${lng}, ±${accuracy}m)`);
        }
      } catch {
        // Keep coordinates if reverse geocoding fails.
      }

      setLocating(false);
      toast({
        title: "Precise location added",
        description:
          accuracy > 80
            ? "Location captured but still low accuracy. Move outdoors and retry for better precision."
            : "Your live Kenya location was captured successfully.",
      });
    };

    watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        if (!bestPosition || pos.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = pos;
        }

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accurateEnough = pos.coords.accuracy <= 35;

        if (accurateEnough && isWithinKenya(lat, lng)) {
          cleanup();
          await applyPosition(pos);
        }
      },
      (err) => {
        cleanup();
        setLocating(false);
        toast({
          title: "Location error",
          description: locationErrorMessage(err),
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    timeoutId = setTimeout(async () => {
      if (resolved) return;
      cleanup();
      if (!bestPosition) {
        setLocating(false);
        toast({
          title: "Location not found",
          description: "Could not get your GPS position. Ensure location is enabled and retry.",
          variant: "destructive",
        });
        return;
      }
      await applyPosition(bestPosition);
    }, 16000);
  };

  const mapEmbedSrc = coordinates
    ? `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=17&output=embed`
    : "https://maps.google.com/maps?q=-1.286389,36.817223&z=13&output=embed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !location || !description) {
      toast({
        title: "Missing details",
        description: "Please select a service and fill location + description.",
        variant: "destructive",
      });
      return;
    }

    const mappedType = serviceTypeMap[selectedService] || "mechanic_dispatch";
    const locationPayload: Record<string, unknown> = {
      landmark: location,
      area: locationLabel || "Nairobi",
      country: "Kenya",
    };
    if (coordinates) {
      locationPayload.latitude = coordinates.lat;
      locationPayload.longitude = coordinates.lng;
      locationPayload.accuracy = 20;
    }

    try {
      setLoading(true);
      const response = await servicesAPI.requestService({
        service_type: mappedType,
        location: locationPayload,
        description,
        priority: priority.toLowerCase(),
        vehicle_info: {
          ...(user?.vehicleInfo || {}),
          license_plate: vehicleReg || user?.vehicleInfo?.license_plate || undefined,
        },
      });

      const serviceId = response.data?.service?.id;
      setLoading(false);
      toast({
        title: "Service request submitted",
        description: `Request ${serviceId ? `#${serviceId} ` : ""}is now being matched with nearby mechanics.`,
      });
      navigate(
        `/driver?track=1&service=${encodeURIComponent(selectedService)}&priority=${encodeURIComponent(priority)}${
          serviceId ? `&requestId=${encodeURIComponent(String(serviceId))}` : ""
        }`
      );
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Request failed",
        description: error?.response?.data?.error || "Could not submit request to backend.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4">
            <div className="max-w-xl mx-auto rounded-2xl border border-border bg-card p-8 shadow-card text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to request service</h1>
              <p className="text-muted-foreground mb-6">
                You need an account to submit and track roadside requests in real time.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/login">
                  <Button variant="hero">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Request Service</p>
              <h1 className="text-4xl font-black text-foreground">Specialized Service Request Form</h1>
              <p className="text-muted-foreground mt-2">Hello {user?.name}, choose your service and submit to start live tracking.</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
              <div>
                <Label>Service Type</Label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm mt-1.5"
                >
                  {services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Location / Landmark</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Waiyaki Way near ABC Place"
                    className="mt-1.5"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseLiveLocation}
                      disabled={locating}
                      className="border-primary/30"
                    >
                      {locating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Getting location...
                        </>
                      ) : (
                        <>
                          <LocateFixed className="w-4 h-4" />
                          Use Live Location
                        </>
                      )}
                    </Button>
                    {coordinates && (
                      <a
                        href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button type="button" variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                          Open in Google Maps
                        </Button>
                      </a>
                    )}
                  </div>
                  {locationLabel && (
                    <p className="mt-2 text-xs text-emerald-700 font-medium">Detected place: {locationLabel}</p>
                  )}
                </div>
                <div>
                  <Label>Vehicle Registration Number</Label>
                  <Input
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                    placeholder="e.g. KDA 123A"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Kenya Live Location Map</Label>
                <div className="mt-1.5 overflow-hidden rounded-xl border border-border bg-muted/20">
                  <iframe
                    title="Kenya live location map"
                    src={mapEmbedSrc}
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Map defaults to Kenya and updates to your exact pin after you tap "Use Live Location".
                </p>
              </div>

              <div>
                <Label>Priority</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm mt-1.5"
                >
                  {priorities.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Issue Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened and what support you need."
                  className="mt-1.5 min-h-28"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request & Track Service"}
              </Button>
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRequestForm;
