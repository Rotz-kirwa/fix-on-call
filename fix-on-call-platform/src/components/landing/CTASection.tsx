import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-4">
            Stranded? Not anymore.
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Join thousands of Kenyan drivers who trust Fix On Call for fast, reliable roadside assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="xl" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90 shadow-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-primary-foreground/50 mt-4">No credit card required. Available 24/7.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
