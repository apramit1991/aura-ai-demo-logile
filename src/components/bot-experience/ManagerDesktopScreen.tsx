import { type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction, useEffect, useRef, useState } from "react";
import avatar1 from "../../assets/avatar-1.png";
import avatar3 from "../../assets/avatar-3.png";
import avatar7 from "../../assets/avatar-7.png";
import { AppShell } from "./AppShell";
import { PageHeader } from "./PageHeader";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Filter,
  Grip,
  LayoutList,
  Maximize2,
  Minimize2,
  MoreVertical,
  Paperclip,
  Plus,
  Sparkles,
  UserRound,
  Info,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import sendButtonIcon from "../../assets/Send Button.svg";

type ManagerPanelState = "closed" | "open" | "closing";
type ManagerPhase = "initial" | "awaitProcessPrompt" | "awaitApprovalConfirm" | "readyToApprove" | "approved";
type ManagerMessageVariant = "ragTable" | "approvalSummary" | "successText";

type ManagerChatMessage = {
  id: number;
  role: "assistant" | "user";
  text?: string;
  variant?: ManagerMessageVariant;
};

export function ManagerDesktopScreen() {
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
    <AppShell 
      activeNavLabel="Labor Model"
      showDemoBackLink
      profile={{
        name: "Smith, Jane",
        role: "Department Manager",
        avatar: "SJ",
        badge: 1,
        avatarUrl: avatar7
      }}
    >
      <div className="flex h-full flex-col bg-[#F4F5FA]">
        {/* Page Header */}
        <div className="bg-[#F4F5FA] px-4 md:px-8 border-b border-[#E4E7EC]">
          <PageHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title="Approval"
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
        <div className="flex-1 overflow-auto bg-white p-4 md:p-8">
          <div className="mx-auto max-w-[1400px]">
            {/* Filter Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded bg-white p-2">
              <div className="flex items-center gap-2">
                {/* Date Picker (Mock) */}
                <div className="flex h-10 items-center rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054]">
                  <button className="mr-2 text-[#98A2B3] hover:text-[#344054]">
                    &lt;
                  </button>
                  <span className="mr-2">6/13/24 - 6/19/24</span>
                  <CalendarIcon className="h-4 w-4 text-[#98A2B3]" />
                  <button className="ml-2 text-[#98A2B3] hover:text-[#344054]">
                    &gt;
                  </button>
                </div>
                
                {/* Type Dropdown */}
                <div className="flex h-10 items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054] min-w-[140px]">
                  <span>Availability+5</span>
                  <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
                </div>

                {/* Status Dropdown */}
                <div className="flex h-10 items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054] min-w-[120px]">
                  <span>Pending+2</span>
                  <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Employee Selector */}
                <div className="flex h-10 items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#344054] min-w-[180px]">
                  <span>12 Employees Selected</span>
                  <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
                </div>

                {/* View Toggles & Actions */}
                <div className="flex items-center gap-1 ml-2">
                  <button 
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${viewMode === 'grid' ? 'bg-[#0B70D0] text-white' : 'text-[#667085] hover:bg-gray-100'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grip className="h-5 w-5" />
                  </button>
                  <button 
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${viewMode === 'list' ? 'bg-[#0B70D0] text-white' : 'text-[#667085] hover:bg-gray-100'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-5 w-5" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#667085] border border-[#D0D5DD] hover:bg-gray-50 ml-1">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#667085] border border-[#D0D5DD] hover:bg-gray-50">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex items-start gap-4">
              {/* Left Column: Request List */}
              <div className="w-[320px] shrink-0 flex flex-col gap-3">
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
                {/* Dynamically updated new requests */}
                <RequestCard 
                  title="Front End Dept/Employee 40h" 
                  subtitle="Sarah Johnson" 
                  status={sarahStatus} 
                />
                <RequestCard 
                  title="Availability Request" 
                  subtitle="Emily Carter" 
                  status={emilyStatus} 
                />
                <RequestCard 
                  title="Availability Request" 
                  subtitle="Ryan Anderson" 
                  status={ryanStatus} 
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
              </div>

              {/* Right Column: Request Details */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-semibold text-[#333333]">Paid Time Off Requests</h2>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={hasApproved}
                      className="flex h-10 items-center justify-center rounded-md bg-[#4B5563] px-5 text-[15px] font-medium text-white transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
                    >
                      Deny
                    </button>
                    <button
                      disabled={hasApproved}
                      className="flex h-10 items-center justify-center rounded-md bg-[#2563EB] px-5 text-[15px] font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
                    >
                      Approve
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-[#667085] ml-2">
                      <LayoutList className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
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
        <div className="fixed right-6 top-20 z-[100] animate-in slide-in-from-right-8 fade-in flex w-[380px] flex-col rounded-lg bg-[#027A48] p-4 text-white shadow-lg shadow-black/10">
          <div className="flex items-start gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 mt-0.5">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold leading-tight">Requests processed successfully</p>
              <p className="mt-1 text-[14px] text-white/90 leading-snug">Availability decisions have been updated for Sarah Johnson, Emily Carter, and Ryan Anderson.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-auto text-white/70 hover:text-white"
            >
              <Check className="h-4 w-4 hidden" /> {/* Hidden but keeping spacing */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

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
          text: "Sarah Johnson has been approved, Emily Carter has not been approved, and Ryan Anderson has been approved with adjustment.",
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
    return normalized.includes("process all requests") && normalized.includes("recommendation");
  }

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
          { text: "Sure. I found 3 new availability requests awaiting your review." },
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
    textarea.style.height = "56px";
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(56, nextHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 180 ? "auto" : "hidden";
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
          "fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-6 sm:right-6",
          !showLauncher && "pointer-events-none translate-y-2 opacity-0",
          showLauncher && shouldNudgeLauncher && "aura-launcher-nudge",
        )}
      >
        <button
          type="button"
          aria-label="Open AURA AI assistant"
          onClick={openAssistant}
          className="relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#33C7EA] to-[#2A2DBB] px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(42,45,187,0.35),0_0_24px_rgba(51,199,234,0.28)] outline-none ring-1 ring-white/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(42,45,187,0.42),0_0_32px_rgba(51,199,234,0.36)] focus-visible:ring-4 focus-visible:ring-[#7edff4]"
        >
          <Sparkles className="h-4 w-4 fill-white/20" />
          <span>AURA AI</span>
          <ChevronUp className="h-4 w-4 opacity-85" />
        </button>
      </div>

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
        <header className="flex h-[60px] items-center justify-between border-b border-[#e5e7eb] bg-white px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelView((current) => (current === "history" ? "activeChat" : "history"))}
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
                  onClick={() => setIsFullscreen((current) => !current)}
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
        <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-white px-5 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "animate-[aura-message-in_800ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                message.role === "assistant"
                  ? cn("max-w-[92%] bg-[#E6F0FB] text-[#333333]", message.variant && "max-w-full bg-transparent p-0 shadow-none")
                  : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
              )}
            >
              {message.text && !message.variant ? <p className="whitespace-pre-wrap">{message.text}</p> : null}
              {message.variant === "successText" && message.text ? (
                <div className="max-w-[92%] rounded-lg border border-[#b8e4c8] bg-[#ecfdf3] px-3 py-2.5 text-[14px] font-medium leading-5 text-[#166534] shadow-sm">
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

        <div className="border-t border-[#e2e5ec] bg-white p-4">
          <form className="flex min-h-[56px] items-end gap-3 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm transition-[min-height] duration-200" onSubmit={handleSubmit}>
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
              className="min-h-[56px] max-h-[180px] min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent py-4 text-[16px] leading-[1.4] text-[#111827] outline-none placeholder:text-[#888888] disabled:cursor-not-allowed"
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
        </div>
          </>
        )}
      </aside>
    </>
  );
}

