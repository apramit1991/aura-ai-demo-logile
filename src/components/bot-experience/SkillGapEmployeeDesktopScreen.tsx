import {
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  Check,
  CheckCircle2,
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
import { getCounterRequest, saveCounterRequest, CounterRequest } from "../../lib/negotiationService";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type PanelState = "closed" | "open" | "closing";

/**
 * AuraFlowStep — follows the exact approved script:
 *
 * initial           → Panel just opened, greeting queued
 * awaitAction       → Availability card shown, waiting for Accept/Decline/Adjust
 * adjustPrompt      → "What days would you like to make adjustments to?"
 * adjustAwaitInput  → Waiting for Sarah's typed adjustment request
 * adjustChecking    → Aura is checking (auto-advances with typing delay)
 * adjustCounterOffer→ "These adjustments cannot be made, 12pm–2pm instead?"
 * adjustCounterOffer2→ Friday 12pm – 3pm instead?
 * adjustSubmitCounterRequest→ Custom counter-proposal entry form
 * adjustCounterInput→ Waiting for Sarah's typed response to counter-offer
 * adjustFinalConfirm→ "Sure, I'll raise this to manager" + updated calendar + [Yes][No]
 * adjustSuccess     → "A request has been sent. Here is the request ID."
 * acceptSuccess     → Accept confirmed, request ID shown
 * declineSuccess    → Decline confirmed
 * done              → Conversation complete, free follow-up
 */
type AuraFlowStep =
  | "initial"
  | "awaitAction"
  | "adjustPrompt"
  | "adjustAwaitInput"
  | "adjustChecking"
  | "adjustCounterOffer"
  | "adjustChooseDeclineOrCounter"
  | "adjustSubmitCounterRequest"
  | "adjustSelectOtherSlots"
  | "adjustCounterInput"
  | "adjustFinalConfirm"
  | "adjustSuccess"
  | "acceptSuccess"
  | "declineSuccess"
  | "done";

type MessageVariant =
  | "availabilityCard"
  | "actionButtons"
  | "requestedCalendar"
  | "yesNoButtons"
  | "successCard"
  | "customCounterRequestForm"
  | "slotPicker";

type AuraChatMessage = {
  id: number;
  role: "assistant" | "user";
  text?: string;
  content?: React.ReactNode;
  variant?: MessageVariant;
  availabilityAction?: "accepted" | "declined" | "adjusted";
  yesNoChoice?: "yes" | "no";
  isSuccess?: boolean;
  slotPickerSubmitted?: boolean;
  counterRequestData?: {
    counter: string;
    coverage: string;
  };
};
/* ------------------------------------------------------------------ */
/*  Page-level sub-components                                           */
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
        <span className={cn("text-[16px] font-medium leading-[1.4]", valueColor)}>{value}</span>
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
/*  Chat bubble variant components                                      */
/* ------------------------------------------------------------------ */

/** A single day column — matches the main screen's DayColumn style */
function ChatDayCol({
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
  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Day header */}
      <div
        className={cn(
          "flex h-[44px] items-center justify-center border border-[#dcdcdc]",
          headerBg,
          isFirst ? "rounded-tl-lg" : "",
          isLast ? "rounded-tr-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[14px] font-bold", highlighted ? "text-[#e27c00]" : "text-[#888]")}>{day}</span>
      </div>
      {/* Time value */}
      <div
        className={cn(
          "flex min-h-[64px] items-center justify-center px-1 border border-[#dcdcdc] border-t-0 text-center",
          valueBg,
          isFirst ? "rounded-bl-lg" : "",
          isLast ? "rounded-br-lg" : "",
          !isFirst ? "border-l-0" : "",
        )}
      >
        <span className={cn("text-[13px] font-medium leading-[1.35] whitespace-pre-wrap", highlighted ? "text-[#e27c00]" : "text-[#333]")}>
          {value}
        </span>
      </div>
    </div>
  );
}

