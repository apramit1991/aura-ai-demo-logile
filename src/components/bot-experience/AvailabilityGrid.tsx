import { CalendarDays, Clock3, Trash2 } from "lucide-react";
import { availabilityDays } from "../../data/mockData";
import { Input } from "../ui/input";
import { AvailabilityRow } from "../../types/availability";

type AvailabilityGridProps = {
  isLoading: boolean;
  rows: AvailabilityRow[];
  onDeleteRow: (day: string) => void;
};

function LoadingRow({ index }: { index: number }) {
  return (
    <div
      className="grid min-h-[63px] animate-pulse items-center gap-4 rounded-[10px] bg-white px-4 sm:grid-cols-[260px_186px_186px_80px]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="h-5 w-32 rounded bg-[#e7eaf1]" />
      <span className="h-9 rounded-md bg-[#e7eaf1]" />
      <span className="h-9 rounded-md bg-[#e7eaf1]" />
      <span className="h-5 w-12 rounded bg-[#e7eaf1]" />
    </div>
  );
}

export function AvailabilityGrid({ isLoading, rows, onDeleteRow }: AvailabilityGridProps) {
  return (
    <section className="mt-4">
      <div className="grid gap-4">
        {isLoading
          ? availabilityDays.map((day, index) => <LoadingRow key={day.day} index={index} />)
          : rows.map((item) => {
              const isPopulated = item.hours !== "0h";

              return (
                <div
                  key={item.day}
                  className={`grid min-h-[63px] items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
                    item.auraFilled
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-transparent bg-white"
                  } hover:shadow-sm sm:grid-cols-[220px_minmax(130px,170px)_minmax(130px,170px)_60px_40px] lg:grid-cols-[220px_170px_170px_60px_40px]`}
                >
                  <div className="flex items-center gap-4 text-[17px] font-normal">
                    <CalendarDays className="h-5 w-5 text-[#5c5c5c]" />
                    {item.day}
                  </div>
                  <Input
                    aria-label={`${item.day} start time`}
                    className={`h-9 text-center text-[#888888] ${item.auraFilled ? "border-yellow-200 bg-yellow-50" : ""}`}
                    value={item.start}
                    readOnly
                  />
                  <Input
                    aria-label={`${item.day} end time`}
                    className={`h-9 text-center text-[#888888] ${item.auraFilled ? "border-yellow-200 bg-yellow-50" : ""}`}
                    value={item.end}
                    readOnly
                  />
                  <span className="flex items-center gap-1 text-[17px] text-[#333333]">
                    <Clock3 className="h-4 w-4 text-[#b8bcc5]" />
                    {item.hours}
                  </span>
                  {isPopulated ? (
                    <button
                      type="button"
                      onClick={() => onDeleteRow(item.day)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Clear ${item.day} availability`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            })}
      </div>
    </section>
  );
}
