"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { formDataToValues } from "@/lib/forms/preserve";
import { uploadCmsAsset } from "@/lib/storage/cms-assets";
import type { AdminActionState } from "@/types/admin";
import type {
  AboutPageContent,
  CmsIconName,
  CmsImage,
  ContactInfoContent,
  FAQPageContent,
  FooterContent,
  HeroSectionContent,
  ServicePreviewSectionContent,
  ServicesPageContent,
  SiteIdentityContent,
} from "@/types/cms";

type CmsUploadState = AdminActionState & {
  publicUrl?: string;
  path?: string;
};

type AdminContext = Awaited<ReturnType<typeof assertAdminAction>>;

const cmsSectionSchema = z.object({
  section: z.string().trim().min(1, "Enter a section."),
  key: z.string().trim().min(1, "Enter a key."),
  payload: z.string().trim().min(2, "Enter a JSON payload."),
});

const toggleSchema = z.object({
  id: z.string().trim().optional(),
  section: z.string().trim().optional(),
  key: z.string().trim().optional(),
  published: z.enum(["true", "false"]),
});

const editorFormSchema = z.object({
  formType: z.string().trim().min(1, "Choose a CMS section."),
  section: z.string().trim().min(1, "Choose a CMS section."),
  key: z.string().trim().min(1, "Choose a CMS section."),
});

const cmsIconNames = [
  "building",
  "check-circle",
  "clock",
  "globe",
  "headphones",
  "map-pin",
  "package-check",
  "route",
  "shield-check",
  "truck",
  "warehouse",
] as const satisfies readonly CmsIconName[];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key).trim();

  return value.length > 0 ? value : undefined;
}

function getBoolean(formData: FormData, key: string) {
  const value = formData.get(key);

  return value === "true" || value === "on";
}

function getIcon(formData: FormData, key: string, fallback: CmsIconName) {
  const value = getString(formData, key);

  return cmsIconNames.includes(value as CmsIconName)
    ? (value as CmsIconName)
    : fallback;
}

function getCount(formData: FormData, key: string) {
  const value = Number.parseInt(getString(formData, `${key}.__count`), 10);

  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function parseJsonPayload(payload: string) {
  try {
    return {
      data: JSON.parse(payload) as unknown,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Enter valid JSON.",
    };
  }
}

async function readCmsImage({
  formData,
  name,
  folder,
  defaultAlt,
}: {
  formData: FormData;
  name: string;
  folder: string;
  defaultAlt: string;
}): Promise<CmsImage | undefined> {
  if (getBoolean(formData, `${name}.remove`)) {
    return undefined;
  }

  const file = formData.get(`${name}.file`);
  let src = getString(formData, name).trim();

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/") && file.type !== "image/x-icon") {
      throw new Error("Only image uploads are supported for CMS assets.");
    }

    const uploaded = await uploadCmsAsset({ file, folder });
    src = uploaded.publicUrl;
  }

  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: getOptionalString(formData, `${name}.alt`) ?? defaultAlt,
  };
}

function readLink(formData: FormData, name: string) {
  const ariaLabel = getOptionalString(formData, `${name}.ariaLabel`);

  return {
    label: getString(formData, `${name}.label`).trim(),
    href: getString(formData, `${name}.href`).trim(),
    ...(ariaLabel ? { ariaLabel } : {}),
  };
}

function readSeo(formData: FormData, name: string, image?: CmsImage) {
  const keywords = splitKeywords(getString(formData, `${name}.keywords`));
  const openGraphTitle = getOptionalString(formData, `${name}.openGraphTitle`);
  const openGraphDescription = getOptionalString(
    formData,
    `${name}.openGraphDescription`,
  );
  const canonicalPath = getOptionalString(formData, `${name}.canonicalPath`);

  return {
    title: getString(formData, `${name}.title`).trim(),
    description: getString(formData, `${name}.description`).trim(),
    ...(keywords.length > 0 ? { keywords } : {}),
    ...(openGraphTitle ? { openGraphTitle } : {}),
    ...(openGraphDescription ? { openGraphDescription } : {}),
    ...(image ? { openGraphImage: image } : {}),
    ...(canonicalPath ? { canonicalPath } : {}),
  };
}

