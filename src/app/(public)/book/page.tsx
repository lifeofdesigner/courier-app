import type { Metadata } from "next";

import { BookingForm, BookingSummaryCard } from "@/components/booking";
import { Container } from "@/components/layout";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Book a Courier Pickup",
  description:
    "Book an Atlas Courier pickup with sender, recipient, package, pickup, and delivery details for a clear courier handoff.",
  path: "/book",
  keywords: ["book courier pickup", "schedule pickup", "courier booking"],
});

type BookPickupPageProps = {
  searchParams: Promise<{
    quoteId?: string;
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
              Schedule a pickup with clear collection details.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Submit a pickup request with sender, recipient, package, pickup,
              and delivery details. This creates a request only; payment and
              label generation are outside this phase.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <BookingForm
              isConfigured={hasSupabasePublicEnv()}
              quoteId={params.quoteId}
            />
            <BookingSummaryCard />
          </div>
        </Container>
      </section>
    </main>
  );
}
