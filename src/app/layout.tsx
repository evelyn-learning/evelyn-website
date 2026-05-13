import type { Metadata } from "next";
import { Inter, Poppins, Caveat, Kalam } from "next/font/google";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { EducationalOrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { AppShell } from "@/components/layout/AppShell";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com"
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
    "Recognized by TIME as a top EdTech company of 2026. Evelyn Learning provides AI-powered learning solutions including AI voice tutors, AI essay feedback, virtual lab simulations, career exploration software, and 24/7 student support AI. Adaptive learning platform for K-12, higher education, and workforce development.",
  keywords: [
    // Core GEO Keywords
    "AI-Powered Learning",
    "Adaptive Learning Platform",
    "Personalized Learning",
    "Intelligent Tutoring Systems",
    "Learning Analytics",
    "Predictive Analytics in Education",
    "Automated Grading",
    "AI Feedback Systems",
    // High-value search keywords
    "AI Voice Tutor",
    "AI Essay Feedback",
    "AI Essay Feedback Generator",
    "Virtual Lab Simulations",
    "Career Exploration Software",
    "24/7 Student Support AI",
    "Automated Essay Scoring Software",
    "AI Skill Gap Analysis",
    // Skills & Workforce
    "Skills-Based Learning",
    "Workforce-Aligned Learning",
    "Student Success Platform",
    "Career Guidance Platform",
    // Technology & Integration
    "EdTech Platform",
    "LMS Integration",
    "Interoperability",
    // Accessibility & Inclusion
    "Inclusive Learning",
    "Accessible EdTech",
    // Traditional Keywords
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
    url: "https://www.evelynlearning.com",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${caveat.variable} ${kalam.variable}`} suppressHydrationWarning>
      <head>
        <EducationalOrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <GoogleTagManager />
      <body className="flex min-h-screen flex-col font-sans">
        <GoogleTagManagerNoscript />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
