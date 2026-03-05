import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const dashboardPath =
    user?.role === "mechanic"
      ? "/mechanic"
      : user?.role === "admin" ||
          user?.role === "super_admin" ||
          user?.role === "support_agent" ||
          user?.role === "finance" ||
          user?.role === "dispatch" ||
          user?.role === "partner_manager"
        ? "/admin"
        : "/driver";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://i.pinimg.com/736x/9f/11/9c/9f119c5372e0806ce7d8aa14b8de2aff.jpg" 
            alt="Fix On Call Logo" 
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="text-lg font-bold text-foreground">Fix On Call</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          {isAuthenticated && (
            <Link to={dashboardPath} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          )}
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
          <Link to="/plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Plans</Link>
          <Link to="/vendor-application" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Partner With Us</Link>
          <Link to="/contact-info" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" onClick={logout}>Log Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="flex flex-col gap-2 p-4">
              <Link to="/" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/services" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Services</Link>
              <Link to="/blog" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Blog</Link>
              {isAuthenticated && (
                <Link to={dashboardPath} className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              )}
              <Link to="/how-it-works" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link to="/about" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>About Us</Link>
              <Link to="/plans" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Plans</Link>
              <Link to="/vendor-application" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Partner With Us</Link>
              <Link to="/contact-info" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Contact</Link>
              {isAuthenticated ? (
                <>
                  <Button variant="outline" onClick={() => { logout(); setMobileOpen(false); }}>Log Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="hero" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
