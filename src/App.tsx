import { useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/bot-experience/AppShell";
import { AvailabilityScreen } from "./components/bot-experience/AvailabilityScreen";
import { AuraAssistant } from "./components/bot-experience/AuraAssistant";
import { EmptyState } from "./components/bot-experience/EmptyState";
import { PageHeader } from "./components/bot-experience/PageHeader";

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
  const [appliedRecommendation, setAppliedRecommendation] = useState<RecommendationData | null>(null);

  function simulateDateChange() {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 650);
  }

  function handleApplyRecommendation(recommendation: RecommendationData) {
    setAppliedRecommendation(recommendation);
  }

  return (
    <AppShell>
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
          appliedRecommendation={appliedRecommendation}
        />
      ) : (
        <EmptyState />
      )}
      <AuraAssistant onApplyRecommendation={handleApplyRecommendation} />
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
