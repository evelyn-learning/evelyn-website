/// <reference types="node" />
// Task 7f: run with NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off (package.json): it pins the behaviour
// before Task 7f (the box's last fifth, the fitted part minutes, the stop at the box, part changes with no practice count);
// scripts/test-brain-v2-time-7f.ts covers the switches on, and each one off alone.
/**
 * Tutor brain v2 — the final review of Tasks 7a–7d (.superpowers/sdd/2026-11-13-gdi-on-v2-plan/final7-review.md): its
 * findings I1–I6 and M1–M6, each as the scenario the review's probes found, and the test gaps it named for merge. No network,
 * no model: scripted runV2Turn walks.
 *   npm run test:brain-v2-final-7
 *
 *  1. I1: the close's invitation is no part ask, and is never dropped as a repeat
 *  2. I2: a refused close leaves exactly one invitation (never two, never none)
 *  3. I3: an invitation with no summary closes nothing
 *  4. I4: the natural answers to the runtime's five part asks (English and Japanese)
 *  5. I5 (and test gap 4): the part ask names the part, also when praise shares a heading word
 *  6. I6 (and test gap 5): STATE_CARRY off with CLOSE_INVITES_QUESTIONS on
 *  7. M1–M6
 *  8. Test gap 6: a multi-turn walk through the route's state round trip (JSON, v2ReadClientState, v2ScopeCarried)
 *  9. Test gap 7: an English maths voice walk with summaryBegunAt carried: the 6g close guards where they are now live
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2CountLevelCheck } from '../src/lib/tutor/v2/level-check-count';
import { v2AnswerHasContent } from '../src/lib/tutor/v2/working-level';
import { V2_CLOSE_INVITE_LINE, V2_CLOSE_INVITE_REFUSAL, V2_CLOSE_INVITE_WAIT, v2CloseInviteFacts, v2ReplyInvites } from '../src/lib/tutor/v2/close-invite';
import { v2ReadCarried, v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { v2ReadClientState } from '../src/lib/tutor/v2/client-state';
import { V2_PART_ASKS, v2AskRepeats, v2IsPartAsk, v2MoveAnswer, v2PageForPart, v2PartNamedLate } from '../src/lib/tutor/v2/part-flow';
import { v2LearnerSentenceFacts } from '../src/lib/tutor/v2/learner-card';
import { ReplyGate } from '../src/lib/tutor/v2/reply-gate';
import { v2IsPracticeAsk } from '../src/lib/tutor/v2/languages';
import { foldInterruptedTurn } from '../src/lib/tutor/v2/interrupted';
import { V2_SUMMARY_BEGUN, runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
/** A model that replies with each step in turn (the last again when they run out), streaming its words; records the facts. */
function scripted(steps: Step[]) {
  const facts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const s = steps[Math.min(i, steps.length - 1)]!; i += 1;
    for (const piece of s.text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
    return msg([...(s.text ? [{ type: 'text', text: s.text }] : []), ...(s.after ?? [])], s.after?.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, calls: () => i };
}
let ids = 0;
const end = (because = 'time_nearly_used') => [{ type: 'tool_use', id: `e${(ids += 1)}`, name: 'end_lesson', input: { because, summary: 'x' } }];

const GDI = parseLessonPlan(JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
type H = V2State['history'];
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const min = (m: number) => m * 60000;

// The close (the review's probes): every part before the summary reached, pronunciation skipped.
const B = ['Lesson overview', 'Your job', 'Present perfect', 'Past simple', 'Your project'];
const goalsB = { overview: { status: 'shown' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 }, pronunciation: { status: 'skipped' as const, at: 0 } };
const closeState = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: B.map((title) => ({ title, items: [] })), current: B.length - 1 }, goals: goalsB, workingLevel: { level: 'intermediate', from: 'this_lesson' }, history: [u('x'), a('Try the whole sentence again, and say "was" clearly.')], ...extra });
// Mid-lesson: the level set, on the job's page.
const midState = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, goals: { overview: { status: 'shown', at: 1 }, 'level-check': { status: 'demonstrated', at: 2 } }, board: { pages: [{ title: 'Overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, history: [u('hi'), a('Hello Ken.'), u('x'), a('Tell me about your work with customers from other countries.')], ...extra });
const T1757 = 'That\'s right: "I was responsible for communicating with our customers." <board page>Summary</board> Before we finish, here is what you did well. You used the past simple correctly for your finished project. Keep working on "I have worked…" for things that started in the past and continue now. Thank you for today\'s lesson, Ken. See you next time!';
const SUM = 'That\'s right. Here is a quick summary. <board page>Summary</board> You talked about your work and used the past simple well.';
const INVITE = 'Do you have any questions before we finish?';
const SAID = 'I was responsible for communicating with our customers.';
const run = (session: V2Session, state: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: min(nowMin) })
    .then((r) => ({ r, heard: heard.join('').replace(/\s+/g, ' ').trim(), m, end: r.toolCalls.filter((c) => c.name === 'end_lesson').map((c) => c.outcome) }));
};
const lastAssistantText = (h: H) => { const m = [...h].reverse().find((x) => x.role === 'assistant' && (typeof x.content === 'string' || x.content.some((c) => c.type === 'text'))); return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); };
const count = (text: string, s: string) => text.split(s).length - 1;
/** The route's round trip between turns: JSON on the wire, read back, scoped to the session. */
const wire = (state: V2State, session: V2Session, carry?: boolean) => v2ScopeCarried(v2ReadClientState(JSON.parse(JSON.stringify(state)), carry)!, session);

