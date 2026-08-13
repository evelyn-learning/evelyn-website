import type { Metadata } from "next";

// Passcode-gated slide deck presented live to NAHQ (Sherry — Sr. Director of
// Professional Development, Frank — leads certification) and left with them
// afterward. Not part of the public site — no nav entry, no sitemap entry,
// no indexing. Replaces the earlier plain page at /nahq (see that route's
// redirect).
export const metadata: Metadata = {
  title: "Evelyn Learning for NAHQ — Adaptive CPHQ Preparation",
  description:
    "A working proposal for adaptive CPHQ exam preparation built on NAHQ's published content outline.",
  robots: { index: false, follow: false },
};

export default function NahqShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
