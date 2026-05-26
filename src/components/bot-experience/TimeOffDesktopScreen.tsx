import { AlertTriangle, Calendar, Check, CheckCircle2, ChevronDown, ChevronLeft, Clock3, Flag, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "./AppShell";
import { cn } from "../../lib/utils";

type CalendarDay = {
  label: string;
  tone?: "green" | "amber" | "red";
};

type TimeOffAuraMessage = {
  id: number;
  role: "assistant" | "user";
  text?: string;
  variant?: "warning" | "lowConflict" | "appliedTimeOff";
  appliedWindow?: TimeOffWindowId;
};

type TimeOffWindowId = "jan-8-11" | "jan-15-21";

type TimeOffWindowOption = {
  id: TimeOffWindowId;
  title: string;
  detail: string;
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

function TimeOffTypingIndicator() {
  return (
    <div className="max-w-[88%] rounded-lg bg-white px-3 py-2 text-[#5c5c5c] shadow-sm">
      <span className="sr-only">AURA AI is typing</span>
      <span className="flex h-5 items-center gap-1" aria-hidden="true">
        <span className="aura-typing-dot" />
        <span className="aura-typing-dot [animation-delay:140ms]" />
        <span className="aura-typing-dot [animation-delay:280ms]" />
      </span>
    </div>
  );
}

function TimeOffWarningCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d97706]" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-5 text-[#111827]">Warning</p>
          <p className="mt-1 text-[18px] font-semibold leading-6 text-[#111827]">Jan 11-14</p>
          <p className="mt-1 text-[14px] leading-5 text-[#4b5563]">Total team approved requests: 10</p>
        </div>
      </div>
      <div className="rounded-md border border-[#fcd34d] bg-[#fffbeb] px-3 py-2 text-[14px] leading-5 text-[#92400e]">
        11th Jan(3), 12th Jan(1) &amp; 14th Jan(6)
      </div>
    </div>
  );
}

const lowConflictWindows: TimeOffWindowOption[] = [
  {
    id: "jan-8-11",
    title: "Jan 8-11",
    detail: "3 overlap • Minimal impact",
  },
  {
    id: "jan-15-21",
    title: "Jan 15-21",
    detail: "0 overlap • No team conflicts",
  },
];