function readHeroStats(formData: FormData, name: string) {
  return Array.from({ length: getCount(formData, name) }, (_, index) => ({
    label: getString(formData, `${name}.${index}.label`).trim(),
    value: getString(formData, `${name}.${index}.value`).trim(),
    description: getOptionalString(formData, `${name}.${index}.description`),
  })).filter((item) => item.label || item.value || item.description);
}

async function readHeroSlides(
  formData: FormData,
): Promise<NonNullable<HeroSectionContent["slides"]>> {
  const slides: NonNullable<HeroSectionContent["slides"]> = [];

  for (let index = 0; index < getCount(formData, "hero.slides"); index += 1) {
    const title = getString(formData, `hero.slides.${index}.title`).trim();
    const image = await readCmsImage({
      formData,
      name: `hero.slides.${index}.image`,
      folder: "homepage/hero/slides",
      defaultAlt: title || `Homepage hero slide ${index + 1}`,
    });
    const slide = {
      eyebrow: getString(formData, `hero.slides.${index}.eyebrow`).trim(),
      title,
      description: getString(
        formData,
        `hero.slides.${index}.description`,
      ).trim(),
      statusLabel: getString(
        formData,
        `hero.slides.${index}.statusLabel`,
      ).trim(),
      ...(image ? { image } : {}),
    };

    if (slide.eyebrow && slide.title && slide.description && slide.statusLabel) {
      slides.push(slide);
    }
  }

  return slides;
}

function readFeatureHighlights(formData: FormData, name: string) {
  return Array.from({ length: getCount(formData, name) }, (_, index) => ({
    title: getString(formData, `${name}.${index}.title`).trim(),
    description: getString(formData, `${name}.${index}.description`).trim(),
    icon: getIcon(formData, `${name}.${index}.icon`, "check-circle"),
  })).filter((item) => item.title || item.description);
}

function readMetrics(formData: FormData, name: string) {
  return Array.from({ length: getCount(formData, name) }, (_, index) => ({
    value: getString(formData, `${name}.${index}.value`).trim(),
    label: getString(formData, `${name}.${index}.label`).trim(),
    description: getOptionalString(formData, `${name}.${index}.description`),
  })).filter((item) => item.value || item.label || item.description);
}

function readTextList(formData: FormData, name: string, fieldName: string) {
  return Array.from({ length: getCount(formData, name) }, (_, index) =>
    getString(formData, `${name}.${index}.${fieldName}`).trim(),
  ).filter(Boolean);
}

function readFaqItems(formData: FormData, name: string) {
  return Array.from({ length: getCount(formData, name) }, (_, index) => {
    const href = getOptionalString(formData, `${name}.${index}.href`);

    return {
      question: getString(formData, `${name}.${index}.question`).trim(),
      answer: getString(formData, `${name}.${index}.answer`).trim(),
      ...(href ? { href } : {}),
    };
  }).filter((item) => item.question || item.answer);
}

async function buildSiteIdentityPayload(
  formData: FormData,
): Promise<SiteIdentityContent> {
  const siteName = getString(formData, "siteIdentity.siteName").trim();
  const logo = await readCmsImage({
    formData,
    name: "siteIdentity.logo",
    folder: "site/logo",
    defaultAlt: `${siteName || "Site"} logo`,
  });
  const favicon = await readCmsImage({
    formData,
    name: "siteIdentity.favicon",
    folder: "site/favicon",
    defaultAlt: `${siteName || "Site"} favicon`,
  });

  return {
    siteName,
    ...(logo ? { logo } : {}),
    ...(favicon ? { favicon } : {}),
    supportEmail: getString(formData, "siteIdentity.supportEmail").trim(),
    supportPhone: getString(formData, "siteIdentity.supportPhone").trim(),
    operatingHours: getString(formData, "siteIdentity.operatingHours").trim(),
    companyAddress: getString(formData, "siteIdentity.companyAddress").trim(),
    footerNotice: getString(formData, "siteIdentity.footerNotice").trim(),
  };
}

