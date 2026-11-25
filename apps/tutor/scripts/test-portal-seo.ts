/**
 * Developer portal: search metadata, the sitemap and robots.txt, and the facts on the public pages (2026-11-24).
 *
 * Why this exists: an audit found the portal with no canonical tags, no sitemap, one title for every docs page,
 * and copy that had drifted from the engine ("billed monthly in arrears", "5 concurrent sessions", "16
 * whiteboard types", webhooks "on the roadmap"). Each check below pins one of those to the code it must follow.
 *
 *   npx tsx scripts/test-portal-seo.ts
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { Metadata } from 'next';
import { SANDBOX_FREE_MINUTES, ROTATED_SECRET_GRACE_MS } from '@/lib/tutor/partner-dashboard/core';
import { MINUTE_PACKS, PACK_LIFETIME_MS, PAID_SESSION_MAX_SEC } from '@/lib/tutor/partner-dashboard/billing';
import { llmsFullTxt, llmsTxt, integrationGuideMarkdown } from '@/lib/tutor/partner-dashboard/integration-guide';
import { WEBHOOK_RETRY_DELAYS_MS } from '@/lib/tutor/partner-dashboard/webhooks';
import { DEFAULT_SESSION_MAX_SEC, TEXT_MINUTE_RATE } from '@/lib/tutor/portal/partner-pool';
import { offeredLanguages } from '@/lib/tutor/voice/lesson-language';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { DIAGRAM_CATALOG } from '@/lib/tutor/diagrams/catalog/manifest';
import { TOOL_FIGURES } from '@/lib/tutor/v2/figure-catalogue';
import { boardCounts, catalogueBySubject } from '@/app/tutor-portal/data/board-catalogue';
import { configParams } from '@/app/tutor-portal/data/config-params';
import { lessonPlanCountFloor } from '@/app/tutor-portal/data/curriculum';
import { portalFacts } from '@/app/tutor-portal/data/facts';
import { languageCount } from '@/app/tutor-portal/data/languages';
import { pricing, sandboxLimits } from '@/app/tutor-portal/data/pricing';
import { serverWebhookEvents } from '@/app/tutor-portal/data/webhook-events';
import { INLINE_BOARD_FORMS } from '@/app/tutor-portal/data/whiteboard-types';
import { DOCS_PAGES, NOINDEX_PATHS, PORTAL_ORIGIN, PORTAL_PAGES, ROBOTS_DISALLOW, robotsTxt, sitemapXml } from '@/app/tutor-portal/portal-pages';
import { PORTAL_TITLE_TEMPLATE, breadcrumbLd, portalMetadata } from '@/app/tutor-portal/seo';

const APP = resolve(__dirname, '..');
const PORTAL = join(APP, 'src/app/tutor-portal');
const src = (rel: string) => readFileSync(join(APP, 'src', rel), 'utf8');

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ok  ${name}`);
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** tutor-portal/docs/api/page.tsx -> /docs/api ; route groups such as (app) are not part of the path. */
function pagePath(file: string): string {
  const parts = relative(PORTAL, file).split('/').slice(0, -1).filter((p) => !/^\(.*\)$/.test(p));
  return `/${parts.join('/')}`;
}
const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

const files = walk(PORTAL);
const pageFiles = files.filter((f) => /\/page\.tsx$/.test(f));
const indexable = pageFiles.filter((f) => !NOINDEX_PATHS.some((p) => under(pagePath(f), p)));

console.log('portal pages and metadata');

test('every page file is either in PORTAL_PAGES or under a noindex path', () => {
  const listed = new Set(PORTAL_PAGES.map((p) => p.path));
  const found = new Set(indexable.map(pagePath));
  assert.deepEqual([...found].sort(), [...listed].sort(), 'PORTAL_PAGES must equal the indexable page files');
});

test('every indexable page exports metadata built by portalMetadata for its own path', () => {
  for (const f of indexable) {
    const path = pagePath(f);
    const text = readFileSync(f, 'utf8');
    assert.match(text, /export const metadata: Metadata = portalMetadata\(/, `${path}: no portalMetadata`);
    const named = /portalMetadata\('([^']+)'/.exec(text)?.[1];
    assert.equal(named, path, `${path}: portalMetadata names ${named}`);
  }
});

