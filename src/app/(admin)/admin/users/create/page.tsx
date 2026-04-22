import type { Metadata } from "next";

import { AdminPageHeader, CreateUserForm } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create User",
};

export default function CreateUserPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/users" },
          { label: "Create" },
        ]}
        title="Create User"
        description="Create a confirmed customer or admin account without leaving the protected admin workspace."
        status={{ label: "Account setup", tone: "accent" }}
        secondaryAction={{ label: "Back to Customers", href: "/admin/users" }}
      />

      <div className="max-w-4xl">
        <CreateUserForm />
      </div>
    </>
  );
}
