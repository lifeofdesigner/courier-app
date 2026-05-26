"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/app/(auth)/actions";
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

export type LoginFormProps = {
  nextPath?: string;
  message?: string;
};

export function LoginForm({ nextPath = "/dashboard", message }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Signed in",
    errorTitle: "Sign in failed",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <AuthMessage state={state.message ? state : null} message={message} />
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-navy">
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
          className="block text-sm font-semibold text-navy"
        >
          Password
        </label>
        <input
          id="password"
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
      <button type="submit" disabled={isPending} className={`${primaryButtonClassName} w-full`}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-primary">
          Forgot password?
        </Link>
        <Link href="/sign-up" className="font-semibold text-primary">
          Create an account
        </Link>
      </div>
    </form>
  );
}
