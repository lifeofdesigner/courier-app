import { company } from "@/constants/site";
import { homepageFallbackContent } from "@/content/homepage-fallback";
import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type {
  AdminCmsEditorData,
  AdminCmsEditorSection,
  AdminCmsRow,
} from "@/types/admin";
import type {
  AboutPageContent,
  ContactInfoContent,
  FAQPageContent,
  FooterContent,
  HomepageContentKey,
  ServicesPageContent,
  SiteIdentityContent,
} from "@/types/cms";

type CmsRow = {
  id: string;
  section: string;
  key: string;
  value: unknown;
  published: boolean;
  updated_at: string;
  updated_by: string | null;
};

type SettingRow = {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
};

const homepageTargets = {
  hero: { section: "homepage", key: "hero" },
  trackingPromo: { section: "homepage", key: "trackingPromo" },
  services: { section: "homepage", key: "services" },
  enhancements: { section: "homepage", key: "enhancements" },
  trust: { section: "homepage", key: "trust" },
  coverage: { section: "homepage", key: "coverage" },
  testimonials: { section: "homepage", key: "testimonials" },
  faqPreview: { section: "homepage", key: "faqPreview" },
  cta: { section: "homepage", key: "cta" },
  seo: { section: "homepage", key: "seo" },
} as const satisfies Record<
  HomepageContentKey,
  { section: "homepage"; key: HomepageContentKey }
>;

const servicesPageFallback: ServicesPageContent = {
  hero: {
    eyebrow: "Services",
    title: "Courier services built around clear delivery expectations.",
    description:
      "The logistics team supports urgent local delivery, planned economy movement, recurring business pickups, and international shipment conversations with practical operations detail at every handoff.",
    primaryCta: {
      label: "Get a Quote",
      href: "/quote",
      ariaLabel: "Request a courier delivery quote",
    },
    secondaryCta: {
      label: "Book Pickup",
      href: "/book",
      ariaLabel: "Book a courier pickup",
    },
  },
  services: [
    {
      title: "Express delivery",
      description:
        "Priority courier handling for urgent documents, retail orders, replacement parts, and time-sensitive business parcels.",
      icon: "clock",
      bullets: [
        "Same-day and next-flight style routing where available",
        "Clear pickup windows and delivery expectations",
        "Live tracking milestones for shipment visibility",
      ],
    },
    {
      title: "Economy delivery",
      description:
        "Reliable scheduled delivery for parcels that need dependable handling without express urgency.",
      icon: "package-check",
      bullets: [
        "Planned collection windows for predictable shipping",
        "Cost-aware service selection for routine lanes",
        "Delivery updates from pickup through completion",
      ],
    },
    {
      title: "Business shipping",
      description:
        "Courier support for teams sending customer orders, branch transfers, samples, documents, and recurring shipment batches.",
      icon: "building",
      bullets: [
        "Support for multi-piece and recurring pickups",
        "Operational notes for reception, loading bays, and access",
        "Quote and booking flows built for repeat use",
      ],
    },
    {
      title: "International support",
      description:
        "Cross-border courier planning with practical customs information and cleaner documentation handoffs.",
      icon: "globe",
      bullets: [
        "Customs detail prompts for international shipments",
        "Recipient and delivery contact readiness checks",
        "Support for commercial paperwork conversations",
      ],
    },
  ],
  workflow: {
    title: "From pickup request to delivery confirmation.",
    description:
      "The service experience is designed to keep shippers, recipients, and operations teams aligned before the parcel moves and after delivery is complete.",
    steps: [
      {
        title: "Request a quote",
        description:
          "Share pickup, destination, package, timing, and value details so the right service level can be estimated before booking.",
      },
      {
        title: "Book the pickup",
        description:
          "Confirm collection details, contact information, pickup date, and any access notes that help dispatch avoid avoidable delays.",
      },
      {
        title: "Track the movement",
        description:
          "Follow shipment milestones as the parcel moves from pickup through transit, final-mile routing, and delivery.",
      },
      {
        title: "Close with proof",
        description:
          "Delivery completion can be supported with recipient details, timestamps, and proof of delivery records when available.",
      },
    ],
  },
  supportHighlights: [
    {
      title: "Proof of delivery",
      description:
        "Give senders and internal teams a clean delivery close-out record when a shipment is completed.",
      icon: "check-circle",
    },
    {
      title: "Tracking visibility",
      description:
        "Use clear milestones instead of vague status updates so customers understand what happened and what comes next.",
      icon: "route",
    },
    {
      title: "Handling discipline",
      description:
        "Keep package notes, delivery contacts, declared value, and service expectations connected to the shipment.",
      icon: "shield-check",
    },
    {
      title: "Pickup coordination",
      description:
        "Plan driver handoffs around reception, loading access, business hours, and recipient availability.",
      icon: "truck",
    },
  ],
  seo: {
    title: "Courier Services",
    description:
      "Explore same-day courier, economy delivery, business shipping, tracking, proof of delivery, and customs-aware courier support from the logistics team.",
    keywords: [
      "courier services",
      "same-day courier",
      "business shipping",
      "economy delivery",
      "proof of delivery",
    ],
    canonicalPath: "/services",
  },
};

