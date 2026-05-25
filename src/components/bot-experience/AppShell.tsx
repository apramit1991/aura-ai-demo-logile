import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { employee, headerActions, navItems } from "../../data/mockData";
import { cn } from "../../lib/utils";
import logoUrl from "../../assets/logo.png";
import { Input } from "../ui/input";

type AppShellProps = {
  children: ReactNode;
  activeNavLabel?: string;
  profile?: {
    name: string;
    role: string;
    avatar: string;
    badge: number;
    avatarUrl?: string;
  };
};

export function AppShell({ children, activeNavLabel, profile = employee }: AppShellProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f1f3f9] text-[#333333]">
      <header className="z-30 flex h-auto min-h-14 shrink-0 items-center gap-3 border-b border-transparent bg-[#f1f3f9] px-3 md:h-14 md:px-4">
        <button
          type="button"
          className="flex h-10 w-9 items-center justify-center rounded-md text-[#333333] transition hover:bg-white"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex min-w-[132px] items-center pr-2">
          <img
            src={logoUrl}
            alt="Logile WFM"
            className="h-5 w-[132px] object-contain"
          />
        </div>

        <div className="ml-auto hidden w-60 items-center md:flex">
          <label className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5c5c5c]" />
            <Input className="h-9 pl-8 text-[17px]" placeholder="Search..." />
          </label>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {headerActions.map(({ icon: Icon, count, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setNotificationsOpen((open) => (label === "Notifications" ? !open : open))}
              className="relative flex h-[42px] w-[42px] items-center justify-center rounded-md text-[#5c5c5c] transition hover:bg-white hover:text-[#333333]"
              title={label}
              aria-label={label}
            >
              <Icon className="h-[22px] w-[22px]" />
              {count ? (
                <span className="absolute right-0 top-0 rounded-full bg-[#e22d20] px-1 text-[12px] leading-4 text-white">
                  99+
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex h-12 min-w-0 items-center gap-2 rounded-md border border-[#d4d7de] bg-white px-2 transition hover:border-[#b9bec8] sm:min-w-[206px]"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-visible rounded-full bg-[#b8e0aa] text-xs font-bold text-[#2e6623] ring-2 ring-[#dff4d6]">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                profile.avatar
              )}
              <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e22d20] text-[10px] text-white">
                {profile.badge}
              </span>
              <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-white text-[#2bb673]" />
            </span>
            <span className="hidden min-w-0 text-left leading-tight sm:block">
              <span className="block truncate text-[15px] font-medium">{profile.name}</span>
              <span className="block text-[15px] font-medium text-[#5c5c5c]">{profile.role}</span>
            </span>
            <ChevronDown className="ml-auto hidden h-5 w-5 text-[#5c5c5c] sm:block" />
          </button>

          {profileOpen ? (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#d5d8df] bg-white p-2 shadow-lg">
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f1f3f9]" type="button">
                Profile
              </button>
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f1f3f9]" type="button">
                Preferences
              </button>
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f1f3f9]" type="button">
                Team schedule
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {notificationsOpen ? (
        <div className="fixed right-4 top-16 z-40 w-80 rounded-md border border-[#d5d8df] bg-white p-4 shadow-lg">
          <p className="text-[15px] font-medium text-[#333333]">Notifications</p>
          <p className="mt-3 rounded-md bg-[#f1f3f9] px-3 py-6 text-center text-[15px] text-[#5c5c5c]">
            No new alerts
          </p>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <aside className="z-20 hidden h-full w-20 shrink-0 overflow-y-auto scrollbar-hidden border-r border-transparent bg-[#f1f3f9] pb-4 md:block">
          <div className="flex h-11 items-center justify-center gap-1 text-[17px] font-medium text-primary">
            <ArrowLeftRight className="h-[18px] w-[18px]" />
            IMS
          </div>
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, active }) => {
              const isActive = activeNavLabel ? label === activeNavLabel : active;
              return (
              <button
                key={label}
                type="button"
                className={cn(
                  "relative flex min-h-[58px] w-[79px] flex-col items-center justify-center gap-1 rounded-r-md text-center text-[12px] leading-[14px] text-[#5c5c5c] transition hover:bg-white",
                  isActive && "bg-[#dce8f8] font-medium text-[#0858b9]",
                )}
              >
                {isActive ? <span className="absolute left-0 top-3 h-9 w-[3px] rounded-r bg-primary" /> : null}
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto md:pl-3">{children}</main>
      </div>
    </div>
  );
}
