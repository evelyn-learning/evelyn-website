/// <reference types="node" />
// Task 7f: run with NEXT_PUBLIC_TUTOR_V2_TIME_NO_SQUEEZE=off, NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off (package.json): it pins the behaviour
// before Task 7f (the box's last fifth, the fitted part minutes, the stop at the box, part changes with no practice count);
// scripts/test-brain-v2-time-7f.ts covers the switches on, and each one off alone.
/**
 * Tutor brain v2 — Task 7c: one question per reply (ASK_NO_CHECKIN, v2/one-question.ts) and sounds named in words
 * (SPOKEN_SOUNDS, v2/spoken-sounds.ts). Mic test 1 (embed-1794882458629, docs/superpowers/plans/2026-11-17-gdi-v2-mic-test-1-
 * handoff.md D and E). No network, no model.
 *   npm run test:brain-v2-one-question-7c
 *
 *  1. root cause D: the cut at ". " left the ask inside a sentence that begins with a quote; the runtime's check-in
 *  2. whole turns: no check-in after an ask (English, Japanese, after a card), a model check-in after a practice ask dropped
 *     spoken and stored; negatives (no ask, a check-in alone, a content question, a real question, maths and discussion)
 *  3. no offer or part ask after a reply that asks (6e minor M1, the 7a concern); the page stays held, unasked
 *  4. E: the speech text only; fractions, dates, and/or, km/h, URLs untouched; the language-section line
 *  5. kill switches (a fresh process with both flags off): as before
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_SPOKEN_SOUNDS } from '../src/lib/tutor/orchestrator/flags';
import { asksAnywhere } from '../src/lib/tutor/v2/board-timing';
import { v2LanguagesSection } from '../src/lib/tutor/v2/languages';
import { v2HandsOver, v2IsCheckIn, v2ReplyAsks, v2ReplySentences } from '../src/lib/tutor/v2/one-question';
import { V2_PART_ASKS, v2PendingPart } from '../src/lib/tutor/v2/part-flow';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2ReadCarried } from '../src/lib/tutor/v2/state-carry';
import { ReplyGate } from '../src/lib/tutor/v2/reply-gate';
import { v2SpeakSounds } from '../src/lib/tutor/v2/spoken-sounds';
import { V2_CHECK_INS, runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State, type V2ToolCall } from '../src/lib/tutor/v2/types';
import { rewriteForTTS, speakDataRuns, speakLessonNotation, speakNumberPlurals, speakSlashes } from '../src/lib/tutor/voice/tts-pronunciation';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function streaming(text: string): V2ModelCall {
  let n = 0;
  return async (_params, onText) => {
    n += 1;
    if (n > 1) return msg([], 'end_turn');
    for (const piece of text.match(/[\s\S]{1,11}/g) ?? []) onText?.(piece);
    return msg([{ type: 'text', text }], 'end_turn');
  };
}
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lesson: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const maths: V2Session = { studentName: 'Sam', subject: 'Mathematics', level: 'Grade 8', mode: 'voice', topic: 'Linear equations' };

interface Run { spoken: string; stored: string; calls: V2ToolCall[]; state: V2State }
async function turn(session: V2Session, state: V2State, said: string | null, text: string): Promise<Run> {
  const calls: V2ToolCall[] = []; let out = '';
  const r = await runV2Turn({ session, state, studentSaid: said, callModel: streaming(text), nowMs: 120_000, boardPass: false, mathsCheck: false, onToolCall: (c) => calls.push(c), onText: (t) => { out += t; } });
  const h = r.state.history.filter((m) => m.role === 'assistant').pop();
  const stored = !h ? '' : typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
  return { spoken: out, stored, calls, state: r.state };
}
/** Mid-part, after the level check: the present perfect page open. */
const midPart = (): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, goals: { overview: { status: 'shown', at: 1 }, 'topic-intro': { status: 'shown', at: 2 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }], current: 2 }, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Have you ever worked with a customer from another country?' }] });
/** At the conversation, every part but pronunciation taught: the summary page next. */
const conv = (): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, goals: { overview: { status: 'shown', at: 1 }, 'topic-intro': { status: 'shown', at: 2 }, 'present-perfect': { status: 'shown', at: 3 }, 'past-simple': { status: 'shown', at: 4 }, 'open-conversation': { status: 'demonstrated', at: 5 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }, { title: 'Past simple', items: [] }, { title: 'Conversation', items: [] }], current: 4 }, history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: 'What is one project you are proud of?' }] });
const checkIns = (t: string) => V2_CHECK_INS.filter((x) => t.includes(x)).length;

