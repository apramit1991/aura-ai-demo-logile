import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

export type NavItem = {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: number;
  children?: NavItem[];
};

type SidenavProps = {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  header?: React.ReactNode;
  className?: string;
};

/**
 * Figma: Sidenav — VERTICAL, top switch + menu items list.
 * Each item: 40h, pad=8 12px, gap=8, r=8. Active: bg=primary/10, blue tip bar on right edge.
 */
export function Sidenav({ items, activeId, onChange, header, className }: SidenavProps) {
  return (
    <nav
      className={cn(
        "flex h-full w-[256px] shrink-0 flex-col border-r border-[#e5e7eb] bg-white",
        className,
      )}
      aria-label="Main navigation"
    >
      {header ? (
        <div className="shrink-0 border-b border-[#e5e7eb] px-3 py-3">{header}</div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <ul role="list" className="space-y-0.5">
          {items.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              activeId={activeId}
              onChange={onChange}
              depth={0}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function NavItemRow({
  item,
  activeId,
  onChange,
  depth,
}: {
  item: NavItem;
  activeId: string;
  onChange: (id: string) => void;
  depth: number;
}) {
  const Icon = item.icon;
  const isActive = item.id === activeId;
  const hasChildren = (item.children?.length ?? 0) > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => onChange(item.id)}
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        className={cn(
          "relative flex w-full items-center gap-2 rounded-lg py-2 pr-3 text-left text-[15px] leading-[22px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          isActive
            ? "bg-[rgba(10,104,219,0.10)] font-medium text-primary"
            : "text-[#333333] hover:bg-[#f4f5fa]",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Active bar */}
        {isActive ? (
          <span
            className="absolute right-0 top-1 h-[calc(100%-8px)] w-1 rounded-l-full bg-primary"
            aria-hidden="true"
          />
        ) : null}
        {Icon ? (
          <Icon
            className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-[#5c5c5c]")}
            aria-hidden="true"
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {item.badge ? <Badge>{item.badge}</Badge> : null}
        {hasChildren ? (
          <ChevronRight className="h-4 w-4 shrink-0 text-[#5c5c5c]" aria-hidden="true" />
        ) : null}
      </button>
      {hasChildren ? (
        <ul role="list" className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <NavItemRow
              key={child.id}
              item={child}
              activeId={activeId}
              onChange={onChange}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