async function buildHomepageHeroPayload(
  formData: FormData,
): Promise<HeroSectionContent> {
  const image = await readCmsImage({
    formData,
    name: "hero.image",
    folder: "homepage/hero",
    defaultAlt: "Courier delivery hero image",
  });
  const slides = await readHeroSlides(formData);

  return {
    eyebrow: getString(formData, "hero.eyebrow").trim(),
    title: getString(formData, "hero.title").trim(),
    description: getString(formData, "hero.description").trim(),
    primaryCta: readLink(formData, "hero.primaryCta"),
    secondaryCta: readLink(formData, "hero.secondaryCta"),
    stats: readHeroStats(formData, "hero.stats"),
    visual: {
      eyebrow: getString(formData, "hero.visual.eyebrow").trim(),
      title: getString(formData, "hero.visual.title").trim(),
      route: getString(formData, "hero.visual.route").trim(),
      statusLabel: getString(formData, "hero.visual.statusLabel").trim(),
      items: Array.from(
        { length: getCount(formData, "hero.visual.items") },
        (_, index) => ({
          icon: getIcon(
            formData,
            `hero.visual.items.${index}.icon`,
            "package-check",
          ),
          title: getString(formData, `hero.visual.items.${index}.title`).trim(),
          description: getString(
            formData,
            `hero.visual.items.${index}.description`,
          ).trim(),
          meta: getString(formData, `hero.visual.items.${index}.meta`).trim(),
          isComplete: getBoolean(
            formData,
            `hero.visual.items.${index}.isComplete`,
          ),
        }),
      ).filter((item) => item.title || item.description || item.meta),
    },
    ...(image ? { image } : {}),
    ...(slides.length > 0 ? { slides } : {}),
  };
}

function buildTrackingPromoPayload(formData: FormData) {
  const description = getOptionalString(formData, "trackingPromo.description");
  const helperText = getOptionalString(formData, "trackingPromo.helperText");

  return {
    eyebrow: getString(formData, "trackingPromo.eyebrow").trim(),
    title: getString(formData, "trackingPromo.title").trim(),
    ...(description ? { description } : {}),
    inputLabel: getString(formData, "trackingPromo.inputLabel").trim(),
    inputPlaceholder: getString(
      formData,
      "trackingPromo.inputPlaceholder",
    ).trim(),
    submitLabel: getString(formData, "trackingPromo.submitLabel").trim(),
    actionHref: getString(formData, "trackingPromo.actionHref").trim(),
    ...(helperText ? { helperText } : {}),
  };
}

function buildHomepageServicesPayload(
  formData: FormData,
): ServicePreviewSectionContent {
  return {
    eyebrow: getString(formData, "homeServices.eyebrow").trim(),
    title: getString(formData, "homeServices.title").trim(),
    description: getString(formData, "homeServices.description").trim(),
    cta: readLink(formData, "homeServices.cta"),
    items: Array.from(
      { length: getCount(formData, "homeServices.items") },
      (_, index) => ({
        title: getString(formData, `homeServices.items.${index}.title`).trim(),
        description: getString(
          formData,
          `homeServices.items.${index}.description`,
        ).trim(),
        href: getString(formData, `homeServices.items.${index}.href`).trim(),
        icon: getIcon(formData, `homeServices.items.${index}.icon`, "truck"),
      }),
    ).filter((item) => item.title || item.description || item.href),
  };
}

async function buildHomepageCoveragePayload(formData: FormData) {
  const image = await readCmsImage({
    formData,
    name: "coverage.image",
    folder: "homepage/coverage",
    defaultAlt: "Courier coverage image",
  });

  return {
    eyebrow: getString(formData, "coverage.eyebrow").trim(),
    title: getString(formData, "coverage.title").trim(),
    description: getString(formData, "coverage.description").trim(),
    regions: readTextList(formData, "coverage.regions", "label"),
    operations: readFeatureHighlights(formData, "coverage.operations"),
    metrics: readMetrics(formData, "coverage.metrics"),
    ...(image ? { image } : {}),
  };
}

