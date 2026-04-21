import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { Card, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
};

const faqs = [
  {
    question: "What information do I need to book a pickup?",
    answer:
      "Customers should provide the pickup address, contact details, preferred pickup window, package count, and any handling notes.",
  },
  {
    question: "Can I track a shipment without an account?",
    answer:
      "The public tracking route is scaffolded so customers can look up shipments by tracking number once tracking events are connected.",
  },
  {
    question: "When will pricing be available?",
    answer:
      "Quote pricing will be connected in the next phase after service rules, shipment dimensions, and Supabase storage are added.",
  },
  {
    question: "Do you support business accounts?",
    answer:
      "The customer dashboard routes are ready for account-based shipments, quotes, profile details, and future billing workflows.",
  },
] as const;

export default function FAQPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title="Straight answers for common shipping questions."
        description="A simple help page structure for customer education, support deflection, and future CMS-managed content."
      />
      <Container className="py-14 sm:py-16" size="lg">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-navy">
                  {faq.question}
                  <span className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted">
                  {faq.answer}
                </p>
              </details>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
