"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toggleCmsPublishAction } from "@/app/(admin)/admin/cms/actions";
import type { AdminActionState } from "@/types/admin";

export type CmsPublishBarProps = {
  id?: string | null;
  section: string;
  cmsKey: string;
  published: boolean;
  updatedAt?: string | null;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function CmsPublishBar({
  id,
  section,
  cmsKey,
  published,
  updatedAt,
}: CmsPublishBarProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    toggleCmsPublishAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              published
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {published ? "Published" : "Draft"}
          </span>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Updated {formatDate(updatedAt)}
          </p>
        </div>
        <form action={formAction}>
          <input type="hidden" name="id" value={id ?? ""} />
          <input type="hidden" name="section" value={section} />
          <input type="hidden" name="key" value={cmsKey} />
          <input type="hidden" name="published" value={String(published)} />
          <button
            type="submit"
            disabled={isPending || !id}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Updating..."
              : published
                ? "Move to Draft"
                : "Publish Section"}
          </button>
        </form>
      </div>
      {state.message ? (
        <div
          className={`mt-4 ${
            state.success
              ? "rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}
      {!id ? (
        <p className="mt-3 text-xs font-medium text-amber-700">
          Save this section once before publishing.
        </p>
      ) : null}
    </div>
  );
}
