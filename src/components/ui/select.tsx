import type * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: React.ReactNode;
};

export function Select({ className, label, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-1 text-[15px] text-[#5c5c5c]">
      {label}
      <span className="relative">
        <select
          className={cn(
            "h-9 w-full appearance-none rounded-md border border-[#c9cbd2] bg-white px-2.5 pr-8 text-[17px] text-[#333333] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5c5c5c]" />
      </span>
    </label>
  );
}
