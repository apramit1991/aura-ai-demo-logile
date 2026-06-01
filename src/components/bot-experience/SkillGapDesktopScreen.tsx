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
  Maximize2,
  Minimize2,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "./AppShell";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import { cn } from "../../lib/utils";
import profileAvatar from "../../assets/skill-gap/profile.png";
import sarahAvatar from "../../assets/skill-gap/sarah-johnson.png";
import emilyAvatar from "../../assets/skill-gap/emily-carter.png";
import michaelAvatar from "../../assets/skill-gap/michael-chen.png";
import jessicaAvatar from "../../assets/skill-gap/jessica-brown.png";
import ryanAvatar from "../../assets/skill-gap/ryan-anderson.png";
import alexAvatar from "../../assets/skill-gap/alex-thompson.png";
import jordanAvatar from "../../assets/skill-gap/jordan-mitchell.png";
import sendButtonIcon from "../../assets/Send Button.svg";

const alertCards = [
  { id: 1, title: "Bakery - Baking, 40h", action: "Click on Card for solution" },
  { id: 2, title: "Cake Decoration, 32h", action: "Click on Card for solution" },
  { id: 3, title: "Bakery Clerk, 28h", action: "Click on Card for solution" },
  { id: 4, title: "Produce - Fresh Cut, 24h", action: "Click on Card for solution" },
  { id: 5, title: "Meat Market - Butcher, 23h", action: "Click on Card for solution" },
  { id: 6, title: "Seafood - Service Counter, 22h", action: "Click on Card for solution" },
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
    current: "Secondary LT: Cake Decoration, Bakery Clerk, +1",
    required: "Availability: Mon-Sun · 52h",
  },
  {
    name: "Ryan Anderson,",
    avatar: ryanAvatar,
    badges: ["Inventory"],
    current: "Secondary LT: Cake Decoration, Bakery Clerk, Bakery Opening",
    required: "Availability: Tue-Sun · 45h",
  },
  {
    name: "Alex Thompson",
    avatar: alexAvatar,
    badges: ["Customer Service"],
    current: "Secondary LT: Cake Decoration, Bakery Clerk, +1",
    required: "Availability: Mon-Sun · 30h",
  },
  {
    name: "Jordan Mitchell",
    avatar: jordanAvatar,
    badges: ["Bakery, Baking"],
    current: "Secondary LT: Cake Decoration, Bakery Clerk, +1",
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

function AlertCard({
  card,
  isActive,
  onClick,
  clickable = true,
}: {
  card: (typeof alertCards)[number];
  isActive: boolean;
  onClick: () => void;
  clickable?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={card.id === 1 && clickable ? onClick : undefined}
      className={cn(
        "flex h-[73px] w-full max-w-full items-center gap-3 rounded-[10px] border-2 border-[#ffa2a2] px-4 text-left transition",
        isActive ? "bg-white" : "bg-[#fef3f2]",
        card.id === 1 && clickable ? "cursor-pointer" : "cursor-default",
      )}
    >
      {/* Red circle alert icon matching Figma */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8.5" stroke="#E7000B" strokeWidth="1.667" />
          <rect x="9.166" y="5.833" width="1.667" height="5.833" rx="0.833" fill="#E7000B" />
          <circle cx="10" cy="14.167" r="0.833" fill="#E7000B" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-medium leading-[22px] text-[#101828]">{card.title}</span>
        <span className="block text-[13px] font-normal leading-5 text-primary">{card.action}</span>
      </span>
    </button>
  );
}

const criticalSkillGapAlerts = [
  {
    title: "Bakery - Baking, 40h",
    description: "Significant skill shortage impacting production coverage.",
  },
  {
    title: "Cake Decoration, 32h",
    description: "High fulfillment coverage risk during peak order windows.",
  },
  {
    title: "Bakery Clerk, 28h",
    description: "Critical counter coverage gap affecting service readiness.",
  },
];

type AskAuraAvailabilityEmployee = {
  name: "Sarah Johnson" | "Emily Carter";
  avatar: string;
  skillLevel: string;
  impact: string;
};

type AskAuraCrossTrainEmployee = {
  name: "Jessica Brown" | "Ryan Anderson";
  avatar: string;
  recommendationType: string;
  estimatedTime: string;
  impact: string;
};

type AskAuraPhase =
  | "awaitCriticalGapPrompt"
  | "awaitCriticalCardClick"
  | "awaitCrossTrainConsent"
  | "awaitAvailabilitySendConfirm"
  | "awaitCrossTrainSelection"
  | "awaitCrossTrainSendConfirm"
  | "awaitClosePrompt"
  | "done";

type AskAuraMessage =
  | { id: number; role: "assistant" | "user"; kind: "text"; text: string }
  | { id: number; role: "assistant"; kind: "successText"; text: string }
  | { id: number; role: "assistant"; kind: "criticalGapCards" }
  | { id: number; role: "assistant"; kind: "availabilityCards" }
  | { id: number; role: "assistant"; kind: "crossTrainCards" };

type AskAuraMessagePayload =
  | { role: "assistant" | "user"; kind: "text"; text: string }
  | { role: "assistant"; kind: "successText"; text: string }
  | { role: "assistant"; kind: "criticalGapCards" }
  | { role: "assistant"; kind: "availabilityCards" }
  | { role: "assistant"; kind: "crossTrainCards" };

const askAuraAvailabilityEmployees: AskAuraAvailabilityEmployee[] = [
  { name: "Sarah Johnson", avatar: sarahAvatar, skillLevel: "Secondary skill", impact: "85% gap reduction" },
  { name: "Emily Carter", avatar: emilyAvatar, skillLevel: "Tertiary skill", impact: "100% reduction with Sarah Johnson" },
];

const askAuraCrossTrainEmployees: AskAuraCrossTrainEmployee[] = [
  {
    name: "Jessica Brown",
    avatar: jessicaAvatar,
    recommendationType: "Cross-training",
    estimatedTime: "2 weeks",
    impact: "Helps reduce the Bakery skill gap",
  },
  {
    name: "Ryan Anderson",
    avatar: ryanAvatar,
    recommendationType: "Cross-training",
    estimatedTime: "2 weeks",
    impact: "Helps reduce the Bakery skill gap",
  },
];

function normalizePrompt(value: string) {
  return value.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesCriticalGapPrompt(value: string) {
  const prompt = normalizePrompt(value);
  return prompt.includes("critical skill gaps") || (prompt.includes("yes") && prompt.includes("skill gap"));
}

function matchesYesPrompt(value: string) {
  const prompt = normalizePrompt(value);
  return prompt === "yes" || prompt === "yes please";
}

function matchesNoThanksPrompt(value: string) {
  const prompt = normalizePrompt(value);
  return prompt === "no thanks" || prompt === "no thanks.";
}

function AskAuraEmployeeCard({
  employee,
  selected,
  disabled = false,
  onToggle,
  subtitle,
  status,
}: {
  employee: { name: string; avatar: string };
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
  subtitle: string;
  status?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border px-3 py-3 transition",
        disabled ? "border-[#d1d5db] bg-[#f3f4f6]" : selected ? "border-primary bg-[#e8f2ff]" : "border-[#d8dce6] bg-white",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={`Select ${employee.name}`}
          aria-checked={selected}
          role="checkbox"
          disabled={disabled}
          onClick={onToggle}
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
            disabled ? "cursor-not-allowed border-slate-400 bg-slate-200 text-slate-600" : selected ? "border-primary bg-primary text-white" : "border-[#c9cbd2] bg-white",
          )}
        >
          {(selected || disabled) ? <Check className="h-3.5 w-3.5" /> : null}
        </button>
        <img src={employee.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-5 text-[#111827]">{employee.name}</p>
          <p className="mt-1 text-[13px] leading-5 text-[#334155]">{subtitle}</p>
          {status ? (
            <span className="mt-2 inline-flex rounded-full border border-[#d1d5db] bg-[#e5e7eb] px-2 py-0.5 text-[12px] font-medium leading-4 text-[#6b7280]">
              {status}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SkillGapAuraAssistant({
  isOpen,
  onOpen,
  onClose,
  onSendAvailabilityRequests,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSendAvailabilityRequests: (payload: { type: "availability" | "crossTraining"; employees: string[] }) => void;
}) {
  const [panelState, setPanelState] = useState<"closed" | "open" | "closing">("closed");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [messages, setMessages] = useState<AskAuraMessage[]>([]);
  const [phase, setPhase] = useState<AskAuraPhase>("awaitCriticalGapPrompt");
  const [isAuraTyping, setIsAuraTyping] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedCriticalGapCard, setSelectedCriticalGapCard] = useState<string | null>(null);
  const [selectedAvailabilityEmployees, setSelectedAvailabilityEmployees] = useState<Set<string>>(new Set());
  const [sentAvailabilityEmployees, setSentAvailabilityEmployees] = useState<Set<string>>(new Set());
  const [selectedCrossTrainEmployees, setSelectedCrossTrainEmployees] = useState<Set<string>>(new Set());
  const [sentCrossTrainEmployees, setSentCrossTrainEmployees] = useState<Set<string>>(new Set());
  const [hasShownCriticalGaps, setHasShownCriticalGaps] = useState(false);
  const [hasShownCrossTrainPrompt, setHasShownCrossTrainPrompt] = useState(false);
  const [availabilitySkillGapReductionPercent, setAvailabilitySkillGapReductionPercent] = useState(0);
  const [crossTrainSkillGapReductionPercent, setCrossTrainSkillGapReductionPercent] = useState(0);
  const [availabilityRequestSent, setAvailabilityRequestSent] = useState(false);
  const [hasPromptedAvailabilityRequest, setHasPromptedAvailabilityRequest] = useState(false);
  const [crossTrainRequestSent, setCrossTrainRequestSent] = useState(false);
  const [hasPromptedCrossTrainRequest, setHasPromptedCrossTrainRequest] = useState(false);
  const typingTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const followUpTimerRef = useRef<number | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const nextMessageIdRef = useRef(1);
  const hasStartedConversationRef = useRef(false);
  const isPanelVisible = panelState !== "closed";

  function clearTypingTimer() {
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }

  function appendMessage(message: AskAuraMessagePayload) {
    const next = { ...message, id: nextMessageIdRef.current++ } as AskAuraMessage;
    setMessages((current) => [...current, next]);
  }

  function queueAssistant(messagesToAppend: AskAuraMessagePayload | AskAuraMessagePayload[], delay = 900) {
    clearTypingTimer();
    setIsAuraTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      const payload = Array.isArray(messagesToAppend) ? messagesToAppend : [messagesToAppend];
      payload.forEach((message) => appendMessage(message));
      setIsAuraTyping(false);
      typingTimerRef.current = null;
    }, delay);
  }

  function queueAssistantSuccessFollowUp() {
    clearTypingTimer();
    setIsAuraTyping(true);
    typingTimerRef.current = window.setTimeout(() => {
      appendMessage({ role: "assistant", kind: "successText", text: "Done — that’s sent." });
      typingTimerRef.current = window.setTimeout(() => {
        appendMessage({
          role: "assistant",
          kind: "text",
          text: "Do you want to proceed with solving the other 2 critical gaps as well?",
        });
        setIsAuraTyping(false);
        typingTimerRef.current = null;
      }, 380);
    }, 900);
  }

  function clearPanelTimers() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (nudgeTimerRef.current) {
      window.clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }
    if (followUpTimerRef.current) {
      window.clearTimeout(followUpTimerRef.current);
      followUpTimerRef.current = null;
    }
  }

  useEffect(() => {
    if (!isOpen) {
      clearTypingTimer();
      setPanelState("closed");
      return;
    }
    clearPanelTimers();
    setPanelState("open");
    setIsFullscreen(false);
    setPanelView("activeChat");
    setShouldNudgeLauncher(false);
    setDraftMessage("");
    if (!hasStartedConversationRef.current) {
      hasStartedConversationRef.current = true;
      nextMessageIdRef.current = 1;
      setPhase("awaitCriticalGapPrompt");
      setSelectedCriticalGapCard(null);
      setSelectedAvailabilityEmployees(new Set());
      setSentAvailabilityEmployees(new Set());
      setSelectedCrossTrainEmployees(new Set());
      setSentCrossTrainEmployees(new Set());
      setHasShownCriticalGaps(false);
      setHasShownCrossTrainPrompt(false);
      setAvailabilitySkillGapReductionPercent(0);
      setCrossTrainSkillGapReductionPercent(0);
      setAvailabilityRequestSent(false);
      setHasPromptedAvailabilityRequest(false);
      setCrossTrainRequestSent(false);
      setHasPromptedCrossTrainRequest(false);
      queueAssistant({
        role: "assistant",
        kind: "text",
        text: "Hello Jane, how would you like to get started? Would you like me to check upcoming skill gaps?",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isAuraTyping, messages, isOpen]);

  useEffect(() => {
    return () => {
      clearTypingTimer();
      clearPanelTimers();
    };
  }, []);

  useEffect(() => {
    resizeComposer();
  }, [draftMessage, isOpen, panelState]);

  useEffect(() => {
    const hasSarah = selectedAvailabilityEmployees.has("Sarah Johnson");
    const hasEmily = selectedAvailabilityEmployees.has("Emily Carter");
    const percent = hasSarah && hasEmily ? 100 : hasSarah ? 85 : 0;
    setAvailabilitySkillGapReductionPercent(percent);

    if (!hasSarah || !hasEmily || availabilityRequestSent || hasPromptedAvailabilityRequest) return;
    if (followUpTimerRef.current) {
      window.clearTimeout(followUpTimerRef.current);
      followUpTimerRef.current = null;
    }
    setHasPromptedAvailabilityRequest(true);
    setPhase("awaitAvailabilitySendConfirm");
    queueAssistant({
      role: "assistant",
      kind: "text",
      text: "You selected Sarah Johnson and Emily Carter. This will reduce the skill gap by 100%. Would you like me to send availability requests to both of them?",
    });
  }, [selectedAvailabilityEmployees, availabilityRequestSent, hasPromptedAvailabilityRequest]);

  useEffect(() => {
    const selectionCount = selectedCrossTrainEmployees.size;
    const percent = selectionCount >= 2 ? 99 : selectionCount === 1 ? 60 : 0;
    setCrossTrainSkillGapReductionPercent(percent);

    if (selectionCount !== 2 || crossTrainRequestSent || hasPromptedCrossTrainRequest) return;
    setHasPromptedCrossTrainRequest(true);
    setPhase("awaitCrossTrainSendConfirm");
    queueAssistant({
      role: "assistant",
      kind: "text",
      text: "You selected Jessica Brown and Ryan Anderson. This will reduce the skill gap by 99%. Would you like me to prepare cross-training requests for Bakery coverage support?",
    });
  }, [selectedCrossTrainEmployees, crossTrainRequestSent, hasPromptedCrossTrainRequest]);

  function handleClose() {
    clearPanelTimers();
    setPanelState("closing");
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setPanelState("closed");
      setIsFullscreen(false);
      setShouldNudgeLauncher(true);
      onClose();
      nudgeTimerRef.current = window.setTimeout(() => {
        setShouldNudgeLauncher(false);
        nudgeTimerRef.current = null;
      }, 420);
    }, 260);
  }

  function submitDraftMessage(messageOverride?: string) {
    const trimmedMessage = (messageOverride ?? draftMessage).trim();
    if (!trimmedMessage || isAuraTyping) return;

    appendMessage({ role: "user", kind: "text", text: trimmedMessage });
    setDraftMessage("");

    if (phase === "awaitCriticalGapPrompt") {
      if (!matchesCriticalGapPrompt(trimmedMessage)) {
        queueAssistant({ role: "assistant", kind: "text", text: "Please ask me for the critical skill gaps to get started." });
        return;
      }
      setPhase("awaitCriticalCardClick");
      setHasShownCriticalGaps(true);
      queueAssistant([
        { role: "assistant", kind: "text", text: "These are the three critical skill gaps. Click on a card to view the resolution." },
        { role: "assistant", kind: "criticalGapCards" },
      ]);
      return;
    }

    if (phase === "awaitCriticalCardClick") {
      queueAssistant({ role: "assistant", kind: "text", text: "Please click the Bakery - Baking card to view the resolution recommendations." });
      return;
    }

    if (phase === "awaitCrossTrainConsent") {
      if (matchesYesPrompt(trimmedMessage)) {
        setPhase("awaitCrossTrainSelection");
        queueAssistant([
          { role: "assistant", kind: "text", text: "I found 2 employees who can be cross-trained to reduce the skill gap by 99%." },
          { role: "assistant", kind: "crossTrainCards" },
        ]);
        return;
      }

      queueAssistant({
        role: "assistant",
        kind: "text",
        text: "Select Sarah Johnson and Emily Carter to send availability requests, or reply with 'Yes' to review cross-training options.",
      });
      return;
    }

    if (phase === "awaitAvailabilitySendConfirm") {
      if (!matchesYesPrompt(trimmedMessage)) {
        queueAssistant({ role: "assistant", kind: "text", text: "Please confirm with 'Yes' if you want me to send both availability requests." });
        return;
      }
      const sent = new Set(["Sarah Johnson", "Emily Carter"]);
      setSentAvailabilityEmployees(sent);
      setSelectedAvailabilityEmployees(sent);
      setAvailabilitySkillGapReductionPercent(100);
      setAvailabilityRequestSent(true);
      onSendAvailabilityRequests({ type: "availability", employees: ["Sarah Johnson", "Emily Carter"] });
      setPhase("awaitClosePrompt");
      queueAssistantSuccessFollowUp();
      return;
    }

    if (phase === "awaitCrossTrainSelection") {
      if (matchesYesPrompt(trimmedMessage)) {
        queueAssistant({
          role: "assistant",
          kind: "text",
          text: hasPromptedCrossTrainRequest
            ? "Please confirm with 'Yes' if you want me to prepare both cross-training requests."
            : "Please select Jessica Brown and Ryan Anderson first so I can prepare the cross-training requests.",
        });
        return;
      }
      if (matchesNoThanksPrompt(trimmedMessage)) {
        queueAssistant({
          role: "assistant",
          kind: "text",
          text: "No problem. Select both cross-training recommendations whenever you want me to prepare the requests.",
        });
        return;
      }
      queueAssistant({ role: "assistant", kind: "text", text: "Select both cross-training cards to continue." });
      return;
    }

    if (phase === "awaitCrossTrainSendConfirm") {
      if (!matchesYesPrompt(trimmedMessage)) {
        queueAssistant({ role: "assistant", kind: "text", text: "Please confirm with 'Yes' if you want me to send both cross-training requests." });
        return;
      }
      const sent = new Set(["Jessica Brown", "Ryan Anderson"]);
      setSelectedCrossTrainEmployees(sent);
      setSentCrossTrainEmployees(sent);
      setCrossTrainSkillGapReductionPercent(99);
      setCrossTrainRequestSent(true);
      onSendAvailabilityRequests({ type: "crossTraining", employees: ["Jessica Brown", "Ryan Anderson"] });
      setPhase("awaitClosePrompt");
      queueAssistantSuccessFollowUp();
      return;
    }

    if (phase === "awaitClosePrompt") {
      if (!matchesNoThanksPrompt(trimmedMessage)) {
        queueAssistant({ role: "assistant", kind: "text", text: "If you're done, you can reply with 'No, thanks.'." });
        return;
      }
      setPhase("done");
      queueAssistant({ role: "assistant", kind: "text", text: "Have a good day." });
      return;
    }
  }

  function handleChatSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitDraftMessage();
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
    submitDraftMessage(event.currentTarget.value);
  }

  function toggleAvailabilityEmployee(employeeName: string) {
    if (sentAvailabilityEmployees.has(employeeName)) return;
    setSelectedAvailabilityEmployees((current) => {
      const next = new Set(current);
      if (next.has(employeeName)) next.delete(employeeName);
      else next.add(employeeName);
      return next;
    });
  }

  function toggleCrossTrainEmployee(employeeName: string) {
    if (sentCrossTrainEmployees.has(employeeName)) return;
    setSelectedCrossTrainEmployees((current) => {
      const next = new Set(current);
      if (next.has(employeeName)) next.delete(employeeName);
      else next.add(employeeName);
      return next;
    });
  }

  function handleCriticalCardSelect(cardTitle: string) {
    setSelectedCriticalGapCard(cardTitle);
    if (cardTitle !== "Bakery - Baking, 40h") return;
    if (messages.some((message) => message.kind === "availabilityCards")) return;
    setPhase("awaitCrossTrainConsent");
    queueAssistant([
      { role: "assistant", kind: "text", text: "Here are a few recommendations." },
      { role: "assistant", kind: "availabilityCards" },
      { role: "assistant", kind: "text", text: "My preferred combination for full coverage is Sarah Johnson at 100% allocation and Emily Carter at 10% support. This can create 100% fulfilment for the Baking gap." },
    ]);
    followUpTimerRef.current = window.setTimeout(() => {
      setHasShownCrossTrainPrompt(true);
      queueAssistant({ role: "assistant", kind: "text", text: "Would you like to see who you can cross-train?" });
    }, 2600);
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-6 sm:right-6",
          isOpen && "pointer-events-none translate-y-2 opacity-0",
          !isOpen && shouldNudgeLauncher && "aura-launcher-nudge",
        )}
      >
        <button
          type="button"
          aria-label="Open AURA AI assistant"
          onClick={onOpen}
          className="relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#33C7EA] to-[#2A2DBB] px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(42,45,187,0.35),0_0_24px_rgba(51,199,234,0.28)] outline-none ring-1 ring-white/30 transition-all duration-200 hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-[#7edff4]"
        >
          <Sparkles className="h-4 w-4 fill-white/20" />
          <span>AURA AI</span>
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
              onClick={handleClose}
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
        <div className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f7f8fb] px-5 py-4">
          {messages.map((message) => (
            message.kind === "text" ? (
              <div
                key={message.id}
                className={cn(
                  "animate-[aura-message-in_180ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                  message.role === "assistant" ? "max-w-[92%] bg-[#E6F0FB] text-[#333333]" : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
                )}
              >
                {message.text}
              </div>
            ) : message.kind === "successText" ? (
              <div
                key={message.id}
                className="animate-[aura-message-in_180ms_ease-out] max-w-[92%] rounded-lg border border-[#b8e4c8] bg-[#ecfdf3] px-3 py-2.5 text-[#166534] shadow-sm"
              >
                <p className="whitespace-pre-line text-[14px] font-medium leading-5">{message.text}</p>
              </div>
            ) : message.kind === "criticalGapCards" ? (
              <div key={message.id} className="animate-[aura-message-in_180ms_ease-out] max-w-[94%] rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-3 py-3 shadow-sm">
                <div className="space-y-2">
                  {[
                    "Bakery - Baking, 40h",
                    "Bakery - Cake Decoration, 32h",
                    "Bakery Clerk, 28h",
                  ].map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => handleCriticalCardSelect(title)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        selectedCriticalGapCard === title ? "border-[#ef4444] bg-white" : "border-[#fecaca] bg-white/80 hover:border-[#ef4444] hover:bg-white",
                      )}
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 text-[#dc2626]" />
                      <p className="text-[14px] font-semibold leading-5 text-[#111827]">{title}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : message.kind === "availabilityCards" ? (
              <div key={message.id} className="animate-[aura-message-in_180ms_ease-out] max-w-[94%] rounded-xl border border-[#d8dce6] bg-white shadow-sm">
                <div className="border-b border-[#e5e7eb] px-4 py-3">
                  <p className="text-[15px] font-semibold leading-5 text-primary">Availability movement — solves in 2 days</p>
                  <p className="mt-2 text-[13px] leading-5 text-[#1f2937]">Sarah Johnson has Bakery as a secondary skill. If approved, this can solve 85% of the Baking gap.</p>
                  <p className="mt-1 text-[13px] leading-5 text-[#1f2937]">Emily Carter has Bakery as a tertiary skill. If approved, this can help achieve 100% reduction when combined with Sarah Johnson.</p>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {askAuraAvailabilityEmployees.map((employee) => (
                    <AskAuraEmployeeCard
                      key={employee.name}
                      employee={employee}
                      selected={selectedAvailabilityEmployees.has(employee.name)}
                      disabled={sentAvailabilityEmployees.has(employee.name)}
                      onToggle={() => toggleAvailabilityEmployee(employee.name)}
                      subtitle={`${employee.skillLevel} • ${employee.impact}`}
                      status={sentAvailabilityEmployees.has(employee.name) ? "Pending Approval" : undefined}
                    />
                  ))}
                  {availabilitySkillGapReductionPercent > 0 ? (
                    <div className="rounded-md border border-[#d8dce6] bg-[#f8fafc] px-3 py-3">
                      <p className="text-[13px] font-semibold leading-5 text-[#334155]">
                        {availabilitySkillGapReductionPercent}% skill gap reduced
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d8dbe2]">
                        <div
                          className="h-full rounded-full bg-[#34b233] transition-all duration-500 ease-out"
                          style={{ width: `${availabilitySkillGapReductionPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : message.kind === "crossTrainCards" ? (
              <div key={message.id} className="animate-[aura-message-in_180ms_ease-out] max-w-[94%] rounded-xl border border-[#d8dce6] bg-white shadow-sm">
                <div className="border-b border-[#e5e7eb] px-4 py-3">
                  <p className="text-[15px] font-semibold leading-5 text-primary">Cross-training — estimated in 2 weeks</p>
                  <p className="mt-2 text-[13px] leading-5 text-[#1f2937]">Select employees to prepare cross-training requests for Bakery coverage support.</p>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {askAuraCrossTrainEmployees.map((employee) => (
                    <AskAuraEmployeeCard
                      key={employee.name}
                      employee={employee}
                      selected={selectedCrossTrainEmployees.has(employee.name)}
                      disabled={sentCrossTrainEmployees.has(employee.name)}
                      onToggle={() => toggleCrossTrainEmployee(employee.name)}
                      subtitle={`${employee.recommendationType} • Estimated time: ${employee.estimatedTime} • Impact: ${employee.impact}`}
                      status={sentCrossTrainEmployees.has(employee.name) ? "Pending Approval" : undefined}
                    />
                  ))}
                  {crossTrainSkillGapReductionPercent > 0 ? (
                    <div className="rounded-md border border-[#d8dce6] bg-[#f8fafc] px-3 py-3">
                      <p className="text-[13px] font-semibold leading-5 text-[#334155]">
                        {crossTrainSkillGapReductionPercent >= 99 ? "Skill gap 99% reduced" : `Skill gap ${crossTrainSkillGapReductionPercent}% reduced`}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d8dbe2]">
                        <div
                          className="h-full rounded-full bg-[#34b233] transition-all duration-500 ease-out"
                          style={{ width: `${crossTrainSkillGapReductionPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null
          ))}

          {isAuraTyping ? (
            <div className="animate-[aura-message-in_180ms_ease-out] max-w-[88%] rounded-lg bg-[#E6F0FB] px-3 py-2 text-[#5c5c5c] shadow-sm">
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
        <footer className="shrink-0 border-t border-[#e2e5ec] bg-white px-4 py-3">
          <form className="flex min-h-[56px] items-end gap-3 rounded-[40px] border border-[#c9cbd2] bg-white px-3 py-2 shadow-sm transition-[min-height] duration-200" onSubmit={handleChatSubmit}>
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
              disabled={isAuraTyping}
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

  return <div className={cn("flex h-[26px] w-full min-w-0 items-center justify-center rounded-[4px] text-[14px] font-semibold 2xl:h-[28px] 2xl:text-[16px]", tone)}>{value}</div>;
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
      <div className={cn("flex min-h-[58px] items-center gap-3 px-3 2xl:h-[64px] 2xl:gap-4 2xl:px-[18px]", expanded && "border-b border-[#d5d5d5]")}>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white transition hover:bg-[#0858b9]"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse skill gap details" : "Expand skill gap details"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
        <h2 className="min-w-0 text-[21px] font-normal leading-[30px] text-[#111827]">
          Bakery - 40h Baking skill gap, 16 Weeks(7/26/26 - 8/16/26)
        </h2>
      </div>
      {expanded ? (
        <div className="max-w-full overflow-hidden px-2 pb-0 pt-2 2xl:px-3">
          <div className="grid max-w-full grid-cols-[120px_repeat(7,minmax(0,1fr))_56px] gap-x-1 2xl:grid-cols-[140px_repeat(7,minmax(0,1fr))_72px] 2xl:gap-x-2">
            <div />
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Total"].map((day) => (
              <div key={day} className="flex h-[32px] min-w-0 items-center justify-center border-b border-[#cfd3dc] text-[13px] leading-5 text-[#344054] 2xl:h-[35px] 2xl:text-[14px]">
                {day}
              </div>
            ))}
            {skillGapRows.map((row) => (
              <div key={row.week} className="contents">
                <div className="flex h-[46px] min-w-0 items-center px-1 text-[13px] font-normal leading-5 text-[#111827] 2xl:h-[51px] 2xl:text-[15px] 2xl:leading-[22px]">{row.week}</div>
                {row.values.map((value, index) => (
                  <div key={`${row.week}-${index}`} className="flex h-[46px] min-w-0 items-center 2xl:h-[51px]">
                    <HeatCell value={value} />
                  </div>
                ))}
                <div className="flex h-[46px] min-w-0 items-center justify-center bg-[#f6f7f9] text-[12px] font-semibold text-[#111827] 2xl:h-[51px] 2xl:text-[13px]">
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
        requestSent && "border-slate-300 bg-slate-50 ring-0 opacity-90",
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
              requestSent && "border-slate-400 bg-slate-200 text-slate-600",
              isInteractive && !requestSent ? "cursor-pointer hover:border-primary" : "cursor-not-allowed",
            )}
          >
            {selected || requestSent ? <Check className="h-4 w-4" /> : null}
          </button>
          <img src={employee.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="whitespace-normal break-words text-[16px] font-semibold leading-snug text-slate-900">{employee.name}</p>
            {requestSent ? (
              <span className="mt-1 inline-flex rounded-full border border-[#d1d5db] bg-[#f3f4f6] px-2 py-0.5 text-[12px] font-medium leading-4 text-[#6b7280]">
                Pending Approval
              </span>
            ) : null}
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
              <p className="text-[14px] font-semibold leading-snug text-primary">AI Recommendation</p>
              <p className="mt-1 whitespace-normal break-words text-[14px] font-medium leading-snug text-blue-950">{employee.proposed}</p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function SuccessToast({
  onClose,
  title = "Request sent successfully",
  message = "Sarah Johnson's availability adjustment request has been sent.",
}: {
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-6 top-6 z-[80] w-[390px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]"
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
        className="max-h-[calc(100vh-64px)] w-full max-w-[900px] overflow-y-auto rounded-xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 2xl:px-8 2xl:pt-7">
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

        <div className="space-y-4 px-6 py-5 2xl:space-y-5 2xl:px-8 2xl:py-6">
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

          <div className="grid grid-cols-2 gap-4 2xl:gap-5">
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

        <div className="flex justify-end gap-4 border-t border-slate-200 px-6 py-4 2xl:gap-5 2xl:px-8 2xl:py-5">
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
  isAskAuraLayout = false,
  isTabletEmbed = false,
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
  isAskAuraLayout?: boolean;
  isTabletEmbed?: boolean;
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
  const isAdjustAvailabilityCard = title === "Adjust Availability";
  const showBottomActionLayout = isAskAuraLayout && isAdjustAvailabilityCard;
  const selectedCount = selectedEmployeeId === "Sarah Johnson" ? 1 : 0;
  const showSelectedIndicator = isAdjustAvailabilityCard && selectedCount > 0;
  const orderedEmployees = isRequestSent
    ? [...employees].sort((a, b) => (a.name === "Sarah Johnson" ? 1 : b.name === "Sarah Johnson" ? -1 : 0))
    : employees;
  const hasNeutralSelectedBorder = selected && isAdjustAvailabilityCard;

  return (
    <section
      className={cn(
        "flex min-w-0 max-w-full flex-col overflow-hidden rounded-[14px] border bg-[#f4f5fb]",
        isTabletEmbed ? "h-[560px]" : "h-[640px] 2xl:h-[720px]",
        selected && !hasNeutralSelectedBorder ? "border-2 border-primary" : "border-[#cfd3dc]",
      )}
    >
      <div
        className={cn(
          "flex h-[60px] shrink-0 items-center justify-between border-b bg-white px-4",
          selected && !hasNeutralSelectedBorder ? "border-primary" : "border-[#cfd3dc]",
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
            <Icon className="h-6 w-6" />
          </span>
          <h4 className="min-w-0 truncate text-[21px] font-normal leading-[30px] text-[#333333]">{title}</h4>
        </div>
        {!showBottomActionLayout ? (
          <button
            type="button"
            disabled={!canSendRequest}
            onClick={canSendRequest ? onSendRequest : undefined}
            className={cn(
              "h-[31px] shrink-0 rounded-md px-4 text-[17px] font-medium leading-[22px] transition",
              canSendRequest && "cursor-pointer bg-primary text-white hover:bg-[#0858b9]",
              !canSendRequest && !isRequestSent && "cursor-not-allowed bg-[#e5e5e5] text-[#8a8a8a]",
              isRequestSent && "cursor-not-allowed border border-[#d1d5db] bg-[#e5e7eb] text-[#6b7280]",
            )}
          >
            {isRequestSent ? "Pending Approval" : "Send Request"}
          </button>
        ) : null}
      </div>
      <div className={cn("grid shrink-0 grid-cols-3 gap-0 px-4 py-3", isTabletEmbed ? "min-h-[82px]" : "min-h-[88px] 2xl:min-h-[98px] 2xl:px-8 2xl:py-4")}>
        {metrics.map((metric, index) => (
          <div key={metric.label} className={cn("min-w-0", index > 0 && "border-l border-slate-300", index > 0 && (isTabletEmbed ? "pl-3" : "pl-4 2xl:pl-8"))}>
            <Metric {...metric} />
          </div>
        ))}
      </div>
      {showSelectedIndicator && !showBottomActionLayout ? (
        <div className="mx-4 shrink-0 rounded-md bg-white px-4 py-2.5">
          <p aria-live="polite" className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#334155]">
            <Users aria-hidden="true" className="h-5 w-5 text-[#475569]" />
            {selectedCount} of 3 Employees Selected
          </p>
          <p className="mt-2 text-[16px] font-normal leading-6 text-[#334155]">Reduce the skill Gap 85%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d8dbe2]">
            <div
              role="progressbar"
              aria-label="Skill gap reduction progress"
              aria-valuenow={85}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-full w-[85%] rounded-full bg-[#34b233]"
            />
          </div>
        </div>
      ) : (
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
      )}
      <div className={cn("scrollbar-slim grid min-h-0 flex-1 content-start overflow-y-auto px-4 py-4", isTabletEmbed ? "grid-cols-2 gap-3" : "grid-cols-1 gap-4 2xl:grid-cols-2")}>
        {orderedEmployees.map((employee) => (
          <EmployeeCard
            key={employee.name}
            employee={employee}
            selected={selectedEmployeeId === employee.name}
            requestSent={requestSentEmployeeId === employee.name}
            onToggle={employee.name === "Sarah Johnson" ? () => onToggleEmployee?.(employee.name) : undefined}
          />
        ))}
      </div>
      {showBottomActionLayout ? (
        <div className="shrink-0 border-t border-[#cfd3dc] bg-white px-4 py-3">
          {showSelectedIndicator ? (
            <div className="rounded-md bg-[#f4f5fb] px-4 py-2.5">
              <p aria-live="polite" className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#334155]">
                <Users aria-hidden="true" className="h-5 w-5 text-[#475569]" />
                {selectedCount} of 3 Employees Selected
              </p>
              <p className="mt-2 text-[16px] font-normal leading-6 text-[#334155]">Reduce the skill Gap 85%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d8dbe2]">
                <div
                  role="progressbar"
                  aria-label="Skill gap reduction progress"
                  aria-valuenow={85}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-full w-[85%] rounded-full bg-[#34b233]"
                />
              </div>
            </div>
          ) : null}
          <button
            type="button"
            disabled={!canSendRequest}
            onClick={canSendRequest ? onSendRequest : undefined}
            className={cn(
              "mt-3 h-[34px] w-full rounded-md px-4 text-[17px] font-medium leading-[22px] transition",
              canSendRequest && "cursor-pointer bg-primary text-white hover:bg-[#0858b9]",
              !canSendRequest && !isRequestSent && "cursor-not-allowed bg-[#e5e5e5] text-[#8a8a8a]",
              isRequestSent && "cursor-not-allowed border border-[#d1d5db] bg-[#e5e7eb] text-[#6b7280]",
            )}
          >
            {isRequestSent ? "Pending Approval" : "Send Request"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function SkillGapDetailPane({ isAskAuraFlow = false, isTabletEmbed = false }: { isAskAuraFlow?: boolean; isTabletEmbed?: boolean }) {
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
    setSelectedEmployeeId(null);
    setShowSuccessToast(true);
  }

  const recommendationChips = [
    { id: "adjust", label: "Adjust Availability", active: true },
    { id: "cross", label: "Cross Training", active: false },
    { id: "hire", label: "New Hire", active: false },
  ] as const;

  return (
    <div className={cn("min-h-full min-w-0 overflow-visible bg-white", isTabletEmbed ? "p-2 pb-5" : "p-3 pb-6 2xl:p-4 2xl:pb-8")}>
      {showSuccessToast ? <SuccessToast onClose={() => setShowSuccessToast(false)} /> : null}
      {isModalOpen ? <RequestAvailabilityModal onClose={() => setIsModalOpen(false)} onSend={handleConfirmSendRequest} /> : null}
      <SkillGapAccordion expanded={accordionExpanded} onToggle={() => setAccordionExpanded((expanded) => !expanded)} />
      <section className="relative mt-3 min-w-0 overflow-visible bg-white">
        <div className="flex min-h-[52px] items-start justify-between gap-3">
          <div>
            <h3 className="text-[21px] font-normal leading-[30px] text-[#111827]">Recommend Skill Gap Solutions</h3>
            <p className="mt-1 text-[17px] font-medium leading-[22px] text-primary">Baking Labor Task(40h gap)</p>
          </div>
          <button type="button" className="h-[38px] shrink-0 rounded-md bg-[#555] px-3 text-[14px] font-medium text-white 2xl:px-4 2xl:text-[15px]">
            Hire Recommendations
          </button>
        </div>
        <div className="mt-3 flex min-h-[48px] min-w-0 items-center rounded-lg border border-[#bcdcff] bg-[#f7f4ff] px-3 2xl:mt-4 2xl:h-[51px] 2xl:px-4">
          <p className="flex min-w-0 items-center gap-1.5 text-[15px] leading-5 text-[#111827]">
            <Sparkles className="mr-1 h-6 w-6 shrink-0 text-primary" />
            <span className="font-semibold">AI Recommendation :</span>
            <span className="font-semibold text-primary">Adjust employee availability</span>
            <span className="min-w-0 whitespace-normal">offers the fastest resolution with lowest risk.</span>
          </p>
        </div>
        {isAskAuraFlow ? (
          <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3 2xl:mt-4">
            {recommendationChips.map((chip) => (
              <span
                key={chip.id}
                className={cn(
                  "flex h-8 items-center justify-center rounded-full border px-3 text-center text-[13px] font-semibold whitespace-nowrap",
                  chip.active ? "border-primary bg-[#e8f2ff] text-primary" : "border-[#cbd5e1] bg-white text-[#111827]",
                )}
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            "mt-3 grid min-w-0 overflow-visible bg-[#f4f5fb] 2xl:mt-4",
            isTabletEmbed ? "grid-cols-1 gap-3" : "grid-cols-2 gap-3 2xl:gap-5",
          )}
        >
          <SolutionCard
            title="Adjust Availability"
            icon={CalendarDays}
            selected={!requestSentEmployeeId}
            isAskAuraLayout={isAskAuraFlow}
            isTabletEmbed={isTabletEmbed}
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
            isTabletEmbed={isTabletEmbed}
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

export function SkillGapDesktopScreen({ mode = "standard" }: { mode?: "standard" | "askAura" }) {
  const isAskAuraFlow = mode === "askAura";
  const searchParams = new URLSearchParams(window.location.search);
  const isEmbedded = searchParams.get("embed") === "1";
  const isTabletEmbed = isEmbedded && searchParams.get("device") === "tablet";
  const useTabletSkillGapLayout = isTabletEmbed && !isAskAuraFlow;
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [askAuraToast, setAskAuraToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (!askAuraToast) return;
    const timeoutId = window.setTimeout(() => setAskAuraToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [askAuraToast]);

  function handleAskAura() {
    setIsAuraOpen(true);
  }

  function handleAskAuraSendRequest(payload: { type: "availability" | "crossTraining"; employees: string[] }) {
    if (payload.type === "crossTraining") {
      setAskAuraToast({
        title: "Cross-training requests sent successfully",
        message: "Cross-training requests have been prepared for Jessica Brown and Ryan Anderson.",
      });
      return;
    }

    setAskAuraToast({
      title: "Availability requests sent successfully",
      message: "Availability requests have been sent for Sarah Johnson and Emily Carter.",
    });
  }

  return (
    <AppShell
      activeNavLabel="Home"
      showDemoBackLink={!isEmbedded}
      profile={{ name: "Smith, Jane", role: "Store Manager", avatar: "SJ", badge: 9, avatarUrl: profileAvatar }}
    >
      {askAuraToast ? (
        <SuccessToast
          onClose={() => setAskAuraToast(null)}
          title={askAuraToast.title}
          message={askAuraToast.message}
        />
      ) : null}
      <div className={cn("min-w-0 bg-[#f6f6f6]", useTabletSkillGapLayout ? "pr-2" : "pr-3 2xl:pr-5")}>
        <div className={cn("flex h-10 items-center gap-2", useTabletSkillGapLayout ? "px-3" : "px-4")}>
          <button type="button" aria-label="Back" className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-[#dcdcdc] bg-white text-[#5c5c5c]">
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
          <h1 className="text-[21px] font-medium leading-7 text-[#333333]">Skill Gap</h1>
          <HelpCircle className="h-3.5 w-3.5 text-[#5c5c5c]" />
        </div>

        <section className="min-w-0 rounded-t-md border border-[#e7e7e7] bg-white">
          <div className="flex h-[50px] items-center gap-5 border-b border-[#e7e7e7] px-4">
            <button type="button" className="rounded-md bg-[#0a68db1a] px-4 py-1.5 text-[17px] font-medium leading-[22px] text-primary">
              Alert
            </button>
            <button type="button" className="px-4 py-1.5 text-[17px] font-medium leading-[22px] text-[#5c5c5c]">Forecast</button>
          </div>

          <div className={cn("flex min-h-[68px] flex-wrap items-center gap-y-2 border-b border-[#dcdcdc] py-2", useTabletSkillGapLayout ? "gap-x-3 px-3" : "gap-x-4 px-4 2xl:gap-x-7 2xl:py-0")}>
            <div className="flex h-9 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
              <button type="button" className="flex w-9 items-center justify-center border-r border-[#c9cbd2]">
                <ChevronLeft className="h-5 w-5 text-[#5c5c5c]" />
              </button>
              <button type="button" className="flex min-w-[170px] items-center justify-between px-2 text-[16px] leading-[22px] 2xl:min-w-[198px] 2xl:text-[17px]">
                <span>Sun, 5/3/26</span>
                <Calendar className="h-[18px] w-[18px] text-primary" />
              </button>
              <button type="button" className="flex w-9 items-center justify-center border-l border-[#c9cbd2]">
                <ChevronRight className="h-5 w-5 text-[#5c5c5c]" />
              </button>
            </div>

            <SelectField label="Division:" value="Division 2" width={useTabletSkillGapLayout ? "w-[154px]" : "w-[clamp(132px,12vw,200px)]"} disabled />
            <SelectField label="Store:" value="111" width={useTabletSkillGapLayout ? "w-[132px]" : "w-[clamp(132px,12vw,200px)]"} />
            <SelectField label="Department:" value="All" width={useTabletSkillGapLayout ? "w-[132px]" : "w-[clamp(132px,12vw,200px)]"} />
            <SelectField label="Labor Task:" value="All" width={useTabletSkillGapLayout ? "w-[132px]" : "w-[clamp(132px,12vw,200px)]"} />
          </div>

          <div className={cn("grid min-w-0", useTabletSkillGapLayout ? "grid-cols-[300px_minmax(0,1fr)]" : "grid-cols-[minmax(300px,320px)_minmax(0,1fr)] 2xl:grid-cols-[448px_minmax(0,1fr)]")}>
            <aside className={cn("min-w-0 border-r border-[#e7e7e7] bg-white py-3", useTabletSkillGapLayout ? "px-2" : "px-3 2xl:px-4")}>
              <div className="flex h-10 items-center justify-between">
                <h2 className="text-[21px] font-normal leading-[30px] text-[#111827]">Skill Gap Alerts</h2>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 2xl:grid-cols-[189px_200px] 2xl:gap-4">
                <div className="flex h-9 items-center justify-between rounded-md border border-[#d4d7df] bg-white px-3 text-[17px] leading-[22px]">
                  <span>4 weeks</span>
                  <ChevronDown className="h-4 w-4 text-[#5c5c5c]" />
                </div>
                <div className="flex h-9 items-center justify-between rounded-md border border-[#d4d7df] bg-white px-3 text-[17px] leading-normal">
                  <span className="flex h-full items-center whitespace-nowrap">All Labor Task</span>
                  <ChevronDown className="h-4 w-4 text-[#5c5c5c]" />
                </div>
              </div>

              <p className="mt-4 text-[15px] leading-5 text-[#364153]">
                Showing 8 alerts: <span className="font-semibold">4 Weeks(5/3/26 - 5/24/26)</span>
              </p>

              <div className={cn("scrollbar-slim mt-2 max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto pr-1", useTabletSkillGapLayout ? "min-h-[390px]" : "min-h-[420px] 2xl:min-h-[520px]")}>
                {alertCards.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    card={alert}
                    isActive={selectedAlertId === alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    clickable={!(isAskAuraFlow && alert.id === 1)}
                  />
                ))}
              </div>
            </aside>

            <main className="min-w-0 max-w-full overflow-visible bg-white">
              {selectedAlertId === 1 ? <SkillGapDetailPane isAskAuraFlow={isAskAuraFlow} isTabletEmbed={useTabletSkillGapLayout} /> : <EmptyRightPane />}
            </main>
          </div>
        </section>
      </div>
      {isAskAuraFlow ? (
        <SkillGapAuraAssistant
          isOpen={isAuraOpen}
          onOpen={() => setIsAuraOpen(true)}
          onClose={() => setIsAuraOpen(false)}
          onSendAvailabilityRequests={handleAskAuraSendRequest}
        />
      ) : null}
    </AppShell>
  );
}
