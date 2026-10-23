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
// .env.local points MONGODB_URI at the laptop's :2710 tunnel — prod. No test
// here may reach the real photo-read store: the URI is dropped before the
// module (and @core/db, which reads it at load) is imported.
delete process.env.MONGODB_URI;

import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import {
  extractMaterials,
  condenseForPipeline,
  DIAGRAM_RULE,
  transcribeImagesBatch,
  transcriptionCacheKey,
  clearTranscriptionCache,
  type TranscriptionStore,
} from '../src/lib/tutor/lesson-plan/material-extract';
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

async function testDiagramRuleStatesPositionsNotGlyphs() {
  // GAC acceptance 2026-10-22 (hw-14b p1, G1): the read called the figure a
  // "<" shape with E on the left; the sheet has E on the right (a ">").
  assert.ok(
    DIAGRAM_RULE.includes('Never describe a figure\'s shape by a letter or symbol it resembles — say where each named point sits relative to the others (left or right of, above or below) and which way each angle opens, name a landmark for every side word, and check the word against the landmark.'),
    'DIAGRAM_RULE must tell the read to state positions, not glyphs',
  );
  // Additive only: the existing slanted-line sentence is unchanged.
  assert.ok(DIAGRAM_RULE.includes('For a slanted line, "left" and "right" are easy to get backwards: also name the side by a landmark on the figure'));
  // A5 (2026-10-23, hw-15 p4): quarter circles were read as "centered at the top corners"
  // (they end there; their centres are the bottom corners, unmarked).
  assert.ok(DIAGRAM_RULE.includes('name the two points or corners where the arc ENDS'), 'arcs are described by their endpoints');
  assert.ok(DIAGRAM_RULE.includes('never a centre you infer from the curve'), 'no inferred centre');
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

  // The photo-read store is an in-memory one: never the real (prod) Mongo.
  process.env.MONGODB_URI = '';
  clearTranscriptionCache();
  const { store } = memoryStore();
  const result = await extractMaterials([material], { transcriptionStore: store });
  clearTranscriptionCache();
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
/* Stored transcription cache (G6a, round 8 Task 7)                     */
/* ------------------------------------------------------------------ */

// 2026-10-22 (GAC worksheet6): a re-upload of the same sheet after an engine
// restart re-read the page in new words, every problem's hash changed and the
// whole sheet rebuilt. The read is now kept in a store behind the memory map.
function memoryStore() {
  const rows = new Map<string, string[]>();
  const sets: string[] = [];
  const store: TranscriptionStore = {
    get: async (key) => rows.get(key) ?? null,
    set: async (key, texts) => { sets.push(key); rows.set(key, texts); },
  };
  return { store, rows, sets };
}

function stubRead(texts: string[]) {
  let calls = 0;
  const read = async () => { calls++; return { ok: true as const, texts }; };
  return { read, calls: () => calls };
}

const SHEET = [{ position: 0, material: { kind: 'image', data: '', mimeType: 'image/png' } as PlanMaterial, buffer: Buffer.from('worksheet6-bytes') }];

async function testStoredTranscriptionSurvivesRestart() {
  clearTranscriptionCache();
  const { store, sets } = memoryStore();
  const first = stubRead(['1. Find x. [Figure: …]']);
  const r1 = await transcribeImagesBatch(SHEET, { store, read: first.read });
  assert.equal(first.calls(), 1, 'first read calls the model once');
  assert.ok(r1.ok);
  const key = transcriptionCacheKey(SHEET);
  assert.deepEqual(sets, [key], 'the read is written to the store under its key');

  clearTranscriptionCache(); // an engine restart: memory gone, store kept
  const second = stubRead(['different wording']);
  const r2 = await transcribeImagesBatch(SHEET, { store, read: second.read });
  assert.equal(second.calls(), 0, 'no model call after the restart');
  assert.ok(r2.ok && r2.ok === true);
  if (r2.ok) assert.deepEqual(r2.texts, ['1. Find x. [Figure: …]'], 'the same text, from the store');

  // memory is warm again: a third call reads neither the model nor writes the store
  const third = stubRead(['x']);
  await transcribeImagesBatch(SHEET, { store, read: third.read });
  assert.equal(third.calls(), 0);
  assert.equal(sets.length, 1, 'a store hit does not write again');
  clearTranscriptionCache();
}

async function testPromptVersionChangesTheKey() {
  clearTranscriptionCache();
  const { store } = memoryStore();
  const k = transcriptionCacheKey(SHEET);
  assert.equal(transcriptionCacheKey(SHEET), k, 'the default prompt version is stable');
  assert.notEqual(transcriptionCacheKey(SHEET, undefined, 'older-prompt'), k);
  assert.notEqual(transcriptionCacheKey(SHEET, 'other-model'), k);
  const a = stubRead(['old read']);
  await transcribeImagesBatch(SHEET, { store, read: a.read, promptVersion: 'v-old' });
  clearTranscriptionCache();
  const b = stubRead(['new read']);
  const r = await transcribeImagesBatch(SHEET, { store, read: b.read, promptVersion: 'v-new' });
  assert.equal(b.calls(), 1, 'a changed read prompt misses on purpose');
  if (r.ok) assert.deepEqual(r.texts, ['new read']);
  clearTranscriptionCache();
}

async function testStoreFailureIsAMiss() {
  clearTranscriptionCache();
  const broken: TranscriptionStore = {
    get: async () => { throw new Error('connection down'); },
    set: async () => { throw new Error('write error'); },
  };
  const warned: string[] = [];
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = (...a: unknown[]) => { warned.push(a.map(String).join(' ')); };
  console.error = (...a: unknown[]) => { warned.push(a.map(String).join(' ')); };
  try {
  const s = stubRead(['read anyway']);
  const r = await transcribeImagesBatch(SHEET, { store: broken, read: s.read });
  await new Promise((res) => setImmediate(res)); // the write-through is not awaited by the read
  assert.equal(s.calls(), 1);
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.texts, ['read anyway']);
  // memory still caches it
  const again = stubRead(['y']);
  const r2 = await transcribeImagesBatch(SHEET, { store: broken, read: again.read });
  assert.equal(again.calls(), 0);
  if (r2.ok) assert.deepEqual(r2.texts, ['read anyway']);
  assert.equal(warned.filter((l) => l.startsWith('[material-extract] transcription store get failed')).length, 1, warned.join('\n'));
  assert.equal(warned.filter((l) => l.startsWith('[material-extract] transcription store set failed')).length, 1, warned.join('\n'));
  } finally {
    console.warn = origWarn;
    console.error = origError;
    clearTranscriptionCache();
  }
}