/** A compact table row: label + horizontal day columns, matching screen style */
function ChatAvailabilityTable({
  label,
  sublabel,
  days,
  labelColor = "text-[#444]",
  headerBg,
}: {
  label: string;
  sublabel?: string;
  days: { day: string; value: string; highlighted?: boolean; headerBg?: string; valueBg?: string }[];
  labelColor?: string;
  headerBg?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("px-1.5 py-1.5 rounded-md", headerBg)}>
        <p className={cn("text-[13px] font-semibold uppercase tracking-wide", labelColor)}>{label}<span > </span><span className="text-[12px] text-[#888]">{sublabel}</span></p>
      </div>
      <div className="flex w-full">
        {days.map((d, i) => (
          <ChatDayCol
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

/**
 * The main availability card shown in the initial greeting.
 * Uses the same column-table style as the main screen.
 */
function ChatAvailabilityCard({
  actionTaken,
}: {
  actionTaken?: "accepted" | "declined" | "adjusted";
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#dcdcdc] bg-white p-3 shadow-sm">
      {/* Original */}
      {/* <ChatAvailabilityTable
        label="Original Availability"
        sublabel="39h"
        labelColor="text-[#3a7d44]"
        headerBg="bg-[#f3fcf1]"
        days={[
          { day: "Mon", value: "6:00a\n5:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
          { day: "Tue", value: "6:00a\n2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
          { day: "Fri", value: "10:00a\n4:00p" },
          { day: "Sat", value: "6:00a\n2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
          { day: "Sun", value: "10:00a\n4:00p" },
        ]}
      /> */}

      {/* Divider */}
      <div className="border-t border-dashed border-[#dcdcdc]" />

      {/* Proposed */}
      <ChatAvailabilityTable
        label="Proposed Availability"
        sublabel="50h"
        labelColor="text-[#7c360b]"
        headerBg="bg-[#fff8e6]"
        days={[
          { day: "Mon", value: "6:00a\n5:00p" },
          { day: "Tue", value: "6:00a\n2:00p" },
          { day: "Wed", value: "6:00a\n12:00p", highlighted: true },
          { day: "Fri", value: "10:00a\n7:00p", highlighted: true },
          { day: "Sat", value: "6:00a\n2:00p" },
          { day: "Sun", value: "6:00a\n4:00p", highlighted: true },
        ]}
      />

      {/* Status strip — shown after a decision is made */}
      {actionTaken && (
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-[13px] font-semibold text-center",
            actionTaken === "accepted" && "bg-[#ecfdf3] text-[#166534]",
            actionTaken === "declined" && "bg-[#fef2f2] text-[#991b1b]",
            actionTaken === "adjusted" && "bg-[#eff6ff] text-[#1e40af]",
          )}
        >
          {actionTaken === "accepted" && "Accepted"}
          {actionTaken === "declined" && "Declined"}
          {actionTaken === "adjusted" && "Adjustment requested"}
        </div>
      )}
    </div>
  );
}

/**
 * The "requested" calendar shown before submitting to manager.
 * Uses the same column-table style as the main screen, with Wed highlighted in blue.
 */
function ChatRequestedCalendar() {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#0a68db] bg-white p-3 shadow-sm">
      <ChatAvailabilityTable
        label="Adjustment Request"
        sublabel="Pending manager review"
        labelColor="text-[#0a68db]"
        headerBg="bg-[#EDF3FF]"
        days={[
          { day: "Mon", value: "6:00a\n5:00p" },
          { day: "Tue", value: "6:00a\n2:00p" },
          { day: "Wed", value: "8:00a\noff 10a", highlighted: true },
          { day: "Fri", value: "10:00a\n7:00p" },
          { day: "Sat", value: "6:00a\n2:00p" },
          { day: "Sun", value: "6:00a\n4:00p" },
        ]}
      />
    </div>
  );
}

/** Yes / No buttons */
function ChatYesNoButtons({
  onYes,
  onNo,
  choiceMade,
}: {
  onYes: () => void;
  onNo: () => void;
  choiceMade?: "yes" | "no";
}) {
  const isDisabled = !!choiceMade;
  return (
    <div className="flex gap-2 mt-1">
      <button
        type="button"
        disabled={isDisabled}
        onClick={!isDisabled ? onYes : undefined}
        className={cn(
          "flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition",
          choiceMade === "yes"
            ? "bg-[#0a68db] text-white cursor-not-allowed"
            : isDisabled
              ? "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
              : "bg-[#0a68db] text-white hover:bg-[#0856b8] active:scale-95",
        )}
      >
        Yes
      </button>
      <button
        type="button"
        disabled={isDisabled}
        onClick={!isDisabled ? onNo : undefined}
        className={cn(
          "flex-1 rounded-lg border py-2.5 text-[13px] font-semibold transition",
          choiceMade === "no"
            ? "border-[#4f4f4f] bg-[#4f4f4f] text-white cursor-not-allowed"
            : isDisabled
              ? "border-[#e5e7eb] bg-[#f9fafb] text-[#9ca3af] cursor-not-allowed"
              : "border-[#c1c1c1] bg-white text-[#333] hover:bg-[#f8f9fb] active:scale-95",
        )}
      >
        No
      </button>
    </div>
  );
}

/** Success card shown after request is sent */
function ChatSuccessCard({ requestId }: { requestId: string }) {
  return (
    <div className="rounded-xl border border-[#059669] overflow-hidden bg-white shadow-sm">
      {/* <div className="flex items-center gap-2 px-4 py-2.5 bg-[#059669]">
        <Check className="h-3.5 w-3.5 text-white" />
        <span className="text-[12px] font-semibold text-white">Request Sent to Manager</span>
      </div> */}
      <div className="px-4 py-3">
        {/* <p className="text-[13px] text-[#333] leading-snug">
          Your manager will review the adjustment and respond within 48 hours.
        </p> */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#888]">Request ID:</span>
          <span className="rounded-lg bg-[#d1fae5] px-2.5 py-1 text-[12px] font-mono font-bold text-[#065f46] tracking-wide">
            {requestId}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatCustomCounterRequestForm({
  onSubmit,
  isSubmitted
}: {
  onSubmit: (counter: string, coverage: string) => void;
  isSubmitted: boolean;
}) {
  const [counter, setCounter] = useState("Sat 6a-12p");
  const [coverage, setCoverage] = useState("50%");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#dcdcdc] bg-white p-4 shadow-sm">
      <p className="text-[14px] font-semibold text-[#0a68db]">Submit Counter-Proposal</p>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-slate-500">Proposed Day & Time Slot</label>
        <input
          type="text"
          disabled={isSubmitted}
          value={counter}
          onChange={(e) => setCounter(e.target.value)}
          className="h-9 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-900 shadow-sm focus:border-[#0a68db] focus:ring-1 focus:ring-[#0a68db]"
        />
      </div>

      <div className="flex flex-col gap-1 hidden">
        <label className="text-[12px] font-medium text-slate-500">Estimated Coverage Contribution</label>
        <input
          type="text"
          disabled={isSubmitted}
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
          className="h-9 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-900 shadow-sm focus:border-[#0a68db] focus:ring-1 focus:ring-[#0a68db]"
        />
      </div>

      <button
        type="button"
        disabled={isSubmitted}
        onClick={() => onSubmit(counter, coverage)}
        className={cn(
          "h-9 w-full rounded-lg text-[13px] font-semibold text-white transition",
          isSubmitted
            ? "bg-[#888] cursor-not-allowed"
            : "bg-[#0a68db] hover:bg-[#0856b8] active:scale-95"
        )}
      >
        {isSubmitted ? "Submitted to Manager" : "Submit to Manager"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Toast Component                                            */
/* ------------------------------------------------------------------ */

function SuccessToast({
  onClose,
  title = "Request sent successfully",
  message = "Jenning Dwight's availability adjustment request has been sent.",
}: {
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-6 top-6 z-[100] w-[390px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-5">{title}</p>
          <p className="mt-1 text-[13px] leading-5 text-white/90">{message}</p>
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

/* ------------------------------------------------------------------ */
/*  Toast Notification Component                                        */
/* ------------------------------------------------------------------ */

function ToastNotification({
  onClose,
  title,
  message,
  variant = "success",
}: {
  onClose: () => void;
  title: string;
  message: string;
  variant?: "success" | "error";
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-6 top-6 z-[100] w-[390px] rounded-lg p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] animate-in slide-in-from-right-8 fade-in",
        variant === "success" ? "bg-[#1f8f46]" : "bg-[#E22D20]"
      )}
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-5">{title}</p>
          <p className="mt-1 text-[13px] leading-5 text-white/90">{message}</p>
        </div>
        <button
          type="button"
          aria-label="Close message"
          onClick={onClose}
          className="rounded p-1 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Screen                                                         */
/* ------------------------------------------------------------------ */

export function SkillGapEmployeeDesktopScreen() {
  const [activeTab, setActiveTab] = useState("my-request");
  const [subTab, setSubTab] = useState<"submitted" | "received">("received");
  const [selectedRequest, setSelectedRequest] = useState<"availability" | "crossTrain">("availability");
  const [actionState, setActionState] = useState<"pending" | "accepted" | "declined" | "counterSubmitted">("pending");
  const [askAuraToast, setAskAuraToast] = useState<{ title: string; message: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<AuraChatMessage[]>([]);
  const [chatFlowStep, setChatFlowStep] = useState<AuraFlowStep>("initial");
  const [isAuraTyping, setIsAuraTyping] = useState(false);
  const [counterRequest, setCounterRequest] = useState<CounterRequest | null>(null);

  useEffect(() => {
    if (!askAuraToast) return;
    const timeoutId = window.setTimeout(() => setAskAuraToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [askAuraToast]);

  useEffect(() => {
    // Initial load
    setCounterRequest(getCounterRequest());

    const handleStorageChange = () => {
      setCounterRequest(getCounterRequest());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const jenningAvatar = getAvatarByName("Jenning Dwight");
  const isEmbedded = new URLSearchParams(window.location.search).get("embed") === "1";

  return (
    <AppShell
      activeNavLabel="Labor Model"
      showDemoBackLink={!isEmbedded}
      profile={{
        name: "Jenning Dwight",
        role: "Employee",
        avatar: "JD",
        badge: 1,
        avatarUrl: jenningAvatar,
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
              // { id: "calendar", label: "Calander" },
              { id: "my-request", label: "My Request" },
              { id: "create-request", label: "Create Request" },
              { id: "my-compensations", label: "My Compensations" },
              // { id: "manage-calendar", label: "Manage Calendar" },
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-left h-5 w-5 text-[#5c5c5c]"><path d="m15 18-6-6 6-6"></path></svg></button><button type="button" className="flex min-w-[170px] items-center justify-between px-2 text-[16px] leading-[22px] 2xl:min-w-[198px] 2xl:text-[17px]"><span>5/3/26 - 5/9/26</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar h-[18px] w-[18px] text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></button><button type="button" className="flex w-9 items-center justify-center border-l border-[#c9cbd2]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right h-5 w-5 text-[#5c5c5c]"><path d="m9 18 6-6-6-6"></path></svg>
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
              status={
                actionState === "accepted"
                  ? "Accepted"
                  : actionState === "declined"
                    ? "Declined"
                    : counterRequest
                      ? counterRequest.status === "Pending"
                        ? "Pending Manager Review"
                        : counterRequest.status
                      : "Pending"
              }
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
            </div>

            {/* Detail content card */}
            <div className="flex-1 rounded-xl border border-[#dcdcdc] p-3">
              {/* Card header */}
              <div className="border-b border-[#dcdcdc] pb-4 mb-5">
                <h3 className="text-[22px] font-medium text-[#333]">(149)Bakery, Baking(50h)</h3>
                <div className="mt-2 flex items-center justify-between flex-wrap gap-2 text-[15px]">
                  <p>
                    <span className="text-[#888]">Effective Start-End date:</span>{" "}
                    <span className="text-[#333] font-medium">5/3/26 - 5/9/26</span>
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
                    label={
                      counterRequest?.status === "Approved"
                        ? "Jenning Availability (Adjusted, 37h)"
                        : "Jenning Availability(39h)"
                    }
                    days={[
                      { day: "Mon", value: "6:00a\n-5:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                      { day: "Tue", value: "6:00a - 2:00p", headerBg: "bg-[#f3fcf1]", valueBg: "bg-[#f3fcf1]" },
                      { day: "Fri", value: "10:00a - 4:00p", headerBg: "bg-white", valueBg: "bg-white" },
                      {
                        day: "Sat",
                        value: counterRequest?.status === "Approved" ? "8:00a - 2:00p" : "6:00a - 2:00p",
                        highlighted: counterRequest?.status === "Approved",
                        headerBg: counterRequest?.status === "Approved" ? "bg-[#fff8e6]" : "bg-[#f3fcf1]",
                        valueBg: counterRequest?.status === "Approved" ? "bg-[#fff8e6]" : "bg-[#f3fcf1]",
                      },
                      { day: "Sun", value: "10:00a - 4:00p", headerBg: "bg-white", valueBg: "bg-white" },
                    ]}
                  />

                  <AvailabilityTable
                    label="Proposed Availability(50h)"
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
                    {counterRequest && counterRequest.status !== "Pending" ? (
                      <div
                        className={cn(
                          "rounded-lg px-4 py-3 text-[14px] font-medium border",
                          counterRequest.status === "Approved" && "bg-[#ecfdf3] border-[#a7f3d0] text-[#166534]",
                          counterRequest.status === "Declined" && "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"
                        )}
                      >
                        {counterRequest.status === "Approved" && (
                          <span>
                            Approved: Manager approved counter-proposal for <strong>{counterRequest.counter}</strong> ({counterRequest.coverage} coverage). Jennin's availability has been updated.
                          </span>
                        )}
                        {counterRequest.status === "Declined" && (
                          <span>
                            Declined: Manager declined counter-proposal for <strong>{counterRequest.counter}</strong> ({counterRequest.coverage} coverage).
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-lg bg-[#FFFCEA] px-4 py-3 text-[14px] text-[#0A68DB]">
                        Wed 8:00a - 2:00p, Fri 4:00p - 7:00p, Sun 6:00a - 10:00a.
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-1 shrink-0">
                    <div className="flex items-center gap-3">
                      {counterRequest ? (
                        <span
                          className={cn(
                            "rounded-full px-4 py-1.5 text-[14px] font-semibold border",
                            counterRequest.status === "Pending" && "bg-blue-50 border-blue-200 text-blue-700",
                            counterRequest.status === "Approved" && "bg-green-50 border-green-200 text-green-700",
                            counterRequest.status === "Declined" && "bg-red-50 border-red-200 text-red-700"
                          )}
                        >
                          {counterRequest.status === "Pending" ? "Pending Manager Review" : `Counter-Proposal ${counterRequest.status}`}
                        </span>
                      ) : (
                        <>
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
                              "flex h-[36px] items-center justify-center rounded-lg px-6 text-[15px] transition",
                              actionState === "accepted"
                                ? "bg-[#E7E7E7] text-[#888888] cursor-not-allowed"
                                : actionState === "declined"
                                  ? "bg-[#888] text-white cursor-not-allowed"
                                  : "bg-[#0a68db] text-white hover:bg-[#0856b8]"
                            )}
                          >
                            {actionState === "accepted" ? "Accepted" : "Accept"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Supervisor Message */}
                <div className="w-[414px] shrink-0">
                  <p className="mb-2 text-[15px] font-medium text-[#0a68db] text-[16px]">Supervisor Message</p>
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

      {/* Aura AI Chat Panel */}
      <EmployeeAuraAssistant
        messages={chatMessages}
        setMessages={setChatMessages}
        flowStep={chatFlowStep}
        setFlowStep={setChatFlowStep}
        isTyping={isAuraTyping}
        setIsTyping={setIsAuraTyping}
        setActionState={setActionState}
        setAskAuraToast={setAskAuraToast}
        setCounterRequest={setCounterRequest}
      />

      {/* Page-level toast on Accept / Decline */}
      {actionState !== "pending" && actionState !== "counterSubmitted" && (
        <ToastNotification
          title={
            actionState === "accepted"
              ? "Request Accepted"
              : "Request Declined"
          }
          message={
            actionState === "accepted"
              ? "The adjust availability request has been accepted."
              : "The adjust availability request has been declined."
          }
          onClose={() => setActionState("pending")}
          variant={actionState === "declined" ? "error" : "success"}
        />
      )}

      {askAuraToast ? (
        <SuccessToast
          onClose={() => setAskAuraToast(null)}
          title={askAuraToast.title}
          message={askAuraToast.message}
        />
      ) : null}
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Aura Employee Assistant — Scripted Chat Panel                       */
/* ------------------------------------------------------------------ */

const REQUEST_ID = "ADJ-2026-8842";

function EmployeeAuraAssistant({
  messages,
  setMessages,
  flowStep,
  setFlowStep,
  isTyping,
  setIsTyping,
  setActionState,
  setAskAuraToast,
  setCounterRequest,
}: {
  messages: AuraChatMessage[];
  setMessages: Dispatch<SetStateAction<AuraChatMessage[]>>;
  flowStep: AuraFlowStep;
  setFlowStep: Dispatch<SetStateAction<AuraFlowStep>>;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
  setActionState: Dispatch<SetStateAction<"pending" | "accepted" | "declined" | "counterSubmitted">>;
  setAskAuraToast: Dispatch<SetStateAction<{ title: string; message: string } | null>>;
  setCounterRequest: Dispatch<SetStateAction<CounterRequest | null>>;
}) {
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [draftMessage, setDraftMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slotSubmitted, setSlotSubmitted] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const t1Ref = useRef<number | null>(null);
  const t2Ref = useRef<number | null>(null);
  const t3Ref = useRef<number | null>(null);
  const t4Ref = useRef<number | null>(null);
  const nextIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";

  function addMsg(msg: Omit<AuraChatMessage, "id">) {
    const m: AuraChatMessage = {
      id: nextIdRef.current++,
      ...msg,
    };

    setMessages((prev) => [...prev, m]);
    return m.id;
  }

  function clearTimers() {
    [t1Ref, t2Ref, t3Ref, t4Ref].forEach((r) => {
      if (r.current) { window.clearTimeout(r.current); r.current = null; }
    });
  }

  function clearCloseTimer() {
    if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }

  function clearNudgeTimer() {
    if (nudgeTimerRef.current) { window.clearTimeout(nudgeTimerRef.current); nudgeTimerRef.current = null; }
  }

  /** Helper: show typing → add message → optional callback */
  function delay(ms: number, timerRef: React.MutableRefObject<number | null>, fn: () => void) {
    timerRef.current = window.setTimeout(fn, ms);
  }

  /* ---------------------------------------------------------------- */
  /*  Open panel — show scripted greeting on first open               */
  /* ---------------------------------------------------------------- */

  function openAssistant() {
    clearCloseTimer();
    clearNudgeTimer();
    setShouldNudgeLauncher(false);
    setPanelState("open");
    setIsFullscreen(false);
    setPanelView("activeChat");
    setDraftMessage("");

    if (messages.length === 0 && !isTyping) {
      setIsTyping(true);
      // Step 1: greeting text (800ms)
      delay(800, t1Ref, () => {
        addMsg({
          role: "assistant",
          text: "Hey Jenning! Here is a proposed availability calendar for you, that aligns with your skills and supports the store.",
        });
        setIsTyping(true);
        // Step 2: availability card (1200ms)
        delay(1200, t2Ref, () => {
          addMsg({ role: "assistant", variant: "availabilityCard" });
          setIsTyping(true);
          // Step 3: conversational prompt to reply (800ms)
          delay(800, t3Ref, () => {
            addMsg({
              role: "assistant",
              content: (
                <>
                  Please let me know how you'd like to proceed. You can{" "}
                  <span className="font-semibold">accept</span> the request,{" "}
                  <span className="font-semibold">decline</span> it, or{" "}
                  <span className="font-semibold">suggest an adjustment</span>.
                </>
              ),
            });
            setIsTyping(false);
            setFlowStep("awaitAction");
          });
        });
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Close panel                                                      */
  /* ---------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------- */
  /*  Accept flow                                                      */
  /* ---------------------------------------------------------------- */

  function handleAccept(cardMsgId: number | null = null) {
    // Freeze the availability card buttons if triggered from a card
    if (cardMsgId !== null) {
      setMessages((prev) =>
        prev.map((m) => (m.id === cardMsgId ? { ...m, availabilityAction: "accepted" } : m)),
      );
    }
    addMsg({ role: "user", text: "Accept" });
    setFlowStep("acceptSuccess");
    setActionState("accepted");
    setIsTyping(true);
    delay(900, t1Ref, () => {
      addMsg({
        role: "assistant",
        text: "Great! Your acceptance has been submitted. Smith Jane will be notified.",
        variant: "successCard",
      });
      setIsTyping(false);
      setFlowStep("done");
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Decline flow                                                     */
  /* ---------------------------------------------------------------- */

  function handleDecline(cardMsgId: number | null = null) {
    // Freeze the availability card buttons if triggered from a card
    if (cardMsgId !== null) {
      setMessages((prev) =>
        prev.map((m) => (m.id === cardMsgId ? { ...m, availabilityAction: "declined" } : m)),
      );
    }
    addMsg({ role: "user", text: "Decline" });
    setFlowStep("declineSuccess");
    setActionState("declined");
    setIsTyping(true);
    delay(900, t1Ref, () => {
      addMsg({
        role: "assistant",
        text: "Understood. The request has been declined. Your current availability remains unchanged. Smith Jane will be notified.",
      });
      setIsTyping(false);
      setFlowStep("done");
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Adjust flow — Step 1: prompt                                     */
  /* ---------------------------------------------------------------- */

  function handleAdjust(cardMsgId: number | null = null) {
    // Freeze the availability card status strip if triggered from a card
    if (cardMsgId !== null) {
      setMessages((prev) =>
        prev.map((m) => (m.id === cardMsgId ? { ...m, availabilityAction: "adjusted" } : m)),
      );
    }
    addMsg({ role: "user", text: "Adjust" });
    setFlowStep("adjustPrompt");
    setIsTyping(true);
    delay(900, t1Ref, () => {
      addMsg({ role: "assistant", text: "What days would you like to make adjustments to?" });
      setIsTyping(false);
      setFlowStep("adjustAwaitInput");
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Adjust flow — Step 2: Sarah's input → checking → counter-offer  */
  /* ---------------------------------------------------------------- */

  function handleAdjustInput(userText: string) {
    addMsg({ role: "user", text: userText });
    setDraftMessage("");
    setFlowStep("adjustChecking");
    setIsTyping(true);
    // checking delay → counter-offer
    delay(1800, t1Ref, () => {
      addMsg({
        role: "assistant",
        content: (
          <span>
            These adjustments cannot be made. Would you like to take <span className="font-bold">8a – 12p</span> slot instead?
          </span>
        ),
      });
      setIsTyping(false);
      setFlowStep("adjustCounterOffer");
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Adjust flow — Step 3: Sarah rejects counter-offer → final confirm*/
  /* ---------------------------------------------------------------- */

  function handleCounterOffer1Response(userText: string) {
    const trimmed = userText.trim();
    const lower = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

    function intentsAccept() {
      return (
        lower.includes("accept") ||
        lower.includes("approve") ||
        lower.includes("looks good") ||
        lower.includes("go ahead") ||
        lower.includes("proceed") ||
        lower.includes("sounds good") ||
        lower.includes("yes") ||
        lower.includes("sure") ||
        lower.includes("ok") ||
        lower.includes("okay") ||
        lower.includes("yep") ||
        lower.includes("yup") ||
        lower.includes("yeah") ||
        lower.includes("that works")
      );
    }

    addMsg({ role: "user", text: trimmed });
    setDraftMessage("");
    setIsTyping(true);

    if (intentsAccept()) {
      // 1. Automatically approve the 8am–12pm slot (no request needed)
      saveCounterRequest({
        id: REQUEST_ID,
        employee: "Jenning Dwight",
        original: "Wed 12a-2p",
        counter: "Wed 8a-12p",
        coverage: "100%",
        status: "Approved",
        negotiationCount: 2
      });
      if (setCounterRequest) {
        setCounterRequest(getCounterRequest());
      }

      setAskAuraToast({
        title: "Requests sent successfully",
        message: "We've confirmed your 8a–12p slot.",
      });

      setFlowStep("adjustSelectOtherSlots");
      delay(900, t1Ref, () => {
        // 2. Respond: "Your 8a–12p slot is confirmed" — styled as green success bubble
        addMsg({
          role: "assistant",
          text: "Your 8a–12p slot is confirmed",
          isSuccess: true,
        });
        setIsTyping(true);
        delay(900, t2Ref, () => {
          // 3. Then immediately follow with slot picker card
          addMsg({
            role: "assistant",
            text: "Here are a few other slots available — would you like to request one?",
          });
          setIsTyping(true);
          delay(600, t3Ref, () => {
            addMsg({
              role: "assistant",
              variant: "slotPicker",
            });
            setIsTyping(false);
          });
        });
      });
    } else {
      // User rejected Wednesday proposal. Transition to choose decline or counter step
      setFlowStep("adjustChooseDeclineOrCounter");
      delay(1000, t1Ref, () => {
        addMsg({
          role: "assistant",
          text: "I understand. Since we couldn't find a matching recommendation, you can either decline this or submit your own counter-request.",
        });
        setIsTyping(false);
      });
    }
  }

  // handleCounterOffer2Response removed

  function handleCustomCounterSubmit(msgId: number, counter: string, coverage: string) {
    // Freeze the form card
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, counterRequestData: { counter, coverage } } : m))
    );
    addMsg({ role: "user", text: `Submitted counter-proposal: ${counter}` });
    setFlowStep("done");
    setIsTyping(false);

    // Save to localStorage using our new utility!
    saveCounterRequest({
      id: REQUEST_ID,
      employee: "Jenning Dwight",
      original: "Wed 12a-2p",
      counter,
      coverage,
      status: "Pending",
      negotiationCount: 2
    });

    // Also update main page state immediately
    setCounterRequest(getCounterRequest());

    // Show success toast immediately
    setAskAuraToast({
      title: "Requests sent successfully",
      message: "We’ve sent the adjustment proposal to your manager.",
    });

    // Submit immediate message replies in chat
    addMsg({
      role: "assistant",
      text: "Your counter-proposal has been submitted. Smith Jane will be notified.",
    });
    addMsg({ role: "assistant", variant: "successCard" });
  }

  /* ---------------------------------------------------------------- */
  /*  Yes/No buttons after calendar shown                              */
  /* ---------------------------------------------------------------- */

  function handleFinalYes(yesNoMsgId: number) {
    // Freeze the yes/no buttons
    setMessages((prev) =>
      prev.map((m) => (m.id === yesNoMsgId ? { ...m, yesNoChoice: "yes" } : m)),
    );
    addMsg({ role: "user", text: "Yes" });
    setFlowStep("adjustSuccess");
    setIsTyping(true);
    delay(900, t1Ref, () => {
      addMsg({
        role: "assistant",
        text: "A request to your manager has been sent. Here is your request ID.",
      });
      setIsTyping(true);
      delay(900, t2Ref, () => {
        addMsg({ role: "assistant", variant: "successCard" });
        setIsTyping(false);
        setFlowStep("done");
      });
    });
  }

  function handleFinalNo(yesNoMsgId: number) {
    // Freeze the yes/no buttons
    setMessages((prev) =>
      prev.map((m) => (m.id === yesNoMsgId ? { ...m, yesNoChoice: "no" } : m)),
    );
    addMsg({ role: "user", text: "No" });
    setFlowStep("done");
    setIsTyping(true);
    delay(800, t1Ref, () => {
      addMsg({ role: "assistant", text: "No problem! The request was not sent. Let me know if you'd like to Accept, Decline, or try a different Adjustment." });
      setIsTyping(false);
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Free-text submission handler                                     */
  /* ---------------------------------------------------------------- */

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draftMessage.trim();
    if (!trimmed || isTyping) return;

    const lower = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

    function getSlotSelected(text: string) {
      const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.includes("122") || clean.includes("12pm2pm") || clean.includes("12to2") || clean.includes("12p2p") || clean.includes("12pmto2pm")) {
        return "12pm–2pm";
      }
      if (clean.includes("24") || clean.includes("2pm4pm") || clean.includes("2to4") || clean.includes("2p4p") || clean.includes("2pmto4pm")) {
        return "2pm–4pm";
      }
      if (clean.includes("46") || clean.includes("4pm6pm") || clean.includes("4to6") || clean.includes("4p6p") || clean.includes("4pmto6pm")) {
        return "4pm–6pm";
      }
      return null;
    }

    /** Robust intent helpers */
    function intentsAccept() {
      return (
        lower.includes("accept") ||
        lower.includes("approve") ||
        lower.includes("approved") ||
        lower.includes("looks good") ||
        lower.includes("go ahead") ||
        lower.includes("proceed") ||
        lower.includes("sounds good") ||
        lower.includes("yes") ||
        lower.includes("sure") ||
        lower.includes("ok") ||
        lower.includes("okay") ||
        lower.includes("yep") ||
        lower.includes("yup") ||
        lower.includes("yeah")
      );
    }

    function intentsDecline() {
      return (
        lower.includes("decline") ||
        lower.includes("reject") ||
        lower.includes("no thanks") ||
        lower.includes("don't approve") ||
        lower.includes("do not approve") ||
        lower.includes("not interested") ||
        lower.includes("i don't want") ||
        lower.includes("i do not want")
      );
    }

    function intentsAdjust() {
      return (
        lower.includes("adjust") ||
        lower.includes("modify") ||
        lower.includes("change") ||
        lower.includes("revise") ||
        lower.includes("update") ||
        lower.includes("different") ||
        lower.includes("make some changes") ||
        lower.includes("can we change")
      );
    }

    function intentsYes() {
      return (
        lower === "yes" ||
        lower === "yeah" ||
        lower === "yep" ||
        lower === "sure" ||
        lower === "ok" ||
        lower === "okay" ||
        lower.includes("yes please") ||
        lower.includes("go ahead") ||
        lower.includes("send it") ||
        lower.includes("confirm")
      );
    }

    function intentsNo() {
      return (
        lower === "no" ||
        lower === "nope" ||
        lower === "nah" ||
        lower.includes("no thanks") ||
        lower.includes("don't send") ||
        lower.includes("do not send") ||
        lower.includes("cancel")
      );
    }

    /* ------ awaitAction: initial Accept / Decline / Adjust routing ------ */
    if (flowStep === "awaitAction") {
      if (intentsAccept() && !intentsAdjust()) {
        // Mark the availability card as accepted
        setMessages((prev) =>
          prev.map((m) => (m.variant === "availabilityCard" ? { ...m, availabilityAction: "accepted" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("acceptSuccess");
        setActionState("accepted");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Great! Your acceptance has been submitted. Smith Jane will be notified.",
            variant: "successCard",
          });
          setIsTyping(false);
          setFlowStep("done");
        });
      } else if (intentsDecline()) {
        setMessages((prev) =>
          prev.map((m) => (m.variant === "availabilityCard" ? { ...m, availabilityAction: "declined" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("declineSuccess");
        setActionState("declined");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Understood. The request has been declined. Your current availability remains unchanged. Smith Jane will be notified.",
          });
          setIsTyping(false);
          setFlowStep("done");
        });
      } else if (intentsAdjust()) {
        setMessages((prev) =>
          prev.map((m) => (m.variant === "availabilityCard" ? { ...m, availabilityAction: "adjusted" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("adjustPrompt");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({ role: "assistant", text: "What days would you like to make adjustments to?" });
          setIsTyping(false);
          setFlowStep("adjustAwaitInput");
        });
      } else {
        // Ambiguous — ask for clarification
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setIsTyping(true);
        delay(800, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "I didn't quite catch that. Would you like to accept the request, decline it, or suggest an adjustment?",
          });
          setIsTyping(false);
        });
      }
      return;
    }

    /* ------ adjustAwaitInput: user describes their adjustment ------ */
    if (flowStep === "adjustAwaitInput") {
      handleAdjustInput(trimmed);
      return;
    }

    /* ------ adjustCounterOffer: reply to first counter-offer ------ */
    if (flowStep === "adjustCounterOffer") {
      handleCounterOffer1Response(trimmed);
      return;
    }

    /* ------ adjustChooseDeclineOrCounter: choose between decline and counter proposal ------ */
    if (flowStep === "adjustChooseDeclineOrCounter") {
      const isDeclineIntent = lower === "decline it" || lower === "decline" || lower === "decline this";
      const isCounterIntent = lower === "counter proposal" || lower === "counter" || lower === "proposal" || lower.includes("counter proposal");

      if (isDeclineIntent) {
        // Trigger the existing decline flow (DO NOT modify the decline logic)
        setMessages((prev) =>
          prev.map((m) => (m.variant === "availabilityCard" ? { ...m, availabilityAction: "declined" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("declineSuccess");
        setActionState("declined");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Understood. The request has been declined. Your current availability remains unchanged. Smith Jane will be notified.",
          });
          setIsTyping(false);
          setFlowStep("done");
        });
      } else if (isCounterIntent) {
        // Trigger custom counter-proposal form
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("adjustSubmitCounterRequest");
        setIsTyping(true);
        delay(1000, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Please provide your proposed slot and coverage contribution below:",
          });
          setIsTyping(true);
          delay(800, t2Ref, () => {
            addMsg({ role: "assistant", variant: "customCounterRequestForm" });
            setIsTyping(false);
          });
        });
      } else {
        // Fallback: prompt again
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setIsTyping(true);
        delay(800, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "I didn't quite catch that. Please type 'decline it' to decline the request, or 'counter proposal' to submit your own request.",
          });
          setIsTyping(false);
        });
      }
      return;
    }

    // adjustCounterOffer2 removed

    /* ------ adjustSelectOtherSlots: slot picker UI handles submit, nudge if text typed ------ */
    if (flowStep === "adjustSelectOtherSlots") {
      // User typed instead of using the picker — nudge them
      addMsg({ role: "user", text: trimmed });
      setDraftMessage("");
      setIsTyping(true);
      delay(700, t1Ref, () => {
        addMsg({
          role: "assistant",
          text: "Please select a slot from the options above and tap Submit.",
        });
        setIsTyping(false);
      });
      return;
    }

    /* ------ adjustSubmitCounterRequest: user can type or wait for form ------ */
    if (flowStep === "adjustSubmitCounterRequest") {
      handleCustomCounterSubmit(nextIdRef.current, trimmed, "50%");
      return;
    }

    /* ------ adjustFinalConfirm: yes/no to send request to manager ------ */
    if (flowStep === "adjustFinalConfirm") {
      if (intentsYes()) {
        // Freeze any yesNoButtons variant in history
        setMessages((prev) =>
          prev.map((m) => (m.variant === "yesNoButtons" ? { ...m, yesNoChoice: "yes" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("adjustSuccess");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "A request to your manager has been sent. Here is your request ID.",
          });
          setIsTyping(true);
          delay(900, t2Ref, () => {
            addMsg({ role: "assistant", variant: "successCard" });
            setIsTyping(false);
            setFlowStep("done");
          });
        });
      } else if (intentsNo()) {
        setMessages((prev) =>
          prev.map((m) => (m.variant === "yesNoButtons" ? { ...m, yesNoChoice: "no" } : m)),
        );
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setFlowStep("done");
        setIsTyping(true);
        delay(800, t1Ref, () => {
          addMsg({ role: "assistant", text: "No problem! The request was not sent. Let me know if you'd like to Accept, Decline, or try a different Adjustment." });
          setIsTyping(false);
        });
      } else {
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setIsTyping(true);
        delay(800, t1Ref, () => {
          addMsg({ role: "assistant", text: "Please reply Yes to send the request to your manager, or No to cancel." });
          setIsTyping(false);
        });
      }
      return;
    }

    /* ------ done: handle any follow-up including accept/decline by text ------ */
    if (flowStep === "done") {
      if (intentsAccept() && !intentsAdjust()) {
        setDraftMessage("");
        addMsg({ role: "user", text: trimmed });
        setFlowStep("acceptSuccess");
        setActionState("accepted");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Great! Your acceptance has been submitted. Smith Jane will be notified.",
            variant: "successCard",
          });
          setIsTyping(false);
          setFlowStep("done");
        });
      } else if (intentsDecline()) {
        setDraftMessage("");
        addMsg({ role: "user", text: trimmed });
        setFlowStep("declineSuccess");
        setActionState("declined");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({
            role: "assistant",
            text: "Understood. The request has been declined. Your current availability remains unchanged. Smith Jane will be notified.",
          });
          setIsTyping(false);
          setFlowStep("done");
        });
      } else {
        addMsg({ role: "user", text: trimmed });
        setDraftMessage("");
        setIsTyping(true);
        delay(900, t1Ref, () => {
          addMsg({ role: "assistant", text: "Is there anything else I can help you with regarding your availability?" });
          setIsTyping(false);
        });
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "56px";
    const next = Math.min(el.scrollHeight, 180);
    el.style.height = `${Math.max(56, next)}px`;
    el.style.overflowY = el.scrollHeight > 180 ? "auto" : "hidden";
  }

  useEffect(() => {
    if (!isPanelVisible) return;
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isPanelVisible]);

  useEffect(() => { resizeTextarea(); }, [draftMessage, isPanelVisible]);

  useEffect(() => {
    return () => { clearTimers(); clearCloseTimer(); clearNudgeTimer(); };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render variant bubbles                                           */
  /* ---------------------------------------------------------------- */

  function handleSlotPickerSubmit(slotPickerMsgId: number) {
    if (selectedSlots.length === 0 || slotSubmitted) return;
    setSlotSubmitted(true);
    // Freeze the slot picker card
    setMessages((prev) =>
      prev.map((m) => (m.id === slotPickerMsgId ? { ...m, slotPickerSubmitted: true } : m)),
    );
    const submittedText = selectedSlots.join(", ");
    addMsg({ role: "user", text: submittedText });
    setFlowStep("done");

    // Save request for approval to localStorage
    saveCounterRequest({
      id: REQUEST_ID,
      employee: "Jenning Dwight",
      original: "Wed 12a-2p",
      counter: "Wed " + submittedText,
      coverage: "50%",
      status: "Pending",
      negotiationCount: 2,
    });
    if (setCounterRequest) {
      setCounterRequest(getCounterRequest());
    }

    setAskAuraToast({
      title: "Requests sent successfully",
      message: "We've sent the adjustment proposal to your manager.",
    });

    setIsTyping(true);
    delay(900, t1Ref, () => {
      addMsg({
        role: "assistant",
        text: "Sent to manager for approval.",
        isSuccess: true,
      });
      setIsTyping(false);
    });
  }

  function renderVariant(msg: AuraChatMessage) {
    switch (msg.variant) {
      case "availabilityCard":
        return (
          <ChatAvailabilityCard
            actionTaken={msg.availabilityAction}
          />
        );
      case "requestedCalendar":
        return <ChatRequestedCalendar />;
      case "yesNoButtons":
        return (
          <ChatYesNoButtons
            onYes={() => handleFinalYes(msg.id)}
            onNo={() => handleFinalNo(msg.id)}
            choiceMade={msg.yesNoChoice}
          />
        );
      case "successCard":
        return <ChatSuccessCard requestId={REQUEST_ID} />;
      case "customCounterRequestForm":
        return (
          <ChatCustomCounterRequestForm
            isSubmitted={!!msg.counterRequestData}
            onSubmit={(counter, coverage) => handleCustomCounterSubmit(msg.id, counter, coverage)}
          />
        );
      case "slotPicker": {
        const submitted = msg.slotPickerSubmitted ?? false;
        const slots = ["12p–4p", "4p–8p", "8p–12a"];
        return (
          <div className="animate-[aura-message-in_180ms_ease-out] max-w-[94%] rounded-xl border border-[#d8dce6] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#e5e7eb] px-4 py-3">
              <p className="text-[14px] font-semibold text-[#111827]">Select a slot</p>
            </div>
            <div className="space-y-2 px-4 py-3">
              {slots.map((slot) => {
                const isSelected = selectedSlots.includes(slot);
                const isDisabled = submitted;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!submitted) {
                        setSelectedSlots((prev) =>
                          prev.includes(slot)
                            ? prev.filter((s) => s !== slot)
                            : [...prev, slot]
                        );
                      }
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      isDisabled
                        ? "cursor-not-allowed border-[#e5e7eb] bg-[#f9fafb]"
                        : isSelected
                          ? "border-primary bg-[#e8f2ff]"
                          : "border-[#d8dce6] bg-white hover:border-primary/50 hover:bg-[#f0f7ff]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                        isDisabled
                          ? isSelected
                            ? "border-slate-400 bg-slate-400 text-white"
                            : "border-slate-300 bg-slate-50"
                          : isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-[#c9cbd2] bg-white",
                      )}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 stroke-[3]" />
                      )}
                    </span>
                    <span className={cn(
                      "text-[14px] font-medium",
                      isDisabled ? "text-[#9ca3af]" : isSelected ? "text-primary" : "text-[#111827]",
                    )}>
                      {slot}
                    </span>
                  </button>
                );
              })}
            </div>
            {!submitted && (
              <div className="border-t border-[#e5e7eb] px-4 py-3">
                <button
                  type="button"
                  disabled={selectedSlots.length === 0}
                  onClick={() => handleSlotPickerSubmit(msg.id)}
                  className={cn(
                    "w-full rounded-lg py-2 text-[14px] font-semibold transition",
                    selectedSlots.length > 0
                      ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
                      : "cursor-not-allowed bg-[#e5e7eb] text-[#9ca3af]",
                  )}
                >
                  Submit
                </button>
              </div>
            )}
            {submitted && (
              <div className="border-t border-[#e5e7eb] px-4 py-3">
                <p className="text-center text-[13px] font-medium text-[#6b7280]">Request submitted</p>
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Composer state                                                   */
  /* ---------------------------------------------------------------- */

  const composerDisabled =
    isTyping ||
    flowStep === "initial" ||
    flowStep === "adjustChecking" ||
    flowStep === "adjustSubmitCounterRequest" ||
    flowStep === "adjustSelectOtherSlots";

  function getPlaceholder() {
    if (flowStep === "awaitAction") return "Type: accept, decline, or adjust...";
    if (flowStep === "adjustAwaitInput") return "e.g. I would like Wednesdays 6a to 8a off...";
    if (flowStep === "adjustCounterOffer" || flowStep === "adjustCounterInput") return "Type your response to counter-offer...";
    if (flowStep === "adjustSubmitCounterRequest") return "Submit proposal using the form above...";
    if (flowStep === "adjustFinalConfirm") return "Reply Yes to confirm or No to cancel...";
    if (flowStep === "done") return "Ask AURA anything...";
    return "Ask AURA";
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

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

      {/* Side panel */}
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
        {/* Header */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#e5e7eb] bg-white px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelView((v) => (v === "history" ? "activeChat" : "history"))}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#1f2937]"
              aria-label={panelView === "history" ? "Return to chat" : "Chat history"}
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
            {panelView === "activeChat" && (
              <>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6]" aria-label="New chat">
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6]"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={closeAssistant}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f3f4f6] hover:text-[#333]"
              aria-label="Close AURA"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Body */}
        {panelView === "history" ? (
          <AuraChatHistoryView onSelectChat={() => setPanelView("activeChat")} />
        ) : (
          <>
            {/* Messages */}
            <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4">
              {messages.map((msg) => {
                const variant = renderVariant(msg);
                const hasText = Boolean(msg.text?.trim());
                const hasContent = Boolean(msg.content);

                // Variant-only (no text bubble)
                if (!hasText && variant) {
                  return (
                    <div key={msg.id} className="animate-[aura-message-in_800ms_ease-out] w-full">
                      {variant}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "animate-[aura-message-in_800ms_ease-out] flex flex-col gap-2",
                      msg.role === "user" && "items-end",
                    )}
                  >
                    {(hasText || hasContent) && (
                      msg.isSuccess ? (
                        // Green success bubble — mirrors Ask Aura "Done — that's sent."
                        <div className="animate-[aura-message-in_180ms_ease-out] max-w-[92%] rounded-lg border border-[#b8e4c8] bg-[#ecfdf3] px-3 py-2.5 text-[#166534] shadow-sm">
                          <p className="whitespace-pre-line text-[14px] font-medium leading-5">{hasContent ? msg.content : msg.text}</p>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-[14px] leading-[1.55] shadow-sm",
                            msg.role === "assistant"
                              ? "max-w-[92%] bg-[#E6F0FB] text-[#1a1a2e]"
                              : "max-w-[84%] bg-[#F0F2F5] text-[#111827]",
                          )}
                        >
                          {hasContent ? (
                            <div>{msg.content}</div>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          )}
                        </div>
                      )
                    )}
                    {variant && (
                      <div className={cn("w-full", msg.role === "user" && "flex justify-end")}>
                        <div className={msg.role === "user" ? "max-w-[84%]" : "w-full"}>
                          {variant}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="animate-[aura-message-in_800ms_ease-out] max-w-[88%] rounded-2xl bg-[#E6F0FB] px-4 py-3 shadow-sm">
                  <span className="sr-only">AURA is typing</span>
                  <span className="flex h-5 items-center gap-1" aria-hidden="true">
                    <span className="aura-typing-dot" />
                    <span className="aura-typing-dot [animation-delay:420ms]" />
                    <span className="aura-typing-dot [animation-delay:840ms]" />
                  </span>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-[#e2e5ec] bg-white p-4">
              <form
                className="flex min-h-[56px] items-end gap-3 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm"
                onSubmit={handleSubmit}
              >
                <button type="button" className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-[#f3f6fb]" aria-label="Attach">
                  <Paperclip className="h-5 w-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="min-h-[56px] max-h-[180px] min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent py-4 text-[15px] leading-[1.4] text-[#111827] outline-none placeholder:text-[#aaa] disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ask AURA"
                  aria-label="Message"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={composerDisabled}
                />
                <button
                  type="submit"
                  disabled={!draftMessage.trim() || composerDisabled}
                  className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send"
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
