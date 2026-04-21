import type { Metadata } from "next";

import { AdminSectionCard, AdminShell, UsersTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminUsers } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default async function ManageUsersPage() {
  const [admin, users] = await Promise.all([
    requireAdmin(),
    getAdminUsers(100),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="User access"
      description="Review profile records and update customer or admin roles with server-side authorization."
    >
      <AdminSectionCard
        title="Users"
        description="Admins cannot remove their own admin role in this phase."
      >
        <UsersTable users={users} />
      </AdminSectionCard>
    </AdminShell>
  );
}
