/**
 * Tests for the judge → next-turn correction note (2026-08-07 triage,
 * session-1786064015703): the judge detected the "an ellipse" false reject
 * (judge_advisory_was_kill) but the result went nowhere — advisory-only with
 * no student-visible effect. The note rides the next brain call via the
 * pendingCadenceNoteRef convention so the tutor can own the correction.
 *
 * Run: npx tsx scripts/test-judge-correction-note.ts
 */
import { buildJudgeCorrectionNote } from '../src/lib/tutor/voice/judge-correction-note';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// No claims → no note.
check('empty claims → null', buildJudgeCorrectionNote([]) === null);

// Single claim renders the standard note.
{
  const note = buildJudgeCorrectionNote(['Not quite. Close though — picture that slice going straight across']);
  check('note is non-null', note !== null);
  check('bracketed note convention', /^\[correction note — not from the student\]/.test(note ?? ''));
  check('quotes the claim', (note ?? '').includes('picture that slice going straight across'));
  check('asks for silent re-check', /re-?check/i.test(note ?? ''));
  check('owns the correction when wrong', /own|correct/i.test(note ?? ''));
  check('safety valve: silent continue when the review is wrong', /stand by|continue|do not mention/i.test(note ?? ''));
  check('single-line (no raw newlines to break transcript splice)', !(note ?? '').includes('\n'));
}

// Claims are capped: at most 2 quoted, each truncated.
{
  const long = 'x'.repeat(400);
  const note = buildJudgeCorrectionNote([long, long, long]) ?? '';
  check('long claims truncated', note.length < 900);
  check('at most 2 claims quoted', (note.match(/"x{10}/g) ?? []).length === 2);
}

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} judge-correction-note tests passed.`);