// Mic test 1, the replies as the model wrote them (t≈8.36, t≈9.3, t≈12.6), names of people and firms left out.
const T836 = 'Good, you told me about a real sale. For your experience with Canadian customers, we say "I have worked with Canadian customers." Please say that sentence again.\n\n<board sentence stress="have worked" gloss="ずっと続いている経験は have + 過去分詞">I have worked with Canadian customers.</board>';
const T93 = 'Yes, that\'s right. You\'ve worked with Canadian customers over a period of time, so the present perfect fits.\n\nYou also told me you sold 25 washing machines last month. Because "last month" is a finished time, we use the past simple, so the verb is "sold." Please say it: "I sold twenty-five washing machines last month."';
const T126 = 'Good, you\'re telling me about a finished project, so we use the past simple. You said "I collect money." Please say it with "collected": "I collected money from my office colleagues online."';

async function offChild() {
  const a = await turn(lesson, midPart(), 'Yes, I work with Canada customer, uh, sell 25 washing machine last month.', T836);
  const b = await turn(lesson, midPart(), 'I sold 25 washing machines.', `${T93}\n\nIs that clear, or shall I go over it again?`);
  const c = await turn(lesson, midPart(), 'I sell washing machines.', 'Good. What do you like most about your job?\n<board page>Past simple</board>\nLast month is finished.');
  const m1 = await turn(lesson, conv(), 'I have worked on two projects.', 'Good. What did you learn from the second one?\n<board page>Summary</board>\nToday you practised the present perfect.');
  const plain = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(s)))));
  console.log(`OFF_JSON ${JSON.stringify({ flags: [TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_SPOKEN_SOUNDS], a: checkIns(a.spoken), b: checkIns(b.spoken), bStored: b.stored.includes('Is that clear'), c: V2_PART_ASKS.some((x) => c.spoken.includes(x)), cHeld: c.state.heldPage?.part ?? null, m1: /Before the summary/.test(m1.spoken), line: (v2LanguagesSection(['en', 'ja']) ?? '').includes('name a sound in words'), perSecond: plain('a buzzing /z/ sound, not /s/.') })}`);
}

