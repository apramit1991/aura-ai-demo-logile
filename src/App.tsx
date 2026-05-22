import { useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/bot-experience/AppShell";
import { AvailabilityScreen } from "./components/bot-experience/AvailabilityScreen";
import { AuraAssistant } from "./components/bot-experience/AuraAssistant";
import { EmptyState } from "./components/bot-experience/EmptyState";
import { PageHeader } from "./components/bot-experience/PageHeader";
import { availabilityDays } from "./data/mockData";
import { AvailabilityRow } from "./types/availability";

export type RecommendationData = {
  day: string;
  time: string;
  hours: string;
}[];

function DemoNavigationScreen() {
  const desktopLinks = [
    { label: "Skill Gap - Desktop", to: "/skill-gap-desktop" },
    { label: "Availability - Desktop", to: "/availability-desktop" },
    { label: "Time Off - Desktop", to: "/time-off-desktop" },
  ];

  const tabletLinks = [
    { label: "Skill Gap - Tablet", to: "/skill-gap-tablet" },
    { label: "Availability - Tablet", to: "/availability-tablet" },
    { label: "Time Off - Tablet", to: "/time-off-tablet" },
  ];

  const mobileLinks = [{ label: "Mobile Screen", to: "/mobile-screen" }];

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold text-[#1f2937]">Logile WFM Demo Screens</h1>
      <p className="mt-2 text-[#4b5563]">Select a screen to open the prototype demo.</p>

      <section className="mt-8 rounded-md border border-[#d1d5db] bg-white p-5">
        <h2 className="text-lg font-medium text-[#111827]">Desktop</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {desktopLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#1f2937] hover:bg-[#f3f4f6]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-md border border-[#d1d5db] bg-white p-5">
        <h2 className="text-lg font-medium text-[#111827]">Tablet</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {tabletLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#1f2937] hover:bg-[#f3f4f6]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-md border border-[#d1d5db] bg-white p-5">
        <h2 className="text-lg font-medium text-[#111827]">Mobile</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {mobileLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#1f2937] hover:bg-[#f3f4f6]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
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

  function handleApplyRecommendation(recommendation: RecommendationData) {
    setIsSubmitted(false);
    setBaselineRows((currentBaseline) => currentBaseline ?? availabilityRows.map((row) => ({ ...row })));

    const recommendationByDay = Object.fromEntries(recommendation.map((item) => [item.day, item]));

    setAvailabilityRows((current) =>
      current.map((row) => {
        const matched = recommendationByDay[row.day];
        if (!matched) {
          return { ...row, auraFilled: false };
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
  }

  function handleUndoRecommendation() {
    if (!baselineRows) return;
    setAvailabilityRows(baselineRows.map((row) => ({ ...row, auraFilled: false })));
    setBaselineRows(null);
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
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3600);
  }

  return (
    <AppShell>
      {toastVisible ? (
        <div className="fixed right-6 top-6 z-[70] w-[360px] rounded-lg border border-[#d7e5db] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#1f8f55]" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[#1f2937]">Availability request submitted</p>
              <p className="mt-1 text-[13px] text-[#4b5563]">Your availability request has been submitted for manager review.</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6]"
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

      <div className="px-5 pt-5">
        <Link to="/demo" className="inline-block text-sm font-medium text-[#1d4ed8] hover:underline">
          {"\u2190 Back to Demo Screens"}
        </Link>
      </div>
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
        />
      ) : (
        <EmptyState />
      )}
      <AuraAssistant
        onApplyRecommendation={handleApplyRecommendation}
        onUndoRecommendation={handleUndoRecommendation}
        onConfirmSubmitRecommendation={handleConfirmSubmit}
        hasPopulatedRows={hasPopulatedRows}
        isSubmitted={isSubmitted}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demo" replace />} />
      <Route path="/demo" element={<DemoNavigationScreen />} />
      <Route path="/availability-desktop" element={<AvailabilityDesktopScreen />} />
      <Route path="/skill-gap-desktop" element={<PlaceholderScreen title="Skill Gap - Desktop" />} />
      <Route path="/time-off-desktop" element={<PlaceholderScreen title="Time Off - Desktop" />} />
      <Route path="/skill-gap-tablet" element={<PlaceholderScreen title="Skill Gap - Tablet" />} />
      <Route path="/availability-tablet" element={<PlaceholderScreen title="Availability - Tablet" />} />
      <Route path="/time-off-tablet" element={<PlaceholderScreen title="Time Off - Tablet" />} />
      <Route path="/mobile-screen" element={<PlaceholderScreen title="Mobile Screen" />} />
      <Route path="*" element={<Navigate to="/demo" replace />} />
    </Routes>
  );
}
