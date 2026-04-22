import type { Metadata } from "next";

import {
  AdminPageHeader,
  AdminSectionCard,
  TrackingEventForm,
  TrackingEventsTable,
} from "@/components/admin";
import { getAdminShipments, getAdminTrackingEvents } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Tracking Events",
};

export default async function ManageTrackingEventsPage() {
  const [shipments, events] = await Promise.all([
    getAdminShipments(100),
    getAdminTrackingEvents(100),
  ]);

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shipments", href: "/admin/shipments" },
          { label: "Tracking Events" },
        ]}
        title="Tracking Events"
        description="Review manual tracking history across shipments and add operational milestones when needed."
        status={{ label: "Timeline control", tone: "info" }}
        secondaryAction={{ label: "All Shipments", href: "/admin/shipments" }}
      />

      <TrackingEventForm
        mode="tracking-event"
        shipments={shipments}
        title="Add tracking event"
        description="Create a manual event and sync the selected shipment to the same status."
      />

      <AdminSectionCard
        title="Event history"
        description="Latest tracking milestones published by operations."
      >
        <TrackingEventsTable events={events} />
      </AdminSectionCard>
    </>
  );
}
