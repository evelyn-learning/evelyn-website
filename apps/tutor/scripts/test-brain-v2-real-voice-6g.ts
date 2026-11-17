/// <reference types="node" />
/**
 * Tutor brain v2 — Task 6g: the runtime gaps of real-voice replay #4 (docs/superpowers/plans/gdi-v2-baseline/v2audio-6f/
 * RESULTS.md, b42428f7). No network, no model.
 *   npm run test:brain-v2-real-voice-6g
 *
 *  1. the part-change frame in Japanese is dropped and counted like the English one (tester A T40)
 *  2. an optional part offered and not taken up is offered at most once more (tester A: four offers in nine turns)
 *  3. a lesson that skips an optional part names it at the close (tester B: neither offered nor named)
 *  4. once the summary has begun, no new practice ask or offer (gdi-real-james T50–T54; tester B's last reply)
 *  5. set_working_level is described as called after the words (the slow first frame: two model calls)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { ReplyGate, V2_PART_FRAME, isGoodbye, isPartFrame } from '../src/lib/tutor/v2/reply-gate';
import { mayOpenPart, v2FrameDue } from '../src/lib/tutor/v2/part-close';
import { V2_MAX_PART_OFFERS, v2MissedAtClose, v2NextTimeLine, v2OfferedOut, v2PartOfferFacts, v2PartOffers, v2PassedPartFact, v2UnreachedAtCloseFact, v2UnreachedOffer } from '../src/lib/tutor/v2/plan-map';
import { renderFacts, v2SummaryBegun } from '../src/lib/tutor/v2/facts';
import { v2IsPracticeAsk } from '../src/lib/tutor/v2/languages';
import { V2_SET_WORKING_LEVEL_TOOL } from '../src/lib/tutor/v2/working-level';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import {
  TUTOR_V2_CLOSE_ONE_QUESTION, TUTOR_V2_LEVEL_WITH_WORDS, TUTOR_V2_PART_OFFER_ONCE, TUTOR_V2_PASSED_PART_CLOSE,
} from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces; extra content blocks (tool calls) after the text. Records the facts each call saw. */
function streaming(text: string, after: unknown[] = []) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn'); };
  return { call, seen };
}
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'] };
const pagesAt = (titles: string[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: titles.map((title) => ({ title, items: [] })), current: titles.length - 1 }, ...extra });
const level = { workingLevel: { level: 'intermediate', from: 'this_lesson' } } as Partial<V2State>;
const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
const goalsB = { overview: { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 } };
type H = V2State['history'];
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });

