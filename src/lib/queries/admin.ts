import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  AdminBookingRow,
  AdminDashboardStats,
  AdminOverviewData,
  AdminQuoteRow,
  AdminShipmentAddressBlock,
  AdminShipmentDetail,
  AdminShipmentPaymentSummary,
  AdminShipmentRow,
  AdminTrackingEventRow,
  AdminUserRow,
} from "@/types/admin";
import { normalizePaymentStatus } from "@/types/payment";
import {
  activeShipmentStatuses,
  normalizeModeAwareServiceType,
  normalizeShipmentStatus,
  normalizeTransportMode,
  type TransportMode,
} from "@/types/shipment";

type ShipmentRow = {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  tracking_number: string;
  reference_code: string | null;
  service_type: string;
  package_type: string | null;
  transport_mode: string | null;
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

type QuoteRow = {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  service_type: string;
  total: number | string;
  currency: string;
  status: string;
  created_at: string;
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
  transport_mode: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  pickup_date: string;
  pickup_window: string | null;
  special_instructions: string | null;
  status: string;
  payment_status: string;
  payment_provider: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_due: number | string;
  amount_paid: number | string;
  currency: string;
  label_url: string | null;
  label_generated_at: string | null;
  created_at: string;
  updated_at: string;
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

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

function mapAddress(row: AddressRow): AdminShipmentAddressBlock {
  return {
    id: row.id,
    contactName: row.contact_name,
    companyName: row.company_name,
    phone: row.phone,
    email: row.email,
    line1: row.line_1,
    line2: row.line_2,
    city: row.city,
    stateRegion: row.state_region,
    postalCode: row.postal_code,
    country: row.country,
  };
}

function fallbackAddress({
  contactName,
  phone,
  city,
  country,
}: {
  contactName: string | null;
  phone: string | null;
  city: string;
  country: string;
}): AdminShipmentAddressBlock {
  return {
    id: null,
    contactName,
    companyName: null,
    phone,
    email: null,
    line1: null,
    line2: null,
    city,
    stateRegion: null,
    postalCode: null,
    country,
  };
}

function customerLabel({
  shipment,
  booking,
  user,
}: {
  shipment: ShipmentRow;
  booking?: BookingRow;
  user?: UserRow;
}) {
  if (user?.full_name) {
    return user.full_name;
  }

  if (user?.email) {
    return user.email;
  }

  if (booking?.sender_email) {
    return booking.sender_email;
  }

  if (booking?.sender_name) {
    return booking.sender_name;
  }

  return shipment.user_id ? `User ${shipment.user_id.slice(0, 8)}` : "Unassigned";
}

function mapTrackingEvent(
  row: TrackingEventRow,
  trackingNumber: string | null,
  transportMode: TransportMode,
): AdminTrackingEventRow {
  return {
    id: row.id,
    orderId: row.order_id,
    trackingNumber,
    status: normalizeShipmentStatus(row.status, {
      mode: transportMode,
      arrivedAtHubAs: "received_at_origin_facility",
    }),
    transportMode,
    label: row.label,
    description: row.description,
    locationName: row.location_name,
    eventTime: row.event_time,
    createdAt: row.created_at,
  };
}

function mapShipment({
  shipment,
  booking,
  user,
}: {
  shipment: ShipmentRow;
  booking?: BookingRow;
  user?: UserRow;
}): AdminShipmentRow {
  const paymentStatus = normalizePaymentStatus(
    booking?.payment_status ?? "unpaid",
  );
  const transportMode = normalizeTransportMode(
    shipment.transport_mode ?? booking?.transport_mode,
  );

  return {
    id: shipment.id,
    bookingId: shipment.booking_id,
    trackingNumber: shipment.tracking_number,
    referenceCode: shipment.reference_code,
    customerLabel: customerLabel({ shipment, booking, user }),
    customerEmail: user?.email ?? booking?.sender_email ?? null,
    customerPhone: user?.phone ?? booking?.sender_phone ?? null,
    customerUserId: shipment.user_id,
    customerIsUnassigned: !shipment.user_id,
    senderName: booking?.sender_name ?? shipment.sender_name,
    senderEmail: booking?.sender_email ?? null,
    recipientName: booking?.recipient_name ?? shipment.recipient_name,
    recipientEmail: booking?.recipient_email ?? null,
    serviceType: normalizeModeAwareServiceType(shipment.service_type, {
      mode: transportMode,
    }),
    packageType: shipment.package_type,
    transportMode,
    status: normalizeShipmentStatus(shipment.status, { mode: transportMode }),
    paymentStatus,
    originCity: shipment.origin_city,
    originCountry: shipment.origin_country,
    destinationCity: shipment.destination_city,
    destinationCountry: shipment.destination_country,
    weightKg: Number(shipment.weight_kg),
    declaredValue: Number(shipment.declared_value),
    currency: shipment.currency,
    estimatedDeliveryDate: shipment.estimated_delivery_date,
    labelUrl: shipment.label_url,
    labelGeneratedAt: shipment.label_generated_at,
    createdAt: shipment.created_at,
    userId: shipment.user_id,
  };
}

function mapQuote(row: QuoteRow): AdminQuoteRow {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    originCity: row.origin_city,
    originCountry: row.origin_country,
    destinationCity: row.destination_city,
    destinationCountry: row.destination_country,
    serviceType: row.service_type,
    total: Number(row.total),
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapBooking(row: BookingRow): AdminBookingRow {
  return {
    id: row.id,
    userId: row.user_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    recipientName: row.recipient_name,
    serviceType: row.service_type,
    status: row.status,
    paymentStatus: normalizePaymentStatus(row.payment_status),
    amountDue: Number(row.amount_due),
    amountPaid: Number(row.amount_paid),
    currency: row.currency,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    pickupDate: row.pickup_date,
    createdAt: row.created_at,
  };
}

function mapUser(row: UserRow): AdminUserRow {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPaymentSummary(
  booking: BookingRow | null,
  shipment: ShipmentRow,
): AdminShipmentPaymentSummary {
  return {
    bookingId: booking?.id ?? shipment.booking_id,
    paymentStatus: normalizePaymentStatus(booking?.payment_status ?? "unpaid"),
    amountDue: Number(booking?.amount_due ?? 0),
    amountPaid: Number(booking?.amount_paid ?? 0),
    currency: booking?.currency ?? shipment.currency,
    paymentProvider: booking?.payment_provider ?? null,
    stripeCheckoutSessionId: booking?.stripe_checkout_session_id ?? null,
    stripePaymentIntentId: booking?.stripe_payment_intent_id ?? null,
  };
}

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

async function getBookingsByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return new Map<string, BookingRow>();
  }

  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("bookings")
    .select(
      `
      id,
      user_id,
      quote_id,
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
      pickup_date,
      pickup_window,
      special_instructions,
      status,
      payment_status,
      payment_provider,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      amount_due,
      amount_paid,
      currency,
      label_url,
      label_generated_at,
      created_at,
      updated_at
    `,
    )
    .in("id", uniqueIds);

  return byId((data ?? []) as BookingRow[]);
}

async function getUsersByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return new Map<string, UserRow>();
  }

  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .in("id", uniqueIds);

  const emailsByUserId = await getAuthEmailsByUserId(uniqueIds);
  const rows = ((data ?? []) as Omit<UserRow, "email">[]).map((row) => ({
    ...row,
    email: emailsByUserId.get(row.id) ?? null,
  }));

  return byId(rows);
}

