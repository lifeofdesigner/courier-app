export type CmsIconName =
  | "building"
  | "check-circle"
  | "clock"
  | "globe"
  | "headphones"
  | "map-pin"
  | "package-check"
  | "route"
  | "shield-check"
  | "truck"
  | "warehouse";

export type HomepageContentKey =
  | "hero"
  | "trackingPromo"
  | "services"
  | "trust"
  | "coverage"
  | "testimonials"
  | "faqPreview"
  | "cta"
  | "seo";

export interface CmsLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface CmsImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface HeroStat {
  label: string;
  value: string;
  description?: string;
}

export interface HeroTimelineItem {
  icon: CmsIconName;
  title: string;
  description: string;
  meta: string;
  isComplete: boolean;
}

export interface HeroVisualContent {
  eyebrow: string;
  title: string;
  route: string;
  statusLabel: string;
  items: HeroTimelineItem[];
  image?: CmsImage;
}

export interface HeroSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CmsLink;
  secondaryCta: CmsLink;
  stats: HeroStat[];
  visual: HeroVisualContent;
  image?: CmsImage;
}

export interface TrackingPromoContent {
  eyebrow: string;
  title: string;
  description?: string;
  inputLabel: string;
  inputPlaceholder: string;
  submitLabel: string;
  actionHref: string;
  helperText?: string;
}

export interface ServicePreviewItem {
  title: string;
  description: string;
  href: string;
  icon: CmsIconName;
  image?: CmsImage;
}

export interface ServicePreviewSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  cta: CmsLink;
  items: ServicePreviewItem[];
}

export interface TrustMetric {
  value: string;
  label: string;
  description?: string;
}

export interface FeatureHighlight {
  title: string;
  description: string;
  icon: CmsIconName;
}

export interface TrustSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  metrics: TrustMetric[];
  features: FeatureHighlight[];
}

export interface CoverageBlurb {
  eyebrow: string;
  title: string;
  description: string;
  regions: string[];
  operations: FeatureHighlight[];
  metrics: TrustMetric[];
  image?: CmsImage;
}

export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  image?: CmsImage;
}

export interface SocialProofContent {
  eyebrow: string;
  title: string;
  description?: string;
  items: TestimonialItem[];
}

export interface CTASectionContent {
  eyebrow: string;
  title: string;
  description?: string;
  primaryCta: CmsLink;
  secondaryCta?: CmsLink;
}

export interface FAQPreviewItem {
  question: string;
  answer: string;
  href?: string;
}

export interface FAQPreviewSectionContent {
  eyebrow: string;
  title: string;
  description?: string;
  cta?: CmsLink;
  items: FAQPreviewItem[];
}

export interface SEOContent {
  title: string;
  description: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: CmsImage;
  canonicalPath?: string;
}

export interface HomePageContent {
  hero: HeroSectionContent;
  trackingPromo: TrackingPromoContent;
  services: ServicePreviewSectionContent;
  trust: TrustSectionContent;
  coverage: CoverageBlurb;
  testimonials: SocialProofContent;
  faqPreview: FAQPreviewSectionContent;
  cta: CTASectionContent;
  seo: SEOContent;
  updatedAt?: string;
}

export interface CmsContentRow {
  section: "homepage" | string;
  key: HomepageContentKey | string;
  value: unknown;
  published: boolean;
  updated_at: string | null;
}
