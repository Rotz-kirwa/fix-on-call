import { PhoneCall } from "lucide-react";
import { SUPPORT_PHONE_LOCAL } from "@/lib/contact";

const FloatingCallButton = () => {
  const phone = SUPPORT_PHONE_LOCAL;

  return (
    <a
      href={`tel:${phone}`}
      aria-label="Call Fix On Call emergency support"
      className="fixed bottom-5 left-5 z-[70] group"
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-yellow-300/60 to-amber-500/50 blur-sm" />
        <div className="relative flex items-center gap-2 px-4 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 border border-yellow-100/70 shadow-[0_10px_25px_-8px_rgba(245,158,11,0.85)] transition-transform duration-200 group-hover:scale-105">
          <PhoneCall className="w-5 h-5 animate-live-blink" />
          <span className="text-sm font-extrabold tracking-wide">CALL NOW</span>
        </div>
      </div>
    </a>
  );
};

export default FloatingCallButton;
