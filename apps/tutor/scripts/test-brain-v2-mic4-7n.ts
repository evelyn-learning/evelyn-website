/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7n: mic test 4 (embed-1795028886172): the part ask in any teaching language; the chip lights when its
 * page shows; flag time is not lesson time. The session's plan (gdi-work-projects-v1), its 20-minute box, and the replies and
 * learner words quoted in task-7m-investigation.md (C, G) and the session timeline. No network, no model, nothing to the speech
 * vendor.
 *   npm run test:brain-v2-mic4-7n
 *
 *  1 PART_ASK_LANGS     「…次は Present perfect です。何か質問がありますか？それとも、このまま進みますか？」 + "Uh, move on." opens Present perfect
 *  2 CHIP_ON_PAINT      the Summary chip stays on Past simple while the Summary page is held; green from the position
 *  3 FLAG_CLOCK_PAUSE   4.71 min of open flags are not lesson time: no wrap at a wall 18.35 min
 *  each switch off alone (a child process per switch): the behaviour at the base commit for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CHIP_ON_PAINT, TUTOR_V2_FLAG_CLOCK_PAUSE, TUTOR_V2_PART_ASK_LANGS } from '../src/lib/tutor/orchestrator/flags';
import { v2EndingPartAsk, v2MoveAnswer, v2PendingPart } from '../src/lib/tutor/v2/part-flow';
import { v2CountPractice } from '../src/lib/tutor/v2/time-fit';
import { v2ProgressAsPainted } from '../src/lib/tutor/v2/progress';
import { v2HardStopDelayMs, v2LessonNowMs } from '../src/lib/tutor/v2/time-box';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC4_7N_CHILD;
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
    onText?.(t);
    return msg([{ type: 'text', text: t }], 'end_turn');
  };
  return { call, facts };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const JOB: V2BoardPage = { title: '仕事について', items: [card('j1', 'I work in sales in the home appliance division.'), card('j2', 'I have worked at Nagoya Corporation for six years.')] };
const PP: V2BoardPage = { title: 'Present perfect', items: [{ id: 'p1', tool: 'annotate', summary: 'have / has + past participle' }] };
const PS: V2BoardPage = { title: 'Past simple', items: [card('s1', 'I attended a robotics exhibition in Beijing two months ago.')] };
const SUMMARY: V2BoardPage = { title: 'Summary', items: [] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const base = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(pages), current: pages.length - 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3 }, ...extra });

// ── The session's texts ──
// C: 7.22 / 7.26 / 7.59
const C_SAID_BEFORE = 'I am selling front load more now because customers like that more.';
const C_ASK = 'That\'s right, and it\'s clear. 「仕事について」はここまでです。次は Present perfect です。何か質問がありますか？それとも、このまま進みますか？';
const C_GO = 'Uh, move on.';
const C_SECOND_ASK = 'Your job is done, and you explained your work clearly. Next is Present perfect. Do you have a question first, or shall we go on?';
const C_NEXT = '現在完了（present perfect）は、過去に始まって今も続いている経験や状態を言うときに使います。形は have または has + 過去分詞です。';
// 12.87 / 13.76
const P_ASK = 'いい質問ですね。「with」は、一緒に仕事をする人に使います。一方、会社は人ではなく場所のように考えるので、「at Nagoya Corporation」を使います。\n\nご質問への答えは以上です。次は Past simple に進みますが、よろしいですか？';
const P_GO = 'Uh, yes.';
// G: 18.35 / 18.51
const G_SAID = 'Uh, I sold uh 35 washing machines to Canada, to the Canada customer.';