function buildHomepageTestimonialsPayload(formData: FormData) {
  const description = getOptionalString(formData, "testimonials.description");

  return {
    eyebrow: getString(formData, "testimonials.eyebrow").trim(),
    title: getString(formData, "testimonials.title").trim(),
    ...(description ? { description } : {}),
    items: Array.from(
      { length: getCount(formData, "testimonials.items") },
      (_, index) => ({
        quote: getString(formData, `testimonials.items.${index}.quote`).trim(),
        authorName: getString(
          formData,
          `testimonials.items.${index}.authorName`,
        ).trim(),
        authorTitle: getString(
          formData,
          `testimonials.items.${index}.authorTitle`,
        ).trim(),
        companyName: getString(
          formData,
          `testimonials.items.${index}.companyName`,
        ).trim(),
      }),
    ).filter((item) => item.quote || item.authorName || item.companyName),
  };
}

function buildHomepageFaqPreviewPayload(formData: FormData) {
  const description = getOptionalString(formData, "faqPreview.description");

  return {
    eyebrow: getString(formData, "faqPreview.eyebrow").trim(),
    title: getString(formData, "faqPreview.title").trim(),
    ...(description ? { description } : {}),
    cta: readLink(formData, "faqPreview.cta"),
    items: readFaqItems(formData, "faqPreview.items"),
  };
}

function buildHomepageCtaPayload(formData: FormData) {
  const description = getOptionalString(formData, "cta.description");
  const secondaryHref = getOptionalString(formData, "cta.secondaryCta.href");
  const secondaryLabel = getOptionalString(formData, "cta.secondaryCta.label");

  return {
    eyebrow: getString(formData, "cta.eyebrow").trim(),
    title: getString(formData, "cta.title").trim(),
    ...(description ? { description } : {}),
    primaryCta: readLink(formData, "cta.primaryCta"),
    ...(secondaryHref && secondaryLabel
      ? { secondaryCta: readLink(formData, "cta.secondaryCta") }
      : {}),
  };
}

async function buildHomepageSeoPayload(formData: FormData) {
  const image = await readCmsImage({
    formData,
    name: "seo.openGraphImage",
    folder: "seo/open-graph",
    defaultAlt: "Open graph preview image",
  });

  return readSeo(formData, "seo", image);
}

function buildServicesPagePayload(formData: FormData): ServicesPageContent {
  return {
    hero: {
      eyebrow: getString(formData, "servicesPage.hero.eyebrow").trim(),
      title: getString(formData, "servicesPage.hero.title").trim(),
      description: getString(
        formData,
        "servicesPage.hero.description",
      ).trim(),
      primaryCta: readLink(formData, "servicesPage.hero.primaryCta"),
      secondaryCta: readLink(formData, "servicesPage.hero.secondaryCta"),
    },
    services: Array.from(
      { length: getCount(formData, "servicesPage.services") },
      (_, index) => ({
        title: getString(formData, `servicesPage.services.${index}.title`).trim(),
        description: getString(
          formData,
          `servicesPage.services.${index}.description`,
        ).trim(),
        icon: getIcon(
          formData,
          `servicesPage.services.${index}.icon`,
          "package-check",
        ),
        bullets: splitLines(
          getString(formData, `servicesPage.services.${index}.bullets`),
        ),
      }),
    ).filter((item) => item.title || item.description),
    workflow: {
      title: getString(formData, "servicesPage.workflow.title").trim(),
      description: getString(
        formData,
        "servicesPage.workflow.description",
      ).trim(),
      steps: Array.from(
        { length: getCount(formData, "servicesPage.workflow.steps") },
        (_, index) => ({
          title: getString(
            formData,
            `servicesPage.workflow.steps.${index}.title`,
          ).trim(),
          description: getString(
            formData,
            `servicesPage.workflow.steps.${index}.description`,
          ).trim(),
        }),
      ).filter((item) => item.title || item.description),
    },
    supportHighlights: readFeatureHighlights(
      formData,
      "servicesPage.supportHighlights",
    ),
    seo: readSeo(formData, "servicesPage.seo"),
  };
}

