import { cn } from "../../lib/utils";

type ToggleOption = { id: string; label: string };

type ToggleProps = {
  options: ToggleOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

/**
 * Figma: Toggle — 2-item horizontal group, pill container, selected: primary bg.
 * Each item: h=32, pad=0 12px, text 15px.
 */
export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center rounded-full border border-[#c9cbd2] bg-white p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-8 rounded-full px-4 text-[15px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              active
                ? "bg-primary text-white shadow-sm"
                : "text-[#5c5c5c] hover:text-[#333333]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
