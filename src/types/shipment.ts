export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "arrived_at_hub"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export const shipmentStatuses = [
  "label_created",
  "picked_up",
  "in_transit",
  "arrived_at_hub",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
  "exception",
] as const satisfies readonly ShipmentStatus[];

export const activeShipmentStatuses: ShipmentStatus[] = [
  "label_created",
  "picked_up",
  "in_transit",
  "arrived_at_hub",
  "customs_clearance",
  "out_for_delivery",
];

export function normalizeShipmentStatus(status: string): ShipmentStatus {
  return shipmentStatuses.includes(status as ShipmentStatus)
    ? (status as ShipmentStatus)
    : "exception";
}

export function formatShipmentStatus(status: string) {
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export interface TrackingEventItem {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  label: string;
  description: string | null;
  locationName: string | null;
  eventTime: string;
  createdAt: string;
}

export interface ShipmentRecord {
  id: string;
  bookingId: string | null;
  trackingNumber: string;
  referenceCode: string | null;
  serviceType: string;
  packageType: string | null;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  recipientName: string;
  recipientPhone: string | null;
  senderName: string | null;
  weightKg: number;
  declaredValue: number;
  currency: string;
  status: ShipmentStatus;
  labelUrl: string | null;
  labelGeneratedAt: string | null;
  estimatedDeliveryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTrackingResult {
  shipment: ShipmentRecord | null;
  events: TrackingEventItem[];
  notFound: boolean;
}
