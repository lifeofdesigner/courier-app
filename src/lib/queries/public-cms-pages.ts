import { cache } from "react";

import { company } from "@/constants/site";
import { applySiteNameTemplate } from "@/lib/brand-template";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AboutPageContent,
  ContactInfoContent,
  FAQPageContent,
  FooterContent,
  ServicesPageContent,
} from "@/types/cms";

type CmsPageRow = {
  section: string;
  key: string;
  value: unknown;
  published: boolean;
};

const servicesPageFallback: ServicesPageContent = {
  hero: {
    eyebrow: "Services",
    title: "Courier, cargo, and freight support for shipments that need clarity.",
    description:
      "Move parcels, cargo, pallets, and scheduled business deliveries with service options built around pickup timing, handling needs, and delivery visibility.",
    primaryCta: {
      label: "Get a Quote",
      href: "/quote",
      ariaLabel: "Request a courier, cargo, or freight quote",
    },
    secondaryCta: {
      label: "Book Pickup",
      href: "/book",
      ariaLabel: "Book a courier pickup",
    },
  },
  services: [],
  workflow: {
    title: "From pickup request to delivery confirmation.",
    description:
      "Share the shipment details, choose a service path, confirm the pickup, and track movement through each handoff.",
    steps: [],
  },
  supportHighlights: [],
  seo: {
    title: "Courier, Cargo and Freight Services",
    description:
      "Courier delivery, cargo movement, road transport, air cargo, freight handling, shipment tracking, and pickup support.",
    canonicalPath: "/services",
  },
};

const aboutPageFallback: AboutPageContent = {
  hero: {
    eyebrow: "About",
    title: "Logistics support built around careful handoffs.",
    description:
      "Customers need shipments to move with clear timing, careful handling, and visible progress from pickup to delivery.",
  },
  story: {
    eyebrow: "How we work",
    title: "Reliable delivery starts before the driver arrives.",
    paragraphs: [
      "Every shipment begins with the details that keep logistics moving: pickup access, route expectations, package or cargo information, and contact details for both sides of the delivery.",
    ],
    stats: [],
  },
  values: {
    title: "Clear details, careful movement, visible progress.",
    description:
      "The service experience is designed to reduce uncertainty for senders, recipients, and operations teams.",
    items: [],
  },
  reasons: [],
  cta: {
    eyebrow: "Ready to ship?",
    title: "Plan a pickup or request a logistics quote.",
    primaryCta: {
      label: "Get a Quote",
      href: "/quote",
      ariaLabel: "Request a logistics quote",
    },
  },
  seo: {
    title: "About Our Courier and Logistics Service",
    description:
      "Learn about customer-focused courier delivery, cargo movement, freight handling, and shipment tracking support.",
    canonicalPath: "/about",
  },
};

const faqPageFallback: FAQPageContent = {
  hero: {
    eyebrow: "FAQ",
    title: "Answers for courier, cargo, and freight customers.",
    description:
      "Find practical answers about pickup planning, quote details, shipment tracking, freight handling, and support.",
  },
  groups: [],
  supportCta: {
    title: "Still need help?",
    description:
      "Contact support with your shipment route, pickup timing, and tracking or quote reference.",
    cta: {
      label: "Contact support",
      href: "/contact",
      ariaLabel: "Contact logistics support",
    },
  },
  seo: {
    title: "Courier and Freight FAQ",
    description:
      "Answers about courier pickup, cargo delivery, freight quotes, shipment tracking, and logistics support.",
    canonicalPath: "/faq",
  },
};

const contactInfoFallback: ContactInfoContent = {
  eyebrow: "Contact",
  title: "Talk to logistics support before a shipment stalls.",
  description:
    "Reach support for pickup planning, cargo questions, freight movement, tracking updates, quote help, and delivery exceptions.",
  email: company.email,
  phone: company.phone,
  operatingHours: company.operatingHours,
  address: company.address,
};

const footerFallback: FooterContent = {
  notice:
    "Courier, cargo, and freight support for clear pickups, careful handling, and dependable delivery visibility.",
  supportEmail: company.email,
  supportPhone: company.phone,
  operatingHours: company.operatingHours,
  address: company.address,
};

async function getCmsRows(section: string, key: string): Promise<CmsPageRow[]> {
  let supabase;

  try {
    supabase = createSupabaseServiceRoleClient();
  } catch {
    supabase = await createSupabaseServerClient();
  }

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cms_content")
    .select("section,key,value,published")
    .eq("section", section)
    .eq("key", key)
    .eq("published", true)
    .limit(1);

  if (error || !data) {
    return [];
  }

  return data as CmsPageRow[];
}

function readCmsValue<T>(rows: CmsPageRow[], fallback: T): T {
  const value = rows[0]?.value;

  return value && typeof value === "object" ? (value as T) : fallback;
}

async function readTemplatedCmsValue<T>(
  section: string,
  key: string,
  fallback: T,
): Promise<T> {
  const [rows, settings] = await Promise.all([
    getCmsRows(section, key),
    getPublicPageSettings(),
  ]);

  return applySiteNameTemplate(
    readCmsValue(rows, fallback),
    settings.siteIdentity.siteName,
  );
}

export const getServicesPageContent = cache(async () =>
  readTemplatedCmsValue(
    "services_page",
    "content",
    servicesPageFallback,
  ),
);

export const getAboutPageContent = cache(async () =>
  readTemplatedCmsValue("about_page", "content", aboutPageFallback),
);

export const getFaqPageContent = cache(async () =>
  readTemplatedCmsValue("faq", "content", faqPageFallback),
);

export const getContactInfoContent = cache(async () =>
  readTemplatedCmsValue("contact", "info", contactInfoFallback),
);

export const getFooterContent = cache(async () =>
  readTemplatedCmsValue("footer", "content", footerFallback),
);
