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
};

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
  s = s.replace(/\\pm\b|±/g, base === 'zh' ? ' 正負 ' : ' プラスマイナス ').replace(/\\circ\b|°/g, w.degree).replace(/\\pi\b|π/g, base === 'zh' ? '圓周率' : 'パイ');
  // A simple fraction written with a slash, between two bare terms.
  s = s.replace(new RegExp(`(?<![A-Za-z0-9./])(${TERM})\\s*/\\s*(${TERM})(?![A-Za-z0-9/])`, 'g'), (_m, n: string, d: string) => w.fraction(n, d));
  s = s.replace(/[=＝]/g, ` ${w.equals} `).replace(/[+＋]/g, ` ${w.plus} `);
  // A minus after a term subtracts; one with nothing before it to subtract from is a negative number.
  s = s.replace(/(?<=[A-Za-z0-9)）]\s*)[-−－](?=\s*[A-Za-z0-9(（])/g, ` ${w.minus} `).replace(/[-−－](?=[A-Za-z0-9(（])/g, w.negative);
  s = s.replace(/(?<=[A-Za-z0-9)）]\s*)\*(?=\s*[A-Za-z0-9(（])/g, ` ${w.times} `);
  s = s.replace(/(?<=[A-Za-z0-9)）\s])<(?=\s*[A-Za-z0-9(（-])/g, ` ${w.lt} `).replace(/(?<=[A-Za-z0-9)）\s])>(?=\s*[A-Za-z0-9(（-])/g, ` ${w.gt} `);
  // What is left of LaTeX: a command's name is not a word in any language.
  s = s.replace(/\\[A-Za-z]+/g, ' ').replace(/[{}]/g, ' ').replace(/[*_`#]+/g, ' ');
  return s.replace(/[ \t]{2,}/g, ' ').replace(/\s+([，。！？、,.!?])/g, '$1').trim();
}

/** The finished voice text for a sentence of a lesson taught in another language, or null when the sentence is
 *  not such a one (an English lesson, or a sentence the session speaks in English): the caller goes on as before. */
export function lessonSpeech(sentence: string, languages: readonly string[] | null | undefined): string | null {
  const lesson = taughtIn(languages);
  if (!lesson) return null;
  const lang = ttsLanguageFor(sentence, languages);
  if (!lang || lang === 'en') return null;
  return speakNotation(sentence, lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh' : lesson.base) || null;
}
