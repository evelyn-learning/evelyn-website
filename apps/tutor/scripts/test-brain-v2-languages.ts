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
import { v2LanguagesSection, v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2StopAsked } from '../src/lib/tutor/v2/stop-signal';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { isOwnVoice } from '../src/lib/tutor/v2/own-voice';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
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
  check('the amount of help follows the working level: beginners get it, others little', /Beginner: explanations and instructions in Japanese/.test(ja) && /Advanced: English throughout/.test(ja));
  check('help is short and the tutor returns to the target after it (a learner who asked once got Japanese for the rest of the lesson)', /short/i.test(ja) && /back to English/i.test(ja) && /does not switch/i.test(ja));
  check('the learner produces the sentence, not repeats it', /build the sentence/i.test(ja) && /Repeating after you is not practice/i.test(ja));
  check('one error corrected, two tries, a correct sentence is never "close" (case 12)', /one error that matters most/i.test(ja) && /two tries/i.test(ja) && /never call it close/i.test(ja));
  check('one closing turn on a stop', /that reply is the close/i.test(ja) && /no new question/i.test(ja));
  check('the recogniser line is for spoken lessons only', /speech recogniser/.test(ja) && !/speech recogniser/.test(v2LanguagesSection(['en', 'ja'], 'text') ?? ''));
  check('Japanese only: polite です/ます and no romaji', /です\/ます/.test(ja) && /romaji/i.test(ja));
  const es = v2LanguagesSection(['en', 'es']) ?? '';
  check('another support language is named, without the Japanese-only lines', /Spanish/.test(es) && !/です|romaji|Japanese/.test(es));
  check('the section names no partner', !/gdi|nagoya|josh|james/i.test(ja));
  check('the constitution stays generic and says the next lesson does not open at this point', !/gdi|japanese/i.test(V2_CONSTITUTION) && /don't promise it/.test(V2_CONSTITUTION) && /short review/.test(V2_CONSTITUTION));

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
