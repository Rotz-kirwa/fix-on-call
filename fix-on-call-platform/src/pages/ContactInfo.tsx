import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supportAPI } from "@/lib/api";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/contact";
import { Handshake, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";

const ContactInfo = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast({ title: "Missing details", description: "Please complete all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await supportAPI.createConversation({
        channel: "inquiry",
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        inquiry_type: inquiryType,
        tags: ["contact-page", inquiryType.toLowerCase().replace(/\s+/g, "-")],
        message: message,
        sender: "user",
      });

      setLoading(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setInquiryType("General Inquiry");
      toast({ title: "Inquiry sent", description: "Our operations team will contact you shortly." });
    } catch {
      setLoading(false);
      toast({
        title: "Failed to send",
        description: "Could not reach support service. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Contact</p>
              <h1 className="text-4xl md:text-5xl font-black text-foreground">Get In Touch</h1>
              <p className="mt-3 text-sm font-semibold text-emerald-700">
                ⏱ Average response time: 3 minutes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <article className="rounded-2xl border border-border bg-card p-8 shadow-card space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have a question? Need assistance? Want to partner with us?
                  <br />
                  Our operations team is standing by.
                </p>

                <div className="space-y-4 text-base">
                  <h2 className="text-2xl font-bold text-foreground">📍 Fix On Call HQ</h2>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:info@fixoncall.com" className="text-foreground hover:text-primary transition-colors">
                      info@fixoncall.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${SUPPORT_PHONE_E164}`} className="text-foreground hover:text-primary transition-colors">
                      {SUPPORT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Fix On Call HQ map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=36.7300%2C-1.3400%2C36.9000%2C-1.2200&layer=mapnik&marker=-1.286389%2C36.817223"
                    className="w-full h-64 border-0"
                    loading="lazy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={`tel:${SUPPORT_PHONE_E164}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Siren className="w-4 h-4" />
                      Emergency Call
                    </Button>
                  </a>
                  <Link to="/contact">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <MessageCircle className="w-4 h-4" />
                      Live Chat
                    </Button>
                  </Link>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-primary" />
                    Partner Inquiry
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Want to join our verified network of mechanics, garages, and roadside providers?
                  </p>
                  <Link to="/vendor-application" className="inline-block mt-3">
                    <Button variant="outline">Partner With Us</Button>
                  </Link>
                </div>

                <p className="text-sm font-semibold text-foreground">
                  Intelligent roadside rescue - just a call away.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-card p-8 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-5">📩 Send an Inquiry</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Select Inquiry Type</Label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm mt-1.5"
                    >
                      <option>General Inquiry</option>
                      <option>Roadside Assistance</option>
                      <option>Billing & Subscription</option>
                      <option>Partnership Request</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1.5 min-h-32"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </article>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactInfo;
