"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CalendarCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { ctaLabels } from "@/constants/site";

export function FooterCta() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <section className="border-t border-border bg-background py-10 sm:py-12">
      <Container>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Ready for a dependable pickup?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Schedule courier service with a team built for clear handoffs.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Share pickup details, service needs, and delivery expectations
              from one simple customer-facing flow.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Link
              href="/book"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "rounded-xl",
              })}
            >
              <CalendarCheck aria-hidden="true" className="h-5 w-5" />
              {ctaLabels.book}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
