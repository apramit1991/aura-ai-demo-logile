import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Maximize2,
  Mic,
  Minimize2,
  Paperclip,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AvailabilityValidationState, RecommendationData } from "../../App";
import { AuraChatHistoryView } from "./AuraChatHistoryView";
import sendButtonIcon from "../../assets/Send Button.svg";
import tabletVoiceInitialRequest from "../../assets/audio/availability-tablet/initial-request.wav";
import tabletVoiceYes from "../../assets/audio/availability-tablet/yes.wav";
import tabletVoiceDurationDetails from "../../assets/audio/availability-tablet/duration-details.wav";
import tabletVoiceChangeQuestion from "../../assets/audio/availability-tablet/change-question.wav";
import tabletVoiceFirstOption from "../../assets/audio/availability-tablet/first-option.wav";
import tabletVoiceSendManager from "../../assets/audio/availability-tablet/send-manager.wav";
import tabletVoiceSubmit from "../../assets/audio/availability-tablet/submit.wav";
import tabletVoiceThanks from "../../assets/audio/availability-tablet/thanks.wav";
import tabletVoiceNoThanks from "../../assets/audio/availability-tablet/no-thanks.wav";

type AuraState = "empty" | "partial" | "valid" | "error";
type PanelState = "closed" | "open" | "closing";
type ScriptedPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type VoiceDemoStatus = "idle" | "listening" | "transcribing";

type AuraMessage = {
  id: number;
  role: "assistant" | "user";
  text?: string;
  variant?: "recommendation" | "tableCard" | "status" | "confirmSubmit";
  applied?: boolean;
  recommendationRows?: RecommendationData;
  recommendationType?: "standard" | "warning" | "warning-comparison";
  tableTitle?: string;
  tableRows?: RecommendationData;
  summaryHours?: string;
  summaryDays?: string;
};

type AuraAssistantProps = {
  onApplyRecommendation: (data: RecommendationData, options?: { validationState?: AvailabilityValidationState }) => void;
  onUndoRecommendation: () => void;
  onSendToManager: (finalRows: RecommendationData) => void;
  hasPopulatedRows: boolean;
  isSubmitted: boolean;
  hideLauncherTooltip?: boolean;
  placement?: "fixed" | "inside-frame";
  demoMode?: "tabletVoiceTranscript";
};

const voiceDemoTiming = {
  assistantTyping: 2400,
  assistantCardTyping: 1800,
  listeningDelay: 1400,
  transcriptChunkDelay: 320,
  autoSubmitDelay: 1200,
  audioCompletionBuffer: 350,
  shortGap: 1900,
  mediumGap: 2200,
  longGap: 2500,
};

const tabletVoicePromptAudio = {
  initialRequest: { audioSrc: tabletVoiceInitialRequest, durationMs: 5300 },
  yes: { audioSrc: tabletVoiceYes, durationMs: 610 },
  durationDetails: { audioSrc: tabletVoiceDurationDetails, durationMs: 4770 },
  changeQuestion: { audioSrc: tabletVoiceChangeQuestion, durationMs: 4630 },
  firstOption: { audioSrc: tabletVoiceFirstOption, durationMs: 4140 },
  sendManager: { audioSrc: tabletVoiceSendManager, durationMs: 2965 },
  submit: { audioSrc: tabletVoiceSubmit, durationMs: 645 },
  thanks: { audioSrc: tabletVoiceThanks, durationMs: 1420 },
  noThanks: { audioSrc: tabletVoiceNoThanks, durationMs: 925 },
};

const tooltipContent: Record<AuraState, { title: string; message: string; description: string }> = {
  empty: {
    title: "AURA AI",
    message: "Suggest schedules, check rules, explain gaps, and guide next steps.",
    description: "",
  },
  partial: {
    title: "AURA AI",
    message: "Suggest schedules, check rules, explain gaps, and guide next steps.",
    description: "",
  },
  valid: {
    title: "AURA AI",
    message: "Suggest schedules, check rules, explain gaps, and guide next steps.",
    description: "",
  },
  error: {
    title: "AURA AI",
    message: "Suggest schedules, check rules, explain gaps, and guide next steps.",
    description: "",
  },
};

