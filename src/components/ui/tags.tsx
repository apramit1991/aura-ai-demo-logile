import { Calendar, X } from "lucide-react";
import { cn } from "../../lib/utils";

type TagProps = {
  label: string;
  icon?: React.ElementType;
  onRemove?: () => void;
  className?: string;
};

/**
 * Figma: Tags — pill with calendar-check icon leading + close trailing, r=1000.
 */
export function Tag({ label, icon: Icon = Calendar, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border border-[#c9cbd2] bg-white px-2.5 text-[13px] leading-none text-[#333333]",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#5c5c5c]" aria-hidden="true" />
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove tag ${label}`}
          className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#e5e7eb] hover:text-[#333333]"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
