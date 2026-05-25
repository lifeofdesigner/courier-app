import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Globe2,
  Headphones,
  MapPin,
  PackageCheck,
  Plane,
  Route,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

import {
  AboutStorySection,
  AboutValuesSection,
  SeoJsonLd,
} from "@/components/marketing";
import { getAboutPageContent } from "@/lib/queries/public-cms-pages";
import { getOrganizationJsonLd } from "@/lib/seo";
import type { CmsIconName } from "@/types/cms";

const iconMap = {
  air: Plane,
  building: Building2,
  "check-circle": CheckCircle2,
  clock: Clock3,
  globe: Globe2,
  headphones: Headphones,
  "map-pin": MapPin,
  "package-check": PackageCheck,
  route: Route,
  "shield-check": ShieldCheck,
  truck: Truck,
  warehouse: Warehouse,
} satisfies Record<CmsIconName, typeof Truck>;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPageContent();

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

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {content.hero.description}
            </p>
          </div>

          <div className="mt-12">
            <AboutStorySection
              eyebrow={content.story.eyebrow}
              title={content.story.title}
              paragraphs={content.story.paragraphs}
              stats={content.story.stats}
            />
          </div>

          <div className="mt-12">
            <AboutValuesSection
              title={content.values.title}
              description={content.values.description}
              values={content.values.items.map((item) => ({
                ...item,
                icon: iconMap[item.icon],
              }))}
            />
          </div>

          <section className="mt-12 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                  {content.cta.eyebrow}
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
                  {content.cta.title}
                </h2>
                {content.cta.description ? (
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {content.cta.description}
                  </p>
                ) : null}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={content.cta.primaryCta.href}
                    aria-label={content.cta.primaryCta.ariaLabel}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
                  >
                    {content.cta.primaryCta.label}
                  </Link>
                  {content.cta.secondaryCta ? (
                    <Link
                      href={content.cta.secondaryCta.href}
                      aria-label={content.cta.secondaryCta.ariaLabel}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    >
                      {content.cta.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
              <ul className="grid gap-4">
                {content.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600"
                  >
                    <BadgeCheck
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-[#FF6B2B]"
                    />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
