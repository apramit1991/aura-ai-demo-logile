import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  ChevronUp,
  Clock3,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { RecommendationData } from "../../App";

type AuraState = "empty" | "partial" | "valid" | "error";
type PanelState = "closed" | "open" | "closing";

type AuraMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  variant?: "recommendation";
  applied?: boolean;
  messageId?: number;
};

type AuraAssistantProps = {
  onApplyRecommendation: (data: RecommendationData) => void;
};

const tooltipContent: Record<
  AuraState,
  { title: string; message: string; description: string }
> = {
  empty: {
    title: "AURA AI",
    message: "Create availability faster.",
    description: "Describe your availability in plain English.",
  },
  partial: {
    title: "AURA AI",
    message: "I can check this request before submission.",
    description: "Click to review.",
  },
  valid: {
    title: "AURA AI",
    message: "Request looks ready.",
    description: "All work group rules are satisfied.",
  },
  error: {
    title: "AURA AI",
    message: "2 rules need attention.",
    description: "Click to review and fix.",
  },
};

const quickActions = [
  "Create 30 hour availability request",
  "Suggest compliant schedule",
  "Check my request",
  "Explain work group rules",
  "Write request comment",
];

const recommendationRows: RecommendationData = [
  { day: "Monday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Tuesday", time: "12:00p - 4:00p", hours: "4h" },
  { day: "Thursday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Saturday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Sunday", time: "9:00a - 5:00p", hours: "8h" },
];

const initialAssistantMessage =
  "I reviewed the current availability request. The draft is ready for review, and all work group rules are satisfied.";

function getBadge(state: AuraState) {
  if (state === "error") {
    return {
      label: "!",
      className: "bg-[#fff4d6] text-[#8a4b00] ring-[#ffd56d]",
      icon: AlertTriangle,
    };
  }

  if (state === "partial") {
    return {
      label: "2",
      className: "bg-white text-[#5b2ad9] ring-white/70",
      icon: null,
    };
  }

  return null;
}

function getAssistantReply(action: string) {
  if (action === "Suggest compliant schedule") {
    return "A compliant option is Monday through Friday, 8:00a-2:00p. It stays within 4-10 hours per day and 1-5 days per week.";
  }

  if (action === "Check my request") {
    return "This request looks ready for review. Total hours, total days, and daily limits are all within the configured work group rules.";
  }

  if (action === "Explain work group rules") {
    return "Two limits need attention in this mock review: keep each day between 4 and 10 hours, and keep the week between 20 and 40 hours.";
  }

  return "Suggested comment: Requesting availability for 6/10/24 - 6/16/24 based on preferred weekly hours and current work group rules.";
}

function getStateAfterAction(action: string): AuraState {
  const normalizedAction = action.replace("-", " ");

  if (action === "Check my request") return "valid";
  if (action === "Suggest compliant schedule") return "partial";
  if (action === "Explain work group rules") return "error";
  if (normalizedAction.includes("30 hour")) return "partial";
  return "valid";
}

function getFreeTextReply(input: string) {
  return `I can review "${input}" against the availability rules and translate it into a compliant request draft.`;
}