async function probe() {
  const cState = base([TODAY, JOB], { history: [u(C_SAID_BEFORE), a(C_ASK)] });
  const pending = v2PendingPart(GDI, cState, C_ASK, C_GO, undefined, lang.languages);
  const counted = structuredClone(cState); v2CountPractice(GDI, counted, C_GO, C_ASK, undefined, lang.languages);
  // The turn: "Uh, move on." after the Japanese ask; the model goes on into Present perfect.
  const m = scripted([C_NEXT]);
  const turn = await runV2Turn({ session: lang, state: cState, studentSaid: C_GO, callModel: m.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 7.59 * MIN });
  const opened = turn.toolCalls.find((c) => c.name === 'new_page');
  // The 12.87 ask and "Uh, yes."
  const pState = base([TODAY, JOB, PP], { history: [u('why is that?'), a(P_ASK)], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3 } });
  const pPending = v2PendingPart(GDI, pState, P_ASK, P_GO, undefined, lang.languages);
  // A move-on with a filler, said without any ask before it (MOVE_ON_ASKED).
  const lone = base([TODAY, JOB, PP], { history: [u('x'), a('Good. Now tell me about a project you have worked on.')], practiceSaid: { 'topic-intro': 3, 'present-perfect': 1 } });
  v2CountPractice(GDI, lone, C_GO, 'Good. Now tell me about a project you have worked on.', undefined, lang.languages);

  // 2: the 18.51 reply's state: the Summary page applied on the server, held by the voice client for its sentence.
  const after: V2State = base([TODAY, JOB, PP, PS, SUMMARY], { practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, goals: { ...goalsAt, 'present-perfect': { status: 'demonstrated', at: 0 }, 'past-simple': { status: 'demonstrated', at: 0 } }, summaryBegunAt: 18.5 * MIN });
  const shown = base([TODAY, JOB, PP, PS]).board;
  const held = v2ProgressAsPainted(GDI, after.goals, after, shown);
  const painted = v2ProgressAsPainted(GDI, after.goals, after, null);

  // 3: the 18.35 turn with 4.71 min of flags behind it (lesson time ~13.6 min): no wrap.
  const gState = base([TODAY, JOB, PP, PS], { history: [u('I sell 35 washing machine to customer from Canada.'), a('「sell」の過去形は「sold」です。もう一度、「I sold…」で始めて言ってみてください。')], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, goals: { ...goalsAt, 'present-perfect': { status: 'demonstrated', at: 0 } }, clockPausedMs: 4.71 * MIN });
  const read = v2ReadClientState(JSON.parse(JSON.stringify(gState)));
  const g = scripted(['That\'s right: "I sold 35 washing machines to a customer in Canada." Now, one more sentence in the past simple?']);
  const gTurn = await runV2Turn({ session: lang, state: read ?? gState, studentSaid: G_SAID, callModel: g.call, onText: () => {}, boardPass: false, mathsCheck: false, nowMs: 18.35 * MIN });
  const gFacts = g.facts.join('\n');
  return {
    pending: pending?.title ?? null,
    goAnswer: v2MoveAnswer(C_GO, C_ASK, lang.languages), jaFiller: v2MoveAnswer('えっと、はい', C_ASK, lang.languages), jaNoQ: v2MoveAnswer('質問はありません。', C_ASK, lang.languages),
    moveOn: counted.moveOnAsked ?? [],
    opened: opened ? String(opened.args.title) : null, cFacts: m.facts.join('\n'), cHeard: turn.spoken,
    pPending: pPending?.title ?? null,
    lone: lone.moveOnAsked ?? [],
    heldChip: held.currentSegmentId, paintedChip: painted.currentSegmentId, heldDone: held.completedSegmentIds, paintedDone: painted.completedSegmentIds,
    carried: read?.clockPausedMs ?? null,
    lessonNow: v2LessonNowMs(18.35 * MIN, { clockPausedMs: 4.71 * MIN }),
    gFacts, gState: { summaryBegunAt: gTurn.state.summaryBegunAt ?? null },
    gWrap: /then summary|summary now|time for the summary/i.test(gFacts),
  };
}

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const on = await probe();

  console.log('the switches: each on by default');
  check('PART_ASK_LANGS, CHIP_ON_PAINT, FLAG_CLOCK_PAUSE default on', TUTOR_V2_PART_ASK_LANGS && TUTOR_V2_CHIP_ON_PAINT && TUTOR_V2_FLAG_CLOCK_PAUSE);

  console.log('1  flag 3 (7.7 min): the Japanese part ask is an ask; "Uh, move on." opens Present perfect, no second ask');
  check('7.26 ask: the pending part is Present perfect (named by the lead 「次は Present perfect です。」)', on.pending === 'Present perfect', on.pending);
  check('"Uh, move on." to it is a go', on.goAnswer === 'go', on.goAnswer);
  check('「えっと、はい」 (a filler first) is a go', on.jaFiller === 'go', on.jaFiller);
  check('「質問はありません。」 to an ask that offers a question first is a go', on.jaNoQ === 'go', on.jaNoQ);
  check('"Uh, move on." records Your job as theirs to close (moveOnAsked)', JSON.stringify(on.moveOn) === JSON.stringify(['topic-intro']), on.moveOn);
  check('the turn opens the Present perfect page as it begins', on.opened === 'Present perfect', on.opened);
  check('the facts say they said yes and the page is open (no ask again)', /they said yes to going on: the "Present perfect" page is open now/.test(on.cFacts), on.cFacts.slice(0, 400));
  check('no runtime part ask appended to the reply', !/question first|shall we go on|ready to go on|would you like to ask/i.test(on.cHeard), on.cHeard);
  check('12.87 「次は Past simple に進みますが、よろしいですか？」 + "Uh, yes." pends Past simple', on.pPending === 'Past simple', on.pPending);
  check('"Uh, move on." with no ask before it is a move-on (MOVE_ON_ASKED with a filler)', JSON.stringify(on.lone) === JSON.stringify(['present-perfect']), on.lone);
  {
    const st = base([TODAY, JOB], { history: [u('x'), a('That\'s nice. 仕事は順調に進みますか？')] });
    check('「仕事は順調に進みますか？」 (about their work) is no part ask', v2PendingPart(GDI, st, 'That\'s nice. 仕事は順調に進みますか？', 'Yes.', undefined, ['en', 'ja']) === null);
    const mid = 'このまま進みますか？ では、もう一文、あなたのことを英語で言ってみてください。';
    check('a go-on that is not the reply\'s last sentence is no ask (position)', v2EndingPartAsk(mid, ['en', 'ja']) === null);
    check('an English-only lesson does not read the Japanese wording (languages)', v2EndingPartAsk(C_ASK, ['en']) === null && v2PendingPart(GDI, base([TODAY, JOB]), C_ASK, C_GO, undefined, ['en']) === null);
    check('the English ask still pends Present perfect (7i, unchanged)', v2PendingPart(GDI, base([TODAY, JOB]), C_SECOND_ASK, C_GO, undefined, ['en', 'ja'])?.title === 'Present perfect');
    check('「えっと、」 alone is not stripped to nothing', v2MoveAnswer('えっと', C_ASK, ['en', 'ja']) === 'other');
    check('"Okay." stays a go (no filler stripped from a go word)', v2MoveAnswer('Okay.', C_SECOND_ASK, ['en']) === 'go');
  }

  console.log('2  flag 7 (18.7 min): the chip lights when its page is painted; green stays the position\'s');
  check('Summary page held: the lit chip stays on Past simple', on.heldChip === 'past-simple', on.heldChip);
  check('Summary page painted: the lit chip is Summary', on.paintedChip === 'summary', on.paintedChip);
  check('green is the same either way (the lesson position)', JSON.stringify(on.heldDone) === JSON.stringify(on.paintedDone), [on.heldDone, on.paintedDone]);
  {
    const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    check('useV2Turns reports the chip against the painted board', src.includes('v2ProgressAsPainted(plan, stateRef.current.goals, stateRef.current, shownBoardRef.current)'));
    check('useV2Turns counts held page calls and reports when the last is painted', /pageHeld = TUTOR_V2_CHIP_ON_PAINT && !!p\.current\.holdBoard && \(call\.name === 'new_page' \|\| call\.name === 'go_to_page'\)/.test(src) && src.includes('if (pageHeld) pageShown();'));
    const noPlan = v2ProgressAsPainted({ ...GDI, segments: GDI.segments.map((s) => ({ ...s, metadata: {} })) } as LessonPlan, {}, base([TODAY]), base([]).board);
    check('a plan without part names: the chip is as before (goal statuses)', typeof noPlan.currentSegmentId === 'string');
  }

  console.log('3  flag-panel time (4.71 min) is not lesson time');
  check('clockPausedMs round-trips through the client state read', on.carried === 4.71 * MIN, on.carried);
  check('the lesson clock reads 13.64 min at a wall 18.35', Math.abs((on.lessonNow ?? 0) / MIN - 13.64) < 0.001, on.lessonNow);
  check('18.35: no wrap ("then summary") in the facts', !on.gWrap, on.gFacts.match(/time:[^\n]*/)?.[0]);
  check('18.35: the time line counts 13 or 14 minutes used', /time: 1[34] min used/.test(on.gFacts), on.gFacts.match(/time:[^\n]*/)?.[0]);
  check('the client hard stop re-arms at the lesson time left (25 − 13.64 min)', Math.abs(v2HardStopDelayMs(25, { startedAtMs: 0, clockPausedMs: 4.71 * MIN }, 18.35 * MIN) / MIN - 11.36) < 0.001);
  {
    const read = v2ReadClientState(JSON.parse(JSON.stringify({ ...base([TODAY]), clockPausedMs: 1e12 })));
    check('a hostile paused total is bounded (6 h)', (read?.clockPausedMs ?? 0) === 6 * 60 * MIN, read?.clockPausedMs);
    const tv = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('only the flag panel pauses: holdClock is called from flagStart / flagStop alone', (tv.match(/holdClock\(/g) ?? []).length === 2 && tv.includes("'opened'); holdClock(true);") && tv.includes('holdClock(false);'));
    const emb = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
    check('the host clock message leaves the flag time out; the saved duration does not', emb.includes('- pausedSec') && !/duration = Math\.round\([^\n]*pausedSec/.test(emb));
  }

  console.log('4  each flag off alone (a child process per switch): as at the base commit for that item, the others on');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC4_7N_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    if (!line) { console.log(res.stdout, res.stderr); throw new Error(`child ${flag} gave no result`); }
    return JSON.parse(line.slice('OFF_JSON '.length)) as Awaited<ReturnType<typeof probe>>;
  };
  {
    const off = child('PART_ASK_LANGS');
    check('PART_ASK_LANGS off: the Japanese ask pends nothing (as before)', off.pending === null && off.pPending === null, [off.pending, off.pPending]);
    check('PART_ASK_LANGS off: no page opens on "Uh, move on."', off.opened === null, off.opened);
    check('PART_ASK_LANGS off: 「えっと、はい」 is not a go; the lone "Uh, move on." is no move-on', off.jaFiller !== 'go' && off.lone.length === 0, [off.jaFiller, off.lone]);
    check('PART_ASK_LANGS off: the other items unchanged', off.heldChip === 'past-simple' && !off.gWrap);
  }
  {
    const off = child('CHIP_ON_PAINT');
    check('CHIP_ON_PAINT off: the chip is Summary while the page is held (as before)', off.heldChip === 'summary', off.heldChip);
    check('CHIP_ON_PAINT off: the other items unchanged', off.opened === 'Present perfect' && !off.gWrap);
  }
  {
    const off = child('FLAG_CLOCK_PAUSE');
    check('FLAG_CLOCK_PAUSE off: the wrap fires at a wall 18.35 (as before)', off.gWrap, off.gFacts.match(/time:[^\n]*/)?.[0]);
    check('FLAG_CLOCK_PAUSE off: the other items unchanged', off.opened === 'Present perfect' && off.heldChip === 'past-simple');
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
void main().catch((e) => { console.error(e); process.exit(1); });
