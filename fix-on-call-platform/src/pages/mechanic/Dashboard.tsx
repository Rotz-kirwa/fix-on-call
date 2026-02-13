import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Star, ToggleLeft, ToggleRight, Wrench, TrendingUp, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const nearbyJobs = [
  { type: "Flat Tire Fix", driver: "Mary Njeri", distance: "1.2 km", price: "KES 2,500", time: "3 min ago" },
  { type: "Battery Jump Start", driver: "John Otieno", distance: "3.4 km", price: "KES 1,800", time: "5 min ago" },
  { type: "Engine Won't Start", driver: "David Kimani", distance: "5.1 km", price: "KES 4,000", time: "8 min ago" },
];

const MechanicDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Hello, {user?.name || "Mechanic"} 🔧
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isAvailable ? "You're online and receiving job requests" : "You're currently offline"}
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                isAvailable
                  ? "bg-success text-success-foreground shadow-sm"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {isAvailable ? "Available" : "Offline"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Earnings", value: "KES 8,500", icon: DollarSign, color: "text-success" },
              { label: "Jobs Completed", value: "156", icon: Wrench, color: "text-trust" },
              { label: "Avg. Rating", value: "4.9", icon: Star, color: "text-warning" },
              { label: "Response Time", value: "6 min", icon: Clock, color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border shadow-card p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Available jobs + map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Jobs list */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  Available Jobs
                </h2>
                <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                  {nearbyJobs.length} new
                </span>
              </div>
              <div className="divide-y divide-border">
                {nearbyJobs.map((job, i) => (
                  <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm text-foreground">{job.type}</p>
                        <p className="text-xs text-muted-foreground">{job.driver} · {job.distance}</p>
                      </div>
                      <p className="text-sm font-bold text-success">{job.price}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{job.time}</span>
                      <Button size="sm" variant="hero" className="h-8 text-xs">
                        Accept Job
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Nearby Requests
                </h2>
              </div>
              <div className="h-80 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Map integration coming soon</p>
                  <p className="text-xs opacity-60">See driver locations in real time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: TrendingUp, label: "Earnings" },
              { icon: Wrench, label: "My Jobs" },
              { icon: User, label: "Profile" },
              { icon: Settings, label: "Settings" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
              >
                <action.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MechanicDashboard;
