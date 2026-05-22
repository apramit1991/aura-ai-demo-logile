import { request } from "../../data/mockData";
import type { ReactNode } from "react";
import { ThumbsUp } from "lucide-react";

function ValuePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-w-8 items-center justify-center rounded-[5px] px-2 py-0.5 text-[15px] font-medium leading-none">
      {children}
    </span>
  );
}

type SummaryCardsProps = {
  totalHours: number;
  totalDays: number;
};

export function SummaryCards({ totalHours, totalDays }: SummaryCardsProps) {
  const isValidAvailability = totalHours > 0 && totalDays > 0;

  return (
    <div className="grid gap-4 xl:grid-cols-[380px_minmax(420px,1fr)_456px]">
      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <h3 className="mb-4 text-[21px] font-normal">My Preferences</h3>
        <div className="grid max-w-52 gap-3 text-[15px] text-[#5c5c5c]">
          {request.preferences.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <span>{item.label} :</span>
              <ValuePill>
                <span className={item.label.toLowerCase().includes("hours") ? "text-[#6E3FF3]" : "text-[#C624D5]"}>
                  {item.label.toLowerCase().includes("hours") ? "30" : item.value}
                </span>
              </ValuePill>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <h3 className="mb-6 text-[21px] font-normal">Work Group Rules</h3>
        <div className="grid max-w-[380px] grid-cols-1 gap-x-8 gap-y-3 text-[15px] text-[#5c5c5c] sm:grid-cols-2">
          {request.rules.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <span>{item.label}:</span>
              <ValuePill>
                <span className={item.label.toLowerCase().includes("days") ? "text-[#C624D5]" : "text-[#6E3FF3]"}>
                  {item.value}
                </span>
              </ValuePill>
            </div>
          ))}
        </div>
        <div className="mt-4 flex max-w-[348px] items-center justify-between border-t border-[#e0e2e7] pt-3 text-[15px] text-[#5c5c5c]">
          <span>Weekly Range:</span>
          <ValuePill>
            <span className="text-[#6E3FF3]">4-30 hrs</span>
          </ValuePill>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[21px] font-normal">My Availability</h3>
          {isValidAvailability ? (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b8e4c8] bg-[#ecfdf3] text-[#1f8f55]">
              <ThumbsUp className="h-4 w-4" />
            </span>
          ) : null}
        </div>
        <div className="grid gap-3 text-[15px] text-[#5c5c5c]">
          <div>
            <p>Total Hours</p>
            <p className="text-[21px] font-semibold text-[#333333]">{totalHours}h</p>
          </div>
          <div className="border-t border-[#e0e2e7] pt-3">
            <p>Total Days</p>
            <p className="text-[21px] font-semibold text-[#333333]">{totalDays} Days</p>
          </div>
        </div>
      </section>
    </div>
  );
}
