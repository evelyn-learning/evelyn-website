/**
 * Smoke test for svgContainsExoticGlyphs after the math-symbol extension
 * landed in 2026-04-28's PDF coherence pass. Pure regex check — verifies
 * we route the right SVGs through html2canvas vs svg2pdf without booting
 * the actual PDF pipeline.
 *
 * Run: npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only scripts/test-pdf-exotic-glyphs.ts
 */
import { svgContainsExoticGlyphs } from '../src/lib/utils/export/whiteboard-capture';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

console.log('\n=== exotic-glyph detection — math symbols ===');
{
  // The actual unit-circle SVG snippet that was producing '"' for √
  // in the 2026-04-28 trig export.
  const unitCircleLabel = '<svg><text>(-1/2, √3/2)</text><text>π/6</text></svg>';
  check('unit-circle √ label triggers raster route', svgContainsExoticGlyphs(unitCircleLabel));

  const piLabel = '<svg><text>θ = π/4</text></svg>';
  check('θ + π Greek letters trigger raster route', svgContainsExoticGlyphs(piLabel));

  const integral = '<svg><text>∫ f(x) dx</text></svg>';
  check('integral ∫ triggers raster route', svgContainsExoticGlyphs(integral));

  const arrows = '<svg><text>v → a</text></svg>';
  check('arrow → triggers raster route', svgContainsExoticGlyphs(arrows));

  // ² (U+00B2) and ³ (U+00B3) are in Latin-1 — helvetica handles them.
  // The exotic supers/subs we care about are U+2070+ (⁰⁴⁵⁶⁷⁸⁹⁻ and ₀-₉).
  const exoticSuper = '<svg><text>x⁴ + y⁵</text></svg>';
  check('exotic superscript ⁴ (U+2074) triggers raster route', svgContainsExoticGlyphs(exoticSuper));
  const subscript = '<svg><text>H₂O</text></svg>';
  check('subscript ₂ (U+2082) triggers raster route', svgContainsExoticGlyphs(subscript));

  const inequalities = '<svg><text>x ≤ 5 and y ≥ 3</text></svg>';
  check('inequality ≤ ≥ triggers raster route', svgContainsExoticGlyphs(inequalities));

  const infinity = '<svg><text>lim x → ∞</text></svg>';
  check('infinity ∞ triggers raster route', svgContainsExoticGlyphs(infinity));
}

console.log('\n=== exotic-glyph detection — emoji (regression check) ===');
{
  const cycleEmoji = '<svg><text>🌧️ Rain</text></svg>';
  check('cloud-rain emoji still triggers (legacy behavior preserved)', svgContainsExoticGlyphs(cycleEmoji));

  const dnaEmoji = '<svg><text>🧬 DNA</text></svg>';
  check('dna emoji still triggers (legacy behavior preserved)', svgContainsExoticGlyphs(dnaEmoji));

  const ballotBox = '<svg><text>☑ checked</text></svg>';
  check('☑ U+2611 (in 2600-27BF range) still triggers', svgContainsExoticGlyphs(ballotBox));
}

console.log('\n=== negatives — clean Latin SVG should NOT trigger raster ===');
{
  const plain = '<svg><text>Right Triangle</text></svg>';
  check('plain ASCII does not trigger', !svgContainsExoticGlyphs(plain));

  const numerics = '<svg><text>x = 1.5, y = -2.7</text></svg>';
  check('numerics + minus do not trigger', !svgContainsExoticGlyphs(numerics));

  const punct = '<svg><text>(a, b) = c + d * e / f</text></svg>';
  check('arithmetic punctuation does not trigger', !svgContainsExoticGlyphs(punct));

  const accents = '<svg><text>café résumé naïve</text></svg>';
  check('Latin-1 accents do not trigger (helvetica handles these)',
    !svgContainsExoticGlyphs(accents));

  const degree = '<svg><text>30° angle</text></svg>';
  check('degree sign ° (U+00B0, in Latin-1) does not trigger',
    !svgContainsExoticGlyphs(degree));

  const latin1Super = '<svg><text>x² + y³ = z²</text></svg>';
  check('Latin-1 supers ² ³ (U+00B2/B3) do not trigger',
    !svgContainsExoticGlyphs(latin1Super));
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
