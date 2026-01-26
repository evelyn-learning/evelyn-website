import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com"
  ),
  title: {
    default: "Evelyn Learning - AI-Powered Learning Solutions",
    template: "%s | Evelyn Learning",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  description:
    "Evelyn Learning provides comprehensive educational content solutions, AI-powered learning services, and expert content development for organizations, publishers, and educational institutions.",
  keywords: [
    "educational content",
    "e-learning",
    "AI in education",
    "curriculum development",
    "test preparation",
    "K-12 education",
    "higher education",
  ],
  authors: [{ name: "Evelyn Learning" }],
  creator: "Evelyn Learning",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://evelynlearning.com",
    siteName: "Evelyn Learning",
    title: "Evelyn Learning - AI-Powered Learning Solutions",
    description:
      "Comprehensive educational content solutions and AI-powered learning services.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Evelyn Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evelyn Learning - AI-Powered Learning Solutions",
    description:
      "Comprehensive educational content solutions and AI-powered learning services.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <OrganizationJsonLd />
      </head>
      <GoogleTagManager />
      <body className="flex min-h-screen flex-col font-sans">
        <GoogleTagManagerNoscript />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
