/// <reference types="node" />
// Task 7f: run with NEXT_PUBLIC_TUTOR_V2_TIME_NO_SQUEEZE=off, NEXT_PUBLIC_TUTOR_V2_PART_MIN_PRACTICE=off, NEXT_PUBLIC_TUTOR_V2_CLOSE_BY_CONTENT=off, NEXT_PUBLIC_TUTOR_V2_TIME_OVERRUN=off (package.json): it pins the behaviour
// before Task 7f (the box's last fifth, the fitted part minutes, the stop at the box, part changes with no practice count);
// scripts/test-brain-v2-time-7f.ts covers the switches on, and each one off alone.
/**
 * Tutor brain v2 — fixes from the four GDI learners' real voices replayed on v2 (Task 6e;
 * docs/superpowers/plans/gdi-v2-baseline/v2audio/RESULTS.md). No network, no model.
 *   npm run test:brain-v2-real-voice
 *
 *  1. recogniser noise is unheard, not stored, and reaches the brain as "nothing could be made out" (heard.ts)
 *  2. a sentence card after "we say:" is spoken there (board-timing.ts sentenceCardToSay, turn.ts)
 *  3. the part-change question check once in a while; an ask that ends in Japanese is an ask (part-close.ts)
 *  4. "I said individual words." is no stop (stop-signal.ts; the misread was the model's, no matcher fired)
 *  5. a part not reached is offered or named as next time near the close (plan-map.ts v2UnreachedAtClose)
 *  6. a word that makes no sense is checked ("Did you say …?") before a verdict (languages.ts)
 *  7. the practice line's example does not open with "Good"
 *  8. the persona card from a teacher background reaches the turn and holds a "before teaching" answer
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { V2_HEARD_MAX_CHARS, V2_UNHEARD_SAID, v2HeardForBrain, v2HeardIsNoise } from '../src/lib/tutor/v2/heard';
import { asksAloud, sentenceCardToSay, unsaidBoardItem } from '../src/lib/tutor/v2/board-timing';
import { ReplyGate } from '../src/lib/tutor/v2/reply-gate';
import { V2_WORDS_AFTER_START_MS, V2_WORDS_AFTER_STOP_MS, WordsWatch } from '../src/lib/tutor/v2/words-watch';
import { V2_MAX_PART_FRAMES, endsAsking, mayOpenPart, partOffer, v2FrameDue, v2QuestionCheckRecent } from '../src/lib/tutor/v2/part-close';
import { v2StopAsked } from '../src/lib/tutor/v2/stop-signal';
import { v2NextTimeLine, v2PassedPartFact, v2UnreachedAtClose, v2UnreachedAtCloseFact, v2UnreachedOffer } from '../src/lib/tutor/v2/plan-map';
import { renderFacts, v2QuestionCheckFact } from '../src/lib/tutor/v2/facts';
import { v2LanguagesSection, v2PracticeAskFacts, v2RetryFacts } from '../src/lib/tutor/v2/languages';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import {
  TUTOR_V2_CHECK_MISHEARD, TUTOR_V2_CLOSE_ONE_QUESTION, TUTOR_V2_HEARD_NOISE, TUTOR_V2_NO_WORDS_RECOVER, TUTOR_V2_PRACTICE_ASK_CAP, TUTOR_V2_PART_OFFER_ONCE, TUTOR_V2_PASSED_PART_CLOSE, TUTOR_V2_PERSONA_CARD, TUTOR_V2_SAY_SENTENCE_CARD,
} from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, as the model writes it; every request kept. */
function streaming(text: string) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }], 'end_turn'); };
  return { call, seen };
}
const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'] };
/** Task 7a: a plan whose parts all have names asks every part change (PART_ASK_EVERY, test-brain-v2-part-flow-7a.ts); the
 *  6e budget and frame drop pinned here still hold for plans without part names: the same plan with its names taken away. */
const GDI_6E = { ...GDI, segments: GDI.segments.map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan;
const pagesAt = (titles: string[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: titles.map((title) => ({ title, items: [] })), current: titles.length - 1 }, ...extra });