function buildAboutPagePayload(formData: FormData): AboutPageContent {
  return {
    hero: {
      eyebrow: getString(formData, "aboutPage.hero.eyebrow").trim(),
      title: getString(formData, "aboutPage.hero.title").trim(),
      description: getString(formData, "aboutPage.hero.description").trim(),
    },
    story: {
      eyebrow: getString(formData, "aboutPage.story.eyebrow").trim(),
      title: getString(formData, "aboutPage.story.title").trim(),
      paragraphs: readTextList(formData, "aboutPage.story.paragraphs", "text"),
      stats: readMetrics(formData, "aboutPage.story.stats"),
    },
    values: {
      title: getString(formData, "aboutPage.values.title").trim(),
      description: getString(formData, "aboutPage.values.description").trim(),
      items: readFeatureHighlights(formData, "aboutPage.values.items"),
    },
    reasons: readTextList(formData, "aboutPage.reasons", "text"),
    cta: {
      eyebrow: getString(formData, "aboutPage.cta.eyebrow").trim(),
      title: getString(formData, "aboutPage.cta.title").trim(),
      description: getOptionalString(formData, "aboutPage.cta.description"),
      primaryCta: readLink(formData, "aboutPage.cta.primaryCta"),
      secondaryCta: readLink(formData, "aboutPage.cta.secondaryCta"),
    },
    seo: readSeo(formData, "aboutPage.seo"),
  };
}

function buildFaqPagePayload(formData: FormData): FAQPageContent {
  const flatItems = Array.from(
    { length: getCount(formData, "faqPage.items") },
    (_, index) => ({
      group: getString(formData, `faqPage.items.${index}.group`).trim(),
      question: getString(formData, `faqPage.items.${index}.question`).trim(),
      answer: getString(formData, `faqPage.items.${index}.answer`).trim(),
    }),
  ).filter((item) => item.group || item.question || item.answer);
  const groups = flatItems.reduce<FAQPageContent["groups"]>((items, item) => {
    const title = item.group || "General";
    const existing = items.find((group) => group.title === title);
    const faqItem = {
      question: item.question,
      answer: item.answer,
    };

    if (existing) {
      existing.items.push(faqItem);
      return items;
    }

    return [...items, { title, items: [faqItem] }];
  }, []);

  return {
    hero: {
      eyebrow: getString(formData, "faqPage.hero.eyebrow").trim(),
      title: getString(formData, "faqPage.hero.title").trim(),
      description: getString(formData, "faqPage.hero.description").trim(),
    },
    groups,
    supportCta: {
      title: getString(formData, "faqPage.supportCta.title").trim(),
      description: getString(
        formData,
        "faqPage.supportCta.description",
      ).trim(),
      cta: readLink(formData, "faqPage.supportCta.cta"),
    },
    seo: readSeo(formData, "faqPage.seo"),
  };
}

function buildContactPayload(formData: FormData): ContactInfoContent {
  return {
    eyebrow: getString(formData, "contact.eyebrow").trim(),
    title: getString(formData, "contact.title").trim(),
    description: getString(formData, "contact.description").trim(),
    email: getString(formData, "contact.email").trim(),
    phone: getString(formData, "contact.phone").trim(),
    operatingHours: getString(formData, "contact.operatingHours").trim(),
    address: getString(formData, "contact.address").trim(),
  };
}

function buildFooterPayload(formData: FormData): FooterContent {
  return {
    notice: getString(formData, "footer.notice").trim(),
    supportEmail: getString(formData, "footer.supportEmail").trim(),
    supportPhone: getString(formData, "footer.supportPhone").trim(),
    operatingHours: getString(formData, "footer.operatingHours").trim(),
    address: getString(formData, "footer.address").trim(),
  };
}

