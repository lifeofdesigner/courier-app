import type { Metadata } from "next";

import {
  AdminSectionCard,
  AdminShell,
  CmsImageUpload,
  CmsPreviewCard,
  CmsSectionForm,
} from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCmsRows } from "@/lib/queries/admin-cms";

export const metadata: Metadata = {
  title: "CMS",
};

const homepageKeys = [
  "hero",
  "trackingPromo",
  "services",
  "trust",
  "coverage",
  "testimonials",
  "faqPreview",
  "cta",
  "seo",
];

export default async function CMSPage() {
  const [admin, rows] = await Promise.all([requireAdmin(), getAdminCmsRows()]);
  const homepageRows = rows.filter((row) => row.section === "homepage");

  return (
    <AdminShell
      profile={admin.profile}
      title="Homepage CMS"
      description="Edit structured homepage content rows, publish sections, and upload media assets for public content."
    >
      <CmsImageUpload />

      <AdminSectionCard
        title="Homepage section editor"
        description="Payloads must stay compatible with the Phase 3 homepage content model."
      >
        <div className="grid gap-6">
          {homepageKeys.map((key) => {
            const row = homepageRows.find((cmsRow) => cmsRow.key === key);

            return (
              <CmsSectionForm
                key={key}
                row={row}
                defaultSection="homepage"
                defaultKey={key}
              />
            );
          })}
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Current CMS rows"
        description="A quick preview of all CMS records available to admin users."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {rows.length > 0 ? (
            rows.map((row) => <CmsPreviewCard key={row.id} row={row} />)
          ) : (
            <CmsSectionForm defaultSection="homepage" defaultKey="hero" />
          )}
        </div>
      </AdminSectionCard>
    </AdminShell>
  );
}
