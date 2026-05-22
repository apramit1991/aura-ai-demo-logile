import { CalendarDays, Clock3 } from "lucide-react";
import { availabilityDays } from "../../data/mockData";
import { Input } from "../ui/input";
import { RecommendationData } from "../../App";

type AvailabilityGridProps = {
  isLoading: boolean;
  appliedRecommendation?: RecommendationData | null;
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

export function AvailabilityGrid({ isLoading, appliedRecommendation }: AvailabilityGridProps) {
  // Create a map of recommended times by day for quick lookup
  const recommendedByDay = appliedRecommendation
    ? Object.fromEntries(
        appliedRecommendation.map((rec) => [
          rec.day,
          { time: rec.time, hours: rec.hours },
        ])
      )
    : {};

  // Parse time string (e.g., "9:00a - 8:00p") to extract start and end
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(" - ");
    return {
      start: parts[0]?.trim() || "00:00a",
      end: parts[1]?.trim() || "00:00a",
    };
  };

  return (
    <section className="mt-7">
      <h2 className="mb-8 text-[21px] font-semibold">My Availability</h2>
      <div className="grid gap-4">
        {isLoading
          ? availabilityDays.map((day, index) => <LoadingRow key={day.day} index={index} />)
          : availabilityDays.map((item) => {
              const recommended = recommendedByDay[item.day];
              const times = recommended ? parseTime(recommended.time) : null;

              return (
                <div
                  key={item.day}
                  className={`grid min-h-[63px] items-center gap-3 rounded-[10px] px-4 py-3 transition ${
                    recommended ? "bg-[#fffacd]" : "bg-white"
                  } hover:shadow-sm sm:grid-cols-[260px_minmax(150px,186px)_minmax(150px,186px)_80px] lg:grid-cols-[260px_186px_186px_80px]`}
                >
                  <div className="flex items-center gap-4 text-[17px] font-semibold">
                    <CalendarDays className="h-5 w-5 text-[#5c5c5c]" />
                    {item.day}
                  </div>
                  <Input
                    aria-label={`${item.day} start time`}
                    className="h-9 text-center text-[#888888]"
                    defaultValue={times?.start || item.start}
                  />
                  <Input
                    aria-label={`${item.day} end time`}
                    className="h-9 text-center text-[#888888]"
                    defaultValue={times?.end || item.end}
                  />
                  <span className="flex items-center gap-1 text-[17px] text-[#333333]">
                    <Clock3 className="h-4 w-4 text-[#b8bcc5]" />
                    {recommended?.hours || item.hours}
                  </span>
                </div>
              );
            })}
      </div>
    </section>
  );
}
