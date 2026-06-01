import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onSearch?: (value: string) => void;
};

/**
 * Figma: Search Input — HORIZONTAL layout, h=36, border=#dcdcdc, leading search icon.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onChange, onKeyDown, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(e);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") {
        onSearch?.((e.target as HTMLInputElement).value);
      }
      onKeyDown?.(e);
    }

    return (
      <label className={cn("relative flex items-center", className)}>
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-[#5c5c5c]"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-9 w-full rounded-md border border-[#c9cbd2] bg-white pl-9 pr-3 text-[15px] text-[#333333] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-[#888888]"
          {...props}
        />
      </label>
    );
  },
);

SearchInput.displayName = "SearchInput";
