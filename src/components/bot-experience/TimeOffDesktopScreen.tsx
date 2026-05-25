import { Calendar, CheckCircle2, ChevronDown, ChevronLeft, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "./AppShell";
import { cn } from "../../lib/utils";

type CalendarDay = {
  label: string;
  tone?: "green" | "amber" | "red";
};

const calendarWeeks: CalendarDay[][] = [
  [
    { label: "8 Jan", tone: "green" },
    { label: "9", tone: "green" },
    { label: "10", tone: "green" },
    { label: "11", tone: "red" },
    { label: "12", tone: "amber" },
    { label: "13", tone: "green" },
    { label: "14", tone: "red" },
  ],
  [
    { label: "15", tone: "green" },
    { label: "16", tone: "green" },
    { label: "17", tone: "green" },
    { label: "18", tone: "green" },
    { label: "19", tone: "green" },
    { label: "20", tone: "green" },
    { label: "21", tone: "green" },
  ],
  [
    { label: "22", tone: "green" },
    { label: "23", tone: "green" },
    { label: "24", tone: "green" },
    { label: "25", tone: "amber" },
    { label: "26", tone: "amber" },
    { label: "27", tone: "amber" },
    { label: "28", tone: "amber" },
  ],
  [
    { label: "29", tone: "amber" },
    { label: "30", tone: "amber" },
    { label: "31", tone: "amber" },
    { label: "1 Feb", tone: "amber" },
    { label: "2", tone: "amber" },
    { label: "3", tone: "amber" },
    { label: "4", tone: "amber" },
  ],
  [
    { label: "5" },
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "10" },
    { label: "11" },
  ],
];

function TextInputLike({ label, value, icon = false }: { label: string; value: string; icon?: boolean }) {
  return (
    <label className="block">
      <span className="text-[15px] leading-5 text-[#5c5c5c]">{label}</span>
      <span className="mt-1 flex h-9 items-center justify-between rounded-md border border-[#c9cbd2] bg-white px-2 text-[17px] leading-[22px] text-[#333333]">
        {value}
        {icon ? <Calendar className="h-[18px] w-[18px] text-[#5c5c5c]" /> : null}
      </span>
    </label>
  );
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-[15px] leading-5 text-[#5c5c5c]">{label}</span>
      <span className="mt-1 flex h-9 items-center justify-between rounded-md border border-[#c9cbd2] bg-white px-2 text-[17px] leading-[22px] text-[#333333]">
        {value}
        <ChevronDown className="h-4 w-4 text-[#5c5c5c]" />
      </span>
    </label>
  );
}

function SummaryCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 max-w-full rounded-[14px] bg-white p-2.5 2xl:p-3", className)}>
      <h3 className="whitespace-normal text-[21px] font-normal leading-[30px] text-[#333333]">{title}</h3>
      {children}
    </section>
  );
}

function ImpactSwatch({ color }: { color: string }) {
  return <span className={cn("h-4 w-4 rounded border", color)} />;
}

