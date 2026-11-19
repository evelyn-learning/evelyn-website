/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7v: mic test 6 (embed-1795067373124), pacing between parts, the optional part at the wrap minute, and the
 * in-lesson adaptivity. The session's plan (gdi-work-projects-v1), its real turns and minutes (task-7u-investigation.md D, E, F, G).
 * No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic6-7v
 *
 *  1 PART_CLOCK              a part's time from when the lesson entered it: "Your job" (entered at 2.1 after a 1.5-minute level
 *                            check) is offered on at about its own 3 minutes (5.1), not held to the lesson clock's 6.5 (it ran 5.3)
 *  2 OPTIONAL_FIT            Pronunciation offered at 17.85, "Uh, yes, let's go." at 18.1 (wrap 18): its page opens (7i fit); the wrap
 *                            moves to the end of its minutes, then the summary; a later request by name is honoured while it fits
 *  3 RETEST_TARGET_CHANGED   targets are the changed words with one neighbour ("in the home"); praise names a changed word only
 *  4 RETEST_SPREAD           two entries per part, one retest offered per part, the cap counted only for retests put to them
 *  5 ANSWER_SIGNAL           the answers of turns 30, 35 and 44 give a practice signal; "7" / "2" give no false wrong (7u)
 *  6 SUPPORT_FOLLOWED        the step's line names the form first, sits with the practice facts; the conversation caps at starter
 *  7 SELF_CORRECTION         "for senior bosses." after his sentence is read with it; the cut turn's words are carried
 *    REPEAT_NOT_ECHO         his repeat at 13:38, said with the model sentence, is not the tutor's echo
 *  a labelled maths voice plan: what changes (part clock); an unlabelled one: nothing; each switch off alone (a child process each).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2CorePart, v2MarkPartStart, v2OptionalAskedAtClose, v2OptionalWrapMin, v2PartClock, v2PartPace, v2PartTimeUpLine, v2StayInPartLine } from '../src/lib/tutor/v2/time-fit';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { V2_RETEST_MAX_ASKED, v2RetestGaps } from '../src/lib/tutor/v2/adaptive';
import { v2AdaptAfter, v2AdaptBefore, v2ChangedTarget, v2FreeConversationPart, v2PartBehind, v2PracticePairs, v2SupportLine, type V2PracticePair } from '../src/lib/tutor/v2/adaptive';
import { v2PracticeAnswerSentences } from '../src/lib/tutor/v2/learner-card';
import { v2PracticeFactLines, v2SelfCorrection } from '../src/lib/tutor/v2/practice-facts';
import { v2CutWordsCarried, v2WithCarried } from '../src/lib/tutor/v2/interrupted';
import { V2EchoClock } from '../src/lib/tutor/v2/echo-window';
import { renderPlanMap } from '../src/lib/tutor/v2/plan-map';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC6_7V_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function scripted(replies: Array<{ text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> }>) {
  const facts: string[] = []; const results: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string; content?: unknown }>) {
      if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
      if (b.type === 'tool_result') results.push(String(b.content));
    }
    const r = replies[Math.min(i, replies.length - 1)]!; i += 1;
    onText?.(r.text);
    const tools = (r.tools ?? []).map((t, k) => ({ type: 'tool_use', id: `tu_${i}_${k}`, name: t.name, input: t.input }));
    return msg([{ type: 'text', text: r.text }, ...tools], tools.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, results };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const idOf = (i: number) => GDI.segments[i]!.id;
