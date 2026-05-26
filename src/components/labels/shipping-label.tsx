"use client";

import { Printer } from "lucide-react";

import type { ShippingLabelData } from "@/lib/queries/labels";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
} from "@/types/shipment";

export type ShippingLabelProps = {
  label: ShippingLabelData;
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

function AddressBlock({
  title,
  address,
  name,
  phone,
}: {
  title: string;
  name: string;
  phone: string | null;
  address: ShippingLabelData["origin"];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-lg font-bold text-navy">{name}</p>
      <p className="mt-1 text-sm text-slate-700">{address.contactName}</p>
      {phone ? <p className="mt-1 text-sm text-slate-700">{phone}</p> : null}
      <p className="mt-3 text-sm leading-6 text-slate-700">
        {address.line1}
        {address.line2 ? (
          <>
            <br />
            {address.line2}
          </>
        ) : null}
        <br />
        {address.city}
        {address.stateRegion ? `, ${address.stateRegion}` : ""}{" "}
        {address.postalCode}
        <br />
        {address.country}
      </p>
    </div>
  );
}

export function ShippingLabel({ label }: ShippingLabelProps) {
  const transportMode = getTransportModeMeta(label.transportMode);

  return (
    <div className="mx-auto max-w-3xl bg-white p-6 text-slate-900 print:max-w-none print:p-0">
      <div className="mb-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Print label
        </button>
      </div>

      <section className="rounded-[24px] border-2 border-slate-900 bg-white p-6">
        <div className="flex flex-col gap-4 border-b-2 border-slate-900 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              {label.companyName}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-navy">
              Shipping Label
            </h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Tracking
            </p>
            <p className="mt-2 font-heading text-3xl font-bold tracking-[0.12em] text-navy">
              {label.trackingNumber}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AddressBlock
            title="From"
            name={label.senderName}
            phone={label.senderPhone}
            address={label.origin}
          />
          <AddressBlock
            title="To"
            name={label.recipientName}
            phone={label.recipientPhone}
            address={label.destination}
          />
        </div>

        <div className="mt-6 grid gap-3 border-y-2 border-slate-900 py-4 text-sm sm:grid-cols-3">
          <div>
            <p className="font-bold text-navy">Transport mode</p>
            <p className="mt-1 text-slate-700">{transportMode.label}</p>
          </div>
          <div>
            <p className="font-bold text-navy">Service</p>
            <p className="mt-1 text-slate-700">
              {formatModeAwareServiceType(
                label.serviceType,
                label.transportMode,
              )}
            </p>
          </div>
          <div>
            <p className="font-bold text-navy">Package</p>
            <p className="mt-1 text-slate-700">
              {label.packageType ?? "Parcel"} - {label.weightKg} kg
            </p>
          </div>
          <div>
            <p className="font-bold text-navy">Payment</p>
            <p className="mt-1 text-slate-700">
              {label.paymentStatus.replaceAll("_", " ")}
            </p>
          </div>
          <div>
            <p className="font-bold text-navy">Booking date</p>
            <p className="mt-1 text-slate-700">{formatDate(label.createdAt)}</p>
          </div>
          <div>
            <p className="font-bold text-navy">Label date</p>
            <p className="mt-1 text-slate-700">
              {formatDate(label.labelGeneratedAt)}
            </p>
          </div>
          <div>
            <p className="font-bold text-navy">Reference</p>
            <p className="mt-1 text-slate-700">
              {label.referenceCode ?? label.bookingId}
            </p>
          </div>
        </div>

        <div className="mt-6 flex min-h-24 items-center justify-center border-2 border-dashed border-slate-900 px-4 text-center">
          <p className="font-heading text-2xl font-bold tracking-[0.18em] text-navy">
            {label.trackingNumber}
          </p>
        </div>
      </section>
    </div>
  );
}
