import { useMemo, useRef, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";

type AuraChatHistoryItem = {
  title: string;
  preview: string;
  date: string;
  keywords?: string[];
};

const auraChatHistoryItems: AuraChatHistoryItem[] = [
  {
    title: "Availability Request",
    preview: "Request sent to manager.",
    date: "Today",
    keywords: ["availability", "request", "manager", "pending", "employee"],
  },
  {
    title: "Skill Gap Ask Aura",
    preview: "Availability requests sent for Sarah Johnson and Emily Carter.",
    date: "3 days ago",
    keywords: ["skill gap", "ask aura", "Sarah", "Emily", "pending approval", "availability"],
  },
  {
    title: "Cross-training Request",
    preview: "Cross-training requests prepared.",
    date: "4 days ago",
    keywords: ["cross training", "cross-training", "Jessica", "Ryan", "prepared", "pending"],
  },
  {
    title: "Availability Approval",
    preview: "Requests approved successfully.",
    date: "1 week ago",
    keywords: ["availability", "approval", "approved", "manager", "processed"],
  },
];

export function AuraChatHistoryView({ onSelectChat }: { onSelectChat: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = searchQuery.trim().replace(/\s+/g, " ").toLowerCase();
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return auraChatHistoryItems;
    }

    return auraChatHistoryItems.filter((item) => {
      const searchableText = [item.title, item.preview, item.date, ...(item.keywords ?? [])]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto bg-white px-4 py-3">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5c5c5c]" />
        <input
          ref={searchInputRef}
          type="search"
          aria-label="Search chats"
          placeholder="Search chats"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && searchQuery) {
              event.preventDefault();
              clearSearch();
            }
          }}
          className="h-9 w-full rounded-md border border-[#c9cbd2] bg-white pl-9 pr-9 text-[15px] leading-5 text-[#333333] shadow-inner outline-none transition placeholder:text-[#888888] focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {searchQuery ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f1f5f9] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
        {filteredItems.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={onSelectChat}
            className="flex w-full items-start gap-3 border-b border-[#eef0f4] px-4 py-3 text-left transition hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9f5ff] text-[#0868db]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold leading-5 text-[#111827]">{item.title}</span>
              <span className="mt-0.5 block truncate text-[13px] leading-5 text-[#64748B]">{item.preview}</span>
            </span>
            <span className="shrink-0 pt-0.5 text-[12px] font-medium leading-5 text-[#64748B]">{item.date}</span>
            {index === filteredItems.length - 1 ? <span className="sr-only">Last chat</span> : null}
          </button>
        ))}
        {filteredItems.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center px-6 py-8 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748B]">
              <Search className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[14px] font-semibold leading-5 text-[#111827]">No chats found</p>
            <p className="mt-1 max-w-[260px] text-[13px] leading-5 text-[#64748B]">
              Try searching by request type, employee name, or status.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
