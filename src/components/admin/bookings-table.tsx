"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminBookingRow } from "@/types/admin";

export type BookingsTableProps = {
  bookings: AdminBookingRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

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

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [query, setQuery] = useState("");

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) =>
      [
        booking.senderName,
        booking.senderEmail,
        booking.recipientName,
        booking.serviceType,
        booking.status,
        booking.paymentStatus,
        booking.stripeCheckoutSessionId ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [bookings, query]);

  if (bookings.length === 0) {
    return (
      <AdminEmptyState
        title="No booking requests found"
        description="Pickup requests will appear here for operations review."
      />
    );
  }

  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={inputClassName}
        placeholder="Search sender, recipient, service, or status"
      />
      {filteredBookings.length === 0 ? (
        <AdminEmptyState
          title="No bookings match that search"
          description="Try another sender, recipient, service, payment, or booking status."
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Sender</th>
                  <th className="px-4 py-4">Recipient</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Pickup date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p className="font-semibold text-[#2b1d16]">
                        {booking.senderName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.senderEmail}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {booking.recipientName}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {booking.serviceType}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(booking.pickupDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {booking.paymentStatus.replaceAll("_", " ")}
                      </span>
                      {booking.stripeCheckoutSessionId ? (
                        <p className="mt-1 max-w-36 truncate text-xs text-slate-500">
                          {booking.stripeCheckoutSessionId}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p className="font-semibold text-[#2b1d16]">
                        {formatMoney(booking.amountDue, booking.currency)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Paid {formatMoney(booking.amountPaid, booking.currency)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {booking.paymentStatus === "paid" ? (
                        <Link
                          href={`/label/${booking.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#2b1d16] transition hover:bg-slate-50"
                        >
                          Label
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          Awaiting customer
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
