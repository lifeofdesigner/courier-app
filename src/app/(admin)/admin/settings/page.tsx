import type { Metadata } from "next";
import { CheckCircle2, Settings, SlidersHorizontal, TriangleAlert } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  AdminStatusPill,
  SettingsForm,
} from "@/components/admin";
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
  const settings = await getAdminSiteSettings();
  const envStatus = getLaunchEnvStatus();
  const configuredEnv = envStatus.filter((item) => item.configured).length;
  const missingEnv = envStatus.length - configuredEnv;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
        title="Settings"
        description="Maintain JSON-backed settings for operational contact details, public site content, and launch configuration."
        status={{ label: "System controls", tone: "accent" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Editable settings"
          value={requiredSettingKeys.length}
          helperText="JSON-backed configuration records."
          icon={<Settings aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Configured env"
          value={configuredEnv}
          helperText="Launch environment checks passing."
          tone="success"
          icon={<CheckCircle2 aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Missing env"
          value={missingEnv}
          helperText="Values still needed for launch readiness."
          tone={missingEnv > 0 ? "warning" : "success"}
          icon={<TriangleAlert aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Integrations"
          value={envStatus.length}
          helperText="Payment, email, and URL readiness items."
          tone="info"
          icon={<SlidersHorizontal aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="site-settings"
        title="Editable settings"
        description="Use valid JSON values. These records are admin-only and designed for public integration."
      >
        <div className="grid gap-5">
          {requiredSettingKeys.map((key) => {
            const setting = settings.find((item) => item.key === key);

            return <SettingsForm key={key} setting={setting} defaultKey={key} />;
          })}
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        id="integrations"
        title="Integrations"
        description="Non-secret readiness check for payment, email, and production URL configuration."
      >
        <div id="system-status" className="grid gap-3 md:grid-cols-2">
          {envStatus.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#2b1d16]">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.key}</p>
                </div>
                <AdminStatusPill
                  label={item.configured ? "Set" : "Missing"}
                  tone={item.configured ? "success" : "warning"}
                />
              </div>
              <p className="mt-3 text-sm capitalize text-slate-600">
                Required for {item.requiredFor}
              </p>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </>
  );
}
