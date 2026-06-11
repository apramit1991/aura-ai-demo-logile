import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Clock3,
  Copy,
  Mail,
  Menu,
  MessageSquare,
  Monitor,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  X,
  CircleHelp,
} from "lucide-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/bot-experience/AppShell";
import { getAvatarByName } from "./lib/avatarHelper";
import { AvailabilityScreen } from "./components/bot-experience/AvailabilityScreen";
import { AuraAssistant } from "./components/bot-experience/AuraAssistant";
import { EmptyState } from "./components/bot-experience/EmptyState";
import { PageHeader } from "./components/bot-experience/PageHeader";
import { SkillGapDesktopScreen } from "./components/bot-experience/SkillGapDesktopScreen";
import { TimeOffDesktopScreen } from "./components/bot-experience/TimeOffDesktopScreen";
import { SkillGapEmployeeDesktopScreen } from "./components/bot-experience/SkillGapEmployeeDesktopScreen";
import { SkillGapEmployeeTabletScreen } from "./components/bot-experience/SkillGapEmployeeTabletScreen";
import { ManagerDesktopScreen } from "./components/bot-experience/ManagerDesktopScreen";
import { ManagerTabletScreen } from "./components/bot-experience/ManagerTabletScreen";
import { ApprovalEmployeeScreen } from "./components/bot-experience/ApprovalEmployeeScreen";
import { ComponentShowcase } from "./components/ui/ComponentShowcase";
import { Tabs } from "./components/ui/tabs";
import logileLogoUrl from "./assets/logile-logo.png";
import { availabilityDays, employee, request } from "./data/mockData";
import { AvailabilityRow } from "./types/availability";

export type RecommendationData = {
  day: string;
  time: string;
  hours: string;
}[];

export type AvailabilityValidationState = "valid" | "warning";

