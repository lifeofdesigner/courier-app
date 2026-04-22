import type { Metadata } from "next";

import { FooterCta, SiteFooter, SiteHeader } from "@/components/layout";
import { ToastProvider } from "@/components/ui/toast";
import { company, siteConfig } from "@/constants/site";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [
    "courier service",
    "same-day delivery",
    "shipment tracking",
    "business courier",
    "scheduled pickup",
  ],
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.legalName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImagePath,
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
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.twitterImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-background text-text antialiased">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <FooterCta />
            <SiteFooter />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