async function buildEditorPayload(formType: string, formData: FormData) {
  switch (formType) {
    case "site.identity":
      return buildSiteIdentityPayload(formData);
    case "homepage.hero":
      return buildHomepageHeroPayload(formData);
    case "homepage.trackingPromo":
      return buildTrackingPromoPayload(formData);
    case "homepage.services":
      return buildHomepageServicesPayload(formData);
    case "homepage.trust":
      return {
        eyebrow: getString(formData, "trust.eyebrow").trim(),
        title: getString(formData, "trust.title").trim(),
        description: getString(formData, "trust.description").trim(),
        metrics: readMetrics(formData, "trust.metrics"),
        features: readFeatureHighlights(formData, "trust.features"),
      };
    case "homepage.coverage":
      return buildHomepageCoveragePayload(formData);
    case "homepage.testimonials":
      return buildHomepageTestimonialsPayload(formData);
    case "homepage.faqPreview":
      return buildHomepageFaqPreviewPayload(formData);
    case "homepage.cta":
      return buildHomepageCtaPayload(formData);
    case "homepage.seo":
      return buildHomepageSeoPayload(formData);
    case "servicesPage.content":
      return buildServicesPagePayload(formData);
    case "aboutPage.content":
      return buildAboutPagePayload(formData);
    case "contact.info":
      return buildContactPayload(formData);
    case "faqPage.content":
      return buildFaqPagePayload(formData);
    case "footer.content":
      return buildFooterPayload(formData);
    default:
      throw new Error("This CMS section is not configured yet.");
  }
}

async function upsertSiteSetting(
  { supabase, profile }: AdminContext,
  key: string,
  value: unknown,
) {
  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      value,
      updated_by: profile.id,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "key",
    },
  );

  if (error) {
    throw new Error("Site settings could not be synced.");
  }
}

async function syncPublishedCmsToSettings(
  context: AdminContext,
  section: string,
  key: string,
  value: unknown,
) {
  if (section === "site" && key === "identity") {
    const payload = value as SiteIdentityContent;

    await Promise.all([
      upsertSiteSetting(context, "site_identity", {
        siteName: payload.siteName,
        logo: payload.logo ?? null,
        favicon: payload.favicon ?? null,
      }),
      upsertSiteSetting(context, "company_contact", {
        email: payload.supportEmail,
        phone: payload.supportPhone,
        address: payload.companyAddress,
      }),
      upsertSiteSetting(context, "support_hours", {
        label: payload.operatingHours,
      }),
      upsertSiteSetting(context, "footer_notice", {
        text: payload.footerNotice,
      }),
    ]);
  }

  if (section === "contact" && key === "info") {
    const payload = value as ContactInfoContent;

    await Promise.all([
      upsertSiteSetting(context, "company_contact", {
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
      }),
      upsertSiteSetting(context, "support_hours", {
        label: payload.operatingHours,
      }),
    ]);
  }

  if (section === "footer" && key === "content") {
    const payload = value as FooterContent;

    await Promise.all([
      upsertSiteSetting(context, "footer_notice", {
        text: payload.notice,
      }),
      upsertSiteSetting(context, "company_contact", {
        email: payload.supportEmail,
        phone: payload.supportPhone,
        address: payload.address,
      }),
      upsertSiteSetting(context, "support_hours", {
        label: payload.operatingHours,
      }),
    ]);
  }
}

function revalidateCmsPaths() {
  revalidatePath("/", "layout");

  for (const path of [
    "/",
    "/about",
    "/admin",
    "/admin/cms",
    "/admin/settings",
    "/contact",
    "/faq",
    "/book",
    "/quote",
    "/services",
    "/track",
  ]) {
    revalidatePath(path);
  }
}

async function upsertCmsValue({
  context,
  section,
  key,
  value,
}: {
  context: AdminContext;
  section: string;
  key: string;
  value: unknown;
}) {
  const { supabase, profile } = context;
  const { error } = await supabase.from("cms_content").upsert(
    {
      section,
      key,
      value,
      published: true,
      updated_by: profile.id,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "section,key",
    },
  );

  if (error) {
    throw new Error("CMS section could not be saved.");
  }

  await syncPublishedCmsToSettings(context, section, key, value);
}

