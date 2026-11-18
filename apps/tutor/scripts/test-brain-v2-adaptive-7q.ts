/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7q: adaptivity inside one lesson (mic test 4, embed-1795028886172). The session's plan
 * (gdi-work-projects-v1). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-adaptive-7q
 *
 *  1 SUPPORT_STEPS   two answers in a row that needed a correction step up, two right step down, mixed = no change, bounds,
 *                    one step towards normal at a part change, not in excluded parts; each step's facts line
 *  2 RETEST_MISTAKE  a correction recorded once per target (5 at most); asked only in a later practice part not behind its
 *                    minutes, 2 turns at most, 3 a lesson at most; passed / missed / not asked; the praise line once; a miss
 *                    goes to the profile's gaps
 *  both              every event; the state round trip through the route's reading (v2ReadClientState + v2ScopeCarried);
 *                    a maths voice lesson and a typed lesson unchanged; each switch off alone (a child process per switch)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_RETEST_MISTAKE, TUTOR_V2_SUPPORT_STEPS } from '../src/lib/tutor/orchestrator/flags';
import { V2_RETEST_MAX_KEPT, v2AdaptAfter, v2AdaptBefore, v2AdaptOn, v2AdaptPart, v2PartBehind, v2PracticePairs, v2RetestGaps, v2SupportLine, type V2PracticePair } from '../src/lib/tutor/v2/adaptive';
import { v2PracticePart } from '../src/lib/tutor/v2/time-fit';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2ProfileCommit } from '../src/lib/tutor/v2/memory';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { streamV2Turn } from '../src/lib/tutor/v2/client';
import { newV2State, type V2BoardPage, type V2Retest, type V2Session, type V2State, type V2TurnEvent } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.ADAPT_7Q_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function scripted(texts: string[]) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const t = texts[Math.min(i, texts.length - 1)]!; i += 1;
    if (onText) for (const piece of t.match(/[\s\S]{1,17}/g) ?? []) onText(piece);
    return msg(t ? [{ type: 'text', text: t }] : [], 'end_turn');
  };
  return { call, facts };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const typed: V2Session = { ...lang, mode: 'text' };
const maths: V2Session = { studentName: 'Sam', subject: 'Math', level: 'Grade 8', mode: 'voice' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const PP: V2BoardPage = { title: 'Present perfect', items: [{ id: 'p1', tool: 'annotate', summary: 'have + past participle' }] };
const PS: V2BoardPage = { title: 'Past simple', items: [{ id: 's1', tool: 'annotate', summary: 'past simple: finished time' }] };
const PRON: V2BoardPage = { title: 'Pronunciation', items: [{ id: 'r1', tool: 'annotate', summary: 'worked / sold' }] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const ASK = 'Good. Now tell me in one sentence: what did you do at work last week?';
/** A state on a part's page: `page` 1 = present perfect, 2 = past simple, 3 = pronunciation. */
const at = (page: number, extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, board: { pages: structuredClone([TODAY, PP, PS, PRON]).slice(0, Math.max(page + 1, 2)), current: page }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, history: [u('x'), a(ASK)], ...extra });
/** The route's round trip: JSON, the route's reading, the scope. */
const trip = (session: V2Session, st: V2State) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, session);
const run = async (session: V2Session, st: V2State, said: string | null, reply: string, nowMin = 10, adaptFlags?: { support?: boolean; retest?: boolean }) => {
  const m = scripted([reply]);
  const r = await runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: nowMin * MIN, ...(adaptFlags ? { adaptFlags } : {}) });
  return { r, facts: m.facts.join('\n'), events: r.events ?? [] };
};

