/**
 * Sign-preserving feature slugs — regression test for the wrong-vertex
 * scribble bug (2026-07-10 ui-audit session): "(3,0)" and "(−3,0)" both
 * slugged to "3-0", so both ellipse vertices emitted data-feature
 * "point-3-0" and the tick painted on the LEFT vertex while the tutor
 * said "(3, 0)". Signs immediately before a digit must survive slugging
 * (as "neg") in BOTH featSlug (naming) and normalizeToken (matching) so
 * the two sides stay aligned.
 *
 * Run: npm run test:feature-slug
 */
import { featSlug } from '../apps/marketing/src/lib/tutor/diagrams/layout';
import { normalizeToken, WhiteboardCatalog } from '../apps/marketing/src/lib/tutor/whiteboard/catalog';
import { buildGeometryManifest } from '../apps/marketing/src/app/tutor/components/whiteboard/GeometryRenderer';

type GeometryManifestProps = Parameters<typeof buildGeometryManifest>[0];

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// ── featSlug: signs before digits survive ─────────────────────────
{
  check('featSlug distinguishes (3,0) from (-3,0)', featSlug('(3,0)') !== featSlug('(-3,0)'));
  check('featSlug: unicode minus ≡ ascii hyphen', featSlug('(−3,0)') === featSlug('(-3,0)'));
  check('featSlug: positive form unchanged', featSlug('(3,0)') === '3-0');
  check('featSlug: negative form encodes sign', featSlug('(-3,0)') === 'neg3-0');
  check('featSlug: sign inside a tuple', featSlug('(0, -2)') === '0-neg2');
  check('featSlug: word-hyphen-word untouched', featSlug('y-axis') === 'y-axis');
  check('featSlug: spaced binary minus untouched', featSlug('x - 3') === 'x-3');
  check('featSlug: docstring example stable', featSlug('A (2,3)') === 'a-2-3');
}

// ── normalizeToken: same rule, same outputs ───────────────────────
{
  check('normalizeToken distinguishes signs', normalizeToken('(3, 0)') !== normalizeToken('(-3, 0)'));
  check('normalizeToken matches featSlug on negatives', normalizeToken('(-3, 0)') === featSlug('(-3,0)'));
  check('normalizeToken: docstring example stable', normalizeToken('  A (2,3)') === 'a-2-3');
}

// ── geometry manifest: the two ellipse vertices get distinct names ─
const props = {
  points: [
    { id: 'P1', x: -3, y: 0, label: '(-3,0)' },
    { id: 'P2', x: 3, y: 0, label: '(3,0)' },
  ],
} as unknown as GeometryManifestProps;
{
  const entries = buildGeometryManifest(props);
  const pointNames = entries.filter((e) => e.kind === 'point').map((e) => e.name);
  check('manifest point names are unique', new Set(pointNames).size === pointNames.length);
  check('positive vertex keeps point-3-0', pointNames.includes('point-3-0'));
  check('negative vertex gets a distinct name', pointNames.includes('point-neg3-0'));
}

// ── end-to-end: resolveTarget picks the vertex the tutor named ────
{
  const catalog = new WhiteboardCatalog();
  catalog.append({
    itemId: 'showGeometryConstructed-1',
    action: 'showGeometryConstructed',
    title: 'Ellipse: x²/9 + y²/4 = 1',
    features: buildGeometryManifest(props),
  });
  const pos = catalog.resolveTarget('the point (3, 0)');
  check('resolveTarget("(3, 0)") hits the positive vertex', pos.ok && pos.canonical === 'point-3-0');
  const neg = catalog.resolveTarget('(-3, 0)');
  check('resolveTarget("(-3, 0)") hits the negative vertex', neg.ok && neg.canonical === 'point-neg3-0');
}

// ── fuzzy token-subset fallback: wordier/reordered scribble targets ──
// (2026-07-24 find: target "bar fraction 1" vs canonical "bar-1" silent-
// dropped as no_match; resolver now accepts full token containment with
// ≥2 overlapping tokens after every stricter phase misses.)
{
  const catalog = new WhiteboardCatalog();
  catalog.append({
    itemId: 'showFractionBar-1',
    action: 'showFractionBar',
    title: 'Comparing fractions',
    features: [
      { kind: 'region', name: 'bar-1', labels: ['bar 1'] },
      { kind: 'region', name: 'bar-2', labels: ['bar 2'] },
    ] as unknown as Parameters<WhiteboardCatalog['append']>[0]['features'],
  });
  const f1 = catalog.resolveTarget('bar fraction 1');
  check('fuzzy: "bar fraction 1" → bar-1', f1.ok && f1.canonical === 'bar-1');
  const f2 = catalog.resolveTarget('the fraction bar 2');
  check('fuzzy: "the fraction bar 2" → bar-2', f2.ok && f2.canonical === 'bar-2');
  const exact = catalog.resolveTarget('bar 1');
  check('exact label still wins for "bar 1"', exact.ok && exact.canonical === 'bar-1');
  const miss = catalog.resolveTarget('slice 3');
  check('fuzzy: unrelated "slice 3" still no_match', !miss.ok);
  const weak = catalog.resolveTarget('mark 1');
  check('fuzzy: "mark 1" cannot hijack (needs ≥2-token overlap)', !weak.ok);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
