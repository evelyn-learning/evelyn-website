/**
 * Metadata and structured data for the developer portal's public pages (2026-11-24).
 *
 * Why every URL here is absolute: the root layout's metadataBase is www.evelynlearning.com (the retail tutor),
 * so a relative canonical on a portal page would point at www. The portal's own host is the canonical one, for
 * the page on either host.
 *
 * Why each page sets Open Graph in full: metadata merges shallowly, so a page that set only a title would keep
 * the layout's og:url (the portal home) and og:title.
 */
import type { Metadata } from 'next';
import { PARENT_SITE, PORTAL_ORIGIN, PORTAL_SITE_NAME, portalPage, portalUrl } from './portal-pages';

export const PORTAL_TITLE_TEMPLATE = `%s | ${PORTAL_SITE_NAME}`;

/** The metadata of one indexable portal page. `description` replaces the list's when the page builds its own
 *  from the price and count constants. */
export function portalMetadata(path: string, over: { description?: string } = {}): Metadata {
  const page = portalPage(path);
  const url = portalUrl(page.path);
  const description = over.description ?? page.description;
  const fullTitle = `${page.title} | ${PORTAL_SITE_NAME}`;
  return {
    title: page.path === '/' ? { absolute: fullTitle } : page.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'en_US', url, siteName: PORTAL_SITE_NAME, title: fullTitle, description },
    // No image: this app has no share image of its own (the root layout names one that is not in public/).
    twitter: { card: 'summary', title: fullTitle, description },
    robots: { index: true, follow: true },
  };
}

export const organizationLd = {
  '@type': 'Organization',
  '@id': `${PARENT_SITE.url}/#organization`,
  name: PARENT_SITE.name,
  url: PARENT_SITE.url,
  email: 'info@evelynlearning.com',
} as const;

/** Home > Documentation > page, for a docs page. */
export function breadcrumbLd(path: string): Record<string, unknown> {
  const trail = [{ name: 'Voice Tutor', path: '/' }];
  if (path.startsWith('/docs')) trail.push({ name: portalPage('/docs').title, path: '/docs' });
  if (path !== '/' && path !== '/docs') trail.push({ name: portalPage(path).title, path });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: portalUrl(t.path) })),
  };
}

export { PORTAL_ORIGIN };
