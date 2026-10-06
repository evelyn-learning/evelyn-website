/**
 * Document metadata for the two pages that are served INSIDE a partner's
 * product: the live session embed (/tutor-portal/embed) and the session
 * replay (/tutor-portal/replay).
 *
 * Why: both sit under the root layout, whose metadata describes this site
 * (title template, description, Open Graph / Twitter cards, favicon). A
 * white-label student or staff member saw that in the tab title, in
 * view-source and in assistive technology. These documents carry a neutral
 * title — or the partner's own product name where the signed token supplies
 * one — and none of the site's descriptive metadata. They are also never
 * indexed: every URL carries a signed, short-lived token.
 *
 * Metadata merges shallowly per key (last segment wins), so each key the
 * root sets is explicitly cleared here; a key left out would be inherited.
 *
 * Pure. No env, no I/O.
 */
import type { Metadata } from 'next';

export const EMBED_DOCUMENT_TITLE = 'Lesson';
export const REPLAY_DOCUMENT_TITLE = 'Session replay';

/** A plain grey dot. Declared so the browser neither inherits the site's
 *  favicon links nor falls back to requesting /favicon.ico for the tab. */
export const NEUTRAL_ICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='6' fill='%2394a3b8'/%3E%3C/svg%3E";

const PRODUCT_NAME_MAX_CHARS = 60;

/** A partner product name fit for a document title, or undefined. The claim
 *  is unvalidated JSON: only a non-blank string is used, on one line, capped. */
export function brandProductName(branding: unknown): string | undefined {
  const raw = (branding as { product_name?: unknown } | null | undefined)?.product_name;
  if (typeof raw !== 'string') return undefined;
  const name = raw.replace(/\s+/g, ' ').trim();
  if (!name) return undefined;
  return name.length > PRODUCT_NAME_MAX_CHARS ? name.slice(0, PRODUCT_NAME_MAX_CHARS).trimEnd() : name;
}

/** "<neutral title>" or "<neutral title> · <partner product>". */
export function partnerFrameTitle(base: string, branding?: unknown): string {
  const product = brandProductName(branding);
  return product ? `${base} · ${product}` : base;
}

/** The full metadata for a partner-frame document. `title.absolute` opts out
 *  of both ancestor title templates. */
export function partnerFrameMetadata(title: string): Metadata {
  return {
    title: { absolute: title },
    description: null,
    applicationName: null,
    keywords: null,
    authors: null,
    creator: null,
    publisher: null,
    openGraph: null,
    twitter: null,
    manifest: null,
    icons: { icon: [{ url: NEUTRAL_ICON_DATA_URI, type: 'image/svg+xml' }] },
    robots: { index: false, follow: false },
  };
}

/** Is this pathname one of the partner-frame documents? Both spellings: the
 *  canonical path and the prefix-less one served on the tutor.* hosts
 *  (middleware rewrite). */
export function isPartnerFramePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const p = pathname.replace(/^\/tutor-portal(?=\/)/, '');
  return p === '/embed' || p.startsWith('/embed/') || p === '/replay' || p.startsWith('/replay/');
}
