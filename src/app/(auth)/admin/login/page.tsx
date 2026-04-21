import type { Metadata } from "next";

import { AdminLoginForm, AuthShell } from "@/components/auth";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      eyebrow="Admin access"
      title="Sign in to access the admin workspace."
      description="Manage courier operations, bookings, shipments, user accounts, CMS content, and internal workspace settings."
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
