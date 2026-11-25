/**
 * The developer portal's public pages, in one list (2026-11-24).
 *
 * The same pages are served on two hosts: https://tutor.evelynlearning.com/<path> (the middleware rewrite) and
 * https://www.evelynlearning.com/tutor-portal/<path>. Search engines saw two copies with no canonical, every
 * docs page shared one title, and there was no sitemap. This list is what the sitemap, the canonical of each
 * page, the docs sidebar, the breadcrumbs and llms.txt are built from, so a page cannot be in one and missing
 * from another (scripts/test-portal-seo.ts checks the list against the page files).
 *
 * Pure: no imports, safe in client components and in lib code.
 */
export const PORTAL_ORIGIN = 'https://tutor.evelynlearning.com';
export const PORTAL_SITE_NAME = 'Evelyn Voice Tutor';
export const PARENT_SITE = { name: 'Evelyn Learning', url: 'https://www.evelynlearning.com' };
/** The product page on the parent site: the portal footer links to it. */
export const PRODUCT_PAGE_URL = 'https://www.evelynlearning.com/products/voice-tutor';

export interface PortalPage {
  /** Path on the portal host, without the /tutor-portal prefix. */
  path: string;
  /** The page's own title (the layout's template adds the site name). */
  title: string;
  /** One or two sentences. No numbers here: a page that quotes a price or a count builds its description from
   *  the constants (data/facts.ts) and passes it to portalMetadata. */
  description: string;
  /** The day the page's content last changed (the sitemap's lastmod). Change it with the page. */
  updated: string;
  /** Docs pages only: the sidebar label, in sidebar order. */
  docs?: string;
}

export const PORTAL_PAGES: readonly PortalPage[] = [
  { path: '/', title: 'AI Voice Tutor API for Education Platforms', description: 'A hosted AI tutor with voice, typed chat and a live whiteboard that you embed in your product with one signed link. Free sandbox keys at sign-up.', updated: '2026-11-24' },
  { path: '/pricing', title: 'Pricing', description: 'Per-minute pricing for the Voice Tutor: prepaid minute packs, typed sessions at a lower rate, and a free sandbox.', updated: '2026-11-24' },
  { path: '/demo', title: 'Live Demo', description: 'Try a voice lesson or a typed lesson with the Voice Tutor in your browser. No account needed.', updated: '2026-11-24' },
  { path: '/sandbox', title: 'Get your sandbox keys', description: 'Sign up with an email address and get Voice Tutor sandbox API keys as soon as you confirm it, on the production engine.', updated: '2026-11-24' },
  { path: '/docs', title: 'Documentation', description: 'How to integrate the Voice Tutor: session tokens, the embed, the partner API, events and webhooks, languages and the developer package.', updated: '2026-11-24', docs: 'Overview' },
  { path: '/docs/quickstart', title: 'Getting Started', description: 'Sign a session token on your server, embed the tutor in an iframe, listen for events and pull the results.', updated: '2026-11-24', docs: 'Getting Started' },
  { path: '/docs/package', title: 'Developer Package', description: 'The optional package for Node and Python: signed session links, the worksheet and usage API, webhook verification, a command line tool and an MCP server.', updated: '2026-11-24', docs: 'Developer Package' },
  { path: '/docs/embed', title: 'Embed Configuration', description: 'Every claim of the session token: student, lesson, language, teacher persona and voice, session goal, time cap and resume.', updated: '2026-11-24', docs: 'Embed Configuration' },
  { path: '/docs/languages', title: 'Languages', description: 'The languages a lesson can be taught in, how to set one in the session token, and how a student can change language during a lesson.', updated: '2026-11-24', docs: 'Languages' },
  { path: '/docs/voices', title: 'Voices and Companions', description: 'Listen to the tutor voices, use a ready-made teacher, or write a themed companion persona of your own.', updated: '2026-11-24', docs: 'Voices and Companions' },
  { path: '/docs/api', title: 'API Reference', description: 'The signed partner API: session facts, usage, learning gaps, mastery, practice, grading, lesson generation and worksheet help.', updated: '2026-11-24', docs: 'API Reference' },
  { path: '/docs/webhooks', title: 'Webhooks and Events', description: 'Server webhooks (session ended, minutes low, minutes used up) with their payload, signature and retries, and the browser events the embed posts to your page.', updated: '2026-11-24', docs: 'Webhooks and Events' },
  { path: '/docs/modules', title: 'Your Curriculum', description: 'Turn your own lesson, assignment, PDF or photo into a lesson plan the tutor teaches, and lock a session to it.', updated: '2026-11-24', docs: 'Your Curriculum' },
  { path: '/docs/authentication', title: 'Authentication', description: 'One partner secret from your dashboard: HS256 session tokens, HMAC-SHA256 request signing, and self-serve rotation.', updated: '2026-11-24', docs: 'Authentication' },
  { path: '/docs/whiteboard', title: 'Whiteboard', description: 'What the tutor draws while it teaches: equations and worked steps, graphs, geometry, statistics, circuits, molecules, timelines, maps and more.', updated: '2026-11-24', docs: 'Whiteboard' },
];

/** Never indexed: pages behind a sign-in or a signed token, and the draft sandbox terms. A page file under one
 *  of these needs no canonical; every other page file must be in PORTAL_PAGES. */
export const NOINDEX_PATHS: readonly string[] = ['/dashboard', '/embed', '/replay', '/home', '/sandbox/terms'];

/** What robots.txt keeps crawlers out of. /sandbox/terms is left crawlable so its noindex tag can be read. */
export const ROBOTS_DISALLOW: readonly string[] = ['/dashboard', '/embed', '/replay', '/home', '/api/'];

export const DOCS_PAGES: readonly PortalPage[] = PORTAL_PAGES.filter((p) => p.docs);

/** Text files for programs and coding assistants; listed in llms.txt, not in the sitemap. */
export const PORTAL_TEXT_FILES = { llms: '/llms.txt', llmsFull: '/llms-full.txt', guide: '/docs/integration.md', languages: '/api/tutor-portal/languages' } as const;

export function portalUrl(path: string): string {
  return path === '/' ? `${PORTAL_ORIGIN}/` : `${PORTAL_ORIGIN}${path}`;
}

export function portalPage(path: string): PortalPage {
  const page = PORTAL_PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`portal page not in PORTAL_PAGES: ${path}`);
  return page;
}

/** The portal host's robots.txt (served by robots.txt/route.ts). */
export function robotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    ...ROBOTS_DISALLOW.map((d) => `Disallow: ${d}`),
    `Allow: ${PORTAL_TEXT_FILES.languages}`,
    '',
    `Sitemap: ${PORTAL_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');
}

/** The portal host's sitemap.xml (served by sitemap.xml/route.ts): every page of PORTAL_PAGES. */
export function sitemapXml(): string {
  const urls = PORTAL_PAGES.map((pg) => `  <url>\n    <loc>${portalUrl(pg.path)}</loc>\n    <lastmod>${pg.updated}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
