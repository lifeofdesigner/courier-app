import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  PackagePlus,
  PackageSearch,
  ShieldCheck,
  Truck,
  UsersRound,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  AdminTabBar,
  BookingsTable,
  QuotesTable,
  ShipmentsTable,
  TrackingEventsTable,
} from "@/components/admin";
import { getAdminOverviewData } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const actionClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

const primaryActionClassName =
  "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20";

export default async function AdminDashboardPage() {
  const data = await getAdminOverviewData();

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
        title="Operations Dashboard"
        description="A command-center view of shipment activity, customer demand, tracking updates, and administrative access."
        status={{ label: "Admin only", tone: "accent" }}
        primaryAction={{ label: "Create Shipment", href: "/admin/shipments/create" }}
        secondaryAction={{ label: "Manage Shipments", href: "/admin/shipments" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total shipments"
          value={data.stats.totalShipments}
          helperText="All courier orders in the platform."
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Active shipments"
          value={data.stats.activeShipments}
          helperText="Shipments still moving through operations."
          tone="info"
          icon={<Truck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Quotes"
          value={data.stats.totalQuotes}
          helperText="Saved quote calculations."
          tone="warning"
          icon={<FileText aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Bookings"
          value={data.stats.totalBookings}
          helperText="Pickup requests submitted."
          tone="success"
          icon={<CalendarCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Users"
          value={data.stats.totalUsers}
          helperText="Customer and staff profiles."
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Admins"
          value={data.stats.totalAdmins}
          helperText="Profiles with admin access."
          tone="danger"
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="quick-actions"
        title="Quick admin actions"
        description="Common operational jumps for staff working the queue."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/shipments/create" className={primaryActionClassName}>
            <PackagePlus aria-hidden="true" className="h-4 w-4" />
            Create shipment
          </Link>
          <Link href="/admin/tracking-events" className={actionClassName}>
            Add tracking event
          </Link>
          <Link href="/admin/cms" className={actionClassName}>
            Edit CMS
          </Link>
          <Link href="/admin/users" className={actionClassName}>
            Manage customers
          </Link>
        </div>
      </AdminSectionCard>

      <AdminTabBar
        ariaLabel="Operational modules"
        items={[
          { label: "Shipments", href: "/admin/shipments", count: data.stats.totalShipments },
          { label: "Bookings", href: "/admin/bookings", count: data.stats.totalBookings },
          { label: "Quotes", href: "/admin/quotes", count: data.stats.totalQuotes },
          { label: "Customers", href: "/admin/users", count: data.stats.totalUsers },
        ]}
      />

      <AdminSectionCard
        id="recent-activity"
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
    </>
  );
}
