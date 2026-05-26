import Link from "next/link";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { TrackingStatusBadge } from "@/components/tracking";
import type { ShipmentTableItem } from "@/types/dashboard";

export type RecentShipmentListProps = {
  shipments: ShipmentTableItem[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "No ETA yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function RecentShipmentList({ shipments }: RecentShipmentListProps) {
  if (shipments.length === 0) {
    return (
      <DashboardEmptyState
        title="No shipments yet"
        description="When shipments are connected to your account, the newest updates will appear here."
        action={{ label: "Book a pickup", href: "/book" }}
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Link
              href={`/track?tracking=${shipment.trackingNumber}`}
              className="font-semibold text-navy transition hover:text-primary"
            >
              {shipment.trackingNumber}
            </Link>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {shipment.originCity}, {shipment.originCountry} to{" "}
              {shipment.destinationCity}, {shipment.destinationCountry}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              ETA {formatDate(shipment.estimatedDeliveryDate)}
            </p>
          </div>
          <TrackingStatusBadge
            status={shipment.status}
            mode={shipment.transportMode}
          />
        </div>
      ))}
    </div>
  );
}