async function getAuthEmailsByUserId(userIds: string[]) {
  const emailsByUserId = new Map<string, string | null>();
  const uniqueIds = [...new Set(userIds)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return emailsByUserId;
  }

  try {
    const serviceRole = createSupabaseServiceRoleClient();
    const authUsers = await Promise.all(
      uniqueIds.map(async (id) => {
        const { data, error } = await serviceRole.auth.admin.getUserById(id);

        if (error || !data.user) {
          return null;
        }

        return data.user;
      }),
    );

    for (const user of authUsers) {
      if (user) {
        emailsByUserId.set(user.id, user.email ?? null);
      }
    }
  } catch {
    return emailsByUserId;
  }

  return emailsByUserId;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { supabase } = await assertAdminAction();

  const [
    totalShipments,
    activeShipments,
    totalQuotes,
    totalBookings,
    totalUsers,
    totalAdmins,
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", activeShipmentStatuses),
    supabase.from("quotes").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
  ]);

  return {
    totalShipments: totalShipments.count ?? 0,
    activeShipments: activeShipments.count ?? 0,
    totalQuotes: totalQuotes.count ?? 0,
    totalBookings: totalBookings.count ?? 0,
    totalUsers: totalUsers.count ?? 0,
    totalAdmins: totalAdmins.count ?? 0,
  };
}

