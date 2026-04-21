import type { Metadata } from "next";

import { FooterCta, SiteFooter, SiteHeader } from "@/components/layout";
import { company } from "@/constants/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${company.name} | Reliable courier and delivery services`,
    template: `%s | ${company.name}`,
  },
  description:
    "Professional courier services for tracking, quotes, pickups, and business delivery operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-background text-text antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <FooterCta />
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
