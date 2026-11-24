/* The session's chrome wording per lesson language: every dictionary is complete, an English lesson is unchanged. */
import assert from 'node:assert/strict';
import { EN, ZH_TW, ZH_CN, JA, sessionStrings, type SessionStrings } from '../src/lib/tutor/i18n/session-strings';

let n = 0; const t = (name: string, f: () => void) => { f(); n++; console.log('PASS', name); };

const DICTS: Array<[string, SessionStrings]> = [['zh-TW', ZH_TW], ['zh-CN', ZH_CN], ['ja', JA]];

/** A function-valued key called with stand-in arguments (numbers print as digits, a title as itself). */
const call = (f: (...a: never[]) => unknown): unknown => (f as (...a: unknown[]) => unknown)(2, 3);

/** Every string a dictionary can show, nested values and function results included. */
function allText(d: unknown): string[] {
  if (typeof d === 'string') return [d];
  if (typeof d === 'function') return allText(call(d as (...a: never[]) => unknown));
  if (d && typeof d === 'object') return Object.values(d).flatMap(allText);
  return [];
}

/** `other` has `en`'s shape at `path`: same keys, same typeof, no empty string. */
function sameShape(en: unknown, other: unknown, path: string): void {
  assert.equal(typeof other, typeof en, `${path}: typeof`);
  if (typeof en === 'string') { assert.ok((other as string).trim().length > 0, `${path}: empty`); return; }
  if (typeof en === 'function') {
    const out = call(other as (...a: never[]) => unknown);
    assert.equal(typeof out, 'string', `${path}(): returns a string`);
    assert.ok((out as string).trim().length > 0, `${path}(): empty`);
    return;
  }
  assert.ok(en && typeof en === 'object' && other && typeof other === 'object', `${path}: object`);
  const o = other as Record<string, unknown>;
  for (const [k, v] of Object.entries(en as Record<string, unknown>)) {
    assert.ok(k in o, `${path}.${k}: missing`);
    sameShape(v, o[k], `${path}.${k}`);
  }
  for (const k of Object.keys(o)) assert.ok(k in (en as object), `${path}.${k}: not in EN`);
}

t('every dictionary has every key of EN, non-empty, same type', () => {
  for (const [code, d] of DICTS) sameShape(EN, d, code);
  sameShape(EN, EN, 'en');
});

t('an English lesson gets EN, with or without a second language', () => {
  assert.equal(sessionStrings(undefined), EN); assert.equal(sessionStrings(null), EN); assert.equal(sessionStrings([]), EN);
  assert.equal(sessionStrings(['en']), EN); assert.equal(sessionStrings(['en', 'ja']), EN, 'an English lesson with Japanese help');
  assert.equal(sessionStrings(['xx']), EN, 'an unknown code');
});

t('a lesson taught in another language gets its dictionary', () => {
  assert.equal(sessionStrings(['zh-TW']), ZH_TW); assert.equal(sessionStrings(['zh-Hant']), ZH_TW);
  assert.equal(sessionStrings(['zh-CN']), ZH_CN); assert.equal(sessionStrings(['zh']), ZH_CN);
  assert.equal(sessionStrings(['ja']), JA); assert.equal(sessionStrings(['ja-JP']), JA);
});

