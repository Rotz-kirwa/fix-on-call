import { motion } from "framer-motion";

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
];

const ServicesGrid = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">What We Fix</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Services for every breakdown
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              {service.image ? (
                <div className="relative h-80 w-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{service.desc}</p>
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
