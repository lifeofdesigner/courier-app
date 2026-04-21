"use client";

import { useActionState } from "react";

import {
  createBookingAction,
  type BookingActionState,
} from "@/app/(public)/book/actions";
import { BookingSuccessCard } from "@/components/booking/booking-success-card";

const initialState: BookingActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

export type BookingFormProps = {
  isConfigured: boolean;
  quoteId?: string;
};

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
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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
        className={inputClassName}
      />
      <FieldError errors={errors} />
    </div>
  );
}

export function BookingForm({ isConfigured, quoteId }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {quoteId ? <input type="hidden" name="quoteId" value={quoteId} /> : null}

      {!isConfigured ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase is not configured yet. Add the public environment variables
          and run the Phase 4 migration to enable booking requests.
        </div>
      ) : null}

      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {state.booking ? <BookingSuccessCard booking={state.booking} /> : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Shipment details
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
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
              className={selectClassName}
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
            errors={state.fieldErrors?.packageType}
          />
          <TextInput
            label="Weight in kg"
            name="weightKg"
            type="number"
            errors={state.fieldErrors?.weightKg}
          />
          <TextInput
            label="Declared value"
            name="declaredValue"
            type="number"
            errors={state.fieldErrors?.declaredValue}
          />
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
              className={selectClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select a window
              </option>
              <option value="Morning, 8 AM-12 PM">Morning, 8 AM-12 PM</option>
              <option value="Afternoon, 12 PM-4 PM">
                Afternoon, 12 PM-4 PM
              </option>
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
              placeholder="Loading dock, handoff notes, access codes, or package handling details"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Pickup address
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextInput
            label="Contact name"
            name="pickup.contactName"
            errors={state.fieldErrors?.["pickup.contactName"]}
          />
          <TextInput label="Company" name="pickup.companyName" />
          <TextInput label="Phone" name="pickup.phone" />
          <TextInput
            label="Email"
            name="pickup.email"
            type="email"
            errors={state.fieldErrors?.["pickup.email"]}
          />
          <TextInput
            label="Address line 1"
            name="pickup.line1"
            errors={state.fieldErrors?.["pickup.line1"]}
          />
          <TextInput label="Address line 2" name="pickup.line2" />
          <TextInput
            label="City"
            name="pickup.city"
            errors={state.fieldErrors?.["pickup.city"]}
          />
          <TextInput label="State / region" name="pickup.stateRegion" />
          <TextInput label="Postal code" name="pickup.postalCode" />
          <TextInput
            label="Country"
            name="pickup.country"
            errors={state.fieldErrors?.["pickup.country"]}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Delivery address
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextInput
            label="Contact name"
            name="delivery.contactName"
            errors={state.fieldErrors?.["delivery.contactName"]}
          />
          <TextInput label="Company" name="delivery.companyName" />
          <TextInput label="Phone" name="delivery.phone" />
          <TextInput
            label="Email"
            name="delivery.email"
            type="email"
            errors={state.fieldErrors?.["delivery.email"]}
          />
          <TextInput
            label="Address line 1"
            name="delivery.line1"
            errors={state.fieldErrors?.["delivery.line1"]}
          />
          <TextInput label="Address line 2" name="delivery.line2" />
          <TextInput
            label="City"
            name="delivery.city"
            errors={state.fieldErrors?.["delivery.city"]}
          />
          <TextInput label="State / region" name="delivery.stateRegion" />
          <TextInput label="Postal code" name="delivery.postalCode" />
          <TextInput
            label="Country"
            name="delivery.country"
            errors={state.fieldErrors?.["delivery.country"]}
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending || !isConfigured}
        className={primaryButtonClassName}
      >
        {isPending ? "Submitting..." : "Submit pickup request"}
      </button>
    </form>
  );
}