const aboutPageFallback: AboutPageContent = {
  hero: {
    eyebrow: "About",
    title: "A courier company built for calm, accountable delivery.",
    description:
      "The logistics team combines customer-friendly booking tools with the operations detail courier teams need to keep pickups, transfers, and delivery confirmations moving cleanly.",
  },
  story: {
    eyebrow: "Company story",
    title: "Reliability starts with the handoff.",
    paragraphs: [
      "The logistics team is built for customers who need delivery to feel organized, not uncertain. Our public tools focus on the practical work of courier operations: clear pickup details, understandable tracking milestones, and support conversations that start with the shipment context already in view.",
      "The company serves households, growing teams, and operations-led businesses that depend on reliable handoffs. Whether the shipment is an urgent contract, a replacement part, a customer order, or a recurring branch transfer, the goal is the same: keep the movement clear from request to proof of delivery.",
      "This website gives customers a production-ready place to quote, book, track, and understand the service before deeper payment, email, and mapping integrations are added in future phases.",
    ],
    stats: [
      {
        value: "Same day",
        label: "priority pickup conversations for urgent lanes",
      },
      {
        value: "End to end",
        label: "tracking visibility from dispatch to delivery",
      },
      {
        value: "Business first",
        label: "support for recurring and operational shipping",
      },
    ],
  },
  values: {
    title:
      "The operating model is simple: clear details, careful movement, visible progress.",
    description:
      "Customers choose the logistics team because the service experience is practical. It asks for the right information, sets clear expectations, and keeps delivery status visible.",
    items: [
      {
        title: "Operational clarity",
        description:
          "Every shipment should have clear pickup, delivery, contact, and package details before it enters the courier workflow.",
        icon: "route",
      },
      {
        title: "Dependable timing",
        description:
          "Pickup windows and delivery expectations should be realistic, visible, and easy for customers to plan around.",
        icon: "clock",
      },
      {
        title: "Responsible handling",
        description:
          "Package notes, declared value, recipient details, and special instructions deserve careful attention at each handoff.",
        icon: "shield-check",
      },
      {
        title: "Human support",
        description:
          "When customers need help, they should reach a team that understands routes, exceptions, handoffs, and urgency.",
        icon: "headphones",
      },
    ],
  },
  reasons: [
    "Straightforward quote and booking paths",
    "Tracking pages that make status easy to interpret",
    "Support copy shaped around real courier questions",
    "A customer dashboard foundation for repeat shipping",
  ],
  cta: {
    eyebrow: "Why customers choose us",
    title: "Courier support that respects the shipment and the schedule.",
    description:
      "A good delivery partner reduces uncertainty. The logistics team keeps the public experience focused on decisions customers need to make now: service level, pickup timing, tracking, and support.",
    primaryCta: {
      label: "Contact support",
      href: "/contact",
      ariaLabel: "Contact logistics support",
    },
    secondaryCta: {
      label: "Get a Quote",
      href: "/quote",
      ariaLabel: "Request a courier delivery quote",
    },
  },
  seo: {
    title: "About the logistics company",
    description:
      "Learn how the logistics team helps customers move important shipments with clear tracking, dependable pickup windows, and practical courier support.",
    keywords: [
      "about the logistics company",
      "courier company",
      "delivery operations",
      "business courier support",
    ],
    canonicalPath: "/about",
  },
};

