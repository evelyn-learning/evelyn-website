/**
 * The owner's two live sessions of 2026-10-06 on build nSxYU92obl4HOXChKRkXx
 * (portal-2de3c6c8 text, portal-10beb4f5 voice) — the deterministic fixes
 * other than the computed facts (scripts/test-inequality-facts.ts) and the
 * judge table (scripts/test-judge-issue-decision.ts).
 *
 *   2  a test point is not an intersection claim
 *   3  a question that names alternatives is a question
 *   5  the text opener backstop strips, it does not kill
 *   7  the first page is not titled "Next"
 *   9  a praise opener that says the answer agrees is a verdict sentence
 *  10  a short answer in words counts when the pre-check says it answers
 *  11  text mode paints a render on arrival
 *  12  two descriptions of a region are not an answer dispute
 *  13  text mode shows its slow-turn cover line
 *  14  no filler ahead of a goodbye; the noise tip stays out of an explanation
 *
 * Every string is a recorded sentence unless marked otherwise.
 *
 * Run: npx tsx scripts/test-owner-session-2026-10-06b.ts
 */
import { strict as assert } from 'node:assert';
import { isIntersectionClaim, validateIntersectionPoints, type GraphData } from '../src/lib/tutor/whiteboard/intersection-validator';
import { classifyTurnShape } from '../src/lib/tutor/voice/turn-shape-signal';
import { isStudentQuestion, isUncommittedAlternativesQuestion, studentTurnShape } from '../src/lib/tutor/orchestrator/student-turn-shape';
import { adjustTurnShapeForSpeech, sentenceVerdictStance, voiceHoldAppliesTo } from '../src/lib/tutor/voice/voice-judging';
import {
  isNonAnswerShape,
  planFusedOpener,
  precheckAgreesWithOpener,
  precheckCountsAsAnswer,
  readMatchStatement,
  readVerdictOpener,
  resolveMatchCredit,
} from '../src/lib/tutor/voice/work-then-match';
import type { PublicVerdictPrecheck } from '../src/lib/tutor/voice/verdict-precheck-shared';
import { decidePageForBatch, problemPageTitle } from '../src/lib/tutor/whiteboard/page-grouping';
import { shouldPaintOnArrivalInTextMode } from '../src/lib/tutor/whiteboard/render-sync';
import { isComparableAnswer, shouldSkipProseDispute } from '../src/lib/tutor/voice/answer-dispute-tiebreak';
import { extractProblemInequalities } from '../src/lib/tutor/whiteboard/graph-inequalities';
import {
  classifyCover,
  coverPresentation,
  isStudentSignoff,
  noiseTipMayRideTurn,
  NOISE_TIP_NOTE,
  TEXT_COVER_VISIBLE_LINE,
} from '../src/lib/tutor/voice/cover-layer';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 3).join(' | ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the step asked', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o,
});

// ── 2. a test point is not an intersection ──────────────────────────────────
console.log('\nitem 2 — the test point (0, 0) stays where the tutor put it');
/** What the brain sent in the text session @183.7 s (the persisted graph
 *  shows the result: its one point had become "(2, 0)"). */
