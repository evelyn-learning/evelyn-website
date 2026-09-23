/**
 * Task 6 probe: renders a profile with one prior session twice — once with
 * default options, once with `suppressContinuityOpener: true` — and checks:
 *
 *   - default output contains the "last time we did" continuity directive
 *     line (the one that tells the brain to open with a concrete callback).
 *   - suppressContinuityOpener:true output does NOT contain that directive
 *     line, and instead contains "Do not open with a recap of prior
 *     sessions."
 *   - every OTHER line is identical between the two renders (compare the
 *     line arrays after removing the two differing lines) — the option is
 *     additive, not a wholesale rewrite of the block.
 *
 * Run:
 *   npx tsx scripts/test-student-profile-render.ts
 */
import { renderStudentProfileBlock } from '../src/lib/tutor/student-profile/render';
import type { StudentProfile } from '../src/lib/tutor/student-profile/types';

let failed = false;
const fail = (msg: string) => { console.error(`FAIL: ${msg}`); failed = true; };

const profile: StudentProfile = {
  id: 'test-student-1',
  name: 'Ada',
  grade: '8',
  mastery: {},
  gaps: [],
  recentSessions: [
    {
      sessionId: 'sess-1',
      endedAt: '2026-09-20T12:00:00.000Z',
      subject: 'Math',
      topic: 'Linear equations',
      grade: '8',
      losTouched: ['ccss.math.8.ee.c.7'],
      summary: 'Worked through solving for x in one-variable linear equations.',
    },
  ],
  preferences: {},
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-20T12:00:00.000Z',
  schemaVersion: 1,
};

const CONTINUITY_DIRECTIVE = 'last time we did';
const SUPPRESSION_SENTENCE = 'Do not open with a recap of prior sessions.';

// ── 1. Default render: continuity directive present ───────────────────
const defaultBlock = renderStudentProfileBlock(profile);
console.log('=== default render ===');
console.log(defaultBlock);
if (!defaultBlock.includes(CONTINUITY_DIRECTIVE)) {
  fail(`default render must contain the continuity directive ("${CONTINUITY_DIRECTIVE}")`);
}
if (defaultBlock.includes(SUPPRESSION_SENTENCE)) {
  fail('default render must NOT contain the suppression sentence');
}

// ── 2. suppressContinuityOpener:true — directive replaced ─────────────
const suppressedBlock = renderStudentProfileBlock(profile, { suppressContinuityOpener: true });
console.log('\n=== suppressContinuityOpener:true render ===');
console.log(suppressedBlock);
if (suppressedBlock.includes(CONTINUITY_DIRECTIVE)) {
  fail(`suppressed render must NOT contain the continuity directive ("${CONTINUITY_DIRECTIVE}")`);
}
if (!suppressedBlock.includes(SUPPRESSION_SENTENCE)) {
  fail(`suppressed render must contain the suppression sentence ("${SUPPRESSION_SENTENCE}")`);
}

// ── 3. Every OTHER line identical ──────────────────────────────────────
const defaultLines = defaultBlock.split('\n');
const suppressedLines = suppressedBlock.split('\n');

const defaultOnly = defaultLines.filter((l) => !l.includes(CONTINUITY_DIRECTIVE));
const suppressedOnly = suppressedLines.filter((l) => !l.includes(SUPPRESSION_SENTENCE));

if (defaultOnly.length !== suppressedOnly.length) {
  fail(
    `line counts differ after removing the two differing lines: default=${defaultOnly.length} suppressed=${suppressedOnly.length}`,
  );
} else {
  for (let i = 0; i < defaultOnly.length; i++) {
    if (defaultOnly[i] !== suppressedOnly[i]) {
      fail(`line ${i} differs beyond the continuity/suppression swap: "${defaultOnly[i]}" vs "${suppressedOnly[i]}"`);
    }
  }
}

if (failed) {
  console.error('\ntest-student-profile-render: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-student-profile-render: all cases OK (directive swap + line-for-line identity elsewhere)');
}
