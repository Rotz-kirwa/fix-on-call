import { Shield, PhoneCall, MapPinned, Ambulance, CarFront, Fuel, Wrench, KeyRound } from "lucide-react";

const trustStats = [
  { value: "2M+", label: "Drivers Reached", note: "Across urban roads and remote routes" },
  { value: "1K+", label: "Verified Responders", note: "Mechanics, tow teams, and emergency partners" },
  { value: "59K+", label: "Rescues Completed", note: "Fast roadside support delivered in Kenya" },
];

const coverItems = [
  { icon: CarFront, text: "Towing & vehicle recovery" },
  { icon: Wrench, text: "Battery jumpstart & tire change" },
  { icon: Fuel, text: "Emergency fuel delivery" },
  { icon: KeyRound, text: "Key lockout support" },
  { icon: Ambulance, text: "Optional medical/security escalation" },
];

const SpecialFeaturesSection = () => {
  return (
    <section id="plans" className="py-24 bg-muted/40">
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustStats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
              <div className="text-base font-semibold text-foreground mt-1">{stat.label}</div>
              <p className="text-sm text-muted-foreground mt-2">{stat.note}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <article className="lg:col-span-3 rounded-2xl border border-border bg-card p-7 shadow-card">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Shield className="w-3.5 h-3.5" />
              Premium Annual Cover
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">Roadside protection for everyday driving</h3>
            <p className="text-muted-foreground mb-6">
              Built for Kenyan drivers who want reliable rescue support, transparent dispatch, and priority response when breakdowns happen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coverItems.map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 rounded-xl bg-muted/60 p-3">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="lg:col-span-2 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-background p-7 shadow-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Plans</p>
            <div className="space-y-2 mt-2">
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">Monthly (1 vehicle)</span>
                <span className="text-2xl font-black text-foreground">KSh 1,000</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">Yearly (1 vehicle)</span>
                <span className="text-2xl font-black text-foreground">KSh 10,000</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Choose monthly flexibility or save with annual cover.</p>

            <div className="my-6 h-px bg-border" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Included rescues</span>
                <span className="font-semibold text-foreground">Up to 4 / year</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Towing distance</span>
                <span className="font-semibold text-foreground">Up to 600 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-semibold text-foreground">24/7 nationwide</span>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h3 className="text-2xl font-black text-foreground mb-5">Emergency flow made simple</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/60 p-4">
              <PhoneCall className="w-5 h-5 text-primary mb-2" />
              <p className="font-semibold text-foreground">1. Call for Help</p>
              <p className="text-sm text-muted-foreground mt-1">Reach support instantly when you’re stranded.</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4">
              <MapPinned className="w-5 h-5 text-primary mb-2" />
              <p className="font-semibold text-foreground">2. Share Location</p>
              <p className="text-sm text-muted-foreground mt-1">Use GPS pin sharing to speed up responder matching.</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4">
              <Wrench className="w-5 h-5 text-primary mb-2" />
              <p className="font-semibold text-foreground">3. Get Rescued</p>
              <p className="text-sm text-muted-foreground mt-1">Nearest verified team is dispatched with live updates.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SpecialFeaturesSection;
