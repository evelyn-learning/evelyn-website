/**
 * GET /robots.txt on the developer portal (2026-11-24: the host had none, 404).
 *
 * A route handler, not app/robots.ts: that file would be this app's robots.txt on every host, and this one is
 * the portal host's only. The middleware rewrites tutor.evelynlearning.com/robots.txt to this path.
 *
 * Everything public may be crawled. The private pages carry noindex as well; they are listed here so that
 * crawlers do not spend requests on pages that need a sign-in or a signed token. /api/ is closed except the
 * public language list, which llms.txt links to.
 */
import { robotsTxt } from '../portal-pages';

export const dynamic = 'force-static';

export function GET() {
  return new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
