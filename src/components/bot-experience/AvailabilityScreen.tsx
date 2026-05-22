import { SummaryCards } from "./SummaryCards";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { RequestForm } from "./RequestForm";
import { Button } from "../ui/button";
import { RecommendationData } from "../../App";

type AvailabilityScreenProps = {
  isLoading: boolean;
  onCycleDate: () => void;
  appliedRecommendation: RecommendationData | null;
};

export function AvailabilityScreen({
  isLoading,
  onCycleDate,
  appliedRecommendation,
}: AvailabilityScreenProps) {
  return (
    <div className="mx-0 overflow-hidden rounded-t-md border border-[#d0d3da] bg-[#f1f3f9] md:mr-5">
      <div className="flex items-center justify-between border-b border-[#d0d3da] bg-white px-5 py-3">
        <h2 className="text-[19px] font-medium text-primary">Create Availability Request</h2>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="danger" size="sm">
            Reject
          </Button>
          <Button size="sm">Submit</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[327px_minmax(0,1fr)]">
        <RequestForm onCycleDate={onCycleDate} />
        <section className="min-w-0 p-4 md:p-4">
          <SummaryCards />
          <AvailabilityGrid isLoading={isLoading} appliedRecommendation={appliedRecommendation} />
        </section>
      </div>
    </div>
  );
}
