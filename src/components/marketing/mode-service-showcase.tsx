import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout";
import { CmsIcon } from "@/components/marketing/cms-icon";
import type { HomepageModeServicesContent } from "@/types/cms";

export type ModeServiceShowcaseProps = {
  content: HomepageModeServicesContent;
};

export function ModeServiceShowcase({ content }: ModeServiceShowcaseProps) {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {content.items.map((item) => (
            <article
              key={`${item.mode}-${item.title}`}
              className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                role="img"
                aria-label={item.image?.alt ?? item.title}
                className="relative min-h-56 bg-cover bg-center"
                style={{
                  backgroundImage: item.image
                    ? `linear-gradient(180deg, color-mix(in srgb, var(--navy) 5%, transparent), color-mix(in srgb, var(--navy) 86%, transparent)), url(${item.image.src})`
                    : "linear-gradient(135deg, var(--navy), color-mix(in srgb, var(--navy) 82%, white))",
                }}
              >
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-navy">
                  <CmsIcon name={item.icon} className="h-4 w-4 text-primary" />
                  {item.eyebrow}
                </div>
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-7 text-muted">{item.description}</p>
                {item.highlights.length > 0 ? (
                  <ul className="mt-5 grid gap-2">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2 text-sm font-semibold text-navy"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {item.ctaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
