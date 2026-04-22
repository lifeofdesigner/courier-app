import {
  getShipmentStatusMeta,
  type ShipmentStatusInput,
} from "@/types/shipment";

export type TrackingStatusBadgeProps = {
  status: ShipmentStatusInput;
};

export function TrackingStatusBadge({ status }: TrackingStatusBadgeProps) {
  const statusMeta = getShipmentStatusMeta(status);

  return (
    <span
      title={statusMeta.description}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
    >
      {statusMeta.label}
    </span>
  );
}
