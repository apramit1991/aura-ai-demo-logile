import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

type ProgressStepProps = {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
};

/**
 * Figma: Progress Step — horizontal stepper with numbered circles and labels.
 * Step: 24×24 circle, number inside, connected by line. Active: primary. Complete: check.
 */
export function ProgressStep({ steps, currentStep, className }: ProgressStepProps) {
  return (
    <nav aria-label="Progress" className={cn("flex items-center", className)}>
      {steps.map((label, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center">
            {/* Step node */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold transition-colors",
                  isComplete && "bg-primary text-white",
                  isActive && "border-2 border-primary bg-white text-primary",
                  isUpcoming && "border-2 border-[#c9cbd2] bg-white text-[#5c5c5c]",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[12px] leading-4 whitespace-nowrap",
                  isActive ? "font-semibold text-primary" : isComplete ? "font-medium text-[#333333]" : "text-[#5c5c5c]",
                )}
              >
                {label}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  "mx-2 mt-[-12px] h-px flex-1 transition-colors",
                  isComplete ? "bg-primary" : "bg-[#c9cbd2]",
                )}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
