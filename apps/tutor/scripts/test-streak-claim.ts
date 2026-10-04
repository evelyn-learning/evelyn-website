/**
 * Streak / tally praise guard (2026-10-03).
 *
 * Regression under test: production — the tutor said "five for five" (on a
 * wrong answer), "Nine in a row", "Twelve straight", "fifteen problems deep
 * with zero misses" while the student had wrong answers and several "I
 * don't know". The orchestrator tracks the real streak (pacing_streak); a
 * spoken count that disagrees with it must not reach the student.
 *
 * Run: npx tsx scripts/test-streak-claim.ts
 */
import { detectStreakClaims, assessStreakClaim, parseCountToken } from '../src/lib/tutor/voice/streak-claim';

let failures = 0;
let passed = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got ${JSON.stringify(got)}` : ''}`); }
  else passed++;
}
const counts = (s: string) => detectStreakClaims(s).map((c) => c.count);
const kinds = (s: string) => detectStreakClaims(s).map((c) => c.kind);
const assess = (s: string, streak: number | null, wrong: number | null, enabled = true) =>
  assessStreakClaim(s, { enabled, consecutiveCorrect: streak, wrongThisSession: wrong });

// ── number tokens ───────────────────────────────────────────────────────
check('digits', parseCountToken('12') === 12);
check('word', parseCountToken('Twelve') === 12);
check('compound word', parseCountToken('twenty-one') === 21 && parseCountToken('thirty five') === 35);
check('zero', parseCountToken('zero') === 0);
check('not a number', parseCountToken('several') === null);

// ── detector: the production sentences ──────────────────────────────────
check('five for five', counts('Five for five!')[0] === 5 && kinds('Five for five!')[0] === 'tally', detectStreakClaims('Five for five!'));
check('Nine in a row', counts('Nine in a row.')[0] === 9 && kinds('Nine in a row.')[0] === 'streak');
check('Twelve straight', counts('Twelve straight!')[0] === 12 && kinds('Twelve straight!')[0] === 'streak');
{
  const c = detectStreakClaims("You're fifteen problems deep with zero misses.");
  check('fifteen problems deep + zero misses → two claims',
    c.length === 2 && c.some((x) => x.kind === 'deep' && x.count === 15) && c.some((x) => x.kind === 'perfect' && x.count === null), c);
}
// ── detector: the other listed forms ────────────────────────────────────
check('digits N for N', counts("That's 5 for 5 so far.")[0] === 5);
check('hyphenated', counts('Five-for-five, nice!')[0] === 5);
check('N out of N', counts("You've got 4 out of 4 correct.")[0] === 4 && kinds("You've got 4 out of 4 correct.")[0] === 'tally');
check('N in a row with a tally noun', counts("That's six correct in a row!")[0] === 6);
check('N straight + noun', counts("You've nailed seven straight problems.")[0] === 7);
check('perfect so far', kinds('Perfect so far.')[0] === 'perfect');
check('no misses', kinds("You've had no misses yet.")[0] === 'perfect');
check("haven't missed one", kinds("You haven't missed one yet.")[0] === 'perfect');

// ── detector negatives: not a praise tally ──────────────────────────────
const NOT_CLAIMS = [
  'She took 3 out of 5 trips to the store.',          // word problem
  'You make 3 out of 5 trips by bus.',                // second person, still a word problem (noun rule)
  'Round 2 of 3.',
  'Round 2 of 3 — here we go.',
  'You get 5 for 5 dollars.',
  'They are 5 for 5 dollars at the stand.',
  'Draw five straight lines.',
  'You put four chairs in a row.',
  'If you place four in a row, how many rows do you need?',
  'The tiles are arranged with six in a row.',
  'What is 4 out of 4 as a percent?',
  'A perfect score is 100 points on this test.',
  'A perfect square has a whole-number root.',
  'Step 3 of 3 is the check.',
  'There are twelve inches in a foot.',
  "Let's try the next one.",
];
for (const s of NOT_CLAIMS) check(`not a claim: "${s}"`, detectStreakClaims(s).length === 0, detectStreakClaims(s));

