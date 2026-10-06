/**
 * Partner-frame documents (session embed + replay) carry no site branding.
 *
 * Defect this pins (GreenApple app walk 2026-10-05, M3): both documents
 * inherited the root layout's metadata — tab title "AI Voice Tutor —
 * White-Label Platform | Evelyn Tutor", an Evelyn description, Open Graph /
 * Twitter cards, the site favicon and organisation JSON-LD — inside a
 * white-label product. They now export a neutral title (plus the partner's
 * product name from the token), clear every inherited descriptive key, and
 * are never indexed. The marketing/docs pages under /tutor-portal keep theirs.
 *
 * Reads the layouts' real `metadata` exports. The served HTML is checked
 * after `next build` (see the report), not here.
 *
 * Run: npx tsx scripts/test-partner-frame-metadata.ts  (npm run test:partner-frame-metadata)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import {
  EMBED_DOCUMENT_TITLE,
  REPLAY_DOCUMENT_TITLE,
  NEUTRAL_ICON_DATA_URI,
  brandProductName,
  partnerFrameTitle,
  partnerFrameMetadata,
  isPartnerFramePath,
} from '../src/lib/tutor/portal/partner-frame-metadata';
import { metadata as embedMetadata } from '../src/app/tutor-portal/embed/layout';
import { metadata as replayMetadata } from '../src/app/tutor-portal/replay/layout';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');

/** Every descriptive key the ROOT layout sets must be explicitly overridden
 *  (metadata merges shallowly per key — an omitted key is inherited). */
const ROOT_KEYS_TO_CLEAR = ['description', 'openGraph', 'twitter'] as const;
const OTHER_KEYS_CLEARED = ['applicationName', 'manifest', 'keywords', 'authors', 'creator', 'publisher'] as const;

function assertNeutral(meta: Metadata, title: string, label: string) {
  assert.deepEqual(meta.title, { absolute: title }, `${label}: absolute title (no "| Evelyn …" template)`);
  for (const key of [...ROOT_KEYS_TO_CLEAR, ...OTHER_KEYS_CLEARED]) {
    assert.ok(key in meta, `${label}: ${key} must be set explicitly, or the root's value is inherited`);
    assert.equal(meta[key], null, `${label}: ${key} is cleared`);
  }
  assert.deepEqual(meta.robots, { index: false, follow: false }, `${label}: noindex`);
  assert.deepEqual(meta.icons, { icon: [{ url: NEUTRAL_ICON_DATA_URI, type: 'image/svg+xml' }] }, `${label}: neutral icon only`);
  assert.doesNotMatch(JSON.stringify(meta), /evelyn|crimsora|favicon\.(ico|png)|og-image/i, `${label}: no site branding anywhere`);
}

