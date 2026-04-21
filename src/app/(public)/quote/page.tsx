import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { QuoteForm } from "@/components/quote";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Get a Courier Quote",
  description:
    "Estimate an Atlas Courier shipment with service type, route, package details, declared value, and delivery requirements before booking.",
  path: "/quote",
  keywords: ["courier quote", "delivery estimate", "shipping quote"],
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
              Estimate the best courier option before you book.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Calculate a production-style MVP quote using active pricing rules,
              zone detection, fuel surcharge, and a saved quote record.
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
