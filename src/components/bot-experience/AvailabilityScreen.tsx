import { SummaryCards } from "./SummaryCards";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { RequestForm } from "./RequestForm";
import { Button } from "../ui/button";
import { AvailabilityRow } from "../../types/availability";
import type { AvailabilityValidationState } from "../../App";

type AvailabilityScreenProps = {
  isLoading: boolean;
  onCycleDate: () => void;
  rows: AvailabilityRow[];
  onDeleteRow: (day: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  validationState: AvailabilityValidationState;
  isTouchMode?: boolean;
};

export function AvailabilityScreen({
  isLoading,
  onCycleDate,
  rows,
  onDeleteRow,
  onReset,
  onSubmit,
  isSubmitted,
  validationState,
  isTouchMode = false,
}: AvailabilityScreenProps) {
  const totalDays = rows.filter((row) => row.hours !== "0h").length;
  const totalHours = rows.reduce((sum, row) => sum + Number.parseInt(row.hours, 10), 0);

  return (
    <div className="mx-0 max-w-full overflow-hidden rounded-t-md border border-[#d0d3da] bg-[#f1f3f9] md:mr-3 2xl:mr-5">
      <div className="flex items-center justify-between border-b border-[#d0d3da] bg-white px-5 py-3">
        <h2 className="text-[19px] font-medium text-primary">Create Availability Request</h2>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" onClick={onReset} disabled={isSubmitted}>
            Clear All
          </Button> */}
          <button type="button" className="h-[39px] min-w-[80px] rounded-[7px] bg-[#4F4F4F] px-5 text-[17px]  text-white">
            Save as Draft
          </button>
          <button type="button" className="h-[39px] min-w-[80px] rounded-[7px] bg-[#0066d9] px-5 text-[17px]  text-white"
            onClick={onSubmit} disabled={isSubmitted || totalDays === 0}
          >
            Submit
          </button>
          {/* <Button className="h-[39px] min-w-[82px] rounded-[7px] bg-[#0066d9] px-5 text-[17px]" size="sm" onClick={onSubmit} disabled={isSubmitted || totalDays === 0}>
            Submit
          </Button> */}
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(300px,327px)_minmax(0,1fr)]">
        <RequestForm onCycleDate={onCycleDate} isTouchMode={isTouchMode} />
        <section className="min-w-0 p-3 2xl:p-4">
          <SummaryCards
            totalHours={totalHours}
            totalDays={totalDays}
            validationState={validationState}
            isTouchMode={isTouchMode}
          />
          <div className="flex justify-start  align-middle mt-7 gap-3">
            <div id="my-availability-section" className=" flex items-center justify-between">
              <h2 className="text-[21px] font-normal">My Availability</h2>
            </div>
            {/* <Button variant="outline" size="sm" onClick={onReset} disabled={isSubmitted}>
              Clear All
            </Button> */}
            <button type="button" className="h-[39px] min-w-[80px] rounded-[7px] border border-[#0066d9] bg-[#ffffff] px-5 text-[17px]  text-[#0066d9]"
              onClick={onReset} disabled={isSubmitted}
            >
              Clear All
            </button>
          </div>



          <AvailabilityGrid
            isLoading={isLoading}
            rows={rows}
            onDeleteRow={onDeleteRow}
            validationState={validationState}
            isTouchMode={isTouchMode}
          />
        </section>
      </div>
    </div>
  );
}
