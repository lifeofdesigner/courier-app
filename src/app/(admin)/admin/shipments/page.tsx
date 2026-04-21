import type { Metadata } from "next";

import { AdminShell, ShipmentsTable, TrackingEventForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminShipments } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Shipments",
};

export default async function ManageShipmentsPage() {
  const [admin, shipments] = await Promise.all([
    requireAdmin(),
    getAdminShipments(100),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Manage shipments"
      description="Review shipment records, label links, filter operational queues, and create tracking events while updating shipment status."
    >
      <TrackingEventForm
        mode="shipment-status"
        shipments={shipments}
        title="Update shipment status"
        description="Changing status here also creates a customer-facing tracking event for the selected shipment."
      />
      <ShipmentsTable shipments={shipments} />
    </AdminShell>
  );
}
