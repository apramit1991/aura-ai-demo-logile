import { SummaryCards } from "./SummaryCards";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { RequestForm } from "./RequestForm";
import { Button } from "../ui/button";
import { AvailabilityRow } from "../../types/availability";

type AvailabilityScreenProps = {
  isLoading: boolean;
  onCycleDate: () => void;
  rows: AvailabilityRow[];
  onDeleteRow: (day: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
};

export function AvailabilityScreen({
  isLoading,
  onCycleDate,
  rows,
  onDeleteRow,
  onReset,
  onSubmit,
  isSubmitted,
}: AvailabilityScreenProps) {
  const totalDays = rows.filter((row) => row.hours !== "0h").length;
  const totalHours = rows.reduce((sum, row) => sum + Number.parseInt(row.hours, 10), 0);

  return (
    <div className="mx-0 overflow-hidden rounded-t-md border border-[#d0d3da] bg-[#f1f3f9] md:mr-5">
      <div className="flex items-center justify-between border-b border-[#d0d3da] bg-white px-5 py-3">
        <h2 className="text-[19px] font-medium text-primary">Create Availability Request</h2>
      </div>

      <div className="grid lg:grid-cols-[327px_minmax(0,1fr)]">
        <RequestForm onCycleDate={onCycleDate} />
        <section className="min-w-0 p-4 md:p-4">
          <SummaryCards totalHours={totalHours} totalDays={totalDays} />

          <div id="my-availability-section" className="mt-7 flex items-center justify-between">
            <h2 className="text-[21px] font-normal">My Availability</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onReset} disabled={isSubmitted}>
                Reset
              </Button>
              <Button size="sm" onClick={onSubmit} disabled={isSubmitted || totalDays === 0}>
                Submit
              </Button>
            </div>
          </div>

          <AvailabilityGrid isLoading={isLoading} rows={rows} onDeleteRow={onDeleteRow} />
        </section>
      </div>
    </div>
  );
}
