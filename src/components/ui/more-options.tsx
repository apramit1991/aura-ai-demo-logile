import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

type MoreOption = { label: string; onClick: () => void; danger?: boolean };

type MoreOptionsProps = {
  options: MoreOption[];
  onManageColumns?: () => void;
  className?: string;
  "aria-label"?: string;
};

/**
 * Figma: More Options 3.0 — kebab/3-dot button + popover menu with optional manage columns.
 */
export function MoreOptions({ options, onManageColumns, className, "aria-label": ariaLabel }: MoreOptionsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel ?? "More options"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#c9cbd2] bg-white text-[#5c5c5c] transition hover:border-primary/50 hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-[#c9cbd2] bg-white shadow-fig-md"
        >
          {options.map((option) => (
            <button
              key={option.label}
              role="menuitem"
              type="button"
              onClick={() => { option.onClick(); setOpen(false); }}
              className={cn(
                "flex w-full items-center px-3 py-2.5 text-left text-[15px] transition hover:bg-[#f4f5fa]",
                option.danger ? "text-[#e22d20] hover:bg-[#fef2f2]" : "text-[#333333]",
              )}
            >
              {option.label}
            </button>
          ))}
          {onManageColumns ? (
            <>
              <div className="my-1 h-px bg-[#e5e7eb]" aria-hidden="true" />
              <button
                role="menuitem"
                type="button"
                onClick={() => { onManageColumns(); setOpen(false); }}
                className="flex w-full items-center px-3 py-2.5 text-left text-[15px] text-[#333333] transition hover:bg-[#f4f5fa]"
              >
                Manage Columns
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
