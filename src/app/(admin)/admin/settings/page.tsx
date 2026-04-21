import type { Metadata } from "next";

import { AdminSectionCard, AdminShell, SettingsForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getLaunchEnvStatus } from "@/lib/env";
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
  const envStatus = getLaunchEnvStatus();

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

      <AdminSectionCard
        title="Launch environment"
        description="Non-secret readiness check for payment, email, and production URL configuration."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {envStatus.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#0B1C3A]">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.key}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    item.configured
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.configured ? "Set" : "Missing"}
                </span>
              </div>
              <p className="mt-3 text-sm capitalize text-slate-600">
                Required for {item.requiredFor}
              </p>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </AdminShell>
  );
}