async function testInFlightJoinStillOneRead() {
  clearTranscriptionCache();
  const { store } = memoryStore();
  let calls = 0;
  const read = async () => { calls++; await new Promise((res) => setTimeout(res, 20)); return { ok: true as const, texts: ['joined'] }; };
  const [r1, r2] = await Promise.all([
    transcribeImagesBatch(SHEET, { store, read }),
    transcribeImagesBatch(SHEET, { store, read }),
  ]);
  assert.equal(calls, 1, 'a second request while the first reads joins it');
  assert.ok(r1.ok && r2.ok);
  clearTranscriptionCache();
}

// Final review (finding 5): a stored [] is no read; it must not count as a hit.
async function testStoredEmptyReadIsAMiss() {
  clearTranscriptionCache();
  const empty: TranscriptionStore = { get: async () => [], set: async () => {} };
  const s = stubRead(['1. Find x.']);
  const r = await transcribeImagesBatch(SHEET, { store: empty, read: s.read });
  assert.equal(s.calls(), 1, 'a stored empty transcription is a miss: the read runs');
  if (r.ok) assert.deepEqual(r.texts, ['1. Find x.']);
  clearTranscriptionCache();
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
  await test('DIAGRAM_RULE: a figure is described by positions, not by a letter it resembles (G1)', testDiagramRuleStatesPositionsNotGlyphs);
  await test('condenseForPipeline: under target passes through (no LLM call)', testCondensePassthroughUnderTarget);
  await test('transcription store: a re-read after a restart comes from the store, no model call (G6)', testStoredTranscriptionSurvivesRestart);
  await test('transcription store: a changed read prompt or model is a new key, read again (G6)', testPromptVersionChangesTheKey);
  await test('transcription store: a failing store is a miss, the read still succeeds (G6)', testStoreFailureIsAMiss);
  await test('transcription store: the in-flight join still makes one read (G6)', testInFlightJoinStillOneRead);
  await test('transcription store: a stored empty read is a miss, the read runs (final review)', testStoredEmptyReadIsAMiss);

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
