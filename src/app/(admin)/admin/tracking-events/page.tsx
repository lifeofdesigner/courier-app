import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Manage Tracking Events",
};

export default function ManageTrackingEventsPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin tracking"
      title="Manage tracking event history."
      description="This route is prepared for recording shipment milestones, locations, exceptions, and delivery confirmations."
      highlights={[
        "Tracking events route scaffolded",
        "Ready for event timeline management",
        "Prepared for shipment status synchronization",
      ]}
      note="Event creation and shipment status calculations will be implemented after the shipment schema and Supabase client are introduced."
    />
  );
}
