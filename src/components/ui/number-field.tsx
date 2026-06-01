import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

type NumberFieldProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Figma: Number Field — input flanked by stepper buttons (+/-).
 * Size: h=36, border=#c9cbd2, stepper buttons h=36 w=36.
 */
export function NumberField({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  disabled = false,
  className,
}: NumberFieldProps) {
  function decrement() {
    const next = value - step;
    if (next >= min) onChange(next);
  }

  function increment() {
    const next = value + step;
    if (next <= max) onChange(next);
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label ? (
        <span className="text-[13px] font-semibold leading-[18px] text-[#5c5c5c]">{label}</span>
      ) : null}
      <div
        className={cn(
          "inline-flex h-9 items-stretch overflow-hidden rounded-md border border-[#c9cbd2] bg-white",
          disabled && "opacity-50",
        )}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          aria-label="Decrease"
          className="flex w-9 shrink-0 items-center justify-center border-r border-[#c9cbd2] text-[#5c5c5c] transition hover:bg-[#f4f5fa] disabled:pointer-events-none disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) onChange(parsed);
          }}
          className="w-16 min-w-0 flex-1 bg-transparent text-center text-[15px] text-[#333333] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={label ?? "Number value"}
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          aria-label="Increase"
          className="flex w-9 shrink-0 items-center justify-center border-l border-[#c9cbd2] text-[#5c5c5c] transition hover:bg-[#f4f5fa] disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
