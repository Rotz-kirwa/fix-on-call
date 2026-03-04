import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bell,
  Clock3,
  DollarSign,
  Gauge,
  MapPin,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  ToggleLeft,
  ToggleRight,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type Job = {
  id: number;
  driver: string;
  issue: string;
  distanceKm: number;
  fare: number;
  countdown: number;
  priority: "High" | "Medium";
};

const initialJobs: Job[] = [
  { id: 101, driver: "Kelvin N", issue: "Flat tire replacement", distanceKm: 2.4, fare: 2800, countdown: 85, priority: "High" },
  { id: 102, driver: "Mary W", issue: "Battery jumpstart", distanceKm: 4.1, fare: 1900, countdown: 130, priority: "Medium" },
  { id: 103, driver: "James O", issue: "Engine no-start", distanceKm: 3.2, fare: 3600, countdown: 98, priority: "High" },
];

const weeklyEarnings = [
  { day: "Mon", value: 7400 },
  { day: "Tue", value: 8600 },
  { day: "Wed", value: 9800 },
  { day: "Thu", value: 7900 },
  { day: "Fri", value: 11200 },
  { day: "Sat", value: 13400 },
  { day: "Sun", value: 9200 },
];

const responseTrend = [
  { t: "08:00", mins: 7.2 },
  { t: "10:00", mins: 6.3 },
  { t: "12:00", mins: 5.8 },
  { t: "14:00", mins: 6.1 },
  { t: "16:00", mins: 5.4 },
  { t: "18:00", mins: 5.1 },
];

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const MechanicDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [newJobPulseId, setNewJobPulseId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState(4);
  const user = useAuthStore((s) => s.user);

  const todayEarnings = useMemo(() => 12850, []);
  const weeklyTotal = useMemo(() => weeklyEarnings.reduce((acc, item) => acc + item.value, 0), []);
  const completedJobs = useMemo(() => 164, []);
  const averageRating = useMemo(() => 4.9, []);
  const responseTime = useMemo(() => "5.4 min", []);
  const monthlyGoal = 180000;
  const monthlyCurrent = 128500;
  const monthlyProgress = Math.min(100, Math.round((monthlyCurrent / monthlyGoal) * 100));

  const playAlert = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.value = 0.02;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 160);
    } catch {
      // Ignore alert sound failures on restricted browsers.
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setJobs((prev) =>
        prev
          .map((job) => ({ ...job, countdown: Math.max(0, job.countdown - 1) }))
          .filter((job) => job.countdown > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const generator = setInterval(() => {
      if (!isAvailable) return;

      const id = Date.now();
      const sampleJobs = [
        { issue: "Fuel delivery", fare: 2200, distanceKm: 2.8, priority: "Medium" as const },
        { issue: "Locksmith retrieval", fare: 3100, distanceKm: 3.7, priority: "High" as const },
        { issue: "Accident recovery", fare: 6400, distanceKm: 5.9, priority: "High" as const },
      ];
      const picked = sampleJobs[Math.floor(Math.random() * sampleJobs.length)];
      const incoming: Job = {
        id,
        driver: "New Dispatch",
        issue: picked.issue,
        fare: picked.fare,
        distanceKm: picked.distanceKm,
        priority: picked.priority,
        countdown: 140,
      };

      setJobs((prev) => [incoming, ...prev].slice(0, 6));
      setNewJobPulseId(id);
      setNotifications((n) => n + 1);
      playAlert();
      setTimeout(() => setNewJobPulseId(null), 2200);
    }, 28000);

    return () => clearInterval(generator);
  }, [isAvailable, soundEnabled]);

  const acceptJob = (jobId: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const declineJob = (jobId: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b14] via-[#0b1220] to-[#0f172a] text-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl p-4 md:p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Mission Control</p>
                <h1 className="text-xl md:text-2xl font-bold text-white">Welcome back, {user?.name || "Mechanic"}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border ${
                    isAvailable
                      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                      : "border-white/15 bg-white/5 text-slate-300"
                  }`}
                >
                  {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {isAvailable ? "Available" : "Offline"}
                </button>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-300" />
                  <span className="text-slate-200">Live Location</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-300" />
                  <span className="text-slate-300">Today:</span>
                  <span className="font-semibold text-white">KSh {todayEarnings.toLocaleString()}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span className="font-semibold text-white">{notifications}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
                  <Clock3 className="w-4 h-4 text-cyan-300" />
                  <span className="text-slate-300">Response:</span>
                  <span className="font-semibold text-white">{responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <aside className="xl:col-span-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-lg flex items-center gap-2">
                  <Siren className="w-5 h-5 text-rose-300" />
                  Incoming Jobs
                </h2>
                <button
                  onClick={() => setSoundEnabled((v) => !v)}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    soundEnabled ? "border-emerald-400/30 text-emerald-300" : "border-white/15 text-slate-300"
                  }`}
                >
                  {soundEnabled ? "Sound On" : "Sound Off"}
                </button>
              </div>

              <div className="space-y-3">
                {jobs.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                    No pending jobs. Stay online to receive dispatch requests.
                  </div>
                )}
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`rounded-xl border p-3 ${
                      newJobPulseId === job.id
                        ? "border-emerald-400/40 bg-emerald-400/10 animate-pulse"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-white">{job.issue}</p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          job.priority === "High"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-400/20 text-amber-300"
                        }`}
                      >
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{job.driver}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                      <span>{job.distanceKm} km away</span>
                      <span>KSh {job.fare.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-cyan-300 font-semibold">Auto-expires in {formatCountdown(job.countdown)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold" onClick={() => acceptJob(job.id)}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/15 text-slate-200 hover:bg-white/10"
                        onClick={() => declineJob(job.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </aside>

            <section className="xl:col-span-6 space-y-6">
              <article className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="font-bold text-white text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                    Live Route Preview
                  </h2>
                  <span className="text-xs text-emerald-300 inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live tracking active
                  </span>
                </div>
                <div className="relative h-[360px] rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                  <div className="absolute left-[22%] top-[58%] h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.9)]" />
                  <div className="absolute right-[26%] top-[30%] h-4 w-4 rounded-full bg-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.9)]" />
                  <div className="absolute left-[25%] top-[56%] w-[46%] h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-300 to-rose-400 rotate-[-19deg]" />
                  <div className="absolute left-4 bottom-4 rounded-lg bg-black/35 border border-white/10 px-3 py-2 text-xs text-slate-200">
                    Mechanic: Your live location
                  </div>
                  <div className="absolute right-4 top-4 rounded-lg bg-black/35 border border-white/10 px-3 py-2 text-xs text-slate-200">
                    Job: Driver pickup point
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-300" />
                    Mechanic Level Progress
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-lg bg-violet-400/20 text-violet-200">Level 7 - Elite Responder</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  You are at <strong>{monthlyProgress}%</strong> of your monthly revenue goal.
                </p>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400"
                    style={{ width: `${monthlyProgress}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
                  <span>KSh {monthlyCurrent.toLocaleString()} achieved</span>
                  <span>Goal: KSh {monthlyGoal.toLocaleString()}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["CBD", "Westlands", "Kilimani", "Thika Rd"].map((zone) => (
                    <span key={zone} className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-slate-200">
                      Demand heat: {zone}
                    </span>
                  ))}
                </div>
              </article>
            </section>

            <aside className="xl:col-span-3 space-y-6">
              <article className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-xl">
                <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-300" />
                  Analytics
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1">
                      {averageRating} <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-slate-400">Completed</p>
                    <p className="text-lg font-bold text-white">{completedJobs}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 col-span-2">
                    <p className="text-xs text-slate-400">Weekly Earnings</p>
                    <p className="text-lg font-bold text-white">KSh {weeklyTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="h-36 rounded-xl border border-white/10 bg-[#0a1222] p-2 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyEarnings}>
                      <defs>
                        <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.55} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 10, color: "#e2e8f0" }}
                        formatter={(value: number) => [`KSh ${value.toLocaleString()}`, "Earnings"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="#34d399" fill="url(#earningsFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-32 rounded-xl border border-white/10 bg-[#0a1222] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTrend}>
                      <CartesianGrid stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="t" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 10, color: "#e2e8f0" }}
                        formatter={(value: number) => [`${value.toFixed(1)} min`, "Response"]}
                      />
                      <Line type="monotone" dataKey="mins" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-xl">
                <h3 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-300" />
                  AI Priority Score
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { name: "Accident Recovery", score: 98 },
                    { name: "Battery Jumpstart", score: 88 },
                    { name: "Fuel Delivery", score: 74 },
                  ].map((item) => (
                    <div key={item.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-xs font-semibold text-emerald-300">{item.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Command Center Mode enabled. Dispatch privacy, live operations, and performance intelligence active.
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold">Optimize Shift</Button>
                <Button size="sm" variant="outline" className="border-white/15 text-slate-200 hover:bg-white/10">
                  <XCircle className="w-4 h-4 mr-1" />
                  Pause Queue
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MechanicDashboard;
