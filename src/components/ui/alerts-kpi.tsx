import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

type AlertsKpiProps = {
  heading: string;
  value: string | number;
  trendPct: string;
  trendUp?: boolean;
  description?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  kpiText?: string;
  className?: string;
};

/**
 * Figma: Alerts & info KPI — 220×148, VERTICAL, r=16, white, pad=16, gap=4.
 * Contains heading, icon circle (green bg), KPI number, percentage hike, KPI text.
 */
export function AlertsKpi({
  heading,
  value,
  trendPct,
  trendUp = true,
  description,
  icon: Icon,
  iconBg = "#f3fcf1",
  iconColor = "#2b9a1f",
  kpiText,
  className,
}: AlertsKpiProps) {
  return (
    <div
      className={cn(
        "flex w-[220px] flex-col gap-1 rounded-[16px] bg-white p-4 shadow-fig-sm",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#5c5c5c]">{heading}</span>
        </div>
        {Icon ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} aria-hidden="true" />
          </div>
        ) : null}
      </div>

      {/* KPI number + trend */}
      <div className="flex items-end gap-2 mt-1">
        <span className="text-[23px] font-medium leading-none text-[#333333]">{value}</span>
        <span
          className={cn(
            "mb-0.5 flex items-center gap-0.5 text-[13px] font-medium leading-none",
            trendUp ? "text-[#2b9a1f]" : "text-[#e22d20]",
          )}
        >
          {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {trendPct}
        </span>
      </div>

      {/* KPI text rows */}
      {kpiText ? <p className="text-[15px] text-[#5c5c5c]">{kpiText}</p> : null}
      {description ? <p className="text-[15px] text-[#5c5c5c]">{description}</p> : null}
    </div>
  );
}
