import { X } from "lucide-react";
import { cn } from "../../lib/utils";

type ChipsProps = {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
};

/**
 * Figma: Chips — HORIZONTAL pill, r=1000, border, pad=0 8px.
 * Selected state: primary border + light-blue bg.
 */
export function Chip({ label, selected = false, onRemove, onClick, className }: ChipsProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[13px] leading-none transition",
        selected
          ? "border-primary bg-[#e8f2ff] text-primary"
          : "border-[#c9cbd2] bg-white text-[#333333]",
        onClick && "cursor-pointer hover:border-primary/60",
        className,
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#e5e7eb] hover:text-[#333333]"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}

type ChipGroupProps = {
  chips: string[];
  selected?: string[];
  onRemove?: (chip: string) => void;
  onSelect?: (chip: string) => void;
  className?: string;
};

export function ChipGroup({ chips, selected = [], onRemove, onSelect, className }: ChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <Chip
          key={chip}
          label={chip}
          selected={selected.includes(chip)}
          onRemove={onRemove ? () => onRemove(chip) : undefined}
          onClick={onSelect ? () => onSelect(chip) : undefined}
        />
      ))}
    </div>
  );
}
