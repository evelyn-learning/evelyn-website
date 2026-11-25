/**
 * GET /sitemap.xml on the developer portal (2026-11-24: the host had none, 404).
 *
 * Every indexable page of portal-pages.ts, on the portal host, with the day its content last changed. A route
 * handler for the same reason as robots.txt: the portal host's own, reached through the middleware rewrite.
 */
import { sitemapXml } from '../portal-pages';

export const dynamic = 'force-static';

export function GET() {
  return new Response(sitemapXml(), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
