/**
 * Unit tests for Task D1 — interests in the profile block (render opts) +
 * the transient social/progress context block. See
 * project_tutor_pedagogy_opener_calibration.
 *
 * Run: npx tsx scripts/test-transient-context.ts   (npm run test:pedagogy-d1)
 * No framework — matches the test:pedagogy-b6 pattern (node:assert + test()).
 */

import { strict as assert } from 'node:assert';
import {
  renderStudentProfileBlock,
} from '../src/lib/tutor/student-profile/render';
import {
  renderTransientContextBlock,
  LAST_OPENER_DIGEST_MAX_CHARS,
  type LastOpenerRecord,
} from '../src/lib/tutor/student-profile/transient-context';
import {
  STUDENT_PROFILE_SCHEMA_VERSION,
  type StudentProfile,
} from '../src/lib/tutor/student-profile/types';
import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

function makeProfile(overrides: Partial<StudentProfile> = {}): StudentProfile {
  const now = '2026-07-01T10:00:00.000Z';
  return {
    id: 'stu-1',
    name: 'Ada',
    grade: '7',
    mastery: {},
    gaps: [],
    recentSessions: [],
    preferences: { humorCeiling: 'light', tone: 'warm', interests: ['football', 'space documentaries'] },
    createdAt: now,
    updatedAt: now,
    schemaVersion: STUDENT_PROFILE_SCHEMA_VERSION,
    ...overrides,
  };
}

const THREAD_FULL: SocialThread = {
  id: 'thr_1',
  note: 'Plays football on weekends',
  kind: 'interest',
  capturedAt: '2026-06-01T00:00:00.000Z',
  lastReferencedAt: '2026-06-20T14:30:00.000Z',
};
const THREAD_BARE: SocialThread = {
  id: 'thr_2',
  note: 'Has a younger sister',
  capturedAt: '2026-06-10T00:00:00.000Z',
};
const DIGEST_FULL: ProgressDigest = {
  unitsCompleted: 6,
  unitsTotal: 9,
  percentComplete: 66.67,
  weeksElapsed: 4,
  paceNote: 'steady weekly pace',
};
const LAST_OPENER: LastOpenerRecord = {
  kind: 'warm-resume',
  digest: '"Good to have you back! Last session you were solid on substitution…" + a cinema-tickets system problem',
};