// Answers and replies of the past-simple practice (mic test 4's texts: "I sell 35 washing machine to customer from Canada.").
const WRONG1 = 'I sell 35 washing machine to customer from Canada last week.';
const FIX1 = `Almost. We say "I sold 35 washing machines to a customer from Canada last week." <board sentence stress="sold | machines">I sold 35 washing machines to a customer from Canada last week.</board> Tell me in one sentence: what did you do yesterday?`;
const WRONG2 = 'Yesterday I go to the office in Nagoya.';
const FIX2 = `Close. We say "Yesterday I went to the office in Nagoya." <board sentence stress="went">Yesterday I went to the office in Nagoya.</board> Tell me in one sentence: what did you do last weekend?`;
const RIGHT1 = 'I visited a customer in Osaka on Monday.';
const OK1 = `That's right. <board sentence>I visited a customer in Osaka on Monday.</board> Tell me in one sentence: what did you do last weekend?`;
const RIGHT2 = 'I played tennis with my son last Sunday.';
const OK2 = `That's right. <board sentence>I played tennis with my son last Sunday.</board> Tell me in one sentence: what did you eat yesterday?`;
const supportLine = (f: string) => f.split('\n').find((l) => l.startsWith('support for the next question')) ?? null;
const retestLine = (f: string) => f.split('\n').find((l) => l.startsWith('retest')) ?? null;
const types = (evs: V2TurnEvent[]) => evs.map((e) => e.type);
/** JSON with sorted keys: the reading may order keys differently. */
const canon = (x: unknown): string => JSON.stringify(x, (_k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, (v as Record<string, unknown>)[k]])) : v));

const pair = (corrected: boolean, stress: string[] = [], said = WRONG1, card = 'I sold 35 washing machines to a customer from Canada last week.'): V2PracticePair => ({ said, card, corrected, stress });
const PSPART = { index: 4, id: 'past-simple' }; const PPPART = { index: 3, id: 'present-perfect' };
const entry = (target: string[], part = 'present-perfect', extra: Partial<V2Retest> = {}): V2Retest => ({ part, said: 'I have work here since five years.', right: 'I have worked here for five years.', target, turn: 3, ...extra });

