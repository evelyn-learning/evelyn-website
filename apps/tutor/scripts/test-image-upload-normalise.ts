/**
 * R50c — upload format normalisation.
 *
 * Live report (2026-08-21, portal-1dc416ba): an AVIF upload did nothing at
 * all. Three layers disagreed and none could see the whole picture: the file
 * pickers advertise `accept="image/*"`, the extract-homework route whitelists
 * four mime types, and that whitelist is exactly what the vision model takes
 * as `media_type` — so widening it would only move the failure downstream.
 *
 * These tests cover the PURE half (type decisions). The canvas re-encode path
 * needs a DOM and is exercised in the browser, which is stated here rather
 * than papered over — see the note at the bottom.
 *
 * Run: npx tsx scripts/test-image-upload-normalise.ts
 */
import { strict as assert } from 'node:assert';
import { isVisionSafe, dataUrlMime, VISION_SAFE_TYPES } from '../src/lib/tutor/whiteboard/image-upload-normalise';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

console.log('\nR50c — upload format normalisation');

test('the four API-supported types pass through untouched', () => {
  for (const t of ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) {
    assert.equal(isVisionSafe(t), true, t);
  }
});

test('the formats that silently failed are NOT vision-safe (they need converting)', () => {
  // If any of these ever returns true, normaliseUploadedImage would pass the
  // original bytes through and the API would 400 — the exact live bug.
  assert.equal(isVisionSafe('image/avif'), false);   // the live report
  assert.equal(isVisionSafe('image/heic'), false);   // advertised in the old copy, unsupported
  assert.equal(isVisionSafe('image/heif'), false);
  assert.equal(isVisionSafe('image/bmp'), false);
  assert.equal(isVisionSafe('image/svg+xml'), false);
  assert.equal(isVisionSafe('image/tiff'), false);
});

test('mime matching is case- and parameter-insensitive', () => {
  assert.equal(isVisionSafe('IMAGE/PNG'), true);
  assert.equal(isVisionSafe('image/jpeg; charset=binary'), true);
  assert.equal(isVisionSafe('  image/png  '), true);
});

test('junk mime types are refused rather than assumed safe', () => {
  assert.equal(isVisionSafe(''), false);
  assert.equal(isVisionSafe('not-a-mime'), false);
  assert.equal(isVisionSafe('image/'), false);
  assert.equal(isVisionSafe('text/html'), false);   // must never be sent as an image
});

test('dataUrlMime reads the type off a data URL', () => {
  assert.equal(dataUrlMime('data:image/avif;base64,AAAA'), 'image/avif');
  assert.equal(dataUrlMime('data:image/png;base64,AAAA'), 'image/png');
  assert.equal(dataUrlMime('data:image/svg+xml,%3Csvg/%3E'), 'image/svg+xml');
  assert.equal(dataUrlMime('IMAGE/PNG'), '');        // not a data URL
  assert.equal(dataUrlMime(''), '');
});

test('the local whitelist matches the API route exactly', () => {
  // Drift here is silent and one-directional: the client would convert a type
  // the API would have accepted (harmless), or pass through one it rejects
  // (the live bug). Pinned so a change to either side has to change both.
  assert.deepEqual(
    [...VISION_SAFE_TYPES].sort(),
    ['image/gif', 'image/jpeg', 'image/png', 'image/webp'],
  );
});

// NOT TESTED HERE, stated rather than implied: the canvas re-encode branch of
// normaliseUploadedImage needs `Image` + `<canvas>` and so cannot run under
// tsx. What IS pinned above is the decision that routes an avif INTO that
// branch — which is the half that was wrong in production. The re-encode
// itself is verified in the browser (upload an .avif and watch the tutor ack).
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
