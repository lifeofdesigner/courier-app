import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout";
import { Badge } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
import { CmsIcon } from "@/components/marketing/cms-icon";
import type { HeroSectionContent } from "@/types/cms";

export type HomeHeroProps = {
  content: HeroSectionContent;
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className="border-b border-border bg-white">
      <Container className="grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <Badge tone="primary">{content.eyebrow}</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={content.primaryCta.href}
              aria-label={content.primaryCta.ariaLabel}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              {content.primaryCta.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href={content.secondaryCta.href}
              aria-label={content.secondaryCta.ariaLabel}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {content.secondaryCta.label}
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {content.stats.map((stat) => (
              <div
                key={`${stat.label}-${stat.value}`}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {stat.value}
                </p>
                {stat.description ? (
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {stat.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
          {content.image ? (
            <div
              role="img"
              aria-label={content.image.alt}
              className="mb-4 h-44 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${content.image.src})` }}
            />
          ) : null}
          <div className="flex items-start justify-between gap-4 border-b border-border bg-white p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                {content.visual.eyebrow}
              </p>
              <p className="mt-2 text-sm font-bold text-navy">
                {content.visual.title}
              </p>
              <p className="mt-1 text-sm text-muted">{content.visual.route}</p>
            </div>
            <Badge tone="success">{content.visual.statusLabel}</Badge>
          </div>
          <div className="space-y-5 bg-white p-5">
            {content.visual.items.map((event) => (
              <div key={`${event.title}-${event.meta}`} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CmsIcon name={event.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-navy">{event.title}</p>
                  <p className="text-sm text-muted">{event.meta}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {event.description}
                  </p>
                </div>
                {event.isComplete ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
