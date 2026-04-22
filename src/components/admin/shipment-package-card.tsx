import type { AdminShipmentDetail } from "@/types/admin";

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
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        Package details
      </h2>
      <div className="mt-4">
        <DetailRow label="Package type" value={shipment.packageType ?? "Parcel"} />
        <DetailRow label="Service" value={shipment.serviceType} />
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
