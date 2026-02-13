import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ServicesGrid from "@/components/landing/ServicesGrid";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ServicesGrid />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
