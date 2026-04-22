import { TrackingEventForm } from "@/components/admin/tracking-event-form";
import { TrackingStatusBadge } from "@/components/tracking";
import type { AdminShipmentDetail, AdminTrackingEventRow } from "@/types/admin";
import { getShipmentStatusMeta } from "@/types/shipment";

export type ShipmentTimelineCardProps = {
  shipment: AdminShipmentDetail;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function TimelineItem({
  event,
  mode,
}: {
  event: AdminTrackingEventRow;
  mode: string;
}) {
  const statusMeta = getShipmentStatusMeta(event.status, { mode });

  return (
    <li className="relative pb-6 pl-7 last:pb-0">
      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#FF6B2B]" />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[#0B1C3A]">{statusMeta.label}</p>
            <TrackingStatusBadge status={event.status} mode={mode} />
          </div>
          {event.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {event.description}
            </p>
          ) : null}
          {event.locationName ? (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {event.locationName}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-500">
          {formatDateTime(event.eventTime)}
        </p>
      </div>
    </li>
  );
}

export function ShipmentTimelineCard({ shipment }: ShipmentTimelineCardProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Tracking timeline
        </h2>
        {shipment.trackingEvents.length > 0 ? (
          <ol className="mt-5 border-l border-slate-200">
            {shipment.trackingEvents.map((event) => (
              <TimelineItem
                key={event.id}
                event={event}
                mode={shipment.transportMode}
              />
            ))}
          </ol>
        ) : (
          <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            No tracking events have been added to this shipment yet.
          </p>
        )}
      </div>

      <TrackingEventForm
        shipment={shipment}
        mode="tracking-event"
        title="Add tracking event"
        description="Add a customer-visible movement event and sync the shipment to the selected resulting status."
      />
    </section>
  );
}
