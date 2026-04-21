import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { company, footerNavigation, legalNavigation } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.6fr_0.9fr]">
          <div className="max-w-sm">
            <Logo variant="inverse" />
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Professional courier and logistics services for teams that need
              dependable pickup, transparent tracking, and calm operational
              support.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="flex gap-3 text-sm leading-6 text-slate-200">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                />
                <span>{company.trustStatement}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNavigation.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.items.map((item) => (
                    <li key={`${column.title}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Support
            </h3>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p className="flex gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{company.address}</span>
              </p>
              <a
                href={company.phoneHref}
                className="flex gap-3 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Phone
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{company.phone}</span>
              </a>
              <a
                href={company.emailHref}
                className="flex gap-3 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Mail
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{company.email}</span>
              </a>
              <p className="flex gap-3">
                <Clock3
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{company.hours}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-5 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {company.legalName}. All rights
              reserved.
            </p>
            <nav aria-label="Legal navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-medium transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}
