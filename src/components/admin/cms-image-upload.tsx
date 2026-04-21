"use client";

import { useActionState } from "react";

import { uploadCmsAssetAction } from "@/app/(admin)/admin/cms/actions";
import type { AdminActionState } from "@/types/admin";

type CmsUploadState = AdminActionState & {
  publicUrl?: string;
  path?: string;
};

const initialState: CmsUploadState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

export function CmsImageUpload() {
  const [state, formAction, isPending] = useActionState(
    uploadCmsAssetAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        Upload CMS asset
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Upload homepage images or future content assets to the public
        cms-assets bucket.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="folder"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Folder
          </label>
          <input
            id="folder"
            name="folder"
            defaultValue="homepage/hero"
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="file"
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Image file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#0B1C3A] focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
      >
        {isPending ? "Uploading..." : "Upload asset"}
      </button>
      {state.message ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p>{state.message}</p>
          {state.publicUrl ? (
            <p className="mt-2 break-all font-mono text-xs">{state.publicUrl}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
