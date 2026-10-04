/**
 * Unit tests for the try-yourself MCQ verdict seam (Task X9).
 *
 * Regression 2026-07: AP Gov MCQ — student picked "Concurrent (both
 * share it)" (the flagged-correct option), the row showed the ✓
 * affordance, but the card printed "Not quite. Expected: Concurrent"
 * and the tutor said "close". Root cause: the verdict compared the
 * submitted CHOICE ID against the free-text `expectedAnswer` string
 * instead of resolving correctness by OPTION IDENTITY
 * (`choices[].correct`, mirroring QuizRenderer.gradeItem).
 *
 * Run: npx tsx scripts/test-tryyourself-mcq-verdict.ts
 */
import {
  resolveMcqCorrectChoice,
  computeTryYourselfVerdict,
  matchesAnswerStrict,
  gradeTryYourself,
  buildTryYourselfMarker,
  type Choice,
} from '../src/app/tutor/components/whiteboard/tryYourselfAnswer';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// The AP Gov repro choice set: flagged correctness lives on the choice,
// expectedAnswer is a bare, separately-authored string.
const apGovChoices: Choice[] = [
  { id: 'A', text: 'Reserved (states only)', correct: false },
  { id: 'B', text: 'Concurrent (both share it)', correct: true },
  { id: 'C', text: 'Enumerated (federal only)', correct: false },
  { id: 'D', text: 'Implied (neither explicitly)', correct: false },
];
const apGovExpected = 'Concurrent';

console.log('\n=== Bug repro: correct pick, label ≠ bare expectedAnswer ===');
{
  const verdict = computeTryYourselfVerdict('B', apGovExpected, 'mcq', apGovChoices);
  check('picking the flagged-correct option (by id) is TRUE', verdict === true, String(verdict));
}
{
  const resolved = resolveMcqCorrectChoice(apGovChoices, apGovExpected);
  check('resolveMcqCorrectChoice finds the flagged choice regardless of expectedAnswer text', resolved?.id === 'B', JSON.stringify(resolved));
}

console.log('\n=== Genuinely wrong option still reads wrong ===');
{
  const verdict = computeTryYourselfVerdict('A', apGovExpected, 'mcq', apGovChoices);
  check('picking a real wrong option is FALSE', verdict === false, String(verdict));
}
{
  const verdict = computeTryYourselfVerdict('D', apGovExpected, 'mcq', apGovChoices);
  check('picking another wrong option is FALSE', verdict === false, String(verdict));
}

console.log('\n=== No correct flags — fall back to label vs expectedAnswer, tolerant of parenthetical ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Reserved (states only)' },
    { id: 'B', text: 'Concurrent (both share it)' },
    { id: 'C', text: 'Enumerated (federal only)' },
  ];
  const verdictRight = computeTryYourselfVerdict('B', 'Concurrent', 'mcq', choices);
  check('unflagged: label-contains-expected picked as correct', verdictRight === true, String(verdictRight));
  const verdictWrong = computeTryYourselfVerdict('A', 'Concurrent', 'mcq', choices);
  check('unflagged: a different unrelated option is FALSE', verdictWrong === false, String(verdictWrong));
}
{
  // expected is the SUPERSET, label is the bare word — expected-contains-label direction.
  const choices: Choice[] = [
    { id: 'A', text: 'Concurrent' },
    { id: 'B', text: 'Reserved' },
  ];
  const verdict = computeTryYourselfVerdict('A', 'Concurrent (both federal and state share it)', 'mcq', choices);
  check('unflagged: expected-contains-label direction also resolves correct', verdict === true, String(verdict));
}

