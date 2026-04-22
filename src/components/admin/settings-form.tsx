"use client";

import { useActionState } from "react";

import { upsertSiteSettingAction } from "@/app/(admin)/admin/settings/actions";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState, SiteSettingRow } from "@/types/admin";

export type SettingsFormProps = {
  setting?: SiteSettingRow;
  defaultKey?: string;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

export function SettingsForm({ setting, defaultKey = "" }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertSiteSettingAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Setting saved",
    errorTitle: "Setting could not be saved",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-[0.45fr_1fr]">
        <div className="space-y-2">
          <label
            htmlFor={`key-${setting?.id ?? defaultKey}`}
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Setting key
          </label>
          <input
            id={`key-${setting?.id ?? defaultKey}`}
            name="key"
            defaultValue={setting?.key ?? defaultKey}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`payload-${setting?.id ?? defaultKey}`}
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            JSON value
          </label>
          <textarea
            id={`payload-${setting?.id ?? defaultKey}`}
            name="payload"
            defaultValue={JSON.stringify(setting?.value ?? {}, null, 2)}
            className={`${textareaClassName} font-mono`}
          />
        </div>
      </div>
      {state.message ? (
        <p
          className={`mt-4 text-sm ${
            state.success ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
      >
        {isPending ? "Saving..." : "Save setting"}
      </button>
    </form>
  );
}
