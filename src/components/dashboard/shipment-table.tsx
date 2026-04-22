"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { TrackingStatusBadge } from "@/components/tracking";
import type { ShipmentTableItem } from "@/types/dashboard";
import { shipmentStatusDefinitions } from "@/types/shipment";

export type ShipmentTableProps = {
  shipments: ShipmentTableItem[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ShipmentTable({ shipments }: ShipmentTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filteredShipments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus = status === "all" || shipment.status === status;
      const searchableText = [
        shipment.trackingNumber,
        shipment.serviceType,
        shipment.originCity,
        shipment.originCountry,
        shipment.destinationCity,
        shipment.destinationCountry,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [query, shipments, status]);

  if (shipments.length === 0) {
    return (
      <DashboardEmptyState
        title="No shipments yet"
        description="Book a pickup or request a quote to start moving shipments through your customer workspace."
        action={{ label: "Book a pickup", href: "/book" }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={inputClassName}
          placeholder="Search tracking, city, country, or service"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={inputClassName}
        >
          <option value="all">All statuses</option>
          {shipmentStatusDefinitions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredShipments.length === 0 ? (
        <DashboardEmptyState
          title="No shipments match those filters"
          description="Try a different tracking number, route, service, or status."
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Tracking number</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Route</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">ETA</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4">Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <Link
                        href={`/track?tracking=${shipment.trackingNumber}`}
                        className="font-semibold text-[#0B1C3A] transition hover:text-[#FF6B2B]"
                      >
                        {shipment.trackingNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {shipment.serviceType}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {shipment.originCity}, {shipment.originCountry} to{" "}
                      {shipment.destinationCity}, {shipment.destinationCountry}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <TrackingStatusBadge status={shipment.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(shipment.estimatedDeliveryDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(shipment.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {shipment.labelUrl ? (
                        <Link
                          href={shipment.labelUrl}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0B1C3A] transition hover:bg-slate-50"
                        >
                          Print
                        </Link>
                      ) : (
                        "Pending"
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
