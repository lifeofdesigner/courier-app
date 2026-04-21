"use client";

import { useActionState } from "react";

import {
  createAddressAction,
  type DashboardActionState,
} from "@/app/(customer)/dashboard/profile/actions";

const initialState: DashboardActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function TextInput({
  label,
  name,
  type = "text",
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#0B1C3A]">
        {label}
      </label>
      <input id={name} name={name} type={type} className={inputClassName} />
      <FieldError errors={errors} />
    </div>
  );
}

export function AddressForm() {
  const [state, formAction, isPending] = useActionState(
    createAddressAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Add saved address
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Save frequently used pickup or delivery details for future requests.
        </p>
      </div>

      {state.message ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <TextInput label="Label" name="label" />
        <TextInput
          label="Contact name"
          name="contactName"
          errors={state.fieldErrors?.contactName}
        />
        <TextInput label="Company" name="companyName" />
        <TextInput label="Phone" name="phone" />
        <TextInput
          label="Email"
          name="email"
          type="email"
          errors={state.fieldErrors?.email}
        />
        <TextInput
          label="Address line 1"
          name="line1"
          errors={state.fieldErrors?.line1}
        />
        <TextInput label="Address line 2" name="line2" />
        <TextInput label="City" name="city" errors={state.fieldErrors?.city} />
        <TextInput label="State / region" name="stateRegion" />
        <TextInput label="Postal code" name="postalCode" />
        <TextInput
          label="Country"
          name="country"
          errors={state.fieldErrors?.country}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
      >
        {isPending ? "Saving..." : "Save address"}
      </button>
    </form>
  );
}
