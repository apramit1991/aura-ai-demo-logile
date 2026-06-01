import { ArrowLeft, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";

type PageHeadingProps = {
  title: string;
  onBack?: () => void;
  onHelp?: () => void;
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Figma: Page Heading — back button + module name text + question-circle icon + separator.
 * Size: full-width, h~48, HORIZONTAL layout, gap between elements.
 */
export function PageHeading({ title, onBack, onHelp, actions, className }: PageHeadingProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 py-3 px-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}

        <h1 className="min-w-0 flex-1 text-[17px] font-medium leading-[22px] text-[#333333] truncate">
          {title}
        </h1>

        {onHelp ? (
          <button
            type="button"
            onClick={onHelp}
            aria-label="Help"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        ) : null}

        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {/* Separator */}
      <div className="h-px bg-[#e5e7eb] mx-4" aria-hidden="true" />
    </div>
  );
}