export function TimeOffDesktopScreen() {
  const navigate = useNavigate();

  return (
    <AppShell activeNavLabel="Labor Model">
      <div className="min-w-0 bg-[#f1f3f9] pr-3 2xl:pr-5">
        <div className="flex h-[96px] flex-col justify-end">
          <div className="flex h-[54px] items-center gap-3 px-4">
            <button type="button" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d4d7de] bg-white text-[#333333]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-[25px] font-semibold leading-[34px] text-[#333333]">LTSP: Create Request</h1>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#777] text-[13px] font-semibold text-[#5c5c5c]">?</span>
          </div>
          <div className="px-4">
            <div className="flex h-10 items-end">
              <button
                type="button"
                onClick={() => navigate("/availability-desktop")}
                className="h-10 rounded-t-md px-3 text-[17px] font-normal leading-[22px] text-[#5c5c5c]"
              >
                Availability
              </button>
              <button type="button" className="h-10 rounded-t-md border border-[#d4d7de] border-b-white bg-white px-4 text-[17px] font-medium leading-[22px] text-primary">
                Time Off
              </button>
            </div>
          </div>
        </div>

        <section className="min-w-0 overflow-hidden rounded-t-md border border-[#d6d9df] bg-white">
          <div className="flex h-16 items-center justify-between border-b border-[#dfe1e6] px-5">
            <h2 className="text-[17px] font-semibold leading-[22px] text-primary">Create Timeoff Request</h2>
            <button type="button" disabled className="h-10 rounded-md bg-[#e5e5e5] px-6 text-[17px] leading-[22px] text-[#8a8a8a]">
              Submit
            </button>
          </div>

          <div className="grid min-w-0 grid-cols-[clamp(300px,24vw,380px)_minmax(0,1fr)]">
            <aside className="min-w-0 border-r border-[#d0d3da] bg-white px-3 py-3 2xl:px-4">
              <div className="grid min-h-full content-start gap-4 rounded-[14px] bg-[#f1f3f9] p-3">
                <div className="rounded-[14px] bg-[#e9ecf4] p-3">
                  <p className="text-[15px] leading-5 text-[#5c5c5c]">Employee Name</p>
                  <p className="text-[17px] leading-[22px] text-[#333333]">Jenning Dwight</p>
                  <p className="mt-4 text-[15px] leading-5 text-[#5c5c5c]">Org/ Position</p>
                  <p className="text-[17px] leading-[22px] text-[#333333]">(149) Front End Dept/Employee</p>
                </div>

                <div className="rounded-[14px] bg-[#e9ecf4] p-3">
                  <TextInputLike label="Start-End Date" value="1/8/25 -" icon />
                  <div className="mt-3">
                    <SelectLike label="Pay Type" value="Vacation(Hours)" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[15px] leading-5 text-[#5c5c5c]">All Day</span>
                    <span className="flex h-[28px] w-[62px] items-center rounded-full bg-[#d8d8d8] p-1">
                      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                      <span className="ml-1 text-[13px] font-medium text-white">OFF</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <SelectLike label="Select Your Reason" value="Personal Reason" />
                  </div>
                  <label className="mt-3 block">
                    <span className="text-[15px] leading-5 text-[#5c5c5c]">Comment</span>
                    <textarea
                      value="Name"
                      readOnly
                      className="mt-1 h-[110px] w-full resize-none rounded-md border border-[#c9cbd2] bg-white p-2 text-[17px] leading-[22px] text-[#8a8a8a] outline-none"
                    />
                  </label>
                </div>
              </div>
            </aside>

            <main className="min-w-0 max-w-full overflow-hidden bg-[#f1f3f9] py-3 pl-3 pr-1 2xl:py-4 2xl:pl-[14px] 2xl:pr-[5px]">
              <div className="grid w-full min-w-0 grid-cols-[minmax(0,233fr)_minmax(0,501fr)_minmax(0,233fr)_minmax(0,392fr)] gap-3 2xl:gap-4">
                <SummaryCard title="My Preferences">
                  <div className="mt-3 space-y-2 2xl:mt-4 2xl:space-y-3">
                    <TextInputLike label="Hours per week" value="30h" />
                    <TextInputLike label="Days Per Week" value="5d" />
                  </div>
                </SummaryCard>

                <SummaryCard title="Work Group Rules">
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-2 2xl:mt-4 2xl:gap-3">
                    <div className="min-w-0 space-y-2 text-[15px] leading-5 text-[#333333] 2xl:space-y-3 2xl:text-[17px] 2xl:leading-[22px]">
                      <p className="flex justify-between"><span>Min hours/day:</span><span>4</span></p>
                      <p className="flex justify-between"><span>Max hours/day:</span><span>10</span></p>
                      <p className="flex justify-between"><span>Weekly Range:</span><span>20-40</span></p>
                    </div>
                    <div className="bg-[#d0d3da]" />
                    <div className="min-w-0 space-y-2 text-[15px] leading-5 text-[#333333] 2xl:space-y-3 2xl:text-[17px] 2xl:leading-[22px]">
                      <p className="flex justify-between"><span>Min days/week:</span><span>1</span></p>
                      <p className="flex justify-between"><span>Max days/week:</span><span>5</span></p>
                    </div>
                  </div>
                </SummaryCard>

                <SummaryCard title="My Time off">
                  <p className="mt-4 text-[22px] font-semibold leading-8 text-[#333333] 2xl:mt-6 2xl:text-[25px] 2xl:leading-[34px]">0Days</p>
                </SummaryCard>

                <SummaryCard title="My Requests">
                  <div className="mt-4 space-y-2 2xl:mt-5 2xl:space-y-3">
                    <div className="flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border border-[#dfe1e6] bg-[#f8f9fb] px-2 2xl:h-11 2xl:px-4">
                      <span className="min-w-0 truncate text-[14px] font-semibold leading-5 text-[#111827] 2xl:text-[15px]">Jan 01 - Jan 04, 2026</span>
                      <span className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-[#cdf7d9] px-2 text-[13px] leading-5 text-[#00843d] 2xl:px-3 2xl:text-[15px]">
                        <CheckCircle2 className="h-4 w-4" />
                        Approved
                      </span>
                    </div>
                    <div className="flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border border-[#dfe1e6] bg-[#f8f9fb] px-2 2xl:h-11 2xl:px-4">
                      <span className="min-w-0 truncate text-[14px] font-semibold leading-5 text-[#111827] 2xl:text-[15px]">May 19 - May 19, 2026</span>
                      <span className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-[#ffefb8] px-2 text-[13px] leading-5 text-[#9a6200] 2xl:px-3 2xl:text-[15px]">
                        <Clock3 className="h-4 w-4" />
                        Pending
                      </span>
                    </div>
                  </div>
                </SummaryCard>
              </div>

              <section className="mt-5 min-w-0">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-[21px] font-normal leading-[30px] text-[#333333]">Create Time Off</h3>
                    <div className="mt-5 flex items-center gap-2 text-[13px] leading-[18px] text-[#667085]">
                      <span>Approved Request Impact:</span>
                      <ImpactSwatch color="border-green-200 bg-green-100" />
                      <ImpactSwatch color="border-yellow-300 bg-yellow-300" />
                      <ImpactSwatch color="border-orange-300 bg-orange-400" />
                      <ImpactSwatch color="border-red-300 bg-red-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 max-w-full overflow-hidden rounded-lg border border-[#d6d9df] bg-white">
                  <div className="grid grid-cols-7 border-b border-[#d6d9df] bg-[#f5f6fb]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="flex h-7 items-center justify-center border-r border-[#d6d9df] text-[15px] font-semibold leading-5 text-[#333333] last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>
                  {calendarWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 border-b border-[#d6d9df] last:border-b-0">
                      {week.map((day, dayIndex) => (
                        <div key={`${weekIndex}-${day.label}`} className="min-h-[82px] border-r border-[#d6d9df] bg-white last:border-r-0 2xl:min-h-[101px]">
                          <div className="px-2 pt-2 text-[15px] font-semibold leading-5 text-[#333333]">{day.label}</div>
                          <div
                            className={cn(
                              "mt-7 h-6 2xl:mt-[45px] 2xl:h-7",
                              day.tone === "green" && "bg-green-50",
                              day.tone === "amber" && "bg-orange-50",
                              day.tone === "red" && "bg-red-100",
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
