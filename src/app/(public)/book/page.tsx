import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BookingForm } from "@/components/booking";
import { Container } from "@/components/layout";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = createPageMetadata({
  title: "Book an Air, Road, or Freight Shipment",
  description:
    "Book an air, road, or freight shipment with service selection, pickup details, cargo information, payment, and delivery handoff.",
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

function buildBookNextPath(params: Awaited<BookPickupPageProps["searchParams"]>) {
  const query = new URLSearchParams();

  if (params.quoteId) {
    query.set("quoteId", params.quoteId);
  }

  if (params.transportMode) {
    query.set("transportMode", params.transportMode);
  }

  if (params.serviceType) {
    query.set("serviceType", params.serviceType);
  }

  const queryString = query.toString();

  return queryString ? `/book?${queryString}` : "/book";
}

function buildLoginRedirect(nextPath: string) {
  const query = new URLSearchParams({
    next: nextPath,
    message: "Sign in before booking a shipment.",
  });

  return `/login?${query.toString()}`;
}

export default async function BookPickupPage({
  searchParams,
}: BookPickupPageProps) {
  const params = await searchParams;
  const nextPath = buildBookNextPath(params);
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(buildLoginRedirect(nextPath));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildLoginRedirect(nextPath));
  }

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Book pickup
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-navy lg:text-5xl">
              Book the right air, road, or freight movement.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Submit a mode-aware booking request with matching service type,
              pickup, delivery, cargo details, and payment steps after the
              shipment request is saved.
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
