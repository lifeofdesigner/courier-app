import type { ShipmentStatus, TransportMode } from "@/lib/shipping/statuses";

export type {
  LegacyShipmentStatus,
  ShipmentStatus,
  ShipmentStatusInput,
  ShipmentStatusMeta,
  TransportMode,
} from "@/lib/shipping/statuses";
export {
  activeShipmentStatuses,
  allShipmentStatusDefinitions,
  commonShipmentStatusDefinitions,
  formatShipmentStatus,
  getShipmentStatusMeta,
  getShipmentStatusOptions,
  getTransportModeMeta,
  legacyShipmentStatusMap,
  modeShipmentStatusDefinitions,
  normalizeShipmentStatus,
  normalizeTransportMode,
  transportModeDefinitions,
  transportModes,
  shipmentStatuses,
} from "@/lib/shipping/statuses";

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
  transportMode: TransportMode;
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
