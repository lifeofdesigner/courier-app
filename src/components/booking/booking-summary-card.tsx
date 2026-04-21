export function BookingSummaryCard() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
        Pickup request
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1C3A]">
        Submit the details operations needs.
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        This launch flow stores the pickup details, calculates the courier
        amount due, and moves the booking into secure Stripe payment before a
        shipment label is created.
      </p>
      <div className="mt-6 grid gap-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-4">
          Starts as <span className="font-semibold text-[#0B1C3A]">unpaid</span>{" "}
          until checkout is completed
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          Supports authenticated and guest bookings with webhook fulfillment
        </div>
      </div>
    </div>
  );
}
