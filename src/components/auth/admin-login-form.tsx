"use client";

import Link from "next/link";
import { useActionState } from "react";

import { adminLoginAction } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth/auth-message";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    adminLoginAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Admin signed in",
    errorTitle: "Admin sign in failed",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <AuthMessage state={state.message ? state : null} />
      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="block text-sm font-semibold text-navy"
        >
          Admin email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          placeholder="admin@example.com"
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="block text-sm font-semibold text-navy"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClassName}
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`${primaryButtonClassName} w-full`}
      >
        {isPending ? "Checking access..." : "Sign in to admin"}
      </button>
      <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-primary">
          Forgot password?
        </Link>
        <Link href="/login" className="font-semibold text-primary">
          Customer sign in
        </Link>
      </div>
    </form>
  );
}
