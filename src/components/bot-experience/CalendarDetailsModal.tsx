import { X } from "lucide-react";

interface CalendarDetailsModalProps {
  onClose: () => void;
}

export function CalendarDetailsModal({ onClose }: CalendarDetailsModalProps) {
  // Jan 2021 calendar days shown in the grid:
  // Row 1: 8, 9, 10, 11, 12, 13, 14
  // Row 2: 15, 16, 17, 18, 19, 20, 21
  // Row 3: 22, 23, 24, 25, 26, 27, 28
  // Row 4: 29, 30, 31, 1, 2, 3, 4
  const gridDays = [
    { day: 8, isHighlighted: true, label: "8h 30m" },
    { day: 9, isHighlighted: true, label: "8h 30m" },
    { day: 10, isHighlighted: true, label: "8h 30m" },
    { day: 11, isHighlighted: true, label: "8h 30m" },
    { day: 12, isHighlighted: true, label: "8h 30m" },
    { day: 13, isHighlighted: true, label: "8h 30m" },
    { day: 14, isHighlighted: true, label: "8h 30m" },
    { day: 15, isHighlighted: true, label: "8h 30m" },
    { day: 16, isHighlighted: true, label: "8h 30m" },
    { day: 17, isHighlighted: true, label: "8h 30m" },
    { day: 18, isHighlighted: false },
    { day: 19, isHighlighted: false },
    { day: 20, isHighlighted: false },
    { day: 21, isHighlighted: false },
    { day: 22, isHighlighted: false },
    { day: 23, isHighlighted: false },
    { day: 24, isHighlighted: false },
    { day: 25, isHighlighted: false },
    { day: 26, isHighlighted: false },
    { day: 27, isHighlighted: false },
    { day: 28, isHighlighted: false },
    { day: 29, isHighlighted: false },
    { day: 30, isHighlighted: false },
    { day: 31, isHighlighted: false },
    { day: 1, isHighlighted: false, isNextMonth: true },
    { day: 2, isHighlighted: false, isNextMonth: true },
    { day: 3, isHighlighted: false, isNextMonth: true },
    { day: 4, isHighlighted: false, isNextMonth: true },
  ];

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div 
        className="w-[440px] max-w-[calc(100vw-32px)] bg-white rounded-[16px] shadow-[0_24px_60px_rgba(15,23,42,0.15)] border border-slate-100 p-6 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#111827]">Calendar Details</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#98A2B3] hover:text-[#475467] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Info Rows */}
        <div className="space-y-2.5 text-[15px] mb-6">
          <div className="flex items-start">
            <span className="w-[140px] text-[#6B7280] shrink-0">Request Type :</span>
            <span className="text-[#111827] font-medium">Paid Time Off (Vacation)</span>
          </div>
          <div className="flex items-start">
            <span className="w-[140px] text-[#6B7280] shrink-0">Start - End Date :</span>
            <span className="text-[#111827] font-medium">1/8/21 - 1/17/21</span>
          </div>
          <div className="flex items-start">
            <span className="w-[140px] text-[#6B7280] shrink-0">Submitted Hours :</span>
            <span className="text-[#111827] font-medium">120h</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#EAECF0] mb-5" />

        {/* Sub-header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-bold text-[#111827]">Jan 2021</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E57A00]" />
            <span className="text-[14px] font-medium text-[#344054]">Pending</span>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-[14px] font-medium text-[#6B7280] mb-2">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-3.5 text-center">
          {gridDays.map((item, index) => {
            const isHighlighted = item.isHighlighted;
            const isNextMonth = item.isNextMonth;
            return (
              <div key={index} className="flex flex-col items-center min-h-[58px]">
                {isHighlighted ? (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#E57A00] text-[14px] font-semibold text-[#111827]">
                      {item.day}
                    </div>
                    <span className="text-[10px] text-[#6B7280] mt-1 whitespace-nowrap">
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    <div className={`flex h-9 w-9 items-center justify-center text-[14px] font-medium ${isNextMonth ? 'text-[#98A2B3]' : 'text-[#111827]'}`}>
                      {item.day}
                    </div>
                    {/* Empty block to keep height aligned */}
                    <span className="text-[10px] h-3 mt-1" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
