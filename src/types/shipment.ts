export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "arrived_at_hub"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "exception";

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
  senderName: string | null;
  weightKg: number;
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