async function main() {
  console.log('partner-frame metadata');

  await test('embed layout: neutral title, descriptive metadata cleared, noindex', () => {
    assert.equal(EMBED_DOCUMENT_TITLE, 'Lesson');
    assertNeutral(embedMetadata, 'Lesson', 'embed');
  });

  await test('replay layout: neutral title, descriptive metadata cleared, noindex', () => {
    assert.equal(REPLAY_DOCUMENT_TITLE, 'Session replay');
    assertNeutral(replayMetadata, 'Session replay', 'replay');
  });

  await test('the root layout still sets exactly the keys these layouts clear (guards a new root key leaking)', () => {
    const root = src('src/app/layout.tsx');
    const block = root.slice(root.indexOf('export const metadata: Metadata = {'), root.indexOf('export default function RootLayout'));
    const topLevelKeys = [...block.matchAll(/^  ([a-zA-Z]+):/gm)].map((m) => m[1]).sort();
    assert.deepEqual(topLevelKeys, ['description', 'icons', 'metadataBase', 'openGraph', 'robots', 'title', 'twitter']);
    const handled = new Set<string>([...Object.keys(partnerFrameMetadata('x')), 'metadataBase']);
    for (const key of topLevelKeys) assert.ok(handled.has(key), `root metadata key "${key}" is not overridden for partner frames`);
  });

  await test('product name from the token branding: used when it is a real string, never otherwise', () => {
    assert.equal(brandProductName({ product_name: 'GreenApple Homework Help' }), 'GreenApple Homework Help');
    assert.equal(brandProductName({ product_name: '  Acme\n Tutor  ' }), 'Acme Tutor');
    for (const bad of [undefined, null, {}, { product_name: '' }, { product_name: '   ' }, { product_name: 7 }, { product_name: { a: 1 } }, 'x']) {
      assert.equal(brandProductName(bad), undefined);
    }
    assert.equal(brandProductName({ product_name: 'x'.repeat(200) })!.length, 60);
    assert.equal(partnerFrameTitle('Lesson', { product_name: 'GreenApple Homework Help' }), 'Lesson · GreenApple Homework Help');
    assert.equal(partnerFrameTitle('Session replay', undefined), 'Session replay');
  });

  await test('replay page: generateMetadata adds the product name only for a token that verifies', async () => {
    const page = src('src/app/tutor-portal/replay/page.tsx');
    assert.match(page, /export async function generateMetadata\(/);
    assert.match(page, /if \(verdict\.ok\) branding = verdict\.payload\.branding;/);
    assert.match(page, /return partnerFrameMetadata\(partnerFrameTitle\(REPLAY_DOCUMENT_TITLE, branding\)\);/);
    // What it returns, for both outcomes:
    assertNeutral(partnerFrameMetadata(partnerFrameTitle(REPLAY_DOCUMENT_TITLE, undefined)), 'Session replay', 'replay/invalid token');
    assert.deepEqual(
      partnerFrameMetadata(partnerFrameTitle(REPLAY_DOCUMENT_TITLE, { product_name: 'GreenApple Homework Help' })).title,
      { absolute: 'Session replay · GreenApple Homework Help' },
    );
  });

  await test('embed page sets the document title from the token branding (client page — no metadata export)', () => {
    const page = src('src/app/tutor-portal/embed/page.tsx');
    assert.match(page, /document\.title = partnerFrameTitle\(EMBED_DOCUMENT_TITLE, branding\);/);
  });

  await test('partner-frame path detection: both spellings, nothing else', () => {
    for (const p of ['/tutor-portal/embed', '/tutor-portal/embed/', '/tutor-portal/replay', '/embed', '/replay', '/replay/x']) {
      assert.equal(isPartnerFramePath(p), true, p);
    }
    for (const p of [null, undefined, '', '/', '/tutor', '/tutor-portal', '/tutor-portal/docs', '/tutor-portal/docs/embed', '/tutor-portal/demo',
      '/tutor-portal/pricing', '/tutor-portal/sandbox', '/docs/embed', '/embedded', '/replays', '/admin/tutor-sessions']) {
      assert.equal(isPartnerFramePath(p), false, String(p));
    }
  });

  await test('site JSON-LD is rendered through the path-aware wrapper, not directly by the root layout', () => {
    const root = src('src/app/layout.tsx');
    assert.match(root, /<SiteJsonLd \/>/);
    assert.doesNotMatch(root, /<EducationalOrganizationJsonLd|<WebSiteJsonLd/);
    const wrapper = src('src/app/components/SiteJsonLd.tsx');
    assert.match(wrapper, /if \(isPartnerFramePath\(pathname\)\) return null;/);
    assert.match(wrapper, /<EducationalOrganizationJsonLd \/>\s*<WebSiteJsonLd \/>/);
  });

  await test('marketing / docs pages under /tutor-portal keep their own metadata', () => {
    const portal = src('src/app/tutor-portal/layout.tsx');
    assert.match(portal, /default: 'AI Voice Tutor — White-Label Platform'/);
    assert.match(portal, /template: '%s \| Evelyn Voice Tutor'/);
    assert.match(portal, /robots: \{ index: true, follow: true \}/);
    assert.doesNotMatch(portal, /partnerFrameMetadata/);
    const root = src('src/app/layout.tsx');
    assert.match(root, /siteName: "Evelyn Learning"/);
    assert.match(root, /url: "\/favicon\.ico"/);
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
