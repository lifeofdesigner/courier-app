import { CmsLinkField } from "@/components/admin/cms-link-field";
import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsRepeatableList } from "@/components/admin/cms-repeatable-list";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { AboutPageContent } from "@/types/cms";

export type AboutCmsFormProps = {
  section: AdminCmsEditorSection<AboutPageContent>;
};

const iconOptions = [
  { label: "Check circle", value: "check-circle" },
  { label: "Clock", value: "clock" },
  { label: "Headphones", value: "headphones" },
  { label: "Route", value: "route" },
  { label: "Shield check", value: "shield-check" },
  { label: "Truck", value: "truck" },
];

export function AboutCmsForm({ section }: AboutCmsFormProps) {
  const content = section.value;

  return (
    <section
      id="about-page"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="About Page"
        title="About page content"
        description="Edit company story, values, reasons to choose the courier, page CTA, and SEO."
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
          formType="aboutPage.content"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Hero eyebrow" name="aboutPage.hero.eyebrow" defaultValue={content.hero.eyebrow} />
            <CmsTextField label="Hero headline" name="aboutPage.hero.title" defaultValue={content.hero.title} />
          </div>
          <CmsTextareaField
            label="Hero subtitle"
            name="aboutPage.hero.description"
            defaultValue={content.hero.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Story eyebrow"
              name="aboutPage.story.eyebrow"
              defaultValue={content.story.eyebrow}
            />
            <CmsTextField
              label="Story headline"
              name="aboutPage.story.title"
              defaultValue={content.story.title}
            />
          </div>
          <CmsRepeatableList
            label="Story paragraphs"
            name="aboutPage.story.paragraphs"
            addLabel="Add paragraph"
            emptyItem={{ text: "" }}
            items={content.story.paragraphs.map((text) => ({ text }))}
            fields={[{ name: "text", label: "Paragraph", type: "textarea" }]}
          />
          <CmsRepeatableList
            label="Story stats"
            name="aboutPage.story.stats"
            addLabel="Add stat"
            emptyItem={{ value: "", label: "", description: "" }}
            items={content.story.stats.map((item) => ({
              value: item.value,
              label: item.label,
              description: item.description,
            }))}
            fields={[
              { name: "value", label: "Value" },
              { name: "label", label: "Label" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Values headline"
              name="aboutPage.values.title"
              defaultValue={content.values.title}
            />
            <CmsTextField
              label="SEO title"
              name="aboutPage.seo.title"
              defaultValue={content.seo.title}
            />
          </div>
          <CmsTextareaField
            label="Values subtitle"
            name="aboutPage.values.description"
            defaultValue={content.values.description}
          />
          <CmsRepeatableList
            label="Values"
            name="aboutPage.values.items"
            addLabel="Add value"
            emptyItem={{ title: "", description: "", icon: "route" }}
            items={content.values.items.map((item) => ({
              title: item.title,
              description: item.description,
              icon: item.icon,
            }))}
            fields={[
              { name: "title", label: "Title" },
              { name: "icon", label: "Icon", type: "select", options: iconOptions },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
          <CmsRepeatableList
            label="Reasons"
            name="aboutPage.reasons"
            addLabel="Add reason"
            emptyItem={{ text: "" }}
            items={content.reasons.map((text) => ({ text }))}
            fields={[{ name: "text", label: "Reason" }]}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="CTA eyebrow" name="aboutPage.cta.eyebrow" defaultValue={content.cta.eyebrow} />
            <CmsTextField label="CTA headline" name="aboutPage.cta.title" defaultValue={content.cta.title} />
          </div>
          <CmsTextareaField
            label="CTA subtitle"
            name="aboutPage.cta.description"
            defaultValue={content.cta.description}
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <CmsLinkField label="Primary button" name="aboutPage.cta.primaryCta" defaultValue={content.cta.primaryCta} />
            <CmsLinkField label="Secondary button" name="aboutPage.cta.secondaryCta" defaultValue={content.cta.secondaryCta} />
          </div>
          <CmsTextareaField
            label="SEO description"
            name="aboutPage.seo.description"
            defaultValue={content.seo.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Keywords"
              name="aboutPage.seo.keywords"
              defaultValue={content.seo.keywords?.join(", ")}
            />
            <CmsTextField
              label="Canonical path"
              name="aboutPage.seo.canonicalPath"
              defaultValue={content.seo.canonicalPath}
            />
          </div>
        </CmsManagedForm>
      </div>
    </section>
  );
}
