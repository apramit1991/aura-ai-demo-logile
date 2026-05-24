import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HelpCircle,
  Info,
  Calendar as CalendarIcon,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "./AppShell";
import { cn } from "../../lib/utils";
import profileAvatar from "../../assets/skill-gap/profile.png";
import sarahAvatar from "../../assets/skill-gap/sarah-johnson.png";
import emilyAvatar from "../../assets/skill-gap/emily-carter.png";
import michaelAvatar from "../../assets/skill-gap/michael-chen.png";
import jessicaAvatar from "../../assets/skill-gap/jessica-brown.png";
import ryanAvatar from "../../assets/skill-gap/ryan-anderson.png";
import alexAvatar from "../../assets/skill-gap/alex-thompson.png";
import jordanAvatar from "../../assets/skill-gap/jordan-mitchell.png";

const alertCards = [
  { id: 1, title: "Bakery - Baking, 40h", action: "Click on Card for solution" },
  { id: 2, title: "Curbside - Personal Shopper, 32h", action: "Click on Card for solution" },
  { id: 3, title: "Deli - Slicing, 28h", action: "Click on Card for solution" },
  { id: 4, title: "Produce - Fresh Cut, 24h", action: "Click on Card for solution" },
  { id: 5, title: "Meat Market - Butcher, 36h", action: "Click on Card for solution" },
  { id: 6, title: "Seafood - Service Counter, 22h", action: "Click on Card for solution" },
  { id: 7, title: "BLOOMS - Floral Design, 18h", action: "Click on Card for solution" },
  { id: 8, title: "Meal Simple - Prep Cook, 26h", action: "Click on Card for solution" },
  { id: 9, title: "Pharmacy - Pick Up, 20h", action: "Click on Card" },
];

const skillGapRows = [
  { week: "5/3/26 - 5/9/26", values: ["0", "2", "2", "3", "4", "0", "0"], total: "11h" },
  { week: "5/10/26 - 5/16/26", values: ["0", "0", "2", "2", "2", "2", "2"], total: "10h" },
  { week: "5/17/26 - 5/23/26", values: ["2", "9", "4", "4", "1", "1", "0"], total: "10h" },
  { week: "5/24/26 - 5/30/26", values: ["4", "1", "0", "0", "0", "0", "4"], total: "09h" },
];

const adjustEmployees = [
  {
    name: "Sarah Johnson",
    avatar: sarahAvatar,
    badges: ["Baking", "Pastry"],
    current: "Mon, Tue, Fri, Sat, Sun · 39h",
    required: "Mon, Tue, Wed, Fri, Sat, Sun · 52h",
    proposed: "Wed 6a - 12p · Fri 4p - 7p · Sun 6a - 10a",
  },
  {
    name: "Emily Carter",
    avatar: emilyAvatar,
    badges: ["Pastry", "Food Safety"],
    current: "Mon, Tue, Wed, Fri, Sat · 38h",
    required: "Mon, Tue, Wed, Fri, Sat, Sun · 52h",
    proposed: "Wed 6a - 12p · Fri 4p - 7p · Sun 6a - 10a",
  },
  {
    name: "Michael Chen",
    avatar: michaelAvatar,
    badges: ["Cake", "Decorating"],
    current: "Mon, Tue, Fri, Sat · 39h",
    required: "Mon, Tue, Wed, Fri, Sat · 52h",
    proposed: "Wed 6a - 12p · Fri 4p - 7p · Sun 6a - 10a",
  },
];

const crossTrainEmployees = [
  {
    name: "Jessica Brown",
    avatar: jessicaAvatar,
    badges: ["Customer Service"],
    current: "Secondary LT: (149)Deli, Deli Opening, +1",
    required: "Availability: Mon-Sun · 52h",
  },
  {
    name: "Ryan Anderson,",
    avatar: ryanAvatar,
    badges: ["Inventory"],
    current: "Secondary LT: (150)Deli, (149) Deli, Deli Slicing",
    required: "Availability: Tue-Sun · 45h",
  },
  {
    name: "Alex Thompson",
    avatar: alexAvatar,
    badges: ["Customer Service"],
    current: "Secondary LT: (149)Deli, Deli Opening, +1",
    required: "Availability: Mon-Sun · 30h",
  },
  {
    name: "Jordan Mitchell",
    avatar: jordanAvatar,
    badges: ["Bakery, Baking"],
    current: "Secondary LT: (149)Deli, Deli Opening, +1",
    required: "Availability: Mon-Sun · 30h",
  },
];

