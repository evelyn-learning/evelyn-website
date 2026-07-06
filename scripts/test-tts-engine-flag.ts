/**
 * Unit tests for resolveTtsProvider (Task 3 of the Cartesia migration
 * Phase 2 plan). Pure-logic test — no network, no DOM.
 *
 * Usage: npx tsx scripts/test-tts-engine-flag.ts
 */
import assert from 'node:assert';
import { resolveTtsProvider } from '../src/lib/tutor/voice/resolve-tts-provider';

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
}

check('URL mini wins over env cartesia', () => {
  assert.strictEqual(resolveTtsProvider('mini', 'cartesia'), 'openai-mini');
});

check('env cartesia -> cartesia (no url param)', () => {
  assert.strictEqual(resolveTtsProvider(null, 'cartesia'), 'cartesia');
});

check('unset url + unset env -> realtime default', () => {
  assert.strictEqual(resolveTtsProvider(null, undefined), 'realtime');
});

check('garbage env -> realtime', () => {
  assert.strictEqual(resolveTtsProvider(null, 'bogus-engine'), 'realtime');
});

check('url mini, env unset -> openai-mini', () => {
  assert.strictEqual(resolveTtsProvider('mini', undefined), 'openai-mini');
});

check('url present but not mini, env cartesia -> cartesia (non-mini url params fall through)', () => {
  assert.strictEqual(resolveTtsProvider('xyz', 'cartesia'), 'cartesia');
});

check('url present but not mini, env unset -> realtime', () => {
  assert.strictEqual(resolveTtsProvider('xyz', undefined), 'realtime');
});

console.log(`\n${passed} passed`);
