import type { Metadata } from "next";

import {
  CoverageSection,
  FAQPreview,
  HomeCta,
  HomeHero,
  ServicePreview,
  SocialProof,
  TrackingPromo,
  TrustSection,
} from "@/components/marketing";
import { getHomePageContent } from "@/lib/queries/cms";

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

  return (
    <main>
      <HomeHero content={content.hero} />
      <TrackingPromo content={content.trackingPromo} />
      <ServicePreview content={content.services} />
      <TrustSection content={content.trust} />
      <CoverageSection content={content.coverage} />
      <SocialProof content={content.testimonials} />
      <FAQPreview content={content.faqPreview} />
      <HomeCta content={content.cta} />
    </main>
  );
}
