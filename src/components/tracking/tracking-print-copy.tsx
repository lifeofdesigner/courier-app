"use client";

import { Printer } from "lucide-react";
import Link from "next/link";

import { TrackingStatusBadge } from "@/components/tracking/tracking-status-badge";
import { company } from "@/constants/site";
import {
  formatModeAwareServiceType,
  getShipmentStatusMeta,
  getTransportModeMeta,
  type ShipmentRecord,
  type TrackingEventItem,
} from "@/types/shipment";

export type TrackingPrintCopyProps = {
  shipment: ShipmentRecord;
  events: TrackingEventItem[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not confirmed";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="border-b border-slate-200 py-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-950">
        {value ?? "Not available"}
      </dd>
    </div>
  );
}

export function TrackingPrintCopy({
  shipment,
  events,
}: TrackingPrintCopyProps) {
  const transportMode = getTransportModeMeta(shipment.transportMode);
  const statusMeta = getShipmentStatusMeta(shipment.status, {
    mode: shipment.transportMode,
  });
  const serviceLabel = formatModeAwareServiceType(
    shipment.serviceType,
    shipment.transportMode,
  );
  const printDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-4xl bg-white p-6 text-slate-950 print:max-w-none print:p-0">
      <div className="mb-5 flex flex-wrap justify-end gap-3 print:hidden">
        <Link
          href={`/track?tracking=${encodeURIComponent(shipment.trackingNumber)}`}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          Back to tracking
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Download / print copy
        </button>
      </div>

      <section className="rounded-[24px] border-2 border-slate-900 bg-white p-6 print:rounded-none">
        <header className="flex flex-col gap-5 border-b-2 border-slate-900 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B2B]">
              {company.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1C3A]">
              Tracking Copy
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {company.address}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Tracking number
            </p>
            <p className="mt-2 text-2xl font-bold tracking-[0.1em] text-[#0B1C3A]">
              {shipment.trackingNumber}
            </p>
            <div className="mt-3">
              <TrackingStatusBadge
                status={shipment.status}
                mode={shipment.transportMode}
              />
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0B1C3A]">
              Shipment details
            </h2>
            <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
              <DetailItem label="Reference" value={shipment.referenceCode} />
              <DetailItem label="Current status" value={statusMeta.label} />
              <DetailItem label="Transport mode" value={transportMode.label} />
              <DetailItem label="Service" value={serviceLabel} />
              <DetailItem
                label="Origin"
                value={`${shipment.originCity}, ${shipment.originCountry}`}
              />
              <DetailItem
                label="Destination"
                value={`${shipment.destinationCity}, ${shipment.destinationCountry}`}
              />
              <DetailItem label="Sender" value={shipment.senderName} />
              <DetailItem label="Recipient" value={shipment.recipientName} />
              <DetailItem label="Package" value={shipment.packageType} />
              <DetailItem label="Weight" value={`${shipment.weightKg} kg`} />
              <DetailItem
                label="Declared value"
                value={formatMoney(shipment.declaredValue, shipment.currency)}
              />
              <DetailItem
                label="Estimated delivery"
                value={formatDate(shipment.estimatedDeliveryDate)}
              />
            </dl>
          </div>

          <aside className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold tracking-tight text-[#0B1C3A]">
              Copy information
            </h2>
            <dl className="mt-3">
              <DetailItem label="Generated" value={printDate} />
              <DetailItem label="Shipment created" value={formatDate(shipment.createdAt)} />
              <DetailItem label="Last updated" value={formatDate(shipment.updatedAt)} />
              <DetailItem
                label="Label generated"
                value={formatDate(shipment.labelGeneratedAt)}
              />
            </dl>
          </aside>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold tracking-tight text-[#0B1C3A]">
            Tracking timeline
          </h2>
          {events.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {events.map((event) => {
                const eventStatus = getShipmentStatusMeta(event.status, {
                  mode: shipment.transportMode,
                });

                return (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold text-[#0B1C3A]">
                          {event.label || eventStatus.label}
                        </p>
                        {event.description ? (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {event.description}
                          </p>
                        ) : null}
                        {event.locationName ? (
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {event.locationName}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-slate-500">
                        {formatDateTime(event.eventTime)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              No tracking events have been published for this shipment yet.
            </p>
          )}
        </section>

        <footer className="mt-8 border-t-2 border-slate-900 pt-4 text-xs leading-6 text-slate-500">
          <p>
            This copy reflects the shipment information available at the time it
            was generated. For live updates, track {shipment.trackingNumber} on
            {` ${company.name}`}.
          </p>
        </footer>
      </section>
    </div>
  );
}
