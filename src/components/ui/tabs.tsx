import { cn } from "../../lib/utils";

type Tab = {
  id: string;
  label: string;
  badge?: number;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex items-end">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative h-10 rounded-t-md border px-3 text-left text-[19px] transition-colors",
              active
                ? "z-10 border-[#d0d3da] border-b-white bg-white font-medium text-primary"
                : "-ml-px border-transparent bg-transparent font-normal text-[#5c5c5c] hover:bg-white/70",
            )}
          >
            {tab.label}
            {tab.badge ? (
              <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] px-1 text-[11px] leading-none text-white">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
