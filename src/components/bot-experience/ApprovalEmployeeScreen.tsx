import { type FormEvent, useEffect, useRef, useState } from "react";
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
import { AppShell } from "./AppShell";
import { getAvatarByName } from "../../lib/avatarHelper";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import { AuraLauncherButton } from "./AuraLauncherButton";
import { PageHeader } from "./PageHeader";
import { RequestCard } from "./RequestCard";
import { cn } from "../../lib/utils";
import sendButtonIcon from "../../assets/Send Button.svg";
import availabilityIcon from "../../assets/approval-employee/icon-availability.png";
import crossTrainingIcon from "../../assets/approval-employee/icon-cross-training.png";
import swapIcon from "../../assets/approval-employee/icon-swap.png";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RequestItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "Pending" | "Approved" | "Denied";
  iconSrc: string;
};

type ApprovalAuraMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const receivedRequests: RequestItem[] = [
  {
    id: "avail-1",
    title: "Availability Request",
    subtitle: "Wed, June 14",
    status: "Pending",
    iconSrc: availabilityIcon,
  },
  {
    id: "cross-1",
    title: "Cross Training Request",
    subtitle: "With Bison Bakers",
    status: "Pending",
    iconSrc: crossTrainingIcon,
  },
  {
    id: "swap-1",
    title: "Swap Request",
    subtitle: "With Alison Parker",
    status: "Pending",
    iconSrc: swapIcon,
  },
];

