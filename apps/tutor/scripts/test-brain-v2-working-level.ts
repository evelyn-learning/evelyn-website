/// <reference types="node" />
/**
 * Tutor brain v2 — the one-time level check, remembered (v2/working-level.ts): the `set_working_level` control
 * tool, the working level in every turn's facts, the session part's level section, the skip of a part marked
 * "skip when the level is known", the estimate fallback's trigger, and what the profile commit carries. No network.
 *   npm run test:brain-v2-working-level
 *
 * Learner lines are paraphrased from the v1 live sessions (docs/superpowers/plans/2026-11-15-gdi-v1-live-sessions-findings.md:
 * case 1, "Could you please rephrase that?" in the level check; case 11, a second person on the same link).
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { WORKING_LEVELS, LEVEL_ALREADY_SET_NOTE } from '../src/lib/tutor/level/working-level';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2LanguagesSection } from '../src/lib/tutor/v2/languages';
import { v2ProfileCommit } from '../src/lib/tutor/v2/memory';
import { V2_CONTROL_TOOL_NAMES } from '../src/lib/tutor/v2/tool-names';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { V2_LEVEL_CHECK_MAX_REPLIES, v2AnswerHasContent, v2DeclinesLevel, v2LevelEstimateDue, v2LevelSetTooEarly, v2ReadWorkingLevel, v2SeedWorkingLevel, v2WorkingLevelCommit, v2WorkingLevelFacts, v2WorkingLevelSection } from '../src/lib/tutor/v2/working-level';
import { TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS, TUTOR_V2_LEVEL_RECONFIRM } from '../src/lib/tutor/orchestrator/flags';
import { streamV2Turn } from '../src/lib/tutor/v2/client';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); return r; };
  return { call, seen };
}
const setLevel = (level: string, id = 't1') => msg([{ type: 'text', text: 'Thank you. Now, tell me about your weekend.' }, { type: 'tool_use', id, name: 'set_working_level', input: { level, evidence: 'short answers' } }], 'tool_use');
const words = (text: string) => msg([{ type: 'text', text }], 'end_turn');

const PLAN = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages', schemaVersion: 1, estimatedMinutes: 25,
  los: [{ id: 'lo.pp', description: 'Use the past simple for finished events.' }],
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'level-check', kind: 'misconception_check', question: 'Can you tell me about your job?', estimatedMinutes: 3, metadata: { skipWhenLevelKnown: true } },
    { id: 'past-simple', kind: 'try_yourself', problem: 'What did you do last weekend?', responseFormat: 'free', estimatedMinutes: 4 },
    { id: 'summary', kind: 'recap', mustRemember: ['Past simple: finished events.'], estimatedMinutes: 2 },
  ],
} as unknown as LessonPlan;

const base: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 25, plan: PLAN };
const checked: V2Session = { ...base, levelCheck: true };
const bilingual: V2Session = { ...checked, languages: ['en', 'ja'] };
const factsOf = (session: V2Session, state: V2State, heard: string | null = null) => renderFacts(session, state, { nowMs: state.startedAtMs + 60000, heard });
const withLevel = (level: V2State['workingLevel']): V2State => ({ ...newV2State(1000), ...(level ? { workingLevel: level } : {}) });
/** A history in which the student has replied `n` times. */
function replied(state: V2State, n: number): V2State {
  const history: Anthropic.MessageParam[] = [{ role: 'user', content: [{ type: 'text', text: '[The session has just started.]' }] }, { role: 'assistant', content: [{ type: 'text', text: 'Hello! How are you today?' }] }];
  for (let i = 0; i < n; i++) history.push({ role: 'user', content: [{ type: 'text', text: `I am fine ${i}` }] }, { role: 'assistant', content: [{ type: 'text', text: 'Good.' }] });
  return { ...state, history };
}

