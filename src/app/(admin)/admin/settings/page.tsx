import type { Metadata } from "next";
import {
  CheckCircle2,
  Contact,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  AdminStatusPill,
  CompanyContactSettingsForm,
  FooterNoticeSettingsForm,
  SocialLinksSettingsForm,
  SupportHoursSettingsForm,
  type CompanyContactSettings,
  type FooterNoticeSettings,
  type SocialLinksSettings,
  type SupportHoursSettings,
} from "@/components/admin";
import { company, socialLinks } from "@/constants/site";
import { getLaunchEnvStatus } from "@/lib/env";
import { getAdminSiteSettings } from "@/lib/queries/admin-settings";
import type { SiteSettingRow } from "@/types/admin";

export const metadata: Metadata = {
  title: "Admin Settings",
};

const requiredSettingKeys = [
  "company_contact",
  "support_hours",
  "social_links",
  "footer_notice",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function getSettingRecord(settings: SiteSettingRow[], key: string) {
  const value = settings.find((setting) => setting.key === key)?.value;

  return isRecord(value) ? value : {};
}

function getFriendlySettings(settings: SiteSettingRow[]) {
  const companyContact = getSettingRecord(settings, "company_contact");
  const supportHours = getSettingRecord(settings, "support_hours");
  const social = getSettingRecord(settings, "social_links");
  const footerNotice = getSettingRecord(settings, "footer_notice");

  return {
    companyContact: {
      email: readString(companyContact.email, company.email),
      phone: readString(companyContact.phone, company.phone),
      address: readString(companyContact.address, company.address),
    } satisfies CompanyContactSettings,
    supportHours: {
      label: readString(supportHours.label, company.operatingHours),
    } satisfies SupportHoursSettings,
    socialLinks: {
      x: readString(social.x, socialLinks.x),
      facebook: readString(social.facebook, socialLinks.facebook),
      linkedin: readString(social.linkedin, socialLinks.linkedin),
    } satisfies SocialLinksSettings,
    footerNotice: {
      text: readString(footerNotice.text, company.trustStatement),
    } satisfies FooterNoticeSettings,
  };
}

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();
  const friendlySettings = getFriendlySettings(settings);
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
        description="Edit company details, business hours, social links, footer messaging, and launch readiness without touching code."
        status={{ label: "System controls", tone: "accent" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Editable groups"
          value={requiredSettingKeys.length}
          helperText="Plain-language site controls."
          icon={<Contact aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Ready items"
          value={configuredEnv}
          helperText="Launch checks passing."
          tone="success"
          icon={<CheckCircle2 aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Needs setup"
          value={missingEnv}
          helperText="Values still needed for launch readiness."
          tone={missingEnv > 0 ? "warning" : "success"}
          icon={<TriangleAlert aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Connection checks"
          value={envStatus.length}
          helperText="Payment, email, and website readiness."
          tone="info"
          icon={<SlidersHorizontal aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="site-settings"
        title="Site settings"
        description="Update the customer-facing business details used around the website."
      >
        <div className="grid gap-5">
          <CompanyContactSettingsForm settings={friendlySettings.companyContact} />
          <SupportHoursSettingsForm settings={friendlySettings.supportHours} />
          <SocialLinksSettingsForm settings={friendlySettings.socialLinks} />
          <FooterNoticeSettingsForm settings={friendlySettings.footerNotice} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        id="integrations"
        title="Launch readiness"
        description="A safe checklist showing which required connections are configured."
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
