import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { cn } from "../../lib/utils";

export type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type SortDir = "asc" | "desc" | null;

type DataTableProps<T extends Record<string, unknown>> = {
  columns: ColumnDef<T>[];
  rows: T[];
  className?: string;
  emptyMessage?: string;
};

/**
 * Figma: Columns / Header Cells / Header Sort & Search Web / Template (Detach me!)
 * Full composable data table with sort and search in headers.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  className,
  emptyMessage = "No data",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [searchMap, setSearchMap] = useState<Record<string, string>>({});

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const filteredRows = rows.filter((row) =>
    Object.entries(searchMap).every(([key, term]) => {
      if (!term) return true;
      const val = String(row[key] ?? "").toLowerCase();
      return val.includes(term.toLowerCase());
    }),
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className={cn("w-full overflow-auto rounded-md border border-[#dcdcdc] bg-white", className)}>
      <table className="w-full min-w-full border-collapse text-[15px]">
        <thead>
          <tr className="border-b border-[#dcdcdc] bg-[#f8f9fb]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                style={{ width: col.width }}
                className="whitespace-nowrap px-3 py-2.5 text-left text-[13px] font-semibold leading-5 text-[#525866]"
              >
                <div className="flex flex-col gap-1">
                  {/* Header label + sort */}
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(String(col.key))}
                        aria-label={`Sort by ${col.header}`}
                        className="flex h-5 w-5 items-center justify-center rounded text-[#5c5c5c] transition hover:bg-[#e5e7eb] hover:text-[#333333]"
                      >
                        {sortKey === String(col.key) && sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-primary" />
                        ) : sortKey === String(col.key) && sortDir === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : null}
                  </div>
                  {/* Column search */}
                  {col.sortable ? (
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#888888]" aria-hidden="true" />
                      <input
                        type="search"
                        placeholder="Search"
                        aria-label={`Search ${col.header}`}
                        value={searchMap[String(col.key)] ?? ""}
                        onChange={(e) =>
                          setSearchMap((m) => ({ ...m, [String(col.key)]: e.target.value }))
                        }
                        className="h-6 w-full rounded border border-[#dcdcdc] bg-white pl-6 pr-2 text-[12px] text-[#333333] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-[#aaaaaa]"
                      />
                    </div>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-[15px] text-[#5c5c5c]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-[#f0f1f4] last:border-0 hover:bg-[#f8f9fb]"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2.5 text-[15px] leading-5 text-[#333333]"
                  >
                    {col.render ? col.render(row) : String(row[String(col.key)] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