function main() {
  console.log('Task D1 — profile-block interests + transient context block\n');

  // ── 1a: renderStudentProfileBlock opts ────────────────────────────────
  console.log('renderStudentProfileBlock — includeInterests opt:');

  test('default / absent / false opts are byte-identical (interests omitted)', () => {
    const p = makeProfile();
    const base = renderStudentProfileBlock(p);
    assert.equal(renderStudentProfileBlock(p, undefined), base);
    assert.equal(renderStudentProfileBlock(p, {}), base);
    assert.equal(renderStudentProfileBlock(p, { includeInterests: false }), base);
    assert.ok(!base.includes('interests='), 'default output must not contain interests');
    assert.ok(base.includes('preferences: humor=light, tone=warm'), 'other prefs unchanged');
  });

  test('includeInterests=true appends interests=… to the existing prefBits line', () => {
    const out = renderStudentProfileBlock(makeProfile(), { includeInterests: true });
    assert.ok(
      out.includes('preferences: humor=light, tone=warm, interests=football/space documentaries'),
      `got: ${out.split('\n').find((l) => l.startsWith('preferences:'))}`,
    );
  });

  test('includeInterests=true with no other prefs renders an interests-only line', () => {
    const p = makeProfile({ preferences: { interests: ['chess'] } });
    const out = renderStudentProfileBlock(p, { includeInterests: true });
    assert.ok(out.includes('preferences: interests=chess'));
    // …and default stays interest-free AND preferences-line-free.
    assert.ok(!renderStudentProfileBlock(p).includes('preferences:'));
  });

  test('includeInterests=true with absent/empty interests is a no-op', () => {
    const noField = makeProfile({ preferences: { humorCeiling: 'light' } });
    assert.equal(
      renderStudentProfileBlock(noField, { includeInterests: true }),
      renderStudentProfileBlock(noField),
    );
    const emptyArr = makeProfile({ preferences: { humorCeiling: 'light', interests: [] } });
    assert.equal(
      renderStudentProfileBlock(emptyArr, { includeInterests: true }),
      renderStudentProfileBlock(emptyArr),
    );
  });

  test('null profile renders empty string regardless of opts', () => {
    assert.equal(renderStudentProfileBlock(null), '');
    assert.equal(renderStudentProfileBlock(null, { includeInterests: true }), '');
  });

  // ── 1b: renderTransientContextBlock ───────────────────────────────────
  console.log('\nrenderTransientContextBlock:');

  test('null when nothing to render (empty input / empty thread list)', () => {
    assert.equal(renderTransientContextBlock({}), null);
    assert.equal(renderTransientContextBlock({ socialMemory: [] }), null);
    assert.equal(renderTransientContextBlock({ socialMemory: undefined, progressDigest: undefined }), null);
  });

  test('full fixture renders the exact expected block', () => {
    const out = renderTransientContextBlock({
      socialMemory: [THREAD_FULL, THREAD_BARE],
      progressDigest: DIGEST_FULL,
    });
    const expected = [
      '<student_context_transient>',
      'progress: 6/9 units complete (67%), 4 weeks in — steady weekly pace',
      'social threads (light, student-volunteered — for rapport):',
      '- [interest] Plays football on weekends (last used 2026-06-20)',
      '- Has a younger sister',
      '',
      'Use the above naturally for rapport and for theming examples — a brief callback or a themed problem when it genuinely fits. Vary which item you draw on; avoid re-using a thread marked recently used. A returning student\'s progress can power a warm opener ("X units in — great pace") but NEVER guilt about pace or time away. Never recite this list, and never mention that any of this information is stored or remembered in notes.',
      '</student_context_transient>',
    ].join('\n');
    assert.equal(out, expected);
  });

  test('progress-only: no threads section; weeksElapsed/paceNote optional', () => {
    const out = renderTransientContextBlock({ progressDigest: DIGEST_FULL });
    assert.ok(out);
    assert.ok(out!.includes('progress: 6/9 units complete (67%), 4 weeks in — steady weekly pace'));
    assert.ok(!out!.includes('social threads'));

    const minimal = renderTransientContextBlock({
      progressDigest: { unitsCompleted: 1, unitsTotal: 8, percentComplete: 12.5 },
    });
    const progressLine = minimal!.split('\n').find((l) => l.startsWith('progress:'));
    assert.equal(progressLine, 'progress: 1/8 units complete (13%)');
  });

  test('weeksElapsed=1 is singular ("1 week in")', () => {
    const out = renderTransientContextBlock({
      progressDigest: { unitsCompleted: 2, unitsTotal: 9, percentComplete: 22, weeksElapsed: 1 },
    });
    assert.ok(out!.includes('(22%), 1 week in'));
  });

  test('threads-only: no progress line; kind bracket + last-used only when present', () => {
    const out = renderTransientContextBlock({ socialMemory: [THREAD_FULL, THREAD_BARE] });
    assert.ok(out);
    assert.ok(!out!.includes('progress:'));
    assert.ok(out!.includes('- [interest] Plays football on weekends (last used 2026-06-20)'));
    // Bare thread: no kind bracket, no (last used …).
    assert.ok(out!.includes('- Has a younger sister\n'));
    assert.ok(!out!.includes('- Has a younger sister (last used'));
  });

  test('usage instruction is present whenever the block renders', () => {
    for (const input of [
      { progressDigest: DIGEST_FULL },
      { socialMemory: [THREAD_BARE] },
    ]) {
      const out = renderTransientContextBlock(input);
      assert.ok(out!.includes('Never recite this list'));
      assert.ok(out!.includes('never mention that any of this information is stored'));
      assert.ok(out!.includes('NEVER guilt'));
    }
  });

  // ── 1c: lastOpener (opener-recency part A) ────────────────────────────
  console.log('\nrenderTransientContextBlock — lastOpener:');

  test('lastOpener alone renders the block (line + extended instruction)', () => {
    const out = renderTransientContextBlock({ lastOpener: LAST_OPENER });
    const expected = [
      '<student_context_transient>',
      `last session's opener (do NOT repeat): [warm-resume] ${LAST_OPENER.digest}`,
      '',
      'Use the above naturally for rapport and for theming examples — a brief callback or a themed problem when it genuinely fits. Vary which item you draw on; avoid re-using a thread marked recently used. A returning student\'s progress can power a warm opener ("X units in — great pace") but NEVER guilt about pace or time away. Never recite this list, and never mention that any of this information is stored or remembered in notes. Open THIS session differently from the last opener above — a different kind of opening AND different content/theming; a repeat reads as scripted.',
      '</student_context_transient>',
    ].join('\n');
    assert.equal(out, expected);
  });

  test('all three inputs render in order: progress, threads, lastOpener, instruction', () => {
    const out = renderTransientContextBlock({
      socialMemory: [THREAD_FULL],
      progressDigest: DIGEST_FULL,
      lastOpener: LAST_OPENER,
    });
    assert.ok(out);
    const ls = out!.split('\n');
    const iProgress = ls.findIndex((l) => l.startsWith('progress:'));
    const iThread = ls.findIndex((l) => l.startsWith('- [interest]'));
    const iOpener = ls.findIndex((l) => l.startsWith("last session's opener"));
    const iInstr = ls.findIndex((l) => l.startsWith('Use the above'));
    assert.ok(iProgress >= 0 && iThread > iProgress && iOpener > iThread && iInstr > iOpener,
      `order violated: progress=${iProgress} thread=${iThread} opener=${iOpener} instr=${iInstr}`);
    assert.ok(out!.includes('a repeat reads as scripted'));
  });

  test('lastOpener absent ⇒ prior output byte-identical (no opener line, no extra sentence)', () => {
    const out = renderTransientContextBlock({
      socialMemory: [THREAD_FULL, THREAD_BARE],
      progressDigest: DIGEST_FULL,
    });
    assert.ok(!out!.includes("last session's opener"));
    assert.ok(!out!.includes('a repeat reads as scripted'));
    // Instruction paragraph ends exactly where the pre-part-A block did.
    assert.ok(out!.includes('stored or remembered in notes.\n</student_context_transient>'));
  });

  test(`digest > ${LAST_OPENER_DIGEST_MAX_CHARS} chars is TRUNCATED with an ellipsis (documented choice: truncate, not reject)`, () => {
    const longDigest = 'x'.repeat(LAST_OPENER_DIGEST_MAX_CHARS + 57);
    const out = renderTransientContextBlock({ lastOpener: { kind: 'proactive', digest: longDigest } });
    const line = out!.split('\n').find((l) => l.startsWith("last session's opener"))!;
    assert.ok(line.includes(`[proactive] ${'x'.repeat(LAST_OPENER_DIGEST_MAX_CHARS)}…`));
    assert.ok(!line.includes('x'.repeat(LAST_OPENER_DIGEST_MAX_CHARS + 1)), 'digest clipped at the max');
  });

  test('lastOpener with an empty/whitespace digest is treated as absent', () => {
    assert.equal(renderTransientContextBlock({ lastOpener: { kind: 'proactive', digest: '   ' } }), null);
    const out = renderTransientContextBlock({
      progressDigest: DIGEST_FULL,
      lastOpener: { kind: 'proactive', digest: '' },
    });
    assert.ok(out && !out.includes("last session's opener") && !out.includes('a repeat reads as scripted'));
  });

  test('no null/undefined leakage in rendered output', () => {
    const out = renderTransientContextBlock({
      socialMemory: [THREAD_FULL, THREAD_BARE],
      progressDigest: { unitsCompleted: 0, unitsTotal: 9, percentComplete: 0 },
    });
    assert.ok(!out!.includes('undefined'));
    assert.ok(!out!.includes('null'));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
