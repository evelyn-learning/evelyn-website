/**
 * Small guards from the 21 scripted Homework Help sessions (2026-10-05).
 * Each case is a sentence / tool call / event recorded in that run.
 *   (a) meta-narration: third-person deliberation about the learner
 *   (b) show_dimensional_check on an algebra equation
 *   (c) chat text boarded as a "Question" card
 *   (d) brain stall with nothing shown
 *   (e) "I don't have a clean follow-up problem ready"
 *   (+) partner embed with no usable student name: never ask for one
 *
 * Run: npx tsx scripts/test-homework-small-guards.ts (npm run test:homework-small-guards)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isMetaNarration } from '../src/lib/tutor/voice/meta-narration';
import { decideDimensionalCheck, isPhysicalScienceSubject, isSymbolicQuantityFormula } from '../src/lib/tutor/validation/dimensional-gate';
import { detectSpokenProblem, windowIsFeedbackOnAnAnswer } from '../src/lib/tutor/voice/spoken-problem-board';
import { decideStallRecovery, BRAIN_STALL_APOLOGY, BRAIN_STALL_RETRY_WINDOW_MS, BRAIN_STALL_PRE_AUDIO_MS } from '../src/lib/tutor/voice/brain-stall';
import { applyNoProblemSelfPoseRule, noProblemToolMessage, CASE_B_START } from '../src/lib/tutor/ai/no-problem-rule';
import { LIVE_BRAINGEN_BUDGET_MS } from '../src/lib/tutor/voice/problem-generator';
import { buildSystemPromptParts } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };
const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');

console.log('\n(a) meta-narration — third person about the learner + self-instruction');
const LEAK = "Let me stay focused: they're mid-step on problem 2, so I should answer the active question first.";
assert(isMetaNarration(LEAK) === true, 'AP Calculus BC (recorded): the deliberation sentence is dropped');
for (const s of [
  "They're asking about a different topic, so I need to finish the current problem first.",
  'The learner asked for a new problem, but I should stay on the current one.',
  "The user hasn't answered yet, so I should wait rather than grade.",
  "They're still on part (a), so let me not move ahead.",
  "They just answered part (b), which means I should check that before continuing.",
]) assert(isMetaNarration(s) === true, `dropped: "${s.slice(0, 60)}"`);
for (const s of [
  "They're both solutions.",
  "They're both solutions, so we keep x = 3 and x = -3.",
  'The user of a microscope turns the coarse focus first.',
  "When charges are alike they're repelled, so I should expect a larger angle.",
  'I should mention one more case before we move on.',
  'Let me focus on the second term with you.',
  "If the angles are supplementary, they're adding to 180, so we need to set up x + 3x = 180.",
  "The electrons are shared, and they're pulled toward the more electronegative atom.",
  "Senators serve six years; they're asked to confirm the president's nominees.",
  'So I need to subtract 5 from both sides — what does that leave you with?',
  "You're mid-step on problem 2, so finish that line first.",
  "This is a new problem, different from the current one — I'll finish this limit first, then take that one next.",
]) assert(isMetaNarration(s) === false, `kept (teaching): "${s.slice(0, 60)}"`);
{
  const prev = process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON;
  process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON = 'off';
  assert(isMetaNarration(LEAK) === false, 'flag off → the sentence is not dropped (as before)');
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON; else process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON = prev;
}

console.log('\n(b) show_dimensional_check');
const ALG = '4(m+3)=2m-6';
for (const subject of ['Math', 'math', 'ALGEBRA_1', 'English', 'history', '', undefined]) {
  assert(decideDimensionalCheck({ enabled: true, subject, formula: ALG }).allow === false, `Algebra 1 (recorded) "${ALG}" in subject ${JSON.stringify(subject)} → dropped`);
}
assert(decideDimensionalCheck({ enabled: true, subject: 'physics', formula: ALG }).allow === false, 'the same algebra equation in a PHYSICS session is still not a dimensional check (number added to a symbol)');
assert(decideDimensionalCheck({ enabled: true, subject: 'math', formula: 'F = m·a' }).allow === false, 'a physics formula in a maths session → dropped (subject)');
for (const [subject, args] of [
  ['physics', { formula: 'F = m·a' }],
  ['physics', { formula: 'T = 2π√(L/g)' }],
  ['physics', { expression: 'm v^2 / r', expectedUnit: 'N' }],
  ['chemistry', { expression: 'n R T / V', expectedUnit: 'Pa' }],
  ['science', { formula: 'v = 10 m/s^2 * 3 s' }],
  ['physics', { formula: 'KE = \\frac{1}{2} m v^2' }],
] as Array<[string, { formula?: string; expression?: string; expectedUnit?: string }]>) {
  assert(decideDimensionalCheck({ enabled: true, subject, ...args }).allow === true, `allowed in ${subject}: ${JSON.stringify(args)}`);
}
assert(decideDimensionalCheck({ enabled: true, subject: 'physics', expression: 'x + 3' }).allow === false, 'physics, but no unit and no formula → dropped');
assert(decideDimensionalCheck({ enabled: true, subject: 'physics' }).allow === false, 'nothing to check → dropped');
assert(decideDimensionalCheck({ enabled: false, subject: 'math', formula: ALG }).allow === true, 'flag off → always allowed (as before)');
assert(isPhysicalScienceSubject('physics') && isPhysicalScienceSubject('chemistry') && isPhysicalScienceSubject('science') && isPhysicalScienceSubject('test-prep', 'jee-physics'), 'physical subjects');
assert(!isPhysicalScienceSubject('math') && !isPhysicalScienceSubject('biology') && !isPhysicalScienceSubject('history') && !isPhysicalScienceSubject(''), 'non-physical subjects');
assert(isSymbolicQuantityFormula('F = m·a') && !isSymbolicQuantityFormula(ALG) && !isSymbolicQuantityFormula('3x + 2 = 11'), 'symbolic formula vs algebra equation');
{
  const vtr = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert(vtr.includes("if ((cmd.action as string) === 'showDimensionalCheck') {") && vtr.includes('decideDimensionalCheck({ subject, topic, formula: dim.formula, expression: dim.expression, expectedUnit: dim.expectedUnit })'), 'wiring: the command is gated before it is dispatched');
  assert(vtr.includes("onDebugEvent?.('tool_call_soft_drop', `show_dimensional_check ("), 'wiring: a soft drop (debug event), not a rejection — the turn continues');
}

console.log('\n(c) chat text is not a problem card');
const CHEM_1 = ["Let's check that: $30 \\times 3 = 90$, not $180$ — so the multiplier isn't quite 3.", 'Try recomputing $180 \\div 30.03$ — what do you get this time?'];
const CHEM_2 = ['Your "x = 4" doesn\'t quite match what I asked — I was looking for grams of carbon and grams of hydrogen in a 100 gram sample, plus your next move.', 'In a 100 gram sample, 75% carbon means how many grams of carbon do you have, and how many grams of hydrogen?'];
assert(detectSpokenProblem(CHEM_1, [], { excludeFeedback: false }) !== null, 'AP Chemistry (recorded) correction turn WAS boarded before');
assert(detectSpokenProblem(CHEM_2, [], { excludeFeedback: false }) !== null, 'AP Chemistry (recorded) \'Your "x = 4" doesn\'t quite match…\' WAS boarded before');
assert(detectSpokenProblem(CHEM_1, []) === null, 'correction turn → not boarded');
assert(detectSpokenProblem(CHEM_2, []) === null, 'a reply quoting the student\'s answer → not boarded');
assert(windowIsFeedbackOnAnAnswer('You said 12, so what is 12 divided by 4 plus 30?') === true, 'quotes the student ("You said …")');
// Real spoken problems are still boarded.
assert(detectSpokenProblem(['A 12 oz jar costs $3.60 and a 20 oz jar costs $6.00.', 'Which is the better deal?'], []) !== null, 'live check 6: the jar problem is still boarded');
assert(detectSpokenProblem(['Not quite.', 'Try this one: a jacket is priced at $80 with a 25% discount, so what is the sale price?'], []) !== null, 'a verdict sentence OUTSIDE the window does not block a fresh problem');
assert(detectSpokenProblem(['A car travels 150 miles in 2.5 hours.', 'Find the speed and round your answer to 1 decimal place.'], []) !== null, '"round your answer" in a real problem is not feedback');

console.log('\n(d) brain stall with nothing shown');
const now = 1_000_000;
const stall = { enabled: true, stalled: true, nothingShown: true, transcript: 'Under the Pax Mongolica the Mongols secured the Silk Roads.', lastRetry: null, now };
assert(decideStallRecovery(stall) === 'retry', 'AP World History (recorded): first stall, nothing shown → retry the turn once');
assert(decideStallRecovery({ ...stall, lastRetry: { transcript: stall.transcript, at: now - 30_000 } }) === 'apology', 'the retry stalled too → apology line');
assert(decideStallRecovery({ ...stall, lastRetry: { transcript: 'a different turn', at: now - 30_000 } }) === 'retry', 'a retry of ANOTHER turn does not use up this one');
assert(decideStallRecovery({ ...stall, lastRetry: { transcript: stall.transcript, at: now - BRAIN_STALL_RETRY_WINDOW_MS - 1 } }) === 'retry', 'the same words long afterwards are a new turn');
assert(decideStallRecovery({ ...stall, nothingShown: false }) === 'default', 'something was already shown → no retry (the student has content)');
assert(decideStallRecovery({ ...stall, stalled: false }) === 'default', 'not a stall (network error, …) → the existing handling');
assert(decideStallRecovery({ ...stall, transcript: '[start lesson]' }) === 'default', 'a runtime dispatch is never retried here (the opener has its own retry)');
assert(decideStallRecovery({ ...stall, enabled: false }) === 'default', 'flag off → the existing single cover line');
assert(BRAIN_STALL_APOLOGY === 'Sorry — I lost my train of thought. Could you send that again?', 'the apology line');
{
  const vtr = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert(vtr.includes("if (stallRecovery === 'retry') {") && vtr.includes('void handleStudentTranscriptForBrainRef.current?.(transcript, { silent: true, typed: retryTyped,'), 'wiring: the retry re-dispatches the same turn silently (its bubble is already shown)');
  assert(vtr.includes("} else if (stallRecovery === 'apology' && currentTurnTypedRef.current) {") && vtr.includes('text: BRAIN_STALL_APOLOGY, timestamp: new Date() }'), 'wiring: a typed turn gets a visible transcript line');
  assert(vtr.includes('speakTextRef.current?.(BRAIN_STALL_APOLOGY);'), 'wiring: a voice turn hears it');
}

console.log('\n(e) no_problem_available');
const parts = buildSystemPromptParts({ module: null, subject: 'chemistry', topic: 'Empirical formulas', level: '11-12' });
const prompt = `${parts.core}\n${parts.session}`;
assert(prompt.includes(CASE_B_START), 'the Case B rule is present');
assert(!/Apologize briefly in 5-10 words/.test(prompt) && !/I don't have a clean follow-up on that one/.test(prompt), 'the prompt no longer PRESCRIBES "I don\'t have a clean follow-up"');
assert(/NEVER tell the student that no problem is available, ready or left/.test(prompt), 'never tell the student no problem is ready');
assert(/never announce a problem \("here's a similar one"\) before one is actually on the board/.test(prompt), 'never announce a problem before it is on the board');
assert(/work its answer out silently, step by step, and check that answer once more/.test(prompt) && /declare the answer in `expectedAnswer`/.test(prompt), 'pose its own problem: answer worked out first and declared');
assert(/simply continue with the current work/.test(prompt), '…or simply continue');
assert(!/Vary apology language/.test(prompt) && !/after a Case B refusal/.test(prompt), 'the apology-variation and refusal-insistence paragraphs are gone with the apology');
assert(/- On no_problem_available \+ Case B: no apology, and no mention that nothing was found/.test(prompt), 'the bridge-utterance rule agrees');
assert(/\*\*Case A — Student request contained an explicit modifier/.test(prompt) && /\*\*On `advance_lesson_failed` tool_result/.test(prompt), 'Case A and the next rule are intact');
{
  const off = 'x\n**Case B — Student request was generic (old)\n1. Apologize.\n\n**On `advance_lesson_failed` tool_result y';
  assert(applyNoProblemSelfPoseRule(off, false) === off, 'flag off → prompt byte-identical');
  assert(applyNoProblemSelfPoseRule('no anchors here', true) === 'no anchors here', 'missing anchors → unchanged');
  const on = applyNoProblemSelfPoseRule(off, true);
  assert(!on.includes('Apologize.') && on.startsWith('x\n**Case B') && on.endsWith('**On `advance_lesson_failed` tool_result y'), 'rewrite replaces exactly the Case B span');
}
assert(/Do NOT tell the student this/.test(noProblemToolMessage(true)) && /work its answer out carefully first/.test(noProblemToolMessage(true)), 'tool result: the instruction rides the result itself');
assert(noProblemToolMessage(false) === 'No problem could be sourced. Continue without injection.', 'tool result, flag off: the previous message');
assert(src('src/app/api/tutor/brain/stream/route.ts').includes('message: noProblemToolMessage(),'), 'wiring: brain stream route uses it');
assert(LIVE_BRAINGEN_BUDGET_MS === 15_000, 'live generation budget is 15 s');
assert(LIVE_BRAINGEN_BUDGET_MS + 5_000 <= BRAIN_STALL_PRE_AUDIO_MS, '…and stays clear of the 22 s pre-audio stall abort (no frames arrive while the tool runs)');

console.log('\n(+) no usable student name in a partner embed');
const base = { module: null, subject: 'math', topic: 'Limits', level: '11-12' } as const;
const sess = (ctx: Parameters<typeof buildSystemPromptParts>[0]) => { const p = buildSystemPromptParts(ctx); return `${p.core}\n${p.session}`; };
assert(sess({ ...base, studentName: 'gac-tutor-20261005-physics', partnerEmbed: true }).includes('Student Name: (not provided — do not ask for or use a name)'), 'partner embed + an id as the name → never ask for or use a name');
assert(!sess({ ...base, studentName: 'gac-tutor-20261005-physics', partnerEmbed: true }).includes('gac-tutor-20261005-physics'), '…and the id is nowhere in the prompt');
assert(sess({ ...base, partnerEmbed: true }).includes('Student Name: (not provided — do not ask for or use a name)'), 'partner embed + no name → same');
assert(sess({ ...base }).includes('Student Name: (not provided - you can ask)'), 'retail (no partnerEmbed) → unchanged "you can ask"');
assert(sess({ ...base, studentName: 'Maya', partnerEmbed: true }).includes('Student Name: Maya\n'), 'a real name in a partner embed is still used');
assert(src('src/app/tutor/components/VoiceTutorRealtime.tsx').includes('partnerEmbed: !!embedToken && !openScope,'), 'wiring: set for embed-token sessions that are not the open demo');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
