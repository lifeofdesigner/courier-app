"use client";

import Link from "next/link";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth/auth-message";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState,
  );
  const formRef = usePreservedFormValues(state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <AuthMessage state={state.message ? state : null} />
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#0B1C3A]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          placeholder="you@example.com"
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <button type="submit" disabled={isPending} className={`${primaryButtonClassName} w-full`}>
        {isPending ? "Preparing reset..." : "Send reset email"}
      </button>
      <p className="text-sm text-slate-600">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-[#FF6B2B]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
