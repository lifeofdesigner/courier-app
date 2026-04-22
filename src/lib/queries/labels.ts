import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { company } from "@/constants/site";
import type { PaymentStatus } from "@/types/payment";
import {
  normalizeModeAwareServiceType,
  normalizeTransportMode,
  type ModeAwareServiceType,
  type TransportMode,
} from "@/types/shipment";

export type ShippingLabelData = {
  companyName: string;
  bookingId: string;
  orderId: string;
  trackingNumber: string;
  referenceCode: string | null;
  senderName: string;
  senderPhone: string | null;
  recipientName: string;
  recipientPhone: string | null;
  origin: {
    contactName: string;
    line1: string;
    line2: string | null;
    city: string;
    stateRegion: string | null;
    postalCode: string | null;
    country: string;
  };
  destination: {
    contactName: string;
    line1: string;
    line2: string | null;
    city: string;
    stateRegion: string | null;
    postalCode: string | null;
    country: string;
  };
  serviceType: ModeAwareServiceType;
  transportMode: TransportMode;
  packageType: string | null;
  weightKg: number;
  declaredValue: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  labelGeneratedAt: string | null;
};

type BookingRow = {
  id: string;
  pickup_address_id: string | null;
  delivery_address_id: string | null;
  sender_name: string;
  sender_phone: string | null;
  recipient_name: string;
  recipient_phone: string | null;
  service_type: string;
  transport_mode: string | null;
  package_type: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  currency: string;
  payment_status: PaymentStatus;
  created_at: string;
  label_generated_at: string | null;
};

type AddressRow = {
  id: string;
  contact_name: string;
  line_1: string;
  line_2: string | null;
  city: string;
  state_region: string | null;
  postal_code: string | null;
  country: string;
};

type OrderRow = {
  id: string;
  tracking_number: string;
  reference_code: string | null;
  service_type: string;
  transport_mode: string | null;
};

function mapAddress(row: AddressRow) {
  return {
    contactName: row.contact_name,
    line1: row.line_1,
    line2: row.line_2,
    city: row.city,
    stateRegion: row.state_region,
    postalCode: row.postal_code,
    country: row.country,
  };
}

export async function getShippingLabelData(
  bookingId: string,
): Promise<ShippingLabelData | null> {
  let supabase;

  try {
    supabase = createSupabaseServiceRoleClient();
  } catch {
    return null;
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      pickup_address_id,
      delivery_address_id,
      sender_name,
      sender_phone,
      recipient_name,
      recipient_phone,
      service_type,
      transport_mode,
      package_type,
      weight_kg,
      declared_value,
      currency,
      payment_status,
      created_at,
      label_generated_at
    `,
    )
    .eq("id", bookingId)
    .eq("payment_status", "paid")
    .single();

  if (bookingError || !booking) {
    return null;
  }

  const typedBooking = booking as BookingRow;
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, tracking_number, reference_code, service_type, transport_mode")
    .eq("booking_id", bookingId)
    .single();

  if (orderError || !order) {
    return null;
  }

  const addressIds = [
    typedBooking.pickup_address_id,
    typedBooking.delivery_address_id,
  ].filter(Boolean) as string[];

  if (addressIds.length !== 2) {
    return null;
  }

  const { data: addresses, error: addressError } = await supabase
    .from("addresses")
    .select(
      `
      id,
      contact_name,
      line_1,
      line_2,
      city,
      state_region,
      postal_code,
      country
    `,
    )
    .in("id", addressIds);

  if (addressError) {
    return null;
  }

  const rows = (addresses ?? []) as AddressRow[];
  const pickupAddress = rows.find(
    (row) => row.id === typedBooking.pickup_address_id,
  );
  const deliveryAddress = rows.find(
    (row) => row.id === typedBooking.delivery_address_id,
  );

  if (!pickupAddress || !deliveryAddress) {
    return null;
  }

  const typedOrder = order as OrderRow;
  const transportMode = normalizeTransportMode(
    typedOrder.transport_mode ?? typedBooking.transport_mode,
  );

  return {
    companyName: company.name,
    bookingId: typedBooking.id,
    orderId: typedOrder.id,
    trackingNumber: typedOrder.tracking_number,
    referenceCode: typedOrder.reference_code,
    senderName: typedBooking.sender_name,
    senderPhone: typedBooking.sender_phone,
    recipientName: typedBooking.recipient_name,
    recipientPhone: typedBooking.recipient_phone,
    origin: mapAddress(pickupAddress),
    destination: mapAddress(deliveryAddress),
    serviceType: normalizeModeAwareServiceType(
      typedOrder.service_type ?? typedBooking.service_type,
      { mode: transportMode },
    ),
    transportMode,
    packageType: typedBooking.package_type,
    weightKg: Number(typedBooking.weight_kg),
    declaredValue: Number(typedBooking.declared_value),
    currency: typedBooking.currency,
    paymentStatus: typedBooking.payment_status,
    createdAt: typedBooking.created_at,
    labelGeneratedAt: typedBooking.label_generated_at,
  };
}
