import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { CheckoutButton } from "@/components/booking";
import { Container } from "@/components/layout";
import { getPaymentSummaryByBookingId } from "@/lib/queries/payments";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Booking Payment Not Completed",
  description:
    "Resume or review an Atlas Courier booking payment after Stripe Checkout was canceled.",
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

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <AlertTriangle aria-hidden="true" className="h-10 w-10 text-amber-500" />
            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
              Payment was not completed.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Your booking is still saved, but Stripe has not confirmed payment.
              You can safely resume Checkout when you are ready.
            </p>

            {payment ? (
              <div className="mt-6 rounded-[28px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                  Booking {payment.bookingId}
                </p>
                <div className="mt-4 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
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
                    This booking is already paid. The label is available from
                    the payment success page, dashboard, or tracking view.
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
