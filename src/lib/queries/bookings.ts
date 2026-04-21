import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AddressInput, BookingFormInput, BookingRecord } from "@/types/booking";
import type { ServiceType } from "@/types/quote";

type AddressRow = {
  id: string;
};

type BookingRow = {
  id: string;
  user_id: string | null;
  quote_id: string | null;
  pickup_address_id: string | null;
  delivery_address_id: string | null;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  recipient_name: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  service_type: string;
  package_type: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  pickup_date: string;
  pickup_window: string | null;
  special_instructions: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function optionalValue(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

function toServiceType(value: string): ServiceType {
  return value === "Economy" ? "Economy" : "Express";
}

function mapBooking(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    userId: row.user_id,
    quoteId: row.quote_id,
    pickupAddressId: row.pickup_address_id,
    deliveryAddressId: row.delivery_address_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    senderPhone: row.sender_phone,
    recipientName: row.recipient_name,
    recipientEmail: row.recipient_email,
    recipientPhone: row.recipient_phone,
    serviceType: toServiceType(row.service_type),
    packageType: row.package_type,
    weightKg: Number(row.weight_kg),
    declaredValue: Number(row.declared_value),
    pickupDate: row.pickup_date,
    pickupWindow: row.pickup_window,
    specialInstructions: row.special_instructions,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function insertAddress({
  address,
  label,
  addressType,
  userId,
}: {
  address: AddressInput;
  label: "Pickup" | "Delivery";
  addressType: "pickup" | "delivery";
  userId: string | null;
}): Promise<AddressRow> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      label,
      contact_name: address.contactName,
      company_name: optionalValue(address.companyName),
      phone: optionalValue(address.phone),
      email: optionalValue(address.email),
      line_1: address.line1,
      line_2: optionalValue(address.line2),
      city: address.city,
      state_region: optionalValue(address.stateRegion),
      postal_code: optionalValue(address.postalCode),
      country: address.country,
      address_type: addressType,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`${label} address could not be saved.`);
  }

  return data as AddressRow;
}

export async function insertBookingRequest({
  input,
  userId,
}: {
  input: BookingFormInput;
  userId: string | null;
}): Promise<BookingRecord> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const pickupAddress = await insertAddress({
    userId,
    label: "Pickup",
    addressType: "pickup",
    address: input.pickup,
  });

  const deliveryAddress = await insertAddress({
    userId,
    label: "Delivery",
    addressType: "delivery",
    address: input.delivery,
  });

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      quote_id: input.quoteId || null,
      pickup_address_id: pickupAddress.id,
      delivery_address_id: deliveryAddress.id,
      sender_name: input.senderName,
      sender_email: input.senderEmail,
      sender_phone: optionalValue(input.senderPhone),
      recipient_name: input.recipientName,
      recipient_email: optionalValue(input.recipientEmail),
      recipient_phone: optionalValue(input.recipientPhone),
      service_type: input.serviceType,
      package_type: input.packageType,
      weight_kg: input.weightKg,
      declared_value: input.declaredValue,
      pickup_date: input.pickupDate,
      pickup_window: input.pickupWindow,
      special_instructions: optionalValue(input.specialInstructions),
      status: "requested",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("The booking request could not be saved.");
  }

  return mapBooking(data as BookingRow);
}