type RecommendationEmployee = {
  name: string;
  avatar: string;
  badges: string[];
  current: string;
  required: string;
  proposed?: string;
};

function SelectField({ label, value, width, disabled = false }: { label: string; value: string; width: string; disabled?: boolean }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-[13px] font-semibold leading-[18px] text-[#5c5c5c]">{label}</span>
      <span
        className={cn(
          "flex h-9 items-center justify-between rounded-md border border-[#d4d7df] bg-white px-3 text-[17px] leading-[22px] text-[#333333]",
          width,
          disabled && "bg-[#f4f4f4] text-[#8a8a8a]",
        )}
      >
        <span className="font-semibold">{value}</span>
        {!disabled ? <ChevronDown className="h-4 w-4 text-[#6a6f78]" /> : null}
      </span>
    </label>
  );
}

function AlertCard({ id, isActive, onClick }: { id: number; isActive: boolean; onClick: () => void }) {
  const card = alertCards[id - 1];

  return (
    <button
      type="button"
      onClick={id === 1 ? onClick : undefined}
      className={cn(
        "grid h-[73px] w-[407px] grid-cols-[20px_minmax(0,1fr)] items-center gap-4 rounded-lg border-2 border-[#ff8b8f] px-4 text-left transition",
        isActive ? "bg-white" : "bg-[#fff2f2]",
        id === 1 ? "cursor-pointer" : "cursor-default",
      )}
    >
      <AlertCircle className="h-5 w-5 text-[#ff1d25]" />
      <span className="min-w-0">
        <span className="block text-[17px] font-semibold leading-[22px] text-[#111827]">{card.title}</span>
        <span className="block text-[15px] font-normal leading-5 text-primary">{card.action}</span>
      </span>
    </button>
  );
}

function EmptyRightPane() {
  return (
    <div className="relative h-full bg-white">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[42%] flex-col items-center text-center">
        <div className="relative h-[96px] w-[96px]">
          <div className="absolute left-[22px] top-[7px] h-[67px] w-[47px] rotate-[-16deg] rounded-sm border border-[#e1e4ea] bg-[#fbfbfc]" />
          <div className="absolute left-[36px] top-[18px] h-[67px] w-[56px] rounded-sm border border-[#d9dde5] bg-[#f1f2f4] shadow-sm" />
          <div className="absolute left-[44px] top-[26px] h-[50px] w-[40px] bg-[#e7e8ea]" />
          <div className="absolute left-[38px] top-[4px] h-2 w-7 rounded-sm bg-primary" />
          <div className="absolute left-[52px] top-[18px] h-2 w-7 rounded-sm bg-primary" />
        </div>
        <p className="mt-2 text-[16px] font-semibold text-[#333333]">No Data</p>
        <p className="text-[14px] text-[#5c5c5c]">Select Alerts for data</p>
      </div>
    </div>
  );
}

function HeatCell({ value }: { value: string }) {
  const tone =
    value === "0"
      ? "bg-[#eaf8f1] text-[#00843d]"
      : value === "1"
        ? "bg-[#fff7bd] text-[#9a5a00]"
        : value === "4"
          ? "bg-[#ff413b] text-white"
          : "bg-[#ffa000] text-white";

  return <div className={cn("flex h-[28px] w-full min-w-0 items-center justify-center rounded-[4px] text-[16px] font-semibold", tone)}>{value}</div>;
}

