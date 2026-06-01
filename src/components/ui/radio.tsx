import * as React from "react";
import { cn } from "../../lib/utils";

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  label?: React.ReactNode;
  onChange?: (value: string) => void;
};

/**
 * Figma: Radio — HORIZONTAL layout, 20×20 circle, primary border+fill when checked.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, disabled, checked, onChange, className, id, value, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-2.5",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input
          ref={ref}
          id={radioId}
          type="radio"
          checked={checked}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="sr-only"
          {...props}
        />
        {/* Visual circle */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
            checked ? "border-primary" : "border-[#c9cbd2] bg-white",
          )}
        >
          {checked ? (
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          ) : null}
        </span>
        {label ? (
          <span className="text-[15px] leading-[22px] text-[#333333]">{label}</span>
        ) : null}
      </label>
    );
  },
);

Radio.displayName = "Radio";
