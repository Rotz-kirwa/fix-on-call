import { FaWhatsapp } from "react-icons/fa";
import { SUPPORT_WHATSAPP_PHONE } from "@/lib/contact";

const FloatingWhatsApp = () => {
  return (
    <a
      href={`https://wa.me/${SUPPORT_WHATSAPP_PHONE}?text=Hello%20Fix%20On%20Call%2C%20I%20need%20an%20urgent%20dispatch.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Fix On Call on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] group"
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-live-blink" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
        </span>
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg border border-white/30 transition-transform duration-200 group-hover:scale-105">
          <FaWhatsapp className="w-7 h-7" />
        </div>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