const BOUNDARY_GRAPH: GraphData = {
  title: 'Boundary lines for both inequalities', xLabel: 'x', yLabel: 'y', xRange: [-6, 6], yRange: [-6, 6],
  functions: [
    { latex: '-2x+4', fn: '-2x+4', label: 'y = -2x + 4' },
    { latex: '(x-2)/3', fn: '(x-2)/3', label: 'y = (x-2)/3' },
  ],
  functionsOfY: [],
  points: [{ x: 0, y: 0, label: '(0, 0)', color: '#16a34a' }],
};
test('LIVE: two lines and the test point "(0, 0)" — kept, and no crossing is added', () => {
  const out = validateIntersectionPoints(BOUNDARY_GRAPH);
  assert.equal(out, BOUNDARY_GRAPH, 'passed through untouched');
  assert.deepEqual(out.points, [{ x: 0, y: 0, label: '(0, 0)', color: '#16a34a' }]);
});
test('…with the previous rule the same graph lost its point to (2, 0)', () => {
  assert.equal(isIntersectionClaim(BOUNDARY_GRAPH.points![0], BOUNDARY_GRAPH, { wordsOnly: false }), true);
  assert.equal(isIntersectionClaim(BOUNDARY_GRAPH.points![0], BOUNDARY_GRAPH), false);
});
test('a point is a claim only when WORDS say so: its label, or the graph\'s title / curve labels', () => {
  const g = (title: string, label: string, extra: Partial<GraphData> = {}): GraphData => ({ ...BOUNDARY_GRAPH, title, points: [{ x: 0, y: 0, label }], ...extra });
  const claim = (d: GraphData) => isIntersectionClaim(d.points![0], d);
  assert.equal(claim(g('Boundary lines', 'Test point (0, 0)')), false);
  assert.equal(claim(g('Boundary lines', 'Intersection (0, 0)')), true);
  assert.equal(claim(g('Boundary lines', 'where the lines cross')), true);
  assert.equal(claim(g('Where the two lines meet', '(0, 0)')), true);
  assert.equal(claim(g('Point of intersection', 'A(0, 0)')), true);
  assert.equal(claim(g('Solution of the system', '(0, 0)')), true);
  // …but a point with its own words is that thing, even on such a graph.
  assert.equal(claim(g('Intersection of the two lines', 'Test point (0, 0)')), false);
  assert.equal(claim(g('Intersection of the two lines', 'y-intercept')), false);
  // On a graph that SHADES a region, "solution of the system" is the region.
  assert.equal(claim(g('Solution of the system', '(0, 0)', { inequalities: [{ expr: 'y < -2x + 4' }] } as Partial<GraphData>)), false);
});
test('a claimed intersection that is not one is still dropped, and the true crossing back-filled', () => {
  const out = validateIntersectionPoints({ ...BOUNDARY_GRAPH, title: 'Where the boundary lines intersect', points: [{ x: 0, y: 0, label: '(0, 0)' }] });
  const pts = out.points ?? [];
  assert.equal(pts.length, 1);
  assert.ok(Math.abs(pts[0].x - 2) < 0.01 && Math.abs(pts[0].y) < 0.01, JSON.stringify(pts));
});
test('a claimed crossing next to an unclaimed test point: the test point is never dropped', () => {
  const out = validateIntersectionPoints({ ...BOUNDARY_GRAPH, points: [{ x: 0, y: 0, label: 'Test point (0, 0)' }, { x: 1, y: 1, label: 'Intersection' }] });
  const pts = out.points ?? [];
  assert.ok(pts.some((p) => p.x === 0 && p.y === 0 && p.label === 'Test point (0, 0)'));
  assert.ok(!pts.some((p) => p.x === 1 && p.y === 1), 'the false crossing is dropped');
  assert.ok(pts.some((p) => Math.abs(p.x - 2) < 0.01 && Math.abs(p.y) < 0.01), 'the true crossing is added');
});
test('no points and no wording: nothing is added', () => {
  const g = { ...BOUNDARY_GRAPH, points: [] };
  assert.equal(validateIntersectionPoints(g), g);
});