export async function getAdminShipments(limit = 100): Promise<AdminShipmentRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      booking_id,
      tracking_number,
      reference_code,
      service_type,
      package_type,
      transport_mode,
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
    .order("created_at", { ascending: false })
    .limit(limit);

  const shipments = (data ?? []) as ShipmentRow[];
  const bookings = await getBookingsByIds(
    shipments.map((shipment) => shipment.booking_id).filter(Boolean) as string[],
  );
  const users = await getUsersByIds(
    shipments.map((shipment) => shipment.user_id).filter(Boolean) as string[],
  );

  return shipments.map((shipment) =>
    mapShipment({
      shipment,
      booking: shipment.booking_id
        ? bookings.get(shipment.booking_id)
        : undefined,
      user: shipment.user_id ? users.get(shipment.user_id) : undefined,
    }),
  );
}

export async function getAdminShipmentDetail(
  shipmentId: string,
): Promise<AdminShipmentDetail | null> {
  const { supabase } = await assertAdminAction();
  const { data: shipmentData, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      booking_id,
      tracking_number,
      reference_code,
      service_type,
      package_type,
      transport_mode,
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
    .eq("id", shipmentId)
    .maybeSingle();

  if (error || !shipmentData) {
    return null;
  }

  const shipment = shipmentData as ShipmentRow;
  const [bookings, users, eventsResult] = await Promise.all([
    getBookingsByIds(shipment.booking_id ? [shipment.booking_id] : []),
    getUsersByIds(shipment.user_id ? [shipment.user_id] : []),
    supabase
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
      .eq("order_id", shipment.id)
      .order("event_time", { ascending: false }),
  ]);

  const booking = shipment.booking_id
    ? bookings.get(shipment.booking_id) ?? null
    : null;
  const user = shipment.user_id ? users.get(shipment.user_id) ?? null : null;
  const addressIds = [
    booking?.pickup_address_id,
    booking?.delivery_address_id,
  ].filter(Boolean) as string[];
  const { data: addressData } =
    addressIds.length > 0
      ? await supabase
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
          .in("id", addressIds)
      : { data: [] };
  const addresses = byId((addressData ?? []) as AddressRow[]);
  const pickupAddress = booking?.pickup_address_id
    ? addresses.get(booking.pickup_address_id) ?? null
    : null;
  const deliveryAddress = booking?.delivery_address_id
    ? addresses.get(booking.delivery_address_id) ?? null
    : null;
  const transportMode = normalizeTransportMode(
    shipment.transport_mode ?? booking?.transport_mode,
  );

  return {
    id: shipment.id,
    bookingId: shipment.booking_id,
    trackingNumber: shipment.tracking_number,
    referenceCode: shipment.reference_code,
    serviceType: normalizeModeAwareServiceType(shipment.service_type, {
      mode: transportMode,
    }),
    packageType: shipment.package_type,
    transportMode,
    status: normalizeShipmentStatus(shipment.status, { mode: transportMode }),
    paymentStatus: normalizePaymentStatus(booking?.payment_status ?? "unpaid"),
    originCity: shipment.origin_city,
    originCountry: shipment.origin_country,
    destinationCity: shipment.destination_city,
    destinationCountry: shipment.destination_country,
    senderName: booking?.sender_name ?? shipment.sender_name,
    senderEmail: booking?.sender_email ?? null,
    senderPhone: booking?.sender_phone ?? null,
    recipientName: booking?.recipient_name ?? shipment.recipient_name,
    recipientEmail: booking?.recipient_email ?? null,
    recipientPhone: booking?.recipient_phone ?? shipment.recipient_phone,
    weightKg: Number(shipment.weight_kg),
    declaredValue: Number(shipment.declared_value),
    currency: shipment.currency,
    labelUrl: shipment.label_url,
    labelGeneratedAt: shipment.label_generated_at,
    estimatedDeliveryDate: shipment.estimated_delivery_date,
    createdAt: shipment.created_at,
    updatedAt: shipment.updated_at,
    customer: user
      ? {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          isUnassigned: false,
        }
      : {
          id: null,
          fullName: null,
          email: null,
          phone: null,
          isUnassigned: true,
        },
    booking: booking
      ? {
          id: booking.id,
          status: booking.status,
          pickupDate: booking.pickup_date,
          pickupWindow: booking.pickup_window,
          specialInstructions: booking.special_instructions,
          senderEmail: booking.sender_email,
          senderPhone: booking.sender_phone,
          recipientEmail: booking.recipient_email,
          recipientPhone: booking.recipient_phone,
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
        }
      : null,
    payment: mapPaymentSummary(booking, shipment),
    pickupAddress: pickupAddress
      ? mapAddress(pickupAddress)
      : fallbackAddress({
          contactName: shipment.sender_name,
          phone: null,
          city: shipment.origin_city,
          country: shipment.origin_country,
        }),
    deliveryAddress: deliveryAddress
      ? mapAddress(deliveryAddress)
      : fallbackAddress({
          contactName: shipment.recipient_name,
          phone: shipment.recipient_phone,
          city: shipment.destination_city,
          country: shipment.destination_country,
        }),
    trackingEvents: ((eventsResult.data ?? []) as TrackingEventRow[]).map(
      (event) => mapTrackingEvent(event, shipment.tracking_number, transportMode),
    ),
  };
}

export async function getAdminTrackingEvents(
  limit = 50,
): Promise<AdminTrackingEventRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
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
    .order("event_time", { ascending: false })
    .limit(limit);

  const events = (data ?? []) as TrackingEventRow[];
  const orderIds = [...new Set(events.map((event) => event.order_id))];
  const { data: orderData } =
    orderIds.length > 0
      ? await supabase
          .from("orders")
          .select("id, tracking_number, transport_mode")
          .in("id", orderIds)
      : { data: [] };
  const orderLookup = new Map(
    ((orderData ?? []) as {
      id: string;
      tracking_number: string;
      transport_mode: string | null;
    }[]).map((order) => [
      order.id,
      {
        trackingNumber: order.tracking_number,
        transportMode: normalizeTransportMode(order.transport_mode),
      },
    ]),
  );

  return events.map((event) => {
    const order = orderLookup.get(event.order_id);

    return mapTrackingEvent(
      event,
      order?.trackingNumber ?? null,
      order?.transportMode ?? "road",
    );
  });
}

