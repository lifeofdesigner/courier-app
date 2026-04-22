import type { Metadata } from "next";

import {
  AboutCmsForm,
  AdminShell,
  CmsEditorShell,
  CmsPreviewCard,
  CmsSidebar,
  ContactCmsForm,
  FaqCmsForm,
  FooterCmsForm,
  HomepageCmsForm,
  SeoCmsForm,
  ServicesPageCmsForm,
  SiteIdentityForm,
} from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCmsEditorData } from "@/lib/queries/admin-cms";

export const metadata: Metadata = {
  title: "CMS",
};

const cmsNavigation = [
  {
    label: "Site Identity",
    href: "#site-identity",
    description: "Logo, contact basics, hours",
  },
  {
    label: "Homepage",
    href: "#homepage",
    description: "Hero, services, trust, CTA",
  },
  {
    label: "Services Page",
    href: "#services-page",
    description: "Services, workflow, SEO",
  },
  {
    label: "About Page",
    href: "#about-page",
    description: "Story, values, CTA",
  },
  {
    label: "Contact Info",
    href: "#contact-info",
    description: "Email, phone, address",
  },
  {
    label: "FAQ",
    href: "#faq",
    description: "Questions and answers",
  },
  {
    label: "Footer",
    href: "#footer",
    description: "Footer notice and support",
  },
  {
    label: "SEO",
    href: "#seo",
    description: "Homepage metadata",
  },
];

export default async function CMSPage() {
  const [admin, cmsData] = await Promise.all([
    requireAdmin(),
    getAdminCmsEditorData(),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Content Management"
      description="Edit public site content with friendly fields, inline image uploads, and explicit draft or published controls."
    >
      <CmsEditorShell sidebar={<CmsSidebar items={cmsNavigation} />}>
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#FF6B2B]">
              Publishing overview
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0B1C3A]">
              CMS sections
            </h2>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <CmsPreviewCard
              title="Site Identity"
              description="Brand assets, support details, and company address."
              published={cmsData.siteIdentity.published}
              updatedAt={cmsData.siteIdentity.updatedAt}
            />
            <CmsPreviewCard
              title="Homepage"
              description="Hero, tracking promo, services preview, trust, coverage, social proof, FAQ preview, CTA, and SEO."
              published={Object.values(cmsData.homepage).every(
                (section) => section.published,
              )}
              updatedAt={cmsData.homepage.hero.updatedAt}
            />
            <CmsPreviewCard
              title="Services Page"
              description="Services page copy, cards, workflow, highlights, and metadata."
              published={cmsData.servicesPage.published}
              updatedAt={cmsData.servicesPage.updatedAt}
            />
            <CmsPreviewCard
              title="About Page"
              description="About page story, values, reasons, CTA, and metadata."
              published={cmsData.aboutPage.published}
              updatedAt={cmsData.aboutPage.updatedAt}
            />
          </div>
        </section>

        <SiteIdentityForm section={cmsData.siteIdentity} />
        <HomepageCmsForm sections={cmsData.homepage} />
        <ServicesPageCmsForm section={cmsData.servicesPage} />
        <AboutCmsForm section={cmsData.aboutPage} />
        <ContactCmsForm section={cmsData.contactInfo} />
        <FaqCmsForm section={cmsData.faqPage} />
        <FooterCmsForm section={cmsData.footer} />
        <SeoCmsForm section={cmsData.homepage.seo} />
      </CmsEditorShell>
    </AdminShell>
  );
}
