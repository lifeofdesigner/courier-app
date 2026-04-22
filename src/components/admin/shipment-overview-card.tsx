import { TrackingStatusBadge } from "@/components/tracking";
import type { AdminShipmentDetail } from "@/types/admin";
import { formatPaymentStatus } from "@/types/payment";
import {
  formatModeAwareServiceType,
  getShipmentStatusMeta,
  getTransportModeMeta,
} from "@/types/shipment";

export type ShipmentOverviewCardProps = {
  shipment: AdminShipmentDetail;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export function ShipmentOverviewCard({ shipment }: ShipmentOverviewCardProps) {
  const labelStatus = shipment.labelUrl ? "Ready to print" : "Pending";
  const statusMeta = getShipmentStatusMeta(shipment.status, {
    mode: shipment.transportMode,
  });
  const transportMode = getTransportModeMeta(shipment.transportMode);
  const customer = shipment.customer.isUnassigned
    ? "Unassigned"
    : shipment.customer.fullName ??
      shipment.customer.email ??
      `Customer ${shipment.customer.id?.slice(0, 8)}`;

  return (
    <section className="rounded-[24px] border border-[#2b1d16]/10 bg-[#2b1d16] p-6 text-white shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#dcc1aa]">
            Shipment overview
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {shipment.trackingNumber}
          </h2>
          {shipment.referenceCode ? (
            <p className="mt-2 text-sm text-white/65">
              Reference {shipment.referenceCode}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <TrackingStatusBadge
            status={shipment.status}
            mode={shipment.transportMode}
          />
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
            {formatPaymentStatus(shipment.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
        <DetailItem
          label="Service"
          value={formatModeAwareServiceType(
            shipment.serviceType,
            shipment.transportMode,
          )}
        />
        <DetailItem label="Mode" value={transportMode.label} />
        <DetailItem label="Current milestone" value={statusMeta.label} />
        <DetailItem label="Label" value={labelStatus} />
        <DetailItem label="Created" value={formatDate(shipment.createdAt)} />
        <DetailItem label="Customer" value={customer} />
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">
        {statusMeta.description}
      </p>
      <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
          Linked customer
        </p>
        {shipment.customer.isUnassigned ? (
          <p className="mt-2 text-sm font-semibold text-white">
            This shipment is unassigned.
          </p>
        ) : (
          <div className="mt-2 grid gap-2 text-sm text-white sm:grid-cols-2 lg:grid-cols-4">
            <p className="font-semibold">{customer}</p>
            <p className="text-white/75">
              {shipment.customer.email ?? "No email on profile"}
            </p>
            <p className="text-white/75">
              {shipment.customer.phone ?? "No phone on profile"}
            </p>
            <p className="text-white/55">
              ID {shipment.customer.id?.slice(0, 8)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
