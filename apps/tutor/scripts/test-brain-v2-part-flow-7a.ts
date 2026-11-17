/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7a: chip, page and part move together; every part change is asked (mic test 1,
 * embed-1794882458629, docs/superpowers/plans/2026-11-17-gdi-v2-mic-test-1-handoff.md A and B). No network, no model.
 *   npm run test:brain-v2-part-flow-7a
 *
 *  1. the session's shape, turn by turn: level check → part 1 → ask → question → yes (no page block) → part 2 → ask →
 *     yes → part 3 → unnamed page → conversation → optional part offered → taken; at each step the open page, the lit
 *     chip, the green chips and the part the ask names agree
 *  2. the part-change ask in words never said before; a frame repeated word for word (English, Japanese) still dropped,
 *     a different one kept
 *  3. kill switches, and an unlabelled plan as before
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { ReplyGate } from '../src/lib/tutor/v2/reply-gate';
import { leftOpen, mayOpenPart } from '../src/lib/tutor/v2/part-close';
import { v2CarryApplies, v2ReadCarried, v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { DISCUSSION_PLAN_KIND } from '../src/lib/tutor/v2/discussion';
import { V2_PART_ASKS, v2AskRepeats, v2MoveAnswer, v2PartAskLine, v2PartInHand, v2PartsDone, v2PendingPart, v2PlanLabelled } from '../src/lib/tutor/v2/part-flow';
import { v2Progress } from '../src/lib/tutor/v2/progress';
import { renderFacts, v2AskEveryOn } from '../src/lib/tutor/v2/facts';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { TUTOR_V2_PART_ASK_EVERY, TUTOR_V2_PART_PAGE_CHIP, TUTOR_V2_STATE_CARRY } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, then its tool calls; a second call (after tool results) says nothing more. */
function streaming(text: string, after: unknown[] = []): V2ModelCall {
  let n = 0;
  return async (_params, onText) => {
    n += 1;
    if (n > 1) return msg([], 'end_turn');
    for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn');
  };
}
const goal = (id: string, status: string) => ({ type: 'tool_use', id: `g_${id}_${status}`, name: 'set_goal_status', input: { goal: id, status } });
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const session: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const labelOf = (id: string) => (GDI.segments.find((s) => s.id === id)!.metadata as { label: string }).label;

interface Step { state: V2State; spoken: string; calls: V2ToolCall[]; text: string }
let clock = 60_000;
async function turn(state: V2State, said: string | null, text: string, after: unknown[] = [], s: V2Session = session, partFlags?: { pageChip?: boolean; askEvery?: boolean }): Promise<Step> {
  const calls: V2ToolCall[] = []; let out = '';
  clock += 30_000;
  const r = await runV2Turn({ session: s, state, studentSaid: said, callModel: streaming(text, after), nowMs: clock, boardPass: false, mathsCheck: false, onToolCall: (c) => calls.push(c), onText: (t) => { out += t; }, ...(partFlags ? { partFlags } : {}) });
  return { state: r.state, spoken: out, calls, text: r.spoken };
}
/** The chip strip as the learner sees it. */
const chips = (st: V2State, plan: LessonPlan = GDI) => { const p = v2Progress(plan, st.goals, st); return { lit: p.currentSegmentId, green: p.completedSegmentIds }; };
const openTitle = (st: V2State) => st.board.pages[st.board.current]?.title ?? '';
const askOf = (spoken: string) => V2_PART_ASKS.find((x) => spoken.includes(x)) ?? '';

async function main() {
  console.log('0. root cause, as the code stood: the chip lit the part after the last goal marked');
  {
    const at376 = { ...newV2State(0), goals: { overview: { status: 'shown' as const, at: 1 }, 'level-check': { status: 'shown' as const, at: 2 }, 'topic-intro': { status: 'shown' as const, at: 3 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, workingLevel: { level: 'intermediate' as const, from: 'this_lesson' as const } };
    const old = v2Progress(GDI, at376.goals);
    check('goals only (as before): "Your job" green and "Present perfect" lit at once, the level check grey (flags 2–3)', old.currentSegmentId === 'present-perfect' && old.completedSegmentIds.includes('topic-intro') && !old.completedSegmentIds.includes('level-check'), old);
    const now = chips(at376);
    check('now: "Your job" lit (its page is open), not green; the level check green (the level is set)', now.lit === 'topic-intro' && !now.green.includes('topic-intro') && now.green.includes('level-check') && now.green.includes('overview'), now);
    check('kill switch off: as before', JSON.stringify(v2Progress(GDI, at376.goals, at376, false)) === JSON.stringify(old));
  }

  console.log('1. the session\'s shape, turn by turn');
  let st = newV2State(0);
  const asks: string[] = [];
  // Opening: the overview page.
  let r = await turn(st, null, 'Hello, I am your tutor. Today we talk about your work.\n<board page>Lesson overview</board>\n<board note>Present perfect and past simple.</board>\nDoes that sound good?', [goal('overview', 'shown')]);
  st = r.state;
  check('opening: the overview page, its chip lit', openTitle(st) === 'Lesson overview' && chips(st).lit === 'overview', chips(st));
  // The level check: no page of its own; lit while it runs.
  r = await turn(st, 'Okay.', 'First, three short questions. What do you do at work?', [goal('level-check', 'shown')]); st = r.state;
  check('level check under way: its chip lit, the overview green', chips(st).lit === 'level-check' && chips(st).green.includes('overview'), chips(st));
  r = await turn(st, 'I am sales manager at a big company.', 'Have you ever worked with an international customer?'); st = r.state;
  r = await turn(st, 'Yes, I work with Canada customer and sell washing machine.', 'What is one skill you would like to improve in English?'); st = r.state;
  // Closing the check: the level is set, part 1 opens at once (the ruling: no ask out of the level check), its goal marked early.
  r = await turn(st, 'My speaking skill, conversation skill.', 'Thank you, that gives me a clear picture. Let\'s start with your work.\n<board page>Your job</board>\nTell me about your main responsibilities at work.', [{ type: 'tool_use', id: 'wl', name: 'set_working_level', input: { level: 'intermediate', evidence: 'short sentences' } }, goal('topic-intro', 'shown')]);
  st = r.state;
  check('level check → part 1 goes straight on: the "Your job" page opens, nothing held', openTitle(st) === 'Your job' && !r.calls.some((c) => /not opened yet/.test(c.outcome)), r.calls.map((c) => `${c.name} ${c.outcome}`));
  check('A5: the level check green once set_working_level is called; "Your job" lit and NOT green though its goal was marked early', chips(st).lit === 'topic-intro' && chips(st).green.includes('level-check') && !chips(st).green.includes('topic-intro'), chips(st));
  r = await turn(st, 'I am responsible for selling washing machines.', 'Good. How long have you worked at your company?'); st = r.state;
  // Part 1 → part 2: the model opens the page mid-reply; held, the ask in its place.
  r = await turn(st, 'I work at my company for five year.', 'Good, five years is a useful answer. We say "I have worked here for five years."\n<board page>Present perfect</board>\nHave you ever worked on a project with a customer from another country?');
  st = r.state;
  const held1 = r.calls.find((c) => c.name === 'new_page');
  check('part change 1 is asked: the page held, not opened', !!held1 && /not opened yet/.test(held1.outcome) && openTitle(st) === 'Your job', r.calls.map((c) => c.outcome));
  check('…the ask closes the part, names the next and asks ("Good, that\'s your job covered. Next is present perfect. Any questions first…")', /your job/i.test(r.spoken) && /present perfect/i.test(r.spoken.split('five years.')[1] ?? '') && !!askOf(r.spoken), r.spoken);
  check('…nothing after the page is said', !/another country/.test(r.spoken), r.spoken);
  check('A3/A6: while asked, the chip stays on "Your job"; the held page and the ask name the same part', chips(st).lit === 'topic-intro' && st.heldPage?.title === 'Present perfect' && st.heldPage.part === 'present-perfect', { chips: chips(st), held: st.heldPage });
  asks.push(askOf(r.spoken));
  // A question instead of yes: answered first, the page still waits.
  r = await turn(st, 'What is the difference between have worked and worked?', '"I have worked" joins the past to now; "I worked" is finished. Shall we go on now?');
  st = r.state;
  check('a question instead of yes: no page opens, the page still waits, the chip stays', openTitle(st) === 'Your job' && st.heldPage?.part === 'present-perfect' && chips(st).lit === 'topic-intro' && !r.calls.some((c) => c.name === 'new_page'), { open: openTitle(st), held: st.heldPage, calls: r.calls });
  check('…and the facts say to answer first, then ask again', renderFacts(session, st, { nowMs: clock, heard: 'x' }).includes('part change waiting: they were asked whether to go on to the Present perfect part'));
  // Yes, and the reply writes no <board page>: the held page opens all the same, as the reply begins (flag 5).
  r = await turn(st, 'Uh, yes, we move on.', 'Let\'s keep going. Have you ever worked with a customer from another country?');
  st = r.state;
  const opened = r.calls[0];
  check('A1: "yes" with no <board page> in the reply opens the held page, first, as an agreed turn', opened?.name === 'new_page' && opened.args.title === 'Present perfect' && opened.agreed === true && openTitle(st) === 'Present perfect', r.calls);
  check('…stored at the head of the reply, so the history shows it', (() => { const last = [...st.history].reverse().find((h) => h.role === 'assistant')!; const t = typeof last.content === 'string' ? last.content : last.content.map((c) => (c.type === 'text' ? c.text : '')).join(''); return t.startsWith('<board page>Present perfect</board>'); })());
  check('A3/A4: present perfect lit; "Your job" green now the lesson has moved past it; the wait cleared', chips(st).lit === 'present-perfect' && chips(st).green.includes('topic-intro') && !st.heldPage, { chips: chips(st), held: st.heldPage });
  // A check-in ends the next reply; the reply after it praises and opens "Past simple" mid-way (flag 7).
  r = await turn(st, 'Yes, I work with Canada customer, sell 25 washing machine last month.', 'Good. For your experience we say "I have worked with Canadian customers." Please say that sentence again. Does that make sense so far?');
  st = r.state;
  check('(setup) a check-in does not leave the way open for a part change', !leftOpen(r.text, 'I have worked with Canadian customers.', true) && !mayOpenPart({ title: 'Past simple', studentSaid: 'I have worked with Canadian customers.', lastTutor: r.text, pagesOpen: 3, strict: true }) && mayOpenPart({ title: 'Past simple', studentSaid: 'I have worked with Canadian customers.', lastTutor: r.text, pagesOpen: 3 }));
  r = await turn(st, 'I have worked with Canadian customers.', 'Yes, that\'s right. The present perfect fits.\n<board page>Past simple</board>\nYou also told me you sold 25 washing machines last month. Because last month is finished, we say "sold."');
  st = r.state;
  check('A2: the page does not open in the reply still praising the present perfect: held, the ask in its place', openTitle(st) === 'Present perfect' && !/sold 25/.test(r.spoken) && /past simple/i.test(r.spoken) && /present perfect/i.test(r.spoken.split('fits.')[1] ?? ''), r.spoken);
  asks.push(askOf(r.spoken));
  check('B: the second ask is not the first one\'s words', !!asks[1] && asks[1] !== asks[0], asks);
  check('…the chip stays on present perfect while asked', chips(st).lit === 'present-perfect' && st.heldPage?.title === 'Past simple');
  // Yes; this time the reply writes the page itself: one page, not two.
  r = await turn(st, 'Yes.', 'Great.\n<board page>Past simple</board>\nLast month is a finished time, so we say "I sold".');
  st = r.state;
  check('A1: yes opens the page once (the reply\'s own block for it is not a second page)', st.board.pages.filter((p) => p.title === 'Past simple').length === 1 && openTitle(st) === 'Past simple', st.board.pages.map((p) => p.title));
  check('A4: present perfect green though its goal was never marked', chips(st).lit === 'past-simple' && chips(st).green.includes('present-perfect') && !st.goals['present-perfect'], chips(st));
  // An unnamed page for the next part ("Your project"): held, and named as the conversation part (flag 9).
  r = await turn(st, 'Last year I went to Robotics Expo in Beijing.', 'Yes, "I went" is the past simple. That\'s right. Now let\'s talk about a project.\n<board page>Your project</board>\nWhat is one project you are proud of?', [goal('past-simple', 'demonstrated')]);
  st = r.state;
  check('flag 9: the conversation is asked, not jumped into; the ask, the held page and the chip to come all say "Conversation"', openTitle(st) === 'Past simple' && /next[^.]*conversation/i.test(r.spoken) && st.heldPage?.title === 'Conversation' && chips(st).lit === 'past-simple', { spoken: r.spoken, held: st.heldPage });
  asks.push(askOf(r.spoken));
  r = await turn(st, 'Okay, let\'s go.', 'What is one project you have worked on that you are proud of?');
  st = r.state;
  check('A1/A6: the page opens under the part\'s name ("Conversation"), its chip lit, past simple green', openTitle(st) === 'Conversation' && chips(st).lit === 'open-conversation' && chips(st).green.includes('past-simple'), { open: openTitle(st), chips: chips(st) });
  // The optional part offered, with the conversation goal marked in the same reply (flag 10).
  r = await turn(st, 'I have worked on no other social project since then.', 'You used the present perfect correctly. Would you like to practise your pronunciation for a few minutes, or skip it and go to the summary?', [goal('open-conversation', 'demonstrated')]);
  st = r.state;
  check('A3 (flag 10): while pronunciation is being offered, the chip stays on the conversation', chips(st).lit === 'open-conversation' && !chips(st).green.includes('open-conversation'), chips(st));
  r = await turn(st, 'Uh, yes, practice pronunciation.', 'Good. Would you like to practise single words, or a whole sentence?');
  st = r.state;
  check('A1 (flag 11): pronunciation taken up opens its own page; its chip lit, the conversation green', openTitle(st) === 'Pronunciation' && chips(st).lit === 'pronunciation' && chips(st).green.includes('open-conversation'), { open: openTitle(st), chips: chips(st) });
  check('…no part skipped untaught is green, and nothing after the part in hand', chips(st).green.every((id) => GDI.segments.findIndex((x) => x.id === id) < GDI.segments.findIndex((x) => x.id === 'pronunciation')), chips(st));
  check('B: three part changes asked, three different asks', asks.length === 3 && new Set(asks).size === 3 && asks.every(Boolean), asks);

  console.log('2. the ask, and the repeat drop');
  {
    const hist: V2State['history'] = [{ role: 'user', content: 'x' }, { role: 'assistant', content: 'Good. Next is present perfect. Shall we go on, or do you have a question first?' }];
    check('a frame said before word for word is a repeat', v2AskRepeats('Shall we go on, or do you have a question first?', hist));
    check('…one word apart too', v2AskRepeats('Shall we go on, or do you have any question first?', hist));
    check('…a different ask is not', !v2AskRepeats('Ready to go on, or would you like to ask something first?', hist) && !v2AskRepeats('Shall we move on to the past simple, or is there anything you would like to ask?', hist));
    check('…nor a sentence that is no ask', !v2AskRepeats('Next is present perfect.', [...hist, { role: 'assistant', content: 'Next is present perfect.' }]));
    const ja: V2State['history'] = [{ role: 'assistant', content: '現在完了は、ここまでです。次に進みますか、それとも先に質問がありますか？' }];
    check('Japanese: the same frame again is a repeat; another frame is not', v2AskRepeats('次に進みますか、それとも先に質問がありますか？', ja) && !v2AskRepeats('過去形に進む前に、何か質問はありますか？', ja));
    const out: string[] = [];
    const g = new ReplyGate((t) => out.push(t), { dropFrame: false, dropFrameIf: (x) => v2AskRepeats(x, hist), holdGoodbye: false });
    g.push('Well done. Next is the past simple. Shall we go on, or do you have a question first? '); g.flush();
    check('the gate drops only the repeat', !out.join('').includes('Shall we go on') && out.join('').includes('Next is the past simple.') && g.framesDroppedIf === 1, out.join(''));
    const h2: V2State['history'] = []; const seen = new Set<string>();
    for (let i = 0; i < 5; i++) { const line = v2PartAskLine({ next: 'Past simple', done: 'Present perfect', named: false, history: h2 }); seen.add(line); h2.push({ role: 'assistant', content: line }); }
    check('the runtime\'s ask: five part changes, five different lines', seen.size === 5, [...seen]);
    check('…each closes the part, names the next and ends asking', [...seen].every((x) => /present perfect/.test(x) && /past simple/.test(x) && /\?$/.test(x) && leftOpen(x, 'yes', true)));
    // In a turn: the model repeats an earlier ask with no page: dropped, and the ask said in new words.
    let s2: V2State = { ...newV2State(0), goals: { overview: { status: 'shown', at: 1 } }, workingLevel: { level: 'intermediate', from: 'this_lesson' }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, history: hist };
    const t = await turn(s2, 'I sell washing machines.', 'Good, that\'s your job covered. Next is present perfect. Shall we go on, or do you have a question first?');
    s2 = t.state;
    const fresh = askOf(t.spoken);
    check('in a turn: the repeated ask is dropped and the part change still asked, in other words', !!fresh && fresh !== 'Shall we go on, or do you have a question first?' && /Next is present perfect/.test(t.spoken), t.spoken);
    // The Japanese frame of Task 6g, repeated in a whole turn: dropped (not said, not stored); said once before, it is a repeat.
    const T40 = '次に進みますか、それとも先に質問がありますか？';
    const jaHist: V2State['history'] = [{ role: 'user', content: 'x' }, { role: 'assistant', content: `仕事の話は、ここまでです。${T40}` }, { role: 'user', content: 'はい' }, { role: 'assistant', content: '<board page>Present perfect</board> How long have you worked there?' }];
    const tj = await turn({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }], current: 2 }, history: jaHist }, 'I have worked here for ten years.', `いいですね。現在完了は、ここまでです。${T40}`);
    check('Japanese, in a whole turn: the repeated frame is not said and not stored; the ask goes out in new words', !tj.spoken.includes('次に進みますか') && !JSON.stringify(tj.state.history.slice(-1)).includes('次に進みますか') && !!askOf(tj.spoken), tj.spoken);
    const tj2 = await turn({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }], current: 2 }, history: jaHist }, 'I have worked here for ten years.', 'いいですね。現在完了は、ここまでです。過去形に進む前に、何か質問はありますか？');
    check('…a different Japanese frame goes out as written (no budget now)', tj2.spoken.includes('過去形に進む前に') && !askOf(tj2.spoken), tj2.spoken);
    // At once: the ask is heard while the model's call is still streaming (the 6f rule, now with the part's name).
    let atEnd = ''; const heardNow: string[] = [];
    const watch: V2ModelCall = async (_p, onText) => { const text = 'Great. <board page>Past simple</board> Now the past simple.'; for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); atEnd = heardNow.join(''); return msg([{ type: 'text', text }], 'end_turn'); };
    await runV2Turn({ session, state: { ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }], current: 2 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Can you say that once more?' }] }, studentSaid: 'I have worked here for seven years.', callModel: watch, onText: (d) => heardNow.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('the ask names past simple and is heard before the call ends (no wait)', /Great\.[\s\S]*present perfect[\s\S]*Next[^.]*past simple\.[\s\S]*\?/.test(atEnd), atEnd);
  }

  console.log('3. answers, kill switches, unlabelled plans');
  {
    check('yes / let\'s / no questions are a go; a question is a question; no / skip are neither',
      ['Uh, yes, we move on.', 'Okay, let\'s go.', 'No questions.', 'Sure', 'はい、お願いします。'].every((x) => v2MoveAnswer(x) === 'go')
      && ['What is the difference?', 'Yes, but why do we say have worked?', 'I have a question.', 'Sorry, I don\'t understand.'].every((x) => v2MoveAnswer(x) === 'question')
      && ['No.', 'Skip it.', 'I went to Beijing.'].every((x) => v2MoveAnswer(x) === 'other'));
    check('flags on by default', TUTOR_V2_PART_PAGE_CHIP === true && TUTOR_V2_PART_ASK_EVERY === true);
    check('ASK_EVERY: spoken lessons with all parts named only (typed, homework, kill switch: no)', v2AskEveryOn(session) && !v2AskEveryOn({ ...session, mode: 'text' }) && !v2AskEveryOn(session, false) && !v2AskEveryOn({ ...session, homework: { statement: 'x' } as never }));
    // An unlabelled plan: the same lesson with its part names taken away.
    const bare = { ...GDI, segments: GDI.segments.map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan;
    check('(setup) the unlabelled plan is not labelled', !v2PlanLabelled(bare) && v2PlanLabelled(GDI) && !v2AskEveryOn({ ...session, plan: bare }));
    const st0 = { ...newV2State(0), goals: { overview: { status: 'shown' as const, at: 1 }, 'topic-intro': { status: 'shown' as const, at: 3 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 } };
    check('unlabelled: progress with the board is the progress from the goals alone, as before', JSON.stringify(v2Progress(bare, st0.goals, st0)) === JSON.stringify(v2Progress(bare, st0.goals)));
    // Unlabelled, spoken: the 6e budget holds (two frames spent → the page opens unasked), no page waits in the state, and a yes opens nothing.
    const s = { ...session, plan: bare };
    const spent: V2State['history'] = [
      { role: 'user', content: 'a' }, { role: 'assistant', content: '<board page>Lesson overview</board> Hi.' },
      { role: 'user', content: 'b' }, { role: 'assistant', content: 'Next is your job. Shall we go on, or do you have a question first?' },
      { role: 'user', content: 'yes' }, { role: 'assistant', content: '<board page>Your job</board> Tell me about it.' },
      { role: 'user', content: 'c' }, { role: 'assistant', content: 'Next is present perfect. Shall we go on?' },
      { role: 'user', content: 'yes' }, { role: 'assistant', content: '<board page>Present perfect</board> Have you ever…?' },
    ];
    let u0: V2State = { ...newV2State(0), history: spent, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }], current: 2 } };
    let ur = await turn(u0, 'I have worked there five years.', 'Good, that is right.\n<board page>Past simple</board>\nLast month is finished, so we say sold.', [], s);
    check('unlabelled: the budget spent, the page opens unasked (6e, as before)', openTitle(ur.state) === 'Past simple' && !ur.state.heldPage && !ur.calls.some((c) => /not opened yet/.test(c.outcome)), ur.calls.map((c) => c.outcome));
    u0 = { ...newV2State(0), history: spent.slice(0, 4), board: { pages: [{ title: 'Lesson overview', items: [] }], current: 0 } };
    ur = await turn({ ...u0, heldPage: { title: 'Your job', part: 'topic-intro', at: 2 } }, 'Yes.', 'Tell me about your job.', [], s);
    check('unlabelled: a yes opens no page by itself', !ur.calls.some((c) => c.name === 'new_page') && openTitle(ur.state) === 'Lesson overview');
    check('pending part: a held page lapses after more than three tutor replies (labelled plan)', v2PendingPart(GDI, { ...newV2State(0), heldPage: { title: 'Past simple', part: 'past-simple', at: 0 }, history: Array.from({ length: 10 }, () => ({ role: 'assistant' as const, content: 'x' })) }, '', 'yes') === null);
    const doneNone = v2PartsDone(GDI, { board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Past simple', items: [] }], current: 1 }, goals: { 'present-perfect': { status: 'skipped', at: 1 } }, workingLevel: undefined }, v2PartInHand(GDI, { board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Past simple', items: [] }], current: 1 }, goals: {}, workingLevel: undefined }));
    check('A4: parts the lesson skipped without teaching are not green (job, present perfect marked skipped; level not set)', !doneNone[1] && !doneNone[2] && !doneNone[3] && doneNone[0], doneNone);
  }

  console.log('4. fix round 1');
  {
    // Each case starts early in the 20-minute box (the walk above used most of it; a time-up turn is a closing turn).
    clock = 60_000;
    const base = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, goals: { overview: { status: 'shown', at: 1 }, 'topic-intro': { status: 'shown', at: 2 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Tell me about your job.' }], ...extra });
    // I1: the model asks itself, with no page block: "Yes." with no block opens the part's page.
    const ask = 'Good, that\'s your job covered. Next is the present perfect. Any questions first, or shall we go on?';
    let t = await turn(base(), 'I sell washing machines to customers.', ask);
    check('I1 (setup): the model\'s own ask, no page held', !t.state.heldPage && openTitle(t.state) === 'Your job', t.spoken);
    t = await turn(t.state, 'Yes.', 'Have you ever worked with a customer from another country?');
    check('I1: "Yes." to the model\'s own ask, no block in the reply: the present perfect page opens', openTitle(t.state) === 'Present perfect' && t.calls[0]?.agreed === true && chips(t.state).lit === 'present-perfect', { open: openTitle(t.state), calls: t.calls.map((c) => c.name) });
    // …an ask that names no part: the part after the one in hand.
    t = await turn(base(), 'I sell washing machines.', 'Great answer. Shall we go on?');
    t = await turn(t.state, 'Okay.', 'Have you ever worked abroad?');
    check('I1: an ask naming no part opens the part after the one in hand', openTitle(t.state) === 'Present perfect', openTitle(t.state));
    // …the runtime's own ask after a dropped repeat.
    const said = 'Shall we go on, or do you have a question first?';
    t = await turn(base({ history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: `Next is your job. ${said}` }] }), 'I sell washing machines.', `Good. Next is present perfect. ${said}`);
    check('I1 (setup): the repeat dropped, the runtime asks in new words', !!askOf(t.spoken) && askOf(t.spoken) !== said, t.spoken);
    t = await turn(t.state, 'Yes, let\'s go on.', 'Have you ever worked abroad?');
    check('I1: "yes" to the runtime\'s replacement ask opens the page', openTitle(t.state) === 'Present perfect', openTitle(t.state));
    // …but never into the summary, and not when they ask something.
    t = await turn(base(), 'I sell washing machines.', 'That is all for today\'s parts. Next is the summary. Shall we go on?');
    t = await turn(t.state, 'Yes.', 'Here is a quick summary.');
    check('I1: an ask naming the summary opens nothing by itself (the close keeps its rules)', openTitle(t.state) === 'Your job');
    t = await turn(base(), 'I sell washing machines.', ask);
    t = await turn(t.state, 'Please explain that again.', 'Of course. The present perfect joins the past to now.');
    check('I2: "Please explain that again." to the ask releases nothing', openTitle(t.state) === 'Your job');
    // I2: declines and redirects.
    const declines = ['Okay, skip it.', 'Let\'s skip to the summary.', 'Yes, skip it please.', 'Good question, I would rather skip.', 'Please explain that again.', 'Can you repeat that?', 'No thanks.', 'いいえ、スキップします。', 'Let\'s do the summary instead.'];
    check('I2: a decline or a redirect is never a go', declines.every((x) => v2MoveAnswer(x) !== 'go'), declines.filter((x) => v2MoveAnswer(x) === 'go'));
    const offer = 'You used it well. Would you like to practise your pronunciation for a few minutes, or skip it and go to the summary?';
    const conv = (): V2State => base({ goals: { ...base().goals, 'present-perfect': { status: 'shown', at: 3 }, 'past-simple': { status: 'shown', at: 4 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }, { title: 'Past simple', items: [] }, { title: 'Conversation', items: [] }], current: 4 }, history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: offer }] });
    for (const no of ['Okay, skip it.', 'Let\'s skip to the summary.', 'Yes, skip it please.', 'Good question, I would rather skip.']) {
      const r = await turn(conv(), no, 'Alright. Here is a quick summary of today.');
      check(`I2: "${no}" to the pronunciation offer opens no pronunciation page; the chip stays on the conversation`, openTitle(r.state) === 'Conversation' && chips(r.state).lit === 'open-conversation' && !chips(r.state).green.includes('open-conversation'), { open: openTitle(r.state), chips: chips(r.state) });
    }
    check('I2: to the choice, a bare yes or naming the part takes it up; "Okay, let\'s go." does not', v2PendingPart(GDI, conv(), offer, 'Yes.')?.title === 'Pronunciation' && v2PendingPart(GDI, conv(), offer, 'Uh, yes, practice pronunciation.')?.title === 'Pronunciation' && v2PendingPart(GDI, conv(), offer, 'Okay, let\'s go.') === null);
    // M2.
    check('M2: "No." to a questions-first ask is a go; with no such ask, not; "Can we go on?" is a go', v2MoveAnswer('No.', ask) === 'go' && v2MoveAnswer('Nope, no questions.', ask) === 'go' && v2MoveAnswer('No.', 'Shall we go on?') === 'other' && v2MoveAnswer('No.') === 'other' && v2MoveAnswer('Can we go on?') === 'go' && v2MoveAnswer('Can we go on to the past simple?') === 'go');
    // M1.
    const h1: V2State['history'] = [{ role: 'assistant', content: 'Shall we move on to conversation?' }];
    check('M1: asks naming different parts are not repeats; the same one is', !v2AskRepeats('Shall we move on to pronunciation?', h1, GDI) && v2AskRepeats('Shall we move on to conversation?', h1, GDI) && v2AskRepeats('Shall we move on to pronunciation?', h1));
    // M3: one page block in the stored reply when the yes-reply writes the released page itself.
    let m3 = await turn(base(), 'I sell washing machines.', ask);
    m3 = await turn(m3.state, 'Yes.', 'Great.\n<board page>Present perfect</board>\nHave you ever worked abroad?');
    const lastStored = (() => { const h = [...m3.state.history].reverse().find((x) => x.role === 'assistant')!; return typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(''); })();
    check('M3: the stored reply holds one page block for the released page, at its head', (lastStored.match(/<board page>/g) ?? []).length === 1 && lastStored.startsWith('<board page>Present perfect</board>'), lastStored);
    // M5: a labelled plan with both flags off: the 57d4aa6f path (6e budget offer, no held page in the state, yes opens nothing).
    let off = await turn(base(), 'I have worked here five years.', 'Good, that is right.\n<board page>Past simple</board>\nLast month is finished.', [], session, { pageChip: false, askEvery: false });
    check('M5: flags off, labelled plan: held with the old offer, no page kept in the state', /Next is past simple\. Shall we go on, or do you have a question first\?$/.test(off.spoken) && !off.state.heldPage && openTitle(off.state) === 'Your job', off.spoken);
    off = await turn(off.state, 'Yes.', 'Last month is a finished time.', [], session, { pageChip: false, askEvery: false });
    check('M5: …and "Yes." with no page block opens nothing', openTitle(off.state) === 'Your job' && !off.calls.some((c) => c.name === 'new_page'));
    // Fix round 2: a yes to a practice ask with "shall we" / "ready" / "go on" in it moves nothing.
    const practice = ['Good. Shall we try another sentence?', 'Nice. Ready for the next one?', 'Are you ready?', 'Great. Shall we practise that once more?', 'Can you go on and tell me more about your team?', 'いいですね。もう一度言ってみましょうか？'];
    for (const q of practice) for (const yes of ['Yes.', 'Okay.', 'Sure.']) {
      check(`fix round 2: "${yes}" to "${q}": nothing pending`, v2PendingPart(GDI, base({ history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: q }] }), q, yes) === null);
    }
    for (const q of practice) {
      const r = await turn(base({ history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: q }] }), 'Yes.', 'Good. Say it once more: I sell washing machines.');
      check(`fix round 2: whole turn, "Yes." to "${q}": no page opens, the chip stays on "Your job"`, openTitle(r.state) === 'Your job' && chips(r.state).lit === 'topic-intro' && !r.calls.some((c) => c.name === 'new_page'), { open: openTitle(r.state), calls: r.calls.map((c) => c.name) });
    }
    check('fix round 2: the frame or a move-on cue with no part named still opens the next part', v2PendingPart(GDI, base(), 'Good. Shall we move on?', 'Yes.')?.title === 'Present perfect' && v2PendingPart(GDI, base(), 'Good work. Any questions first, or shall we go on?', 'Yes.')?.title === 'Present perfect' && v2PendingPart(GDI, base(), 'お疲れさまでした。次に進みますか？', 'はい')?.title === 'Present perfect');
    check('fix round 2: the runtime\'s "…or do you have a question first?" is no choice of parts', v2PendingPart(GDI, base(), 'Would you like to practise pronunciation now, or do you have a question first?', 'Okay.')?.title === 'Pronunciation');
    check('fix round 2: "No, let us move on." to a questions-first ask is a go', v2MoveAnswer('No, let us move on.', ask) === 'go' && v2MoveAnswer('Let us move on.') === 'go');
    // Controller ruling: the route's state reading keeps what the turn wrote for the next turn.
    const carried = v2ReadCarried({ summaryBegunAt: 1_700_000, repliesSinceBoard: 2.7, boardProblems: ['note "x": too wide', 3, '', ...Array.from({ length: 20 }, (_, i) => `p${i}`)], heldPage: { title: 'Past simple', part: 'past-simple', at: 4 } });
    check('state carry: summaryBegunAt, repliesSinceBoard (whole), boardProblems (strings, last 12), heldPage survive', carried.summaryBegunAt === 1_700_000 && carried.repliesSinceBoard === 2 && carried.boardProblems?.length === 12 && carried.boardProblems[11] === 'p19' && carried.heldPage?.part === 'past-simple', carried);
    check('state carry: a session that never set them gets nothing added; malformed values are dropped', JSON.stringify(v2ReadCarried({ history: [], note: '' })) === '{}' && JSON.stringify(v2ReadCarried({ summaryBegunAt: 'x', repliesSinceBoard: -1, boardProblems: 'no', heldPage: { title: 1 } })) === '{}');
    check('state carry: kill switch off: only the held page, as before; on by default', JSON.stringify(v2ReadCarried({ summaryBegunAt: 5, repliesSinceBoard: 1, boardProblems: ['a'] }, false)) === '{}' && TUTOR_V2_STATE_CARRY === true);
    // Fix round 2 (controller ruling): carried for spoken plan-led lessons only; homework, discussion and typed lessons drop
    // them, as before.
    const full = (): V2State => ({ ...newV2State(0), summaryBegunAt: 5, repliesSinceBoard: 3, boardProblems: ['a'] });
    const kept = (x: V2State) => x.summaryBegunAt === 5 && x.repliesSinceBoard === 3 && x.boardProblems?.length === 1;
    const none = (x: V2State) => x.summaryBegunAt === undefined && x.repliesSinceBoard === undefined && x.boardProblems === undefined;
    const disc = { ...GDI, metadata: { kind: DISCUSSION_PLAN_KIND, participant: 'a teacher', orientation: 'x', cases: [{ id: 'c1', scenario: 'y' }] } } as unknown as LessonPlan;
    check('state scope: a spoken plan lesson carries all three', kept(v2ScopeCarried(full(), session)) && v2CarryApplies(session));
    check('state scope: homework (GAC text and voice), a discussion, a typed lesson and a voice lesson with no plan drop them (as at 57d4aa6f)',
      none(v2ScopeCarried(full(), { ...session, mode: 'text', homework: { statement: 'x' } as never })) && none(v2ScopeCarried(full(), { ...session, homework: { statement: 'x' } as never }))
      && none(v2ScopeCarried(full(), { ...session, plan: disc })) && none(v2ScopeCarried(full(), { ...session, mode: 'text' })) && none(v2ScopeCarried(full(), { ...session, plan: undefined })));
    check('state scope: the held page is not touched by the scope', v2ScopeCarried({ ...full(), heldPage: { title: 'A', part: 'a', at: 1 } }, { ...session, mode: 'text' }).heldPage?.part === 'a');
    const routeSrc = readFileSync(join(__dirname, '..', 'src', 'app', 'api', 'tutor', 'brain-v2', 'turn', 'route.ts'), 'utf8');
    check('state carry: the turn route reads them through v2ReadCarried and scopes them to the session', /const carried = v2ReadCarried\(s\)/.test(routeSrc) && /\.\.\.carried/.test(routeSrc) && /v2ScopeCarried\(state, session\)/.test(routeSrc));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
