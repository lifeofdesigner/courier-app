import { CheckCircle2 } from "lucide-react";

import { CheckoutButton } from "@/components/booking/checkout-button";
import type { BookingRecord } from "@/types/booking";

export type BookingSuccessCardProps = {
  booking: BookingRecord;
};

export function BookingSuccessCard({ booking }: BookingSuccessCardProps) {
  return (
    <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 shadow-sm">
      <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
      <h2 className="mt-4 text-xl font-bold tracking-tight">
        Booking request received
      </h2>
      <p className="mt-3 text-sm leading-7">
        Reference <span className="font-bold">{booking.id}</span> is now marked
        as {booking.status}. Payment is required before the shipment order and
        label are created.
      </p>
      <div className="mt-5 rounded-[28px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
          Amount due
        </p>
        <p className="mt-3 text-3xl font-bold tracking-tight">
          {new Intl.NumberFormat("en", {
            style: "currency",
            currency: booking.currency,
          }).format(booking.amountDue)}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          Stripe Checkout opens in a secure hosted page. The webhook finalizes
          payment status and creates the label after confirmation.
        </p>
        <div className="mt-5">
          <CheckoutButton bookingId={booking.id} />
        </div>
      </div>
    </div>
  );
}
