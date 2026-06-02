import { cn } from "../../lib/utils";

type Tab = {
  id: string;
  label: string;
  badge?: number;
  icon?: React.ElementType;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
  /** Figma Tab Lv1 (default) = browser-style curved tabs. Lv2 = underline style. */
  level?: 1 | 2;
  className?: string;
  hideActiveBottomBorder?: boolean;
};

/** Figma: Tab Lv1 — 40h, active white bg with curved corner notches, border, 17px text.
 *  Figma: Tab Lv2 — underline indicator, lighter weight, 15px text.
 */
export function Tabs({ tabs, activeTab, onChange, level = 1, className, hideActiveBottomBorder = false }: TabsProps) {
  if (level === 2) {
    return (
      <div className={cn("flex items-center gap-1 border-b border-[#dcdcdc]", className)}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex h-9 items-center gap-1.5 px-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                active
                  ? "font-medium text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "font-normal text-[#5c5c5c] hover:text-[#333333]",
              )}
            >
              {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              {tab.label}
              {tab.badge ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] px-1 text-[11px] leading-none text-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  // Level 1 — browser-style curved tabs (Figma Tab Lv1)
  return (
    <div className={cn("flex items-end", className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative h-10 rounded-t-md border px-3 text-left text-[17px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              active
                ? cn("z-10 border-[#d0d3da] bg-white font-medium text-primary", hideActiveBottomBorder ? "border-b-transparent" : "border-b-white")
                : "-ml-px border-transparent bg-transparent font-normal text-[#5c5c5c] hover:bg-white/70",
            )}
          >
            <span className="flex items-center gap-1.5">
              {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              {tab.label}
              {tab.badge ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] px-1 text-[11px] leading-none text-white">
                  {tab.badge}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
