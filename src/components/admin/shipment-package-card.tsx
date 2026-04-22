import type { AdminShipmentDetail } from "@/types/admin";
import {
  formatModeAwareServiceType,
  getModeAwareServiceMeta,
  getTransportModeMeta,
} from "@/types/shipment";

export type ShipmentPackageCardProps = {
  shipment: AdminShipmentDetail;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-right text-sm font-semibold text-[#0B1C3A]">{value}</p>
    </div>
  );
}

export function ShipmentPackageCard({ shipment }: ShipmentPackageCardProps) {
  const transportMode = getTransportModeMeta(shipment.transportMode);
  const serviceMeta = getModeAwareServiceMeta(shipment.serviceType, {
    mode: shipment.transportMode,
  });

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        Package details
      </h2>
      <div className="mt-4">
        <DetailRow label="Transport mode" value={transportMode.label} />
        <DetailRow label="Package type" value={shipment.packageType ?? "Parcel"} />
        <DetailRow
          label={`${transportMode.label} service`}
          value={formatModeAwareServiceType(
            shipment.serviceType,
            shipment.transportMode,
          )}
        />
        <DetailRow
          label="Service category"
          value={serviceMeta.pricingTier}
        />
        <DetailRow label="Weight" value={`${shipment.weightKg} kg`} />
        <DetailRow
          label="Declared value"
          value={formatMoney(shipment.declaredValue, shipment.currency)}
        />
        <DetailRow
          label="Estimated delivery"
          value={
            shipment.estimatedDeliveryDate
              ? new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(shipment.estimatedDeliveryDate))
              : "Not set"
          }
        />
      </div>
    </section>
  );
}
