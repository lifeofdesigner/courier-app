import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { ContactInfoContent } from "@/types/cms";

export type ContactCmsFormProps = {
  section: AdminCmsEditorSection<ContactInfoContent>;
};

export function ContactCmsForm({ section }: ContactCmsFormProps) {
  const content = section.value;

  return (
    <section
      id="contact-info"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Contact Info"
        title="Support contact details"
        description="Edit the support details used by the contact page and synced site settings."
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
          formType="contact.info"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="contact.eyebrow" defaultValue={content.eyebrow} />
            <CmsTextField label="Headline" name="contact.title" defaultValue={content.title} />
            <CmsTextField label="Email" name="contact.email" type="email" defaultValue={content.email} />
            <CmsTextField label="Phone" name="contact.phone" type="tel" defaultValue={content.phone} />
            <CmsTextField
              label="Operating hours"
              name="contact.operatingHours"
              defaultValue={content.operatingHours}
            />
          </div>
          <CmsTextareaField
            label="Intro copy"
            name="contact.description"
            defaultValue={content.description}
          />
          <CmsTextareaField
            label="Company address"
            name="contact.address"
            defaultValue={content.address}
          />
        </CmsManagedForm>
      </div>
    </section>
  );
}
