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
import {
  decideJudgeIssue,
  planJudgeNote,
  buildPlannedJudgeNote,
  isSuppressibleDenial,
  readJudgeIssueFields,
  JUDGE_STUDENT_ANSWER_VERDICTS,
  JUDGE_ISSUE_KINDS,
  type JudgeIssueDecision,
} from '../src/lib/tutor/voice/judge-issue-decision';
import { JUDGE_SYSTEM_PROMPT } from '../src/lib/tutor/judge-prompt';
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
  decideJudgeIssue({ enabled, issue: { claim, ...fields }, severity });

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
test('false_denial is honoured even when the quoted claim does not open with a denial', () => {
  const r = d("Hmm, let's look at that again — the answer is actually x.", { issueKind: 'false_denial', studentAnswerVerdict: 'correct' });
  assert.equal(r.noteMode, 'retraction');
  assert.equal(r.withholdCredit, true);
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
  const note = buildJudgeCorrectionNote(plan!.claims, '5', { mode: plan!.mode, otherClaims: plan!.otherClaims }) ?? '';
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
  const note = buildPlannedJudgeNote(plan, '5', { guardAttribution: true }) ?? '';
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
    buildPlannedJudgeNote(retraction, '5', { guardAttribution: true }),
    buildJudgeCorrectionNote([DENIAL], '5', { mode: 'retraction', otherClaims: [MATH], guardAttribution: true }),
  );
  const legacy = planJudgeNote([{ claim: DENIAL, decision: d(DENIAL, {}) }, { claim: MATH, decision: d(MATH, {}) }]);
  assert.equal(buildPlannedJudgeNote(legacy, '5', { guardAttribution: false }), buildJudgeCorrectionNote([DENIAL, MATH], '5'));
  const neutral = planJudgeNote([{ claim: MATH, decision: d(MATH, { issueKind: 'wrong_math' }) }]);
  assert.equal(buildPlannedJudgeNote(neutral, '5', { guardAttribution: true }), buildJudgeCorrectionNote([MATH], '5', { mode: 'neutral', guardAttribution: true }));
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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
