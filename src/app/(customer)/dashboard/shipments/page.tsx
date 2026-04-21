import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "My Shipments",
};

export default function MyShipmentsPage() {
  return (
    <PlaceholderPage
      eyebrow="My shipments"
      title="Shipment history and active deliveries."
      description="This customer route is reserved for active shipments, delivery status, tracking detail links, and proof-of-delivery records."
      highlights={[
        "Customer shipment list route scaffolded",
        "Ready for tracking status summaries",
        "Prepared for customer-owned Supabase records",
      ]}
    />
  );
}
