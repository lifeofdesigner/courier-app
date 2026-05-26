import type { Metadata } from "next";

import {
  ContactFormCard,
  ContactPanel,
  SeoJsonLd,
} from "@/components/marketing";
import { getContactInfoContent } from "@/lib/queries/public-cms-pages";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { getOrganizationJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactInfoContent();

  return {
    title: "Contact",
    description: content.description,
    keywords: [
      "contact logistics support",
      "courier pickup support",
      "cargo delivery help",
      "freight shipment support",
    ],
    alternates: {
      canonical: "/contact",
    },
  };
}

export default async function ContactPage() {
  const [settings, content] = await Promise.all([
    getPublicPageSettings(),
    getContactInfoContent(),
  ]);

  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {content.eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-navy lg:text-5xl">
              {content.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {content.description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <ContactPanel settings={settings} />
            <ContactFormCard settings={settings} />
          </div>
        </div>
      </section>
    </main>
  );
}