test('the canonical and og:url of each page are absolute on the portal host', () => {
  assert.equal(PORTAL_ORIGIN, 'https://tutor.evelynlearning.com');
  for (const p of PORTAL_PAGES) {
    const m: Metadata = portalMetadata(p.path);
    const want = p.path === '/' ? `${PORTAL_ORIGIN}/` : `${PORTAL_ORIGIN}${p.path}`;
    assert.equal(m.alternates?.canonical, want, p.path);
    assert.equal((m.openGraph as { url?: string }).url, want, p.path);
    assert.ok(!want.includes('/tutor-portal'), p.path);
    assert.deepEqual(m.robots, { index: true, follow: true }, p.path);
  }
});

test('titles and descriptions are unique and present', () => {
  const titles = PORTAL_PAGES.map((p) => p.title);
  const descriptions = PORTAL_PAGES.map((p) => p.description);
  assert.equal(new Set(titles).size, titles.length, 'duplicate title');
  assert.equal(new Set(descriptions).size, descriptions.length, 'duplicate description');
  for (const p of PORTAL_PAGES) {
    assert.ok(p.description.length >= 50 && p.description.length <= 200, `${p.path}: description length ${p.description.length}`);
    assert.match(p.updated, /^\d{4}-\d{2}-\d{2}$/, p.path);
    // A registry description carries no numbers: a page that quotes one builds it from the constants.
    assert.doesNotMatch(p.description.replace(/HS256|SHA256/g, ''), /\d/, `${p.path}: number in a registry description`);
  }
});

