import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsImageField } from "@/components/admin/cms-image-field";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { SEOContent } from "@/types/cms";

export type SeoCmsFormProps = {
  section: AdminCmsEditorSection<SEOContent>;
};

export function SeoCmsForm({ section }: SeoCmsFormProps) {
  const content = section.value;

  return (
    <section
      id="seo"
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="SEO"
        title="Homepage search and sharing"
        description="Edit the search title, description, keywords, and social sharing image with plain fields."
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
          formType="homepage.seo"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="SEO title" name="seo.title" defaultValue={content.title} />
            <CmsTextField
              label="Canonical path"
              name="seo.canonicalPath"
              defaultValue={content.canonicalPath}
            />
          </div>
          <CmsTextareaField
            label="SEO description"
            name="seo.description"
            defaultValue={content.description}
          />
          <CmsTextField
            label="Keywords"
            name="seo.keywords"
            defaultValue={content.keywords?.join(", ")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Social title"
              name="seo.openGraphTitle"
              defaultValue={content.openGraphTitle}
            />
            <CmsTextField
              label="Social description"
              name="seo.openGraphDescription"
              defaultValue={content.openGraphDescription}
            />
          </div>
          <CmsImageField
            label="Social sharing image"
            name="seo.openGraphImage"
            defaultImage={content.openGraphImage}
          />
        </CmsManagedForm>
      </div>
    </section>
  );
}
