/// <reference types="node" />
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
import { sentenceCardToSay } from '../src/lib/tutor/v2/board-timing';
import { endsAsking, mayOpenPart, partOffer, v2QuestionCheckRecent } from '../src/lib/tutor/v2/part-close';
import { v2StopAsked } from '../src/lib/tutor/v2/stop-signal';
import { v2PassedPartFact, v2UnreachedAtClose, v2UnreachedAtCloseFact, v2UnreachedOffer } from '../src/lib/tutor/v2/plan-map';
import { renderFacts, v2QuestionCheckFact } from '../src/lib/tutor/v2/facts';
import { v2LanguagesSection, v2RetryFacts } from '../src/lib/tutor/v2/languages';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import {
  TUTOR_V2_CHECK_MISHEARD, TUTOR_V2_HEARD_NOISE, TUTOR_V2_PART_OFFER_ONCE, TUTOR_V2_PASSED_PART_CLOSE, TUTOR_V2_PERSONA_CARD, TUTOR_V2_SAY_SENTENCE_CARD,
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

    const withQ: V2State['history'] = [
      { role: 'user', content: 'I am ready.' }, { role: 'assistant', content: 'Good. Next is present perfect. Shall we go on, or do you have a question first?' },
      { role: 'user', content: 'Yes.' }, { role: 'assistant', content: '<board page>Present perfect</board> We use it for experience. How long have you worked there?' },
      { role: 'user', content: 'I have worked here ten years.' }, { role: 'assistant', content: 'Nearly: we say "for ten years". Say it once more?' },
    ];
    const withoutQ: V2State['history'] = withQ.map((h, i) => (i === 1 ? { role: 'assistant' as const, content: 'Good. Next is present perfect. Shall we go on?' } : h));
    check('the last part change asked it: seen', v2QuestionCheckRecent(withQ) && !v2QuestionCheckRecent(withoutQ) && !v2QuestionCheckRecent([]));
    check('the offer then asks only to go on; otherwise the whole frame', partOffer('Past simple', false, false) === 'Next is past simple. Shall we go on?' && partOffer('Past simple', false) === 'Next is past simple. Shall we go on, or do you have a question first?' && partOffer('Past simple', true, false) === 'Shall we go on?');
    const reply = 'Yes, that is right: for ten years. <board page>Past simple</board> Now the past simple.';
    const held = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Level check', 'Present perfect'], { history: withQ }), studentSaid: 'I have worked here for ten years.', callModel: streaming(reply).call, boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('in a whole turn: the held page\'s offer drops the question check after a part change that asked it', /Next is past simple\. Shall we go on\?$/.test(held.spoken) && !/question first/.test(held.spoken), held.spoken);
    const heldAgain = await runV2Turn({ session: lang, state: pagesAt(['Lesson overview', 'Level check', 'Present perfect'], { history: withoutQ }), studentSaid: 'I have worked here for ten years.', callModel: streaming(reply).call, boardPass: false, mathsCheck: false, nowMs: 8 * 60000 });
    check('…and asks it again at the change after one that did not', /Shall we go on, or do you have a question first\?$/.test(heldAgain.spoken), heldAgain.spoken);
    const f = v2QuestionCheckFact({ ...newV2State(0), history: withQ });
    check('the facts say so, for the frame the tutor writes itself', f.length === 1 && /the last part change asked whether they had a question first: when this part closes, name what comes next and ask only whether to go on/.test(f[0]!) && renderFacts({ ...lang, plan: GDI }, { ...newV2State(0), history: withQ }, { nowMs: 60000, heard: 'ok' }).includes('the last part change asked whether they had a question first'));
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
    const at = (min: number, more: Partial<V2Session> = {}) => renderFacts({ ...session, ...more }, b, { nowMs: min * 60000, heard: 'Yes.' });
    check('in the facts: none at minute 10 of 20, "near" at 17.6, "closing" at 19 or past the wrap minute', !/not reached/.test(at(10)) && /was not reached: before the summary, offer it in one line/.test(at(17.6)) && /no time for it now/.test(at(19)) && /no time for it now/.test(at(12, { wrapMinutes: 11 })), at(17.6).slice(0, 900));
    check('beside the passed-part line it is not repeated', !/not reached/.test(renderFacts(session, pagesAt([...B, 'Summary'], { goals, ...level }), { nowMs: 17 * 60000, heard: 'ok' })));
    const t26 = "Your duties came across clearly. We're nearly out of time, so let's finish with a quick summary. <board page>Summary</board> Great work today!";
    const r = await runV2Turn({ session, state: pagesAt(B, { goals, ...level, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'After "will", use the base verb. Can you say the sentence again?' }] }), studentSaid: 'My responsibility in sales area is contact for our client.', callModel: streaming(t26).call, boardPass: false, mathsCheck: false, nowMs: 17.6 * 60000 });
    check('tester B t26 in a whole turn: the summary page is held and the offer names pronunciation', /Before the summary, there is still the pronunciation part\. Would you like to do it now, or go straight to the summary\?$/.test(r.spoken) && r.state.board.pages.length === B.length && !/Great work/.test(r.spoken), r.spoken);
  }

  console.log('6. a word that makes no sense is checked first (tester B: "my lover", "I met some")');
  {
    const line = 'When a word in their sentence makes little sense where it stands, or one seems to be missing, the recogniser may have misheard: ask "Did you say …?" with the word you think they said, before you correct the sentence or call it right.';
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

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
