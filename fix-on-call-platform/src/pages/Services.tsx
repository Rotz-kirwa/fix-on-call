import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesGrid from "@/components/landing/ServicesGrid";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ServicesGrid showCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
