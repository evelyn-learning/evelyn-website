/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7d: the level check counted (LEVEL_CHECK_CAP, v2/level-check-count.ts) and questions before the
 * close (CLOSE_INVITES_QUESTIONS, v2/close-invite.ts). Mic test 1, embed-1794882458629: six tutor turns and five questions
 * in the level check; the summary, the goodbye and end_lesson in one reply with 2.4 minutes left. No network, no model.
 *   npm run test:brain-v2-close-7d
 *
 *  1. F: the count in the facts, as the session ran; a re-ask after "I don't understand" is the same question; one follow-up
 *  2. F: where it applies (a level-check part), the set_working_level gate agrees, the kill switch
 *  3. G: the summary reply invites questions and does not close; the lesson closes on their answer (no / a question / ignored)
 *  4. G: time up, a firm stop, under a minute, student_asked: closed as before; never a loop
 *  5. G: other lessons' closes unchanged (maths voice demo, a typed language lesson, a discussion-free maths plan)
 *  6. G: the next-time line on the reply that closes; the state carried; the kill switches
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CLOSE_INVITES_QUESTIONS, TUTOR_V2_LEVEL_CHECK_CAP } from '../src/lib/tutor/orchestrator/flags';
import { V2_TIME_UP_MIN, renderFacts } from '../src/lib/tutor/v2/facts';
import { v2CountLevelCheck, v2LevelCheckQuestions, v2MatchLevelQuestion } from '../src/lib/tutor/v2/level-check-count';
import { v2AnswerHasContent, v2LevelSetTooEarly, v2WorkingLevelFacts } from '../src/lib/tutor/v2/working-level';
import { V2_CLOSE_INVITE_REFUSAL, V2_CLOSE_INVITE_WAIT, v2CloseInviteOn, v2HardStopNextTime, v2ReplyInvites } from '../src/lib/tutor/v2/close-invite';
import { v2ReadCarried, v2ScopeCarried } from '../src/lib/tutor/v2/state-carry';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
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
const end = (because = 'time_nearly_used') => [{ type: 'tool_use', id: `e${Math.random().toString(36).slice(2, 7)}`, name: 'end_lesson', input: { because, summary: 'x' } }];

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
type H = V2State['history'];
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });

// Mic test 1, 0.0–3.76 min (names taken out).
const T_OPEN = "Hello, Ken. Today we'll talk about your work and the projects you're involved in, and practise two grammar points: the present perfect and the past simple. Does that sound good to you?";
const T_INTRO = "Great. In this lesson you'll answer questions about your job, and I'll correct your mistakes and give you a chance to try again. First, I'll ask you three short questions so I can see how you speak English, and then we'll move on. Are you ready?";
const T_Q1 = "Let's start with a simple question. Can you tell me a little about your job? What do you do?";
const T_Q2 = 'Thank you, Ken. Sales is a useful area to work in. Have you ever worked with an international customer? If so, can you tell me about that experience?';
const T_FOLLOW = 'Canada customers, that sounds interesting. What do you sell to them?';
const T_Q3 = "Washing machines, all over the world. That's a big market. Next question: what is one skill you'd like to improve in your English, and why is it important to you?";
const S = ['Um, okay.', 'Okay.', 'I am sales manager at a big company.', 'Yes, I work with uh Canada customer uh interesting working with customer.', 'Uh sell washing machine to customers all over world.', 'I speak to Western customer. So, English should be good.'];
const session7: H = [a(T_OPEN), u(S[0]!), a(T_INTRO), u(S[1]!), a(T_Q1), u(S[2]!), a(T_Q2), u(S[3]!), a(T_FOLLOW), u(S[4]!), a(T_Q3)];
const st = (history: H, extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), goals: { overview: { status: 'shown', at: 1 } }, history, ...extra });
const levelFacts = (history: H, heard: string | null, cap?: boolean) => v2WorkingLevelFacts(lang, st(history), heard, cap === undefined ? {} : { cap }).join('\n');

