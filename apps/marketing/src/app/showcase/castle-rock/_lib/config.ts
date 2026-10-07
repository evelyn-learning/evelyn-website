// Passcode-gated showcase for Castle Rock Research (SOLARO). Not in nav,
// sitemap or the index. To add a section, add one entry to NAV and a route
// folder beside ./solutions.
export const SHOWCASE = {
  /** Must match `productId` in src/config/showcaseProducts.ts (admin aggregation). */
  productId: "castle-rock",
  productTitle: "Castle Rock Research — AI Solutions",
  basePath: "/showcase/castle-rock",
  passcode: "SOLARO2026",
  storageKey: "castle_rock_access",
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Sample AI Solutions", href: `${SHOWCASE.basePath}/solutions` },
];
