"use client";

import { useActionState } from "react";

import {
  toggleCmsPublishAction,
  upsertCmsSectionAction,
} from "@/app/(admin)/admin/cms/actions";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState, AdminCmsRow } from "@/types/admin";

export type CmsSectionFormProps = {
  row?: AdminCmsRow;
  defaultSection?: string;
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

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

export function CmsSectionForm({
  row,
  defaultSection = "homepage",
  defaultKey = "hero",
}: CmsSectionFormProps) {
  const [upsertState, upsertAction, isUpserting] = useActionState(
    upsertCmsSectionAction,
    initialState,
  );
  const [toggleState, toggleAction, isToggling] = useActionState(
    toggleCmsPublishAction,
    initialState,
  );
  const formRef = usePreservedFormValues(upsertState.values);
  const payload = row ? JSON.stringify(row.value, null, 2) : "{\n  \n}";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <form ref={formRef} action={upsertAction} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={`section-${row?.id ?? defaultKey}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Section
            </label>
            <input
              id={`section-${row?.id ?? defaultKey}`}
              name="section"
              defaultValue={row?.section ?? defaultSection}
              className={inputClassName}
            />
            <FieldError errors={upsertState.fieldErrors?.section} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`key-${row?.id ?? defaultKey}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Key
            </label>
            <input
              id={`key-${row?.id ?? defaultKey}`}
              name="key"
              defaultValue={row?.key ?? defaultKey}
              className={inputClassName}
            />
            <FieldError errors={upsertState.fieldErrors?.key} />
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`payload-${row?.id ?? defaultKey}`}
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            JSON payload
          </label>
          <textarea
            id={`payload-${row?.id ?? defaultKey}`}
            name="payload"
            defaultValue={payload}
            className={`${textareaClassName} min-h-72 font-mono`}
          />
          <FieldError errors={upsertState.fieldErrors?.payload} />
        </div>
        {upsertState.message ? (
          <p
            className={`text-sm ${
              upsertState.success ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {upsertState.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isUpserting}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
        >
          {isUpserting ? "Saving..." : "Save section"}
        </button>
      </form>

      {row ? (
        <form action={toggleAction} className="mt-5 border-t border-slate-100 pt-5">
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="published" value={String(row.published)} />
          <button
            type="submit"
            disabled={isToggling}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            {isToggling
              ? "Updating..."
              : row.published
                ? "Unpublish section"
                : "Publish section"}
          </button>
          {toggleState.message ? (
            <p
              className={`mt-2 text-sm ${
                toggleState.success ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {toggleState.message}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
