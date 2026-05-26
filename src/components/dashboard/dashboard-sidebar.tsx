"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPinned, PackageSearch, UserRound } from "lucide-react";

import { customerNavigation } from "@/constants/site";

const iconMap = {
  "/dashboard": LayoutDashboard,
  "/dashboard/shipments": PackageSearch,
  "/dashboard/quotes": MapPinned,
  "/dashboard/profile": UserRound,
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage customer shipments, quotes, bookings, and saved addresses.
        </p>
      </div>
      <nav aria-label="Customer dashboard navigation" className="mt-6">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {customerNavigation.map((item) => {
            const Icon = iconMap[item.href as keyof typeof iconMap];
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href} className="shrink-0 lg:shrink">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-navy text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-navy"
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
