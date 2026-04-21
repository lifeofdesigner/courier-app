"use client";

import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminQuoteRow } from "@/types/admin";

export type QuotesTableProps = {
  quotes: AdminQuoteRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

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

export function QuotesTable({ quotes }: QuotesTableProps) {
  const [query, setQuery] = useState("");

  const filteredQuotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return quotes.filter((quote) =>
      [
        quote.serviceType,
        quote.status,
        quote.fullName ?? "",
        quote.email ?? "",
        quote.originCity,
        quote.originCountry,
        quote.destinationCity,
        quote.destinationCountry,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, quotes]);

  if (quotes.length === 0) {
    return (
      <AdminEmptyState
        title="No quotes found"
        description="Customer quote calculations will appear here for operational follow-up."
      />
    );
  }

  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={inputClassName}
        placeholder="Search quote lane, customer, service, or status"
      />
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Lane</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Total</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="font-semibold text-[#0B1C3A]">
                      {quote.fullName ?? "Guest quote"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {quote.email ?? quote.userId ?? "No customer email"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {quote.originCity}, {quote.originCountry} to{" "}
                    {quote.destinationCity}, {quote.destinationCountry}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {quote.serviceType}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#0B1C3A]">
                    {formatMoney(quote.total, quote.currency)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {formatDate(quote.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
