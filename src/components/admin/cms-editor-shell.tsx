"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { saveCmsEditorSectionAction } from "@/app/(admin)/admin/cms/actions";
import type { AdminActionState } from "@/types/admin";

export type CmsEditorShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export type CmsManagedFormProps = {
  formType: string;
  section: string;
  cmsKey: string;
  children: ReactNode;
  className?: string;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

export function CmsEditorShell({ sidebar, children }: CmsEditorShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {sidebar}
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}

export function CmsManagedForm({
  formType,
  section,
  cmsKey,
  children,
  className,
}: CmsManagedFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveCmsEditorSectionAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className={className ?? "space-y-5"}>
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
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