// ── 3. a question that names alternatives ───────────────────────────────────
console.log('\nitem 3 — a question judged as an answer');
const Q_LIVE = 'So is the answer for the second one which is uh x -3 y greater than 2 is the shaded region uh above the line or below the line?';
const PRIOR_LIVE = "Where they overlap — the darker patch — is the solution to the system; it's worth noticing that's always how two-inequality systems work, not something to memorize line by line.";
test('LIVE: the either/or question is a question — no verdict, no pre-check, no hold, no match statement', () => {
  assert.equal(isUncommittedAlternativesQuestion(Q_LIVE), true);
  assert.equal(isStudentQuestion(Q_LIVE), true);
  assert.equal(studentTurnShape(Q_LIVE), 'question');
  const ts = classifyTurnShape(Q_LIVE, PRIOR_LIVE);
  assert.equal(ts?.shape, 'question');
  assert.equal(ts?.answerShaped, false, 'the server runs no pre-check on it');
  assert.equal(isNonAnswerShape(ts), true, 'the per-turn rule is the non-answer rule: no verdict, no match');
  assert.equal(adjustTurnShapeForSpeech(ts, Q_LIVE)?.shape, 'question');
  assert.equal(voiceHoldAppliesTo(ts, Q_LIVE), false);
  // The same words without the question mark (speech recognition often drops it).
  assert.equal(classifyTurnShape(Q_LIVE.replace('?', ''), PRIOR_LIVE)?.shape, 'question');
});
test('with the switch off it is the answer it was on the live build', () => {
  assert.equal(isUncommittedAlternativesQuestion(Q_LIVE, { enabled: false }), false);
});
test('other questions that name alternatives and commit to neither', () => {
  for (const q of [
    'is it above or below?',
    'would it be dashed or solid?',
    'Is the shaded region above the line or below the line',
    "I don't know, is it above or below?",
    'which side do we shade, above or below?',
    'do we shade the side with the origin or the other side?',
    'should the line be solid or dashed',
    'true or false?',
  ]) {
    assert.equal(classifyTurnShape(q, 'What comes next?')?.answerShaped, false, q);
    assert.equal(studentTurnShape(q), 'question', q);
  }
});
test('MUST STAY ANSWERS', () => {
  const prior = 'What\'s the slope and $y$-intercept of this line?';
  for (const a of [
    'is it 1/3 and -2/3?',
    "I don't know, is it 1/3?",
    'I dont know, is it 1/3 and -2/3?',
    "so it's below, right?",
    'is it above the line?',
    'is it x = 2 or x = -3?',                 // both roots proposed
    'x = 2 or x = -3',
    'is it above or below? I think below',    // commits
    'is it dashed or solid, maybe dashed?',   // commits
    "I don't know, maybe nominate someone else, or make a recess appointment?", // a hedged proposal with "or" in it
    'below both lines',
    'the side with origin.',
    'Yeah, below the line.',
    'both dashed',
    'the darker common shade is below the orign and its below the red dashed line',
    'first will be 0<4 true and the other will be 0>2 false',
  ]) {
    const ts = classifyTurnShape(a, prior);
    assert.equal(ts?.answerShaped, true, `${a} → ${ts?.shape}`);
    assert.equal(isUncommittedAlternativesQuestion(a), false, a);
  }
  // Unchanged: a real question with numbers in it stays a question.
  assert.equal(studentTurnShape('which is bigger, 5 or 6?'), 'question');
  assert.equal(studentTurnShape('how to solve: x>5 or x<3'), 'question');
});

