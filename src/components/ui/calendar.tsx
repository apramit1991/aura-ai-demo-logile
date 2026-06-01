import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Figma: Calendar — inline date-picker with nav header, day-of-week labels, day grid.
 * Size: ~280px wide, white bg, r=12, pad=16.
 */
export function Calendar({ value, onChange, minDate, maxDate, className }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(value ?? today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function selectDay(day: number) {
    const selected = new Date(year, month, day);
    if (minDate && selected < minDate) return;
    if (maxDate && selected > maxDate) return;
    onChange?.(selected);
  }

  function isSelected(day: number) {
    if (!value) return false;
    return (
      value.getFullYear() === year &&
      value.getMonth() === month &&
      value.getDate() === day
    );
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  function isDisabled(day: number) {
    const d = new Date(year, month, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  }

  return (
    <div
      className={cn(
        "inline-block w-[280px] rounded-[12px] bg-white p-4 shadow-fig-md",
        className,
      )}
    >
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[15px] font-semibold text-[#333333]">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day of week labels */}
      <div className="mt-3 grid grid-cols-7 gap-0.5">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-[12px] font-medium text-[#5c5c5c]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="mt-0.5 grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-9" />;
          }
          const selected = isSelected(day);
          const todayCell = isToday(day);
          const disabled = isDisabled(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => selectDay(day)}
              disabled={disabled}
              aria-label={`${day} ${MONTHS[month]} ${year}${selected ? ", selected" : ""}${todayCell ? ", today" : ""}`}
              aria-pressed={selected}
              className={cn(
                "flex h-9 w-full items-center justify-center rounded-md text-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                selected && "bg-primary font-semibold text-white",
                !selected && todayCell && "border border-primary text-primary font-medium",
                !selected && !todayCell && !disabled && "text-[#333333] hover:bg-[#f4f5fa]",
                disabled && "cursor-not-allowed text-[#c9cbd2]",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
