import { CalendarX2 } from "lucide-react";
import { Button } from "../ui/button";

export function EmptyState() {
  return (
    <section className="flex min-h-[520px] items-center justify-center rounded-b-md bg-[#f1f3f9] p-6">
      <div className="max-w-sm rounded-[14px] bg-white p-8 text-center shadow-sm">
        <CalendarX2 className="mx-auto h-10 w-10 text-[#8b93a3]" />
        <h2 className="mt-4 text-[21px] font-semibold">No time off requests</h2>
        <p className="mt-2 text-[15px] leading-6 text-[#5c5c5c]">
          There are no draft or submitted requests for this date range.
        </p>
        <Button className="mt-5">Create Request</Button>
      </div>
    </section>
  );
}
