import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: TooltipSide;
  className?: string;
};

const sideStyles: Record<TooltipSide, { tooltip: string; arrow: string }> = {
  top: {
    tooltip: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    arrow: "top-full left-1/2 -translate-x-1/2 border-t-[#333333] border-x-transparent border-b-transparent border-[5px]",
  },
  bottom: {
    tooltip: "top-full left-1/2 mt-2 -translate-x-1/2",
    arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-[#333333] border-x-transparent border-t-transparent border-[5px]",
  },
  left: {
    tooltip: "right-full top-1/2 mr-2 -translate-y-1/2",
    arrow: "left-full top-1/2 -translate-y-1/2 border-l-[#333333] border-y-transparent border-r-transparent border-[5px]",
  },
  right: {
    tooltip: "left-full top-1/2 ml-2 -translate-y-1/2",
    arrow: "right-full top-1/2 -translate-y-1/2 border-r-[#333333] border-y-transparent border-l-transparent border-[5px]",
  },
};

/**
 * Figma: Tooltip — text frame + chevron, r=6, bg=#333333, white text 13px.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  function show() {
    timeoutRef.current = window.setTimeout(() => setVisible(true), 120);
  }

  function hide() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const styles = sideStyles[side];

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-[6px] bg-[#333333] px-2.5 py-1.5 text-[13px] leading-5 text-white shadow-lg",
            styles.tooltip,
          )}
        >
          {content}
          <span
            aria-hidden="true"
            className={cn("absolute h-0 w-0 border-solid", styles.arrow)}
          />
        </span>
      ) : null}
    </span>
  );
}