function DemoNavigationScreen() {
  const availabilityMobilePrototypeUrl =
    "https://www.figma.com/proto/Knn1ZIFk1rP6DIQ9V7yU1C/LTSP-3.0-MVP?node-id=2013-2308&t=bt9ZTf2FKzD9PNkY-1";
  const sections = [
    {
      title: "Availability",
      description: "Manage employee availability preferences and AI-suggested schedules.",
      links: [
        { label: "Availability Employee— Desktop", to: "/availability-desktop", device: "Desktop", icon: Monitor },
        { label: "Availability Recommendation (High Preferences)", to: "/availability-desktop-change-pref", device: "Desktop", icon: Monitor },
        { label: "Availability Manager — Desktop", to: "/availability-manager", device: "Desktop", icon: Monitor },
        { label: "Availability Employee — Tablet", to: "/availability-tablet", device: "Tablet", icon: Tablet },
        { label: "Availability Manager — Tablet", to: "/availability-manager-tablet", device: "Tablet", icon: Tablet },
        // { label: "Availability — Mobile", to: availabilityMobilePrototypeUrl, device: "Mobile", icon: Smartphone, external: true },
      ],
    },
    {
      title: "Skill Gap",
      description: "Review skill shortages, AI recommendations, and Ask Aura assistance.",
      links: [
        { label: "Skill Gap AI Recommendation — Desktop", to: "/skill-gap-desktop", device: "Desktop", icon: Monitor },
        { label: "Skill Gap Ask Aura — Desktop", to: "/skill-gap-ask-aura", device: "Desktop", icon: Monitor },
        { label: "Skill Gap AI Recommendation — Tablet", to: "/skill-gap-tablet", device: "Tablet", icon: Tablet },
        { label: "Skill Gap Ask Aura — Tablet", to: "/skill-gap-ask-aura-tablet", device: "Tablet", icon: Tablet },
        { label: "Skill Gap Employee — Desktop", to: "/skill-gap-employee", device: "Desktop", icon: Monitor },
        { label: "Skill Gap Employee— Tablet", to: "/skill-gap-employee-tablet", device: "Tablet", icon: Tablet },
      ],
    },
    // {
    //   title: "Time Off",
    //   description: "Review time-off request flows across device formats.",
    //   links: [
    //     { label: "Time Off — Desktop", to: "/time-off-desktop", device: "Desktop", icon: Monitor },
    //   ],
    // },
    {
      title: "Approval",
      description: "Review and manage approval workflows for employee requests.",
      links: [
        { label: "Approval Employee — Desktop", to: "/approval-employee", device: "Desktop", icon: Monitor },
        { label: "Approval Manager — Desktop", to: "/availability-manager", device: "Desktop", icon: Monitor },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1040px]">
        <header>
          <div>
            <img src={logileLogoUrl} alt="Logile" className="h-8 w-auto" />
            <h1 className="mt-4 text-[42px] font-semibold leading-tight text-[#0f172a]">Aura AI Demo Screens</h1>
            <p className="mt-3 text-[16px] text-[#64748B]">
              Explore AI-assisted WFM prototype flows across desktop, tablet, and mobile.
            </p>
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563EB]">
                  {section.title === "Availability" ? (
                    <CalendarCheck2 className="h-5 w-5" />
                  ) : section.title === "Skill Gap" ? (
                    <Sparkles className="h-5 w-5" />
                  ) : section.title === "Approval" ? (
                    <ClipboardList className="h-5 w-5" />
                  ) : (
                    <Clock3 className="h-5 w-5" />
                  )}
                </div>
                <h2 className="text-[22px] font-semibold text-[#0f172a]">{section.title}</h2>
              </div>
              <p className="mt-2 text-[15px] text-[#64748B]">{section.description}</p>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.links.map((link) => {
                  const DeviceIcon = link.icon;
                  const cardClassName =
                    "group flex min-h-[68px] items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#f8fafc] px-4 py-3 text-left transition-colors hover:border-[#2563EB] hover:bg-[#eff6ff]";
                  const cardContent = (
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold text-[#0f172a]">{link.label}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#64748B]">
                        <DeviceIcon className="h-3.5 w-3.5" />
                        {link.device}
                      </p>
                    </div>
                  );

                  if ("external" in link && link.external) {
                    return (
                      <a
                        key={`${section.title}-${link.label}`}
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className={cardClassName}
                      >
                        {cardContent}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={`${section.title}-${link.label}`}
                      to={link.to}
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <Link to="/demo" className="inline-block text-sm font-medium text-[#1d4ed8] hover:underline">
        {"\u2190 Back to Demo Screens"}
      </Link>
      <div className="mt-5 rounded-md border border-[#d1d5db] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#1f2937]">{title}</h1>
      </div>
    </main>
  );
}

function AvailabilityDesktopScreen() {
  const [activeTab, setActiveTab] = useState("availability");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityRows, setAvailabilityRows] = useState<AvailabilityRow[]>(availabilityDays);
  const [baselineRows, setBaselineRows] = useState<AvailabilityRow[] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [managerToastVisible, setManagerToastVisible] = useState(false);
  const [availabilityValidationState, setAvailabilityValidationState] = useState<AvailabilityValidationState>("valid");
  const searchParams = new URLSearchParams(window.location.search);
  const isTabletEmbed = searchParams.get("tablet") === "1";
  const isEmbedded = searchParams.get("embed") === "1";
  const isTouchMode = isEmbedded && (searchParams.get("device") === "tablet" || searchParams.get("device") === "mobile");

  const hasPopulatedRows = useMemo(
    () => availabilityRows.some((row) => row.hours !== "0h"),
    [availabilityRows],
  );

  function simulateDateChange() {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 650);
  }

  function parseRecommendationTime(timeStr: string) {
    const [start, end] = timeStr.split(" - ").map((part) => part.trim());
    return { start: start ?? "00:00a/p", end: end ?? "00:00a/p" };
  }

  function handleApplyRecommendation(
    recommendation: RecommendationData,
    options: { validationState?: AvailabilityValidationState } = {},
  ) {
    setIsSubmitted(false);
    setAvailabilityValidationState(options.validationState ?? "valid");
    setBaselineRows(availabilityRows.map((row) => ({ ...row })));

    const recommendationByDay = Object.fromEntries(recommendation.map((item) => [item.day, item]));

    setAvailabilityRows((current) =>
      current.map((row) => {
        const matched = recommendationByDay[row.day];
        if (!matched) {
          return {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          };
        }

        const times = parseRecommendationTime(matched.time);
        return {
          ...row,
          start: times.start,
          end: times.end,
          hours: matched.hours,
          auraFilled: true,
        };
      }),
    );

    if (isTabletEmbed) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("my-availability-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleDeleteRow(day: string) {
    setAvailabilityRows((current) =>
      current.map((row) =>
        row.day === day
          ? {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          }
          : row,
      ),
    );
  }

  function handleReset() {
    setAvailabilityRows(availabilityDays.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setShowConfirmDialog(false);
    setIsSubmitted(false);
    setAvailabilityValidationState("valid");
  }

  function handleUndoRecommendation() {
    if (!baselineRows) return;
    setAvailabilityRows(baselineRows.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setAvailabilityValidationState("valid");
  }

  function handleSubmitClick() {
    if (!hasPopulatedRows || isSubmitted) return;
    setShowConfirmDialog(true);
  }

  function handleConfirmSubmit() {
    setAvailabilityRows((current) => current.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setShowConfirmDialog(false);
    setIsSubmitted(true);
    setAvailabilityValidationState("valid");
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3600);
  }

  function handleSendToManager(finalRows: RecommendationData) {
    handleApplyRecommendation(finalRows, { validationState: "valid" });
    setManagerToastVisible(true);
    window.setTimeout(() => setManagerToastVisible(false), 3600);
  }

  return (
    <AppShell showDemoBackLink={!isEmbedded}>
      {toastVisible ? (
        <div className="fixed right-6 top-6 z-[70] w-[360px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">Availability request submitted</p>
              <p className="mt-1 text-[13px] text-white/90">Your availability request has been submitted for manager review.</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close success toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
      {managerToastVisible ? (
        <div className="fixed right-6 top-6 z-[72] w-[360px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">Request sent successfully</p>
              <p className="mt-1 text-[13px] text-white/90">Your availability request has been sent to your manager.</p>
            </div>
            <button
              type="button"
              onClick={() => setManagerToastVisible(false)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close success toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {showConfirmDialog ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-[340px] rounded-lg border border-[#d8dce6] bg-white p-4 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#1f2937]">Submit Availability Request?</h3>
            <p className="mt-2 text-[14px] text-[#4b5563]">
              You’re about to submit this availability request for review. Please confirm that the highlighted availability details are correct.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-[#c9cbd2] bg-white px-4 text-[14px] font-medium text-[#333333] hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-[14px] font-medium text-white hover:bg-[#0858b9]"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <PageHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "availability" ? (
        <AvailabilityScreen
          isLoading={isLoading}
          onCycleDate={simulateDateChange}
          rows={availabilityRows}
          onDeleteRow={handleDeleteRow}
          onReset={handleReset}
          onSubmit={handleSubmitClick}
          isSubmitted={isSubmitted}
          validationState={availabilityValidationState}
          isTouchMode={isTouchMode}
        />
      ) : (
        <EmptyState />
      )}
      <AuraAssistant
        onApplyRecommendation={handleApplyRecommendation}
        onUndoRecommendation={handleUndoRecommendation}
        onSendToManager={handleSendToManager}
        hasPopulatedRows={hasPopulatedRows}
        isSubmitted={isSubmitted}
        hideLauncherTooltip={isTouchMode}
      />
    </AppShell>
  );
}

function AvailabilityChangePrefScreen() {
  const [activeTab, setActiveTab] = useState("availability");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityRows, setAvailabilityRows] = useState<AvailabilityRow[]>(availabilityDays);
  const [baselineRows, setBaselineRows] = useState<AvailabilityRow[] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [managerToastVisible, setManagerToastVisible] = useState(false);
  const [availabilityValidationState, setAvailabilityValidationState] = useState<AvailabilityValidationState>("valid");

  const hasPopulatedRows = useMemo(
    () => availabilityRows.some((row) => row.hours !== "0h"),
    [availabilityRows],
  );

  function simulateDateChange() {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 650);
  }

  function parseRecommendationTime(timeStr: string) {
    const [start, end] = timeStr.split(" - ").map((part) => part.trim());
    return { start: start ?? "00:00a/p", end: end ?? "00:00a/p" };
  }

  function handleApplyRecommendation(
    recommendation: RecommendationData,
    options: { validationState?: AvailabilityValidationState } = {},
  ) {
    setIsSubmitted(false);
    setAvailabilityValidationState(options.validationState ?? "valid");
    setBaselineRows(availabilityRows.map((row) => ({ ...row })));

    const recommendationByDay = Object.fromEntries(recommendation.map((item) => [item.day, item]));

    setAvailabilityRows((current) =>
      current.map((row) => {
        const matched = recommendationByDay[row.day];
        if (!matched) {
          return {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          };
        }

        const times = parseRecommendationTime(matched.time);
        return {
          ...row,
          start: times.start,
          end: times.end,
          hours: matched.hours,
          auraFilled: true,
        };
      }),
    );
  }

  function handleDeleteRow(day: string) {
    setAvailabilityRows((current) =>
      current.map((row) =>
        row.day === day
          ? {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          }
          : row,
      ),
    );
  }

  function handleReset() {
    setAvailabilityRows(availabilityDays.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setShowConfirmDialog(false);
    setIsSubmitted(false);
    setAvailabilityValidationState("valid");
  }

  function handleUndoRecommendation() {
    if (!baselineRows) return;
    setAvailabilityRows(baselineRows.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setAvailabilityValidationState("valid");
  }

  function handleSubmitClick() {
    if (!hasPopulatedRows || isSubmitted) return;
    setShowConfirmDialog(true);
  }

  function handleConfirmSubmit() {
    setAvailabilityRows((current) => current.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setShowConfirmDialog(false);
    setIsSubmitted(true);
    setAvailabilityValidationState("valid");
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3600);
  }

  function handleSendToManager(finalRows: RecommendationData) {
    handleApplyRecommendation(finalRows, { validationState: "valid" });
    setManagerToastVisible(true);
    window.setTimeout(() => setManagerToastVisible(false), 3600);
  }

  return (
    <AppShell showDemoBackLink>
      {toastVisible ? (
        <div className="fixed right-6 top-6 z-[70] w-[360px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">Availability request submitted</p>
              <p className="mt-1 text-[13px] text-white/90">Your availability request has been submitted for manager review.</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close success toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
      {managerToastVisible ? (
        <div className="fixed right-6 top-6 z-[72] w-[360px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">Request sent successfully</p>
              <p className="mt-1 text-[13px] text-white/90">Your availability request has been sent to your manager.</p>
            </div>
            <button
              type="button"
              onClick={() => setManagerToastVisible(false)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close success toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {showConfirmDialog ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-[340px] rounded-lg border border-[#d8dce6] bg-white p-4 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#1f2937]">Submit Availability Request?</h3>
            <p className="mt-2 text-[14px] text-[#4b5563]">
              You're about to submit this availability request for review. Please confirm that the highlighted availability details are correct.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-[#c9cbd2] bg-white px-4 text-[14px] font-medium text-[#333333] hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-[14px] font-medium text-white hover:bg-[#0858b9]"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <PageHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "availability" ? (
        <AvailabilityScreen
          isLoading={isLoading}
          onCycleDate={simulateDateChange}
          rows={availabilityRows}
          onDeleteRow={handleDeleteRow}
          onReset={handleReset}
          onSubmit={handleSubmitClick}
          isSubmitted={isSubmitted}
          validationState={availabilityValidationState}
        />
      ) : (
        <EmptyState />
      )}
      <AuraAssistant
        onApplyRecommendation={handleApplyRecommendation}
        onUndoRecommendation={handleUndoRecommendation}
        onSendToManager={handleSendToManager}
        hasPopulatedRows={hasPopulatedRows}
        isSubmitted={isSubmitted}
        demoMode="changePref"
      />
    </AppShell>
  );
}

function TabletFrame({ title, src }: { title: string; src: string }) {
  return (
    <main className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dfe5ee_48%,#c9d2df_100%)] px-4 py-4 md:px-8 md:py-5">
      <div className="sticky top-0 z-[100] -mx-4 mb-4 flex h-12 items-center justify-center bg-black md:-mx-8">
        <div className="w-fit">
          <Link to="/demo" className="inline-block px-2 py-1 text-[14px] font-medium text-[#0b70d0] hover:underline">
            {"\u2190 Back to Demo Screens"}
          </Link>
        </div>
      </div>
      <div className="mx-auto w-fit max-w-full rounded-[44px] border border-slate-950/30 bg-[#111827] p-4 shadow-[0_34px_90px_rgba(15,23,42,0.42)]">
        <div className="relative h-[900px] w-[1200px] max-w-[calc(100vw-64px)] overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-inner">
          <div className="pointer-events-none sticky left-0 top-0 z-[90] flex h-5 w-full justify-center bg-black/5">
            <span className="mt-2 h-1.5 w-24 rounded-full bg-slate-900/25" />
          </div>
          <iframe
            title={title}
            src={src}
            className="-mt-5 h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </main>
  );
}

function AvailabilityTabletScreen() {
  const [activeTabletTab, setActiveTabletTab] = useState("availability");
  const [rows, setRows] = useState<AvailabilityRow[]>(availabilityDays);
  const [baselineRows, setBaselineRows] = useState<AvailabilityRow[] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTabletToast, setShowTabletToast] = useState(false);
  const totalDays = rows.filter((row) => row.hours !== "0h").length;
  const totalHours = rows.reduce((sum, row) => sum + Number.parseInt(row.hours, 10), 0);
  const hasPopulatedRows = rows.some((row) => row.hours !== "0h");

  function handleClearAll() {
    setRows(availabilityDays.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setIsSubmitted(false);
    setShowTabletToast(false);
  }

  function handleResetRow(day: string) {
    setRows((current) =>
      current.map((row) =>
        row.day === day
          ? {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          }
          : row,
      ),
    );
  }

  function parseRecommendationTime(timeStr: string) {
    const [start, end] = timeStr.split(" - ").map((part) => part.trim());
    return { start: start ?? "00:00a/p", end: end ?? "00:00a/p" };
  }

  function handleApplyRecommendation(recommendation: RecommendationData) {
    setIsSubmitted(false);
    setBaselineRows(rows.map((row) => ({ ...row })));
    const recommendationByDay = Object.fromEntries(recommendation.map((item) => [item.day, item]));

    setRows((current) =>
      current.map((row) => {
        const matched = recommendationByDay[row.day];
        if (!matched) {
          return {
            ...row,
            start: "00:00a/p",
            end: "00:00a/p",
            hours: "0h",
            auraFilled: false,
          };
        }

        const times = parseRecommendationTime(matched.time);
        return {
          ...row,
          start: times.start,
          end: times.end,
          hours: matched.hours,
          auraFilled: true,
        };
      }),
    );
  }

  function handleUndoRecommendation() {
    if (!baselineRows) return;
    setRows(baselineRows.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
    setIsSubmitted(false);
  }

  function handleTabletSendToManager(recommendation: RecommendationData) {
    handleApplyRecommendation(recommendation);
    setIsSubmitted(true);
    setShowTabletToast(true);
    window.setTimeout(() => setShowTabletToast(false), 3600);
  }

  return (
    <main className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dfe5ee_48%,#c9d2df_100%)] px-4 py-4 md:px-8 md:py-5">
      <div className="sticky top-0 z-[100] -mx-4 mb-4 flex h-12 items-center justify-center bg-black md:-mx-8">
        <div className="w-fit">
          <Link to="/demo" className="inline-block px-2 py-1 text-[14px] font-medium text-[#0b70d0] hover:underline">
            {"\u2190 Back to Demo Screens"}
          </Link>
        </div>
      </div>

      <div className="mx-auto w-fit max-w-full rounded-[44px] border border-slate-950/30 bg-[#111827] p-4 shadow-[0_34px_90px_rgba(15,23,42,0.42)]">
        <div className="relative h-[900px] w-[1024px] max-w-[calc(100vw-64px)] overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-inner">
          <div className="pointer-events-none sticky left-0 top-0 z-[90] flex h-5 w-full justify-center bg-black/5">
            <span className="mt-2 h-1.5 w-24 rounded-full bg-slate-900/25" />
          </div>

          <div className="relative -mt-5 h-[calc(100%+20px)] overflow-hidden bg-[#f1f2f7]">
            {showTabletToast ? (
              <div
                className="absolute right-6 top-6 z-[80] w-[360px] rounded-lg bg-[#1f8f46] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">Request sent successfully</p>
                    <p className="mt-1 text-[13px] text-white/90">Your availability request has been sent to your manager.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTabletToast(false)}
                    className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
                    aria-label="Close success toast"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
            <div className="h-full overflow-y-auto bg-[#f1f2f7] pb-24 text-[#333333]">
              <header className="flex h-[58px] items-center gap-4 bg-[#f1f2f7] px-4">
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-md text-[#333333]" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </button>

                <img src={logileLogoUrl} alt="Logile WFM" className="h-[23px] w-[128px] object-contain" />

                <label className="relative ml-9 flex h-10 w-[228px] items-center">
                  <Search className="absolute left-3 h-[18px] w-[18px] text-[#5c5c5c]" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="h-10 w-full rounded-[7px] border border-[#d7d9e0] bg-white pl-9 pr-3 text-[18px] text-[#333333] outline-none placeholder:text-[#8b8f98]"
                  />
                </label>

                <div className="ml-auto flex items-center gap-4 text-[#4f545d]">
                  {[
                    { icon: Calendar, label: "Calendar" },
                    { icon: ClipboardList, label: "Tasks" },
                    { icon: Mail, label: "Messages" },
                    { icon: MessageSquare, label: "Comments" },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} type="button" className="flex h-9 w-9 items-center justify-center rounded-md" aria-label={label}>
                      <Icon className="h-[21px] w-[21px]" />
                    </button>
                  ))}
                  <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-md" aria-label="Notifications">
                    <Bell className="h-[21px] w-[21px]" />
                    <span className="absolute -right-1 top-0 rounded-full bg-[#e22d20] px-1.5 text-[12px] font-medium leading-4 text-white">99+</span>
                  </button>
                </div>

                <button type="button" className="ml-1 flex h-10 w-[196px] items-center gap-2 rounded-md border border-[#d4d7de] bg-white px-2" aria-label="Open profile menu">
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#cfe8bf] text-[12px] font-bold text-[#2f6a28]">
                    {getAvatarByName(employee.name) ? (
                      <img src={getAvatarByName(employee.name)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      employee.avatar
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-left leading-tight">
                    <span className="block truncate text-[15px] font-semibold text-[#333333]">{employee.name}</span>
                    <span className="block text-[15px] font-semibold text-[#5c5c5c]">{employee.role}</span>
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#5c5c5c]" />
                </button>
              </header>

              <section className="px-[30px] pb-6">
                <div className="flex h-[48px] items-center gap-3">
                  <button type="button" className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[#d4d7de] bg-white text-[#5c5c5c]" aria-label="Back">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-[16px] font-semibold leading-8 text-[#333333]">LTSP: Create Request</h1>
                  <CircleHelp className="h-4.5 w-4.5 text-[#5c5c5c]" />
                </div>

                <div className="relative z-10">
                  <Tabs
                    activeTab={activeTabletTab}
                    onChange={setActiveTabletTab}
                    tabs={[
                      { id: "availability", label: "Availability" },
                      { id: "time-off", label: "Time Off" },
                    ]}
                  />
                </div>

                <div className="-mt-px overflow-hidden rounded-t-md rounded-b-[8px] border border-[#d0d3da] bg-[#f1f3f9]">
                  <div className="flex h-[48px] items-center border-b border-[#d0d3da] bg-white px-5">
                    <h2 className="text-[16px] font-medium leading-6 text-[#0066d9]">Create Availability Request</h2>
                  </div>
                  <button type="button" className="flex h-[46px] w-full items-center gap-2 border-b border-[#d0d3da] bg-white px-3 text-left">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#b8bcc5] text-[#6b7280]">
                      <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                    </span>
                    <span className=" border-[#0066d9] pb-0.5 text-[16px]  font-semibold leading-5 text-[#0066d9]">Apply Filters</span>
                  </button>

                  <div className="bg-[#f1f2f7] px-4 pb-4 pt-4">
                    <div className="grid grid-cols-[1fr_1.02fr_1fr] gap-4">
                      <AvailabilityTabletSummaryCard title="My Preferences">
                        <AvailabilityTabletMetric label="Hours per week" value="30" emphasis />
                        <AvailabilityTabletMetric label="Day per week" value="5" />
                      </AvailabilityTabletSummaryCard>

                      <AvailabilityTabletSummaryCard title="Work Group Rules">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {request.rules.map((item) => (
                            <AvailabilityTabletInlineRule key={item.label} label={item.label} value={item.value} />
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-[#e0e2e7] pt-3 text-[15px] text-[#5c5c5c]">
                          <span>Weekly Range:</span>
                          <span className="text-[22px] font-normal text-[#0066d9]">4-30 <span className="text-[11px] text-[#5c5c5c]">hrs</span></span>
                        </div>
                      </AvailabilityTabletSummaryCard>

                      <AvailabilityTabletSummaryCard title="My Availability">
                        <div className="space-y-3 text-[15px] text-[#5c5c5c]">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p>Total Hours</p>
                              <p className="mt-1 text-[20px] font-semibold text-[#333333]">{totalHours}h</p>
                            </div>
                            {isSubmitted ? (
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#b8e4c8] bg-[#ecfdf3] text-[#1f8f55]">
                                <CheckCircle2 className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center justify-between gap-3 border-t border-[#e0e2e7] pt-3">
                            <div>
                              <p>Total Days</p>
                              <p className="mt-1 text-[20px] font-semibold text-[#333333]">{totalDays} Days</p>
                            </div>
                            {isSubmitted ? (
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#b8e4c8] bg-[#ecfdf3] text-[#1f8f55]">
                                <CheckCircle2 className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </AvailabilityTabletSummaryCard>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="text-[21px] font-semibold leading-7 text-[#333333]">My Availability</h2>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="h-9 rounded-[7px] border border-[#0066d9] bg-white px-3 text-[17px] font-normal leading-5 text-[#0066d9]"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button type="button" className="h-[39px] min-w-[80px] rounded-[7px] bg-[#555555] px-5 text-[17px] text-white">
                          Save as Draft
                        </button>
                        <button type="button" className="h-[39px] min-w-[82px] rounded-[7px] bg-[#0066d9] px-5 text-[17px] text-white">
                          Submit
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-[14px]">
                      {rows.map((row) => (
                        <AvailabilityTabletRow key={row.day} row={row} onReset={handleResetRow} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <AuraAssistant
              onApplyRecommendation={handleApplyRecommendation}
              onUndoRecommendation={handleUndoRecommendation}
              onSendToManager={handleTabletSendToManager}
              hasPopulatedRows={hasPopulatedRows}
              isSubmitted={isSubmitted}
              hideLauncherTooltip
              placement="inside-frame"
              demoMode="tabletVoiceTranscript"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function AvailabilityTabletSummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-h-[176px] rounded-[14px] border border-[#cfd3dc] bg-white px-3 py-3">
      <h3 className="mb-4 text-[20px] font-semibold leading-6 text-[#333333]">{title}</h3>
      {children}
    </section>
  );
}

function AvailabilityTabletMetric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="mb-3 grid grid-cols-[1fr_auto] items-center gap-4 text-[15px] text-[#5c5c5c]">
      <span>{label} :</span>
      <span className={emphasis ? "text-[20px] font-bold text-[#0066d9]" : "text-[20px] font-normal text-[#7a7d83]"}>{value}</span>
    </div>
  );
}

function AvailabilityTabletInlineRule({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1 text-[15px] text-[#5c5c5c]">
      <span className="whitespace-nowrap">{label}:</span>
      <span className="text-[22px] font-normal leading-6 text-[#0066d9]">{value}</span>
    </div>
  );
}

function AvailabilityTabletRow({ row, onReset }: { row: AvailabilityRow; onReset: (day: string) => void }) {
  const isPopulated = row.hours !== "0h";

  return (
    <div className="grid min-h-[60px] grid-cols-[124px_174px_56px_36px_36px_1fr] items-center gap-3 rounded-[8px] bg-white px-4">
      <div className="flex items-center gap-3 text-[17px] font-semibold leading-5 text-[#333333]">
        <Calendar className="h-[19px] w-[19px] text-[#5c5c5c]" />
        <span>{row.day}</span>
      </div>
      <div className="flex h-9 items-center justify-center rounded-[7px] border border-[#c9cbd2] bg-white px-2 text-[17px] leading-5 text-[#888888]">
        {row.start} - {row.end}
      </div>
      <div className="flex items-center gap-1 text-[17px] font-semibold leading-5 text-[#333333]">
        <Clock3 className="h-4 w-4 text-[#b8bcc5]" />
        {row.hours}
      </div>
      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c]" aria-label={`Copy time range for ${row.day}`}>
        <Copy className="h-[19px] w-[19px]" />
      </button>
      <button
        type="button"
        onClick={isPopulated ? () => onReset(row.day) : undefined}
        disabled={!isPopulated}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[#5c5c5c] disabled:text-[#5c5c5c]"
        aria-label={`Reset row for ${row.day}`}
      >
        <RotateCcw className="h-[19px] w-[19px]" />
      </button>
      <span />
    </div>
  );
}

function SkillGapTabletScreen() {
  return <TabletFrame title="Skill Gap Tablet Prototype" src="/skill-gap-desktop?embed=1&device=tablet" />;
}

function SkillGapAskAuraTabletScreen() {
  return <TabletFrame title="Skill Gap Ask Aura Tablet Prototype" src="/skill-gap-ask-aura?embed=1&device=tablet" />;
}

// SkillGapEmployeeTabletScreen is imported from ./components/bot-experience/SkillGapManagerTabletScreen.tsx

function PasswordGate({ children }: { children: React.ReactNode }) {
  const isProd = import.meta.env.PROD;
  const [isAuthed, setIsAuthed] = useState(() => {
    if (!isProd) return true;
    try {
      return localStorage.getItem("logile_demo_authed") === "true";
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isProd || isAuthed) return;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [isAuthed, isProd]);

  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const root = modalRef.current;
    if (!root) return;

    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((node) => !node.hasAttribute("disabled") && node.tabIndex !== -1);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  }

  function handleUnlock() {
    if (password === "Demo@Logile") {
      try {
        localStorage.setItem("logile_demo_authed", "true");
      } catch {
        // ignore storage failures; the session will still be unlocked for this runtime
      }
      setIsAuthed(true);
      setError(null);
      return;
    }

    setError("Incorrect password. Please try again.");
  }

  if (!isProd || isAuthed) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4" onKeyDown={trapFocus}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-password-title"
        className="w-full max-w-[420px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-center gap-3">
          <img src={logileLogoUrl} alt="Logile" className="h-7 w-auto" />
          <div className="min-w-0">
            <h2 id="demo-password-title" className="text-[18px] font-semibold text-slate-900">
              Protected Demo
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-600">Enter password to continue.</p>
          </div>
        </div>

        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleUnlock();
          }}
        >
          <label className="block text-[13px] font-medium text-slate-700" htmlFor="demo-password">
            Password
          </label>
          <input
            id="demo-password"
            ref={inputRef}
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-[14px] text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-[13px] font-medium text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-[14px] font-semibold text-white hover:bg-[#0858b9] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PasswordGate>
      <Routes>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="/demo" element={<DemoNavigationScreen />} />
        <Route path="/availability-desktop" element={<AvailabilityDesktopScreen />} />
        <Route path="/availability-desktop-change-pref" element={<AvailabilityChangePrefScreen />} />
        <Route path="/availability-manager" element={<ManagerDesktopScreen />} />
        <Route path="/skill-gap-desktop" element={<SkillGapDesktopScreen />} />
        <Route path="/skill-gap-ask-aura" element={<SkillGapDesktopScreen mode="askAura" />} />
        <Route path="/time-off-desktop" element={<TimeOffDesktopScreen />} />
        <Route path="/approval-employee" element={<ApprovalEmployeeScreen />} />
        <Route path="/skill-gap-tablet" element={<SkillGapTabletScreen />} />
        <Route path="/skill-gap-ask-aura-tablet" element={<SkillGapAskAuraTabletScreen />} />
        <Route path="/skill-gap-employee" element={<SkillGapEmployeeDesktopScreen />} />
        <Route path="/skill-gap-employee-tablet" element={<SkillGapEmployeeTabletScreen />} />
        <Route path="/availability-tablet" element={<AvailabilityTabletScreen />} />
        <Route path="/availability-manager-tablet" element={<ManagerTabletScreen />} />
        <Route path="/components" element={<ComponentShowcase />} />
        <Route path="/time-off-tablet" element={<PlaceholderScreen title="Time Off - Tablet" />} />
        <Route path="/availability-mobile" element={<PlaceholderScreen title="Availability - Mobile" />} />
        <Route path="/mobile-screen" element={<Navigate to="/availability-mobile" replace />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </PasswordGate>
  );
}
