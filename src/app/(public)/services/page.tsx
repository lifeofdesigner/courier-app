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
  SeoJsonLd,
  ServiceDetailGrid,
  ServiceLaneSection,
} from "@/components/marketing";
import { getServicesPageContent } from "@/lib/queries/public-cms-pages";
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
  const content = await getServicesPageContent();

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

export default async function ServicesPage() {
  const content = await getServicesPageContent();

  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
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
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={content.hero.primaryCta.href}
                aria-label={content.hero.primaryCta.ariaLabel}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                {content.hero.primaryCta.label}
              </Link>
              <Link
                href={content.hero.secondaryCta.href}
                aria-label={content.hero.secondaryCta.ariaLabel}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-navy transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                {content.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <ServiceDetailGrid
              services={content.services.map((service) => ({
                ...service,
                icon: iconMap[service.icon],
              }))}
            />
          </div>

          <div className="mt-12">
            <ServiceLaneSection
              title={content.workflow.title}
              description={content.workflow.description}
              steps={content.workflow.steps}
            />
          </div>

          <section className="mt-12">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Service support
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy">
                Details that reduce delivery friction.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Strong logistics support is more than speed. It is the ability
                to plan pickups, explain status clearly, protect cargo details,
                and resolve practical questions before they become missed
                deliveries.
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {content.supportHighlights.map((item) => {
                const Icon = iconMap[item.icon] ?? BadgeCheck;

                return (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-primary"
                    />
                    <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
