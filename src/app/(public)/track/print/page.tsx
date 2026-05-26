import type { Metadata } from "next";
import Link from "next/link";

import { TrackingPrintCopy } from "@/components/tracking";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { getPublicTrackingResult } from "@/lib/queries/tracking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tracking Copy",
  robots: {
    index: false,
    follow: false,
  },
};

type TrackPrintPageProps = {
  searchParams: Promise<{
    tracking?: string;
    trackingNumber?: string;
  }>;
};

function normalizeTrackingParam(value: string | undefined) {
  return value?.trim().toUpperCase() ?? "";
}

export default async function TrackPrintPage({
  searchParams,
}: TrackPrintPageProps) {
  const params = await searchParams;
  const trackingNumber = normalizeTrackingParam(
    params.tracking ?? params.trackingNumber,
  );
  const [result, settings] = await Promise.all([
    trackingNumber ? getPublicTrackingResult(trackingNumber) : null,
    getPublicPageSettings(),
  ]);

  if (!trackingNumber || result?.notFound || !result?.shipment) {
    return (
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-[#0B1C3A]">
              Tracking copy not available
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Enter a valid tracking number to open a printable shipment copy.
            </p>
            <Link
              href="/track"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
            >
              Track shipment
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-100 py-8 print:bg-white print:py-0">
      <TrackingPrintCopy
        shipment={result.shipment}
        events={result.events}
        siteName={settings.siteIdentity.siteName}
        companyAddress={settings.companyContact.address}
      />
    </main>
  );
}
