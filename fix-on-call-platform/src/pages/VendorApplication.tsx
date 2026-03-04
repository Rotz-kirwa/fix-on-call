import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supportAPI } from "@/lib/api";

const checkboxGroup = (name: string, items: string[]) =>
  items.map((item) => (
    <label key={`${name}-${item}`} className="flex items-center gap-2 text-sm text-foreground">
      <input type="checkbox" name={name} value={item} className="h-4 w-4 rounded border-border" />
      <span>{item}</span>
    </label>
  ));

const VendorApplication = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const get = (key: string) => String(formData.get(key) || "").trim();
    const getAll = (key: string) => formData.getAll(key).map((x) => String(x)).filter(Boolean);

    const fullName = get("full_name");
    const businessName = get("business_name");
    const phone = get("phone");
    const email = get("email");
    const cityArea = get("city_area");
    const baseLocation = get("base_location");
    const radiusTown = get("service_radius_town");
    const optionalDescription = get("optional_description");
    const paymentNumber = get("payment_number");

    const serviceTypes = getAll("service_type");
    const serviceRadius = getAll("service_radius");
    const operationCities = getAll("city_operation");
    const availability = getAll("availability");
    const capacity = getAll("capacity");
    const hasEquipment = getAll("has_equipment");
    const paymentMethod = getAll("payment_method");

    setIsSubmitting(true);
    try {
      const message = [
        "Fix On Call Vendor Partner Application",
        "",
        "Section 1 - Basic Information",
        `Full Name / Contact Person: ${fullName || "N/A"}`,
        `Business Name: ${businessName || "N/A"}`,
        `Phone Number: ${phone || "N/A"}`,
        `Email: ${email || "N/A"}`,
        `City / Area: ${cityArea || "N/A"}`,
        "",
        "Section 2 - Service Type",
        `${serviceTypes.length ? serviceTypes.join(", ") : "N/A"}`,
        "",
        "Section 3 - Service Coverage",
        `Base Location: ${baseLocation || "N/A"}`,
        `Service Radius: ${serviceRadius.length ? serviceRadius.join(", ") : "N/A"}`,
        `Specified Town: ${radiusTown || "N/A"}`,
        `City of Operation: ${operationCities.length ? operationCities.join(", ") : "N/A"}`,
        `Availability: ${availability.length ? availability.join(", ") : "N/A"}`,
        "",
        "Section 4 - Capacity",
        `Vehicles at a time: ${capacity.length ? capacity.join(", ") : "N/A"}`,
        `Own equipment: ${hasEquipment.length ? hasEquipment.join(", ") : "N/A"}`,
        `Optional description: ${optionalDescription || "N/A"}`,
        "",
        "Section 5 - Payment Details",
        `Preferred payment method: ${paymentMethod.length ? paymentMethod.join(", ") : "N/A"}`,
        `Payment Number: ${paymentNumber || "N/A"}`,
        "",
        "Section 6 - Verification",
        "Upload ID or Business Document: File attached in form (manual review required)",
        "",
        "Section 7 - Agreement",
        "Applicant confirmed accuracy and agreed to Fix On Call service standards.",
      ].join("\n");

      await supportAPI.createConversation({
        channel: "partner_application",
        customer_name: fullName || "Partner Applicant",
        customer_email: email || undefined,
        customer_phone: phone || undefined,
        inquiry_type: "Partner Application",
        tags: ["partner-application", "vendor-application"],
        message,
        sender: "user",
      });

      setSubmitted(true);
      form.reset();
      toast({
        title: "Application submitted",
        description: "Our team will review your application and contact you within 24-48 hours.",
      });
    } catch {
      toast({
        title: "Submission failed",
        description: "Could not submit application right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Fix On Call - Vendor Partner Application</p>
              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">Join the Fix On Call Service Network</h1>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 shadow-card text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">Application Received</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Thank you for applying to join the Fix On Call network. Our team will review your application and contact
                  you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 1 - Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Full Name / Contact Person</Label><Input name="full_name" required /></div>
                    <div><Label>Business Name (if any)</Label><Input name="business_name" /></div>
                    <div><Label>Phone Number</Label><Input name="phone" required /></div>
                    <div><Label>Email Address</Label><Input name="email" type="email" required /></div>
                    <div className="md:col-span-2"><Label>City / Area of Operation</Label><Input name="city_area" required /></div>
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 2 - Service Type</h2>
                  <p className="text-sm text-muted-foreground mb-3">What service do you provide?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {checkboxGroup("service_type", [
                      "Mechanic",
                      "Towing Service",
                      "Fuel Delivery",
                      "Spare Parts Supplier",
                      "Garage / Workshop",
                    ])}
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 3 - Service Coverage</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Base Location</Label><Input name="base_location" placeholder="Google Maps location or area name" /></div>
                    <div>
                      <Label>Service Radius</Label>
                      <div className="space-y-2 mt-2">
                        {checkboxGroup("service_radius", ["Within my town", "Up to 20 KM", "20-50 KM", "Nationwide", "Specify town"])}
                      </div>
                      <div className="mt-3">
                        <Label>Which town? (if applicable)</Label>
                        <Input name="service_radius_town" placeholder="e.g. Kakamega" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>City of Operation (Kenya)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {checkboxGroup("city_operation", ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"])}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Availability</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {checkboxGroup("availability", ["24/7", "Daytime only", "Emergency calls only"])}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 4 - Capacity</h2>
                  <div className="mb-4">
                    <Label>How many vehicles can you serve at a time?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {checkboxGroup("capacity", ["1", "2-3", "4-5", "5+"])}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Do you own service equipment?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {checkboxGroup("has_equipment", ["Yes", "No"])}
                    </div>
                  </div>
                  <div>
                    <Label>(Optional description)</Label>
                    <Textarea name="optional_description" />
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 5 - Payment Details</h2>
                  <div className="mb-4">
                    <Label>Preferred Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {checkboxGroup("payment_method", ["M-Pesa", "Bank Transfer", "Airtel Money"])}
                    </div>
                  </div>
                  <div>
                    <Label>M-Pesa / Payment Number</Label>
                    <Input name="payment_number" />
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 6 - Verification</h2>
                  <Label>Upload ID or Business Document</Label>
                  <Input name="verification_doc" type="file" />
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-bold text-foreground mb-4">Section 7 - Agreement</h2>
                  <div className="space-y-3 text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" required /> <span>I confirm the information provided is accurate</span></label>
                    <label className="flex items-center gap-2"><input type="checkbox" required /> <span>I agree to follow Fix On Call service standards</span></label>
                  </div>
                </section>

                <p className="text-sm text-muted-foreground">
                  Our team will review your application and contact you within 24-48 hours.
                </p>

                <div className="flex justify-end">
                  <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VendorApplication;
