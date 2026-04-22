import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, PackageSearch, WalletCards } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  ShipmentsTable,
} from "@/components/admin";
import { getAdminShipments } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Shipments",
};

export default async function ManageShipmentsPage() {
  const shipments = await getAdminShipments(250);
  const deliveredCount = shipments.filter(
    (shipment) => shipment.status === "delivered",
  ).length;
  const attentionCount = shipments.filter((shipment) =>
    ["exception", "on_hold", "cancelled"].includes(shipment.status),
  ).length;
  const paymentAttentionCount = shipments.filter(
    (shipment) => shipment.paymentStatus !== "paid",
  ).length;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shipments" },
        ]}
        title="Shipment Operations"
        description="Search, filter, inspect, and manage courier shipments with linked customer ownership from one operational queue."
        status={{ label: "Live queue", tone: "info" }}
        primaryAction={{ label: "Create Shipment", href: "/admin/shipments/create" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total shipments"
          value={shipments.length}
          helperText="Orders loaded into this operations view."
          icon={<PackageSearch aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Delivered"
          value={deliveredCount}
          helperText="Shipments completed in the current dataset."
          tone="success"
          icon={<CheckCircle2 aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Needs attention"
          value={attentionCount}
          helperText="Exception, hold, or cancelled states."
          tone="danger"
          icon={<AlertTriangle aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Payment review"
          value={paymentAttentionCount}
          helperText="Shipments without a paid booking state."
          tone="warning"
          icon={<WalletCards aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        title="Shipment queue"
        description="Use the filters to narrow by tracking number, customer, route, mode, shipment status, or payment state."
      >
        <ShipmentsTable shipments={shipments} />
      </AdminSectionCard>
    </>
  );
}