const initialRecommendationRows: RecommendationData = [
  { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Thursday", time: "9:00a - 5:00p", hours: "8h" },
  { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" },
];

const comparisonTopRows: RecommendationData = [
  { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Thursday", time: "9:00a - 5:00p", hours: "8h" },
  { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" },
];

const warningRecommendationRows: RecommendationData = [
  { day: "Monday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Tuesday", time: "12:00p - 4:00p", hours: "4h" },
  { day: "Thursday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Saturday", time: "9:00a - 8:00p", hours: "11h" },
  { day: "Sunday", time: "9:00a - 5:00p", hours: "8h" },
];

const scriptedCurrentRows: RecommendationData = [
  { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Thursday", time: "9:00a - 5:00p", hours: "8h" },
  { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" },
];

const scriptedFinalRows: RecommendationData = [
  { day: "Sunday", time: "9:00a - 2:00p", hours: "5h" },
  { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Thursday", time: "3:00p - 8:00p", hours: "5h" },
  { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
  { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" },
];

const scriptedGreeting = "Hello Jennings, How are you ! What can I do for you ?";

function getBadge(state: AuraState) {
  if (state === "error") {
    return {
      label: "!",
      className: "bg-[#fff4d6] text-[#8a4b00] ring-[#ffd56d]",
      icon: AlertTriangle,
    };
  }

  return null;
}

function getFreeTextReply(input: string) {
  return `I can review "${input}" against the availability rules and translate it into a compliant request draft.`;
}

function isWednesdayFridayTuesdayMorningUnavailableMessage(input: string) {
  const normalized = input.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const unavailableIndicators = [
    "not available",
    "not avilable",
    "unavailable",
    "cant work",
    "cannot work",
    "can t work",
  ];

  return (
    normalized.includes("wednesday") &&
    normalized.includes("friday") &&
    normalized.includes("tuesday") &&
    normalized.includes("morning") &&
    unavailableIndicators.some((indicator) => normalized.includes(indicator))
  );
}

function TypingIndicator() {
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

function TableCard({
  title,
  rows,
  summaryHours,
  summaryDays,
}: {
  title: string;
  rows: RecommendationData;
  summaryHours: string;
  summaryDays: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#d8dce6] bg-white text-[#333333] shadow-sm">
      <div className="border-b border-[#e6e9f0] px-3 py-2">
        <p className="text-[14px] font-semibold">{title}</p>
      </div>
      <div className="px-3 py-3">
        <div className="space-y-1.5 text-[14px]">
          {rows.map((row) => (
            <div key={row.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
              <span>{row.day}</span>
              <span className="text-[#5c5c5c]">{row.time}</span>
              <span className="min-w-8 text-right text-primary">{row.hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#d8dce6] pt-2 text-[13px] font-semibold text-[#5c5c5c]">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {summaryHours}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {summaryDays}
          </span>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  applied,
  onApply,
  rows,
  type = "standard",
}: {
  applied: boolean;
  onApply: () => void;
  rows: RecommendationData;
  type?: "standard" | "warning" | "warning-comparison";
}) {
  if (type === "warning-comparison") {
    return (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-lg bg-[#f0f1f6] text-[#333333] ring-1 ring-[#e2e4ec]">
          <div className="px-3 py-3">
            <div className="space-y-1.5 text-[14px]">
              {comparisonTopRows.map((row) => (
                <div key={row.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span>{row.day}</span>
                  <span className="text-[#5c5c5c]">{row.time}</span>
                  <span className="min-w-8 text-right text-primary">{row.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-y border-[#cfd3dd] py-2 text-[14px] font-semibold text-[#5c5c5c]">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                48 hrs total
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                5 days/week
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-[16px] font-medium text-[#111827]">VS</p>

        <div className="overflow-hidden rounded-lg border border-[#e6dca8] bg-[#f5edbe] text-[#333333] shadow-sm">
          <div className="space-y-3 px-3 py-3">
            <div className="flex items-center gap-2 text-[14px] leading-5 text-[#8a2d0a]">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>You may not meet your preferences for weekly total hours or days per week.</p>
            </div>
            <div className="space-y-1.5 text-[15px] leading-6">
              {rows.map((row) => (
                <div key={row.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span>{row.day}</span>
                  <span className="text-[#333333]">{row.time}</span>
                  <span className="min-w-8 text-right text-[#8a2d0a]">{row.hours}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-y border-[#d8cfa2] py-2 text-[14px] font-semibold text-[#333333]">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                45 hrs total
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                5 days/week
              </span>
            </div>
          </div>
          <div className="border-t border-[#d8cfa2] px-3 py-2 text-center">
            <button
              type="button"
              onClick={onApply}
              disabled={applied}
              className="inline-flex h-8 min-w-[112px] items-center justify-center rounded-md bg-primary px-4 text-[14px] font-medium text-white transition hover:bg-[#0858b9] disabled:cursor-default disabled:bg-[#8cadde]"
            >
              {applied ? "Applied" : "Yes, Apply"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "warning") {
    return (
      <div className="overflow-hidden rounded-lg border border-[#e6dca8] bg-[#f5edbe] text-[#333333] shadow-sm">
        <div className="space-y-3 px-3 py-3">
          <div className="flex items-center gap-2 text-[14px] leading-5 text-[#8a2d0a]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>You may not meet your preferences for weekly total hours or days per week.</p>
          </div>
          <div className="space-y-1.5 text-[15px] leading-6">
            {rows.map((row) => (
              <div key={row.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <span>{row.day}</span>
                <span className="text-[#333333]">{row.time}</span>
                <span className="min-w-8 text-right text-[#8a2d0a]">{row.hours}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-y border-[#d8cfa2] py-2 text-[14px] font-semibold text-[#333333]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              45 hrs total
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              5 days/week
            </span>
          </div>
        </div>
        <div className="border-t border-[#d8cfa2] px-3 py-2 text-center">
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            className="inline-flex h-8 min-w-[112px] items-center justify-center rounded-md bg-primary px-4 text-[14px] font-medium text-white transition hover:bg-[#0858b9] disabled:cursor-default disabled:bg-[#8cadde]"
          >
            {applied ? "Applied" : "Yes, Apply"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg bg-[#f0f1f6] text-[#333333] ring-1 ring-[#e2e4ec]">
        <div className="px-3 py-3">
          <p className="mb-4 text-[17px] leading-[1.35] text-[#333333]">
            Based on current demand patterns, here's my recommendation for this week. This gives you 48 hrs / 5 days while matching peak demand periods.
          </p>
          <div className="space-y-1.5 text-[14px]">
            {rows.map((row) => (
              <div key={row.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <span>{row.day}</span>
                <span className="text-[#5c5c5c]">{row.time}</span>
                <span className="min-w-8 text-right text-primary">{row.hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-y border-[#cfd3dd] py-2 text-[14px] font-semibold text-[#5c5c5c]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              48 hrs total
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              5 days/week
            </span>
          </div>
        </div>
        <div className="border-t border-[#d8dce6] px-3 py-2 text-center">
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

export function AuraAssistant({
  onApplyRecommendation,
  onUndoRecommendation,
  onSendToManager,
  hasPopulatedRows,
  isSubmitted,
  hideLauncherTooltip = false,
  placement = "fixed",
  demoMode,
}: AuraAssistantProps) {
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [requestState, setRequestState] = useState<AuraState>("valid");
  const [messages, setMessages] = useState<AuraMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [panelView, setPanelView] = useState<"activeChat" | "history">("activeChat");
  const [shouldNudgeLauncher, setShouldNudgeLauncher] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scriptedPhase, setScriptedPhase] = useState<ScriptedPhase>(0);
  const [showSendConfirmationActions, setShowSendConfirmationActions] = useState(false);
  const [voiceDemoStatus, setVoiceDemoStatus] = useState<VoiceDemoStatus>("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isVoiceDemoRunning, setIsVoiceDemoRunning] = useState(false);
  const [hasVoiceDemoStarted, setHasVoiceDemoStarted] = useState(false);
  const [isAutoSubmittingDemo, setIsAutoSubmittingDemo] = useState(false);

  const [hasAppliedSuggestion, setHasAppliedSuggestion] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);

  const replyTimerRef = useRef<number | null>(null);
  const scriptedStepTimerRef = useRef<number | null>(null);
  const demoTimersRef = useRef<number[]>([]);
  const demoAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const tooltip = tooltipContent[requestState];
  const badge = useMemo(() => getBadge(requestState), [requestState]);
  const BadgeIcon = badge?.icon;
  const isPanelVisible = panelState !== "closed";
  const showLauncher = panelState === "closed";
  const isInsideFrame = placement === "inside-frame";
  const isVoiceDemo = demoMode === "tabletVoiceTranscript";
  const isVoiceDemoActive = voiceDemoStatus !== "idle";
  const voiceDemoStatusLabel = voiceDemoStatus === "listening" ? "Listening..." : "Transcribing...";

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
    if (scriptedStepTimerRef.current) {
      window.clearTimeout(scriptedStepTimerRef.current);
      scriptedStepTimerRef.current = null;
    }
  }

  function clearDemoTimers() {
    demoTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    demoTimersRef.current = [];
    if (demoAudioRef.current) {
      demoAudioRef.current.pause();
      demoAudioRef.current.currentTime = 0;
      demoAudioRef.current = null;
    }
  }

  function scheduleDemoStep(callback: () => void, delay: number) {
    const timerId = window.setTimeout(() => {
      demoTimersRef.current = demoTimersRef.current.filter((id) => id !== timerId);
      callback();
    }, delay);
    demoTimersRef.current.push(timerId);
  }

  function scheduleDemoAssistant(reply: string | Omit<AuraMessage, "id" | "role">, startsAt: number, typingDelay = voiceDemoTiming.assistantTyping) {
    scheduleDemoStep(() => setIsTyping(true), startsAt);
    scheduleDemoStep(() => {
      appendMessage(
        typeof reply === "string"
          ? { role: "assistant", text: reply }
          : { role: "assistant", ...reply },
      );
      setIsTyping(false);
    }, startsAt + typingDelay);
  }

  function scheduleDemoVoiceUser(
    text: string,
    startsAt: number,
    voicePrompt?: { audioSrc: string; durationMs: number },
    onSubmitted?: () => void,
  ) {
    const words = text.split(" ");
    const chunkSize = words.length <= 3 ? 1 : 3;
    const transcriptStartsAt = startsAt + voiceDemoTiming.listeningDelay;
    scheduleDemoStep(() => {
      setVoiceDemoStatus("listening");
      setLiveTranscript("");
      if (voicePrompt) {
        const audio = new Audio(voicePrompt.audioSrc);
        demoAudioRef.current = audio;
        audio.play().catch(() => {
          demoAudioRef.current = null;
        });
      }
    }, startsAt);

    scheduleDemoStep(() => {
      setVoiceDemoStatus("transcribing");
    }, transcriptStartsAt);

    for (let index = 0; index < words.length; index += chunkSize) {
      const chunk = words.slice(0, index + chunkSize).join(" ");
      scheduleDemoStep(() => setLiveTranscript(chunk), transcriptStartsAt + (index / chunkSize) * voiceDemoTiming.transcriptChunkDelay);
    }

    const transcriptCompletionDelay =
      transcriptStartsAt +
      Math.ceil(words.length / chunkSize) * voiceDemoTiming.transcriptChunkDelay +
      voiceDemoTiming.autoSubmitDelay;
    const audioCompletionDelay = voicePrompt
      ? startsAt + voicePrompt.durationMs + voiceDemoTiming.audioCompletionBuffer
      : startsAt;
    const completionDelay = Math.max(transcriptCompletionDelay, audioCompletionDelay);

    scheduleDemoStep(() => {
      appendMessage({ role: "user", text });
      onSubmitted?.();
      setVoiceDemoStatus("idle");
      setLiveTranscript("");
      if (demoAudioRef.current) {
        demoAudioRef.current.pause();
        demoAudioRef.current = null;
      }
    }, completionDelay);

    return completionDelay;
  }

  function startVoiceTranscriptDemo() {
    clearReplyTimer();
    clearDemoTimers();
    setMessages([]);
    nextMessageIdRef.current = 1;
    setScriptedPhase(0);
    setShowActionButtons(false);
    setHasAppliedSuggestion(false);
    setShowSendConfirmationActions(false);
    setRequestState("partial");
    setIsTyping(false);
    setVoiceDemoStatus("idle");
    setLiveTranscript("");
    setIsAutoSubmittingDemo(false);
    setIsVoiceDemoRunning(true);
    setHasVoiceDemoStarted(true);

    let t = 700;
    scheduleDemoAssistant("Hello James, how are you? What can I do for you today?", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Hey, I wanted to see if something can be done as I am not available on Tuesday and Thursday.", t, tabletVoicePromptAudio.initialRequest);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("Sure. Do you want me to update your availability and suggest an option that could still work within the rules?", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Yes.", t, tabletVoicePromptAudio.yes);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("What duration will you be unavailable for? Will it be the full day or only part of the day?", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Tuesday will be the whole day, and on Thursday I won’t be available for 6 hours.", t, tabletVoicePromptAudio.durationDetails);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("Great, sounds like you’ve got plans. Here is your current availability.", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.shortGap;
    scheduleDemoAssistant(
      {
        variant: "tableCard",
        tableTitle: "Current Availability (48h)",
        tableRows: scriptedCurrentRows,
        summaryHours: "48 hrs total",
        summaryDays: "5 days/week",
      },
      t,
      voiceDemoTiming.assistantCardTyping,
    );
    t += voiceDemoTiming.assistantCardTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Okay, yes I am aware. Tell me how this changes as per what I said.", t, tabletVoicePromptAudio.changeQuestion);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("You might not meet the full requirement for this week. This change may create a gap in coverage during this time period.", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    scheduleDemoAssistant("If you can work Sunday 9:00a–2:00p, your request has a 95% chance of approval. Without this adjustment, the chance of manager approval may reduce to 30%.", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Okay, let’s go with the first option. I will work something out.", t, tabletVoicePromptAudio.firstOption);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("Sure, that looks good. Here is your final availability matrix for this week.", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.shortGap;
    scheduleDemoAssistant(
      {
        variant: "tableCard",
        tableTitle: "Final Availability Matrix",
        tableRows: scriptedFinalRows,
        summaryHours: "50 hrs total",
        summaryDays: "6 days/week",
      },
      t,
      voiceDemoTiming.assistantCardTyping,
    );
    t += voiceDemoTiming.assistantCardTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Yup, this looks good. Send it to my manager.", t, tabletVoicePromptAudio.sendManager);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant(
      {
        variant: "confirmSubmit",
        text: "Please confirm if you want to submit this availability request to your manager.",
      },
      t,
    );
    scheduleDemoStep(() => setShowSendConfirmationActions(true), t + voiceDemoTiming.assistantTyping);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.longGap;
    scheduleDemoStep(() => setIsAutoSubmittingDemo(true), t);
    t += 900;
    t = scheduleDemoVoiceUser("Submit", t, tabletVoicePromptAudio.submit, () => {
      setShowSendConfirmationActions(false);
      setIsAutoSubmittingDemo(false);
      onSendToManager(scriptedFinalRows);
    });
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant(
      {
        variant: "status",
        text: "Done — sent to your manager.\n\nYour request ID is 437862374.",
      },
      t,
    );
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("Great, thanks.", t, tabletVoicePromptAudio.thanks);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("Will there be anything else?", t);
    t += voiceDemoTiming.assistantTyping + voiceDemoTiming.mediumGap;
    t = scheduleDemoVoiceUser("No thanks.", t, tabletVoicePromptAudio.noThanks);
    t += voiceDemoTiming.shortGap;
    scheduleDemoAssistant("Have a good day.", t);
    scheduleDemoStep(() => {
      setIsVoiceDemoRunning(false);
      setHasVoiceDemoStarted(false);
    }, t + voiceDemoTiming.assistantTyping + voiceDemoTiming.longGap);
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

  function queueAssistantReply(reply: string | Omit<AuraMessage, "id" | "role">, delay = 1000) {
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
    clearReplyTimer();
    clearCloseTimer();
    clearNudgeTimer();
    setShouldNudgeLauncher(false);
    setPanelState("open");
    setIsFullscreen(false);
    setDraftMessage("");
    setPanelView("activeChat");

    if (isVoiceDemo) {
      if (messages.length === 0 && !hasVoiceDemoStarted) {
        startVoiceTranscriptDemo();
      }
      return;
    }

    if (messages.length === 0) {
      setScriptedPhase(0);
      setShowSendConfirmationActions(false);
      setIsTyping(true);
      scriptedStepTimerRef.current = window.setTimeout(() => {
        appendMessage({ role: "assistant", text: scriptedGreeting });
        setIsTyping(false);
        scriptedStepTimerRef.current = null;
      }, 1000);
    }
  }

  function closeAssistant() {
    clearReplyTimer();
    clearDemoTimers();
    clearCloseTimer();
    clearNudgeTimer();
    setIsTyping(false);
    setVoiceDemoStatus("idle");
    setLiveTranscript("");
    setIsVoiceDemoRunning(false);
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

  function handleApplyRecommendation(messageId: number, rows: RecommendationData, validationState: AvailabilityValidationState = "valid") {
    if (isTyping || isSubmitted) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, applied: true } : message,
      ),
    );
    appendMessage({ role: "user", text: "Yes, apply" });
    setRequestState("partial");
    onApplyRecommendation(rows, { validationState });
    setHasAppliedSuggestion(true);
    setShowActionButtons(true);

    queueAssistantReply(
      validationState === "valid"
        ? "I’ve applied the 5-day availability plan to your request."
        : "I’ve applied the suggested availability. You can undo this change if you want to revise it.",
      420,
    );
  }

  function handleSubmitToManager() {
    if (isTyping) return;
    setShowSendConfirmationActions(false);
    appendMessage({ role: "user", text: "Submit" });
    onSendToManager(scriptedFinalRows);
    queueAssistantReply(
      {
        variant: "status",
        text: "Done — sent to your manager.\n\nYour request ID is 437862374.",
      },
      1000,
    );
    setScriptedPhase(9);
  }

  function handleNotNowSubmission() {
    if (isTyping) return;
    setShowSendConfirmationActions(false);
    appendMessage({ role: "user", text: "Not now" });
    queueAssistantReply("No problem. I’ll keep this availability request as a draft.", 1000);
    setScriptedPhase(8);
  }

  function handleUndo() {
    onUndoRecommendation();
    setHasAppliedSuggestion(false);
    setShowActionButtons(false);
    appendMessage({ role: "user", text: "Undo" });
    queueAssistantReply("I’ve undone the suggested availability changes.", 240);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = draftMessage.trim();
    if (!trimmedMessage || isTyping || isVoiceDemoRunning) return;

    appendMessage({ role: "user", text: trimmedMessage });
    setDraftMessage("");
    setRequestState("partial");

    if (scriptedPhase === 0) {
      setScriptedPhase(1);
      queueAssistantReply("Sure. Do you want me to update your availability and suggest an option that could still work within the rules?", 1000);
      return;
    }

    if (scriptedPhase === 1) {
      setScriptedPhase(2);
      queueAssistantReply("What duration will you be unavailable for? Will it be the full day or only part of the day?", 1000);
      return;
    }

    if (scriptedPhase === 2) {
      setScriptedPhase(3);
      queueAssistantReply("Great, sounds like you’ve got plans. Here is your current availability.", 1000);
      scriptedStepTimerRef.current = window.setTimeout(() => {
        queueAssistantReply(
          {
            variant: "tableCard",
            tableTitle: "Current Availability (48h)",
            tableRows: scriptedCurrentRows,
            summaryHours: "48 hrs total",
            summaryDays: "5 days/week",
          },
          1000,
        );
      }, 1650);
      return;
    }

    if (scriptedPhase === 3) {
      setScriptedPhase(4);
      queueAssistantReply("You might not meet the full requirement for this week. This change may create a gap in coverage during this time period.", 1000);
      scriptedStepTimerRef.current = window.setTimeout(() => {
        queueAssistantReply("If you can work Sunday 9:00a–2:00p, your request has a 95% chance of approval. Without this adjustment, the chance of manager approval may reduce to 30%.", 1000);
      }, 1650);
      return;
    }

    if (scriptedPhase === 4) {
      setScriptedPhase(5);
      queueAssistantReply("Sure, that looks good. Here is your final availability matrix for this week.", 1000);
      scriptedStepTimerRef.current = window.setTimeout(() => {
        queueAssistantReply(
          {
            variant: "tableCard",
            tableTitle: "Final Availability Matrix",
            tableRows: scriptedFinalRows,
            summaryHours: "50 hrs total",
            summaryDays: "6 days/week",
          },
          1000,
        );
      }, 1650);
      return;
    }

    if (scriptedPhase === 5) {
      setScriptedPhase(6);
      queueAssistantReply(
        {
          variant: "confirmSubmit",
          text: "Please confirm if you want to submit this availability request to your manager.",
        },
        1000,
      );
      setShowSendConfirmationActions(true);
      return;
    }

    if (scriptedPhase === 9) {
      setScriptedPhase(10);
      queueAssistantReply("Will there be anything else?", 1000);
      return;
    }

    if (scriptedPhase === 10) {
      queueAssistantReply("Have a good day.", 1000);
      return;
    }

    if (isWednesdayFridayTuesdayMorningUnavailableMessage(trimmedMessage)) {
      setShowActionButtons(false);
      setHasAppliedSuggestion(false);
      queueAssistantReply({
        text: "Here’s my recommendation:",
        variant: "recommendation",
        applied: false,
        recommendationRows: warningRecommendationRows,
        recommendationType: "warning-comparison",
      }, 820);
      return;
    }

    queueAssistantReply(getFreeTextReply(trimmedMessage), 820);
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
  }, [messages, isTyping, isPanelVisible, showActionButtons]);

  useEffect(() => {
    resizeComposer();
  }, [draftMessage, liveTranscript, isPanelVisible]);


  useEffect(() => {
    if (!hasPopulatedRows || isSubmitted) {
      setShowActionButtons(false);
      setHasAppliedSuggestion(false);
    }
  }, [hasPopulatedRows, isSubmitted]);
  useEffect(() => {
    return () => {
      clearReplyTimer();
      clearDemoTimers();
      clearCloseTimer();
      clearNudgeTimer();
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "z-50 transition-all duration-300",
          isInsideFrame ? "absolute bottom-6 right-6" : "fixed bottom-4 right-4 sm:bottom-6 sm:right-6",
          !showLauncher && "pointer-events-none translate-y-2 opacity-0",
          showLauncher && shouldNudgeLauncher && "aura-launcher-nudge",
        )}
      >
        <div className="group relative flex justify-end">
          {!hideLauncherTooltip ? (
            <div className="pointer-events-none absolute bottom-[calc(100%+12px)] right-0 w-[286px] translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100">
              <div className="relative rounded-lg border border-[#d8dce6] bg-white px-4 py-3 text-left shadow-xl">
                <p className="text-[13px] font-semibold tracking-wide text-[#5b2ad9]">{tooltip.title}</p>
                <p className="mt-1 text-[15px] font-semibold leading-5 text-[#1f2937]">{tooltip.message}</p>
                {tooltip.description ? (
                  <p className="mt-0.5 text-[13px] text-[#5c5c5c]">{tooltip.description}</p>
                ) : null}
                <span className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-[#d8dce6] bg-white" />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            aria-label="Open AURA AI assistant"
            onClick={openAssistant}
            className="relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#33C7EA] to-[#2A2DBB] px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(42,45,187,0.35),0_0_24px_rgba(51,199,234,0.28)] outline-none ring-1 ring-white/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(42,45,187,0.42),0_0_32px_rgba(51,199,234,0.36)] focus-visible:ring-4 focus-visible:ring-[#7edff4]"
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
          "z-50 flex w-[calc(100vw-24px)] max-w-[clamp(360px,28vw,420px)] origin-bottom-right flex-col overflow-hidden border border-[#d8dce6] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] transition-all duration-300 ease-out",
          isInsideFrame ? "absolute" : "fixed",
          isFullscreen
            ? "bottom-0 right-0 top-0 w-full max-w-[clamp(360px,28vw,420px)] rounded-none sm:bottom-0 sm:right-0 sm:top-0"
            : isInsideFrame
              ? "bottom-3 right-3 top-3 rounded-xl"
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
        <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] px-5 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "animate-[aura-message-in_800ms_ease-out] rounded-lg px-3 py-2 text-[14px] leading-5 shadow-sm",
                message.role === "assistant"
                  ? cn("max-w-[92%] bg-[#E6F0FB] text-[#333333]", message.variant === "recommendation" && "bg-[#f4f5fb] p-3")
                  : "ml-auto max-w-[84%] bg-[#F4F5FA] text-[#111827]",
              )}
            >
              {message.variant === "recommendation" ? (
                <RecommendationCard
                  applied={Boolean(message.applied)}
                  rows={message.recommendationRows ?? initialRecommendationRows}
                  type={message.recommendationType}
                  onApply={() =>
                    handleApplyRecommendation(
                      message.id,
                      message.recommendationRows ?? initialRecommendationRows,
                      message.recommendationType === "warning" || message.recommendationType === "warning-comparison"
                        ? "warning"
                        : "valid",
                    )
                  }
                />
              ) : message.variant === "tableCard" && message.tableTitle && message.tableRows && message.summaryHours && message.summaryDays ? (
                <TableCard
                  title={message.tableTitle}
                  rows={message.tableRows}
                  summaryHours={message.summaryHours}
                  summaryDays={message.summaryDays}
                />
              ) : message.variant === "status" ? (
                <div className="rounded-lg border border-[#b8e4c8] bg-[#ecfdf3] px-3 py-2.5 text-[#166534]">
                  <p className="whitespace-pre-line text-[14px] font-medium leading-5">{message.text}</p>
                </div>
              ) : message.variant === "confirmSubmit" ? (
                <div className="space-y-3 rounded-lg border border-[#d8dce6] bg-white px-3 py-3">
                  <p className="text-[14px] leading-5 text-[#333333]">{message.text}</p>
                  {showSendConfirmationActions ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSubmitToManager}
                        className={cn(
                          "inline-flex h-8 items-center justify-center rounded-[40px] bg-primary px-4 text-[13px] font-medium text-white transition hover:bg-[#0858b9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                          isAutoSubmittingDemo && "animate-pulse ring-4 ring-primary/20",
                        )}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={handleNotNowSubmission}
                        className="inline-flex h-8 items-center justify-center rounded-[40px] border border-[#d8dce6] bg-white px-4 text-[13px] font-medium text-[#333333] transition hover:border-[#9ebcf0] hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                      >
                        Not now
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                message.text
              )}
            </div>
          ))}

          {showActionButtons ? (
            <div className="animate-[aura-message-in_800ms_ease-out] rounded-lg border border-[#d8dce6] bg-white px-3 py-3 text-[14px] text-[#333333]">
              <p className="mb-3">You can undo the applied availability change from this chat.</p>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[#c9cbd2] bg-white px-4 font-medium text-[#333333] transition hover:bg-[#f3f4f6]"
                >
                  Undo
                </button>
              </div>
            </div>
          ) : null}

          {isTyping ? <TypingIndicator /> : null}
          <div ref={scrollAnchorRef} />
        </div>

        <div className="border-t border-[#e2e5ec] bg-white p-4">
          {isVoiceDemo && isVoiceDemoActive ? (
            <div
              className={cn(
                "mb-2 flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium",
                "bg-[#e8f2ff] text-[#0868db]",
              )}
              aria-live="polite"
            >
              <span className="relative flex h-2.5 w-2.5 animate-pulse">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#33c7ea] opacity-75" />
              </span>
              <span>{voiceDemoStatusLabel}</span>
              <span className="ml-auto flex items-end gap-0.5" aria-hidden="true">
                <span className="h-2 w-1 animate-[aura-wave_1100ms_ease-in-out_infinite] rounded-full bg-[#0868db]" />
                <span className="h-3 w-1 animate-[aura-wave_1100ms_ease-in-out_infinite] rounded-full bg-[#33c7ea] [animation-delay:180ms]" />
                <span className="h-2.5 w-1 animate-[aura-wave_1100ms_ease-in-out_infinite] rounded-full bg-[#0868db] [animation-delay:360ms]" />
              </span>
            </div>
          ) : null}
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
              placeholder={isVoiceDemoActive ? voiceDemoStatusLabel : "Ask AURA"}
              aria-label="Ask AURA"
              value={isVoiceDemo && liveTranscript ? liveTranscript : draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              disabled={isTyping || isVoiceDemoRunning}
            />
            <button
              type="submit"
              disabled
              className={cn(
                "relative mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isVoiceDemo && isVoiceDemoActive
                  ? "bg-gradient-to-r from-[#33C7EA] to-[#2A2DBB] text-white opacity-100 shadow-[0_0_0_6px_rgba(51,199,234,0.16)]"
                  : "disabled:opacity-45",
              )}
              aria-label="Send message"
            >
              {isVoiceDemo && isVoiceDemoActive ? (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#33C7EA]/25" aria-hidden="true" />
                  <Mic className="relative h-5 w-5" aria-hidden="true" />
                </>
              ) : (
                <img src={sendButtonIcon} alt="" className="h-12 w-12" aria-hidden="true" />
              )}
            </button>
          </form>
        </div>
          </>
        )}
      </aside>
    </>
  );
}
