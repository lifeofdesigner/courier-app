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
import type {
  CmsIconName,
  HeroSectionContent,
  HeroSlideContent,
  HomepageEnhancementsContent,
  HomepageModeCode,
  HomepageScrollEffect,
  HomepageTextEffect,
} from "@/types/cms";
import type { ReactNode } from "react";

type SectionCardProps<T> = {
  title: string;
  description: string;
  formType: string;
  section: AdminCmsEditorSection<T>;
  defaultOpen?: boolean;
  children: ReactNode;
};

const iconOptions: {
  label: string;
  value: CmsIconName;
}[] = [
  { label: "Air", value: "air" },
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

const modeOptions: {
  label: string;
  value: HomepageModeCode;
}[] = [
  { label: "Air", value: "air" },
  { label: "Road", value: "road" },
  { label: "Freight", value: "freight" },
];

const scrollEffectOptions: {
  label: string;
  value: HomepageScrollEffect;
}[] = [
  { label: "No transition", value: "none" },
  { label: "Fade up", value: "fade-up" },
  { label: "Slide from left", value: "slide-left" },
  { label: "Slide from right", value: "slide-right" },
  { label: "Zoom in", value: "zoom-in" },
];

const textEffectOptions: {
  label: string;
  value: HomepageTextEffect;
}[] = [
  { label: "No text effect", value: "none" },
  { label: "Soft fade", value: "soft-fade" },
  { label: "Rise", value: "rise" },
  { label: "Focus", value: "focus" },
];

const fallbackSlideImages = [
  {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
    alt: "Freight truck moving along a highway at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85",
    alt: "Cargo containers stacked at a logistics terminal",
  },
  {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=85",
    alt: "Warehouse team preparing packages for dispatch",
  },
];

function getHeroSlideDefaults(hero: HeroSectionContent): HeroSlideContent[] {
  const fallbackSlides: HeroSlideContent[] = [
    {
      eyebrow: hero.eyebrow,
      title: hero.title,
      description: hero.description,
      statusLabel: hero.visual.statusLabel,
      image: hero.image ?? fallbackSlideImages[0],
    },
    {
      eyebrow: hero.visual.eyebrow,
      title: "Live shipment visibility from pickup to delivery.",
      description: `${hero.visual.title} is moving on ${hero.visual.route}. Follow the same kind of checkpoints your customers expect from a modern courier partner.`,
      statusLabel: hero.visual.statusLabel,
      image: fallbackSlideImages[1],
    },
    {
      eyebrow: "Logistics transportation",
      title: "The bridge between urgent pickups and confident proof.",
      description:
        "Coordinate courier, cargo, and freight movement with clear service choices, customer-ready tracking, and operations support at every handoff.",
      statusLabel: "Dispatch ready",
      image: fallbackSlideImages[2],
    },
  ];

  return fallbackSlides.map((fallbackSlide, index) => {
    const savedSlide = hero.slides?.[index];

    return {
      ...fallbackSlide,
      ...savedSlide,
      image: savedSlide?.image ?? fallbackSlide.image,
    };
  });
}

function CmsSelectField<T extends string>({
  label,
  name,
  defaultValue,
  options,
  helpText,
}: {
  label: string;
  name: string;
  defaultValue: T;
  options: { label: string; value: T }[];
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#2b1d16]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}

function CmsCheckboxField({
  label,
  name,
  defaultChecked,
  helpText,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
  helpText?: string;
}) {
  return (
    <label className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-[#2b1d16]">
      <input
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#b0825f] focus:ring-[#b0825f]"
      />
      <span>
        <span className="block">{label}</span>
        {helpText ? (
          <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">
            {helpText}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function getModeServiceItems(enhancements: HomepageEnhancementsContent) {
  return enhancements.modeServices.items.length > 0
    ? enhancements.modeServices.items
    : [];
}

function getQuoteModes(enhancements: HomepageEnhancementsContent) {
  return enhancements.quoteCta.modes.length > 0
    ? enhancements.quoteCta.modes
    : [];
}

function SectionCard<T>({
  title,
  description,
  formType,
  section,
  defaultOpen,
  children,
}: SectionCardProps<T>) {
  return (
    <details
      className="rounded-[24px] border border-slate-200 bg-slate-50/50 p-5"
      name="homepage-cms-panels"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <span>
          <span className="block text-lg font-bold tracking-tight text-[#2b1d16]">
            {title}
          </span>
          <span className="mt-2 block max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </span>
        </span>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
            section.published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {section.published ? "Published" : "Draft"}
        </span>
      </summary>
      <div className="mt-6 space-y-6">
        <CmsPublishBar
          id={section.id}
          section={section.section}
          cmsKey={section.key}
          published={section.published}
          updatedAt={section.updatedAt}
        />
        <CmsManagedForm
          formType={formType}
          section={section.section}
          cmsKey={section.key}
        >
          {children}
        </CmsManagedForm>
      </div>
    </details>
  );
}

export type HomepageCmsFormProps = {
  sections: AdminHomepageCmsSections;
};

export function HomepageCmsForm({ sections }: HomepageCmsFormProps) {
  const hero = sections.hero.value;
  const heroSlides = getHeroSlideDefaults(hero);
  const trackingPromo = sections.trackingPromo.value;
  const services = sections.services.value;
  const enhancements = sections.enhancements.value;
  const modeServiceItems = getModeServiceItems(enhancements);
  const quoteModes = getQuoteModes(enhancements);
  const trust = sections.trust.value;
  const coverage = sections.coverage.value;
  const testimonials = sections.testimonials.value;
  const faqPreview = sections.faqPreview.value;
  const cta = sections.cta.value;
  const seo = sections.seo.value;

  return (
    <section
      id="homepage"
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="Homepage"
        title="Homepage content"
        description="Edit each visible homepage block with labels that match the public page."
      />
      <div className="mt-8 space-y-6">
        <SectionCard
          title="Hero"
          description="Headline, slider slides, primary actions, stats, tracking visual, and hero images."
          formType="homepage.hero"
          section={sections.hero}
          defaultOpen
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
          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Homepage transitions
            </legend>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Control how homepage sections and headline text reveal as visitors
              scroll down the public page.
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <CmsSelectField
                label="Section scroll transition"
                name="hero.motion.scrollEffect"
                defaultValue={hero.motion?.scrollEffect ?? "fade-up"}
                options={scrollEffectOptions}
              />
              <CmsSelectField
                label="Text effect"
                name="hero.motion.textEffect"
                defaultValue={hero.motion?.textEffect ?? "rise"}
                options={textEffectOptions}
              />
            </div>
          </fieldset>
          <CmsImageField
            label="Hero image"
            name="hero.image"
            defaultImage={hero.image}
          />
          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Hero slider slides
            </legend>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              These three slides control the rotating homepage hero. The button
              labels and links above are shared across the slider.
            </p>
            <input type="hidden" name="hero.slides.__count" value={heroSlides.length} />
            <div className="mt-4 space-y-5">
              {heroSlides.map((slide, index) => (
                <div
                  key={`hero-slide-${index}`}
                  className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <h3 className="text-sm font-bold text-[#2b1d16]">
                    Slide {index + 1}
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <CmsTextField
                      label="Eyebrow"
                      name={`hero.slides.${index}.eyebrow`}
                      defaultValue={slide.eyebrow}
                    />
                    <CmsTextField
                      label="Status label"
                      name={`hero.slides.${index}.statusLabel`}
                      defaultValue={slide.statusLabel}
                    />
                  </div>
                  <div className="mt-5">
                    <CmsTextField
                      label="Headline"
                      name={`hero.slides.${index}.title`}
                      defaultValue={slide.title}
                    />
                  </div>
                  <div className="mt-5">
                    <CmsTextareaField
                      label="Subtitle"
                      name={`hero.slides.${index}.description`}
                      defaultValue={slide.description}
                      rows={3}
                    />
                  </div>
                  <div className="mt-5">
                    <CmsImageField
                      label={`Slide ${index + 1} image`}
                      name={`hero.slides.${index}.image`}
                      defaultImage={slide.image}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
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
          title="Homepage Upgrades"
          description="Premium homepage blocks: mode service image cards, workflow section, and mode selector quote call-to-action."
          formType="homepage.enhancements"
          section={sections.enhancements}
        >
          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Public section visibility
            </legend>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <CmsCheckboxField
                label="Show mode service cards"
                name="enhancements.visibility.modeServices"
                defaultChecked={enhancements.visibility.modeServices}
              />
              <CmsCheckboxField
                label="Show workflow section"
                name="enhancements.visibility.workflow"
                defaultChecked={enhancements.visibility.workflow}
              />
              <CmsCheckboxField
                label="Show quote mode selector"
                name="enhancements.visibility.quoteCta"
                defaultChecked={enhancements.visibility.quoteCta}
              />
            </div>
          </fieldset>

          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Mode service image cards
            </legend>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <CmsTextField
                label="Eyebrow"
                name="enhancements.modeServices.eyebrow"
                defaultValue={enhancements.modeServices.eyebrow}
              />
              <CmsTextField
                label="Headline"
                name="enhancements.modeServices.title"
                defaultValue={enhancements.modeServices.title}
              />
            </div>
            <div className="mt-5">
              <CmsTextareaField
                label="Subtitle"
                name="enhancements.modeServices.description"
                defaultValue={enhancements.modeServices.description}
              />
            </div>
            <input
              type="hidden"
              name="enhancements.modeServices.items.__count"
              value={modeServiceItems.length}
            />
            <div className="mt-5 space-y-5">
              {modeServiceItems.map((item, index) => (
                <div
                  key={`${item.mode}-${index}`}
                  className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <h3 className="text-sm font-bold text-[#2b1d16]">
                    {item.mode.toUpperCase()} card
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <CmsSelectField
                      label="Transport mode"
                      name={`enhancements.modeServices.items.${index}.mode`}
                      defaultValue={item.mode}
                      options={modeOptions}
                    />
                    <CmsSelectField
                      label="Icon"
                      name={`enhancements.modeServices.items.${index}.icon`}
                      defaultValue={item.icon}
                      options={iconOptions}
                    />
                    <CmsTextField
                      label="Eyebrow"
                      name={`enhancements.modeServices.items.${index}.eyebrow`}
                      defaultValue={item.eyebrow}
                    />
                    <CmsTextField
                      label="Headline"
                      name={`enhancements.modeServices.items.${index}.title`}
                      defaultValue={item.title}
                    />
                    <CmsTextField
                      label="Button text"
                      name={`enhancements.modeServices.items.${index}.ctaLabel`}
                      defaultValue={item.ctaLabel}
                    />
                    <CmsTextField
                      label="Button link"
                      name={`enhancements.modeServices.items.${index}.href`}
                      defaultValue={item.href}
                    />
                  </div>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <CmsTextareaField
                      label="Description"
                      name={`enhancements.modeServices.items.${index}.description`}
                      defaultValue={item.description}
                      rows={4}
                    />
                    <CmsTextareaField
                      label="Highlights"
                      name={`enhancements.modeServices.items.${index}.highlights`}
                      defaultValue={item.highlights.join("\n")}
                      helpText="Enter one service type per line."
                      rows={4}
                    />
                  </div>
                  <div className="mt-5">
                    <CmsImageField
                      label={`${item.mode.toUpperCase()} service image`}
                      name={`enhancements.modeServices.items.${index}.image`}
                      defaultImage={item.image}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Workflow section
            </legend>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <CmsTextField
                label="Eyebrow"
                name="enhancements.workflow.eyebrow"
                defaultValue={enhancements.workflow.eyebrow}
              />
              <CmsTextField
                label="Headline"
                name="enhancements.workflow.title"
                defaultValue={enhancements.workflow.title}
              />
              <CmsTextField
                label="Badge label"
                name="enhancements.workflow.badgeLabel"
                defaultValue={enhancements.workflow.badgeLabel}
              />
              <CmsTextField
                label="Badge value"
                name="enhancements.workflow.badgeValue"
                defaultValue={enhancements.workflow.badgeValue}
              />
            </div>
            <div className="mt-5">
              <CmsTextareaField
                label="Subtitle"
                name="enhancements.workflow.description"
                defaultValue={enhancements.workflow.description}
              />
            </div>
            <div className="mt-5">
              <CmsImageField
                label="Workflow image"
                name="enhancements.workflow.image"
                defaultImage={enhancements.workflow.image}
              />
            </div>
            <div className="mt-5">
              <CmsRepeatableList
                label="Workflow steps"
                name="enhancements.workflow.steps"
                addLabel="Add workflow step"
                emptyItem={{ title: "", description: "", icon: "route" }}
                items={enhancements.workflow.steps.map((item) => ({
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
            </div>
          </fieldset>

          <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
            <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
              Quote mode selector
            </legend>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <CmsTextField
                label="Eyebrow"
                name="enhancements.quoteCta.eyebrow"
                defaultValue={enhancements.quoteCta.eyebrow}
              />
              <CmsTextField
                label="Headline"
                name="enhancements.quoteCta.title"
                defaultValue={enhancements.quoteCta.title}
              />
            </div>
            <div className="mt-5">
              <CmsTextareaField
                label="Subtitle"
                name="enhancements.quoteCta.description"
                defaultValue={enhancements.quoteCta.description}
              />
            </div>
            <input
              type="hidden"
              name="enhancements.quoteCta.modes.__count"
              value={quoteModes.length}
            />
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {quoteModes.map((mode, index) => (
                <div
                  key={`${mode.mode}-${index}`}
                  className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <CmsSelectField
                    label="Transport mode"
                    name={`enhancements.quoteCta.modes.${index}.mode`}
                    defaultValue={mode.mode}
                    options={modeOptions}
                  />
                  <div className="mt-4">
                    <CmsTextField
                      label="Title"
                      name={`enhancements.quoteCta.modes.${index}.title`}
                      defaultValue={mode.title}
                    />
                  </div>
                  <div className="mt-4">
                    <CmsTextField
                      label="Link"
                      name={`enhancements.quoteCta.modes.${index}.href`}
                      defaultValue={mode.href}
                    />
                  </div>
                  <div className="mt-4">
                    <CmsTextareaField
                      label="Description"
                      name={`enhancements.quoteCta.modes.${index}.description`}
                      defaultValue={mode.description}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
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

        <SectionCard
          title="SEO"
          description="Homepage search metadata and social sharing image."
          formType="homepage.seo"
          section={sections.seo}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="SEO title" name="seo.title" defaultValue={seo.title} />
            <CmsTextField
              label="Canonical path"
              name="seo.canonicalPath"
              defaultValue={seo.canonicalPath}
            />
          </div>
          <CmsTextareaField
            label="SEO description"
            name="seo.description"
            defaultValue={seo.description}
          />
          <CmsTextField
            label="Keywords"
            name="seo.keywords"
            defaultValue={seo.keywords?.join(", ")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Social title"
              name="seo.openGraphTitle"
              defaultValue={seo.openGraphTitle}
            />
            <CmsTextField
              label="Social description"
              name="seo.openGraphDescription"
              defaultValue={seo.openGraphDescription}
            />
          </div>
          <CmsImageField
            label="Social sharing image"
            name="seo.openGraphImage"
            defaultImage={seo.openGraphImage}
          />
        </SectionCard>
      </div>
    </section>
  );
}
