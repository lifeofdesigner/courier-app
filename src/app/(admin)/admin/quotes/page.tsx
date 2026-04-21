import type { Metadata } from "next";

import { AdminSectionCard, AdminShell, QuotesTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminQuotes } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Quotes",
};

export default async function ManageQuotesPage() {
  const [admin, quotes] = await Promise.all([
    requireAdmin(),
    getAdminQuotes(100),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Quote review"
      description="Review recent customer quote calculations for service demand, follow-up, and booking support."
    >
      <AdminSectionCard
        title="Recent quotes"
        description="Read-only operational list for this phase."
      >
        <QuotesTable quotes={quotes} />
      </AdminSectionCard>
    </AdminShell>
  );
}
