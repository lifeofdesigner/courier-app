import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { company } from "@/constants/site";
import type { PublicPageSettings } from "@/lib/queries/public-pages";

type ContactPanelProps = {
  settings: PublicPageSettings;
};

function phoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");

  return normalized ? `tel:${normalized}` : company.phoneHref;
}

export function ContactPanel({ settings }: ContactPanelProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
        Operations support
      </p>
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
        Reach a team that understands courier timing.
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600">
        Use these details for tracking questions, pickup coordination, quote
        support, and delivery exceptions during business hours.
      </p>

      <div className="mt-7 space-y-4 text-sm leading-7 text-slate-600">
        <a
          href={phoneHref(settings.companyContact.phone)}
          className="flex gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Phone aria-hidden="true" className="mt-1 h-5 w-5 text-[#FF6B2B]" />
          <span>
            <strong className="block text-[#0B1C3A]">Phone</strong>
            {settings.companyContact.phone}
          </span>
        </a>
        <a
          href={`mailto:${settings.companyContact.email}`}
          className="flex gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Mail aria-hidden="true" className="mt-1 h-5 w-5 text-[#FF6B2B]" />
          <span>
            <strong className="block text-[#0B1C3A]">Email</strong>
            {settings.companyContact.email}
          </span>
        </a>
        <p className="flex gap-3 rounded-2xl border border-slate-200 p-4">
          <Clock3 aria-hidden="true" className="mt-1 h-5 w-5 text-[#FF6B2B]" />
          <span>
            <strong className="block text-[#0B1C3A]">Hours</strong>
            {settings.supportHours.label}
          </span>
        </p>
        <p className="flex gap-3 rounded-2xl border border-slate-200 p-4">
          <MapPin aria-hidden="true" className="mt-1 h-5 w-5 text-[#FF6B2B]" />
          <span>
            <strong className="block text-[#0B1C3A]">Office</strong>
            {settings.companyContact.address}
          </span>
        </p>
      </div>

      <p className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        <ShieldCheck
          aria-hidden="true"
          className="mt-1 h-5 w-5 shrink-0 text-[#FF6B2B]"
        />
        {settings.footerNotice.text}
      </p>
    </aside>
  );
}