async function main() {
  console.log('1. I1: the close\'s invitation is no part ask, and is never dropped as a repeat');
  {
    check('"Any questions before we finish?" is no part ask; the moving-on asks still are', !v2IsPartAsk('Any questions before we finish?') && !v2IsPartAsk(INVITE)
      && v2IsPartAsk('Any questions before we start?') && v2IsPartAsk('Do you have any questions before we move on?') && v2IsPartAsk('Is there a question before we continue?') && V2_PART_ASKS.every((x) => v2IsPartAsk(x)));
    check('…so it is never a repeat of the overview\'s "Any questions before we start?"', !v2AskRepeats('Any questions before we finish?', [a('This is the plan for today. Any questions before we start?')], GDI));
    for (const [label, earlier, inv] of [
      ['same words at 12 min', `You used the past simple well. ${INVITE}`, INVITE],
      ['one word apart (start / finish)', 'This is the plan for today. Any questions before we start?', 'Any questions before we finish?'],
    ] as const) {
      const r = await run(lang, closeState({ history: [u('hi'), a(earlier), u('x'), a('Try the whole sentence again, and say "was" clearly.')] }), SAID, [{ text: `${SUM} ${inv}` }], 17.0);
      check(`probe3, ${label}: the summary reply ends on the invitation, no check-in in its place, and it is recorded`, r.heard.endsWith(inv) && !/make sense/.test(r.heard) && typeof r.r.state.closeInvitedAt === 'number' && lastAssistantText(r.r.state.history).trim().endsWith(inv), r.heard);
    }
    const g2 = { ...goalsB } as Record<string, unknown>; delete g2.pronunciation;
    const r = await run(lang, closeState({ goals: g2 as V2State['goals'], history: [u('hi'), a(INVITE), u('x'), a('Try again.')] }), SAID, [{ text: `Good. You talked about your work today and used the past simple well. ${INVITE}` }], 17.0);
    check('probe3, a part not paged before the summary: no "Next up is conversation…" part ask inside the summary reply; it ends on the invitation', r.heard.endsWith(INVITE) && !/Next|move on/.test(r.heard) && !r.r.state.heldPage, r.heard);
  }

  console.log('2. I2: a refused close leaves exactly one invitation');
  {
    const p1 = await run(lang, closeState(), SAID, [{ text: `${SUM} ${INVITE}`, after: end() }, { text: 'Is there anything you would like to ask before we finish?' }], 17.0);
    check('P1: summary + invitation + end_lesson in one call: WAIT (not "ask again"), one model call, one invitation heard', p1.end.length === 1 && p1.end[0] === V2_CLOSE_INVITE_WAIT && p1.m.calls() === 1 && count(p1.heard, '?') === 1 && p1.heard.endsWith(INVITE) && !p1.r.state.closed, { heard: p1.heard, end: p1.end });
    check('…the invitation recorded, the lesson open', typeof p1.r.state.closeInvitedAt === 'number');
    const p2 = await run(lang, closeState(), SAID, [{ text: T1757, after: end() }, { text: 'Goodbye, Ken!', after: end() }], 17.57);
    check('P2: summary + goodbye, refused; then a goodbye only, WAIT: the runtime\'s invitation ends the reply (no goodbye, never no question)', p2.end[0] === V2_CLOSE_INVITE_REFUSAL && p2.end[1] === V2_CLOSE_INVITE_WAIT && p2.heard.endsWith(V2_CLOSE_INVITE_LINE) && count(p2.heard, V2_CLOSE_INVITE_LINE) === 1 && !/Goodbye|See you/.test(p2.heard) && !p2.r.state.closed, p2.heard);
    check('…stored too, as the reply\'s last words, and recorded (the summary page opened)', lastAssistantText(p2.r.state.history).trim().endsWith(V2_CLOSE_INVITE_LINE) && typeof p2.r.state.closeInvitedAt === 'number');
    const p2b = await run(lang, p2.r.state, 'No, thank you.', [{ text: 'All right. Thank you for today\'s lesson, Ken. See you next time!', after: end() }], 17.9);
    check('…and their "No, thank you." closes the lesson on the next turn', p2b.r.state.closed && p2b.end[0] === 'the session is ending', p2b.end);
    const p1b = await run(lang, closeState(), SAID, [{ text: SUM, after: end() }, { text: '' }], 17.0);
    check('refused, then a call with nothing in it: the runtime\'s invitation, once', p1b.end[0] === V2_CLOSE_INVITE_REFUSAL && p1b.heard.endsWith(V2_CLOSE_INVITE_LINE) && count(p1b.heard, '?') === 1 && typeof p1b.r.state.closeInvitedAt === 'number', p1b.heard);
    const p1c = await run(lang, closeState(), SAID, [{ text: SUM, after: end() }, { text: 'Is there anything else you would like to ask me?' }], 17.0);
    check('refused, then the model asks it in its own words: that one only', p1c.heard.endsWith('Is there anything else you would like to ask me?') && count(p1c.heard, '?') === 1 && typeof p1c.r.state.closeInvitedAt === 'number', p1c.heard);
    const p1d = await run(lang, closeState(), SAID, [{ text: SUM, after: end() }, { text: 'Which part was the hardest for you today?' }], 17.0);
    check('refused, then another question: kept alone (one question a reply), no invitation recorded, still owed', p1d.heard.endsWith('Which part was the hardest for you today?') && !p1d.heard.includes(V2_CLOSE_INVITE_LINE) && p1d.r.state.closeInvitedAt === undefined, p1d.heard);
  }

  console.log('3. I3: an invitation with no summary closes nothing');
  {
    const pron: V2State = closeState({ goals: { ...goalsB, pronunciation: { status: 'shown', at: 0 } } as V2State['goals'], board: { pages: [...B, 'Pronunciation'].map((title) => ({ title, items: [] })), current: 5 } });
    const p4 = await run(lang, pron, 'Was. Was. I was responsible.', [{ text: 'Good, the z sound at the end of "was" is clearer now. Do you have any questions?' }], 16.3);
    check('P4: a bare "Do you have any questions?" in pronunciation, no summary: not recorded', p4.r.state.closeInvitedAt === undefined && p4.r.state.summaryBegunAt === undefined, p4.r.state.closeInvitedAt);
    const p4b = await run(lang, p4.r.state, 'No.', [{ text: 'Okay. See you next time!', after: end() }, { text: '' }], 16.6);
    check('…next turn: the facts still owe the summary reply with the invitation, and a goodbye with no summary is refused', !p4b.r.state.closed && p4b.end[0] === V2_CLOSE_INVITE_REFUSAL && /the reply that gives the summary does not end the lesson/.test(p4b.m.facts[0] ?? ''), p4b.end);
    const words = await run(lang, pron, 'Was. Was. I was responsible.', [{ text: `Good. Here is a quick summary: you talked about your job and your project, and practised "was". ${INVITE}` }], 16.3);
    check('a summary in the reply\'s own words (no page) and the invitation: recorded', typeof words.r.state.closeInvitedAt === 'number', words.heard);
    const nowMs = min(17.5);
    const noSum = v2CloseInviteFacts(lang, { ...pron, closeInvitedAt: 1 }, { nowMs, stopAsked: false }).join('\n');
    const withSum = v2CloseInviteFacts(lang, { ...pron, closeInvitedAt: 1, summaryBegunAt: 1 }, { nowMs, stopAsked: false }).join('\n');
    const onPage = v2CloseInviteFacts(lang, closeState({ closeInvitedAt: 1, board: { pages: [...B, 'Summary'].map((title) => ({ title, items: [] })), current: 5 } }), { nowMs, stopAsked: false }).join('\n');
    check('the "invitation given" line says to give the summary first when none has begun, and not once it has', /give it in a few words first/.test(noSum) && !/give it in a few words first/.test(withSum) && !/give it in a few words first/.test(onPage) && /say goodbye and end the lesson in this reply/.test(withSum), { noSum, withSum });
  }

  console.log('4. I4: the natural answers to the runtime\'s five part asks');
  {
    const go = ["No, I'm ready.", 'No, I am ready.', "I'm ready.", 'Ready.', "No, let's go on.", 'No questions.', 'No.', 'Nothing.', 'Nothing, thanks.', "No, I don't have any.", "No, I don't have a question.", "I don't have any questions.", 'I do not have any questions.', "No, it's okay.", "No, that's fine.", "I'm fine, let's continue.", 'Nope, all good.', 'Go on, please.', "Yes, let's go.", 'Yes.', 'Sure.', 'はい、お願いします。', '大丈夫です。', '質問はありません。', 'ないです。', '特にありません。', 'いいえ、大丈夫です。', 'いいえ、質問はありません。'];
    const notGo = ['No, wait.', 'No, one more time please.', 'いいえ、もう一度お願いします。', 'Can you explain that again?', 'Skip it.', "No, I'm ready, but can you explain the present perfect again?", 'Yes, I have a question.', 'Nothing is clear to me.', 'もう一度説明してください。'];
    for (const ask of V2_PART_ASKS) {
      const last = `Good, that's your job covered. Next is present perfect. ${ask}`;
      const wrongGo = go.filter((x) => v2MoveAnswer(x, last) !== 'go');
      const wrongStay = notGo.filter((x) => v2MoveAnswer(x, last) === 'go');
      check(`"${ask}": every natural yes / no-questions answer is go, every decline or question is not`, !wrongGo.length && !wrongStay.length, { wrongGo, wrongStay });
    }
    check('…a no-questions form to an ask that offers no question first is not taken as a go ("Shall we go on?" + "Nothing.")', v2MoveAnswer('Nothing.', 'Next is present perfect. Shall we go on?') === 'other' && v2MoveAnswer("No, I'm ready.", 'What do you sell?') === 'other');
    check('…and the decline and question answers keep their kinds', v2MoveAnswer('No, wait.', `Next is present perfect. ${V2_PART_ASKS[0]}`) === 'other' && v2MoveAnswer('Yes, I have a question.', `Next is present perfect. ${V2_PART_ASKS[0]}`) === 'question');
    // In a whole turn: the held page opens on "No, I'm ready." (the review's flag-5 shape).
    for (const said of ["No, I'm ready.", '質問はありません。', "I don't have any questions."]) {
      const base = midState({ history: [u('hi'), a(`Good, that's your job covered. Next is present perfect. ${V2_PART_ASKS[2]}`)], heldPage: { title: 'Present perfect', part: 'present-perfect', at: 1 } });
      const r = await run(lang, base, said, [{ text: 'Great. The present perfect joins the past and now. Have you ever been to Canada?' }], 7.5);
      check(`in a turn, "${said}": the held page opens and the facts say so (no "ask again")`, r.r.state.board.pages.some((p) => p.title === 'Present perfect') && /they said yes to going on/.test(r.m.facts[0] ?? '') && !/part change waiting/.test(r.m.facts[0] ?? ''), r.m.facts[0]?.match(/part change[^\n]*|they said yes[^\n]*/g));
    }
  }

  console.log('5. I5: the part ask names the part, also when praise shares a heading word');
  {
    const seg = (id: string) => GDI.segments.find((s) => s.id === id)!;
    check('"Perfect, that is exactly right!" does not name Present perfect; "Good job!" not Your job; "joins the past and now" not Past simple', !v2PartNamedLate(seg('present-perfect'), 'Perfect, that is exactly right!') && !v2PartNamedLate(seg('topic-intro'), 'Good job!') && !v2PartNamedLate(seg('past-simple'), 'The present perfect joins the past and now.'));
    check('…the name in the last two sentences does; earlier in a long reply does not', v2PartNamedLate(seg('past-simple'), 'Well done. Next is the past simple. Shall we go on?') && !v2PartNamedLate(seg('past-simple'), 'The past simple was in your answer. Good. You said it well. Shall we go on?'));
    // The review's probe4 t1 → t2: a correction, a hand-over and a page held unasked; then praise only.
    const t1 = await run(lang, midState(), 'I am working with Canada customer since five years.', [{ text: 'Good try. We say "I have worked with Canadian customers for five years." Please say that sentence again. <board page>Present perfect</board> The present perfect joins the past and now.' }], 6.5);
    check('(setup) t1: the page held unasked', t1.r.state.heldPage?.unasked === true && t1.r.state.heldPage.title === 'Present perfect', t1.r.state.heldPage);
    const t2 = await run(lang, t1.r.state, 'I have worked with Canadian customers for five years.', [{ text: 'Perfect, that is exactly right!' }], 7.0);
    check('t2: praise with "Perfect": the owed ask names the present perfect and closes the job', /present perfect/i.test(t2.heard.replace(/^Perfect/, '')) && /your job/i.test(t2.heard) && V2_PART_ASKS.some((x) => t2.heard.endsWith(x)), t2.heard);
    const t2b = await run(lang, t1.r.state, 'I have worked with Canadian customers for five years.', [{ text: 'Good job! That is the present perfect, and you said it well.' }], 7.0);
    check('…and with "Good job!": the job is still closed by name and the next part named', /present perfect/i.test(t2b.heard) && V2_PART_ASKS.some((x) => t2b.heard.endsWith(x)), t2b.heard);
  }

  console.log('6. I6: STATE_CARRY off with CLOSE_INVITES_QUESTIONS on');
  {
    const own = await run(lang, closeState(), SAID, [{ text: `${SUM} ${INVITE}` }], 17.0);
    const off = wire(own.r.state, lang, false);
    check('the route (STATE_CARRY off) keeps closeInvitedAt; summaryBegunAt is still STATE_CARRY\'s', typeof off.closeInvitedAt === 'number' && off.summaryBegunAt === undefined && v2ReadCarried({ summaryBegunAt: 5, closeInvitedAt: 5 }, false).summaryBegunAt === undefined, off);
    const p3 = await run(lang, off, 'No, thank you.', [{ text: 'All right. Thank you, Ken. See you next time!', after: end() }, { text: INVITE, after: end() }], 17.5);
    check('…so "No, thank you." closes the lesson with its goodbye (was: refused, goodbye dropped, invitation asked again)', p3.r.state.closed && p3.end.length === 1 && p3.end[0] === 'the session is ending' && /See you next time/.test(p3.heard), p3);
    check('…and still scoped: dropped for a maths voice lesson (one language)', wire(own.r.state, { ...lang, languages: undefined, subject: 'Mathematics' }, false).closeInvitedAt === undefined);
  }

  console.log('7. M1–M6');
  {
    // M1
    const base = midState({ history: [u('hi'), a(`Good, that's your job covered. Next is present perfect. ${V2_PART_ASKS[2]}`)], heldPage: { title: 'Present perfect', part: 'present-perfect', at: 1 } });
    check('M1: "Yes, let\'s go on to the present perfect." / "No, I am ready, let\'s go on." to a part ask: no learner-card line', !v2LearnerSentenceFacts(lang, base, "Yes, let's go on to the present perfect.", true).length && !v2LearnerSentenceFacts(lang, base, "No, I am ready, let's go on.", true).length);
    const inv = closeState({ closeInvitedAt: 1, history: [u('x'), a(`Today you talked about your job and used the past simple well. ${INVITE}`)] });
    const f2 = renderFacts(lang, inv, { nowMs: min(17.5), heard: 'No, I do not have any questions today.' });
    check('M1: the answer to the invitation: no card line beside the close line', !/their words just now answered/.test(f2) && /say goodbye and end the lesson/.test(f2));
    check('M1: an ordinary question about them still gets it', v2LearnerSentenceFacts(lang, midState({ history: [u('x'), a('What did you do at work last week?')] }), 'I visited a customer in Toronto last week.', true).length === 1);
    // M2
    const out: string[] = [];
    const gate = new ReplyGate((t) => out.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk, holdAsk: true, summaryBegun: V2_SUMMARY_BEGUN, dropCheckIn: true });
    gate.push('Good. Please say the whole sentence once more. Does that make sense so far? Here is a quick summary of today. You used the past simple well. ');
    gate.flush();
    const said = out.join('');
    check('M2: a practice ask dropped as the summary begins takes the check-in waiting after it (no question before the summary)', !/make sense/.test(said) && !/once more/.test(said) && /quick summary/.test(said) && gate.removed.some((x) => /make sense/.test(x)), said);
    // M3
    check('M3: curly apostrophes', v2ReplyInvites('Is there anything you’d like to ask?') && v2ReplyInvites("Is there anything you'd like to ask?"));
    check('…and a Japanese part frame is no invitation', !v2ReplyInvites('次に進みますか、それとも先に質問がありますか？') && v2ReplyInvites('何か質問はありますか？'));
    // M4
    const T_OPEN = "Hello, Ken. Today we'll talk about your work and the projects you're involved in. Does that sound good to you?";
    const T_INTRO = "Great. First, I'll ask you three short questions so I can see how you speak English. Are you ready?";
    const T_Q2 = 'Thank you, Ken. Have you ever worked with an international customer? If so, can you tell me about that experience?';
    const T_FOLLOW = 'Canada customers, that sounds interesting. What do you sell to them?';
    const T_Q3 = "Next question: what is one skill you'd like to improve in your English, and why is it important to you?";
    const chatty: H = [a(T_OPEN), u("Sounds good, I'm a little nervous today."), a(T_INTRO), u('Okay.'), a(T_Q2), u('Yes, with customers in Canada.'), a(T_FOLLOW), u('Washing machines.'), a(T_Q3)];
    const c = v2CountLevelCheck(GDI, chatty, 'My speaking, for meetings.', v2AnswerHasContent);
    check('M4: small talk to the opener is no level answer: two plan questions and the follow-up are not done', !c.done && c.answered === 2 && c.followUp, c);
    const marked: H = [a(T_OPEN), u("Sounds good, I'm a little nervous today."), { role: 'assistant', content: [{ type: 'text', text: 'Great, let us begin.' }, { type: 'tool_use', id: 'g1', name: 'set_goal_status', input: { goal: 'overview', status: 'shown' } }] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'g1', content: 'ok' }] }, a('Tell me about the work you do, please.'), u('I am a sales manager.'), a(T_Q2), u('Yes, with customers in Canada.'), a(T_FOLLOW), u('Washing machines.'), a(T_Q3)];
    const cm = v2CountLevelCheck(GDI, marked, 'My speaking, for meetings.', v2AnswerHasContent);
    check('…an answer after the overview is marked counts (a first question in other words): done', cm.done && cm.followUp, cm);
    // M5
    const m5: V2State = { ...newV2State(0), goals: { overview: { status: 'shown', at: 1 } }, board: { pages: [{ title: 'Lesson overview', items: [] }], current: 0 } };
    check('M5: an unnamed page after the overview, the level not set: never retitled "Level check" (the teaching part instead)', v2PageForPart(GDI, m5, 'Talking about work')?.title === 'Your job', v2PageForPart(GDI, m5, 'Talking about work'));
    // M6
    const s6 = { ...newV2State(0), board: { pages: [{ title: 'Overview', items: [] }, { title: 'Your job', items: [] }], current: 1 } };
    const folded = ['not opened yet: the student is asked first', 'not opened yet: held until they are asked whether to go on'].map((outcome) => foldInterruptedTurn(s6, 'x', 'Good. Next is present perfect.', [{ id: 'held_1', name: 'new_page', args: { title: 'Present perfect' }, outcome }]));
    check('M6: a turn cut off after a held page: the page is not opened in the record', folded.every((f) => f.board.pages.length === 2 && f.board.current === 1));
    const painted = foldInterruptedTurn(s6, 'x', 'Next.', [{ id: 'p1', name: 'new_page', args: { title: 'Present perfect' }, outcome: 'opened page 3' }]);
    check('…a page that did open still is', painted.board.pages.length === 3);
  }

  console.log('8. Test gap 6: a multi-turn walk through the route\'s state round trip');
  {
    let s = wire(midState(), lang);
    let r = await run(lang, s, 'I am working with Canada customer since five years.', [{ text: 'Good try. We say "I have worked with Canadian customers for five years." Please say that sentence again. <board page>Present perfect</board> The present perfect joins the past and now.' }], 6.5);
    s = wire(r.r.state, lang);
    check('t1 → wire: the page held unasked survives the round trip', s.heldPage?.unasked === true && s.heldPage.title === 'Present perfect', s.heldPage);
    r = await run(lang, s, 'I have worked with Canadian customers for five years.', [{ text: 'Perfect, that is exactly right!' }], 7.0);
    s = wire(r.r.state, lang);
    check('t2 → wire: the owed ask was said, the page waits (asked)', !!s.heldPage && !s.heldPage.unasked && V2_PART_ASKS.some((x) => r.heard.endsWith(x)), r.heard);
    r = await run(lang, s, "No, I'm ready.", [{ text: 'Great. The present perfect joins the past and now. Have you ever been to Canada?' }], 7.5);
    s = wire(r.r.state, lang);
    check('t3 → wire: "No, I\'m ready." opened it; the held page is gone', s.board.pages.some((p) => p.title === 'Present perfect') && !s.heldPage, s.board.pages.map((p) => p.title));
    // To the close: the parts reached, then the summary reply with its invitation.
    s = wire({ ...s, goals: goalsB, board: { pages: B.map((title) => ({ title, items: [] })), current: B.length - 1 } }, lang);
    r = await run(lang, s, SAID, [{ text: `${SUM} ${INVITE}`, after: end() }], 17.0);
    s = wire(r.r.state, lang);
    check('summary + invitation (+ end_lesson, waited) → wire: closeInvitedAt and summaryBegunAt both carried, the lesson open', typeof s.closeInvitedAt === 'number' && typeof s.summaryBegunAt === 'number' && !s.closed && r.end[0] === V2_CLOSE_INVITE_WAIT, { end: r.end, invited: s.closeInvitedAt, begun: s.summaryBegunAt });
    r = await run(lang, s, 'No questions.', [{ text: 'All right. Thank you for today\'s lesson, Ken. See you next time!', after: end() }], 17.6);
    check('"No questions." closes it, with its goodbye and the next-time line', r.r.state.closed && /See you next time/.test(r.heard) && /pronunciation/.test(r.heard), r.heard);
    check('…and a closed state is refused by the route\'s reader only for a new turn (it reads)', v2ReadClientState(JSON.parse(JSON.stringify(r.r.state)))?.closed === true);
  }

  console.log('9. Test gap 7: an English maths voice walk with summaryBegunAt carried');
  {
    const mathsPlan = { ...GDI, title: 'Two-step equations', segments: GDI.segments.filter((x) => x.id !== 'level-check').map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan;
    const maths: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20, plan: mathsPlan };
    const st0: V2State = { ...newV2State(0), goals: Object.fromEntries(mathsPlan.segments.slice(0, -1).map((x) => [x.id, { status: 'shown' as const, at: 0 }])), board: { pages: [{ title: 'Two-step equations', items: [] }, { title: 'Summary', items: [] }], current: 1 }, history: [u('x'), a('Here is a quick summary: you solved two-step equations by undoing each step.')], summaryBegunAt: min(16.5), repliesSinceBoard: 2 };
    let s = wire(st0, maths);
    check('(setup) the route carries summaryBegunAt for a spoken plan-led maths lesson, and no closeInvitedAt', typeof s.summaryBegunAt === 'number' && s.closeInvitedAt === undefined);
    const r1 = await run(maths, s, 'Okay, thanks.', [{ text: 'You did really well today. Can you try this one: 3x + 2 = 11?' }], 17.0);
    check('6g live: the facts say the summary has begun (no new practice) and how long since the board was written', r1.m.facts.some((x) => /the summary has begun: from here, no new practice/.test(x)) && r1.m.facts.some((x) => /board last written on: 2 replies ago/.test(x)), r1.m.facts[0]);
    check('…a practice ask the model writes anyway waits to the reply\'s end and, nothing closing after it, goes out (the facts are the guard here)', r1.heard.endsWith('Can you try this one: 3x + 2 = 11?'), r1.heard);
    const r1b = await run(maths, wire(st0, maths), 'Okay, thanks.', [{ text: 'Great work today, Sam. Can you try this one: 3x + 2 = 11? See you next time!', after: end() }], 17.0);
    check('…one followed straight by the goodbye, with an accepted close, is dropped, heard and stored: the lesson ends on no unanswerable question', r1b.r.state.closed && !/3x \+ 2 = 11/.test(r1b.heard) && !/3x \+ 2 = 11/.test(lastAssistantText(r1b.r.state.history)) && /See you next time/.test(r1b.heard), r1b.heard);
    const r1c = await run(maths, wire(st0, maths), 'Okay, thanks.', [{ text: 'Can you solve 3x + 2 = 11 for me? Great work today, Sam. See you next time!', after: end() }], 17.0);
    check('…a maths question not in a practice ask\'s words ("Can you solve…") is not one of 6g\'s: said, before the goodbye, as before', r1c.r.state.closed && /Can you solve 3x \+ 2 = 11 for me\? Great work today/.test(r1c.heard), r1c.heard);
    check('…and none of 7d: no "questions before the close" facts, nothing recorded, no invitation said', !r1.m.facts.some((x) => /questions before the close/.test(x)) && r1.r.state.closeInvitedAt === undefined && !r1.heard.includes(V2_CLOSE_INVITE_LINE), r1.m.facts[0]?.match(/questions before[^\n]*/));
    s = wire(r1.r.state, maths);
    const r2 = await run(maths, s, 'No, I am good.', [{ text: 'Great work today, Sam. See you next time!', after: end() }], 17.4);
    check('…and the close is accepted in one reply, with its goodbye, as before 7d', r2.r.state.closed && r2.end[0] === 'the session is ending' && /See you next time/.test(r2.heard) && !r2.heard.includes(V2_CLOSE_INVITE_LINE), r2.end);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
