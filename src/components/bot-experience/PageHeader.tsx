import { ChevronLeft, CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs } from "../ui/tabs";

type PageHeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function PageHeader({ activeTab, onTabChange }: PageHeaderProps) {
  return (
    <div className="pt-2 md:pr-5">
      <div className="flex min-h-[54px] flex-wrap items-center gap-3 px-4">
        <Button variant="outline" size="icon" aria-label="Back">
          <ChevronLeft className="h-[22px] w-[22px]" />
        </Button>
        <h1 className="text-[25px] font-semibold leading-[34px] text-[#333333]">
          LTSP: Create Request
        </h1>
        <CircleHelp className="h-5 w-5 text-[#5c5c5c]" />
      </div>
      <div className="px-4">
        <Tabs
          activeTab={activeTab}
          onChange={onTabChange}
          tabs={[
            { id: "availability", label: "Availability", badge: 2 },
            { id: "time-off", label: "Time Off", badge: 2 },
          ]}
        />
      </div>
    </div>
  );
}
