import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const FloatingSupport = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://wa.me/923167530204"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-gold-glow transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(43_56%_52%/0.5)]"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">Support</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default FloatingSupport;
