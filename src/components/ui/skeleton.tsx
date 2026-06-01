import { cn } from "../../lib/utils";

type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  lines?: number;
  rounded?: boolean;
};

/**
 * Figma: Skeleton — shimmer placeholder block.
 */
export function Skeleton({ className, width, height, lines, rounded = false }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBar
            key={i}
            className={i === lines - 1 ? "w-3/4" : "w-full"}
            rounded={rounded}
          />
        ))}
      </div>
    );
  }

  return (
    <SkeletonBar
      className={className}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      rounded={rounded}
    />
  );
}

function SkeletonBar({
  className,
  style,
  rounded = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  rounded?: boolean;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-[#e5e7eb] via-[#f3f4f6] to-[#e5e7eb] bg-[length:200%_100%]",
        rounded ? "rounded-full" : "rounded",
        "h-4",
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  );
}
