/* The session's chrome wording per lesson language: every dictionary is complete, an English lesson is unchanged. */
import assert from 'node:assert/strict';
import { EN, ZH_TW, ZH_CN, JA, HI, FR, ES, sessionStrings, type SessionStrings } from '../src/lib/tutor/i18n/session-strings';
import { LESSON_LANGUAGES, boardLanguage } from '../src/lib/tutor/voice/lesson-language';
import { answerText } from '../src/lib/tutor/voice/answer-text';

let n = 0; const t = (name: string, f: () => void) => { f(); n++; console.log('PASS', name); };

const DICTS: Array<[string, SessionStrings]> = [['zh-TW', ZH_TW], ['zh-CN', ZH_CN], ['ja', JA], ['hi', HI], ['fr', FR], ['es', ES]];
/** Words that are the same in English and the language (2026-11-24): the right wording, not an English value left in place. */
const SAME_WORD: Readonly<Record<string, readonly string[]>> = { fr: ['micAuto'], es: ['micManual', 'humor'] };

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
  assert.equal(sessionStrings(['hi']), HI); assert.equal(sessionStrings(['hi-IN']), HI);
  assert.equal(sessionStrings(['fr']), FR); assert.equal(sessionStrings(['fr-CA']), FR);
  assert.equal(sessionStrings(['es']), ES); assert.equal(sessionStrings(['es-419']), ES); assert.equal(sessionStrings(['es-MX']), ES);
  assert.equal(sessionStrings(['en', 'hi']), EN); assert.equal(sessionStrings(['en', 'fr']), EN); assert.equal(sessionStrings(['en', 'es']), EN);
});

t('a language whose board is English reads English labels: Hinglish', () => {
  assert.equal(sessionStrings(['hi-Latn']), EN); assert.equal(sessionStrings(['hinglish']), EN); assert.equal(sessionStrings(['hi-Latn', 'en']), EN);
  // By the row's own field, not by its code: every row that says `boardIn` gets its board language's dictionary.
  for (const row of LESSON_LANGUAGES) {
    if (row.base === 'en') continue;
    const board = boardLanguage(row);
    if (board.code !== row.code) assert.equal(sessionStrings([row.code]), sessionStrings([board.code]), row.code);
    else assert.notEqual(sessionStrings([row.code]), EN, `${row.code} has a dictionary`);
  }
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
      if (typeof EN[k] === 'string' && !SAME_WORD[code]?.includes(k)) assert.notEqual(d[k], EN[k], `${code}.${k} is still English`);
    }
  }
});

t('Hindi is in Devanagari, French and Spanish in their own UI wording', () => {
  const DEVANAGARI = /\p{Script=Devanagari}/u;
  // Every Hindi string holds Devanagari; Latin letters only for what apps leave so (PDF, Enter).
  for (const x of allText(HI)) { assert.ok(DEVANAGARI.test(x), `hi: no Devanagari in "${x}"`); assert.deepEqual((x.match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['PDF', 'Enter'].includes(w)), [], `hi: Latin word in "${x}"`); }
  assert.equal(HI.send, 'भेजें'); assert.equal(HI.sessionEnded, 'यह सेशन खत्म हो गया है'); assert.equal(HI.pageN(1), 'पेज 1'); assert.equal(HI.micTurnOn, 'अपना माइक चालू करें');
  assert.equal(FR.send, 'Envoyer'); assert.equal(FR.endPause, 'Terminer / Pause'); assert.equal(FR.fullScreen, 'Plein écran'); assert.equal(FR.pageOf(1, 1), 'Page 1 sur 1');
  assert.equal(ES.send, 'Enviar'); assert.equal(ES.endPause, 'Terminar / Pausar'); assert.equal(ES.fullScreen, 'Pantalla completa'); assert.equal(ES.pageOf(1, 1), 'Página 1 de 1');
  // French sets a space before ? ! : and Spanish opens a question with ¿.
  for (const x of allText(FR)) assert.ok(!/\S[?!]/.test(x.replace(/…/g, '')) || /[.]{3}$/.test(x), `fr: no space before ? or ! in "${x}"`);
  for (const x of allText(ES)) if (/\?/.test(x)) assert.ok(x.includes('¿'), `es: a question without ¿ in "${x}"`);
  // tu / tú, never vous / usted / vosotros.
  assert.ok(!/\b(?:vous|votre|vos)\b/i.test(allText(FR).join('\n')), 'fr: vous');
  assert.ok(!/\b(?:usted|ustedes|vosotros|vuestr[oa]s?|su micrófono)\b/i.test(allText(ES).join('\n')), 'es: usted / vosotros');
  // A button's label stays a button's length.
  for (const [code, d] of [['hi', HI], ['fr', FR], ['es', ES]] as const) for (const k of ['send', 'finish', 'endShort', 'finishShort', 'pen', 'eraser', 'clear', 'draw', 'mic', 'voice', 'tools', 'harder', 'easier'] as const) assert.ok(d[k].length <= 16, `${code}.${k} is long for a button: "${d[k]}"`);
});

