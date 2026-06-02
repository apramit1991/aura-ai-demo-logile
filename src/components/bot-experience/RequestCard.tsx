type RequestCardProps = {
  title: string;
  subtitle: string;
  status: string;
  isActive?: boolean;
  iconSrc?: string;
  iconAlt?: string;
};

export function RequestCard({ title, subtitle, status, isActive = false, iconSrc, iconAlt = "" }: RequestCardProps) {
  const statusStyles: Record<string, string> = {
    Pending: "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]",
    Approved: "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]",
    Denied: "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]",
    "Not Approved": "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]",
    "Approved with Adjustment": "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
  };

  const currentStyle = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className={`rounded-lg border p-4 ${isActive ? "bg-[#F2F8FD] border-[#91C1F1]" : "bg-white border-[#EAECF0]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {iconSrc ? <img src={iconSrc} alt={iconAlt} className="h-9 w-9 shrink-0" /> : null}
          <div className="min-w-0">
            <h4 className="truncate text-[14px] font-medium text-[#101828]">{title}</h4>
            <p className="mt-1 truncate text-[13px] text-[#667085]">{subtitle}</p>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-md border px-2.5 py-0.5 text-[12px] font-medium ${currentStyle}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
