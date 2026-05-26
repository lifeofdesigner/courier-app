import { CheckCircle2 } from "lucide-react";

import { TrackingStatusBadge } from "@/components/tracking/tracking-status-badge";
import {
  getShipmentStatusMeta,
  type TrackingEventItem,
  type TransportMode,
} from "@/types/shipment";

export type TrackingTimelineProps = {
  events: TrackingEventItem[];
  transportMode: TransportMode;
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

export function TrackingTimeline({
  events,
  transportMode,
}: TrackingTimelineProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50/60 p-6">
      <h2 className="text-xl font-bold tracking-tight text-navy">
        Tracking timeline
      </h2>
      <div className="mt-6 space-y-5">
        {events.length > 0 ? (
          events.map((event) => {
            const statusMeta = getShipmentStatusMeta(event.status, {
              mode: transportMode,
            });

            return (
              <div key={event.id} className="flex gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-1 ring-slate-200">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-navy">
                        {statusMeta.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatDateTime(event.eventTime)}
                      </p>
                    </div>
                    <TrackingStatusBadge
                      status={event.status}
                      mode={transportMode}
                    />
                  </div>
                  {event.description ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {event.description}
                    </p>
                  ) : null}
                  {event.locationName ? (
                    <p className="mt-2 text-sm font-semibold text-navy">
                      {event.locationName}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm leading-7 text-slate-600">
            No tracking events have been published for this shipment yet.
          </p>
        )}
      </div>
    </div>
  );
}