// Pairs that differ between the scripts and occur in UI wording: [Simplified, Traditional].
const PAIRS: Array<[string, string]> = [
  ['发', '發'], ['说', '說'], ['话', '話'], ['请', '請'], ['这', '這'], ['们', '們'], ['麦', '麥'], ['风', '風'], ['时', '時'], ['间', '間'],
  ['问', '問'], ['题', '題'], ['课', '課'], ['结', '結'], ['继', '繼'], ['续', '續'], ['听', '聽'], ['讲', '講'], ['师', '師'], ['声', '聲'],
  ['关', '關'], ['开', '開'], ['输', '輸'], ['页', '頁'], ['简', '簡'], ['单', '單'], ['难', '難'], ['传', '傳'], ['画', '畫'], ['笔', '筆'],
  ['记', '記'], ['录', '錄'], ['进', '進'], ['练', '練'], ['习', '習'], ['动', '動'], ['认', '認'], ['调', '調'], ['点', '點'], ['还', '還'],
];
t('zh-TW is written in Traditional characters, zh-CN in Simplified', () => {
  const tw = allText(ZH_TW).join('\n'); const cn = allText(ZH_CN).join('\n');
  for (const [simp, trad] of PAIRS) {
    assert.ok(!tw.includes(simp), `zh-TW has the Simplified ${simp} (expected ${trad})`);
    assert.ok(!cn.includes(trad), `zh-CN has the Traditional ${trad} (expected ${simp})`);
  }
  assert.ok(tw.includes('麥克風') && tw.includes('傳送') && tw.includes('全螢幕') && tw.includes('逐字稿'));
  assert.ok(cn.includes('麦克风') && cn.includes('发送') && cn.includes('全屏') && cn.includes('文字记录'));
});

t('Japanese is in Japanese script, and no dictionary leaves an English value in place', () => {
  assert.ok(/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(JA.tapToStart) && JA.send === '送信' && JA.fullScreen === '全画面');
  for (const [code, d] of DICTS) {
    for (const k of Object.keys(EN) as Array<keyof SessionStrings>) {
      if (typeof EN[k] === 'string') assert.notEqual(d[k], EN[k], `${code}.${k} is still English`);
    }
  }
});

t('strings with variables carry them', () => {
  assert.equal(EN.pageOf(1, 3), 'Page 1 of 3'); assert.equal(ZH_TW.pageOf(1, 3), '第 1 頁，共 3 頁');
  assert.equal(ZH_CN.pageOf(1, 3), '第 1 页，共 3 页'); assert.equal(JA.pageOf(1, 3), '1 / 3 ページ');
  assert.equal(EN.minLeft(2), '2 min left'); assert.ok(ZH_TW.minLeft(2).includes('2'));
  assert.equal(EN.gradeN(8), 'grade 8'); assert.equal(EN.gradeN('general'), 'grade general');
  assert.equal(ZH_TW.gradeN(8), '8 年級'); assert.equal(ZH_TW.gradeN('general'), 'general');
  for (const [, d] of DICTS) assert.ok(d.lessonNameAria('X1').includes('X1') && d.sessionStats(12, 5).includes('12') && d.sessionStats(12, 5).includes('5'));
});

t('a quick-answer chip sends its answer in the lesson language', () => {
  assert.deepEqual([ZH_TW.quickYes.text, ZH_TW.quickNo.text, ZH_TW.quickNotSure.text, ZH_TW.quickTrue.text, ZH_TW.quickFalse.text], ['是', '不是', '我不確定', '對', '錯']);
  assert.deepEqual([JA.quickYes.text, JA.quickNo.text, JA.quickNotSure.text, JA.quickTrue.text, JA.quickFalse.text], ['はい', 'いいえ', 'わかりません', '正しい', '間違い']);
  assert.deepEqual([EN.quickYes.text, EN.quickNo.text, EN.quickNotSure.text, EN.quickTrue.text, EN.quickFalse.text], ['Yes', 'No', "I'm not sure", 'True', 'False']);
});

t('English is today\'s wording, verbatim', () => {
  assert.equal(EN.tapToStart, 'Tap to start'); assert.equal(EN.send, 'Send'); assert.equal(EN.sessionComplete, 'Session Complete');
  assert.equal(EN.chipListening, 'Listening'); assert.equal(EN.voiceState.listening, 'Listening…');
  assert.equal(EN.justTalk, "Just talk — I'll listen and teach on the board"); assert.equal(EN.endPause, 'End / Pause');
  assert.equal(EN.typeAnswerPlaceholder, 'Type your answer… Enter to send'); assert.equal(EN.todaysLesson, 'Today’s lesson:');
  assert.deepEqual(EN.difficulty, { easy: 'easy', medium: 'medium', hard: 'hard' });
});

console.log(`\n${n} passed`);
