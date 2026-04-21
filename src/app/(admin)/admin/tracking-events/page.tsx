import type { Metadata } from "next";

import {
  AdminShell,
  TrackingEventForm,
  TrackingEventsTable,
} from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminShipments, getAdminTrackingEvents } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Tracking Events",
};

export default async function ManageTrackingEventsPage() {
  const [admin, shipments, events] = await Promise.all([
    requireAdmin(),
    getAdminShipments(100),
    getAdminTrackingEvents(100),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Tracking events"
      description="Add shipment milestones and review the operational tracking history customers see on public tracking pages."
    >
      <TrackingEventForm
        mode="tracking-event"
        shipments={shipments}
        title="Add tracking event"
        description="Create a manual event and sync the selected shipment to the same status."
      />
      <TrackingEventsTable events={events} />
    </AdminShell>
  );
}
