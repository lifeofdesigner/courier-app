"use client";

import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminBookingRow } from "@/types/admin";

export type BookingsTableProps = {
  bookings: AdminBookingRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
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
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Sender</th>
                <th className="px-4 py-4">Recipient</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Pickup date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="font-semibold text-[#0B1C3A]">
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
                    {formatDate(booking.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
