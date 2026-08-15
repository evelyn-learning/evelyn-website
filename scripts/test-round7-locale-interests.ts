/**
 * Round-7 item 6 prompt directives (live sessions f7b92ca7/b2fe010e,
 * 2026-07-28):
 *  1. Interests are HOBBIES — the tutor talked metronome markings, chords
 *     and beats at degree depth to a student whose profile lists "music"
 *     as an interest. Interests must theme LIGHT analogies only, with no
 *     assumed technical knowledge of the interest's own domain, and any
 *     domain term explained in plain words.
 *  2. Plain international English — "cleats", "straddling" and similar
 *     US-flavoured vocabulary confused a non-US student. The voice
 *     guidelines must direct plain, internationally understood wording;
 *     US-specific sports/idiom references only when the student's own
 *     words introduce them.
 *
 * Run: npx tsx scripts/test-round7-locale-interests.ts
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../apps/marketing/src/lib/tutor/ai/system-prompt-builder';
import { renderAnalogiesBlock } from '../apps/marketing/src/lib/tutor/pedagogy/analogies';
import { getGradeProfile } from '../apps/marketing/src/lib/tutor/pedagogy/grade-profile';
import { renderStudentProfileBlock } from '../apps/marketing/src/lib/tutor/student-profile/render';
import type { StudentProfile } from '../apps/marketing/src/lib/tutor/student-profile/types';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = { module: null, studentName: 'Ravi' };
const prompt = buildSystemPrompt(baseCtx);

test('voice guidelines direct plain international English', () => {
  assert.ok(/plain international English/i.test(prompt));
  assert.ok(/US-specific/i.test(prompt));
  assert.ok(/student's own words introduce/i.test(prompt));
});

test('analogies block: interests are hobbies, not expertise', () => {
  const block = renderAnalogiesBlock(getGradeProfile('11'));
  assert.ok(/HOBBIES/.test(block));
  assert.ok(/not expertise|no technical knowledge/i.test(block));
  assert.ok(/explain any domain term/i.test(block));
});

const profileWithInterests = {
  studentId: 's1',
  name: 'Ravi',
  preferences: { interests: ['music', 'football'] },
  mastery: {},
  gaps: [],
  recentSessions: [],
} as unknown as StudentProfile;

test('profile block: interests line carries hobby-not-expertise guidance', () => {
  const block = renderStudentProfileBlock(profileWithInterests, { includeInterests: true });
  assert.ok(block.includes('interests=music/football'));
  assert.ok(/HOBBIES/.test(block));
  assert.ok(/never assume technical knowledge/i.test(block));
});

test('profile block: interests OFF stays byte-identical (no stray guidance)', () => {
  const block = renderStudentProfileBlock(profileWithInterests, { includeInterests: false });
  assert.ok(!block.includes('interests='));
  assert.ok(!/HOBBIES/.test(block));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
