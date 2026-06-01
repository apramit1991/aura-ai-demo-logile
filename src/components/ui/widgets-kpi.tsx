import { cn } from "../../lib/utils";

type WidgetItem = { label: string; value: string | number; sublabel?: string };

type WidgetsKpiProps = {
  heading: string;
  icon?: React.ElementType;
  items: WidgetItem[];
  className?: string;
};

/**
 * Figma: Widgets KPI — 255×150, VERTICAL, pad=12 16, gap=4, r=16, white.
 * Contains: icon+heading, list of currency/data rows.
 */
export function WidgetsKpi({ heading, icon: Icon, items, className }: WidgetsKpiProps) {
  return (
    <div
      className={cn(
        "flex w-[255px] flex-col gap-1 rounded-[16px] bg-white px-4 py-3 shadow-fig-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 py-1">
        {Icon ? <Icon className="h-5 w-5 shrink-0 text-[#525866]" aria-hidden="true" /> : null}
        <span className="text-[15px] font-medium text-[#333333]">{heading}</span>
      </div>

      {/* Data rows */}
      <div className="mt-1 flex flex-col gap-1.5 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-[12px]">
            <span className="text-[13px] text-[#5c5c5c]">{item.label}</span>
            <div className="flex flex-col items-end">
              <span className="text-[15px] font-medium text-[#333333]">{item.value}</span>
              {item.sublabel ? (
                <span className="text-[12px] text-[#5c5c5c]">{item.sublabel}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
