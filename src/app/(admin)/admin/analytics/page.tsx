import type { Metadata } from "next";
import { BarChart3, CalendarDays, PackageSearch, UsersRound } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
} from "@/components/admin";
import { getAdminAnalyticsData } from "@/lib/queries/admin-analytics";
import { getShipmentStatusMeta } from "@/types/shipment";

export const metadata: Metadata = {
  title: "Admin Analytics",
};

function CountList({
  counts,
  formatLabel = (label) => label.replaceAll("_", " "),
}: {
  counts: Record<string, number>;
  formatLabel?: (label: string) => string;
}) {
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
          <span className="font-semibold capitalize text-[#2b1d16]">
            {formatLabel(label)}
          </span>
          <span className="font-bold text-[#b0825f]">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalyticsData();
  const shipmentStatusCount = Object.keys(analytics.shipmentsByStatus).length;
  const quoteServiceCount = Object.keys(analytics.quotesByServiceType).length;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics" },
        ]}
        title="Analytics"
        description="Lightweight operational counts from existing shipments, quotes, bookings, and user records."
        status={{ label: "Operational counts", tone: "info" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="New users, 7 days"
          value={analytics.usersLast7Days}
          helperText="Recent user profiles created this week."
          tone="success"
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="New users, 30 days"
          value={analytics.usersLast30Days}
          helperText="Recent user profiles created this month."
          tone="info"
          icon={<CalendarDays aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Shipment statuses"
          value={shipmentStatusCount}
          helperText="Distinct shipment states represented."
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Quote services"
          value={quoteServiceCount}
          helperText="Distinct quote service types."
          tone="warning"
          icon={<BarChart3 aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminSectionCard
          id="shipment-mix"
          title="Shipments by status"
          description="Grouped from order status values."
        >
          <PackageSearch
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#b0825f]"
          />
          <CountList
            counts={analytics.shipmentsByStatus}
            formatLabel={(label) => getShipmentStatusMeta(label).label}
          />
        </AdminSectionCard>
        <AdminSectionCard
          title="Quotes by service"
          description="Grouped from quote service types."
        >
          <BarChart3
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#b0825f]"
          />
          <CountList counts={analytics.quotesByServiceType} />
        </AdminSectionCard>
        <AdminSectionCard
          id="booking-mix"
          title="Bookings by status"
          description="Grouped from pickup request statuses."
        >
          <CalendarDays
            aria-hidden="true"
            className="mb-4 h-5 w-5 text-[#b0825f]"
          />
          <CountList counts={analytics.bookingsByStatus} />
        </AdminSectionCard>
      </div>
    </>
  );
}
