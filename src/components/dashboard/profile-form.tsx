"use client";

import { useActionState } from "react";

import {
  updateProfileAction,
  type DashboardActionState,
} from "@/app/(customer)/dashboard/profile/actions";
import type { AppUserProfile } from "@/types/auth";

export type ProfileFormProps = {
  profile: AppUserProfile | null;
  email?: string | null;
};

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

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          Account profile
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Keep the customer contact details on your account up to date.
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
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            defaultValue={profile?.fullName ?? ""}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.fullName} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ""}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
        {email ? (
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              Email
            </label>
            <input
              id="email"
              value={email}
              readOnly
              className={`${inputClassName} bg-slate-50 text-slate-500`}
            />
            <p className="text-sm leading-6 text-slate-500">
              Email is managed by Supabase Auth.
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
