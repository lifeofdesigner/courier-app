import type { Metadata } from "next";

import {
  AboutCmsForm,
  AdminPageHeader,
  AdminSectionCard,
  CmsEditorShell,
  CmsPreviewCard,
  ContactCmsForm,
  FaqCmsForm,
  FooterCmsForm,
  HomepageCmsForm,
  SeoCmsForm,
  ServicesPageCmsForm,
  SiteIdentityForm,
} from "@/components/admin";
import { getAdminCmsEditorData } from "@/lib/queries/admin-cms";

export const metadata: Metadata = {
  title: "CMS",
};

const cmsSectionIds = [
  "overview",
  "site-identity",
  "homepage",
  "services-page",
  "about-page",
  "contact-info",
  "faq",
  "footer",
  "seo",
];

type CMSPageProps = {
  searchParams?: Promise<{
    section?: string;
  }>;
};

export default async function CMSPage({ searchParams }: CMSPageProps) {
  const params = await searchParams;
  const requestedSection = params?.section ?? "overview";
  const activeSection = cmsSectionIds.includes(requestedSection)
    ? requestedSection
    : "overview";
  const cmsData = await getAdminCmsEditorData();

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
      <AdminSectionCard
        title="CMS sections"
        eyebrow="Publishing overview"
        description="Pick a section from the left navigation to edit a focused set of fields."
      >
        <div className="grid gap-5 xl:grid-cols-2">
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
            title="Services"
            description="Services page copy, cards, workflow, highlights, and metadata."
            published={cmsData.servicesPage.published}
            updatedAt={cmsData.servicesPage.updatedAt}
          />
          <CmsPreviewCard
            title="About"
            description="About page story, values, reasons, CTA, and metadata."
            published={cmsData.aboutPage.published}
            updatedAt={cmsData.aboutPage.updatedAt}
          />
        </div>
      </AdminSectionCard>
    );
  })();

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "CMS" },
        ]}
        title="Content Management"
        description="Edit public site content with friendly fields, inline image uploads, and explicit draft or published controls."
        status={{ label: "Draft and publish", tone: "accent" }}
        primaryAction={{ label: "Preview Site", href: "/" }}
      />

      <CmsEditorShell>{activeEditor}</CmsEditorShell>
    </>
  );
}
