import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const normalizeKenyanPhone = (value: string) => value.replace(/[^\d+]/g, "");

const isValidKenyanPhone = (phone: string) => /^(?:\+254|254|0)7\d{8}$/.test(phone);

const toMpesaFormat = (phone: string) => {
  const cleaned = normalizeKenyanPhone(phone);
  if (cleaned.startsWith("+254")) return cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("0")) return `254${cleaned.slice(1)}`;
  return cleaned;
};

const PaymentCheckout = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "annual";
  const amount = plan === "monthly" ? 1000 : 10000;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [stkSent, setStkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalized = normalizeKenyanPhone(phone);
    if (!fullName || !email || !vehicleReg || !normalized) {
      toast({ title: "Missing details", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (!isValidKenyanPhone(normalized)) {
      toast({
        title: "Invalid phone number",
        description: "Use Kenyan format: 07XXXXXXXX or +2547XXXXXXXX.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Placeholder STK push flow. Replace with backend API call.
    setTimeout(() => {
      setLoading(false);
      setStkSent(true);
      toast({
        title: "STK Push sent",
        description: `Prompt sent to ${toMpesaFormat(normalized)}. Complete payment on your phone.`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Payment</p>
              <h1 className="text-4xl font-black text-foreground">Complete Your Cover Purchase</h1>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Plan</p>
                  <p className="text-xl font-bold text-foreground capitalize">{plan} Premium Cover (1 Vehicle)</p>
                </div>
                <p className="text-3xl font-black text-foreground">KSh {amount.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Kamau" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <Label>Phone Number (for STK push)</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX or +2547XXXXXXXX" />
              </div>
              <div>
                <Label>Vehicle Registration Number</Label>
                <Input value={vehicleReg} onChange={(e) => setVehicleReg(e.target.value.toUpperCase())} placeholder="KDA 123A" />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                <Smartphone className="w-5 h-5" />
                {loading ? "Sending STK Push..." : "Pay with M-Pesa STK Push"}
              </Button>
            </form>

            {stkSent && (
              <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  STK push has been sent successfully
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check your phone and enter your M-Pesa PIN to complete payment. Once successful, your cover is activated.
                </p>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCheckout;
