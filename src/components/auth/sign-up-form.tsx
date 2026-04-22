"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth/auth-message";
import { useActionToast } from "@/lib/forms/use-action-toast";
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

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Account created",
    errorTitle: "Sign up failed",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <AuthMessage state={state.message ? state : null} />
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
          autoComplete="name"
          className={inputClassName}
          placeholder="Jane Smith"
        />
        {state.fieldErrors?.fullName ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.fullName[0]}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-[#0B1C3A]">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={inputClassName}
          placeholder="+353 1 555 0188"
        />
      </div>
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
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[#0B1C3A]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-[#0B1C3A]"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
      </div>
      <button type="submit" disabled={isPending} className={`${primaryButtonClassName} w-full`}>
        {isPending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#FF6B2B]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
