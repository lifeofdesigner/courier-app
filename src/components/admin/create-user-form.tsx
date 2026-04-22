"use client";

import { useActionState } from "react";

import { createAdminUserAction } from "@/app/(admin)/admin/users/create/actions";
import { CreateUserSuccess } from "@/components/admin/create-user-success";
import type { CreateUserActionState } from "@/types/admin";

const initialState: CreateUserActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

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
      <label htmlFor={name} className="block text-sm font-semibold text-[#2b1d16]">
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

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createAdminUserAction,
    initialState,
  );

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      {state.success ? <CreateUserSuccess state={state} /> : null}

      {state.message && !state.success ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="mt-8 space-y-5">
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
              className="block text-sm font-semibold text-[#2b1d16]"
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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create user"}
          </button>
        </div>
      </form>
    </div>
  );
}