function TimeOffLowConflictCard({
  appliedWindow,
  onApplyWindow,
}: {
  appliedWindow: TimeOffWindowId | null;
  onApplyWindow: (windowId: TimeOffWindowId) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[18px] leading-7 text-[#111827]">Based on ask here are the best low-conflict windows:</p>
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-sm">
        <div className="space-y-3">
          {lowConflictWindows.map((windowOption) => {
            const isApplied = appliedWindow === windowOption.id;

            return (
              <div key={windowOption.id} className="rounded-lg border border-[#dfe1e6] bg-white px-3 py-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold leading-6 text-[#111827]">{windowOption.title}</p>
                    <p className="mt-1 text-[14px] leading-5 text-[#4b5563]">{windowOption.detail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApplyWindow(windowOption.id)}
                    disabled={isApplied}
                    className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-primary px-3 text-[13px] font-semibold text-white transition hover:bg-[#0858b9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-default disabled:bg-[#9eb7dc]"
                  >
                    {isApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimeOffAppliedCard({ windowId }: { windowId: TimeOffWindowId }) {
  const appliedWindow =
    windowId === "jan-15-21"
      ? {
          title: "Jan 15-21",
          detail: "0 overlap • No team conflicts",
        }
      : {
          title: "Jan 8-11",
          detail: "2 overlap • Minimal impact",
        };

  return (
    <div className="space-y-4 rounded-xl bg-[#e8f7e8] p-4 text-[#111827]">
      <p className="text-[18px] leading-7">Applied Time off:</p>
      <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-[#229c22] bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-[17px] font-semibold leading-6 text-[#111827]">{appliedWindow.title}</p>
          <p className="mt-1 text-[14px] leading-5 text-[#4b5563]">{appliedWindow.detail}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#229c22] text-[#229c22]">
          <Check className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function TimeOffAuraAssistant({ onApplyWindow }: { onApplyWindow: (windowId: TimeOffWindowId) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [appliedWindow, setAppliedWindow] = useState<TimeOffWindowId | null>(null);
  const [messages, setMessages] = useState<TimeOffAuraMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "How can i help you in Create Timeoff Request?",
    },
  ]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  function getAssistantResponse(input: string): TimeOffAuraMessage {
    const normalized = input.toLowerCase();

    if (normalized.includes("low conflict") || normalized.includes("best weeks")) {
      return {
        id: Date.now() + 2,
        role: "assistant",
        variant: "lowConflict",
      };
    }

    if (normalized.includes("overlap") || normalized.includes("approved time off")) {
      return {
        id: Date.now() + 2,
        role: "assistant",
        variant: "warning",
      };
    }

    return {
      id: Date.now() + 2,
      role: "assistant",
      text: "I can review approved time off conflicts or find lower-conflict request windows.",
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage || isTyping) return;

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: trimmedMessage,
      },
    ]);
    setDraftMessage("");
    setIsTyping(true);

    typingTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, getAssistantResponse(trimmedMessage)]);
      setIsTyping(false);
      typingTimerRef.current = null;
    }, 620);
  }

  function handleApplyWindow(windowId: TimeOffWindowId) {
    setAppliedWindow(windowId);
    onApplyWindow(windowId);
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "assistant",
        variant: "appliedTimeOff",
        appliedWindow: windowId,
      },
    ]);
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-6 sm:right-6",
          isOpen && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Open AURA AI assistant"
          onClick={() => setIsOpen(true)}
          className="relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#33C7EA] to-[#2A2DBB] px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(42,45,187,0.35),0_0_24px_rgba(51,199,234,0.28)] outline-none ring-1 ring-white/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(42,45,187,0.42),0_0_32px_rgba(51,199,234,0.36)] focus-visible:ring-4 focus-visible:ring-[#7edff4]"
        >
          <Sparkles className="h-4 w-4 fill-white/20" />
          <span>AURA AI</span>
        </button>
      </div>

      <aside
        className={cn(
          "fixed bottom-3 right-3 top-3 z-50 flex w-[calc(100vw-24px)] max-w-[clamp(360px,28vw,420px)] origin-bottom-right flex-col overflow-hidden rounded-xl border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out sm:bottom-5 sm:right-5 sm:top-16",
          isOpen ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-[calc(100%+32px)] scale-95 opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <header className="flex items-start justify-between border-b border-[#e2e5ec] bg-gradient-to-r from-[#f8fbff] to-[#f6f0ff] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0868db] to-[#7c3aed] text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[19px] font-semibold leading-6 text-[#1f2937]">AURA AI</h2>
              <p className="text-[13px] font-medium text-[#5c5c5c]">WFM Intelligence Copilot</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-white hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Close AURA AI assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="scrollbar-slim min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] px-5 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "animate-[aura-message-in_180ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                message.role === "assistant"
                  ? cn(
                      "max-w-[92%] bg-white text-[#333333]",
                      message.variant === "lowConflict" && "bg-[#f0f1f6] p-4",
                      message.variant === "warning" && "border border-[#fcd34d] bg-[#fff7ed] p-3",
                      message.variant === "appliedTimeOff" && "bg-transparent p-0 shadow-none",
                    )
                  : "ml-auto max-w-[84%] bg-primary text-white",
              )}
            >
              {message.variant === "warning" ? <TimeOffWarningCard /> : null}
              {message.variant === "lowConflict" ? (
                <TimeOffLowConflictCard appliedWindow={appliedWindow} onApplyWindow={handleApplyWindow} />
              ) : null}
              {message.variant === "appliedTimeOff" ? <TimeOffAppliedCard windowId={message.appliedWindow ?? "jan-8-11"} /> : null}
              {!message.variant ? message.text : null}
            </div>
          ))}

          {isTyping ? <TimeOffTypingIndicator /> : null}
          <div ref={scrollAnchorRef} />
        </div>

        <footer className="shrink-0 border-t border-[#e2e5ec] bg-white px-4 py-3">
          <form className="flex items-center gap-2 rounded-lg border border-[#c9cbd2] bg-white px-3 py-2" onSubmit={handleSubmit}>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#888888]"
              placeholder="Ask AURA to review this request"
              aria-label="Ask AURA to review this request"
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !draftMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-white transition hover:bg-[#0858b9] disabled:cursor-not-allowed disabled:bg-[#b7c5d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Send message to AURA AI"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </aside>
    </>
  );
}