test('the docs layout sets no shared title, and the portal layout sets its own base, Open Graph and twitter card', () => {
  assert.doesNotMatch(src('app/tutor-portal/docs/layout.tsx'), /export const metadata/);
  const layout = src('app/tutor-portal/layout.tsx');
  assert.match(layout, /metadataBase: new URL\(PORTAL_ORIGIN\)/);
  assert.match(layout, /openGraph: \{[^}]*url: `\$\{PORTAL_ORIGIN\}\/`/);
  assert.match(layout, /twitter: \{/);
  assert.ok(layout.includes(`template: '${PORTAL_TITLE_TEMPLATE}'`), 'the layout title template must equal the one portalMetadata builds og:title with');
});

test('private pages are noindex, and the sandbox terms too', () => {
  assert.match(src('app/tutor-portal/dashboard/(app)/layout.tsx'), /robots: \{ index: false, follow: false \}/);
  assert.match(src('app/tutor-portal/dashboard/login/page.tsx'), /robots: \{ index: false/);
  assert.match(src('app/tutor-portal/dashboard/verify/page.tsx'), /robots: \{ index: false, follow: false \}/);
  assert.match(src('app/tutor-portal/sandbox/terms/page.tsx'), /robots: \{ index: false, follow: true \}/);
  assert.match(src('lib/tutor/portal/partner-frame-metadata.ts'), /robots: \{ index: false, follow: false \}/);
  for (const f of ['embed/layout.tsx', 'replay/layout.tsx', 'home/page.tsx']) assert.match(src(`app/tutor-portal/${f}`), /partnerFrameMetadata\(/, f);
  assert.doesNotMatch(src('app/tutor-portal/docs/voices/page.tsx'), /index: false/);
});

test('breadcrumbs: every docs page has one, ending on its own URL', () => {
  for (const p of DOCS_PAGES) {
    assert.match(src(`app/tutor-portal${p.path}/page.tsx`), new RegExp(`<DocsBreadcrumb path="${p.path}" />`), p.path);
    const items = (breadcrumbLd(p.path) as { itemListElement: Array<{ item: string; position: number }> }).itemListElement;
    assert.equal(items[items.length - 1]!.item, `${PORTAL_ORIGIN}${p.path}`);
    assert.deepEqual(items.map((i) => i.position), items.map((_, i) => i + 1));
  }
});

console.log('sitemap, robots, middleware');

test('the sitemap lists exactly the indexable pages, on the portal host, with a lastmod', () => {
  const xml = sitemapXml();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  const want = PORTAL_PAGES.map((p) => (p.path === '/' ? `${PORTAL_ORIGIN}/` : `${PORTAL_ORIGIN}${p.path}`));
  assert.deepEqual(locs.sort(), [...want].sort());
  assert.equal([...xml.matchAll(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)].length, PORTAL_PAGES.length);
  for (const loc of locs) for (const p of NOINDEX_PATHS) assert.ok(!under(loc.slice(PORTAL_ORIGIN.length) || '/', p), loc);
});

test('robots.txt disallows the private paths and names the sitemap', () => {
  const txt = robotsTxt();
  for (const p of ['/dashboard', '/embed', '/replay', '/home', '/api/']) {
    assert.ok(ROBOTS_DISALLOW.includes(p), p);
    assert.match(txt, new RegExp(`^Disallow: ${p}$`, 'm'), p);
  }
  assert.match(txt, /^User-agent: \*$/m);
  assert.match(txt, /^Allow: \/$/m);
  assert.match(txt, /^Sitemap: https:\/\/tutor\.evelynlearning\.com\/sitemap\.xml$/m);
  // No public page is closed to crawlers.
  for (const p of PORTAL_PAGES) for (const d of ROBOTS_DISALLOW) assert.ok(!p.path.startsWith(d), `${p.path} is disallowed by ${d}`);
});

test('the route files exist where the middleware rewrite sends /robots.txt, /sitemap.xml and /llms-full.txt', () => {
  for (const r of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt']) assert.match(src(`app/tutor-portal/${r}/route.ts`), /export function GET\(\)/, r);
  // The middleware's matcher must not exclude these paths (it excludes _next, favicons, images/, fonts/, voice-samples/).
  const matcher = /'\/\(\(\?!([^)]*)\)\.\*\)'/.exec(src('middleware.ts'))?.[1] ?? '';
  assert.ok(matcher.length > 0, 'middleware matcher not found');
  for (const word of ['robots', 'sitemap', 'llms', 'docs']) assert.ok(!matcher.includes(word), `middleware matcher excludes ${word}`);
});

console.log('facts on the public pages');

const facts = portalFacts();

test('the facts equal the constants that enforce them', () => {
  assert.equal(facts.sandboxFreeMinutes, SANDBOX_FREE_MINUTES);
  assert.equal(sandboxLimits.freeMinutes, SANDBOX_FREE_MINUTES);
  assert.equal(facts.sandboxSessionMinutes, DEFAULT_SESSION_MAX_SEC / 60);
  assert.equal(sandboxLimits.maxSessionDurationMinutes, DEFAULT_SESSION_MAX_SEC / 60);
  assert.equal(facts.paidSessionMinutes, PAID_SESSION_MAX_SEC / 60);
  assert.equal(facts.textMinuteRate, TEXT_MINUTE_RATE);
  // The typed rate is the voice rate times the typed draw.
  assert.equal(Math.round(pricing.perMinuteUsd * TEXT_MINUTE_RATE * 1000), Math.round(pricing.textPerMinuteUsd * 1000));
  assert.deepEqual(facts.packs.map((p) => [p.minutes, p.usd]), MINUTE_PACKS.map((p) => [p.minutes, p.usd]));
  assert.equal(facts.largestPack.minutes, Math.max(...MINUTE_PACKS.map((p) => p.minutes)));
  assert.equal(facts.packValidityMonths, 12);
  assert.equal(PACK_LIFETIME_MS, 365 * 24 * 60 * 60_000);
  assert.equal(facts.rotationGraceHours, ROTATED_SECRET_GRACE_MS / 3_600_000);
  assert.equal(facts.reachLanguageCount, languageCount);
  assert.deepEqual(facts.taughtLanguages.map((l) => l.code), offeredLanguages().map((l) => l.code));
});

test('the pricing page takes its numbers from the facts and no longer says what is not true', () => {
  const page = src('app/tutor-portal/pricing/page.tsx');
  const data = src('app/tutor-portal/data/pricing.ts').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const stale of [/in arrears/i, /concurrent/i, /50,000/]) {
    assert.doesNotMatch(page.replace(/\/\/.*$/gm, ''), stale);
    assert.doesNotMatch(data, stale);
  }
  for (const used of ['facts.packs.map', 'facts.packValidityMonths', 'facts.textMinuteRate', 'facts.sandboxFreeMinutes', 'facts.sandboxSessionMinutes', 'facts.paidSessionMinutes', 'facts.largestPack.minutes', 'mailto:info@evelynlearning.com']) {
    assert.ok(page.includes(used), `pricing page does not use ${used}`);
  }
  // No pack price or minute count typed into the page.
  for (const p of MINUTE_PACKS) {
    assert.ok(!page.includes(p.minutes.toLocaleString('en-US')) || p.minutes < 1000, `pack minutes ${p.minutes} typed into the pricing page`);
    assert.doesNotMatch(page, new RegExp(`\\$${p.usd.toLocaleString('en-US')}\\b`), `pack price ${p.usd} typed into the pricing page`);
  }
  // The FAQ structured data is built from the same list the page shows.
  assert.match(page, /mainEntity: faqs\.map/);
  assert.match(page, /\{faqs\.map\(\(f\) => \(/);
});

test('the numbers typed into the docs copy equal the constants', () => {
  const sandbox = DEFAULT_SESSION_MAX_SEC / 60;
  const paid = PAID_SESSION_MAX_SEC / 60;
  const cap = configParams.find((p) => p.name === 'max_duration_minutes')!.description;
  assert.ok(cap.includes(`${sandbox} minutes in the free sandbox, ${paid} after a first purchase`), cap);
  assert.ok(src('app/tutor-portal/docs/embed/page.tsx').includes(`${sandbox} minutes in the free\n        sandbox, ${paid} minutes after a first purchase`));
  assert.ok(src('app/tutor-portal/docs/quickstart/page.tsx').includes(`a session ends at ${sandbox} minutes`));
  assert.ok(src('app/tutor-portal/docs/authentication/page.tsx').includes(`keeps working for ${ROTATED_SECRET_GRACE_MS / 3_600_000}\n        hours`));
  assert.ok(src('app/tutor-portal/docs/api/page.tsx').includes(`drawing ${TEXT_MINUTE_RATE} of a minute per minute`));
  for (const name of ['tutor_languages', 'switch_languages', 'speech_rate']) assert.ok(configParams.some((p) => p.name === name), name);
  // speech_rate's range is the engine's clamp.
  const rate = src('lib/tutor/voice/speech-rate.ts');
  assert.match(rate, /SPEECH_RATE_MIN = 0\.6;/);
  assert.match(rate, /SPEECH_RATE_MAX = 1\.5;/);
  assert.ok(configParams.find((p) => p.name === 'speech_rate')!.description.includes('0.6 to 1.5'));
});

test('the lesson plan count is a floor the catalogue meets', () => {
  const real = SEED_PLANS.filter((p) => !p.title.startsWith('[TEST]')).length;
  assert.ok(real >= lessonPlanCountFloor, `catalogue holds ${real} plans, the pages say ${lessonPlanCountFloor}+`);
  assert.ok(real - lessonPlanCountFloor < 1000, `the pages say ${lessonPlanCountFloor}+ and the catalogue holds ${real}: raise lessonPlanCountFloor`);
  assert.doesNotMatch(src('app/tutor-portal/docs/modules/page.tsx'), /1,000\+/);
  assert.doesNotMatch(src('app/tutor-portal/page.tsx'), /topicCount/);
});

test('the whiteboard counts come from the engine and both pages use them', () => {
  const counts = boardCounts();
  assert.equal(counts.catalogueFigures, DIAGRAM_CATALOG.length);
  assert.equal(counts.toolFigures, TOOL_FIGURES.length);
  const inline = /export type InlineKind = ([^;]+);/.exec(src('lib/tutor/v2/board-inline.ts'))![1]!.split('|').map((s) => s.trim().replace(/'/g, ''));
  assert.deepEqual([...INLINE_BOARD_FORMS].sort(), inline.sort(), 'INLINE_BOARD_FORMS must equal InlineKind in board-inline.ts');
  const names = new Set(catalogueBySubject().flatMap((s) => s.figures));
  assert.equal(names.size, new Set(DIAGRAM_CATALOG.map((k) => k.displayName)).size, 'a catalogue figure is in no subject group');
  for (const f of ['page.tsx', 'docs/whiteboard/page.tsx']) {
    const text = src(`app/tutor-portal/${f}`);
    assert.match(text, /boardCounts\(\)/, f);
    assert.doesNotMatch(text, /whiteboardTypes|showSvgDiagram/, f);
  }
});

test('server webhooks: the documented events and retries are the engine\'s', () => {
  const engine = /export type WebhookEventType = ([^;]+);/.exec(src('lib/tutor/partner-dashboard/webhooks.ts'))![1]!.split('|').map((s) => s.trim().replace(/'/g, ''));
  assert.deepEqual(serverWebhookEvents.map((e) => e.event).sort(), engine.sort());
  const hooks = src('lib/tutor/partner-dashboard/webhooks.ts');
  for (const field of serverWebhookEvents.find((e) => e.event === 'session.ended')!.keyFields) assert.ok(hooks.includes(`${field}:`), `session.ended field ${field}`);
  for (const field of serverWebhookEvents.find((e) => e.event === 'pool.low')!.keyFields) assert.ok(hooks.includes(`${field}:`), `pool field ${field}`);
  assert.match(hooks, /const TIMEOUT_MS = 6000;/);
  assert.deepEqual([...WEBHOOK_RETRY_DELAYS_MS], [0, 3000, 15000]);
  const page = src('app/tutor-portal/docs/webhooks/page.tsx');
  assert.match(page, /within 6 seconds/);
  assert.match(page, /WEBHOOK_RETRY_DELAYS_MS/);
  assert.doesNotMatch(page, /roadmap/i);
  assert.match(page, /last 50 deliveries/);
  assert.match(hooks, /\.limit\(50\)/);
});

test('the API reference lists the worksheet routes, and each has a route file', () => {
  const api = src('app/tutor-portal/data/api-endpoints.ts');
  for (const r of ['homework-build', 'homework-problem-plan', 'homework-problem-outcome', 'material-summary']) {
    assert.ok(api.includes(`path: '/${r}`), r);
    assert.ok(statSync(join(APP, 'src/app/api/portal/v1', r, 'route.ts')).isFile(), r);
  }
});

console.log('llms.txt');

test('llms.txt lists exactly the offered languages, the prices and every docs page', () => {
  const origin = 'https://tutor.evelynlearning.com';
  const txt = llmsTxt(origin);
  const line = txt.split('\n').find((l) => l.startsWith('- Lesson languages'))!;
  assert.ok(line, 'no "Lesson languages" line');
  const codes = [...line.matchAll(/\(([A-Za-z-]+)\)[,.]/g)].map((m) => m[1]!);
  assert.deepEqual(codes, offeredLanguages().map((l) => l.code));
  for (const l of offeredLanguages()) assert.ok(line.includes(`${l.english} (${l.code})`), l.code);
  assert.match(txt, /^## Facts$/m);
  assert.ok(txt.includes(`$${pricing.perMinuteUsd.toFixed(2)} per voice tutoring minute`));
  assert.ok(txt.includes(`$${pricing.textPerMinuteUsd.toFixed(2)} per typed minute`));
  for (const p of MINUTE_PACKS) assert.ok(txt.includes(`${p.minutes.toLocaleString('en-US')} minutes for $${p.usd.toLocaleString('en-US')}`), p.id);
  assert.ok(txt.includes(`${SANDBOX_FREE_MINUTES} tutoring minutes`));
  for (const d of DOCS_PAGES) assert.ok(txt.includes(`(${origin}${d.path})`), d.path);
  assert.ok(txt.includes(`${origin}/llms-full.txt`));
  const full = llmsFullTxt(origin);
  assert.ok(full.startsWith(txt));
  assert.ok(full.endsWith(integrationGuideMarkdown()));
});

console.log('public copy');

test('no provider, model or client name in the portal\'s public copy', () => {
  // What a visitor or a crawler can read: every file under tutor-portal except the session pages (embed, replay,
  // home), whose text is the engine's own code, plus llms.txt. Comments are stripped: they are not served.
  const banned = /cartesia|anthropic|claude|openai|chatgpt|\bgpt\b|sonnet|haiku|elevenlabs|deepgram|gemini|kanzoo|\bduc\b|gameclass|green ?apple|\bgac\b|\bgdi\b|lumiq|skyler|edconsult|castle rock|solaro|crimsora|steminnokey|globalead/i;
  const strip = (text: string) => text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/([^:'"`])\/\/ .*$/gm, '$1');
  const publicFiles = files.filter((f) => /\.(tsx?|ts)$/.test(f) && !['embed', 'replay', 'home'].some((d) => relative(PORTAL, f).startsWith(`${d}/`)));
  assert.ok(publicFiles.length > 40);
  for (const f of publicFiles) {
    const hit = banned.exec(strip(readFileSync(f, 'utf8')));
    assert.equal(hit, null, `${relative(APP, f)}: "${hit?.[0]}"`);
  }
  for (const text of [llmsTxt('https://tutor.evelynlearning.com'), integrationGuideMarkdown()]) {
    assert.equal(banned.exec(text), null, `llms.txt / integration guide: "${banned.exec(text)?.[0]}"`);
  }
});

test('the claims the owner has not decided on are untouched', () => {
  assert.equal(languageCount, 42);
  assert.ok(src('app/tutor-portal/data/engines.ts').includes("'50+ languages supported'"));
  assert.ok(src('app/tutor-portal/data/pricing.ts').includes("'50+ spoken languages'"));
  assert.ok(src('app/tutor-portal/layout.tsx').includes('50+ languages'));
  assert.ok(src('app/tutor-portal/data/engines.ts').includes("latency: '<400ms'"));
  assert.ok(src('app/tutor-portal/page.tsx').includes("{ value: '<400ms', label: 'Response Latency' }"));
  assert.ok(src('app/tutor-portal/page.tsx').includes('Supported National Curricula'));
  assert.equal((src('app/tutor-portal/data/curriculum.ts').match(/\{ region: /g) ?? []).length, 15);
});

console.log(`\n${passed} passed`);
process.exit(0);
