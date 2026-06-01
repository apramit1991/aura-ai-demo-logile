import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

type OrgSelectorProps = {
  orgs: string[];
  value: string;
  onChange: (org: string) => void;
  className?: string;
};

/**
 * Figma: Org Selector — dropdown-style org picker with org icon + name + chevron.
 */
export function OrgSelector({ orgs, value, onChange, className }: OrgSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 items-center gap-2 rounded-md border border-[#c9cbd2] bg-white px-3 text-[15px] text-[#333333] transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Building2 className="h-4 w-4 shrink-0 text-[#5c5c5c]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-[#5c5c5c] transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Select organization"
          className="absolute left-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded-md border border-[#c9cbd2] bg-white shadow-fig-md"
        >
          {orgs.map((org) => (
            <li key={org} role="option" aria-selected={org === value}>
              <button
                type="button"
                onClick={() => { onChange(org); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-[15px] transition hover:bg-[#f4f5fa]",
                  org === value ? "font-medium text-primary" : "text-[#333333]",
                )}
              >
                <Building2 className="h-4 w-4 shrink-0 text-[#5c5c5c]" aria-hidden="true" />
                {org}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