export async function saveCmsEditorSectionAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  let adminContext: AdminContext;

  try {
    adminContext = await assertAdminAction();
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Admin access is required.",
      values: formDataToValues(formData),
    };
  }

  const parsed = editorFormSchema.safeParse({
    formType: getString(formData, "formType"),
    section: getString(formData, "section"),
    key: getString(formData, "key"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "This CMS section could not be saved.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToValues(formData),
    };
  }

  try {
    const value = await buildEditorPayload(parsed.data.formType, formData);

    await upsertCmsValue({
      context: adminContext,
      section: parsed.data.section,
      key: parsed.data.key,
      value,
    });

    revalidateCmsPaths();

    return {
      success: true,
      message: "Changes saved and published.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "CMS section could not be saved.",
      values: formDataToValues(formData),
    };
  }
}

export async function upsertCmsSectionAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  let adminContext: AdminContext;

  try {
    adminContext = await assertAdminAction();
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Admin access is required.",
      values: formDataToValues(formData),
    };
  }

  const parsed = cmsSectionSchema.safeParse({
    section: getString(formData, "section"),
    key: getString(formData, "key"),
    payload: getString(formData, "payload"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToValues(formData),
    };
  }

  const payload = parseJsonPayload(parsed.data.payload);

  if (payload.error) {
    return {
      success: false,
      message: payload.error,
      fieldErrors: {
        payload: [payload.error],
      },
      values: formDataToValues(formData),
    };
  }

  try {
    await upsertCmsValue({
      context: adminContext,
      section: parsed.data.section,
      key: parsed.data.key,
      value: payload.data,
    });

    revalidateCmsPaths();

    return {
      success: true,
      message: "CMS section saved and published.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "CMS section could not be saved.",
      values: formDataToValues(formData),
    };
  }
}

export async function toggleCmsPublishAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  let adminContext: AdminContext;

  try {
    adminContext = await assertAdminAction();
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Admin access is required.",
    };
  }

  const parsed = toggleSchema.safeParse({
    id: getString(formData, "id") || undefined,
    section: getString(formData, "section") || undefined,
    key: getString(formData, "key") || undefined,
    published: getString(formData, "published"),
  });

  if (!parsed.success || (!parsed.data.id && (!parsed.data.section || !parsed.data.key))) {
    return {
      success: false,
      message: "Save this section before changing its publish state.",
      fieldErrors: parsed.success
        ? undefined
        : parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase, profile } = adminContext;
    const nextPublished = parsed.data.published !== "true";
    let query = supabase
      .from("cms_content")
      .update({
        published: nextPublished,
        updated_by: profile.id,
        updated_at: new Date().toISOString(),
      })
      .select("id, section, key, value, published")
      .limit(1);

    if (parsed.data.id) {
      query = query.eq("id", parsed.data.id);
    } else {
      query = query
        .eq("section", parsed.data.section ?? "")
        .eq("key", parsed.data.key ?? "");
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      throw new Error("Save this section before changing its publish state.");
    }

    const row = data as {
      section: string;
      key: string;
      value: unknown;
      published: boolean;
    };

    if (row.published) {
      await syncPublishedCmsToSettings(
        adminContext,
        row.section,
        row.key,
        row.value,
      );
    }

    revalidateCmsPaths();

    return {
      success: true,
      message: row.published ? "Section published." : "Section moved to draft.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Publish state could not be changed.",
    };
  }
}

export async function uploadCmsAssetAction(
  _previousState: CmsUploadState,
  formData: FormData,
): Promise<CmsUploadState> {
  try {
    await assertAdminAction();
    const folder = getString(formData, "folder") || "homepage/general";
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: "Choose an image file to upload.",
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "Only image uploads are supported for CMS assets.",
      };
    }

    const uploaded = await uploadCmsAsset({
      file,
      folder,
    });

    revalidatePath("/admin/cms");

    return {
      success: true,
      message: "CMS asset uploaded.",
      publicUrl: uploaded.publicUrl,
      path: uploaded.path,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "CMS asset could not be uploaded.",
    };
  }
}