export async function getAdminQuotes(limit = 50): Promise<AdminQuoteRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("quotes")
    .select(
      `
      id,
      user_id,
      full_name,
      email,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      service_type,
      total,
      currency,
      status,
      created_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as QuoteRow[]).map(mapQuote);
}

export async function getAdminBookings(limit = 50): Promise<AdminBookingRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("bookings")
    .select(
      `
      id,
      user_id,
      quote_id,
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
      pickup_date,
      pickup_window,
      special_instructions,
      status,
      payment_status,
      payment_provider,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      amount_due,
      amount_paid,
      currency,
      label_url,
      label_generated_at,
      created_at,
      updated_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as BookingRow[]).map(mapBooking);
}

export async function getAdminUsers(limit = 100): Promise<AdminUserRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("users")
    .select(
      `
      id,
      full_name,
      phone,
      role,
      created_at,
      updated_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as UserRow[]).map(mapUser);
}

export async function findCustomerUserIdByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  try {
    const serviceRole = createSupabaseServiceRoleClient();
    const { data, error } = await serviceRole.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return null;
    }

    return (
      data.users.find((user) => user.email?.toLowerCase() === normalizedEmail)
        ?.id ?? null
    );
  } catch {
    return null;
  }
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const [stats, shipments, bookings, quotes, trackingEvents] =
    await Promise.all([
      getAdminDashboardStats(),
      getAdminShipments(5),
      getAdminBookings(5),
      getAdminQuotes(5),
      getAdminTrackingEvents(5),
    ]);

  return {
    stats,
    shipments,
    bookings,
    quotes,
    trackingEvents,
  };
}
