import { request } from "../../data/mockData";
import type { ReactNode } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { AvailabilityValidationState } from "../../App";
import { cn } from "../../lib/utils";

function ValuePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-w-8 items-center justify-center rounded-[5px] px-2 py-0.5 text-[20px] font-bold leading-[1.2] text-[#1D4ED8]">
      {children}
    </span>
  );
}

type SummaryCardsProps = {
  totalHours: number;
  totalDays: number;
  validationState: AvailabilityValidationState;
  isTouchMode?: boolean;
};

function WarningIcon() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
      <ThumbsDown className="h-4 w-4" />
    </span>
  );
}

function SuccessIcon() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#b8e4c8] bg-[#ecfdf3] text-[#1f8f55]">
      <ThumbsUp className="h-4 w-4" />
    </span>
  );
}

export function SummaryCards({ totalHours, totalDays, validationState, isTouchMode = false }: SummaryCardsProps) {
  const isValidAvailability = totalHours > 0 && totalDays > 0;
  const isWarningAvailability = validationState === "warning" && isValidAvailability;
  const isSuccessAvailability = isValidAvailability && !isWarningAvailability;

  return (
    <div
      className={cn(
        "grid max-w-full gap-3 2xl:gap-4",
        isTouchMode
          ? "grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,0.9fr)]"
          : "grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,0.9fr)]",
      )}
    >
      <section className="min-w-0 rounded-[14px] bg-white p-3 2xl:p-4">
        <h3 className="mb-4 text-[20px] font-semibold font-normal">My Preferences</h3>
        <div className="grid max-w-full gap-3 text-[15px] text-[#5c5c5c]">
          {request.preferences.map((item) => (
            <div key={item.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span>{item.label} :</span>
              <ValuePill>
                <span>{item.label.toLowerCase().includes("hours") ? "30" : item.value}</span>
              </ValuePill>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 rounded-[14px] bg-white p-3 2xl:p-4">
        <h3 className="mb-6 text-[20px] font-semibold font-normal">Work Group Rules</h3>
        <div className="grid max-w-full grid-cols-1 gap-x-4 gap-y-3 text-[15px] text-[#5c5c5c] sm:grid-cols-2">
          {request.rules.map((item) => (
            <div key={item.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span>{item.label}:</span>
              <ValuePill>
                <span>{item.value}</span>
              </ValuePill>
            </div>
          ))}
        </div>
        <div className="mt-4 flex max-w-full items-center justify-between gap-3 border-t border-[#e0e2e7] pt-3 text-[15px] text-[#5c5c5c]">
          <span>Weekly Range:</span>
          <ValuePill>
            <span>4-30 hrs</span>
          </ValuePill>
        </div>
      </section>

      <section className="min-w-0 rounded-[14px] bg-white p-3 2xl:p-4">
        <div className="mb-4">
          <h3 className="text-[20px] font-semibold font-normal">My Availability</h3>
        </div>
        <div className="grid gap-3 text-[15px] text-[#5c5c5c]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p>Total Hours</p>
              <p className="text-[21px] font-semibold text-[#333333]">{totalHours}h</p>
            </div>
            {isWarningAvailability ? <WarningIcon /> : null}
            {isSuccessAvailability ? <SuccessIcon /> : null}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#e0e2e7] pt-3">
            <div>
              <p>Total Days</p>
              <p className="text-[21px] font-semibold text-[#333333]">{totalDays} Days</p>
            </div>
            {isWarningAvailability ? <WarningIcon /> : null}
            {isSuccessAvailability ? <SuccessIcon /> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
