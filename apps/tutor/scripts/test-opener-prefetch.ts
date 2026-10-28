/**
 * Opener prefetch cache (src/lib/tutor/voice/opener-prefetch.ts).
 *
 * 2026-10-18, GDI session embed-1792338502233: the learner sat 6.5 minutes on
 * the pre-start screen and then waited 4.6 s after Start for the tutor's first
 * sentence (cold prompt cache + a hidden-thinking first attempt). The embed now
 * runs the opener's brain call pre-start; the route keeps its SSE bytes here
 * and replays them when the real Start call arrives.
 *
 * Run: npx tsx scripts/test-opener-prefetch.ts
 */
import { strict as assert } from 'node:assert';
import {
  OpenerPrefetchCache, isValidPrefetchKey, OPENER_PREFETCH_TTL_MS, OPENER_PREFETCH_MAX_ENTRIES,
} from '../src/lib/tutor/voice/opener-prefetch';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const bytes = (s: string) => new TextEncoder().encode(s);
const str = (chunks: Uint8Array[]) => chunks.map((c) => new TextDecoder().decode(c)).join('');

(async () => {
  await test('a finished prefetch replays its chunks once, in order, then is gone', async () => {
    const cache = new OpenerPrefetchCache();
    const sink = cache.begin('embed-1');
    assert.ok(sink);
    sink!.enqueue(bytes('a')); sink!.enqueue(bytes('b')); sink!.close();
    const got = await cache.take('embed-1');
    assert.equal(got && str(got), 'ab');
    assert.equal(cache.take('embed-1'), null, 'single-use');
    assert.equal(cache.size, 0);
  });

  await test('Start during a running prefetch waits for it instead of re-running the brain', async () => {
    const cache = new OpenerPrefetchCache();
    const sink = cache.begin('embed-2')!;
    sink.enqueue(bytes('first'));
    const pending = cache.take('embed-2');
    assert.ok(pending instanceof Promise);
    let settled = false;
    void pending!.then(() => { settled = true; });
    await Promise.resolve();
    assert.equal(settled, false, 'not settled before close');
    sink.enqueue(bytes(' second')); sink.close();
    const got = await pending;
    assert.equal(got && str(got), 'first second');
    assert.equal(cache.size, 0);
  });

  await test('a second prefetch for the same key is refused while one is pending or done', () => {
    const cache = new OpenerPrefetchCache();
    const sink = cache.begin('embed-3')!;
    assert.equal(cache.begin('embed-3'), null);
    sink.close();
    assert.equal(cache.begin('embed-3'), null);
  });

  await test('a failed prefetch resolves null so the caller runs the brain live', async () => {
    const cache = new OpenerPrefetchCache();
    const sink = cache.begin('embed-4')!;
    const pending = cache.take('embed-4')!;
    sink.enqueue(bytes('partial'));
    sink.fail();
    assert.equal(await pending, null);
    assert.equal(cache.take('embed-4'), null);
    assert.equal(cache.size, 0);
    assert.ok(cache.begin('embed-4'), 'key is free again after a failure');
  });

  await test('an expired entry is not replayed (the prewarm frame reloads at 30 min anyway)', () => {
    let now = 1_000_000;
    const cache = new OpenerPrefetchCache({ now: () => now });
    cache.begin('embed-5')!.close();
    now += OPENER_PREFETCH_TTL_MS + 1;
    assert.equal(cache.take('embed-5'), null);
    assert.equal(cache.size, 0);
    assert.ok(cache.begin('embed-5'), 'expired key can be prefetched again');
  });

  await test('the map is bounded: the oldest entry is evicted past the cap', () => {
    let now = 0;
    const cache = new OpenerPrefetchCache({ now: () => now++ });
    for (let i = 0; i < OPENER_PREFETCH_MAX_ENTRIES + 1; i++) cache.begin(`k${i}`)!.close();
    assert.equal(cache.size, OPENER_PREFETCH_MAX_ENTRIES);
    assert.equal(cache.take('k0'), null, 'oldest evicted');
    assert.ok(cache.take(`k${OPENER_PREFETCH_MAX_ENTRIES}`), 'newest kept');
  });

  await test('keys are the client session id shape; anything else is refused', () => {
    assert.equal(isValidPrefetchKey('embed-1792338502233'), true);
    assert.equal(isValidPrefetchKey('session-1792338502233'), true);
    assert.equal(isValidPrefetchKey(''), false);
    assert.equal(isValidPrefetchKey('x'.repeat(129)), false);
    assert.equal(isValidPrefetchKey('a b'), false);
    assert.equal(isValidPrefetchKey(42), false);
    assert.equal(isValidPrefetchKey(undefined), false);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
})();
