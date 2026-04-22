"use client";

import type { CustomerSearchResult } from "@/types/admin";

export type CustomerSearchResultsProps = {
  results: CustomerSearchResult[];
  query: string;
  isPending: boolean;
  message: string;
  onSelect: (customer: CustomerSearchResult) => void;
};

function customerDisplayName(customer: CustomerSearchResult) {
  return customer.fullName ?? customer.email ?? `Customer ${customer.id.slice(0, 8)}`;
}

export function CustomerSearchResults({
  results,
  query,
  isPending,
  message,
  onSelect,
}: CustomerSearchResultsProps) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        Type at least 2 characters to search by name, email, or phone.
      </p>
    );
  }

  if (isPending) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        Searching customers...
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="text-sm font-semibold">No customer selected</p>
        <p className="mt-1 text-sm leading-6">
          {message || "No matching customer was found. You can continue without linking a customer."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
      {results.map((customer) => (
        <button
          key={customer.id}
          type="button"
          onClick={() => onSelect(customer)}
          className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50"
        >
          <span>
            <span className="block text-sm font-semibold text-[#0B1C3A]">
              {customerDisplayName(customer)}
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              {[customer.email, customer.phone].filter(Boolean).join(" - ") ||
                "No email or phone on profile"}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
            {customer.role}
          </span>
        </button>
      ))}
    </div>
  );
}
