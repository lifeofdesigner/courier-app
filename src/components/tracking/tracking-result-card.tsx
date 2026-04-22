import { CalendarDays, MapPin, PackageCheck, Route } from "lucide-react";
import Link from "next/link";

import { TrackingStatusBadge } from "@/components/tracking/tracking-status-badge";
import {
  formatModeAwareServiceType,
  getShipmentStatusMeta,
  getTransportModeMeta,
  type ShipmentRecord,
} from "@/types/shipment";

export type TrackingResultCardProps = {
  shipment: ShipmentRecord;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not confirmed yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function TrackingResultCard({ shipment }: TrackingResultCardProps) {
  const statusMeta = getShipmentStatusMeta(shipment.status, {
    mode: shipment.transportMode,
  });
  const transportMode = getTransportModeMeta(shipment.transportMode);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
            Shipment found
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C3A]">
            {shipment.trackingNumber}
          </h2>
          {shipment.referenceCode ? (
            <p className="mt-2 text-sm text-slate-600">
              Reference {shipment.referenceCode}
            </p>
          ) : null}
        </div>
        <TrackingStatusBadge
          status={shipment.status}
          mode={shipment.transportMode}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <Route aria-hidden="true" className="h-5 w-5 text-[#FF6B2B]" />
          <p className="mt-3 text-sm font-semibold text-[#0B1C3A]">Route</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {shipment.originCity}, {shipment.originCountry} to{" "}
            {shipment.destinationCity}, {shipment.destinationCountry}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <PackageCheck aria-hidden="true" className="h-5 w-5 text-[#FF6B2B]" />
          <p className="mt-3 text-sm font-semibold text-[#0B1C3A]">Service</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {transportMode.label} -{" "}
            {formatModeAwareServiceType(
              shipment.serviceType,
              shipment.transportMode,
            )}
            {shipment.packageType ? ` - ${shipment.packageType}` : ""}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <CalendarDays aria-hidden="true" className="h-5 w-5 text-[#FF6B2B]" />
          <p className="mt-3 text-sm font-semibold text-[#0B1C3A]">
            Estimated delivery
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {formatDate(shipment.estimatedDeliveryDate)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4">
        <MapPin aria-hidden="true" className="mt-1 h-5 w-5 text-[#FF6B2B]" />
        <p className="text-sm leading-7 text-slate-600">
          Delivery for <span className="font-semibold text-[#0B1C3A]">{shipment.recipientName}</span>{" "}
          is currently marked as {statusMeta.label}.
        </p>
      </div>
      {shipment.labelUrl ? (
        <div className="mt-4">
          <Link
            href={shipment.labelUrl}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Print label
          </Link>
        </div>
      ) : null}
    </div>
  );
}
