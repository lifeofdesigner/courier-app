import type {
  ModeAwareServiceType,
  ShipmentStatus,
  TransportMode,
} from "@/lib/shipping/statuses";

export type {
  LegacyShipmentStatus,
  LegacyServiceType,
  ModeAwareServiceDefinition,
  ModeAwareServiceMeta,
  ModeAwareServiceType,
  PricingServiceTier,
  TransportModePublicCopy,
  ShipmentStatus,
  ShipmentStatusInput,
  ShipmentStatusMeta,
  ShipmentServiceTypeInput,
  TransportMode,
} from "@/lib/shipping/statuses";
export {
  activeShipmentStatuses,
  allShipmentStatusDefinitions,
  allModeAwareServiceDefinitions,
  commonShipmentStatusDefinitions,
  formatModeAwareServiceType,
  formatShipmentStatus,
  getDefaultModeAwareServiceType,
  getModeAwareServiceMeta,
  getModeAwareServiceOptions,
  getPricingServiceTypeForModeAwareService,
  getShipmentStatusMeta,
  getShipmentStatusOptions,
  getTransportModeMeta,
  getTransportModePublicCopy,
  isModeAwareServiceTypeForMode,
  legacyShipmentStatusMap,
  modeAwareServiceDefinitions,
  modeAwareServiceTypes,
  modeShipmentStatusDefinitions,
  normalizeModeAwareServiceType,
  normalizeShipmentStatus,
  normalizeTransportMode,
  transportModeDefinitions,
  transportModePublicCopy,
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
  serviceType: ModeAwareServiceType;
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