console.log('\n=== C1 regression: negated distractor textually contains the expected answer ===');
{
  // Reviewer-reported false positive: a NEGATED distractor ("Not a
  // concurrent power") textually CONTAINS the expected answer
  // ("Concurrent power") and, being earlier in the array, must not beat
  // the true exact match later in the array.
  const choices: Choice[] = [
    { id: 'A', text: 'Not a concurrent power' },
    { id: 'B', text: 'Concurrent power' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Concurrent power');
  check('exact match (B) wins over an earlier negated-containment candidate (A)', resolved?.id === 'B', JSON.stringify(resolved));
  const verdictB = computeTryYourselfVerdict('B', 'Concurrent power', 'mcq', choices);
  check('picking the true exact match (B) is TRUE', verdictB === true, String(verdictB));
  const verdictA = computeTryYourselfVerdict('A', 'Concurrent power', 'mcq', choices);
  check('picking the negated distractor (A) is FALSE, not a false positive', verdictA === false, String(verdictA));
}
{
  // No exact match anywhere — the only containment candidate is negated
  // relative to an expected answer that itself carries no negation. Must
  // NOT be treated as a match; correctness is undecidable (null), not a
  // false "wrong" and not a false "correct".
  const choices: Choice[] = [
    { id: 'A', text: 'Not a concurrent power' },
    { id: 'B', text: 'Judicial review' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Concurrent power');
  check('negated-only containment candidate is excluded when expected has no negation', resolved === undefined, JSON.stringify(resolved));
}
{
  // Negation on BOTH sides: the expected answer itself is a negation
  // ("Not applicable") and a choice is its own exact match — must still
  // resolve via the exact-match pass, unaffected by negation exclusion.
  const choices: Choice[] = [
    { id: 'A', text: 'Not applicable' },
    { id: 'B', text: 'Applicable' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Not applicable');
  check('negation-both-sides: exact match on the negated expected answer still resolves', resolved?.id === 'A', JSON.stringify(resolved));
}

console.log('\n=== Case / whitespace variants ===');
{
  const choices: Choice[] = [
    { id: 'A', text: '  CONCURRENT   (both share it)  ', correct: true },
    { id: 'B', text: 'Reserved', correct: false },
  ];
  const verdict = computeTryYourselfVerdict('A', '  concurrent  ', 'mcq', choices);
  check('case/whitespace-insensitive on both the flag path', verdict === true, String(verdict));
}
{
  const choices: Choice[] = [
    { id: 'A', text: '  CONCURRENT   (both share it)  ' },
    { id: 'B', text: 'Reserved' },
  ];
  const verdict = computeTryYourselfVerdict('A', '  Concurrent  ', 'mcq', choices);
  check('case/whitespace-insensitive on the label-fallback path', verdict === true, String(verdict));
}

console.log('\n=== No signal at all — honest null, not a false "wrong" ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Judicial review' },
    { id: 'B', text: 'Executive privilege' },
  ];
  const verdict = computeTryYourselfVerdict('A', 'Concurrent powers', 'mcq', choices);
  check('no flags + no label overlap defers to the brain (null), does not assert wrong', verdict === null, String(verdict));
}
{
  const verdict = computeTryYourselfVerdict('A', undefined, 'mcq', [{ id: 'A', text: 'x' }, { id: 'B', text: 'y' }]);
  check('no expectedAnswer + no flags defers to the brain (null)', verdict === null, String(verdict));
}

console.log('\n=== No choices array at all — falls back to legacy id/text vs expectedAnswer ===');
{
  const verdict = computeTryYourselfVerdict('42', '42', 'mcq', undefined);
  check('bare mcq compare still works when there are no choices to resolve identity from', verdict === true, String(verdict));
}

console.log('\n=== Exact match (no parenthetical involved) ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Concurrent', correct: true },
    { id: 'B', text: 'Reserved', correct: false },
  ];
  check('exact label match, flagged', computeTryYourselfVerdict('A', 'Concurrent', 'mcq', choices) === true);
}

console.log('\n=== Free-response (frq) behavior is UNTOUCHED by the mcq fix ===');
{
  // The 2026-04-29 pre-calc case from the original comment: algebraically
  // equivalent but textually different — must stay undecidable (null),
  // never a false "wrong".
  const verdict = matchesAnswerStrict(
    'sin 225=cos 225 = - 1/ root 2, quadrant 3, ref angle 45 deg',
    'sin 225° = −√2/2, cos 225° = −√2/2; Q3; reference angle 45°',
    'frq',
  );
  check('frq algebraically-equivalent-but-different-text stays null (undecidable)', verdict === null, String(verdict));
}
{
  check('frq exact match (after normalization) is true', matchesAnswerStrict('Paris', ' paris ', 'frq') === true);
}
{
  // computeTryYourselfVerdict for frq must behave identically to calling
  // matchesAnswerStrict directly — the mcq branch must not leak in.
  const a = computeTryYourselfVerdict('Paris', 'paris', 'frq');
  const b = matchesAnswerStrict('Paris', 'paris', 'frq');
  check('computeTryYourselfVerdict(frq) matches matchesAnswerStrict(frq) directly', a === b && a === true);
}

console.log('\n=== Numeric behavior is UNTOUCHED ===');
{
  check('numeric "024" matches "24"', computeTryYourselfVerdict('024', '24', 'numeric') === true);
  check('numeric "0.5" matches "1/2"', computeTryYourselfVerdict('0.5', '1/2', 'numeric') === true);
  check('numeric mismatch is false', computeTryYourselfVerdict('3', '4', 'numeric') === false);
}

// Pure-solve statements whose solution really is the key used with them.
const PURE = { problemText: 'Solve: $-9 \\le 2x + 5 < 15$' };          // ⇔ -7 ≤ x < 5
const CARD = { problemText: 'Solve the inequality: $2x + 3 < 13$' };   // ⇔ x < 5

console.log('\n=== Typed inequality answers are graded exactly (2026-10-03) ===');
{
  // Production: typed "-7<x<8" vs expected "-7 <= x < 5" was undecidable on
  // the card and then praised by the tutor.
  // 2026-10-04: "wrong" needs positive evidence of a pure real-number solve —
  // a statement that extracts to one relation equivalent to the key.
  const wrong = gradeTryYourself('-7<x<8', '-7 <= x < 5', 'frq', undefined, PURE);
  check('wrong inequality → verdict false', wrong.verdict === false, String(wrong.verdict));
  const noStmt = gradeTryYourself('-7<x<8', '-7 <= x < 5', 'frq');
  check('differing inequality with NO statement → null, key not shown', noStmt.verdict === null && noStmt.revealExpected === false, JSON.stringify(noStmt));
  check('wrong inequality → witness exposed', !!wrong.relation?.witness && wrong.relation.witness.variable === 'x', JSON.stringify(wrong.relation));
  check('wrong inequality → the card must NOT reveal the expected answer', wrong.revealExpected === false);
  const right = gradeTryYourself('5 > x \\ge -7', '-7 \\le x < 5', 'frq');
  check('equivalent inequality in another form → true', right.verdict === true && right.relation?.matches === true);
  check('unicode vs LaTeX → true', gradeTryYourself('x ≤ 6', 'x \\le 6', 'frq').verdict === true);
  check('format omitted behaves as frq', gradeTryYourself('x > 6', 'x < 6', undefined, undefined, { problemText: 'Solve: $3x < 18$' }).verdict === false);
  const prose = gradeTryYourself('between negative seven and five', '-7 <= x < 5', 'frq');
  check('unparseable submission → null as today', prose.verdict === null && prose.relation === undefined && prose.revealExpected === false);
  check('string-equal inequality is still true', gradeTryYourself('x < 5', 'x < 5', 'frq').verdict === true);
  check('domain-restricted problem → null (not graded)',
    gradeTryYourself('x < 3.5', 'x \\le 3', 'frq', undefined, { problemText: 'x is a positive integer. Solve 2x < 7.' }).verdict === null);

  // matchesAnswerStrict / computeTryYourselfVerdict: relation grading is an
  // explicit opt-in at this layer (the card calls the 4-argument form and
  // prints "Expected: …" on false — see the module comment).
  check('matchesAnswerStrict(frq) without the option: null as before', matchesAnswerStrict('-7<x<8', '-7 <= x < 5', 'frq') === null);
  check('matchesAnswerStrict(frq, relationGrading) differs → false', matchesAnswerStrict('-7<x<8', '-7 <= x < 5', 'frq', { relationGrading: true, ...PURE }) === false);
  check('matchesAnswerStrict(frq, relationGrading) equivalent → true', matchesAnswerStrict('5 > x \\ge -7', '-7 \\le x < 5', 'frq', { relationGrading: true }) === true);
  check('matchesAnswerStrict(frq, relationGrading) unparseable → null', matchesAnswerStrict('between negative seven and five', '-7 <= x < 5', 'frq', { relationGrading: true }) === null);
  check('computeTryYourselfVerdict 4-arg form unchanged for an inequality', computeTryYourselfVerdict('-7<x<8', '-7 <= x < 5', 'frq') === null);
  check('computeTryYourselfVerdict with the option → false', computeTryYourselfVerdict('-7<x<8', '-7 <= x < 5', 'frq', undefined, { relationGrading: true, ...PURE }) === false);

  // kill switch
  const prev = process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING;
  process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING = 'off';
  check('flag off → null as before', gradeTryYourself('-7<x<8', '-7 <= x < 5', 'frq', undefined, PURE).verdict === null);
  {
    const off = gradeTryYourself('x<6', 'x < 5', 'numeric', undefined, CARD);
    check('flag off, numeric format: an inequality key is still never revealed or string-graded wrong',
      off.verdict === null && off.revealExpected === false, JSON.stringify(off));
  }
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING;
  else process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING = prev;

  // every other class is unchanged, and still reveals the key where it did
  const num = gradeTryYourself('3', '4', 'numeric');
  check('numeric mismatch: false AND still reveals expected', num.verdict === false && num.revealExpected === true && num.relation === undefined);
  check('numeric match unchanged', gradeTryYourself('0.5', '1/2', 'numeric').verdict === true);
  check('frq non-relation mismatch still null', gradeTryYourself('sin', 'sin(θ)', 'frq').verdict === null);
  const mcq = gradeTryYourself('A', apGovExpected, 'mcq', apGovChoices);
  check('mcq wrong pick: false AND still reveals expected', mcq.verdict === false && mcq.revealExpected === true);
  check('mcq right pick unchanged', gradeTryYourself('B', apGovExpected, 'mcq', apGovChoices).verdict === true);
}

console.log('\n=== Defect 1: only a SOLVED-FORM inequality is "Correct" (2026-10-04) ===');
{
  for (const sub of ['2x < 10', '2x + 3 < 13', '-x > -5', 'x < 2 + 3']) {
    const g = gradeTryYourself(sub, 'x < 5', 'frq', undefined, CARD);
    check(`equivalent but unsolved "${sub}" → null (tutor decides), no relation detail, key not shown`,
      g.verdict === null && g.relation === undefined && g.revealExpected === false, JSON.stringify(g));
    const m = buildTryYourselfMarker(sub, 'x < 5', g.verdict, g.relation);
    check(`"${sub}" marker says undecidable, never "matches"`, m.includes('undecidable') && !m.includes('Verdict: matches'), m);
  }
  for (const sub of ['x < 5', '5 > x', 'x<5', '$x < 5$']) {
    const g = gradeTryYourself(sub, 'x < 5', 'frq', undefined, CARD);
    check(`solved form "${sub}" → true`, g.verdict === true && g.revealExpected === false, JSON.stringify(g));
  }
  check('unsolved but WRONG "2x < 12" → false, key not shown',
    (() => { const g = gradeTryYourself('2x < 12', 'x < 5', 'frq', undefined, CARD); return g.verdict === false && g.revealExpected === false && !!g.relation?.witness; })());
  // an unsolved KEY grades nothing exactly; string-equal still counts
  const uk = gradeTryYourself('x < 5', '2x < 10', 'frq', undefined, { problemText: 'Solve: $2x < 10$' });
  check('unsolved key: solved submission → null', uk.verdict === null && uk.revealExpected === false, JSON.stringify(uk));
  check('unsolved key: string-equal submission → true (as before)', gradeTryYourself('2x < 10', '2x < 10', 'frq').verdict === true);
}

console.log('\n=== Defect 2: no "Not quite" without positive evidence (2026-10-04) ===');
{
  const implicit: Array<[string, string, string]> = [
    ['x > 3', 'x \\geq 4', 'A club needs more than 3 members. Write an inequality for the number of members x.'],
    ['x <= 3', 'x < 3.4', 'Tickets cost $5 and Sam has $17. Write an inequality for the number of tickets x he can buy.'],
    ['x ≤ 4', 'x < 5', 'Write an inequality for x, where x is a counting number less than 5.'],
  ];
  for (const [sub, key, stmt] of implicit) {
    for (const fmt of ['frq', 'numeric', 'mcq', undefined] as const) {
      const g = gradeTryYourself(sub, key, fmt, undefined, { problemText: stmt });
      check(`implicit-integer "${sub}" vs "${key}" (${fmt ?? 'no format'}) → null, no witness, key not shown`,
        g.verdict === null && g.relation === undefined && g.revealExpected === false, JSON.stringify(g));
    }
    const g = gradeTryYourself(sub, key, 'frq', undefined, { problemText: stmt });
    const m = buildTryYourselfMarker(sub, key, g.verdict, g.relation);
    check(`implicit-integer "${sub}": marker does not claim an exact verdict`, !/verdict is exact/.test(m) && !m.includes('does NOT match the expected'), m);
  }
  check('key not equivalent to the statement relation → null',
    gradeTryYourself('x < 3.5', 'x \\le 3', 'frq', undefined, { problemText: 'Solve 2x < 7.' }).verdict === null);
  check('statement is not a solve statement → null',
    gradeTryYourself('x < 6', 'x < 5', 'frq', undefined, { problemText: 'Maria wrote $2x < 10$ on the board.' }).verdict === null);
}

console.log('\n=== Defect 3: an inequality key is never revealed, whatever the format (2026-10-04) ===');
{
  for (const fmt of ['frq', 'numeric', 'mcq', undefined] as const) {
    const tag = fmt ?? 'no format';
    const wrong = gradeTryYourself('x<6', 'x < 5', fmt, undefined, CARD);
    check(`${tag}: wrong "x<6" vs "x < 5" → false via the relation path, key NOT shown`,
      wrong.verdict === false && wrong.revealExpected === false && !!wrong.relation?.witness, JSON.stringify(wrong));
    const noEv = gradeTryYourself('x<6', 'x < 5', fmt);
    check(`${tag}: same pair with no statement → null, key NOT shown`, noEv.verdict === null && noEv.revealExpected === false, JSON.stringify(noEv));
    const right = gradeTryYourself('x < 5', 'x<5', fmt, undefined, CARD);
    check(`${tag}: correct "x < 5" vs key "x<5" (spacing differs) → true`, right.verdict === true && right.relation?.matches === true, JSON.stringify(right));
    const lt = gradeTryYourself('x<6', 'x \\lt 5', fmt, undefined, CARD);
    check(`${tag}: key spelled "x \\lt 5" → false, key NOT shown`, lt.verdict === false && lt.revealExpected === false, JSON.stringify(lt));
    const ltRight = gradeTryYourself('5 > x', 'x \\lt 5', fmt);
    check(`${tag}: key spelled "x \\lt 5", correct answer → true`, ltRight.verdict === true, JSON.stringify(ltRight));
    const junk = gradeTryYourself('idk', 'x < 5', fmt, undefined, CARD);
    check(`${tag}: unreadable submission → null, key NOT shown`, junk.verdict === null && junk.revealExpected === false, JSON.stringify(junk));
    const union = gradeTryYourself('x < 3', 'x < 2 or x > 7', fmt);
    check(`${tag}: unsupported inequality key (union) → never false, key NOT shown`, union.verdict === null && union.revealExpected === false, JSON.stringify(union));
  }
  for (const key of ['x ≥ 4', 'x \\geq 4', 'x >= 4', 'x \\ge 4', 'x \\gt 3', 'x > 3', 'x ≤ 4', 'x \\leq 4', 'x <= 4', 'x \\le 4', 'x \\lt 5', 'x < 5']) {
    const g = gradeTryYourself('x = 99', key, 'numeric');
    check(`every comparator spelling is an inequality key: "${key}" never revealed`, g.revealExpected === false && g.verdict !== false, JSON.stringify(g));
  }
  // MCQ with choices: option identity decides, and a wrong OPTION PICK shows
  // the correct option as it always did — the owner's rule is about TYPED
  // inequality answers, and here the key is already on the card as a choice.
  const ineqChoices: Choice[] = [{ id: 'A', text: 'x < 5', correct: true }, { id: 'B', text: 'x \\le 5' }];
  const pickWrong = gradeTryYourself('B', 'x < 5', 'mcq', ineqChoices);
  check('mcq with choices + inequality key: wrong pick → false by option identity, correct option SHOWN',
    pickWrong.verdict === false && pickWrong.revealExpected === true && pickWrong.relation === undefined, JSON.stringify(pickWrong));
  const c2Choices: Choice[] = [{ id: 'c1', text: 'x < 5' }, { id: 'c2', text: 'x > 5' }, { id: 'c3', text: 'x \\le 5' }];
  const c2 = gradeTryYourself('c2', 'x < 5', 'mcq', c2Choices);
  check('mcq with choices, key matched by text: wrong pick "c2" → false, correct option SHOWN',
    c2.verdict === false && c2.revealExpected === true, JSON.stringify(c2));
  check('…same with the statement passed and with relation grading off',
    gradeTryYourself('c2', 'x < 5', 'mcq', c2Choices, CARD).revealExpected === true
      && gradeTryYourself('c2', 'x < 5', 'mcq', c2Choices, { relationGrading: false }).revealExpected === true);
  check('mcq with choices: right pick reveals nothing', (() => { const g = gradeTryYourself('c1', 'x < 5', 'mcq', c2Choices); return g.verdict === true && g.revealExpected === false; })());
  for (const [fmt, ch] of [['mcq', undefined], ['mcq', []], ['frq', c2Choices], ['numeric', undefined], [undefined, undefined]] as const) {
    const g = gradeTryYourself('x > 5', 'x < 5', fmt, ch as Choice[] | undefined, CARD);
    check(`typed wrong inequality (${fmt ?? 'no format'}${ch ? `, ${ch.length} choices` : ''}): key NOT shown`, g.verdict === false && g.revealExpected === false, JSON.stringify(g));
  }
  check('mcq with choices + inequality key: right pick → true', gradeTryYourself('A', 'x < 5', 'mcq', ineqChoices).verdict === true);
  // non-inequality keys: unchanged
  const eqn = gradeTryYourself('x = 4', 'x = 3', 'numeric');
  check('equation key (no ordering comparator) is NOT an inequality key: numeric path unchanged', eqn.verdict === false && eqn.revealExpected === true, JSON.stringify(eqn));
  const arrow = gradeTryYourself('b', 'a', 'mcq');
  check('mcq without choices, non-inequality key: unchanged', arrow.verdict === false && arrow.revealExpected === true, JSON.stringify(arrow));
}

console.log('\n=== The marker sent to the brain ===');
{
  // Byte-for-byte the text both call sites built before this change.
  const legacy = (answer: string, expected: string | undefined, isCorrect: boolean | null) => {
    const verdict =
      isCorrect === true ? 'matches the expected answer (string-equal)'
      : isCorrect === false ? 'does NOT match the expected answer'
      : '(undecidable by string match — judge equivalence yourself, accepting any algebraically-correct form)';
    return expected
      ? `[try-yourself submission. The student submitted: "${answer}". Expected: ${expected}. Verdict: ${verdict}. If "does NOT match", stay on this same try-yourself — give a hint, do NOT call new_page or show a different problem. If undecidable, judge algebraic equivalence yourself.]`
      : `[try-yourself submission. The student submitted: "${answer}". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]`;
  };
  for (const [a, e, c] of [['24', '24', true], ['3', '4', false], ['sin', 'sin(θ)', null], ['a', undefined, null]] as Array<[string, string | undefined, boolean | null]>) {
    check(`non-relation marker unchanged (${String(c)}, expected ${e ?? 'unset'})`, buildTryYourselfMarker(a, e, c) === legacy(a, e, c));
  }
  const wrong = gradeTryYourself('-7<x<8', '-7 <= x < 5', 'frq', undefined, PURE);
  const m = buildTryYourselfMarker('-7<x<8', '-7 <= x < 5', wrong.verdict, wrong.relation);
  const w = wrong.relation!.witness!;
  check('relation mismatch: same prefix other code keys on',
    m.startsWith('[try-yourself submission. The student submitted: "-7<x<8". Expected: -7 <= x < 5. Verdict: does NOT match the expected answer'), m);
  check('relation mismatch: states the check was exact', /checked exactly/.test(m));
  check('relation mismatch: carries the witness',
    m.includes(`at x = ${w.value} the student's answer holds and the expected answer does not`), m);
  check('relation mismatch: tells the brain not to hand over the key', /do NOT state the expected answer/.test(m));
  check('relation mismatch: keeps the stay-on-this-problem instruction', m.includes('stay on this same try-yourself'));
  check('relation mismatch: ends with the closing bracket', m.endsWith(']'));
  const right = gradeTryYourself('5 > x \\ge -7', '-7 \\le x < 5', 'frq');
  const mr = buildTryYourselfMarker('5 > x \\ge -7', '-7 \\le x < 5', right.verdict, right.relation);
  check('relation match: deterministic "matches", not "string-equal"',
    mr.includes('Verdict: matches the expected answer (checked exactly') && !mr.includes('string-equal'), mr);
  const adds = gradeTryYourself('x < 3', 'x < 5', 'frq', undefined, CARD);
  const ma = buildTryYourselfMarker('x < 3', 'x < 5', adds.verdict, adds.relation);
  check('witness direction flips when the student\'s set is too small',
    /at x = \S+ the expected answer holds and the student's answer does not/.test(ma), ma);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
