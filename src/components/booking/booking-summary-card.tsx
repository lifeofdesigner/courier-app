import {
  formatModeAwareServiceType,
  getModeAwareServiceMeta,
  getTransportModeMeta,
  getTransportModePublicCopy,
  type ShipmentServiceTypeInput,
  type TransportMode,
} from "@/types/shipment";

export type BookingSummaryCardProps = {
  transportMode?: TransportMode;
  serviceType?: ShipmentServiceTypeInput;
};

export function BookingSummaryCard({
  transportMode = "road",
  serviceType = "standard_road",
}: BookingSummaryCardProps) {
  const modeMeta = getTransportModeMeta(transportMode);
  const modeCopy = getTransportModePublicCopy(transportMode);
  const serviceMeta = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  });

  return (
    <aside className="rounded-[24px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
        Booking summary
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight">
        {modeCopy.bookingTitle}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-200">
        {modeCopy.bookingSummaryLead}
      </p>
      <dl className="mt-6 grid gap-4 text-sm text-slate-200">
        <div>
          <dt className="font-semibold text-white">Transport mode</dt>
          <dd className="mt-1">{modeMeta.label}</dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Service type</dt>
          <dd className="mt-1">
            {formatModeAwareServiceType(serviceMeta.code, transportMode)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Payment</dt>
          <dd className="mt-1">
            Starts as unpaid until secure Checkout is completed.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Operations</dt>
          <dd className="mt-1">
            The booking moves to shipment and label creation after payment.
          </dd>
        </div>
      </dl>
    </aside>
  );
}
