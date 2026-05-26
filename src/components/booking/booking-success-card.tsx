import { CheckCircle2 } from "lucide-react";

import { CheckoutButton } from "@/components/booking/checkout-button";
import type { BookingRecord } from "@/types/booking";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
  getTransportModePublicCopy,
} from "@/types/shipment";

export type BookingSuccessCardProps = {
  booking: BookingRecord;
};

export function BookingSuccessCard({ booking }: BookingSuccessCardProps) {
  const modeMeta = getTransportModeMeta(booking.transportMode);
  const modeCopy = getTransportModePublicCopy(booking.transportMode);
  const serviceLabel = formatModeAwareServiceType(
    booking.serviceType,
    booking.transportMode,
  );

  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 shadow-sm">
      <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
      <h2 className="mt-4 text-xl font-bold tracking-tight">
        {modeCopy.bookingReceivedTitle}
      </h2>
      <p className="mt-3 text-sm leading-7">
        Reference <span className="font-bold">{booking.id}</span> is now marked
        as {booking.status}. Payment is required before the {modeMeta.label.toLowerCase()}{" "}
        shipment order and label are created.
      </p>
      <div className="mt-5 rounded-[24px] border border-navy/10 bg-navy p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          {modeCopy.paymentSummaryTitle}
        </p>
        <p className="mt-3 text-3xl font-bold tracking-tight">
          {new Intl.NumberFormat("en", {
            style: "currency",
            currency: booking.currency,
          }).format(booking.amountDue)}
        </p>
        <dl className="mt-5 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-white">Transport mode</dt>
            <dd className="mt-1">{modeMeta.label}</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Service type</dt>
            <dd className="mt-1">{serviceLabel}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          Stripe Checkout opens in a secure hosted page. The webhook finalizes
          payment status and creates the {modeMeta.label.toLowerCase()} shipment
          label after confirmation.
        </p>
        <div className="mt-5">
          <CheckoutButton bookingId={booking.id} />
        </div>
      </div>
    </div>
  );
}
