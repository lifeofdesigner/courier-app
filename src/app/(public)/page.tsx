import type { Metadata } from "next";

import {
  CoverageSection,
  FAQPreview,
  HomeCta,
  HomeHero,
  HomepageWorkflow,
  ModeQuoteCta,
  ModeServiceShowcase,
  MotionSection,
  SeoJsonLd,
  ServicePreview,
  SocialProof,
  TrackingPromo,
  TrustSection,
} from "@/components/marketing";
import { getHomePageContent } from "@/lib/queries/cms";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePageContent();
  const { seo } = content;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonicalPath
      ? {
          canonical: seo.canonicalPath,
        }
      : undefined,
    openGraph: {
      title: seo.openGraphTitle ?? seo.title,
      description: seo.openGraphDescription ?? seo.description,
      type: "website",
      images: seo.openGraphImage
        ? [
            {
              url: seo.openGraphImage.src,
              alt: seo.openGraphImage.alt,
              width: seo.openGraphImage.width,
              height: seo.openGraphImage.height,
            },
          ]
        : undefined,
    },
  };
}

export default async function HomePage() {
  const content = await getHomePageContent();
  const { enhancements } = content;
  const motion = content.hero.motion ?? {
    scrollEffect: "fade-up" as const,
    textEffect: "rise" as const,
  };

  return (
    <main>
      <SeoJsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
      <MotionSection {...motion}>
        <HomeHero content={content.hero} />
      </MotionSection>
      <MotionSection {...motion} delayMs={60}>
        <TrackingPromo content={content.trackingPromo} />
      </MotionSection>
      <MotionSection {...motion} delayMs={90}>
        {enhancements.visibility.modeServices ? (
          <ModeServiceShowcase content={enhancements.modeServices} />
        ) : (
          <ServicePreview content={content.services} />
        )}
      </MotionSection>
      <MotionSection {...motion} delayMs={120}>
        {enhancements.visibility.workflow ? (
          <HomepageWorkflow content={enhancements.workflow} />
        ) : null}
      </MotionSection>
      <MotionSection {...motion} delayMs={150}>
        <TrustSection content={content.trust} />
      </MotionSection>
      <MotionSection {...motion} delayMs={180}>
        <CoverageSection content={content.coverage} />
      </MotionSection>
      <MotionSection {...motion} delayMs={210}>
        {enhancements.visibility.quoteCta ? (
          <ModeQuoteCta content={enhancements.quoteCta} />
        ) : null}
      </MotionSection>
      <MotionSection {...motion} delayMs={240}>
        <SocialProof content={content.testimonials} />
      </MotionSection>
      <MotionSection {...motion} delayMs={270}>
        <FAQPreview content={content.faqPreview} />
      </MotionSection>
      <MotionSection {...motion} delayMs={300}>
        <HomeCta content={content.cta} />
      </MotionSection>
    </main>
  );
}
