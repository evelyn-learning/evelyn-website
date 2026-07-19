/**
 * Roster consistency tests for the per-accent teacher personas
 * (docs/superpowers/specs/2026-07-19-accent-personas-design.md).
 * Pure-logic — no network, no DOM.
 *
 * Usage: npx tsx scripts/test-teacher-roster.ts
 */
import assert from 'node:assert';
import { DEMO_TEACHERS } from '../src/lib/tutor/ai/teacher-persona';
import {
  resolveCartesiaVoice,
  teachersForAccent,
} from '../src/lib/tutor/voice/cartesia-voice-registry';

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

check('18 personas, unique ids', () => {
  assert.strictEqual(DEMO_TEACHERS.length, 18);
  assert.strictEqual(new Set(DEMO_TEACHERS.map((t) => t.id)).size, 18);
});

check('original four unchanged in id/name/order', () => {
  const firstFour = DEMO_TEACHERS.slice(0, 4).map((t) => [t.id, t.name]);
  assert.deepStrictEqual(firstFour, [
    ['ms-elena-vasquez', 'Ms. Elena Vasquez'],
    ['mr-dev-khanna', 'Mr. Sameer'],
    ['dr-amara-osei', 'Dr. Amara Osei'],
    ['sofia', 'Sofia'],
  ]);
});

for (const t of DEMO_TEACHERS) {
  check(`${t.id}: non-empty name/intro + style block`, () => {
    assert.ok(t.name.trim().length > 0);
    assert.ok(t.intro.trim().length > 20);
    assert.ok(t.style && t.style.teaching && t.style.teaching.length > 0);
  });
}

// Every cartesia-voiced persona's wire voice matches the registry (the
// TTS route resolves via the registry — the two must never drift).
for (const t of DEMO_TEACHERS) {
  if (t.voice?.provider !== 'cartesia') continue;
  check(`${t.id}: wire voice matches registry`, () => {
    assert.strictEqual(
      resolveCartesiaVoice({ teacherId: t.id }).voiceId,
      t.voice!.voiceId,
    );
  });
}

// Every geo pair id must exist in DEMO_TEACHERS.
const ids = new Set(DEMO_TEACHERS.map((t) => t.id));
for (const accent of ['en-us', 'en-in', 'en-gb', 'en-ar-gulf', 'en-de', 'en-nl', 'en-au', 'en-sg', 'en-za']) {
  check(`pair ids for ${accent} exist in roster`, () => {
    const pair = teachersForAccent(accent);
    assert.ok(pair.female || pair.male);
    for (const id of [pair.female, pair.male]) {
      if (id) assert.ok(ids.has(id), `${id} missing from DEMO_TEACHERS`);
    }
  });
}

console.log(`\n${passed} roster checks passed`);
