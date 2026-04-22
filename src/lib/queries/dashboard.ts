import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUserProfile } from "@/types/auth";
import type {
  BookingListItem,
  DashboardOverviewData,
  DashboardStats,
  QuoteTableItem,
  ShipmentTableItem,
} from "@/types/dashboard";
import type { PaymentStatus } from "@/types/payment";
import {
  activeShipmentStatuses,
  normalizeShipmentStatus,
  normalizeTransportMode,
} from "@/types/shipment";

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

type ShipmentRow = {
  id: string;
  booking_id: string | null;
  tracking_number: string;
  service_type: string;
  transport_mode: string | null;
  status: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  estimated_delivery_date: string | null;
  label_url: string | null;
  created_at: string;
};

type QuoteRow = {
  id: string;
  service_type: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  total: number | string;
  currency: string;
  status: string;
  created_at: string;
};

type BookingRow = {
  id: string;
  service_type: string;
  status: string;
  payment_status: string;
  amount_due: number | string;
  amount_paid: number | string;
  currency: string;
  stripe_checkout_session_id: string | null;
  pickup_date: string;
  created_at: string;
};

function normalizePaymentStatus(status: string): PaymentStatus {
  const statuses: PaymentStatus[] = [
    "unpaid",
    "checkout_created",
    "paid",
    "payment_failed",
    "refunded",
  ];

  return statuses.includes(status as PaymentStatus)
    ? (status as PaymentStatus)
    : "unpaid";
}

function mapProfile(row: ProfileRow): AppUserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fallbackProfile(user: User): AppUserProfile {
  return {
    id: user.id,
    fullName:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    phone:
      typeof user.user_metadata.phone === "string"
        ? user.user_metadata.phone
        : null,
    role: "customer",
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? user.created_at,
  };
}

function mapShipment(row: ShipmentRow): ShipmentTableItem {
  return {
    id: row.id,
    bookingId: row.booking_id,
    trackingNumber: row.tracking_number,
    serviceType: row.service_type,
    transportMode: normalizeTransportMode(row.transport_mode),
    status: normalizeShipmentStatus(row.status, {
      mode: row.transport_mode,
    }),
    originCity: row.origin_city,
    originCountry: row.origin_country,
    destinationCity: row.destination_city,
    destinationCountry: row.destination_country,
    estimatedDeliveryDate: row.estimated_delivery_date,
    labelUrl: row.label_url,
    createdAt: row.created_at,
  };
}

function mapQuote(row: QuoteRow): QuoteTableItem {
  return {
    id: row.id,
    serviceType: row.service_type,
    originCity: row.origin_city,
    originCountry: row.origin_country,
    destinationCity: row.destination_city,
    destinationCountry: row.destination_country,
    total: Number(row.total),
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapBooking(row: BookingRow): BookingListItem {
  return {
    id: row.id,
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

const emptyStats: DashboardStats = {
  totalShipments: 0,
  activeShipments: 0,
  totalQuotes: 0,
  totalBookings: 0,
};

export async function getCurrentDashboardContext(): Promise<{
  user: User | null;
  profile: AppUserProfile | null;
}> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      user: null,
      profile: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: data ? mapProfile(data as ProfileRow) : fallbackProfile(user),
  };
}

export async function getDashboardOverviewData(): Promise<DashboardOverviewData> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      profile: null,
      stats: emptyStats,
      recentShipments: [],
      recentQuotes: [],
      recentBookings: [],
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      stats: emptyStats,
      recentShipments: [],
      recentQuotes: [],
      recentBookings: [],
    };
  }

  const profilePromise = supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  const totalShipmentsPromise = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const activeShipmentsPromise = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", activeShipmentStatuses);

  const totalQuotesPromise = supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const totalBookingsPromise = supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const recentShipmentsPromise = supabase
    .from("orders")
    .select(
      `
      id,
      booking_id,
      tracking_number,
      service_type,
      transport_mode,
      status,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      estimated_delivery_date,
      label_url,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const recentQuotesPromise = supabase
    .from("quotes")
    .select(
      `
      id,
      service_type,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      total,
      currency,
      status,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const recentBookingsPromise = supabase
    .from("bookings")
    .select(
      `
      id,
      service_type,
      transport_mode,
      status,
      payment_status,
      amount_due,
      amount_paid,
      currency,
      stripe_checkout_session_id,
      pickup_date,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const [
    profileResult,
    totalShipmentsResult,
    activeShipmentsResult,
    totalQuotesResult,
    totalBookingsResult,
    recentShipmentsResult,
    recentQuotesResult,
    recentBookingsResult,
  ] = await Promise.all([
    profilePromise,
    totalShipmentsPromise,
    activeShipmentsPromise,
    totalQuotesPromise,
    totalBookingsPromise,
    recentShipmentsPromise,
    recentQuotesPromise,
    recentBookingsPromise,
  ]);

  return {
    profile: profileResult.data
      ? mapProfile(profileResult.data as ProfileRow)
      : fallbackProfile(user),
    stats: {
      totalShipments: totalShipmentsResult.count ?? 0,
      activeShipments: activeShipmentsResult.count ?? 0,
      totalQuotes: totalQuotesResult.count ?? 0,
      totalBookings: totalBookingsResult.count ?? 0,
    },
    recentShipments: ((recentShipmentsResult.data ?? []) as ShipmentRow[]).map(
      mapShipment,
    ),
    recentQuotes: ((recentQuotesResult.data ?? []) as QuoteRow[]).map(mapQuote),
    recentBookings: ((recentBookingsResult.data ?? []) as BookingRow[]).map(
      mapBooking,
    ),
  };
}

export async function getDashboardShipments(): Promise<ShipmentTableItem[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("orders")
    .select(
      `
      id,
      booking_id,
      tracking_number,
      service_type,
      status,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      estimated_delivery_date,
      label_url,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []) as ShipmentRow[]).map(mapShipment);
}

export async function getDashboardQuotes(): Promise<QuoteTableItem[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("quotes")
    .select(
      `
      id,
      service_type,
      origin_city,
      origin_country,
      destination_city,
      destination_country,
      total,
      currency,
      status,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []) as QuoteRow[]).map(mapQuote);
}
