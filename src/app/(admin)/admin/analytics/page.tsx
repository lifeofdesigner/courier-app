import type { Metadata } from "next";
import { BarChart3, CalendarDays, PackageSearch, UsersRound } from "lucide-react";

import { AdminSectionCard, AdminShell, AdminStatCard } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminAnalyticsData } from "@/lib/queries/admin-analytics";

export const metadata: Metadata = {
  title: "Admin Analytics",
};

function CountList({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="text-sm leading-7 text-slate-600">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([label, count]) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
        >
          <span className="font-semibold capitalize text-[#0B1C3A]">
            {label.replaceAll("_", " ")}
          </span>
          <span className="font-bold text-[#FF6B2B]">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [admin, analytics] = await Promise.all([
    requireAdmin(),
    getAdminAnalyticsData(),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Analytics"
      description="Lightweight operational counts from existing shipments, quotes, bookings, and user records."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <AdminStatCard
          label="New users, 7 days"
          value={analytics.usersLast7Days}
          description="Recent user profiles created this week."
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="New users, 30 days"
          value={analytics.usersLast30Days}
          description="Recent user profiles created this month."
          icon={<CalendarDays aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminSectionCard
          title="Shipments by status"
          description="Grouped from order status values."
        >
          <PackageSearch
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#FF6B2B]"
          />
          <CountList counts={analytics.shipmentsByStatus} />
        </AdminSectionCard>
        <AdminSectionCard
          title="Quotes by service"
          description="Grouped from quote service types."
        >
          <BarChart3
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#FF6B2B]"
          />
          <CountList counts={analytics.quotesByServiceType} />
        </AdminSectionCard>
        <AdminSectionCard
          title="Bookings by status"
          description="Grouped from pickup request statuses."
        >
          <CalendarDays
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#FF6B2B]"
          />
          <CountList counts={analytics.bookingsByStatus} />
        </AdminSectionCard>
      </div>
    </AdminShell>
  );
}
