export type ServiceLevel =
  | "same_day"
  | "next_day"
  | "standard"
  | "international";

export type ShipmentStatus =
  | "draft"
  | "booked"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "cancelled";

export type TrackingEventType =
  | "created"
  | "pickup_scheduled"
  | "picked_up"
  | "facility_arrival"
  | "facility_departure"
  | "customs_review"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export type QuoteStatus = "draft" | "requested" | "priced" | "expired";

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "assigned"
  | "completed"
  | "cancelled";

export type UserRole = "customer" | "admin" | "dispatcher" | "support";

export type ShipmentAddress = {
  name: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type ShipmentPiece = {
  weight: number;
  weightUnit: "lb" | "kg";
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: "in" | "cm";
};

export type TrackingEvent = {
  id: string;
  shipmentId: string;
  type: TrackingEventType;
  status: ShipmentStatus;
  location?: string;
  message: string;
  occurredAt: string;
  createdAt: string;
};

export type Shipment = {
  id: string;
  trackingNumber: string;
  customerId: string;
  status: ShipmentStatus;
  serviceLevel: ServiceLevel;
  origin: ShipmentAddress;
  destination: ShipmentAddress;
  pieces: ShipmentPiece[];
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type QuoteRequest = {
  id: string;
  customerId?: string;
  status: QuoteStatus;
  serviceLevel: ServiceLevel;
  originPostalCode: string;
  destinationPostalCode: string;
  pieces: ShipmentPiece[];
  requestedAt: string;
};

export type PickupBooking = {
  id: string;
  customerId?: string;
  status: BookingStatus;
  pickupAddress: ShipmentAddress;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  shipmentIds: string[];
  createdAt: string;
};
