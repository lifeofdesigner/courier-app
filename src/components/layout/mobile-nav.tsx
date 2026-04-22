"use client";

import { useEffect, useId, useState } from "react";
import {
  Calculator,
  CircleUserRound,
  Clock3,
  Menu,
  PackageSearch,
  Phone,
  X,
} from "lucide-react";

import { NavLink } from "@/components/layout/nav-link";
import { company, primaryCtas, publicNavigation } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/ui";

const mobileLinkClasses =
  "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const secondaryActionButtonClasses =
  "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

const navyAccountButtonClasses =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B1C3A] px-5 text-sm font-semibold text-white transition hover:bg-[#08142c] focus:outline-none focus:ring-4 focus:ring-[#0B1C3A]/20";

const primaryOrangeButtonClasses =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20";

type MobileNavProps = {
  accountAction: NavItem;
};

export function MobileNav({ accountAction }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="relative xl:hidden">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-navy shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="absolute right-0 top-full mt-3 w-[min(24rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-white p-4 shadow-2xl shadow-slate-900/15"
        >
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={mobileLinkClasses}
                    activeClassName="bg-primary/10 text-navy ring-1 ring-inset ring-primary/20"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 grid gap-2 border-t border-border pt-4">
            <NavLink
              href={primaryCtas.track.href}
              onClick={() => setIsOpen(false)}
              className={cn(secondaryActionButtonClasses, "w-full")}
              activeClassName="border-primary bg-primary/10 text-primary"
            >
              <PackageSearch aria-hidden="true" className="mr-2 h-4 w-4" />
              {primaryCtas.track.label}
            </NavLink>
            <NavLink
              href={accountAction.href}
              onClick={() => setIsOpen(false)}
              className={cn(navyAccountButtonClasses, "w-full")}
              activeClassName="ring-4 ring-[#0B1C3A]/20"
            >
              <CircleUserRound aria-hidden="true" className="mr-2 h-4 w-4" />
              {accountAction.label}
            </NavLink>
            <NavLink
              href={primaryCtas.quote.href}
              onClick={() => setIsOpen(false)}
              className={cn(primaryOrangeButtonClasses, "w-full")}
              activeClassName="ring-2 ring-primary/30"
            >
              <Calculator aria-hidden="true" className="mr-2 h-4 w-4" />
              {primaryCtas.quote.label}
            </NavLink>
          </div>

          <div className="mt-4 rounded-xl bg-background p-3 text-sm text-slate-700">
            <p className="flex items-center gap-2 font-semibold text-navy">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-primary" />
              {company.hours}
            </p>
            <a
              href={company.phoneHref}
              className={cn(
                "mt-2 flex items-center gap-2 font-semibold text-primary",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              )}
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {company.phone}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
