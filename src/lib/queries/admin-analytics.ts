import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type { AdminAnalyticsData } from "@/types/admin";

function countByKey(rows: { [key: string]: unknown }[], key: string) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const value = String(row[key] ?? "unknown");
    counts[value] = (counts[value] ?? 0) + 1;

    return counts;
  }, {});
}

function isAfter(dateValue: string, daysAgo: number) {
  const createdAt = new Date(dateValue).getTime();
  const threshold = Date.now() - daysAgo * 24 * 60 * 60 * 1000;

  return createdAt >= threshold;
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  const { supabase } = await assertAdminAction();
  const [shipmentsResult, quotesResult, bookingsResult, usersResult] =
    await Promise.all([
      supabase.from("orders").select("status"),
      supabase.from("quotes").select("service_type"),
      supabase.from("bookings").select("status"),
      supabase
        .from("users")
        .select("id, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

  const users = (usersResult.data ?? []) as { id: string; created_at: string }[];

  return {
    shipmentsByStatus: countByKey(
      (shipmentsResult.data ?? []) as { status: string }[],
      "status",
    ),
    quotesByServiceType: countByKey(
      (quotesResult.data ?? []) as { service_type: string }[],
      "service_type",
    ),
    bookingsByStatus: countByKey(
      (bookingsResult.data ?? []) as { status: string }[],
      "status",
    ),
    usersLast7Days: users.filter((user) => isAfter(user.created_at, 7)).length,
    usersLast30Days: users.filter((user) => isAfter(user.created_at, 30))
      .length,
  };
}
