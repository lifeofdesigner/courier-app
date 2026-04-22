import type { Metadata } from "next";
import { ShieldCheck, UserCheck, UserPlus, UsersRound } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  UsersTable,
} from "@/components/admin";
import { getAdminUsers } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default async function ManageUsersPage() {
  const users = await getAdminUsers(100);
  const admins = users.filter((user) => user.role === "admin").length;
  const customers = users.filter((user) => user.role === "customer").length;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers" },
        ]}
        title="Customers & Access"
        description="Review profile records and update customer or admin roles with server-side authorization."
        status={{ label: "Protected access", tone: "accent" }}
        primaryAction={{ label: "Create User", href: "/admin/users/create" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total profiles"
          value={users.length}
          helperText="Customer and staff profiles."
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Customers"
          value={customers}
          helperText="Profiles with customer access."
          tone="success"
          icon={<UserCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Admins"
          value={admins}
          helperText="Profiles with admin access."
          tone="warning"
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Create ready"
          value="Yes"
          helperText="Admins can create confirmed users."
          tone="info"
          icon={<UserPlus aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="roles"
        title="Customer and staff records"
        description="Admins cannot remove their own admin role in this phase."
      >
        <UsersTable users={users} />
      </AdminSectionCard>
    </>
  );
}
