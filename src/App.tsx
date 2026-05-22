import { useState } from "react";
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

export default function App() {
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
