import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminShell, ShipmentDetailShell } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminShipmentDetail } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Shipment Detail",
};

type ShipmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShipmentDetailPage({
  params,
}: ShipmentDetailPageProps) {
  const { id } = await params;
  const [admin, shipment] = await Promise.all([
    requireAdmin(),
    getAdminShipmentDetail(id),
  ]);

  if (!shipment) {
    notFound();
  }

  return (
    <AdminShell
      profile={admin.profile}
      title={`Shipment ${shipment.trackingNumber}`}
      description="Inspect linked customer ownership, sender, recipient, addresses, payment, package details, label readiness, and the full customer-visible tracking timeline."
      primaryAction={{ label: "All shipments", href: "/admin/shipments" }}
    >
      <ShipmentDetailShell shipment={shipment} />
    </AdminShell>
  );
}
