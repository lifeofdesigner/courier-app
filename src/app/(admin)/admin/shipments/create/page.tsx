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
      description="Manually create a shipment, generate a tracking number, link booking records, and start the tracking timeline."
      primaryAction={{ label: "All shipments", href: "/admin/shipments" }}
    >
      <CreateShipmentForm />
    </AdminShell>
  );
}
