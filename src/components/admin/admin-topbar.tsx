"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  PackageSearch,
  Settings,
  UsersRound,
} from "lucide-react";

import {
  adminTopNavigation,
  company,
  type AdminModuleKey,
  type AdminTopNavigationItem,
} from "@/constants/site";

export type AdminTopbarProps = {
  adminName?: string | null;
};

const moduleIcons: Record<AdminModuleKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  shipments: PackageSearch,
  customers: UsersRound,
  quotes: FileText,
  bookings: CalendarCheck,
  cms: BookOpenText,
  analytics: BarChart3,
  settings: Settings,
};

function isActiveModule(pathname: string, item: AdminTopNavigationItem) {
  if (item.module === "dashboard") {
    return pathname === item.href;
  }

  const matches =
    "matchHrefs" in item && item.matchHrefs ? item.matchHrefs : [item.href];

  return matches.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
}

export function AdminTopbar({ adminName }: AdminTopbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2b1d16] text-white">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-6">
        <Link href="/admin" className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#b0825f] text-sm font-bold text-white ring-1 ring-white/15">
            AC
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold">{company.name}</span>
            <span className="block text-xs text-white/60">Admin workspace</span>
          </span>
        </Link>

        <nav
          aria-label="Admin modules"
          className="mx-4 min-w-0 flex-1 overflow-x-auto"
        >
          <ul className="flex items-center justify-center gap-1.5">
            {adminTopNavigation.map((item) => {
              const Icon = moduleIcons[item.module];
              const active = isActiveModule(pathname, item);

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`inline-flex h-10 items-center gap-2 rounded-2xl px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-white/15 ${
                      active
                        ? "bg-white text-[#2b1d16] shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
            <p className="text-xs font-semibold text-white/55">Signed in</p>
            <p className="max-w-44 truncate text-sm font-bold text-white">
              {adminName ?? "Admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