// ── 5. the text opener backstop ─────────────────────────────────────────────
console.log('\nitem 5 — the opener backstop strips, it does not kill');
const KILLED = 'Right — at x=0, the blue line sits at y=4, and 0 is below that — matching what\'s given.';
test('LIVE: "Right — at x=0, the blue line sits at y=4…" with a HIGH-confidence agreeing check → cut, shown capitalised, no kill', () => {
  const read = readVerdictOpener(KILLED, { answerShaped: true, weakComma: true });
  assert.equal(read.kind, 'fused');
  if (read.kind !== 'fused') return;
  const plan = planFusedOpener({ opener: read.opener, remainder: read.remainder, precheck: pc({ verdict: 'correct' }), killAvailable: true });
  assert.deepEqual(plan, { action: 'cut', remainder: 'At x=0, the blue line sits at y=4, and 0 is below that — matching what\'s given.', why: 'precheck_agrees' });
});
test('…and with no check at all it is still cut, not killed', () => {
  const read = readVerdictOpener(KILLED, { answerShaped: true, weakComma: true });
  if (read.kind !== 'fused') throw new Error('not fused');
  for (const precheck of [null, pc({ confidence: 'medium' }), pc({ verdict: 'incorrect' })]) {
    const plan = planFusedOpener({ opener: read.opener, remainder: read.remainder, precheck, killAvailable: true });
    assert.equal(plan.action, 'cut');
    if (plan.action === 'cut') assert.equal(plan.why, 'clean_cut');
  }
});
test('the live build\'s rule (switch off): killed first, cut only once the kill is spent', () => {
  const read = readVerdictOpener(KILLED, { answerShaped: true });
  if (read.kind !== 'fused') throw new Error('not fused');
  assert.deepEqual(planFusedOpener({ opener: read.opener, remainder: read.remainder, precheck: pc({}), killAvailable: true, stripNotKill: false }), { action: 'kill' });
  assert.equal(planFusedOpener({ opener: read.opener, remainder: read.remainder, precheck: pc({}), killAvailable: false, stripNotKill: false }).action, 'cut');
});
test('other clean cuts: "Right, ", "Exactly — ", "Good — ", "Yes, "', () => {
  for (const [s, want] of [
    ['Right, isolating $y$ gives exactly that.', 'Isolating $y$ gives exactly that.'],          // LIVE @29.7 s — it escaped
    ['Exactly — the sign flips when we divide by a negative.', 'The sign flips when we divide by a negative.'],
    ['Good — checking (0,-5) against both lines confirms it sits in the region below both dashed boundaries.', 'Checking (0,-5) against both lines confirms it sits in the region below both dashed boundaries.'],
    ['Yes, and the slope is one third.', 'The slope is one third.'],
    ['Not quite — the constant term needs a second look.', 'The constant term needs a second look.'],
  ] as const) {
    const read = readVerdictOpener(s, { answerShaped: true, weakComma: true });
    assert.equal(read.kind, 'fused', s);
    if (read.kind !== 'fused') continue;
    const plan = planFusedOpener({ opener: read.opener, remainder: read.remainder, precheck: null, killAvailable: true });
    assert.deepEqual([plan.action, plan.action === 'cut' ? plan.remainder : ''], ['cut', want], s);
  }
});
test('the comma form is read ONLY for the text backstop and only after a proposed answer', () => {
  const s = 'Right, isolating $y$ gives exactly that.';
  assert.equal(readVerdictOpener(s, { answerShaped: true }).kind, 'none', 'voice / every other caller: as before');
  assert.equal(readVerdictOpener(s, { answerShaped: false, weakComma: true }).kind, 'none', 'a discourse marker when nothing was proposed');
  assert.equal(readVerdictOpener('Right now we need the slope.', { answerShaped: true, weakComma: true }).kind, 'none');
});
test('a kill is left for a sentence that cannot stand without its verdict and that nothing vouches for', () => {
  const read = readVerdictOpener('Not quite what I was after here.', { answerShaped: true, weakComma: true });
  assert.equal(read.kind, 'fused');
  if (read.kind !== 'fused') return;
  assert.equal(read.remainder, null);
  assert.deepEqual(planFusedOpener({ opener: read.opener, remainder: null, precheck: null, killAvailable: true }), { action: 'kill' });
  assert.deepEqual(planFusedOpener({ opener: read.opener, remainder: null, precheck: null, killAvailable: false }), { action: 'show', why: 'kill_spent' });
  // A HIGH-confidence check that agrees: never killed — shown as written.
  assert.deepEqual(planFusedOpener({ opener: read.opener, remainder: null, precheck: pc({ verdict: 'incorrect' }), killAvailable: true }), { action: 'show', why: 'precheck_agrees' });
});
test('agreement is HIGH confidence, same direction, about the question asked', () => {
  assert.equal(precheckAgreesWithOpener(pc({}), 'Right'), true);
  assert.equal(precheckAgreesWithOpener(pc({ verdict: 'incorrect' }), 'Not quite'), true);
  assert.equal(precheckAgreesWithOpener(pc({ verdict: 'incorrect' }), 'Right'), false);
  assert.equal(precheckAgreesWithOpener(pc({}), 'Not quite'), false);
  assert.equal(precheckAgreesWithOpener(pc({ confidence: 'medium' }), 'Right'), false);
  assert.equal(precheckAgreesWithOpener(pc({ answers: 'neither' }), 'Right'), false);
  assert.equal(precheckAgreesWithOpener(pc({ answers: 'other_part' }), 'Right'), false);
  assert.equal(precheckAgreesWithOpener(null, 'Right'), false);
});

