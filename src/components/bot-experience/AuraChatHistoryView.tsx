import { Sparkles } from "lucide-react";

type AuraChatHistoryItem = {
  title: string;
  preview: string;
  date: string;
};

const auraChatHistoryItems: AuraChatHistoryItem[] = [
  {
    title: "Availability Request",
    preview: "Request sent to manager.",
    date: "Today",
  },
  {
    title: "Skill Gap Ask Aura",
    preview: "Availability requests sent for Sarah Johnson and Emily Carter.",
    date: "3 days ago",
  },
  {
    title: "Cross-training Request",
    preview: "Cross-training requests prepared.",
    date: "4 days ago",
  },
  {
    title: "Availability Approval",
    preview: "Requests approved successfully.",
    date: "1 week ago",
  },
];

export function AuraChatHistoryView({ onSelectChat }: { onSelectChat: () => void }) {
  return (
    <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] px-4 py-3">
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
        {auraChatHistoryItems.map((item, index) => (
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
            {index === auraChatHistoryItems.length - 1 ? <span className="sr-only">Last chat</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
