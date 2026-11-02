// Pure helpers for the Beacon blog flags (noindex + product CTA).
// No DB access here — the page, sitemap and admin wire these in.

export type CtaProduct = "voice-tutor" | "academy";

export const CTA_PRODUCTS: readonly CtaProduct[] = ["voice-tutor", "academy"];

export function isCtaProduct(value: unknown): value is CtaProduct {
  return typeof value === "string" && (CTA_PRODUCTS as readonly string[]).includes(value);
}

/** Robots directive for a blog post: a noindexed post stays followable so its links still pass. */
export function blogRobots(post: { noindex?: boolean }): { index: boolean; follow: true } {
  return { index: post.noindex !== true, follow: true };
}

/** A post belongs in the sitemap only when it is published and not noindexed. */
export function isSitemapPost(post: { status: string; noindex?: boolean }): boolean {
  return post.status === "published" && post.noindex !== true;
}

// Copy rule: names no client, quotes no price.
export const CTA_COPY: Record<CtaProduct, { heading: string; body: string; href: string; button: string }> = {
  "voice-tutor": {
    heading: "Add an AI voice tutor to your platform",
    body: "A white-label tutor that talks students through problems on a live whiteboard, under your brand.",
    href: "/products/voice-tutor",
    button: "Try the live demo",
  },
  academy: {
    heading: "Launch your own branded online academy",
    body: "Courses, practice and an AI tutor built in — white-label, on your domain.",
    href: "/products/academy",
    button: "See the Academy",
  },
};
