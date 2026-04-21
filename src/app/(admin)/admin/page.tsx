import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin"
      title="Operational dashboard for courier teams."
      description="The admin dashboard route is ready for shipment volume, booking queues, quote activity, and customer support oversight."
      highlights={[
        "Admin dashboard route scaffolded",
        "Ready for operational summary cards",
        "Prepared for role-based Supabase access",
      ]}
      note="This screen establishes the admin workspace foundation. Metrics, permissions, and operational queues will be connected after the database model is introduced."
    />
  );
}
