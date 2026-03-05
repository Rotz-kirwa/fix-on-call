import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Roadside assistance in Kenya" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-background mb-6">
              Roadside help,{" "}
              <span className="text-primary">in minutes.</span>
            </h1>

            <p className="text-lg md:text-xl text-background/70 mb-8 max-w-lg leading-relaxed">
              Flat tire? Engine trouble? Fix On Call connects you with verified mechanics near you — fast, reliable, and transparent.
            </p>

            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 mb-12">
              <Link to="/service-request">
                <Button variant="hero" size="xl" className="w-auto max-w-[9.5rem] h-10 px-3 text-sm sm:w-full sm:max-w-none sm:h-14 sm:px-10 sm:text-lg">
                  Request Service
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/vendor-application">
                <Button variant="hero-outline" size="xl" className="w-auto max-w-[9.5rem] h-10 px-3 text-sm sm:w-full sm:max-w-none sm:h-14 sm:px-10 sm:text-lg border-background/30 text-background hover:bg-background hover:text-foreground">
                  Be a Partner
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-6 text-background/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Avg. 12 min response</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Verified mechanics</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>47 counties covered</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
