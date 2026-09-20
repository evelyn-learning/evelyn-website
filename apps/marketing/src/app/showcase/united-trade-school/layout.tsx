import type { Metadata } from "next";

// Passcode-gated deck presented live to United Trade School and left with
// them afterward. Not part of the public site — no nav, no sitemap, no index.
export const metadata: Metadata = {
  title: "Evelyn Learning for United Trade School — Evelyn Academy",
  description: "A working proposal for tutor-led Pharmacy Technician and Medical Administrative Assistant programs on Evelyn Academy.",
  robots: { index: false, follow: false },
};

export default function UtsShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
