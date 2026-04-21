import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, FileText, PackageSearch, Truck } from "lucide-react";

import {
  DashboardSectionCard,
  DashboardShell,
  DashboardStatCard,
  RecentBookingList,
  RecentQuoteList,
  RecentShipmentList,
} from "@/components/dashboard";
import { getDashboardOverviewData } from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

export default async function CustomerDashboardPage() {
  const data = await getDashboardOverviewData();
  const displayName = data.profile?.fullName?.split(" ")[0] ?? "there";

  return (
    <DashboardShell
      profile={data.profile}
      title={`Welcome back, ${displayName}.`}
      description="Review your latest shipment activity, saved quotes, and pickup requests from one customer workspace."
      primaryAction={{ label: "Book a pickup", href: "/book" }}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Total Shipments"
          value={data.stats.totalShipments}
          description="All shipments linked to your account."
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
        />
        <DashboardStatCard
          label="Active Shipments"
          value={data.stats.activeShipments}
          description="Shipments still moving through delivery."
          icon={<Truck aria-hidden="true" className="h-5 w-5" />}
        />
        <DashboardStatCard
          label="Quotes Requested"
          value={data.stats.totalQuotes}
          description="Calculated quotes saved for planning."
          icon={<FileText aria-hidden="true" className="h-5 w-5" />}
        />
        <DashboardStatCard
          label="Pickup Requests"
          value={data.stats.totalBookings}
          description="Submitted pickup booking requests."
          icon={<CalendarCheck aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <DashboardSectionCard
        title="Quick actions"
        description="Start the next customer task without leaving the workspace."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/track"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Track a shipment
          </Link>
          <Link
            href="/quote"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
          >
            Request a quote
          </Link>
          <Link
            href="/book"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Book a pickup
          </Link>
        </div>
      </DashboardSectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSectionCard
          title="Recent shipments"
          description="The newest shipment records connected to your account."
          action={{ label: "View shipments", href: "/dashboard/shipments" }}
        >
          <RecentShipmentList shipments={data.recentShipments} />
        </DashboardSectionCard>

        <DashboardSectionCard
          title="Recent quotes"
          description="Saved quote calculations for recent delivery lanes."
          action={{ label: "View quotes", href: "/dashboard/quotes" }}
        >
          <RecentQuoteList quotes={data.recentQuotes} />
        </DashboardSectionCard>
      </div>

      <DashboardSectionCard
        title="Recent pickup requests"
        description="Submitted pickup requests and their current request status."
      >
        <RecentBookingList bookings={data.recentBookings} />
      </DashboardSectionCard>
    </DashboardShell>
  );
}
