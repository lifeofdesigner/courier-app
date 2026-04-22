"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminTrackingEventRow } from "@/types/admin";
import { TrackingStatusBadge } from "@/components/tracking";

export type TrackingEventsTableProps = {
  events: AdminTrackingEventRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TrackingEventsTable({ events }: TrackingEventsTableProps) {
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) =>
      [
        event.orderId,
        event.trackingNumber ?? "",
        event.status,
        event.label,
        event.description ?? "",
        event.locationName ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [events, query]);

  if (events.length === 0) {
    return (
      <AdminEmptyState
        title="No tracking events found"
        description="Shipment event history will appear here as operations updates packages."
      />
    );
  }

  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={inputClassName}
        placeholder="Search order id, status, label, description, or location"
      />
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Shipment</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Label</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Event time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <Link
                      href={`/admin/shipments/${event.orderId}`}
                      className="font-semibold text-[#0B1C3A] transition hover:text-[#FF6B2B]"
                    >
                      {event.trackingNumber ?? event.orderId}
                    </Link>
                    {event.trackingNumber ? (
                      <p className="mt-1 max-w-40 truncate text-xs text-slate-500">
                        {event.orderId}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <TrackingStatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="font-semibold text-[#0B1C3A]">
                      {event.label}
                    </p>
                    {event.description ? (
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {event.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {event.locationName ?? "Not set"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {formatDateTime(event.eventTime)}
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
