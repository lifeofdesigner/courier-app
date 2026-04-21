import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

export default function CustomerDashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Customer dashboard"
      title="A clear home base for customer shipping activity."
      description="Customers will be able to review shipments, quote requests, pickup bookings, and account details from this dashboard."
      highlights={[
        "Customer dashboard route scaffolded",
        "Ready for shipment and quote summaries",
        "Prepared for Supabase Auth session checks",
      ]}
    />
  );
}
