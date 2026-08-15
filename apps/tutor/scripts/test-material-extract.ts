/**
 * Standalone test for src/lib/tutor/lesson-plan/material-extract.ts
 * (Phase-2 doc-ingestion material extraction).
 *
 * Run: npm run test:material-extract
 *
 * No test framework — imports the module directly, feeds it fixtures from
 * scripts/fixtures/, asserts via node:assert. Exits non-zero on any
 * failure so it's CI-friendly (matches test-skip-render-cap.ts's pattern).
 *
 * LIVE LLM CALL BUDGET: 2 total.
 *   1. testImageTranscription — one real vision call (the PNG fixture).
 *   2. testCondenseForPipeline — one real Haiku call (>8000-char synthetic
 *      input, forced to exceed target).
 * Every other test either fails before any LLM call (size/page/kind
 * limits, scanned-pdf detection) or stays under the condense target (so
 * condenseForPipeline's early-return passthrough fires with no API call).
 */

import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import { extractMaterials, condenseForPipeline } from '../src/lib/tutor/lesson-plan/material-extract';
import type { PlanMaterial } from '@evelyn/portal-contract/v1';

const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');

function loadFixtureAsMaterial(
  filename: string,
  kind: PlanMaterial['kind'],
  mimeType?: string,
): PlanMaterial {
  const buf = fs.readFileSync(path.join(FIXTURES_DIR, filename));
  return { kind, data: buf.toString('base64'), name: filename, mimeType };
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL - ${name}`);
    console.error(`      ${err instanceof Error ? err.message : err}`);
  }
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

async function testTextPassthrough() {
  const raw = 'Photosynthesis notes.\n\nLight reactions happen in the thylakoid membrane.';
  const material: PlanMaterial = { kind: 'text', data: Buffer.from(raw, 'utf8').toString('base64') };

  const result = await extractMaterials([material]);
  assert.equal(result.ok, true, 'expected ok result');
  if (!result.ok) return;
  assert.equal(result.materials.length, 1);
  assert.equal(result.materials[0].kind, 'text');
  // "passthrough" per spec — no normalization applied to raw pasted text.
  assert.equal(result.materials[0].text, raw);
  assert.equal(result.combinedText, raw);
}

async function testPdfHappyPath() {
  const material = loadFixtureAsMaterial('sample-with-text.pdf', 'pdf');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, true, 'expected ok result');
  if (!result.ok) return;
  assert.equal(result.materials.length, 1);
  assert.equal(result.materials[0].kind, 'pdf');
  assert.equal(result.materials[0].pages, 2);
  assert.ok(
    result.materials[0].text.includes('SENTINEL_PDF_MATERIAL_9382'),
    'expected sentinel string in extracted PDF text',
  );
  assert.ok(result.combinedText.includes('SENTINEL_PDF_MATERIAL_9382'));
}

async function testScannedPdf() {
  const material = loadFixtureAsMaterial('scanned-no-text.pdf', 'pdf');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected a scanned_pdf error result');
  if (result.ok) return;
  assert.equal(result.code, 'scanned_pdf');
  assert.ok(result.message.length > 0, 'expected a friendly explanatory message');
  assert.ok(!/SENTINEL/.test(result.message), 'error message must not leak document content');
}

async function testDocxHappyPath() {
  const material = loadFixtureAsMaterial('sample.docx', 'docx');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, true, 'expected ok result');
  if (!result.ok) return;
  assert.equal(result.materials.length, 1);
  assert.equal(result.materials[0].kind, 'docx');
  assert.ok(
    result.materials[0].text.includes('SENTINEL_DOCX_MATERIAL_5521'),
    'expected sentinel string in extracted DOCX text',
  );
}

async function testTooLarge() {
  // 8MB + 1KB decoded — no file needed, a synthetic oversized buffer.
  const oversized = Buffer.alloc(8 * 1024 * 1024 + 1024, 'a');
  const material: PlanMaterial = { kind: 'text', data: oversized.toString('base64') };

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected a too_large error result');
  if (result.ok) return;
  assert.equal(result.code, 'too_large');
}

async function testTooManyPages() {
  const material = loadFixtureAsMaterial('many-pages.pdf', 'pdf');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected a too_many_pages error result');
  if (result.ok) return;
  assert.equal(result.code, 'too_many_pages');
}

async function testUnsupportedKind() {
  const material = { kind: 'audio', data: Buffer.from('x').toString('base64') } as unknown as PlanMaterial;

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected an unsupported error result');
  if (result.ok) return;
  assert.equal(result.code, 'unsupported');
}

async function testUnsupportedImageMimeType() {
  const material: PlanMaterial = {
    kind: 'image',
    data: Buffer.from('not really an image').toString('base64'),
    mimeType: 'image/bmp', // not in the extract-homework allowlist
  };

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected an unsupported error result for a disallowed image mime type');
  if (result.ok) return;
  assert.equal(result.code, 'unsupported');
}

async function testTooManyMaterials() {
  const one: PlanMaterial = { kind: 'text', data: Buffer.from('a').toString('base64') };
  const result = await extractMaterials([one, one, one, one, one]); // 5 > MAX_MATERIALS(4)
  assert.equal(result.ok, false, 'expected a too_large error result for >4 materials');
  if (result.ok) return;
  assert.equal(result.code, 'too_large');
}

async function testAllMaterialsEmptyTextYieldsExtractFailed() {
  // I2 fix: a well-formed DOCX with zero text runs (mammoth legitimately
  // returns '') is the deterministic, no-live-LLM-call stand-in for "every
  // attached material extracted 'successfully' but had nothing readable in
  // it" — same failure mode as a batch of all-illegible photos (vision's
  // "[no legible text]" collapses to ''). Must 422-shape extract_failed,
  // never a silent ok:true on empty combinedText (which would otherwise run
  // a full downstream generation on nothing).
  const material = loadFixtureAsMaterial('empty.docx', 'docx');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, false, 'expected an extract_failed error result for an all-empty material set');
  if (result.ok) return;
  assert.equal(result.code, 'extract_failed');
  assert.ok(result.message.length > 0, 'expected a friendly explanatory message');
}

async function testEmptyMaterialsIsOk() {
  const result = await extractMaterials([]);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.materials.length, 0);
  assert.equal(result.combinedText, '');
}

async function testImageTranscription() {
  // LIVE LLM CALL #1 (vision, single image — the batch-of-one path).
  const material = loadFixtureAsMaterial('sample-text.png', 'image', 'image/png');

  const result = await extractMaterials([material]);
  assert.equal(result.ok, true, 'expected ok result');
  if (!result.ok) return;
  assert.equal(result.materials.length, 1);
  assert.equal(result.materials[0].kind, 'image');
  const text = result.materials[0].text.toLowerCase();
  const expectedWords = ['photosynthesis', 'thylakoid', 'calvin', 'stroma', 'light'];
  const found = expectedWords.some((w) => text.includes(w));
  assert.ok(
    found,
    `expected at least one of [${expectedWords.join(', ')}] in transcribed text, got: "${result.materials[0].text.slice(0, 200)}"`,
  );
}

async function testCondensePassthroughUnderTarget() {
  const short = 'Short text well under the target — no LLM call should happen for this.';
  const out = await condenseForPipeline(short, { targetChars: 8000 });
  assert.equal(out, short, 'text under target must pass through unchanged');
}

async function testCondenseForPipeline() {
  // LIVE LLM CALL #2 (Haiku condense).
  const heading = '# Cellular Respiration Study Guide\n\n';
  const paragraph =
    'Glycolysis converts glucose into two molecules of pyruvate in the cytoplasm, yielding a net gain of two ATP and two NADH per glucose molecule metabolized. '.repeat(
      60,
    );
  const longText = heading + paragraph;
  assert.ok(longText.length > 8000, 'synthetic input must exceed 8000 chars to actually exercise condensing');

  const condensed = await condenseForPipeline(longText, { targetChars: 8000 });
  assert.ok(condensed.length <= 8000, `condensed length ${condensed.length} must be <= 8000 (hard floor)`);
  assert.ok(
    condensed.includes('Cellular Respiration'),
    `expected the heading sentinel to survive condensing, got: "${condensed.slice(0, 200)}"`,
  );
}

/* ------------------------------------------------------------------ */
/* main                                                                 */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('material-extract tests\n');

  // Cheap/local tests first (no network calls).
  await test('text material: passthrough, no normalization', testTextPassthrough);
  await test('pdf material: happy path finds sentinel + page count', testPdfHappyPath);
  await test('pdf material: scanned (no text layer) -> scanned_pdf', testScannedPdf);
  await test('docx material: happy path finds sentinel', testDocxHappyPath);
  await test('material: decoded >8MB -> too_large', testTooLarge);
  await test('pdf material: >30 pages -> too_many_pages', testTooManyPages);
  await test('material: unknown kind -> unsupported', testUnsupportedKind);
  await test('image material: disallowed mime type -> unsupported', testUnsupportedImageMimeType);
  await test('materials: >4 files -> too_large', testTooManyMaterials);
  await test('docx material: well-formed but no text runs -> extract_failed (I2, all-empty guard)', testAllMaterialsEmptyTextYieldsExtractFailed);
  await test('materials: empty array -> ok with no materials', testEmptyMaterialsIsOk);
  await test('condenseForPipeline: under target passes through (no LLM call)', testCondensePassthroughUnderTarget);

  // Live LLM calls (budget: 2 total for this whole run).
  await test('image material: vision transcription finds expected text', testImageTranscription);
  await test('condenseForPipeline: over target condenses + preserves heading', testCondenseForPipeline);

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Unhandled error in test run:', err);
  process.exit(1);
});
