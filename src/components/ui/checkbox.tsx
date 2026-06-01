import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  label?: React.ReactNode;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
};

/**
 * Figma: Checkbox — HORIZONTAL layout, 20×20px box, r=4, primary fill when checked.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, disabled, checked, onChange, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-2.5",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {/* Hidden native input for a11y */}
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        {/* Visual box */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
            checked || indeterminate
              ? "border-primary bg-primary text-white"
              : "border-[#c9cbd2] bg-white",
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3" />
          ) : checked ? (
            <Check className="h-3.5 w-3.5" />
          ) : null}
        </span>
        {label ? (
          <span className="text-[15px] leading-[22px] text-[#333333]">{label}</span>
        ) : null}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
