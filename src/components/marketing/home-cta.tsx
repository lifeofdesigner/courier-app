import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import type { CTASectionContent } from "@/types/cms";

export type HomeCtaProps = {
  content: CTASectionContent;
};

export function HomeCta({ content }: HomeCtaProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="rounded-lg border border-border bg-background p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {content.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {content.title}
            </h2>
            {content.description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                {content.description}
              </p>
            ) : null}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href={content.primaryCta.href}
              aria-label={content.primaryCta.ariaLabel}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              {content.primaryCta.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            {content.secondaryCta ? (
              <Link
                href={content.secondaryCta.href}
                aria-label={content.secondaryCta.ariaLabel}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {content.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
