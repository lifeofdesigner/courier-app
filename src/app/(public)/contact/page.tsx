import type { Metadata } from "next";

import {
  ContactFormCard,
  ContactPanel,
  SeoJsonLd,
} from "@/components/marketing";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Atlas Courier",
  description:
    "Contact Atlas Courier for tracking questions, pickup coordination, quotes, delivery support, and courier operations assistance.",
  path: "/contact",
  keywords: [
    "contact courier support",
    "courier phone number",
    "shipment support",
    "pickup support",
  ],
});

export default async function ContactPage() {
  const settings = await getPublicPageSettings();

  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Contact
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Talk to courier support before the shipment stalls.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Reach Atlas Courier for pickup planning, tracking questions,
              delivery exceptions, quote support, and account conversations.
              We keep contact details easy to scan so customers can choose the
              fastest support path.
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
