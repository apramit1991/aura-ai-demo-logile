import { CalendarDays, Clock3, Copy, RotateCcw } from "lucide-react";
import { availabilityDays } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { AvailabilityRow } from "../../types/availability";
import type { AvailabilityValidationState } from "../../App";

type AvailabilityGridProps = {
  isLoading: boolean;
  rows: AvailabilityRow[];
  onDeleteRow: (day: string) => void;
  validationState: AvailabilityValidationState;
  isTouchMode?: boolean;
};

function LoadingRow({ index, isTouchMode = false }: { index: number; isTouchMode?: boolean }) {
  return (
    <div
      className={cn(
        "grid min-h-[63px] max-w-full animate-pulse items-center rounded-[10px] bg-white px-3",
        isTouchMode
          ? "gap-2 sm:grid-cols-[minmax(126px,148px)_minmax(178px,1fr)_64px_36px_36px]"
          : "gap-3 sm:grid-cols-[minmax(160px,220px)_minmax(220px,320px)_80px_40px_40px]",
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="h-5 w-32 rounded bg-[#e7eaf1]" />
      <span className="h-9 rounded-md bg-[#e7eaf1]" />
      <span className="h-5 w-12 rounded bg-[#e7eaf1]" />
      <span className="h-8 w-8 rounded bg-[#e7eaf1]" />
      <span className="h-8 w-8 rounded bg-[#e7eaf1]" />
    </div>
  );
}

export function AvailabilityGrid({ isLoading, rows, onDeleteRow, validationState, isTouchMode = false }: AvailabilityGridProps) {
  return (
    <section className="mt-4">
      <div className="grid gap-4">
        {isLoading
          ? availabilityDays.map((day, index) => <LoadingRow key={day.day} index={index} isTouchMode={isTouchMode} />)
          : rows.map((item) => {
              const isPopulated = item.hours !== "0h";
              const aiInputTextColor = item.auraFilled
                ? validationState === "warning"
                  ? "text-[#D97706]"
                  : "text-[#0B65D8]"
                : "text-[#888888]";

              return (
                <div
                  key={item.day}
                  className={cn(
                    "grid min-h-[63px] items-center rounded-[10px] border py-3 transition",
                    item.auraFilled ? "border-[#BBF7D0] bg-[#ECFDF3]" : "border-transparent bg-white",
                    isTouchMode
                      ? "gap-2 px-3 sm:grid-cols-[minmax(126px,148px)_minmax(178px,1fr)_64px_36px_36px]"
                      : "gap-3 px-4 hover:shadow-sm sm:grid-cols-[minmax(160px,220px)_minmax(220px,320px)_80px_40px_40px]",
                  )}
                >
                  <div className="flex items-center gap-3 text-[17px] font-normal">
                    <CalendarDays className="h-5 w-5 text-[#5c5c5c]" />
                    {item.day}
                  </div>
                  <Input
                    aria-label={`${item.day} time range`}
                    className={`h-9 text-center ${aiInputTextColor} ${item.auraFilled ? "border-[#BBF7D0] bg-[#ECFDF3]" : ""}`}
                    value={`${item.start} - ${item.end}`}
                    readOnly
                  />
                  <span className="flex items-center gap-1 text-[17px] text-[#333333]">
                    <Clock3 className="h-4 w-4 text-[#b8bcc5]" />
                    {item.hours}
                  </span>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition",
                      !isTouchMode && "hover:bg-slate-100 hover:text-[#0B65D8]",
                    )}
                    aria-label={`Copy time range for ${item.day}`}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={isPopulated ? () => onDeleteRow(item.day) : undefined}
                    disabled={!isPopulated}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition disabled:cursor-not-allowed disabled:text-slate-300",
                      !isTouchMode && "hover:bg-slate-100 hover:text-[#0B65D8] disabled:hover:bg-transparent disabled:hover:text-slate-300",
                    )}
                    aria-label={`Reset row for ${item.day}`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
      </div>
    </section>
  );
}