const faqPageFallback: FAQPageContent = {
  hero: {
    eyebrow: "FAQ",
    title: "Straight answers for common courier questions.",
    description:
      "Find practical guidance on pickups, tracking, quotes, customs details, and support before you hand over a shipment.",
  },
  groups: [
    {
      title: "Shipping process",
      items: [
        {
          question: "What information do I need to book a pickup?",
          answer:
            "You need the pickup address, delivery address, sender and recipient contact details, package count, estimated weight, preferred pickup date, and any access or handling notes.",
        },
        {
          question: "Can I request same-day delivery?",
          answer:
            "Same-day delivery depends on route capacity, pickup timing, destination distance, and package readiness.",
        },
      ],
    },
    {
      title: "Tracking",
      items: [
        {
          question: "Can I track a shipment without an account?",
          answer:
            "Yes. Use the public tracking page with the tracking number from your booking or shipment confirmation.",
        },
        {
          question: "What if my tracking number is not found?",
          answer:
            "Check the number for typos and try again. Newly created shipments may take a short time to appear.",
        },
      ],
    },
  ],
  supportCta: {
    title: "Still need help?",
    description:
      "Contact support with your shipment reference, route, pickup timing, and the question you need answered.",
    cta: {
      label: "Contact support",
      href: "/contact",
      ariaLabel: "Contact logistics support",
    },
  },
  seo: {
    title: "Courier FAQ",
    description:
      "Find answers about the logistics company pickups, tracking, quotes, customs details, business shipping, and customer support.",
    keywords: [
      "courier FAQ",
      "delivery questions",
      "shipment tracking help",
      "courier quote questions",
    ],
    canonicalPath: "/faq",
  },
};

