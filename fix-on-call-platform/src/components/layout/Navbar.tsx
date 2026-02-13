import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
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
          {isLanding && (
            <>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
            </>
          )}
          {isAuthenticated ? (
            <>
              <Link to={user?.role === "mechanic" ? "/mechanic" : "/driver"}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
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
              {isLanding && (
                <>
                  <a href="#how-it-works" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>How It Works</a>
                  <a href="#services" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Services</a>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to={user?.role === "mechanic" ? "/mechanic" : "/driver"} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
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
