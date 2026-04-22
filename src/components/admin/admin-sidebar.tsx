"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  adminModuleDetails,
  adminSubNavigation,
  adminTopNavigation,
  type AdminModuleKey,
  type AdminSubNavigationItem,
} from "@/constants/site";

function isModuleActive(pathname: string, module: AdminModuleKey) {
  const topItem = adminTopNavigation.find((item) => item.module === module);

  if (!topItem) {
    return false;
  }

  if (module === "dashboard") {
    return pathname === topItem.href;
  }

  const matches =
    "matchHrefs" in topItem && topItem.matchHrefs
      ? topItem.matchHrefs
      : [topItem.href];

  return matches.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
}

function getActiveModule(pathname: string): AdminModuleKey {
  return (
    adminTopNavigation.find((item) => isModuleActive(pathname, item.module))
      ?.module ?? "dashboard"
  );
}

function splitHref(href: string) {
  const [pathAndQuery] = href.split("#");
  const [path, queryString] = pathAndQuery.split("?");
  const params = new URLSearchParams(queryString);

  return {
    path,
    section: params.get("section"),
    hasHash: href.includes("#"),
  };
}

function isSubnavActive({
  item,
  module,
  pathname,
  section,
}: {
  item: AdminSubNavigationItem;
  module: AdminModuleKey;
  pathname: string;
  section: string | null;
}) {
  const itemTarget = splitHref(item.href);

  if (itemTarget.path !== pathname || itemTarget.hasHash) {
    return false;
  }

  if (module === "cms") {
    const activeSection = section ?? "overview";

    return (itemTarget.section ?? "overview") === activeSection;
  }

  return true;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeModule = getActiveModule(pathname);
  const details = adminModuleDetails[activeModule];
  const items = adminSubNavigation[activeModule];

  return (
    <aside className="w-[250px] shrink-0 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm max-lg:w-full lg:sticky lg:top-[88px] lg:self-start">
      <div className="px-2">
        <p className="text-xs font-bold uppercase text-[#b0825f]">
          Active module
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#2b1d16]">
          {details.label}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {details.description}
        </p>
      </div>

      <nav aria-label={`${details.label} navigation`} className="mt-5">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map((item) => {
            const active = isSubnavActive({
              item,
              module: activeModule,
              pathname,
              section: searchParams.get("section"),
            });

            return (
              <li key={item.href} className="shrink-0 lg:shrink">
                <Link
                  href={item.href}
                  className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 ${
                    active
                      ? "bg-[#2b1d16] text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#2b1d16]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      active ? "text-white/70" : "text-slate-300"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
