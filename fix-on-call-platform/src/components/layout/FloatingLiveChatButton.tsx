import { MessageCircle } from "lucide-react";

const FloatingLiveChatButton = () => {
  return (
    <a
      href="/contact"
      aria-label="Open live chat support"
      className="fixed bottom-24 right-5 z-[70] group"
    >
      <div className="relative">
        <span className="absolute -inset-1 rounded-2xl bg-primary/20 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 py-2.5 shadow-xl transition-transform duration-200 group-hover:scale-[1.02]">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70 animate-ping" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-500 border border-white" />
            </span>
          </div>

          <div className="leading-tight">
            <div className="text-[13px] font-bold text-foreground">Live Chat</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500 animate-live-blink" />
              Operator online
            </div>
          </div>

          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5">
            1
          </span>
        </div>
      </div>
    </a>
  );
};

export default FloatingLiveChatButton;
