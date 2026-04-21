import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type {
  AdminBookingRow,
  AdminDashboardStats,
  AdminOverviewData,
  AdminQuoteRow,
  AdminShipmentRow,
  AdminTrackingEventRow,
  AdminUserRow,
} from "@/types/admin";

type ShipmentRow = {
  id: string;
  tracking_number: string;
  service_type: string;
  status: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  estimated_delivery_date: string | null;
  created_at: string;
  user_id: string | null;
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
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  service_type: string;
  status: string;
  pickup_date: string;
  created_at: string;
};

type UserRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

const activeShipmentStatuses = [
  "label_created",
  "picked_up",
  "arrived_at_hub",
  "in_transit",
  "customs_clearance",
  "out_for_delivery",
];

function mapShipment(row: ShipmentRow): AdminShipmentRow {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    serviceType: row.service_type,
    status: row.status,
    originCity: row.origin_city,
    originCountry: row.origin_country,
    destinationCity: row.destination_city,
    destinationCountry: row.destination_country,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    userId: row.user_id,
  };
}

function mapTrackingEvent(row: TrackingEventRow): AdminTrackingEventRow {
  return {
    id: row.id,
    orderId: row.order_id,
    status: row.status,
    label: row.label,
    description: row.description,
    locationName: row.location_name,
    eventTime: row.event_time,
    createdAt: row.created_at,
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

export async function getAdminShipments(limit = 20): Promise<AdminShipmentRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("orders")
    .select(
      `
      id,
      tracking_number,
      service_type,
      status,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      estimated_delivery_date,
      created_at,
      user_id
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as ShipmentRow[]).map(mapShipment);
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

  return ((data ?? []) as TrackingEventRow[]).map(mapTrackingEvent);
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
      sender_name,
      sender_email,
      recipient_name,
      service_type,
      status,
      pickup_date,
      created_at
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
