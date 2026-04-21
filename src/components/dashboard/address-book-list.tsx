import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { SavedAddressRecord } from "@/types/address";

export type AddressBookListProps = {
  addresses: SavedAddressRecord[];
};

export function AddressBookList({ addresses }: AddressBookListProps) {
  if (addresses.length === 0) {
    return (
      <DashboardEmptyState
        title="No saved addresses yet"
        description="Add a pickup or delivery address to make future booking requests easier."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {addresses.map((address) => (
        <article
          key={address.id}
          className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#0B1C3A]">
                {address.label ?? address.contactName}
              </h3>
              <p className="mt-1 text-sm capitalize text-slate-500">
                {address.addressType}
              </p>
            </div>
            <span className="rounded-full bg-[#FF6B2B]/10 px-3 py-1 text-xs font-semibold text-[#FF6B2B]">
              Saved
            </span>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <p className="flex gap-3">
              <MapPin
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-[#FF6B2B]"
              />
              <span>
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}
                {address.stateRegion ? `, ${address.stateRegion}` : ""}{" "}
                {address.postalCode}
                <br />
                {address.country}
              </span>
            </p>
            {address.companyName ? (
              <p className="flex gap-3">
                <Building2
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-[#FF6B2B]"
                />
                <span>{address.companyName}</span>
              </p>
            ) : null}
            {address.phone ? (
              <p className="flex gap-3">
                <Phone
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-[#FF6B2B]"
                />
                <span>{address.phone}</span>
              </p>
            ) : null}
            {address.email ? (
              <p className="flex gap-3">
                <Mail
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-[#FF6B2B]"
                />
                <span>{address.email}</span>
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
