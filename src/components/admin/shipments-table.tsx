"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminShipmentRow } from "@/types/admin";

export type ShipmentsTableProps = {
  shipments: AdminShipmentRow[];
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

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filteredShipments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus = status === "all" || shipment.status === status;
      const searchableText = [
        shipment.trackingNumber,
        shipment.serviceType,
        shipment.status,
        shipment.originCity,
        shipment.originCountry,
        shipment.destinationCity,
        shipment.destinationCountry,
        shipment.userId ?? "",
        shipment.bookingId ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [query, shipments, status]);

  if (shipments.length === 0) {
    return (
      <AdminEmptyState
        title="No shipments found"
        description="Shipment records will appear here once orders exist in the courier database."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={inputClassName}
          placeholder="Search tracking, route, service, owner, or status"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={`${inputClassName} md:max-w-xs`}
        >
          <option value="all">All statuses</option>
          <option value="label_created">Label created</option>
          <option value="picked_up">Picked up</option>
          <option value="in_transit">In transit</option>
          <option value="arrived_at_hub">Arrived at hub</option>
          <option value="customs_clearance">Customs clearance</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="exception">Exception</option>
        </select>
      </div>

      {filteredShipments.length === 0 ? (
        <AdminEmptyState
          title="No shipments match those filters"
          description="Try another tracking number, route, owner, or shipment status."
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Tracking number</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Route</th>
                  <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">ETA</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Label</th>
                <th className="px-4 py-4">Owner</th>
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
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {shipment.status.replaceAll("_", " ")}
                      </span>
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
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p>{shipment.userId ?? "Guest"}</p>
                      {shipment.bookingId ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Booking {shipment.bookingId}
                        </p>
                      ) : null}
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
