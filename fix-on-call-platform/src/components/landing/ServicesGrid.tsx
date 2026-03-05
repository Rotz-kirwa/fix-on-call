import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  { 
    image: "https://i.pinimg.com/736x/49/a2/70/49a2701ae79210cc06ecdb05d767f895.jpg",
    title: "Battery Jump Start", 
    desc: "Dead battery? We'll get you running in minutes." 
  },
  { 
    image: "https://i.pinimg.com/1200x/ab/ff/f8/abfff85ba9b89c57f5b5d4b83e1ed5d7.jpg",
    title: "Flat Tire Fix", 
    desc: "Puncture repair or spare tire swap on the spot." 
  },
  { 
    image: "https://i.pinimg.com/1200x/9c/61/78/9c617816f65b20efd8f593b8e713a9e2.jpg",
    title: "Engine Repair", 
    desc: "Diagnostics and on-site engine troubleshooting." 
  },
  { 
    image: "https://i.pinimg.com/1200x/64/6d/04/646d0462a0369b305857b2319255779f.jpg",
    title: "Towing Service", 
    desc: "Safe towing to the nearest garage when needed." 
  },
  { 
    image: "https://i.pinimg.com/736x/ac/8f/90/ac8f90bb860310f2eb1a2c6e9c7155de.jpg",
    title: "Brake Service", 
    desc: "Emergency brake pad replacement and repair." 
  },
  { 
    image: "https://i.pinimg.com/1200x/67/c7/38/67c738927305a066576eba99705ab67f.jpg",
    title: "Fuel Delivery", 
    desc: "Ran out of fuel? We'll bring it to you." 
  },
  {
    image: "https://i.pinimg.com/736x/19/21/92/1921928153ffdaf6914f17f455fb5da4.jpg",
    title: "Minor roadside repairs",
    desc: "Quick on-site fixes for small faults to get you moving again.",
  },
  {
    image: "https://i.pinimg.com/1200x/ed/a9/67/eda967f2f648a97bf11f40bd9d3c862c.jpg",
    title: "Car Lockout Services",
    desc: "Locked out of your car? Get fast, damage-free key retrieval support.",
  },
  {
    image: "https://i.pinimg.com/736x/bf/34/aa/bf34aa971fe424616a1e3af18e8f12fd.jpg",
    title: "Auto Spares Delivery",
    desc: "Need a part urgently? We deliver essential auto spares to your location.",
  },
];

interface ServicesGridProps {
  showCTA?: boolean;
}

const ServicesGrid = ({ showCTA = false }: ServicesGridProps) => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Featured Services</p>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">What We Fix</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Services for every breakdown
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden w-full"
            >
              {service.image ? (
                <div className="relative h-72 md:h-80 w-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{service.desc}</p>
                    {showCTA && (
                      <Link to="/service-request" className="inline-block mt-4">
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          Get Service
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
