import { TrackingStatusBadge } from "@/components/tracking";
import type { AdminShipmentDetail } from "@/types/admin";
import { formatPaymentStatus } from "@/types/payment";
import { getShipmentStatusMeta, getTransportModeMeta } from "@/types/shipment";

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
  const customer = shipment.customer
    ? shipment.customer.fullName ?? shipment.customer.id
    : "Unassigned";

  return (
    <section className="rounded-[24px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#FFB18B]">
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
        <DetailItem label="Service" value={shipment.serviceType} />
        <DetailItem label="Mode" value={transportMode.label} />
        <DetailItem label="Current milestone" value={statusMeta.label} />
        <DetailItem label="Label" value={labelStatus} />
        <DetailItem label="Created" value={formatDate(shipment.createdAt)} />
        <DetailItem label="Customer" value={customer} />
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">
        {statusMeta.description}
      </p>
    </section>
  );
}
