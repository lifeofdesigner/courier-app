import { z } from "zod";

import type {
  CmsContentRow,
  HomePageContent,
  HomepageContentKey,
} from "@/types/cms";

const iconSchema = z.enum([
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
]);

const cmsLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  ariaLabel: z.string().min(1).optional(),
});

const cmsImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  caption: z.string().min(1).optional(),
});

const heroStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  description: z.string().min(1).optional(),
});

const heroSlideSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  statusLabel: z.string().min(1),
  image: cmsImageSchema.optional(),
});

const homepageMotionSchema = z.object({
  scrollEffect: z
    .enum(["none", "fade-up", "slide-left", "slide-right", "zoom-in"])
    .default("fade-up"),
  textEffect: z.enum(["none", "soft-fade", "rise", "focus"]).default("rise"),
});

const featureHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: iconSchema,
});

const trustMetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1).optional(),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  authorName: z.string().min(1),
  authorTitle: z.string().min(1),
  companyName: z.string().min(1),
  image: cmsImageSchema.optional(),
});

const faqPreviewItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  href: z.string().min(1).optional(),
});

const homepageSectionSchemas = {
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    primaryCta: cmsLinkSchema,
    secondaryCta: cmsLinkSchema,
    stats: z.array(heroStatSchema).min(1),
    visual: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      route: z.string().min(1),
      statusLabel: z.string().min(1),
      items: z
        .array(
          z.object({
            icon: iconSchema,
            title: z.string().min(1),
            description: z.string().min(1),
            meta: z.string().min(1),
            isComplete: z.boolean(),
          }),
        )
        .min(1),
      image: cmsImageSchema.optional(),
    }),
    image: cmsImageSchema.optional(),
    slides: z.array(heroSlideSchema).min(1).optional(),
    motion: homepageMotionSchema.optional(),
  }),
  trackingPromo: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    inputLabel: z.string().min(1),
    inputPlaceholder: z.string().min(1),
    submitLabel: z.string().min(1),
    actionHref: z.string().min(1),
    helperText: z.string().min(1).optional(),
  }),
  services: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    cta: cmsLinkSchema,
    items: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          href: z.string().min(1),
          icon: iconSchema,
          image: cmsImageSchema.optional(),
        }),
      )
      .min(1),
  }),
  trust: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    metrics: z.array(trustMetricSchema),
    features: z.array(featureHighlightSchema).min(1),
  }),
  coverage: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    regions: z.array(z.string().min(1)).min(1),
    operations: z.array(featureHighlightSchema).min(1),
    metrics: z.array(trustMetricSchema),
    image: cmsImageSchema.optional(),
  }),
  testimonials: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    items: z.array(testimonialSchema),
  }),
  faqPreview: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    cta: cmsLinkSchema.optional(),
    items: z.array(faqPreviewItemSchema),
  }),
  cta: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    primaryCta: cmsLinkSchema,
    secondaryCta: cmsLinkSchema.optional(),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.array(z.string().min(1)).optional(),
    openGraphTitle: z.string().min(1).optional(),
    openGraphDescription: z.string().min(1).optional(),
    openGraphImage: cmsImageSchema.optional(),
    canonicalPath: z.string().min(1).optional(),
  }),
} satisfies Record<HomepageContentKey, z.ZodType>;

const homepageKeys = Object.keys(
  homepageSectionSchemas,
) as HomepageContentKey[];

function isHomepageContentKey(key: string): key is HomepageContentKey {
  return homepageKeys.includes(key as HomepageContentKey);
}

function latestUpdatedAt(rows: CmsContentRow[]) {
  return rows
    .map((row) => row.updated_at)
    .filter((updatedAt): updatedAt is string => Boolean(updatedAt))
    .sort()
    .at(-1);
}

export function mergeHomepageContentRows(
  rows: CmsContentRow[],
  fallback: HomePageContent,
): HomePageContent {
  const content: HomePageContent = {
    ...fallback,
  };

  for (const row of rows) {
    if (
      row.section !== "homepage" ||
      !row.published ||
      !isHomepageContentKey(row.key)
    ) {
      continue;
    }

    const parsed = homepageSectionSchemas[row.key].safeParse(row.value);

    if (!parsed.success) {
      continue;
    }

    switch (row.key) {
      case "hero":
        content.hero = parsed.data as HomePageContent["hero"];
        break;
      case "trackingPromo":
        content.trackingPromo = parsed.data as HomePageContent["trackingPromo"];
        break;
      case "services":
        content.services = parsed.data as HomePageContent["services"];
        break;
      case "trust":
        content.trust = parsed.data as HomePageContent["trust"];
        break;
      case "coverage":
        content.coverage = parsed.data as HomePageContent["coverage"];
        break;
      case "testimonials":
        content.testimonials = parsed.data as HomePageContent["testimonials"];
        break;
      case "faqPreview":
        content.faqPreview = parsed.data as HomePageContent["faqPreview"];
        break;
      case "cta":
        content.cta = parsed.data as HomePageContent["cta"];
        break;
      case "seo":
        content.seo = parsed.data as HomePageContent["seo"];
        break;
    }
  }

  return {
    ...content,
    updatedAt: latestUpdatedAt(rows) ?? fallback.updatedAt,
  };
}
