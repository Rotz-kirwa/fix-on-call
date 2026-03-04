import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Car,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Route,
  ShieldCheck,
  User,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";
import { servicesAPI } from "@/lib/api";

type RequestStatus = "pending" | "confirmed" | "dispatched" | "arrived" | "in_service" | "completed" | "rejected";

const statusFlow: { key: RequestStatus; label: string }[] = [
  { key: "pending", label: "Request pending review" },
  { key: "confirmed", label: "Request confirmed" },
  { key: "dispatched", label: "Mechanic dispatched" },
  { key: "arrived", label: "Mechanic arrived" },
  { key: "in_service", label: "Service in progress" },
  { key: "completed", label: "Completed" },
];

const humanServiceType = (value?: string) =>
  value
    ? value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Roadside Assistance";

const backendToRequestStatus = (value?: string): RequestStatus => {
  if (!value) return "pending";
  if (value === "accepted") return "confirmed";
  if (value === "in_progress") return "in_service";
  if (value === "cancelled") return "rejected";
  if (value === "pending" || value === "confirmed" || value === "dispatched" || value === "arrived" || value === "in_service" || value === "completed" || value === "rejected") {
    return value;
  }
  return "pending";
};

const etaForStatus = (value: RequestStatus) => {
  if (value === "pending") return 12;
  if (value === "confirmed") return 10;
  if (value === "dispatched") return 8;
  if (value === "arrived") return 3;
  if (value === "in_service") return 2;
  return 3;
};

const DriverDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const vehicle = user?.vehicleInfo || {};
  const [searchParams] = useSearchParams();

  const [requestActive, setRequestActive] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [etaMins, setEtaMins] = useState(12);
  const [activeService, setActiveService] = useState("Roadside Assistance");
  const planExpiry = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
  }, []);

  const currentStepIndex = useMemo(() => {
    if (status === "rejected") return 1;
    return statusFlow.findIndex((s) => s.key === status);
  }, [status]);
  const statusPresentation = useMemo(() => {
    if (status === "pending") {
      return { label: "Pending", tone: "bg-amber-50 text-amber-700", message: "Your request is pending confirmation by dispatch." };
    }
    if (status === "confirmed") {
      return { label: "Confirmed", tone: "bg-sky-50 text-sky-700", message: "Your request has been confirmed. Assigning nearest mechanic." };
    }
    if (status === "dispatched") {
      return { label: "Dispatched", tone: "bg-indigo-50 text-indigo-700", message: "A mechanic has been dispatched and is heading to you." };
    }
    if (status === "rejected") {
      return { label: "Rejected", tone: "bg-rose-50 text-rose-700", message: "Request was rejected. Please retry or update location details." };
    }
    if (status === "completed") {
      return { label: "Completed", tone: "bg-emerald-50 text-emerald-700", message: "Service completed successfully." };
    }
    return { label: "In Progress", tone: "bg-emerald-50 text-emerald-700", message: "Your service is active and being handled now." };
  }, [status]);

  useEffect(() => {
    if (searchParams.get("track") === "1") {
      setRequestActive(true);
      const requestIdFromParams = Number(searchParams.get("requestId"));
      if (requestIdFromParams) setCurrentRequestId(requestIdFromParams);
      const requestedService = searchParams.get("service");
      if (requestedService) setActiveService(requestedService);
    }
  }, [searchParams]);

  useEffect(() => {
    const syncLatestStatus = async () => {
      try {
        const res = await servicesAPI.getServiceHistory({ page: 1, per_page: 50 });
        const rows = (res.data?.services || []) as Array<{ id: number; status: string; service_type?: string }>;
        if (!rows.length) {
          setRequestActive(false);
          return;
        }

        const target = (currentRequestId ? rows.find((x) => x.id === currentRequestId) : undefined) || rows[0];
        if (!target) {
          setRequestActive(false);
          return;
        }

        if (!currentRequestId) setCurrentRequestId(target.id);
        setRequestActive(true);
        if (target.service_type) setActiveService(humanServiceType(target.service_type));

        const mappedStatus = backendToRequestStatus(target.status);
        setStatus(mappedStatus);
        setEtaMins(etaForStatus(mappedStatus));
      } catch {
        // Keep current tracker state on transient API failures.
      }
    };

    void syncLatestStatus();
    const t = window.setInterval(() => {
      void syncLatestStatus();
    }, 4000);

    return () => window.clearInterval(t);
  }, [currentRequestId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-amber-50 to-orange-100">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hello, {user?.name || "Driver"} 👋</h1>
              <p className="text-sm text-slate-700 mt-1">Track your service request in real time, Uber-style.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Dispatch network online
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-8 space-y-6">
              <article className="rounded-2xl border border-sky-100 bg-white/95 shadow-[0_16px_45px_rgba(14,116,144,0.15)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-bold text-slate-900 text-lg">Live Request Tracker</h2>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {requestActive ? "Live" : "Idle"}
                  </div>
                </div>
                {requestActive && (
                  <div className={`mb-4 rounded-xl border border-current/10 px-3 py-2 text-sm font-medium ${statusPresentation.tone}`}>
                    <div className="flex items-center gap-2">
                      {status === "rejected" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      Request Status: {statusPresentation.label}
                    </div>
                    <p className="mt-1 text-xs opacity-90">{statusPresentation.message}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                  <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-sky-100 p-3">
                    <p className="text-xs text-slate-500">Requested service</p>
                    <p className="font-semibold text-slate-900">{activeService}</p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-100 p-3">
                    <p className="text-xs text-slate-500">Current status</p>
                    <p className="font-semibold text-slate-900">{statusPresentation.label}</p>
                  </div>
                  <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-rose-100 p-3">
                    <p className="text-xs text-slate-500">Estimated arrival</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-1"><Clock3 className="w-4 h-4 text-primary" /> {etaMins} min</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-100 p-3">
                    <p className="text-xs text-slate-500">Mechanic rating</p>
                    <p className="font-semibold text-slate-900">4.9 / 5.0</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {statusFlow.map((item, index) => {
                    if (status === "rejected" && (item.key === "arrived" || item.key === "in_service" || item.key === "completed")) {
                      return null;
                    }
                    const complete = index <= currentStepIndex;
                    return (
                      <div key={item.key} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${complete ? "bg-emerald-50/80" : "bg-white"}`}>
                        {complete ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                        <span className={`text-sm ${complete ? "text-slate-900 font-medium" : "text-slate-500"}`}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl border border-indigo-100 bg-white/95 shadow-[0_16px_45px_rgba(30,64,175,0.15)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Live Map Preview</h3>
                  <span className="text-xs text-slate-500">Last update: just now</span>
                </div>

                <div className="relative h-[360px] rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)", backgroundSize: "18px 18px" }} />
                  <div className="absolute left-[22%] top-[64%] h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.9)]" />
                  <div className="absolute right-[20%] top-[34%] h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse" />
                  <div className="absolute left-[25%] top-[62%] w-[52%] h-[2px] bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rotate-[-22deg]" />

                  <div className="absolute left-4 bottom-4 rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-slate-100">
                    You: Kiambu Rd
                  </div>
                  <div className="absolute right-4 top-4 rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-slate-100">
                    Mechanic: 3.1 km away
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <Button variant="outline" className="border-cyan-300 bg-cyan-50 hover:bg-cyan-100"><PhoneCall className="w-4 h-4" /> Call</Button>
                  <Button variant="outline" className="border-amber-300 bg-amber-50 hover:bg-amber-100"><Route className="w-4 h-4" /> Route</Button>
                  <Button variant="outline" className="border-orange-300 bg-orange-50 hover:bg-orange-100"><MapPin className="w-4 h-4" /> Share Pin</Button>
                  <Button variant="outline" className="border-emerald-300 bg-emerald-50 hover:bg-emerald-100"><ShieldCheck className="w-4 h-4" /> Safety</Button>
                </div>
              </article>
            </section>

            <aside className="xl:col-span-4 space-y-6">
              <section className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 shadow-[0_14px_35px_rgba(244,63,94,0.14)] p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> My Personal Info</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500">Full Name</p>
                    <p className="font-semibold text-slate-900">{user?.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900 break-all flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {user?.email || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {user?.phone || "Not set"}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                    Account Role: {user?.role || "driver"}
                  </span>
                </div>
              </section>

              <section className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 shadow-[0_14px_35px_rgba(8,145,178,0.14)] p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Car className="w-5 h-5 text-primary" /> My Car Details</h2>
                <div className="space-y-3 text-sm">
                  <div><p className="text-slate-500">Make</p><p className="font-semibold text-slate-900">{vehicle.make || "Not set"}</p></div>
                  <div><p className="text-slate-500">Model</p><p className="font-semibold text-slate-900">{vehicle.model || "Not set"}</p></div>
                  <div><p className="text-slate-500">Year</p><p className="font-semibold text-slate-900">{vehicle.year || "Not set"}</p></div>
                  <div><p className="text-slate-500">Plate Number</p><p className="font-semibold text-slate-900">{vehicle.license_plate || "Not set"}</p></div>
                </div>
              </section>

              <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-[0_14px_35px_rgba(16,185,129,0.14)] p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> My Subscription Plan</h2>
                <div className="space-y-3 text-sm">
                  <div className="rounded-xl bg-emerald-100/60 border border-emerald-300/50 p-3">
                    <p className="text-slate-500">Current Plan</p>
                    <p className="font-semibold text-slate-900">Driver Annual Cover</p>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-500">Billing</span><span className="font-semibold text-slate-900">KSh 10,000 / year</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Vehicle Limit</span><span className="font-semibold text-slate-900">1 vehicle</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Expiration</span><span className="font-semibold text-slate-900">{planExpiry}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><ShieldCheck className="w-4 h-4" /> Active</span></div>
                </div>
              </section>
            </aside>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DriverDashboard;
