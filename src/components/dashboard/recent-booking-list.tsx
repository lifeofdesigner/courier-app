import Link from "next/link";

import { CheckoutButton } from "@/components/booking";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { BookingListItem } from "@/types/dashboard";

export type RecentBookingListProps = {
  bookings: BookingListItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

export function RecentBookingList({ bookings }: RecentBookingListProps) {
  if (bookings.length === 0) {
    return (
      <DashboardEmptyState
        title="No pickup requests yet"
        description="Submitted pickup requests will appear here with their requested pickup dates and statuses."
        action={{ label: "Book a pickup", href: "/book" }}
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-[#0B1C3A]">
              {booking.serviceType} pickup
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Pickup {formatDate(booking.pickupDate)} - requested{" "}
              {formatDate(booking.createdAt)}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {formatMoney(booking.amountDue, booking.currency)} due - payment{" "}
              {booking.paymentStatus.replaceAll("_", " ")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              {booking.status}
            </span>
            {booking.paymentStatus !== "paid" ? (
              <CheckoutButton
                bookingId={booking.id}
                label="Pay"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#FF6B2B] px-3 text-xs font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            ) : (
              <Link
                href={`/label/${booking.id}`}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0B1C3A] transition hover:bg-slate-50"
              >
                Label
              </Link>
            )}
          </div>
        </div>
      ))}
      <div className="pt-4">
        <Link
          href="/book"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          New pickup request
        </Link>
      </div>
    </div>
  );
}
