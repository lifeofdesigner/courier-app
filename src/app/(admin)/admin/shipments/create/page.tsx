import type { Metadata } from "next";

import { AdminShell, CreateShipmentForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Create Shipment",
};

export default async function CreateShipmentPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell
      profile={admin.profile}
      title="Create shipment"
      description="Search and link an existing customer, or create an unassigned manual shipment with mode-aware service and tracking options."
      primaryAction={{ label: "All shipments", href: "/admin/shipments" }}
    >
      <CreateShipmentForm />
    </AdminShell>
  );
}
