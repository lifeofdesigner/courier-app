import type { Metadata } from "next";

import { BookingForm } from "@/components/booking";
import { Container } from "@/components/layout";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Book an Air, Road, or Freight Shipment",
  description:
    "Book an Atlas Courier air, road, or freight shipment with mode-aware service selection, pickup details, payment, and shipment handoff.",
  path: "/book",
  keywords: [
    "book courier pickup",
    "schedule road delivery",
    "air cargo booking",
    "freight booking",
  ],
});

type BookPickupPageProps = {
  searchParams: Promise<{
    quoteId?: string;
    transportMode?: string;
    serviceType?: string;
  }>;
};

export default async function BookPickupPage({
  searchParams,
}: BookPickupPageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Book pickup
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Book the right air, road, or freight movement.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Submit a mode-aware booking request with matching service type,
              pickup, delivery, cargo details, and secure Stripe Checkout after
              the request is saved.
            </p>
          </div>

          <div className="mt-10">
            <BookingForm
              isConfigured={hasSupabasePublicEnv()}
              quoteId={params.quoteId}
              initialTransportMode={params.transportMode}
              initialServiceType={params.serviceType}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
