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
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { adminNavigation } from "@/constants/site";

const iconMap = {
  "/admin": LayoutDashboard,
  "/admin/shipments": PackageSearch,
  "/admin/tracking-events": ShieldCheck,
  "/admin/quotes": FileText,
  "/admin/bookings": CalendarCheck,
  "/admin/users": UsersRound,
  "/admin/users/create": UserPlus,
  "/admin/cms": BookOpenText,
  "/admin/analytics": BarChart3,
  "/admin/settings": Settings,
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  if (href === "/admin/users") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
          Operations
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review courier activity, manage customer records, and edit homepage
          content.
        </p>
      </div>
      <nav aria-label="Admin navigation" className="mt-6">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {adminNavigation.map((item) => {
            const Icon = iconMap[item.href as keyof typeof iconMap];
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href} className="shrink-0 lg:shrink">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#0B1C3A] text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0B1C3A]"
                  }`}
                >
                  {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
