import {
  getShipmentStatusMeta,
  type ShipmentStatusInput,
} from "@/types/shipment";

export type TrackingStatusBadgeProps = {
  status: ShipmentStatusInput;
  mode?: string | null;
};

export function TrackingStatusBadge({ status, mode }: TrackingStatusBadgeProps) {
  const statusMeta = getShipmentStatusMeta(status, { mode });

  return (
    <span
      title={statusMeta.description}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
    >
      {statusMeta.label}
    </span>
  );
}