function mapCmsRow(row: CmsRow): AdminCmsRow {
  return {
    id: row.id,
    section: row.section,
    key: row.key,
    value: row.value,
    published: row.published,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function getSettingRecord(settings: SettingRow[], key: string) {
  const value = settings.find((setting) => setting.key === key)?.value;

  return isRecord(value) ? value : {};
}

function mergeCmsValue<T>(fallback: T, value: unknown): T {
  if (Array.isArray(fallback)) {
    return Array.isArray(value) ? (value as T) : fallback;
  }

  if (isRecord(fallback)) {
    if (!isRecord(value)) {
      return fallback;
    }

    const merged: Record<string, unknown> = { ...value };

    for (const key of Object.keys(fallback)) {
      merged[key] = mergeCmsValue(
        (fallback as Record<string, unknown>)[key],
        value[key],
      );
    }

    return merged as T;
  }

  return value === undefined || value === null ? fallback : (value as T);
}

function findCmsRow(rows: AdminCmsRow[], section: string, key: string) {
  return rows.find((row) => row.section === section && row.key === key);
}

function createEditorSection<T>({
  rows,
  section,
  key,
  fallback,
}: {
  rows: AdminCmsRow[];
  section: string;
  key: string;
  fallback: T;
}): AdminCmsEditorSection<T> {
  const row = findCmsRow(rows, section, key);

  return {
    id: row?.id ?? null,
    section,
    key,
    value: mergeCmsValue(fallback, row?.value),
    published: row?.published ?? false,
    updatedAt: row?.updatedAt ?? null,
  };
}

function buildSiteIdentityFallback(settings: SettingRow[]): SiteIdentityContent {
  const siteIdentity = getSettingRecord(settings, "site_identity");
  const companyContact = getSettingRecord(settings, "company_contact");
  const supportHours = getSettingRecord(settings, "support_hours");
  const footerNotice = getSettingRecord(settings, "footer_notice");

  return {
    siteName: readString(siteIdentity.siteName, company.name),
    logo: isRecord(siteIdentity.logo)
      ? {
          src: readString(siteIdentity.logo.src, ""),
          alt: readString(siteIdentity.logo.alt, `${company.name} logo`),
          ...(Number.isFinite(Number(siteIdentity.logo.width)) &&
          Number(siteIdentity.logo.width) > 0
            ? { width: Number(siteIdentity.logo.width) }
            : {}),
          ...(Number.isFinite(Number(siteIdentity.logo.height)) &&
          Number(siteIdentity.logo.height) > 0
            ? { height: Number(siteIdentity.logo.height) }
            : {}),
        }
      : undefined,
    favicon: isRecord(siteIdentity.favicon)
      ? {
          src: readString(siteIdentity.favicon.src, ""),
          alt: readString(siteIdentity.favicon.alt, `${company.name} favicon`),
          ...(Number.isFinite(Number(siteIdentity.favicon.width)) &&
          Number(siteIdentity.favicon.width) > 0
            ? { width: Number(siteIdentity.favicon.width) }
            : {}),
          ...(Number.isFinite(Number(siteIdentity.favicon.height)) &&
          Number(siteIdentity.favicon.height) > 0
            ? { height: Number(siteIdentity.favicon.height) }
            : {}),
        }
      : undefined,
    supportEmail: readString(companyContact.email, company.email),
    supportPhone: readString(companyContact.phone, company.phone),
    operatingHours: readString(supportHours.label, company.operatingHours),
    companyAddress: readString(companyContact.address, company.address),
    footerNotice: readString(footerNotice.text, company.trustStatement),
  };
}

function buildContactFallback(settings: SettingRow[]): ContactInfoContent {
  const companyContact = getSettingRecord(settings, "company_contact");
  const supportHours = getSettingRecord(settings, "support_hours");

  return {
    eyebrow: "Contact",
    title: "Talk to courier support before the shipment stalls.",
    description:
      "Reach the logistics team for pickup planning, tracking questions, delivery exceptions, quote support, and account conversations.",
    email: readString(companyContact.email, company.email),
    phone: readString(companyContact.phone, company.phone),
    operatingHours: readString(supportHours.label, company.operatingHours),
    address: readString(companyContact.address, company.address),
  };
}

function buildFooterFallback(settings: SettingRow[]): FooterContent {
  const companyContact = getSettingRecord(settings, "company_contact");
  const supportHours = getSettingRecord(settings, "support_hours");
  const footerNotice = getSettingRecord(settings, "footer_notice");

  return {
    notice: readString(footerNotice.text, company.trustStatement),
    supportEmail: readString(companyContact.email, company.email),
    supportPhone: readString(companyContact.phone, company.phone),
    operatingHours: readString(supportHours.label, company.hours),
    address: readString(companyContact.address, company.address),
  };
}

export async function getAdminCmsRows(): Promise<AdminCmsRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("cms_content")
    .select(
      `
      id,
      section,
      key,
      value,
      published,
      updated_at,
      updated_by
    `,
    )
    .order("section", { ascending: true })
    .order("key", { ascending: true });

  return ((data ?? []) as CmsRow[]).map(mapCmsRow);
}

export async function getAdminCmsEditorData(): Promise<AdminCmsEditorData> {
  const { supabase } = await assertAdminAction();
  const [cmsResult, settingsResult] = await Promise.all([
    supabase
      .from("cms_content")
      .select(
        `
        id,
        section,
        key,
        value,
        published,
        updated_at,
        updated_by
      `,
      )
      .order("section", { ascending: true })
      .order("key", { ascending: true }),
    supabase
      .from("site_settings")
      .select("id, key, value, updated_at, updated_by")
      .order("key", { ascending: true }),
  ]);

  const rows = ((cmsResult.data ?? []) as CmsRow[]).map(mapCmsRow);
  const settings = (settingsResult.data ?? []) as SettingRow[];
  const siteIdentityFallback = buildSiteIdentityFallback(settings);
  const contactFallback = buildContactFallback(settings);
  const footerFallback = buildFooterFallback(settings);

  return {
    rows,
    siteIdentity: createEditorSection({
      rows,
      section: "site",
      key: "identity",
      fallback: siteIdentityFallback,
    }),
    homepage: {
      hero: createEditorSection({
        rows,
        ...homepageTargets.hero,
        fallback: homepageFallbackContent.hero,
      }),
      trackingPromo: createEditorSection({
        rows,
        ...homepageTargets.trackingPromo,
        fallback: homepageFallbackContent.trackingPromo,
      }),
      services: createEditorSection({
        rows,
        ...homepageTargets.services,
        fallback: homepageFallbackContent.services,
      }),
      enhancements: createEditorSection({
        rows,
        ...homepageTargets.enhancements,
        fallback: homepageFallbackContent.enhancements,
      }),
      trust: createEditorSection({
        rows,
        ...homepageTargets.trust,
        fallback: homepageFallbackContent.trust,
      }),
      coverage: createEditorSection({
        rows,
        ...homepageTargets.coverage,
        fallback: homepageFallbackContent.coverage,
      }),
      testimonials: createEditorSection({
        rows,
        ...homepageTargets.testimonials,
        fallback: homepageFallbackContent.testimonials,
      }),
      faqPreview: createEditorSection({
        rows,
        ...homepageTargets.faqPreview,
        fallback: homepageFallbackContent.faqPreview,
      }),
      cta: createEditorSection({
        rows,
        ...homepageTargets.cta,
        fallback: homepageFallbackContent.cta,
      }),
      seo: createEditorSection({
        rows,
        ...homepageTargets.seo,
        fallback: homepageFallbackContent.seo,
      }),
    },
    servicesPage: createEditorSection({
      rows,
      section: "services_page",
      key: "content",
      fallback: servicesPageFallback,
    }),
    aboutPage: createEditorSection({
      rows,
      section: "about_page",
      key: "content",
      fallback: aboutPageFallback,
    }),
    contactInfo: createEditorSection({
      rows,
      section: "contact",
      key: "info",
      fallback: contactFallback,
    }),
    faqPage: createEditorSection({
      rows,
      section: "faq",
      key: "content",
      fallback: faqPageFallback,
    }),
    footer: createEditorSection({
      rows,
      section: "footer",
      key: "content",
      fallback: footerFallback,
    }),
  };
}
