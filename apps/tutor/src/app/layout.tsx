import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Caveat, Kalam } from "next/font/google";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@core/components/analytics/GoogleTagManager";
import { EducationalOrganizationJsonLd, WebSiteJsonLd } from "@core/components/seo/JsonLd";

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

// Handwriting fonts for the tutor's whiteboard handwrite overlays
// (Phase 1' of the whiteboard markup initiative). Caveat is the primary
// — clean teacher-style handwriting between print and cursive. Kalam is
// the fallback — slightly more print-leaning for legibility at small
// sizes. Both load via next/font with swap so the page renders without
// blocking on the font.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

// viewport-fit=cover lets full-bleed pages (the tutor session stage) extend
// edge-to-edge and exposes the env(safe-area-inset-*) values used to keep the
// dock/drawer clear of the notch + home indicator. interactiveWidget
// 'resizes-content' shrinks the viewport when the soft keyboard opens so the
// fixed bottom dock rides above it instead of being hidden behind it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com"
  ),
  title: {
    default: "Evelyn Tutor - AI Voice Tutor",
    template: "%s | Evelyn Tutor",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  description:
    "Evelyn's AI voice tutor — live 1,700+ lesson voice tutoring sessions across math, science, English, history, test prep, and more.",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${caveat.variable} ${kalam.variable}`} suppressHydrationWarning>
      <head>
        <EducationalOrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <GoogleTagManager />
      <body className="flex min-h-screen flex-col font-sans">
        <GoogleTagManagerNoscript />
        {children}
      </body>
    </html>
  );
}
