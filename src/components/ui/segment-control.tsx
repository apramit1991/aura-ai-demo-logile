import { cn } from "../../lib/utils";

type SegmentOption = { id: string; label: string };

type SegmentControlProps = {
  options: SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

/**
 * Figma: Segment Control — 5-item horizontal bar, each item HORIZONTAL, pad=8 12px.
 * Active: primary fill + white text. Container: border, bg-white, r=8.
 */
export function SegmentControl({ options, value, onChange, className }: SegmentControlProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border border-[#c9cbd2] bg-white",
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-9 px-3 text-[15px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30",
              index !== 0 && "border-l border-[#c9cbd2]",
              active
                ? "bg-primary text-white"
                : "text-[#5c5c5c] hover:bg-[#f4f5fa] hover:text-[#333333]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
