import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { QuoteForm } from "@/components/quote";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Get a Mode-Aware Courier Quote",
  description:
    "Estimate an Atlas Courier air, road, or freight shipment with mode-aware service types, route details, cargo details, and declared value before booking.",
  path: "/quote",
  keywords: [
    "courier quote",
    "air cargo quote",
    "road delivery estimate",
    "freight quote",
  ],
});

export default function GetQuotePage() {
  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Get quote
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Estimate the right air, road, or freight service before you book.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Choose a transport mode, pick a matching service type, and
              calculate a quote using active pricing rules, zone detection, and
              fuel surcharge logic.
            </p>
          </div>
          <div className="mt-10">
            <QuoteForm isConfigured={hasSupabasePublicEnv()} />
          </div>
        </Container>
      </section>
    </main>
  );
}