// The close: every part before the summary reached, the pronunciation part skipped (so a next-time line is due).
const B = ['Lesson overview', 'Your job', 'Present perfect', 'Past simple', 'Your project'];
const goalsB = { overview: { status: 'shown' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 }, pronunciation: { status: 'skipped' as const, at: 0 } };
const closeState = (extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: B.map((title) => ({ title, items: [] })), current: B.length - 1 }, goals: goalsB, workingLevel: { level: 'intermediate', from: 'this_lesson' }, history: [u('x'), a('Try the whole sentence again, and say "was" clearly.')], ...extra });
// 17.57: the reply as it came, summary page and all.
const T1757 = 'That\'s right: "I was responsible for communicating with our customers." <board page>Summary</board> Before we finish, here is what you did well. You used the past simple correctly for your finished project. Keep working on "I have worked…" for things that started in the past and continue now. Thank you for today\'s lesson, Ken. See you next time!';
const INVITE = 'Do you have any questions before we finish?';
const min = (m: number) => m * 60000;
const run = (session: V2Session, state: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: min(nowMin) }).then((r) => ({ r, heard: heard.join(''), m, end: r.toolCalls.filter((c) => c.name === 'end_lesson').map((c) => c.outcome) }));
};

async function offChild() {
  const capLine = levelFacts(session7, S[5]!);
  const r = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }], 17.57);
  console.log(`OFF_JSON ${JSON.stringify({ flags: [TUTOR_V2_LEVEL_CHECK_CAP, TUTOR_V2_CLOSE_INVITES_QUESTIONS], count: /level check: /.test(capLine), closed: r.r.state.closed, end: r.end, invited: typeof r.r.state.closeInvitedAt === 'number', bye: /See you next time!/.test(r.heard) })}`);
}

