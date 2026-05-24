import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/bot-experience/AppShell";
import { AvailabilityScreen } from "./components/bot-experience/AvailabilityScreen";
import { AuraAssistant } from "./components/bot-experience/AuraAssistant";
import { EmptyState } from "./components/bot-experience/EmptyState";
import { PageHeader } from "./components/bot-experience/PageHeader";
import { SkillGapDesktopScreen } from "./components/bot-experience/SkillGapDesktopScreen";
import { TimeOffDesktopScreen } from "./components/bot-experience/TimeOffDesktopScreen";
import logileLogoUrl from "./assets/logile-logo.png";
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
      <header className="flex items-center gap-3">
        <img src={logileLogoUrl} alt="Logile" className="h-8 w-auto" />
      </header>
      <h1 className="text-[1.875rem] font-semibold leading-[2.5rem] text-[#1f2937]">Aura AI Demo Screens</h1>
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
  const isTabletEmbed = new URLSearchParams(window.location.search).get("tablet") === "1";

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
        hasPopulatedRows={hasPopulatedRows}
        isSubmitted={isSubmitted}
      />
    </AppShell>
  );
}

function TabletFrame() {
  return (
    <main className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dfe5ee_48%,#c9d2df_100%)] px-4 py-6 md:px-8">
      <div className="mx-auto w-fit rounded-[44px] border border-slate-950/30 bg-[#111827] p-4 shadow-[0_34px_90px_rgba(15,23,42,0.42)]">
        <div className="relative h-[768px] w-[1024px] max-w-[calc(100vw-64px)] overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-inner">
          <div className="pointer-events-none sticky left-0 top-0 z-[90] flex h-5 w-full justify-center bg-black/5">
            <span className="mt-2 h-1.5 w-24 rounded-full bg-slate-900/25" />
          </div>
          <iframe
            title="Availability Tablet Prototype"
            src="/availability-desktop?tablet=1"
            className="-mt-5 h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </main>
  );
}

function AvailabilityTabletScreen() {
  return <TabletFrame />;
}

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
        <Route path="/skill-gap-desktop" element={<SkillGapDesktopScreen />} />
        <Route path="/time-off-desktop" element={<TimeOffDesktopScreen />} />
        <Route path="/skill-gap-tablet" element={<PlaceholderScreen title="Skill Gap - Tablet" />} />
        <Route path="/availability-tablet" element={<AvailabilityTabletScreen />} />
        <Route path="/time-off-tablet" element={<PlaceholderScreen title="Time Off - Tablet" />} />
        <Route path="/mobile-screen" element={<PlaceholderScreen title="Mobile Screen" />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </PasswordGate>
  );
}