const requestDetail = {
  requestType: "Availability request",
  requestedDate: "Wed, June 14, 2024",
  requestedTime: "4h availability update requested",
  totalHours: "4h 00m",
  submittedOn: "Tue 6/11/24, 4:12:35 AM",
  reason: "Need an availability update for June 14 due to a personal commitment.",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-3 py-1">
      <span className="w-[120px] shrink-0 text-[14px] leading-5 text-[#5C5C5C]">
        {label}
      </span>
      <span
        className={cn(
          "flex-1 text-[14px] leading-5",
          highlight ? "font-medium text-[#333333]" : "text-[#333333]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function RequestDetailPanel() {
  return (
    <div className="flex-1 px-6 py-5">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold leading-7 text-[#333333]">
          Availability Request
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#1976D2] bg-white px-5 text-[14px] font-medium text-[#1976D2] transition hover:bg-[#E3F2FD]"
          >
            Approve
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#E53935] px-5 text-[14px] font-medium text-white transition hover:bg-[#D32F2F]"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Detail card */}
      <div className="mt-6 overflow-hidden rounded-lg border border-[#D9D9D9] bg-white py-3">
        <DetailRow label="Request Type:" value={requestDetail.requestType} />
        <DetailRow label="Requested Date:" value={requestDetail.requestedDate} highlight />
        <DetailRow label="Requested Time.:" value={requestDetail.requestedTime} />
        <DetailRow label="Total Hours:" value={requestDetail.totalHours} highlight />
        <DetailRow label="Submitted On:" value={requestDetail.submittedOn} />
        <DetailRow label="Reason / Comment:" value={requestDetail.reason} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Aura Assistant (lightweight, employee-context)                     */
/* ------------------------------------------------------------------ */

function ApprovalAuraAssistant() {
  const [panelState, setPanelState] = useState<"closed" | "open" | "closing">("closed");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ApprovalAuraMessage[]>([]);

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const nextIdRef = useRef(1);

  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function clearTimers() {
    if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    if (nudgeTimerRef.current) { window.clearTimeout(nudgeTimerRef.current); nudgeTimerRef.current = null; }
    if (typingTimerRef.current) { window.clearTimeout(typingTimerRef.current); typingTimerRef.current = null; }
  }

  function openAssistant() {
    clearTimers();
    setShouldNudgeLauncher(false);
    setPanelState("open");
    setIsFullscreen(false);
    setPanelView("activeChat");
    setDraftMessage("");

    if (messages.length === 0 && !isTyping) {
      setIsTyping(true);
      typingTimerRef.current = window.setTimeout(() => {
        setMessages([{
          id: nextIdRef.current++,
          role: "assistant",
          text: "Hi Sarah! I'm AURA, your AI assistant. I can help you understand your request statuses, explain approval timelines, or answer questions about your availability. What would you like to know?",
        }]);
        setIsTyping(false);
        typingTimerRef.current = null;
      }, 800);
    }
  }

  function closeAssistant() {
    clearTimers();
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

  function getAssistantResponse(input: string): string {
    const normalized = input.toLowerCase();

    if (normalized.includes("status") || normalized.includes("pending")) {
      return "You have 3 received requests — all currently in \"Pending\" status. Your Availability Request for Wed, June 14 is awaiting manager review. Cross Training and Swap requests are also pending approval.";
    }
    if (normalized.includes("availability") || normalized.includes("june 14")) {
      return "Your Availability Request for Wed, June 14 was submitted on Tue 6/11/24 at 4:12:35 AM. It requests a 4-hour availability update due to a personal commitment. The request is currently pending manager review.";
    }
    if (normalized.includes("approve") || normalized.includes("approval") || normalized.includes("how long")) {
      return "Approval timelines vary by request type. Availability requests are typically reviewed within 2-3 business days. Your manager will receive a notification about your pending requests.";
    }
    if (normalized.includes("cancel") || normalized.includes("withdraw")) {
      return "You can cancel a pending request by selecting it and clicking the 'Cancel' button. Once cancelled, it will be removed from the pending queue. Note: approved requests may require additional steps to reverse.";
    }
    if (normalized.includes("swap") || normalized.includes("alison")) {
      return "Your Swap Request with Alison Parker is currently pending. Once Alison and your manager both approve, the shift swap will be applied to the schedule.";
    }
    if (normalized.includes("cross training") || normalized.includes("bison")) {
      return "Your Cross Training Request with Bison Bakers is pending. This request will allow you to train in the Bakery department. Manager approval is required before scheduling.";
    }

    return "I can help you with your request statuses, approval timelines, or explain any details about your availability, swap, or cross-training requests. What would you like to know?";
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
      { id: nextIdRef.current++, role: "user", text: trimmedMessage },
    ]);
    setDraftMessage("");
    setIsTyping(true);

    typingTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: nextIdRef.current++, role: "assistant", text: getAssistantResponse(trimmedMessage) },
      ]);
      setIsTyping(false);
      typingTimerRef.current = null;
    }, 700);
  }

  function resizeComposer() {
    const textarea = composerTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "56px";
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(56, nextHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 180 ? "auto" : "hidden";
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible]);

  useEffect(() => {
    resizeComposer();
  }, [draftMessage, isPanelVisible]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <>
      {/* Launcher */}
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-6 sm:right-6",
          !showLauncher && "pointer-events-none translate-y-2 opacity-0",
          showLauncher && shouldNudgeLauncher && "aura-launcher-nudge",
        )}
      >
        <AuraLauncherButton onClick={openAssistant} />
      </div>

      {/* Panel */}
      <aside
        className={cn(
          "fixed z-50 flex w-[calc(100vw-24px)] max-w-[clamp(360px,28vw,420px)] origin-bottom-right flex-col overflow-hidden border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out",
          isFullscreen
            ? "bottom-0 right-0 top-0 w-full max-w-[clamp(360px,28vw,420px)] rounded-none sm:bottom-0 sm:right-0 sm:top-0"
            : "bottom-3 right-3 top-3 rounded-xl sm:bottom-5 sm:right-5 sm:top-16",
          panelState === "open" && "aura-panel-open translate-x-0 scale-100 opacity-100",
          panelState === "closing" && "aura-panel-closing pointer-events-none",
          panelState === "closed" && "pointer-events-none translate-x-[calc(100%+32px)] scale-95 opacity-0",
        )}
        aria-hidden={!isPanelVisible}
      >
        {/* Header */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#e5e7eb] bg-white px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelView((c) => (c === "history" ? "activeChat" : "history"))}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={panelView === "history" ? "Return to active chat" : "Open chat history"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {panelView === "history" ? (
              <h2 className="text-[16px] font-semibold leading-5 text-[#1f2937]">Your Chats</h2>
            ) : (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f5ff] text-[#0868db]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <h2 className="text-[16px] font-semibold leading-5 text-[#1f2937]">AURA</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            {panelView === "activeChat" ? (
              <>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="Add new"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen((c) => !c)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={closeAssistant}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Close AURA assistant"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {panelView === "history" ? (
          <AuraChatHistoryView onSelectChat={() => setPanelView("activeChat")} />
        ) : (
          <>
            {/* Messages */}
            <div className="scrollbar-slim min-h-0 flex-1 space-y-3 overflow-y-auto bg-white px-5 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "animate-[aura-message-in_180ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                    message.role === "assistant"
                      ? "max-w-[92%] bg-[#E6F0FB] text-[#333333]"
                      : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}

              {isTyping ? (
                <div className="max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 text-[#5c5c5c] shadow-sm">
                  <span className="sr-only">AURA AI is typing</span>
                  <span className="flex h-5 items-center gap-1" aria-hidden="true">
                    <span className="aura-typing-dot" />
                    <span className="aura-typing-dot [animation-delay:420ms]" />
                    <span className="aura-typing-dot [animation-delay:840ms]" />
                  </span>
                </div>
              ) : null}
              <div ref={scrollAnchorRef} />
            </div>

            {/* Composer */}
            <footer className="shrink-0 border-t border-[#e2e5ec] bg-white px-4 py-3">
              <form
                className="flex min-h-[56px] items-end gap-3 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm transition-[min-height] duration-200"
                onSubmit={handleSubmit}
              >
                <button
                  type="button"
                  className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#f3f6fb] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <textarea
                  ref={composerTextareaRef}
                  rows={1}
                  className="min-h-[56px] max-h-[180px] min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent py-4 text-[16px] leading-[1.4] text-[#111827] outline-none placeholder:text-[#888888]"
                  placeholder="Ask AURA"
                  aria-label="Ask AURA"
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled
                  className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="Send message"
                >
                  <img src={sendButtonIcon} alt="" className="h-12 w-12" aria-hidden="true" />
                </button>
              </form>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Screen                                                        */
/* ------------------------------------------------------------------ */

export function ApprovalEmployeeScreen() {
  const [activeTab, setActiveTab] = useState("my-request");
  const [activeSubTab, setActiveSubTab] = useState<"submitted" | "received">("received");

  const tabs = [
    { id: "calendar", label: "Calendar" },
    { id: "my-request", label: "My Request" },
    { id: "create-request", label: "Create Request" },
    { id: "my-compensations", label: "My Compensations" },
    { id: "manager-calendar", label: "Manager Calendar" },
  ];

  return (
    <AppShell
      activeNavLabel="Labor Model"
      showDemoBackLink
      profile={{
        name: "Sarah Johnson",
        role: "Employee",
        avatar: "SJ",
        badge: 1,
        avatarUrl: getAvatarByName("Sarah Johnson"),
      }}
    >
      <div className="flex h-full flex-col bg-[#F4F5FA]">
        {/* Page Header */}
        <div className="bg-[#F4F5FA] px-4 md:px-8 border-b border-[#E4E7EC]">
          <PageHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title="Requests"
            tabs={tabs}
            hideActiveTabBottomBorder
          />
        </div>

        {/* Sub-tabs row + Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E7EC] bg-white px-4 py-3 md:px-8">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 rounded-md bg-white">
            <button
              type="button"
              onClick={() => setActiveSubTab("submitted")}
              className={cn(
                "inline-flex h-8 items-center rounded-md px-3 text-[14px] font-medium transition",
                activeSubTab === "submitted"
                  ? "bg-[#0A68DB]/10 text-[#0A68DB]"
                  : "bg-white text-[#5c5c5c] hover:bg-[#F3F4F6]",
              )}
            >
              Submitted
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("received")}
              className={cn(
                "inline-flex h-8 items-center rounded-md px-3 text-[14px] font-medium transition",
                activeSubTab === "received"
                  ? "bg-[#0A68DB]/10 text-[#0A68DB]"
                  : "bg-white text-[#5c5c5c] hover:bg-[#F3F4F6]",
              )}
            >
              Received
            </button>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-2">
            {/* Date range picker */}
            <div className="flex h-9 items-center rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054]">
              <button type="button" className="mr-2 text-[#98A2B3] hover:text-[#344054]">
                &lt;
              </button>
              <span className="mr-2 whitespace-nowrap">6/13/24 - 6/19/24</span>
              <CalendarIcon className="h-4 w-4 text-[#98A2B3]" />
              <button type="button" className="ml-2 text-[#98A2B3] hover:text-[#344054]">
                &gt;
              </button>
            </div>

            {/* Type dropdown */}
            <div className="flex h-9 min-w-[130px] items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054]">
              <span>Availability+5</span>
              <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
            </div>

            {/* Status dropdown */}
            <div className="flex h-9 min-w-[110px] items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054]">
              <span>Pending</span>
              <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
            </div>
          </div>
        </div>

        {/* Main Content — two column layout */}
        <div className="flex min-h-0 flex-1 overflow-hidden bg-white">
          {/* Left Sidebar — Request List */}
          <div className="w-[340px] shrink-0 overflow-y-auto border-r border-[#E4E7EC] bg-white p-4">
            <div className="space-y-3">
              {receivedRequests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  title={request.title}
                  subtitle={request.subtitle}
                  status={request.status}
                  iconSrc={request.iconSrc}
                  isActive={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Right Panel — Request Detail */}
          <div className="min-w-0 flex-1 overflow-y-auto bg-white">
            <RequestDetailPanel />
          </div>
        </div>
      </div>

      {/* Aura Assistant */}
      <ApprovalAuraAssistant />
    </AppShell>
  );
}
