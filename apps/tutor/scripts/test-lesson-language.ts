/* Lesson taught in another language: the table, the session list, the voice language, the spoken notation. */
import assert from 'node:assert/strict';
import { lessonLanguageOf, taughtIn, lessonVoiceId, sessionRecogniser, baseLanguage } from '../src/lib/tutor/voice/lesson-language';
import { parseTutorLanguages, ttsLanguageFor, splitSentenceForTts } from '../src/lib/tutor/voice/tts-language';
import { speakNotation, lessonSpeech } from '../src/lib/tutor/voice/lesson-speech';
import { sessionAllowsNonLatin } from '../src/lib/tutor/voice/transcript-filters';
import { v2CanRunSession } from '../src/lib/tutor/portal/partner-session-options';
import { heardNumerals, numeralValue } from '../src/lib/tutor/voice/heard-numerals';
import { v2LessonLines, V2_LESSON_CHECK_INS, v2HoldsLessonPartAsk } from '../src/lib/tutor/v2/lesson-lines';
import { heardNumberWords, numberWordsValue, numberWordLanguages } from '../src/lib/tutor/voice/heard-number-words';
import { heardDigits } from '../src/lib/tutor/voice/heard-script';
import { classifyTranscript } from '../src/lib/tutor/voice/transcript-filters';
import { gistGrounded, splitSentences } from '../src/lib/tutor/question-gist-text';
import { partOffer } from '../src/lib/tutor/v2/part-close';
import { v2HandsOverInItsLanguage, v2ReplyAsks } from '../src/lib/tutor/v2/one-question';

let n = 0; const t = (name: string, f: () => void) => { f(); n++; console.log('PASS', name); };

