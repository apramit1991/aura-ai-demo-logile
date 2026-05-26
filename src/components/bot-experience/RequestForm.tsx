import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { employee, request } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

type RequestFormProps = {
  onCycleDate: () => void;
  isTouchMode?: boolean;
};

export function RequestForm({ onCycleDate, isTouchMode = false }: RequestFormProps) {
  const [rotation, setRotation] = useState(request.rotations[0]);
  const [reason, setReason] = useState(request.reasons[0]);

  return (
    <section className="min-w-0 bg-white lg:shrink-0 lg:border-r lg:border-[#d0d3da]">
      <div className="grid content-start gap-4 bg-[#f1f3f9] p-3 lg:min-h-[860px] 2xl:p-4 bg-white" >
        <div className="rounded-[14px] bg-[#e9ecf4] p-3">
          <p className="text-[15px] text-[#5c5c5c]">Employee Name</p>
          <p className="text-[17px] text-[#333333]">{employee.name}</p>
          <p className="mt-4 text-[15px] text-[#5c5c5c]">Org/ Position</p>
          <p className="text-[17px] text-[#333333]">{employee.orgPosition}</p>
        </div>

        <div className="rounded-[14px] bg-[#e9ecf4] p-3">
          <label className="text-[15px] text-[#5c5c5c]">
            Start - End Date<span className="text-[#e22d20]">*</span>
          </label>
          <div className="mt-1 flex h-9 overflow-hidden rounded-md border border-[#c9cbd2] bg-white">
            <button
              type="button"
              className={cn(
                "flex w-9 items-center justify-center border-r border-[#c9cbd2] text-[#5c5c5c]",
                !isTouchMode && "hover:bg-[#f8f9fb]",
              )}
              onClick={onCycleDate}
              aria-label="Previous week"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={cn(
                "flex flex-1 items-center justify-between px-2 text-[17px]",
                !isTouchMode && "hover:bg-[#f8f9fb]",
              )}
              onClick={onCycleDate}
            >
              <span>{request.dateRange}</span>
              <Calendar className="h-[18px] w-[18px] text-primary" />
            </button>
            <button
              type="button"
              className={cn(
                "flex w-9 items-center justify-center border-l border-[#c9cbd2] text-[#5c5c5c]",
                !isTouchMode && "hover:bg-[#f8f9fb]",
              )}
              onClick={onCycleDate}
              aria-label="Next week"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3">
            <Select
              label={
                <span>
                  Rotation<span className="text-[#e22d20]">*</span>
                </span>
              }
              value={rotation}
              onChange={(event) => setRotation(event.target.value)}
            >
              {request.rotations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>

          <div className="mt-3">
            <Select label="Reason" value={reason} onChange={(event) => setReason(event.target.value)}>
              {request.reasons.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>

          <label className="mt-3 grid gap-1 text-[15px] text-[#5c5c5c]">
            Comment
            <textarea className="h-[105px] resize-none rounded-md border border-[#c9cbd2] bg-white p-2 text-[17px] text-[#333333] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button className="flex-1">Submit</Button>
          <Button className="flex-1" variant="danger">
            Reject
          </Button>
        </div>
      </div>
    </section>
  );
}
