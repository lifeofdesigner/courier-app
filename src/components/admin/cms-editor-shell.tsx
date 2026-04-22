"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { saveCmsEditorSectionAction } from "@/app/(admin)/admin/cms/actions";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState } from "@/types/admin";

export type CmsEditorShellProps = {
  sidebar?: ReactNode;
  children: ReactNode;
};

export type CmsManagedFormProps = {
  formType: string;
  section: string;
  cmsKey: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

export function CmsEditorShell({ sidebar, children }: CmsEditorShellProps) {
  if (!sidebar) {
    return <div className="min-w-0 space-y-8">{children}</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      {sidebar}
      <div className="min-w-0 space-y-8">{children}</div>
    </div>
  );
}

export function CmsManagedForm({
  formType,
  section,
  cmsKey,
  children,
  className,
  id,
}: CmsManagedFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveCmsEditorSectionAction,
    initialState,
  );
  const formRef = usePreservedFormValues(state.values);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form
      ref={formRef}
      id={id}
      action={formAction}
      className={className ?? "space-y-6"}
    >
      <input type="hidden" name="formType" value={formType} />
      <input type="hidden" name="section" value={section} />
      <input type="hidden" name="key" value={cmsKey} />
      {children}
      {state.message ? (
        <div
          className={
            state.success
              ? "rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }
        >
          {state.message}
        </div>
      ) : null}
      <div className="sticky bottom-4 z-10 rounded-[20px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            Save this section before publishing or switching editors.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
