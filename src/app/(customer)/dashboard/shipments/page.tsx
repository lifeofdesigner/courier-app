import type { Metadata } from "next";

import { DashboardShell, ShipmentTable } from "@/components/dashboard";
import {
  getCurrentDashboardContext,
  getDashboardShipments,
} from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "My Shipments",
};

export default async function MyShipmentsPage() {
  const [context, shipments] = await Promise.all([
    getCurrentDashboardContext(),
    getDashboardShipments(),
  ]);

  return (
    <DashboardShell
      profile={context.profile}
      title="My shipments"
      description="Search and review shipment routes, statuses, labels, estimated delivery dates, and tracking links."
      primaryAction={{ label: "Track a shipment", href: "/track" }}
    >
      <ShipmentTable shipments={shipments} />
    </DashboardShell>
  );
}
