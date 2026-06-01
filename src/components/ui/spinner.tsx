import { cn } from "../../lib/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  label?: string;
};

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * Figma: Spinner — 12px container with 6 radially-arranged leaves at varying opacity.
 * Implemented as a CSS-animated border spinner for maintainability.
 */
export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block animate-spin rounded-full border-2 border-[#e5e7eb] border-t-primary",
          sizeMap[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