// ── decision: production sentences are dropped ──────────────────────────
// Tracked state in that session: wrong answers present, short real streak.
{
  const a0 = assess("That's five for five now.", 2, 2);
  check("That's five for five now. (streak 2, 2 wrong) → drop", a0.action === 'drop' && a0.claimed[0] === 5, a0);
  const a = assess('Five for five!', 1, 2);
  check('five for five (wrong answers this session) → drop', a.action === 'drop' && a.claimed[0] === 5, a);
  const b = assess('Nine in a row.', 2, 2);
  check('Nine in a row (streak 2) → drop', b.action === 'drop' && b.reason === 'count-mismatch', b);
  const c = assess('Twelve straight.', 2, 2);
  check('Twelve straight (streak 2) → drop', c.action === 'drop', c);
  check('Twelve straight! → drop', assess('Twelve straight!', 2, 2).action === 'drop');
  const d = assess("You're fifteen problems deep with zero misses.", 2, 2);
  check('fifteen deep with zero misses (2 wrong) → drop', d.action === 'drop' && d.reason === 'perfect-with-wrong', d);
  const f = assess("You're fifteen problems deep with zero misses.", 3, 0);
  check('fifteen deep, no wrong, streak 3 → drop (count mismatch)', f.action === 'drop' && f.reason === 'count-mismatch', f);
  check('praise word + fragment → drop', assess('Nice, nine in a row!', 2, 2).action === 'drop');
  check("that makes N in a row → drop", assess('That makes nine in a row!', 2, 2).action === 'drop');
  check("you've got N straight → drop", assess("You've got twelve straight now.", 2, 2).action === 'drop');
}

// ── decision: the tracked count is not ground truth ─────────────────────
// It is credited only on verification turns, zeroed on a topic switch and
// can be restored from a snapshot — so a claim is dropped only when it
// EXCEEDS the tracked count by two or more. An under-claim is never dropped.
check('four in a row, streak 4 → pass', assess("That's four in a row!", 4, 0).action === 'pass', assess("That's four in a row!", 4, 0));
check('four in a row, streak 4, earlier wrong → pass (a streak is not a perfect record)',
  assess("That's four in a row!", 4, 2).action === 'pass');
// The streak ref is credited AFTER the turn streams, so the turn that
// confirms the 4th answer speaks while the ref still says 3.
check('four in a row, streak 3 (this answer not yet credited) → pass', assess('Four in a row!', 3, 0).action === 'pass');
check('three in a row, streak 2 (one correct answer uncredited) → pass', assess('Three in a row!', 2, 0).action === 'pass');
check('four in a row, streak 2 → drop', assess('Four in a row!', 2, 0).action === 'drop');
check('under-claim: three in a row, streak 7 → pass', assess('Three in a row!', 7, 0).action === 'pass');
check('two in a row, streak 0 → drop (2 > 0 + 1)',
  assess('Two in a row!', 0, 0).action === 'drop');
check('one in a row, streak 0 → pass', assess("That's one in a row.", 0, 1).action === 'pass');
check('five for five, streak 5, none wrong → pass', assess('Five for five!', 5, 0).action === 'pass');
// A perfect-record claim with a wrong answer on the ledger is dropped only
// when N is also more than the answers credited; otherwise it may be a
// scoped truth ("five for five" on this set) — advisory.
{
  const a = assess('Five for five!', 5, 1);
  check('five for five, streak 5, one wrong → advisory (not provably false)', a.action === 'advisory' && a.mismatch === 'perfect-with-wrong', a);
  const b = assessStreakClaim('Five for five!', { enabled: true, consecutiveCorrect: 3, wrongThisSession: 1, answersCredited: 4 });
  check('five for five, 4 credited, 1 wrong → drop (perfect-with-wrong)', b.action === 'drop' && b.reason === 'perfect-with-wrong', b);
  const c = assessStreakClaim('Five for five!', { enabled: true, consecutiveCorrect: 4, wrongThisSession: 1, answersCredited: 9 });
  check('five for five, 9 credited, streak 4 → advisory', c.action === 'advisory', c);
}
check('perfect so far, none wrong → pass', assess('Perfect so far.', 3, 0).action === 'pass');
{
  const e = assess('Perfect so far.', 2, 1);
  check('number-less perfect claim with a wrong answer → advisory, never dropped', e.action === 'advisory' && e.mismatch === 'perfect-with-wrong', e);
}
check('partial tally (3 out of 5) is not assessed', assess("You've got 3 out of 5 right.", 1, 2).action === 'pass');

