import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsImageField } from "@/components/admin/cms-image-field";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { SiteIdentityContent } from "@/types/cms";

export type SiteIdentityFormProps = {
  section: AdminCmsEditorSection<SiteIdentityContent>;
};

export function SiteIdentityForm({ section }: SiteIdentityFormProps) {
  const content = section.value;

  return (
    <section
      id="site-identity"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Site Identity"
        title="Brand and support details"
        description="Manage the company name, support channels, logo assets, and site-wide notice in plain fields."
        published={section.published}
      />
      <div className="mt-8 space-y-8">
        <CmsPublishBar
          id={section.id}
          section={section.section}
          cmsKey={section.key}
          published={section.published}
          updatedAt={section.updatedAt}
        />
        <CmsManagedForm
          formType="site.identity"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Site name"
              name="siteIdentity.siteName"
              defaultValue={content.siteName}
            />
            <CmsTextField
              label="Support email"
              name="siteIdentity.supportEmail"
              type="email"
              defaultValue={content.supportEmail}
            />
            <CmsTextField
              label="Support phone"
              name="siteIdentity.supportPhone"
              type="tel"
              defaultValue={content.supportPhone}
            />
            <CmsTextField
              label="Operating hours"
              name="siteIdentity.operatingHours"
              defaultValue={content.operatingHours}
            />
          </div>
          <CmsTextareaField
            label="Company address"
            name="siteIdentity.companyAddress"
            defaultValue={content.companyAddress}
          />
          <CmsTextareaField
            label="Footer notice"
            name="siteIdentity.footerNotice"
            defaultValue={content.footerNotice}
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <CmsImageField
              label="Logo"
              name="siteIdentity.logo"
              defaultImage={content.logo}
              helpText="Used where the public layout supports a custom logo."
            />
            <CmsImageField
              label="Favicon"
              name="siteIdentity.favicon"
              defaultImage={content.favicon}
              accept="image/*,.ico"
              helpText="Upload a square icon or .ico file."
            />
          </div>
        </CmsManagedForm>
      </div>
    </section>
  );
}
