"use client";

import { useActionState } from "react";

import { updateUserRoleAction } from "@/app/(admin)/admin/users/actions";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState, AdminUserRow } from "@/types/admin";

export type UserRoleFormProps = {
  user: AdminUserRow;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

export function UserRoleForm({ user }: UserRoleFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateUserRoleAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Role updated",
    errorTitle: "Role update failed",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <input type="hidden" name="userId" value={user.id} />
      <div className="flex gap-2">
        <select
          name="role"
          defaultValue={user.role}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#b0825f] px-3 text-xs font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
        >
          {isPending ? "Saving" : "Update"}
        </button>
      </div>
      {state.message ? (
        <p
          className={`text-xs ${
            state.success ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
