/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8i: mic test 12 (embed-1795449526586, flag 1 at lesson minute 3.9; task-8i-report.md). After the level
 * check the "Your job" page (page 3) opened and took its note and two sentence cards; the reply's question card "What do you do
 * at work?" was then read as the level check's plan problem (progress.ts goalForProblem: three of its five word pairs are in the
 * level check's questions), and main's "a plan problem asked again turns the board back to its page" (593ac2959) turned the
 * board back to "Level check" (page 2). The card was not painted, so its question was neither shown nor said; the learner's
 * corrected sentence and the next question card were then written on page 2. The session's plan (gdi-work-projects-v1), pages
 * and real turns (T10–T18). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic12-8i
 *
 *  1 the level check → "Your job" step (T11 "Yes." → T12): the three cards and the question card on page 3, the board stays on
 *    page 3 (no turn back to page 2), and the question is said
 *  2 the learner's answer (T15 → T16) and its corrected card on page 3; the next question (T17 → T18) on page 3
 *  3 a lesson without part flow (the same pages in a typed lesson): main's turn back to the problem's page, as on main 11843955
 *  4 fix round 1: the card painted on page 3 is not recorded as the level check's (problemCards unchanged); a later card there whose
 *    words are another part's plan problem is painted on page 3, no page made or held, its question said (main's V2_PART_PAGE does
 *    not run in a part-flow lesson); in the typed lesson main's V2_PART_PAGE still cuts the reply and offers the part
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { goalForProblem } from '../src/lib/tutor/v2/progress';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function scripted(text: string): V2ModelCall {
  return async (_params, onText) => { for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }], 'end_turn'); };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
// The session's box: 20 minutes (hard stop 25), the wrap at 18; Japanese support; the level checked in this lesson.
const voice: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI,
  teacher: { name: 'Ryota', background: 'I help Japanese professionals speak English at work.' } };
