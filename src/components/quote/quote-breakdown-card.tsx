import type { QuoteBreakdown } from "@/types/quote";

export type QuoteBreakdownCardProps = {
  breakdown: QuoteBreakdown;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

export function QuoteBreakdownCard({ breakdown }: QuoteBreakdownCardProps) {
  const rows = [
    ["Matched rule", breakdown.matchedRuleName],
    ["Subtotal", formatMoney(breakdown.subtotal, breakdown.currency)],
    ["Fuel surcharge", formatMoney(breakdown.fuelSurcharge, breakdown.currency)],
    [
      "Remote area surcharge",
      formatMoney(breakdown.remoteAreaSurcharge, breakdown.currency),
    ],
  ] as const;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-navy">
        Price breakdown
      </h2>
      <dl className="mt-5 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-slate-600">{label}</dt>
            <dd className="text-right font-semibold text-navy">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