function TypingIndicator() {
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

function RecommendationCard({
  applied,
  onApply,
}: {
  applied: boolean;
  onApply: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[14px] text-[#333333]">here&apos;s my recommendation:</p>
      <div className="overflow-hidden rounded-lg bg-[#fff4bf] text-[#333333] ring-1 ring-[#f2dfa1]">
        <div className="px-3 py-3">
          <div className="mb-4 flex items-center gap-2 text-[12px] text-[#9a3f0b]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>You may not meet your preferences for weekly total hours or days per week.</span>
          </div>

          <div className="space-y-1.5 text-[14px]">
            {recommendationRows.map((row) => (
              <div
                key={row.day}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3"
              >
                <span>{row.day}</span>
                <span>{row.time}</span>
                <span className="min-w-8 text-right text-[#9a3f0b]">{row.hours}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#e6d496] pt-2 text-[14px]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              43 hrs total
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              5 days/week
            </span>
          </div>
        </div>

        <div className="border-t border-[#e0ce8d] px-3 py-2 text-center">
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            className="inline-flex h-7 min-w-[106px] items-center justify-center rounded-md bg-primary px-4 text-[14px] font-medium text-white transition hover:bg-[#0858b9] disabled:cursor-default disabled:bg-[#8cadde]"
          >
            {applied ? "Applied" : "Yes, Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuraAssistant({ onApplyRecommendation }: AuraAssistantProps) {
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [requestState, setRequestState] = useState<AuraState>("valid");
  const [messages, setMessages] = useState<AuraMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [hasInitializedConversation, setHasInitializedConversation] = useState(false);
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const replyTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const tooltip = tooltipContent[requestState];
  const badge = useMemo(() => getBadge(requestState), [requestState]);
  const BadgeIcon = badge?.icon;
  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function appendMessage(message: Omit<AuraMessage, "id">) {
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

  function queueAssistantReply(
    reply: string | Omit<AuraMessage, "id" | "role">,
    delay = 780,
  ) {
    clearReplyTimer();
    setIsTyping(true);
    replyTimerRef.current = window.setTimeout(() => {
      appendMessage(
        typeof reply === "string"
          ? { role: "assistant", text: reply }
          : { role: "assistant", ...reply },
      );
      setIsTyping(false);
      replyTimerRef.current = null;
    }, delay);
  }

  function openAssistant() {
    clearCloseTimer();
    clearNudgeTimer();
    setShouldNudgeLauncher(false);
    setPanelState("open");

    if (!hasInitializedConversation) {
      setHasInitializedConversation(true);
      queueAssistantReply(initialAssistantMessage, 560);
    }
  }

  function closeAssistant() {
    clearCloseTimer();
    clearNudgeTimer();
    setPanelState("closing");
    closeTimerRef.current = window.setTimeout(() => {
      setPanelState("closed");
      setShowQuickActions(true);
      setShouldNudgeLauncher(true);
      closeTimerRef.current = null;
      nudgeTimerRef.current = window.setTimeout(() => {
        setShouldNudgeLauncher(false);
        nudgeTimerRef.current = null;
      }, 420);
    }, 260);
  }

  function handleQuickAction(action: string) {
    if (isTyping) return;

    const normalizedAction = action.replace("-", " ");

    appendMessage({ role: "user", text: action });
    setRequestState(getStateAfterAction(action));
    
    // Hide quick actions when "Create 30 hour availability request" is clicked
    if (normalizedAction.includes("30 hour")) {
      setShowQuickActions(false);
    }
    
    queueAssistantReply(
      normalizedAction.includes("30 hour")
        ? {
            text: "here's my recommendation:",
            variant: "recommendation",
            applied: false,
          }
        : getAssistantReply(action),
    );
  }

  function handleApplyRecommendation(messageId: number) {
    if (isTyping) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, applied: true } : message,
      ),
    );
    appendMessage({ role: "user", text: "Yes, Apply" });
    setRequestState("partial");
    onApplyRecommendation(recommendationRows);
    
    // Fill input field with suggestion
    setDraftMessage("Requesting 30 hour availability for the week of 6/10/24 - 6/16/24 as per the recommended schedule.");
    
    queueAssistantReply(
      "Applied this recommendation to the draft request. I kept the warning visible because the total is above your weekly preference.",
      620,
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = draftMessage.trim();
    if (!trimmedMessage || isTyping) return;

    appendMessage({ role: "user", text: trimmedMessage });
    setDraftMessage("");
    setRequestState("partial");
    queueAssistantReply(getFreeTextReply(trimmedMessage), 820);
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible]);

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
        <div className="group relative flex justify-end">
          <div className="pointer-events-none absolute bottom-[calc(100%+12px)] right-0 w-[286px] translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100">
            <div className="relative rounded-lg border border-[#d8dce6] bg-white px-4 py-3 text-left shadow-xl">
              <p className="text-[13px] font-semibold tracking-wide text-[#5b2ad9]">
                {tooltip.title}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#1f2937]">
                {tooltip.message}
              </p>
              <p className="mt-0.5 text-[13px] text-[#5c5c5c]">
                {tooltip.description}
              </p>
              <span className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-[#d8dce6] bg-white" />
            </div>
          </div>

          <button
            type="button"
            aria-label="Open AURA AI assistant"
            onClick={openAssistant}
            className="relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#0868db] via-[#4157e8] to-[#7c3aed] px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(38,87,207,0.35),0_0_24px_rgba(124,58,237,0.28)] outline-none ring-1 ring-white/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(38,87,207,0.42),0_0_32px_rgba(124,58,237,0.36)] focus-visible:ring-4 focus-visible:ring-[#8ab8ff]"
          >
            <Sparkles className="h-4 w-4 fill-white/20" />
            <span>AURA AI</span>
            <ChevronUp className="h-4 w-4 opacity-85" />
            {badge ? (
              <span
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 animate-[aura-badge_260ms_ease-out] items-center justify-center rounded-full px-1 text-[12px] font-bold shadow-md ring-2",
                  badge.className,
                )}
                aria-hidden="true"
              >
                {BadgeIcon ? <BadgeIcon className="h-3 w-3" /> : badge.label}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <aside
        className={cn(
          "fixed bottom-3 right-3 top-3 z-50 flex w-[calc(100vw-24px)] max-w-[420px] origin-bottom-right flex-col overflow-hidden rounded-xl border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out sm:bottom-5 sm:right-5 sm:top-16",
          panelState === "open" && "translate-x-0 scale-100 opacity-100",
          panelState === "closing" && "aura-panel-closing pointer-events-none",
          panelState === "closed" &&
            "pointer-events-none translate-x-[calc(100%+32px)] scale-95 opacity-0",
        )}
        aria-hidden={!isPanelVisible}
      >
        <header className="flex items-start justify-between border-b border-[#e2e5ec] bg-gradient-to-r from-[#f8fbff] to-[#f6f0ff] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0868db] to-[#7c3aed] text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[19px] font-semibold leading-6 text-[#1f2937]">
                AURA AI
              </h2>
              <p className="text-[13px] font-medium text-[#5c5c5c]">
                Availability Request Copilot
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAssistant}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-white hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Close AURA AI assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-[#e2e5ec] px-5 py-3">
          <div className="flex items-start gap-2 rounded-lg bg-[#f1f6ff] px-3 py-2">
            {requestState === "error" ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[#b45f00]" />
            ) : (
              <CheckCircle className="mt-0.5 h-4 w-4 text-[#1f8f55]" />
            )}
            <div>
              <p className="text-[14px] font-semibold text-[#333333]">
                {tooltip.message}
              </p>
              <p className="text-[13px] text-[#5c5c5c]">{tooltip.description}</p>
            </div>
          </div>
        </div>

        <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] px-5 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "animate-[aura-message-in_180ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                message.role === "assistant"
                  ? cn(
                      "max-w-[92%] bg-white text-[#333333]",
                      message.variant === "recommendation" && "bg-[#f4f5fb] p-3",
                    )
                  : "ml-auto max-w-[84%] bg-[#0868db] text-white",
              )}
            >
              {message.variant === "recommendation" ? (
                <RecommendationCard
                  applied={Boolean(message.applied)}
                  onApply={() => handleApplyRecommendation(message.id)}
                />
              ) : (
                message.text
              )}
            </div>
          ))}
          {isTyping ? <TypingIndicator /> : null}
          <div ref={scrollAnchorRef} />
        </div>

        <div className="border-t border-[#e2e5ec] bg-white p-4">
          {showQuickActions ? (
            <div className="mb-3 grid gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  disabled={isTyping}
                  className="rounded-md border border-[#d8dce6] bg-white px-3 py-2 text-left text-[14px] font-medium text-[#333333] transition hover:border-[#9ebcf0] hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:bg-[#f7f8fb] disabled:text-[#9aa1ad]"
                >
                  {action}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex items-center gap-2 rounded-md border border-[#c9cbd2] bg-white px-3 py-2"
            onSubmit={handleSubmit}
          >
            <input
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#888888] disabled:cursor-not-allowed"
              placeholder="Ask AURA to review this request"
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !draftMessage.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition hover:bg-[#0858b9] disabled:cursor-not-allowed disabled:bg-[#b7c5d8]"
              aria-label="Send message to AURA AI"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
