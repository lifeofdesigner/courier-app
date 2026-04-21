import type { Metadata } from "next";

import { ShippingLabel } from "@/components/labels/shipping-label";
import { getShippingLabelData } from "@/lib/queries/labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shipping Label",
  robots: {
    index: false,
    follow: false,
  },
};

type LabelPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function LabelPage({ params }: LabelPageProps) {
  const { bookingId } = await params;
  const label = await getShippingLabelData(bookingId);

  if (!label) {
    return (
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
              Label not available
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This label can be opened after Stripe confirms payment and a
              shipment order has been created for the booking.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-100 py-8 print:bg-white print:py-0">
      <ShippingLabel label={label} />
    </main>
  );
}
