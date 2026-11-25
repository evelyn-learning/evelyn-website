/**
 * What the voice is given for one sentence of a lesson taught in another language (lesson-language.ts taughtIn).
 *
 * The English path (tts-pronunciation.ts rewriteForTTS and the subject transforms beside it) turns notation into
 * English words: "x^2" becomes "x squared", "=" becomes "equals". Handed a Chinese or Japanese sentence it would
 * put English words in the mouth of a Chinese or Japanese voice. Such a sentence comes here instead: notation is
 * read in the words of the sentence's own language, and nothing else is touched.
 *
 * The brain is asked to say maths in words (v2/lesson-language-section.ts); this is the net for what it writes in
 * symbols anyway ("x = 4", "2x + 3"), which is how a teacher writes a spoken line when the board shows the same.
 *
 * Pure. No env, no I/O, client-safe.
 */
import { taughtIn } from './lesson-language';
import { ttsLanguageFor } from './tts-language';

interface Words {
  equals: string; plus: string; minus: string; negative: string; times: string; over: string;
  lt: string; gt: string; le: string; ge: string; ne: string; approx: string; sqrt: string; degree: string;
  /** a/b and \frac{a}{b}: the denominator is said first in both languages. */
  fraction: (num: string, den: string) => string;
  power: (base: string, exp: string) => string;
  percent: (n: string) => string;
}

const WORDS: Readonly<Record<string, Words>> = {
  zh: {
    equals: '等於', plus: '加', minus: '減', negative: '負', times: '乘以', over: '除以',
    lt: '小於', gt: '大於', le: '小於等於', ge: '大於等於', ne: '不等於', approx: '約等於', sqrt: '根號', degree: '度',
    fraction: (n, d) => `${d}分之${n}`,
    power: (b, e) => (e === '2' ? `${b}的平方` : e === '3' ? `${b}的立方` : `${b}的${e}次方`),
    percent: (n) => `百分之${n}`,
  },
  ja: {
    equals: 'イコール', plus: 'たす', minus: 'ひく', negative: 'マイナス', times: 'かける', over: 'わる',
    lt: '小なり', gt: '大なり', le: '小なりイコール', ge: '大なりイコール', ne: 'ノットイコール', approx: 'ニアリーイコール', sqrt: 'ルート', degree: '度',
    fraction: (n, d) => `${d}分の${n}`,
    power: (b, e) => (e === '2' ? `${b}の二乗` : e === '3' ? `${b}の三乗` : `${b}の${e}乗`),
    percent: (n) => `${n}パーセント`,
  },
  // 2026-11-24: the same for Hindi, French and Spanish. Their voices do not skip a symbol out loud, they drop
  // it without a sound: "2x + 3 = 11" was said as "two x three eleven" in all three (speak-then-transcribe check).
  hi: {
    equals: 'बराबर', plus: 'जमा', minus: 'घटा', negative: 'माइनस', times: 'गुणा', over: 'भाग',
    lt: 'से छोटा', gt: 'से बड़ा', le: 'से छोटा या बराबर', ge: 'से बड़ा या बराबर', ne: 'बराबर नहीं', approx: 'लगभग बराबर', sqrt: 'वर्गमूल ', degree: ' डिग्री',
    fraction: (n, d) => `${n} बटा ${d}`,
    power: (b, e) => (e === '2' ? `${b} का वर्ग` : e === '3' ? `${b} का घन` : `${b} की घात ${e}`),
    percent: (n) => `${n} प्रतिशत`,
  },
  // Hinglish: the maths is said in English, as its speakers say it ("x squared", "three by four").
  'hi-Latn': {
    equals: 'equals', plus: 'plus', minus: 'minus', negative: 'minus ', times: 'times', over: 'divided by',
    lt: 'less than', gt: 'greater than', le: 'less than or equal to', ge: 'greater than or equal to', ne: 'not equal to', approx: 'approximately equal to', sqrt: 'root ', degree: ' degrees',
    fraction: (n, d) => `${n} by ${d}`,
    power: (b, e) => (e === '2' ? `${b} squared` : e === '3' ? `${b} cubed` : `${b} to the power ${e}`),
    percent: (n) => `${n} percent`,
  },
  fr: {
    equals: 'égale', plus: 'plus', minus: 'moins', negative: 'moins ', times: 'fois', over: 'divisé par',
    lt: 'inférieur à', gt: 'supérieur à', le: 'inférieur ou égal à', ge: 'supérieur ou égal à', ne: 'différent de', approx: 'environ égal à', sqrt: 'racine carrée de ', degree: ' degrés',
    fraction: (n, d) => `${n} sur ${d}`,
    power: (b, e) => (e === '2' ? `${b} au carré` : e === '3' ? `${b} au cube` : `${b} puissance ${e}`),
    percent: (n) => `${n} pour cent`,
  },
  es: {
    equals: 'es igual a', plus: 'más', minus: 'menos', negative: 'menos ', times: 'por', over: 'entre',
    lt: 'menor que', gt: 'mayor que', le: 'menor o igual que', ge: 'mayor o igual que', ne: 'distinto de', approx: 'aproximadamente igual a', sqrt: 'raíz cuadrada de ', degree: ' grados',
    fraction: (n, d) => `${n} sobre ${d}`,
    power: (b, e) => (e === '2' ? `${b} al cuadrado` : e === '3' ? `${b} al cubo` : `${b} a la ${e}`),
    percent: (n) => `${n} por ciento`,
  },
};

