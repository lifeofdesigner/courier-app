import type { Metadata } from "next";

import { AdminShell, ShipmentsTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminShipments } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Shipments",
};

export default async function ManageShipmentsPage() {
  const [admin, shipments] = await Promise.all([
    requireAdmin(),
    getAdminShipments(250),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Shipment operations"
      description="Search, filter, inspect, and manage courier shipments with linked customer ownership from one operational queue."
      primaryAction={{ label: "Create shipment", href: "/admin/shipments/create" }}
    >
      <div className="space-y-6">
        <ShipmentsTable shipments={shipments} />
      </div>
    </AdminShell>
  );
}
