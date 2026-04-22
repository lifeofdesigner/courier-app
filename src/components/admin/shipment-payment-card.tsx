import Link from "next/link";

import type { AdminShipmentDetail } from "@/types/admin";
import { formatPaymentStatus } from "@/types/payment";

export type ShipmentPaymentCardProps = {
  shipment: AdminShipmentDetail;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="max-w-[12rem] truncate text-right text-sm font-semibold text-[#0B1C3A]">
        {value}
      </p>
    </div>
  );
}

export function ShipmentPaymentCard({ shipment }: ShipmentPaymentCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
            Booking / payment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {shipment.bookingId ? "Linked booking" : "No linked booking"}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {formatPaymentStatus(shipment.payment.paymentStatus)}
        </span>
      </div>

      <div className="mt-4">
        <DetailRow
          label="Amount due"
          value={formatMoney(
            shipment.payment.amountDue,
            shipment.payment.currency,
          )}
        />
        <DetailRow
          label="Amount paid"
          value={formatMoney(
            shipment.payment.amountPaid,
            shipment.payment.currency,
          )}
        />
        <DetailRow
          label="Provider"
          value={shipment.payment.paymentProvider ?? "Not set"}
        />
        <DetailRow
          label="Checkout session"
          value={shipment.payment.stripeCheckoutSessionId ?? "Not set"}
        />
        <DetailRow
          label="Payment intent"
          value={shipment.payment.stripePaymentIntentId ?? "Not set"}
        />
      </div>

      {shipment.bookingId ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {shipment.labelUrl ? (
            <Link
              href={shipment.labelUrl}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
            >
              Print label
            </Link>
          ) : null}
          <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-600">
            Booking {shipment.bookingId.slice(0, 8)}
          </span>
        </div>
      ) : null}
    </section>
  );
}
