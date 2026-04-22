"use client";

import Link from "next/link";
import { Eye, FileText, PencilLine, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { TrackingStatusBadge } from "@/components/tracking";
import {
  formatPaymentStatus,
  paymentStatuses,
  type PaymentStatus,
} from "@/types/payment";
import {
  formatModeAwareServiceType,
  getShipmentStatusMeta,
  getTransportModeMeta,
  shipmentStatuses,
} from "@/types/shipment";
import type { AdminShipmentRow } from "@/types/admin";

export type ShipmentsTableProps = {
  shipments: AdminShipmentRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const actionClassName =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#2b1d16] transition hover:border-slate-300 hover:bg-slate-50";

const paymentBadgeClasses: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  unpaid: "bg-slate-100 text-slate-700",
  checkout_created: "bg-amber-50 text-amber-700",
  payment_failed: "bg-rose-50 text-rose-700",
  refunded: "bg-blue-50 text-blue-700",
};

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
  const [shipmentStatus, setShipmentStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const filteredShipments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesShipmentStatus =
        shipmentStatus === "all" || shipment.status === shipmentStatus;
      const matchesPaymentStatus =
        paymentStatus === "all" || shipment.paymentStatus === paymentStatus;
      const searchableText = [
        shipment.trackingNumber,
        shipment.referenceCode ?? "",
        shipment.customerLabel,
        shipment.customerEmail ?? "",
        shipment.customerPhone ?? "",
        shipment.senderName ?? "",
        shipment.senderEmail ?? "",
        shipment.recipientName,
        shipment.recipientEmail ?? "",
        formatModeAwareServiceType(
          shipment.serviceType,
          shipment.transportMode,
        ),
        getTransportModeMeta(shipment.transportMode).label,
        shipment.originCity,
        shipment.originCountry,
        shipment.destinationCity,
        shipment.destinationCountry,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesShipmentStatus &&
        matchesPaymentStatus &&
        searchableText.includes(normalizedQuery)
      );
    });
  }, [paymentStatus, query, shipmentStatus, shipments]);

  if (shipments.length === 0) {
    return (
      <AdminEmptyState
        title="No shipments found"
        description="Create a manual shipment or wait for paid bookings to generate courier orders."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={inputClassName}
          placeholder="Search tracking number, sender, recipient, customer, or route"
        />
        <select
          value={shipmentStatus}
          onChange={(event) => setShipmentStatus(event.target.value)}
          className={inputClassName}
        >
          <option value="all">All shipment statuses</option>
          {shipmentStatuses.map((status) => (
            <option key={status} value={status}>
              {getShipmentStatusMeta(status).label}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          className={inputClassName}
        >
          <option value="all">All payment statuses</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {formatPaymentStatus(status)}
            </option>
          ))}
        </select>
      </div>

      {filteredShipments.length === 0 ? (
        <AdminEmptyState
          title="No shipments match those filters"
          description="Try another tracking number, sender, recipient, shipment status, or payment status."
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1480px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Tracking number</th>
                  <th className="px-4 py-4">Customer / owner</th>
                  <th className="px-4 py-4">Sender</th>
                  <th className="px-4 py-4">Recipient</th>
                  <th className="px-4 py-4">Origin</th>
                  <th className="px-4 py-4">Destination</th>
                  <th className="px-4 py-4">Service type</th>
                  <th className="px-4 py-4">Mode</th>
                  <th className="px-4 py-4">Shipment status</th>
                  <th className="px-4 py-4">Payment status</th>
                  <th className="px-4 py-4">Created date</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="align-top">
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <Link
                        href={`/admin/shipments/${shipment.id}`}
                        className="font-semibold text-[#2b1d16] transition hover:text-[#b0825f]"
                      >
                        {shipment.trackingNumber}
                      </Link>
                      {shipment.referenceCode ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {shipment.referenceCode}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p className="font-semibold text-[#2b1d16]">
                        {shipment.customerLabel}
                      </p>
                      {shipment.customerIsUnassigned ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Unassigned manual shipment
                        </p>
                      ) : (
                        <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                          {shipment.customerEmail ? (
                            <p className="max-w-44 truncate">
                              {shipment.customerEmail}
                            </p>
                          ) : null}
                          {shipment.customerPhone ? (
                            <p>{shipment.customerPhone}</p>
                          ) : null}
                          <p>Linked customer</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p>{shipment.senderName ?? "Not set"}</p>
                      {shipment.senderEmail ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {shipment.senderEmail}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p>{shipment.recipientName}</p>
                      {shipment.recipientEmail ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {shipment.recipientEmail}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {shipment.originCity}, {shipment.originCountry}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {shipment.destinationCity}, {shipment.destinationCountry}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p className="font-semibold text-[#2b1d16]">
                        {formatModeAwareServiceType(
                          shipment.serviceType,
                          shipment.transportMode,
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {shipment.packageType ?? "Parcel"} - {shipment.weightKg}kg
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {getTransportModeMeta(shipment.transportMode).label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <TrackingStatusBadge
                        status={shipment.status}
                        mode={shipment.transportMode}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          paymentBadgeClasses[shipment.paymentStatus]
                        }`}
                      >
                        {formatPaymentStatus(shipment.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(shipment.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/track?tracking=${shipment.trackingNumber}`}
                          className={actionClassName}
                        >
                          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <Link
                          href={`/admin/shipments/${shipment.id}`}
                          className={actionClassName}
                        >
                          <PencilLine
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          Manage
                        </Link>
                        <Link
                          href={`/admin/shipments/${shipment.id}#tracking-event`}
                          className={actionClassName}
                        >
                          <PlusCircle
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          Event
                        </Link>
                        {shipment.labelUrl ? (
                          <Link href={shipment.labelUrl} className={actionClassName}>
                            <FileText
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                            Label
                          </Link>
                        ) : (
                          <span className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-500">
                            Label pending
                          </span>
                        )}
                      </div>
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
