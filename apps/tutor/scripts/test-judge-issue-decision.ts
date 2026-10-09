/**
 * What a flagged judge issue is allowed to do: plant a correction note,
 * withhold pacing credit, or neither.
 *
 * Live (student gac-test-001): three times the tutor correctly said "Not
 * quite. Close though." and the judge returned an issue whose own "why" said
 * the student WAS wrong (it objected to "Close though"). The orchestrator
 * keyed on the claim text opening with a denial, so each one planted a
 * retraction note and withheld the incorrect credit.
 *
 * Run: npx tsx scripts/test-judge-issue-decision.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  decideJudgeIssue,
  planJudgeNote,
  buildPlannedJudgeNote,
  isSuppressibleDenial,
  readJudgeIssueFields,
  readJudgeTurnContext,
  readTutorStance,
  isAffirmingClaim,
  claimStatesOwnValue,
  formatJudgeAnswerCheck,
  describePrecheckDisagreement,
  describeJudgeIssueDecision,
  JUDGE_STUDENT_ANSWER_VERDICTS,
  JUDGE_ISSUE_KINDS,
  type JudgeIssueDecision,
} from '../src/lib/tutor/voice/judge-issue-decision';
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserContent } from '../src/lib/tutor/judge-prompt';
import { buildJudgeCorrectionNote, hasMathExpression } from '../src/lib/tutor/voice/judge-correction-note';
import { DENIAL_RE } from '../src/lib/tutor/voice/simplification-verdict-check';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

const DENIAL = 'Not quite. Close though.';
const MATH = 'So $x = 11$ after dividing by 3.';
const PROSE = 'The line bows outward here.';
type Sev = 'kill' | 'advisory';
const d = (claim: string, fields: Record<string, unknown>, severity: Sev = 'advisory', enabled = true): JudgeIssueDecision =>
  // falsePraiseRound:false pins the 2026-10-04 table; the 2026-10-05 rows
  // (false-praise note, no note on a not-an-answer grounding issue or on a
  // statement the judge itself calls correct) are in test-judge-note-false-praise.ts.
  // unsureNoNote:false likewise pins the table before 2026-10-06b; the
  // "unsure ⇒ no note" row has its own section at the end of this file.
  // falseDenialGuards:false pins the table before 2026-10-08; the guards on
  // the retraction rows have their own section at the end of this file.
  decideJudgeIssue({ enabled, issue: { claim, ...fields }, severity, falsePraiseRound: false, unsureNoNote: false, falseDenialGuards: false });

console.log('\njudge issue decision — the production case');

test('LIVE: correct "Not quite. Close though." flagged for its wording → no note, nothing withheld', () => {
  const r = d(DENIAL, { studentAnswerVerdict: 'incorrect', issueKind: 'tone_or_wording' });
  assert.equal(r.plantNote, false);
  assert.equal(r.withholdCredit, false);
  assert.equal(r.reason, 'tone-or-wording');
});
test('tone_or_wording never plants, whatever the claim carries', () => {
  for (const claim of [DENIAL, MATH, PROSE]) {
    for (const v of ['incorrect', 'unsure', 'not_an_answer', undefined]) {
      const r = d(claim, { issueKind: 'tone_or_wording', ...(v ? { studentAnswerVerdict: v } : {}) });
      assert.equal(r.plantNote, false, `${claim} / ${v}`);
      assert.equal(r.withholdCredit, false, `${claim} / ${v}`);
    }
  }
  assert.equal(d(DENIAL, { issueKind: 'tone_or_wording' }, 'kill').plantNote, false);
});

console.log('\njudge issue decision — retraction only when the judge says the student was right');

test('false_denial + student correct → retraction note + credit withheld', () => {
  const r = d(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' });
  assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit], [true, 'retraction', true]);
});
test('false_denial with the verdict unsure / missing → the LEGACY re-check note + credit withheld', () => {
  // CHANGED (review 2026-10-04): this pinned 'retraction' wording. The judge
  // did not say the student was right, so the note must not say so either;
  // the legacy note asks for a re-check and owns a correction only if needed.
  for (const v of ['unsure', undefined]) {
    const r = d(DENIAL, { issueKind: 'false_denial', ...(v ? { studentAnswerVerdict: v } : {}) });
    assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit], [true, 'legacy', true], String(v));
  }
});
test('false_denial on a claim that is not a denial: honoured before 2026-10-08, nothing since', () => {
  // CHANGED (2026-10-08, portal-09624999 @69.9 s): this pinned a retraction
  // for any claim the judge called false_denial. The flagged claim there was
  // the tutor AGREEING with the student; the note made the next turn
  // apologise for a push-back that never happened. Under the guards the
  // claim itself has to be a denial (the sibling row always required it).
  const claim = "Hmm, let's look at that again — the answer is actually x.";
  const r = d(claim, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' });
  assert.equal(r.noteMode, 'retraction');
  assert.equal(r.withholdCredit, true);
  const guarded = decideJudgeIssue({ enabled: true, issue: { claim, issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, severity: 'advisory' });
  assert.deepEqual([guarded.plantNote, guarded.withholdCredit, guarded.reason], [false, false, 'claim-not-a-denial']);
});
test('studentAnswerVerdict=correct on a denial claim → retraction, whatever the kind', () => {
  for (const k of ['other', 'grounding', 'wrong_math', 'tone_or_wording', undefined]) {
    const r = d(DENIAL, { studentAnswerVerdict: 'correct', ...(k ? { issueKind: k } : {}) });
    assert.equal(r.noteMode, 'retraction', String(k));
    assert.equal(r.withholdCredit, true, String(k));
  }
});
test('a judge that says false_denial AND student incorrect / not_an_answer contradicts itself → nothing', () => {
  for (const v of ['incorrect', 'not_an_answer']) {
    for (const sev of ['advisory', 'kill'] as const) {
      const r = d(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: v }, sev);
      assert.equal(r.plantNote, false, `${v}/${sev}`);
      assert.equal(r.withholdCredit, false, `${v}/${sev}`);
      assert.equal(r.reason, 'judge-self-contradiction', `${v}/${sev}`);
    }
  }
});
test('a denial of an answer the judge calls incorrect / not an answer is a correct denial → no retraction, nothing withheld', () => {
  for (const v of ['incorrect', 'not_an_answer']) {
    for (const k of ['other', undefined]) {
      const r = d(DENIAL, { studentAnswerVerdict: v, ...(k ? { issueKind: k } : {}) });
      assert.equal(r.plantNote, false, `${v}/${k}`);
      assert.equal(r.withholdCredit, false, `${v}/${k}`);
      assert.equal(r.reason, 'denial-of-incorrect-answer', `${v}/${k}`);
    }
  }
});
test('UNSURE (or no verdict) on a denial claim → the legacy re-check note is planted and credit withheld', () => {
  // CHANGED (review 2026-10-04): this test pinned "unsure on a denial: no
  // retraction, nothing withheld" and asserted plantNote === false. That was
  // the bug: before the structured fields existed every flagged denial got a
  // re-check note; with the fields always present, an unsure judge silenced it.
  for (const k of ['other', 'grounding', 'wrong_math', undefined]) {
    for (const v of ['unsure', undefined]) {
      if (!k && !v) continue;   // neither field: the unstructured path, below
      for (const sev of ['advisory', 'kill'] as const) {
        const r = d(DENIAL, { ...(v ? { studentAnswerVerdict: v } : {}), ...(k ? { issueKind: k } : {}) }, sev);
        assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'legacy', true, 'denial-unverified'], `${k}/${v}/${sev}`);
      }
    }
  }
});
test('the widened denial forms count ONLY for the verdict=correct retraction; unsure / missing is exactly HEAD', () => {
  // CHANGED (second review pass 2026-10-04): this pinned the legacy re-check
  // note + withheld credit for the widened forms with an UNSURE verdict. At
  // HEAD a flagged "That doesn't work." planted nothing and withheld nothing
  // (DENIAL_RE does not match it); the widening is ordinary English and the
  // judge did not say the student was right, so it must not do more than HEAD.
  for (const claim of ["That doesn't work here. Plug it in.", "That doesn't work.", "Let's try that again.", "Hmm. That isn't right."]) {
    assert.equal(DENIAL_RE.test(claim), false, claim);
    for (const fields of [
      { studentAnswerVerdict: 'unsure', issueKind: 'other' }, { studentAnswerVerdict: 'unsure' }, { issueKind: 'other' },
      { issueKind: 'grounding' }, { studentAnswerVerdict: 'unsure', issueKind: 'false_denial' }, { issueKind: 'false_denial' },
    ]) {
      const r = d(claim, fields);
      assert.deepEqual([r.plantNote, r.withholdCredit], [false, false], `${claim} / ${JSON.stringify(fields)}`);
    }
    // Kill-class: HEAD planted a note for every kill-class issue and withheld
    // credit only on DENIAL_RE — a note (neutral wording), nothing withheld.
    const kill = d(claim, { studentAnswerVerdict: 'unsure', issueKind: 'other' }, 'kill');
    assert.deepEqual([kill.plantNote, kill.noteMode, kill.withholdCredit], [true, 'neutral', false], claim);
    const correct = d(claim, { studentAnswerVerdict: 'correct', issueKind: 'other' });
    assert.deepEqual([correct.plantNote, correct.noteMode, correct.withholdCredit], [true, 'retraction', true], claim);
    const incorrect = d(claim, { studentAnswerVerdict: 'incorrect', issueKind: 'other' });
    assert.deepEqual([incorrect.plantNote, incorrect.withholdCredit], [false, false], claim);
  }
  // Not denials: a new problem, an affirmation.
  const moveOn = d("Let's try this again with a new inequality.", { studentAnswerVerdict: 'unsure', issueKind: 'other' });
  assert.deepEqual([moveOn.plantNote, moveOn.withholdCredit], [false, false]);
});
test('studentAnswerVerdict=correct with false_praise on a denial claim is NOT a retraction', () => {
  const r = d(DENIAL, { studentAnswerVerdict: 'correct', issueKind: 'false_praise' });
  assert.notEqual(r.noteMode, 'retraction');
  assert.equal(r.withholdCredit, false);
});

console.log('\njudge issue decision — the other kinds');

test('wrong_math / grounding / other with a math claim → neutral note, nothing withheld', () => {
  for (const k of ['wrong_math', 'grounding', 'other']) {
    for (const v of ['incorrect', 'unsure', 'not_an_answer', 'correct', undefined]) {
      const r = d(MATH, { issueKind: k, ...(v ? { studentAnswerVerdict: v } : {}) });
      assert.equal(r.plantNote, true, `${k}/${v}`);
      assert.equal(r.noteMode, 'neutral', `${k}/${v}`);
      assert.equal(r.withholdCredit, false, `${k}/${v}`);
    }
  }
});
test('a wrong_math issue inside a denial turn of an incorrect answer still gets its neutral note', () => {
  const r = d('Not quite — $3 \\cdot 4 = 13$.', { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' });
  assert.equal(r.plantNote, true);
  assert.equal(r.noteMode, 'neutral');
  assert.equal(r.withholdCredit, false);
});
test('advisory prose claim with no math: no note (as today)', () => {
  for (const k of ['grounding', 'other', 'wrong_math']) {
    assert.equal(d(PROSE, { issueKind: k, studentAnswerVerdict: 'unsure' }).plantNote, false, k);
  }
});
test('false_praise keeps today\'s plant rule (kill always, advisory when math-bearing), neutral wording, nothing withheld', () => {
  const adv = d('Right. $5$ isn\'t included', { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' });
  assert.equal(adv.plantNote, true);
  assert.equal(adv.noteMode, 'neutral');
  assert.equal(adv.withholdCredit, false);
  const advProse = d('Right. Nice work.', { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' });
  assert.equal(advProse.plantNote, false);
  const kill = d('Right. Nice work.', { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' }, 'kill');
  assert.equal(kill.plantNote, true);
  assert.equal(kill.noteMode, 'neutral');
});
test('kill severity always plants for the non-tone kinds', () => {
  for (const k of ['wrong_math', 'grounding', 'other', 'false_praise']) {
    for (const v of ['unsure', 'incorrect', 'not_an_answer', 'correct', undefined]) {
      const r = d(PROSE, { issueKind: k, ...(v ? { studentAnswerVerdict: v } : {}) }, 'kill');
      assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit], [true, 'neutral', false], `${k}/${v}`);
    }
  }
});
test('kill-class issue on a denial of an INCORRECT answer: neutral note for the named fault, nothing withheld', () => {
  for (const k of ['wrong_math', 'grounding', 'other', 'false_praise']) {
    const r = d(DENIAL, { issueKind: k, studentAnswerVerdict: 'incorrect' }, 'kill');
    assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit], [true, 'neutral', false], k);
  }
  // No fault named beyond the verdict itself: nothing.
  const bare = d(DENIAL, { studentAnswerVerdict: 'incorrect' }, 'kill');
  assert.deepEqual([bare.plantNote, bare.withholdCredit], [false, false]);
});

console.log('\njudge issue decision — backward compatibility');

test('no structured fields: today\'s behaviour (claim-text keyed)', () => {
  const denial = d(DENIAL, {});
  assert.deepEqual([denial.plantNote, denial.noteMode, denial.withholdCredit, denial.reason], [true, 'legacy', true, 'unstructured']);
  const math = d(MATH, {});
  assert.deepEqual([math.plantNote, math.noteMode, math.withholdCredit], [true, 'legacy', false]);
  const prose = d(PROSE, {});
  assert.deepEqual([prose.plantNote, prose.withholdCredit], [false, false]);
  const killProse = d(PROSE, {}, 'kill');
  assert.deepEqual([killProse.plantNote, killProse.noteMode, killProse.withholdCredit], [true, 'legacy', false]);
  const killDenial = d(DENIAL, {}, 'kill');
  assert.deepEqual([killDenial.plantNote, killDenial.withholdCredit], [true, true]);
});
test('flag off: structured fields are ignored entirely', () => {
  const r = d(DENIAL, { studentAnswerVerdict: 'incorrect', issueKind: 'tone_or_wording' }, 'advisory', false);
  assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'legacy', true, 'flag-off']);
});
test('neither field: EXACTLY the rule at HEAD, advisory and kill-class', () => {
  // HEAD (VoiceTutorRealtime.tsx before this round), verbatim:
  //   advisory: note ⇔ hasMathExpression(claim) || DENIAL_RE.test(claim);
  //             credit withheld ⇔ DENIAL_RE.test(claim)
  //   kill:     note always; credit withheld ⇔ DENIAL_RE.test(claim)
  // …and the note is buildJudgeCorrectionNote(claims, transcript) — the
  // legacy wording. The widened denial forms must NOT leak into this path.
  const claims = [DENIAL, MATH, PROSE, 'Nope, $x = 3$.', "That doesn't work here.", "Let's try that again.", "Hmm. That isn't right.", 'Close, but $2x = 8$.', ''];
  for (const claim of claims) {
    for (const sev of ['advisory', 'kill'] as const) {
      for (const enabled of [true, false]) {
        const r = d(claim, {}, sev, enabled);
        const denial = DENIAL_RE.test(claim);
        const headPlant = sev === 'kill' ? true : hasMathExpression(claim) || denial;
        assert.equal(r.plantNote, headPlant, `plant ${claim}/${sev}/${enabled}`);
        assert.equal(r.withholdCredit, denial, `withhold ${claim}/${sev}/${enabled}`);
        assert.equal(r.noteMode, 'legacy', `mode ${claim}/${sev}/${enabled}`);
      }
    }
  }
  const plan = planJudgeNote([{ claim: DENIAL, decision: d(DENIAL, {}) }, { claim: MATH, decision: d(MATH, {}) }, { claim: PROSE, decision: d(PROSE, {}) }]);
  assert.deepEqual(plan, { claims: [DENIAL, MATH], mode: 'legacy' });
  assert.equal(
    buildJudgeCorrectionNote(plan!.claims, '5', { mode: plan!.mode, otherClaims: plan!.otherClaims }),
    buildJudgeCorrectionNote([DENIAL, MATH], '5'),
  );
});
test('unknown / malformed field values count as missing', () => {
  assert.deepEqual(readJudgeIssueFields({ studentAnswerVerdict: 'CORRECT ', issueKind: 'False_Denial' }), { studentAnswerVerdict: 'correct', issueKind: 'false_denial' });
  assert.deepEqual(readJudgeIssueFields({ studentAnswerVerdict: 'maybe', issueKind: 7 }), {});
  assert.deepEqual(readJudgeIssueFields(null), {});
  assert.equal(d(DENIAL, { studentAnswerVerdict: 'maybe', issueKind: 'nonsense' }).reason, 'unstructured');
});

console.log('\njudge note plan — one note per judge pass');

test('a retraction and another planted issue in the SAME turn: the note carries BOTH', () => {
  // CHANGED (review 2026-10-04): this pinned "retraction claims win and
  // travel alone" — the wrong-maths claim of the same turn was dropped.
  const plan = planJudgeNote([
    { claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) },
    { claim: DENIAL, decision: d(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }) },
  ]);
  assert.deepEqual(plan, { claims: [DENIAL], mode: 'retraction', otherClaims: [MATH] });
  const note = buildJudgeCorrectionNote(plan!.claims, '5', { mode: plan!.mode, otherClaims: plan!.otherClaims, scriptless: false }) ?? '';
  assert.match(note, /^\[correction note — not from the student\]/);
  assert.ok(note.includes(`"${DENIAL}"`), 'the denial');
  assert.ok(note.includes(`"${MATH}"`), 'the other claim');
  assert.ok(note.indexOf(DENIAL) < note.indexOf(MATH), 'retraction text first, then the other claims');
  assert.match(note, /you were right/i);
  assert.match(note, /correct your own (?:earlier )?statement plainly/i);
  assert.match(note, /NEVER narrate/);
  assert.equal(note.includes('\n'), false);
});
test('a retraction alone is unchanged', () => {
  const plan = planJudgeNote([{ claim: DENIAL, decision: d(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }) }]);
  assert.deepEqual(plan, { claims: [DENIAL], mode: 'retraction' });
  assert.equal(
    buildJudgeCorrectionNote(plan!.claims, '5', { mode: 'retraction', otherClaims: plan!.otherClaims }),
    buildJudgeCorrectionNote([DENIAL], '5', { mode: 'retraction' }),
  );
});
test('an unverified denial (legacy wording) and a neutral issue: legacy text for the denial, the neutral claim APPENDED', () => {
  // CHANGED (second review pass 2026-10-04): this pinned one legacy note over
  // both claims, which applied "you were right… / The answer you graded was…"
  // to the tutor's own maths statement.
  const plan = planJudgeNote([
    { claim: DENIAL, decision: d(DENIAL, { issueKind: 'other', studentAnswerVerdict: 'unsure' }) },
    { claim: MATH, decision: d(MATH, { issueKind: 'wrong_math', studentAnswerVerdict: 'unsure' }) },
  ]);
  assert.deepEqual(plan, { claims: [DENIAL], mode: 'legacy', otherClaims: [MATH] });
  const note = buildPlannedJudgeNote(plan, '5', { guardAttribution: true, scriptless: false }) ?? '';
  const legacyAlone = buildJudgeCorrectionNote([DENIAL], '5', { mode: 'legacy', guardAttribution: true }) ?? '';
  assert.ok(note.startsWith(legacyAlone), 'the legacy text for the denial, unchanged');
  const tail = note.slice(legacyAlone.length);
  assert.ok(tail.includes(`"${MATH}"`), 'the neutral claim rides after it');
  assert.equal(legacyAlone.includes(MATH), false, 'and is not quoted inside the legacy sentence');
  assert.match(tail, /correct your own statement plainly/i);
  assert.match(tail, /not something the student was right about/i);
  assert.equal(note.includes('\n'), false);
});
test('buildPlannedJudgeNote: every other plan is exactly buildJudgeCorrectionNote', () => {
  const retraction = planJudgeNote([
    { claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) },
    { claim: DENIAL, decision: d(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }) },
  ]);
  assert.equal(
    buildPlannedJudgeNote(retraction, '5', { guardAttribution: true, scriptless: false }),
    buildJudgeCorrectionNote([DENIAL], '5', { mode: 'retraction', otherClaims: [MATH], guardAttribution: true, scriptless: false }),
  );
  const legacy = planJudgeNote([{ claim: DENIAL, decision: d(DENIAL, {}) }, { claim: MATH, decision: d(MATH, {}) }]);
  assert.equal(buildPlannedJudgeNote(legacy, '5', { guardAttribution: false, scriptless: false }), buildJudgeCorrectionNote([DENIAL, MATH], '5'));
  const neutral = planJudgeNote([{ claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) }]);
  assert.equal(buildPlannedJudgeNote(neutral, '5', { guardAttribution: true, scriptless: false }), buildJudgeCorrectionNote([MATH], '5', { mode: 'neutral', guardAttribution: true, scriptless: false }));
  assert.equal(buildPlannedJudgeNote(null, '5'), null);
});
test('neutral only', () => {
  const plan = planJudgeNote([
    { claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) },
    { claim: DENIAL, decision: d(DENIAL, { issueKind: 'tone_or_wording', studentAnswerVerdict: 'incorrect' }) },
  ]);
  assert.deepEqual(plan, { claims: [MATH], mode: 'neutral' });
});
test('an unstructured (legacy) issue and a neutral one: the same split', () => {
  // CHANGED (second review pass 2026-10-04): was one legacy note over both.
  const plan = planJudgeNote([
    { claim: DENIAL, decision: d(DENIAL, {}) },
    { claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) },
  ]);
  assert.deepEqual(plan, { claims: [DENIAL], mode: 'legacy', otherClaims: [MATH] });
});
test('nothing to plant', () => {
  assert.equal(planJudgeNote([{ claim: DENIAL, decision: d(DENIAL, { issueKind: 'tone_or_wording' }) }]), null);
  assert.equal(planJudgeNote([]), null);
});

console.log('\nverified-key suppression — which flagged issues count as a denial');

test('a maths-bearing denial of an INCORRECT answer is still a flagged denial for the suppression (as at HEAD)', () => {
  // HEAD: denialFlagged = noteworthy.some(DENIAL_RE(claim)). Deriving it from
  // withholdCredit lost this case: the decision plants a NEUTRAL note and
  // withholds nothing, so the verified-key suppression never ran.
  const claim = 'Not quite — $3 \\cdot 4 = 13$.';
  const decision = d(claim, { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' });
  assert.deepEqual([decision.plantNote, decision.noteMode, decision.withholdCredit], [true, 'neutral', false]);
  assert.equal(isSuppressibleDenial({ claim, decision }), true);
});
test('exactly HEAD on unstructured responses: noteworthy AND DENIAL_RE', () => {
  for (const claim of [DENIAL, MATH, PROSE, 'Nope, $x = 3$.', "That doesn't work here.", 'Close, but $2x = 8$.', '']) {
    const decision = d(claim, {});
    assert.equal(isSuppressibleDenial({ claim, decision }), decision.plantNote && DENIAL_RE.test(claim), claim);
  }
});
test('every decision that withholds credit is suppressible; an issue that plants nothing never is', () => {
  const retraction = d("Hmm, let's look at that again — the answer is actually x.", { issueKind: 'false_denial', studentAnswerVerdict: 'correct' });
  assert.equal(retraction.withholdCredit, true);
  assert.equal(isSuppressibleDenial({ claim: 'x', decision: retraction }), true);
  const tone = d(DENIAL, { issueKind: 'tone_or_wording', studentAnswerVerdict: 'incorrect' });
  assert.equal(isSuppressibleDenial({ claim: DENIAL, decision: tone }), false);
  const math = d(MATH, { issueKind: 'wrong_math' });
  assert.equal(isSuppressibleDenial({ claim: MATH, decision: math }), false);
});

console.log('\njudge prompt ↔ decision module');

test('the judge prompt asks for both fields and names every value the decision reads', () => {
  assert.ok(JUDGE_SYSTEM_PROMPT.includes('"studentAnswerVerdict"'));
  assert.ok(JUDGE_SYSTEM_PROMPT.includes('"issueKind"'));
  for (const v of [...JUDGE_STUDENT_ANSWER_VERDICTS, ...JUDGE_ISSUE_KINDS]) {
    assert.ok(JUDGE_SYSTEM_PROMPT.includes(`"${v}"`), `prompt is missing "${v}"`);
  }
});
test('the prompt tells the judge that wording on a correct denial is tone_or_wording, never false_denial', () => {
  assert.match(JUDGE_SYSTEM_PROMPT, /"tone_or_wording" with studentAnswerVerdict "incorrect"/);
  assert.match(JUDGE_SYSTEM_PROMPT, /"false_denial" requires studentAnswerVerdict "correct"/);
});

console.log('\njudge issue decision — 2026-10-06b: an UNSURE judge plants nothing');

// The recorded judge outputs of portal-10beb4f5 (voice) and portal-2de3c6c8
// (text). In the voice session all four flags were on CORRECT statements.
const now = (claim: string, fields: Record<string, unknown>, severity: Sev = 'advisory', why?: string): JudgeIssueDecision =>
  decideJudgeIssue({ enabled: true, issue: { claim, ...fields, ...(why ? { why } : {}) }, severity });
test('LIVE voice @411.8: kind=other verdict=unsure on a correct statement → no note (was note:neutral)', () => {
  const claim = "the inequality says $y$ is *less than* that line's values, so the shaded region sits below the line, not above it.";
  const r = now(claim, { issueKind: 'other', studentAnswerVerdict: 'unsure' }, 'advisory',
    'The tutor states that for y < (1/3)x - 2/3, the shaded region is below the line. However, the whiteboard shows that the');
  assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'judge-unsure']);
  // The same issue under the previous table planted the neutral note.
  const before = d(claim, { issueKind: 'other', studentAnswerVerdict: 'unsure' });
  assert.deepEqual([before.plantNote, before.noteMode], [true, 'neutral']);
});
test('LIVE voice @452.7 / @474.7 / @696.1: kind=grounding verdict=not_an_answer → no note (unchanged)', () => {
  for (const claim of [
    'below the dashed line $y < -2x+4$',
    "it's the region that sits *below* the first dashed line, $y < -2x + 4$, *and also* below the second dashed line",
    'checking (0,-5) against both lines confirms it sits in the region below both dashed boundaries',
  ]) {
    const r = now(claim, { issueKind: 'grounding', studentAnswerVerdict: 'not_an_answer' });
    assert.deepEqual([r.plantNote, r.withholdCredit], [false, false], claim);
  }
});
test('unsure plants nothing for every kind and both severities', () => {
  for (const k of ['wrong_math', 'grounding', 'other', 'false_praise', 'false_denial', 'tone_or_wording', undefined]) {
    for (const sev of ['advisory', 'kill'] as const) {
      for (const claim of [MATH, PROSE, "That doesn't work here. Plug it in."]) {
        const r = now(claim, { studentAnswerVerdict: 'unsure', ...(k ? { issueKind: k } : {}) }, sev);
        assert.deepEqual([r.plantNote, r.withholdCredit], [false, false], `${k}/${sev}/${claim}`);
      }
    }
  }
});
test('the ONE case kept: a DENIAL_RE denial with an unsure verdict still gets the legacy re-check', () => {
  assert.equal(DENIAL_RE.test(DENIAL), true);
  for (const k of ['other', 'grounding', 'wrong_math', 'false_denial', undefined]) {
    const r = now(DENIAL, { studentAnswerVerdict: 'unsure', ...(k ? { issueKind: k } : {}) });
    assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'legacy', true, 'denial-unverified'], String(k));
  }
});
test('verdicts other than unsure are untouched by the new row', () => {
  const r = now(MATH, { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' });
  assert.deepEqual([r.plantNote, r.noteMode], [true, 'neutral']);
  const missing = now(MATH, { issueKind: 'wrong_math' });
  assert.deepEqual([missing.plantNote, missing.noteMode], [true, 'neutral']);
  const retract = now(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' });
  assert.deepEqual([retract.plantNote, retract.noteMode, retract.withholdCredit], [true, 'retraction', true]);
});

console.log('\njudge issue decision — 2026-10-08: a retraction needs an answer that was actually denied');

// portal-09624999 @69.9 s. The student's message was a question and a request
// (pre-check: answers=neither); the tutor agreed with it ("Good catch —" was
// cut from the reply before display); the judge, shown the reply without its
// opener, returned kind=false_denial verdict=correct on the sentence that
// agreed. A retraction note was planted and the next turn opened "…and I
// shouldn't have pushed back on that".
const ANSWERED = { studentAnswered: true, affirmingOpenerCut: false };
const g = (claim: string, fields: Record<string, unknown>, turn?: { studentAnswered: boolean; affirmingOpenerCut: boolean }, severity: Sev = 'advisory'): JudgeIssueDecision =>
  decideJudgeIssue({ enabled: true, issue: { claim, ...fields }, severity, ...(turn ? { turn } : {}) });
const FD = { issueKind: 'false_denial', studentAnswerVerdict: 'correct' };
const AGREEING = 'That is actually the right way to find it.';

test('LIVE: the tutor agreed, the opener was cut, the student had asked a question → no note, nothing withheld', () => {
  const turn = readJudgeTurnContext({
    studentText: 'Should I not use the other one instead? Please show both separately.',
    precheck: { answers: 'neither', target: '', proposed: 'a request', verdict: 'cannot_determine', confidence: 'medium' },
    turnShape: null,
    cutOpener: 'Good catch',
  });
  assert.deepEqual(turn, { studentAnswered: false, affirmingOpenerCut: true });
  const r = g(AGREEING, FD, turn);
  assert.deepEqual([r.plantNote, r.withholdCredit], [false, false]);
  assert.equal(planJudgeNote([{ claim: AGREEING, decision: r }]), null);
});
test('the genuine case is kept: an answer, a denying claim, nothing cut → retraction note + credit withheld', () => {
  for (const turn of [ANSWERED, undefined]) {
    for (const sev of ['advisory', 'kill'] as const) {
      const r = g(DENIAL, FD, turn, sev);
      assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'retraction', true, 'false-denial'], `${JSON.stringify(turn)}/${sev}`);
    }
  }
  const sibling = g(DENIAL, { issueKind: 'other', studentAnswerVerdict: 'correct' }, ANSWERED);
  assert.deepEqual([sibling.plantNote, sibling.noteMode, sibling.withholdCredit, sibling.reason], [true, 'retraction', true, 'student-correct-denied']);
});
test('guard 1 — the student\'s turn was not an answer → nothing, with its reason', () => {
  for (const sev of ['advisory', 'kill'] as const) {
    const r = g(DENIAL, FD, { studentAnswered: false, affirmingOpenerCut: false }, sev);
    assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'student-turn-not-an-answer'], sev);
  }
  // The sibling row (verdict correct on a denying claim, any other kind) too.
  const sibling = g(DENIAL, { issueKind: 'other', studentAnswerVerdict: 'correct' }, { studentAnswered: false, affirmingOpenerCut: false });
  assert.deepEqual([sibling.plantNote, sibling.withholdCredit, sibling.reason], [false, false, 'student-turn-not-an-answer']);
});
test('guard 2 — the claim is not a denial → nothing, with its reason', () => {
  const r = g(AGREEING, FD, ANSWERED);
  assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'claim-not-a-denial']);
  // The widened denial forms the pacing read uses still count.
  assert.equal(g("That doesn't work here. Plug it in.", FD, ANSWERED).noteMode, 'retraction');
});
test('guard 3 — an affirming opener was cut from this turn → nothing, with its reason', () => {
  const r = g(DENIAL, FD, { studentAnswered: true, affirmingOpenerCut: true });
  assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'affirming-opener-cut']);
  const sibling = g(DENIAL, { issueKind: 'grounding', studentAnswerVerdict: 'correct' }, { studentAnswered: true, affirmingOpenerCut: true });
  assert.deepEqual([sibling.plantNote, sibling.withholdCredit, sibling.reason], [false, false, 'affirming-opener-cut']);
});
test('the guards touch only the retraction rows', () => {
  const nonAnswer = { studentAnswered: false, affirmingOpenerCut: true };
  // An unsettled denial keeps its legacy re-check; the tutor's own maths its neutral note.
  const recheck = g(DENIAL, { issueKind: 'false_denial' }, nonAnswer);
  assert.deepEqual([recheck.plantNote, recheck.noteMode, recheck.withholdCredit], [true, 'legacy', true]);
  const maths = g(MATH, { issueKind: 'wrong_math', studentAnswerVerdict: 'not_an_answer' }, nonAnswer);
  assert.deepEqual([maths.plantNote, maths.noteMode, maths.withholdCredit], [true, 'neutral', false]);
  assert.equal(g(DENIAL, { issueKind: 'false_denial', studentAnswerVerdict: 'incorrect' }, nonAnswer).reason, 'judge-self-contradiction');
});
test('switch off ⇒ the table before 2026-10-08, whatever the turn context says', () => {
  const r = decideJudgeIssue({ enabled: true, issue: { claim: AGREEING, ...FD }, severity: 'advisory', turn: { studentAnswered: false, affirmingOpenerCut: true }, falseDenialGuards: false });
  assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'retraction', true, 'false-denial']);
});
test('turn context: what counts as an answer, and as an affirming opener that was cut', () => {
  const p = (o: Record<string, unknown>) => ({ answers: 'open_question', target: '', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o }) as Parameters<typeof readJudgeTurnContext>[0]['precheck'];
  const ctx = (o: Partial<Parameters<typeof readJudgeTurnContext>[0]>) => readJudgeTurnContext({ studentText: 'zzz', precheck: null, turnShape: null, cutOpener: null, ...o });
  // Nothing known ⇒ as before: an answer, nothing cut.
  assert.deepEqual(ctx({}), { studentAnswered: true, affirmingOpenerCut: false });
  // The pre-check, when it informs, decides.
  assert.equal(ctx({ precheck: p({ answers: 'neither', verdict: 'cannot_determine' }) }).studentAnswered, false);
  assert.equal(ctx({ precheck: p({ answers: 'overall_problem' }) }).studentAnswered, true);
  assert.equal(ctx({ precheck: p({ answers: 'neither', confidence: 'low' }) }).studentAnswered, true, 'a low-confidence check says nothing');
  // Else the runtime's sorting of the message.
  const shape = (shape: string) => ({ shape, open: null, answerShaped: false }) as unknown as Parameters<typeof readJudgeTurnContext>[0]['turnShape'];
  for (const s of ['question', 'request', 'no_answer']) assert.equal(ctx({ turnShape: shape(s) }).studentAnswered, false, s);
  assert.equal(ctx({ turnShape: { shape: 'answer', open: null, answerShaped: true } as unknown as Parameters<typeof readJudgeTurnContext>[0]['turnShape'] }).studentAnswered, true);
  // A check that found an answer outranks the sorting.
  assert.equal(ctx({ precheck: p({}), turnShape: shape('question') }).studentAnswered, true);
  // No student words at all (a runtime turn).
  for (const t of ['', '   ', '[start lesson]']) assert.equal(ctx({ studentText: t }).studentAnswered, false, JSON.stringify(t));
  // Cut openers: affirming ones count, denying ones do not.
  for (const o of ['Good catch', 'Right', 'Exactly', 'Yes', "That's right", 'Nice work']) assert.equal(ctx({ cutOpener: o }).affirmingOpenerCut, true, o);
  for (const o of ['Not quite', 'No', 'Close', 'Almost', "That's not right", 'Good try', 'Incorrect', '', null]) assert.equal(ctx({ cutOpener: o }).affirmingOpenerCut, false, String(o));
});
test('the debug line names the new reasons', () => {
  const r = g(AGREEING, FD, { studentAnswered: false, affirmingOpenerCut: true });
  assert.equal(describeJudgeIssueDecision(r), 'kind=false_denial verdict=correct → no-note no-withhold (student-turn-not-an-answer)');
});
test('wiring: the orchestrator hands both judge branches the turn context, read after the opener backstop', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes("severity: 'advisory', turn: judgeTurnContext })"));
  assert.ok(vtr.includes("severity: 'kill', turn: judgeTurnContext })"));
  assert.ok(vtr.includes('cutOpener: openerBackstopCutPhrase'));
  assert.equal(vtr.split('openerBackstopCutPhrase ??= openerRead.opener').length - 1, 2, 'recorded for a dropped opener and for a cut one');
});

// ── 2026-10-09: a high-confidence pre-check and the tutor agree ─────────────
// Local end-to-end run, scenario D. Pre-check incorrect/high → the tutor said
// the answer was not what the problem gives → the judge flagged that sentence
// and a note rode the student's next message. Then pre-check correct/high →
// the tutor confirmed → the judge flagged the confirmation.
console.log('\n2026-10-09 — pre-check agrees with the tutor');
type Ctx = NonNullable<Parameters<typeof decideJudgeIssue>[0]['turn']>;
const PC = (verdict: string, o: Record<string, unknown> = {}) =>
  ({ answers: 'overall_problem', target: 'the final answer', proposed: 'x = 12', verdict, confidence: 'high', ...o }) as Parameters<typeof readJudgeTurnContext>[0]['precheck'];
const D_STUDENT_1 = 'I solved it and my final answer is x = 12.';
const D_REPLY_1 = "That's not quite what the equation gives for $x$. What do you get when you add 9 to both sides first?";
const D_CLAIM_1 = "That's not quite what the equation gives for $x$.";
const D_REPLY_2 = "$x = 17$ is correct. That's the final answer for problem 1 — nice work.";
const D_CLAIM_2 = '$x = 17$ is correct.';
const deniedTurn = (): Ctx => readJudgeTurnContext({ studentText: D_STUDENT_1, precheck: PC('incorrect'), turnShape: null, cutOpener: null, replyText: D_REPLY_1 });
// On the second turn the transcript carried the planted note in front of the
// student's words, and "Right," had been cut from the reply.
const affirmedTurn = (): Ctx => readJudgeTurnContext({
  studentText: '[correction note — not from the student] An automated review flagged a statement…\n\nx = 17',
  studentWords: 'x = 17', precheck: PC('correct', { proposed: 'x = 17' }), turnShape: null, cutOpener: 'Right', replyText: D_REPLY_2,
});
const pd = (claim: string, fields: Record<string, unknown>, turn: Ctx, severity: Sev = 'advisory', why?: string) =>
  decideJudgeIssue({ enabled: true, issue: { claim, ...fields, ...(why ? { why } : {}) }, severity, turn });
const KINDS = ['false_denial', 'false_praise', 'wrong_math', 'tone_or_wording', 'grounding', 'other', undefined];
const VERDICTS = ['correct', 'incorrect', 'unsure', 'not_an_answer', undefined];

test('turn context: a deciding pre-check + the reply ⇒ the verdict, the tutor\'s stance, the student\'s values', () => {
  assert.deepEqual(deniedTurn(), { studentAnswered: true, affirmingOpenerCut: false, precheckVerdict: 'incorrect', tutorStance: 'denied', studentValues: `${D_STUDENT_1} x = 12` });
  const a = affirmedTurn();
  assert.deepEqual([a.precheckVerdict, a.tutorStance, a.studentValues], ['correct', 'affirmed', 'x = 17 x = 17']);
  // Without the reply (older callers) the context is exactly what it was.
  assert.deepEqual(readJudgeTurnContext({ studentText: D_STUDENT_1, precheck: PC('incorrect'), turnShape: null, cutOpener: null }), { studentAnswered: true, affirmingOpenerCut: false });
  // Only a HIGH-confidence correct / incorrect on the question or the problem.
  for (const o of [{ confidence: 'medium' }, { confidence: 'low' }, { verdict: 'partly_correct' }, { verdict: 'cannot_determine' }, { answers: 'other_part' }, { answers: 'neither' }]) {
    const c = readJudgeTurnContext({ studentText: D_STUDENT_1, precheck: PC('incorrect', o), turnShape: null, cutOpener: null, replyText: D_REPLY_1 });
    assert.equal(c.precheckVerdict, undefined, JSON.stringify(o));
  }
});
test('tutor stance: denied / affirmed / neither', () => {
  assert.equal(readTutorStance(D_REPLY_1, D_STUDENT_1), 'denied');
  assert.equal(readTutorStance(D_REPLY_2, 'x = 17'), 'affirmed');
  assert.equal(readTutorStance('That matches what you wrote.', 'x = 17'), 'affirmed');
  assert.equal(readTutorStance('What do you get when you add 9 to both sides?', 'x = 12'), null);
  assert.equal(readTutorStance('What would you try first?', 'x = 12', { affirmingCut: true }), 'affirmed');
  assert.equal(readTutorStance('What would you try first?', 'x = 12', { denyingCut: true }), 'denied');
  assert.equal(readTutorStance('', ''), null);
  for (const c of [D_CLAIM_2, 'Exactly.', "Yes, that's right.", 'That is exactly right.']) assert.equal(isAffirmingClaim(c), true, c);
  for (const c of [D_CLAIM_1, 'Not quite.', 'That is not correct.', 'Is that correct?', 'The point is right of the line.', MATH, '']) assert.equal(isAffirmingClaim(c), false, c);
});
test('LIVE row 1: pre-check incorrect/high, the tutor denied, the judge flags the denial → nothing, whatever kind and verdict it gives', () => {
  for (const k of KINDS) for (const v of VERDICTS) {
    if (k === 'false_praise') continue;
    for (const sev of ['advisory', 'kill'] as const) {
      const r = pd(D_CLAIM_1, { issueKind: k, studentAnswerVerdict: v }, deniedTurn(), sev);
      if (!k && !v) { assert.equal(r.reason, 'precheck-agrees-with-tutor', 'a response with neither field too'); }
      assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'precheck-agrees-with-tutor'], `${k}/${v}/${sev}`);
      assert.equal(planJudgeNote([{ claim: D_CLAIM_1, decision: r }]), null);
    }
  }
});
test('row 1, the named shape: kind false_denial on a turn the pre-check calls incorrect → nothing, even on a claim that is not a denial', () => {
  const r = pd('The equation gives a different value there.', { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, deniedTurn());
  assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'precheck-agrees-with-tutor']);
});
test('LIVE row 2: pre-check correct/high, the tutor affirmed, the judge flags the confirmation → nothing', () => {
  for (const k of KINDS) for (const v of VERDICTS) {
    if (k === 'false_denial') continue;
    for (const sev of ['advisory', 'kill'] as const) {
      const r = pd(D_CLAIM_2, { issueKind: k, studentAnswerVerdict: v }, affirmedTurn(), sev);
      assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'precheck-agrees-with-tutor'], `${k}/${v}/${sev}`);
    }
  }
});
test('row 2, the named shape: kind false_praise on a turn the pre-check calls correct → nothing, whatever the claim', () => {
  const r = pd('So $x = 17$ after dividing by 4.', { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' }, affirmedTurn(), 'kill');
  assert.deepEqual([r.plantNote, r.withholdCredit, r.reason], [false, false, 'precheck-agrees-with-tutor']);
});
test('GENUINE corrections are kept: the pre-check DISAGREES with the tutor', () => {
  // Checked correct, the tutor denied — the retraction this table exists for.
  const falseDenial = readJudgeTurnContext({ studentText: 'x = 17', precheck: PC('correct', { proposed: 'x = 17' }), turnShape: null, cutOpener: null, replyText: 'Not quite. Try adding 9 first.' });
  assert.equal(falseDenial.tutorStance, 'denied');
  const r1 = pd('Not quite.', { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, falseDenial);
  assert.deepEqual([r1.plantNote, r1.noteMode, r1.withholdCredit, r1.reason], [true, 'retraction', true, 'false-denial']);
  // Checked incorrect, the tutor affirmed — the false-praise note.
  const falsePraise = readJudgeTurnContext({ studentText: 'x = 12', precheck: PC('incorrect'), turnShape: null, cutOpener: null, replyText: 'Exactly, $x = 12$ is right. What comes next?' });
  assert.equal(falsePraise.tutorStance, 'affirmed');
  const r2 = pd('Exactly, $x = 12$ is right.', { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' }, falsePraise);
  assert.deepEqual([r2.plantNote, r2.noteMode, r2.reason], [true, 'false_praise', 'false-praise']);
});
test('GENUINE corrections are kept: the tutor\'s own maths inside an agreed turn', () => {
  // A statement carrying a value the student did not write is the tutor's own.
  assert.equal(claimStatesOwnValue(MATH, D_STUDENT_1), true);
  assert.equal(claimStatesOwnValue(D_CLAIM_1, D_STUDENT_1), false);
  assert.equal(claimStatesOwnValue(D_CLAIM_2, 'x = 17'), false);
  const own = pd(MATH, { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' }, deniedTurn());
  assert.deepEqual([own.plantNote, own.noteMode, own.withholdCredit, own.reason], [true, 'neutral', false, 'own-statement']);
  // A denial that goes on to state a value of its own keeps its row.
  const mixed = pd('Not quite — adding 9 gives $4x = 70$.', { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' }, deniedTurn());
  assert.deepEqual([mixed.plantNote, mixed.noteMode, mixed.reason], [true, 'neutral', 'own-statement']);
  // An affirmation that goes on to state a value of its own keeps its row.
  const mixedAffirm = pd('Right, and that makes $4x = 70$.', { issueKind: 'wrong_math', studentAnswerVerdict: 'correct' }, affirmedTurn());
  assert.deepEqual([mixedAffirm.plantNote, mixedAffirm.noteMode, mixedAffirm.reason], [true, 'neutral', 'own-statement']);
  // false_praise on a DENIED turn / false_denial on an AFFIRMED one: not this row.
  assert.notEqual(pd(D_CLAIM_1, { issueKind: 'false_praise', studentAnswerVerdict: 'incorrect' }, deniedTurn()).reason, 'precheck-agrees-with-tutor');
  assert.notEqual(pd(D_CLAIM_2, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, affirmedTurn()).reason, 'precheck-agrees-with-tutor');
});
test('no agreement, no row: the tutor said neither, or the check did not decide', () => {
  const noStance: Ctx = { studentAnswered: true, affirmingOpenerCut: false, precheckVerdict: 'incorrect', tutorStance: null, studentValues: 'x = 12' };
  const r = pd(D_CLAIM_1, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, noStance);
  assert.deepEqual([r.plantNote, r.noteMode, r.reason], [true, 'retraction', 'false-denial']);
  const medium = readJudgeTurnContext({ studentText: D_STUDENT_1, precheck: PC('incorrect', { confidence: 'medium' }), turnShape: null, cutOpener: null, replyText: D_REPLY_1 });
  assert.equal(pd(D_CLAIM_1, { issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, medium).reason, 'false-denial');
});
test('switch off ⇒ the table of 2026-10-08, whatever the pre-check says', () => {
  const r = decideJudgeIssue({ enabled: true, issue: { claim: D_CLAIM_1, issueKind: 'false_denial', studentAnswerVerdict: 'correct' }, severity: 'advisory', turn: deniedTurn(), precheckAgreesGuard: false });
  assert.deepEqual([r.plantNote, r.noteMode, r.withholdCredit, r.reason], [true, 'retraction', true, 'false-denial']);
  const r2 = decideJudgeIssue({ enabled: true, issue: { claim: D_CLAIM_2, issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' }, severity: 'advisory', turn: affirmedTurn(), precheckAgreesGuard: false });
  assert.deepEqual([r2.plantNote, r2.noteMode, r2.reason], [true, 'neutral', 'own-statement']);
  // TUTOR_JUDGE_STRUCTURED_VERDICT off is still the claim-text rule alone.
  assert.equal(decideJudgeIssue({ enabled: false, issue: { claim: D_CLAIM_1 }, severity: 'advisory', turn: deniedTurn() }).reason, 'flag-off');
});
test('the advisory debug line says who agreed and what the judge claimed', () => {
  const r = pd(D_CLAIM_1, { issueKind: 'wrong_math', studentAnswerVerdict: 'incorrect' }, deniedTurn());
  assert.equal(describeJudgeIssueDecision(r), 'kind=wrong_math verdict=incorrect → no-note no-withhold (precheck-agrees-with-tutor)');
  assert.equal(describePrecheckDisagreement(deniedTurn(), r), 'pre-check incorrect/high · tutor denied · judge kind=wrong_math verdict=incorrect — judge not acted on');
});
test('the judge is given the check: one line, only when it decides, and its own block', () => {
  assert.equal(formatJudgeAnswerCheck(PC('incorrect')), 'The student proposed: "x = 12". Checked independently against the problem: INCORRECT (high confidence).');
  assert.ok(formatJudgeAnswerCheck(PC('correct')).endsWith('CORRECT (high confidence).'));
  for (const o of [{ confidence: 'medium' }, { verdict: 'partly_correct' }, { answers: 'neither' }, { answers: 'other_part' }]) assert.equal(formatJudgeAnswerCheck(PC('incorrect', o)), '', JSON.stringify(o));
  assert.equal(formatJudgeAnswerCheck(null), '');
  assert.equal(formatJudgeAnswerCheck(PC('incorrect'), { enabled: false }), '');
  assert.ok(!formatJudgeAnswerCheck(PC('incorrect', { proposed: 'a <b> "c"' })).includes('<'));
  const base = { boardSummary: 'b', spokenText: 's' };
  const withCheck = buildJudgeUserContent({ ...base, answerCheck: formatJudgeAnswerCheck(PC('incorrect')) });
  assert.ok(withCheck.includes('<answer_check>\nThe student proposed: "x = 12".'));
  assert.ok(withCheck.includes('</answer_check>'));
  // Absent ⇒ the request is byte-identical to before, and the cached system prompt never changes.
  assert.ok(!buildJudgeUserContent(base).includes('answer_check'));
  assert.ok(!JUDGE_SYSTEM_PROMPT.includes('answer_check'));
});
test('wiring: the orchestrator hands the reply to the context, records the disagreement, and sends the check to the judge', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes('replyText: attemptText,'));
  assert.ok(vtr.includes('studentWords: ledgerStudentTextRef.current,'));
  assert.equal(vtr.split("onDebugEvent?.('judge_precheck_disagreement'").length - 1, 2, 'advisory and kill-class');
  assert.ok(vtr.includes('...(judgeAnswerCheck ? { answerCheck: judgeAnswerCheck } : {})'));
  const flags = readFileSync(join(__dirname, '..', 'src/lib/tutor/orchestrator/turn-round-flags.ts'), 'utf8');
  assert.ok(flags.includes("process.env.NEXT_PUBLIC_TUTOR_JUDGE_PRECHECK_AGREES_GUARD !== 'off'"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
