import { request } from "../../data/mockData";
import type { ReactNode } from "react";

function ValuePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-w-8 items-center justify-center rounded bg-[#dcecff] px-2 py-0.5 text-[15px] font-medium text-primary">
      {children}
    </span>
  );
}

export function SummaryCards() {
  return (
    <div className="grid gap-4 xl:grid-cols-[380px_minmax(420px,1fr)_456px]">
      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <h3 className="mb-4 text-[21px] font-semibold">My Preferences</h3>
        <div className="grid max-w-52 gap-3 text-[15px] text-[#5c5c5c]">
          {request.preferences.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <span>{item.label} :</span>
              <ValuePill>{item.value}</ValuePill>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <h3 className="mb-6 text-[21px] font-semibold">Work Group Rules</h3>
        <div className="grid max-w-[380px] grid-cols-1 gap-x-8 gap-y-3 text-[15px] text-[#5c5c5c] sm:grid-cols-2">
          {request.rules.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <span>{item.label}:</span>
              <ValuePill>{item.value}</ValuePill>
            </div>
          ))}
        </div>
        <div className="mt-4 flex max-w-[348px] items-center justify-between border-t border-[#e0e2e7] pt-3 text-[15px] text-[#5c5c5c]">
          <span>Weekly Range:</span>
          <span>
            <ValuePill>{request.weeklyRange}</ValuePill>
            <span className="ml-1 text-xs">hrs</span>
          </span>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-3 md:p-4">
        <h3 className="mb-4 text-[21px] font-semibold">My Availability</h3>
        <div className="grid gap-3 text-[15px] text-[#5c5c5c]">
          <div>
            <p>Total Hours</p>
            <p className="text-[21px] font-semibold text-[#333333]">0h</p>
          </div>
          <div className="border-t border-[#e0e2e7] pt-3">
            <p>Total Days</p>
            <p className="text-[21px] font-semibold text-[#333333]">0 Days</p>
          </div>
        </div>
      </section>
    </div>
  );
}