export function TimeOffDesktopScreen() {
  const navigate = useNavigate();
  const [isAllDayEnabled, setIsAllDayEnabled] = useState(false);
  const [selectedTimeOffDays, setSelectedTimeOffDays] = useState(() => new Set(["0-11", "0-12", "0-13", "0-14"]));
  const selectedTimeOffCount = isAllDayEnabled ? selectedTimeOffDays.size : 0;

  function handleApplyTimeOffWindow(windowId: TimeOffWindowId) {
    setIsAllDayEnabled(true);
    setSelectedTimeOffDays(
      new Set(
        windowId === "jan-15-21"
          ? ["1-15", "1-16", "1-17", "1-18", "1-19", "1-20", "1-21"]
          : ["0-8", "0-9", "0-10", "0-11"],
      ),
    );
  }

  return (
    <AppShell activeNavLabel="Labor Model" showDemoBackLink>
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
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isAllDayEnabled}
                      onClick={() => setIsAllDayEnabled((enabled) => !enabled)}
                      className={cn(
                        "flex h-[28px] w-[62px] items-center rounded-full p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        isAllDayEnabled ? "bg-primary" : "bg-[#d8d8d8]",
                      )}
                    >
                      <span
                        className={cn(
                          "h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                          isAllDayEnabled && "translate-x-[34px]",
                        )}
                      />
                      <span className={cn("text-[13px] font-medium text-white", isAllDayEnabled ? "-ml-4" : "ml-1")}>
                        {isAllDayEnabled ? "ON" : "OFF"}
                      </span>
                    </button>
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
                  <div className="mt-4 flex items-center justify-between 2xl:mt-6">
                    <p className="text-[22px] font-semibold leading-8 text-[#333333] 2xl:text-[25px] 2xl:leading-[34px]">
                      {selectedTimeOffCount} {selectedTimeOffCount === 1 ? "Day" : "Days"}
                    </p>
                    {isAllDayEnabled ? <Flag className="h-5 w-5 fill-[#f59e0b] text-[#f59e0b]" /> : null}
                  </div>
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
                      {week.map((day) => {
                        const dayNumber = day.label.split(" ")[0];
                        const selectedDayKey = `${weekIndex}-${dayNumber}`;
                        const isSelectedTimeOffDay = isAllDayEnabled && selectedTimeOffDays.has(selectedDayKey);

                        return (
                        <div key={`${weekIndex}-${day.label}`} className="relative min-h-[82px] border-r border-[#d6d9df] bg-white last:border-r-0 2xl:min-h-[101px]">
                          <div className="px-2 pt-2 text-[15px] font-semibold leading-5 text-[#333333]">{day.label}</div>
                          {isSelectedTimeOffDay ? (
                            <span
                              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                              aria-label={`Selected time off for ${day.label}`}
                              role="img"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : null}
                          <div
                            className={cn(
                              "mt-7 h-6 2xl:mt-[45px] 2xl:h-7",
                              day.tone === "green" && "bg-green-50",
                              day.tone === "amber" && "bg-orange-50",
                              day.tone === "red" && "bg-red-100",
                            )}
                          />
                        </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </section>
        <TimeOffAuraAssistant onApplyWindow={handleApplyTimeOffWindow} />
      </div>
    </AppShell>
  );
}
