import { ExternalLink, Info, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

type DashboardKpiProps = {
  heading: string;
  icon?: React.ElementType;
  value: string | number;
  subCaption?: string;
  trendPct?: string;
  trendUp?: boolean;
  info?: string;
  onDetails?: () => void;
  className?: string;
};

/**
 * Figma: Dashboard KPI — 352×146, VERTICAL, pad=16, gap=8, r=16, white bg.
 * Contains: icon+heading header, divider, data row with trend + icon badge, info footnote.
 */
export function DashboardKpi({
  heading,
  icon: Icon,
  value,
  subCaption,
  trendPct,
  trendUp = true,
  info,
  onDetails,
  className,
}: DashboardKpiProps) {
  return (
    <div
      className={cn(
        "flex w-[352px] flex-col gap-2 rounded-[16px] bg-white p-4 shadow-fig-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-5 w-5 shrink-0 text-[#333333]" aria-hidden="true" /> : null}
          <span className="text-[17px] text-[#333333]">{heading}</span>
        </div>
        {onDetails ? (
          <button
            type="button"
            onClick={onDetails}
            className="flex h-7 items-center gap-1 rounded-md border border-[#c9cbd2] px-2 text-[13px] text-[#525866] transition hover:border-primary/60 hover:text-primary"
          >
            Details
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e5e7eb]" aria-hidden="true" />

      {/* Data row */}
      <div className="flex items-end gap-2">
        <span className="text-[23px] font-medium leading-none text-[#333333]">{value}</span>
        {trendPct ? (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-[13px] font-medium",
              trendUp ? "text-[#2b9a1f]" : "text-[#e22d20]",
            )}
          >
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trendPct}
          </span>
        ) : null}
      </div>
      {subCaption ? <p className="text-[12px] text-[#5c5c5c]">{subCaption}</p> : null}

      {/* Info footnote */}
      {info ? (
        <div className="mt-1 flex items-center gap-1.5 rounded-md bg-[#f8f9fb] px-2 py-1.5">
          <Info className="h-4 w-4 shrink-0 text-[#868c98]" aria-hidden="true" />
          <p className="text-[13px] text-[#5c5c5c]">{info}</p>
        </div>
      ) : null}
    </div>
  );
}
