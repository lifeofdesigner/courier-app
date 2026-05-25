import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function readEnvFile() {
  try {
    return Object.fromEntries(
      readFileSync(".env.local", "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        }),
    );
  } catch {
    return {};
  }
}

const localEnv = readEnvFile();
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? localEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding CMS content.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const image = {
  truck:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
  port:
    "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85",
  warehouse:
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=85",
  air:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85",
  dock:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
};
const brandName = "{siteName}";

async function readSiteName() {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "site_identity")
    .maybeSingle();

  const siteName = data?.value?.siteName;

  return typeof siteName === "string" && siteName.trim()
    ? siteName.trim()
    : "the logistics team";
}

async function upsertCms(section, key, value) {
  const { error } = await supabase.from("cms_content").upsert(
    {
      section,
      key,
      value,
      published: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section,key" },
  );

  if (error) {
    throw new Error(`Could not seed ${section}.${key}: ${error.message}`);
  }
}

async function upsertSetting(key, value) {
  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(`Could not seed setting ${key}: ${error.message}`);
  }
}

function buildHomepageContent() {
  const hero = {
    eyebrow: "Courier, cargo, and freight logistics",
    title: "Move shipments with clear pickup, careful handling, and visible delivery progress.",
    description: `${brandName} helps customers plan courier deliveries, cargo movement, and freight handoffs with service options built around timing, route needs, package details, and customer-ready tracking.`,
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
    motion: {
      scrollEffect: "fade-up",
      textEffect: "rise",
    },
    typography: {
      eyebrowSize: "medium",
      titleSize: "medium",
      descriptionSize: "medium",
    },
    stats: [
      {
        label: "Courier delivery",
        value: "Local and regional",
        description: "Pickup and delivery support for parcels, documents, and business shipments.",
      },
      {
        label: "Cargo movement",
        value: "Air, road, freight",
        description: "Mode-aware service choices for urgent cargo, planned lanes, and heavier freight.",
      },
      {
        label: "Tracking",
        value: "Milestone visibility",
        description: "Readable updates from pickup confirmation through final delivery.",
      },
    ],
    visual: {
      eyebrow: "Shipment visibility",
      title: "Tracking AX-2048",
      route: "Origin facility to destination delivery zone",
      statusLabel: "On schedule",
      items: [
        {
          icon: "package-check",
          title: "Pickup confirmed",
          description: "Shipment details checked and collection recorded.",
          meta: "9:15 AM",
          isComplete: true,
        },
        {
          icon: "truck",
          title: "In transit",
          description: "Cargo is moving through the selected logistics lane.",
          meta: "12:40 PM",
          isComplete: true,
        },
        {
          icon: "map-pin",
          title: "Destination handoff",
          description: "Final delivery details are prepared for the recipient.",
          meta: "Expected today",
          isComplete: false,
        },
      ],
    },
    image: {
      src: image.truck,
      alt: "Freight truck moving along a highway",
    },
    slides: [
      {
        eyebrow: "Courier, cargo, and freight logistics",
        title: "Move shipments with clear pickup, careful handling, and visible delivery progress.",
        description: `${brandName} helps customers plan courier deliveries, cargo movement, and freight handoffs with service options built around timing, route needs, package details, and customer-ready tracking.`,
        statusLabel: "Ready to quote",
        image: {
          src: image.truck,
          alt: "Freight truck moving along a highway",
        },
      },
      {
        eyebrow: "Live shipment view",
        title: "Know where the shipment stands from pickup to delivery.",
        description: `${brandName} keeps shipment milestones readable so customers can follow progress instead of vague status notes.`,
        statusLabel: "On schedule",
        image: {
          src: image.port,
          alt: "Cargo containers at a logistics port",
        },
      },
      {
        eyebrow: "Logistics coordination",
        title: "Support for parcels, cargo, pallets, and scheduled freight.",
        description:
          "Choose the service path that fits the movement: urgent courier delivery, road transport, air cargo, or managed freight handling.",
        statusLabel: "Dispatch ready",
        image: {
          src: image.warehouse,
          alt: "Warehouse team preparing packages for dispatch",
        },
      },
    ],
  };

  return {
    hero,
    trackingPromo: {
      eyebrow: "Track a shipment",
      title: "Get clear shipment status in seconds.",
      description:
        "Enter a tracking number to see the latest pickup, transit, hub, customs, freight, or delivery milestone.",
      inputLabel: "Tracking number",
      inputPlaceholder: "Enter tracking number",
      submitLabel: "Track Shipment",
      actionHref: "/track",
      helperText: "Use the tracking number from your booking or shipment confirmation.",
    },
    services: {
      eyebrow: "Services",
      title: "Courier, cargo, and freight options for urgent and planned movement.",
      description: `${brandName} gives customers service paths that match the shipment: local courier delivery, regional road movement, air cargo, or heavier freight handling.`,
      cta: {
        label: "View services",
        href: "/services",
        ariaLabel: "View courier, cargo, and freight services",
      },
      items: [
        {
          title: "Courier delivery",
          description:
            "Pickup and delivery for parcels, documents, retail orders, samples, and time-sensitive business shipments.",
          href: "/services",
          icon: "truck",
        },
        {
          title: "Air cargo",
          description:
            "Airport-aware movement for urgent cargo, longer lanes, and shipments that need faster routing.",
          href: "/services",
          icon: "air",
        },
        {
          title: "Freight handling",
          description:
            "Pallets, LTL, truckload, and consolidated freight support for larger or appointment-led movement.",
          href: "/services",
          icon: "warehouse",
        },
      ],
    },
    enhancements: {
      visibility: {
        modeServices: true,
        workflow: true,
        quoteCta: true,
      },
      modeServices: {
        eyebrow: "Transport modes",
        title: "Choose the right lane before the shipment moves.",
        description:
          "Start with the movement type so the quote, booking details, and tracking language match the real shipment.",
        items: [
          {
            mode: "air",
            eyebrow: "Air cargo",
            title: "Fast movement for urgent cargo and longer lanes.",
            description:
              "Air cargo support for time-sensitive shipments that need airport-aware routing, declared value details, and clearer handoffs.",
            href: "/quote?transportMode=air",
            ctaLabel: "Quote air cargo",
            icon: "air",
            highlights: ["Express Air", "Standard Air", "Priority Air Cargo"],
            image: {
              src: image.air,
              alt: "Cargo aircraft prepared for air shipment",
            },
          },
          {
            mode: "road",
            eyebrow: "Road delivery",
            title: "Courier and road transport for local and regional routes.",
            description:
              "Road service for same-day pickups, scheduled deliveries, depot movement, and regional courier lanes.",
            href: "/quote?transportMode=road",
            ctaLabel: "Quote road delivery",
            icon: "truck",
            highlights: ["Same-Day Road", "Regional Road", "Standard Road"],
            image: {
              src: image.truck,
              alt: "Road freight truck moving on a highway",
            },
          },
          {
            mode: "freight",
            eyebrow: "Freight",
            title: "Cargo and pallet movement with appointment-ready details.",
            description:
              "Freight handling for pallets, LTL, truckload, and consolidated cargo that needs more planning and coordination.",
            href: "/quote?transportMode=freight",
            ctaLabel: "Quote freight",
            icon: "warehouse",
            highlights: ["LTL Freight", "Full Truckload", "Pallet Freight", "Consolidated Freight"],
            image: {
              src: image.port,
              alt: "Stacked freight containers at a logistics terminal",
            },
          },
        ],
      },
      workflow: {
        eyebrow: "How it works",
        title: "From shipment details to proof of delivery.",
        description:
          "The flow is simple: choose the movement type, share the route and cargo details, confirm pickup, then track each milestone.",
        badgeLabel: "Shipping flow",
        badgeValue: "4 steps",
        image: {
          src: image.dock,
          alt: "Logistics warehouse team preparing shipments",
        },
        steps: [
          {
            title: "Choose a transport mode",
            description:
              "Select air, road, or freight so the service options match the shipment.",
            icon: "route",
          },
          {
            title: "Request a clear quote",
            description:
              "Share origin, destination, cargo details, weight, declared value, and timing.",
            icon: "check-circle",
          },
          {
            title: "Confirm pickup",
            description:
              "Add contact details, access notes, pickup windows, and delivery expectations.",
            icon: "truck",
          },
          {
            title: "Track the handoffs",
            description:
              "Follow pickup, transit, hub, customs, freight, and delivery milestones.",
            icon: "package-check",
          },
        ],
      },
      quoteCta: {
        eyebrow: "Start a quote",
        title: "Choose a shipment mode and move into the right quote flow.",
        description:
          "Get a clearer estimate by starting with the shipment type: air cargo, road delivery, or freight handling.",
        modes: [
          {
            mode: "air",
            title: "Air cargo quote",
            description: "For urgent cargo, longer lanes, and airport-aware movement.",
            href: "/quote?transportMode=air",
          },
          {
            mode: "road",
            title: "Road delivery quote",
            description: "For local, regional, and scheduled courier transport.",
            href: "/quote?transportMode=road",
          },
          {
            mode: "freight",
            title: "Freight quote",
            description: "For pallets, LTL, truckload, and consolidated cargo.",
            href: "/quote?transportMode=freight",
          },
        ],
      },
    },
    trust: {
      eyebrow: "Why customers choose us",
      title: "Logistics support that reduces delivery uncertainty.",
      description: `${brandName} gives customers more than a pickup button: clear service choices, practical handling details, and tracking updates they can understand.`,
      metrics: [
        {
          value: "Air",
          label: "cargo routing",
          description: "Service wording for urgent and longer-distance cargo movement.",
        },
        {
          value: "Road",
          label: "courier lanes",
          description: "Local, same-day, regional, and scheduled delivery paths.",
        },
        {
          value: "Freight",
          label: "cargo handling",
          description: "Support for pallets, LTL, truckload, and larger shipments.",
        },
      ],
      features: [
        {
          title: "Clear tracking from pickup to delivery",
          description:
            "Customers can follow meaningful milestones instead of unclear shipment notes.",
          icon: "route",
        },
        {
          title: "Mode-aware service choices",
          description:
            "Quote and booking flows match air cargo, road delivery, and freight handling needs.",
          icon: "truck",
        },
        {
          title: "Careful shipment details",
          description:
            "Cargo notes, package count, weight, declared value, and contacts stay connected.",
          icon: "shield-check",
        },
        {
          title: "Support for practical delivery questions",
          description:
            "Customers can ask about pickup windows, route status, delivery exceptions, and freight handoffs.",
          icon: "headphones",
        },
      ],
    },
    coverage: {
      eyebrow: "Coverage and operations",
      title: "Built for local pickup, regional routes, cargo movement, and freight coordination.",
      description: `${brandName} supports customers who need parcels, cargo, and freight moved through clear routes, readable checkpoints, and delivery-ready handoffs.`,
      regions: [
        "Metro pickup and delivery",
        "Regional courier lanes",
        "Air cargo coordination",
        "Freight and pallet movement",
      ],
      operations: [
        {
          title: "Dispatch-ready handoffs",
          description:
            "Pickup details, delivery contacts, cargo notes, and access instructions are captured before movement starts.",
          icon: "warehouse",
        },
        {
          title: "Exception-aware support",
          description:
            "Customers get clearer language for delays, missed pickups, customs updates, and delivery attempts.",
          icon: "globe",
        },
      ],
      metrics: [
        {
          value: "Local",
          label: "courier pickups",
          description: "Fast movement for nearby businesses and households.",
        },
        {
          value: "Regional",
          label: "delivery lanes",
          description: "Coordinated movement beyond the immediate pickup area.",
        },
      ],
      image: {
        src: image.port,
        alt: "Cargo containers at a logistics terminal",
      },
    },
    testimonials: {
      eyebrow: "Customer proof",
      title: "A clearer way to manage shipments that matter.",
      description: `${brandName} gives customers organized shipping details and tracking milestones that help teams answer delivery questions faster.`,
      items: [
        {
          quote:
            "The quote and pickup flow makes it easier for our team to prepare shipment details before cargo leaves our site.",
          authorName: "Maya Chen",
          authorTitle: "Operations Manager",
          companyName: "Retail Distribution Team",
        },
        {
          quote:
            "Tracking milestones give our customer service team a clearer answer when recipients ask where a delivery stands.",
          authorName: "Jordan Ellis",
          authorTitle: "Client Services Lead",
          companyName: "Business Support Group",
        },
      ],
    },
    faqPreview: {
      eyebrow: "Common questions",
      title: "Answers customers often need before shipping.",
      description: `Learn what details help ${brandName} quote courier pickup, cargo movement, freight handling, tracking, and delivery support.`,
      cta: {
        label: "Read FAQs",
        href: "/faq",
        ariaLabel: "Read courier and freight frequently asked questions",
      },
      items: [
        {
          question: "What details help with a quote?",
          answer:
            "Origin, destination, service speed, package or cargo details, weight, declared value, and pickup timing all help shape the estimate.",
          href: "/faq",
        },
        {
          question: "Can I track a shipment without an account?",
          answer:
            "Yes. Use the public tracking page with the tracking number from your booking or shipment confirmation.",
          href: "/faq",
        },
      ],
    },
    cta: {
      eyebrow: "Ready to move a shipment?",
      title: "Request a logistics quote or book a pickup with clear shipment details.",
      description: `Share the route, cargo, timing, and delivery expectations so ${brandName} can help match the shipment to the right service.`,
      primaryCta: {
        label: "Book Pickup",
        href: "/book",
        ariaLabel: "Book a courier pickup",
      },
      secondaryCta: {
        label: "Get a Quote",
        href: "/quote",
        ariaLabel: "Request a courier, cargo, or freight quote",
      },
    },
    seo: {
      title: `${brandName} | Courier, Cargo and Freight Logistics`,
      description: `${brandName} supports courier delivery, cargo movement, air cargo, road transport, freight handling, pickup booking, and shipment tracking.`,
      keywords: [
        "courier service",
        "cargo logistics",
        "freight handling",
        "air cargo",
        "road delivery",
        "shipment tracking",
      ],
      openGraphTitle: `${brandName} Courier, Cargo and Freight Logistics`,
      openGraphDescription: `Plan pickup, cargo movement, freight handling, and delivery tracking with ${brandName}.`,
      canonicalPath: "/",
    },
  };
}

