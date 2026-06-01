import { cn } from "../../lib/utils";

type BadgeVariant = "red" | "blue" | "green" | "gray" | "orange";

type BadgeProps = {
  /** Numeric count or short label */
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  red: "bg-[#e22d20] text-white",
  blue: "bg-[#0a68db] text-white",
  green: "bg-[#2b9a1f] text-white",
  gray: "bg-[#e5e7eb] text-[#6b7280] border border-[#d1d5db]",
  orange: "bg-[#f59e0b] text-white",
};

/** Figma: Badge — 16×16px pill, r=1000, pad=0 2px, text 12px */
export function Badge({ children, variant = "red", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-semibold leading-none",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
