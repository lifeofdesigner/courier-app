"use client";

import { useActionState } from "react";

import { createBootstrapUserAction } from "@/app/developer/bootstrap-users/actions";
import { BootstrapSuccessCard } from "@/components/developer/bootstrap-success-card";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { CreateUserActionState } from "@/types/admin";

const initialState: CreateUserActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function TextInput({
  label,
  name,
  type = "text",
  autoComplete,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        className={inputClassName}
      />
      <FieldError errors={errors} />
    </div>
  );
}

export function BootstrapUserForm() {
  const [state, formAction, isPending] = useActionState(
    createBootstrapUserAction,
    initialState,
  );
  const formRef = usePreservedFormValues(state.values);

  if (state.success) {
    return <BootstrapSuccessCard state={state} />;
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#0B1C3A]">
          Create a Supabase user
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Create a confirmed customer or admin account without signing in as the
          new user.
        </p>
      </div>

      {state.message ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {state.message}
        </div>
      ) : null}

      <form ref={formRef} action={formAction} className="mt-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            label="Full name"
            name="fullName"
            autoComplete="name"
            errors={state.fieldErrors?.fullName}
          />
          <TextInput
            label="Phone"
            name="phone"
            autoComplete="tel"
            errors={state.fieldErrors?.phone}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            errors={state.fieldErrors?.email}
          />
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="customer"
              className={selectClassName}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <FieldError errors={state.fieldErrors?.role} />
          </div>
          <TextInput
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors?.password}
          />
          <TextInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors?.confirmPassword}
          />
        </div>

        <button type="submit" disabled={isPending} className={primaryButtonClassName}>
          {isPending ? "Creating..." : "Create bootstrap user"}
        </button>
      </form>
    </div>
  );
}