const typed: V2Session = { ...voice, mode: 'text' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const q = (id: string, statement: string) => ({ id, tool: 'show_problem', summary: `Question — ${statement}` });

// The session's pages before T11 (whiteboardCommands WB0–WB6; flags.jsonl line 1 board). T10's page block "Your job" was held at its
// part ask (WB7 src=T10) and released on T11's "Yes." (02:25.41, before T12's words).
const OVERVIEW: V2BoardPage = { title: 'Overview', items: [{ id: 'inl_mwtgai6i_2', tool: 'annotate', summary: 'Talking About Your Work and Recent Projects' }, { id: 'inl_mwtgazdu_1', tool: 'annotate', summary: '"present perfect": have/has + past participle, for experience that continues now. "past simple": a finished event at a specific time.' }] };
const LEVEL: V2BoardPage = { title: 'Level check', items: [
  q('inl_mwtgbv0r_2', 'Can you tell me a little about your job? What do you do?'),
  q('inl_mwtgc99c_1', 'Have you ever worked with an international customer? If so, can you tell me about the experience?'),
  q('inl_mwtgcncc_1', 'What is one skill you\'d like to improve in your English, and why is it important to you?')] };

// The transcript (T0–T11) as the record held it.
const T10 = 'Thank you, Praveen. Today we\'ll work on making your sentences complete and natural, step by step. 次は「仕事について」の練習です。まず質問がありますか？それとも次に進みましょうか？';
const T11 = 'Yes.';
// T12 as the model wrote it: the stored words (transcript T12), the cards WB8–WB10 (text, style, gloss and emphasis as painted) and
// the question card, whose words T14 quotes ("「What do you do at work?」は「仕事で何をしていますか」という質問です。").
const QUESTION = 'What do you do at work?';
const R12 = '「仕事」について話す練習です。まずは短い文から始めましょう。\n\n'
  + '<board note style="highlight" gloss="主語と動詞を入れて、短い文で話す">"I work" in sales. / I help customers. / I work with international clients.</board>\n\n'
  + '<board sentence gloss="私は営業の仕事をしています">I work in sales.</board>\n\n'
  + '<board sentence gloss="私はお客様を助けています">I help customers.</board>\n\n'
  + 'Now, it\'s your turn. Please answer this question in one or two short sentences.\n\n'
  + `<board problem gloss="仕事で何をしていますか。">${QUESTION}</board>`;
// T15 → T16 (WB13), T17 → T18 (WB14): the words and cards as they came.
const T15 = 'Uh, I work uh, home appliance division, Nagoya Corporation.';
const R16 = 'Good, you told me your division. One change: we say "in the," so the sentence is "I work in the home appliance division."\n\n'
  + '<board sentence gloss="「in the」を入れます。「家電部門で働いています」という意味です">I work in the home appliance division.</board>\n\nCan you say that sentence once more?';
const T17 = 'I work in the home appliance division.';
const R18 = 'That\'s right, and you said it clearly. 次は、どんな製品を売っているか聞かせてください。\n\n'
  + '<board problem gloss="どんな製品を売っていますか。一文で答えてください。">What products do you sell?</board>\nWhat products do you sell? Try starting with: "I sell…"';

const at11 = (): V2State => ({
  ...newV2State(0),
  workingLevel: { level: 'beginner', from: 'this_lesson' },
  timeFit: { dropped: [], byArrival: true },
  goals: { overview: { status: 'shown', at: 0 }, 'level-check': { status: 'shown', at: 2.1 * MIN } },
  // main's record of the plan problem's card: each level check question went up as the level check's (the last one kept).
  problemCards: { 'level-check': 'inl_mwtgcncc_1' },
  board: { pages: structuredClone([OVERVIEW, LEVEL]), current: 1 },
  heldPage: { title: 'Your job', part: 'topic-intro', at: 2.13 * MIN },
  history: [u('[The session has just started.]'), a('Hello, Praveen…'), u('Uh, talk uh nice English. Uh, customer sell products.'), a(T10)],
});
const wire = (st: V2State, s: V2Session) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(st)))!, s);
const run = async (session: V2Session, st: V2State, said: string, reply: string, atMin: number) => {
  const heard: string[] = [];
  const r = await runV2Turn({ session, state: st, studentSaid: said, callModel: scripted(reply), onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  return { r, heard: heard.join(''), spoken: r.spoken };
};
const titleOfCard = (st: V2State, re: RegExp) => st.board.pages.find((p) => p.items.some((it) => re.test(it.summary)))?.title;

async function main() {
  console.log('0. why: the question card is read as the level check\'s plan problem');
  check('goalForProblem("What do you do at work?") is the level check (three of five word pairs)', goalForProblem(GDI, QUESTION) === 'level-check');

  console.log('1. T11 "Yes." → T12: the level check → "Your job" step (02:25–02:29)');
  const t12 = await run(voice, at11(), T11, R12, 2.42);
  const calls = t12.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`);
  const job = t12.r.state.board.pages.find((p) => p.title === 'Your job');
  check('the board stays on page 3 "Your job"', t12.r.state.board.current === 2, [t12.r.state.board.current, calls]);
  check('no turn back to page 2: no go_to_page, no card pointing back with turnsTo', !t12.r.toolCalls.some((c) => c.name === 'go_to_page' || (c as { turnsTo?: number }).turnsTo !== undefined), calls);
  check('the note and the two sentence cards on page 3', !!job && job.items.filter((it) => it.tool === 'show_sentence').length === 2 && job.items.some((it) => it.tool === 'annotate'), job);
  const card = t12.r.toolCalls.find((c) => c.name === 'show_problem');
  check('the question card is painted on page 3', /^painted/.test(card?.outcome ?? '') && titleOfCard(t12.r.state, /What do you do at work\?/) === 'Your job', calls);
  check('…the level check page keeps its three questions only', t12.r.state.board.pages[1]!.items.length === 3, t12.r.state.board.pages[1]);
  check('the announced question is said ("Now, it\'s your turn…" then "What do you do at work?")', /your turn[\s\S]*What do you do at work\?/.test(t12.heard), t12.heard);

  console.log('2. T15 → T16 and T17 → T18: the corrected sentence and the next question on page 3');
  const t16 = await run(voice, wire(t12.r.state, voice), T15, R16, 3.37);
  check('"I work in the home appliance division." is painted on page 3', titleOfCard(t16.r.state, /home appliance division/) === 'Your job' && t16.r.state.board.current === 2, t16.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('…no turn of the board', !t16.r.toolCalls.some((c) => c.name === 'go_to_page'));
  const t18 = await run(voice, wire(t16.r.state, voice), T17, R18, 3.7);
  check('"What products do you sell?" is painted on page 3; the board stays there', titleOfCard(t18.r.state, /What products do you sell/) === 'Your job' && t18.r.state.board.current === 2, t18.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));
  check('page 2 still holds its three questions only', t18.r.state.board.pages[1]!.items.length === 3);

  console.log('3. a lesson without part flow (typed): main\'s turn back to the problem\'s page, as on main');
  // The same board with "Your job" open and in view (a typed lesson holds no page at a part ask).
  const opened = (): V2State => { const st = at11(); delete st.heldPage; st.board = { pages: structuredClone([OVERVIEW, LEVEL, { title: 'Your job', items: [] }]), current: 2 }; return st; };
  const tx = await run(typed, opened(), T11, R12, 2.42);
  const txCard = tx.r.toolCalls.find((c) => c.name === 'show_problem');
  check('the card is not painted again; the board turns back to page 2 and points at the problem (main 593ac2959)', /^not painted again: already on page 2 "Level check"; the board has turned back/.test(txCard?.outcome ?? '') && (txCard as { turnsTo?: number } | undefined)?.turnsTo === 1 && tx.r.state.board.current === 1, tx.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`));

  console.log('4. fix round 1: a later card on "Your job" whose words are another part\'s plan problem (main\'s V2_PART_PAGE)');
  check('the level check keeps its own card in problemCards after T12 (the card painted on page 3 is not recorded as its)', t12.r.state.problemCards?.['level-check'] === 'inl_mwtgcncc_1', t12.r.state.problemCards);
  check('…and after T16 and T18', t18.r.state.problemCards?.['level-check'] === 'inl_mwtgcncc_1', t18.r.state.problemCards);
  const PS_Q = 'Did you attend any business events or exhibitions last year?';
  check('the past simple part\'s own question is read as its plan problem', goalForProblem(GDI, PS_Q) === 'past-simple');
  const R_PS = `Good. One more question about your work.\n\n<board problem gloss="去年、展示会に行きましたか。">${PS_Q}</board>`;
  const ps = await run(voice, wire(t12.r.state, voice), T15, R_PS, 3.37);
  const psCalls = ps.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`);
  check('painted on page 3 "Your job"; the board stays there', titleOfCard(ps.r.state, /business events/) === 'Your job' && ps.r.state.board.current === 2, psCalls);
  check('no page created or held', !ps.r.toolCalls.some((c) => c.name === 'new_page' || c.name === 'go_to_page') && !ps.r.state.heldPage && ps.r.state.board.pages.length === 3, [psCalls, ps.r.state.heldPage]);
  check('its question is said', ps.heard.includes(PS_Q), ps.heard);
  check('problemCards: the level check\'s card unchanged', ps.r.state.problemCards?.['level-check'] === 'inl_mwtgcncc_1', ps.r.state.problemCards);
  // A typed lesson (no part flow): main's rule. T12 turned the board back to page 2, which holds the level check's card; the past
  // simple's question there is the next part beginning: main synthesizes its page block, and the part not yet agreed, the reply is
  // cut at it and the part is offered ("Next is simple. Shall we go on…", the goal's slug as the title).
  const typedPs = await run(typed, wire(tx.r.state, typed), T15, R_PS, 3.37);
  check('typed lesson: main\'s V2_PART_PAGE: the card is not painted, the reply is cut at it and the part offered', !typedPs.r.state.board.pages.some((p) => p.items.some((it) => /business events/.test(it.summary))) && /Next is simple\. Shall we go on/.test(typedPs.spoken), [typedPs.r.toolCalls.map((c) => `${c.name}: ${c.outcome}`), typedPs.spoken]);

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
