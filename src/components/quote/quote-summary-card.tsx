import type { QuoteBreakdown, QuoteRecord } from "@/types/quote";

export type QuoteSummaryCardProps = {
  quote: QuoteRecord;
  breakdown: QuoteBreakdown;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

export function QuoteSummaryCard({
  quote,
  breakdown,
}: QuoteSummaryCardProps) {
  return (
    <div className="rounded-[28px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
        Quote total
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight">
        {formatMoney(breakdown.total, breakdown.currency)}
      </p>
      <div className="mt-6 grid gap-4 text-sm text-slate-200">
        <div>
          <p className="font-semibold text-white">Service</p>
          <p className="mt-1">{quote.serviceType}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Zone</p>
          <p className="mt-1">{breakdown.zone}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Quote ID</p>
          <p className="mt-1 break-all">{quote.id}</p>
        </div>
      </div>
    </div>
  );
}
