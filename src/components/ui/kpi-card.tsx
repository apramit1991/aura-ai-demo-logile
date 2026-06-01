import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

type KpiCardProps = {
  value: string | number;
  label: string;
  date?: string;
  trend?: "up" | "down" | null;
  trendValue?: string;
  icon?: React.ElementType;
  className?: string;
};

/**
 * Figma: KPI — 268×119px, HORIZONTAL, pad=16, gap=12, r=12, white bg.
 * Contains: number (23px 500), label (17px 400), date (13px), trend arrow icon.
 */
export function KpiCard({ value, label, date, trend, trendValue, icon: Icon, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[12px] bg-white p-4 shadow-fig-sm",
        className,
      )}
    >
      {Icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3fcf1]">
          <Icon className="h-5 w-5 text-[#2b9a1f]" aria-hidden="true" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-2">
          <span className="text-[23px] font-medium leading-none text-[#333333]">{value}</span>
          {trend ? (
            <span
              className={cn(
                "mb-0.5 flex items-center gap-0.5 text-[13px] font-medium leading-none",
                trend === "up" ? "text-[#2b9a1f]" : "text-[#e22d20]",
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {trendValue}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[15px] leading-5 text-[#5c5c5c]">{label}</p>
        {date ? <p className="mt-0.5 text-[13px] text-[#5c5c5c]">{date}</p> : null}
      </div>
    </div>
  );
}
