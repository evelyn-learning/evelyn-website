import type { Metadata } from "next";

// Passcode-gated deck for the GDI Communications demo (Wed 28 Oct 2026, 9:00
// JST) and left with them afterward. Not part of the public site — no nav,
// no sitemap, no index.
export const metadata: Metadata = {
  title: "Evelyn Learning for GDI Communications — Bilingual Voice Tutor",
  description: "A working proposal for a white-label English voice tutor with Japanese guidance, built on GDI's own course material.",
  robots: { index: false, follow: false },
};

export default function GdiShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
