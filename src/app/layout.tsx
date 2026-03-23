import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { EducationalOrganizationJsonLd } from "@/components/seo/JsonLd";
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
    "Evelyn Learning provides AI-powered learning solutions including AI voice tutors, AI essay feedback, virtual lab simulations, career exploration software, and 24/7 student support AI. Adaptive learning platform for K-12, higher education, and workforce development.",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <EducationalOrganizationJsonLd />
      </head>
      <GoogleTagManager />
      <body className="flex min-h-screen flex-col font-sans">
        <GoogleTagManagerNoscript />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
