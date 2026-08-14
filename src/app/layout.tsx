import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pages } from "@/content/pages";
import { createPageMetadata } from "@/lib/metadata";
import { organizationNode, websiteNode } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const homeMetadata = createPageMetadata({
  title: pages.home.title,
  description: pages.home.description,
  path: pages.home.path,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${pages.home.title} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: "/images/brand/dmrush-logo.png",
    apple: "/images/brand/dmrush-logo.png",
  },
  alternates: homeMetadata.alternates,
  openGraph: {
    ...homeMetadata.openGraph,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pages.home.title,
    description: pages.home.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-offwhite font-sans text-foreground">
        <JsonLd data={[organizationNode(), websiteNode()]} />
        <SkipLink />
        <Header />
        <main id="main" className="min-w-0 flex-1 overflow-x-clip">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
