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
    id: "overview",
    label: "Overview",
    href: "/admin/cms?section=overview",
    description: "Publishing status and section summary",
  },
  {
    id: "site-identity",
    label: "Site Identity",
    href: "/admin/cms?section=site-identity",
    description: "Logo, contact basics, hours",
  },
  {
    id: "homepage",
    label: "Homepage",
    href: "/admin/cms?section=homepage",
    description: "Hero, services, trust, CTA",
  },
  {
    id: "services-page",
    label: "Services Page",
    href: "/admin/cms?section=services-page",
    description: "Services, workflow, SEO",
  },
  {
    id: "about-page",
    label: "About Page",
    href: "/admin/cms?section=about-page",
    description: "Story, values, CTA",
  },
  {
    id: "contact-info",
    label: "Contact Info",
    href: "/admin/cms?section=contact-info",
    description: "Email, phone, address",
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/admin/cms?section=faq",
    description: "Questions and answers",
  },
  {
    id: "footer",
    label: "Footer",
    href: "/admin/cms?section=footer",
    description: "Footer notice and support",
  },
  {
    id: "seo",
    label: "SEO",
    href: "/admin/cms?section=seo",
    description: "Homepage metadata",
  },
];

type CMSPageProps = {
  searchParams?: Promise<{
    section?: string;
  }>;
};

export default async function CMSPage({ searchParams }: CMSPageProps) {
  const params = await searchParams;
  const requestedSection = params?.section ?? "overview";
  const activeSection = cmsNavigation.some(
    (item) => item.id === requestedSection,
  )
    ? requestedSection
    : "overview";
  const [admin, cmsData] = await Promise.all([
    requireAdmin(),
    getAdminCmsEditorData(),
  ]);

  const activeEditor = (() => {
    if (activeSection === "site-identity") {
      return <SiteIdentityForm section={cmsData.siteIdentity} />;
    }

    if (activeSection === "homepage") {
      return <HomepageCmsForm sections={cmsData.homepage} />;
    }

    if (activeSection === "services-page") {
      return <ServicesPageCmsForm section={cmsData.servicesPage} />;
    }

    if (activeSection === "about-page") {
      return <AboutCmsForm section={cmsData.aboutPage} />;
    }

    if (activeSection === "contact-info") {
      return <ContactCmsForm section={cmsData.contactInfo} />;
    }

    if (activeSection === "faq") {
      return <FaqCmsForm section={cmsData.faqPage} />;
    }

    if (activeSection === "footer") {
      return <FooterCmsForm section={cmsData.footer} />;
    }

    if (activeSection === "seo") {
      return <SeoCmsForm section={cmsData.homepage.seo} />;
    }

    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#FF6B2B]">
            Publishing overview
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0B1C3A]">
            CMS sections
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Pick a section from the left to edit a focused set of fields.
          </p>
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
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
    );
  })();

  return (
    <AdminShell
      profile={admin.profile}
      title="Content Management"
      description="Edit public site content with friendly fields, inline image uploads, and explicit draft or published controls."
      maxWidthClassName="max-w-[1680px]"
    >
      <CmsEditorShell
        sidebar={<CmsSidebar items={cmsNavigation} activeId={activeSection} />}
      >
        {activeEditor}
      </CmsEditorShell>
    </AdminShell>
  );
}
