import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./keystone.css";

// Keystone: Castle Rock's review site for Evelyn's AI solutions. Private —
// no index, no links from the marketing site. AppShell skips the marketing
// header/footer for this segment.
export const metadata: Metadata = {
  title: { default: "Keystone", template: "%s · Keystone" },
  description: "Review of Evelyn Learning's AI solutions for SOLARO items.",
  robots: { index: false, follow: false },
};

export default function KeystoneLayout({ children }: { children: React.ReactNode }) {
  return <div className="ks">{children}</div>;
}