function buildServicesPageContent() {
  return {
    hero: {
      eyebrow: "Services",
      title: "Courier, cargo, and freight services for real shipment needs.",
      description: `${brandName} helps customers choose service options for urgent parcels, scheduled road delivery, air cargo, pallets, and larger freight movement with clear pickup and tracking support.`,
      primaryCta: {
        label: "Get a Quote",
        href: "/quote",
        ariaLabel: "Request a logistics quote",
      },
      secondaryCta: {
        label: "Book Pickup",
        href: "/book",
        ariaLabel: "Book a pickup",
      },
    },
    services: [
      {
        title: "Courier delivery",
        description:
          "Local and regional pickup and delivery for parcels, documents, samples, retail orders, and business-critical shipments.",
        icon: "truck",
        bullets: [
          "Same-day and scheduled pickup options",
          "Sender and recipient contact details captured upfront",
          "Tracking milestones from pickup to delivery",
        ],
      },
      {
        title: "Air cargo",
        description:
          "Airport-aware cargo movement for urgent shipments, longer routes, and time-sensitive delivery windows.",
        icon: "air",
        bullets: [
          "Express, standard, and priority air cargo paths",
          "Declared value and cargo detail support",
          "Clear handoff wording for air movement",
        ],
      },
      {
        title: "Road transport",
        description:
          "Route-led delivery for local lanes, regional movement, depot transfers, and planned customer shipments.",
        icon: "route",
        bullets: [
          "Local, regional, and scheduled road delivery",
          "Pickup access and delivery instructions",
          "Progress updates across route milestones",
        ],
      },
      {
        title: "Freight handling",
        description:
          "Support for pallets, LTL freight, full truckload movement, consolidated freight, and appointment-led cargo.",
        icon: "warehouse",
        bullets: [
          "Pallet and larger cargo details",
          "Freight appointment and facility handoff language",
          "Shipment records for tracking and delivery proof",
        ],
      },
    ],
    workflow: {
      title: "A simple shipment flow from quote to delivery.",
      description: `${brandName} keeps customers focused on the details that matter: mode, route, cargo, pickup timing, contacts, and delivery visibility.`,
      steps: [
        {
          title: "Request a quote",
          description:
            "Share route, transport mode, shipment size, declared value, and timing needs.",
        },
        {
          title: "Confirm pickup",
          description:
            "Add sender and recipient contacts, pickup access, package notes, and delivery instructions.",
        },
        {
          title: "Track movement",
          description:
            "Follow courier, cargo, hub, customs, freight, and delivery milestones.",
        },
        {
          title: "Close with proof",
          description:
            "Keep a clean shipment record once delivery is completed.",
        },
      ],
    },
    supportHighlights: [
      {
        title: "Proof of delivery",
        description:
          "Give senders and teams a cleaner delivery close-out record when the shipment is completed.",
        icon: "check-circle",
      },
      {
        title: "Shipment visibility",
        description:
          "Use readable milestones so customers understand what happened and what comes next.",
        icon: "route",
      },
      {
        title: "Cargo detail discipline",
        description:
          "Keep package notes, cargo details, declared value, and delivery contacts connected to the shipment.",
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
      title: `${brandName} Courier, Cargo and Freight Services`,
      description: `${brandName} provides courier delivery, air cargo, road transport, freight handling, pickup booking, shipment tracking, and delivery support.`,
      keywords: [
        "courier services",
        "cargo logistics",
        "freight services",
        "air cargo",
        "road transport",
        "shipment tracking",
      ],
      canonicalPath: "/services",
    },
  };
}

function buildAboutPageContent() {
  return {
    hero: {
      eyebrow: "About",
      title: "Logistics support built around clear handoffs and accountable delivery.",
      description: `${brandName} helps customers move shipments with realistic timing, careful handling, clear status updates, and support that understands courier, cargo, and freight movement.`,
    },
    story: {
      eyebrow: "How we work",
      title: "Reliable delivery starts before the driver arrives.",
      paragraphs: [
        `${brandName} starts every shipment with the details that keep logistics moving: pickup access, route expectations, package or cargo information, service speed, and contact details for both sides of the delivery.`,
        "The service experience is designed for customers who want fewer surprises. Whether a shipment is a parcel, urgent document, airport cargo, pallet, or regional freight load, the goal is to keep movement clear from quote to delivery.",
        `${brandName} writes tracking, support, and shipment records in customer language so senders and recipients can understand where the shipment stands without decoding internal logistics terms.`,
      ],
      stats: [
        {
          value: "Air",
          label: "cargo support for urgent and longer-distance movement",
        },
        {
          value: "Road",
          label: "courier delivery for local, scheduled, and regional lanes",
        },
        {
          value: "Freight",
          label: "handling support for pallets, LTL, and larger cargo",
        },
      ],
    },
    values: {
      title: "Clear details, careful movement, visible progress.",
      description: `${brandName} reduces uncertainty before pickup, during transit, and at delivery.`,
      items: [
        {
          title: "Operational clarity",
          description:
            "Each shipment should have clear pickup, delivery, contact, and cargo details before movement begins.",
          icon: "route",
        },
        {
          title: "Dependable timing",
          description:
            "Pickup windows and delivery expectations should be visible and realistic for customers.",
          icon: "clock",
        },
        {
          title: "Responsible handling",
          description:
            "Package notes, declared value, recipient details, and special instructions deserve attention at every handoff.",
          icon: "shield-check",
        },
        {
          title: "Human support",
          description:
            "Customers should be able to ask about routes, exceptions, tracking, customs, freight, and delivery timing.",
          icon: "headphones",
        },
      ],
    },
    reasons: [
      "Quote flows that start with the right transport mode",
      "Pickup forms that collect practical shipping details",
      "Tracking pages that make shipment status easier to understand",
      "Support language built around courier, cargo, and freight questions",
    ],
    cta: {
      eyebrow: "Ready to ship?",
      title: "Plan a pickup or request a logistics quote.",
      description: `Share the route, cargo, timing, and delivery expectations so ${brandName} can help select the right service path.`,
      primaryCta: {
        label: "Get a Quote",
        href: "/quote",
        ariaLabel: "Request a logistics quote",
      },
      secondaryCta: {
        label: "Contact support",
        href: "/contact",
        ariaLabel: "Contact logistics support",
      },
    },
    seo: {
      title: `About ${brandName}`,
      description: `Learn how ${brandName} supports courier delivery, cargo movement, freight handling, tracking, and customer-focused logistics support.`,
      keywords: [
        "logistics company",
        "courier company",
        "cargo delivery",
        "freight handling",
        "shipment tracking",
      ],
      canonicalPath: "/about",
    },
  };
}

function buildFaqPageContent() {
  return {
    hero: {
      eyebrow: "FAQ",
      title: "Answers for courier, cargo, and freight customers.",
      description: `Find practical answers about ${brandName} pickup planning, quote details, shipment tracking, cargo movement, freight handling, and support.`,
    },
    groups: [
      {
        title: "Shipping process",
        items: [
          {
            question: "What information helps with a pickup?",
            answer:
              "Have the pickup address, delivery address, sender and recipient contacts, package count, estimated weight, cargo notes, preferred pickup date, and access instructions ready.",
          },
          {
            question: "Can I request same-day courier delivery?",
            answer:
              "Same-day delivery depends on route capacity, pickup timing, destination distance, shipment readiness, and the selected service type.",
          },
          {
            question: "Do you support cargo and freight shipments?",
            answer:
              "Yes. The service flow supports air cargo, road delivery, pallets, LTL freight, truckload movement, and consolidated freight details.",
          },
        ],
      },
      {
        title: "Quotes and booking",
        items: [
          {
            question: "What affects my logistics quote?",
            answer:
              "Service speed, transport mode, distance, package size, cargo weight, declared value, pickup timing, and special handling needs can all affect the estimate.",
          },
          {
            question: "Should I choose air, road, or freight?",
            answer:
              "Choose air for urgent longer-distance cargo, road for local or regional courier delivery, and freight for pallets, larger cargo, LTL, truckload, or appointment-led movement.",
          },
          {
            question: "Can I get a quote before creating an account?",
            answer:
              "Yes. Customers can request a quote before signing in so service options and estimated cost are easier to review before booking.",
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
            question: "What do tracking milestones mean?",
            answer:
              "Milestones show meaningful shipment progress such as pickup confirmed, in transit, at hub, customs update, freight handoff, out for delivery, or delivered.",
          },
          {
            question: "What if my tracking number is not found?",
            answer:
              "Check the number for typos and try again. Newly created shipments may take a short time to appear after booking or dispatch processing.",
          },
        ],
      },
      {
        title: "Cargo, customs, and freight",
        items: [
          {
            question: "What cargo details should I prepare?",
            answer:
              "Prepare package count, dimensions where available, estimated weight, declared value, contents description, handling notes, and recipient contact details.",
          },
          {
            question: "What customs details may be needed?",
            answer:
              "International or air cargo movement may require goods descriptions, declared values, country of origin details, recipient contacts, and supporting commercial documents.",
          },
          {
            question: "Can freight deliveries require appointments?",
            answer:
              "Yes. Freight, pallets, facility deliveries, and larger cargo may require delivery appointments, dock access, loading notes, or recipient availability windows.",
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            question: "When should I contact support?",
            answer:
              "Contact support for pickup coordination, quote questions, tracking updates, incorrect shipment details, delivery exceptions, cargo handling notes, or freight appointment questions.",
          },
          {
            question: "What should I include in a support message?",
            answer:
              "Include your tracking number or quote reference, shipment route, pickup timing, contact details, and the outcome you need.",
          },
        ],
      },
    ],
    supportCta: {
      title: "Still need help?",
      description: `Contact ${brandName} support with your shipment route, pickup timing, tracking number, or quote reference.`,
      cta: {
        label: "Contact support",
        href: "/contact",
        ariaLabel: "Contact logistics support",
      },
    },
    seo: {
      title: `${brandName} Courier, Cargo and Freight FAQ`,
      description: `Answers about ${brandName} courier pickup, cargo delivery, freight quotes, shipment tracking, customs details, and logistics support.`,
      keywords: [
        "courier FAQ",
        "cargo delivery questions",
        "freight quote FAQ",
        "shipment tracking help",
        "pickup support",
      ],
      canonicalPath: "/faq",
    },
  };
}

function buildContactInfo(siteSettings) {
  const contact = siteSettings.companyContact ?? {};
  const hours = siteSettings.supportHours ?? {};

  return {
    eyebrow: "Contact",
    title: "Talk to logistics support before a shipment stalls.",
    description: `Reach ${brandName} support for pickup planning, cargo questions, freight movement, tracking updates, quote help, delivery exceptions, and account conversations.`,
    email: contact.email,
    phone: contact.phone,
    operatingHours: hours.label,
    address: contact.address,
  };
}

function buildFooterContent(siteSettings) {
  const contact = siteSettings.companyContact ?? {};
  const hours = siteSettings.supportHours ?? {};

  return {
    notice: `${brandName} provides courier, cargo, and freight support for clear pickups, careful handling, and dependable delivery visibility.`,
    supportEmail: contact.email,
    supportPhone: contact.phone,
    operatingHours: hours.label,
    address: contact.address,
  };
}

async function readPublicSettings() {
  const { data } = await supabase
    .from("site_settings")
    .select("key,value")
    .in("key", ["company_contact", "support_hours"]);
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

  return {
    companyContact: {
      email: settings.company_contact?.email ?? "support@example.com",
      phone: settings.company_contact?.phone ?? "+1 (800) 555-0188",
      address: settings.company_contact?.address ?? "Service office address",
    },
    supportHours: {
      label: settings.support_hours?.label ?? "Monday-Friday, 8:00 AM-7:00 PM",
    },
  };
}

const siteName = await readSiteName();
const publicSettings = await readPublicSettings();
const homepage = buildHomepageContent();

await upsertSetting("footer_notice", {
  text: `${brandName} provides courier, cargo, and freight support for clear pickups, careful handling, and dependable delivery visibility.`,
});

await Promise.all([
  ...Object.entries(homepage).map(([key, value]) => upsertCms("homepage", key, value)),
  upsertCms("services_page", "content", buildServicesPageContent()),
  upsertCms("about_page", "content", buildAboutPageContent()),
  upsertCms("faq", "content", buildFaqPageContent()),
  upsertCms("contact", "info", buildContactInfo(publicSettings)),
  upsertCms("footer", "content", buildFooterContent(publicSettings)),
]);

console.log(`Seeded real CMS content for ${siteName}.`);