async function main() {
  console.log('1. recogniser noise (tester B #29)');
  {
    // The shape of the stored line (gdi-real-t3-v2-mwjm9rhab4l.json, 5,000 chars): "I'", newlines, 133 × " 、", 30 × " 号",
    // 225 × "( ", then "(vis" 482 times with a few "(vis((vis" among them. No one character is over a third of it.
    const garbage = `I'${'\n'.repeat(32)}${' 、'.repeat(133)}${' 号'.repeat(30)}${'\n \n'.repeat(60)}${' ('.repeat(225)}${'(vis((vis '.repeat(33)}${' (vis'.repeat(482)}`;
    check('the stored garbage is noise', v2HeardIsNoise(garbage), garbage.length);
    check('…and so is the earlier synthetic shape (a run of 、, "号 ", "( ", " www")', v2HeardIsNoise(`I'${'、'.repeat(400)}${'号 '.repeat(300)}${'( '.repeat(200)}${' www '.repeat(80)}`));
    check('a run of one CJK mark alone is noise', v2HeardIsNoise(`I'${'、'.repeat(60)}`) && v2HeardIsNoise('号 '.repeat(20)));
    check('a token repeated over most of a long turn is noise', v2HeardIsNoise(Array(14).fill('www').join(' ')));
    check(`longer than any spoken turn (> ${V2_HEARD_MAX_CHARS} chars) is noise`, v2HeardIsNoise('I worked on a project to support content. '.repeat(80)));
    // Real turns from the four runs, long and hesitant ones included.
    const real = [
      "Uh, let me see is uh one project I worked in the supporting for the the the uh the uh SNS networking contents.",
      "Yes, I'm sales manager in the G IMR uh the GM uh general manager, well that's and I just supporting for the all division in the the company and of course most of the part of the management and the sales area for this.",
      "My main responsibility in the sales area is to be a contact for our clients, supporting for the each division member of of course the management for the each division member and of course uh suggesting for the new service and the project products to the clients.",
      "Uh, uh, uh, uh, uh, I have, uh, I have worked here for, uh, eleven years.",
      'すみません、もう一度ゆっくり説明してください。現在完了の使い方がまだよくわかりません。',
      'Yes.', 'No, no, no, no.', "I'm not sure about it.",
      'Uh, because of number is will leaving to our company and the project won on, so that\'s why I have to find a new people.',
      'Yes, I attended the uh some business event in the uh Japan. last 2 year. I think the the event was uh the the networking event for the the uh new partner.',
    ];
    for (const r of real) check(`not noise: "${r.slice(0, 50)}…"`, !v2HeardIsNoise(r));
    check('the brain gets the unheard line for noise in a spoken lesson', v2HeardForBrain(garbage, 'voice') === V2_UNHEARD_SAID && V2_UNHEARD_SAID.startsWith('['));
    check('typed words, real words, silence and the kill switch off: as they came', v2HeardForBrain(garbage, 'text') === garbage && v2HeardForBrain("I'm not sure about it.", 'voice') === "I'm not sure about it." && v2HeardForBrain(null, 'voice') === null && v2HeardForBrain(garbage, 'voice', false) === garbage && TUTOR_V2_HEARD_NOISE === true);
    check('the unheard line is never a stop or a try at a sentence', !v2StopAsked(V2_UNHEARD_SAID) && v2RetryFacts(['en', 'ja'], [{ role: 'user', content: V2_UNHEARD_SAID }], V2_UNHEARD_SAID).length === 0);
    const st = streaming("Sorry, I didn't catch that. Was there a difficult part of the project?");
    const r = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Conversation'], { history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Was there a difficult part of the SNS project?' }] }), studentSaid: v2HeardForBrain(garbage, 'voice'), callModel: st.call, boardPass: false, mathsCheck: false, nowMs: 15 * 60000 });
    const sent = JSON.stringify(st.seen[0]!.messages);
    check('the turn sends and keeps the unheard line, not 5,000 characters of noise', sent.includes('the speech recogniser returned noise') && !sent.includes('号 号') && !JSON.stringify(r.state.history).includes('、、、'), sent.length);
    const route = src('src/app/api/tutor/brain-v2/turn/route.ts');
    check('the route turns noise into the unheard line before the turn', /const studentSaid = v2HeardForBrain\(saidRaw, cfg\.mode === 'voice' \? 'voice' : 'text'\)/.test(route));
    const voice = src('src/app/tutor/components/v2/TutorVoiceV2.tsx'); const turns = src('src/app/tutor/components/v2/useV2Turns.ts');
    check('the voice client: noise never cuts the tutor, waits out a running reply, and is sent as unheard', /const noise = !opts\?\.typed && TUTOR_V2_HEARD_NOISE && v2HeardIsNoise\(text\)/.test(voice) && /if \(realtimeRef\.current\?\.isSpeechPending\(\)\) \{ liftPause\(\); return; \}\n\s+if \(turnsRef\.current\?\.busy\) return;/.test(voice) && /if \(noise\) turnsRef\.current\?\.send\(text, \{ unheard: true \}\)/.test(voice));
    check('the turn loop: an unheard turn is not stored in the transcript, and is dropped over a running reply', /if \(studentSaid && !unheard\) transcriptRef\.current = /.test(turns) && /if \(busyRef\.current && unheard\) return;/.test(turns) && /runTurn\(V2_UNHEARD_SAID, undefined, true\)/.test(turns));
  }

  console.log('2. the corrected sentence is heard (tester B, 6 turns)');
  {
    check('after "The correct sentence is:" the card is said', sentenceCardToSay('I have worked here for ten years.', 'Good effort. The correct sentence is:  ') === 'I have worked here for ten years.');
    check('after "we say:" and after a quoted lead-in; a missing full stop is added', sentenceCardToSay('I attended a business event in Japan last year', 'For the second part, we say:') === 'I attended a business event in Japan last year.' && sentenceCardToSay('How long have you worked on this project?', 'Please use "people" without "a": ') === 'How long have you worked on this project?' && sentenceCardToSay('今日は雨です。', '日本語では：') === '今日は雨です。');
    check('no colon lead-in (the sentence was said before the card, or the card stands beside the talk): nothing added', sentenceCardToSay('I worked on a project to support SNS networking content.', 'That\'s right: "I worked on a project to support SNS networking content."') === null && sentenceCardToSay('I have worked here for ten years.', 'Good, that is the present perfect.') === null);
    check('already said in this reply: not said twice', sentenceCardToSay('I have worked here for ten years.', 'You said "I have working". I have worked here for ten years, we say:') === null);
    check('mathematics stays on the board', sentenceCardToSay('$x = 2$', 'So we write:') === null);
    const t9 = 'Good effort. The correct sentence is: <board sentence stress="have worked">I have worked here for ten years.</board> We use "have worked" because you started in the past and you still work there now. Are you ready for the past simple next?';
    const heard: string[] = [];
    const st = streaming(t9);
    const r = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Present perfect']), studentSaid: 'I have working for our company for a long time.', callModel: st.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    const said = heard.join('');
    check('tester B t9 in voice: the sentence is spoken right after its lead-in, once', /The correct sentence is:\s+I have worked here for ten years\.\s+We use "have worked"/.test(said) && said.split('I have worked here').length === 2, said);
    check('…the spoken record has it, the card is on the board, and the stored reply keeps the block', /The correct sentence is:\s+I have worked here for ten years\./.test(r.spoken) && r.toolCalls.some((c) => c.name === 'show_sentence' && !/^not /.test(c.outcome)) && JSON.stringify(r.state.history).includes('<board sentence'), r.spoken);
    const heardText: string[] = [];
    await runV2Turn({ session: { ...lang, mode: 'text' }, state: pagesAt(['Lesson overview', 'Present perfect']), studentSaid: 'I have working for our company.', callModel: streaming(t9).call, onText: (d) => heardText.push(d), boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('a typed lesson: unchanged (the card is in front of them)', !heardText.join('').includes('I have worked here'), heardText.join(''));
    const t13 = 'Good. For the second part, we say: <board sentence>We met new business partners at the event.</board> Can you say that sentence?';
    const r13 = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Past simple']), studentSaid: 'Yes, I met some. We came at the new partner.', callModel: streaming(t13).call, boardPass: false, mathsCheck: false, nowMs: 9 * 60000 });
    check('tester B t13: said after "we say:", and not read a second time at the end (unsaidBoardItem sees it said)', /we say:\s+We met new business partners at the event\.\s+Can you say that sentence\?$/.test(r13.spoken) && r13.spoken.split('We met new').length === 2, r13.spoken);
    check('the kill switch defaults on', TUTOR_V2_SAY_SENTENCE_CARD === true);
  }

  console.log('3. the part-change question check, once in a while (tester A turns 24 → 26)');
  {
    const t24 = 'Excellent, you said that correctly on your own. "I have worked" is the present perfect, and it shows work that started in the past and continues now. Your sentence is a good example of the grammar we\'ll study next. Shall we go on to the present perfect now? 次に現在完了を学びます。進んでもいいですか。';
    check('root cause: the ask ends in Japanese (…か。), which the old "?" test did not see', !endsAsking('次に現在完了を学びます。進んでもいいですか。', false) && endsAsking('次に現在完了を学びます。進んでもいいですか。') && endsAsking('進んでもいいですか？') && endsAsking('Shall we go on?') && !endsAsking('次に現在完了を学びます。'));
    check('after "Yes." to that ask the present perfect page opens, not a second offer', mayOpenPart({ title: 'Present perfect', studentSaid: 'Yes.', lastTutor: t24, pagesOpen: 4 }));
    const r24 = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Level check', 'Your job'], { history: [{ role: 'user', content: 'I have worked for the current company for 10 years.' }, { role: 'assistant', content: t24 }] }), studentSaid: 'Yes.', callModel: streaming('<board page>Present perfect</board> We use the present perfect for experience. How long have you lived in your city?').call, boardPass: false, mathsCheck: false, nowMs: 6 * 60000 });
    check('…in a whole turn: the page turns, no "Next is present perfect. Shall we go on…"', r24.state.board.pages.length === 4 && !/Next is present perfect/.test(r24.spoken), r24.spoken);

    // Fix round 1 (F1): the frame is the runtime's, at most twice a lesson, never at two part changes running.
    const frameAt = (offer: string): V2State['history'] => [
      { role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: '<board page>Lesson overview</board> Hello, today we talk about work.' },
      { role: 'user', content: 'I am ready.' }, { role: 'assistant', content: offer },
      { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>Present perfect</board> We use it for experience. How long have you worked there?' },
      { role: 'user', content: 'I have worked here ten years.' }, { role: 'assistant', content: 'Nearly: we say "for ten years". Say it once more?' },
    ];
    const withQ = frameAt('Good. Next is present perfect. Shall we go on, or do you have a question first?');
    const withShort = frameAt('Good. Next is present perfect. Shall we go on?');
    const withNone = frameAt('Good. That part is done. Next is present perfect, for experience up to now.');
    check('the last part change asked it (full or short frame): not due; none asked: due', !v2FrameDue(withQ) && !v2FrameDue(withShort) && v2FrameDue(withNone) && v2FrameDue([]) && v2QuestionCheckRecent(withQ));
    const twice: V2State['history'] = [{ role: 'assistant', content: '<board page>Start</board> Hello.' }, { role: 'user', content: 'hi' }, { role: 'assistant', content: 'Next is A. Shall we go on, or do you have a question first?' }, { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>A</board> Next is B. Are you ready for that, or do you have a question first?' }, { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>B</board> Good.' }, { role: 'user', content: 'ok' }, { role: 'assistant', content: '<board page>C</board> Good.' }];
    check(`at most ${V2_MAX_PART_FRAMES} a lesson: after two, not due even with changes between`, !v2FrameDue(twice));
    check('the offer, when due, is the whole frame', partOffer('Past simple', false) === 'Next is past simple. Shall we go on, or do you have a question first?');
    const reply = 'Yes, that is right: for ten years. This part is done. Next is the past simple. Shall we go on, or do you have a question first? <board page>Past simple</board> We use it for finished events.';
    const heardQ: string[] = [];
    const notDue = await runV2Turn({ session: { ...lang, plan: GDI_6E }, state: pagesAt(['Lesson overview', 'Level check', 'Present perfect'], { history: withQ }), studentSaid: 'I have worked here for ten years.', callModel: streaming(reply).call, onText: (d) => heardQ.push(d), boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('not due: the model\'s own frame is dropped (not said, not stored) and the page opens', !/Shall we go on|question first/.test(heardQ.join('')) && !/Shall we go on/.test(notDue.spoken) && !/Shall we go on/.test(JSON.stringify(notDue.state.history.slice(withQ.length))) && notDue.state.board.pages.some((pg) => pg.title === 'Past simple') && /Next is the past simple\./.test(notDue.spoken), { said: heardQ.join(''), spoken: notDue.spoken });
    check('…and no check-in is added in its place', !/Does that make sense|with me so far|go over it again/.test(notDue.spoken), notDue.spoken);
    const due = await runV2Turn({ session: { ...lang, plan: GDI_6E }, state: pagesAt(['Lesson overview', 'Level check', 'Present perfect'], { history: withNone }), studentSaid: 'I have worked here for ten years.', callModel: streaming('Yes, that is right: for ten years. <board page>Past simple</board> Now the past simple.').call, boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('due: the page is held and the runtime asks the whole frame, as before', /Next is past simple\. Shall we go on, or do you have a question first\?$/.test(due.spoken) && !due.state.board.pages.some((pg) => pg.title === 'Past simple'), due.spoken);
    const f = v2QuestionCheckFact({ ...newV2State(0), history: withQ });
    check('the facts say so when not due, for the frame the tutor writes itself', f.length === 1 && /part changes: the ask whether to go on \(or whether they have a question first\) is not due at the next one: when this part is done, say so, name what comes next and begin it in the same reply/.test(f[0]!) && renderFacts({ ...lang, plan: GDI_6E }, { ...newV2State(0), history: withQ }, { nowMs: 60000, heard: 'ok' }).includes('part changes: the ask whether to go on') && v2QuestionCheckFact({ ...newV2State(0), history: withNone }).length === 0);
    check('kill switch off: neither', v2QuestionCheckFact({ ...newV2State(0), history: withQ }, false).length === 0 && TUTOR_V2_PART_OFFER_ONCE === true);
  }

  console.log('4. "I said individual words." is not a stop (james #30)');
  {
    // No matcher fired on the run (no stop fact; james bundle events): the model read it as "stop the word practice".
    for (const s of ['I said individual words.', 'I said individual words', 'Uh, just a little bit of individual words.', 'I said words, not sentences.', 'No, I said stop and repeat the word.']) check(`not a stop: "${s}"`, !v2StopAsked(s));
    for (const s of ['Sorry, I have to finish now.', 'Okay, please stop. I would like to end the session for now.', 'Please, I would like to end the session for now.', '今日はここまでにします']) check(`a stop: "${s}"`, v2StopAsked(s));
  }

  console.log('5. a part not reached near the close (tester B)');
  {
    const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
    const goals = { overview: { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 } };
    const level = { workingLevel: { level: 'intermediate', from: 'this_lesson' } } as Partial<V2State>;
    const b = pagesAt(B, { goals, ...level });
    check('root cause: no summary page is up yet, so the passed-part fact has nothing to go on; and at the close it is off', v2PassedPartFact(GDI, b, false).length === 0 && v2PassedPartFact(GDI, pagesAt([...B, 'Summary'], { goals, ...level }), true).length === 0);
    check('the part not reached: pronunciation, before the summary page and after it', v2UnreachedAtClose(GDI, b).map((x) => x.id).join() === 'pronunciation' && v2UnreachedAtClose(GDI, pagesAt([...B, 'Summary'], { goals, ...level })).map((x) => x.id).join() === 'pronunciation');
    check('offered and declined (skipped), or done: nothing', v2UnreachedAtClose(GDI, pagesAt(B, { goals: { ...goals, pronunciation: { status: 'skipped', at: 0 } }, ...level })).length === 0 && v2UnreachedAtClose(GDI, pagesAt([...B, 'Pronunciation'], { goals, ...level })).length === 0);
    check('a stop at minute 8 (josh): the parts after the furthest one reached', v2UnreachedAtClose(GDI, pagesAt(['Lesson overview', 'Level check', 'Your job', 'Present perfect'], { goals: { overview: { status: 'shown', at: 0 } }, ...level })).map((x) => x.id).join() === 'past-simple,open-conversation,pronunciation');
    check('a plan whose parts carry no names: nothing (as the passed-part fact)', v2UnreachedAtClose({ ...GDI, segments: GDI.segments.map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan, b).length === 0);
    check('the held summary page\'s offer names it and lets them choose, in one line', v2UnreachedOffer(GDI, b) === 'Before the summary, there is still the pronunciation part. Would you like to do it now, or go straight to the summary?', v2UnreachedOffer(GDI, b));
    check('at the close: named in the summary as next time', v2UnreachedAtCloseFact(GDI, b, 'closing')[0] === 'The Pronunciation part was not reached, and there is no time for it now: in your summary, name it in one short line as something for next time');
    check('near the close: offered in one line, or named as next time', v2UnreachedAtCloseFact(GDI, b, 'near')[0] === 'The Pronunciation part was not reached: before the summary, offer it in one line if the time allows; if not, name it in your summary, in one short line, as something for next time');
    check('not before the close, not once closed, not with the kill switch off', v2UnreachedAtCloseFact(GDI, b, null).length === 0 && v2UnreachedAtCloseFact(GDI, { ...b, closed: true }, 'closing').length === 0 && v2UnreachedAtCloseFact(GDI, b, 'closing', false).length === 0 && v2UnreachedOffer(GDI, b, false) === null && TUTOR_V2_PASSED_PART_CLOSE === true);
    const session: V2Session = { ...lang, plan: GDI };
    // Task 7v (OPTIONAL_FIT): `fit` false: the stop asked, which takes the 7i fit out of the closing line (as before 7v).
    const at = (min: number, more: Partial<V2Session> = {}, fit = true) => renderFacts({ ...session, ...more }, b, { nowMs: min * 60000, heard: 'Yes.', ...(fit ? {} : { stopAsked: true }) });
    check('in the facts: none at minute 10 of 20, "near" at 17.6, "closing" at 19 or past the wrap minute', !/not reached/.test(at(10)) && /was not reached: before the summary, offer it in one line/.test(at(17.6)) && /no time for it now/.test(at(19)) && /no time for it now/.test(at(12, { wrapMinutes: 11 }, false)), at(17.6).slice(0, 900));
    // Task 7v (OPTIONAL_FIT): past the wrap minute while the part still fits by the 7i fit (12 + 3 + 2 ≤ 20), never "no time".
    check('7v: past the wrap minute with time for it, named as next time without "no time", and taken if they ask', /was not reached: in your summary, name it in one short line as something for next time; it would still fit, so if they ask for it, it is taken/.test(at(12, { wrapMinutes: 11 })) && !/no time for it now/.test(at(12, { wrapMinutes: 11 })));
    check('beside the passed-part line it is not repeated', !/not reached/.test(renderFacts(session, pagesAt([...B, 'Summary'], { goals, ...level }), { nowMs: 17 * 60000, heard: 'ok' })));
    const t26 = "Your duties came across clearly. We're nearly out of time, so let's finish with a quick summary. <board page>Summary</board> Great work today!";
    const r = await runV2Turn({ session, state: pagesAt(B, { goals, ...level, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'After "will", use the base verb. Can you say the sentence again?' }] }), studentSaid: 'My responsibility in sales area is contact for our client.', callModel: streaming(t26).call, boardPass: false, mathsCheck: false, nowMs: 17.6 * 60000 });
    check('tester B t26 in a whole turn: the summary page is held and the offer names pronunciation', /Before the summary, there is still the pronunciation part\. Would you like to do it now, or go straight to the summary\?$/.test(r.spoken) && r.state.board.pages.length === B.length && !/Great work/.test(r.spoken), r.spoken);
  }

  console.log('6. a word that makes no sense is checked first (tester B: "my lover", "I met some")');
  {
    const line = 'When a word in their sentence makes little sense where it stands, or one seems to be missing, the recogniser may have misheard: check before you correct the sentence or call it right. Ask "Did you say …?" only with a word that sounds like what was heard and fits; when nothing fits, ask them to say it again. Never guess at a meaning they did not say.';
    check('in the spoken two-language section', (v2LanguagesSection(['en', 'ja']) ?? '').includes(line) && v2SessionPart(lang).includes(line));
    check('not typed, not with the kill switch off', !(v2LanguagesSection(['en', 'ja'], 'text') ?? '').includes('Did you say') && !(v2LanguagesSection(['en', 'ja'], 'voice', { checkMisheard: false }) ?? '').includes('Did you say') && TUTOR_V2_CHECK_MISHEARD === true);
    check('generic: no lesson or learner words in it', !/lover|someone|role|met/i.test(line));
  }

  console.log('7. the practice line\'s example');
  {
    const practice = (v2LanguagesSection(['en', 'ja']) ?? '').split('\n').find((l) => l.startsWith('A sentence they produce as practice')) ?? '';
    check('the example for a slip outside the form opens with no praise word', practice.includes('("One small thing: we say \'…\'.")') && !/"Good, and we say/.test(practice), practice);
  }

  console.log('8. the persona card reaches the turn (gdi-real-t3 fixture\'s teacher)');
  {
    const fx = JSON.parse(src('scripts/tutor/replay-harness/fixtures/gdi-real-t3.json')) as { claims: { teacher: { name: string; intro: string; background: string; style: { teaching: string } } } };
    const t = fx.claims.teacher;
    check('the fixture\'s background fits the route\'s cap (1200), so it reaches the turn whole', t.background.length <= 1200 && /background: t\.background\.trim\(\)\.slice\(0, 1200\)/.test(src('src/app/api/tutor/brain-v2/turn/route.ts')));
    check('the session passes a persona\'s background and intro to the v2 turn', /teacherPersona\.background\?\.trim\(\) \? \{ background: teacherPersona\.background, \.\.\.\(teacherPersona\.intro\?\.trim\(\) \? \{ intro: teacherPersona\.intro \}/.test(src('src/app/tutor/components/session/TutorSession.tsx')));
    const st = streaming('Before teaching, I studied English in Canada for a year. What about you: have you studied abroad?');
    await runV2Turn({ session: { ...lang, teacher: { name: t.name, style: t.style.teaching, intro: t.intro, background: t.background } }, state: pagesAt(['Lesson overview', 'Conversation'], { history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'What is one project you are proud of?' }] }), studentSaid: 'What did you do before teaching?', callModel: st.call, boardPass: false, mathsCheck: false, nowMs: 9 * 60000 });
    const system = (st.seen[0]!.system as Array<{ text: string }>).map((b) => b.text).join('\n');
    check('the card is in the system prompt the model gets', system.includes(`Your persona card (who you are): ${t.intro} ${t.background}`) && TUTOR_V2_PERSONA_CARD === true);
    check('"what did you do before teaching?" is answerable from it: the card says what came before', /Before that I studied English in Canada for a year/.test(system) && /When they ask about you, answer briefly from this card/.test(system));
    check('the constitution\'s "no life story" is lifted only by the card', /Unless this session gives you a persona card/.test(system));
  }


  console.log('fix round 1 — F2: the practice ask is counted; a bare yes is no try (tester A T48–T66)');
  {
    check('"Now you say it: …" hands over (no check-in is added to it)', asksAloud(['ゆっくりで大丈夫です。', 'Now you say it: "I didn\'t attend."']) && asksAloud(['Please say it again.']) && !asksAloud(['I attended a trade show last year.']));
    const S = "I didn't attend any exhibitions last year.";
    const one: V2State['history'] = [{ role: 'user', content: 'No, I have not.' }, { role: 'assistant', content: `「No, I have not.」は違います。 Now you say it: "${S}" Does that make sense?` }];
    const f1 = v2PracticeAskFacts(['en', 'ja'], one, 'Yes.');
    check('one ask, then "Yes.": that answers the check, it is no try; no cap yet', f1.length === 1 && f1[0] === 'their "Yes." answers your check question; it is not a try at the sentence you asked for', f1);
    const two: V2State['history'] = [...one, { role: 'user', content: 'Yes.' }, { role: 'assistant', content: 'Good. Please say the sentence once more. Are you with me so far?' }];
    const f2 = v2PracticeAskFacts(['en', 'ja'], two, 'Yes.');
    check('a second ask (quoting nothing: the same sentence): give it and move on, tries counted without the yeses', f2.length === 2 && f2[1] === `practice asks: you have asked them 2 times in a row to say ${JSON.stringify(S)}, and they have tried it 0 times. Do not ask for it again: say it yourself now and go on to the next thing`, f2);
    const other: V2State['history'] = [...one, { role: 'user', content: S }, { role: 'assistant', content: 'Right. Now try "I went to a trade fair in Osaka in May."' }];
    check('an ask for a different sentence starts a new count', v2PracticeAskFacts(['en', 'ja'], other, 'I went to a trade fair.').length === 0);
    check('one language, or the switch off: none', v2PracticeAskFacts(['en'], two, 'Yes.').length === 0 && v2PracticeAskFacts(['en', 'ja'], two, 'Yes.', false).length === 0 && TUTOR_V2_PRACTICE_ASK_CAP === true);
    check('in the facts', renderFacts(lang, { ...newV2State(0), history: two }, { nowMs: 60000, heard: 'Yes.' }).includes('practice asks: you have asked them 2 times in a row'));
    const r = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Past simple']), studentSaid: 'No, I have not.', callModel: streaming(`ゆっくりで大丈夫です。まず私が言います。 "I didn't attend." Now you say it: "${S}"`).call, boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    check('a whole turn: no "Are you with me so far?" after the ask', !/with me so far|make sense|go over it again/.test(r.spoken), r.spoken);
  }

  console.log('fix round 1 — F3: an optional part not reached is named in any goodbye (Josh, tester B)');
  {
    const joshPages = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple'];
    const st = pagesAt(joshPages, { goals: { overview: { status: 'shown', at: 0 }, 'present-perfect': { status: 'demonstrated', at: 0 } }, workingLevel: { level: 'beginner', from: 'this_lesson' } } as Partial<V2State>);
    const T116 = 'Understood, Josh. Today you practised describing your work, and you used the present perfect correctly for "I have worked here for 11 years." Next time we\'ll look at the past simple and the conversation practice.';
    check('the line: the optional part only, by name', v2NextTimeLine(GDI, st, T116) === "We didn't get to the pronunciation part today, so that's for next time.", v2NextTimeLine(GDI, st, T116));
    check('named already (English or its Japanese name): none', v2NextTimeLine(GDI, st, `${T116} Pronunciation is for next time too.`) === null && v2NextTimeLine(GDI, st, `${T116} 発音も次回です。`) === null);
    const stop = { call: (async (_p, onText) => { const text = `${T116} お疲れさまでした。また次回お会いしましょう。`; for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'student_asked', summary: 'Present perfect.' } }], 'tool_use'); }) as V2ModelCall };
    const heard: string[] = [];
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: st, studentSaid: 'Please, I would like to end the session for now.', callModel: stop.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 7.7 * 60000 });
    const said = heard.join('');
    check('Josh\'s stop goodbye: the pronunciation part named as next time, before the goodbye; the close stands', /conversation practice\.\s+We didn't get to the pronunciation part today, so that's for next time\.\s+お疲れさまでした。/.test(said) && r.state.closed && /We didn't get to the pronunciation part today, so that's for next time\. お疲れさまでした/.test(JSON.stringify(r.state.history)), said);
  }

  console.log('fix round 1 — F4: one question at the close, nothing after a goodbye (James, tester B)');
  {
    const bye = 'Great work today, James. One thing to improve is "There were," not "There was." Thank you for today\'s lesson. See you next time!';
    const calls: number[] = [];
    const twoCalls: V2ModelCall = async (_p, onText) => {
      calls.push(1);
      const text = calls.length === 1 ? bye : 'Would you like to do something harder, get more practice, ask me a question, or stop here?';
      for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece);
      return calls.length === 1 ? msg([{ type: 'text', text }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'x' } }], 'tool_use') : msg([{ type: 'text', text }], 'end_turn');
    };
    const heard: string[] = [];
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Summary']), studentSaid: 'Oh, yes.', callModel: twoCalls, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 10.7 * 60000 });
    const said = heard.join('');
    check('a refused close takes its goodbye with it: "See you next time!" never said or stored, the menu follows the summary', !/See you next time/.test(said) && /There was\."\s+Would you like to do something harder/.test(said.replace(/Thank you for today's lesson\.\s*/, '')) && !r.state.closed && !/See you next time/.test(JSON.stringify(r.state.history)), said);
    const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
    const st = pagesAt(B);
    check('the facts near and at the close: one question, not the last one again, nothing after a goodbye', renderFacts({ ...lang, plan: GDI }, st, { nowMs: 17 * 60000, heard: 'Yes.' }).includes('at the close: at most one question in a reply, never one you asked in your last reply, and nothing after a goodbye') && !renderFacts({ ...lang, plan: GDI }, st, { nowMs: 10 * 60000, heard: 'Yes.' }).includes('at the close:') && TUTOR_V2_CLOSE_ONE_QUESTION === true);
    const g = new ReplyGate(() => {}, { dropFrame: false, holdGoodbye: true });
    g.push('Well done. See you next time! お疲れさまでした。'); g.flush();
    check('the gate holds a goodbye and what follows it until told', g.holdsGoodbye && /See you next time! お疲れさまでした。/.test(g.held));
  }

  console.log('fix round 1 — F5: a card is said where it stands, or not at all (tester A ×4, tester B, Josh T10)');
  {
    check('lead-ins without a colon announce a card', sentenceCardToSay('I have worked here for five years.', 'Here are two sentences that look similar but mean different things.', { leadIn: true }) !== null && sentenceCardToSay('I attended a networking event last year.', "I'll put your idea into one sentence with the past simple.", { leadIn: true }) !== null);
    check('the next card under the same lead-in is said too', sentenceCardToSay('I worked here for five years.', 'Here are two sentences. I have worked here for five years.', { leadIn: true, continuing: true }) !== null);
    check('never after words that ask them something (tester A T24)', sentenceCardToSay('I joined my company three years ago.', 'Now it\'s your turn. Please say one sentence about your job, starting with "I work in…".', { leadIn: true }) === null);
    check('without the option, colon lead-ins only (as in 6e)', sentenceCardToSay('I have worked here.', 'Here are two sentences.') === null);
    const t10 = 'Here are two sentences that look similar but mean different things. <board sentence>I have worked here for five years.</board><board sentence>I worked here for five years.</board> Which one means you still work here?';
    const r10 = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Present perfect']), studentSaid: 'Okay.', callModel: streaming(t10).call, boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('Josh T10: both cards said in order after the lead-in, before the question', /different things\.\s+I have worked here for five years\.\s+I worked here for five years\.\s+Which one means/.test(r10.spoken), r10.spoken);
    const t24 = 'Now it\'s your turn. Please say one sentence about your job, starting with "I work in…". <board sentence>I joined my company three years ago.</board>';
    const r24 = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Your job']), studentSaid: 'Yes.', callModel: streaming(t24).call, boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('tester A T24: the example card after the ask is not read out, at the end or anywhere', !/I joined my company/.test(r24.spoken), r24.spoken);
    const t154 = 'Almost. "Customer" needs an s here: <board sentence>I have worked with international customers sometimes.</board> I have worked with international customers sometimes. Can you say it?';
    const r154 = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Conversation']), studentSaid: 'I have worked with the international customer sometimes.', callModel: streaming(t154).call, boardPass: false, mathsCheck: false, nowMs: 15 * 60000 });
    check('tester B T154: a card the model says itself straight after is said once', r154.spoken.split('I have worked with international customers').length === 2, r154.spoken);
    check('unsaidBoardItem leaves sentence cards out when asked to; menus still read', unsaidBoardItem([{ name: 'show_sentence', args: { sentence: 'I want to expand our business.' }, outcome: 'painted' }], ['Please say it back to me.'], { sentences: false }) === null && unsaidBoardItem([{ name: 'annotate', args: { text: '1) words\n2) a sentence' }, outcome: 'painted' }], ['Which one would you like?'], { sentences: false }) === '1, words; 2, a sentence.');
  }

  console.log('fix round 1 — F6: speech with no words never strands the page (tester B stall)');
  {
    const timers: Array<{ fn: () => void; at: number; live: boolean }> = []; let now = 0;
    const clock = { set: (fn: () => void, ms: number) => { const t = { fn, at: now + ms, live: true }; timers.push(t); return t as unknown as ReturnType<typeof setTimeout>; }, clear: (t: ReturnType<typeof setTimeout>) => { (t as unknown as { live: boolean }).live = false; } };
    const advance = (ms: number) => { now += ms; for (const t of timers) if (t.live && t.at <= now) { t.live = false; t.fn(); } };
    let lost = 0;
    const w = new WordsWatch(() => { lost += 1; }, clock);
    w.speech('start'); advance(2000); w.speech('stop'); advance(V2_WORDS_AFTER_STOP_MS - 1);
    check('speech stopped, no transcript yet: still waiting', lost === 0 && w.waiting);
    advance(1);
    check(`no transcript and no failure ${V2_WORDS_AFTER_STOP_MS / 1000} s after the stop: lost (the page listens again, the nudge is armed)`, lost === 1 && !w.waiting);
    w.speech('start'); advance(1000); w.speech('stop'); w.settled(); advance(60_000);
    check('words (or a reported failure) settle it: nothing lost', lost === 1);
    w.speech('start'); advance(V2_WORDS_AFTER_START_MS - 1000); w.speech('partial'); advance(V2_WORDS_AFTER_STOP_MS - 1);
    check('a long turn sending words so far is not lost', lost === 1);
    advance(1); check('…until its words stop coming', lost === 2);
    const off = new WordsWatch(() => { lost += 100; }, clock, false); off.speech('stop'); advance(60_000);
    check('switch off: no watch', lost === 2 && TUTOR_V2_NO_WORDS_RECOVER === true);
    const voice = src('src/app/tutor/components/v2/TutorVoiceV2.tsx');
    check('the voice client: start, partial words and stop arm it; a transcript or a failure settles it; lost → listening + the idle nudge', /wordsWatchRef\.current\.speech\('start'\)/.test(voice) && /wordsWatchRef\.current\.speech\('partial'\)/.test(voice) && /wordsWatchRef\.current\.speech\('stop'\)/.test(voice) && /const heard = useCallback\(\(transcript: string, opts\?: \{ typed\?: boolean \}\) => \{\n\s+wordsWatchRef\.current\.settled\(\);/.test(voice) && /wordsWatchRef\.current\.settled\(\);\n\s+p\.current\.onDebugEvent\?\.\('v2_transcription_failed'/.test(voice) && /showState\('listening'\); armSilence\(\);\n\s+\}, undefined, TUTOR_V2_NO_WORDS_RECOVER\)/.test(voice));
    check('root cause, pinned: the recogniser drops an empty final turn with no callback, and speech start clears the idle timer', /if \(!text\) return; \/\/ genuinely empty turn/.test(src('src/app/tutor/hooks/useCartesiaInkWS.ts')) && /pronRef\.current\?\.speechStart\(!!realtimeRef\.current\?\.isSpeechPending\(\)\);\n\s+clearSilence\(\);/.test(voice));
  }

  console.log('fix round 1 — reply gate');
  {
    const out: string[] = [];
    const g = new ReplyGate((t) => out.push(t), { dropFrame: true, holdGoodbye: true });
    g.push('This part is done. Next is the past simple. Shall we go on, or do you have a question first? We use it for'); g.push(' finished events. '); g.flush();
    check('a frame sentence is dropped, the rest goes out word for word', out.join('') === 'This part is done. Next is the past simple. We use it for finished events. ' && g.removed[0] === 'Shall we go on, or do you have a question first?', out.join(''));
    const o2: string[] = []; const g2 = new ReplyGate((t) => o2.push(t), { dropFrame: false, holdGoodbye: true });
    g2.push('Well done today. See you next time! '); g2.flush();
    check('a goodbye is held; released with a line before it', o2.join('') === 'Well done today. ' && (g2.releaseHeld("We didn't get to the pronunciation part today, so that's for next time."), /next time\. See you next time!/.test(o2.join(''))), o2.join(''));
    const o3: string[] = []; const g3 = new ReplyGate((t) => o3.push(t), { dropFrame: false, holdGoodbye: true });
    g3.push('Well done today. Goodbye! '); g3.flush(); g3.dropHeld();
    check('…or dropped, and recorded as removed', o3.join('') === 'Well done today. ' && g3.removed.includes('Goodbye!'));
    const o4: string[] = []; const g4 = new ReplyGate((t) => o4.push(t), { dropFrame: false, holdGoodbye: false });
    g4.push('Next part. 次は過去形です。いいですか？ '); g4.flush();
    check('Japanese sentences pass through whole; a part-change frame is kept when not told to drop', o4.join('') === 'Next part. 次は過去形です。いいですか？ ' && new ReplyGate(() => {}, { dropFrame: false, holdGoodbye: false }).removed.length === 0, o4.join(''));
  }


  console.log('fix round 2');
  {
    // Minor a: only frames said at a part change count toward the budget.
    const opener: V2State['history'] = [{ role: 'assistant', content: 'Hello! Today: forces. Shall we start?' }, { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>Forces</board> A push or a pull. Any questions so far?' }, { role: 'user', content: 'No.' }, { role: 'assistant', content: 'Good. Is a magnet a push or a pull? Any questions so far?' }, { role: 'user', content: 'A pull.' }, { role: 'assistant', content: 'Right.' }];
    check('minor a: "Shall we start?" before the first page and mid-part "any questions so far?" spend none of the budget', v2FrameDue(opener));
    // N1: farewells only, and not quoted ones; the line only on a goodbye that closes the lesson.
    const g = new ReplyGate(() => {}, { dropFrame: false, holdGoodbye: true });
    g.push('Take care with the sign here. Have a nice weekend is a friendly phrase. We say "Goodbye!" at the end of a call. See you then. '); g.flush();
    check('N1: "take care", "have a nice weekend", "see you then" and a quoted "Goodbye!" are not held', !g.holdsGoodbye);
    const mid = 'Goodbye for now is a fine way to end an email. Can you write one for your manager?';
    const heardMid: string[] = [];
    const rm = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check', 'Your job'], { workingLevel: { level: 'beginner', from: 'this_lesson' } } as Partial<V2State>), studentSaid: 'How do I end an email?', callModel: streaming(mid).call, onText: (d) => heardMid.push(d), boardPass: false, mathsCheck: false, nowMs: 6 * 60000 });
    check('N1: a goodbye-like sentence mid-lesson, with no close: said whole, no next-time line', heardMid.join('').trim() === mid && !/next time/.test(rm.spoken), heardMid.join(''));
    // N2: the closing page is held and names the part not reached even with the frame budget spent.
    const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
    const spent: V2State['history'] = [
      { role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: '<board page>Lesson overview</board> Hello, today we talk about work.' },
      { role: 'user', content: 'I am ready.' }, { role: 'assistant', content: 'Good. Next is present perfect. Shall we go on, or do you have a question first?' },
      { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>Present perfect</board> We use it for experience. How long have you worked there?' },
      { role: 'user', content: 'I have worked here ten years.' }, { role: 'assistant', content: 'Nearly: we say "for ten years". Say it once more?' },
    ];
    check('(setup: the frame is not due)', !v2FrameDue(spent));
    const rs = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(B, { history: spent, goals: { 'open-conversation': { status: 'shown', at: 0 } } }), studentSaid: 'My responsibility is contact for our clients.', callModel: streaming('Thank you. Let\'s finish with a quick summary. <board page>Summary</board> Great work today!').call, boardPass: false, mathsCheck: false, nowMs: 14 * 60000 });
    check('N2: the summary page is held and its offer names pronunciation, frame budget or not', /Before the summary, there is still the pronunciation part\. Would you like to do it now, or go straight to the summary\?$/.test(rs.spoken) && !rs.state.board.pages.some((pg) => pg.title === 'Summary'), rs.spoken);
    // N3: [text "See you next time!", tool_use end_lesson] refused: the next call gets no blank text block.
    const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
    const n3: V2ModelCall = async (params, onText) => {
      seen.push(structuredClone(params));
      if (seen.length === 1) { onText?.('See you next time!'); return msg([{ type: 'text', text: 'See you next time!' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'x' } }], 'tool_use'); }
      onText?.('What would you like now: more practice, or a question of your own?'); return msg([{ type: 'text', text: 'What would you like now: more practice, or a question of your own?' }], 'end_turn');
    };
    const r3 = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Summary']), studentSaid: 'Thank you.', callModel: n3, boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    const blank = (ms: Anthropic.MessageParam[]) => ms.some((m) => Array.isArray(m.content) && (m.content as Array<{ type: string; text?: string }>).some((c) => c.type === 'text' && !(c.text ?? '').trim()));
    check('N3: the refused close\'s whole text block was the goodbye: the second call carries no blank text block, nor does the stored reply', seen.length === 2 && !blank(seen[1]!.messages) && !blank(r3.state.history) && !/See you next time/.test(JSON.stringify(seen[1]!.messages)), JSON.stringify(seen[1]?.messages.slice(-2)).slice(0, 600));
    // N4: with nothing to drop or hold, the stream is the stream.
    const pieces = ['Good, th', 'at is right. Now', ' the past simple: wh', 'at did you do yesterday?'];
    const o: string[] = []; const pass = new ReplyGate((t) => o.push(t), { dropFrame: false, holdGoodbye: false });
    for (const x of pieces) pass.push(x); pass.flush();
    check('N4: the gate with its work off passes each chunk through as it came', JSON.stringify(o) === JSON.stringify(pieces), o);
    const typed = 'Good, that is right. Next is the past simple. Shall we go on, or do you have a question first? See you next time maybe.';
    const chunks: string[] = []; const sent = typed.match(/[\s\S]{1,17}/g) ?? [];
    await runV2Turn({ session: { ...lang, mode: 'text', plan: GDI }, state: pagesAt(['Lesson overview', 'Present perfect'], { history: spent }), studentSaid: 'I have worked here.', callModel: streaming(typed).call, onText: (d) => chunks.push(d), boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('N4: a typed lesson streams exactly the model\'s chunks, nothing dropped or held', JSON.stringify(chunks) === JSON.stringify(sent), chunks);
    const turnSrc = src('src/lib/tutor/v2/turn.ts');
    check('N4 / minor b: the gate works only in spoken teaching lessons (no homework, no discussion, no typed lesson)', /const teaching = !discussion && !session\.homework && !session\.homeworkSheet;\n\s+const gated = teaching && session\.mode === 'voice';/.test(turnSrc) && /dropFrame: gated && /.test(turnSrc) && /const holdGoodbye = gated && /.test(turnSrc));
  }


  console.log('fix round 3');
  {
    // P1: the reviewer's sequence: overview page → frame → student question → answer → present perfect page → "Good."
    const asked: V2State['history'] = [
      { role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: '<board page>Lesson overview</board> Hello, today we talk about work.' },
      { role: 'user', content: 'I work in sales.' }, { role: 'assistant', content: 'Good. Next is present perfect. Shall we go on, or do you have a question first?' },
      { role: 'user', content: 'What is the present perfect?' }, { role: 'assistant', content: 'It is have plus a past participle, for experience up to now.' },
      { role: 'user', content: 'OK.' }, { role: 'assistant', content: '<board page>Present perfect</board> How long have you worked there?' },
      { role: 'user', content: 'Ten years.' }, { role: 'assistant', content: 'Good.' },
    ];
    check('P1: a frame answered with a question, its page a reply later: asked at the last change, so not due', !v2FrameDue(asked));
    const later: V2State['history'] = [...asked, { role: 'user', content: 'I have worked here ten years.' }, { role: 'assistant', content: 'Good. Next is past simple. Shall we go on?' }, { role: 'user', content: 'Can I ask something?' }, { role: 'assistant', content: 'Of course.' }, { role: 'user', content: 'ok go on' }, { role: 'assistant', content: '<board page>Past simple</board> What did you do yesterday?' }, { role: 'user', content: 'I worked.' }, { role: 'assistant', content: 'Good.' }, { role: 'user', content: 'ok' }, { role: 'assistant', content: '<board page>Conversation</board> Tell me about a project.' }];
    check('P1: …and it counts toward the cap: two such frames, then a change without one, still not due', !v2FrameDue(later));
    const between: V2State['history'] = [asked[0]!, asked[1]!, { role: 'user', content: 'x' }, { role: 'assistant', content: 'Shall we go on?' }, { role: 'user', content: 'wait' }, { role: 'assistant', content: 'Next is present perfect. Shall we go on, or do you have a question first?' }, { role: 'user', content: 'yes' }, { role: 'assistant', content: '<board page>Present perfect</board> Go.' }, { role: 'user', content: 'ok' }, { role: 'assistant', content: 'Good.' }];
    check('P1: two frames before one page count once (the later one), so one of two is spent', !v2FrameDue(between) && (() => { const h: V2State['history'] = [...between, { role: 'user', content: 'ok' }, { role: 'assistant', content: '<board page>Past simple</board> Go.' }, { role: 'user', content: 'ok' }, { role: 'assistant', content: 'Good.' }]; return v2FrameDue(h); })());
    // P2: budget spent, nothing unreached, summary page: it opens, no frame.
    const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation', 'Pronunciation'];
    const spent: V2State['history'] = [
      { role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: '<board page>Lesson overview</board> Hello.' },
      { role: 'user', content: 'ok' }, { role: 'assistant', content: 'Next is your job. Shall we go on, or do you have a question first?' },
      { role: 'user', content: 'yes' }, { role: 'assistant', content: '<board page>Your job</board> What do you do?' },
      { role: 'user', content: 'Sales.' }, { role: 'assistant', content: 'Next is present perfect. Shall we go on?' },
      { role: 'user', content: 'yes' }, { role: 'assistant', content: '<board page>Present perfect</board> Go.' },
      { role: 'user', content: 'ok' }, { role: 'assistant', content: 'Good, that is right.' },
    ];
    check('(setup: budget spent)', !v2FrameDue(spent));
    const st = pagesAt(B, { history: spent, workingLevel: { level: 'beginner', from: 'this_lesson' } } as Partial<V2State>);
    check('(setup: nothing unreached)', v2UnreachedOffer(GDI, st) === null);
    const heard: string[] = [];
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: st, studentSaid: 'I have worked here ten years.', callModel: streaming('Good. Let\'s finish with a quick summary. <board page>Summary</board> You talked about your work.').call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    check('P2: budget spent, all parts reached: the summary page opens with no frame', r.state.board.pages.some((pg) => pg.title === 'Summary') && !/Shall we go on|question first/.test(heard.join('')) && /You talked about your work\./.test(r.spoken), heard.join(''));
    // speakCard only in spoken teaching lessons.
    const disc = src('src/lib/tutor/v2/turn.ts');
    check('cards are spoken in place only in spoken teaching lessons (gated)', /if \(part\.block\.kind === 'sentence' && gated && TUTOR_V2_SAY_SENTENCE_CARD\)/.test(disc));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
