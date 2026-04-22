import { CmsLinkField } from "@/components/admin/cms-link-field";
import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsImageField } from "@/components/admin/cms-image-field";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsRepeatableList } from "@/components/admin/cms-repeatable-list";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type {
  AdminCmsEditorSection,
  AdminHomepageCmsSections,
} from "@/types/admin";

type SectionCardProps<T> = {
  title: string;
  description: string;
  formType: string;
  section: AdminCmsEditorSection<T>;
  children: ReactNode;
};

const iconOptions = [
  { label: "Building", value: "building" },
  { label: "Check circle", value: "check-circle" },
  { label: "Clock", value: "clock" },
  { label: "Globe", value: "globe" },
  { label: "Headphones", value: "headphones" },
  { label: "Map pin", value: "map-pin" },
  { label: "Package check", value: "package-check" },
  { label: "Route", value: "route" },
  { label: "Shield check", value: "shield-check" },
  { label: "Truck", value: "truck" },
  { label: "Warehouse", value: "warehouse" },
];

function SectionCard<T>({
  title,
  description,
  formType,
  section,
  children,
}: SectionCardProps<T>) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50/40 p-5">
      <CmsSectionHeader
        title={title}
        description={description}
        published={section.published}
      />
      <div className="mt-5 space-y-5">
        <CmsManagedForm
          formType={formType}
          section={section.section}
          cmsKey={section.key}
        >
          {children}
        </CmsManagedForm>
        <CmsPublishBar
          id={section.id}
          section={section.section}
          cmsKey={section.key}
          published={section.published}
          updatedAt={section.updatedAt}
        />
      </div>
    </article>
  );
}

export type HomepageCmsFormProps = {
  sections: AdminHomepageCmsSections;
};

