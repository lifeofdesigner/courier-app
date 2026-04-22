"use client";

import { useActionState } from "react";

import { unlockBootstrapAccessAction } from "@/app/developer/bootstrap-users/actions";
import { useActionToast } from "@/lib/forms/use-action-toast";
import type { BootstrapAccessActionState } from "@/types/auth";

const initialState: BootstrapAccessActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

export function BootstrapAccessForm() {
  const [state, formAction, isPending] = useActionState(
    unlockBootstrapAccessAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Bootstrap unlocked",
    errorTitle: "Bootstrap access denied",
  });

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#0B1C3A]">
          Verify bootstrap access
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Enter the developer bootstrap secret to unlock this internal user
          creation tool.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {state.message ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-900">
            {state.message}
          </div>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="bootstrap-secret"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Bootstrap secret
          </label>
          <input
            id="bootstrap-secret"
            name="secret"
            type="password"
            autoComplete="off"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClassName}
        >
          {isPending ? "Verifying..." : "Unlock bootstrap"}
        </button>
      </div>
    </form>
  );
}
