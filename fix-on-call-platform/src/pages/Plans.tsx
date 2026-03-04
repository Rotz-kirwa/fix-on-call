import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Plans = () => {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-4xl font-black text-foreground mb-6">All Services Included</h2>

              <div className="space-y-4 text-2xl font-semibold text-foreground">
                {[
                  "Vehicle recovery",
                  "Towing services",
                  "Key retrieval/locksmith",
                  "Fuel delivery",
                  "Flat tire change",
                  "Battery jumpstart",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-[#ff4d3a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px bg-border flex-1" />
                <p className="text-[#ff4d3a] italic font-semibold">Exclusively from Fix On Call</p>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="rounded-xl bg-[#f3efef] p-5 space-y-4 text-xl font-semibold text-foreground">
                {[
                  "Security escort",
                  "Mobile security response",
                  "Medical emergency assistance",
                  "Ambulance response",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#ff4d3a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
                <div className="bg-[#ece8e8] text-center font-bold text-foreground py-2 text-lg">Best for individuals & family</div>
                <div className="p-6">
                  <h3 className="text-4xl font-black text-foreground mb-2">Annual Premium <span className="text-[#b08b4f]">Plan</span></h3>
                  <div className="flex items-center gap-2 text-5xl font-black text-foreground mb-3">
                    KSh 10,000
                    <CarFront className="w-7 h-7 text-[#ff4d3a]" />
                    <span className="text-2xl font-medium text-muted-foreground">/ (1) Vehicle Yearly</span>
                  </div>
                  <p className="text-2xl text-muted-foreground mb-6">Comprehensive coverage for regular drivers</p>
                  <Link to="/payment?plan=annual">
                    <Button className="w-full h-14 rounded-full text-2xl font-bold bg-[#ff4d3a] hover:bg-[#f13f2c]">
                      Cover your vehicle
                    </Button>
                  </Link>
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
                <div className="bg-[#1f1f21] text-center font-bold text-white py-2 text-lg">For Business & Bulk purchase</div>
                <div className="p-6">
                  <h3 className="text-4xl font-black text-foreground mb-2">Business & Bulk Purchase <span className="text-muted-foreground">Plan</span></h3>
                  <p className="text-6xl font-black text-foreground mb-6">Custom</p>
                  <Link to="/contact-info">
                    <Button variant="outline" className="w-full h-14 rounded-full text-2xl font-bold">
                      Contact Team for pricing
                    </Button>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Plans;
