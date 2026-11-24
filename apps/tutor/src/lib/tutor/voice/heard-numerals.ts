/**
 * Numbers a learner SAYS in Chinese or Japanese, written as digits.
 *
 * For English the recogniser writes small numbers as digits ("x equals 4"). For Mandarin and Japanese it writes
 * them as numerals of the language (「x等於四」, 「二x等於八」, 「エックスは四です」). Everything that reads an answer for
 * its value — the homework answer key, the practice check, the tutor comparing with the board — reads digits, so
 * a correct spoken answer was a value nobody could find. A numeral is rewritten as digits only where it stands as
 * a number: beside an operator word, a variable letter, an equals, or as the whole of a short answer. The same
 * characters inside ordinary words stay (一下, 一起, 一樣, 第一式, 兩式, 二元一次方程式, 一緒に, 一つ).
 *
 * Pure. Client-safe.
 */
const DIGIT: Readonly<Record<string, number>> = { 零: 0, 〇: 0, 一: 1, 二: 2, 兩: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const UNIT: Readonly<Record<string, number>> = { 十: 10, 百: 100, 千: 1000 };
const NUM = '[零〇一二兩两三四五六七八九十百千]+(?:[點点][零〇一二三四五六七八九]+)?';

/** The value of a numeral run (up to the thousands, with a decimal part), or null when it is not one number. */
export function numeralValue(run: string): string | null {
  const [whole, frac] = run.split(/[點点]/);
  if (!whole) return null;
  let total = 0; let cur = -1; let any = false;
  // Said digit by digit with no unit ("二零二六", "一二"): read as written.
  if (!/[十百千]/.test(whole)) {
    if (whole.length > 1 && !frac) { const s = [...whole].map((c) => DIGIT[c]); return s.every((d) => d !== undefined) ? s.join('') : null; }
  }
  for (const c of whole) {
    if (c in DIGIT) { if (cur >= 0 && DIGIT[c] !== 0 && cur !== 0) return null; cur = DIGIT[c]!; any = true; }
    else if (c in UNIT) { total += (cur < 0 ? 1 : cur) * UNIT[c]!; cur = -1; any = true; }
    else return null;
  }
  if (!any) return null;
  if (cur > 0) total += cur;
  if (!frac) return String(total);
  const f = [...frac].map((c) => DIGIT[c]);
  return f.every((d) => d !== undefined) ? `${total}.${f.join('')}` : null;
}

// What makes the numeral before or after it a number: an operator word, an equals, a variable letter, a digit.
const BEFORE = '(?:等於|等于|分之|是|得到|得|為|为|加上?|減去?|减去?|乘以?|除以?|負|负|[=＝+＋\\-−×÷]|[A-Za-z]|イコール|たす|ひく|かける|わる|マイナス|は|が|\\d)';
const AFTER = '(?:加|減|减|乘|除|等於|等于|分之|倍|[=＝+＋\\-−×÷]|[A-Za-z]|イコール|たす|ひく|かける|わる|です|だ(?:と|よ)?|になり|\\d)';
// The same characters inside a word, not a number: what follows keeps it a word.
const WORD_AFTER = '(?!下|起|樣|样|些|直|定|次方程|元|式|步|種|种|邊|边|般|共|切|半|旦|向|緒|つ|人|度(?!數|数)|番|回|方|生|部|同|致|面|道|遍|會兒|会儿|點點|点点)';
const NUM_AFTER_LEAD = new RegExp(`(${BEFORE}\\s*)(${NUM})${WORD_AFTER}`, 'gu');
const NUM_BEFORE_OP = new RegExp(`(^|[^零〇一二兩两三四五六七八九十百千點点第每])(${NUM})(?=\\s*${AFTER})`, 'gu');
const WHOLE_ANSWER = new RegExp(`^\\s*((?:答案)?(?:是|為|为)?\\s*)(${NUM})(\\s*(?:吧|嗎|吗|啊|です|ですか|だと思います)?[。．.！!？?]*\\s*)$`, 'u');

/** A learner's recognised words with the numbers in them as digits. Text with no Chinese or Japanese numeral, and
 *  numerals that are part of a word, come back unchanged. */
export function heardNumerals(text: string): string {
  if (!/[零〇一二兩两三四五六七八九十百千]/.test(text)) return text;
  const put = (run: string) => numeralValue(run) ?? run;
  const whole = WHOLE_ANSWER.exec(text);
  if (whole) return `${whole[1]}${put(whole[2]!)}${whole[3]}`;
  let out = text;
  // Twice: 「七加一」 turns its second numeral through the first's digit.
  for (let k = 0; k < 3; k++) {
    const next = out.replace(NUM_BEFORE_OP, (_m, lead: string, run: string) => `${lead}${put(run)}`).replace(NUM_AFTER_LEAD, (_m, lead: string, run: string) => `${lead}${put(run)}`);
    if (next === out) break;
    out = next;
  }
  return out;
}
