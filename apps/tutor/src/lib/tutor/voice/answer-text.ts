/**
 * A learner's answer, typed or heard, in the plain form the answer checks read.
 *
 * 2026-11-24 (a Taiwan worksheet, scripted zh-TW homework sessions): the keyed check (keyed-verdict.ts) reads
 * ASCII punctuation and English lead words. A Chinese keyboard types full-width marks, so "x=2，y=3" (wrong) had
 * its second value read without its name and credited to x; and an answer worded the way a learner there writes
 * it ("x 等於 3", "答案是11", "110度", "第(1)題是 5/4", "是 11 嗎？") was never decided, so the problem was never
 * done on the record. This rewrites those forms into the ones the checks already read ("x = 3", "the answer is
 * 11", "110°", "(1) 5/4", "11?"), so one set of rules judges every language.
 *
 * English is untouched: the full-width forms (U+FF01–FF5D, U+3000) do not occur in it, and every other rewrite
 * runs only on text that holds Han, kana or their marks (、 。). Idempotent. Pure. Client-safe.
 */
import { heardNumerals, numeralValue } from './heard-numerals';

/** Han, kana, or the list and sentence marks written with them (、 。). */
const CJK = /[\u3001\u3002\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const NUMERAL = '[零〇一二兩两三四五六七八九十百千]+';
const N = `(?:\\d+(?:\\.\\d+)?|${NUMERAL})`;

/** Full-width digits, letters and marks as their ASCII forms (１１ → 11, ， → ",", ＝ → "=", ？ → "?"). */
export function fullWidthToAscii(text: string): string {
  return String(text ?? '').replace(/[！-｝]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/　/g, ' ');
}

/** Measure words and units a counted answer ends in (二十三隻, 五公里, 三人): the numeral before one is a number.
 *  元 is not one in 二元一次 (a kind of equation). */
const COUNTED = '(?:隻|只|個|个|人|元(?![一二三]次)|塊|块|歲|岁|歳|公分|公尺|公里|公斤|公克|公升|毫升|分鐘|分钟|小時|小时|天|張|张|本|顆|颗|條|条|枝|支|匹|頭|头|台|輛|辆|倍|円|枚|冊|羽)';

const digits = (run: string): string => (/^\d/.test(run) ? run : numeralValue(run) ?? run);

/** What a learner says before a value they are not sure of, and after it; the checks read "maybe …" and "…?". */
const HEDGE_LEAD = /^(?:(我?不(?:知道|確定|确定|太確定|太确定|曉得|晓得)|わかりません|分かりません|わからない|分からない)[,.\s]*)?(?:(?:我(?:覺得|觉得|想|猜|認為|认为)|應該|应该|大概|可能|也許|也许|或許|或许|好像|たぶん|多分|おそらく|もしかして)[,\s]*)+(?:答案|答えは?)?(?:就)?(?:是|為|为)?\s*/u;
const NOT_SURE_LEAD = /^(?:我?不(?:知道|確定|确定|太確定|太确定|曉得|晓得)|わかりません|分かりません|わからない|分からない)[,.\s]*(?=\S)/u;
const ASK_LEAD = /^(?:是不是|會不會是|会不会是)\s*/u;
const ASK_TAIL = /\s*(?:對不對|对不对|對嗎|对吗|是嗎|是吗|嗎|吗|吧|呢|(?:だ|です)?(?:と思います|と思う)|(?:です|でしょう)か|かな)\s*[.?]*\s*$/u;

/** The learner's words with full-width forms as ASCII and, in Chinese or Japanese, the wording around a value
 *  in the form the answer checks read. Text with neither comes back unchanged. */
export function answerText(raw: string): string {
  let t = fullWidthToAscii(raw);
  if (!CJK.test(t)) return t;
  // A percentage first (百分之二十 → 20%): its 百 is not a number of its own.
  t = t.replace(new RegExp(`百分之\\s*(${N})`, 'gu'), (_m, n: string) => `${digits(n)}%`);
  t = heardNumerals(t).replace(/、/g, ', ').replace(/。/g, '. ')
    .replace(new RegExp(`(${NUMERAL})(?=\\s*${COUNTED})`, 'gu'), (_m, run: string) => digits(run));
  // Fractions said the way they are read: 四分之五 → 5/4, 1又4分之1 → 1 1/4, 4分の5 → 5/4.
  t = t.replace(new RegExp(`(${N})\\s*(?:又|と)\\s*(${N})\\s*分[之の]\\s*(${N})`, 'gu'), (_m, w: string, d: string, n: string) => `${digits(w)} ${digits(n)}/${digits(d)}`)
    .replace(new RegExp(`(${N})\\s*分[之の]\\s*(${N})`, 'gu'), (_m, d: string, n: string) => `${digits(n)}/${digits(d)}`)
    .replace(/(\d)\s*又\s*(?=\d+\s*\/\s*\d)/g, '$1 ');
  // Degrees: 110度 → 110°, 一百一十度 → 110°. A lone numeral before 度 is left (一度 is "once").
  t = t.replace(new RegExp(`(${NUMERAL})\\s*度(?![目數数々])`, 'gu'), (m, run: string) => (run.length >= 2 && numeralValue(run) !== null ? `${numeralValue(run)}°` : m))
    .replace(/(\d)\s*度(?![目數数々])/gu, '$1°')
    .replace(/角\s*(?=[A-Z])/g, '∠');
  // A part named the way a sheet numbers it: 第(1)題是 5/4, 第二小題, (1)は 5/4 → "(1) 5/4".
  t = t.replace(new RegExp(`第\\s*\\(?\\s*(\\d{1,2}|${NUMERAL})\\s*\\)?\\s*(?:小題|小题|題|题|小問|問)\\s*(?:的|の)?(?:答案|答え)?\\s*(?:是|為|为|は|:)?\\s*`, 'gu'), (_m, n: string) => `(${digits(n)}) `)
    .replace(/(\(\d{1,2}\))\s*(?:是|為|为|は)\s*/gu, '$1 ');
  // A value offered unsurely confirms and never denies, as "maybe 11?" does.
  const ask = ASK_TAIL.test(t);
  if (ask) t = t.replace(ASK_TAIL, '');
  if (HEDGE_LEAD.test(t)) t = t.replace(HEDGE_LEAD, (_m, unsure?: string) => `${unsure ? "I don't know, " : ''}maybe `);
  else if (NOT_SURE_LEAD.test(t)) t = t.replace(NOT_SURE_LEAD, "I don't know, ");
  else if (ASK_LEAD.test(t)) t = t.replace(ASK_LEAD, 'is it ');
  else if (ask) t = t.replace(/^(?:是|為|为)\s*(?=[-\d(√∠A-Za-z])/u, '');
  if (ask) t = `${t.trimEnd()}?`;
  // The answer named as the answer, and a value given to a name.
  t = t.replace(/(?:答案|答えは?)\s*(?:就|應該|应该)?(?:是|為|为|[:=])?\s*(?=[-\d(√∠A-Za-z\p{Script=Han}])/gu, 'the answer is ')
    // 答：… as a sheet's answer line opens; 答 inside a word (回答, 答對) is not a lead.
    .replace(/(^|[\s,.;])答\s*(?:是|[:=])\s*(?=[-\d(√∠A-Za-z\p{Script=Han}])/gu, '$1the answer is ')
    .replace(/\s*(?:等於|等于|イコール)\s*/gu, ' = ')
    .replace(/((?:^|[^A-Za-z0-9])[A-Za-z∠][A-Za-z0-9]{0,7})\s*(?:就)?(?:是|為|为|は|が)\s*(?=-?[\d√(])/gu, '$1 = ')
    // Japanese closes a stated value with です / になります.
    .replace(/(?<=[\d°%)])\s*(?:です|だ|になります|になる)(?=[\s,.?!]|$)/gu, '');
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}
