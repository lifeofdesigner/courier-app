import { Calculator, CircleUserRound, PackageSearch, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import {
  accountCtas,
  company,
  primaryCtas,
  publicNavigation,
} from "@/constants/site";
import { getCurrentAuthState } from "@/lib/queries/auth";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import type { CurrentAuthState } from "@/lib/queries/auth";

const secondaryActionButtonClasses =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

const navyAccountButtonClasses =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl bg-[#0B1C3A] px-5 text-sm font-semibold text-white transition hover:bg-[#08142c] focus:outline-none focus:ring-4 focus:ring-[#0B1C3A]/20";

const primaryOrangeButtonClasses =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20";

function getHeaderAccountAction({ user, profileRole }: CurrentAuthState) {
  if (!user) {
    return accountCtas.signedOut;
  }

  if (profileRole === "admin") {
    return accountCtas.admin;
  }

  return accountCtas.customer;
}

function phoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");

  return normalized ? `tel:${normalized}` : company.phoneHref;
}

export async function SiteHeader() {
  const [authState, settings] = await Promise.all([
    getCurrentAuthState(),
    getPublicPageSettings(),
  ]);
  const accountAction = getHeaderAccountAction(authState);
  const supportPhone = settings.companyContact.phone;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="border-b border-white/10 bg-navy text-white">
        <Container className="flex h-10 items-center justify-between gap-4 text-xs font-semibold">
          <span className="truncate">{company.coverage}</span>
          <a
            href={phoneHref(supportPhone)}
            className="hidden shrink-0 items-center gap-2 rounded-md text-slate-100 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
            {supportPhone}
          </a>
        </Container>
      </div>

      <Container>
        <div className="relative flex h-20 items-center justify-between gap-5">
          <Logo
            siteName={settings.siteIdentity.siteName}
            logo={settings.siteIdentity.logo}
          />

          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 justify-center xl:flex"
          >
            <ul className="flex min-w-0 items-center justify-center gap-1">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    activeClassName="bg-primary/10 text-navy ring-1 ring-inset ring-primary/20"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <NavLink
              href={primaryCtas.track.href}
              className={secondaryActionButtonClasses}
              activeClassName="border-primary bg-primary/10 text-primary"
            >
              <PackageSearch aria-hidden="true" className="mr-2 h-4 w-4" />
              {primaryCtas.track.label}
            </NavLink>
            <NavLink
              href={accountAction.href}
              className={navyAccountButtonClasses}
              activeClassName="ring-4 ring-[#0B1C3A]/20"
            >
              <CircleUserRound aria-hidden="true" className="mr-2 h-4 w-4" />
              {accountAction.label}
            </NavLink>
            <NavLink
              href={primaryCtas.quote.href}
              className={primaryOrangeButtonClasses}
              activeClassName="ring-2 ring-primary/25"
            >
              <Calculator aria-hidden="true" className="mr-2 h-4 w-4" />
              {primaryCtas.quote.label}
            </NavLink>
          </div>

          <MobileNav accountAction={accountAction} />
        </div>
      </Container>
    </header>
  );
}
