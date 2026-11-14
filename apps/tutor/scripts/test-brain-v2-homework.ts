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
import { readHomeworkState, v2HomeworkFor, v2HomeworkSession } from '../src/lib/tutor/v2/homework';

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

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