async function probe() {
  // A walk through the past-simple part with the route's round trip between turns: wrong, wrong, then the next facts.
  const t1 = await run(lang, at(2), WRONG1, FIX1);
  const t2 = await run(lang, trip(lang, t1.r.state), WRONG2, FIX2);
  const t3 = await run(lang, trip(lang, t2.r.state), RIGHT1, OK1);
  // A recorded correction of the present-perfect part, then the past-simple part: the retest is asked.
  const rt = await run(lang, at(2, { retests: [entry(['worked', 'for'])] }), RIGHT1, OK1, 10);
  // Maths voice and typed lessons: nothing new (same facts with the switches off; no events; no state).
  const mathsOn = await run(maths, newV2State(0), 'I think x is 3.', 'Good. Check it: $2 \\cdot 3 = 6$.', 3);
  const mathsOff = await run(maths, newV2State(0), 'I think x is 3.', 'Good. Check it: $2 \\cdot 3 = 6$.', 3, { support: false, retest: false });
  const typedIn = at(2, { support: { step: 'gap', wrong: 0, clean: 0, part: 'past-simple' }, retests: [entry(['worked'])] });
  const typedOn = await run(typed, typedIn, WRONG1, FIX1);
  const typedOff = await run(typed, at(2), WRONG1, FIX1, 10, { support: false, retest: false });
  return {
    t1Events: t1.events, t2Events: t2.events, t3Facts: t3.facts, t3Events: t3.events, t2Support: t2.r.state.support ?? null, t2Retests: t2.r.state.retests ?? null,
    rtFacts: rtLine(rt.facts), rtEvents: rt.events,
    mathsSame: mathsOn.facts === mathsOff.facts, mathsEvents: mathsOn.r.events ?? null, mathsState: 'support' in mathsOn.r.state || 'retests' in mathsOn.r.state,
    typedSame: typedOn.facts === typedOff.facts, typedEvents: typedOn.r.events ?? null, typedState: canon(typedOn.r.state.support) !== canon(typedIn.support) || canon(typedOn.r.state.retests) !== canon(typedIn.retests),
    typedFactsAdaptive: /support for the next question|retest/.test(typedOn.facts),
  };
}
const rtLine = (f: string) => retestLine(f);

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const on = await probe();

  console.log('the switches: each on by default; the gate');
  check('SUPPORT_STEPS and RETEST_MISTAKE default on', TUTOR_V2_SUPPORT_STEPS && TUTOR_V2_RETEST_MISTAKE);
  check('spoken language lesson with a labelled plan: on; typed, maths, no plan: off', v2AdaptOn(lang) && !v2AdaptOn(typed) && !v2AdaptOn(maths) && !v2AdaptOn({ ...lang, plan: undefined }));
  check('excluded parts are no practice parts: overview, level check, pronunciation, summary', [0, 1, 6, 7].every((i) => !v2PracticePart(GDI, i)) && [3, 4, 5].every((i) => v2PracticePart(GDI, i)));
  check('the part in hand: past simple on its page; none on the pronunciation page, once the summary began, or closed',
    v2AdaptPart(lang, at(2))?.id === 'past-simple' && v2AdaptPart(lang, at(1))?.id === 'present-perfect' && v2AdaptPart(lang, at(3)) === null && v2AdaptPart(lang, at(2, { summaryBegunAt: 5 })) === null && v2AdaptPart(lang, at(2, { closed: true })) === null);
  check('the overview (no part page yet) and the level check are not counted', v2AdaptPart(lang, { ...newV2State(0), board: { pages: [TODAY], current: 0 } }) === null && v2AdaptPart(lang, { ...newV2State(0), board: { pages: [TODAY], current: 0 }, goals: { overview: { status: 'shown', at: 0 } }, history: [u('x'), a('First, a quick level check. Tell me about your job in one or two sentences.')] }) === null);

  console.log('1  support steps');
  const S = (step: V2State['support'] extends infer T ? T extends { step: infer K } ? K : never : never, wrong = 0, clean = 0) => at(2, { support: { step, wrong, clean, part: 'past-simple' } });
  {
    const st = at(2); const e1 = v2AdaptAfter(lang, st, PSPART, [WRONG1], [pair(true, ['sold'])]);
    check('one wrong: counted, no step', st.support?.step === 'normal' && st.support.wrong === 1 && types(e1).includes('v2_practice_signal') && !types(e1).includes('v2_support_step'), st.support);
    const e2 = v2AdaptAfter(lang, st, PSPART, [WRONG2], [pair(true, ['went'], WRONG2, 'Yesterday I went to the office in Nagoya.')]);
    check('two wrong in a row: one step up (starter), runs reset, event why=two_wrong', st.support?.step === 'starter' && st.support.wrong === 0 && e2.some((e) => e.type === 'v2_support_step' && /from=normal to=starter why=two_wrong part=past-simple turn=\d+/.test(e.message)), [st.support, e2]);
    const e3 = v2AdaptAfter(lang, st, PSPART, [WRONG1], [pair(true, ['sold'])]);
    check('a change of step reset the runs: one more wrong = no change yet', st.support?.step === 'starter' && st.support.wrong === 1 && !types(e3).includes('v2_support_step'));
  }
  {
    const st = at(2); v2AdaptAfter(lang, st, PSPART, [RIGHT1], [pair(false, [], RIGHT1, RIGHT1)]); const e = v2AdaptAfter(lang, st, PSPART, [RIGHT2], [pair(false, [], RIGHT2, RIGHT2)]);
    check('two clean in a row: one step down (stretch), event why=two_clean', st.support?.step === 'stretch' && e.some((x) => /from=normal to=stretch why=two_clean/.test(x.message)), st.support);
  }
  {
    const st = at(2); v2AdaptAfter(lang, st, PSPART, [WRONG1], [pair(true, ['sold'])]); v2AdaptAfter(lang, st, PSPART, [RIGHT1], [pair(false, [], RIGHT1, RIGHT1)]);
    const st2 = at(2); v2AdaptAfter(lang, st2, PSPART, [RIGHT1], [pair(false, [], RIGHT1, RIGHT1)]); v2AdaptAfter(lang, st2, PSPART, [WRONG1], [pair(true, ['sold'])]); v2AdaptAfter(lang, st2, PSPART, [RIGHT2], [pair(false, [], RIGHT2, RIGHT2)]);
    check('mixed (wrong then clean; clean, wrong, clean): no change', st.support?.step === 'normal' && st2.support?.step === 'normal', [st.support, st2.support]);
  }
  {
    const top = S('repeat', 1); const e = v2AdaptAfter(lang, top, PSPART, [WRONG1], [pair(true, ['sold'])]);
    const bottom = S('stretch', 0, 1); const e2 = v2AdaptAfter(lang, bottom, PSPART, [RIGHT1], [pair(false, [], RIGHT1, RIGHT1)]);
    check('bounds: repeat stays repeat after two wrong; stretch stays stretch after two clean; no step event', top.support?.step === 'repeat' && bottom.support?.step === 'stretch' && !types(e).includes('v2_support_step') && !types(e2).includes('v2_support_step'));
    const up = S('starter', 1); v2AdaptAfter(lang, up, PSPART, [WRONG1], [pair(true, ['sold'])]); const up2 = S('gap', 1); v2AdaptAfter(lang, up2, PSPART, [WRONG1], [pair(true, ['sold'])]);
    check('starter → gap → repeat', up.support?.step === 'gap' && up2.support?.step === 'repeat');
  }
  {
    // A part change: the step carried one towards normal (repeat → gap; stretch → normal; gap → starter); no event at normal.
    const r = at(2, { support: { step: 'repeat', wrong: 1, clean: 0, part: 'present-perfect' } }); const er = v2AdaptBefore(lang, r, 'Okay.', 10 * MIN);
    const s = at(2, { support: { step: 'stretch', wrong: 0, clean: 1, part: 'present-perfect' } }); v2AdaptBefore(lang, s, 'Okay.', 10 * MIN);
    const n = at(2, { support: { step: 'normal', wrong: 1, clean: 0, part: 'present-perfect' } }); const en = v2AdaptBefore(lang, n, 'Okay.', 10 * MIN);
    check('part change: repeat → gap (runs reset, event why=part_change), the gap line shown', r.support?.step === 'gap' && r.support.wrong === 0 && r.support.part === 'past-simple' && er.events.some((e) => /from=repeat to=gap why=part_change part=past-simple/.test(e.message)) && /gap/.test(er.lines[0] ?? ''), [r.support, er]);
    check('part change: stretch → normal (no line); normal stays normal with no event, runs reset', s.support?.step === 'normal' && n.support?.step === 'normal' && n.support.wrong === 0 && !en.events.length && !en.lines.length);
    const pron = at(3, { support: { step: 'repeat', wrong: 0, clean: 0, part: 'past-simple' } }); const ep = v2AdaptBefore(lang, pron, 'Okay.', 10 * MIN);
    check('excluded part (pronunciation page): no line, no change (the step waits for the next practice part)', pron.support?.step === 'repeat' && !ep.lines.length && !ep.events.length);
    const ex = at(3); const ee = v2AdaptAfter(lang, ex, v2AdaptPart(lang, ex), [WRONG1], [pair(true, ['sold'])]);
    check('no count outside a practice part', !ee.length && !ex.support);
  }
  {
    const lines = Object.fromEntries((['stretch', 'normal', 'starter', 'gap', 'repeat'] as const).map((k) => [k, v2SupportLine(k)]));
    check('normal: no line', lines.normal === null);
    check('starter: the first words of the answer', !!lines.starter && /^support for the next question: starter/.test(lines.starter) && /Start with: I have worked…/.test(lines.starter), lines.starter);
    check('gap: one gap, said aloud and on the question card as ___', !!lines.gap && /one gap/.test(lines.gap) && /say the sentence aloud with the gap/.test(lines.gap) && /question card with the gap as ___/.test(lines.gap), lines.gap);
    check('repeat: a model sentence to repeat, then one easy question of the same form', !!lines.repeat && /model sentence/.test(lines.repeat) && /say it after you/.test(lines.repeat) && /one easy question that takes the same form/.test(lines.repeat), lines.repeat);
    check('stretch: no starter, a more open question, longer answer or a reason, no new grammar point', !!lines.stretch && /Give no starter/.test(lines.stretch) && /longer answer or a reason/.test(lines.stretch) && /never a new grammar point outside the part/.test(lines.stretch), lines.stretch);
    check('each line leaves corrections, retries, one question a reply and the cards as they are', ['starter', 'gap', 'repeat', 'stretch'].every((k) => /a correction, a retry it asks for, one question a reply and the cards stay as they are/.test(lines[k] ?? '')));
  }
  console.log('1  through runV2Turn (the route round trip between turns)');
  check('turn 1 (a wrong answer carded corrected): v2_practice_signal wrong, v2_retest_recorded "sold", "machines"', on.t1Events.some((e) => e.type === 'v2_practice_signal' && /^wrong part=past-simple/.test(e.message)) && on.t1Events.some((e) => e.type === 'v2_retest_recorded' && /"sold", "machines"/.test(e.message)), on.t1Events);
  check('turn 2 (wrong again): step up to starter', on.t2Support?.step === 'starter' && on.t2Events.some((e) => /from=normal to=starter why=two_wrong/.test(e.message)), [on.t2Support, on.t2Events]);
  check('turn 3 facts: the starter line', /support for the next question: starter/.test(on.t3Facts));
  check('turn 3 (a right answer carded as said): v2_practice_signal clean', on.t3Events.some((e) => e.type === 'v2_practice_signal' && /^clean part=past-simple/.test(e.message)), on.t3Events);
  check('both corrections recorded (two targets), in the part they were made in', on.t2Retests?.length === 2 && on.t2Retests.every((r) => r.part === 'past-simple'), on.t2Retests);

  console.log('2  the same mistake again, later');
  {
    const st = at(1);
    v2AdaptAfter(lang, st, PPPART, [WRONG1], [pair(true, ['sold'])]);
    v2AdaptAfter(lang, st, PPPART, [WRONG1], [pair(true, ['Sold'])]);
    check('recorded once per target (the same target twice = one entry)', st.retests?.length === 1 && st.retests[0]!.target.join() === 'sold' && st.retests[0]!.part === 'present-perfect' && /sold/.test(st.retests[0]!.right), st.retests);
    for (const w of ['went', 'ate', 'bought', 'saw', 'took', 'made']) v2AdaptAfter(lang, st, PPPART, [WRONG1], [pair(true, [w])]);
    check(`at most ${V2_RETEST_MAX_KEPT} kept`, st.retests?.length === V2_RETEST_MAX_KEPT, st.retests?.length);
    const noStress = at(1); v2AdaptAfter(lang, noStress, PPPART, [WRONG1], [pair(true, [])]);
    check('a correction with no target (no stress) counts for the support, records no retest', !noStress.retests && noStress.support?.wrong === 1);
    const pairs = v2PracticePairs([WRONG1, 'I have a meeting every Monday morning.'], [{ sentence: 'I sold 35 washing machines to a customer from Canada last week.', stress: [] }]);
    check('pairs: a correction card without stress takes the words not theirs; an uncarded sentence is left out', pairs.length === 1 && pairs[0]!.corrected && pairs[0]!.stress.includes('sold') && pairs[0]!.stress.includes('machines'), pairs);
    const echo = v2PracticePairs([RIGHT1], [{ sentence: RIGHT1, stress: [] }]);
    check('pairs: a card as they said it is a right answer', echo.length === 1 && !echo[0]!.corrected);
  }
  {
    const same = at(1, { retests: [entry(['worked'])] }); const s1 = v2AdaptBefore(lang, same, 'Okay.', 10 * MIN);
    check('not asked in the part where it happened', !s1.lines.length && !same.retests![0]!.offered);
    const pron = at(3, { retests: [entry(['worked'])] }); const s2 = v2AdaptBefore(lang, pron, 'Okay.', 10 * MIN);
    check('not asked in the pronunciation part (nor the summary)', !s2.lines.length && !v2AdaptBefore(lang, at(2, { summaryBegunAt: 1, retests: [entry(['worked'])] }), 'Okay.', 10 * MIN).lines.length);
    const quiet = at(2, { retests: [entry(['worked'])], support: { step: 'gap', wrong: 0, clean: 0, part: 'past-simple' } }); const q = v2AdaptBefore(lang, quiet, null, 10 * MIN);
    check('a silence turn (no words from them): no support line, no retest sent', !q.lines.length && !q.events.length && !quiet.retests![0]!.offered);
    const later = at(2, { retests: [entry(['worked', 'for'])] }); const s3 = v2AdaptBefore(lang, later, 'Okay.', 10 * MIN);
    check('asked in a later practice part: the line names their sentence, the right one and the target', s3.lines.length === 1 && /^retest of an earlier mistake: in the Present perfect part they said "I have work here since five years\." where "I have worked here for five years\." was right \(the point: "worked", "for"\)\. If it fits this part's own topic, shape ONE of your questions in this part so that a natural answer needs "worked", "for"; do not mention the earlier mistake before they answer/.test(s3.lines[0]!), s3.lines);
    check('… event v2_retest_offered with the target and the part', s3.events.some((e) => e.type === 'v2_retest_offered' && /target="worked", "for" part=past-simple from=present-perfect send=1\/2/.test(e.message)), s3.events);
    check('… through runV2Turn: the facts carry it', !!on.rtFacts && /retest of an earlier mistake/.test(on.rtFacts) && on.rtEvents.some((e) => e.type === 'v2_retest_offered'), on.rtFacts);
    check('the part is behind its plan minutes (past simple ends at 15 of 20): not asked', v2PartBehind(lang, at(2), 4, 16 * MIN) && !v2PartBehind(lang, at(2), 4, 10 * MIN) && !v2AdaptBefore(lang, at(2, { retests: [entry(['worked'])] }), 'Okay.', 16 * MIN).lines.length);
  }
  {
    // Two turns at most, then not asked; one open at a time.
    const st = at(2, { retests: [entry(['worked']), entry(['since'], 'topic-intro')] });
    const b1 = v2AdaptBefore(lang, st, 'Okay.', 10 * MIN); const a1 = v2AdaptAfter(lang, st, PSPART, [RIGHT1], [pair(false, [], RIGHT1, RIGHT1)]);
    const b2 = v2AdaptBefore(lang, st, RIGHT1, 10 * MIN); const a2 = v2AdaptAfter(lang, st, PSPART, [RIGHT2], [pair(false, [], RIGHT2, RIGHT2)]);
    check('sent on two turns, the second still the first entry (one open at a time)', b1.lines.length === 1 && b2.lines.length === 1 && /"worked"/.test(b2.lines[0]!) && st.retests![1]!.offered === undefined, [b1.lines, b2.lines]);
    check('after its 2 turns with the target not used: outcome not_asked (event)', st.retests![0]!.outcome === 'not_asked' && !types(a1).includes('v2_retest_outcome') && a2.some((e) => e.type === 'v2_retest_outcome' && /target="worked" outcome=not_asked/.test(e.message)), [st.retests, a2]);
    const b3 = v2AdaptBefore(lang, st, RIGHT2, 10 * MIN);
    check('then the next entry may be asked', b3.lines.filter((l) => /^retest/.test(l)).length === 1 && b3.lines.some((l) => /^retest/.test(l) && /"since"/.test(l)), b3.lines);
  }
  {
    // At most three a lesson.
    const st = at(2, { retests: [entry(['a1'], 'topic-intro', { offered: 1, outcome: 'passed' }), entry(['a2'], 'topic-intro', { offered: 2, outcome: 'missed' }), entry(['a3'], 'topic-intro', { offered: 2, outcome: 'not_asked' }), entry(['worked'])] });
    check('at most 3 a lesson: a 4th is never asked', !v2AdaptBefore(lang, st, 'Okay.', 10 * MIN).lines.length && !st.retests![3]!.offered);
  }
  {
    const mk = () => at(2, { retests: [entry(['worked'], 'present-perfect', { offered: 1, in: 'past-simple' })] });
    const p = mk(); const ep = v2AdaptAfter(lang, p, PSPART, ['I have worked at my company for ten years.'], [pair(false, [], 'I have worked at my company for ten years.', 'I have worked at my company for ten years.')]);
    check('target used and not corrected again: passed (event)', p.retests![0]!.outcome === 'passed' && ep.some((e) => e.type === 'v2_retest_outcome' && /outcome=passed part=past-simple/.test(e.message)), [p.retests, ep]);
    const p2 = mk(); v2AdaptAfter(lang, p2, PSPART, ['I have worked at my company since ten years.'], [pair(true, ['for'], 'I have worked at my company since ten years.', 'I have worked at my company for ten years.')]);
    check('target used, corrected on another word: passed', p2.retests![0]!.outcome === 'passed', p2.retests);
    const m = mk(); const em = v2AdaptAfter(lang, m, PSPART, ['I have work at my company for ten years.'], [pair(true, ['worked'], 'I have work at my company for ten years.', 'I have worked at my company for ten years.')]);
    check('corrected again on the same target: missed (event); no second retest of it', m.retests![0]!.outcome === 'missed' && em.some((e) => /outcome=missed/.test(e.message)) && m.retests!.length === 1 && !v2AdaptBefore(lang, m, 'Okay.', 10 * MIN).lines.length, [m.retests, em]);
    const gaps = v2RetestGaps(m); const commit = v2ProfileCommit({ sessionId: 'embed-x', subject: 'English', level: 'adult', plan: GDI, state: m, transcript: [] }) as { gaps: Array<{ conceptLabel: string }> };
    check('a miss goes to the profile\'s gaps (memory.ts); a pass does not', gaps.length === 1 && commit.gaps.some((g) => /worked/.test(g.conceptLabel)) && !v2RetestGaps(p).length, commit.gaps);
    const pr = mk(); const b = v2AdaptBefore(lang, pr, 'I have worked here for ten years.', 10 * MIN); const b2 = v2AdaptBefore(lang, pr, 'I have worked here for ten years.', 10 * MIN);
    check('their answer uses the open target: the praise line, once', b.lines.length === 1 && /^retest: their answer just now uses "worked"/.test(b.lines[0]!) && /you said "worked" this time/.test(b.lines[0]!) && /once only/.test(b.lines[0]!) && !b2.lines.some((l) => /praise/.test(l)), [b.lines, b2.lines]);
    const left = at(3, { retests: [entry(['worked'], 'present-perfect', { offered: 1, in: 'past-simple' })] }); const el = v2AdaptBefore(lang, left, 'Okay.', 10 * MIN);
    check('an open retest whose part is left: not_asked (event)', el.events.some((e) => e.type === 'v2_retest_outcome' && /outcome=not_asked part=past-simple/.test(e.message)), el.events);
  }

  console.log('both: events, round trip, other lessons');
  {
    const all = new Set([...on.t1Events, ...on.t2Events, ...on.t3Events, ...on.rtEvents].map((e) => e.type));
    check('events through runV2Turn: v2_practice_signal, v2_support_step, v2_retest_recorded, v2_retest_offered', ['v2_practice_signal', 'v2_support_step', 'v2_retest_recorded', 'v2_retest_offered'].every((t) => all.has(t)), [...all]);
    const none = at(2); const en = v2AdaptAfter(lang, none, PSPART, [WRONG1], []);
    check('an answer the reply carded none of: v2_practice_signal none (the signal never fired), nothing counted', en.length === 1 && /^none part=past-simple .*none carded/.test(en[0]!.message) && !none.support);
  }
  {
    const st = at(2, { support: { step: 'gap', wrong: 1, clean: 0, part: 'past-simple' }, retests: [entry(['worked'], 'present-perfect', { offered: 1, in: 'past-simple', praised: true }), entry(['sold'], 'past-simple', { outcome: 'missed', offered: 2 })] });
    const back = trip(lang, st);
    check('round trip (JSON → v2ReadClientState → v2ScopeCarried): support and retests kept', canon(back.support) === canon(st.support) && canon(back.retests) === canon(st.retests), [back.support, back.retests]);
    const bad = v2ReadClientState(JSON.parse(JSON.stringify({ ...st, support: { step: 'huge', wrong: 1 }, retests: [{ part: 'x y', said: 'a', right: 'b', target: ['c'] }, { part: 'ok', said: 'a', right: 'b', target: [] }, 'z'] })))!;
    check('malformed fields are dropped', !('support' in bad) && !('retests' in bad), [bad.support, bad.retests]);
    const m = trip(maths, { ...newV2State(0), support: st.support, retests: st.retests }); const t = trip(typed, st);
    check('scoped out for a maths voice lesson and a typed lesson', !m.support && !m.retests && !t.support && !t.retests);
  }
  {
    // The route sends the turn's events in its done event; the browser's reader returns them (useV2Turns records each).
    const evs = [{ type: 'v2_support_step', message: 'from=normal to=starter why=two_wrong part=past-simple turn=3' }];
    const body = `data: ${JSON.stringify({ type: 'done', spoken: 'x', state: at(2), usage: {}, firstTextMs: 1, totalMs: 2, events: evs })}\n\n`;
    const fetchImpl = (async () => new Response(body, { status: 200 })) as unknown as typeof fetch;
    const done = await streamV2Turn({ session: lang as never, state: at(2), studentSaid: 'x', fetchImpl });
    const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    const route = readFileSync(join(__dirname, '..', 'src', 'app', 'api', 'tutor', 'brain-v2', 'turn', 'route.ts'), 'utf8');
    check('the events reach the browser (done.events) and are recorded through onDebugEvent; the route sends them', JSON.stringify(done.events) === JSON.stringify(evs) && /for \(const e of Array\.isArray\(done\.events\)[^\n]*onDebugEvent\?\.\(e\.type/.test(src) && /events: r\.events/.test(route));
  }
  check('a maths voice lesson: facts identical with both switches off, no events, no new state', on.mathsSame && on.mathsEvents === null && !on.mathsState, on);
  check('a typed language lesson (even with the fields sent): facts identical with both off, no events, the fields untouched, no line', on.typedSame && on.typedEvents === null && !on.typedState && !on.typedFactsAdaptive, on);

  console.log('each switch off alone (a child process per switch)');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', ADAPT_7Q_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    return line ? JSON.parse(line.slice('OFF_JSON '.length)) as typeof on : ({ error: res.stderr } as unknown as typeof on);
  };
  {
    const off = child('SUPPORT_STEPS');
    check('SUPPORT_STEPS off: no step, no support line, no step event', off.t2Support === null && !/support for the next question/.test(off.t3Facts ?? '') && !(off.t2Events ?? []).some((e) => e.type === 'v2_support_step'), off);
    check('… the retest works as on (recorded, offered)', (off.t2Retests?.length ?? 0) === 2 && !!off.rtFacts && off.rtFacts === on.rtFacts);
  }
  {
    const off = child('RETEST_MISTAKE');
    check('RETEST_MISTAKE off: nothing recorded, no retest line, no retest event', off.t2Retests === null && off.rtFacts === null && ![...(off.t1Events ?? []), ...(off.rtEvents ?? [])].some((e) => /retest/.test(e.type)), off);
    check('… the support steps work as on', off.t2Support?.step === 'starter' && /support for the next question: starter/.test(off.t3Facts ?? ''));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
