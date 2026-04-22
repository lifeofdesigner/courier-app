"use client";

import { useEffect, useState, useTransition } from "react";

import { searchShipmentCustomersAction } from "@/app/(admin)/admin/shipments/actions";
import { CustomerSearchResults } from "@/components/admin/customer-search-results";
import type { CustomerSearchResult } from "@/types/admin";

export type CustomerLookupFieldProps = {
  onCustomerChange?: (customer: CustomerSearchResult | null) => void;
  fieldError?: string[];
  initialSelectedCustomer?: CustomerSearchResult | null;
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

function customerDisplayName(customer: CustomerSearchResult) {
  return customer.fullName ?? customer.email ?? `Customer ${customer.id.slice(0, 8)}`;
}

export function CustomerLookupField({
  onCustomerChange,
  fieldError,
  initialSelectedCustomer = null,
}: CustomerLookupFieldProps) {
  const [query, setQuery] = useState(
    initialSelectedCustomer ? customerDisplayName(initialSelectedCustomer) : "",
  );
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<CustomerSearchResult[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSearchResult | null>(initialSelectedCustomer);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (
      selectedCustomer &&
      normalizedQuery === customerDisplayName(selectedCustomer)
    ) {
      return;
    }

    if (normalizedQuery.length < 2) {
      return;
    }

    let isActive = true;
    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const response = await searchShipmentCustomersAction(normalizedQuery);

        if (!isActive) {
          return;
        }

        setResults(response.results);
        setMessage(response.message);
      });
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [query, selectedCustomer]);

  function selectCustomer(customer: CustomerSearchResult) {
    setSelectedCustomer(customer);
    setQuery(customerDisplayName(customer));
    setResults([]);
    setMessage("");
    onCustomerChange?.(customer);
  }

  function clearSelection() {
    setSelectedCustomer(null);
    setQuery("");
    setResults([]);
    setMessage("");
    onCustomerChange?.(null);
  }

  return (
    <div className="space-y-4">
      <input
        type="hidden"
        name="selectedCustomerId"
        value={selectedCustomer?.id ?? ""}
      />
      <input
        type="hidden"
        name="selectedCustomerLabel"
        value={selectedCustomer ? customerDisplayName(selectedCustomer) : ""}
      />
      <input
        type="hidden"
        name="selectedCustomerEmail"
        value={selectedCustomer?.email ?? ""}
      />
      <input
        type="hidden"
        name="selectedCustomerPhone"
        value={selectedCustomer?.phone ?? ""}
      />

      <div className="space-y-2">
        <label
          htmlFor="customerLookup"
          className="block text-sm font-semibold text-[#2b1d16]"
        >
          Search existing customer
        </label>
        <input
          id="customerLookup"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;

            setQuery(nextQuery);

            if (selectedCustomer) {
              setSelectedCustomer(null);
              onCustomerChange?.(null);
            }

            if (nextQuery.trim().length < 2) {
              setResults([]);
              setMessage("");
            }
          }}
          placeholder="Search by full name, email, or phone"
          className={inputClassName}
        />
        {fieldError?.[0] ? (
          <p className="text-sm text-rose-600">{fieldError[0]}</p>
        ) : null}
      </div>

      {selectedCustomer ? (
        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Linked customer</p>
              <p className="mt-1 text-base font-bold">
                {customerDisplayName(selectedCustomer)}
              </p>
              <p className="mt-1 text-sm leading-6">
                {[selectedCustomer.email, selectedCustomer.phone]
                  .filter(Boolean)
                  .join(" - ") || "No email or phone on profile"}
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                ID {selectedCustomer.id.slice(0, 8)}
              </p>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className={secondaryButtonClassName}
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <>
          <CustomerSearchResults
            results={results}
            query={query}
            isPending={isPending}
            message={message}
            onSelect={selectCustomer}
          />
          <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-semibold">
              Continue without linking customer
            </p>
            <p className="mt-1 text-sm leading-6">
              Leave customer unselected to create a manual or unassigned shipment.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
