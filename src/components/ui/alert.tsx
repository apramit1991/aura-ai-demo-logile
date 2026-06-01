import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  description: string;
  onClose?: () => void;
  className?: string;
};

const variantConfig: Record<
  AlertVariant,
  {
    container: string;
    icon: React.ElementType;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    container: "border-[#bfdbfe] bg-[#eff6ff]",
    icon: Info,
    iconColor: "text-[#0a68db]",
    titleColor: "text-[#0a68db]",
  },
  success: {
    container: "border-[#86efac] bg-[#f3fcf1]",
    icon: CheckCircle2,
    iconColor: "text-[#2b9a1f]",
    titleColor: "text-[#2b9a1f]",
  },
  warning: {
    container: "border-[#fcd34d] bg-[#fffbeb]",
    icon: AlertTriangle,
    iconColor: "text-[#f59e0b]",
    titleColor: "text-[#92400e]",
  },
  error: {
    container: "border-[#fca5a5] bg-[#fef2f2]",
    icon: AlertCircle,
    iconColor: "text-[#e22d20]",
    titleColor: "text-[#e22d20]",
  },
};

/**
 * Figma: Alert | Notification | Toast
 * Size: ~220px wide, VERTICAL layout, pad=16, gap=4, r=16, white bg.
 */
export function Alert({ variant = "info", title, description, onClose, className }: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-[16px] border px-4 py-4",
        config.container,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className={cn("text-[13px] font-semibold leading-5", config.titleColor)}>{title}</p>
        ) : null}
        <p className={cn("text-[13px] leading-5 text-[#333333]", title && "mt-0.5")}>{description}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#5c5c5c] transition hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