async function main() {
  console.log('1. the frame in Japanese (tester A T40: 「次に進みますか、それとも先に質問がありますか？」)');
  {
    const T40 = '次に進みますか、それとも先に質問がありますか？';
    check('root cause: the English matcher misses it', !V2_PART_FRAME.test(T40));
    check('now a frame: go-on asks and the question check with it', isPartFrame(T40) && isPartFrame('現在完了に進んでもいいですか。') && isPartFrame('先に進みましょうか？') && isPartFrame('過去形に進む前に、何か質問はありますか？'));
    check('not a frame: a check-in alone, a question about their work, a statement', !isPartFrame('質問はありますか？') && !isPartFrame('仕事は順調に進みますか？') && !isPartFrame('次は過去形です。') && !isPartFrame('では、次に進みましょう。'));
    check('the kill switch off: the English matcher only', !isPartFrame(T40, false) && isPartFrame('Shall we go on?', false));
    // The gate drops it where it stands, when the frame is not due.
    const out: string[] = [];
    const g = new ReplyGate((t) => out.push(t), { dropFrame: true, holdGoodbye: false });
    g.push('経理の仕事の年数は、こう言います。現在完了は、ここまでです。次は過去形で、終わった出来事を話すときに使います。'); g.push(T40); g.flush();
    check('the gate drops it, the rest goes out', !out.join('').includes('次に進みますか') && out.join('').includes('次は過去形で') && g.removed.includes(T40), out.join(''));
    // Tester A's history: the runtime's English frame at the job → present perfect change, then the Japanese one.
    const hist: H = [u('hi'), a('<board page>Your job</board> What do you do?'), u('I work in accounting.'),
      a('その文は正しいです。 Next is present perfect. Shall we go on, or do you have a question first?'), u('Yes.'),
      a('<board page>Present perfect</board> では、現在完了に進みましょう。'), u('I have worked here for ten years.'),
      a(`I have done accounting for five years. 現在完了は、ここまでです。次は過去形です。${T40}`)];
    check('counted: a frame waiting for its page, so not due', !v2FrameDue(hist));
    const after: H = [...hist, u('Please move on to the past simple.'), a('<board page>Past simple</board> 過去形は…'), u('ok'), a('Good.')];
    check('…and once its page opened, two frames are spent: not due at the next change either', !v2FrameDue(after));
    check('a Japanese frame answered opens the page (no second ask)', mayOpenPart({ title: 'Past simple', studentSaid: 'はい', lastTutor: `現在完了は、ここまでです。${T40}`, pagesOpen: 4 }));
    // The whole turn: the frame is not due, and the model writes it in Japanese.
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check', 'Your job', 'Present perfect'], { history: hist.slice(0, 7), goals: { overview: { status: 'shown', at: 0 } }, ...level }), studentSaid: 'Yes.', callModel: streaming(`経理の仕事の年数は、こう言います。現在完了は、ここまでです。${T40}`).call, boardPass: false, mathsCheck: false, nowMs: 9 * 60000 });
    check('in a whole turn: not said, not stored', !r.spoken.includes('次に進みますか') && !JSON.stringify(r.state.history.slice(-1)).includes('次に進みますか'), r.spoken);
    check('the kill switch is on by default', TUTOR_V2_PART_OFFER_ONCE === true);
  }

  console.log('2. an optional part offered and not taken up: at most once more (tester A T58, T68, T72, T74)');
  {
    const pron = GDI.segments.find((s) => s.id === 'pronunciation')!;
    const offers: H = [u('hi'), a('Hello! At the end, you can practise pronunciation. Does that sound good to you?'), u('Yes.'),
      a('The correct sentence is: I successfully finished. Would you like to practise your pronunciation next, or keep talking about your work?'), u('Could you give me some more examples?'),
      a('先月の仕事を一文で言うか、発音の練習をするか、どちらにしますか？'), u('No, I have not.')];
    check('two offers counted, in English and Japanese; the overview\'s "Does that sound good?" is none', v2PartOffers(pron, offers) === 2, v2PartOffers(pron, offers));
    check('the runtime\'s own offer counts (its ask names the part the sentence before)', v2PartOffers(pron, [a('Before the summary, there is still the pronunciation part. Would you like to do it now, or go straight to the summary?')]) === 1);
    const st = pagesAt(B, { goals: goalsB, ...level, history: offers });
    const facts = v2PartOfferFacts(GDI, st);
    check(`offered ${V2_MAX_PART_OFFERS} times: not again, named as next time`, facts.length === 1 && /offered 2 times and not taken up: do not offer it again; name it in your summary/.test(facts[0]!), facts);
    check('offered once: at most once more', /offered once and not taken up: offer it at most once more/.test(v2PartOfferFacts(GDI, pagesAt(B, { goals: goalsB, ...level, history: offers.slice(0, 5) }))[0] ?? ''));
    check('offered out: the held summary page\'s offer, and the near and passed facts, leave it out', v2OfferedOut(GDI, st).has('pronunciation') && v2UnreachedOffer(GDI, st) === null && v2UnreachedAtCloseFact(GDI, st, 'near').length === 0 && v2PassedPartFact(GDI, pagesAt([...B, 'Summary'], { goals: goalsB, ...level, history: offers }), false).length === 0);
    check('…but without the offers it is still offered, as before', v2UnreachedOffer(GDI, pagesAt(B, { goals: goalsB, ...level })) !== null);
    check('taken up (its page is up): nothing', v2PartOfferFacts(GDI, pagesAt([...B, 'Pronunciation'], { goals: goalsB, ...level, history: offers })).length === 0);
    check('in the facts', renderFacts({ ...lang, plan: GDI }, st, { nowMs: 14 * 60000 }).includes('do not offer it again'));
    check('the kill switch off: no line, nothing left out', v2PartOfferFacts(GDI, st, false).length === 0 && v2OfferedOut(GDI, st, false).size === 0);
  }

  console.log('3. a lesson that skips an optional part names it at the close (tester B T54)');
  {
    check('root cause: "Thank you for today\'s lesson, and well done!" was no goodbye to the gate; now it is', isGoodbye("Thank you for today's lesson, and well done!") && !isGoodbye("Thank you for today's lesson, and well done!", false));
    check('thanks for an answer or a try is not', !isGoodbye('Thanks for trying.') && !isGoodbye('Thank you for explaining your role.') && !isGoodbye('Thank you, that explains it clearly.'));
    const skipped = pagesAt(B, { goals: { ...goalsB, pronunciation: { status: 'skipped', at: 0 } }, ...level });
    check('a part marked skipped is still missed at the close (it counted as reached before)', v2MissedAtClose(GDI, skipped).map((s) => s.id).join() === 'pronunciation' && v2MissedAtClose(GDI, skipped, false).length === 0);
    check('…and the goodbye line names it', v2NextTimeLine(GDI, skipped, 'Today you described your job.') === "We didn't get to the pronunciation part today, so that's for next time.");
    // The last reply, as tester B heard it: a retry ask, the summary page (held until the reply is complete: last fifth),
    // the summary and a thank-you, with end_lesson and the part marked skipped.
    const t54 = 'The one thing to fix is "have," which is followed by "worked," not "working." Please say this sentence once more. <board sentence>I have worked with international customers.</board><board page>Summary</board> Today you described your job, a project and your experience. Thank you for today\'s lesson, and well done! Keep practising these grammar points.';
    const after = [{ type: 'tool_use', id: 'g1', name: 'set_goal_status', input: { goal: 'pronunciation', status: 'skipped' } }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'x' } }];
    const heard: string[] = [];
    const hist: H = [u('hi'), a('Your meaning is clear. The one thing to fix is "have to use". Can you say that sentence once more?')];
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(B, { goals: goalsB, ...level, history: hist }), studentSaid: 'Yes, I have working with the international customer for sometimes.', callModel: streaming(t54, after).call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 16.2 * 60000 });
    const h = heard.join('');
    check('the summary page opens and the lesson closes', r.state.board.pages.some((p) => p.title === 'Summary') && r.state.closed, h);
    check('the part is named as next time, once, where the summary opens', /not "working\."\s+We didn't get to the pronunciation part today, so that's for next time\.[\s\S]*Today you described/.test(h) && (h.match(/We didn't get to/g) ?? []).length === 1, h);
    check('4b: the retry ask before the summary is not said, and not stored', !/Please say this sentence once more/.test(h) && !/Please say this sentence once more/.test(JSON.stringify(r.state.history.slice(-3))), h);
    check('the thank-you still goes out', /Thank you for today's lesson, and well done!/.test(h));
    // A close with no goodbye the gate can hold: the line goes at its end.
    const heard2: string[] = [];
    const st2 = pagesAt([...B, 'Summary'], { goals: { ...goalsB, pronunciation: { status: 'skipped', at: 0 } }, ...level, history: hist });
    await runV2Turn({ session: { ...lang, plan: GDI }, state: st2, studentSaid: 'Sorry, I have to finish now.', callModel: streaming('Thank you, Ken. Today you talked about your work and used the present perfect.', [{ type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'student_asked', summary: 'x' } }]).call, onText: (d) => heard2.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    check('a close with no farewell word: named at its end', /used the present perfect\.\s*We didn't get to the pronunciation part today, so that's for next time\.$/.test(heard2.join('').trim()), heard2.join(''));
    const heard3: string[] = [];
    await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt([...B, 'Summary'], { goals: { ...goalsB, pronunciation: { status: 'skipped', at: 0 } }, ...level, history: hist }), studentSaid: 'Sorry, I have to finish now.', callModel: streaming('Thank you, Ken. Next time we can practise pronunciation.', [{ type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'student_asked', summary: 'x' } }]).call, onText: (d) => heard3.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    check('…not when the reply already names it', !/We didn't get to/.test(heard3.join('')), heard3.join(''));
    check('the kill switch is on by default', TUTOR_V2_PASSED_PART_CLOSE === true);
  }

  console.log('4. once the summary has begun: no new practice ask or offer (gdi-real-james T50–T54)');
  {
    // The gate, in a reply that may close.
    const run = (pieces: Array<string | (() => void)>, g: ReplyGate) => { for (const p of pieces) if (typeof p === 'string') g.push(p); else p(); g.flush(); };
    const o1: string[] = []; const g1 = new ReplyGate((t) => o1.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk });
    run(['Good. Please say this sentence once more. ', 'Start with "I have".'], g1); g1.releaseAsk();
    check('an ask followed by more of the lesson goes out, in order', o1.join('') === 'Good. Please say this sentence once more. Start with "I have".', o1.join(''));
    const o2: string[] = []; const g2 = new ReplyGate((t) => o2.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk });
    run(['Good. Please say this sentence once more. ', () => g2.summaryBegins(), 'Today you described your job.'], g2);
    check('an ask followed by the summary page is dropped', o2.join('').trim() === 'Good. Today you described your job.' && g2.removed.includes('Please say this sentence once more.'), o2.join(''));
    const o3: string[] = []; const g3 = new ReplyGate((t) => o3.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk });
    run(['Good. Can you say it again? ', 'See you next time!'], g3); g3.releaseHeld();
    const o4: string[] = []; const g4 = new ReplyGate((t) => o4.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk });
    run(['Good. Can you say it again? ', 'See you next time!'], g4); g4.dropHeld();
    check('before a goodbye: dropped with the close, said when the close is refused', !o3.join('').includes('say it again') && o4.join('').includes('Can you say it again?') && !o4.join('').includes('See you'), [o3.join(''), o4.join('')]);
    const o5: string[] = []; const g5 = new ReplyGate((t) => o5.push(t), { dropFrame: false, holdGoodbye: true, closeAsk: v2IsPracticeAsk });
    run(['Here is a quick summary. ', 'You used the present perfect. ', 'Shall we do one quick practice on "there were"?'], g5);
    check('after the summary began in the reply, a practice offer is dropped', !o5.join('').includes('quick practice') && o5.join('').includes('You used the present perfect.'), o5.join(''));
    const o6: string[] = []; const g6 = new ReplyGate((t) => o6.push(t), { dropFrame: false, holdGoodbye: true });
    run(['Good. Please say this sentence once more. ', 'Here is a quick summary.'], g6);
    check('outside the close (no closeAsk): as before', o6.join('').includes('Please say this sentence once more.'));
    check('summary advice is not an ask', !v2IsPracticeAsk('Try to say it this way next time.') && v2IsPracticeAsk('Please say this sentence once more.') && v2IsPracticeAsk('もう一度言ってみてください。') && v2IsPracticeAsk('We can do one quick practice on "there was", or we can finish now. Which would you like?'));

    // James T50: the review begins (its page opens) with eight minutes left; the next turns.
    const spent: H = [u('hi'), a('<board page>Lesson overview</board> Hello. Next is your job. Shall we go on, or do you have a question first?'), u('Yes.'),
      a('<board page>Your job</board> What do you do?'), u('I make cars.'), a('Good. Next is present perfect. Shall we go on?'), u('Yes.'),
      a('<board page>Present perfect</board> We use have worked.'), u('ok'), a('<board page>Pronunciation</board> Next word: international. Please say it after me.')];
    const goals = { ...goalsB, 'topic-intro': { status: 'shown' as const, at: 0 }, pronunciation: { status: 'shown' as const, at: 0 } };
    const st = pagesAt([...B, 'Pronunciation'], { goals, ...level, history: spent });
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: st, studentSaid: 'Uh, yes.', callModel: streaming('Here is the word once more: international. Now let\'s finish with a short review. <board page>まとめ (Summary)</board> Well done. You used the right tense for each one.').call, boardPass: false, mathsCheck: false, nowMs: 11 * 60000 });
    check('T50: the summary page opens and the summary is recorded as begun', r.state.board.pages.some((p) => /Summary/.test(p.title)) && typeof r.state.summaryBegunAt === 'number' && v2SummaryBegun(r.state));
    const facts = renderFacts({ ...lang, plan: GDI }, r.state, { nowMs: 12 * 60000 });
    check('T52 facts: the summary has begun, no new practice; not "time for more"', /the summary has begun: from here, no new practice/.test(facts) && !/time for more/.test(facts), facts.slice(0, 600));
    const end = streaming('Understood.', [{ type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'lesson_complete', summary: 'x' } }]);
    const r2 = await runV2Turn({ session: { ...lang, plan: GDI }, state: r.state, studentSaid: 'Uh, move on.', callModel: end.call, boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    const refusal = r2.toolCalls.find((c) => c.name === 'end_lesson')?.outcome ?? '';
    check('T52: a close with time left is still refused, but its menu offers no more practice', /^not ended/.test(refusal) && !/something harder|more practice, a question/.test(refusal) && /a question about today's lesson or would like to stop here/.test(refusal), refusal);
    const early = await runV2Turn({ session: { ...lang, plan: { ...GDI, segments: GDI.segments.map((s) => (s.id === 'overview' ? { ...s, metadata: { ...(s.metadata ?? {}), label: 'Quick recap' } } : s)) } }, state: pagesAt(['Lesson overview'], { history: [u('hi'), a('Hello.')] }), studentSaid: 'Yes.', callModel: streaming('Good. Here is a quick summary of last time. <board page>Quick recap</board> We met the present perfect.').call, boardPass: false, mathsCheck: false, nowMs: 1 * 60000 });
    check('an early recap page is not the summary', early.state.summaryBegunAt === undefined);
    check('typed lessons: never recorded', (await runV2Turn({ session: { ...lang, mode: 'text', plan: GDI }, state: pagesAt([...B, 'Pronunciation'], { goals, ...level, history: spent }), studentSaid: 'yes', callModel: streaming('Now let\'s finish with a short review. <board page>Summary</board> Well done.').call, boardPass: false, mathsCheck: false, nowMs: 11 * 60000 })).state.summaryBegunAt === undefined);
    check('the kill switch is on by default; off, nothing is begun', TUTOR_V2_CLOSE_ONE_QUESTION === true && !v2SummaryBegun(r.state, false));
  }

  console.log('5. the slow first frame: set_working_level is called after the words (two model calls in all four runs)');
  {
    check('the description says so', /Call it after your reply's words, in the same response/.test(V2_SET_WORKING_LEVEL_TOOL.description ?? ''));
    check('the kill switch is on by default', TUTOR_V2_LEVEL_WITH_WORDS === true);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
