import * as React from "react";
import { cn } from "../../lib/utils";

type IconToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ElementType;
  disabled?: boolean;
  className?: string;
};

/**
 * Figma: Icon Toggle — label + icon-based toggle frame.
 * Active state: primary bg icon container.
 */
export function IconToggle({ label, checked, onChange, icon: Icon, disabled, className }: IconToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2.5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="text-[13px] font-semibold leading-5 text-[#5c5c5c]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          checked
            ? "border-primary bg-primary text-white"
            : "border-[#c9cbd2] bg-white text-[#5c5c5c] hover:border-primary/40 hover:text-primary",
        )}
      >
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      </button>
    </label>
  );
}
