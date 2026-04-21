import Link from "next/link";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { QuoteTableItem } from "@/types/dashboard";

export type RecentQuoteListProps = {
  quotes: QuoteTableItem[];
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function RecentQuoteList({ quotes }: RecentQuoteListProps) {
  if (quotes.length === 0) {
    return (
      <DashboardEmptyState
        title="No quotes requested yet"
        description="Calculate a quote to compare service options and save the result to your account."
        action={{ label: "Request a quote", href: "/quote" }}
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-[#0B1C3A]">
              {quote.originCity}, {quote.originCountry} to{" "}
              {quote.destinationCity}, {quote.destinationCountry}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {quote.serviceType} - {quote.status} -{" "}
              {formatDate(quote.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#0B1C3A]">
              {formatMoney(quote.total, quote.currency)}
            </span>
            <Link
              href={`/book?quoteId=${quote.id}`}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50"
            >
              Book
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