// The session's pages (task-7u-investigation.md), each holding something (the lesson entered it).
const PAGES: V2BoardPage[] = [
  { title: '概要', items: [{ id: 'o1', tool: 'annotate', summary: 'Today: your work' }] },
  { title: '仕事について', items: [card('j1', 'I work in sales in the home appliance division.')] },
  { title: '現在完了 (present perfect)', items: [card('p1', 'I have led my team for two years.')] },
  { title: '過去形 (past simple)', items: [card('s1', 'I attended a robotics exhibition last year.')] },
  { title: 'Conversation', items: [card('c1', 'I worked on a project to collect money for donation.')] },
];
const PRON_PAGE: V2BoardPage = { title: '発音 (Pronunciation)', items: [] };
/** The state in part `k` of the session (2 Your job … 5 Conversation): pages up to it, the parts before it done. */
function inPart(k: number, extra: Partial<V2State> = {}): V2State {
  const pageCount = k; // pages: overview, then one per part from Your job (index 2)
  const goals: V2State['goals'] = { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'demonstrated', at: 0 } };
  for (let i = 2; i < k; i++) goals[idOf(i)] = { status: 'shown', at: 0 };
  const practiceSaid: Record<string, number> = {}; for (let i = 2; i <= k; i++) practiceSaid[idOf(i)] = 3;
  return { ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(PAGES.slice(0, pageCount)), current: pageCount - 1 }, goals, practiceSaid, timeFit: { dropped: [], byArrival: true }, history: [u('x'), a('Tell me more.')], ...extra };
}
async function turn(session: V2Session, state: V2State, said: string | null, text: string | Array<{ text: string; tools?: Array<{ name: string; input: Record<string, unknown> }> }>, atMin: number) {
  const m = scripted(typeof text === 'string' ? [{ text }] : text);
  const r = await runV2Turn({ session, state: structuredClone(state), studentSaid: said, callModel: m.call, boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  return { r, facts: m.facts.join('\n'), results: m.results };
}

/** Fix round 1 (I1): a lesson of this plan shape run on the part clock's own lines (v2PartPace / v2OptionalWrapMin), the level check
 *  done at 2.1 as live, 0.3 min for each part ask. `quick`: each part left as soon as its go-on line lifts; `plan`: each part takes
 *  exactly its plan minutes; `slow`: each part takes 1.5× its minutes, or is left when the facts say the lesson is behind. A part
 *  change past the (held) wrap goes to the summary. Returns when each part began and ended. */
function simulate(policy: 'quick' | 'plan' | 'slow') {
  const out: Array<{ part: string; from: number; to: number }> = [];
  let t = 2.1; const ask = policy === 'plan' ? 0 : 0.3; let summaryAt = -1;
  for (let k = 2; k <= 5 && summaryAt < 0; k++) {
    const st = inPart(k, { partStart: { part: idOf(k), at: t * MIN } });
    const own = (GDI.segments[k]!.estimatedMinutes ?? 0) as number;
    let x = t;
    for (; x < 30; x += 0.05) {
      // The turn's session carries the wrap held for this turn (as runV2Turn passes it to the facts).
      const wrap = v2OptionalWrapMin(lang, st, x * MIN, 18, 5, null)?.wrap ?? 18;
      const pace = v2PartPace({ ...lang, wrapMinutes: wrap }, st, x * MIN, true)!;
      if (x >= wrap) { summaryAt = x; break; }
      if (policy === 'quick' && !pace.stay) break;
      if (policy === 'plan' && x - t >= own - 1e-9 && !pace.stay) break;
      if (policy === 'slow' && (x - t >= 1.5 * own - 1e-9 || pace.late)) break;
    }
    out.push({ part: idOf(k), from: t, to: x });
    t = x + (summaryAt < 0 ? ask : 0);
  }
  if (summaryAt < 0) {
    // Pronunciation offered at t: taken when the (held) wrap has not come; it runs its 3 minutes (1.5× for the slow learner) or to
    // the end of the wrap held for it, whichever is first.
    const conv = inPart(5, { partStart: { part: 'open-conversation', at: out[out.length - 1]!.from * MIN } });
    const hold = v2OptionalWrapMin(lang, conv, t * MIN, 18, 5, null);
    if (hold && t < hold.wrap) {
      const inPronSt = inPart(5, { board: { pages: [...structuredClone(PAGES), { ...PRON_PAGE, items: [{ id: 'r', tool: 'annotate', summary: 'x' }] }], current: 5 }, partStart: { part: 'pronunciation', at: t * MIN } });
      const end = Math.min(t + (policy === 'slow' ? 4.5 : 3), v2OptionalWrapMin(lang, inPronSt, t * MIN, 18, 5, null)?.wrap ?? t + 3);
      out.push({ part: 'pronunciation', from: t, to: end }); summaryAt = end;
    } else summaryAt = t;
  }
  out.push({ part: 'summary', from: summaryAt, to: summaryAt + 2 });
  return out.map((p) => ({ part: p.part, from: Math.round(p.from * 100) / 100, to: Math.round(p.to * 100) / 100 }));
}

/** Fix round 2: two other labelled plan shapes, run fast (each part left as soon as its go-on line lifts; the summary at the wrap). */
const shape = (box: number, parts: Array<[string, string, number]>): { session: V2Session; plan: LessonPlan } => {
  const base: Record<string, Segment> = { hook: GDI.segments[0]!, concept: GDI.segments[2]!, try_yourself: GDI.segments[3]!, recap: GDI.segments[7]! };
  const plan: LessonPlan = { ...GDI, subject: 'Maths', segments: parts.map(([label, kind, m]) => ({ ...base[kind]!, id: label.toLowerCase().replace(/\s+/g, '-'), kind, teacherNote: `${label}.`, metadata: { label }, estimatedMinutes: m }) as Segment) };
  return { plan, session: { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: box, plan } };
};
const TEACH_PRACTICE = shape(12, [['Overview', 'hook', 1], ['Teach', 'concept', 5], ['Practice', 'try_yourself', 4], ['Summary', 'recap', 2]]);
const CONCEPT_TWO = shape(15, [['Overview', 'hook', 1], ['Concept', 'concept', 5], ['First practice', 'try_yourself', 3], ['Second practice', 'try_yourself', 3], ['Summary', 'recap', 2]]);
function simulateFast(sh: { session: V2Session; plan: LessonPlan }) {
  const { session, plan } = sh; const last = plan.segments.length - 1;
  const out: Array<{ part: string; from: number; to: number }> = []; let t = 1; let summaryAt = -1;
  for (let k = 1; k < last && summaryAt < 0; k++) {
    const id = plan.segments[k]!.id;
    const st: V2State = { ...newV2State(0), board: { pages: plan.segments.slice(0, k + 1).map((x, i) => ({ title: String((x.metadata as { label?: string }).label), items: [{ id: `p${i}`, tool: 'annotate', summary: 'x' }] })), current: k }, goals: Object.fromEntries(plan.segments.slice(0, k).map((x) => [x.id, { status: 'shown' as const, at: 0 }])), practiceSaid: { [id]: 3 }, timeFit: { dropped: [], byArrival: true }, partStart: { part: id, at: t * MIN }, history: [u('x'), a('Go on.')] };
    let x = t;
    for (; x < 40; x += 0.05) { if (x >= session.timeBoxMinutes! - 2) { summaryAt = x; break; } if (!v2PartPace(session, st, x * MIN, true)!.stay) break; }
    out.push({ part: String((plan.segments[k]!.metadata as { label?: string }).label), from: t, to: x }); t = x + (summaryAt < 0 ? 0.3 : 0);
  }
  if (summaryAt < 0) summaryAt = t;
  out.push({ part: 'Summary', from: summaryAt, to: summaryAt + 2 });
  return out.map((p) => ({ part: p.part, from: Math.round(p.from * 100) / 100, to: Math.round(p.to * 100) / 100 }));
}

// The session's turns (Mongo tutorsessions embed-1795067373124, transcript T55–T85; board blocks as the record painted them).
const T55_HEARD = '大丈夫です。空欄には「work」の過去分詞を入れます。';
const T55_UNHEARD = ['「work」の過去分詞は「worked」です。', 'Try saying the whole sentence with "worked" in the gap.'];
const T56 = 'Ah, I have worked with customers in Canada.';
const T57 = 'Yes, that\'s right: "I have worked with customers in Canada."\n<board sentence stress="have worked">I have worked with customers in Canada.</board>\nThat\'s the end of Present perfect. Next is Past simple, for finished events at a specific time.\n\nShall we go on, or do you have a question first?';
const T65 = 'Yes, that\'s right. "Visited" is past simple, and "in Tokyo" is correct now.\n\nNext, fill the gap in this sentence and say the whole sentence aloud.\n\n<board problem gloss="空欄に過去形の動詞を入れて、文全体を言ってください。">Last year, I ___ a customer in Canada.</board>';
const T66 = 'Last year I visited a customer in Canada.';
const T67 = 'Yes, that\'s right: "Last year I visited a customer in Canada."\n<board sentence>Last year I visited a customer in Canada.</board>\nNow, what did you talk about with that customer? Start with: I discussed…';
const T83 = 'Yes, "Last month we reached our goal" is correct now. Let\'s go on with your project. Fill the gap and say the whole sentence.\n\n<board problem>Our project helped us ___ new customers.</board>';
const T84 = 'Our project helped us uh get new customers.';
const T85 = 'That\'s right: "helped us get new customers" is a natural sentence.\n<board sentence>Our project helped us get new customers.</board>\nNow, when did your project finish? Start your answer with: The project finished in…';
const T99 = 'That finishes our conversation. Next is Pronunciation, which is optional. Shall we move on, or is there anything you would like to ask first?';

// A maths voice demo with a labelled plan (the shape a demo plan takes when its parts carry names and minutes), and one without names.
const seg = (base: Segment, over: Record<string, unknown>) => ({ ...base, ...over }) as Segment;
const MATHS: LessonPlan = { ...GDI, subject: 'Maths', topic: 'Linear equations', segments: [
  seg(GDI.segments[0]!, { id: 'warm', goal: 'Warm-up', teacherNote: 'Warm up with one quick question.', metadata: { label: 'Warm-up' }, estimatedMinutes: 2 }),
  seg(GDI.segments[3]!, { id: 'practice', problem: 'Solve 2x + 3 = 11.', teacherNote: 'Work two equations with them.', metadata: { label: 'Practice' }, estimatedMinutes: 6 }),
  seg(GDI.segments[7]!, { id: 'sum', teacherNote: 'Sum up.', metadata: { label: 'Summary' }, estimatedMinutes: 2 }),
] };
const MATHS_PLAIN: LessonPlan = { ...MATHS, segments: MATHS.segments.map((s) => ({ ...s, metadata: {} }) as Segment) };
const maths: V2Session = { studentName: 'Sam', subject: 'Maths', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 10, wrapMinutes: 8, plan: MATHS };
const mathsPlain: V2Session = { ...maths, plan: MATHS_PLAIN };
const mathsState = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: [{ title: 'Warm-up', items: [{ id: 'w1', tool: 'annotate', summary: '3 × 4' }] }, { title: 'Practice', items: [{ id: 'm1', tool: 'show_problem', summary: 'Solve 2x + 3 = 11.' }] }], current: 1 }, goals: { warm: { status: 'shown', at: 0 } }, history: [u('x'), a('What do we do first?')], ...extra });

/** A corrected pair as the reply carded it. */
const pair = (said: string, cardS: string, stress: string[]): { said: string; card: string; stress: string[] } => ({ said, card: cardS, stress });
const YJ = [
  pair('I work in sales on uh home appliance division.', 'I work in sales in the home appliance division.', ['in', 'the', 'home', 'appliance', 'division']),
  pair('Uh, main responsibility uh, tell junior sales agent how sell.', 'My main responsibility is to tell junior sales agents how to sell.', ['is', 'to', 'tell']),
  pair('I help my team um negotiate customer and get best price.', 'I help my team negotiate with customers and get the best price.', ['negotiate', 'with', 'customers']),
  pair('I think my team is uh capable sell washing machine themself.', 'I think my team is capable of selling washing machines by themselves.', ['capable', 'of', 'selling']),
  pair('Our goal is to increase sales revenue of washing machine division.', 'Our goal is to increase sales revenue for the washing machine division.', ['for']),
];

