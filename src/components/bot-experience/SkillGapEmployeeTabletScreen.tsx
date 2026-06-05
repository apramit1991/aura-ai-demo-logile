import { type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Paperclip,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { getAvatarByName } from "../../lib/avatarHelper";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import { AuraLauncherButton } from "./AuraLauncherButton";
import { PageHeader } from "./PageHeader";
import { cn } from "../../lib/utils";
import sendButtonIcon from "../../assets/Send Button.svg";
import availabilityIcon from "../../assets/approval-employee/addpunch.svg";
import crossTrainingIcon from "../../assets/approval-employee/book-plus.png";
import logoUrl from "../../assets/logo.png";
import { employee, headerActions, navItems } from "../../data/mockData";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "../ui/input";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type PanelState = "closed" | "open" | "closing";
type ChatPhase = "initial" | "done";
type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function DayColumn({
  day,
  value,
  highlighted = false,
  headerBg = "bg-white",
  valueBg = "bg-white",
  isFirst = false,
  isLast = false,
}: {
  day: string;
  value: string;
  highlighted?: boolean;
  headerBg?: string;
  valueBg?: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const dayColor = highlighted ? "text-[#e27c00]" : "text-[#888]";
  const valueColor = highlighted ? "text-[#e27c00]" : "text-[#333]";

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div
        className={cn(
          "flex h-[38px] items-center px-2 border border-[#dcdcdc]",
          headerBg,
          isFirst ? "rounded-tl-lg" : "",
          isLast ? "rounded-tr-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[13px] font-bold", dayColor)}>{day}</span>
      </div>
      <div
        className={cn(
          "flex min-h-[56px] items-center px-2 border border-[#dcdcdc] border-t-0",
          valueBg,
          isFirst ? "rounded-bl-lg" : "",
          isLast ? "rounded-br-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[12px] font-medium leading-snug whitespace-pre-line", valueColor)}>{value}</span>
      </div>
    </div>
  );
}

function AvailabilityTable({
  label,
  days,
}: {
  label: string;
  days: { day: string; value: string; highlighted?: boolean; headerBg?: string; valueBg?: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-medium text-[#333]">{label}</p>
      <div className="flex w-full">
        {days.map((d, i) => (
          <DayColumn
            key={d.day}
            day={d.day}
            value={d.value}
            highlighted={d.highlighted}
            headerBg={d.headerBg ?? "bg-white"}
            valueBg={d.valueBg ?? "bg-white"}
            isFirst={i === 0}
            isLast={i === days.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function RequestListCard({
  icon,
  title,
  status,
  isActive,
  onClick,
}: {
  icon: string;
  title: string;
  status: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors",
        isActive
          ? "border-[#dcdcdc] bg-[rgba(10,104,219,0.1)]"
          : "border-[#dcdcdc] bg-white hover:bg-[#f8f9fb]",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px]",
            isActive ? "bg-white" : "bg-[#fbe8ff]",
          )}
        >
          <img src={icon} alt="" className="h-6 w-6 object-contain" />
        </div>
        <span className="text-[14px] font-medium text-[#333] leading-snug">{title}</span>
      </div>
      <span className="shrink-0 rounded-md bg-[#fff5c5] px-2.5 py-0.5 text-[12px] text-[#7c360b] whitespace-nowrap">
        {status}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet Shell (replaces AppShell — self-contained for tablet)        */
/* ------------------------------------------------------------------ */

function TabletShell({ children }: { children: React.ReactNode }) {
  const sarahAvatar = getAvatarByName("Sarah Johnson");

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f6f6f6] text-[#333333]">
      {/* Header */}
      <header className="z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#e7e7e7] bg-[#f6f6f6] px-3">
        <button type="button" className="flex h-10 w-9 items-center justify-center rounded-md text-[#333333]" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex min-w-[120px] items-center pr-2">
          <img src={logoUrl} alt="Logile WFM" className="h-5 w-[120px] object-contain" />
        </div>
        <div className="ml-auto hidden w-52 items-center md:flex">
          <label className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#5c5c5c]" />
            <Input className="h-9 pl-8 text-[15px]" placeholder="Search..." />
          </label>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          {headerActions.map(({ icon: Icon, count, label }) => (
            <button key={label} type="button" className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#5c5c5c]" title={label} aria-label={label}>
              <Icon className="h-[20px] w-[20px]" />
              {count ? <span className="absolute right-0 top-0 rounded-full bg-[#e22d20] px-1 text-[11px] leading-4 text-white">99+</span> : null}
            </button>
          ))}
        </div>
        {/* Profile */}
        <button type="button" className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-[#d4d7de] bg-white px-2">
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#b8e0aa] text-xs font-bold text-[#2e6623]">
            {sarahAvatar ? <img src={sarahAvatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : "SJ"}
            <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] text-[10px] text-white">1</span>
          </span>
          <span className="hidden min-w-0 text-left leading-tight sm:block">
            <span className="block truncate text-[13px] font-medium">Sarah Johnson</span>
            <span className="block text-[13px] font-medium text-[#5c5c5c]">Employee</span>
          </span>
          <ChevronDown className="ml-auto hidden h-4 w-4 text-[#5c5c5c] sm:block" />
        </button>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left nav */}
        <aside className="z-20 hidden h-full w-[72px] shrink-0 overflow-y-auto border-r border-[#e7e7e7] bg-[#f6f6f6] pb-4 hidden">
          <div className="flex h-10 items-center justify-center gap-1 text-[15px] font-medium text-primary">
            ⇄ IMS
          </div>
          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => {
              const isActive = label === "Labor Model" || active;
              return (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    "relative flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-r-md text-center text-[11px] leading-[13px] text-[#5c5c5c] transition hover:bg-white",
                    isActive && "bg-[#dce8f8] font-medium text-[#0858b9]",
                  )}
                >
                  {isActive ? <span className="absolute left-0 top-3 h-8 w-[3px] rounded-r bg-primary" /> : null}
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Tablet Screen                                                  */
/* ------------------------------------------------------------------ */

export function SkillGapEmployeeTabletScreen() {
  const [activeTab, setActiveTab] = useState("my-request");
  const [subTab, setSubTab] = useState<"submitted" | "received">("received");
  const [selectedRequest, setSelectedRequest] = useState<"availability" | "crossTrain">("availability");
  const [actionState, setActionState] = useState<"pending" | "accepted" | "declined">("pending");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("initial");
  const [isAuraTyping, setIsAuraTyping] = useState(false);

  const tabs = [
    // { id: "calendar", label: "Calendar" },
    { id: "my-request", label: "My Request" },
    { id: "create-request", label: "Create Request" },
    { id: "my-compensations", label: "My Compensations" },
    // { id: "manage-calendar", label: "Manage Calendar" },
  ];

  return (
    /* Tablet bezel wrapper */
    <main className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dfe5ee_48%,#c9d2df_100%)] px-4 py-4 md:px-8 md:py-5">
      {/* Back bar */}
      <div className="sticky top-0 z-[100] -mx-4 mb-4 flex h-12 items-center justify-center bg-black md:-mx-8">
        <Link to="/demo" className="inline-block px-2 py-1 text-[14px] font-medium text-[#0b70d0] hover:underline">
          {"← Back to Demo Screens"}
        </Link>
      </div>

      {/* Tablet frame */}
      <div className="mx-auto w-fit max-w-full rounded-[44px] border border-slate-950/30 bg-[#111827] p-4 shadow-[0_34px_90px_rgba(15,23,42,0.42)]">
        <div className="relative h-[900px] w-[1200px] max-w-[calc(100vw-64px)] overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-inner">
          {/* Notch bar */}
          <div className="pointer-events-none sticky left-0 top-0 z-[90] flex h-5 w-full justify-center bg-black/5">
            <span className="mt-2 h-1.5 w-24 rounded-full bg-slate-900/25" />
          </div>

          {/* Screen content */}
          <div className="-mt-5 h-[calc(100%+20px)] overflow-hidden">
            <TabletShell>
              <div className="flex h-full flex-col bg-[#F4F5FA]">
                {/* Page Header */}
                <div className="bg-[#F4F5FA] px-4 md:px-6 border-b border-[#E4E7EC]">
                  <PageHeader
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    title="ESS"
                    hideActiveTabBottomBorder
                    tabs={tabs}
                  />
                </div>

                {/* Sub-tabs + filter bar */}
                <div className="flex items-center justify-between border-b border-[#e7e7e7] bg-white px-4 py-1.5">
                  <div className="flex items-center gap-1">
                    {(["Submitted", "Received"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSubTab(t.toLowerCase() as "submitted" | "received")}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-[13px] transition-colors",
                          subTab === t.toLowerCase()
                            ? "bg-[rgba(10,104,219,0.1)] font-medium text-[#0a68db]"
                            : "text-[#5c5c5c] hover:bg-gray-100",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Date picker */}
                    <div className="flex h-8 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
                      <button type="button" className="flex w-8 items-center justify-center border-r border-[#c9cbd2]">
                        <ChevronLeft className="h-4 w-4 text-[#5c5c5c]" />
                      </button>
                      <div className="flex items-center gap-1.5 px-2 text-[13px] text-[#333]">
                        <span>5/3/26 - 5/8/26</span>
                        <CalendarIcon className="h-[15px] w-[15px] text-primary" />
                      </div>
                      <button type="button" className="flex w-8 items-center justify-center border-l border-[#c9cbd2]">
                        <span className="text-[#5c5c5c] font-medium text-sm">›</span>
                      </button>
                    </div>
                    <button type="button" className="flex h-8 items-center gap-1.5 rounded-lg border border-[#c1c1c1] bg-white px-2.5 text-[13px] text-[#333]">
                      Availability+1 <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
                    </button>
                    <button type="button" className="flex h-8 items-center gap-1.5 rounded-lg border border-[#c1c1c1] bg-white px-2.5 text-[13px] text-[#333]">
                      Pending+1 <ChevronDown className="h-3.5 w-3.5 text-[#888]" />
                    </button>
                  </div>
                </div>

                {/* Main 2-column layout */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left: request list */}
                  <div className="flex w-[370px] shrink-0 flex-col gap-3 overflow-y-auto bg-white p-3">
                    <RequestListCard
                      icon={availabilityIcon}
                      title="Adjust Availability Request"
                      status="Pending"
                      isActive={selectedRequest === "availability"}
                      onClick={() => setSelectedRequest("availability")}
                    />
                    <RequestListCard
                      icon={crossTrainingIcon}
                      title="Cross-Train Request"
                      status="Pending"
                      isActive={selectedRequest === "crossTrain"}
                      onClick={() => setSelectedRequest("crossTrain")}
                    />
                  </div>

                  {/* Right: detail panel */}
                  <div className="flex flex-1 flex-col overflow-y-auto border-l border-[#dcdcdc] bg-white p-3 gap-2">
                    {/* Detail header */}
                    <div className="flex items-start justify-end gap-3">
                      <h2 className="text-[17px] font-medium text-[#333] leading-tight hidden">
                        Adjust Availability Request
                      </h2>
                      <p className="text-[13px] text-[#888]">
                        <span className="font-medium">Action By:</span>{" "}
                        <span className="text-[#333]">Sun, 5/1/26</span>
                      </p>
                    </div>

                    {/* Detail content card */}
                    <div className="rounded-xl border border-[#dcdcdc] p-3">
                      {/* Card header */}
                      <div className="border-b border-[#dcdcdc] pb-3 mb-3">
                        <h3 className="text-[17px] font-medium text-[#333]">(149)Bakery, Baking(52h)</h3>
                        <div className="mt-1.5 flex items-center justify-between flex-wrap gap-1.5 text-[13px]">
                          <p>
                            <span className="text-[#888]">Effective Start-End date:</span>{" "}
                            <span className="text-[#333] font-medium">5/3/26 - 5/24/26</span>
                          </p>
                          <p>
                            <span className="text-[#888]">Request By:</span>{" "}
                            <span className="text-[#333] font-medium">Smith Jane, (149)Store Manager</span>
                          </p>
                        </div>
                      </div>

                      {/* Two-column: tables + supervisor message */}
                      <div className="flex gap-4 items-start">
                        {/* Left: availability tables */}
                        <div className="flex flex-1 flex-col gap-4 min-w-0">
                          <AvailabilityTable
                            label="Sarah Availability(39h)"
                            days={[
                              { day: "Mon", value: "6:00a\n-5:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                              { day: "Tue", value: "6:00a - 2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                              { day: "Fri", value: "10:00a - 4:00p" },
                              { day: "Sat", value: "6:00a - 2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                              { day: "Sun", value: "10:00a - 4:00p" },
                            ]}
                          />

                          <AvailabilityTable
                            label="Proposed Availability(52h)"
                            days={[
                              { day: "Mon", value: "6:00a-5:00p" },
                              { day: "Tue", value: "6:00a - 2:00p" },
                              { day: "Wed", value: "6:00a - 12:00p", highlighted: true },
                              { day: "Fri", value: "10:00a - 7:00p", highlighted: true },
                              { day: "Sat", value: "6:00a - 2:00p" },
                              { day: "Sun", value: "6:00a - 4:00p", highlighted: true },
                            ]}
                          />

                          <div className="flex flex-col gap-1.5">
                            <p className="text-[13px] font-medium text-[#333]">Proposed Changes</p>
                            <div className="rounded-lg bg-[#FFFCEA] px-3 py-2 text-[12px] text-[#0A68DB]">
                              Wed 6:00a - 12:00p, Fri 4:00p - 7:00p, Sun 6:00a - 10:00a.
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              type="button"
                              disabled={actionState !== "pending"}
                              onClick={() => setActionState("declined")}
                              className={cn(
                                "flex h-[34px] items-center justify-center rounded-lg px-5 text-[14px] text-white transition",
                                actionState === "declined" || actionState === "accepted"
                                  ? "bg-[#888] cursor-not-allowed"
                                  : "bg-[#4f4f4f] hover:bg-[#333]",
                              )}
                            >
                              {actionState === "declined" ? "Declined" : "Decline"}
                            </button>
                            <button
                              type="button"
                              disabled={actionState !== "pending"}
                              onClick={() => setActionState("accepted")}
                              className={cn(
                                "flex h-[34px] items-center justify-center rounded-lg px-5 text-[14px] text-white transition",
                                actionState === "accepted"
                                  ? "bg-[#059669] cursor-not-allowed"
                                  : actionState === "declined"
                                    ? "bg-[#888] cursor-not-allowed"
                                    : "bg-[#0a68db] hover:bg-[#0856b8]",
                              )}
                            >
                              {actionState === "accepted" ? "Accepted" : "Accept"}
                            </button>
                          </div>
                        </div>

                        {/* Right: Supervisor Message */}
                        <div className="w-[220px] shrink-0">
                          <p className="mb-1.5 text-[13px] font-medium text-[#0a68db]">Supervisor Message</p>
                          <div className="rounded-lg bg-[#EDF3FF] p-3 text-[13px] leading-relaxed text-[#333333]">
                            <p className="font-semibold mb-1">Request Impact:</p>
                            <p className="mb-2">Please review the Proposed availability and changes.</p>
                            <p>
                              These proposed changes will have no negative impact on your work preferences
                              and will have positive impacts on the (149)Bakery for the Baking Skill.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabletShell>

            {/* Success toast */}
            {actionState !== "pending" && (
              <div className="fixed right-6 top-6 z-[100] flex w-[300px] flex-col rounded-lg bg-[#027A48] p-4 text-white shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">Request {actionState === "accepted" ? "Accepted" : "Declined"}</p>
                    <p className="mt-1 text-[13px] text-white/90">The Adjust Availability Request has been {actionState === "accepted" ? "accepted" : "declined"}.</p>
                  </div>
                  <button onClick={() => setActionState("pending")} className="ml-auto text-white/70 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* AURA assistant */}
            <TabletAuraAssistant
              messages={chatMessages}
              setMessages={setChatMessages}
              phase={chatPhase}
              setPhase={setChatPhase}
              isTyping={isAuraTyping}
              setIsTyping={setIsAuraTyping}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  AURA Chat Panel (tablet-scoped)                                     */
/* ------------------------------------------------------------------ */

function TabletAuraAssistant({
  messages,
  setMessages,
  phase,
  setPhase,
  isTyping,
  setIsTyping,
}: {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  phase: ChatPhase;
  setPhase: Dispatch<SetStateAction<ChatPhase>>;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
}) {
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [draftMessage, setDraftMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function appendMessage(msg: Omit<ChatMessage, "id">) {
    setMessages((cur) => [...cur, { id: nextIdRef.current++, ...msg }]);
  }
  function clearTimer(ref: React.MutableRefObject<number | null>) {
    if (ref.current) { window.clearTimeout(ref.current); ref.current = null; }
  }
  function queueReply(text: string, delay = 1000) {
    clearTimer(replyTimerRef);
    setIsTyping(true);
    replyTimerRef.current = window.setTimeout(() => {
      appendMessage({ role: "assistant", text });
      setIsTyping(false);
      replyTimerRef.current = null;
    }, delay);
  }

  function openAssistant() {
    clearTimer(closeTimerRef); clearTimer(nudgeTimerRef);
    setShouldNudgeLauncher(false);
    setPanelState("open"); setIsFullscreen(false); setPanelView("activeChat"); setDraftMessage("");
    if (messages.length === 0 && !isTyping) {
      queueReply("Hello! I'm AURA, your AI assistant. I can help you review the Adjust Availability Request or answer any questions.", 800);
    }
  }

  function closeAssistant() {
    clearTimer(closeTimerRef); clearTimer(nudgeTimerRef);
    setPanelState("closing");
    closeTimerRef.current = window.setTimeout(() => {
      setPanelState("closed"); setIsFullscreen(false); setShouldNudgeLauncher(true); closeTimerRef.current = null;
      nudgeTimerRef.current = window.setTimeout(() => { setShouldNudgeLauncher(false); nudgeTimerRef.current = null; }, 420);
    }, 260);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draftMessage.trim();
    if (!text || isTyping) return;
    appendMessage({ role: "user", text });
    setDraftMessage("");
    setPhase("done");
    queueReply("Based on the Supervisor Message, these proposed availability changes have no negative impact on your schedule preferences. I'd recommend accepting this request.");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "56px";
    el.style.height = `${Math.max(56, Math.min(el.scrollHeight, 180))}px`;
  }, [draftMessage, isPanelVisible]);

  useEffect(() => () => { clearTimer(replyTimerRef); clearTimer(closeTimerRef); clearTimer(nudgeTimerRef); }, []);

  return (
    <>
      <div className={cn("absolute bottom-4 right-4 z-50 transition-all duration-300", !showLauncher && "pointer-events-none opacity-0")}>
        <AuraLauncherButton onClick={openAssistant} />
      </div>

      <aside
        className={cn(
          "absolute z-50 flex w-[360px] origin-bottom-right flex-col overflow-hidden border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out",
          isFullscreen ? "inset-0 w-full rounded-none" : "bottom-4 right-4 top-4 rounded-xl",
          panelState === "open" && "translate-x-0 scale-100 opacity-100",
          panelState === "closing" && "pointer-events-none",
          panelState === "closed" && "pointer-events-none translate-x-[calc(100%+32px)] scale-95 opacity-0",
        )}
        aria-hidden={!isPanelVisible}
      >
        <header className="flex h-[56px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPanelView((v) => v === "history" ? "activeChat" : "history")} className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] hover:bg-[#f3f4f6]" aria-label="Toggle history">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {panelView === "history" ? (
              <h2 className="text-[15px] font-semibold text-[#1f2937]">Your Chats</h2>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e9f5ff] text-[#0868db]"><Sparkles className="h-3 w-3" /></span>
                <h2 className="text-[15px] font-semibold text-[#1f2937]">AURA</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {panelView === "activeChat" && (
              <>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] hover:bg-[#f3f4f6]"><Plus className="h-4 w-4" /></button>
                <button type="button" onClick={() => setIsFullscreen((f) => !f)} className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] hover:bg-[#f3f4f6]">
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </>
            )}
            <button type="button" onClick={closeAssistant} className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] hover:bg-[#f3f4f6]"><X className="h-4 w-4" /></button>
          </div>
        </header>

        {panelView === "history" ? (
          <AuraChatHistoryView onSelectChat={() => setPanelView("activeChat")} />
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("rounded-lg px-3 py-2 text-[13px] leading-5 shadow-sm", m.role === "assistant" ? "max-w-[92%] bg-[#E6F0FB] text-[#333]" : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]")}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 shadow-sm">
                  <span className="flex h-5 items-center gap-1">
                    <span className="aura-typing-dot" /><span className="aura-typing-dot [animation-delay:420ms]" /><span className="aura-typing-dot [animation-delay:840ms]" />
                  </span>
                </div>
              )}
              <div ref={scrollAnchorRef} />
            </div>
            <div className="border-t border-[#e2e5ec] bg-white p-3">
              <form className="flex min-h-[52px] items-end gap-2 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm" onSubmit={handleSubmit}>
                <button type="button" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5c5c5c] hover:bg-[#f3f6fb]"><Paperclip className="h-4 w-4" /></button>
                <textarea ref={textareaRef} rows={1} className="min-h-[52px] max-h-[160px] flex-1 resize-none overflow-y-hidden bg-transparent py-3.5 text-[14px] text-[#111827] outline-none placeholder:text-[#888]" placeholder="Ask AURA" value={draftMessage} onChange={(e) => setDraftMessage(e.target.value)} onKeyDown={handleKeyDown} disabled={isTyping} />
                <button type="submit" disabled={!draftMessage.trim() || isTyping} className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-45">
                  <img src={sendButtonIcon} alt="" className="h-11 w-11" />
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
