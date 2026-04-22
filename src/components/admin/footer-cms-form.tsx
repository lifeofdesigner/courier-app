import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { FooterContent } from "@/types/cms";

export type FooterCmsFormProps = {
  section: AdminCmsEditorSection<FooterContent>;
};

export function FooterCmsForm({ section }: FooterCmsFormProps) {
  const content = section.value;

  return (
    <section
      id="footer"
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Footer"
        title="Footer support content"
        description="Edit the footer notice and support details without touching layout code."
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
          formType="footer.content"
          section={section.section}
          cmsKey={section.key}
        >
          <CmsTextareaField
            label="Footer notice"
            name="footer.notice"
            defaultValue={content.notice}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Support email"
              name="footer.supportEmail"
              type="email"
              defaultValue={content.supportEmail}
            />
            <CmsTextField
              label="Support phone"
              name="footer.supportPhone"
              type="tel"
              defaultValue={content.supportPhone}
            />
            <CmsTextField
              label="Operating hours"
              name="footer.operatingHours"
              defaultValue={content.operatingHours}
            />
          </div>
          <CmsTextareaField
            label="Company address"
            name="footer.address"
            defaultValue={content.address}
          />
        </CmsManagedForm>
      </div>
    </section>
  );
}