t('strings with variables carry them', () => {
  assert.equal(FR.minLeft(1), '1 min restante'); assert.equal(FR.minLeft(5), '5 min restantes'); assert.equal(ES.minLeft(1), '1 min restante'); assert.equal(ES.minLeft(5), '5 min restantes'); assert.equal(HI.minLeft(5), '5 मिनट बचे');
  assert.equal(HI.gradeN(8), 'कक्षा 8'); assert.equal(FR.gradeN(8), 'niveau 8'); assert.equal(ES.gradeN(8), '8.º grado'); for (const d of [HI, FR, ES]) assert.equal(d.gradeN('general'), 'general');
  assert.equal(FR.solvedN(1), '✓ 1 résolu'); assert.equal(FR.solvedN(3), '✓ 3 résolus'); assert.equal(ES.solvedN(1), '✓ 1 resuelto'); assert.equal(ES.solvedN(3), '✓ 3 resueltos');
  assert.equal(HI.problemN(4), 'सवाल 4'); assert.equal(FR.problemN(4), 'Exercice 4'); assert.equal(ES.problemN(4), 'Problema 4'); assert.equal(sessionStrings(['hi-Latn']).problemN(4), 'Problem 4');
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
  assert.deepEqual([HI.quickYes.text, HI.quickNo.text, HI.quickNotSure.text, HI.quickTrue.text, HI.quickFalse.text], ['हाँ', 'नहीं', 'मुझे पक्का नहीं पता', 'सही', 'गलत']);
  assert.deepEqual([FR.quickYes.text, FR.quickNo.text, FR.quickNotSure.text, FR.quickTrue.text, FR.quickFalse.text], ['Oui', 'Non', 'Je ne sais pas', 'Vrai', 'Faux']);
  assert.deepEqual([ES.quickYes.text, ES.quickNo.text, ES.quickNotSure.text, ES.quickTrue.text, ES.quickFalse.text], ['Sí', 'No', 'No sé', 'Verdadero', 'Falso']);
  // The "not sure" chip is read as not sure by the answer normaliser (voice/answer-text.ts).
  assert.equal(answerText(`${HI.quickNotSure.text}, शायद 4`), "I don't know, maybe 4"); assert.equal(answerText(`${FR.quickNotSure.text}, peut-être 4`, ['fr']), "I don't know, maybe 4"); assert.equal(answerText(`${ES.quickNotSure.text}, tal vez 4`, ['es']), "I don't know, maybe 4");
});

t('English is today\'s wording, verbatim', () => {
  assert.equal(EN.tapToStart, 'Tap to start'); assert.equal(EN.send, 'Send'); assert.equal(EN.sessionComplete, 'Session Complete');
  assert.equal(EN.chipListening, 'Listening'); assert.equal(EN.voiceState.listening, 'Listening…');
  assert.equal(EN.justTalk, "Just talk — I'll listen and teach on the board"); assert.equal(EN.endPause, 'End / Pause');
  assert.equal(EN.typeAnswerPlaceholder, 'Type your answer… Enter to send'); assert.equal(EN.todaysLesson, 'Today’s lesson:');
  assert.deepEqual(EN.difficulty, { easy: 'easy', medium: 'medium', hard: 'hard' });
});

console.log(`\n${n} passed`);
