import type { Metadata } from "next";

import { company, siteConfig } from "@/constants/site";
import { getSiteUrl } from "@/lib/env";
import type {
  BlogPostDetail,
  OrganizationJsonLd,
  SeoPageMeta,
} from "@/types";

type JsonLdRecord = Record<string, unknown>;

export function getBaseUrl() {
  return getSiteUrl();
}

export function absoluteUrl(pathOrUrl = "/") {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

  return `${getBaseUrl()}${path}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage,
  noIndex = false,
}: SeoPageMeta): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage ?? siteConfig.defaultOgImagePath);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${company.name} courier service preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createBlogPostMetadata(post: BlogPostDetail): Metadata {
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.coverImageUrl ?? siteConfig.defaultOgImagePath);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName ?? company.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function getOrganizationJsonLd(): OrganizationJsonLd &
  JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.defaultOgImagePath),
    contactPoint: {
      telephone: company.phone,
      contactType: "customer support",
      email: company.email,
      areaServed: ["United States", "International"],
      availableLanguage: "English",
    },
  };
}

export function getWebsiteJsonLd(): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/track")}?tracking={tracking_number}`,
      "query-input": "required name=tracking_number",
    },
  };
}

export function getFaqPageJsonLd(
  faqs: { question: string; answer: string }[],
): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getBlogPostingJsonLd(post: BlogPostDetail): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl
      ? absoluteUrl(post.coverImageUrl)
      : absoluteUrl(siteConfig.defaultOgImagePath),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName ?? company.name,
    },
    publisher: {
      "@type": "Organization",
      name: company.legalName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.defaultOgImagePath),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };
}