/** The session's corrections and retests through 7q's own functions, part by part (the turns as the investigation's table E). */
function retestWalk() {
  const st = inPart(2);
  const events: string[] = []; const offers: string[] = [];
  const say = (k: number, heard: string, pairs: V2PracticePair[] = []) => {
    if (st.board.pages.length < k) { st.board.pages = structuredClone(PAGES.slice(0, k)); st.board.current = k - 1; }
    const before = v2AdaptBefore(lang, st, heard, 0);
    events.push(...before.events.map((e) => `${e.type} ${e.message}`));
    offers.push(...before.lines.filter((l) => /^retest of an earlier mistake/.test(l)));
    st.history = [...st.history, u(heard), a('Reply.')];
    const after = v2AdaptAfter(lang, st, { index: k, id: idOf(k) }, [heard], pairs);
    events.push(...after.map((e) => `${e.type} ${e.message}`));
  };
  const corr = (p: { said: string; card: string; stress: string[] }) => v2PracticePairs([p.said], [{ sentence: p.card, stress: p.stress }]);
  // Your job: five corrections.
  for (const p of YJ) say(2, p.said, corr(p));
  const afterJob = (st.retests ?? []).map((r) => ({ part: r.part, target: r.target }));
  // Present perfect: the first retest offered, sent twice, not asked; later turns offer nothing more in this part.
  say(3, 'I have worked with Nagoya for 7 year.', corr(pair('I have worked with Nagoya for 7 year.', 'I have worked for Nagoya for seven years.', ['for', 'years'])));
  say(3, 'I have worked in sales for 3 year.', corr(pair('I have worked in sales for 3 year.', 'I have worked in sales for three years.', ['years'])));
  say(3, 'I have led uh my team for 2 years.', corr(pair('I have led uh my team for 2 years.', 'I have led my team for two years.', [])));
  say(3, 'I have worked with customers in Canada.', corr(pair('I have worked with customers in Canada.', 'I have worked with customers in Canada.', [])));
  // Past simple: the next retest offered; its answer uses the target, right.
  say(4, 'I attended robotics exhibition last year.', corr(pair('I attended robotics exhibition last year.', 'I attended a robotics exhibition last year.', ['a', 'robotics', 'exhibition'])));
  say(4, 'My job is to tell my team how to sell.', corr(pair('My job is to tell my team how to sell.', 'My job is to tell my team how to sell.', [])));
  say(4, 'I visited our field office at Tokyo last year.', corr(pair('I visited our field office at Tokyo last year.', 'I visited our field office in Tokyo last year.', ['in', 'Tokyo'])));
  // Conversation: the third retest offered.
  say(5, 'I worked on a project to collect money for donation.', corr(pair('I worked on a project to collect money for donation.', 'I worked on a project to collect money for donation.', [])));
  say(5, 'As a senior manager, I told everyone go raise money.', corr(pair('As a senior manager, I told everyone go raise money.', 'As a senior manager, I told everyone to raise money.', ['to', 'raise'])));
  return { afterJob, events, offers, retests: (st.retests ?? []).map((r) => ({ part: r.part, in: r.in ?? null, target: r.target, offered: r.offered ?? 0, outcome: r.outcome ?? null })) };
}

