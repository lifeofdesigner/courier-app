import Link from "next/link";
import type { Metadata } from "next";

import { FAQList, SeoJsonLd } from "@/components/marketing";
import { getFaqPageContent } from "@/lib/queries/public-cms-pages";
import { getFaqPageJsonLd, getOrganizationJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getFaqPageContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: content.seo.canonicalPath
      ? {
          canonical: content.seo.canonicalPath,
        }
      : undefined,
  };
}

export default async function FAQPage() {
  const content = await getFaqPageContent();
  const faqJsonLdItems = content.groups.flatMap((group) => group.items);

  return (
    <main>
      <SeoJsonLd
        data={[getOrganizationJsonLd(), getFaqPageJsonLd(faqJsonLdItems)]}
      />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-navy lg:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {content.hero.description}
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <FAQList groups={content.groups} />
            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-heading text-xl font-bold tracking-tight text-navy">
                {content.supportCta.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {content.supportCta.description}
              </p>
              <Link
                href={content.supportCta.cta.href}
                aria-label={content.supportCta.cta.ariaLabel}
                className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                {content.supportCta.cta.label}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