const PLUS_MINUS: Readonly<Record<string, string>> = { zh: '正負', ja: 'プラスマイナス', hi: 'प्लस माइनस', 'hi-Latn': 'plus minus', fr: 'plus ou moins', es: 'más o menos' };
const PI: Readonly<Record<string, string>> = { zh: '圓周率', ja: 'パイ', hi: 'पाई', 'hi-Latn': 'pi', fr: 'pi', es: 'pi' };

/** A number, a letter or a short bracket-free term: what stands either side of an operator. */
const TERM = '[A-Za-z0-9.]+';
const GROUP = '\\{([^{}]*)\\}';

function unwrapLatex(s: string): string {
  return s
    .replace(/\$\$?/g, ' ')
    .replace(/\\[()[\]]/g, ' ')
    .replace(/\\(?:left|right|displaystyle|,|;|!|quad|qquad)\b/g, ' ')
    .replace(/\\(?:text|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:begin|end)\{[^{}]*\}/g, ' ')
    .replace(/\\\\(?:\[[^\]]*\])?/g, '、')
    .replace(/&/g, ' ');
}

/** One sentence's notation said in the words of `base` (zh, ja). Unknown base: the sentence unchanged. */
export function speakNotation(sentence: string, base: string): string {
  const w = WORDS[base];
  if (!w) return sentence;
  let s = unwrapLatex(sentence);
  // Fractions and roots first: their braces go before the bare-symbol rules read what is inside.
  for (let k = 0; k < 3; k++) s = s.replace(new RegExp(`\\\\[dt]?frac\\s*${GROUP}\\s*${GROUP}`, 'g'), (_m, n: string, d: string) => ` ${w.fraction(n.trim(), d.trim())} `);
  s = s.replace(new RegExp(`\\\\sqrt\\s*${GROUP}`, 'g'), (_m, a: string) => ` ${w.sqrt}${a.trim()} `).replace(/√\s*/g, w.sqrt);
  s = s.replace(new RegExp(`(${TERM}|\\))\\s*\\^\\s*(?:${GROUP}|(-?[A-Za-z0-9]+))`, 'g'), (_m, b: string, e1: string | undefined, e2: string | undefined) => w.power(b, (e1 ?? e2 ?? '').trim()));
  s = s.replace(/([A-Za-z0-9)])²/g, (_m, b: string) => w.power(b, '2')).replace(/([A-Za-z0-9)])³/g, (_m, b: string) => w.power(b, '3'));
  s = s.replace(/(\d+(?:\.\d+)?)\s*[%％]/g, (_m, n: string) => w.percent(n));
  s = s.replace(/\\(?:times|cdot)\b|[×·]/g, ` ${w.times} `).replace(/\\div\b|÷/g, ` ${w.over} `);
  s = s.replace(/\\(?:leq?|leqslant)\b|[≤≦]/g, ` ${w.le} `).replace(/\\(?:geq?|geqslant)\b|[≥≧]/g, ` ${w.ge} `).replace(/\\neq?\b|≠/g, ` ${w.ne} `).replace(/\\approx\b|[≈≒]/g, ` ${w.approx} `);
  s = s.replace(/\\pm\b|±/g, ` ${PLUS_MINUS[base] ?? 'plus or minus'} `).replace(/\\circ\b|°/g, w.degree).replace(/\\pi\b|π/g, PI[base] ?? 'pi');
  // A simple fraction written with a slash, between two bare terms.
  s = s.replace(new RegExp(`(?<![A-Za-z0-9./])(${TERM})\\s*/\\s*(${TERM})(?![A-Za-z0-9/])`, 'g'), (_m, n: string, d: string) => w.fraction(n, d));
  s = s.replace(/[=＝]/g, ` ${w.equals} `).replace(/[+＋]/g, ` ${w.plus} `);
  // A minus after a term subtracts; one with nothing before it to subtract from is a negative number.
  // (Accented Latin letters count as a term's end: "x au carré - 5x". Han and kana do not: "答案是 -3" is a negative.)
  s = s.replace(/(?<=[A-Za-z0-9À-ÿ)）]\s*)[-−－](?=\s*[A-Za-z0-9(（])/g, ` ${w.minus} `).replace(/[-−－](?=[A-Za-z0-9(（])/g, w.negative);
  s = s.replace(/(?<=[A-Za-z0-9)）]\s*)\*(?=\s*[A-Za-z0-9(（])/g, ` ${w.times} `);
  s = s.replace(/(?<=[A-Za-z0-9)）\s])<(?=\s*[A-Za-z0-9(（-])/g, ` ${w.lt} `).replace(/(?<=[A-Za-z0-9)）\s])>(?=\s*[A-Za-z0-9(（-])/g, ` ${w.gt} `);
  // What is left of LaTeX: a command's name is not a word in any language.
  s = s.replace(/\\[A-Za-z]+/g, ' ').replace(/[{}]/g, ' ').replace(/[*_`#]+/g, ' ');
  // "2x" is one garbled sound to the Hindi, French and Spanish voices ("dogs" for 2x): a coefficient and its
  // letter are said as two words. Chinese and Japanese read "2x" as it stands.
  if (base !== 'zh' && base !== 'ja') s = s.replace(/(\d)([A-Za-z])(?![A-Za-z])/g, '$1 $2');
  // A lone x in Spanish is the word "equis"; the voice reads the bare letter as part of the next word.
  if (base === 'es') s = s.replace(/(?<![\p{L}\p{N}])x(?![\p{L}\p{N}])/giu, 'equis');
  if (base === 'hi-Latn') s = digitsToEnglishWords(s);
  return s.replace(/[ \t]{2,}/g, ' ').replace(/\s+([，。！？、,.!?।])/g, '$1').trim();
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** A whole number below a million in English words. */
export function englishNumber(n: number): string {
  if (n < 20) return ONES[n]!;
  if (n < 100) return TENS[Math.floor(n / 10)]! + (n % 10 ? `-${ONES[n % 10]}` : '');
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred` + (n % 100 ? ` ${englishNumber(n % 100)}` : '');
  return `${englishNumber(Math.floor(n / 1000))} thousand` + (n % 1000 ? ` ${englishNumber(n % 1000)}` : '');
}

/** Hinglish: every number in a spoken line is said in English words. Given digits, the Hindi voice says them in
 *  Hindi ("3" as तीन), which is not how a Hinglish speaker says a number in a sum. Decimals are read digit by
 *  digit after "point"; a number of a million or more is left as it is. */
export function digitsToEnglishWords(s: string): string {
  return s.replace(/\d+(?:\.\d+)?/g, (m) => {
    const [whole, frac] = m.split('.') as [string, string | undefined];
    if (whole.length > 6) return m;
    const w = englishNumber(Number(whole));
    return frac ? `${w} point ${[...frac].map((d) => ONES[Number(d)]).join(' ')}` : w;
  });
}

/** The finished voice text for a sentence of a lesson taught in another language, or null when the sentence is
 *  not such a one (an English lesson, or a sentence the session speaks in English): the caller goes on as before. */
export function lessonSpeech(sentence: string, languages: readonly string[] | null | undefined): string | null {
  const lesson = taughtIn(languages);
  if (!lesson) return null;
  const lang = ttsLanguageFor(sentence, languages);
  if (!lang || lang === 'en') return null;
  // Chinese and Japanese are keyed by the sentence's own script (a session can hold both); the others by the
  // lesson's row, since Hindi and Hinglish share a voice and differ in how maths is said.
  return speakNotation(sentence, lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh' : WORDS[lesson.code] ? lesson.code : lesson.base) || null;
}