async function probe() {
  // ── 1 PART_CLOCK: "Your job" entered at 2.1 (level check done at 1.5 of its 3 minutes) ──
  const job = (extra: Partial<V2State> = {}) => inPart(2, { partStart: { part: 'topic-intro', at: 2.1 * MIN }, ...extra });
  const clock = {
    stay30: v2StayInPartLine(lang, job(), 3.0 * MIN), stay40: v2StayInPartLine(lang, job(), 4.0 * MIN), stay52: v2StayInPartLine(lang, job(), 5.2 * MIN),
    up45: v2PartTimeUpLine(lang, job(), 4.5 * MIN), up52: v2PartTimeUpLine(lang, job(), 5.2 * MIN),
    upMovedOn: v2PartTimeUpLine(lang, job({ moveOnAsked: ['topic-intro'] }), 5.2 * MIN),
    behind52: v2PartBehind(lang, job(), 2, 5.2 * MIN), behind40: v2PartBehind(lang, job(), 2, 4.0 * MIN),
  };
  const facts30 = (await turn(lang, job(), 'I help my team negotiate with customers.', 'Good. What else do you do?', 3.0)).facts;
  const t52 = await turn(lang, job(), 'I help my team negotiate with customers.', 'Good. What else do you do?', 5.2);
  // The part start is set when the lesson enters a part, kept while it stays, and round-trips.
  const mark = inPart(2); v2MarkPartStart(lang, mark, 2.1 * MIN); const first = mark.partStart ?? null; v2MarkPartStart(lang, mark, 3.3 * MIN); const kept = mark.partStart ?? null;
  mark.board.pages.push(structuredClone(PAGES[2]!)); mark.board.current = 2; v2MarkPartStart(lang, mark, 5.1 * MIN); const moved = mark.partStart ?? null;
  const fresh = await turn(lang, inPart(2), 'I help my team negotiate with customers.', 'Good.', 2.4);
  const roundTrip = v2ReadClientState(JSON.parse(JSON.stringify(t52.r.state)))?.partStart ?? null;
  // A maths voice demo, labelled: the practice part entered at 1.0 after a short warm-up.
  const ms = mathsState({ partStart: { part: 'practice', at: 1.0 * MIN } });
  const mathsClock = { stay35: v2StayInPartLine(maths, ms, 3.5 * MIN), up72: v2PartTimeUpLine(maths, ms, 8.2 * MIN), plainClock: v2PartClock(mathsPlain, ms, 3.5 * MIN) };
  const mathsFacts = (await turn(maths, ms, 'x equals 4', 'Yes, x = 4. Try 3x − 5 = 10.', 3.5)).facts;
  const mathsPlainFacts = (await turn(mathsPlain, mathsState(), 'x equals 4', 'Yes, x = 4. Try 3x − 5 = 10.', 7.2)).facts;

  // Fix round 1 (I1): the core part, the behind check, the three worked cases.
  const core = { index: v2CorePart(GDI), mathsIndex: v2CorePart(MATHS),
    convEarly: v2StayInPartLine(lang, inPart(5, { partStart: { part: 'open-conversation', at: 8.0 * MIN } }), 13.5 * MIN),
    convEarlyUp: v2PartTimeUpLine(lang, inPart(5, { partStart: { part: 'open-conversation', at: 8.0 * MIN } }), 15.2 * MIN),
    psLate: v2PartTimeUpLine(lang, inPart(4, { partStart: { part: 'past-simple', at: 11.85 * MIN } }), 16.2 * MIN),
    psLateShort: v2PartTimeUpLine(lang, inPart(4, { partStart: { part: 'past-simple', at: 11.85 * MIN }, practiceSaid: { 'past-simple': 1 } }), 16.2 * MIN),
    psLateStay: v2StayInPartLine(lang, inPart(4, { partStart: { part: 'past-simple', at: 15.0 * MIN } }), 16.2 * MIN) };
  const sims = { quick: simulate('quick'), plan: simulate('plan'), slow: simulate('slow') };
  // Fix round 2: the core part is the last required teaching part; two other plan shapes, fast; N2 the slow case's line at 19.3.
  const cores = { teach: v2CorePart(TEACH_PRACTICE.plan), concept: v2CorePart(CONCEPT_TWO.plan) };
  const fast = { teach: simulateFast(TEACH_PRACTICE), concept: simulateFast(CONCEPT_TWO) };
  const slow193 = v2StayInPartLine({ ...lang, wrapMinutes: 19.5 }, inPart(5, { partStart: { part: 'open-conversation', at: 16.3 * MIN } }), 19.3 * MIN);
  // ── 2 OPTIONAL_FIT: Conversation entered at 13.8; Pronunciation offered at 17.85 (T99); "Uh, yes, let's go." at 18.1 ──
  const conv = (extra: Partial<V2State> = {}) => inPart(5, { partStart: { part: 'open-conversation', at: 13.8 * MIN }, history: [u('x'), a(T99)], ...extra });
  const wrapAtOffer = v2OptionalWrapMin(lang, inPart(5, { partStart: { part: 'open-conversation', at: 13.8 * MIN } }), 17.85 * MIN, 18, 5, null);
  const yes = await turn(lang, conv(), 'Uh, yes, let\'s go.', 'Great. Would you like to practise words, a sentence, or speaking naturally?', 18.1);
  const yesPage = yes.r.toolCalls.find((c) => c.name === 'new_page' && !/^not /.test(c.outcome));
  const inPron = { ...yes.r.state, board: { ...yes.r.state.board, pages: yes.r.state.board.pages.map((p, i) => (i === yes.r.state.board.current ? { ...p, items: [{ id: 'r1', tool: 'annotate', summary: 'responsibilities' }] } : p)) }, practiceSaid: { ...yes.r.state.practiceSaid, pronunciation: 1 } };
  const wrapIn = v2OptionalWrapMin(lang, inPron, 19.0 * MIN, 18, 5, null);
  const pron19 = await turn(lang, inPron, 'Responsibilities.', 'Good. Now say "international".', 19.0);
  const pron212 = await turn(lang, inPron, 'International.', 'Good. Let\'s sum up.', 21.2);
  // The session as it went: no page at 18.1, the summary; at 18.9 (after the invitation) "Can we do pronunciation before going?".
  const summaryGiven = (extra: Partial<V2State> = {}) => inPart(5, { summaryBegunAt: 18.3 * MIN, closeInvitedAt: 18.8 * MIN, board: { pages: [...structuredClone(PAGES), { title: 'Summary', items: [card('z1', 'I attended a robotics exhibition last year.')] }], current: 5 }, history: [u('x'), a('Great work today. Pronunciation is still open, so we can practise it next time. Do you have any questions before we finish?')], ...extra });
  const askedIndex = v2OptionalAskedAtClose(GDI, summaryGiven(), 'Can we do pronunciation before going?');
  const later = await turn(lang, summaryGiven(), 'Can we do pronunciation before going?', 'Sure, let\'s do a little pronunciation.', 18.9);
  const laterPage = later.r.toolCalls.find((c) => (c.name === 'new_page' || c.name === 'go_to_page') && !/^not /.test(c.outcome));
  const tooLate = await turn(lang, summaryGiven(), 'Can we do pronunciation before going?', 'There is no time for it today.', 22.6);
  const notAsk = v2OptionalAskedAtClose(GDI, summaryGiven(), 'I will practise pronunciation at home.');
  // Without a fit (the box nearly spent at the offer): nothing is held.
  const noFit = v2OptionalWrapMin(lang, inPart(5), 21.0 * MIN, 18, 5, null);
  const declined = v2OptionalWrapMin(lang, inPart(5, { timeFit: { dropped: ['pronunciation'], byArrival: true, byChoice: ['pronunciation'] } }), 17.85 * MIN, 18, 5, null);
  // Fix round 1 (m2): the turn of their no: no held line. (I2) In the part with no start known: no hold.
  const declineTurn = await turn(lang, conv({ history: [u('x'), a('That was a good conversation. Shall we do Pronunciation, or go on to the summary?')] }), 'No, thank you.', 'All right, let\'s sum up.', 18.1);
  const noStart = v2OptionalWrapMin(lang, { ...inPron, partStart: undefined }, 19.0 * MIN, 18, 5, null);
  // Fix round 1 (a): a tutor-chosen end_lesson at 18.5 (host wrap 18, held to 19.5, Pronunciation not offered): deferred once.
  const notOffered = (extra: Partial<V2State> = {}) => inPart(5, { partStart: { part: 'open-conversation', at: 13.8 * MIN }, history: [u('x'), a('What was the hardest part of that project?')], ...extra });
  const endOnce = await turn(lang, notOffered(), 'It was the deadline.', [{ text: 'I see. Thank you, goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }, { text: 'Goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }], 18.5);
  const endAfter = await turn(lang, notOffered({ history: [u('x'), { role: 'assistant', content: [{ type: 'tool_use', id: 'e1', name: 'end_lesson', input: { summary: 'x' } }] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'e1', content: 'not ended yet: the optional Pronunciation part still fits…' }] }, a('What was the hardest part?')] }), 'The deadline.', [{ text: 'Thank you, goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }], 18.7);
  const endStop = await turn(lang, notOffered(), 'Sorry, I have to finish now.', [{ text: 'Of course. Goodbye!', tools: [{ name: 'end_lesson', input: { summary: 'x' } }] }], 18.5);
  // Fix round 1 (m10): a typed lesson with this plan past the wrap: the closing line as before.
  const typedFacts = renderFacts({ ...lang, mode: 'text' }, inPart(5), { nowMs: 18.5 * MIN, heard: 'Okay.' });
  const spokenClosing = renderFacts(lang, inPart(5, { summaryBegunAt: 18.3 * MIN }), { nowMs: 18.6 * MIN, heard: 'Okay.' });

  // ── 3, 4 retests ──
  const targets = YJ.map((p) => v2ChangedTarget(p.said, p.card, p.stress));
  const praiseState = inPart(3, { retests: [{ part: 'topic-intro', said: YJ[2]!.said, right: YJ[2]!.card, target: v2ChangedTarget(YJ[2]!.said, YJ[2]!.card, YJ[2]!.stress), turn: 7, offered: 1, in: 'present-perfect', askedAt: 9, lastAt: 9 }] });
  const praiseNo = v2AdaptBefore(lang, structuredClone(praiseState), T56, 0).lines.filter((l) => /^retest: their answer/.test(l));
  const praiseYes = v2AdaptBefore(lang, structuredClone(praiseState), 'I negotiate with customers every week.', 0).lines.filter((l) => /^retest: their answer/.test(l));
  const walk = retestWalk();
  // Fix round 1 (b): the 7q scenarios with every switch ON: a missed retest and its gap; the cap of 3 (a 4th refused); spent → the next
  // part may ask the next one; the same target recorded once.
  const cov = (() => {
    const st = inPart(3); const ev: string[] = []; const lines: string[] = [];
    const step = (k: number, heard: string, pairs: V2PracticePair[]) => {
      if (st.board.pages.length < k) { st.board.pages = structuredClone(PAGES.slice(0, k)); st.board.current = k - 1; }
      const b = v2AdaptBefore(lang, st, heard, 0); ev.push(...b.events.map((e) => `${e.type} ${e.message}`)); lines.push(...b.lines);
      st.history = [...st.history, u(heard), a('Reply.')];
      ev.push(...v2AdaptAfter(lang, st, { index: k, id: idOf(k) }, [heard], pairs).map((e) => `${e.type} ${e.message}`));
    };
    const pr = (said: string, cardS: string, stress: string[]) => v2PracticePairs([said], [{ sentence: cardS, stress }]);
    st.retests = [
      { part: 'topic-intro', said: 'I work on sales.', right: 'I work in sales.', target: ['in sales'], turn: 1 },
      { part: 'topic-intro', said: 'I go to office.', right: 'I go to the office.', target: ['the office'], turn: 2 },
      { part: 'present-perfect', said: 'I work here since 2020.', right: 'I have worked here since 2020.', target: ['have worked'], turn: 3 },
      { part: 'present-perfect', said: 'He go home.', right: 'He goes home.', target: ['goes home'], turn: 4 },
    ];
    st.history = [u('x'), a('a'), u('b'), a('c'), u('d'), a('e'), u('f'), a('g')];
    // Present perfect (where entries 3, 4 were made): offers "in sales"; he says it wrong again → missed.
    step(3, 'I work at a bank.', pr('I work at a bank.', 'I work at a bank.', []));
    step(3, 'I work on sales now.', pr('I work on sales now.', 'I work in sales now.', ['in']));
    // The same target again is recorded once (it is "in sales" again).
    const before = st.retests!.length;
    step(3, 'I work on sales today.', pr('I work on sales today.', 'I work in sales today.', ['in']));
    const dedupe = st.retests!.length === before;
    // Past simple: offers "the office"; sent twice with no answer using it → spent → not asked.
    step(4, 'I went to Tokyo.', pr('I went to Tokyo.', 'I went to Tokyo.', []));
    step(4, 'I met a client.', pr('I met a client.', 'I met a client.', []));
    step(4, 'I wrote a report.', pr('I wrote a report.', 'I wrote a report.', []));
    step(4, 'I called him.', pr('I called him.', 'I called him.', []));
    // Conversation: the next may be asked (the spent one did not count); after it, two put to them → the cap counts them.
    step(5, 'I worked on a big project.', pr('I worked on a big project.', 'I worked on a big project.', []));
    const counted = st.retests!.filter((r) => r.offered && r.outcome !== 'not_asked').length;
    // A 4th retest beyond the cap of 3: three put to them, then a new part asks nothing.
    const capped = structuredClone(st); capped.retests = [...capped.retests!.map((r) => ({ ...r, offered: r.offered ?? 1, outcome: r.outcome === 'not_asked' ? 'passed' as const : r.outcome ?? 'passed' as const, in: r.in ?? 'present-perfect' })), { part: 'topic-intro', said: 'x y z w', right: 'x y z v', target: ['z v'], turn: 9 }];
    capped.board = { pages: structuredClone(PAGES.slice(0, 5)), current: 4 }; capped.history = [...capped.history, u('q'), a('r')];
    const fourth = v2AdaptBefore(lang, capped, 'I worked on another project.', 0).lines.filter((l) => /^retest of an earlier mistake/.test(l));
    return { ev, dedupe, counted, fourth, gaps: v2RetestGaps(st), retests: st.retests!.map((r) => ({ target: r.target.join('/'), in: r.in ?? null, outcome: r.outcome ?? null })) };
  })();

  // ── 5 signals: the answers of turns 30 (T56, its ask spoken over), 35 (T66) and 44 (T84) ──
  const t30State = inPart(3, { history: [u('x'), a('Now fill the gap in this sentence, saying the whole sentence aloud.\n\n<board problem>Yes, I have ___ with customers in Canada.</board>'), u('I have um what do I do here? I don\'t know.'), a(`${T55_HEARD} [cut off here: the student began to speak]`)], unheard: T55_UNHEARD });
  const t35State = inPart(4, { history: [u('x'), a(T65)] });
  const t44State = inPart(5, { history: [u('x'), a(T83)] });
  const sentences = { t30: v2PracticeAnswerSentences(lang, t30State, T56), t35: v2PracticeAnswerSentences(lang, t35State, T66), t44: v2PracticeAnswerSentences(lang, t44State, T84) };
  const ev = async (st: V2State, said: string, reply: string, at: number) => ((await turn(lang, st, said, reply, at)).r.events ?? []).map((e) => `${e.type} ${e.message}`);
  const signals = { t30: await ev(t30State, T56, T57, 10.0), t35: await ev(t35State, T66, T67, 11.9), t44: await ev(t44State, T84, T85, 15.4) };
  const digits = {
    seven: v2PracticePairs(['My team has uh 7 uh people.'], [{ sentence: 'My team has seven people.', stress: [] }]).map((p) => p.corrected),
    two: v2PracticePairs(['I have led uh my team for 2 years.'], [{ sentence: 'I have led my team for two years.', stress: ['have', 'led'] }]).map((p) => p.corrected),
  };

  // ── 6 the support step ──
  const gapExplained = v2PracticeAnswerSentences(lang, inPart(3, { history: [u('x'), a('大丈夫です。空欄には「work」の過去分詞を入れます。')] }), 'I see, so I put worked there.');
  const lines = { starter: v2SupportLine('starter'), gap: v2SupportLine('gap'), repeat: v2SupportLine('repeat'), stretch: v2SupportLine('stretch') };
  const convGap = await turn(lang, inPart(5, { support: { step: 'gap', wrong: 0, clean: 0, part: 'open-conversation' } }), 'I worked on a project to collect money for donation.', 'Good. What was your role?', 15.0);
  const convAfter = inPart(5, { support: { step: 'starter', wrong: 1, clean: 0, part: 'open-conversation' }, history: [u('x'), a('Tell me about it.'), u('a'), a('b')] });
  v2AdaptAfter(lang, convAfter, { index: 5, id: 'open-conversation' }, ['As a senior manager, I told everyone go raise money.'], v2PracticePairs(['As a senior manager, I told everyone go raise money.'], [{ sentence: 'As a senior manager, I told everyone to raise money.', stress: ['to', 'raise'] }]));
  const intoConv = inPart(5, { support: { step: 'repeat', wrong: 0, clean: 0, part: 'past-simple' } });
  v2AdaptBefore(lang, intoConv, 'Yes.', 0);
  const psGap = inPart(4, { support: { step: 'starter', wrong: 1, clean: 0, part: 'past-simple' }, history: [u('x'), a('Tell me about it.'), u('a'), a('b')] });
  v2AdaptAfter(lang, psGap, { index: 4, id: 'past-simple' }, ['I visited our field office at Tokyo last year.'], v2PracticePairs(['I visited our field office at Tokyo last year.'], [{ sentence: 'I visited our field office in Tokyo last year.', stress: ['in', 'Tokyo'] }]));
  const planMap = renderPlanMap(GDI);

  // ── 7 ──
  const self = v2SelfCorrection('My team is working on um uh presentation for senior staff.\nfor senior bosses.');
  const selfLines = v2PracticeFactLines(lang, inPart(2, { history: [u('x'), a('Now a question about your team\'s current work. Start your answer with: My team is working on…')] }), 'My team is working on um uh presentation for senior staff.\nfor senior bosses.');
  const selfNot = ['Yes, I think so.', 'I work in sales.\nYes.', 'I work in sales.\nWhat about you?', 'I work in sales. I sell washing machines.', 'I work in sales.\nI sell washing machines.', 'I visited Tokyo last year.\nI went there.'].map((x) => v2SelfCorrection(x));
  const selfYes = ['I have work here for five years.\nWorked.', 'I goed to Tokyo.\nWent.'].map((x) => v2SelfCorrection(x)?.phrase ?? null);
  const carried = v2CutWordsCarried('My team is working on um uh presentation for senior staff.', '', 0, 'for senior bosses.');
  const carriedNot = [v2CutWordsCarried('My team is working on a report.', 'That\'s', 0, 'for senior bosses.'), v2CutWordsCarried('My team is working on a report.', '', 1, 'for senior bosses.'), v2CutWordsCarried('My team is working on a report.', '', 0, null)];
  const joined = v2WithCarried(carried, 'for senior bosses.');
  // 13:38: the part "Please say that sentence after me, once: Yesterday I wrote an email to the customer." playing; he began with
  // "Yesterday" as the voice reached it; the voice had played up to "to" when his words came in (7 words in reach, as logged).
  const repeat = (aheadOn?: boolean) => {
    const clock = aheadOn === undefined ? new V2EchoClock() : new V2EchoClock(undefined, undefined, undefined, aheadOn);
    const part = 'Please say that sentence after me, once: Yesterday I wrote an email to the customer.';
    clock.started(part, 0);
    const p = (elapsedSec: number) => ({ sentence: part, elapsedSec, arrivedTotalSec: 7.5, playing: true });
    clock.speechStart(4000, p(4.1));
    const own = clock.judge('Yesterday I wrote an email to the customer.', 7300, p(5.6));
    const echo = clock.judge('once yesterday I wrote an email to', 7300, p(5.6));
    return { own: own.own, score: own.score, timing: own.timing, echo: echo.own };
  };
  return {
    spokenClosing, core, sims, cores, fast, slow193, declineTurnFacts: declineTurn.facts, noStart, endOnce: { results: endOnce.results, closed: endOnce.r.state.closed }, endAfter: { results: endAfter.results, closed: endAfter.r.state.closed }, endStop: endStop.r.state.closed, typedFacts, cov, gapExplained,
    clock, facts30, facts52: t52.facts, first, kept, moved, freshStart: fresh.r.state.partStart ?? null, roundTrip, mathsClock, mathsFacts, mathsPlainFacts,
    wrapAtOffer, yesPage: yesPage ? String(yesPage.args.title) : null, yesFacts: yes.facts, yesStart: yes.r.state.partStart ?? null, wrapIn, pron19Facts: pron19.facts, pron212Facts: pron212.facts,
    askedIndex, laterFacts: later.facts, laterPage: laterPage ? String(laterPage.args.title) : null, tooLateFacts: tooLate.facts, notAsk, noFit, declined,
    targets, praiseNo, praiseYes, walk, sentences, signals, digits, lines, convGapFacts: convGap.facts, convAfterStep: convAfter.support?.step ?? null, intoConvStep: intoConv.support?.step ?? null, psGapStep: psGap.support?.step ?? null,
    freeConv: GDI.segments.map((s) => v2FreeConversationPart(s)), planMap,
    self, selfLines, selfNot, selfYes, carried, carriedNot, joined, repeatOn: repeat(), repeatOff: repeat(false),
  };
}

const idx = (facts: string, re: RegExp) => facts.split('\n').findIndex((l) => re.test(l));

async function main() {
  const on = await probe();
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(on)}`); return; }

  console.log('1  PART_CLOCK: a part\'s time from when the lesson entered it');
  check('"Your job" (entered 2.1): at 3.0 "about 2 of its 3 minutes left: go on"', /has about 2 of its 3 minutes left by the plan: there is time/.test(on.clock.stay30 ?? ''), on.clock.stay30);
  check('at 4.0 (past half its own minutes) no stay line (the lesson clock held it to 6.5)', on.clock.stay40 === null && on.clock.stay52 === null);
  check('at 5.2 (its 3 minutes used, 7f minimum met) the facts say offer the next part; at 4.5 not yet', /this part \(Your job\) has had its 3 planned minutes \(about 3 used in it\): once its practice is done, close it and offer the next part/.test(on.clock.up52 ?? '') && on.clock.up45 === null, on.clock);
  check('not when they asked to move on (theirs to close)', on.clock.upMovedOn === null);
  check('through runV2Turn: 3.0 has the stay line; 5.2 the part-time line and no lesson-clock "would be running now"', /has about 2 of its 3 minutes left/.test(on.facts30) && /has had its 3 planned minutes/.test(on.facts52) && !/would be running now/.test(on.facts52), on.facts52.split('\n').filter((l) => /^time:|would be running/.test(l)));
  console.log('1  fix round 1 (I1): the core part keeps the time saved; a cumulative behind check');
  check('the core part is the last required teaching part: Conversation (maths demo: Practice; teach 5 / practice 4: Practice; concept 5 / practice 3 / practice 3: the last practice)', on.core.index === 5 && on.core.mathsIndex === 1 && on.cores.teach === 2 && on.cores.concept === 3, [on.core, on.cores]);
  const fseq = (k: 'teach' | 'concept') => on.fast[k].map((p) => `${p.part} ${p.from}–${p.to}`).join(' · ');
  console.log(`    teach 5 / practice 4 (target 12), fast:  ${fseq('teach')}\n    concept 5 / practice 3 / practice 3 (target 15), fast:  ${fseq('concept')}`);
  check('a fast lesson on either shape closes no more than 2 minutes before its target (the saved time goes to the last practice part)', (on.fast.teach.at(-1)?.to ?? 0) >= 12 - 2 && (on.fast.concept.at(-1)?.to ?? 0) >= 15 - 2, on.fast);
  check('fix round 2 (N2): the slow case at 19.3 (wrap held to 19.5): "less than a minute left", nothing about time saved', /main practice and has less than a minute left: there is time/.test(on.slow193 ?? '') && !/saved/.test(on.slow193 ?? ''), on.slow193);
  check('Conversation entered early (8.0): still "go on" at 13.5 (lesson clock under 20 − 3 − 2 = 15), its time up only from 15', /is the lesson's main practice and has about 2 minutes left/.test(on.core.convEarly ?? '') && /has had its time/.test(on.core.convEarlyUp ?? ''), [on.core.convEarly, on.core.convEarlyUp]);
  check('behind (16.2 > Past simple\'s plan end 15 + 1) with its two sentences said: time up now, and no go-on line', /the lesson is behind its plan/.test(on.core.psLate ?? '') && on.core.psLateStay === null, [on.core.psLate, on.core.psLateStay]);
  check('…not before its two practice sentences (7f): only the ordinary part-time line', !/behind its plan/.test(on.core.psLateShort ?? ''), on.core.psLateShort);
  const seq = (k: 'quick' | 'plan' | 'slow') => on.sims[k].map((p) => `${p.part} ${p.from}–${p.to}`).join(' · ');
  console.log(`    quick: ${seq('quick')}\n    plan:  ${seq('plan')}\n    slow:  ${seq('slow')}`);
  const at = (k: 'quick' | 'plan' | 'slow', part: string) => on.sims[k].find((p) => p.part === part);
  check('every part at its minimum: Conversation runs to about 15, Pronunciation about 15–18, the summary about 18–20', Math.abs((at('quick', 'open-conversation')?.to ?? 0) - 15) < 0.2 && Math.abs((at('quick', 'pronunciation')?.to ?? 0) - 18.35) < 0.3 && Math.abs((at('quick', 'summary')?.to ?? 0) - 20.35) < 0.3, on.sims.quick);
  check('every part on plan: Conversation 12.1–17.1, Pronunciation 17.1–20.1, summary to about 22.1 (inside the margin)', Math.abs((at('plan', 'open-conversation')?.from ?? 0) - 12.1) < 0.2 && Math.abs((at('plan', 'pronunciation')?.from ?? 0) - 17.1) < 0.2 && Math.abs((at('plan', 'summary')?.to ?? 0) - 22.1) < 0.3, on.sims.plan);
  check('slow learner (1.5×): Past simple left when the facts say behind (~16), Conversation runs to the held wrap (19.5), no Pronunciation, summary 19.5–21.5', (at('slow', 'past-simple')?.to ?? 0) < 16.2 && Math.abs((at('slow', 'open-conversation')?.to ?? 0) - 19.5) < 0.1 && !at('slow', 'pronunciation') && (at('slow', 'summary')?.to ?? 99) < 22, on.sims.slow);
  check('retests: the part is behind by its own minutes (5.2 yes, 4.0 no)', on.clock.behind52 && !on.clock.behind40);
  check('the part start: set on entering, kept while the part stays, moved when the next part\'s page opens', on.first?.part === 'topic-intro' && on.first.at === 2.1 * MIN && on.kept?.at === 2.1 * MIN && on.moved?.part === 'present-perfect' && on.moved.at === 5.1 * MIN);
  check('runV2Turn sets it for a part with none, and it round-trips through the client\'s copy', on.freshStart?.part === 'topic-intro' && on.freshStart.at === 2.4 * MIN && on.roundTrip?.part === 'topic-intro' && on.roundTrip.at === 2.1 * MIN, [on.freshStart, on.roundTrip]);
  check('maths voice demo, labelled: Practice is its core part: entered 1.0, "about 5 minutes left" at 3.5 (to 10 − summary 2 = 8), its time up at 8.2', /main practice and has about 5 minutes left/.test(on.mathsClock.stay35 ?? '') && /has had its time/.test(on.mathsClock.up72 ?? '') && /main practice and has about 5 minutes left/.test(on.mathsFacts) && !/would be running now/.test(on.mathsFacts), on.mathsClock);
  check('maths voice demo without part names: no part clock, the lesson-clock line as before', on.mathsClock.plainClock === null && /would be running now/.test(on.mathsPlainFacts) && !/planned minutes/.test(on.mathsPlainFacts));

  console.log('2  OPTIONAL_FIT: the 7i fit alone decides the optional part');
  check('at the offer (17.85): it fits (17.85 + 3 + 2 ≤ 25 − 0.5), the wrap moves to 19.5 (the last minute it fits, half a minute kept before the hard stop)', on.wrapAtOffer?.phase === 'next' && Math.abs((on.wrapAtOffer?.wrap ?? 0) - 19.5) < 1e-9, on.wrapAtOffer);
  check('"Uh, yes, let\'s go." at 18.1 (past the wrap 18): the Pronunciation page opens', !!on.yesPage && /発音|Pronunciation/.test(on.yesPage), on.yesPage);
  check('…the facts give no "no time for it now" and no "finish this exchange, then summary"', !/no time for it now/.test(on.yesFacts) && !/finish this exchange, then summary/.test(on.yesFacts), on.yesFacts.split('\n').filter((l) => /^time:|not reached/.test(l)));
  check('…and its clock starts at 18.1', on.yesStart?.part === 'pronunciation' && Math.abs((on.yesStart?.at ?? 0) - 18.1 * MIN) < 1, on.yesStart);
  check('in the part: the wrap moves to the end of its 3 minutes (21.1), the time line says go on with it, then the summary', on.wrapIn?.phase === 'in' && Math.abs((on.wrapIn?.wrap ?? 0) - 21.1) < 1e-6 && /the optional Pronunciation part fits before the session must end: go on with it \(about 2 of its 3 minutes left\), then the summary/.test(on.pron19Facts), [on.wrapIn, on.pron19Facts.split('\n').filter((l) => /^time:/.test(l))]);
  check('at 21.2 its minutes are over: "finish this exchange, then summary"', /then summary/.test(on.pron212Facts) && !/fits before the session must end/.test(on.pron212Facts), on.pron212Facts.split('\n').filter((l) => /^time:/.test(l)));
  check('later by name at the close ("Can we do pronunciation before going?", 18.9): recognised, its page turned to, the facts say it fits: take it', on.askedIndex === 6 && !!on.laterPage && /they asked for the Pronunciation part, which the lesson has not reached: there are about 6 minutes .* so it fits: take it up now/.test(on.laterFacts) && !/no time for it now/.test(on.laterFacts), [on.laterPage, on.laterFacts.split('\n').filter((l) => /Pronunciation/.test(l))]);
  check('the same at 22.6 (2.4 left, 3 needed): told plainly once there is no time', /not enough for it \(about 3\)/.test(on.tooLateFacts), on.tooLateFacts.split('\n').filter((l) => /Pronunciation/.test(l)));
  check('their intent for later is no request', on.notAsk === -1);
  check('no fit (21.0 + 5 > 25), or declined (7r): nothing held', on.noFit === null && on.declined === null);
  check('fix round 1 (m2): the turn of their no gets no held line', !/still fits before the session must end/.test(on.declineTurnFacts), on.declineTurnFacts.split('\n').filter((l) => /^time:/.test(l)));
  check('fix round 1 (I2): in the part with no start known, no hold (never one invented)', on.noStart === null);
  check('fix round 1 (a): a tutor-chosen end_lesson in the held window is deferred once, then accepted in the same reply', /^not ended yet: the optional Pronunciation part still fits/.test(on.endOnce.results[0] ?? '') && on.endOnce.results.length === 1 && on.endOnce.closed, on.endOnce);
  check('…deferred in an earlier reply: accepted at once; asked to stop: accepted at once', on.endAfter.closed && on.endStop, on.endAfter);
  check('spoken, summary begun at 18.3 with Pronunciation still fitting: named as next time without "no time", taken if they ask', /was not reached: in your summary, name it in one short line as something for next time; it would still fit/.test(on.spokenClosing) && !/no time for it now/.test(on.spokenClosing));
  check('fix round 1 (m10): a typed lesson past the wrap keeps the closing line as before', /no time for it now/.test(on.typedFacts) && !/would still fit/.test(on.typedFacts));

  console.log('3  RETEST_TARGET_CHANGED: the words that changed');
  check('"on → in the": "in the home"', JSON.stringify(on.targets[0]) === JSON.stringify(['in the home']), on.targets[0]);
  check('"tell → is to tell … how to sell" (5 changed): the stress words as one phrase, "is to tell"', JSON.stringify(on.targets[1]) === JSON.stringify(['is to tell']), on.targets[1]);
  check('"negotiate customer → negotiate with customers … the best": "negotiate with customers", "the best"', JSON.stringify(on.targets[2]) === JSON.stringify(['negotiate with customers', 'the best']), on.targets[2]);
  check('"capable sell → capable of selling … by themselves" (5): "capable of selling"; "revenue of → for the": "for the washing"', JSON.stringify(on.targets[3]) === JSON.stringify(['capable of selling']) && JSON.stringify(on.targets[4]) === JSON.stringify(['for the washing']), [on.targets[3], on.targets[4]]);
  check('praise: "I have worked with customers in Canada." gets none (T57 praised "customers")', on.praiseNo.length === 0, on.praiseNo);
  check('praise names only the changed words ("with customers"), never the neighbour', on.praiseYes.length === 1 && /you said "with customers" this time/.test(on.praiseYes[0]!), on.praiseYes);

  console.log('4  RETEST_SPREAD: two per part, one offered per part, the cap counted when put to them');
  const W = on.walk;
  check('after "Your job": its first two distinct targets only', W.afterJob.length === 2 && W.afterJob.every((r) => r.part === 'topic-intro') && JSON.stringify(W.afterJob.map((r) => r.target)) === JSON.stringify([['in the home'], ['is to tell']]), W.afterJob);
  const offeredIn = W.retests.filter((r) => r.offered).map((r) => r.in);
  check('one retest offered in each later practice part: Present perfect, Past simple, Conversation', JSON.stringify(offeredIn) === JSON.stringify(['present-perfect', 'past-simple', 'open-conversation']), W.retests);
  check('the Present perfect one ended not asked and did not use up the part\'s offer or a place of the three', W.retests.find((r) => r.in === 'present-perfect')?.outcome === 'not_asked' && W.events.filter((e) => /v2_retest_offered/.test(e) && /part=present-perfect/.test(e)).length === 2, W.events.filter((e) => /retest/.test(e)));
  check('the Past simple one was answered with its target: passed', W.retests.find((r) => r.in === 'past-simple')?.outcome === 'passed');
  check('later parts\' mistakes are recorded (Present perfect, Past simple, Conversation), two per part at most', ['present-perfect', 'past-simple', 'open-conversation'].every((p) => W.retests.some((r) => r.part === p)) && ['topic-intro', 'present-perfect', 'past-simple', 'open-conversation'].every((p) => W.retests.filter((r) => r.part === p).length <= 2), W.retests.map((r) => `${r.part}:${r.target.join('/')}`));

  console.log('4  fix round 1 (b): 7q scenarios with every switch on');
  const C = on.cov;
  check('a retest answered wrong on its target: missed, and the profile keeps it as a gap', C.retests.some((r) => r.target === 'in sales' && r.outcome === 'missed') && C.gaps.length === 1 && /in sales/.test(C.gaps[0]!.conceptLabel), [C.retests, C.gaps]);
  check('the same target again is recorded once', C.dedupe);
  check('spent (two sends, no answer using it): not asked; the next part may ask the next one', C.retests.some((r) => r.in === 'past-simple' && r.outcome === 'not_asked') && C.retests.some((r) => r.in === 'open-conversation'), C.retests);
  check(`the cap of ${V2_RETEST_MAX_ASKED}: with three put to them, a 4th is never asked`, C.fourth.length === 0, C.fourth);
  console.log('5  ANSWER_SIGNAL: the three missed signals');
  check('turn 30 (T56 after T55, whose ask he spoke over): his sentence is a practice answer', on.sentences.t30.length === 1, on.sentences.t30);
  check('turn 35 (T66 after "Next, fill the gap…"): a practice answer', on.sentences.t35.length === 1, on.sentences.t35);
  check('turn 44 (T84 after "Fill the gap and say the whole sentence."): a practice answer', on.sentences.t44.length === 1, on.sentences.t44);
  check('through runV2Turn each gives v2_practice_signal clean', ['t30', 't35', 't44'].every((k) => (on.signals as Record<string, string[]>)[k]!.some((e) => /^v2_practice_signal clean/.test(e))), on.signals);
  check('fix round 1 (m5): a reply that only explains the gap (「空欄には…を入れます。」) asks for nothing', on.gapExplained.length === 0, on.gapExplained);
  check('"7 → seven" and "2 → two" are right answers (7u), no false wrong signal', on.digits.seven[0] === false && on.digits.two[0] === false, on.digits);

  console.log('6  SUPPORT_FOLLOWED: the step is unmistakable, beside the practice facts; the conversation stays a conversation');
  check('gap: the form first, its shape (abstract), "Not a starter"', /^next question's form: GAP-FILL .*ONE word replaced by a gap .* Not a starter/.test(on.lines.gap ?? ''), on.lines.gap);
  check('starter / repeat / stretch: the form first with an abstract shape each', /^next question's form: STARTER .*Start with: <the first two or three words/.test(on.lines.starter ?? '') && /^next question's form: REPEAT AFTER ME .*Please say this after me: <the sentence>/.test(on.lines.repeat ?? '') && /^next question's form: OPEN, NO HELP .*No starter, no gap-fill/.test(on.lines.stretch ?? ''));
  check('fix round 1 (m8): no sentence of this session (or any topic) in the step lines', !Object.values(on.lines).some((l) => /Canada|visited|five years|project/.test(l ?? '')));
  const fl = on.convGapFacts;
  check('in the facts it stands right after the practice facts (the question-card line), before the opener and the note', idx(fl, /^next question's form/) === idx(fl, /^board: a question the learner must answer/) + 1 && idx(fl, /^next question's form/) < idx(fl, /^your note:/), fl.split('\n').map((l) => l.slice(0, 50)));
  check('the plan marks Conversation as free conversation (its note); no other part', JSON.stringify(on.freeConv) === JSON.stringify([false, false, false, false, false, true, false, false]), on.freeConv);
  check('in Conversation a gap step is shown as starter; two wrong answers do not go above starter; entering it from repeat: starter', /^next question's form: STARTER/m.test(fl) && !/GAP-FILL/.test(fl) && on.convAfterStep === 'starter' && on.intoConvStep === 'starter', [on.convAfterStep, on.intoConvStep]);
  check('outside it the steps go on as before (Past simple: starter → gap)', on.psGapStep === 'gap');
  check('the plan\'s own instructions for Conversation reach every turn (the plan map): the learner\'s question, follow-ups, two corrections', /Now it's your turn to ask me a question about work experience/.test(on.planMap) && /At most two corrections in this segment/.test(on.planMap) && /ask a relevant follow-up/.test(on.planMap));

  console.log('7  SELF_CORRECTION, REPEAT_NOT_ECHO');
  check('"…for senior staff." then "for senior bosses.": one sentence and its correction', on.self?.phrase === 'for senior bosses.' && /senior staff/.test(on.self?.sentence ?? ''));
  check('the practice facts say to read the two together and never correct the phrase as a fragment', on.selfLines.some((l) => /^self-correction: .*read the two together as the one sentence they meant .*never treat or correct the phrase as a sentence of its own or a fragment/.test(l)));
  check('fix round 2 (N1): a one-word replacement after the sentence is a self-correction: "…\\nWorked.", "I goed to Tokyo.\\nWent."', JSON.stringify(on.selfYes) === JSON.stringify(['Worked.', 'Went.']), on.selfYes);
  check('not for a yes, a question, or a second full sentence (more than 4 words, or its own subject and verb: "I went there.")', on.selfNot.every((x) => x === null), on.selfNot);
  check('the cut turn (nothing reached him) carries his words to the next turn, joined before the words that cut it', on.carried === 'My team is working on um uh presentation for senior staff.' && on.joined === 'My team is working on um uh presentation for senior staff.\nfor senior bosses.' && on.carriedNot.every((x) => x === null));
  check('13:38: his repeat, said with the model sentence and two words ahead of the voice, is not its echo', on.repeatOn.own === false && /2 word\(s\) ahead of the voice/.test(on.repeatOn.timing), on.repeatOn);
  check('…the same words with the switch off are dropped as before (score 0.75); a true echo inside the played words still is', on.repeatOff.own === true && on.repeatOff.score === 0.75 && on.repeatOn.echo === true, on.repeatOff);

  console.log('each switch off alone (a child process per switch): as at d1a8a9d1 for that item');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC6_7V_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('PART_CLOCK');
    check('PART_CLOCK off: the stay line by the lesson clock (at 5.2 "about 3 of its 3 left"), no part-time line, the "would be running" guide, no part start', /has about 3 of its 3 minutes left/.test(off.clock.stay52 ?? '') && off.clock.up52 === null && /would be running now/.test(off.facts52) && off.freshStart === null, [off.clock.stay52, off.freshStart]);
    check('PART_CLOCK off: the other items unchanged', !!off.yesPage && JSON.stringify(off.targets[0]) === JSON.stringify(['in the home']));
    check('PART_CLOCK off with OPTIONAL_FIT on (I2): the yes past the wrap still opens the page, but no hold from an invented start (no "about 11 of its 3 minutes")', off.wrapIn === null && !/fits before the session must end: go on with it/.test(off.pron19Facts), [off.wrapIn, off.pron19Facts.split('\n').filter((l) => /^time:/.test(l))]);
  }
  {
    const off = child('OPTIONAL_FIT');
    check('OPTIONAL_FIT off: "Uh, yes, let\'s go." at 18.1 opens nothing and the facts say no time; the later request is not recognised', off.yesPage === null && /no time for it now/.test(off.yesFacts) && off.askedIndex === -1 && off.laterPage === null && off.wrapAtOffer === null, [off.yesPage, off.askedIndex]);
    check('OPTIONAL_FIT off: no end_lesson deferral (the moved wrap is gone; ON it was deferred)', on.endOnce.results.some((r) => /^not ended yet/.test(r)) && !off.endOnce.results.some((r) => /^not ended yet/.test(r)), off.endOnce);
  }
  {
    const off = child('RETEST_TARGET_CHANGED');
    check('RETEST_TARGET_CHANGED off: targets by stress, function words out (as live: "home, appliance, division")', JSON.stringify(off.walk.afterJob[0]?.target) === JSON.stringify(['home', 'appliance', 'division']), off.walk.afterJob);
  }
  {
    const off = child('RETEST_SPREAD');
    const offIn = off.walk.retests.filter((r) => r.offered).map((r) => r.in);
    check('RETEST_SPREAD off: the list fills from "Your job" and the offers stay in Present perfect (as live)', off.walk.afterJob.length === 5 && offIn.filter((x) => x === 'present-perfect').length >= 2, [off.walk.afterJob.length, offIn]);
  }
  {
    const off = child('ANSWER_SIGNAL');
    check('ANSWER_SIGNAL off: the three answers give no practice signal (as live)', off.sentences.t30.length === 0 && off.sentences.t35.length === 0 && off.sentences.t44.length === 0 && !off.signals.t35.some((e) => /v2_practice_signal/.test(e)));
  }
  {
    const off = child('SUPPORT_FOLLOWED');
    check('SUPPORT_FOLLOWED off: the old step lines, at the end of the facts; the conversation steps up to gap', /^support for the next question: gap/.test(off.lines.gap ?? '') && idx(off.convGapFacts, /^support for the next question/) > idx(off.convGapFacts, /^board: a question the learner must answer/) + 1 && off.convAfterStep === 'gap' && off.intoConvStep === 'gap', [off.convAfterStep, off.intoConvStep]);
  }
  {
    const off = child('SELF_CORRECTION');
    check('SELF_CORRECTION off: no self-correction line, nothing carried', !off.selfLines.some((l) => /^self-correction/.test(l)) && off.carried === null && off.joined === 'for senior bosses.');
  }
  {
    const off = child('REPEAT_NOT_ECHO');
    check('REPEAT_NOT_ECHO off: the repeat is dropped as the tutor\'s echo (as live)', off.repeatOn.own === true);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
