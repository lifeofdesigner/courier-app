import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { QuoteForm } from "@/components/quote";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { normalizeTransportMode } from "@/types/shipment";

export const metadata: Metadata = createPageMetadata({
  title: "Get a Mode-Aware Courier Quote",
  description:
    "Estimate an air, road, or freight shipment with service type, route details, cargo information, and declared value before booking.",
  path: "/quote",
  keywords: [
    "courier quote",
    "air cargo quote",
    "road delivery estimate",
    "freight quote",
  ],
});

type GetQuotePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function GetQuotePage({ searchParams }: GetQuotePageProps) {
  const params = await searchParams;
  const initialTransportMode = normalizeTransportMode(
    readSearchParam(params?.transportMode ?? params?.mode),
  );

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Get quote
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-navy lg:text-5xl">
              Estimate the right air, road, or freight service before you book.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Choose a transport mode, pick a matching service type, and
              prepare a quote with the route, cargo details, declared value,
              and delivery timing customers need before booking.
            </p>
          </div>
          <div className="mt-10">
            <QuoteForm
              initialTransportMode={initialTransportMode}
              isConfigured={hasSupabasePublicEnv()}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
