import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import type { CreateUserActionState } from "@/types/admin";

export type CreateUserSuccessProps = {
  state: CreateUserActionState;
};

export function CreateUserSuccess({ state }: CreateUserSuccessProps) {
  if (!state.success || !state.createdEmail || !state.createdRole) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5" />
        <div>
          <h2 className="text-lg font-bold tracking-tight">User created</h2>
          <p className="mt-2 text-sm leading-7">
            {state.createdEmail} was created as{" "}
            <span className="font-semibold capitalize">
              {state.createdRole}
            </span>
            . This user is email-confirmed and can log in immediately.
          </p>
          {state.createdUserId ? (
            <p className="mt-1 break-all text-xs text-emerald-800">
              User ID: {state.createdUserId}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/admin/users/create"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
        >
          Create another user
        </Link>
        <Link
          href="/admin/users"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          Back to users
        </Link>
      </div>
    </div>
  );
}