// ── 7. the first page's title ───────────────────────────────────────────────
console.log('\nitem 7 — the first page is not "Next"');
const SIGNALS = { topicShiftDistance: null, continuationGuardActive: false, tutorSameContext: false, segmentAdvancePending: false, killRecoveryPinPageId: null, firstTeachingWillDedup: false };
const CARD = { action: 'showProblem', problem: { statement: 'Solve the system of inequalities $2x + y < 4$ and $x - 3y > 2$ using graphs.', format: 'free-response' }, id: 'showProblem-1' };
const firstPage = (extra: Record<string, unknown>) => decidePageForBatch({ batch: [CARD], studentText: '', activePage: null, currentTurn: 1, signals: SIGNALS, ...extra });
test('LIVE: the untitled homework problem card opens "Problem 1"', () => {
  const d = firstPage({ homeworkProblem: { n: 1, total: 1, text: 'Solve the system of inequalities 2x + y < 4 and x - 3y > 2 using graphs.' } });
  assert.equal(d.action, 'newPage');
  if (d.action === 'newPage') assert.equal(d.title, 'Problem 1');
});
test('several problems in the homework plan: "Problem N of M"', () => {
  const d = firstPage({ homeworkProblem: { n: 2, total: 5 } });
  if (d.action !== 'newPage') throw new Error(d.action);
  assert.equal(d.title, 'Problem 2 of 5');
});
test('no homework plan: a short head of the statement — the words before its first expression, never cut mid-expression', () => {
  const d = firstPage({});
  if (d.action !== 'newPage') throw new Error(d.action);
  assert.equal(d.title, 'Solve the system of inequalities');
  assert.equal(problemPageTitle({ action: 'showProblem', problem: { statement: 'Find the value of $x$ when $2x + 3 = 7$.' } }), 'Find the value');
  // No words before the expression: the start of the line, cut at a word, not on an operator.
  const t = problemPageTitle({ action: 'showTryYourself', problem: { statement: '$2x + y < 4$ and $x - 3y > 2$: shade the region where both hold on one graph.' } })!;
  assert.ok(t.length <= 44 && !/[+\-<>=(]…$/.test(t), t);
  assert.equal(problemPageTitle({ action: 'showProblem', problem: { statement: '' } }), 'Problem');
  assert.equal(problemPageTitle({ action: 'showEquation', latex: 'x' }), null);
});
test('a side example shown during homework is not "Problem N"', () => {
  const d = decidePageForBatch({ batch: [{ action: 'showProblem', problem: { statement: 'Try this one: shade $y > x$.' } }], studentText: '', activePage: null, currentTurn: 1, signals: SIGNALS, homeworkProblem: { n: 1, total: 3, text: 'Solve the system of inequalities 2x + y < 4 and x - 3y > 2 using graphs.' } });
  if (d.action !== 'newPage') throw new Error(d.action);
  assert.equal(d.title, 'Try this one: shade');
});
test('a card with its own title keeps it; a non-problem render still says "Next"; switch off ⇒ "Next"', () => {
  const titled = decidePageForBatch({ batch: [{ action: 'showGraph', data: { title: 'Boundary lines' } }], studentText: '', activePage: null, currentTurn: 1, signals: SIGNALS, homeworkProblem: { n: 1, total: 1 } });
  if (titled.action !== 'newPage') throw new Error(titled.action);
  assert.equal(titled.title, 'Boundary lines');
  const eq = decidePageForBatch({ batch: [{ action: 'showEquation', latex: 'x' }], studentText: '', activePage: null, currentTurn: 1, signals: SIGNALS, homeworkProblem: { n: 1, total: 1 } });
  if (eq.action !== 'newPage') throw new Error(eq.action);
  assert.equal(eq.title, 'Next');
  const off = firstPage({ homeworkProblem: { n: 1, total: 1 }, problemPageTitle: false });
  if (off.action !== 'newPage') throw new Error(off.action);
  assert.equal(off.title, 'Next');
});

// ── 9. praise openers ───────────────────────────────────────────────────────
console.log('\nitem 9 — a praise opener spoken before the check');
test('LIVE: "Good, that matches what we need." is a verdict sentence (it is held)', () => {
  assert.equal(sentenceVerdictStance('Good, that matches what we need.', 'Right, so slope will be -2 and intercept is 4.'), 'affirm');
});
test('"<praise>, that matches / works / checks out / is right" and "Good eye —"', () => {
  for (const s of [
    'Good, that works.',
    'Great, that checks out.',
    'Nice — that lines up with the board.',
    'Right, that is correct.',
    'Good, it matches the equation on the board.',
    'Good eye — "dash" matches the dashed-line call for a strict inequality.',
    'Good eye, "dash" matches the dashed-line call for a strict inequality.',   // the speech form
    'Nice catch — the sign does flip.',
  ]) assert.equal(sentenceVerdictStance(s, 'dash.'), 'affirm', s);
});
test('openers that are not verdicts stay unheld', () => {
  for (const s of [
    "Okay, let's work with that.",
    "Let's see how that lines up.",
    "Let's check that together.",
    'Good question.',
    "Good, now let's look at the second one.",
    'Good to know, thank you for telling me.',
    'Sure thing — let\'s zoom in on the board together.',
  ]) assert.equal(sentenceVerdictStance(s, 'x'), null, s);
});

// ── 10. short answers in words ──────────────────────────────────────────────
console.log('\nitem 10 — "the side with origin" and "below the line" count');
test('a HIGH-confidence check that the message answers the open question makes the turn an answer', () => {
  assert.equal(precheckCountsAsAnswer(pc({ proposed: 'the side with origin' })), true);
  assert.equal(precheckCountsAsAnswer(pc({ verdict: 'incorrect' })), true);
  assert.equal(precheckCountsAsAnswer(pc({ answers: 'overall_problem' })), true);
  for (const p of [null, pc({ confidence: 'medium' }), pc({ answers: 'neither' }), pc({ answers: 'other_part' }), pc({ verdict: 'partly_correct' }), pc({ verdict: 'cannot_determine' })]) {
    assert.equal(precheckCountsAsAnswer(p), false, JSON.stringify(p));
  }
  assert.equal(precheckCountsAsAnswer(pc({}), { enabled: false }), false);
});
test('LIVE voice @189 s / @440 s: checked correct → credited correct', () => {
  // "the side with origin." → "…That matches what you said — the side with the origin."
  const reply1 = 'Right — let\'s see what that shading actually gives us. Plugging in $(0,0)$ made $2x + y < 4$ true, so the side of the dashed line containing the origin is the solution region we shade. That matches what you said — the side with the origin.';
  const p1 = pc({ proposed: 'the side with origin' });
  assert.equal(precheckCountsAsAnswer(p1), true);
  assert.deepEqual(resolveMatchCredit({ precheck: p1, match: readMatchStatement(reply1, 'the side with origin.') }), { credit: 'correct', source: 'precheck', disagreement: false });
  const p2 = pc({ proposed: 'below the line' });
  assert.equal(resolveMatchCredit({ precheck: p2, match: readMatchStatement('Right — below the line. For $y < \\frac{1}{3}x - \\frac{2}{3}$, that\'s exactly the region we shade for the second inequality.', 'Yeah, below the line.') }).credit, 'correct');
});
test('checked incorrect counts as wrong ONLY with the tutor\'s agreement', () => {
  const wrong = pc({ verdict: 'incorrect' });
  assert.equal(precheckCountsAsAnswer(wrong), true);
  assert.equal(resolveMatchCredit({ precheck: wrong, match: 'differs' }).credit, 'incorrect');
  assert.equal(resolveMatchCredit({ precheck: wrong, match: 'none' }).credit, 'none');
  assert.deepEqual(resolveMatchCredit({ precheck: wrong, match: 'matches' }), { credit: 'none', source: 'none', disagreement: true });
});

// ── 11. text mode paints on arrival ─────────────────────────────────────────
console.log('\nitem 11 — a text session does not wait for speech');
test('the gate', () => {
  const base = { enabled: true, isTextMode: true, bufferDepth: 0, hasSketchRequest: false, isRepairFrame: false };
  assert.equal(shouldPaintOnArrivalInTextMode(base), true);
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, isTextMode: false }), false, 'voice keeps its speech anchors');
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, enabled: false }), false);
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, bufferDepth: 1 }), false, 'never overtakes a render already waiting — order is kept');
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, hasSketchRequest: true }), false, 'a sketch keeps its asynchronous slot');
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, isRepairFrame: true }), false);
});

