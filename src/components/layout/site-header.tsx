import { Calculator, PackageSearch, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { buttonVariants } from "@/components/ui/button";
import { company, primaryCtas, publicNavigation } from "@/constants/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="border-b border-white/10 bg-navy text-white">
        <Container className="flex h-10 items-center justify-between gap-4 text-xs font-semibold">
          <span className="truncate">{company.coverage}</span>
          <a
            href={company.phoneHref}
            className="hidden shrink-0 items-center gap-2 rounded-md text-slate-100 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
            {company.phone}
          </a>
        </Container>
      </div>

      <Container>
        <div className="relative flex h-20 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1.5">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    activeClassName="bg-primary/10 text-navy ring-1 ring-inset ring-primary/20"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <NavLink
              href={primaryCtas.track.href}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "rounded-xl bg-white",
              })}
              activeClassName="border-primary bg-primary/10 text-primary"
            >
              <PackageSearch aria-hidden="true" className="h-4 w-4" />
              {primaryCtas.track.label}
            </NavLink>
            <NavLink
              href={primaryCtas.quote.href}
              className={buttonVariants({
                variant: "primary",
                size: "sm",
                className: "rounded-xl px-4",
              })}
              activeClassName="ring-2 ring-primary/25"
            >
              <Calculator aria-hidden="true" className="h-4 w-4" />
              {primaryCtas.quote.label}
            </NavLink>
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
