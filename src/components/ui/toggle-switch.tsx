import { cn } from "../../lib/utils";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

/**
 * Figma: Toggle Switch — label + ellipse toggle track.
 * Track: 38×20px, r=1000. Thumb: 16px circle. Active: primary bg.
 */
export function ToggleSwitch({ checked, onChange, label, disabled, id, className }: ToggleSwitchProps) {
  const switchId = id ?? `toggle-${Math.random().toString(36).slice(2)}`;

  return (
    <label
      htmlFor={switchId}
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {label ? (
        <span className="text-[15px] leading-[22px] text-[#333333]">{label}</span>
      ) : null}
      <div className="relative">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* Track */}
        <div
          aria-hidden="true"
          className={cn(
            "h-5 w-[38px] rounded-full transition-colors duration-200",
            checked ? "bg-primary" : "bg-[#d1d5db]",
          )}
        />
        {/* Thumb */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-[19px]" : "translate-x-0.5",
          )}
        />
      </div>
    </label>
  );
}
