import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "danger";
type ButtonSize = "default" | "icon" | "sm";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  default:
    "border border-primary bg-primary text-primary-foreground hover:bg-[#0858b9]",
  outline:
    "border border-[#c9cbd2] bg-white text-[#333333] hover:border-[#aeb3bd] hover:bg-[#f8f9fb]",
  ghost: "border border-transparent bg-transparent text-[#5c5c5c] hover:bg-[#eef3fb]",
  danger:
    "border border-[#f1b7b1] bg-white text-[#e22d20] hover:bg-[#fff3f2]",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-9 px-3 text-[15px]",
  sm: "h-8 px-3 text-sm",
  icon: "h-9 w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