async function main() {
  if (process.env.CLOSE_7D_OFF_CHILD === '1') { await offChild(); return; }

  console.log('1. F: the level check counted (mic test 1, 0.8–3.76 min)');
  {
    const qs = v2LevelCheckQuestions(GDI);
    check('the plan\'s three questions are read from its level-check part', qs.length === 3 && /about your job/.test(qs[0]!) && /international customer/.test(qs[1]!) && /improve in your English/.test(qs[2]!), qs);
    check('the tutor\'s replies are told apart: Q1, Q2, Q3 asked in their words; the follow-up and the overview are none of them', v2MatchLevelQuestion(T_Q1, qs, [0, 1, 2]) === 0 && v2MatchLevelQuestion(T_Q2, qs, [1, 2]) === 1 && v2MatchLevelQuestion(T_Q3, qs, [2]) === 2 && v2MatchLevelQuestion(T_FOLLOW, qs, [1, 2]) === -1 && v2MatchLevelQuestion(T_INTRO, qs, [0, 1, 2]) === -1 && v2MatchLevelQuestion(T_OPEN, qs, [0, 1, 2]) === -1);
    const old = levelFacts(session7.slice(0, 9), S[4]!, false);
    check('root cause F: the facts as they stood said "three questions" every turn and counted nothing', /Find it with three short conversational questions/.test(old) && !/level check: \d/.test(old), old);
    check('…and set_working_level was already open there (three answers with content): nothing said so', v2LevelSetTooEarly(st(session7.slice(0, 9)), S[4]!, { enabled: true }) === null);
    const t2 = levelFacts(session7.slice(0, 7), S[3]!);
    check('after Q2\'s answer: "2 of 3 … no follow-up yet (at most one in the whole check)"', /level check: 2 of 3 questions asked and answered, no follow-up yet \(at most one in the whole check/.test(t2), t2);
    const t3 = levelFacts(session7.slice(0, 9), S[4]!);
    check('after the follow-up\'s answer: "2 of 3 …, the one follow-up used: no more follow-ups"', /level check: 2 of 3 questions asked and answered, the one follow-up used: no more follow-ups/.test(t3), t3);
    const t4 = levelFacts(session7, S[5]!);
    check('after Q3\'s answer (where the re-ask came): the check is done; set the level now and move on', /level check: all 3 questions answered, and the one follow-up: the check is done\. Call set_working_level now, in this reply, and move on/.test(t4) && !/Find it with three/.test(t4), t4);
    check('…and the gate on set_working_level agrees (it is open)', v2LevelSetTooEarly(st(session7), S[5]!, { enabled: true }) === null);
    const t0 = levelFacts([a(T_OPEN), u(S[0]!), a(T_INTRO)], S[1]!);
    check('before the first question: 0 of 3 (the overview\'s "Okay." is no answer)', /level check: 0 of 3 questions asked and answered/.test(t0), t0);
    // A confused reply: the re-ask in other words is the same question, and the follow-up is still free.
    const confused: H = [a(T_Q1), u('I am a sales manager.'), a(T_Q2), u("Sorry, I don't understand."), a('No problem. Have you worked with a customer from another country?')];
    const c1 = v2CountLevelCheck(GDI, confused, 'Yes, with a customer in Canada.', v2AnswerHasContent);
    check('"I don\'t understand" then a re-ask in other words: the answer is Q2\'s; no follow-up counted', c1.answered === 2 && !c1.followUp && !c1.done, c1);
    const jp: H = [a(T_Q1), u('I am a sales manager.'), a(T_Q2), u('わかりません'), a('海外のお客さんと仕事をしたことがありますか？')];
    const c2 = v2CountLevelCheck(GDI, jp, 'Yes, Canada customer.', v2AnswerHasContent);
    check('…the same with わかりません and a re-ask in Japanese', c2.answered === 2 && !c2.followUp, c2);
    // A second follow-up counts as a question: the check is bounded at three plus one.
    const two: H = [a(T_Q1), u('I am a sales manager.'), a('What do you sell?'), u('Washing machines.'), a('Who buys them?'), u('Shops in Canada.')];
    const c3 = v2CountLevelCheck(GDI, two, null, v2AnswerHasContent);
    check('a second follow-up\'s answer counts as a question (bounded: three answers plus one follow-up at most)', c3.answered === 2 && c3.followUp, c3);
    const c4 = v2CountLevelCheck(GDI, [...two, a('And where do you live?')], 'In a big city near the sea.', v2AnswerHasContent);
    check('…and after four answers the check is done, whatever the words', c4.done, c4);
    // Fix round 1 (M4): Q1 asked in the model's own words, then Q2 and Q3 in the plan's: the first answer still counts.
    const own: H = [a('Let\'s begin. What kind of work do you do these days?'), u('I am a sales manager.'), a(T_Q2), u('Yes, with customers in Canada.'), a(T_FOLLOW), u('Washing machines.'), a(T_Q3)];
    const c5 = v2CountLevelCheck(GDI, own, 'My speaking, for meetings with customers.', v2AnswerHasContent);
    check('M4: a first question in other words still counts: done after three questions and the follow-up, not five answers', c5.done && c5.followUp, c5);
    check('…and one answer short is not done', !v2CountLevelCheck(GDI, own.slice(0, 5), 'Washing machines.', v2AnswerHasContent).done);
    check('a bare "Yes." to a question is no answer', !v2CountLevelCheck(GDI, [a(T_Q1), u('I am a sales manager.'), a(T_Q2)], 'Yes.', v2AnswerHasContent).followUp && v2CountLevelCheck(GDI, [a(T_Q1), u('I am a sales manager.'), a(T_Q2)], 'Yes.', v2AnswerHasContent).answered === 1);
  }

  console.log('2. F: where it applies; the kill switch');
  {
    const noPart: V2Session = { ...lang, plan: { ...GDI, segments: GDI.segments.filter((x) => x.id !== 'level-check') } as LessonPlan };
    const f = v2WorkingLevelFacts(noPart, st(session7), S[5]!).join('\n');
    check('a plan with no level-check part: no count, the line as before', !/level check: /.test(f) && /Find it with three short conversational questions/.test(f), f);
    const maths: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 8', mode: 'voice', topic: 'Linear equations' };
    check('a lesson without the level check: no working-level lines at all', v2WorkingLevelFacts(maths, st(session7), S[5]!).length === 0);
    check('a level already set: no count', !/level check: /.test(v2WorkingLevelFacts(lang, st(session7, { workingLevel: { level: 'intermediate', from: 'this_lesson' } }), S[5]!).join('\n')));
    const off = levelFacts(session7, S[5]!, false);
    check('the kill switch off: the uncounted line, as before', !/level check: /.test(off) && /Find it with three short conversational questions/.test(off), off);
    const facts = renderFacts(lang, st(session7), { nowMs: min(3.7), heard: S[5]! });
    check('the count reaches the turn\'s facts', /level check: all 3 questions answered/.test(facts));
  }

  console.log('3. G: the summary reply invites questions; the lesson ends on their answer');
  {
    // Root cause G: the close was accepted at 17.57 because the box's last fifth had begun (applyControlTool); section 6's
    // kill-switch run shows the same reply closing as before.
    const r = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }, { text: INVITE }], 17.57);
    check('17.57 (2.4 min left): end_lesson in the summary reply is refused with what to do instead', r.end.length === 1 && r.end[0] === V2_CLOSE_INVITE_REFUSAL && !r.r.state.closed, r.end);
    check('…the refusal is the model\'s next step, not a word for the learner', /^not ended: /.test(V2_CLOSE_INVITE_REFUSAL) && /Say nothing of this message/.test(V2_CLOSE_INVITE_REFUSAL) && /no goodbye/.test(V2_CLOSE_INVITE_REFUSAL));
    check('…the summary is said, the goodbye is not, and the reply ends with the invitation', /here is what you did well/.test(r.heard) && !/See you next time!|Thank you for today's lesson/.test(r.heard) && r.heard.trim().endsWith(INVITE), r.heard);
    check('…nor stored', !/See you next time!/.test(JSON.stringify(r.r.state.history.slice(-4))) && JSON.stringify(r.r.state.history.slice(-4)).includes(INVITE));
    check('…the summary page opened, and the invitation is recorded', r.r.state.board.pages.some((p) => p.title === 'Summary') && typeof r.r.state.closeInvitedAt === 'number');
    check('…no next-time line on the summary reply (it goes on the reply that closes)', !/We didn't get to/.test(r.heard), r.heard);

    // The facts a minute earlier, and in the summary reply's turn.
    const f17 = renderFacts(lang, closeState(), { nowMs: min(17), heard: 'I was responsible.' });
    check('near the close (3 min left): the facts say the summary reply ends with the invitation and does not close', /questions before the close: there is time for their questions, so the reply that gives the summary does not end the lesson: it ends with one question/.test(f17), f17);
    check('…beside the one-question rule (the invitation is that one question)', /at the close: at most one question in a reply/.test(f17));
    check('…not with time for more (8 min left)', !/questions before the close/.test(renderFacts(lang, closeState(), { nowMs: min(12), heard: 'x' })));

    // Their answer: no.
    const invited = r.r.state;
    const no = await run(lang, invited, 'No, thank you.', [{ text: 'All right. Thank you for today\'s lesson, Ken. See you next time!', after: end() }], 18.1);
    check('they say no: the goodbye and the close are accepted', no.r.state.closed && no.end[0] === 'the session is ending' && /See you next time!/.test(no.heard), [no.end, no.heard]);
    check('…the facts said to close on their answer', no.m.facts.some((x) => /you have asked whether they have any questions before you finish\. If they asked one, answer it briefly; then say goodbye and end the lesson/.test(x)));
    check('…and the next-time line comes on this reply, the one that closes', /We didn't get to the pronunciation part today, so that's for next time\./.test(no.heard) && (no.heard.match(/We didn't get to/g) ?? []).length === 1, no.heard);
    // Their answer: a question.
    const q = await run(lang, invited, 'Yes. When do I use "for" and when "since"?', [{ text: 'Good question. We use "for" with a length of time and "since" with a starting point. Thank you for today\'s lesson, Ken. See you next time!', after: end() }], 18.2);
    check('they ask a question: answered, then goodbye; the close is accepted', q.r.state.closed && /"for" with a length of time/.test(q.heard) && /See you next time!/.test(q.heard));
    // Ignored: they talk about something else, and the model closes anyway.
    const ig = await run(lang, invited, 'I have a meeting later today.', [{ text: 'Good luck with your meeting. See you next time!', after: end() }], 18.3);
    check('the invitation ignored: a second end_lesson is accepted (never trapped)', ig.r.state.closed);
    // Answered, and the model goes on talking first: two turns later the close is still not refused.
    const on = await run(lang, invited, 'No.', [{ text: 'Then let me give you one tip: speak slowly.' }], 18.1);
    const later = await run(lang, on.r.state, 'Okay.', [{ text: 'See you next time!', after: end() }], 18.4);
    check('…nor in any later turn', !on.r.state.closed && later.r.state.closed && later.end[0] === 'the session is ending', later.end);

    // The model invites by itself (the facts asked it to): no refusal, no extra model call.
    const own = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: 'That\'s right. Here is a quick summary. <board page>Summary</board> You talked about your work and used the past simple well. Any questions before we finish?' }], 17.57);
    check('the summary reply that invites by itself: not closed, no refusal, the invitation recorded', !own.r.state.closed && !own.end.length && typeof own.r.state.closeInvitedAt === 'number' && own.m.calls() === 1, [own.heard, own.end, own.r.state.closeInvitedAt, own.m.calls()]);
    // Fix round 1 (M3): the invitation's shape only, as the reply's last sentence.
    const yes = [INVITE, 'Any questions before we finish?', 'Do you have any other questions?', 'Okay. Any last questions for me?', 'Is there anything you\'d like to ask?', '何か質問はありますか？', 'ほかに質問はありますか。'];
    const notInvites = ['Can you say it once more?', 'Any questions are welcome.', 'Can you answer a question for me about your project?', 'I have a question for you: what did you sell?', 'Did your customer have any questions about the price?', 'Any questions so far?'];
    check('M3: an invitation is the any-questions shape; a question about their project, a practice ask or a statement is not', yes.every(v2ReplyInvites) && !notInvites.some(v2ReplyInvites), { missed: yes.filter((x) => !v2ReplyInvites(x)), caught: notInvites.filter(v2ReplyInvites) });
    const proj = await run(lang, closeState(), 'I worked on a project.', [{ text: 'Good. Can you answer a question for me about your project?' }], 16.5);
    check('…so "a question for me about your project" at 16.5 records nothing', proj.r.state.closeInvitedAt === undefined);

    // Fix round 1 (I2): a second end_lesson in the same reply ends the turn there, open, on the invitation.
    const stubborn = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }, { text: INVITE, after: end() }, { text: 'never reached' }], 17.57);
    check('I2: a second end_lesson in the same reply: the lesson is not ended, no third model call', !stubborn.r.state.closed && stubborn.end[0] === V2_CLOSE_INVITE_REFUSAL && stubborn.end[1] === V2_CLOSE_INVITE_WAIT && stubborn.m.calls() === 2 && !/never reached/.test(stubborn.heard), [stubborn.end, stubborn.m.calls()]);
    check('…the summary said once, and the invitation is the last sentence said', (stubborn.heard.match(/here is what you did well/g) ?? []).length === 1 && stubborn.heard.trim().endsWith(INVITE) && !/See you next time!/.test(stubborn.heard), stubborn.heard);
    check('…the invitation recorded, so the next turn closes', typeof stubborn.r.state.closeInvitedAt === 'number');
    const after2 = await run(lang, stubborn.r.state, 'No.', [{ text: 'See you next time!', after: end() }], 18.0);
    check('…and it does', after2.r.state.closed && after2.end[0] === 'the session is ending');
    const goodbyeAgain = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }, { text: `${INVITE} See you next time!`, after: end() }], 17.57);
    check('…a goodbye after the invitation in the second call is held back and dropped', !goodbyeAgain.r.state.closed && goodbyeAgain.heard.trim().endsWith(INVITE) && !/See you next time!/.test(JSON.stringify(goodbyeAgain.r.state.history.slice(-4))), goodbyeAgain.heard);

    // Fix round 1 (M9): 6g's t54 shape (a retry ask, the summary page, a thank-you, end_lesson at 16.2) with the invitation owed.
    const t54 = 'The one thing to fix is "have," which is followed by "worked," not "working." Please say this sentence once more. <board sentence>I have worked with international customers.</board><board page>Summary</board> Today you described your job, a project and your experience. Thank you for today\'s lesson, and well done! Keep practising these grammar points.';
    const m9 = await run(lang, closeState(), 'Yes, I have working with the international customer for sometimes.', [{ text: t54, after: end() }, { text: INVITE }], 16.2);
    const stored9 = JSON.stringify(m9.r.state.history.slice(-4));
    check('M9: t54 with the invitation owed: refused, the retry ask dropped (said and stored), nothing of the goodbye stored, ends on the invitation', m9.end[0] === V2_CLOSE_INVITE_REFUSAL && !m9.r.state.closed && !/Please say this sentence once more/.test(m9.heard) && !/Please say this sentence once more/.test(stored9) && !/Thank you for today's lesson|Keep practising these grammar/.test(stored9) && m9.heard.trim().endsWith(INVITE), [m9.heard, stored9]);
  }

  console.log('3b. fix round 1 (I1): the invitation exists only where a close is allowed');
  {
    const SUM12 = 'Good. Before we finish, here is a quick summary. <board page>Summary</board> You used the past simple well. Do you have any questions before we finish?';
    const A = await run(lang, closeState(), 'I worked on a project.', [{ text: SUM12 }], 12);
    check('12 min: a summary ending "any questions before we finish?" records nothing (an ordinary question)', A.r.state.closeInvitedAt === undefined && !A.m.facts.some((x) => /questions before the close/.test(x)));
    const B = await run(lang, A.r.state, 'When do I use "for" and "since"?', [{ text: 'We use "for" with a length of time and "since" with a starting point. Thank you for today\'s lesson, Ken. See you next time!', after: end() }, { text: 'Would you like to stop here, or do you have another question?' }], 13);
    check('13 min, their question: no "end the lesson in this reply" line; the close refused by the rule as it was before this task', !B.m.facts.some((x) => /questions before the close/.test(x)) && B.end.length === 1 && /^not ended: the session goes on\./.test(B.end[0]!) && !B.r.state.closed && B.r.state.closeInvitedAt === undefined, [B.end, B.m.facts[0]?.match(/questions before the close[^\n]*/)]);
    const C = await run(lang, B.r.state, 'No, nothing else.', [{ text: 'All right. See you next time!', after: end() }, { text: 'Would you like to stop here?' }], 14);
    check('14 min, "No, nothing else.": the same as before this task (refused by the clock rule, no 7d line, nothing recorded)', !C.m.facts.some((x) => /questions before the close/.test(x)) && C.end.every((x) => /^not ended: the session goes on\./.test(x)) && C.r.state.closeInvitedAt === undefined, C.end);
    // The same walk at 17 min closes on the answer.
    const A17 = await run(lang, closeState(), 'I worked on a project.', [{ text: SUM12 }], 17);
    check('17 min: the same summary records the invitation', typeof A17.r.state.closeInvitedAt === 'number' && !A17.r.state.closed);
    const B17 = await run(lang, A17.r.state, 'When do I use "for" and "since"?', [{ text: 'We use "for" with a length of time and "since" with a starting point. Thank you for today\'s lesson, Ken. See you next time!', after: end() }], 17.6);
    check('…their question answered, then goodbye: closed on their answer, the facts said so', B17.r.state.closed && B17.end[0] === 'the session is ending' && B17.m.facts.some((x) => /you have asked whether they have any questions before you finish/.test(x)));
    const N17 = await run(lang, A17.r.state, 'No, nothing else.', [{ text: 'All right. See you next time!', after: end() }], 17.6);
    check('…or "No, nothing else.": closed', N17.r.state.closed);
    // A summary begun early (8 min left; 6f tester B T60): as before this task, the page opens and the line is said there.
    const t60 = 'Good work today. Before we finish, here is a quick summary. <board page>Summary</board><board note>You practised the present perfect and the past simple.</board> You used "have worked" well.';
    const e = await run(lang, closeState(), 'My responsibility in sales area is contact for our client.', [{ text: t60 }], 12);
    check('a summary begun early: its page opens and the next-time line is said there, as before', e.r.state.board.pages.some((p) => p.title === 'Summary') && /We didn't get to the pronunciation part today/.test(e.heard) && !e.r.state.closed, e.heard);
  }

  console.log('4. G: time up, a firm stop, under a minute, student_asked: closed in the summary reply as before');
  {
    const tu = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }], 20 - V2_TIME_UP_MIN + 0.05);
    check('time up (≤ 1.5 min left): the summary reply closes; no invitation line in its facts', tu.r.state.closed && /See you next time!/.test(tu.heard) && !tu.m.facts.some((x) => /questions before the close/.test(x)), tu.end);
    const u1 = await run(lang, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }], 19.3);
    check('under a minute left: closed', u1.r.state.closed);
    const stop = await run(lang, closeState(), 'Sorry, I have to finish now.', [{ text: 'Of course. Here is a quick summary: you used the past simple well. Thank you for today\'s lesson, Ken. See you next time!', after: end('student_asked') }], 17.0);
    check('a firm stop with 3 min left: closed at once, the goodbye said', stop.r.state.closed && /See you next time!/.test(stop.heard) && !stop.m.facts.some((x) => /questions before the close: there is time/.test(x)));
    const sa = await run(lang, closeState(), 'I think that is enough for me.', [{ text: 'All right. See you next time!', after: end('student_asked') }], 17.0);
    check('the tutor closes because the student asked (words the stop signal does not know): closed', sa.r.state.closed);
    check('the threshold is the facts\' time-up minute', V2_TIME_UP_MIN === 1.5);
  }

  console.log('5. G: other lessons\' closes unchanged');
  {
    const mathsPlan = { ...GDI, segments: GDI.segments.filter((x) => x.id !== 'level-check') } as LessonPlan;
    const mathsDemo: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 8', mode: 'voice', timeBoxMinutes: 20, plan: mathsPlan };
    const m = await run(mathsDemo, closeState(), 'x = 4', [{ text: 'Right, x = 4. Here is a quick summary: you solved two-step equations. See you next time!', after: end() }], 17.57);
    check('a maths voice lesson (one language) at 17.57: closed in the same reply, as before', m.r.state.closed && m.end[0] === 'the session is ending' && !m.m.facts.some((x) => /questions before the close/.test(x)), m.end);
    const science = await run({ studentName: 'Sam', subject: 'Biology', level: 'Grade 9', mode: 'voice', timeBoxMinutes: 20, topic: 'Cells' }, closeState(), 'Mitochondria.', [{ text: 'Yes. See you next time!', after: end() }], 17.57);
    check('a voice demo with no plan: closed, as before', science.r.state.closed);
    const typed = await run({ ...lang, mode: 'text' }, closeState(), 'I was responsible for communicating with our customers.', [{ text: T1757, after: end() }], 17.57);
    check('a typed language lesson: closed, as before', typed.r.state.closed);
    check('where it applies: spoken, plan-led, second-language (or pronunciation) lessons only', v2CloseInviteOn(lang) && v2CloseInviteOn({ ...lang, languages: undefined, pronunciation: true }) && !v2CloseInviteOn(mathsDemo) && !v2CloseInviteOn({ ...lang, mode: 'text' }) && !v2CloseInviteOn({ ...lang, plan: undefined }) && !v2CloseInviteOn({ ...lang, homework: { statement: 'x' } as unknown as V2Session['homework'] }) && !v2CloseInviteOn(lang, false));
  }

  console.log('6. G: the state carried; the kill switches');
  {
    check('closeInvitedAt is carried, validated and bounded (final review I6: with STATE_CARRY off too)', v2ReadCarried({ closeInvitedAt: 123 }).closeInvitedAt === 123 && v2ReadCarried({ closeInvitedAt: 'x' }).closeInvitedAt === undefined && v2ReadCarried({ closeInvitedAt: -1 }).closeInvitedAt === undefined && v2ReadCarried({ closeInvitedAt: Infinity }).closeInvitedAt === undefined && v2ReadCarried({ closeInvitedAt: 123 }, false).closeInvitedAt === 123);
    const scoped = v2ScopeCarried({ ...newV2State(0), closeInvitedAt: 5 }, { mode: 'text', plan: GDI, languages: ['en', 'ja'] });
    check('…and dropped for a lesson it does not apply to (final review I6: a one-language voice lesson too, or the switch off)', scoped.closeInvitedAt === undefined && v2ScopeCarried({ ...newV2State(0), closeInvitedAt: 5 }, { mode: 'voice', plan: GDI, languages: ['en', 'ja'] }).closeInvitedAt === 5
      && v2ScopeCarried({ ...newV2State(0), closeInvitedAt: 5 }, { mode: 'voice', plan: GDI }).closeInvitedAt === undefined && v2ScopeCarried({ ...newV2State(0), closeInvitedAt: 5 }, { mode: 'voice', plan: GDI, languages: ['en', 'ja'] }, false).closeInvitedAt === undefined);
    // Fix round 1 (M10): the runtime's goodbye at the box carries the next-time line the summary reply left for the close.
    const begun = closeState({ summaryBegunAt: min(17.6), history: [u('x'), a('Here is a quick summary. Any questions before we finish?')] });
    check('M10: the box\'s goodbye gets the line when the summary began and no reply said it', v2HardStopNextTime(lang, GDI, begun) === "We didn't get to the pronunciation part today, so that's for next time.");
    check('…not when a reply already said it, before the summary began, in a maths lesson, or with the flag off', v2HardStopNextTime(lang, GDI, closeState({ summaryBegunAt: 1, history: [a("We didn't get to the pronunciation part today, so that's for next time.")] })) === null && v2HardStopNextTime(lang, GDI, closeState()) === null && v2HardStopNextTime({ mode: 'voice' }, GDI, begun) === null && v2HardStopNextTime(lang, GDI, begun, false) === null);
    const turnsSrc = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    check('…wired into the stop at the box, before its goodbye (the host\'s End speaks nothing: only its transcript line)', /const nextTime = bye \? v2HardStopNextTime\(/.test(turnsSrc) && /const farewell = bye && nextTime \? `\$\{nextTime\} \$\{bye\}` : bye;/.test(turnsSrc));
    check('flags on by default', TUTOR_V2_LEVEL_CHECK_CAP === true && TUTOR_V2_CLOSE_INVITES_QUESTIONS === true);
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_LEVEL_CHECK_CAP: 'off', NEXT_PUBLIC_TUTOR_V2_CLOSE_INVITES_QUESTIONS: 'off', CLOSE_7D_OFF_CHILD: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const off = line ? JSON.parse(line.slice('OFF_JSON '.length)) : null;
    check('both off: no count; the summary reply at 17.57 closes with its goodbye, as before', !!off && off.flags[0] === false && off.flags[1] === false && off.count === false && off.closed === true && off.end[0] === 'the session is ending' && off.invited === false && off.bye === true, off ?? r.stderr);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
