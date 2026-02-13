import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Phone, AlertTriangle, History, Car, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const statCards = [
  { label: "Services Used", value: "12", icon: History, color: "text-trust" },
  { label: "Avg. Response", value: "8 min", icon: Clock, color: "text-success" },
  { label: "Your Rating", value: "4.8", icon: Star, color: "text-warning" },
];

const recentServices = [
  { type: "Flat Tire Fix", mechanic: "James Mwangi", date: "2 days ago", status: "Completed", rating: 5 },
  { type: "Battery Jump Start", mechanic: "Sarah Wanjiku", date: "1 week ago", status: "Completed", rating: 4 },
  { type: "Engine Diagnostic", mechanic: "Peter Ochieng", date: "2 weeks ago", status: "Completed", rating: 5 },
];

const DriverDashboard = () => {
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
                Hello, {user?.name || "Driver"} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Need help on the road? We've got you.</p>
            </div>
            <Button variant="hero" size="lg" className="animate-pulse-glow">
              <AlertTriangle className="w-5 h-5" />
              Request Service
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border shadow-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder + recent services */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Map */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Nearby Mechanics
                </h2>
              </div>
              <div className="h-72 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Map integration coming soon</p>
                  <p className="text-xs opacity-60">Real-time mechanic locations</p>
                </div>
              </div>
            </div>

            {/* Recent services */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <History className="w-4 h-4 text-trust" />
                  Recent Services
                </h2>
              </div>
              <div className="divide-y divide-border">
                {recentServices.map((service, i) => (
                  <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm text-foreground">{service.type}</p>
                      <span className="text-[10px] font-medium bg-success/10 text-success px-2 py-0.5 rounded-full">{service.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{service.mechanic} · {service.date}</p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: service.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Car, label: "My Vehicle", href: "#" },
              { icon: History, label: "Full History", href: "#" },
              { icon: User, label: "Profile", href: "#" },
              { icon: Phone, label: "Emergency", href: "#" },
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

export default DriverDashboard;