// ── 12. the session-start answer dispute ────────────────────────────────────
console.log('\nitem 12 — two descriptions of a region are not a dispute');
const CLAIMED_LIVE = 'Region below dashed line y=-2x+4 and below dashed line y=(x-2)/3';
const SOLVED_LIVE = 'The solution is the open region consisting of all points below both dashed lines';
test('LIVE @8.7 s: skipped — no note, nothing pinned', () => {
  const statement = 'Solve the system of inequalities $2x + y < 4$ and $x - 3y > 2$ using graphs.';
  assert.deepEqual(shouldSkipProseDispute({ enabled: true, claimed: CLAIMED_LIVE, solved: SOLVED_LIVE, problemIsInequalitySystem: extractProblemInequalities(statement).ok }), { skip: true, why: 'inequality-system' });
  // …and on its wording alone, for a problem the parser cannot read.
  assert.deepEqual(shouldSkipProseDispute({ enabled: true, claimed: CLAIMED_LIVE, solved: SOLVED_LIVE }), { skip: true, why: 'claimed-is-prose' });
  assert.deepEqual(shouldSkipProseDispute({ enabled: true, claimed: 'x = 11', solved: SOLVED_LIVE }), { skip: true, why: 'solved-is-prose' });
  assert.deepEqual(shouldSkipProseDispute({ enabled: false, claimed: CLAIMED_LIVE, solved: SOLVED_LIVE, problemIsInequalitySystem: true }), { skip: false, why: 'off' });
});
test('comparable values still dispute (the R58 case: "11" vs "13/3")', () => {
  assert.deepEqual(shouldSkipProseDispute({ enabled: true, claimed: 'x = 11', solved: '13/3', problemIsInequalitySystem: false }), { skip: false, why: 'comparable' });
  for (const v of ['11', 'x = 13/3', '-4 < x ≤ 2', '$\\frac{1}{3}$', 'D', '30 m/s', 'no solution', 'all real numbers', 'x = 2 or x = -3', '(2, 0)', 'The answer is 5']) {
    assert.equal(isComparableAnswer(v), true, v);
  }
  for (const v of [CLAIMED_LIVE, SOLVED_LIVE, '', 'The president can veto the bill and send it back to Congress']) {
    assert.equal(isComparableAnswer(v), false, v);
  }
});

