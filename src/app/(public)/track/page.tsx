import type { Metadata } from "next";

import { Container } from "@/components/layout";
import {
  EmptyTrackingState,
  TrackingResultCard,
  TrackingSearchForm,
  TrackingTimeline,
} from "@/components/tracking";
import { getPublicTrackingResult } from "@/lib/queries/tracking";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Track Shipment",
  description:
    "Track a shipment by tracking number and review delivery status, route details, estimated delivery, and tracking milestones.",
  path: "/track",
  keywords: ["track shipment", "courier tracking", "delivery status"],
});

type TrackShipmentPageProps = {
  searchParams: Promise<{
    tracking?: string;
    trackingNumber?: string;
  }>;
};

function normalizeTrackingParam(value: string | undefined) {
  return value?.trim().toUpperCase() ?? "";
}

export default async function TrackShipmentPage({
  searchParams,
}: TrackShipmentPageProps) {
  const params = await searchParams;
  const trackingNumber = normalizeTrackingParam(
    params.tracking ?? params.trackingNumber,
  );
  const result = trackingNumber
    ? await getPublicTrackingResult(trackingNumber)
    : null;

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Track shipment
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Know where your shipment stands.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Enter a tracking number to see the current shipment status,
              route, estimated delivery, and published tracking events.
            </p>
          </div>

          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <TrackingSearchForm defaultValue={trackingNumber} />
          </div>

          <div className="mt-8">
            {!trackingNumber ? (
              <EmptyTrackingState
                title="Enter a tracking number to begin."
                description="Tracking numbers are usually included in your booking confirmation or shipment email. Example format: QVX123456789."
              />
            ) : result?.notFound ? (
              <EmptyTrackingState
                title="We could not find that shipment."
                description="Check the tracking number for typos, then try again. Some newly created shipments may take a few minutes to appear."
              />
            ) : result?.shipment ? (
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <TrackingResultCard shipment={result.shipment} />
                <TrackingTimeline
                  events={result.events}
                  transportMode={result.shipment.transportMode}
                />
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    </main>
  );
}
