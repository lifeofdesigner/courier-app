import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout";
import { getPaymentSummaryByCheckoutSessionId } from "@/lib/queries/payments";
import { createPageMetadata } from "@/lib/seo";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
  getTransportModePublicCopy,
} from "@/types/shipment";

export const metadata: Metadata = createPageMetadata({
  title: "Shipment Payment Processing",
  description:
    "Review the secure payment processing result for an Atlas Courier air, road, or freight booking.",
  path: "/book/success",
});

type BookingSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

async function getPayment(sessionId: string) {
  try {
    return await getPaymentSummaryByCheckoutSessionId(sessionId);
  } catch {
    return null;
  }
}

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;
  const payment = params.session_id ? await getPayment(params.session_id) : null;
  const isPaid = payment?.paymentStatus === "paid";
  const modeMeta = payment ? getTransportModeMeta(payment.transportMode) : null;
  const modeCopy = payment
    ? getTransportModePublicCopy(payment.transportMode)
    : null;
  const serviceLabel = payment
    ? formatModeAwareServiceType(payment.serviceType, payment.transportMode)
    : null;

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-emerald-600" />
            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
              {modeCopy
                ? `${modeCopy.bookingReceivedTitle}.`
                : "Payment is being securely confirmed."}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {modeCopy
                ? modeCopy.paymentSuccessLead
                : "Stripe redirects here after Checkout. Final fulfillment is handled by the verified webhook, so this page never creates duplicate orders or labels."}
            </p>

            {payment ? (
              <div className="mt-6 rounded-[24px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                  {modeCopy?.paymentSummaryTitle ?? "Payment summary"}
                </p>
                <div className="mt-4 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-white">Booking</p>
                    <p className="mt-1 break-all">{payment.bookingId}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Transport mode</p>
                    <p className="mt-1">{modeMeta?.label}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Service type</p>
                    <p className="mt-1">{serviceLabel}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Payment status</p>
                    <p className="mt-1 capitalize">
                      {payment.paymentStatus.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Amount paid</p>
                    <p className="mt-1">
                      {formatMoney(payment.amountPaid, payment.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                No Checkout session was found in the URL. Check your email or
                dashboard for the latest booking status.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {isPaid && payment ? (
                <Link
                  href={`/label/${payment.bookingId}`}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
                >
                  Open {modeMeta?.label.toLowerCase() ?? "shipping"} label
                </Link>
              ) : null}
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
