import type { SupabaseClient } from "@supabase/supabase-js";

import {
  normalizeModeAwareServiceType,
  normalizeTransportMode,
} from "@/lib/shipping/statuses";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { PaymentStatus, PaymentSummary } from "@/types/payment";
import type { TransportMode } from "@/types/shipment";

export type PaymentBooking = {
  id: string;
  userId: string | null;
  quoteId: string | null;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  serviceType: string;
  transportMode: TransportMode;
  weightKg: number;
  declaredValue: number;
  status: string;
  paymentStatus: PaymentStatus;
  amountDue: number;
  amountPaid: number;
  currency: string;
  stripeCheckoutSessionId: string | null;
  createdAt: string;
};

export type PaymentFulfillmentResult = {
  order: {
    id: string;
    bookingId: string | null;
    trackingNumber: string;
    referenceCode: string | null;
    labelUrl: string | null;
  };
  booking: {
    id: string;
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientEmail: string | null;
    amountPaid: number;
    currency: string;
  };
};

type PaymentBookingRow = {
  id: string;
  user_id: string | null;
  quote_id: string | null;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  service_type: string;
  transport_mode: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  status: string;
  payment_status: string;
  amount_due: number | string;
  amount_paid: number | string;
  currency: string;
  stripe_checkout_session_id: string | null;
  created_at: string;
};

type PaymentSummaryRow = {
  id: string;
  service_type: string;
  transport_mode: string | null;
  payment_status: string;
  amount_due: number | string;
  amount_paid: number | string;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
};

type FulfillmentBookingRow = {
  id: string;
  user_id: string | null;
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
  transport_mode: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  amount_paid: number | string;
  currency: string;
};

type AddressRow = {
  id: string;
  contact_name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  line_1: string;
  line_2: string | null;
  city: string;
  state_region: string | null;
  postal_code: string | null;
  country: string;
};

type OrderRow = {
  id: string;
  booking_id: string | null;
  tracking_number: string;
  reference_code: string | null;
  label_url: string | null;
};

const paymentStatuses: PaymentStatus[] = [
  "unpaid",
  "checkout_created",
  "paid",
  "payment_failed",
  "refunded",
];

function toPaymentStatus(value: string): PaymentStatus {
  return paymentStatuses.includes(value as PaymentStatus)
    ? (value as PaymentStatus)
    : "unpaid";
}

function mapPaymentBooking(row: PaymentBookingRow): PaymentBooking {
  return {
    id: row.id,
    userId: row.user_id,
    quoteId: row.quote_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    recipientName: row.recipient_name,
    serviceType: row.service_type,
    transportMode: normalizeTransportMode(row.transport_mode),
    weightKg: Number(row.weight_kg),
    declaredValue: Number(row.declared_value),
    status: row.status,
    paymentStatus: toPaymentStatus(row.payment_status),
    amountDue: Number(row.amount_due),
    amountPaid: Number(row.amount_paid),
    currency: row.currency,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    createdAt: row.created_at,
  };
}

function mapPaymentSummary(row: PaymentSummaryRow): PaymentSummary {
  const transportMode = normalizeTransportMode(row.transport_mode);

  return {
    bookingId: row.id,
    serviceType: normalizeModeAwareServiceType(row.service_type, {
      mode: transportMode,
    }),
    transportMode,
    paymentStatus: toPaymentStatus(row.payment_status),
    amountDue: Number(row.amount_due),
    amountPaid: Number(row.amount_paid),
    currency: row.currency,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
  };
}

function generateTrackingNumber() {
  const date = new Date();
  const dateStamp = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `AC${dateStamp}${suffix}`;
}

export async function getBookingForPayment(
  bookingId: string,
  supabase: SupabaseClient = createSupabaseServiceRoleClient(),
): Promise<PaymentBooking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      user_id,
      quote_id,
      sender_name,
      sender_email,
      recipient_name,
      service_type,
      transport_mode,
      weight_kg,
      declared_value,
      status,
      payment_status,
      amount_due,
      amount_paid,
      currency,
      stripe_checkout_session_id,
      created_at
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapPaymentBooking(data as PaymentBookingRow);
}

