import { type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction, useEffect, useRef, useState } from "react";
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
import { cn } from "../../lib/utils";
import sendButtonIcon from "../../assets/Send Button.svg";
import availabilityIcon from "../../assets/approval-employee/addpunch.svg";
import crossTrainingIcon from "../../assets/approval-employee/book-plus.png";

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
  headerBg = "bg-[#f3fcf1]",
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
          "flex h-[44px] items-center px-3 border border-[#dcdcdc]",
          headerBg,
          isFirst ? "rounded-tl-lg" : "",
          isLast ? "rounded-tr-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[16px] font-bold", dayColor)}>{day}</span>
      </div>
      <div
        className={cn(
          "flex min-h-[72px] items-center px-3 border border-[#dcdcdc] border-t-0",
          valueBg,
          isFirst ? "rounded-bl-lg" : "",
          isLast ? "rounded-br-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[16px]  font-medium leading-[1.4]", valueColor)}>{value}</span>
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
    <div className="flex flex-col gap-2">
      <p className="text-[15px] text-[#333]">{label}</p>
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
        "flex w-full items-center justify-between gap-4 rounded-lg border-2 px-5 py-4 text-left transition-colors",
        isActive
          ? "border-[#dcdcdc] bg-[rgba(10,104,219,0.1)]"
          : "border-[#dcdcdc] bg-white hover:bg-[#f8f9fb]",
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={cn(
            "flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px]",
            isActive ? "bg-white" : "bg-[#fbe8ff]",
          )}
        >
          <img src={icon} alt="" className="h-7 w-7 object-contain" />
        </div>
        <span className="text-[15px] font-medium text-[#333] leading-snug">{title}</span>
      </div>
      <span className="shrink-0 rounded-lg bg-[#fff5c5] px-3 py-1 text-[13px] text-[#7c360b] whitespace-nowrap">
        {status}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Screen                                                         */
/* ------------------------------------------------------------------ */

