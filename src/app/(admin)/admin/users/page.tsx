import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default function ManageUsersPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin users"
      title="Manage customer and staff access."
      description="This route will support user review, roles, customer accounts, and support access once authentication is connected."
      highlights={[
        "Admin users route scaffolded",
        "Ready for customer and staff lists",
        "Prepared for role-based access controls",
      ]}
      note="User management depends on the future Supabase Auth setup, so Phase 1 keeps this as a styled route foundation."
    />
  );
}
