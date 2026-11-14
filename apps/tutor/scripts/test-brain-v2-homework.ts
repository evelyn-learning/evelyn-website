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
import { readHomeworkState, v2HomeworkCheck, v2HomeworkFor, v2HomeworkSession } from '../src/lib/tutor/v2/homework';
import { streamV2Turn } from '../src/lib/tutor/v2/client';
import { runV2HomeworkTurn } from '../src/lib/tutor/v2/homework-turn';
import { classifyHomeworkProblemOutcome } from '../src/lib/tutor/homework-build/outcome';
import { formatKeyedVerdictDebug } from '../src/lib/tutor/voice/keyed-verdict';
import type { V2State } from '../src/lib/tutor/v2/types';

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
  check('an unverified problem is never graded right or wrong', /never say whether the student's final answer is right or wrong/i.test(unverified));

  console.log('facts (design 6)');
  const s0 = newV2State(1_000_000);
  const facts = renderFacts(session, s0, { nowMs: 1_000_000 + 3 * 60000 });
  check('homework facts say the session ends when the problem is done', /ends when this problem is done/.test(facts) && !/not at its close/.test(facts), facts);
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
