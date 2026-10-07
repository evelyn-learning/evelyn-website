import type { Metadata } from "next";
import Shell from "./_components/Shell";

// Passcode-gated partner showcase for Castle Rock Research. Not part of the
// public site — no nav, no sitemap, no index.
export const metadata: Metadata = {
  title: "Evelyn Learning for Castle Rock Research",
  description: "Sample AI solutions for SOLARO items, prepared by Evelyn Learning for Castle Rock Research.",
  robots: { index: false, follow: false },
};

export default function CastleRockShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