async function main() {
  if (process.env.ONE_QUESTION_OFF_CHILD === '1') { await offChild(); return; }

  console.log('1. root cause D: the old cut, and the runtime\'s check-in');
  {
    const said = T836.replace(/\n\n<board[\s\S]*$/, '');
    const old = said.split(/(?<=[.?!])\s+/);
    check('the old cut leaves "Please say that sentence again." inside a sentence that begins with the quote; asksAnywhere misses it', old.length === 2 && /^For your experience[\s\S]*Please say that sentence again\.$/.test(old[1]!) && !asksAnywhere(old), old);
    check('…the same at t≈9.3 and t≈12.6', [T93, T126].every((x) => !asksAnywhere(x.split(/(?<=[.?!])\s+/))));
    check('the cut after a closing quote: the ask is its own sentence', v2ReplySentences(said).pop() === 'Please say that sentence again.');
    check('all three replies ask', [said, T93, T126].every(v2ReplyAsks));
  }

  console.log('2. no check-in after an ask; a model check-in after a practice ask dropped');
  {
    const a = await turn(lesson, midPart(), 'Yes, I work with Canada customer, uh, sell 25 washing machine last month.', T836);
    check('t≈8.36: no "Does that make sense so far?" after "Please say that sentence again." + card (spoken and stored)', checkIns(a.spoken) === 0 && checkIns(a.stored) === 0 && /Please say that sentence again\./.test(a.spoken), a.spoken);
    const b = await turn(lesson, midPart(), 'I sold 25 washing machines.', T93);
    check('t≈9.3: no check-in after "Please say it: "…""', checkIns(b.spoken) === 0, b.spoken);
    const c = await turn(lesson, midPart(), 'I collect money from my colleagues.', T126);
    check('t≈12.6: no check-in after "Please say it with "collected": "…""', checkIns(c.spoken) === 0, c.spoken);
    const d = await turn(lesson, midPart(), 'I sold 25 washing machines.', `${T93}\n\nIs that clear, or shall I go over it again?`);
    check('the model\'s own trailing check-in after a practice ask: not said, not stored; the ask still is', !/Is that clear/.test(d.spoken) && !/Is that clear/.test(d.stored) && /Please say it: "I sold/.test(d.spoken) && /Please say it: "I sold/.test(d.stored), { spoken: d.spoken, stored: d.stored });
    const e = await turn(lesson, midPart(), 'I have worked with Canadian customers.', 'いいですね。「I have worked with Canadian customers.」をもう一度言ってみてください。\n\nわかりましたか？');
    check('Japanese: 「…もう一度言ってみてください。」 then 「わかりましたか？」: the check-in dropped, none added', !/わかりましたか/.test(e.spoken) && !/わかりましたか/.test(e.stored) && checkIns(e.spoken) === 0 && /言ってみてください/.test(e.spoken), e.spoken);
    for (const ask of ['Now you try it.', 'Try the whole sentence again.', 'Tell me about your last project.', 'Give me one more example.', 'Repeat after me: I have worked here for five years.', 'Your turn.']) {
      const r = await turn(lesson, midPart(), 'Okay.', `Good. ${ask}\n\nDoes that make sense so far?`);
      check(`"${ask}" + "Does that make sense so far?": the check-in dropped, none added`, checkIns(r.spoken) === 0 && checkIns(r.stored) === 0 && r.spoken.includes(ask.split(':')[0]!), r.spoken);
    }
    // Negatives.
    const n1 = await turn(lesson, midPart(), 'I have worked here five years.', 'Good. The present perfect joins the past to now.');
    check('a reply that asks nothing still gets the check-in (as before)', checkIns(n1.spoken) === 1 && checkIns(n1.stored) === 1, n1.spoken);
    const n2 = await turn(lesson, midPart(), 'Okay.', 'The present perfect joins the past to now. Does that make sense so far?');
    check('a check-in that is the reply\'s only question stays', /Does that make sense so far\?$/.test(n2.spoken.trim()) && checkIns(n2.spoken) === 1, n2.spoken);
    const n3 = await turn(lesson, midPart(), 'Okay.', 'Please say it again: "I have worked here for five years." Does it make sense to use the past simple here?');
    check('a content question after a practice ask is no check-in: kept', /Does it make sense to use the past simple here\?/.test(n3.spoken) && /Does it make sense to use the past simple/.test(n3.stored), n3.spoken);
    const n4 = await turn(lesson, midPart(), 'Okay.', 'Please say it again. What did you do last week?');
    check('a real question after a practice ask is kept', /What did you do last week\?/.test(n4.spoken), n4.spoken);
    check('advice for later is no hand-over ("Try to say it this way next time.")', !v2HandsOver('Try to say it this way next time.') && v2HandsOver('Please say that sentence again.') && v2HandsOver('もう一度、ゆっくり言ってください。'));
    check('the check-in shape: whole sentences only', ['Does that make sense so far?', 'Is that clear, or shall I go over it again?', 'Are you with me so far?', 'Does that make sense?', 'Any questions so far?', 'わかりましたか？'].every(v2IsCheckIn) && !['Does it make sense to use the past simple here?', 'Is that clear to your customers?', 'Any questions first, or shall we go on?', 'What did you do last week?'].some(v2IsCheckIn));
    // Other tenants: a maths voice lesson keeps its check-in after a statement, and loses only a doubled one.
    const m1 = await turn(maths, newV2State(0), 'I got x = 3.', 'Yes, x = 3 is right, because 2 times 3 plus 1 is 7.');
    check('maths voice demo: a statement-only reply still gets the check-in', checkIns(m1.spoken) === 1, m1.spoken);
    const m2 = await turn(maths, newV2State(0), 'I got x = 3.', 'Yes. Now try 2x + 5 = 11.');
    check('maths voice demo: a reply ending on "Now try …" gets none (as before)', checkIns(m2.spoken) === 0, m2.spoken);
    // The gate on its own: off unless asked for.
    const out: string[] = []; const g = new ReplyGate((t) => out.push(t), { dropFrame: false, holdGoodbye: false });
    g.push('Please say it again. Does that make sense so far? '); g.flush();
    check('the gate without dropCheckIn passes the check-in (typed lessons, homework, discussions)', out.join('').includes('Does that make sense so far?'));
    const out2: string[] = []; const g2 = new ReplyGate((t) => out2.push(t), { dropFrame: false, holdGoodbye: true, dropCheckIn: true });
    g2.push('Does that make sense so far? Please say it again. '); g2.flush(); g2.dropTrailingCheckIn();
    check('…with it, a check-in before the ask stays (only one after an ask goes)', out2.join('').includes('Does that make sense so far?') && g2.removed.length === 0);
    // Fix round 1, M3: dropCheckIn alone does not make the gate cut: the stream goes out in the pieces it came in.
    const pieces = ['Please say', ' it again. Does th', 'at make sense so far? '];
    const out3: string[] = []; const g3 = new ReplyGate((t) => out3.push(t), { dropFrame: false, holdGoodbye: false, dropCheckIn: true });
    for (const x of pieces) g3.push(x);
    g3.flush(); g3.dropTrailingCheckIn();
    check('M3: dropCheckIn alone leaves the stream as it came (piece for piece; nothing dropped)', JSON.stringify(out3) === JSON.stringify(pieces) && g3.removed.length === 0, out3);

    console.log('2b. fix round 1 (I1): a hand-over counts only as the reply\'s last sentence');
    const notAsks = ['Say we have 5 apples.', 'Say you earn 10 dollars an hour.', 'Try not to worry.', 'Try thinking of it as a ramp.', 'Give me a second to draw it.', 'Tell me if you need a break.', 'Go ahead and imagine a ball rolling.', 'Say that the line is steep.', 'Try to remember the rule.'];
    for (const x of notAsks) check(`not an ask even last: "${x}"`, !v2HandsOver(x));
    const sci: V2Session = { studentName: 'Sam', subject: 'Science', level: 'Grade 7', mode: 'voice', topic: 'Forces' };
    const p1 = await turn(maths, newV2State(0), 'What is subtraction?', 'Say you have 5 apples and eat 2. Then 3 are left. Subtraction takes away. Does that make sense?');
    check('maths: the model\'s own check-in after a hypothetical "Say…" is kept (the reply\'s only question)', /Subtraction takes away\.\s*Does that make sense\?\s*$/.test(p1.spoken) && /Does that make sense\?/.test(p1.stored), p1.spoken);
    const p2 = await turn(maths, newV2State(0), 'ok', 'Try thinking of the slope as steepness. A slope of 2 rises 2 for each 1 across. That is the key idea.');
    check('maths: a statement reply that opens "Try thinking…" still gets the runtime\'s check-in', checkIns(p2.spoken) === 1, p2.spoken);
    const p3 = await turn(sci, newV2State(0), 'Why does it speed up?', 'Say a ball rolls down a ramp. Gravity pulls it down the slope, so it speeds up. Does that make sense so far?');
    check('science: the model\'s check-in after a scene-setting "Say…" is kept', /speeds up\.\s*Does that make sense so far\?\s*$/.test(p3.spoken), p3.spoken);
    const p4 = await turn(sci, newV2State(0), 'ok', 'Give me a second to draw it. Gravity pulls the ball down. Friction slows it.');
    check('science: "Give me a second…" earlier in a statement reply: the check-in still comes', checkIns(p4.spoken) === 1, p4.spoken);
    const p5 = await turn(lesson, midPart(), 'Okay.', 'Please say it again. Then we will look at the next sentence. That is the plan.');
    check('an ask earlier in the reply, statements after it: the check-in comes (the ask is not where the reply ends)', checkIns(p5.spoken) === 1, p5.spoken);
    const p6 = await turn(lesson, midPart(), 'Okay.', 'Please say it again. Does that make sense so far? Then we will go on to the next one.');
    check('a check-in after the ask with more words after it: said where it stands (not trailing)', /again\.\s*Does that make sense so far\?\s*Then we will go on/.test(p6.spoken) && /Does that make sense so far\?/.test(p6.stored), p6.spoken);
    const p7 = await turn(lesson, midPart(), 'Yes, I work with Canada customer, uh, sell 25 washing machine last month.', `${T836}\n\nDoes that make sense so far?`);
    check('t≈8.36 as the model might write it: ask, card, check-in: the check-in dropped (the card between does not count)', checkIns(p7.spoken) === 0 && checkIns(p7.stored) === 0 && /Please say that sentence again\./.test(p7.spoken), p7.spoken);
  }

  console.log('3. no offer or part ask after a reply that asks');
  {
    // The 7a concern: the model's own question, then a page for the next part: held, no part ask after the question.
    const c = await turn(lesson, midPart(), 'I have worked with Canadian customers.', 'Good. What do you like most about working with them?\n<board page>Past simple</board>\nLast month is finished, so we say "sold".');
    const held = c.calls.find((x) => x.name === 'new_page');
    check('the page is held (not opened) and nothing after it is said', !!held && /not opened yet/.test(held.outcome) && c.state.board.pages[c.state.board.current]?.title === 'Present perfect' && !/Last month/.test(c.spoken), c.calls.map((x) => x.outcome));
    check('…no part ask after the model\'s question: one question in the reply', !V2_PART_ASKS.some((x) => c.spoken.includes(x)) && /working with them\?\s*$/.test(c.spoken) && checkIns(c.spoken) === 0, c.spoken);
    check('…the page waits marked unasked, and the outcome does not claim they were asked', c.state.heldPage?.part === 'past-simple' && c.state.heldPage.unasked === true && /held until they are asked/.test(held?.outcome ?? ''), { held: c.state.heldPage, outcome: held?.outcome });
    const c2 = await turn(lesson, midPart(), 'I have worked with Canadian customers.', 'Good. Please say it once more.\n<board page>Past simple</board>\nLast month is finished.');
    check('a practice ask before the page: the same', !V2_PART_ASKS.some((x) => c2.spoken.includes(x)) && /once more\.\s*$/.test(c2.spoken) && c2.state.heldPage?.unasked === true, c2.spoken);
    // Fix round 1 (I2): the part change owed is asked on the next reply, and a yes then opens the page.
    check('I2: a yes to the other question opens nothing (an unasked page is not agreed)', v2PendingPart(GDI, c.state, 'Good. What do you like most about working with them?', 'Yes.') === null);
    const facts2 = renderFacts(lesson, c.state, { nowMs: 130_000, heard: 'x' });
    check('I2: next turn, the facts say the part change is owed and to ask, naming it', /part change owed: the "Past simple" page is waiting, and they have not been asked yet/.test(facts2) && /go on to past simple/.test(facts2), facts2.split('\n').filter((l) => /part change/.test(l)));
    const t2 = await turn(lesson, c.state, 'I like their kindness.', 'That is lovely. Kindness matters a lot with customers.');
    check('I2 turn 2: a reply that asks nothing ends with the part ask naming past simple; the page now waits for a yes', V2_PART_ASKS.some((x) => t2.spoken.includes(x)) && /past simple/i.test(t2.spoken) && t2.state.heldPage?.part === 'past-simple' && !t2.state.heldPage.unasked && checkIns(t2.spoken) === 0 && V2_PART_ASKS.some((x) => t2.stored.includes(x)), { spoken: t2.spoken, held: t2.state.heldPage });
    const t3 = await turn(lesson, t2.state, 'Yes.', 'Great. Last month is a finished time, so we say "sold".');
    check('I2 turn 3: "Yes." opens the Past simple page', t3.state.board.pages[t3.state.board.current]?.title === 'Past simple' && t3.calls[0]?.agreed === true && !t3.state.heldPage, { open: t3.state.board.pages[t3.state.board.current]?.title, calls: t3.calls.map((x) => x.name) });
    const t2b = await turn(lesson, c.state, 'I like their kindness.', 'That is lovely. Have you ever visited Canada?');
    check('I2: a turn-2 reply that asks something else gets no part ask; the change stays owed', !V2_PART_ASKS.some((x) => t2b.spoken.includes(x)) && t2b.state.heldPage?.unasked === true, { spoken: t2b.spoken, held: t2b.state.heldPage });
    const t2c = await turn(lesson, c.state, 'I like their kindness.', 'That is lovely. Next is the past simple. Ready to go on, or would you like to ask something first?');
    check('I2: the reply asks the part change itself: the page waits for a yes, nothing added', !t2c.spoken.includes('\n\n') && t2c.state.heldPage?.part === 'past-simple' && !t2c.state.heldPage.unasked, { spoken: t2c.spoken, held: t2c.state.heldPage });
    check('I2: the route keeps the marker (state carry), and drops a bad one', v2ReadCarried({ heldPage: { title: 'Past simple', part: 'past-simple', at: 2, unasked: true } }).heldPage?.unasked === true && v2ReadCarried({ heldPage: { title: 'Past simple', part: 'past-simple', at: 2, unasked: 'yes' } }).heldPage?.unasked === undefined);
    const c3 = await turn(lesson, midPart(), 'I have worked with Canadian customers.', 'Good, that is right.\n<board page>Past simple</board>\nLast month is finished.');
    check('a reply that asks nothing: the part ask comes as before, and the page waits', V2_PART_ASKS.some((x) => c3.spoken.includes(x)) && c3.state.heldPage?.part === 'past-simple', c3.spoken);
    const c4 = await turn(lesson, midPart(), 'I have worked with Canadian customers.', 'Why the present perfect? Because the time runs up to now. That is right.\n<board page>Past simple</board>\nLast month is finished.');
    check('a question further back (rhetorical) does not stop the part ask: it would be the reply\'s only real question', V2_PART_ASKS.some((x) => c4.spoken.includes(x)) && c4.state.heldPage?.part === 'past-simple', c4.spoken);
    // 6e minor M1: the offer of a part not reached, at a held summary page.
    const s1 = await turn(lesson, conv(), 'I have worked on two projects.', 'Good. Please say it once more: "I have worked on two projects."\n<board page>Summary</board>\nToday you practised the present perfect.');
    check('M1: a held summary page after a practice ask: no "Before the summary, there is still…" after it', /not opened yet/.test(s1.calls.find((x) => x.name === 'new_page')?.outcome ?? '') && !/Before the summary/.test(s1.spoken) && !/Before the summary/.test(s1.stored), s1.spoken);
    const s3 = await turn(lesson, conv(), 'I have worked on two projects.', 'Good. What did you learn from the second one?\n<board page>Summary</board>\nToday you practised the present perfect.');
    check('M1: …after a question the reply ends on, the same (the offer was appended after it before)', /What did you learn from the second one\?\s*$/.test(s3.spoken) && !/Before the summary/.test(s3.spoken), s3.spoken);
    const s2 = await turn(lesson, conv(), 'I have worked on two projects.', 'Good, that is right.\n<board page>Summary</board>\nToday you practised the present perfect.');
    check('M1 negative: a reply that asks nothing still gets the offer', /Before the summary, there is still/.test(s2.spoken), s2.spoken);
    // The runtime's replacement ask after a dropped repeat is not added to a reply that still asks.
    const said = 'Shall we go on, or do you have a question first?';
    const base = (): V2State => ({ ...newV2State(0), workingLevel: { level: 'intermediate', from: 'this_lesson' }, goals: { overview: { status: 'shown', at: 1 } }, board: { pages: [{ title: 'Lesson overview', items: [] }, { title: 'Your job', items: [] }], current: 1 }, history: [{ role: 'user', content: 'x' }, { role: 'assistant', content: `Next is your job. ${said}` }] });
    const r1 = await turn(lesson, base(), 'I sell washing machines.', `Good. Please say it once more: "I sell washing machines." ${said}`);
    check('a repeated ask dropped after a practice ask: no replacement ask, no held page', !V2_PART_ASKS.some((x) => r1.spoken.includes(x)) && !r1.state.heldPage && /once more: "I sell washing machines\."/.test(r1.spoken), r1.spoken);
    const r2 = await turn(lesson, base(), 'I sell washing machines.', `Good. Next is present perfect. ${said}`);
    check('…with nothing else asked, the replacement ask comes and its part waits as a held page', V2_PART_ASKS.some((x) => r2.spoken.includes(x) && x !== said) && r2.state.heldPage?.part === 'present-perfect', { spoken: r2.spoken, held: r2.state.heldPage });
  }

  console.log('4. E: sounds named in words, in the speech text only');
  {
    const plain = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(v2SpeakSounds(s))))));
    const before = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(s)))));
    const T1642 = 'The ending of "was" is a buzzing /z/ sound, not /s/.';
    check('root cause E: the chain as it stood read "/s/" as "per second"', /per second/.test(before(T1642)), before(T1642));
    check('t≈16.42: "a buzzing z sound, not the s sound"', v2SpeakSounds(T1642) === 'The ending of "was" is a buzzing z sound, not the s sound.' && !/[/]|per second|slash/.test(plain(T1642)), [v2SpeakSounds(T1642), plain(T1642)]);
    const cases: Array<[string, string]> = [
      ['Say /θ/ with your tongue out.', 'Say the th sound with your tongue out.'],
      ['the /ʃ/ in "she"', 'the sh sound in "she"'],
      ['the sound /tʃ/ is in "chair".', 'the sound ch is in "chair".'],
      ['a long /iː/ sound', 'a long ee sound'],
      ['the [z] sound', 'the z sound'],
      ['the /ɜː/ sound in "bird"', 'the er sound in "bird"'],
      ['the /ʊə/ vowel', 'the oor vowel'],
      ['the /ɘ/ vowel', 'the vowel'],
      ['Say /ɘ/ now.', 'Say this sound now.'],
      ['Listen: [θ] and [ð].', 'Listen: the th sound and the voiced th sound.'],
      ['「/z/」の音です。', '「z」の音です。'],
      ['/r/ and /l/ are different.', 'the r sound and the l sound are different.'],
      // Task 7d (7c re-review): a plain letter between slashes is ambiguous between IPA and phonics: spoken as the letter.
      ['/i/ as in sit', 'the i sound as in sit'],
      ['/j/ as in jam', 'the j sound as in jam'],
      ['/x/ in box', 'the x sound in box'],
      ['/u/ as in cup', 'the u sound as in cup'],
      ['/o/ as in hot', 'the o sound as in hot'],
      ['the /ʌ/ sound in "cup"', 'the uh sound in "cup"'],
    ];
    for (const [x, want] of cases) check(`"${x}" → "${want}"`, v2SpeakSounds(x) === want, v2SpeakSounds(x));
    const untouched = ['Three quarters is 3/4 of it.', 'The meeting is on 11/16/2026.', 'Bring your passport and/or your ID.', 'We drove at 60 km/h.', 'See https://example.com/a/b/ for more.', 'Open /usr/local/bin now.', 'He wrote [sic] in the letter.', 'The concentration [OH] matters.', '[a]nd so on', 'either/or', 'A/B testing', 'w/o sugar', 'The ratio 1/2/3.', 'Type /help/ for help.', 'Choose [a] or [b].', 'It is [z], not [s].'];
    for (const x of untouched) check(`untouched: "${x}"`, v2SpeakSounds(x) === x, v2SpeakSounds(x));
    const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('only the voice\'s text: the plain-speech transform applies it (behind the flag); the board, the caption and the stored reply never see it', /plainSpeech = useCallback\(\(sentence: string, rewrite[^\n]*TUTOR_V2_SPOKEN_SOUNDS \? v2SpeakSounds\(sentence\) : sentence/.test(src) && (src.match(/v2SpeakSounds\(/g) ?? []).length === 1);
    const turnSrc = readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'v2', 'turn.ts'), 'utf8');
    check('…the turn (board and stored reply) does not use it', !/spoken-sounds|v2SpeakSounds/.test(turnSrc));
    const st = await turn(lesson, midPart(), 'I responsible.', `${T1642} Try the whole sentence again.\n<board note style="highlight">was: the ending is a buzzing /z/ sound, not /s/.</board>`);
    check('…a reply with "/z/": stored and on the board as written', st.stored.includes('buzzing /z/ sound, not /s/.') && st.state.board.pages.some((p) => p.items.some((i) => i.summary.includes('/z/'))), st.stored);
    const sec = v2LanguagesSection(['en', 'ja']) ?? '';
    check('the second-language section says to name a sound in words (spoken lessons)', /In speech, name a sound in words/.test(sec) && !/name a sound in words/.test(v2LanguagesSection(['en', 'ja'], 'text') ?? '') && !/name a sound in words/.test(v2LanguagesSection(['en', 'ja'], 'voice', { spokenSounds: false }) ?? ''));
    check('…not in the shared constitution', !/name a sound in words/.test(readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'v2', 'constitution.ts'), 'utf8')));
  }

  console.log('5. kill switches');
  {
    check('flags on by default', TUTOR_V2_ASK_NO_CHECKIN === true && TUTOR_V2_SPOKEN_SOUNDS === true);
    const r = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, NEXT_PUBLIC_TUTOR_V2_ASK_NO_CHECKIN: 'off', NEXT_PUBLIC_TUTOR_V2_SPOKEN_SOUNDS: 'off', ONE_QUESTION_OFF_CHILD: '1' }, encoding: 'utf8' });
    const line = (r.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    const off = line ? JSON.parse(line.slice('OFF_JSON '.length)) : null;
    check('both off: the check-in after "Please say that sentence again." comes back; the model\'s check-in is kept; the part ask and the offer follow the model\'s question; no prompt line', !!off && off.flags[0] === false && off.flags[1] === false && off.a === 1 && off.b === 1 && off.bStored === true && off.c === true && off.cHeld === 'past-simple' && off.m1 === true && off.line === false, off ?? r.stderr);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