async function main() {
  console.log('the gate: the partner option');
  const plain = v2SessionPart(base);
  check('without the option the session part has no level section', !/WORKING LEVEL/.test(plain));
  check('the option off is byte-identical to the option missing', v2SessionPart({ ...base, levelCheck: false }) === plain);
  const part = v2SessionPart(checked);
  check('with it the session part carries the level section', part.includes(v2WorkingLevelSection()) && /WORKING LEVEL/.test(part));
  const hw: V2Session = { ...checked, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } };
  check('a homework session of the same partner has no level check: no section, no facts', !/WORKING LEVEL/.test(v2SessionPart(hw)) && !/working level/.test(renderFacts(hw, newV2State(1000), { nowMs: 61000 })));
  check('a level check is a control tool: never painted on the board', V2_CONTROL_TOOL_NAMES.has('set_working_level'));
  {
    const s = stub([words('Hello.')]);
    await runV2Turn({ session: base, state: newV2State(), studentSaid: null, callModel: s.call, boardPass: false, mathsCheck: false });
    check('without the option the tool is not offered', !(s.seen[0].tools ?? []).some((t) => (t as Anthropic.Tool).name === 'set_working_level'));
    const s2 = stub([words('Hello.')]);
    await runV2Turn({ session: checked, state: newV2State(), studentSaid: null, callModel: s2.call, boardPass: false, mathsCheck: false });
    check('with it the tool is offered', (s2.seen[0].tools ?? []).some((t) => (t as Anthropic.Tool).name === 'set_working_level'));
  }

  console.log('the level section of the session part');
  const sec = v2WorkingLevelSection();
  check('it uses the ladder level/working-level.ts uses, and only that', WORKING_LEVELS.every((l) => sec.includes(l)) && !/lower-intermediate|upper-intermediate|\bA1\b|\bB2\b/i.test(sec), sec);
  check('the level is never told to the learner', /Never tell the learner/.test(sec) && /CEFR/.test(sec));
  check('material marked per level: only the working level\'s version is taught', /\[beginner\]/.test(sec) && /only the one marked/.test(sec));
  check('it names no partner', !/gdi|nagoya|josh|james/i.test(sec));

  console.log('the tool');
  {
    // Two answers given before, the third now: the check's three questions are answered (D7).
    const s = stub([setLevel('beginner'), words('Tell me more.')]);
    const r = await runV2Turn({ session: checked, state: replied(newV2State(), 2), studentSaid: 'I am... work... bank.', callModel: s.call, boardPass: false, mathsCheck: false });
    check('a first set holds the level, from this lesson', r.state.workingLevel?.level === 'beginner' && r.state.workingLevel?.from === 'this_lesson', r.state.workingLevel);
    check('the result tells the tutor not to announce it', /Do not tell the learner which level/.test(r.toolCalls[0]?.outcome ?? ''), r.toolCalls[0]?.outcome);
    const s2 = stub([setLevel('advanced', 't2'), words('Go on.')]);
    const r2 = await runV2Turn({ session: checked, state: r.state, studentSaid: 'Actually I speak well.', callModel: s2.call, boardPass: false, mathsCheck: false });
    check('a second set in the same lesson is refused and the level stays', r2.state.workingLevel?.level === 'beginner' && r2.toolCalls[0]?.outcome.includes(LEVEL_ALREADY_SET_NOTE), r2.toolCalls[0]?.outcome);
    const s3 = stub([setLevel('expert', 't3'), words('Go on.')]);
    const r3 = await runV2Turn({ session: checked, state: newV2State(), studentSaid: 'Hi', callModel: s3.call, boardPass: false, mathsCheck: false });
    check('a level outside the ladder is refused', !r3.state.workingLevel && /^not set/.test(r3.toolCalls[0]?.outcome ?? ''), r3.toolCalls[0]?.outcome);
    const s4 = stub([setLevel('intermediate', 't4'), words('Go on.')]);
    const r4 = await runV2Turn({ session: checked, state: withLevel({ level: 'advanced', from: 'earlier_lesson' }), studentSaid: 'Hello... I... sorry, my English...', callModel: s4.call, boardPass: false, mathsCheck: false });
    check('a remembered level may be revised once (a second person on the same link, case 11)', r4.state.workingLevel?.level === 'intermediate' && r4.state.workingLevel?.from === 'this_lesson', r4.state.workingLevel);
    const s5 = stub([setLevel('beginner', 't5'), words('Hello.')]);
    const r5 = await runV2Turn({ session: base, state: newV2State(), studentSaid: 'Hi', callModel: s5.call, boardPass: false, mathsCheck: false });
    check('without the option the tool does nothing', !r5.state.workingLevel && /unknown tool/.test(r5.toolCalls[0]?.outcome ?? ''), r5.toolCalls[0]?.outcome);
  }

  console.log('the facts carry the level, every turn');
  check('without the option the facts say nothing of a level', !/working level/.test(factsOf(base, withLevel({ level: 'beginner', from: 'this_lesson' }))));
  const unknown = factsOf(checked, newV2State(1000), 'Could you please rephrase that?');
  check('not known: the facts say so, and the check is three conversational questions then the tool', /working level: not known yet/.test(unknown) && /three/.test(unknown) && /set_working_level/.test(unknown), unknown);
  check('confusion is not an answer: the SAME question again, more simply (case 1: v1 asked the next one)', /not an answer/.test(unknown) && /same question/i.test(unknown) && /more simply/.test(unknown) && /simpler English/.test(unknown), unknown);
  const unknownJa = factsOf(bilingual, newV2State(1000));
  check('in a bilingual lesson the second try has help in the support language', /then with a few words of Japanese/.test(unknownJa), unknownJa);
  check('in an English-only lesson it names no support language', !/Japanese/.test(unknown) && /then with an example/.test(unknown), unknown);
  const set = factsOf(checked, withLevel({ level: 'intermediate', from: 'this_lesson' }));
  check('set this lesson: the level is in the facts, and is not checked again', /working level: intermediate/.test(set) && /not check it again/.test(set) && !/not known/.test(set), set);
  check('every turn: the level is in the facts later in the lesson too', /working level: intermediate/.test(factsOf(checked, replied(withLevel({ level: 'intermediate', from: 'this_lesson' }), 6), 'I went to Osaka.')));
  const rememberedOpen = factsOf(checked, withLevel({ level: 'advanced', from: 'earlier_lesson' }));
  check('remembered, at the opening: one light question confirms it, naming the level once (case 11, D6)', /working level: advanced, remembered from an earlier lesson/.test(rememberedOpen) && /one light question to confirm it/.test(rememberedOpen) && rememberedOpen.includes('"Last time we worked at advanced level. Does that still feel right?"') && /Not a test/.test(rememberedOpen), rememberedOpen);
  const offOpen = v2WorkingLevelFacts(checked, withLevel({ level: 'advanced', from: 'earlier_lesson' }), null, { reconfirm: false }).join('\n');
  check('kill switch off: one natural question, no level named, as before', /one natural question/.test(offOpen) && /name no level/.test(offOpen) && !/Last time we worked/.test(offOpen), offOpen);
  check('remembered: the parts marked to skip are skipped', /skipped/.test(rememberedOpen));
  const rememberedFirst = factsOf(checked, replied(withLevel({ level: 'advanced', from: 'earlier_lesson' }), 0), 'Hello. I... am fine. Sorry, English is difficult.');
  check('remembered, on their first reply: that reply is the check, and another level is set with the tool', /their reply just now/i.test(rememberedFirst) && /set_working_level/.test(rememberedFirst), rememberedFirst);
  const rememberedLater = factsOf(checked, replied(withLevel({ level: 'advanced', from: 'earlier_lesson' }), 3), 'Yes.');
  check('remembered, later: the level alone, no more re-checking', /working level: advanced/.test(rememberedLater) && !/one natural question|their reply just now/i.test(rememberedLater), rememberedLater);

  console.log('a "no" to the light confirm re-opens the level check (D6)');
  {
    check('the kill switches default on', TUTOR_V2_LEVEL_RECONFIRM === true && TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS === true);
    for (const no of ['No.', 'No, not really.', 'Hmm, not really.', 'Not sure.', 'I\'m not sure.', 'It\'s a bit too difficult.', 'Too hard for me.', 'いいえ', 'ちょっと難しいです', 'わかりません']) check(`a no: "${no}"`, v2DeclinesLevel(no));
    for (const yes of ['Yes.', 'Yes, it feels right.', 'No problem, that is fine.', 'I think so.', 'Sure, let\'s go.', 'はい、大丈夫です', 'I have no idea about grammar but yes.', '[The student has not replied.]']) check(`not a no: "${yes}"`, !v2DeclinesLevel(yes));
    // The shared-link run: b1's id, a new learner. The opening asked the light question; they answer "No".
    const opened = { ...withLevel({ level: 'intermediate', from: 'earlier_lesson' }), history: [{ role: 'user' as const, content: [{ type: 'text' as const, text: '[The session has just started.]' }] }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Hello, I\'m Ryota. Last time we worked at intermediate level. Does that still feel right?' }] }], goals: { 'level-check': { status: 'skipped' as const, why: 'working level known from an earlier lesson', at: 1000 } } };
    const s = stub([words('Thank you. Then let me ask you three short questions. What is your job?')]);
    const r = await runV2Turn({ session: checked, state: opened, studentSaid: 'No, not really. It was too difficult.', callModel: s.call, boardPass: false, mathsCheck: false, nowMs: 61000 });
    const facts = JSON.stringify(s.seen[0].messages.at(-1));
    check('the remembered level is set aside and the level-check part comes back', !r.state.workingLevel && !r.state.goals['level-check'], [r.state.workingLevel, r.state.goals]);
    check('the facts of that turn say so and ask for the three questions', /did not fit them/.test(facts) && /level check is open again/.test(facts) && /not known yet. Find it with three/.test(facts) && !/level-check=skipped/.test(facts), facts.slice(0, 900));
    const s2 = stub([words('Great, let\'s begin.')]);
    const r2 = await runV2Turn({ session: checked, state: opened, studentSaid: 'Yes, that feels right.', callModel: s2.call, boardPass: false, mathsCheck: false, nowMs: 61000 });
    check('a yes keeps the remembered level and the skip', r2.state.workingLevel?.level === 'intermediate' && r2.state.goals['level-check']?.status === 'skipped' && /answers whether that level still feels right/.test(JSON.stringify(s2.seen[0].messages.at(-1))));
    const later = { ...replied(withLevel({ level: 'intermediate', from: 'earlier_lesson' }), 2), goals: opened.goals };
    const s3 = stub([words('Good.')]);
    const r3 = await runV2Turn({ session: checked, state: later, studentSaid: 'No.', callModel: s3.call, boardPass: false, mathsCheck: false, nowMs: 61000 });
    check('a "no" later in the lesson (to some other question) re-opens nothing', r3.state.workingLevel?.level === 'intermediate');
    const r4 = await runV2Turn({ session: checked, state: opened, studentSaid: 'No.', callModel: stub([words('Hi.')]).call, boardPass: false, mathsCheck: false, nowMs: 61000 });
    check('…and a "no" re-opens only in a session with the level check, from a remembered level', !r4.state.workingLevel);
    const r5 = await runV2Turn({ session: base, state: opened, studentSaid: 'No.', callModel: stub([words('Hi.')]).call, boardPass: false, mathsCheck: false, nowMs: 61000 });
    check('without the option nothing changes', r5.state.workingLevel?.level === 'intermediate');
  }

  console.log('the level waits for three answers (D7)');
  {
    for (const none of ['Yes.', 'No.', 'Yes, I\'m ready.', 'Yes, thank you. That sounds good.', 'Yes, that sounds good. Thank you for the lesson today.', 'Please, could you please rephrase that, please?', 'Uh, sorry. I don\'t understand.', 'No, I haven\'t.', 'Oh, yes.', 'はい', '[The student has not replied.]']) check(`no answer in it: "${none}"`, !v2AnswerHasContent(none));
    for (const some of ['I work as admin at the company. Could you explain that in Japanese?', 'I\'m checking emails and sorting out some paperwork.', 'Make car.', 'I\'m engineer.', 'Yes, I went swimming.', '仕事で、メールとミーティングで英語を使います']) check(`an answer: "${some}"`, v2AnswerHasContent(some));
    // real-t2: the job, the tasks, then "No." twice to two questions: the level was set there (Task 6, D7).
    const t2 = (said: string[]): V2State => ({ ...newV2State(0), history: said.flatMap((x) => [{ role: 'user' as const, content: [{ type: 'text' as const, text: x }] }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Thank you. Next question?' }] }]) });
    const before = t2(['[The session has just started.]', 'Yes, thank you. That sounds good.', 'Yes, I\'m ready.', 'Please, could you please rephrase that, please?', 'I work as admin at the company. Could you explain that in Japanese?', 'I\'m checking emails and sorting out some paperwork.', 'No.']);
    const early = v2LevelSetTooEarly(before, 'No.');
    check('real-t2 after two "No."s: refused, with the count and what to do', !!early && /answered 2 of the level check's 3 questions/.test(early) && /Ask your next level-check question/.test(early), early);
    const s = stub([setLevel('beginner'), words('Have you ever written an email in English?')]);
    const r = await runV2Turn({ session: checked, state: before, studentSaid: 'No.', callModel: s.call, boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('…in the turn: no level held, the result says why, and the tutor asks on', !r.state.workingLevel && /^not set: they have answered 2/.test(r.toolCalls.find((c) => c.name === 'set_working_level')?.outcome ?? ''), r.toolCalls.map((c) => c.outcome));
    check('a third answer lets it through', v2LevelSetTooEarly(before, 'I write emails to customers in Japan.') === null);
    check('they asked to skip the check: it goes through', v2LevelSetTooEarly(t2(['Yes.', 'Can we skip the questions and start?']), null) === null);
    check('the time is up: it goes through', v2LevelSetTooEarly(t2(['Yes.']), 'No.', { timeUp: true }) === null);
    check('past the check\'s reply budget with no answer of content: still held (real-t2 was past it at this very call)', v2LevelSetTooEarly(t2(Array.from({ length: V2_LEVEL_CHECK_MAX_REPLIES }, () => 'No.')), 'No.') !== null);
    check('…and once answers with content come later in the lesson, it goes through', v2LevelSetTooEarly(t2([...Array.from({ length: V2_LEVEL_CHECK_MAX_REPLIES }, () => 'No.'), 'I sell car parts.', 'I visit customers.']), 'I write reports.') === null);
    check('a remembered level\'s revision is not held', v2LevelSetTooEarly(withLevel({ level: 'advanced', from: 'earlier_lesson' }), 'Hello... I... sorry.') === null);
    check('the kill switch off: never held', v2LevelSetTooEarly(t2(['Yes.']), 'No.', { enabled: false }) === null);
  }

  console.log('the check is one phase: over without a level, the facts stop inviting it (review I1)');
  const OVER = /level check is over: do not check it again/;
  const g0 = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, status], i) => [k, { status: status as never, at: 10 + i }]));
  // Estimate off, failed or not back yet: the lesson has moved past the level-check part and no level is held.
  const past = factsOf(checked, { ...replied(newV2State(1000), 4), goals: g0({ overview: 'shown', 'level-check': 'demonstrated', 'past-simple': 'shown' }) }, 'I went to Kyoto.');
  check('past the level-check part with no level (estimate off, failed or still on its way): no invitation, a middle pitch', OVER.test(past) && /Pitch at intermediate/.test(past) && !/Find it with three/.test(past), past);
  const during = factsOf(checked, { ...replied(newV2State(1000), 2), goals: g0({ overview: 'shown', 'level-check': 'shown' }) }, 'I work in a bank.');
  check('during the check it is still asked for', /not known yet/.test(during) && !OVER.test(during), during);
  const noPart: V2Session = { ...checked, plan: { ...PLAN, segments: PLAN.segments.filter((x) => x.id !== 'level-check') } as LessonPlan };
  check('a plan with no level-check part: the check runs, then ends after its reply budget', /not known yet/.test(factsOf(noPart, replied(newV2State(1000), 2), 'Yes.')) && OVER.test(factsOf(noPart, replied(newV2State(1000), V2_LEVEL_CHECK_MAX_REPLIES), 'Yes.')));
  const noPlan: V2Session = { ...checked, plan: undefined, topic: 'small talk' };
  check('no plan at all: the same budget ends it', /not known yet/.test(factsOf(noPlan, newV2State(1000))) && OVER.test(factsOf(noPlan, replied(newV2State(1000), V2_LEVEL_CHECK_MAX_REPLIES), 'Yes.')) && !OVER.test(factsOf(noPlan, replied(newV2State(1000), V2_LEVEL_CHECK_MAX_REPLIES - 1), 'Yes.')));
  check('a plan whose tutor never marks the part: the budget ends it too', OVER.test(factsOf(checked, replied(newV2State(1000), V2_LEVEL_CHECK_MAX_REPLIES), 'Yes.')));
  check('a level set later still ends the over line: the level is in the facts', /working level: beginner \(set this lesson/.test(factsOf(checked, { ...replied(withLevel({ level: 'beginner', from: 'this_lesson' }), 9) }, 'ok')));

  console.log('the part to skip when the level is known');
  {
    const s = stub([words('Hello again!')]);
    const r = await runV2Turn({ session: checked, state: withLevel({ level: 'advanced', from: 'earlier_lesson' }), studentSaid: null, callModel: s.call, boardPass: false, mathsCheck: false });
    check('a remembered level marks the level-check part skipped before the tutor speaks', r.state.goals['level-check']?.status === 'skipped' && /level/.test(r.state.goals['level-check']?.why ?? ''), r.state.goals);
    check('the tutor sees it skipped in the facts of that turn', /level-check=skipped/.test(JSON.stringify(s.seen[0].messages.at(-1))));
    check('other parts are left alone', !r.state.goals.overview && !r.state.goals['past-simple']);
    const s2 = stub([words('Hello!')]);
    const r2 = await runV2Turn({ session: checked, state: newV2State(), studentSaid: null, callModel: s2.call, boardPass: false, mathsCheck: false });
    check('no level: the part is not skipped', !r2.state.goals['level-check']);
    const s3 = stub([words('Next.')]);
    const r3 = await runV2Turn({ session: checked, state: { ...withLevel({ level: 'beginner', from: 'earlier_lesson' }), goals: { 'level-check': { status: 'demonstrated', at: 5 } } }, studentSaid: 'ok', callModel: s3.call, boardPass: false, mathsCheck: false });
    check('a part already marked keeps its mark', r3.state.goals['level-check']?.status === 'demonstrated');
  }

  console.log('the estimate fallback: when the check is over and no level was set');
  const g = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, status], i) => [k, { status: status as never, at: 10 + i }]));
  check('not while the check is in hand', !v2LevelEstimateDue(PLAN, g({ overview: 'shown' }), undefined) && !v2LevelEstimateDue(PLAN, g({ overview: 'shown', 'level-check': 'shown' }), undefined));
  check('once the part is done', v2LevelEstimateDue(PLAN, g({ overview: 'shown', 'level-check': 'demonstrated' }), undefined));
  check('once the lesson has moved past it unmarked', v2LevelEstimateDue(PLAN, g({ overview: 'shown', 'past-simple': 'shown' }), undefined));
  check('never when a level is held', !v2LevelEstimateDue(PLAN, g({ overview: 'shown', 'level-check': 'demonstrated' }), { level: 'beginner', from: 'this_lesson' }));
  check('never for a plan with no level-check part', !v2LevelEstimateDue({ ...PLAN, segments: PLAN.segments.filter((x) => x.id !== 'level-check') } as LessonPlan, g({ overview: 'shown', 'past-simple': 'demonstrated' }), undefined));

  console.log('seeding the state before a turn');
  check('a remembered level seeds the state as from an earlier lesson', JSON.stringify(v2SeedWorkingLevel(newV2State(1), { known: 'advanced' }).workingLevel) === JSON.stringify({ level: 'advanced', from: 'earlier_lesson' }));
  check('an estimated level seeds it as from this lesson, ahead of a remembered one', JSON.stringify(v2SeedWorkingLevel(newV2State(1), { known: 'advanced', estimated: 'beginner' }).workingLevel) === JSON.stringify({ level: 'beginner', from: 'this_lesson' }));
  const held = withLevel({ level: 'intermediate', from: 'this_lesson' });
  check('a level the state already holds is kept, and the same state object comes back', v2SeedWorkingLevel(held, { known: 'advanced', estimated: 'beginner' }) === held);
  check('a remembered level that arrives after the student has replied is not taken (review M1)', !v2SeedWorkingLevel(replied(newV2State(1), 1), { known: 'advanced' }).workingLevel);
  check('an estimate is still taken after replies', v2SeedWorkingLevel(replied(newV2State(1), 3), { known: 'advanced', estimated: 'beginner' }).workingLevel?.level === 'beginner');
  const none = newV2State(1);
  check('nothing to seed: the same state object comes back', v2SeedWorkingLevel(none, {}) === none);

  console.log('the route reads the level from the client state');
  check('a valid level is kept', JSON.stringify(v2ReadWorkingLevel({ level: 'Beginner ', from: 'earlier_lesson' })) === JSON.stringify({ level: 'beginner', from: 'earlier_lesson' }));
  check('a bad level or source is dropped', v2ReadWorkingLevel({ level: 'B2', from: 'this_lesson' }) === undefined && v2ReadWorkingLevel({ level: 'beginner', from: 'somewhere' }) === undefined && v2ReadWorkingLevel('beginner') === undefined);

  console.log('the profile commit');
  const commitOf = (state: V2State) => v2ProfileCommit({ sessionId: 's1', subject: 'English', level: 'adult', lessonPlanId: PLAN.id, plan: PLAN, state, transcript: [] });
  check('a level set this lesson goes to the profile, with the plan', JSON.stringify(commitOf(withLevel({ level: 'beginner', from: 'this_lesson' })).workingLevel) === JSON.stringify({ level: 'beginner', planId: PLAN.id }));
  check('a remembered, unrevised level is not written again; no level, no field', commitOf(withLevel({ level: 'beginner', from: 'earlier_lesson' })).workingLevel === undefined && !('workingLevel' in commitOf(newV2State(1))));
  const trialBody = v2WorkingLevelCommit({ sessionId: 's1', subject: 'English', lessonPlanId: PLAN.id, state: withLevel({ level: 'advanced', from: 'this_lesson' }) });
  check('a trial commits the level alone: no transcript, gaps, mastery or summary', !!trialBody && JSON.stringify(trialBody.workingLevel) === JSON.stringify({ level: 'advanced', planId: PLAN.id }) && trialBody.generateNotes === false && !('transcript' in trialBody) && !('gaps' in trialBody) && !('masteryDeltas' in trialBody), trialBody);
  check('a trial with no level set this lesson commits nothing', v2WorkingLevelCommit({ sessionId: 's1', subject: 'English', state: withLevel({ level: 'advanced', from: 'earlier_lesson' }) }) === null && v2WorkingLevelCommit({ sessionId: 's1', subject: 'English', state: newV2State(1) }) === null);

  console.log('the bilingual section keys its support-language amount off the same ladder');
  const ja = v2LanguagesSection(['en', 'ja']) ?? '';
  check('beginner, intermediate and advanced each say how much Japanese', /Beginner: [^\n]*Japanese/.test(ja) && /Intermediate: [^\n]*Japanese/.test(ja) && /Advanced: [^\n]*Japanese/.test(ja), ja);
  check('the working level is what it follows; no "lower-intermediate" rung', /working level/.test(ja) && !/lower-intermediate/i.test(ja));
  check('until it is known, judged by how they speak', /Until it is known/.test(ja));

  console.log('the browser sends the option');
  {
    let sent: Record<string, unknown> = {};
    const fetchImpl = (async (_u: string, init: RequestInit) => { sent = JSON.parse(String(init.body)); const body = `data: ${JSON.stringify({ type: 'done', spoken: '', state: newV2State(1), usage: {}, firstTextMs: 1, totalMs: 1 })}\n\n`; return new Response(body, { status: 200 }); }) as unknown as typeof fetch;
    await streamV2Turn({ session: { subject: 'English', level: 'adult', mode: 'voice', levelCheck: true }, state: withLevel({ level: 'beginner', from: 'earlier_lesson' }), studentSaid: null, fetchImpl });
    check('the session carries levelCheck and the state carries the level', (sent.session as { levelCheck?: boolean }).levelCheck === true && (sent.state as V2State).workingLevel?.level === 'beginner', sent);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main();
