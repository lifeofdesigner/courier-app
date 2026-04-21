import type { Metadata } from "next";

import { CreateUserForm } from "@/components/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Create User",
};

export default async function CreateUserPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell
      profile={admin.profile}
      title="Create user"
      description="Create a confirmed customer or admin account without leaving the protected admin workspace."
      primaryAction={{ label: "Back to users", href: "/admin/users" }}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0B1C3A] sm:text-4xl">
            Add a user account
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Enter the account details and choose the role to assign immediately
            after Supabase Auth creates the user.
          </p>
        </div>
        <div className="mt-8">
          <CreateUserForm />
        </div>
      </div>
    </AdminShell>
  );
}
