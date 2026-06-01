import { useState } from "react";
import { cn } from "../../lib/utils";
import { Toggle } from "./toggle";

type TimeSelectorProps = {
  value: { hours: number; minutes: number; period: "AM" | "PM" };
  onChange: (value: { hours: number; minutes: number; period: "AM" | "PM" }) => void;
  className?: string;
};

/**
 * Figma: Time Selector — Hours|Min scroll wheels + AM/PM toggle.
 */
export function TimeSelector({ value, onChange, className }: TimeSelectorProps) {
  const { hours, minutes, period } = value;

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  function setHours(delta: number) {
    const next = ((hours - 1 + delta + 12) % 12) + 1;
    onChange({ ...value, hours: next });
  }

  function setMinutes(delta: number) {
    const next = (minutes + delta + 60) % 60;
    onChange({ ...value, minutes: next });
  }

  return (
    <div className={cn("inline-flex items-center gap-3 rounded-lg border border-[#c9cbd2] bg-white px-4 py-3", className)}>
      {/* Hours */}
      <ScrollWheel
        value={pad(hours)}
        onUp={() => setHours(1)}
        onDown={() => setHours(-1)}
        label="Hours"
      />
      <span className="text-[23px] font-medium text-[#333333]">:</span>
      {/* Minutes */}
      <ScrollWheel
        value={pad(minutes)}
        onUp={() => setMinutes(5)}
        onDown={() => setMinutes(-5)}
        label="Minutes"
      />
      {/* AM/PM */}
      <Toggle
        options={[
          { id: "AM", label: "AM" },
          { id: "PM", label: "PM" },
        ]}
        value={period}
        onChange={(id) => onChange({ ...value, period: id as "AM" | "PM" })}
        className="ml-1"
      />
    </div>
  );
}

function ScrollWheel({
  value,
  onUp,
  onDown,
  label,
}: {
  value: string;
  onUp: () => void;
  onDown: () => void;
  label: string;
}) {
  const [dragging, setDragging] = useState(false);
  const startY = useState(0);

  return (
    <div
      className="flex select-none flex-col items-center"
      onMouseDown={(e) => {
        setDragging(true);
        startY[1](e.clientY);
      }}
      onMouseMove={(e) => {
        if (!dragging) return;
        const dy = e.clientY - startY[0];
        if (dy > 20) { onDown(); startY[1](e.clientY); }
        if (dy < -20) { onUp(); startY[1](e.clientY); }
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <button type="button" onClick={onUp} aria-label={`Increase ${label}`} className="flex h-6 w-6 items-center justify-center rounded text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333]">
        ▲
      </button>
      <span className="w-10 text-center text-[23px] font-medium leading-tight text-[#333333]" aria-label={label}>
        {value}
      </span>
      <button type="button" onClick={onDown} aria-label={`Decrease ${label}`} className="flex h-6 w-6 items-center justify-center rounded text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333]">
        ▼
      </button>
    </div>
  );
}
