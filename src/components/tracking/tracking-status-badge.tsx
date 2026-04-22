import type { ShipmentStatus } from "@/types/shipment";
import { formatShipmentStatus } from "@/types/shipment";

export type TrackingStatusBadgeProps = {
  status: ShipmentStatus;
};

const statusClasses = {
  delivered: "bg-emerald-100 text-emerald-700",
  in_transit: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-amber-100 text-amber-700",
  exception: "bg-rose-100 text-rose-700",
  label_created: "bg-slate-100 text-slate-700",
  customs_clearance: "bg-violet-100 text-violet-700",
  arrived_at_hub: "bg-cyan-100 text-cyan-700",
  picked_up: "bg-orange-100 text-orange-700",
} satisfies Record<ShipmentStatus, string>;

export function TrackingStatusBadge({ status }: TrackingStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {formatShipmentStatus(status)}
    </span>
  );
}
