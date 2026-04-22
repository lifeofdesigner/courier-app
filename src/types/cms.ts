export type CmsIconName =
  | "air"
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
  | "enhancements"
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

export interface HeroSlideContent {
  eyebrow: string;
  title: string;
  description: string;
  statusLabel: string;
  image?: CmsImage;
}

export type HomepageScrollEffect =
  | "none"
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "zoom-in";

export type HomepageTextEffect =
  | "none"
  | "soft-fade"
  | "rise"
  | "focus";

export interface HomepageMotionSettings {
  scrollEffect: HomepageScrollEffect;
  textEffect: HomepageTextEffect;
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
  slides?: HeroSlideContent[];
  motion?: HomepageMotionSettings;
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

export type HomepageModeCode = "air" | "road" | "freight";

export interface HomepageModeServiceCard {
  mode: HomepageModeCode;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: CmsIconName;
  highlights: string[];
  image?: CmsImage;
}

export interface HomepageModeServicesContent {
  eyebrow: string;
  title: string;
  description: string;
  items: HomepageModeServiceCard[];
}

export interface HomepageWorkflowStep {
  title: string;
  description: string;
  icon: CmsIconName;
}

export interface HomepageWorkflowContent {
  eyebrow: string;
  title: string;
  description: string;
  steps: HomepageWorkflowStep[];
  image?: CmsImage;
  badgeLabel: string;
  badgeValue: string;
}

export interface HomepageQuoteModeOption {
  mode: HomepageModeCode;
  title: string;
  description: string;
  href: string;
}

export interface HomepageQuoteCtaContent {
  eyebrow: string;
  title: string;
  description: string;
  modes: HomepageQuoteModeOption[];
}

export interface HomepageEnhancementVisibility {
  modeServices: boolean;
  workflow: boolean;
  quoteCta: boolean;
}

export interface HomepageEnhancementsContent {
  visibility: HomepageEnhancementVisibility;
  modeServices: HomepageModeServicesContent;
  workflow: HomepageWorkflowContent;
  quoteCta: HomepageQuoteCtaContent;
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
  enhancements: HomepageEnhancementsContent;
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

export interface SiteIdentityContent {
  siteName: string;
  logo?: CmsImage;
  favicon?: CmsImage;
  supportEmail: string;
  supportPhone: string;
  operatingHours: string;
  companyAddress: string;
  footerNotice: string;
}

export interface ContactInfoContent {
  eyebrow: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  operatingHours: string;
  address: string;
}

export interface FooterContent {
  notice: string;
  supportEmail: string;
  supportPhone: string;
  operatingHours: string;
  address: string;
}

export interface ServicesPageServiceItem {
  title: string;
  description: string;
  icon: CmsIconName;
  bullets: string[];
}

export interface ServicesPageWorkflowStep {
  title: string;
  description: string;
}

export interface ServicesPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: CmsLink;
    secondaryCta: CmsLink;
  };
  services: ServicesPageServiceItem[];
  workflow: {
    title: string;
    description: string;
    steps: ServicesPageWorkflowStep[];
  };
  supportHighlights: FeatureHighlight[];
  seo: SEOContent;
}

export interface AboutPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    stats: TrustMetric[];
  };
  values: {
    title: string;
    description: string;
    items: FeatureHighlight[];
  };
  reasons: string[];
  cta: CTASectionContent;
  seo: SEOContent;
}

export interface FAQGroupContent {
  title: string;
  items: FAQPreviewItem[];
}

export interface FAQPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  groups: FAQGroupContent[];
  supportCta: {
    title: string;
    description: string;
    cta: CmsLink;
  };
  seo: SEOContent;
}
