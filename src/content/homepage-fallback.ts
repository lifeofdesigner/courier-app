import type { HomePageContent } from "@/types/cms";

export const homepageFallbackContent = {
  hero: {
    eyebrow: "Courier services built for clarity",
    title: "Ship with confidence from pickup to proof of delivery.",
    description:
      "Atlas Courier helps businesses and households move urgent parcels with clear pickup windows, careful handling, and delivery updates that keep everyone aligned.",
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
    motion: {
      scrollEffect: "fade-up",
      textEffect: "rise",
    },
    stats: [
      {
        label: "Pickup windows",
        value: "Same day",
        description: "Priority local collections for time-sensitive deliveries.",
      },
      {
        label: "Tracking visibility",
        value: "End to end",
        description: "Status checkpoints from dispatch through delivery.",
      },
      {
        label: "Support coverage",
        value: "Business hours",
        description: "Responsive assistance from a courier operations team.",
      },
    ],
    visual: {
      eyebrow: "Live shipment view",
      title: "Shipment AX-2048",
      route: "Newark, NJ to Chicago, IL",
      statusLabel: "On schedule",
      items: [
        {
          icon: "package-check",
          title: "Pickup confirmed",
          description: "Driver assigned and parcel received.",
          meta: "9:15 AM",
          isComplete: true,
        },
        {
          icon: "truck",
          title: "In transit",
          description: "Moving through the regional courier network.",
          meta: "12:40 PM",
          isComplete: true,
        },
        {
          icon: "map-pin",
          title: "Destination facility",
          description: "Final-mile handoff prepared for delivery.",
          meta: "Expected today",
          isComplete: false,
        },
      ],
    },
  },
  trackingPromo: {
    eyebrow: "Track a shipment",
    title: "Get a clear shipment status in seconds.",
    description:
      "Enter a tracking number to see the latest delivery milestone as soon as tracking is connected.",
    inputLabel: "Tracking number",
    inputPlaceholder: "Enter tracking number",
    submitLabel: "Track Shipment",
    actionHref: "/track",
    helperText: "Use the tracking number from your booking confirmation.",
  },
  services: {
    eyebrow: "Services",
    title: "Mode-aware courier options for urgent and planned freight.",
    description:
      "Choose from air cargo, road delivery, and managed freight services with clear language before a quote or booking starts.",
    cta: {
      label: "View services",
      href: "/services",
      ariaLabel: "View all courier services",
    },
    items: [
      {
        title: "Air cargo",
        description:
          "Express, standard, and priority air cargo support for time-sensitive movement across longer lanes.",
        href: "/services",
        icon: "air",
      },
      {
        title: "Road delivery",
        description:
          "Same-day, regional, and standard road service for local routes, depots, and planned collections.",
        href: "/services",
        icon: "truck",
      },
      {
        title: "Freight handling",
        description:
          "LTL, full truckload, pallet, and consolidated freight options for larger cargo and appointment-led handoffs.",
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
      title: "Choose the lane before the shipment moves.",
      description:
        "Give customers a clear service path from the homepage, with visual cards for air, road, and freight movement.",
      items: [
        {
          mode: "air",
          eyebrow: "Air cargo",
          title: "Priority movement for urgent cargo.",
          description:
            "Airport-aware service wording, cargo details, declared value, and customs-ready handoffs for time-sensitive routes.",
          href: "/quote?transportMode=air",
          ctaLabel: "Quote air cargo",
          icon: "air",
          highlights: ["Express Air", "Standard Air", "Priority Air Cargo"],
          image: {
            src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
            alt: "Cargo aircraft prepared for air shipment",
          },
        },
        {
          mode: "road",
          eyebrow: "Road delivery",
          title: "Route-led courier coverage for local and regional lanes.",
          description:
            "Depot-aware road delivery for same-day pickups, regional movement, and dependable scheduled service.",
          href: "/quote?transportMode=road",
          ctaLabel: "Quote road delivery",
          icon: "truck",
          highlights: ["Same-Day Road", "Regional Road", "Standard Road"],
          image: {
            src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=85",
            alt: "Road freight truck moving on a highway",
          },
        },
        {
          mode: "freight",
          eyebrow: "Freight",
          title: "Cargo and pallet movement with appointment-ready details.",
          description:
            "Freight support for pallets, LTL, full truckload, and consolidated cargo that needs heavier coordination.",
          href: "/quote?transportMode=freight",
          ctaLabel: "Quote freight",
          icon: "warehouse",
          highlights: [
            "LTL Freight",
            "Full Truckload",
            "Pallet Freight",
            "Consolidated Freight",
          ],
          image: {
            src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=85",
            alt: "Stacked freight containers at a logistics terminal",
          },
        },
      ],
    },
    workflow: {
      eyebrow: "How it works",
      title: "From shipment intent to proof of delivery.",
      description:
        "The public journey now matches the operational model: choose a mode, quote the right service, book the pickup, then track every milestone.",
      badgeLabel: "Operations flow",
      badgeValue: "4 steps",
      image: {
        src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
        alt: "Logistics warehouse team preparing shipments",
      },
      steps: [
        {
          title: "Select a transport mode",
          description:
            "Start with air, road, or freight so every service option and form label makes business sense.",
          icon: "route",
        },
        {
          title: "Get a mode-aware quote",
          description:
            "Share origin, destination, cargo, declared value, and weight to calculate a cleaner estimate.",
          icon: "check-circle",
        },
        {
          title: "Book the pickup",
          description:
            "Confirm contacts, pickup timing, access notes, and payment details before operations takes over.",
          icon: "truck",
        },
        {
          title: "Track and print records",
          description:
            "Customers can follow shipment milestones and keep a printable copy for internal or recipient reference.",
          icon: "package-check",
        },
      ],
    },
    quoteCta: {
      eyebrow: "Start a quote",
      title: "Choose a shipment mode and move straight into the right quote flow.",
      description:
        "Give customers a confident first step with service language that matches air cargo, road delivery, or freight handling.",
      modes: [
        {
          mode: "air",
          title: "Air cargo quote",
          description: "For urgent cargo, airport-aware routing, and customs-ready details.",
          href: "/quote?transportMode=air",
        },
        {
          mode: "road",
          title: "Road delivery quote",
          description: "For local, regional, and scheduled route-based courier movement.",
          href: "/quote?transportMode=road",
        },
        {
          mode: "freight",
          title: "Freight quote",
          description: "For pallets, LTL, truckload, and appointment-led cargo.",
          href: "/quote?transportMode=freight",
        },
      ],
    },
  },
  trust: {
    eyebrow: "Why customers choose us",
    title: "Trust-building details for repeat shipping.",
    description:
      "Every part of the homepage is structured around the practical questions customers ask before handing over a package.",
    metrics: [
      {
        value: "4 hr",
        label: "local pickup windows",
        description: "Same-day availability across core service areas.",
      },
      {
        value: "24/7",
        label: "status visibility",
        description: "Tracking records stay accessible whenever customers check.",
      },
      {
        value: "1 team",
        label: "operations contact",
        description: "A clear support path for shipment questions.",
      },
    ],
    features: [
      {
        title: "Clear tracking from pickup to delivery",
        description:
          "Customers can follow delivery progress through simple, readable milestones.",
        icon: "route",
      },
      {
        title: "Professional handling for business shipments",
        description:
          "Pickup notes, package details, and delivery expectations stay organized.",
        icon: "shield-check",
      },
      {
        title: "Straightforward quotes before booking",
        description:
          "Customers can plan cost, timing, and service level before committing.",
        icon: "check-circle",
      },
      {
        title: "Support that understands courier operations",
        description:
          "Questions go to a team focused on delivery windows, handoffs, and exceptions.",
        icon: "headphones",
      },
    ],
  },
  coverage: {
    eyebrow: "Coverage and operations",
    title: "Built for local speed with regional reach.",
    description:
      "Atlas Courier is prepared for pickups across dense city routes, nearby suburbs, and coordinated regional lanes, with content fields ready for precise coverage editing later.",
    regions: [
      "Metro pickup and delivery",
      "Suburban business routes",
      "Regional parcel transfers",
      "Nationwide courier coordination",
    ],
    operations: [
      {
        title: "Dispatch-ready handoffs",
        description:
          "Pickup details, delivery contacts, and timing expectations are presented before a customer starts the flow.",
        icon: "warehouse",
      },
      {
        title: "Exception-aware communication",
        description:
          "The content model supports customer-facing updates for delays, missed pickups, and special handling.",
        icon: "globe",
      },
    ],
    metrics: [
      {
        value: "Metro",
        label: "core routes",
        description: "Fast coverage for nearby businesses and households.",
      },
      {
        value: "Regional",
        label: "delivery lanes",
        description: "Coordinated transfers beyond the immediate city area.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Customer proof",
    title: "A calmer way to manage time-sensitive deliveries.",
    description:
      "The homepage content model includes social proof records for future admin editing.",
    items: [
      {
        quote:
          "Atlas Courier gives our team the delivery clarity we need without making customers chase updates.",
        authorName: "Maya Chen",
        authorTitle: "Operations Manager",
        companyName: "Northline Retail Group",
      },
      {
        quote:
          "Pickup scheduling is direct, and the delivery milestones are easy for our client service team to explain.",
        authorName: "Jordan Ellis",
        authorTitle: "Client Services Lead",
        companyName: "Summit Legal Support",
      },
    ],
  },
  faqPreview: {
    eyebrow: "Common questions",
    title: "Answers customers often need before shipping.",
    description:
      "The homepage can surface a small FAQ preview while the full FAQ remains on its own route.",
    cta: {
      label: "Read FAQs",
      href: "/faq",
      ariaLabel: "Read courier service frequently asked questions",
    },
    items: [
      {
        question: "Can I book a same-day pickup?",
        answer:
          "Same-day pickup availability depends on route capacity, pickup location, and delivery urgency.",
        href: "/faq",
      },
      {
        question: "Will customers see tracking updates?",
        answer:
          "Tracking content is structured for status visibility once the backend workflow is connected.",
        href: "/faq",
      },
    ],
  },
  cta: {
    eyebrow: "Ready to move a shipment?",
    title: "Book a pickup or request a quote from the same clean workflow.",
    description:
      "Start with the delivery details your team already has, then choose the service path that fits the shipment.",
    primaryCta: {
      label: "Book Pickup",
      href: "/book",
      ariaLabel: "Book a courier pickup",
    },
    secondaryCta: {
      label: "Talk to support",
      href: "/contact",
      ariaLabel: "Contact courier support",
    },
  },
  seo: {
    title: "Atlas Courier | Reliable courier and delivery services",
    description:
      "Professional courier services for same-day pickup, scheduled delivery, shipment tracking, and business courier support.",
    keywords: [
      "courier service",
      "same-day delivery",
      "shipment tracking",
      "business courier",
      "scheduled pickup",
    ],
    openGraphTitle: "Atlas Courier | Reliable courier and delivery services",
    openGraphDescription:
      "Ship urgent parcels with clear pickup windows, careful handling, and delivery updates from Atlas Courier.",
    canonicalPath: "/",
  },
} satisfies HomePageContent;
