import { type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import avatar1 from "../../assets/avatar-1.png";
import avatar3 from "../../assets/avatar-3.png";
import avatar7 from "../../assets/avatar-7.png";
import logoUrl from "../../assets/logo.png";
import sendButtonIcon from "../../assets/Send Button.svg";
import { employee, headerActions, navItems } from "../../data/mockData";
import { PageHeader } from "./PageHeader";
import { RequestCard } from "./RequestCard";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import { AuraLauncherButton } from "./AuraLauncherButton";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { CalendarDetailsModal } from "./CalendarDetailsModal";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Grip,
  LayoutList,
  Maximize2,
  Menu,
  Minimize2,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  UserRound,
  Info,
  X,
} from "lucide-react";

// State and types
type ManagerPanelState = "closed" | "open" | "closing";
type ManagerPhase = "initial" | "awaitProcessPrompt" | "awaitApprovalConfirm" | "readyToApprove" | "approved";
type ManagerMessageVariant = "ragTable" | "approvalSummary" | "successText";

type ManagerChatMessage = {
  id: number;
  role: "assistant" | "user";
  text?: string;
  variant?: ManagerMessageVariant;
};

// Tablet Shell for the Manager
function TabletShell({ children }: { children: React.ReactNode }) {
  const janeAvatar = avatar7;

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
            <img src={janeAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />
            <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] text-[10px] text-white">1</span>
          </span>
          <span className="hidden min-w-0 text-left leading-tight sm:block">
            <span className="block truncate text-[13px] font-medium">Smith, Jane</span>
            <span className="block text-[13px] font-medium text-[#5c5c5c]">Department Manager</span>
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

// Tablet main component
export function ManagerTabletScreen() {
  const [activeTab, setActiveTab] = useState("manage-calendar");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sarahStatus, setSarahStatus] = useState<string>("Pending");
  const [emilyStatus, setEmilyStatus] = useState<string>("Pending");
  const [ryanStatus, setRyanStatus] = useState<string>("Pending");
  const [showToast, setShowToast] = useState(false);
  const [chatMessages, setChatMessages] = useState<ManagerChatMessage[]>([]);
  const [conversationPhase, setConversationPhase] = useState<ManagerPhase>("initial");
  const [isAuraTyping, setIsAuraTyping] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);

  const handleApproveRequests = () => {
    setSarahStatus("Approved");
    setEmilyStatus("Not Approved");
    setRyanStatus("Approved with Adjustment");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
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
                    title="Approval"
                    hideActiveTabBottomBorder
                    tabs={[
                      { id: "calendar", label: "Calendar" },
                      { id: "my-request", label: "My Request" },
                      { id: "create-request", label: "Create Request" },
                      { id: "my-compensations", label: "My Compensations" },
                      { id: "manage-calendar", label: "Manage Calendar" },
                    ]}
                  />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto bg-white p-4">
                  {/* Filter Bar */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded bg-white p-2">
                    <div className="flex items-center gap-2">
                      {/* Date Picker (Mock) */}
                      <div className="flex items-center">
                        <div className="flex h-9 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
                          <button type="button" className="flex w-9 items-center justify-center border-r border-[#c9cbd2]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-left h-5 w-5 text-[#5c5c5c]"><path d="m15 18-6-6 6-6"></path></svg></button><button type="button" className="flex min-w-[170px] items-center justify-between px-2 text-[16px] leading-[22px] 2xl:min-w-[198px] 2xl:text-[17px]"><span>6/13/24 - 6/19/24</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar h-[18px] w-[18px] text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></button><button type="button" className="flex w-9 items-center justify-center border-l border-[#c9cbd2]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right h-5 w-5 text-[#5c5c5c]"><path d="m9 18 6-6-6-6"></path></svg>
                          </button>
                        </div>
                      </div>

                      {/* Type Dropdown */}
                      <div className="flex h-9 items-center justify-between gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-2.5 text-[13px] text-[#344054] min-w-[120px]">
                        <span>Availability+5</span>
                        <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex h-9 items-center justify-between gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-2.5 text-[13px] text-[#344054] min-w-[100px]">
                        <span>Pending+2</span>
                        <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Employee Selector */}
                      <div className="flex h-9 items-center justify-between gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-2.5 text-[13px] text-[#344054] min-w-[150px]">
                        <span>12 Employees Selected</span>
                        <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
                      </div>

                      {/* View Toggles & Actions */}
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          className={`flex h-9 w-9 items-center justify-center rounded-md ${viewMode === 'grid' ? 'bg-[#0B70D0] text-white' : 'text-[#667085] hover:bg-gray-100'}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <Grip className="h-4.5 w-4.5" />
                        </button>
                        <button
                          className={`flex h-9 w-9 items-center justify-center rounded-md ${viewMode === 'list' ? 'bg-[#0B70D0] text-white' : 'text-[#667085] hover:bg-gray-100'}`}
                          onClick={() => setViewMode('list')}
                        >
                          <LayoutList className="h-4.5 w-4.5" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-md text-[#667085] border border-[#D0D5DD] hover:bg-gray-50 ml-1">
                          <Filter className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-md text-[#667085] border border-[#D0D5DD] hover:bg-gray-50">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="flex items-start gap-4">
                    {/* Left Column: Request List */}
                    <div className="w-[280px] shrink-0 flex flex-col gap-3">
                      {hasApproved ? (
                        <>
                          <RequestCard
                            title="Paid Time Off Requests"
                            subtitle="Multiple Days From Allison Park +4"
                            status="Pending"
                            isActive={true}
                          />
                          <RequestCard
                            title="Unpaid Time Off Requests"
                            subtitle="Multiple Days From Barry Allen +4"
                            status="Pending"
                          />
                        </>
                      ) : (
                        <>
                          <RequestCard
                            title="Availability Request"
                            subtitle="From Jenning Dwight +4"
                            status="Pending"
                            isActive={true}
                          />
                          <RequestCard
                            title="Paid Time Off Requests"
                            subtitle="Multiple Days From Allison Park +4"
                            status="Pending"
                          />
                          <RequestCard
                            title="Unpaid Time Off Requests"
                            subtitle="Multiple Days From Barry Allen +4"
                            status="Pending"
                          />
                        </>
                      )}
                      {/* Dynamically updated new requests */}
                      <RequestCard
                        title="Front End Dept/Employee 40h"
                        subtitle="Sarah Johnson"
                        status={sarahStatus}
                      />
                      {/* -------------------- */}
                      <RequestCard
                        title="Bid Shifts"
                        subtitle="From Jenning Dwight +4"
                        status="Approved"
                      />
                      <RequestCard
                        title="Paid Time Off Requests"
                        subtitle="Multiple Days From Allison Park +4"
                        status="Approved"
                      />
                      <RequestCard
                        title="Unpaid Time Off Requests"
                        subtitle="Multiple Days From Barry Allen +4"
                        status="Approved"
                      />
                      <RequestCard
                        title="Unpaid Time Off Requests"
                        subtitle="Multiple Days From Barry Allen +4"
                        status="Denied"
                      />
                      {hasApproved ? (
                        <RequestCard
                          title="Availability Request"
                          subtitle="From Jenning Dwight +4"
                          status="Approved"
                        />
                      ) : null}
                    </div>

                    {/* Right Column: Request Details */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-3.5">
                        <h2 className="text-[18px] font-semibold text-[#333333]">{hasApproved ? "Paid Time Off Requests" : "Availability Request"}</h2>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={hasApproved}
                            className="flex h-9 items-center justify-center rounded-md bg-[#4B5563] px-4 text-[14px] font-medium text-white transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
                          >
                            Deny
                          </button>
                          <button
                            disabled={hasApproved}
                            className="flex h-9 items-center justify-center rounded-md bg-[#2563EB] px-4 text-[14px] font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
                          >
                            Approve
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-[#667085] ml-1">
                            <LayoutList className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <EmployeeRequestCard
                          avatarSrc={avatar1}
                          name="Jenning Dwight"
                          dateStr="1/30/21 - 2/1/21"
                          totalHrs="40h"
                          defaultExpanded={true}
                          checked={true}
                        />
                        <EmployeeRequestCard
                          avatarSrc={avatar3}
                          name="Bessie Cooper"
                          dateStr="1/30/21 - 2/1/21"
                          totalHrs="40h"
                          checked={false}
                        />
                        <EmployeeRequestCard
                          name="Sarah Johnson"
                          dateStr="1/30/21 - 2/1/21"
                          totalHrs="40h"
                          checked={false}
                          expandable={false}
                        />
                        <EmployeeRequestCard
                          name="Emily Carter"
                          dateStr="1/30/21 - 2/1/21"
                          totalHrs="40h"
                          checked={false}
                          expandable={false}
                        />
                        <EmployeeRequestCard
                          name="Ryan Anderson"
                          dateStr="1/30/21 - 2/1/21"
                          totalHrs="40h"
                          checked={false}
                          expandable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ManagerAuraAssistant
                messages={chatMessages}
                setMessages={setChatMessages}
                phase={conversationPhase}
                setPhase={setConversationPhase}
                isTyping={isAuraTyping}
                setIsTyping={setIsAuraTyping}
                hasApproved={hasApproved}
                setHasApproved={setHasApproved}
                onApproveRequests={handleApproveRequests}
              />

              {/* Success Toast */}
              {showToast && (
                <div className="absolute right-6 top-16 z-[100] animate-in slide-in-from-right-8 fade-in flex w-[350px] flex-col rounded-lg bg-[#027A48] p-3 text-white shadow-lg shadow-black/10">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-tight">Requests processed successfully</p>
                      <p className="mt-1 text-[13px] text-white/90 leading-snug">Availability decisions have been updated for Sarah Johnson, Emily Carter, and Ryan Anderson.</p>
                    </div>
                    <button
                      onClick={() => setShowToast(false)}
                      className="ml-auto text-white/70 hover:text-white"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
              )}
            </TabletShell>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sub-components: ManagerAuraAssistant
function ManagerAuraAssistant({
  messages,
  setMessages,
  phase,
  setPhase,
  isTyping,
  setIsTyping,
  hasApproved,
  setHasApproved,
  onApproveRequests,
}: {
  messages: ManagerChatMessage[];
  setMessages: Dispatch<SetStateAction<ManagerChatMessage[]>>;
  phase: ManagerPhase;
  setPhase: Dispatch<SetStateAction<ManagerPhase>>;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
  hasApproved: boolean;
  setHasApproved: Dispatch<SetStateAction<boolean>>;
  onApproveRequests: () => void;
}) {
  const [panelState, setPanelState] = useState<ManagerPanelState>("closed");
  const [draftMessage, setDraftMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function appendMessage(message: Omit<ManagerChatMessage, "id">) {
    const newMessage = { id: nextMessageIdRef.current++, ...message };
    setMessages((current) => [...current, newMessage]);
    return newMessage.id;
  }

  function clearReplyTimer() {
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
  }

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function clearNudgeTimer() {
    if (nudgeTimerRef.current) {
      window.clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }
  }

  function queueAssistantTurn(turn: Array<Omit<ManagerChatMessage, "id" | "role">>, nextPhase?: ManagerPhase, delay = 1000) {
    clearReplyTimer();
    setIsTyping(true);
    replyTimerRef.current = window.setTimeout(() => {
      turn.forEach((message) => appendMessage({ role: "assistant", ...message }));
      if (nextPhase) setPhase(nextPhase);
      setIsTyping(false);
      replyTimerRef.current = null;
    }, delay);
  }

  function queueProcessedSuccessTurn() {
    clearReplyTimer();
    setIsTyping(true);
    replyTimerRef.current = window.setTimeout(() => {
      appendMessage({
        role: "assistant",
        variant: "successText",
        text: "Done — all availability requests have been processed.",
      });

      replyTimerRef.current = window.setTimeout(() => {
        appendMessage({
          role: "assistant",
          text: "Emily Carter has been dinied.",
        });
        setPhase("approved");
        setIsTyping(false);
        replyTimerRef.current = null;
      }, 420);
    }, 1000);
  }

  function normalizePrompt(value: string) {
    return value
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchesProcessAllPrompt(value: string) {
    const normalized = normalizePrompt(value);
    const hasProcess = normalized.includes("process");
    const hasRequest = normalized.includes("request");
    const hasRec = normalized.includes("recommendation");
    return hasProcess && hasRequest && hasRec;
  }

  // Matches prompt
  function matchesYesPrompt(value: string) {
    const normalized = normalizePrompt(value);
    return normalized === "yes" || normalized === "yes please";
  }

  function openAssistant() {
    clearCloseTimer();
    clearNudgeTimer();
    setShouldNudgeLauncher(false);
    setPanelState("open");
    setIsFullscreen(false);
    setPanelView("activeChat");
    setDraftMessage("");

    if (messages.length === 0 && !isTyping) {
      queueAssistantTurn(
        [{ text: "Hello Jane Smith, hope you’re doing well. What would you like to review today?" }],
        "initial",
        1000,
      );
    }
  }

  function closeAssistant() {
    clearCloseTimer();
    clearNudgeTimer();
    setPanelState("closing");
    closeTimerRef.current = window.setTimeout(() => {
      setPanelState("closed");
      setIsFullscreen(false);
      setShouldNudgeLauncher(true);
      closeTimerRef.current = null;
      nudgeTimerRef.current = window.setTimeout(() => {
        setShouldNudgeLauncher(false);
        nudgeTimerRef.current = null;
      }, 420);
    }, 260);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = draftMessage.trim();
    if (!trimmedMessage || isTyping) return;

    appendMessage({ role: "user", text: trimmedMessage });
    setDraftMessage("");

    if (phase === "initial") {
      queueAssistantTurn(
        [
          { text: "Sure. I found 1 new availability requests awaiting your review." },
          { variant: "ragTable" },
        ],
        "awaitProcessPrompt",
      );
      return;
    }

    if (phase === "awaitProcessPrompt") {
      if (matchesProcessAllPrompt(trimmedMessage)) {
        queueAssistantTurn(
          [{ text: "Should I go ahead and prepare the final approval action?" }],
          "awaitApprovalConfirm",
        );
        return;
      }

      queueAssistantTurn(
        [{ text: "Ask me to process all requests as per recommendation when you’re ready." }],
        "awaitProcessPrompt",
      );
      return;
    }

    if (phase === "awaitApprovalConfirm") {
      if (matchesYesPrompt(trimmedMessage)) {
        queueAssistantTurn(
          [
            { text: "Here’s your final approval summary." },
            { variant: "approvalSummary" },
          ],
          "readyToApprove",
        );
        return;
      }

      queueAssistantTurn(
        [{ text: "Please confirm with “Yes.” if you want me to prepare the final approval action." }],
        "awaitApprovalConfirm",
      );
    }
  }

  function handleApproveRequests() {
    if (isTyping || hasApproved) return;
    setHasApproved(true);
    setPhase("approved");
    onApproveRequests();
    queueProcessedSuccessTurn();
  }

  function resizeComposer() {
    const textarea = composerTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "52px";
    const nextHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = `${Math.max(52, nextHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 150 ? "auto" : "hidden";
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible, hasApproved]);

  useEffect(() => {
    resizeComposer();
  }, [draftMessage, isPanelVisible]);

  useEffect(() => {
    return () => {
      clearReplyTimer();
      clearCloseTimer();
      clearNudgeTimer();
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "absolute bottom-4 right-4 z-50 transition-all duration-300",
          !showLauncher && "pointer-events-none translate-y-2 opacity-0",
          showLauncher && shouldNudgeLauncher && "aura-launcher-nudge",
        )}
      >
        <AuraLauncherButton onClick={openAssistant} />
      </div>

      <aside
        className={cn(
          "absolute z-50 flex w-[350px] origin-bottom-right flex-col overflow-hidden border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out",
          isFullscreen
            ? "inset-0 w-full rounded-none"
            : "bottom-4 right-4 top-4 rounded-xl",
          panelState === "open" && "translate-x-0 scale-100 opacity-100",
          panelState === "closing" && "pointer-events-none",
          panelState === "closed" && "pointer-events-none translate-x-[calc(100%+32px)] scale-95 opacity-0",
        )}
        aria-hidden={!isPanelVisible}
      >
        <header className="flex h-14 items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelView((current) => (current === "history" ? "activeChat" : "history"))}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6]"
              aria-label={panelView === "history" ? "Return to active chat" : "Open chat history"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {panelView === "history" ? (
              <h2 className="text-[15px] font-semibold leading-5 text-[#1f2937]">Your Chats</h2>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e9f5ff] text-[#0868db]">
                  <Sparkles className="h-3 w-3" />
                </span>
                <h2 className="text-[15px] font-semibold leading-5 text-[#1f2937]">AURA</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {panelView === "activeChat" ? (
              <>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6]"
                  aria-label="Add new"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen((current) => !current)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6]"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={closeAssistant}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#333333]"
              aria-label="Close AURA assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {panelView === "history" ? (
          <AuraChatHistoryView onSelectChat={() => setPanelView("activeChat")} />
        ) : (
          <>
            <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-white px-4 py-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[13px] leading-5 shadow-sm",
                    message.role === "assistant"
                      ? cn("max-w-[92%] bg-[#E6F0FB] text-[#333333]", message.variant && "max-w-full bg-transparent p-0 shadow-none")
                      : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
                  )}
                >
                  {message.text && !message.variant ? <p className="whitespace-pre-wrap">{message.text}</p> : null}
                  {message.variant === "successText" && message.text ? (
                    <div className="max-w-[92%] rounded-lg border border-[#b8e4c8] bg-[#ecfdf3] px-3 py-2 text-[13px] font-medium leading-5 text-[#166534] shadow-sm">
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  ) : null}
                  {message.variant === "ragTable" ? <ManagerRagTableCard hasApproved={hasApproved} /> : null}
                  {message.variant === "approvalSummary" ? (
                    <ManagerApprovalSummaryCard hasApproved={hasApproved} onApprove={handleApproveRequests} />
                  ) : null}
                </div>
              ))}

              {isTyping ? <ManagerTypingIndicator /> : null}
              <div ref={scrollAnchorRef} />
            </div>

            <div className="border-t border-[#e2e5ec] bg-white p-3">
              <form className="flex min-h-[52px] items-end gap-2.5 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-1.5 shadow-sm" onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#f3f6fb]"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                <textarea
                  ref={composerTextareaRef}
                  rows={1}
                  className="min-h-[52px] max-h-[150px] min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent py-3.5 text-[14px] leading-relaxed text-[#111827] outline-none placeholder:text-[#888888] disabled:cursor-not-allowed"
                  placeholder="Ask AURA"
                  aria-label="Ask AURA"
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!draftMessage.trim() || isTyping}
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Send message"
                >
                  <img src={sendButtonIcon} alt="" className="h-10 w-10" aria-hidden="true" />
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function ManagerTypingIndicator() {
  return (
    <div className="max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 text-[#5c5c5c] shadow-sm">
      <span className="sr-only">AURA AI is typing</span>
      <span className="flex h-5 items-center gap-1" aria-hidden="true">
        <span className="aura-typing-dot" />
        <span className="aura-typing-dot [animation-delay:420ms]" />
        <span className="aura-typing-dot [animation-delay:840ms]" />
      </span>
    </div>
  );
}

function ManagerRagTableCard({ hasApproved }: { hasApproved: boolean }) {
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const rows = [
    // {
    //   employee: "Sarah Johnson",
    //   role: "Bakery Associate",
    //   impact: "Low Impact",
    //   requestedTime: "Wednesday morning, 6:00a–12:00p",
    //   requestedChange: "Unavailable Wednesday morning",
    //   recommendation: "Approve",
    //   avatarClassName: "bg-[#DCFCE7] text-[#15803D]",
    //   impactClassName: "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
    //   recommendationClassName: "text-[#15803D]",
    //   recommendationIconClassName: "bg-[#ECFDF3] text-[#15803D]",
    //   reason: "This is a long-pending request with low coverage impact. Approving it should not create significant pressure on the schedule.",
    // },
    {
      employee: "Emily Carter",
      role: "Front End Associate",
      impact: "High Impact",
      requestedTime: "Friday, 4:00p–8:00p",
      requestedChange: "Unavailable Friday 4p–8p",
      recommendation: "Deny",
      avatarClassName: "bg-[#FEE2E2] text-[#DC2626]",
      impactClassName: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
      recommendationClassName: "text-[#DC2626]",
      recommendationIconClassName: "bg-[#FEF2F2] text-[#DC2626]",
      reason: "This request is not recommended because it falls during a high-pressure coverage window and has been recurring.",
    },
    // {
    //   employee: "Ryan Anderson",
    //   role: "Grocery Associate",
    //   impact: "Medium Impact",
    //   requestedTime: "Thursday, reduced from 8h to 6h",
    //   requestedChange: "Reduce Thursday shift from 8h to 6h",
    //   recommendation: "Approve with Adjustment",
    //   avatarClassName: "bg-[#FEF3C7] text-[#C2410C]",
    //   impactClassName: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
    //   recommendationClassName: "text-[#C2410C]",
    //   recommendationIconClassName: "bg-[#FFFBEB] text-[#C2410C]",
    //   reason: "This request can be approved with adjustment because reducing the shift to 6 hours keeps coverage within a safe operating range.",
    // },
  ];

  const summaryItems = [
    { value: "3", label: "Requests", icon: "document", className: "bg-[#EFF6FF] text-[#2563EB]" },
    { value: "1", label: "Low Impact", icon: "dot", className: "bg-[#16A34A]" },
    { value: "1", label: "Medium Impact", icon: "dot", className: "bg-[#F59E0B]" },
    { value: "1", label: "High Impact", icon: "dot", className: "bg-[#DC2626]" },
  ];

  return (
    <div className="max-w-full space-y-2.5 rounded-[14px] border border-[#E5E7EB] bg-white p-2.5 text-[#344054] shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-2 gap-1.5">
        {/* {summaryItems.map((item) => (
          <div key={item.label} className="grid min-h-[50px] grid-cols-[24px_minmax(0,1fr)] items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            {item.icon === "document" ? (
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", item.className)}>
                <LayoutList className="h-3 w-3" />
              </span>
            ) : (
              <span className={cn("ml-1.5 h-2.5 w-2.5 shrink-0 rounded-full", item.className)} />
            )}
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-none text-[#111827]">{item.value}</p>
              <p className="text-[11px] font-medium leading-snug text-[#334155]">{item.label}</p>
            </div>
          </div>
        ))} */}
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => {
          const isExpanded = expandedEmployee === row.employee;
          const reasonId = `manager-reason-${row.employee.toLowerCase().replace(/\s+/g, "-")}`;

          return (
            <article
              key={row.employee}
              className="rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-[13px] shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2.5">
                <div className="grid min-w-0 grid-cols-[38px_minmax(0,1fr)] items-center gap-2.5">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", row.avatarClassName)}>
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate text-[14px] font-semibold leading-tight text-[#111827]">{row.employee}</h4>
                    <p className="mt-0.5 text-[12px] font-medium leading-none text-[#475569]">{row.role}</p>
                  </div>
                </div>
                <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-normal", row.impactClassName)}>
                  {row.impact}
                </span>
              </div>

              <div className="mt-2.5 space-y-2 border-t border-[#E5E7EB] pt-2.5">
                <ManagerSnapshotField icon={CalendarIcon} label="Requested Time" value={row.requestedTime} iconClassName="bg-[#F1F5F9] text-[#475569]" valueClassName="text-[#111827]" />
                <ManagerSnapshotField icon={LayoutList} label="Requested Change" value={row.requestedChange} iconClassName="bg-[#F1F5F9] text-[#475569]" valueClassName="text-[#111827]" />
                <ManagerSnapshotField icon={Sparkles} label="AURA Recommendation" value={row.recommendation} iconClassName={row.recommendationIconClassName} valueClassName={row.recommendationClassName} />
              </div>

              <button
                type="button"
                onClick={() => setExpandedEmployee((current) => (current === row.employee ? null : row.employee))}
                aria-expanded={isExpanded}
                aria-controls={reasonId}
                className="mt-2.5 flex w-full items-center justify-between border-t border-dashed border-[#CBD5E1] pt-2.5 text-left text-[13px] font-medium leading-normal text-[#0066D9]"
                aria-label={`Why this recommendation for ${row.employee}?`}
              >
                <span>{isExpanded ? "Hide recommendation reason" : "Why this recommendation?"}</span>
                <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
              </button>

              {isExpanded ? (
                <div id={reasonId} className="mt-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                  <div className="flex gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#64748B] ring-1 ring-[#E5E7EB]">
                      <Info className="h-3 w-3" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold leading-none text-[#334155]">Reason</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-[#334155]">{row.reason}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ManagerSnapshotField({
  icon: Icon,
  label,
  value,
  iconClassName,
  valueClassName,
}: {
  icon: typeof CalendarIcon;
  label: string;
  value: string;
  iconClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[28px_90px_minmax(0,1fr)] items-start gap-2">
      <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", iconClassName)}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="pt-1 text-[11px] font-medium leading-tight text-[#64748B]">{label}</span>
      <span className={cn("min-w-0 whitespace-normal break-words pt-0.5 text-[12px] font-semibold leading-snug text-[#111827]", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

function ManagerApprovalSummaryCard({ hasApproved, onApprove }: { hasApproved: boolean; onApprove: () => void }) {
  const rows = [
    // {
    //   employee: "Sarah Johnson",
    //   decision: "Approved",
    //   reason: "Long-pending request with low coverage impact.",
    //   decisionClassName: "text-[#15803D]",
    // },
    {
      employee: "Emily Carter",
      decision: "Deny",
      reason: "Recurring request during a high-pressure coverage window.",
      decisionClassName: "text-[#B91C1C]",
    },
    // {
    //   employee: "Ryan Anderson",
    //   decision: "Approved with Adjustment",
    //   reason: "Reduced Thursday shift from 8h to 6h to maintain safe coverage.",
    //   decisionClassName: "text-[#B45309]",
    // },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[#d8dce6] bg-white text-[#333333] shadow-sm">
      <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2">
        <h4 className="text-[13px] font-semibold text-[#111827]">Final Approval Summary</h4>
      </div>
      <div className="divide-y divide-[#E5E7EB] px-3.5 py-0.5 text-[13px]">
        {rows.map((row) => (
          <div key={row.employee} className="py-2.5">
            <div className="flex items-start justify-between gap-2.5">
              <span className="font-semibold leading-tight text-[#111827]">{row.employee}</span>
              <span className={cn("max-w-[46%] text-right font-semibold leading-tight", row.decisionClassName)}>{row.decision}</span>
            </div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#64748B]">
              <span className="font-medium text-[#475569]">Reason: </span>
              {row.reason}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#e5e7eb] p-2.5">
        <button
          type="button"
          onClick={onApprove}
          disabled={hasApproved}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-[#2563EB] px-3 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
        >
          {hasApproved ? "Processed" : "Process All Requests"}
        </button>
      </div>
    </div>
  );
}

function EmployeeRequestCard({
  avatarSrc,
  name,
  dateStr,
  totalHrs,
  defaultExpanded = false,
  checked = false,
  expandable = true,
}: {
  avatarSrc?: string;
  name: string;
  dateStr: string;
  totalHrs: string;
  defaultExpanded?: boolean;
  checked?: boolean;
  expandable?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isChecked, setIsChecked] = useState(checked);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white overflow-hidden text-[14px]">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3.5",
          expandable ? "cursor-pointer" : "cursor-default",
        )}
        onClick={() => {
          if (!expandable) return;
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border border-[#D0D5DD]"
            style={{ backgroundColor: isChecked ? '#2563EB' : 'transparent', borderColor: isChecked ? '#2563EB' : '#D0D5DD' }}
            onClick={(e) => { e.stopPropagation(); setIsChecked(!isChecked); }}
          >
            {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[11px] font-medium text-[#475467] overflow-hidden bg-[#FDE272]">
            {avatarSrc ? (
              <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span>{name.charAt(0)}</span>
            )}
          </div>

          <div>
            <span className="block text-[15px] font-medium text-[#111827]">{name}</span>
            <span className="block mt-0.5 text-[13px] text-[#4B5563]">{dateStr} ({totalHrs})</span>
          </div>
        </div>
        <div className="flex items-center">
          {isExpanded ? <ChevronUp className="h-5 w-5 text-[#6B7280]" /> : <ChevronDown className="h-5 w-5 text-[#6B7280]" />}
        </div>
      </div>

      {expandable && isExpanded && (
        <div className="border-t border-[#EAECF0] px-4 py-4 bg-[#FAFAFA]">
          <div className="grid grid-cols-[140px_1fr] gap-y-2.5 text-[13.5px]">
            <div className="text-[#6B7280]">Request Type:</div>
            <div className="text-[#111827]">Paid Time Off (Vacation)</div>

            <div className="text-[#6B7280]">Benefit Balance:</div>
            <div className="text-[#111827]">
              Vacation: 40h, Personal: 24h
            </div>

            <div className="text-[#6B7280]">Request ID:</div>
            <div className="text-[#111827]">178965</div>

            <div className="text-[#6B7280]">Position:</div>
            <div className="text-[#111827]">(149) Bulk Foods/ Team Member</div>

            <div className="text-[#6B7280]">Request Time:</div>
            <div className="text-[#111827]">By Jenning Dwight (Employee) Tue 1/11/21 4:12a</div>

            <div className="text-[#6B7280]">Action by Date:</div>
            <div className="text-[#111827]">Wed 1/10/21, 4:12p</div>

            <div className="text-[#6B7280]">Reason:</div>
            <div className="text-[#111827]">Vacation</div>

            <div className="text-[#6B7280]">Message:</div>
            <div className="text-[#111827] pr-2">
              By Dwight Jennings: Need emergency vacation.
            </div>

             <div className="text-[#6B7280]">Request Details:</div>
             <div 
               className="text-[#2563EB] cursor-pointer hover:underline"
               onClick={(e) => {
                 e.stopPropagation();
                 setShowCalendar(true);
               }}
             >
               Calendar View
             </div>
           </div>
         </div>
       )}
       {showCalendar && (
         <CalendarDetailsModal onClose={() => setShowCalendar(false)} />
       )}
     </div>
   );
 }
