import { CmsLinkField } from "@/components/admin/cms-link-field";
import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsRepeatableList } from "@/components/admin/cms-repeatable-list";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { ServicesPageContent } from "@/types/cms";

export type ServicesPageCmsFormProps = {
  section: AdminCmsEditorSection<ServicesPageContent>;
};

const iconOptions = [
  { label: "Building", value: "building" },
  { label: "Check circle", value: "check-circle" },
  { label: "Clock", value: "clock" },
  { label: "Globe", value: "globe" },
  { label: "Package check", value: "package-check" },
  { label: "Route", value: "route" },
  { label: "Shield check", value: "shield-check" },
  { label: "Truck", value: "truck" },
];

export function ServicesPageCmsForm({ section }: ServicesPageCmsFormProps) {
  const content = section.value;

  return (
    <section
      id="services-page"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Services Page"
        title="Services page content"
        description="Edit services page hero copy, service cards, workflow steps, support highlights, and SEO."
        published={section.published}
      />
      <div className="mt-6 space-y-5">
        <CmsManagedForm
          formType="servicesPage.content"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/40 p-5">
            <CmsSectionHeader title="Hero" />
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <CmsTextField label="Eyebrow" name="servicesPage.hero.eyebrow" defaultValue={content.hero.eyebrow} />
              <CmsTextField label="Headline" name="servicesPage.hero.title" defaultValue={content.hero.title} />
            </div>
            <div className="mt-5">
              <CmsTextareaField
                label="Subtitle"
                name="servicesPage.hero.description"
                defaultValue={content.hero.description}
              />
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <CmsLinkField label="Primary button" name="servicesPage.hero.primaryCta" defaultValue={content.hero.primaryCta} />
              <CmsLinkField label="Secondary button" name="servicesPage.hero.secondaryCta" defaultValue={content.hero.secondaryCta} />
            </div>
          </div>
          <CmsRepeatableList
            label="Services"
            name="servicesPage.services"
            addLabel="Add service"
            emptyItem={{ title: "", description: "", icon: "package-check", bullets: "" }}
            items={content.services.map((item) => ({
              title: item.title,
              description: item.description,
              icon: item.icon,
              bullets: item.bullets.join("\n"),
            }))}
            fields={[
              { name: "title", label: "Title" },
              { name: "icon", label: "Icon", type: "select", options: iconOptions },
              { name: "description", label: "Description", type: "textarea" },
              { name: "bullets", label: "Bullet points", type: "textarea" },
            ]}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Workflow headline"
              name="servicesPage.workflow.title"
              defaultValue={content.workflow.title}
            />
            <CmsTextField
              label="SEO title"
              name="servicesPage.seo.title"
              defaultValue={content.seo.title}
            />
          </div>
          <CmsTextareaField
            label="Workflow subtitle"
            name="servicesPage.workflow.description"
            defaultValue={content.workflow.description}
          />
          <CmsRepeatableList
            label="Workflow steps"
            name="servicesPage.workflow.steps"
            addLabel="Add step"
            emptyItem={{ title: "", description: "" }}
            items={content.workflow.steps.map((item) => ({
              title: item.title,
              description: item.description,
            }))}
            fields={[
              { name: "title", label: "Title" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
          <CmsRepeatableList
            label="Support highlights"
            name="servicesPage.supportHighlights"
            addLabel="Add highlight"
            emptyItem={{ title: "", description: "", icon: "check-circle" }}
            items={content.supportHighlights.map((item) => ({
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
          <CmsTextareaField
            label="SEO description"
            name="servicesPage.seo.description"
            defaultValue={content.seo.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Keywords"
              name="servicesPage.seo.keywords"
              defaultValue={content.seo.keywords?.join(", ")}
            />
            <CmsTextField
              label="Canonical path"
              name="servicesPage.seo.canonicalPath"
              defaultValue={content.seo.canonicalPath}
            />
          </div>
        </CmsManagedForm>
        <CmsPublishBar
          id={section.id}
          section={section.section}
          cmsKey={section.key}
          published={section.published}
          updatedAt={section.updatedAt}
        />
      </div>
    </section>
  );
}
