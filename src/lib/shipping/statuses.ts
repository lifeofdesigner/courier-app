export const shipmentStatusDefinitions = [
  {
    code: "shipment_created",
    label: "Shipment Created",
    description:
      "The shipment record has been created and is ready for operational handling.",
    badgeClassName: "bg-slate-100 text-slate-700",
  },
  {
    code: "pickup_scheduled",
    label: "Pickup Scheduled",
    description: "A courier pickup has been scheduled for the shipment.",
    badgeClassName: "bg-sky-100 text-sky-700",
  },
  {
    code: "collected",
    label: "Collected by Courier",
    description: "The shipment has been collected by a courier.",
    badgeClassName: "bg-orange-100 text-orange-700",
  },
  {
    code: "received_at_origin_facility",
    label: "Received at Origin Facility",
    description: "The shipment has arrived at the origin sorting facility.",
    badgeClassName: "bg-cyan-100 text-cyan-700",
  },
  {
    code: "departed_origin_facility",
    label: "Departed Origin Facility",
    description: "The shipment has left the origin sorting facility.",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  {
    code: "in_transit",
    label: "In Transit",
    description: "The shipment is moving through the courier network.",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  {
    code: "arrived_at_destination_facility",
    label: "Arrived at Destination Facility",
    description: "The shipment has arrived at the destination facility.",
    badgeClassName: "bg-indigo-100 text-indigo-700",
  },
  {
    code: "customs_clearance_in_progress",
    label: "Customs Clearance in Progress",
    description: "The shipment is being processed by customs.",
    badgeClassName: "bg-violet-100 text-violet-700",
  },
  {
    code: "customs_cleared",
    label: "Customs Cleared",
    description: "Customs clearance is complete.",
    badgeClassName: "bg-emerald-50 text-emerald-700",
  },
  {
    code: "out_for_delivery",
    label: "Out for Delivery",
    description: "The shipment is with the courier for final delivery.",
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  {
    code: "delivered",
    label: "Delivered",
    description: "The shipment has been delivered successfully.",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    code: "delivery_attempted",
    label: "Delivery Attempted",
    description: "The courier attempted delivery but could not complete it.",
    badgeClassName: "bg-amber-50 text-amber-700",
  },
  {
    code: "exception",
    label: "Shipment Exception",
    description: "The shipment needs attention because an exception occurred.",
    badgeClassName: "bg-rose-100 text-rose-700",
  },
  {
    code: "on_hold",
    label: "On Hold",
    description: "The shipment is temporarily on hold.",
    badgeClassName: "bg-yellow-100 text-yellow-800",
  },
  {
    code: "returned_to_sender",
    label: "Returned to Sender",
    description: "The shipment is being returned to the sender.",
    badgeClassName: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    code: "cancelled",
    label: "Cancelled",
    description: "The shipment has been cancelled.",
    badgeClassName: "bg-zinc-200 text-zinc-700",
  },
] as const;

export type ShipmentStatus = (typeof shipmentStatusDefinitions)[number]["code"];

export type LegacyShipmentStatus =
  | "label_created"
  | "picked_up"
  | "arrived_at_hub"
  | "customs_clearance";

export type ShipmentStatusInput = ShipmentStatus | LegacyShipmentStatus | string;

export type ShipmentStatusMeta = {
  code: ShipmentStatus;
  label: string;
  description: string;
  badgeClassName: string;
  isLegacy: boolean;
  originalCode: string;
};

export const shipmentStatuses = shipmentStatusDefinitions.map(
  (status) => status.code,
) as [ShipmentStatus, ...ShipmentStatus[]];

export const legacyShipmentStatusMap = {
  label_created: "shipment_created",
  picked_up: "collected",
  arrived_at_hub: "arrived_at_destination_facility",
  customs_clearance: "customs_clearance_in_progress",
} as const satisfies Record<LegacyShipmentStatus, ShipmentStatus>;

export const activeShipmentStatuses = [
  "shipment_created",
  "pickup_scheduled",
  "collected",
  "received_at_origin_facility",
  "departed_origin_facility",
  "in_transit",
  "arrived_at_destination_facility",
  "customs_clearance_in_progress",
  "customs_cleared",
  "out_for_delivery",
  "delivery_attempted",
  "on_hold",
  "returned_to_sender",
  "label_created",
  "picked_up",
  "arrived_at_hub",
  "customs_clearance",
] as const;

const definitionByCode = new Map(
  shipmentStatusDefinitions.map((status) => [status.code, status]),
);

export function normalizeShipmentStatus(
  status: ShipmentStatusInput,
  options?: {
    arrivedAtHubAs?:
      | "received_at_origin_facility"
      | "arrived_at_destination_facility";
  },
): ShipmentStatus {
  const normalized = status.trim();

  if (normalized === "arrived_at_hub" && options?.arrivedAtHubAs) {
    return options.arrivedAtHubAs;
  }

  if (normalized in legacyShipmentStatusMap) {
    return legacyShipmentStatusMap[normalized as LegacyShipmentStatus];
  }

  if (definitionByCode.has(normalized as ShipmentStatus)) {
    return normalized as ShipmentStatus;
  }

  return "exception";
}

export function getShipmentStatusMeta(
  status: ShipmentStatusInput,
  options?: Parameters<typeof normalizeShipmentStatus>[1],
): ShipmentStatusMeta {
  const originalCode = status.trim();
  const code = normalizeShipmentStatus(originalCode, options);
  const definition =
    definitionByCode.get(code) ?? definitionByCode.get("exception");

  return {
    code,
    label: definition?.label ?? "Shipment Exception",
    description:
      definition?.description ??
      "The shipment needs attention because an exception occurred.",
    badgeClassName: definition?.badgeClassName ?? "bg-rose-100 text-rose-700",
    isLegacy: originalCode !== code,
    originalCode,
  };
}

export function formatShipmentStatus(status: ShipmentStatusInput) {
  return getShipmentStatusMeta(status).label;
}