t('codes resolve to rows', () => {
  assert.equal(lessonLanguageOf('zh-TW')?.code, 'zh-TW'); assert.equal(lessonLanguageOf('zh_tw')?.code, 'zh-TW');
  assert.equal(lessonLanguageOf('ZH-Hant')?.code, 'zh-TW'); assert.equal(lessonLanguageOf('zh')?.code, 'zh-CN');
  assert.equal(lessonLanguageOf('ja-JP')?.code, 'ja'); assert.equal(lessonLanguageOf('en-GB')?.code, 'en');
  assert.equal(lessonLanguageOf('xx'), null); assert.equal(lessonLanguageOf(7), null);
  assert.equal(baseLanguage('zh-TW'), 'zh');
});
t('an English lesson with a second language is unchanged', () => {
  assert.deepEqual(parseTutorLanguages(['en', 'ja']), ['en', 'ja']); assert.deepEqual(parseTutorLanguages('ja,en'), ['en', 'ja']);
  assert.equal(parseTutorLanguages(['en']), null); assert.equal(parseTutorLanguages(['xx']), null); assert.equal(parseTutorLanguages(undefined), null);
  assert.equal(taughtIn(['en', 'ja']), null);
  assert.equal(ttsLanguageFor('こんにちは', ['en', 'ja']), 'ja'); assert.equal(ttsLanguageFor('Hello there.', ['en', 'ja']), 'en');
  assert.equal(ttsLanguageFor('漢字', ['en', 'ja']), 'ja'); assert.equal(ttsLanguageFor('Hello', undefined), undefined);
  assert.equal(splitSentenceForTts('「My manager showed me slogans」ですね。', ['en', 'ja']).length, 2);
});
t('a list without English is a lesson taught in its first language', () => {
  assert.deepEqual(parseTutorLanguages(['zh-TW']), ['zh-TW']); assert.deepEqual(parseTutorLanguages('zh-Hant'), ['zh-TW']);
  assert.deepEqual(parseTutorLanguages(['ja']), ['ja']); assert.deepEqual(parseTutorLanguages(['zh-TW', 'zh-CN']), ['zh-TW']);
  assert.equal(taughtIn(['zh-TW'])?.code, 'zh-TW'); assert.equal(taughtIn(['ja'])?.base, 'ja');
  assert.equal(parseTutorLanguages(['zh-TW']), parseTutorLanguages(['zh-tw']), 'one shared array per set');
});
t('the voice language of a sentence', () => {
  assert.equal(ttsLanguageFor('所以 x 等於 4。', ['zh-TW']), 'zh'); assert.equal(ttsLanguageFor('x = 4', ['zh-TW']), 'zh');
  assert.equal(ttsLanguageFor('エックスは四です。', ['ja']), 'ja'); assert.equal(ttsLanguageFor('連立方程式', ['ja']), 'ja');
  assert.equal(ttsLanguageFor('2x + 3 = 7', ['ja']), 'ja');
});
t('voice and recogniser', () => {
  const tw = lessonLanguageOf('zh-TW')!;
  assert.equal(lessonVoiceId(['zh-TW'], '01eaafa9-308a-4276-a017-6ab0cf061b1f', 'female'), tw.voices.female);
  assert.equal(lessonVoiceId(['zh-TW'], '86e30c1d-714b-4074-a1f2-1cb6b552fb49', 'male'), tw.voices.male);
  assert.equal(lessonVoiceId(['zh-TW'], 'a-partner-voice', 'partner'), 'a-partner-voice');
  assert.equal(lessonVoiceId(['zh-TW'], undefined), tw.voices.female);
  assert.equal(lessonVoiceId(['en', 'ja'], 'abc', 'female'), 'abc'); assert.equal(lessonVoiceId(undefined, 'abc'), 'abc');
  assert.deepEqual(sessionRecogniser(['zh-TW']), { model: 'ink-preview', hints: ['zh', 'en'] });
  assert.deepEqual(sessionRecogniser(['ja']), { model: 'ink-2', hints: [] }); assert.deepEqual(sessionRecogniser(undefined), { model: 'ink-2', hints: [] });
  assert.deepEqual(sessionRecogniser(['en', 'ja']), { model: 'ink-2', hints: [] });
});
t('gates', () => {
  assert.equal(sessionAllowsNonLatin(['zh-TW']), true); assert.equal(sessionAllowsNonLatin(['en', 'ja']), true); assert.equal(sessionAllowsNonLatin(undefined), false);
  assert.equal(v2CanRunSession({ tutorLanguages: ['zh-TW'] }), true); assert.equal(v2CanRunSession({ tutorLanguages: ['en', 'ja'] }), true);
});
t('notation said in Chinese', () => {
  assert.equal(speakNotation('所以 x = 4。', 'zh'), '所以 x 等於 4。');
  assert.equal(speakNotation('把 x = 4 代入 x + y = 7', 'zh'), '把 x 等於 4 代入 x 加 y 等於 7');
  assert.equal(speakNotation('x − y = 1', 'zh'), 'x 減 y 等於 1');
  assert.equal(speakNotation('$\\frac{3}{4}$ 是多少？', 'zh'), '4分之3 是多少？');
  assert.equal(speakNotation('x^2 + 2x', 'zh'), 'x的平方 加 2x');
  assert.equal(speakNotation('答案是 -3', 'zh'), '答案是 負3');
  assert.equal(speakNotation('x = -3', 'zh'), 'x 等於 負3');
  assert.equal(speakNotation('3 × 5 ÷ 2', 'zh'), '3 乘以 5 除以 2');
  assert.equal(speakNotation('25% 的學生', 'zh'), '百分之25 的學生');
  assert.equal(speakNotation('1/2 加 1/3', 'zh'), '2分之1 加 3分之1');
});
t('notation said in Japanese', () => {
  assert.equal(speakNotation('x = 4 です。', 'ja'), 'x イコール 4 です。');
  assert.equal(speakNotation('2x + 3 = 7', 'ja'), '2x たす 3 イコール 7');
  assert.equal(speakNotation('$x^2$ を計算します。', 'ja'), 'xの二乗 を計算します。');
  assert.equal(speakNotation('\\frac{1}{2}', 'ja'), '2分の1');
});
t('only a lesson taught in another language', () => {
  assert.equal(lessonSpeech('x = 4', ['en', 'ja']), null); assert.equal(lessonSpeech('x = 4', undefined), null);
  assert.equal(lessonSpeech('所以 x = 4。', ['zh-TW']), '所以 x 等於 4。');
  assert.equal(lessonSpeech('x = 4', ['ja']), 'x イコール 4');
});
t('the lines the engine says itself', () => {
  assert.equal(v2LessonLines(['en', 'ja']), null); assert.equal(v2LessonLines(undefined), null);
  const tw = v2LessonLines(['zh-TW'])!; const ja = v2LessonLines(['ja'])!; const cn = v2LessonLines(['zh-CN'])!;
  assert.equal(tw.checkIns.length, 4); assert.ok(tw.timeUp('小安').startsWith('小安，')); assert.ok(!/[A-Za-z]/.test(tw.timeUp('')));
  for (const l of [tw, ja, cn]) for (const c of [...l.checkIns, l.goOn, l.goOnOrQuestion]) assert.ok(/[?？]$/.test(c), c);
  assert.ok(!/[这们说请讲发]/.test(JSON.stringify([tw.checkIns, tw.goOn, tw.goOnOrQuestion, tw.lookAtBoard, tw.unreachable, tw.nextStep, tw.timeUp('x'), tw.correction('x')])), 'no Simplified in zh-TW');
  assert.equal(partOffer('Worked example', false, true, ['zh-TW']), tw.goOnOrQuestion); assert.equal(partOffer('Worked example', false, false, ['ja']), ja.goOn);
  assert.equal(partOffer('Worked example', false), 'Next is worked example. Shall we go on, or do you have a question first?');
});
t('an instruction in the lesson language hands the turn over', () => {
  for (const s of ['請你把 x 等於 3 代入第一式，算出 y 等於多少。', '求下面聯立方程式的 x 和 y：x + y = 8，x - y = 2', '你來試試看。', '接下來換你。', '现在请你自己做一题。', 'y を求めてください。', 'では、やってみましょう。'])
    assert.equal(v2HandsOverInItsLanguage(s), true, s);
  for (const s of ['兩式相加，y 就會互相抵消。', '所以 x 等於 4。', '如果有問題，隨時告訴我。', '下次請你多練習相減的題目。', 'わからないことがあれば、いつでも教えてください。', 'y が消えます。', '我算出來了。'])
    assert.equal(v2HandsOverInItsLanguage(s), false, s);
  assert.equal(v2ReplyAsks('對，y 等於 2。接下來請你自己做一題。求下面聯立方程式的 x 和 y：x + y = 8，x - y = 2'), true);
  assert.equal(v2ReplyAsks('對，y 等於 2，你算對了。所以這一題的解是 x 等於 3，y 等於 2。'), false);
  assert.equal(v2ReplyAsks('Good. So x is 4.'), false);
});
t('numbers said in Chinese or Japanese become digits, words stay', () => {
  const same = (x: string) => assert.equal(heardNumerals(x), x, x);
  assert.equal(numeralValue('十四'), '14'); assert.equal(numeralValue('二十'), '20'); assert.equal(numeralValue('一百零五'), '105'); assert.equal(numeralValue('三點五'), '3.5'); assert.equal(numeralValue('兩'), '2'); assert.equal(numeralValue('三千二百'), '3200');
  assert.equal(heardNumerals('哦，所以x等於三。'), '哦，所以x等於3。');
  assert.equal(heardNumerals('x加x加y減y等於七加一，二x等於八，x等於四，然後四加y等於七。y等於三。'), 'x加x加y減y等於7加1，2x等於8，x等於4，然後4加y等於7。y等於3。');
  assert.equal(heardNumerals('我看到黑板上寫的是x加y等於十，x加二y等於十四'), '我看到黑板上寫的是x加y等於10，x加2y等於14');
  assert.equal(heardNumerals('四。'), '4。'); assert.equal(heardNumerals('答案是十二'), '答案是12'); assert.equal(heardNumerals('四分之三'), '4分之3');
  assert.equal(heardNumerals('エックスは四で、ワイは三だと思います。'), 'エックスは4で、ワイは3だと思います。');
  for (const x of ['等一下，我想一想。', '我們一起算。', '用第一式減第二式。', '把兩式相加。', '這是二元一次方程式。', '是一樣的嗎？', '老師好，我準備好了。', '一緒にやりましょう。', 'もう一度お願いします。', 'I have 3 apples.']) same(x);
});

