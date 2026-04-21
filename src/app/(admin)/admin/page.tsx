import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  PackageSearch,
  ShieldCheck,
  Truck,
  UsersRound,
} from "lucide-react";

import {
  AdminSectionCard,
  AdminShell,
  AdminStatCard,
  BookingsTable,
  QuotesTable,
  ShipmentsTable,
  TrackingEventsTable,
} from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminOverviewData } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const [admin, data] = await Promise.all([
    requireAdmin(),
    getAdminOverviewData(),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Operational dashboard"
      description="Scan shipment activity, customer demand, tracking updates, and platform access from one admin workspace."
      primaryAction={{ label: "Manage shipments", href: "/admin/shipments" }}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Total shipments"
          value={data.stats.totalShipments}
          description="All courier orders in the platform."
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Active shipments"
          value={data.stats.activeShipments}
          description="Shipments not yet delivered or excepted."
          icon={<Truck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Total quotes"
          value={data.stats.totalQuotes}
          description="Saved quote calculations."
          icon={<FileText aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Total bookings"
          value={data.stats.totalBookings}
          description="Pickup requests submitted."
          icon={<CalendarCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Total users"
          value={data.stats.totalUsers}
          description="Customer and staff profiles."
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Total admins"
          value={data.stats.totalAdmins}
          description="Profiles with admin access."
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        title="Quick admin actions"
        description="Jump into the common operational tasks for this phase."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/shipments"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
          >
            Update shipment
          </Link>
          <Link
            href="/admin/tracking-events"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Add tracking event
          </Link>
          <Link
            href="/admin/cms"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Edit homepage content
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Manage users
          </Link>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Recent shipments"
        description="Latest courier orders by creation date."
        action={{ label: "All shipments", href: "/admin/shipments" }}
      >
        <ShipmentsTable shipments={data.shipments} />
      </AdminSectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard
          title="Recent bookings"
          description="Newest pickup requests."
          action={{ label: "All bookings", href: "/admin/bookings" }}
        >
          <BookingsTable bookings={data.bookings} />
        </AdminSectionCard>
        <AdminSectionCard
          title="Recent quotes"
          description="Newest quote calculations."
          action={{ label: "All quotes", href: "/admin/quotes" }}
        >
          <QuotesTable quotes={data.quotes} />
        </AdminSectionCard>
      </div>

      <AdminSectionCard
        title="Recent tracking events"
        description="Latest published shipment milestones."
        action={{ label: "All tracking events", href: "/admin/tracking-events" }}
      >
        <TrackingEventsTable events={data.trackingEvents} />
      </AdminSectionCard>
    </AdminShell>
  );
}