function ManagerTypingIndicator() {
  return (
    <div className="animate-[aura-message-in_800ms_ease-out] max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 text-[#5c5c5c] shadow-sm">
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
    {
      employee: "Sarah Johnson",
      role: "Bakery Associate",
      impact: "Low Impact",
      recommendation: "Approve",
      avatarClassName: "bg-[#DCFCE7] text-[#15803D]",
      impactClassName: "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
      recommendationClassName: "text-[#15803D]",
      recommendationIconClassName: "bg-[#ECFDF3] text-[#15803D]",
      reason: "This is a long-pending request with low coverage impact. Approving it should not create significant pressure on the schedule.",
    },
    {
      employee: "Emily Carter",
      role: "Front End Associate",
      impact: "High Impact",
      recommendation: "Do Not Approve",
      avatarClassName: "bg-[#FEE2E2] text-[#DC2626]",
      impactClassName: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
      recommendationClassName: "text-[#DC2626]",
      recommendationIconClassName: "bg-[#FEF2F2] text-[#DC2626]",
      reason: "This request is not recommended because it falls during a high-pressure coverage window and has been recurring.",
    },
    {
      employee: "Ryan Anderson",
      role: "Grocery Associate",
      impact: "Medium Impact",
      recommendation: "Approve with Adjustment",
      avatarClassName: "bg-[#FEF3C7] text-[#C2410C]",
      impactClassName: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
      recommendationClassName: "text-[#C2410C]",
      recommendationIconClassName: "bg-[#FFFBEB] text-[#C2410C]",
      reason: "This request can be approved with adjustment because reducing the shift to 6 hours keeps coverage within a safe operating range.",
    },
  ];
  const summaryItems = [
    { value: "3", label: "Requests", icon: "document", className: "bg-[#EFF6FF] text-[#2563EB]" },
    { value: "1", label: "Low Impact", icon: "dot", className: "bg-[#16A34A]" },
    { value: "1", label: "Medium Impact", icon: "dot", className: "bg-[#F59E0B]" },
    { value: "1", label: "High Impact", icon: "dot", className: "bg-[#DC2626]" },
  ];

  return (
    <div className="max-w-full space-y-3 rounded-[18px] border border-[#E5E7EB] bg-white p-3 text-[#344054] shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-2 gap-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="grid min-h-[60px] grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            {item.icon === "document" ? (
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", item.className)}>
                <LayoutList className="h-4 w-4" />
              </span>
            ) : (
              <span className={cn("ml-2 h-3 w-3 shrink-0 rounded-full", item.className)} />
            )}
            <div className="min-w-0">
              <p className="text-[18px] font-semibold leading-5 text-[#111827]">{item.value}</p>
              <p className="text-[12px] font-medium leading-4 text-[#334155]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const isExpanded = expandedEmployee === row.employee;
          const reasonId = `manager-reason-${row.employee.toLowerCase().replace(/\s+/g, "-")}`;

          return (
            <article
              key={row.employee}
              className="rounded-[18px] border border-[#E5E7EB] bg-white p-4 text-[14px] shadow-[0_6px_18px_rgba(15,23,42,0.07)]"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] items-center gap-3">
                <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", row.avatarClassName)}>
                  <UserRound className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-[17px] font-semibold leading-6 text-[#111827]">{row.employee}</h4>
                  <p className="mt-0.5 text-[14px] font-medium leading-5 text-[#475569]">{row.role}</p>
                </div>
              </div>
              <span className={cn("shrink-0 rounded-full border px-3 py-1 text-[13px] font-semibold leading-5", row.impactClassName)}>
                {row.impact}
              </span>
            </div>

            <div className="mt-3 border-t border-[#E5E7EB] pt-3">
              <ManagerSnapshotField icon={Sparkles} label="AURA Recommendation" value={row.recommendation} iconClassName={row.recommendationIconClassName} valueClassName={row.recommendationClassName} />
            </div>

            <button
              type="button"
              onClick={() => setExpandedEmployee((current) => (current === row.employee ? null : row.employee))}
              aria-expanded={isExpanded}
              aria-controls={reasonId}
              className="mt-4 flex w-full items-center justify-between border-t border-dashed border-[#CBD5E1] pt-3 text-left text-[14px] font-medium leading-5 text-[#0066D9]"
              aria-label={`Why this recommendation for ${row.employee}?`}
            >
              <span>{isExpanded ? "Hide recommendation reason" : "Why this recommendation?"}</span>
              <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
            </button>

            {isExpanded ? (
              <div id={reasonId} className="mt-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#64748B] ring-1 ring-[#E5E7EB]">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-4 text-[#334155]">Reason</p>
                    <p className="mt-1 text-[13px] leading-5 text-[#334155]">{row.reason}</p>
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
    <div className="grid grid-cols-[34px_112px_minmax(0,1fr)] items-start gap-3">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconClassName)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1.5 text-[13px] font-medium leading-4 text-[#64748B]">{label}</span>
      <span className={cn("min-w-0 whitespace-normal break-words pt-1 text-[14px] font-semibold leading-5 text-[#111827]", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

function ManagerApprovalSummaryCard({ hasApproved, onApprove }: { hasApproved: boolean; onApprove: () => void }) {
  const rows = [
    {
      employee: "Sarah Johnson",
      decision: "Approved",
      reason: "Long-pending request with low coverage impact.",
      decisionClassName: "text-[#15803D]",
    },
    {
      employee: "Emily Carter",
      decision: "Not Approved",
      reason: "Recurring request during a high-pressure coverage window.",
      decisionClassName: "text-[#B91C1C]",
    },
    {
      employee: "Ryan Anderson",
      decision: "Approved with Adjustment",
      reason: "Reduced Thursday shift from 8h to 6h to maintain safe coverage.",
      decisionClassName: "text-[#B45309]",
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[#d8dce6] bg-white text-[#333333] shadow-sm">
      <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5">
        <h4 className="text-[14px] font-semibold text-[#111827]">Final Approval Summary</h4>
      </div>
      <div className="divide-y divide-[#E5E7EB] px-4 py-1 text-[14px]">
        {rows.map((row) => (
          <div key={row.employee} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold leading-5 text-[#111827]">{row.employee}</span>
              <span className={cn("max-w-[46%] text-right font-semibold leading-5", row.decisionClassName)}>{row.decision}</span>
            </div>
            <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
              <span className="font-medium text-[#475569]">Reason: </span>
              {row.reason}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#e5e7eb] p-3">
        <button
          type="button"
          onClick={onApprove}
          disabled={hasApproved}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#2563EB] px-4 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
        >
          {hasApproved ? "Processed" : "Process All Requests"}
        </button>
      </div>
    </div>
  );
}

function RequestCard({ title, subtitle, status, isActive = false }: { title: string, subtitle: string, status: string, isActive?: boolean }) {
  const statusStyles: Record<string, string> = {
    Pending: "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]",
    Approved: "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]",
    Denied: "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]",
    "Not Approved": "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]",
    "Approved with Adjustment": "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]"
  };
  
  const currentStyle = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className={`rounded-lg border p-4 ${isActive ? 'bg-[#F2F8FD] border-[#91C1F1]' : 'bg-white border-[#EAECF0]'}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-[14px] font-medium text-[#101828]">{title}</h4>
          <p className="mt-1 text-[13px] text-[#667085]">{subtitle}</p>
        </div>
        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[12px] font-medium ${currentStyle}`}>
          {status}
        </span>
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

  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white overflow-hidden">
      <div 
        className={cn(
          "flex items-center justify-between px-6 py-4",
          expandable ? "cursor-pointer" : "cursor-default",
        )}
        onClick={() => {
          if (!expandable) return;
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-center gap-4">
          <button 
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#D0D5DD]"
            style={{ backgroundColor: isChecked ? '#2563EB' : 'transparent', borderColor: isChecked ? '#2563EB' : '#D0D5DD' }}
            onClick={(e) => { e.stopPropagation(); setIsChecked(!isChecked); }}
          >
            {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </button>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F7] text-[12px] font-medium text-[#475467] overflow-hidden bg-[#FDE272]">
            {avatarSrc ? (
               <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
            ) : (
               <span>{name.charAt(0)}</span>
            )}
          </div>
          
          <div>
            <span className="block text-[17px] font-medium text-[#111827]">{name}</span>
            <span className="block mt-0.5 text-[15px] text-[#4B5563]">{dateStr} (Total Hrs - {totalHrs})</span>
          </div>
        </div>
        <div className="flex items-center">
          {isExpanded ? <ChevronUp className="h-6 w-6 text-[#6B7280]" /> : <ChevronDown className="h-6 w-6 text-[#6B7280]" />}
        </div>
      </div>
      
      {expandable && isExpanded && (
        <div className="border-t border-[#EAECF0] px-6 py-5">
          <div className="grid grid-cols-[180px_1fr] gap-y-3.5 text-[15px]">
            <div className="text-[#6B7280]">Request Type:</div>
            <div className="text-[#111827]">Paid Time Off (Vacation)</div>

            <div className="text-[#6B7280]">Benefit Balance:</div>
            <div className="text-[#111827]">
              Vacation (Hrs): 40h,<br/>
              Personal (Hrs): 24h
            </div>

            <div className="text-[#6B7280]">Request ID:</div>
            <div className="text-[#111827]">178965</div>

            <div className="text-[#6B7280]">Request org/Position:</div>
            <div className="text-[#111827]">(149) Bulk Foods/ Team Member</div>

            <div className="text-[#6B7280]">Request Time:</div>
            <div className="text-[#111827]">By Jenning Dwight/ (149) Employee Tue 1/11/21 4:12a</div>

            <div className="text-[#6B7280]">Action by Date:</div>
            <div className="text-[#111827]">Wed 1/10/21, 4:12p</div>

            <div className="text-[#6B7280]">Reason Code:</div>
            <div className="text-[#111827]">Vacation</div>

            <div className="text-[#6B7280]">Message:</div>
            <div className="text-[#111827] pr-8">
              By Dwight Jennings / (149) Employee Need an emergency vacation, need<br/>
              off from work (Tue 1/11/21 4:12a). Replied by (149) Supervisor
            </div>

            <div className="text-[#6B7280]">Request Details</div>
            <div className="text-[#2563EB] cursor-pointer hover:underline">Calendar View</div>
          </div>
        </div>
      )}
    </div>
  );
}