export function SkillGapEmployeeDesktopScreen() {
  const [activeTab, setActiveTab] = useState("my-request");
  const [subTab, setSubTab] = useState<"submitted" | "received">("received");
  const [selectedRequest, setSelectedRequest] = useState<"availability" | "crossTrain">("availability");
  const [actionState, setActionState] = useState<"pending" | "accepted" | "declined">("pending");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("initial");
  const [isAuraTyping, setIsAuraTyping] = useState(false);

  const sarahAvatar = getAvatarByName("Sarah Johnson");
  const isEmbedded = new URLSearchParams(window.location.search).get("embed") === "1";

  return (
    <AppShell
      activeNavLabel="Labor Model"
      showDemoBackLink={!isEmbedded}
      profile={{
        name: "Sarah Johnson",
        role: "Employee",
        avatar: "SJ",
        badge: 1,
        avatarUrl: sarahAvatar,
      }}
    >
      <div className="flex h-full flex-col bg-[#F4F5FA]">
        {/* Page Header */}
        <div className="bg-[#F4F5FA] px-4 md:px-6 border-b border-[#E4E7EC]">
          <PageHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title="ESS"
            hideActiveTabBottomBorder
            tabs={[
              { id: "calendar", label: "Calander" },
              { id: "my-request", label: "My Request" },
              { id: "create-request", label: "Create Request" },
              { id: "my-compensations", label: "My Compensations" },
              { id: "manage-calendar", label: "Manage Calendar" },
            ]}
          />
        </div>

        {/* Sub-tabs + filter bar */}
        <div className="flex items-center justify-between border-b border-[#e7e7e7] bg-white px-6 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSubTab("submitted")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[15px] transition-colors",
                subTab === "submitted"
                  ? "bg-[rgba(10,104,219,0.1)] font-medium text-[#0a68db]"
                  : "text-[#5c5c5c] hover:bg-gray-100",
              )}
            >
              Submitted
            </button>
            <button
              type="button"
              onClick={() => setSubTab("received")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[15px] transition-colors",
                subTab === "received"
                  ? "bg-[rgba(10,104,219,0.1)] font-medium text-[#0a68db]"
                  : "text-[#5c5c5c] hover:bg-gray-100",
              )}
            >
              Received
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="flex h-9 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
                <button type="button" className="flex w-9 items-center justify-center border-r border-[#c9cbd2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-left h-5 w-5 text-[#5c5c5c]"><path d="m15 18-6-6 6-6"></path></svg></button><button type="button" className="flex min-w-[170px] items-center justify-between px-2 text-[16px] leading-[22px] 2xl:min-w-[198px] 2xl:text-[17px]"><span>5/3/26 - 5/8/26</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar h-[18px] w-[18px] text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></button><button type="button" className="flex w-9 items-center justify-center border-l border-[#c9cbd2]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right h-5 w-5 text-[#5c5c5c]"><path d="m9 18 6-6-6-6"></path></svg>
                </button>
              </div>
            </div>

            <button
              type="button"
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#c1c1c1] bg-white px-3 text-[15px] text-[#333]"
            >
              <span>Availability+1</span>
              <ChevronDown className="h-4 w-4 text-[#888]" />
            </button>

            <button
              type="button"
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#c1c1c1] bg-white px-3 text-[15px] text-[#333]"
            >
              <span>Pending+1</span>
              <ChevronDown className="h-4 w-4 text-[#888]" />
            </button>
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: request list */}
          <div className="flex w-[450px] shrink-0 flex-col gap-4 overflow-y-auto p-4 bg-white">
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
          <div className="flex flex-1 flex-col overflow-y-auto border-l border-[#dcdcdc] bg-white p-3">
            {/* Detail header */}
            <div className="mb-3 flex items-start justify-between items-end gap-4">
              <h2 className="text-[22px] font-medium text-[#333] leading-tight">
                Adjust Availability Request
              </h2>
              <p className="text-[13px] text-[#888]">
                <span className="font-medium">Action By:</span>{" "}
                <span className="text-[#333]">Sun, 5/1/26</span>
              </p>
              {/* <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={actionState !== "pending"}
                    onClick={() => setActionState("declined")}
                    className={cn(
                      "flex h-[36px] items-center justify-center rounded-lg px-6 text-[15px] text-white transition",
                      actionState === "declined"
                        ? "bg-[#888] cursor-not-allowed"
                        : actionState === "accepted"
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
                      "flex h-[36px] items-center justify-center rounded-lg px-6 text-[15px] text-white transition",
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
                <p className="text-[13px] text-[#888]">
                  <span className="font-medium">Action By:</span>{" "}
                  <span className="text-[#333]">Sun, 5/1/26</span>
                </p>
              </div> */}
            </div>

            {/* Detail content card */}
            <div className="flex-1 rounded-xl border border-[#dcdcdc] p-3">
              {/* Card header */}
              <div className="border-b border-[#dcdcdc] pb-4 mb-5">
                <h3 className="text-[22px] font-medium text-[#333]">(149)Bakery, Baking(52h)</h3>
                <div className="mt-2 flex items-center justify-between flex-wrap gap-2 text-[15px]">
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
              <div className="flex gap-5 items-start">
                {/* Left: availability tables */}
                <div className="flex flex-1 flex-col gap-5 min-w-0">
                  <AvailabilityTable
                    label="Sarah Availability(39h)"
                    days={[
                      { day: "Mon", value: "6:00a\n-5:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                      { day: "Tue", value: "6:00a - 2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                      { day: "Fri", value: "10:00a - 4:00p", headerBg: "bg-white", valueBg: "bg-white" },
                      { day: "Sat", value: "6:00a - 2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                      { day: "Sun", value: "10:00a - 4:00p", headerBg: "bg-white", valueBg: "bg-white" },
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

                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] text-[#333]">Proposed Changes</p>
                    <div className="rounded-lg bg-[#FFFCEA] px-4 py-3 text-[14px] text-[#0A68DB]">
                      Wed 6:00a - 12:00p, Fri 4:00p - 7:00p, Sun 6:00a - 10:00a.
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={actionState !== "pending"}
                        onClick={() => setActionState("declined")}
                        className={cn(
                          "flex h-[36px] items-center justify-center rounded-lg px-6 text-[15px] text-white transition",
                          actionState === "declined"
                            ? "bg-[#888] cursor-not-allowed"
                            : actionState === "accepted"
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
                          "flex h-[36px] items-center justify-center rounded-lg px-6 text-[15px] text-white transition",
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


                </div>

                {/* Right: Supervisor Message */}
                <div className="w-[414px] shrink-0">
                  <p className="mb-2 text-[15px] font-medium text-[#0a68db] text-[16px] ">Supervisor Message</p>
                  <div className="rounded-lg bg-[#EDF3FF] p-4 text-[16px] leading-relaxed text-[#333333]">
                    <p className="font-semibold mb-1">Request Impact:</p>
                    <p className="mb-3">
                      Please review the Proposed availability and changes.
                    </p>
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

      <ManagerAuraAssistant
        messages={chatMessages}
        setMessages={setChatMessages}
        phase={chatPhase}
        setPhase={setChatPhase}
        isTyping={isAuraTyping}
        setIsTyping={setIsAuraTyping}
      />

      {actionState !== "pending" && (
        <div className="fixed right-6 top-20 z-[100] animate-in slide-in-from-right-8 fade-in flex w-[340px] flex-col rounded-lg bg-[#027A48] p-4 text-white shadow-lg shadow-black/10">
          <div className="flex items-start gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold leading-tight">
                Request {actionState === "accepted" ? "Accepted" : "Declined"}
              </p>
              <p className="mt-1 text-[14px] text-white/90 leading-snug">
                The Adjust Availability Request has been {actionState === "accepted" ? "accepted" : "declined"}.
              </p>
            </div>
            <button
              onClick={() => setActionState("pending")}
              className="ml-auto text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  AURA Assistant Panel                                                */
/* ------------------------------------------------------------------ */

function ManagerAuraAssistant({
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
  const nextMessageIdRef = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function appendMessage(message: Omit<ChatMessage, "id">) {
    const newMessage = { id: nextMessageIdRef.current++, ...message };
    setMessages((current) => [...current, newMessage]);
    return newMessage.id;
  }

  function clearReplyTimer() {
    if (replyTimerRef.current) { window.clearTimeout(replyTimerRef.current); replyTimerRef.current = null; }
  }
  function clearCloseTimer() {
    if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }
  function clearNudgeTimer() {
    if (nudgeTimerRef.current) { window.clearTimeout(nudgeTimerRef.current); nudgeTimerRef.current = null; }
  }

  function queueAssistantReply(text: string, delay = 1000) {
    clearReplyTimer();
    setIsTyping(true);
    replyTimerRef.current = window.setTimeout(() => {
      appendMessage({ role: "assistant", text });
      setIsTyping(false);
      replyTimerRef.current = null;
    }, delay);
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
      queueAssistantReply(
        "Hello! I'm AURA, your AI assistant. I can help you review the Adjust Availability Request or answer any questions you have.",
        800,
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
    const trimmed = draftMessage.trim();
    if (!trimmed || isTyping) return;

    appendMessage({ role: "user", text: trimmed });
    setDraftMessage("");
    setPhase("done");
    queueAssistantReply(
      "Based on the Supervisor Message, these proposed availability changes have no negative impact on your schedule preferences. I'd recommend accepting this request.",
    );
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  function resizeComposer() {
    const textarea = composerTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "56px";
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(56, nextHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 180 ? "auto" : "hidden";
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible]);

  useEffect(() => {
    resizeComposer();
  }, [draftMessage, isPanelVisible]);

  useEffect(() => {
    return () => { clearReplyTimer(); clearCloseTimer(); clearNudgeTimer(); };
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
        <AuraLauncherButton onClick={openAssistant} />
      </div>

      <aside
        className={cn(
          "fixed z-50 flex w-[calc(100vw-24px)] max-w-[clamp(360px,28vw,420px)] origin-bottom-right flex-col overflow-hidden border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out",
          isFullscreen
            ? "bottom-0 right-0 top-0 w-full max-w-[clamp(360px,28vw,420px)] rounded-none"
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
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937]"
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
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937]" aria-label="Add new">
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen((current) => !current)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937]"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={closeAssistant}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#333333]"
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
            <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-white px-5 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "animate-[aura-message-in_800ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                    message.role === "assistant"
                      ? "max-w-[92%] bg-[#E6F0FB] text-[#333333]"
                      : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
              {isTyping ? (
                <div className="animate-[aura-message-in_800ms_ease-out] max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 text-[#5c5c5c] shadow-sm">
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

            <div className="border-t border-[#e2e5ec] bg-white p-4">
              <form
                className="flex min-h-[56px] items-end gap-3 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm"
                onSubmit={handleSubmit}
              >
                <button type="button" className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#f3f6fb]" aria-label="Attach file">
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
                  disabled={!draftMessage.trim() || isTyping}
                  className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
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
