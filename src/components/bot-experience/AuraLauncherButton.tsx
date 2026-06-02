import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import aiChatCircle from "../../assets/ai-chat-circle.svg";

type AuraLauncherButtonProps = {
  onClick: () => void;
  className?: string;
  children?: ReactNode;
};

export function AuraLauncherButton({ onClick, className, children }: AuraLauncherButtonProps) {
  return (
    <button
      type="button"
      aria-label="Open AURA AI assistant"
      onClick={onClick}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-[32px] outline-none transition-all duration-200 hover:scale-[1.03] active:scale-95 focus-visible:ring-4 focus-visible:ring-[#7edff4]",
        className,
      )}
    >
      <img src={aiChatCircle} alt="" aria-hidden="true" className="h-16 w-16 shrink-0" />
      {children}
    </button>
  );
}