function SkillGapAccordion({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="max-w-full overflow-hidden rounded-t-[14px] border border-[#d5d5d5] bg-white">
      <div className={cn("flex h-[64px] items-center gap-4 px-[18px]", expanded && "border-b border-[#d5d5d5]")}>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#0858b9]"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse skill gap details" : "Expand skill gap details"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
        <h2 className="text-[19px] font-semibold leading-[24px] text-[#111827]">
          Bakery - 40h Baking skill gap, 16 Weeks(7/26/26 - 8/16/26)
        </h2>
      </div>
      {expanded ? (
        <div className="max-w-full overflow-hidden px-3 pb-0 pt-2">
          <div className="grid max-w-full grid-cols-[140px_repeat(7,minmax(0,1fr))_72px] gap-x-2">
            <div />
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Total"].map((day) => (
              <div key={day} className="flex h-[35px] min-w-0 items-center justify-center border-b border-[#cfd3dc] text-[14px] leading-5 text-[#344054]">
                {day}
              </div>
            ))}
            {skillGapRows.map((row) => (
              <div key={row.week} className="contents">
                <div className="flex h-[51px] min-w-0 items-center px-1 text-[15px] font-normal leading-[22px] text-[#111827]">{row.week}</div>
                {row.values.map((value, index) => (
                  <div key={`${row.week}-${index}`} className="flex h-[51px] min-w-0 items-center">
                    <HeatCell value={value} />
                  </div>
                ))}
                <div className="flex h-[51px] min-w-0 items-center justify-center bg-[#f6f7f9] text-[13px] font-semibold text-[#111827]">
                  {row.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone = "default" }: { icon: LucideIcon; label: string; value: string; tone?: "default" | "green" | "amber" }) {
  const valueClass = tone === "green" ? "text-[#009c38]" : tone === "amber" ? "text-[#d08a00]" : "text-[#111827]";
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-[14px] leading-5 text-slate-600">
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {label}
      </p>
      <p className={cn("mt-2 whitespace-normal break-words text-[24px] font-bold leading-tight", valueClass)}>{value}</p>
    </div>
  );
}

function SkillBadge({ children }: { children: string }) {
  return <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[13px] font-medium leading-[18px] text-slate-800">{children}</span>;
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-800" />
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-snug text-slate-900">{label}</p>
        <p className="mt-1 whitespace-normal break-words text-[14px] font-normal leading-snug text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function EmployeeCard({
  employee,
  selected = false,
  requestSent = false,
  onToggle,
}: {
  employee: RecommendationEmployee;
  selected?: boolean;
  requestSent?: boolean;
  onToggle?: () => void;
}) {
  const isInteractive = Boolean(onToggle);

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.14)] transition",
        selected ? "border-primary bg-blue-50/30 ring-1 ring-primary/20" : "border-slate-200",
        requestSent && "border-green-300 bg-green-50/40",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label={`Select ${employee.name}`}
            role="checkbox"
            aria-checked={selected}
            disabled={!isInteractive || requestSent}
            onClick={onToggle}
            className={cn(
              "mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected ? "border-primary bg-primary text-white" : "border-slate-300 bg-white text-transparent",
              isInteractive && !requestSent ? "cursor-pointer hover:border-primary" : "cursor-default",
            )}
          >
            {selected ? <Check className="h-4 w-4" /> : null}
          </button>
          <img src={employee.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="whitespace-normal break-words text-[16px] font-semibold leading-snug text-slate-900">{employee.name}</p>
            {requestSent ? <p className="mt-1 text-[13px] font-semibold leading-4 text-green-700">Request Sent</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap justify-start gap-2">
          {employee.badges.map((badge) => (
            <SkillBadge key={badge}>{badge}</SkillBadge>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="space-y-3">
          <DetailBlock label="Current" value={employee.current} />
          <DetailBlock label="Required" value={employee.required} />
        </div>
      </div>

      {employee.proposed ? (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <div className="flex gap-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-snug text-primary">Proposed</p>
              <p className="mt-1 whitespace-normal break-words text-[14px] font-medium leading-snug text-blue-950">{employee.proposed}</p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-6 top-6 z-[80] w-[390px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-5">Request sent successfully</p>
          <p className="mt-1 text-[13px] leading-5 text-white/90">Sarah Johnson's availability adjustment request has been sent.</p>
        </div>
        <button
          type="button"
          aria-label="Close success message"
          onClick={onClose}
          className="rounded p-1 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AvailabilityMiniTable({
  title,
  days,
  changedDays = [],
  type,
}: {
  title: string;
  days: { day: string; time: string }[];
  changedDays?: string[];
  type: "current" | "recommended";
}) {
  return (
    <section className="min-w-0 rounded-lg border border-[#d9dde5] bg-white p-3">
      <h4 className="flex items-center gap-2 text-[16px] font-semibold leading-6 text-slate-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-primary">
          <CalendarDays className="h-5 w-5" />
        </span>
        {title}
      </h4>
      <div className="mt-3 grid overflow-hidden rounded-md border border-[#d9dde5]" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((item) => {
          const isChanged = changedDays.includes(item.day);
          return (
            <div key={`${title}-${item.day}`} className={cn("border-r border-[#d9dde5] last:border-r-0", isChanged && "bg-orange-50")}>
              <div className={cn("flex h-10 items-center justify-center border-b border-[#d9dde5] text-[14px] font-semibold text-slate-900", isChanged && "text-[#e06600]")}>
                {item.day}
              </div>
              <div
                className={cn(
                  "flex min-h-[74px] items-center justify-center whitespace-pre-line px-2 text-center text-[14px] font-medium leading-6 text-slate-900",
                  type === "current" && "bg-green-50/70",
                  isChanged && "bg-orange-50 text-[#e06600]",
                )}
              >
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RequestAvailabilityModal({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const root = modalRef.current;
    if (!root) return;

    const focusable = Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(
      (node) => !node.hasAttribute("disabled") && node.tabIndex !== -1,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  }

  const currentDays = [
    { day: "Mon", time: "6:00a -\n5:00p" },
    { day: "Tue", time: "6:00a -\n2:00p" },
    { day: "Fri", time: "10:00a -\n4:00p" },
    { day: "Sat", time: "6:00a -\n2:00p" },
    { day: "Sun", time: "10:00a -\n4:00p" },
  ];
  const recommendedDays = [
    { day: "Mon", time: "6:00a -\n5:00p" },
    { day: "Tue", time: "6:00a -\n2:00p" },
    { day: "Wed", time: "6:00a -\n12:00p" },
    { day: "Fri", time: "10:00a -\n7:00p" },
    { day: "Sat", time: "6:00a -\n2:00p" },
    { day: "Sun", time: "6:00a -\n4:00p" },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" onKeyDown={trapFocus}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-request-title"
        className="max-h-[calc(100vh-48px)] w-full max-w-[1120px] overflow-y-auto rounded-xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
      >
        <div className="flex items-start justify-between gap-4 px-8 pt-7">
          <div>
            <h2 id="availability-request-title" className="text-[28px] font-semibold leading-9 text-slate-900">
              Request Availability Adjustment
            </h2>
            <p className="mt-2 text-[16px] leading-6 text-slate-600">Review the recommended availability changes before sending the request.</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close request availability adjustment modal"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="space-y-5 px-8 py-6">
          <div className="flex items-center gap-5 rounded-lg border border-blue-200 bg-blue-50/60 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">
              <CalendarDays className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[16px] font-semibold leading-5 text-primary">Recommended adjustment</p>
              <p className="mt-2 text-[23px] font-semibold leading-8 text-slate-900">Wed 6a – 12p · Fri 4p – 7p · Sun 6a – 10a</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#d9dde5] bg-white p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-6">
              <div className="flex items-center gap-5">
                <img src={sarahAvatar} alt="" className="h-20 w-20 rounded-full object-cover" />
                <div>
                  <p className="text-[23px] font-semibold leading-8 text-slate-900">Sarah Johnson</p>
                  <p className="mt-1 text-[16px] leading-6 text-slate-600">Front End Dept · Bakery</p>
                </div>
              </div>
              <div className="border-l border-slate-200 pl-8">
                <p className="text-[16px] leading-6 text-slate-600">Skill gap reduction</p>
                <p className="text-[30px] font-semibold leading-9 text-[#16833a]">85%</p>
              </div>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[85%] rounded-full bg-[#21a633]" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-[#d9dde5] bg-white px-4 py-3 text-[15px] leading-5 text-slate-700">
            <Info className="h-5 w-5 shrink-0 text-primary" />
            <span>Days being adjusted: </span>
            <span className="font-semibold text-primary">Wednesday, Friday, Sunday</span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <AvailabilityMiniTable title="Current Availability (39h)" days={currentDays} type="current" />
            <AvailabilityMiniTable title="Recommended Availability (52h)" days={recommendedDays} changedDays={["Wed", "Fri", "Sun"]} type="recommended" />
          </div>

          <div className="flex items-center justify-center gap-8 text-[14px] leading-5 text-slate-600">
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-green-200 bg-green-50" />
              Current availability
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-orange-200 bg-orange-50" />
              Proposed / new or adjusted
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-5 border-t border-slate-200 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 min-w-[180px] rounded-md border border-slate-800 bg-white px-6 text-[17px] font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSend}
            className="h-11 min-w-[190px] rounded-md bg-primary px-6 text-[17px] font-medium text-white transition hover:bg-[#0858b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

function SolutionCard({
  title,
  icon: Icon,
  selected = false,
  metrics,
  employeeCount,
  employees,
  selectedEmployeeId,
  requestSentEmployeeId,
  onToggleEmployee,
  onSendRequest,
}: {
  title: string;
  icon: LucideIcon;
  selected?: boolean;
  metrics: { label: string; value: string; icon: LucideIcon; tone?: "default" | "green" | "amber" }[];
  employeeCount: string;
  employees: RecommendationEmployee[];
  selectedEmployeeId?: string | null;
  requestSentEmployeeId?: string | null;
  onToggleEmployee?: (employeeName: string) => void;
  onSendRequest?: () => void;
}) {
  const isRequestSent = requestSentEmployeeId === "Sarah Johnson";
  const canSendRequest = selectedEmployeeId === "Sarah Johnson" && !isRequestSent;

  return (
    <section className={cn("flex h-[720px] min-w-0 max-w-full flex-col overflow-hidden rounded-[14px] border bg-[#f4f5fb]", selected ? "border-2 border-primary" : "border-[#cfd3dc]")}> 
      <div className={cn("flex h-[60px] shrink-0 items-center justify-between border-b bg-white px-4", selected ? "border-primary" : "border-[#cfd3dc]")}> 
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
            <Icon className="h-6 w-6" />
          </span>
          <h4 className="min-w-0 truncate text-[19px] font-semibold leading-6 text-[#333333]">{title}</h4>
        </div>
        <button
          type="button"
          disabled={!canSendRequest}
          onClick={canSendRequest ? onSendRequest : undefined}
          className={cn(
            "h-[31px] shrink-0 rounded-md px-4 text-[17px] font-medium leading-[22px] transition",
            canSendRequest && "cursor-pointer bg-primary text-white hover:bg-[#0858b9]",
            !canSendRequest && !isRequestSent && "cursor-not-allowed bg-[#e5e5e5] text-[#8a8a8a]",
            isRequestSent && "cursor-not-allowed bg-green-100 text-green-700",
          )}
        >
          {isRequestSent ? "Request Sent" : "Send Request"}
        </button>
      </div>
      <div className="grid min-h-[98px] shrink-0 grid-cols-3 gap-0 px-8 py-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className={cn("min-w-0", index > 0 && "border-l border-slate-300 pl-8")}>
            <Metric {...metric} />
          </div>
        ))}
      </div>
      <div className="mx-4 flex h-16 shrink-0 items-center justify-between rounded-md bg-white px-4">
        <p className="flex items-center gap-2 text-[16px] leading-5 text-slate-900">
          <Users className="h-5 w-5" />
          {employeeCount}
        </p>
        <button
          type="button"
          aria-label={`Search ${title} employees`}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Search className="h-5 w-5 text-slate-900" />
        </button>
      </div>
      <div className="scrollbar-slim grid min-h-0 flex-1 grid-cols-2 content-start gap-4 overflow-y-auto px-4 py-4">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.name}
            employee={employee}
            selected={selectedEmployeeId === employee.name}
            requestSent={requestSentEmployeeId === employee.name}
            onToggle={employee.name === "Sarah Johnson" ? () => onToggleEmployee?.(employee.name) : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function SkillGapDetailPane() {
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [requestSentEmployeeId, setRequestSentEmployeeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (!showSuccessToast) return;
    const timeoutId = window.setTimeout(() => setShowSuccessToast(false), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [showSuccessToast]);

  function handleToggleEmployee(employeeName: string) {
    if (requestSentEmployeeId === employeeName) return;
    setSelectedEmployeeId((current) => (current === employeeName ? null : employeeName));
  }

  function handleSendRequest() {
    if (selectedEmployeeId !== "Sarah Johnson" || requestSentEmployeeId) return;
    setIsModalOpen(true);
  }

  function handleConfirmSendRequest() {
    setIsModalOpen(false);
    setRequestSentEmployeeId("Sarah Johnson");
    setSelectedEmployeeId("Sarah Johnson");
    setShowSuccessToast(true);
  }

  return (
    <div className="min-h-full min-w-0 overflow-visible bg-white p-4 pb-8">
      {showSuccessToast ? <SuccessToast onClose={() => setShowSuccessToast(false)} /> : null}
      {isModalOpen ? <RequestAvailabilityModal onClose={() => setIsModalOpen(false)} onSend={handleConfirmSendRequest} /> : null}
      <SkillGapAccordion expanded={accordionExpanded} onToggle={() => setAccordionExpanded((expanded) => !expanded)} />
      <section className="relative mt-3 min-w-0 overflow-visible bg-white">
        <div className="flex h-[52px] items-start justify-between">
          <div>
            <h3 className="text-[21px] font-semibold leading-[28px] text-[#111827]">Recommend Skill Gap Solutions</h3>
            <p className="mt-1 text-[17px] font-medium leading-[22px] text-primary">Baking Labor Task(40h gap)</p>
          </div>
          <button type="button" className="h-[38px] rounded-md bg-[#555] px-4 text-[15px] font-medium text-white">
            Hire Recommendations
          </button>
        </div>
        <div className="mt-4 flex h-[51px] min-w-0 items-center rounded-lg border border-[#bcdcff] bg-[#f7f4ff] px-4">
          <p className="flex min-w-0 items-center gap-1.5 text-[15px] leading-5 text-[#111827]">
            <Sparkles className="mr-1 h-6 w-6 shrink-0 text-primary" />
            <span className="font-semibold">AI Recommendation :</span>
            <span className="font-semibold text-primary">Adjust employee availability</span>
            <span className="min-w-0 truncate">offers the fastest resolution with lowest risk.</span>
          </p>
        </div>
        <div className="mt-4 grid min-w-0 grid-cols-2 gap-5 overflow-visible bg-[#f4f5fb]">
          <SolutionCard
            title="Adjust Availability"
            icon={CalendarDays}
            selected
            employeeCount="3 Employees"
            metrics={[
              { icon: TrendingUp, label: "Gap Reduction", value: "85%" },
              { icon: Clock3, label: "Time to Implement", value: "1-2 days" },
              { icon: AlertTriangle, label: "Risk Level", value: "Low", tone: "green" },
            ]}
            employees={adjustEmployees}
            selectedEmployeeId={selectedEmployeeId}
            requestSentEmployeeId={requestSentEmployeeId}
            onToggleEmployee={handleToggleEmployee}
            onSendRequest={handleSendRequest}
          />
          <SolutionCard
            title="Cross-Train"
            icon={Users}
            employeeCount="4 Employees"
            metrics={[
              { icon: TrendingUp, label: "Gap Reduction", value: "95%" },
              { icon: Clock3, label: "Time to Implement", value: "3 weeks" },
              { icon: AlertTriangle, label: "Risk Level", value: "Medium", tone: "amber" },
            ]}
            employees={crossTrainEmployees}
          />
        </div>
      </section>
    </div>
  );
}

export function SkillGapDesktopScreen() {
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);

  return (
    <AppShell activeNavLabel="Home" profile={{ name: "Smith, Jane", role: "Store Manager", avatar: "SJ", badge: 9, avatarUrl: profileAvatar }}>
      <div className="min-h-[calc(100vh-56px)] min-w-0 bg-[#f1f3f9] pr-5">
        <div className="flex h-10 items-center gap-3 px-4">
          <button type="button" aria-label="Back" className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d4d7de] bg-white text-[#333333]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[21px] font-semibold leading-7 text-[#333333]">Skill Gap</h1>
          <HelpCircle className="h-4 w-4 text-[#6b6f78]" />
        </div>

        <section className="min-h-[calc(100vh-76px)] min-w-0 rounded-t-md border border-[#d6d9df] bg-white">
          <div className="flex h-[50px] items-center gap-5 border-b border-[#dfe1e6] px-4">
            <button type="button" className="rounded-md bg-[#e8f2ff] px-4 py-2 text-[17px] font-medium leading-[22px] text-primary">
              Alert
            </button>
            <button type="button" className="px-4 py-2 text-[17px] font-medium leading-[22px] text-[#5c5c5c]">Forecast</button>
          </div>

          <div className="flex h-[68px] items-center gap-7 border-b border-[#dfe1e6] px-4">
            <div className="flex h-9 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
              <button type="button" className="flex w-9 items-center justify-center border-r border-[#c9cbd2]">
                <ChevronLeft className="h-5 w-5 text-[#5c5c5c]" />
              </button>
              <button type="button" className="flex min-w-[198px] items-center justify-between px-2 text-[17px] leading-[22px]">
                <span>Sun, 5/3/26</span>
                <Calendar className="h-[18px] w-[18px] text-primary" />
              </button>
              <button type="button" className="flex w-9 items-center justify-center border-l border-[#c9cbd2]">
                <ChevronRight className="h-5 w-5 text-[#5c5c5c]" />
              </button>
            </div>

            <SelectField label="Division:" value="Division 2" width="w-[200px]" disabled />
            <SelectField label="Store:" value="111" width="w-[200px]" />
            <SelectField label="Department:" value="All" width="w-[200px]" />
            <SelectField label="Labor Task:" value="All" width="w-[200px]" />
          </div>

          <div className="grid min-h-[calc(100vh-194px)] min-w-0 grid-cols-[448px_minmax(0,1fr)]">
            <aside className="min-w-0 border-r border-[#d9dde5] bg-white px-4 py-3">
              <div className="flex h-10 items-center justify-between">
                <h2 className="text-[21px] font-semibold leading-[30px] text-[#111827]">Skill Gap Alerts</h2>
                <button type="button" className="flex h-10 items-center gap-2 rounded-md border border-primary bg-white px-4 text-[17px] font-medium leading-[22px] text-primary">
                  <Sparkles className="h-4 w-4" />
                  Ask
                </button>
              </div>

              <div className="mt-4 grid grid-cols-[189px_200px] gap-4">
                <div className="flex h-9 items-center justify-between rounded-md border border-[#d4d7df] bg-white px-3 text-[17px] leading-[22px]">
                  <span>4 weeks</span>
                  <ChevronDown className="h-4 w-4 text-[#5c5c5c]" />
                </div>
                <div className="flex h-9 items-center justify-between rounded-md border border-[#d4d7df] bg-white px-3 text-[17px] leading-[22px]">
                  <span>All Labor Task</span>
                  <ChevronDown className="h-4 w-4 text-[#5c5c5c]" />
                </div>
              </div>

              <p className="mt-4 text-[15px] leading-5 text-[#374151]">
                Showing 8 alerts: <span className="font-semibold">4 Weeks(5/3/26 - 5/24/26)</span>
              </p>

              <div className="scrollbar-slim mt-2 min-h-[520px] space-y-2 overflow-y-auto pr-1">
                {alertCards.map((alert) => (
                  <AlertCard key={alert.id} id={alert.id} isActive={selectedAlertId === alert.id} onClick={() => setSelectedAlertId(alert.id)} />
                ))}
              </div>
            </aside>

            <main className="min-w-0 overflow-visible bg-white">{selectedAlertId === 1 ? <SkillGapDetailPane /> : <EmptyRightPane />}</main>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
