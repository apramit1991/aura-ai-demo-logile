import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: "sm" | "lg";
  showGoTo?: boolean;
  className?: string;
};

/**
 * Figma: Pagination_lg — page-change buttons + optional "Go to page" input.
 * Pagination_sm — compact variant with smaller controls.
 */
export function Pagination({ page, totalPages, onChange, size = "lg", showGoTo = true, className }: PaginationProps) {
  const isSmall = size === "sm";
  const btnBase = cn(
    "inline-flex items-center justify-center rounded border border-[#c9cbd2] bg-white font-medium text-[#333333] transition hover:border-primary/60 hover:bg-[#f4f5fa] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    isSmall ? "h-7 w-7 text-[13px]" : "h-9 min-w-9 px-1 text-[15px]",
  );

  const pages = buildPages(page, totalPages);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {/* Prev */}
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={btnBase}
      >
        <ChevronLeft className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className={cn("flex items-center justify-center text-[#5c5c5c]", isSmall ? "h-7 w-7 text-[13px]" : "h-9 w-9 text-[15px]")}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              btnBase,
              p === page && "border-primary bg-primary text-white hover:bg-primary hover:border-primary",
            )}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={btnBase}
      >
        <ChevronRight className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>

      {/* Go to page */}
      {showGoTo && !isSmall ? (
        <form
          className="ml-2 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const val = parseInt((e.currentTarget.elements.namedItem("gotopage") as HTMLInputElement).value);
            if (!isNaN(val) && val >= 1 && val <= totalPages) onChange(val);
          }}
        >
          <span className="text-[13px] text-[#5c5c5c]">Go to</span>
          <input
            name="gotopage"
            type="number"
            min={1}
            max={totalPages}
            defaultValue={page}
            aria-label="Go to page"
            className="h-9 w-16 rounded border border-[#c9cbd2] bg-white px-2 text-center text-[15px] text-[#333333] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button type="submit" className="h-9 rounded border border-[#c9cbd2] bg-white px-3 text-[13px] text-[#333333] transition hover:border-primary/60 hover:bg-[#f4f5fa]">
            Go
          </button>
        </form>
      ) : null}
    </div>
  );
}

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
