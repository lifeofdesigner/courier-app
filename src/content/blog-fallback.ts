import type { BlogPostDetail } from "@/types";

export const blogFallbackPosts = [
  {
    id: "fallback-business-shipping-rhythm",
    slug: "building-a-reliable-business-shipping-rhythm",
    title: "Building a reliable business shipping rhythm",
    excerpt:
      "A practical guide to pickup windows, package readiness, and delivery expectations for teams that ship every week.",
    coverImageUrl: null,
    publishedAt: "2026-03-18T09:00:00.000Z",
    readingMinutes: 5,
    category: "Business shipping",
    seoTitle: "Building a reliable business shipping rhythm",
    seoDescription:
      "Learn how pickup windows, shipment preparation, and communication routines help businesses keep courier deliveries predictable.",
    authorName: "Atlas Courier Operations",
    contentHtml: `
      <p>Reliable courier work starts before a driver reaches reception. The strongest shipping routines give operations teams enough information to plan capacity, avoid missed handoffs, and keep recipients informed.</p>
      <h2>Start with a consistent pickup window</h2>
      <p>Recurring pickup windows reduce decision-making for busy teams. If your parcels are usually ready by mid-afternoon, a standing collection window can help your team batch labels, confirm recipient details, and avoid last-minute calls.</p>
      <h2>Keep shipment details complete</h2>
      <p>Every booking should include the delivery contact, package count, weight estimate, declared value where relevant, and any access notes. Those small details help dispatchers assign the right route and reduce exceptions at delivery.</p>
      <h2>Make proof of delivery easy to share</h2>
      <p>For business-critical parcels, internal stakeholders often need confirmation as soon as delivery is complete. Tracking links and proof of delivery records keep customer service, sales, and operations teams working from the same status.</p>
      <p>A dependable rhythm is not complicated. It is a repeatable way to prepare parcels, book pickups, and communicate when something changes.</p>
    `,
  },
  {
    id: "fallback-tracking-milestones",
    slug: "what-clear-tracking-milestones-should-tell-customers",
    title: "What clear tracking milestones should tell customers",
    excerpt:
      "Tracking works best when each update explains what happened, where the shipment is, and what should happen next.",
    coverImageUrl: null,
    publishedAt: "2026-02-26T09:00:00.000Z",
    readingMinutes: 4,
    category: "Tracking",
    seoTitle: "What clear courier tracking milestones should tell customers",
    seoDescription:
      "Understand the courier tracking milestones that reduce support questions and improve delivery confidence.",
    authorName: "Atlas Courier Support",
    contentHtml: `
      <p>Good tracking does more than say a parcel is moving. It gives customers enough context to understand the delivery stage and decide whether they need to act.</p>
      <h2>Pickup confirmed</h2>
      <p>This milestone tells the shipper that the parcel has entered the courier workflow. It should appear once the courier has collected the shipment or the operations team has accepted the handoff.</p>
      <h2>In transit</h2>
      <p>In-transit updates should show progress without creating noise. Location names, route checkpoints, and expected next steps are more useful than vague movement updates.</p>
      <h2>Out for delivery</h2>
      <p>This is the point when recipients often prepare access, reception, or internal receiving teams. Clear wording matters because the parcel is now close to final delivery.</p>
      <h2>Delivered</h2>
      <p>The delivered milestone should include proof of delivery details when available, such as recipient name, timestamp, or a delivery note. This gives both sender and recipient a reliable close-out record.</p>
    `,
  },
  {
    id: "fallback-customs-documents",
    slug: "customs-documents-that-keep-international-parcels-moving",
    title: "Customs documents that keep international parcels moving",
    excerpt:
      "International courier shipments move faster when descriptions, values, and supporting documents are ready before pickup.",
    coverImageUrl: null,
    publishedAt: "2026-01-30T09:00:00.000Z",
    readingMinutes: 6,
    category: "Customs",
    seoTitle: "Customs documents for international courier shipments",
    seoDescription:
      "Prepare descriptions, values, and supporting paperwork before international courier pickup to reduce customs delays.",
    authorName: "Atlas Courier Operations",
    contentHtml: `
      <p>Cross-border delivery depends on more than transport speed. Customs teams need clear, accurate information before they can release a shipment into the destination country.</p>
      <h2>Use accurate goods descriptions</h2>
      <p>A description such as "samples" or "parts" is usually too vague. A better description explains what the item is made from, what it is used for, and whether it is new, used, or a commercial sample.</p>
      <h2>Declare realistic values</h2>
      <p>Declared value supports customs assessment and insurance handling. It should reflect the shipment contents and match the commercial invoice or supporting documents.</p>
      <h2>Prepare recipient information</h2>
      <p>International deliveries often need recipient phone numbers, email addresses, tax identifiers, or import contact details. Missing recipient information can slow clearance even when the parcel itself is straightforward.</p>
      <p>When documents are complete before pickup, couriers can focus on the delivery lane instead of chasing missing paperwork after the shipment is already moving.</p>
    `,
  },
  {
    id: "fallback-same-day-readiness",
    slug: "how-to-prepare-for-same-day-courier-delivery",
    title: "How to prepare for same-day courier delivery",
    excerpt:
      "Same-day delivery succeeds when pickup contacts, access notes, and recipient availability are confirmed early.",
    coverImageUrl: null,
    publishedAt: "2025-12-12T09:00:00.000Z",
    readingMinutes: 4,
    category: "Operations",
    seoTitle: "How to prepare for same-day courier delivery",
    seoDescription:
      "Prepare pickup details, access instructions, and recipient availability before booking a same-day courier.",
    authorName: "Atlas Courier Dispatch",
    contentHtml: `
      <p>Same-day courier work is time-sensitive, but it should not feel chaotic. A few preparation steps can protect the pickup window and help dispatch choose the right route.</p>
      <h2>Confirm the parcel is ready</h2>
      <p>Couriers lose valuable time when packages are still being packed, labeled, or approved. Mark the shipment clearly and make sure reception knows who is collecting it.</p>
      <h2>Add useful access notes</h2>
      <p>Loading bays, security desks, lift access, parking limits, and building entry instructions can all affect collection time. Add those notes when booking instead of waiting for the driver to call.</p>
      <h2>Check recipient availability</h2>
      <p>Same-day service works best when someone is ready to receive the parcel. Confirm contact details and delivery hours before the courier leaves pickup.</p>
      <p>Preparation keeps urgent delivery focused on movement, not avoidable delays.</p>
    `,
  },
  {
    id: "fallback-shipping-cost-factors",
    slug: "what-affects-a-courier-quote",
    title: "What affects a courier quote?",
    excerpt:
      "Distance, urgency, package size, handling requirements, and delivery lane complexity all shape the final courier estimate.",
    coverImageUrl: null,
    publishedAt: "2025-11-19T09:00:00.000Z",
    readingMinutes: 5,
    category: "Shipping planning",
    seoTitle: "What affects a courier quote?",
    seoDescription:
      "Learn the main factors that affect courier quote estimates, from service urgency to package size and delivery requirements.",
    authorName: "Atlas Courier Pricing Team",
    contentHtml: `
      <p>A good courier quote should be easy to understand. The final estimate usually reflects a small set of practical delivery factors.</p>
      <h2>Service speed</h2>
      <p>Same-day and express deliveries need tighter dispatch planning, so they usually cost more than economy or scheduled services with wider delivery windows.</p>
      <h2>Distance and lane complexity</h2>
      <p>Local deliveries are priced differently from regional or cross-border movements. Complex delivery lanes may involve handoffs, linehaul partners, or customs support.</p>
      <h2>Package size and handling</h2>
      <p>Weight, dimensions, fragility, declared value, and special handling notes can all influence the service level needed for safe transport.</p>
      <p>The best way to control cost is to provide complete shipment details before booking. Clear details help the courier recommend the right service instead of padding for uncertainty.</p>
    `,
  },
] satisfies BlogPostDetail[];
