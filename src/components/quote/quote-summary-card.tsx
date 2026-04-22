import Link from "next/link";

import type { QuoteBreakdown, QuoteRecord } from "@/types/quote";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
  getTransportModePublicCopy,
} from "@/types/shipment";

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
  const transportMode = getTransportModeMeta(quote.transportMode);
  const modeCopy = getTransportModePublicCopy(quote.transportMode);
  const rows = [
    ["Subtotal", formatMoney(breakdown.subtotal, breakdown.currency)],
    ["Fuel surcharge", formatMoney(breakdown.fuelSurcharge, breakdown.currency)],
    [
      "Remote area surcharge",
      formatMoney(breakdown.remoteAreaSurcharge, breakdown.currency),
    ],
  ] as const;
  const bookHref = `/book?quoteId=${quote.id}&transportMode=${quote.transportMode}&serviceType=${quote.serviceType}`;

  return (
    <div className="rounded-[24px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
        {modeCopy.quoteTitle}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight">
        {formatMoney(breakdown.total, breakdown.currency)}
      </p>
      <div className="mt-6 grid gap-4 text-sm text-slate-200">
        <div>
          <p className="font-semibold text-white">Transport mode</p>
          <p className="mt-1">{transportMode.label}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Service</p>
          <p className="mt-1">
            {formatModeAwareServiceType(
              quote.serviceType,
              quote.transportMode,
            )}
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Origin</p>
          <p className="mt-1">
            {quote.originCity}, {quote.originCountry}
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Destination</p>
          <p className="mt-1">
            {quote.destinationCity}, {quote.destinationCountry}
          </p>
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
      <dl className="mt-6 divide-y divide-white/10 border-t border-white/10 pt-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-slate-200">{label}</dt>
            <dd className="text-right font-semibold text-white">{value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-3 text-sm">
          <dt className="font-semibold text-white">Total</dt>
          <dd className="text-right font-bold text-white">
            {formatMoney(breakdown.total, breakdown.currency)}
          </dd>
        </div>
      </dl>
      <Link
        href={bookHref}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
      >
        Book this {transportMode.label.toLowerCase()} service
      </Link>
    </div>
  );
}
