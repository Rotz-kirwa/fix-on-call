import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Globe, ShieldCheck, Smartphone, Wrench } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">About Us</p>
              <h1 className="text-4xl md:text-5xl font-black text-foreground">Fix On Call Ltd</h1>
            </div>

            <article className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-card space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Fix On Call Ltd is redefining roadside rescue - intelligent help, just a tap away. From Nairobi's
                bustling highways to remote roads across Africa, we connect drivers to certified mechanics, rapid
                towing, emergency fuel, and verified spare parts with unmatched speed, trust, and precision.
              </p>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Built mobile-first and globally scalable, Fix On Call Ltd fuses smart technology, insurance
                integration, and vendor partnerships to deliver peace of mind on every journey.
              </p>

              <p className="text-lg md:text-xl font-bold text-foreground">
                Our vision is bold: no driver ever stranded, anywhere in the world.
              </p>
            </article>

            <div className="mt-8 rounded-2xl border border-border bg-card p-3 shadow-card">
              <img
                src="https://www.dropbox.com/scl/fi/gsggzk73561qkcctfy7vj/stuck.png?rlkey=ycex7e29q7mac647ae8c2wdao&st=0t7ka1zq&raw=1"
                alt="Driver stranded on the road"
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Wrench, title: "Certified Network", text: "Trusted mechanics and verified service partners." },
                { icon: ShieldCheck, title: "Trust & Precision", text: "Reliable support with accountable dispatch." },
                { icon: Smartphone, title: "Mobile-First", text: "Built for fast action on the move." },
                { icon: Globe, title: "Global Scale", text: "Designed to grow from Africa to the world." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
