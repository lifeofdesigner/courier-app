import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Manage Shipments",
};

export default function ManageShipmentsPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin shipments"
      title="Manage shipment records."
      description="This route will support creating, reviewing, and updating shipment records once the operational data model is connected."
      highlights={[
        "Admin shipment route scaffolded",
        "Ready for table, filters, and detail drawers",
        "Prepared for tracking event relationships",
      ]}
      note="The layout is intentionally simple for Phase 1. Shipment creation, status updates, and database persistence are reserved for the Supabase phase."
    />
  );
}