// ── 13. the slow-turn cover line in text mode ───────────────────────────────
console.log('\nitem 13 — text mode shows its cover line');
test('text ⇒ a visible line in the typing indicator; voice ⇒ spoken, as before', () => {
  assert.equal(coverPresentation({ textMode: true }), 'visible');
  assert.equal(coverPresentation({ textMode: false }), 'spoken');
  assert.equal(coverPresentation({ textMode: true, enabled: false }), 'spoken');
  assert.equal(TEXT_COVER_VISIBLE_LINE, 'Still working on it…');
});

// ── 14. the filler and the noise tip ────────────────────────────────────────
console.log('\nitem 14 — no filler ahead of a goodbye; the noise tip waits');
test('LIVE @722 s: "Yeah, I\'m done." gets no "Hold on, let me look."', () => {
  assert.deepEqual(classifyCover("Yeah, I'm done."), { kind: 'silent', reason: 'signoff' });
  assert.deepEqual(classifyCover("Yeah, I'm done.", { signoffSilent: false }), { kind: 'cover', category: 'generic' }, 'the live build');
});
test('sign-offs', () => {
  for (const s of ["I'm done.", 'Okay, I am finished', "Thanks, that's all.", 'bye', 'Okay bye bye', 'see you', "let's stop here", 'I have to go now', "that's it for today", 'Thank you, goodbye']) {
    assert.equal(isStudentSignoff(s), true, s);
    assert.equal(classifyCover(s).kind, 'silent', s);
  }
  for (const s of ['Yeah, this is okay.', "Okay, let's do that.", 'dash.', 'the side with origin.', "I'm done with the first one, so the slope is -2 and the intercept is 4 and then we plot it", 'So is it done by dividing?', '[start lesson]']) {
    assert.equal(isStudentSignoff(s), false, s);
  }
});
test('LIVE @319 s: the tip does not ride the reply to an answer', () => {
  const prior = 'Now, same test as before: plugging $x=0$, $y=0$ into $x - 3y > 2$, what do you get?';
  const said = "Yeah, you'll get 0 0 and 2, which is not right. So it the answer should not include the origin.";
  assert.equal(noiseTipMayRideTurn(said, prior), false);
  assert.equal(noiseTipMayRideTurn(said, prior, { enabled: false }), true, 'the live build attached it to any real turn');
});
test('it waits for a turn between: not an answer, a question, a request or a sign-off', () => {
  const prior = 'Want to try another point or are you ready to move on?';
  for (const s of ['So is the shaded region above the line or below the line?', "I don't know, uh, can you draw them and uh, show them on the graph?", 'Can you recap uh can you recap', 'dash.', 'Slope is 4 and y intercept is -2.', "Yeah, I'm done.", '[idle nudge]', '']) {
    assert.equal(noiseTipMayRideTurn(s, prior), false, s);
  }
  for (const s of ['Yes.', 'Okay.', 'got it', 'makes sense']) {
    assert.equal(noiseTipMayRideTurn(s, 'That wraps up the first line. Ready for the second?'), true, s);
  }
});
test('the note keeps the sentence apart from the teaching', () => {
  assert.match(NOISE_TIP_NOTE, /^\[noise note — not from the student\]/);
  assert.match(NOISE_TIP_NOTE, /never inside an explanation and never next to a verdict on an answer/);
  assert.match(NOISE_TIP_NOTE, /Say it once this session/);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
