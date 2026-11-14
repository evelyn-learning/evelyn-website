/// <reference types="node" />
/**
 * Tutor brain v2 — homework mode (GAC homework on v2, docs/superpowers/plans/2026-11-13-gac-on-v2-plan.md).
 * No network: the model is a stub and the plan / build are injected.
 *   npm run test:brain-v2-homework
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { AnswerKey } from '../src/lib/tutor/homework-build/types';
import type { HomeworkProblemTurn } from '../src/lib/tutor/voice/homework-problem-turn';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { runV2Turn, v2SessionPart, v2StudentBlock, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session } from '../src/lib/tutor/v2/types';
import { readHomeworkState, v2HomeworkCheck, v2HomeworkFor, v2HomeworkSession, workedAnswerCredit } from '../src/lib/tutor/v2/homework';
import { streamV2Turn } from '../src/lib/tutor/v2/client';
import { runV2HomeworkTurn, runV2SheetTurn } from '../src/lib/tutor/v2/homework-turn';
import { v2SheetFor } from '../src/lib/tutor/v2/homework';
import { classifyHomeworkProblemOutcome } from '../src/lib/tutor/homework-build/outcome';
import { formatKeyedVerdictDebug } from '../src/lib/tutor/voice/keyed-verdict';
import type { V2State } from '../src/lib/tutor/v2/types';
import { practiceLoTitle } from '../src/lib/tutor/practice-assign/lo-title';
import { readFileSync } from 'node:fs';
import path from 'node:path';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 50, cache_creation_input_tokens: 5 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); onText?.('x'); return r; };
  return { call, seen };
}

export const TEXT = 'In △ABC, side BC is extended to D. (a) Find x. (b) Find m∠ACB. [Figure: x° at A, (x + 20)° at B, (3x − 10)° exterior at C.]';
export const KEY: AnswerKey = {
  parts: [
    { label: 'a', final: 'x = 30', canonical: { kind: 'number', value: 30 } },
    { label: 'b', final: 'm∠ACB = 100°', canonical: { kind: 'number', value: 100, units: '°' } },
  ],
  solvers: ['test'],
};
export function hpTurn(over: Partial<HomeworkProblemTurn['homeworkProblem']> = {}): HomeworkProblemTurn {
  return {
    meta: { kind: 'homework-problem', parentPlanId: 'parent-1', n: 3, text: TEXT, figure: null, verified: true },
    homeworkProblem: { text: TEXT, verified: true, hasFigure: true, key: KEY, ...over },
  };
}
const base: V2Session = { studentName: 'Sam', subject: 'math', level: '9-10', mode: 'text', timeBoxMinutes: 30 };

async function main() {
  console.log('homework session (design 1)');
  const hw = v2HomeworkSession(hpTurn({ priorNote: 'Set up the equation last time.', priorConfirmed: ['part:a'] }), { noReveal: true });
  const session: V2Session = { ...base, homework: hw };
  const part = v2SessionPart(session);
  check('the session part carries the problem verbatim', part.includes(TEXT));
  check('it carries the prior-work note and what was confirmed before', part.includes('Set up the equation last time.') && /part a/i.test(part));
  check('it says the figure is already on screen', /already on the student's screen/i.test(part));
  check('it carries the no-reveal principle', /never state it, even when they ask/i.test(part) && /next smallest step/i.test(part));
  check('it carries the conduct rules (safeguarding, personal details)', /trusted adult/i.test(part) && /personal details/i.test(part));
  check('the key is not in the homework session', !JSON.stringify(hw).includes('100°') && !('key' in hw));
  check('no key value in the session part', !part.includes('x = 30') && !part.includes('100°'));
  const unverified = v2SessionPart({ ...base, homework: v2HomeworkSession(hpTurn({ verified: false, key: undefined }), { noReveal: true }) });
  // Task 7 (gac-hw-wrong-b on v2): the tutor spent four turns telling the student about "the record".
  check('the record and the check are the tutor\'s, never mentioned to the student', /never mention the record, the check or the key to the student/i.test(part));
  check('an answer you judge right that the record lacks is asked for once, on its own', /ask once for that part's final answer on its own/i.test(part));
  check('an unverified problem is never graded right or wrong', /never say whether the student's final answer is right or wrong/i.test(unverified));

  console.log('facts (design 6)');
  const s0 = newV2State(1_000_000);
  const facts = renderFacts(session, s0, { nowMs: 1_000_000 + 3 * 60000 });
  check('homework facts say the session ends when the problem is done', /ends when this problem is done/.test(facts) && !/not at its close/.test(facts), facts);
  // Review: the tutor still hears the clock in homework, so it can wind down before the hard stop.
  check('homework facts still say how much time is left', /about 27 left/.test(facts), facts);
  check('…and when the time is up', /the time is up/.test(renderFacts(session, s0, { nowMs: 1_000_000 + 31 * 60000 })));
  check('the record of confirmed parts is a fact', /homework record: confirmed correct — part a; still open — part b/.test(renderFacts(session, { ...s0, homework: { confirmed: ['part:a'] } }, { nowMs: 1_000_000 })));
  check('a finished problem says so', /every part is confirmed correct: the problem is done/.test(renderFacts(session, { ...s0, homework: { confirmed: ['part:a', 'part:b'], done: true } }, { nowMs: 1_000_000 })));

  console.log('opener (design 6)');
  const opener = v2StudentBlock(null, s0, undefined, undefined, session);
  check('the homework opener asks for one first question on the problem, not a lesson plan', /one problem/i.test(opener) && !/what this lesson is about/i.test(opener), opener);
  check('the opener with a figure says it is on screen and not to draw it again', /do not draw it again/i.test(opener));
  check('the opener picks up the prior note', /earlier session/i.test(opener));

  console.log('the key never reaches the model (design 1)');
  const m = stub([msg([{ type: 'text', text: 'Hi Sam! Which two angles inside the triangle does the exterior angle at C relate to?' }], 'end_turn')]);
  const r0 = await runV2Turn({ session, state: s0, studentSaid: null, callModel: m.call, nowMs: 1_000_000, boardPass: false });
  const sent = JSON.stringify(m.seen[0]);
  check('the request carries the problem', sent.includes('Find m∠ACB'));
  check('the request carries no key value', !sent.includes('x = 30') && !sent.includes('100°'), sent.slice(0, 200));
  check('the bare-board fallback does not paint over the problem panel', !r0.toolCalls.some((c) => !/^not /.test(c.outcome)), r0.toolCalls);

  console.log('the route resolves homework on the server (design 1)');
  const meta = { kind: 'homework-problem', parentPlanId: 'parent-1', n: 3, text: TEXT, figure: { tool: 'show_geometry' }, verified: true };
  const deps = { noCache: true, getPlan: async () => ({ metadata: meta }), getBuild: async () => ({ problems: [{ n: 3, key: KEY, status: 'ready' }] }) } as unknown as Parameters<typeof v2HomeworkFor>[2];
  const r = await v2HomeworkFor('plan-1', 'greenapple', { ...deps, env: {} });
  check('a homework-problem plan resolves, with the key held apart', !!r && r.problem.verified && r.problem.hasFigure && r.key === KEY && !('key' in r.problem));
  check('the part labels are known, not their answers', JSON.stringify(r?.problem.parts) === '["a","b"]');
  check('greenapple gets the no-reveal guard by default', r?.problem.noReveal === true);
  check('another partner does not', (await v2HomeworkFor('plan-1', 'crimsora', { ...deps, env: {} }))?.problem.noReveal !== true);
  check('an ordinary plan is not homework', (await v2HomeworkFor('plan-2', 'greenapple', { noCache: true, getPlan: async () => ({ metadata: {} }) } as never)) === null);
  check('a client-held record keeps only well-formed marks', JSON.stringify(readHomeworkState({ confirmed: ['part:a', 'bogus', 'value:b=x'], done: 'yes' })) === '{"confirmed":["part:a","value:b=x"]}');

  console.log('answer checking (design 2)');
  const hwSession: V2Session = { ...base, homework: v2HomeworkSession(hpTurn(), { noReveal: true }) };
  const said = (st: V2State, text: string): V2State => ({ ...st, history: [...st.history, { role: 'user', content: [{ type: 'text', text }] }, { role: 'assistant', content: [{ type: 'text', text: 'ok' }] }] });
  let st = said(newV2State(0), '[The session has just started.]');
  const c1 = await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: st, studentSaid: 'x = 25' });
  check('a wrong value is found wrong, without the right one', /part a/.test(c1.answerCheck ?? '') && /does not match/.test(c1.answerCheck ?? '') && !/30/.test(c1.answerCheck ?? ''), c1.answerCheck);
  check('a wrong value is a verdict frame', c1.verdicts.length === 1 && c1.verdicts[0].verdict === 'incorrect' && c1.verdicts[0].part === 'a');
  st = said(st, 'x = 25');
  const c2 = await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: st, studentSaid: 'so x = 30' });
  check('a right value matches', /part a/.test(c2.answerCheck ?? '') && /matches the checked answer/.test(c2.answerCheck ?? ''), c2.answerCheck);
  check('it is recorded', c2.confirmed.includes('part:a') && !c2.done && !c2.justDone);
  st = { ...said(st, 'so x = 30'), homework: { confirmed: c2.confirmed } };
  const cq = await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: st, studentSaid: 'what do I do next?' });
  check('a question gets no answer check', !cq.answerCheck && !cq.verdicts.length && cq.confirmed.includes('part:a'));
  const c3 = await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: st, studentSaid: '(b) angle ACB = 100' });
  check('the last part done is the problem done', c3.done && c3.justDone && c3.confirmed.includes('part:b'));
  const c4 = await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: { ...said(st, '(b) 100'), homework: { confirmed: c3.confirmed, done: true } }, studentSaid: 'x = 31' });
  check('a done problem is not judged again', !c4.answerCheck && !c4.verdicts.length && c4.done && !c4.justDone);
  const cu = await v2HomeworkCheck({ key: undefined, problem: { ...hwSession.homework!, verified: false }, state: st, studentSaid: 'x = 30' });
  check('an unverified problem is never checked', !cu.answerCheck && !cu.verdicts.length && !cu.done);
  const prose = await v2HomeworkCheck({
    key: { parts: [{ label: 'a', final: 'The enzyme is not used up.', canonical: { kind: 'text', value: 'not used up' }, prose: true }], solvers: ['t'] },
    problem: { ...hwSession.homework!, parts: ['a'] }, state: said(newV2State(0), '[start]'), studentSaid: 'it can be used again and again',
    proseMatch: async () => true,
  });
  check('a worded answer to a prose part is credited by the prose match', prose.done && prose.verdicts.some((v) => v.verdict === 'correct'), prose);

  console.log('an answer given with its working (design 2)');
  // The keyed check leaves a message with several values undecided; v1 then asked the model pre-check for the
  // student's final value and re-checked it against the key (modelCheckConfirms). v2 reads the message's own
  // last stated value instead: credit only, never a denial.
  const k1 = (final: string, value: number | string): AnswerKey => ({ parts: [{ label: '', final, canonical: typeof value === 'number' ? { kind: 'number', value } : { kind: 'text', value } }], solvers: ['t'] });
  for (const [m, key] of [
    ['8 plus 5 plus 6 plus 3 is 22 students total. so apple is 8 out of 22, which simplifies to 4/11', k1('4/11', '4/11')],
    ['2x + 20 = 3x - 10, so x = 30', k1('x = 30', 30)],
    ['I got 80 for the exterior angle so 180 - 80 = 100', k1('m∠ACB = 100°', 100)],
    ['first I did 34 - 18 = 16 then 16/2 = 8 so x = 8', k1('x = 8', 8)],
  ] as const) check(`credited with its working: "${m}"`, workedAnswerCredit(m, key).some((v) => v.verdict === 'correct'));
  // Task 7 (gac-hw-wrong-b on v2): an expression answer written out from the start of its working.
  const perim: AnswerKey = { parts: [{ label: 'a', final: 'P = 2x + 18', canonical: { kind: 'text', value: 'P = 2x + 18' } }], solvers: ['t'] };
  check('an expression is credited from the last side of its working', workedAnswerCredit('is it P = 2(x + 5) + 2(4) = 2x + 18', perim).some((v) => v.verdict === 'correct'));
  check('…but not a different last side', !workedAnswerCredit('is it P = 2(x + 5) + 2(4) = 2x + 14', perim).length);
  for (const [m, key] of [
    ['34 - 18 = 16, so x = 16?', k1('x = 8', 8)],
    ['2x + 20 = 3x - 10, so x = 25', k1('x = 30', 30)],
  ] as const) check(`not credited: "${m}"`, !workedAnswerCredit(m, key).length);
  const worked = await v2HomeworkCheck({ key: { ...KEY, parts: [KEY.parts[0]] }, problem: { ...hwSession.homework!, parts: ['a'] }, state: said(newV2State(0), '[start]'), studentSaid: 'x + x + 20 = 3x - 10 so 2x + 20 = 3x - 10, which gives x = 30' });
  check('a worked answer completes the problem', worked.done && worked.verdicts.some((v) => v.verdict === 'correct'), worked);

  console.log('done ends the session (design 3)');
  const doneState: V2State = { ...newV2State(1_000_000), homework: { confirmed: ['part:a', 'part:b'], done: true } };
  const e1 = stub([msg([{ type: 'text', text: 'That is the whole problem done. You can go back to your list.' }, { type: 'tool_use', id: 't1', name: 'end_lesson', input: { summary: 'done', because: 'lesson_complete' } }], 'tool_use')]);
  const rEnd = await runV2Turn({ session: hwSession, state: said(doneState, 'x'), studentSaid: '(b) 100', callModel: e1.call, nowMs: 1_000_000 + 4 * 60000, boardPass: false });
  check('end_lesson closes a done problem with time left', rEnd.state.closed, rEnd.toolCalls.map((t) => t.outcome));
  const e2 = stub([msg([{ type: 'text', text: 'Bye.' }, { type: 'tool_use', id: 't1', name: 'end_lesson', input: { summary: 'x', because: 'lesson_complete' } }], 'tool_use'), msg([{ type: 'text', text: 'What next?' }], 'end_turn')]);
  const rNot = await runV2Turn({ session: hwSession, state: said(newV2State(1_000_000), 'x'), studentSaid: 'hm', callModel: e2.call, nowMs: 1_000_000 + 4 * 60000, boardPass: false });
  check('…but not an unfinished one', !rNot.state.closed);

  console.log('frames and debug events (design 3)');
  const frames = [{ type: 'homework-keyed-verdict', part: 'b', verdict: 'correct' }, { type: 'homework-problem-done' }, { type: 'text', delta: 'Done.' }, { type: 'done', spoken: 'Done.', state: newV2State(0), usage: {}, firstTextMs: 1, totalMs: 2 }];
  const body = frames.map((f) => `data: ${JSON.stringify(f)}\n\n`).join('');
  const got: unknown[] = [];
  await streamV2Turn({ session: { subject: 'math', level: '9', mode: 'text' }, state: newV2State(0), studentSaid: 'x', onHomework: (ev) => got.push(ev), fetchImpl: (async () => new Response(body, { status: 200 })) as typeof fetch });
  check('the client hands on the homework frames', JSON.stringify(got) === JSON.stringify([{ type: 'homework-keyed-verdict', part: 'b', verdict: 'correct' }, { type: 'homework-problem-done' }]), got);

  console.log('one homework turn: check, then the turn (designs 2–3)');
  const resolved = { problem: hwSession.homework!, key: KEY, turn: hpTurn() };
  const ht = stub([msg([{ type: 'text', text: 'Yes, that is it. Now part (b): what is the exterior angle when x is 30?' }], 'end_turn')]);
  const outFrames: unknown[] = [];
  const hr = await runV2HomeworkTurn({ session: base, resolved, state: said(newV2State(1_000_000), '[start]'), studentSaid: 'x = 30', callModel: ht.call, nowMs: 1_000_060_000, boardPass: false, onHomeworkFrame: (f) => outFrames.push(f) });
  const htSent = JSON.stringify(ht.seen[0].messages);
  check('the check found is a fact of the turn', /answer check: part a: the student's answer matches the checked answer/.test(htSent), htSent.slice(-400));
  check('the record is a fact of the turn', /homework record: confirmed correct — part a; still open — part b/.test(htSent));
  check('the verdict frame went out', JSON.stringify(outFrames) === '[{"type":"homework-keyed-verdict","part":"a","verdict":"correct"}]', outFrames);
  check('the record is carried in the state', JSON.stringify(hr.state.homework) === '{"confirmed":["part:a"]}', hr.state.homework);

  console.log('no-reveal: the reply (design 4; cases of test-whole-answer-reveal.ts on the v2 path)');
  // The same numeric fixture as test-whole-answer-reveal.ts, as a one-part homework key.
  const GIVEN = 'A 10 kg block rests on a ramp inclined at 30 degrees. Take g = 9.8 m/s^2. Find the normal force.';
  const rampKey: AnswerKey = { parts: [{ label: '', final: '84.9 N', canonical: { kind: 'number', value: 84.9, units: 'N' } }], solvers: ['t'] };
  const rampProblem = { text: GIVEN, verified: true, hasFigure: false, parts: [''], noReveal: true };
  const ramp = { problem: rampProblem, key: rampKey, turn: hpTurn() };
  const rampState = said(newV2State(1_000_000), '[start]');
  const reply = async (text: string, extra: Partial<Parameters<typeof runV2HomeworkTurn>[0]> = {}) => {
    const m = stub([msg([{ type: 'text', text }], 'end_turn'), msg([{ type: 'text', text: 'Which force balances the part of the weight that presses into the ramp?' }], 'end_turn'), msg([{ type: 'text', text: 'Again: so it is about 84.9 N. What next?' }], 'end_turn')]);
    const streamed: string[] = [];
    const r = await runV2HomeworkTurn({ session: base, resolved: ramp, state: rampState, studentSaid: 'I think the normal force is 98 N', callModel: m.call, nowMs: 1_000_060_000, boardPass: false, onText: (d) => streamed.push(d), ...extra });
    return { r, calls: m.seen.length, seen: m.seen, streamed: streamed.join('') };
  };
  for (const sentence of ['That comes to 84.87 N.', 'It is about 84.9 newtons.', 'So $N \\approx 84.870\\,\\text{N}$.', 'You get roughly 85 N.', 'It works out to eighty-four point nine newtons.']) {
    const { r, calls, seen, streamed } = await reply(sentence);
    // The stub streams one 'x' per draft: only the second draft's reaches the student.
    check(`regenerated, never sent: "${sentence}"`, calls === 2 && streamed === 'x' && !r.spoken.includes(sentence) && /was not sent/.test(JSON.stringify(seen[1].messages)), { calls, spoken: r.spoken });
  }
  for (const sentence of ['You wrote 98 N — which direction does the normal force point?', 'The block is 10 kg on a 30° ramp, with g = 9.8.', 'What is 9.8 times 10?', 'Is it more or less than 98?']) {
    const { r, calls, streamed } = await reply(sentence);
    check(`sent as it is: "${sentence}"`, calls === 1 && r.spoken === sentence && streamed === 'x', { calls, streamed });
  }
  {
    // Both drafts state it: the sentences that do are cut, and the reply still hands the turn over.
    const m = stub([msg([{ type: 'text', text: 'Close. It is 84.9 N.' }], 'end_turn'), msg([{ type: 'text', text: 'N = 84.9 N.' }], 'end_turn')]);
    const r = await runV2HomeworkTurn({ session: base, resolved: ramp, state: rampState, studentSaid: 'just tell me', callModel: m.call, nowMs: 1_000_060_000, boardPass: false });
    const storedText = JSON.stringify(r.state.history.slice(-1));
    check('no empty text block is stored', r.state.history.every((h) => typeof h.content === 'string' || h.content.every((b) => b.type !== 'text' || b.text.trim())));
    check('a second revealing draft is cut, not sent', !/84\.9/.test(r.spoken) && /\?\s*$/.test(r.spoken) && !/84\.9/.test(storedText), { spoken: r.spoken, storedText });
  }
  {
    const { r, calls } = await reply('That comes to 84.87 N.', { resolved: { ...ramp, problem: { ...rampProblem, noReveal: false } } });
    check('a partner without the rule: the reply is not held (the board guard still is)', calls === 1 && r.spoken === 'That comes to 84.87 N.');
  }
  {
    // The student's own right answer may be said back to them.
    const m = stub([msg([{ type: 'text', text: 'Yes, 84.9 N is right.' }], 'end_turn')]);
    const r = await runV2HomeworkTurn({ session: base, resolved: ramp, state: rampState, studentSaid: 'N = 84.9 N', callModel: m.call, nowMs: 1_000_060_000, boardPass: false });
    check('the student\'s own value is not a reveal', m.seen.length === 1 && r.spoken === 'Yes, 84.9 N is right.');
  }

  console.log('no-reveal: the board (design 4)');
  const boardTurn = async (name: string, input: Record<string, unknown>, opts: { state?: V2State; resolvedOver?: object; studentSaid?: string | null } = {}) => {
    const m = stub([msg([{ type: 'text', text: 'Look at this.' }, { type: 'tool_use', id: 'b1', name, input }], 'tool_use'), msg([{ type: 'text', text: 'What do you notice?' }], 'end_turn')]);
    const r = await runV2HomeworkTurn({ session: base, resolved: { ...ramp, ...(opts.resolvedOver ?? {}) }, state: opts.state ?? rampState, studentSaid: opts.studentSaid === undefined ? 'I think the normal force is 98 N' : opts.studentSaid, callModel: m.call, nowMs: 1_000_060_000, boardPass: false });
    return r.toolCalls.find((c) => c.id === 'b1')?.outcome ?? '';
  };
  for (const [name, input] of [['show_equation', { latex: 'N = mg\\cos 30° \\approx 84.9\\,\\text{N}' }], ['annotate', { text: 'N ≈ 85 N' }]] as const) {
    check(`a board item with the key value is not painted: ${JSON.stringify(input)}`, /^not painted: .*value the problem asks the student to find/.test(await boardTurn(name, input as Record<string, unknown>)));
  }
  check('a board item with only the sheet\'s values is painted', !/^not /.test(await boardTurn('annotate', { text: 'm = 10 kg, θ = 30°, g = 9.8' })));
  const opening = newV2State(1_000_000);
  check('the opening reply draws nothing over a problem whose figure is on screen', /figure is already on the board/.test(await boardTurn('show_geometry', { points: [] }, { state: opening, studentSaid: null, resolvedOver: { problem: { ...rampProblem, hasFigure: true } } })));

  console.log('the session around the turn (designs 7–9)');
  const src = (f: string) => readFileSync(path.join(__dirname, '..', f), 'utf8');
  const turnsSrc = src('src/app/tutor/components/v2/useV2Turns.ts');
  const sessionSrc = src('src/app/tutor/components/session/TutorSession.tsx');
  const clientSrc = src('src/app/tutor/components/v2/TutorClientV2.tsx');
  check('the v2 client reports a homework plan\'s problem, as VTR does', /onHomeworkProblem\?\.\(homeworkProblemOf\(/.test(turnsSrc));
  const v2Render = sessionSrc.slice(sessionSrc.indexOf('<TutorClientV2'), sessionSrc.indexOf('/>', sessionSrc.indexOf('<TutorClientV2')));
  check('the session gives it the problem panel', /onHomeworkProblem=\{setHomeworkProblem\}/.test(v2Render));
  check('the host\'s farewell reaches the v2 end', /endSession: \(opts\) => end\(opts\)/.test(clientSrc) && /const end = useCallback\(\(opts\?: \{ farewell\?: string \}\)/.test(turnsSrc));
  const hwPlan = { los: [{ id: 'p.lo-1', description: 'Work problem 3.', shortTitle: 'Work problem 3' }], metadata: { kind: 'homework-problem', parentPlanId: 'x', n: 3, text: TEXT, figure: null, verified: true } };
  check('practice for a homework problem is on the problem, not on "Problem 3"', practiceLoTitle(hwPlan as never, 'p.lo-1').startsWith('In △ABC, side BC is extended to D.') && !practiceLoTitle(hwPlan as never, 'p.lo-1').includes('[Figure'), practiceLoTitle(hwPlan as never, 'p.lo-1'));
  check('an ordinary plan keeps its objective\'s title', practiceLoTitle({ los: [{ id: 'l1', description: 'Long', shortTitle: 'Short' }] } as never, 'l1') === 'Short');

  console.log('whole-sheet homework (design 10)');
  const SHEET = [
    { n: 1, text: 'Solve 2x + 1 = 7.' },
    { n: 2, text: 'Solve 3y - 4 = 11.' },
    { n: 3, text: 'Describe what a ramp does to the force needed to lift a box.' },
  ];
  const sheetPlan = { id: 'sheet-1', los: [{ id: 'sheet-1.homework-lo-1', description: 'Work the uploaded problems in order.', shortTitle: 'Linear equations' }], segments: [], metadata: { kind: 'homework-help', problems: SHEET } };
  const k = (final: string, value: number): AnswerKey => ({ parts: [{ label: '', final, canonical: { kind: 'number', value } }], solvers: ['t'] });
  const build = { problems: [{ n: 1, key: k('x = 3', 3), status: 'ready' }, { n: 2, key: k('y = 5', 5), status: 'ready' }, { n: 3, status: 'failed' }] };
  const sheetR = await v2SheetFor(sheetPlan as never, 'greenapple', { getBuild: async () => build as never, env: {} });
  check('a homework-help plan with problems is a sheet, keys held apart', !!sheetR && sheetR.sheet.problems.length === 3 && sheetR.sheet.problems[0].verified && !sheetR.sheet.problems[2].verified && !!sheetR.keys[1] && !JSON.stringify(sheetR.sheet).includes('x = 3'));
  check('a one-problem plan is not a sheet', (await v2SheetFor({ metadata: { kind: 'homework-problem', problems: SHEET } } as never, 'greenapple', { getBuild: async () => build as never })) === null);
  const sheetSession: V2Session = { ...base, homeworkSheet: sheetR!.sheet, plan: sheetPlan as never };
  const sheetPart = v2SessionPart(sheetSession);
  // Cases of test-homework-session-block.ts: every problem listed by number, the rules, no answers.
  check('the sheet part lists every problem by its number', SHEET.every((p) => sheetPart.includes(`${p.n}. ${p.text}`)), sheetPart.slice(0, 600));
  check('the sheet part says to use set_current_problem and that any order is fine', /set_current_problem/.test(sheetPart) && /any order/i.test(sheetPart));
  check('the sheet part carries the no-reveal principle and the conduct rules', /never state it, even when they ask/i.test(sheetPart) && /trusted adult/i.test(sheetPart));
  check('no key value in the sheet part', !/x = 3|y = 5/.test(sheetPart));

  let sst = said(newV2State(1_000_000), '[start]');
  const sheetTurn = async (studentSaid: string | null, replies: Anthropic.Message[], stIn: V2State = sst) => {
    const m = stub(replies); const fr: unknown[] = [];
    const r = await runV2SheetTurn({ session: sheetSession, resolvedSheet: sheetR!, state: stIn, studentSaid, callModel: m.call, nowMs: 1_060_000, boardPass: false, onHomeworkFrame: (f) => fr.push(f) });
    return { r, m, fr };
  };
  const t1 = await sheetTurn('x = 4', [msg([{ type: 'text', text: 'Not quite. What do you subtract first?' }], 'end_turn')]);
  check('a sheet session is offered set_current_problem', !!t1.m.seen[0].tools?.some((t) => t.name === 'set_current_problem'));
  check('the current problem (the first) is checked against its own key', /does not match/.test(JSON.stringify(t1.m.seen[0].messages)) && !/x = 3/.test(JSON.stringify(t1.m.seen[0].messages)));
  check('the facts name the problem in play and what is open', /homework sheet: problem 1 of 3 is current; solved — none; open — 1, 2, 3/.test(JSON.stringify(t1.m.seen[0].messages)), JSON.stringify(t1.m.seen[0].messages).slice(-500));
  sst = t1.r.state;
  const t2 = await sheetTurn('x = 3', [msg([{ type: 'text', text: 'Yes! Problem 1 is done. Shall we do problem 2?' }], 'end_turn')]);
  check('a right answer solves the problem in play', JSON.stringify(t2.r.state.homework?.sheet?.solved) === '[1]', t2.r.state.homework);
  check('the solved frame goes out with its position', JSON.stringify(t2.fr).includes('"type":"homework-sheet-solved","n":1,"position":1'), t2.fr);
  sst = t2.r.state;
  // Out of order: the student names problem 3, then skips to 2 by the tutor's tool.
  const t3 = await sheetTurn('can we do problem 3 first?', [msg([{ type: 'text', text: 'Sure.' }, { type: 'tool_use', id: 's1', name: 'set_current_problem', input: { n: 3 } }], 'tool_use'), msg([{ type: 'text', text: 'What does a ramp change?' }], 'end_turn')]);
  check('set_current_problem moves to any problem on the sheet', t3.r.state.homework?.sheet?.current === 3, t3.r.toolCalls.map((t) => t.outcome));
  const t3b = await sheetTurn('ok', [msg([{ type: 'tool_use', id: 's2', name: 'set_current_problem', input: { n: 9 } }], 'tool_use'), msg([{ type: 'text', text: 'Hm.' }], 'end_turn')], t3.r.state);
  check('…but not to one that is not on it', t3b.r.state.homework?.sheet?.current === 3 && /^not /.test(t3b.r.toolCalls[0].outcome));
  const t4 = await sheetTurn('y = 5 for problem 2', [msg([{ type: 'text', text: 'Right.' }], 'end_turn')], t3.r.state);
  check('naming a problem in the message checks it against that problem', JSON.stringify(t4.r.state.homework?.sheet?.solved) === '[1,2]' && t4.r.state.homework?.sheet?.current === 2, t4.r.state.homework);
  // Cases of test-homework-advance.ts: the sheet is not left with problems open unless the student asks.
  const t5 = await sheetTurn('hm', [msg([{ type: 'text', text: 'Good work.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { summary: 's', because: 'lesson_complete' } }], 'tool_use'), msg([{ type: 'text', text: 'Which one next?' }], 'end_turn')], t4.r.state);
  check('the session does not end itself with a problem open', !t5.r.state.closed);
  const t6 = await sheetTurn("let's stop for today", [msg([{ type: 'text', text: 'Okay.' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { summary: 's', because: 'student_asked' } }], 'tool_use')], t4.r.state);
  check('the student may stop with one open', t6.r.state.closed);
  const unverifiedTurn = await sheetTurn('a ramp makes it easier', [msg([{ type: 'text', text: 'Why?' }], 'end_turn')], { ...t3.r.state });
  check('a problem with no key is never graded', !/answer check/.test(JSON.stringify(unverifiedTurn.m.seen[0].messages)));
  // Review (Important 1): the tutor offered problem 2 without calling set_current_problem; the student just answers.
  const offered: V2State = { ...t2.r.state, history: [...t2.r.state.history] };
  const t7 = await sheetTurn('y = 5', [msg([{ type: 'text', text: 'Right.' }], 'end_turn')], offered);
  check('after a solved problem, an answer goes to the open problem the tutor offered', t7.r.state.homework?.sheet?.current === 2 && JSON.stringify(t7.r.state.homework?.sheet?.solved) === '[1,2]', t7.r.state.homework?.sheet);
  const t8 = await sheetTurn('y = 5', [msg([{ type: 'text', text: 'Right.' }], 'end_turn')], { ...t2.r.state, history: [...t2.r.state.history.slice(0, -1), { role: 'assistant', content: [{ type: 'text', text: 'Good. What next?' }] }] });
  check('…or, with none named, to the first open one', t8.r.state.homework?.sheet?.current === 2 && JSON.stringify(t8.r.state.homework?.sheet?.solved) === '[1,2]', t8.r.state.homework?.sheet);
  // Review (Important 2): one problem's given data is not another problem's withheld answer.
  {
    const gSheet = { problems: [{ n: 1, text: 'A bag has 22 marbles. How many are red if 7 are blue?', verified: true, parts: [''] }, { n: 2, text: 'Add 10 and 12.', verified: true, parts: [''] }], noReveal: true };
    const gKeys = { 1: k('15', 15), 2: k('22', 22) };
    const m = stub([msg([{ type: 'text', text: 'Problem 1 says there are 22 marbles in the bag. How many are blue?' }], 'end_turn')]);
    const r = await runV2SheetTurn({ session: { ...base, homeworkSheet: gSheet }, resolvedSheet: { sheet: gSheet, keys: gKeys }, state: said(newV2State(1_000_000), '[start]'), studentSaid: 'help with problem 1', callModel: m.call, nowMs: 1_060_000, boardPass: false });
    check('a value the sheet gives is never withheld, whichever problem it answers', m.seen.length === 1 && /22 marbles/.test(r.spoken), r.spoken);
  }

  const rev = await sheetTurn('just tell me problem 2', [msg([{ type: 'text', text: 'It is y = 5.' }], 'end_turn'), msg([{ type: 'text', text: 'What do you add to both sides first?' }], 'end_turn')], t2.r.state);
  check('no-reveal holds per problem on the sheet', rev.m.seen.length === 2 && !/y = 5/.test(rev.r.spoken));

  {
    const one = stub([msg([{ type: 'text', text: 'Hi.' }], 'end_turn')]);
    await runV2Turn({ session: hwSession, state: newV2State(0), studentSaid: null, callModel: one.call, nowMs: 0, boardPass: false });
    check('a one-problem session is not offered set_current_problem', !one.seen[0].tools?.some((t) => t.name === 'set_current_problem'));
  }
  // The client: the solved frame reaches the hook.
  const sheetFrames: unknown[] = [];
  const sbody = [{ type: 'homework-sheet-solved', n: 2, position: 2, solved: [1, 2], total: 3 }, { type: 'done', spoken: '', state: newV2State(0), usage: {}, firstTextMs: 1, totalMs: 2 }].map((f) => `data: ${JSON.stringify(f)}\n\n`).join('');
  await streamV2Turn({ session: { subject: 'math', level: '9', mode: 'text' }, state: newV2State(0), studentSaid: 'x', onHomework: (ev) => sheetFrames.push(ev), fetchImpl: (async () => new Response(sbody, { status: 200 })) as typeof fetch });
  check('the client hands on the sheet\'s solved frame', JSON.stringify(sheetFrames) === '[{"type":"homework-sheet-solved","n":2,"position":2,"solved":[1,2],"total":3}]', sheetFrames);
  check('the v2 client reports the sheet\'s progress for the rail, as VTR does', /onHomeworkProgress\?\.\(/.test(turnsSrc) && /homework_problem_solved/.test(turnsSrc));
  check('the session gives the v2 client the rail', /onHomeworkProgress=\{setHomeworkProgress\}/.test(v2Render));
  check('the rail shows how many are solved', /solved/.test(src('src/app/tutor/components/session/SessionStage.tsx').slice(src('src/app/tutor/components/session/SessionStage.tsx').indexOf('const homeworkRail'), src('src/app/tutor/components/session/SessionStage.tsx').indexOf('const railEl'))));

  console.log('outcome parity with v1 (design 3)');
  // The debug events a v2 session records (useV2Turns) for: a solved problem, and one wrong twice on (b).
  const ev = (part: string, verdict: 'correct' | 'incorrect') => ({ type: 'homework_keyed_verdict', message: formatKeyedVerdictDebug(part, verdict) });
  const solvedEvents = [ev('a', 'correct'), ev('b', 'correct'), { type: 'homework_problem_done', message: 'all key parts confirmed' }];
  const transcript = [{ role: 'tutor', text: 'Which angles?' }, { role: 'student', text: 'x = 30' }, { role: 'tutor', text: 'Right. (b)?' }, { role: 'student', text: '(b) 100' }];
  check('a solved v2 session is done', classifyHomeworkProblemOutcome({ debugEvents: solvedEvents, transcript, verified: true, key: KEY }) === 'done');
  // As stored: each event and each transcript entry carries its time, so two wrong answers on two turns count twice.
  const at = (e: { type: string; message: string }, t: number) => ({ ...e, timestamp: new Date(t) });
  const wrongTwice = [at(ev('a', 'correct'), 1500), at(ev('b', 'incorrect'), 2500), at(ev('b', 'incorrect'), 3500)];
  const wtTranscript = [{ role: 'student', text: 'x = 30', timestamp: new Date(1000) }, { role: 'student', text: '(b) 80', timestamp: new Date(2000) }, { role: 'student', text: '(b) 90', timestamp: new Date(3000) }];
  check('a v2 session wrong twice on (b) needs review', classifyHomeworkProblemOutcome({ debugEvents: wrongTwice, transcript: wtTranscript, verified: true, key: KEY }) === 'needs_review');
  check('the events the checker yields are the ones v1 records', (await v2HomeworkCheck({ key: KEY, problem: hwSession.homework!, state: said(newV2State(0), '[start]'), studentSaid: 'x = 30' })).verdicts.map((v) => formatKeyedVerdictDebug(v.part, v.verdict as 'correct')).join() === 'keyed part=a verdict=correct');

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
