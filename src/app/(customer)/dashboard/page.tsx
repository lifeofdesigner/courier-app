import type { Metadata } from "next";
import Link from "next/link";

import { TrackingStatusBadge } from "@/components/tracking";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ShipmentStatus } from "@/types/shipment";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

type QuoteSummaryRow = {
  id: string;
  service_type: string;
  total: number | string;
  currency: string;
  status: string;
  created_at: string;
};

type BookingSummaryRow = {
  id: string;
  service_type: string;
  status: string;
  pickup_date: string;
  created_at: string;
};

type OrderSummaryRow = {
  id: string;
  tracking_number: string;
  service_type: string;
  status: string;
  destination_city: string;
  destination_country: string;
  created_at: string;
};

function formatMoney(value: number | string, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function getDashboardSummary() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      quotes: [] as QuoteSummaryRow[],
      bookings: [] as BookingSummaryRow[],
      orders: [] as OrderSummaryRow[],
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      quotes: [] as QuoteSummaryRow[],
      bookings: [] as BookingSummaryRow[],
      orders: [] as OrderSummaryRow[],
    };
  }

  const [quotesResult, bookingsResult, ordersResult] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, service_type, total, currency, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("bookings")
      .select("id, service_type, status, pickup_date, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("orders")
      .select(
        "id, tracking_number, service_type, status, destination_city, destination_country, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    quotes: (quotesResult.data ?? []) as QuoteSummaryRow[],
    bookings: (bookingsResult.data ?? []) as BookingSummaryRow[],
    orders: (ordersResult.data ?? []) as OrderSummaryRow[],
  };
}

export default async function CustomerDashboardPage() {
  const { quotes, bookings, orders } = await getDashboardSummary();

  return (
    <main>
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                Customer dashboard
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
                Your shipping activity at a glance.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Review the most recent quotes, pickup requests, and shipments
                connected to your account.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                New quote
              </Link>
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Book pickup
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0B1C3A]">
                Latest quotes
              </h2>
              <div className="mt-5 space-y-4">
                {quotes.length > 0 ? (
                  quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#0B1C3A]">
                          {quote.service_type}
                        </p>
                        <span className="text-sm font-bold text-[#FF6B2B]">
                          {formatMoney(quote.total, quote.currency)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm capitalize text-slate-600">
                        {quote.status} · {formatDate(quote.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    No saved quotes yet. Calculate a quote to see it here.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0B1C3A]">
                Latest bookings
              </h2>
              <div className="mt-5 space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#0B1C3A]">
                          {booking.service_type}
                        </p>
                        <span className="text-xs font-bold uppercase text-[#FF6B2B]">
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Pickup {formatDate(booking.pickup_date)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    No pickup requests yet. Book a pickup when you are ready.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0B1C3A]">
                Latest shipments
              </h2>
              <div className="mt-5 space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={`/track?tracking=${order.tracking_number}`}
                          className="font-semibold text-[#0B1C3A] hover:text-[#FF6B2B]"
                        >
                          {order.tracking_number}
                        </Link>
                        <TrackingStatusBadge
                          status={order.status as ShipmentStatus}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {order.destination_city}, {order.destination_country}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    No shipments are linked to your account yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
