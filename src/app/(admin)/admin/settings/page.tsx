import type { Metadata } from "next";

import { AdminSectionCard, AdminShell, SettingsForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminSiteSettings } from "@/lib/queries/admin-settings";

export const metadata: Metadata = {
  title: "Admin Settings",
};

const requiredSettingKeys = [
  "company_contact",
  "support_hours",
  "social_links",
  "footer_notice",
];

export default async function AdminSettingsPage() {
  const [admin, settings] = await Promise.all([
    requireAdmin(),
    getAdminSiteSettings(),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Site settings"
      description="Maintain JSON-backed settings for operational contact details and site-level content."
    >
      <AdminSectionCard
        title="Editable settings"
        description="Use valid JSON values. These records are admin-only and designed for future public integration."
      >
        <div className="grid gap-5">
          {requiredSettingKeys.map((key) => {
            const setting = settings.find((item) => item.key === key);

            return (
              <SettingsForm
                key={key}
                setting={setting}
                defaultKey={key}
              />
            );
          })}
        </div>
      </AdminSectionCard>
    </AdminShell>
  );
}
