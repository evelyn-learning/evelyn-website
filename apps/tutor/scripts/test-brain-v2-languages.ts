/// <reference types="node" />
/**
 * Tutor brain v2 — two teaching languages, the bilingual section of the session part, Japanese in the voice
 * client (sentence cuts, own-voice echo, mixed-language speech) and the student's stop. No network.
 *   npm run test:brain-v2-languages
 *
 * The learner lines are paraphrased from the v1 live sessions (docs/superpowers/plans/2026-11-15-gdi-v1-live-sessions-findings.md).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { v2LanguagesSection, v2RetryFacts, v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { V2_NO_PICK_UP_LINE, renderFacts, v2LastOpener, v2OpenerFact, v2OpenerOf } from '../src/lib/tutor/v2/facts';
import { TUTOR_V2_OPENER_FACT, TUTOR_V2_PERSONA_CARD, TUTOR_V2_PRACTICE_VERDICT, TUTOR_V2_RETRY_COUNT } from '../src/lib/tutor/orchestrator/flags';
import { v2StopAsked } from '../src/lib/tutor/v2/stop-signal';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { runV2Turn, v2PersonaCardLines, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session } from '../src/lib/tutor/v2/types';
import { streamV2Turn } from '../src/lib/tutor/v2/client';
import { splitSentenceForTts } from '../src/lib/tutor/voice/tts-language';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); return r; };
  return { call, seen };
}

const bilingual: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'] };

async function main() {
  console.log('the bilingual section');
  const ja = v2LanguagesSection(['en', 'ja']) ?? '';
  check('an English-only session has none', v2LanguagesSection(undefined) === null && v2LanguagesSection(['en']) === null && !/TWO LANGUAGES/.test(v2SessionPart({ ...bilingual, languages: undefined })));
  check('English and Japanese: the section is in the session part, after the mode lines', v2SessionPart(bilingual).includes(ja) && v2SessionPart(bilingual).indexOf(ja) > v2SessionPart(bilingual).indexOf('spoken conversation'));
  check('it names the target and the support language from the session\'s languages', /English/.test(ja) && /Japanese/.test(ja));
  check('the amount of help follows the working level: beginners the most, intermediate (incl. lower-intermediate) short explanations, advanced little', /Beginner: the most help: explanations, instructions and corrections in Japanese/.test(ja) && /Intermediate: explanations in Japanese when they help, a sentence or two, then straight back to English/.test(ja) && /Advanced: little: English throughout/.test(ja), ja);
  check('help is short and the tutor returns to the target after it (a learner who asked once got Japanese for the rest of the lesson)', /short/i.test(ja) && /back to English/i.test(ja) && /does not switch/i.test(ja));
  check('the learner produces the sentence, not repeats it', /build the sentence/i.test(ja) && /Repeating after you is not practice/i.test(ja));
  check('one error corrected, two tries, a correct sentence is never "close" (case 12)', /one error that matters most/i.test(ja) && /two tries/i.test(ja) && /never call it close/i.test(ja));
  check('one closing turn on a stop', /that reply is the close/i.test(ja) && /no new question/i.test(ja));
  check('one error per answer, small slips pass, by their level; two tries, then the tutor says it and goes on (D5)', /one error that matters most in each answer/.test(ja) && /small slips that leave the meaning clear pass without comment, more of them the lower their working level/.test(ja) && /after the second, say the correct sentence yourself and go on/.test(ja), ja);
  check('"right" only for right words; a quote is what they said, the correction is the tutor\'s (D3)', /Say a sentence is right only when their words are right/.test(ja) && /quote what they actually said/.test(ja) && /never put in their mouth/.test(ja), ja);
  check('D10 is not a constitution line (review I2: it made "Correct." the stock opener)', !/Open a reply with its content/.test(V2_CONSTITUTION) && /Right is "yes, that's right"/.test(V2_CONSTITUTION));
  {
    const h = (text: string) => ({ ...newV2State(0), history: [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: [{ type: 'text' as const, text }] }] });
    check('the last reply\'s opener: up to the first mark', v2LastOpener(h('Correct. "Was eating" is the action in progress.').history) === 'Correct' && v2LastOpener(h('Yes, that\'s right: "I have been to Singapore."').history) === 'Yes' && v2LastOpener(h('<board page>Verbs</board>Your sentences are correct: both use the past.').history) === 'Your sentences are correct');
    check('a cut-off marker is never the opener (final review M4)', v2LastOpener(h('[cut off here: the student began to speak]').history) === '' && v2LastOpener(h('Good, now say it [cut off here: the student began to speak]').history) === 'Good');
    const fo = renderFacts(bilingual, h('Correct. Next row: "see, saw, ?".'), { nowMs: 60000, heard: 'seen' });
    check('the facts name it, every turn (D10, review I2)', fo.includes('your last reply opened with "Correct": open this one differently, or go straight to the content'), fo.slice(-500));
    check('no line at the opening, in a discussion, or with the kill switch off', v2OpenerFact(bilingual, newV2State(0)).length === 0 && v2OpenerFact(bilingual, h('Correct.'), false).length === 0 && TUTOR_V2_OPENER_FACT === true);
    // Task 8h follow-up (controller's ruling): a spoken language lesson only; an English-only maths lesson gets no opener line, as on
    // main 11843955 (was: it got the line too).
    check('an English-only maths lesson gets none (main\'s facts)', v2OpenerFact({ ...bilingual, languages: undefined, subject: 'math' }, h('Yes, 8 volts.')).length === 0);
  }
  check('the constitution: without a persona card the tutor has no job or life story of its own (D4, Task 6c ruling 2)', /Unless this session gives you a persona card, you have no job, projects or life story of your own: if asked, say so briefly and turn back to them/.test(V2_CONSTITUTION) && TUTOR_V2_PERSONA_CARD === true);

  console.log('a practice sentence is right only when fully right (Task 6c, ruling 1)');
  {
    check('slips pass in free conversation only', /let the rest go: in free conversation, small slips that leave the meaning clear pass without comment/.test(ja), ja);
    const practice = ja.split('\n').find((l) => l.startsWith('A sentence they produce as practice')) ?? '';
    check('a practice sentence (a retry, or an answer to a practice question) is right only when fully right, one error corrected', practice.startsWith('A sentence they produce as practice (a retry after your correction, or their answer to a practice question on the point this part teaches) is right only when it is fully right; still correct only one error in it.'), practice);
    check('an error in the form taught: one retry, and the two-try cap said plainly (fix round 1, I2)', practice.includes('When the error is in the form this part teaches: name it and ask them to say the sentence once more. At most two tries at one sentence: after the second, say the correct sentence yourself and go on to the next thing.'), practice);
    // Task 6e (7): the example opened with "Good" on a sentence it says not to call right.
    check('only a slip outside the form: not called right, the fix in one clause with no praise word, no retry asked for', practice.includes('When the only error is a slip outside that form: don\'t call the sentence right; give the fix in one short clause ("One small thing: we say \'…\'.") and go on, with no retry asked for.') && !/"Good, and we say/.test(practice), practice);
    check('nothing says a fix does not count as a try (fix round 1, I2: tester A asked for "I met…" about seven times)', !/does not count as (another|a) try|doesn't count/i.test(ja), ja);
    check('the two-try cap is stated once, in the practice line', (ja.match(/At most two tries at one sentence/g) ?? []).length === 1);
    check('the line is generic: no lesson words in it', !/eleven|company|years/i.test(ja.split('\n').find((l) => l.startsWith('A sentence they produce as practice')) ?? 'eleven'));
    const off = v2LanguagesSection(['en', 'ja'], 'voice', { practiceVerdict: false }) ?? '';
    check('NEXT_PUBLIC_TUTOR_V2_PRACTICE_VERDICT=off: the correction line as it was (with its two-try cap), and no practice line', !/A sentence they produce as practice/.test(off) && off.includes('Correct the one error that matters most in each answer, for what this part practises, and let the rest go: small slips that leave the meaning clear pass without comment, more of them the lower their working level. Check the error is really in their words before you name it. At most two tries at one sentence: after the second, say the correct sentence yourself and go on to the next thing. A correct sentence is correct: say so, and never call it close.') && TUTOR_V2_PRACTICE_VERDICT === true, off);
    check('a session part with the flag default carries it', v2SessionPart(bilingual).includes('is right only when it is fully right'));
  }

  console.log('the persona card (Task 6c, ruling 2)');
  {
    const ryota = { name: 'Ryota', style: 'Calm and encouraging.', intro: 'I help Japanese professionals start speaking English with confidence.', background: 'I have taught English in Nagoya for eight years. My students are working adults at Japanese companies.' };
    const withCard = v2SessionPart({ ...bilingual, teacher: ryota });
    check('a persona with a background: the card is in the session part, intro then background', withCard.includes(`Your persona card (who you are): ${ryota.intro} ${ryota.background}`), withCard.slice(0, 900));
    check('the rule: answer briefly from the card, never volunteer it, stay consistent, only fitting small details, then turn back', /When they ask about you, answer briefly from this card and turn back to them; never bring it up yourself\. Stay consistent with it for the whole session: a small everyday detail may be added only when it fits the card, never a job, place, history or student group the card does not give\./.test(withCard));
    check('the card sits right after the teacher line', withCard.indexOf('Your persona card') > withCard.indexOf('You are Ryota') && withCard.indexOf('Your persona card') < withCard.indexOf('TWO LANGUAGES'));
    const noBg = v2SessionPart({ ...bilingual, teacher: { name: 'Ryota', style: 'Calm.', intro: 'I help.' } });
    check('no background, no card (an intro alone changes nothing: marketing personas stay as they are)', !/persona card/.test(noBg) && noBg === v2SessionPart({ ...bilingual, teacher: { name: 'Ryota', style: 'Calm.' } }));
    check('kill switch off: no card', v2PersonaCardLines(ryota, false).length === 0 && v2PersonaCardLines(ryota).length === 2 && v2PersonaCardLines(undefined).length === 0);
    const disc = v2SessionPart({ ...bilingual, teacher: ryota, plan: { id: 'd', title: 'd', los: [], segments: [], estimatedMinutes: 10, metadata: { kind: 'discussion', participant: 'a teacher', orientation: 'cars in cities', cases: [{ id: 'c1', scenario: 'A city bans cars.' }] } } as unknown as V2Session['plan'] });
    check('a discussion session part carries it too', /^THIS SESSION\nPerson:/.test(disc) && disc.includes('Your persona card (who you are): '), disc.slice(0, 400));
  }

  console.log('a repeated frame around a quote is seen (Task 6c, ruling 4)');
  {
    // gdi-real-james 4.9–8.7 min: 14 of 17 replies opened 「…」は正しい文です, each with a different quote.
    const JAMES = ['「I make cars.」は正しい文です。とても良いです。', '「I work with customers from Germany and America.」は正しい文です。ドイツとアメリカのお客さんと今も仕事をしている、と話せました。', '「I have worked here for seven years.」は正しい文です。今も同じ会社で働いている経験を話せました。', '「I have learned time management.」は正しい文です。今も続いている経験を話せました。'];
    const hist = (replies: string[]) => ({ ...newV2State(0), history: replies.flatMap((text, i) => [{ role: 'user' as const, content: `answer ${i}` }, { role: 'assistant' as const, content: [{ type: 'text' as const, text }] }]) });
    check('a leading 「…」 quote is set aside: the opener is the frame after it', v2OpenerOf(JAMES[0]!) === '「…」は正しい文です' && v2LastOpener(hist(JAMES).history) === '「…」は正しい文です', v2OpenerOf(JAMES[0]!));
    check('straight and curly quotes too; an apostrophe that is not a quote is left alone', v2OpenerOf('"I went to Osaka" is right. Now tell me more.') === '"…" is right' && v2OpenerOf('“I went” is correct.') === '“…” is correct' && v2OpenerOf("'Cause it's late, go on.") === "'Cause it's late");
    check('a reply that is only a quote: the frame', v2OpenerOf('「はい」') === '「…」');
    check('a 。 after the closing quote stays in the frame (fix round 1): 「…」。は… and a bare 「…」。', v2OpenerOf('「I make cars.」。は正しい文です。') === '「…」。は正しい文です' && v2OpenerOf('「I make cars.」。') === '「…」。' && v2OpenerOf('「I attended Comdex.」。') === v2OpenerOf('「I make cars.」。') && v2OpenerOf('「I make cars.」。とても良いです。') === '「…」。とても良いです');
    {
      const hq = (replies: string[]) => ({ ...newV2State(0), history: replies.flatMap((text, i) => [{ role: 'user' as const, content: `a ${i}` }, { role: 'assistant' as const, content: [{ type: 'text' as const, text }] }]) });
      check('a run of bare 「…」。 replies is seen', v2OpenerFact(bilingual, hq(['「I make cars.」。', '「I attended Comdex.」。']))[0]!.startsWith('your last 2 replies opened with "「…」。"'));
    }
    check('plain openers as before', v2OpenerOf('Correct. "Was eating" is it.') === 'Correct' && v2OpenerOf('その文で正しいです。 more') === 'その文で正しいです');
    const f2 = v2OpenerFact(bilingual, hist(JAMES.slice(0, 2)));
    check('two replies in a row with the frame: the fact names the frame and how many, and asks for a reaction, a confirmation only for the form in practice', f2.length === 1 && f2[0]!.startsWith('your last 2 replies opened with "「…」は正しい文です": open this one differently.') && /React to what they said and keep the conversation moving; a confirmation only when they were practising the form being taught, and then in other words/.test(f2[0]!), f2);
    check('the James run of four: "your last 4 replies"', v2OpenerFact(bilingual, hist(JAMES))[0]!.startsWith('your last 4 replies opened with "「…」は正しい文です"'));
    check('a different opener in between breaks the run: the single-reply line, as before', v2OpenerFact(bilingual, hist([JAMES[0]!, 'その文で正しいです。', JAMES[1]!]))[0] === 'your last reply opened with "「…」は正しい文です": open this one differently, or go straight to the content');
    const fr = renderFacts(bilingual, hist(JAMES), { nowMs: 60000, heard: 'I attended six exhibitions last year.' });
    check('the facts carry it', fr.includes('your last 4 replies opened with "「…」は正しい文です"'), fr.slice(-600));
  }

  console.log('tries at one sentence are counted (D5)');
  {
    const said = (xs: string[]) => xs.flatMap((x) => [{ role: 'user' as const, content: [{ type: 'text' as const, text: x }] }, { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Not quite. Try that again.' }] }]);
    // upper-int t12–t16 (Task 6): one sentence tried again and again.
    const h = said(['[The session has just started.]', 'My main responsibility in sales area to the contact for the clients.', 'I am managing the team and I have to checking the sales performance every month and reporting for the director about the progress.']);
    const second = v2RetryFacts(['en', 'ja'], h, 'I have to check the sales performance every month and reporting for the director about the progress.');
    check('upper-int t16: try 2, so the correct sentence comes next', second.length === 1 && /try 2 at the sentence/.test(second[0]!) && /say the correct sentence yourself now and go on/.test(second[0]!), second);
    const third = v2RetryFacts(['en', 'ja'], [...h, ...said(['I have to check the sales performance every month and reporting for the director about the progress.'])], 'I have to check the sales performance every month and report to the director about the progress.');
    check('…and a third is counted as 3', /try 3/.test(third[0] ?? ''), third);
    check('a new answer is no retry', v2RetryFacts(['en', 'ja'], h, 'Last week I visited a customer in Osaka.').length === 0);
    check('a short reply is never a retry ("Yes." after "Yes.")', v2RetryFacts(['en', 'ja'], said(['Yes.']), 'Yes.').length === 0);
    check('one language, or the kill switch off: no line', v2RetryFacts(['en'], h, 'I have to check the sales performance every month.').length === 0 && v2RetryFacts(['en', 'ja'], h, 'I have to check the sales performance every month.', false).length === 0 && TUTOR_V2_RETRY_COUNT === true);
    const f = renderFacts(bilingual, { ...newV2State(0), history: h }, { nowMs: 60000, heard: 'I have to check the sales performance every month and reporting for the director about the progress.' });
    check('the line reaches the facts', /tries: their words just now are try 2/.test(f), f.slice(-600));
  }
  check('the recogniser line is for spoken lessons only', /speech recogniser/.test(ja) && !/speech recogniser/.test(v2LanguagesSection(['en', 'ja'], 'text') ?? ''));
  check('Japanese only: polite です/ます and no romaji', /です\/ます/.test(ja) && /romaji/i.test(ja));
  const es = v2LanguagesSection(['en', 'es']) ?? '';
  check('another support language is named, without the Japanese-only lines', /Spanish/.test(es) && !/です|romaji|Japanese/.test(es));
  check('the section names no partner', !/gdi|nagoya|josh|james/i.test(ja));
  // Task 8h (ruling 4): the "pick up here" line moved from the shared constitution to a part-flow lesson's facts (was: in V2_CONSTITUTION).
  check('the constitution stays generic and says the next lesson does not open at this point', !/gdi|japanese/i.test(V2_CONSTITUTION) && !/don't promise it|pick up here/.test(V2_CONSTITUTION) && !/short review/.test(V2_CONSTITUTION) && /don't promise it: the next lesson does not open where this one stopped/.test(V2_NO_PICK_UP_LINE) && !/short review/.test(V2_NO_PICK_UP_LINE)); // final review I2: no review promised to a tenant without lesson memory

  console.log('Japanese sentences for speech');
  const feed = (pieces: string[]) => { const ss = new SentenceStream(); const got: string[] = []; for (const x of pieces) got.push(...ss.push(x)); return [got, ss.flush()] as const; };
  const [j1, jf1] = feed(['はい、そうです。次は過去形', 'を練習しましょう。いいですか？準備は']);
  check('cuts after 。 and ？ with no space after them', j1.join('|') === 'はい、そうです。|次は過去形を練習しましょう。|いいですか？' && jf1.join() === '準備は', [j1, jf1]);
  const [j2, jf2] = feed(['「はい。', '」と言ってください。']);
  check('a full stop inside a quotation does not end the sentence', j2.length === 0 && jf2.join() === '「はい。」と言ってください。', [j2, jf2]);
  const [j3] = feed(['Good! 「I have worked here for three years.」ですね。Next one. ']);
  check('mixed English and Japanese', j3.join('|') === 'Good!|「I have worked here for three years.」ですね。|Next one.', j3);
  const [q1, qf1] = feed(['「Yes. I do.」と言いましょう。', 'では次。']);
  check('an English model of two sentences inside 「」 is not cut', q1.join('|') === '「Yes. I do.」と言いましょう。' && qf1.join() === 'では次。', [q1, qf1]);
  const [e1] = feed(['It is 3.5 metres. Next. ']);
  check('English cuts are unchanged', e1.join('|') === 'It is 3.5 metres.|Next.', e1);

  console.log('the tutor\'s own Japanese is recognised as echo');
  const said = ['では、次の文を英語で言ってみてください。', '「私は三年間ここで働いています」を英語でどう言いますか？'];
  check('a Japanese echo of the tutor is its own voice', isOwnVoice('次の文を英語で言ってみてください', said));
  check('a longer echo with a slip is still its own voice', isOwnVoice('私は3年間ここで働いていますを英語でどう言いますか', said));
  check('a short Japanese reply is never an echo', !isOwnVoice('はい、そうです', ['はい、そうですね。']));
  check('the student\'s own Japanese is not an echo', !isOwnVoice('すみません、もう一度ゆっくり説明してください', said));
  check('English echo is unchanged', isOwnVoice('how do you say this in English', ['How do you say this in English?']) && !isOwnVoice('yes', ['yes it is']));
  check('a partial echo of a few Japanese characters pauses nothing (every one was said)', isOwnVoice('言ってみて', said, 1, 1) && !isOwnVoice('わかりません', said, 1, 1));
  // Final review I1: only a CJK character or number the tutor did not say is passed over; a student's added English words are theirs.
  const deriv = ['So the derivative of x squared is two x.'];
  check('a student adding words before the tutor\'s sentence is not an echo', !isOwnVoice('wait so the derivative of x squared is two x right', deriv));
  check('a student disagreeing in the tutor\'s words is not an echo', !isOwnVoice('No I think the derivative of x squared is two x', deriv));
  check('a learner saying the model sentence back with words of their own is not an echo', !isOwnVoice('Um I went to Kyoto last weekend with my family', ['Please say it back to me: I went to Kyoto last weekend.']));
  check('a number the tutor said in words is still passed over', isOwnVoice('the answer is 3 metres per second', ['The answer is three metres per second.']));
  check('with NEXT_PUBLIC_TUTOR_V2_OWN_VOICE_SKIP=off nothing is passed over, as before', !isOwnVoice('私は3年間ここで働いていますを英語でどう言いますか', said, 4, 0.7, false) && !isOwnVoice('the answer is 3 metres per second', ['The answer is three metres per second.'], 4, 0.7, false));

  console.log('mixed-language speech');
  const mixed = '「My manager showed me slogans he had written earlier」ですね、具体的でいい答えです。';
  check('a Japanese sentence quoting an English span is spoken in parts', JSON.stringify(v2SpeechParts(mixed, ['en', 'ja'])) === JSON.stringify(splitSentenceForTts(mixed, ['en', 'ja']).map((p) => p.text)) && v2SpeechParts(mixed, ['en', 'ja']).length > 1);
  check('an English-only session speaks a sentence whole', JSON.stringify(v2SpeechParts(mixed, undefined)) === JSON.stringify([mixed]) && JSON.stringify(v2SpeechParts('Great, let\'s begin.', ['en', 'ja'])) === JSON.stringify(['Great, let\'s begin.']));

  console.log('the student\'s stop');
  const stops = ['Okay, please stop. I would like to end the session for now.', 'Sorry, I have to finish now.', 'No, I\'m finished. I have to go.', '今日はここまでにします', '今日はここまで', '今日はここまで。', 'お疲れ様でした', '終わりにしましょう', 'もう終わりにしたいです', 'すみません、今日はここまでにしてください', 'ありがとうございました。今日はもう終わりにします。',
    // Polite requests and reasons (re-review 1 of dfaae1ea): "Can we stop here?" is a stop in English, and these are its Japanese.
    'すみません、今日はここまでにしてもいいですか', 'すみません、今日はここまでにしてもいいですか？', '今日はここまでにさせてください', '今日は疲れたので終わりにします',
    'ありがとうございました、さようなら', 'お疲れ様でした、ありがとうございました', '終わりにしてもよろしいですか？', 'じゃあ、そろそろ終わりにさせていただきます', 'Sorry, I have to finish now. ありがとうございました'];
  for (const s of stops) check(`a stop: "${s}"`, v2StopAsked(s));
  const notStops = ['ちょっと待ってください', 'お疲れ様です', 'I have to finish the report on Friday.', 'Can we continue from this point next time?', 'I usually stop working at six.', 'Could you explain that in Japanese?', '[The student has not replied.]',
    // Japanese lesson talk with an end word in it (review of 6971a0b0): a question, a sentence to translate, quoted speech, a comment on the lesson.
    'もう終わりですか？', 'もう終わりですか', '会議を終わりにします', 'さようなら、と言います', '「さようなら」と言います', '今日はここまでの内容は難しかったです', 'また次回続けられますか？', 'また次回続けられますか', '仕事が終わりました',
    'もう終わりですか？ありがとうございました', '会議は五時なので終わりにしますと言いました', 'ここまでの説明でいいですか？', '仕事を終わりにしてもいいですか？', '疲れたので会議を終わりにします',
    '「今日はここまでにしてもいいですか」と言います', 'How do you say やめて in English?'];
  for (const s of notStops) check(`not a stop: "${s}"`, !v2StopAsked(s));

  console.log('a stop closes in one turn');
  const at3min = 1_000_000 + 3 * 60000;
  const s0 = { ...newV2State(1_000_000), history: [{ role: 'user', content: '[The session has just started.]' }, { role: 'assistant', content: 'Hello Ken. Tell me about your work.' }] } as ReturnType<typeof newV2State>;
  const closeReply = () => msg([{ type: 'text', text: 'You practised the present perfect today. Goodbye, Ken!' }, { type: 'tool_use', id: 'e1', name: 'end_lesson', input: { because: 'time_nearly_used', summary: 'Present perfect with for and since.' } }], 'tool_use');
  for (const line of ['Sorry, I have to finish now.', 'Okay, please stop. I would like to end the session for now.', '今日はここまで']) {
    const st = stub([closeReply()]);
    const r = await runV2Turn({ session: bilingual, state: s0, studentSaid: line, nowMs: at3min, callModel: st.call, mathsCheck: false, boardPass: false });
    const facts = ((st.seen[0].messages.at(-1)!.content as Array<{ text: string }>)[1]).text;
    check(`"${line}" at minute 3 of 20: the facts say so and the close is not refused`, /asked to end the session/.test(facts) && r.state.closed && r.modelCalls === 1, [facts.slice(0, 300), r.state.closed, r.toolCalls.map((t) => t.outcome)]);
  }
  {
    const st = stub([closeReply(), msg([{ type: 'text', text: 'Take your time.' }], 'end_turn')]);
    const r = await runV2Turn({ session: bilingual, state: s0, studentSaid: 'ちょっと待ってください', nowMs: at3min, callModel: st.call, mathsCheck: false, boardPass: false });
    const facts = ((st.seen[0].messages.at(-1)!.content as Array<{ text: string }>)[1]).text;
    check('「ちょっと待ってください」 is a pause: no stop fact, and an early close is refused', !/asked to end the session/.test(facts) && !r.state.closed, [facts.slice(0, 200), r.toolCalls.map((t) => t.outcome)]);
  }
  {
    const st = stub([msg([{ type: 'text', text: 'Yes.' }], 'end_turn')]);
    await runV2Turn({ session: bilingual, state: s0, studentSaid: 'Yes.', nowMs: at3min, callModel: st.call, mathsCheck: false, boardPass: false });
    const system = (st.seen[0].system as Array<{ text: string }>).map((b) => b.text).join('\n');
    check('the model is sent the bilingual section', system.includes(v2LanguagesSection(['en', 'ja'])!));
  }

  console.log('languages reach the server');
  let body: Record<string, unknown> | null = null;
  const enc = new TextEncoder();
  const fetchImpl = (async (_url: string, init: { body: string }) => { body = JSON.parse(init.body); return new Response(new ReadableStream({ start(c) { c.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'done', spoken: '', state: s0, usage: {}, firstTextMs: 0, totalMs: 0 })}\n\n`)); c.close(); } }), { status: 200 }); }) as unknown as typeof fetch;
  await streamV2Turn({ session: { subject: 'English', level: 'adult', mode: 'voice', languages: ['en', 'ja'] }, state: s0, studentSaid: 'hi', fetchImpl });
  check('the client posts the session\'s languages', JSON.stringify((body as unknown as { session: { languages?: string[] } }).session.languages) === '["en","ja"]');
  const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
  check('the route reads them through parseTutorLanguages', /parseTutorLanguages\(cfg\.languages\)/.test(src('src/app/api/tutor/brain-v2/turn/route.ts')));
  check('the turn loop sends the session\'s tutor languages', /languages: p\.current\.tutorLanguages/.test(src('src/app/tutor/components/v2/useV2Turns.ts')));
  check('the voice client speaks each sentence in its language parts', /v2SpeechParts\(/.test(src('src/app/tutor/components/v2/TutorVoiceV2.tsx')));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
