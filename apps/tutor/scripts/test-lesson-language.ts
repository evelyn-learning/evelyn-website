/* Lesson taught in another language: the table, the session list, the voice language, the spoken notation. */
import assert from 'node:assert/strict';
import { lessonLanguageOf, taughtIn, lessonVoiceId, sessionRecogniser, baseLanguage } from '../src/lib/tutor/voice/lesson-language';
import { parseTutorLanguages, ttsLanguageFor, splitSentenceForTts } from '../src/lib/tutor/voice/tts-language';
import { speakNotation, lessonSpeech } from '../src/lib/tutor/voice/lesson-speech';
import { sessionAllowsNonLatin } from '../src/lib/tutor/voice/transcript-filters';
import { v2CanRunSession } from '../src/lib/tutor/portal/partner-session-options';

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
console.log(`\n${n} passed`);