// ── 2026-11-24: Hindi, Hinglish, French, Spanish ──────────────────────────────────────────────────────────────
const DEVANAGARI = /\p{Script=Devanagari}/u;
t('Hindi, Hinglish, French, Spanish: the lines the engine says itself', () => {
  const hi = v2LessonLines(['hi'])!; const hing = v2LessonLines(['hi-Latn'])!; const fr = v2LessonLines(['fr'])!; const es = v2LessonLines(['es'])!;
  assert.equal(v2LessonLines(['en', 'hi']), null); assert.equal(v2LessonLines(['en', 'fr']), null); assert.equal(v2LessonLines(['hinglish']), hing); assert.equal(v2LessonLines(['es-MX']), es);
  for (const l of [hi, hing, fr, es]) {
    assert.equal(l.checkIns.length, 4); assert.equal(new Set(l.checkIns).size, 4);
    for (const c of [...l.checkIns, l.goOn, l.goOnOrQuestion, l.nextStep]) assert.ok(/\?$/.test(c), c);
    for (const c of l.checkIns) assert.ok(V2_LESSON_CHECK_INS.includes(c));
    // Spoken lines: no digit and no symbol the voice would read out.
    for (const c of [...l.checkIns, l.goOn, l.goOnOrQuestion, l.nextStep, l.lookAtBoard, l.timeUp('Asha'), l.timeUp(''), l.correction('x')]) assert.ok(!/[\d=+×÷%$#@*<>]/.test(c), c);
    assert.ok(l.timeUp('Asha').startsWith('Asha,')); assert.ok(!l.timeUp('').includes('Asha') && !/^[,\s]/.test(l.timeUp('')));
    assert.ok(l.correction('X1').endsWith('X1'));
  }
  // Hindi is Devanagari with no Latin word; Hinglish has both in every line.
  for (const c of [...hi.checkIns, hi.goOn, hi.goOnOrQuestion, hi.lookAtBoard, hi.unreachable, hi.nextStep, hi.timeUp('')]) assert.ok(DEVANAGARI.test(c) && !/[A-Za-z]/.test(c), c);
  for (const c of [hing.checkIns[0]!, hing.goOn, hing.goOnOrQuestion, hing.lookAtBoard, hing.unreachable, hing.nextStep, hing.timeUp('')]) assert.ok(DEVANAGARI.test(c) && /[A-Za-z]{3,}/.test(c), c);
  assert.equal(hing.checkIns[0], 'यहाँ तक clear है?');
  // tu and tú: never vous, usted or vosotros.
  const all = (l: typeof fr) => [...l.checkIns, l.goOn, l.goOnOrQuestion, l.lookAtBoard, l.unreachable, l.nextStep, l.timeUp('A'), l.correction('x')].join('\n');
  assert.ok(/\btu\b/i.test(all(fr)) && !/\b(?:vous|votre|vos)\b/i.test(all(fr)));
  assert.ok(!/\b(?:usted|vosotros|os)\b/i.test(all(es)) && es.checkIns.every((c) => c.startsWith('¿')));
  // The held page's ask is in the lesson's language, without the part's English name.
  assert.equal(partOffer('Worked example', false, true, ['hi']), hi.goOnOrQuestion); assert.equal(partOffer('Worked example', false, false, ['hi-Latn']), hing.goOn);
  assert.equal(partOffer('Worked example', true, true, ['fr']), fr.goOnOrQuestion); assert.equal(partOffer('Worked example', false, false, ['es']), es.goOn);
  for (const l of [hi, hing, fr, es]) assert.ok(v2HoldsLessonPartAsk(`x = 4. ${l.goOn}`) && v2HoldsLessonPartAsk(l.goOnOrQuestion));
  assert.ok(!v2HoldsLessonPartAsk('Shall we go on?') && !v2HoldsLessonPartAsk('x = 4.'));
});
t('a typed Hinglish session is in Latin letters; a spoken one keeps the speech form', () => {
  const spoken = v2LessonLines(['hi-Latn'])!; const typed = v2LessonLines(['hi-Latn'], 'text')!;
  assert.equal(v2LessonLines(['hi-Latn'], 'voice'), spoken); assert.notEqual(typed, spoken); assert.equal(v2LessonLines(['hinglish'], 'text'), typed);
  const all = (l: typeof typed) => [...l.checkIns, l.goOn, l.goOnOrQuestion, l.lookAtBoard, l.unreachable, l.nextStep, l.timeUp('Asha'), l.timeUp(''), l.correction('x = 4')];
  for (const c of all(typed)) assert.ok(!/[^\x00-\x7f]/.test(c), `typed Hinglish outside ASCII: ${c}`);
  for (const c of all(spoken)) assert.ok(DEVANAGARI.test(c), c);
  assert.equal(typed.checkIns[0], 'Yahan tak clear hai?'); assert.equal(typed.goOnOrQuestion, 'Next part par chalein, ya pehle koi doubt hai?');
  assert.equal(typed.timeUp(''), 'Aaj ka time poora ho gaya. Tumne bahut achha kiya. Agli class mein milte hain.'); assert.ok(typed.timeUp('Asha').startsWith('Asha, aaj'));
  assert.equal(typed.checkIns.length, 4); for (const c of [...typed.checkIns, typed.goOn, typed.goOnOrQuestion, typed.nextStep]) assert.ok(/\?$/.test(c), c);
  for (const c of typed.checkIns) assert.ok(V2_LESSON_CHECK_INS.includes(c)); assert.ok(v2HoldsLessonPartAsk(`x = 4 hai. ${typed.goOn}`) && v2HoldsLessonPartAsk(typed.goOnOrQuestion));
  assert.equal(partOffer('Worked example', false, true, ['hi-Latn'], 'text'), typed.goOnOrQuestion); assert.equal(partOffer('Worked example', false, false, ['hi-Latn'], 'text'), typed.goOn);
  assert.equal(partOffer('Worked example', false, true, ['hi-Latn'], 'voice'), spoken.goOnOrQuestion); assert.equal(partOffer('Worked example', false, true, ['hi-Latn']), spoken.goOnOrQuestion);
  // Every other language types as it speaks; an English lesson has no lines in either mode.
  for (const code of ['hi', 'fr', 'es', 'zh-TW', 'zh-CN', 'ja']) assert.equal(v2LessonLines([code], 'text'), v2LessonLines([code]), code);
  assert.equal(v2LessonLines(['en'], 'text'), null); assert.equal(v2LessonLines(['en', 'hi'], 'text'), null); assert.equal(partOffer('Worked example', false, true, ['en'], 'text'), 'Next is worked example. Shall we go on, or do you have a question first?');
});
t('typed Hinglish: an instruction in Latin letters hands the turn over, only in a Hindi or Hinglish lesson', () => {
  const YES = ['Ab khud karke batao.', 'Ab tum y ki value nikalo.', 'Is equation ko solve karo.', 'Ek baar try karo.', 'Notebook mein likho.', 'Socho aur batao.', 'Ab khud karo.', 'Bataiye.', 'Karke dikhao.', 'Batao, x kitna hoga.'];
  for (const s of YES) { assert.equal(v2HandsOverInItsLanguage(s, ['hi-Latn']), true, s); assert.equal(v2HandsOverInItsLanguage(s, ['hi']), true, s); }
  for (const s of ['To x = 4 hai.', 'Agar doubt ho to batao.', 'Ghar par do sawal aur karo.', 'Bilkul sahi, x = 4 hai.', 'Agli baar khud karo.']) assert.equal(v2HandsOverInItsLanguage(s, ['hi-Latn']), false, s);
  for (const langs of [undefined, null, ['en'], ['en', 'hi'], ['fr'], ['zh-TW']]) for (const s of YES) assert.equal(v2HandsOverInItsLanguage(s, langs as string[] | null | undefined), false, `${langs}: ${s}`);
  const reply = 'Bilkul sahi, x = 4 hai. Ab ek aur problem, khud karke batao.';
  assert.equal(v2ReplyAsks(reply, ['hi-Latn']), true); assert.equal(v2ReplyAsks(reply), false); assert.equal(v2ReplyAsks(reply, ['en']), false); assert.equal(v2ReplyAsks('Bilkul sahi, x = 4 hai.', ['hi-Latn']), false);
  assert.equal(v2ReplyAsks('Good. So x is 4.', ['hi-Latn']), false); assert.equal(v2ReplyAsks('Good. What is y?', ['hi-Latn']), true);
});
t('Hindi, Hinglish, French, Spanish: an instruction hands the turn over', () => {
  for (const s of ['अब तुम y की value निकालो।', 'इस equation को solve करो।', 'अब तुम्हारी बारी है।', 'बताओ, x कितना होगा।', 'दोनों समीकरणों को जोड़कर x का मान निकालो।', 'Calcule la valeur de y.', 'Maintenant, résous cette équation.', 'À toi.', 'Ahora resuelve la ecuación.', 'Calcula el valor de y.', 'Te toca.'])
    assert.equal(v2HandsOverInItsLanguage(s), true, s);
  for (const s of ['तो x चार के बराबर है।', 'अगर कोई doubt हो तो बताओ।', 'घर पर दो सवाल और करो।', 'देखो, यह equation है।', 'Donc x vaut quatre.', 'Si tu as une question, dis-moi.', 'La prochaine fois, essaie de vérifier.', 'Entonces x vale cuatro.', 'Si tienes dudas, dime.',
    // English is read by English rules alone: none of these is an instruction to the student in a French or Spanish word.
    'Note that x is positive.', 'Compare the two fractions.', 'So x is 4.', 'Place value matters here.'])
    assert.equal(v2HandsOverInItsLanguage(s), false, s);
  assert.equal(v2ReplyAsks('बहुत बढ़िया। अब y की value निकालो।'), true); assert.equal(v2ReplyAsks('हाँ, x चार है। यही सही उत्तर है।'), false);
  assert.equal(v2ReplyAsks("Oui, c'est ça. Maintenant, calcule y."), true); assert.equal(v2ReplyAsks('Oui, x vaut quatre.'), false);
  assert.equal(v2ReplyAsks('Correcto. Ahora calcula y.'), true); assert.equal(v2ReplyAsks('Sí, x vale cuatro.'), false);
  assert.equal(v2ReplyAsks('तो x चार है। समझ आया?'), true); assert.equal(v2ReplyAsks('Good. So x is 4.'), false);
});
t('number words: the value of a number said in words', () => {
  const v = (lang: 'hi' | 'fr' | 'es' | 'en', said: string) => numberWordsValue(said.toLowerCase().normalize('NFD').replace(/[̀-़ͯ]/g, '').replace(/ँ/g, 'ं').split(/[\s-]+/), lang);
  // Hindi has a word for each of 0–100.
  const HI_SAMPLE: Array<[string, number]> = [['शून्य', 0], ['एक', 1], ['नौ', 9], ['दस', 10], ['उन्नीस', 19], ['पच्चीस', 25], ['उनतीस', 29], ['छत्तीस', 36], ['उनचास', 49], ['पचपन', 55], ['उनहत्तर', 69], ['अठहत्तर', 78], ['नवासी', 89], ['निन्यानवे', 99], ['सौ', 100]];
  for (const [w, n] of HI_SAMPLE) assert.equal(v('hi', w), n, w);
  assert.equal(v('hi', 'पांच'), 5); assert.equal(v('hi', 'पाँच'), 5); assert.equal(v('hi', 'छः'), 6); assert.equal(v('hi', 'दो सौ पचास'), 250); assert.equal(v('hi', 'बारह सौ'), 1200); assert.equal(v('hi', 'तीन हज़ार पाँच सौ'), 3500); assert.equal(v('hi', 'दो लाख'), 200000);
  assert.equal(v('hi', 'दस बीस'), null); assert.equal(v('hi', 'बीस एक'), null);
  assert.equal(v('fr', 'vingt et un'.replace(' et ', ' ')), 21); assert.equal(v('fr', 'soixante-dix'), 70); assert.equal(v('fr', 'soixante-dix-sept'), 77); assert.equal(v('fr', 'quatre-vingts'), 80); assert.equal(v('fr', 'quatre-vingt-dix-neuf'), 99);
  assert.equal(v('fr', 'cent quatre-vingt-un'), 181); assert.equal(v('fr', 'deux mille vingt-six'), 2026); assert.equal(v('fr', 'dix-sept'), 17); assert.equal(v('fr', 'trois deux'), null);
  assert.equal(v('es', 'veintiuno'), 21); assert.equal(v('es', 'dieciséis'), 16); assert.equal(v('es', 'treinta dos'), 32); assert.equal(v('es', 'ciento veinte'), 120); assert.equal(v('es', 'mil novecientos noventa nueve'), 1999); assert.equal(v('es', 'quinientos'), 500); assert.equal(v('es', 'dos tres'), null);
  assert.equal(v('en', 'twenty-one'), 21); assert.equal(v('en', 'one hundred five'), 105); assert.equal(v('en', 'two thousand twenty six'), 2026); assert.equal(v('en', 'twelve hundred'), 1200); assert.equal(v('en', 'two three'), null); assert.equal(v('en', 'zero five'), null);
  assert.deepEqual(numberWordLanguages('hi'), ['hi', 'en']); assert.deepEqual(numberWordLanguages('fr'), ['fr', 'en']); assert.deepEqual(numberWordLanguages('es'), ['es', 'en']);
  assert.deepEqual(numberWordLanguages('en'), []); assert.deepEqual(numberWordLanguages('zh'), []); assert.deepEqual(numberWordLanguages(undefined), []);
});
t('numbers said in Hindi or Hinglish become digits, words stay', () => {
  const h = heardDigits(['hi']); const hing = heardDigits(['hi-Latn']);
  const eq = (a: string, b: string) => { assert.equal(h(a), b, a); assert.equal(hing(a), b, `hi-Latn: ${a}`); };
  eq('x बराबर चार', 'x बराबर 4'); eq('उत्तर ग्यारह है', 'उत्तर 11 है'); eq('पच्चीस', '25'); eq('दो सौ पचास', '250'); eq('तीन दशमलव पाँच', '3.5'); eq('साढ़े तीन', '3.5'); eq('डेढ़ सौ', '150'); eq('ढाई', '2.5');
  eq('३ प्लस ४', '3 प्लस 4'); eq('x की value पच्चीस है', 'x की value 25 है'); eq('दो x plus तीन बराबर ग्यारह', '2 x plus 3 बराबर 11');
  // English numbers, as Hinglish speakers say them.
  eq('answer four है', 'answer 4 है'); eq('x equals twenty one', 'x equals 21'); eq('one hundred and five', '105'); eq('three point one four', '3.14'); eq('answer है five', 'answer है 5');
  // एक and दो are numbers where they stand as numbers…
  eq('दो', '2'); eq('दो।', '2।'); eq('हाँ, एक है', 'हाँ, 1 है'); eq('answer दो है', 'answer 2 है'); eq('उत्तर है दो', 'उत्तर है 2'); eq('x बराबर एक', 'x बराबर 1'); eq('एक बटा दो', '1 बटा 2'); eq('एक plus एक', '1 plus 1');
  eq('शायद दो', 'शायद 2'); eq('मुझे लगता है दो', 'मुझे लगता है 2'); eq('एक दो तीन', '1 2 3'); eq('the answer is one', 'the answer is 1'); eq('y दो है', 'y 2 है');
  // …and words everywhere else: "give", "a", "one by one", "this one".
  for (const x of ['मुझे hint दो', 'एक मिनट रुको', 'जवाब दो', 'बता दो ना', 'एक बार फिर समझा दो', 'एक-एक करके बताओ', 'एक दो सवाल और', 'मुझे एक और example दो', 'this one is hard', 'one more time', 'ये वाला एक', 'रुको, मैं सोच रहा हूँ।']) eq(x, x);
});
t('numbers said in French become digits, words stay', () => {
  const f = heardDigits(['fr']);
  const eq = (a: string, b: string) => assert.equal(f(a), b, a);
  eq('ça fait douze', 'ça fait 12'); eq('vingt-et-un', '21'); eq('vingt et un', '21'); eq('quatre-vingt-dix-sept', '97'); eq('soixante et onze', '71'); eq('trois virgule vingt-cinq', '3.25'); eq('zéro virgule cinq', '0.5');
  eq('deux mille vingt-six', '2026'); eq('cent quatre-vingts', '180'); eq('x égale sept', 'x égale 7'); eq('la réponse est seize', 'la réponse est 16'); eq('twelve', '12');
  // un / une / neuf are numbers where they stand as numbers…
  eq('un', '1'); eq("c'est un", "c'est 1"); eq('x égale un', 'x égale 1'); eq('un plus un égale deux', '1 plus 1 égale 2'); eq("c'est neuf", "c'est 9"); eq('un demi', '1 demi'); eq('un pour cent', '1 pour cent'); eq('un deux trois', '1 2 3');
  // …and an article, an adjective, "once" and an oven everywhere else.
  for (const x of ["c'est un problème", 'je veux un autre exemple', 'une fois que tu as fini', 'un cahier tout neuf', 'le four est chaud', "attends, j'ai une question", 'il y a une erreur', 'vingt pour cent'.replace('vingt', 'x')]) eq(x, x);
});
t('numbers said in Spanish become digits, words stay', () => {
  const e = heardDigits(['es']);
  const eq = (a: string, b: string) => assert.equal(e(a), b, a);
  eq('la respuesta es treinta y dos', 'la respuesta es 32'); eq('veintiuno', '21'); eq('dieciseis', '16'); eq('mil novecientos noventa y nueve', '1999'); eq('ciento veinte', '120'); eq('tres punto cinco', '3.5'); eq('tres coma cinco', '3.5');
  eq('x es igual a siete', 'x es igual a 7'); eq('dos y tres', '2 y 3'); eq('twelve', '12'); eq('quinientos', '500');
  eq('uno', '1'); eq('es uno', 'es 1'); eq('da uno', 'da 1'); eq('x es igual a uno', 'x es igual a 1'); eq('uno más dos', '1 más 2'); eq('un medio', '1 medio'); eq('uno por ciento', '1 por ciento'); eq('veinte por ciento', '20 por ciento');
  for (const x of ['es una ecuación', 'quiero uno más', 'vamos una por una', 'ten cuidado', 'un punto en la recta', 'por un momento', 'uno de ellos', 'espera, tengo una pregunta', 'hay un error']) eq(x, x);
});
t('an English lesson\'s heard words are not rewritten', () => {
  for (const langs of [undefined, ['en'], ['en', 'ja'], ['en', 'hi'], ['en', 'fr'], ['en', 'es']] as const) for (const x of ['I have seven apples', 'the answer is one', 'twenty one', 'un deux trois', 'दो', 'x equals four']) assert.equal(heardDigits(langs as string[] | undefined)(x), x, `${langs}: ${x}`);
  assert.equal(heardNumberWords('seven', []), 'seven');
  // Chinese and Japanese keep their own reader.
  assert.equal(heardDigits(['zh-TW'])('x等於三'), 'x等於3'); assert.equal(heardDigits(['ja'])('エックスは四です'), 'エックスは4です');
});
t('heard text in Devanagari is the student in a Hindi or Hinglish lesson, and Latin text still is', () => {
  for (const langs of [['hi'], ['hi-Latn']]) {
    const allow = sessionAllowsNonLatin(langs); assert.equal(allow, true);
    for (const x of ['x बराबर चार है', 'हाँ', 'जी', 'ना', 'दो', 'छह', 'मुझे समझ नहीं आया', 'answer four है', 'the answer is four', 'x equals 4', 'yes']) assert.equal(classifyTranscript(x, { allowNonLatin: allow }), 'clean', `${langs}: ${x}`);
  }
  assert.equal(sessionAllowsNonLatin(['fr']), false); assert.equal(sessionAllowsNonLatin(['es']), false);
  // In an English lesson a run of Devanagari is still another voice in the room.
  assert.equal(classifyTranscript('x बराबर चार है', { allowNonLatin: false }), 'noise'); assert.equal(classifyTranscript('जी', { allowNonLatin: false }), 'noise');
  assert.equal(classifyTranscript('Sí.', {}), 'clean'); assert.equal(classifyTranscript('uh', { allowNonLatin: true }), 'noise');
});
t('the question pin: a Hindi gist is grounded by whole words', () => {
  const turn = 'बहुत बढ़िया। अब दोनों समीकरणों को जोड़ो। तुम्हें क्या मिलता है?';
  assert.equal(gistGrounded('दोनों समीकरणों को जोड़ने पर तुम्हें क्या मिलता है?', turn), true);
  assert.equal(gistGrounded('फ्रांस की राजधानी का नाम बताइए?', turn), false);
  assert.deepEqual(splitSentences(turn), ['बहुत बढ़िया।', 'अब दोनों समीकरणों को जोड़ो।', 'तुम्हें क्या मिलता है?']);
  assert.deepEqual(splitSentences('Très bien. Écris la suite. ¿Qué obtienes?'), ['Très bien.', 'Écris la suite.', '¿Qué obtienes?']);
  assert.deepEqual(splitSentences('Good. What is x? It is 4.'), ['Good.', 'What is x?', 'It is 4.']);
  assert.equal(gistGrounded('What is the value of x?', 'So we add both. What is the value of x?'), true);
});
console.log(`\n${n} passed`);
