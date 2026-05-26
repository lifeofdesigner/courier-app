import { Mail } from "lucide-react";

import { Input, Textarea } from "@/components/ui";
import type { PublicPageSettings } from "@/lib/queries/public-pages";

type ContactFormCardProps = {
  settings: PublicPageSettings;
};

export function ContactFormCard({ settings }: ContactFormCardProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Contact request
      </p>
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy">
        Send shipment details to support.
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600">
        Direct message intake will be connected in a later delivery phase. For
        now, use the fields below to organize the details your support email
        should include.
      </p>

      <div
        aria-label="Contact request form preview"
        className="mt-7 grid gap-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Name" name="name" placeholder="Jane Smith" />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
          />
        </div>
        <Input
          label="Tracking or quote reference"
          name="reference"
          placeholder="Optional"
        />
        <Textarea
          label="How can we help?"
          name="message"
          placeholder="Tell us about the shipment, pickup window, route, or service question."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`mailto:${settings.companyContact.email}`}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            <Mail aria-hidden="true" className="mr-2 h-4 w-4" />
            Email support
          </a>
          <p className="text-sm leading-7 text-slate-600">
            We are not storing contact requests in this phase.
          </p>
        </div>
      </div>
    </section>
  );
}