export async function updateBookingAfterCheckoutCreation({
  bookingId,
  sessionId,
  supabase = createSupabaseServiceRoleClient(),
}: {
  bookingId: string;
  sessionId: string;
  supabase?: SupabaseClient;
}) {
  return supabase
    .from("bookings")
    .update({
      payment_status: "checkout_created",
      payment_provider: "stripe",
      stripe_checkout_session_id: sessionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
}

export async function markBookingPaid({
  bookingId,
  sessionId,
  paymentIntentId,
  amountPaid,
  supabase = createSupabaseServiceRoleClient(),
}: {
  bookingId: string;
  sessionId: string;
  paymentIntentId: string | null;
  amountPaid: number;
  supabase?: SupabaseClient;
}) {
  return supabase
    .from("bookings")
    .update({
      payment_status: "paid",
      payment_provider: "stripe",
      stripe_checkout_session_id: sessionId,
      stripe_payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
}

export async function markBookingPaymentFailed({
  bookingId,
  supabase = createSupabaseServiceRoleClient(),
}: {
  bookingId: string;
  supabase?: SupabaseClient;
}) {
  return supabase
    .from("bookings")
    .update({
      payment_status: "payment_failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
}

export async function getPaymentSummaryByCheckoutSessionId(
  sessionId: string,
): Promise<PaymentSummary | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      service_type,
      transport_mode,
      payment_status,
      amount_due,
      amount_paid,
      currency,
      stripe_checkout_session_id,
      stripe_payment_intent_id
    `,
    )
    .eq("stripe_checkout_session_id", sessionId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapPaymentSummary(data as PaymentSummaryRow);
}

export async function getPaymentSummaryByBookingId(
  bookingId: string,
): Promise<PaymentSummary | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      service_type,
      transport_mode,
      payment_status,
      amount_due,
      amount_paid,
      currency,
      stripe_checkout_session_id,
      stripe_payment_intent_id
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapPaymentSummary(data as PaymentSummaryRow);
}

async function getFulfillmentBooking(
  bookingId: string,
  supabase: SupabaseClient,
) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      user_id,
      pickup_address_id,
      delivery_address_id,
      sender_name,
      sender_email,
      sender_phone,
      recipient_name,
      recipient_email,
      recipient_phone,
      service_type,
      package_type,
      transport_mode,
      weight_kg,
      declared_value,
      amount_paid,
      currency
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    throw new Error("Paid booking could not be loaded for fulfillment.");
  }

  return data as FulfillmentBookingRow;
}

async function getBookingAddresses(
  booking: FulfillmentBookingRow,
  supabase: SupabaseClient,
) {
  const addressIds = [
    booking.pickup_address_id,
    booking.delivery_address_id,
  ].filter(Boolean) as string[];

  if (addressIds.length !== 2) {
    throw new Error("Booking addresses are incomplete.");
  }

  const { data, error } = await supabase
    .from("addresses")
    .select(
      `
      id,
      contact_name,
      company_name,
      phone,
      email,
      line_1,
      line_2,
      city,
      state_region,
      postal_code,
      country
    `,
    )
    .in("id", addressIds);

  if (error) {
    throw new Error("Booking addresses could not be loaded.");
  }

  const rows = (data ?? []) as AddressRow[];
  const pickupAddress = rows.find((row) => row.id === booking.pickup_address_id);
  const deliveryAddress = rows.find(
    (row) => row.id === booking.delivery_address_id,
  );

  if (!pickupAddress || !deliveryAddress) {
    throw new Error("Booking addresses are unavailable.");
  }

  return {
    pickupAddress,
    deliveryAddress,
  };
}

async function getExistingOrder(bookingId: string, supabase: SupabaseClient) {
  const { data } = await supabase
    .from("orders")
    .select("id, booking_id, tracking_number, reference_code, label_url")
    .eq("booking_id", bookingId)
    .maybeSingle();

  return data ? (data as OrderRow) : null;
}

export async function createOrderAfterSuccessfulPaymentIfMissing({
  bookingId,
  supabase = createSupabaseServiceRoleClient(),
}: {
  bookingId: string;
  supabase?: SupabaseClient;
}): Promise<PaymentFulfillmentResult> {
  const booking = await getFulfillmentBooking(bookingId, supabase);
  const existingOrder = await getExistingOrder(bookingId, supabase);
  const labelUrl = `/label/${bookingId}`;
  const labelGeneratedAt = new Date().toISOString();

  if (existingOrder) {
    if (!existingOrder.label_url) {
      await supabase
        .from("orders")
        .update({
          label_url: labelUrl,
          label_generated_at: labelGeneratedAt,
          updated_at: labelGeneratedAt,
        })
        .eq("id", existingOrder.id);
    }

    await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        label_url: labelUrl,
        label_generated_at: labelGeneratedAt,
        updated_at: labelGeneratedAt,
      })
      .eq("id", bookingId);

    return {
      order: {
        id: existingOrder.id,
        bookingId: existingOrder.booking_id,
        trackingNumber: existingOrder.tracking_number,
        referenceCode: existingOrder.reference_code,
        labelUrl: existingOrder.label_url ?? labelUrl,
      },
      booking: {
        id: booking.id,
        senderName: booking.sender_name,
        senderEmail: booking.sender_email,
        recipientName: booking.recipient_name,
        recipientEmail: booking.recipient_email,
        amountPaid: Number(booking.amount_paid),
        currency: booking.currency,
      },
    };
  }

  const { pickupAddress, deliveryAddress } = await getBookingAddresses(
    booking,
    supabase,
  );
  const trackingNumber = generateTrackingNumber();
  const referenceCode = `BKG-${booking.id.slice(0, 8).toUpperCase()}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: booking.user_id,
      booking_id: booking.id,
      tracking_number: trackingNumber,
      reference_code: referenceCode,
      service_type: booking.service_type,
      package_type: booking.package_type,
      transport_mode: normalizeTransportMode(booking.transport_mode),
      origin_country: pickupAddress.country,
      origin_city: pickupAddress.city,
      destination_country: deliveryAddress.country,
      destination_city: deliveryAddress.city,
      recipient_name: booking.recipient_name,
      recipient_phone: booking.recipient_phone,
      sender_name: booking.sender_name,
      weight_kg: Number(booking.weight_kg),
      declared_value: Number(booking.declared_value),
      currency: booking.currency,
      status: "shipment_created",
      label_url: labelUrl,
      label_generated_at: labelGeneratedAt,
      created_at: labelGeneratedAt,
      updated_at: labelGeneratedAt,
    })
    .select("id, booking_id, tracking_number, reference_code, label_url")
    .single();

  if (error || !order) {
    const raceWinner = await getExistingOrder(bookingId, supabase);

    if (!raceWinner) {
      throw new Error("Shipment order could not be created after payment.");
    }

    return {
      order: {
        id: raceWinner.id,
        bookingId: raceWinner.booking_id,
        trackingNumber: raceWinner.tracking_number,
        referenceCode: raceWinner.reference_code,
        labelUrl: raceWinner.label_url,
      },
      booking: {
        id: booking.id,
        senderName: booking.sender_name,
        senderEmail: booking.sender_email,
        recipientName: booking.recipient_name,
        recipientEmail: booking.recipient_email,
        amountPaid: Number(booking.amount_paid),
        currency: booking.currency,
      },
    };
  }

  await Promise.all([
    supabase
      .from("bookings")
      .update({
        status: "confirmed",
        label_url: labelUrl,
        label_generated_at: labelGeneratedAt,
        updated_at: labelGeneratedAt,
      })
      .eq("id", bookingId),
    supabase.from("tracking_events").insert({
      order_id: (order as OrderRow).id,
      status: "shipment_created",
      label: "Shipment Created",
      description:
        "Payment was confirmed and the shipment is ready for courier handling.",
      location_name: "Operations team",
      event_time: labelGeneratedAt,
    }),
  ]);

  return {
    order: {
      id: (order as OrderRow).id,
      bookingId: (order as OrderRow).booking_id,
      trackingNumber: (order as OrderRow).tracking_number,
      referenceCode: (order as OrderRow).reference_code,
      labelUrl: (order as OrderRow).label_url,
    },
    booking: {
      id: booking.id,
      senderName: booking.sender_name,
      senderEmail: booking.sender_email,
      recipientName: booking.recipient_name,
      recipientEmail: booking.recipient_email,
      amountPaid: Number(booking.amount_paid),
      currency: booking.currency,
    },
  };
}
