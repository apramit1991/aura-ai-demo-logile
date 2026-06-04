import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { getAvatarByName } from "../../lib/avatarHelper";

type HeaderAction = { icon: React.ElementType; label: string; badge?: number; onClick?: () => void };

type HeaderUser = { name: string; role?: string; avatarUrl?: string };

type HeaderProps = {
  title?: string;
  logo?: React.ReactNode;
  actions?: HeaderAction[];
  user?: HeaderUser;
  notificationCount?: number;
  className?: string;
};

/**
 * Figma: Header — 256×60 HORIZONTAL, logo area + nav icons + user avatar + notification badge.
 * Full-width shell header.
 */
export function Header({ title, logo, actions, user, notificationCount, className }: HeaderProps) {
  const defaultActions: HeaderAction[] = [
    { icon: Search, label: "Search" },
    { icon: Bell, label: "Notifications", badge: notificationCount },
    { icon: Settings, label: "Settings" },
  ];

  const resolvedActions = actions ?? defaultActions;

  return (
    <header
      className={cn(
        "flex h-[60px] shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-4",
        className,
      )}
    >
      {/* Left: logo / title */}
      <div className="flex items-center gap-3">
        {logo ?? null}
        {title ? (
          <span className="text-[17px] font-semibold text-[#333333]">{title}</span>
        ) : null}
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-1">
        {resolvedActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              aria-label={action.label}
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-[#f4f5fa] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Icon className="h-5 w-5" />
              {action.badge ? (
                <span className="absolute right-1 top-1">
                  <Badge>{action.badge}</Badge>
                </span>
              ) : null}
            </button>
          );
        })}

        {/* User avatar */}
        {user ? (
          <button
            type="button"
            className="ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-[#f4f5fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {user.avatarUrl || getAvatarByName(user.name) ? (
              <img src={user.avatarUrl || getAvatarByName(user.name)} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-white">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="hidden text-left md:block">
              <p className="text-[13px] font-semibold leading-4 text-[#333333]">{user.name}</p>
              {user.role ? <p className="text-[12px] leading-4 text-[#5c5c5c]">{user.role}</p> : null}
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#5c5c5c] md:block" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
