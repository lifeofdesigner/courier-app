import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { CheckoutButton } from "@/components/booking";
import { Container } from "@/components/layout";
import { ToastOnMount } from "@/components/ui/toast-on-mount";
import { getPaymentSummaryByBookingId } from "@/lib/queries/payments";
import { createPageMetadata } from "@/lib/seo";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
  getTransportModePublicCopy,
} from "@/types/shipment";

export const metadata: Metadata = createPageMetadata({
  title: "Shipment Payment Not Completed",
  description:
    "Resume or review an air, road, or freight booking payment after checkout was canceled.",
  path: "/book/cancel",
});

type BookingCancelPageProps = {
  searchParams: Promise<{
    bookingId?: string;
  }>;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

async function getPayment(bookingId: string) {
  try {
    return await getPaymentSummaryByBookingId(bookingId);
  } catch {
    return null;
  }
}

export default async function BookingCancelPage({
  searchParams,
}: BookingCancelPageProps) {
  const params = await searchParams;
  const payment = params.bookingId ? await getPayment(params.bookingId) : null;
  const modeMeta = payment ? getTransportModeMeta(payment.transportMode) : null;
  const modeCopy = payment
    ? getTransportModePublicCopy(payment.transportMode)
    : null;
  const serviceLabel = payment
    ? formatModeAwareServiceType(payment.serviceType, payment.transportMode)
    : null;
  const isPaid = payment?.paymentStatus === "paid";
  const toastTitle = isPaid
    ? "Payment already confirmed"
    : "Payment not completed";
  const toastMessage = payment
    ? isPaid
      ? `This ${modeMeta?.label.toLowerCase() ?? "shipment"} booking is already paid.`
      : "Your booking is saved, but payment was not completed."
    : "No booking reference was provided for this canceled payment.";
  const toastVariant = isPaid ? "success" : "warning";

  return (
    <main>
      <ToastOnMount
        title={toastTitle}
        message={toastMessage}
        variant={toastVariant}
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <AlertTriangle aria-hidden="true" className="h-10 w-10 text-amber-500" />
            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
              Payment was not completed.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {modeCopy
                ? modeCopy.paymentCancelLead
                : "Your booking is still saved, but payment has not been confirmed. You can safely resume payment when you are ready."}
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
                    <p className="font-semibold text-white">Amount due</p>
                    <p className="mt-1">
                      {formatMoney(payment.amountDue, payment.currency)}
                    </p>
                  </div>
                </div>
                {payment.paymentStatus === "paid" ? (
                  <p className="mt-5 text-sm leading-7 text-slate-200">
                    This {modeMeta?.label.toLowerCase() ?? "shipment"} booking
                    is already paid. The label is available from the payment
                    success page, dashboard, or tracking view.
                  </p>
                ) : (
                  <div className="mt-5">
                    <CheckoutButton
                      bookingId={payment.bookingId}
                      label="Resume payment"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                No booking reference was provided. Start a new booking or use
                the link from your booking confirmation email.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Back to booking
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
