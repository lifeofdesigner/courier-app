"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useActionState } from "react";

import { createShipmentAction } from "@/app/(admin)/admin/shipments/actions";
import type { AdminActionState } from "@/types/admin";
import { formatPaymentStatus, paymentStatuses } from "@/types/payment";
import { formatShipmentStatus, shipmentStatuses } from "@/types/shipment";

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#0B1C3A]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        step={type === "number" ? "0.01" : undefined}
        className={inputClassName}
      />
      <FieldError errors={errors} />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        {title}
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function AddressFields({
  prefix,
  errors,
}: {
  prefix: "pickup" | "delivery";
  errors?: Record<string, string[]>;
}) {
  const titlePrefix = prefix === "pickup" ? "Pickup" : "Delivery";

  return (
    <>
      <TextInput
        label="Contact name"
        name={`${prefix}.contactName`}
        errors={errors?.[`${prefix}.contactName`]}
      />
      <TextInput label="Company" name={`${prefix}.companyName`} />
      <TextInput label="Phone" name={`${prefix}.phone`} />
      <TextInput
        label="Email"
        name={`${prefix}.email`}
        type="email"
        errors={errors?.[`${prefix}.email`]}
      />
      <TextInput
        label={`${titlePrefix} address line 1`}
        name={`${prefix}.line1`}
        errors={errors?.[`${prefix}.line1`]}
      />
      <TextInput label="Address line 2" name={`${prefix}.line2`} />
      <TextInput
        label="City"
        name={`${prefix}.city`}
        errors={errors?.[`${prefix}.city`]}
      />
      <TextInput label="State / region" name={`${prefix}.stateRegion`} />
      <TextInput label="Postal code" name={`${prefix}.postalCode`} />
      <TextInput
        label="Country"
        name={`${prefix}.country`}
        errors={errors?.[`${prefix}.country`]}
      />
    </>
  );
}

export function CreateShipmentForm() {
  const [state, formAction, isPending] = useActionState(
    createShipmentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p>{state.message}</p>
          {state.success && state.createdShipmentId ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/admin/shipments/${state.createdShipmentId}`}
                className={secondaryButtonClassName}
              >
                Manage shipment
              </Link>
              {state.createdTrackingNumber ? (
                <Link
                  href={`/track?tracking=${state.createdTrackingNumber}`}
                  className={secondaryButtonClassName}
                >
                  Public tracking
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <FormSection title="Customer assignment">
        <TextInput
          label="Customer email"
          name="customerEmail"
          type="email"
          placeholder="customer@example.com"
          errors={state.fieldErrors?.customerEmail}
        />
        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-[#0B1C3A]">
          <input
            type="checkbox"
            name="unassignedCustomer"
            className="h-4 w-4 rounded border-slate-300 text-[#FF6B2B] focus:ring-[#FF6B2B]"
          />
          Create as unassigned shipment
        </label>
      </FormSection>

      <FormSection title="Sender and recipient">
        <TextInput
          label="Sender name"
          name="senderName"
          errors={state.fieldErrors?.senderName}
        />
        <TextInput
          label="Sender email"
          name="senderEmail"
          type="email"
          errors={state.fieldErrors?.senderEmail}
        />
        <TextInput label="Sender phone" name="senderPhone" />
        <TextInput
          label="Recipient name"
          name="recipientName"
          errors={state.fieldErrors?.recipientName}
        />
        <TextInput
          label="Recipient email"
          name="recipientEmail"
          type="email"
          errors={state.fieldErrors?.recipientEmail}
        />
        <TextInput label="Recipient phone" name="recipientPhone" />
      </FormSection>

      <FormSection title="Service and package">
        <div className="space-y-2">
          <label
            htmlFor="serviceType"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Service type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            className={inputClassName}
            defaultValue="Express"
          >
            <option value="Express">Express</option>
            <option value="Economy">Economy</option>
          </select>
        </div>
        <TextInput
          label="Package type"
          name="packageType"
          placeholder="Parcel"
          defaultValue="Parcel"
          errors={state.fieldErrors?.packageType}
        />
        <TextInput
          label="Weight"
          name="weightKg"
          type="number"
          placeholder="2.5"
          errors={state.fieldErrors?.weightKg}
        />
        <TextInput
          label="Declared value"
          name="declaredValue"
          type="number"
          defaultValue="0"
          errors={state.fieldErrors?.declaredValue}
        />
        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className={inputClassName}
            defaultValue="EUR"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="NGN">NGN</option>
          </select>
          <FieldError errors={state.fieldErrors?.currency} />
        </div>
        <TextInput
          label="Pickup date"
          name="pickupDate"
          type="date"
          errors={state.fieldErrors?.pickupDate}
        />
        <div className="space-y-2">
          <label
            htmlFor="pickupWindow"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Pickup window
          </label>
          <select
            id="pickupWindow"
            name="pickupWindow"
            className={inputClassName}
            defaultValue=""
          >
            <option value="" disabled>
              Select a window
            </option>
            <option value="Morning, 8 AM-12 PM">Morning, 8 AM-12 PM</option>
            <option value="Afternoon, 12 PM-4 PM">Afternoon, 12 PM-4 PM</option>
            <option value="Evening, 4 PM-7 PM">Evening, 4 PM-7 PM</option>
          </select>
          <FieldError errors={state.fieldErrors?.pickupWindow} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Special instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            className={textareaClassName}
            placeholder="Access notes, handoff requirements, or handling instructions"
          />
        </div>
      </FormSection>

      <FormSection title="Pickup address">
        <AddressFields prefix="pickup" errors={state.fieldErrors} />
      </FormSection>

      <FormSection title="Delivery address">
        <AddressFields prefix="delivery" errors={state.fieldErrors} />
      </FormSection>

      <FormSection title="Operational state">
        <div className="space-y-2">
          <label
            htmlFor="paymentStatus"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Payment status
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            className={inputClassName}
            defaultValue="unpaid"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {formatPaymentStatus(status)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="shipmentStatus"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Shipment status
          </label>
          <select
            id="shipmentStatus"
            name="shipmentStatus"
            className={inputClassName}
            defaultValue="label_created"
          >
            {shipmentStatuses.map((status) => (
              <option key={status} value={status}>
                {formatShipmentStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </FormSection>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClassName}
        >
          {isPending ? "Creating..." : "Create shipment"}
        </button>
        <Link href="/admin/shipments" className={secondaryButtonClassName}>
          Back to shipments
        </Link>
      </div>
    </form>
  );
}
