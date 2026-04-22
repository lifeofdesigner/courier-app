import type { AdminShipmentAddressBlock } from "@/types/admin";

export type ShipmentAddressCardProps = {
  title: string;
  personName: string | null;
  email: string | null;
  phone: string | null;
  address: AdminShipmentAddressBlock | null;
};

function addressLine(address: AdminShipmentAddressBlock) {
  return [
    address.line1,
    address.line2,
    [address.city, address.stateRegion, address.postalCode]
      .filter(Boolean)
      .join(", "),
    address.country,
  ].filter(Boolean);
}

export function ShipmentAddressCard({
  title,
  personName,
  email,
  phone,
  address,
}: ShipmentAddressCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#2b1d16]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-sm text-slate-700">
        <div>
          <p className="font-semibold text-[#2b1d16]">
            {personName ?? address?.contactName ?? "Not set"}
          </p>
          {address?.companyName ? (
            <p className="mt-1 text-slate-500">{address.companyName}</p>
          ) : null}
          {email ?? address?.email ? (
            <p className="mt-1 text-slate-500">{email ?? address?.email}</p>
          ) : null}
          {phone ?? address?.phone ? (
            <p className="mt-1 text-slate-500">{phone ?? address?.phone}</p>
          ) : null}
        </div>

        {address ? (
          <div className="rounded-2xl bg-slate-50 p-4">
            {addressLine(address).map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
            Address details are not linked to this shipment.
          </p>
        )}
      </div>
    </section>
  );
}
