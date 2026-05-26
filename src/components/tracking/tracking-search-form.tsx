export type TrackingSearchFormProps = {
  defaultValue?: string;
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export function TrackingSearchForm({
  defaultValue = "",
}: TrackingSearchFormProps) {
  return (
    <form action="/track" className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div className="space-y-2">
        <label
          htmlFor="tracking"
          className="block text-sm font-semibold text-navy"
        >
          Tracking number
        </label>
        <input
          id="tracking"
          name="tracking"
          defaultValue={defaultValue}
          required
          className={inputClassName}
          placeholder="Example: QVX123456789"
        />
      </div>
      <div className="md:self-end">
        <button type="submit" className={`${primaryButtonClassName} w-full md:w-auto`}>
          Track shipment
        </button>
      </div>
    </form>
  );
}
