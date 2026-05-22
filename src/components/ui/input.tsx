import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-[#c9cbd2] bg-white px-3 text-[17px] text-[#333333] shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-[#888888]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
