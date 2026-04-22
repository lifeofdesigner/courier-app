import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PublicTrackingResult,
  ShipmentRecord,
  TrackingEventItem,
} from "@/types/shipment";
import { normalizeShipmentStatus } from "@/types/shipment";

type OrderRow = {
  id: string;
  booking_id: string | null;
  tracking_number: string;
  reference_code: string | null;
  service_type: string;
  package_type: string | null;
  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  recipient_name: string;
  recipient_phone: string | null;
  sender_name: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  currency: string;
  status: string;
  label_url: string | null;
  label_generated_at: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string;
};

type TrackingEventRow = {
  id: string;
  order_id: string;
  status: string;
  label: string;
  description: string | null;
  location_name: string | null;
  event_time: string;
  created_at: string;
};

function mapShipment(row: OrderRow): ShipmentRecord {
  return {
    id: row.id,
    bookingId: row.booking_id,
    trackingNumber: row.tracking_number,
    referenceCode: row.reference_code,
    serviceType: row.service_type,
    packageType: row.package_type,
    originCountry: row.origin_country,
    originCity: row.origin_city,
    destinationCountry: row.destination_country,
    destinationCity: row.destination_city,
    recipientName: row.recipient_name,
    recipientPhone: row.recipient_phone,
    senderName: row.sender_name,
    weightKg: Number(row.weight_kg),
    declaredValue: Number(row.declared_value),
    currency: row.currency,
    status: normalizeShipmentStatus(row.status),
    labelUrl: row.label_url,
    labelGeneratedAt: row.label_generated_at,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTrackingEvent(row: TrackingEventRow): TrackingEventItem {
  return {
    id: row.id,
    orderId: row.order_id,
    status: normalizeShipmentStatus(row.status),
    label: row.label,
    description: row.description,
    locationName: row.location_name,
    eventTime: row.event_time,
    createdAt: row.created_at,
  };
}

export async function getPublicTrackingResult(
  trackingNumber: string,
): Promise<PublicTrackingResult> {
  const normalizedTrackingNumber = trackingNumber.trim().toUpperCase();

  if (!normalizedTrackingNumber) {
    return {
      shipment: null,
      events: [],
      notFound: false,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      shipment: null,
      events: [],
      notFound: true,
    };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      id,
      booking_id,
      tracking_number,
      reference_code,
      service_type,
      package_type,
      origin_country,
      origin_city,
      destination_country,
      destination_city,
      recipient_name,
      recipient_phone,
      sender_name,
      weight_kg,
      declared_value,
      currency,
      status,
      label_url,
      label_generated_at,
      estimated_delivery_date,
      created_at,
      updated_at
    `,
    )
    .eq("tracking_number", normalizedTrackingNumber)
    .single();

  if (orderError || !order) {
    return {
      shipment: null,
      events: [],
      notFound: true,
    };
  }

  const { data: events } = await supabase
    .from("tracking_events")
    .select(
      `
      id,
      order_id,
      status,
      label,
      description,
      location_name,
      event_time,
      created_at
    `,
    )
    .eq("order_id", order.id)
    .order("event_time", { ascending: false });

  return {
    shipment: mapShipment(order as OrderRow),
    events: ((events ?? []) as TrackingEventRow[]).map(mapTrackingEvent),
    notFound: false,
  };
}