export function HomepageCmsForm({ sections }: HomepageCmsFormProps) {
  const hero = sections.hero.value;
  const trackingPromo = sections.trackingPromo.value;
  const services = sections.services.value;
  const trust = sections.trust.value;
  const coverage = sections.coverage.value;
  const testimonials = sections.testimonials.value;
  const faqPreview = sections.faqPreview.value;
  const cta = sections.cta.value;

  return (
    <section
      id="homepage"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Homepage"
        title="Homepage content"
        description="Edit each visible homepage block with labels that match the public page."
      />
      <div className="mt-6 space-y-5">
        <SectionCard
          title="Hero"
          description="Headline, intro copy, primary actions, stats, tracking visual, and hero image."
          formType="homepage.hero"
          section={sections.hero}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="hero.eyebrow" defaultValue={hero.eyebrow} />
            <CmsTextField label="Headline" name="hero.title" defaultValue={hero.title} />
          </div>
          <CmsTextareaField
            label="Subtitle"
            name="hero.description"
            defaultValue={hero.description}
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <CmsLinkField label="Primary button" name="hero.primaryCta" defaultValue={hero.primaryCta} />
            <CmsLinkField label="Secondary button" name="hero.secondaryCta" defaultValue={hero.secondaryCta} />
          </div>
          <CmsImageField
            label="Hero image"
            name="hero.image"
            defaultImage={hero.image}
          />
          <CmsRepeatableList
            label="Hero stats"
            name="hero.stats"
            addLabel="Add stat"
            emptyItem={{ label: "", value: "", description: "" }}
            items={hero.stats.map((item) => ({
              label: item.label,
              value: item.value,
              description: item.description,
            }))}
            fields={[
              { name: "label", label: "Label" },
              { name: "value", label: "Value" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Tracking card eyebrow" name="hero.visual.eyebrow" defaultValue={hero.visual.eyebrow} />
            <CmsTextField label="Tracking card title" name="hero.visual.title" defaultValue={hero.visual.title} />
            <CmsTextField label="Route" name="hero.visual.route" defaultValue={hero.visual.route} />
            <CmsTextField label="Status label" name="hero.visual.statusLabel" defaultValue={hero.visual.statusLabel} />
          </div>
          <CmsRepeatableList
            label="Tracking timeline"
            name="hero.visual.items"
            addLabel="Add timeline item"
            emptyItem={{
              icon: "package-check",
              title: "",
              description: "",
              meta: "",
              isComplete: false,
            }}
            items={hero.visual.items.map((item) => ({
              icon: item.icon,
              title: item.title,
              description: item.description,
              meta: item.meta,
              isComplete: item.isComplete,
            }))}
            fields={[
              { name: "icon", label: "Icon", type: "select", options: iconOptions },
              { name: "title", label: "Title" },
              { name: "meta", label: "Time or status" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "isComplete", label: "Completed", type: "checkbox" },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Tracking Promo"
          description="The compact shipment tracking prompt near the top of the homepage."
          formType="homepage.trackingPromo"
          section={sections.trackingPromo}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="trackingPromo.eyebrow" defaultValue={trackingPromo.eyebrow} />
            <CmsTextField label="Headline" name="trackingPromo.title" defaultValue={trackingPromo.title} />
            <CmsTextField label="Input label" name="trackingPromo.inputLabel" defaultValue={trackingPromo.inputLabel} />
            <CmsTextField label="Input placeholder" name="trackingPromo.inputPlaceholder" defaultValue={trackingPromo.inputPlaceholder} />
            <CmsTextField label="Button text" name="trackingPromo.submitLabel" defaultValue={trackingPromo.submitLabel} />
            <CmsTextField label="Button link" name="trackingPromo.actionHref" defaultValue={trackingPromo.actionHref} />
          </div>
          <CmsTextareaField
            label="Subtitle"
            name="trackingPromo.description"
            defaultValue={trackingPromo.description}
          />
          <CmsTextField
            label="Helper text"
            name="trackingPromo.helperText"
            defaultValue={trackingPromo.helperText}
          />
        </SectionCard>

        <SectionCard
          title="Services Preview"
          description="Homepage services headline, button, and service cards."
          formType="homepage.services"
          section={sections.services}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="homeServices.eyebrow" defaultValue={services.eyebrow} />
            <CmsTextField label="Headline" name="homeServices.title" defaultValue={services.title} />
          </div>
          <CmsTextareaField
            label="Subtitle"
            name="homeServices.description"
            defaultValue={services.description}
          />
          <CmsLinkField label="Section button" name="homeServices.cta" defaultValue={services.cta} />
          <CmsRepeatableList
            label="Service cards"
            name="homeServices.items"
            addLabel="Add service"
            emptyItem={{ title: "", description: "", href: "/services", icon: "truck" }}
            items={services.items.map((item) => ({
              title: item.title,
              description: item.description,
              href: item.href,
              icon: item.icon,
            }))}
            fields={[
              { name: "title", label: "Title" },
              { name: "href", label: "Link" },
              { name: "icon", label: "Icon", type: "select", options: iconOptions },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Trust Section"
          description="Metrics and feature highlights that build confidence."
          formType="homepage.trust"
          section={sections.trust}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="trust.eyebrow" defaultValue={trust.eyebrow} />
            <CmsTextField label="Headline" name="trust.title" defaultValue={trust.title} />
          </div>
          <CmsTextareaField label="Subtitle" name="trust.description" defaultValue={trust.description} />
          <CmsRepeatableList
            label="Trust metrics"
            name="trust.metrics"
            addLabel="Add metric"
            emptyItem={{ value: "", label: "", description: "" }}
            items={trust.metrics.map((item) => ({
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
          <CmsRepeatableList
            label="Trust features"
            name="trust.features"
            addLabel="Add feature"
            emptyItem={{ title: "", description: "", icon: "check-circle" }}
            items={trust.features.map((item) => ({
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
        </SectionCard>

        <SectionCard
          title="Coverage Section"
          description="Coverage messaging, region tags, operational highlights, and image."
          formType="homepage.coverage"
          section={sections.coverage}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="coverage.eyebrow" defaultValue={coverage.eyebrow} />
            <CmsTextField label="Headline" name="coverage.title" defaultValue={coverage.title} />
          </div>
          <CmsTextareaField label="Subtitle" name="coverage.description" defaultValue={coverage.description} />
          <CmsImageField label="Coverage image" name="coverage.image" defaultImage={coverage.image} />
          <CmsRepeatableList
            label="Coverage regions"
            name="coverage.regions"
            addLabel="Add region"
            emptyItem={{ label: "" }}
            items={coverage.regions.map((label) => ({ label }))}
            fields={[{ name: "label", label: "Region" }]}
          />
          <CmsRepeatableList
            label="Operations"
            name="coverage.operations"
            addLabel="Add operation"
            emptyItem={{ title: "", description: "", icon: "warehouse" }}
            items={coverage.operations.map((item) => ({
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
            label="Coverage metrics"
            name="coverage.metrics"
            addLabel="Add metric"
            emptyItem={{ value: "", label: "", description: "" }}
            items={coverage.metrics.map((item) => ({
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
        </SectionCard>

        <SectionCard
          title="Testimonials / Social Proof"
          description="Customer quote cards displayed below the coverage content."
          formType="homepage.testimonials"
          section={sections.testimonials}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="testimonials.eyebrow" defaultValue={testimonials.eyebrow} />
            <CmsTextField label="Headline" name="testimonials.title" defaultValue={testimonials.title} />
          </div>
          <CmsTextareaField label="Subtitle" name="testimonials.description" defaultValue={testimonials.description} />
          <CmsRepeatableList
            label="Testimonials"
            name="testimonials.items"
            addLabel="Add testimonial"
            emptyItem={{ quote: "", authorName: "", authorTitle: "", companyName: "" }}
            items={testimonials.items.map((item) => ({
              quote: item.quote,
              authorName: item.authorName,
              authorTitle: item.authorTitle,
              companyName: item.companyName,
            }))}
            fields={[
              { name: "quote", label: "Quote", type: "textarea" },
              { name: "authorName", label: "Name" },
              { name: "authorTitle", label: "Title" },
              { name: "companyName", label: "Company" },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="FAQ Preview"
          description="Short FAQ block shown on the homepage."
          formType="homepage.faqPreview"
          section={sections.faqPreview}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="faqPreview.eyebrow" defaultValue={faqPreview.eyebrow} />
            <CmsTextField label="Headline" name="faqPreview.title" defaultValue={faqPreview.title} />
          </div>
          <CmsTextareaField label="Subtitle" name="faqPreview.description" defaultValue={faqPreview.description} />
          <CmsLinkField label="Section button" name="faqPreview.cta" defaultValue={faqPreview.cta} />
          <CmsRepeatableList
            label="FAQ preview items"
            name="faqPreview.items"
            addLabel="Add FAQ"
            emptyItem={{ question: "", answer: "", href: "/faq" }}
            items={faqPreview.items.map((item) => ({
              question: item.question,
              answer: item.answer,
              href: item.href,
            }))}
            fields={[
              { name: "question", label: "Question" },
              { name: "href", label: "Link" },
              { name: "answer", label: "Answer", type: "textarea" },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="CTA"
          description="Final homepage call-to-action block."
          formType="homepage.cta"
          section={sections.cta}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Eyebrow" name="cta.eyebrow" defaultValue={cta.eyebrow} />
            <CmsTextField label="Headline" name="cta.title" defaultValue={cta.title} />
          </div>
          <CmsTextareaField label="Subtitle" name="cta.description" defaultValue={cta.description} />
          <div className="grid gap-5 xl:grid-cols-2">
            <CmsLinkField label="Primary button" name="cta.primaryCta" defaultValue={cta.primaryCta} />
            <CmsLinkField label="Secondary button" name="cta.secondaryCta" defaultValue={cta.secondaryCta} />
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
import type { ReactNode } from "react";