// ── 2026-10-04 review: lesson content and scoped tallies are KEPT ───────
// Every sentence here was dropped when the tracked streak differed.
const REVIEW_KEPT = [
  'You need three in a row to win.',
  'You flipped heads three in a row.',
  'You have four in a row and three rows.',
  'You count six in a row.',
  'You see five in a row.',
  "That's two in a row, so we multiply.",
  'So you get 5 out of 5.',
  'You got a perfect score on that one!',
  "That's 2 for 2 on this page.",
  "You're three for three on slope problems.",
  // same shapes, other wordings
  'You rolled a six four in a row.',
  'If you win three in a row, you take the match.',
  "That's five for five in this set.",
  "You're four for four on that one.",
  'She got nine in a row.',
];
for (const s of REVIEW_KEPT) {
  for (const [streak, wrong] of [[0, 3], [1, 0], [2, 2], [9, 0], [0, 0]] as Array<[number, number]>) {
    const r = assess(s, streak, wrong);
    check(`kept (streak ${streak}, wrong ${wrong}): "${s}"`, r.action !== 'drop', r);
  }
}
// Verbs of having / needing / getting / counting / seeing / flipping /
// rolling / placing make the sentence content: not a claim at all.
for (const s of REVIEW_KEPT.slice(0, 5).concat(['So you get 5 out of 5.', 'You rolled a six four in a row.'])) {
  check(`content verb ⇒ not a claim: "${s}"`, detectStreakClaims(s).length === 0, detectStreakClaims(s));
}
{
  const s1 = assess("That's 2 for 2 on this page.", 0, 3);
  check('scoped tally → advisory, reason scoped', s1.action === 'advisory' && s1.reason === 'scoped', s1);
  const s2 = assess("That's two in a row, so we multiply.", 0, 0);
  check('claim + further content clause → advisory', s2.action === 'advisory' && s2.reason === 'other-content', s2);
  check('"on a roll" is praise, not a scope', assess("Nine in a row — you're on a roll!", 2, 2).action === 'drop');
}

// ── decision: unknown real count ⇒ never drop ───────────────────────────
{
  const a = assess('Nine in a row.', null, null);
  check('unknown streak → pass, reason unknown', a.action === 'pass' && a.reason === 'unknown', a);
  check('unknown wrong count: perfect claim passes', assess('Perfect so far.', 3, null).action === 'pass');
  check('unknown wrong count: numeric mismatch still drops', assess('Nine in a row.', 2, null).action === 'drop');
}

// ── decision: never drop a question / verdict / other content ───────────
{
  const q = assess("That's nine in a row — want a harder one?", 2, 3);
  check('claim + question → advisory', q.action === 'advisory' && q.reason === 'has-question', q);
  const v = assess('Exactly right, five for five!', 1, 2);
  check('claim + verdict → advisory', v.action === 'advisory' && v.reason === 'has-verdict', v);
  const n = assess('Not quite — you were five for five until this one, so check the sign on the second term.', 1, 2);
  check('claim + denial verdict + content → advisory', n.action === 'advisory', n);
  const o = assess("You're nine in a row now, so the next problem moves the decimal two places to the left instead of one.", 2, 3);
  check('claim + other content → advisory', o.action === 'advisory' && o.reason === 'other-content', o);
  check('advisory keeps the claimed counts', q.claimed[0] === 9);
}

// ── no claim / flag off ─────────────────────────────────────────────────
check('no claim → pass none', assess('Now add three to both sides.', 2, 3).reason === 'no-claim');
check('negatives never drop even with a mismatching streak',
  NOT_CLAIMS.every((s) => assess(s, 0, 5).action === 'pass'));
check('flag off → pass', assess('Nine in a row.', 2, 3, false).action === 'pass' && assess('Nine in a row.', 2, 3, false).reason === 'flag-off');
check('never throws on junk', assess(undefined as unknown as string, 1, 1).action === 'pass');

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log(`test:streak-claim PASS (${passed} checks)`);
