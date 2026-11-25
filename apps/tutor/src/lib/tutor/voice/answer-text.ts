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
 *
 * 2026-11-24, Hindi, Hinglish, French and Spanish: the same, one row per language (ANSWER_WORDS). Hindi is known
 * by its script. French and Spanish share English's script, so their row is read when the session says so (the
 * optional `languages`) or when the text carries wording only that language has ("la réponse est", "es igual a",
 * "¿"); text with neither comes back as it came, so an English answer is still byte for byte what was typed.
 */
import { heardNumerals, numeralValue } from './heard-numerals';
import { heardNumberWords, type NumberWordLanguage } from './heard-number-words';
import { taughtIn } from './lesson-language';

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

/** The learner's words with full-width forms as ASCII and, in a language other than English, the wording around a
 *  value in the form the answer checks read. `languages`: the session's (lesson language first), for the languages
 *  written in English's script. Text in none of them comes back unchanged. */
export function answerText(raw: string, languages?: readonly string[] | null): string {
  let t = fullWidthToAscii(raw);
  if (!CJK.test(t)) {
    const row = answerWordsFor(t, languages);
    return row ? worded(t, row, taughtIn(languages)?.base === row.base) : t;
  }
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

// ── Hindi, Hinglish, French, Spanish ────────────────────────────────────────────────────────────────────────

/** A word of any script standing alone: \b knows only ASCII letters (it finds no edge before "égale" or after "है"). */
const B = '(?<![\\p{L}\\p{M}\\p{N}])';
const E = '(?![\\p{L}\\p{M}\\p{N}])';
const words = (src: string, flags = 'giu') => new RegExp(`${B}(?:${src})${E}`, flags);
const VALUE = '-?\\d+(?:\\.\\d+)?';

/** The wording around an answer in one language, each entry the counterpart of a Chinese / Japanese pattern above.
 *  Regex sources, matched as whole words without regard to case. */
interface AnswerWords {
  base: 'hi' | 'fr' | 'es';
  numbers: readonly NumberWordLanguage[];
  /** Latin script only: wording no English answer holds, which shows the language when no session says it. */
  mark?: RegExp;
  minus: string; percent: string; degree: string; angle: string;
  /** "3 OVER 4"; a denominator named after its count ("3 quarts"); a whole joined to its fraction ("2 ET 3 quarts"); a half. */
  over: string; parts: ReadonlyArray<readonly [string, number]>; mixed: string; half: string;
  /** A part of the problem named ("partie a", "भाग (a)"), and what may link a label to its value ("(a) c'est 5"). */
  part: string; labelLink: string;
  notSure: string; maybe: string; maybeAfter: string;
  /** Opens a yes / no question about a value ("est-ce que c'est", "¿es", "क्या यह"); `alwaysAsks`: it does so with no "?". */
  askLead: string; alwaysAsks?: boolean;
  /** A tag that turns a statement into a question (", non ?", "है ना?"). */
  askTail: string;
  /** "It is", before a value that is the whole message ("c'est 12", "es 12"). */
  itIs: string;
  answer: string; equals: string;
  /** Between a variable and its value ("x est 3", "y es 5"); Hindi puts its verb after the value (`close`). */
  nameIs: string; close: string;
  and: string;
}

const ANSWER_WORDS: Readonly<Record<'hi' | 'fr' | 'es', AnswerWords>> = {
  hi: {
    base: 'hi', numbers: ['hi', 'en'],
    minus: 'माइनस|ऋण|minus', percent: 'प्रतिशत|परसेंट|पर्सेंट|percent', degree: 'डिग्री|अंश|degrees?', angle: 'कोण',
    over: 'बटा|बटे|अपॉन|upon|by', parts: [], mixed: 'सही|पूर्णांक', half: 'आधा',
    part: 'भाग|पार्ट|part', labelLink: '(?:का|के\\s+लिए|में)?\\s*(?:(?:उत्तर|जवाब|answer|आंसर)\\s*)?(?:है\\s+)?',
    notSure: '(?:मुझे\\s+)?(?:पता|मालूम)\\s+नहीं(?:\\s+है)?|नहीं\\s+(?:पता|मालूम)|(?:मुझे\\s+)?पक्का\\s+नहीं(?:\\s+(?:है|पता))?|sure\\s+नहीं\\s+(?:हूँ|हूं)',
    maybe: 'शायद|मुझे\\s+लगता\\s+है(?:\\s+कि)?|मेरे\\s+(?:ख्याल|ख़याल|हिसाब)\\s+से|हो\\s+सकता\\s+है(?:\\s+कि)?',
    maybeAfter: 'शायद|लगता\\s+है|हो\\s+सकता\\s+है|होना\\s+चाहिए',
    askLead: 'क्या\\s+(?:(?:यह|ये|वह|वो|इसका)\\s+)?', alwaysAsks: true,
    askTail: '(?:है\\s+)?(?:क्या|ना|न|right)',
    itIs: 'यह|ये|वह|वो',
    // Never English's own "the answer is": that is already the form the checks read.
    answer: '(?:(?:इसका|मेरा|the)\\s+)?(?:उत्तर|जवाब|answer(?!\\s+is\\s)|आंसर)(?:\\s+(?:है|होगा|आएगा|आया|आता\\s+है))?',
    equals: '(?:के\\s+)?बराबर(?:\\s+है)?|इक्वल(?:्स)?(?:\\s+टू)?|is\\s+equal\\s+to|equals?(?:\\s+to)?',
    nameIs: '(?:(?:की|का)\\s+(?:value|वैल्यू|मान)\\s*)', close: 'है|हैं|होगा|होगी|आएगा|आयेगा|आया|आता\\s+है|होना\\s+चाहिए',
    and: 'और|and',
  },
  fr: {
    base: 'fr', numbers: ['fr', 'en'],
    mark: words("la\\s+réponse|ma\\s+réponse|le\\s+résultat|ça\\s+(?:fait|donne)|c'est|est-ce|égale?s?|égal\\s+à|degrés?|peut-être|je\\s+(?:pense|crois|trouve|dirais|ne\\s+sais\\s+pas|sais\\s+pas)|j'obtiens|on\\s+obtient|pour\\s+cent", 'iu'),
    minus: 'moins', percent: 'pour\\s*cent', degree: 'degrés?', angle: "(?:l')?angle",
    over: 'sur', parts: [['demis?|demie?s?', 2], ['tiers', 3], ['quarts?', 4], ['cinquièmes?', 5], ['sixièmes?', 6], ['septièmes?', 7], ['huitièmes?', 8], ['neuvièmes?', 9], ['dixièmes?', 10], ['centièmes?', 100]],
    mixed: 'et', half: 'la\\s+moitié',
    part: '(?:la\\s+)?(?:partie|sous-question)', labelLink: "(?:c'est|est|:)\\s*",
    notSure: "je\\s+(?:ne\\s+)?sais\\s+pas(?:\\s+trop)?|j'sais\\s+pas|aucune\\s+idée|je\\s+(?:ne\\s+)?suis\\s+pas\\s+sûre?",
    maybe: "peut-être(?:\\s+que)?|je\\s+(?:pense|crois|suppose)(?:\\s+que)?|je\\s+dirais(?:\\s+que)?|probablement|sans\\s+doute|à\\s+mon\\s+avis|on\\s+dirait(?:\\s+que)?|ça\\s+doit\\s+être",
    maybeAfter: 'je\\s+(?:pense|crois|suppose)|peut-être|sans\\s+doute|probablement',
    askLead: "est-ce\\s+que\\s+(?:c'est|ça\\s+fait)|est-ce|c'est|ce\\s+serait|ça\\s+(?:fait|serait|donne)",
    askTail: "non|c'est\\s+ça|n'est-ce\\s+pas|hein|pas\\s+vrai",
    itIs: "c'est|ça\\s+fait|ça\\s+donne|ce\\s+serait",
    answer: "(?:la|ma)\\s+réponse(?:\\s+finale)?(?:\\s+(?:est|c'est|serait))?|le\\s+résultat(?:\\s+(?:est|c'est))?|ça\\s+(?:fait|donne)|on\\s+(?:obtient|trouve)|j'obtiens|je\\s+trouve|j'ai\\s+trouvé",
    equals: '(?:est\\s+)?(?:égale?s?|égaux)(?:\\s+à)?|vaut|font',
    nameIs: "est|c'est|fait|mesure", close: '',
    and: 'et',
  },
  es: {
    base: 'es', numbers: ['es', 'en'],
    mark: /[¿¡]|(?<![\p{L}\p{M}\p{N}])(?:(?:la|mi)\s+respuesta|el\s+resultado|(?:es\s+)?igual\s+a|grados?|creo\s+que|pienso\s+que|tal\s+vez|quizás?|no\s+(?:lo\s+)?sé|me\s+(?:da|dio|sale|salió)|por\s+ciento)(?![\p{L}\p{M}\p{N}])/iu,
    minus: 'menos', percent: 'por\\s*ciento', degree: 'grados?', angle: '(?:el\\s+)?ángulo',
    over: 'sobre', parts: [['medios?', 2], ['tercios?', 3], ['cuartos?', 4], ['quintos?', 5], ['sextos?', 6], ['séptimos?', 7], ['octavos?', 8], ['novenos?', 9], ['décimos?', 10], ['centésimos?', 100]],
    mixed: 'y', half: 'la\\s+mitad',
    part: '(?:la\\s+)?parte|(?:el\\s+)?(?:inciso|apartado)', labelLink: '(?:es|:)\\s*',
    notSure: 'no\\s+(?:lo\\s+)?sé|no\\s+estoy\\s+segur[oa]|ni\\s+idea',
    maybe: 'creo(?:\\s+que)?|pienso(?:\\s+que)?|supongo(?:\\s+que)?|me\\s+parece(?:\\s+que)?|tal\\s+vez|quizás?|a\\s+lo\\s+mejor|puede\\s+ser(?:\\s+que)?|probablemente|debe\\s+ser|yo\\s+diría(?:\\s+que)?',
    maybeAfter: 'creo|pienso|supongo|tal\\s+vez|quizás?|probablemente',
    askLead: 'es|será|sería|son|da|puede\\s+ser',
    askTail: 'no|verdad|cierto',
    itIs: 'es|son|da|sería',
    answer: '(?:la|mi)\\s+respuesta(?:\\s+final)?(?:\\s+(?:es|sería))?|el\\s+resultado(?:\\s+es)?|me\\s+(?:da|dio|sale|salió|queda|quedó)|(?:se\\s+)?obtiene|obtengo|obtuve',
    equals: '(?:es\\s+)?igual(?:\\s+a)?|equivale\\s+a|vale',
    nameIs: 'es|da|mide', close: '',
    and: 'y',
  },
};

const DEVANAGARI = /\p{Script=Devanagari}/u;

/** The row a text is read with: Hindi by its script; a Latin-script language by the session's lesson language, or
 *  by wording of its own. Null: English, or nothing this file rewrites. */
function answerWordsFor(text: string, languages?: readonly string[] | null): AnswerWords | null {
  if (DEVANAGARI.test(text)) return ANSWER_WORDS.hi;
  const base = taughtIn(languages)?.base;
  if (base === 'hi' || base === 'fr' || base === 'es') return ANSWER_WORDS[base];
  return Object.values(ANSWER_WORDS).find((w) => w.mark?.test(text)) ?? null;
}

/** Hinglish typed in Latin letters ("answer 5 hai", "shayad 11", "3 bata 4"): the few words around a value, as the
 *  Hindi row writes them. Only in a Hindi or Hinglish session: none of these is read in any other. */
const ROMAN_HINDI: ReadonlyArray<readonly [RegExp, string]> = [
  [words('mujhe\\s+lagta\\s+h(?:ai|ei)'), 'मुझे लगता है'], [words('ho\\s+sakta\\s+h(?:ai|ei)'), 'हो सकता है'], [words('lagta\\s+h(?:ai|ei)'), 'लगता है'],
  [words('(?:mujhe\\s+)?(?:pata|maloom)\\s+nah(?:i|in|ee)|nah(?:i|in|ee)\\s+pata'), 'पता नहीं'], [words('pakka\\s+nah(?:i|in|ee)'), 'पक्का नहीं'], [words('shayad'), 'शायद'],
  [words('jawab|javab|jawaab|uttar'), 'उत्तर'], [words('(?:ke\\s+)?barabar'), 'बराबर'],
  // "x ki value 4 hogi", "x ka maan 4 hai".
  [new RegExp(`(?<=${B}[A-Za-z][0-9]?\\s+)k[ia]\\s+(?:value|val|maan)${E}`, 'giu'), 'की value'],
  [new RegExp(`(?<=\\d\\s*)${B}bat[ae]${E}(?=\\s*\\d)`, 'giu'), 'बटा'], [words('aadha'), 'आधा'],
  [new RegExp(`${B}h(?:ai|ei)\\s+(?:kya|na)${E}(?=\\s*\\?*\\s*$)`, 'giu'), 'है क्या'],
  [new RegExp(`^\\s*kya\\s+(?:ye|yeh|yah|answer|jawab)${E}`, 'iu'), 'क्या यह'], [new RegExp(`^\\s*kya${E}`, 'iu'), 'क्या'],
  // The verb that closes a stated value, after the value only: "4 hoga", "x 4 hogi", "12 aayega".
  [new RegExp(`(?<=[\\d°%)]\\s*)${B}(?:hoga|hogi)${E}`, 'giu'), 'होगा'], [new RegExp(`(?<=[\\d°%)]\\s*)${B}(?:aa?yega|aa?ega|aata\\s+h(?:ai|ei)|aaya)${E}`, 'giu'), 'आएगा'],
  [new RegExp(`${B}aur${E}(?=\\s*[A-Za-z][0-9]?\\s*(?:=|\\d|के|बराबर|की|k[ia]\\s))`, 'giu'), 'और'],
  // "hai" after a value or after the answer's name; anywhere else it is left as typed ("ek doubt hai").
  [new RegExp(`(?<=(?:[\\d°%)]|${B}(?:answer|उत्तर))\\s*)${B}h(?:ai|ei|ain)${E}`, 'giu'), 'है'],
];

/** `t` (full-width forms already ASCII) read with one language's row. `session`: the session is in this language
 *  (and not only the text's wording says so). */
function worded(text: string, w: AnswerWords, session: boolean): string {
  let t = text.replace(/[’‘]/g, "'").replace(/।/g, '. ').replace(/[¿¡]/g, '');
  if (w.base === 'hi' && session) for (const [re, to] of ROMAN_HINDI) t = t.replace(re, to);
  // A decimal written with a comma, as France writes it (3,5): never a pair in brackets or a list.
  if (w.base === 'fr' && session) t = t.replace(/(?<![\d(,;.])(\d+),(\d+)(?![\d,;.)]|\s*[,;)])/g, '$1.$2');
  t = heardNumberWords(t, w.numbers);
  // A sign said as a word, where no number stands before it to subtract from ("égale moins 3"; "5 moins 3" is a difference).
  t = t.replace(new RegExp(`${B}(?:${w.minus})${E}\\s*(?=\\d)`, 'giu'), (m, at: number) => (/[\d)]\s*$|(?:^|[^A-Za-z])[A-Za-z]\s*$/.test(t.slice(0, at)) ? m : '-'));
  t = t.replace(new RegExp(`(\\d)\\s*(?:${w.percent})${E}`, 'giu'), '$1%');
  // Fractions as they are said: "3 sur 4", "3 quarts", "2 et 3 quarts", "3 बटा 4", "2 सही 1 बटा 3".
  for (const [name, d] of w.parts) {
    t = t.replace(new RegExp(`(${VALUE})\\s+(?:${w.mixed})\\s+(\\d+)\\s+(?:${name})${E}`, 'giu'), `$1 $2/${d}`)
      .replace(new RegExp(`(?<![\\d.])(\\d+)\\s+(?:${name})${E}`, 'giu'), `$1/${d}`);
  }
  t = t.replace(new RegExp(`(${VALUE})\\s+(?:${w.mixed})\\s+(\\d+)\\s*(?:${w.over})\\s*(\\d+)(?![\\d.])`, 'giu'), '$1 $2/$3')
    // Not a product: "multiply 3 by 4" is no fraction.
    .replace(new RegExp(`(?<![\\d.])(\\d+)\\s*${B}(?:${w.over})${E}\\s*(\\d+)(?![\\d.])`, 'giu'), (m, n: string, d: string, at: number, all: string) => (/(?:multipl\w*|गुणा)\s+$/iu.test(all.slice(0, at)) ? m : `${n}/${d}`))
    .replace(words(w.half), '1/2');
  t = t.replace(new RegExp(`(\\d)\\s*(?:${w.degree})${E}`, 'giu'), '$1°')
    .replace(new RegExp(`${B}(?:${w.angle})\\s+(?=[A-Z])`, 'gu'), '∠');
  // A part named: "partie a : 5/4", "(a) c'est 5/4", "भाग (a) का उत्तर 5/4 है" → "(a) 5/4".
  t = t.replace(new RegExp(`${B}(?:${w.part})\\s*\\(?\\s*([a-z]|\\d{1,2})\\s*\\)?(?![\\p{L}\\p{M}\\p{N}])\\s*[:,]?\\s*`, 'giu'), '($1) ')
    .replace(new RegExp(`(\\((?:[a-z]|\\d{1,2})\\))\\s*${w.labelLink}(?=[-\\d(√∠A-Za-z])`, 'giu'), '$1 ');
  // A value offered unsurely confirms and never denies, as "maybe 11?" does.
  const tag = new RegExp(`[,\\s]*${B}(?:${w.askTail})\\s*\\?+\\s*$`, 'iu');
  const lead = new RegExp(`^\\s*(?:${w.askLead})${w.base === 'hi' ? '' : E}\\s*`, 'iu');
  let ask = /\?\s*$/.test(t) || (!!w.alwaysAsks && lead.test(t));
  if (tag.test(t)) { t = t.replace(tag, ''); ask = true; }
  if (ask) t = t.replace(/[\s?]+$/, '');
  const unsureAfter = new RegExp(`[,\\s]*${B}(?:${w.maybeAfter})${E}[\\s.]*$`, 'iu');
  const hedge = new RegExp(`^\\s*(?:(${w.notSure})${E}[,.\\s]*)?(?:(?:${w.maybe})${E}[,\\s]*)+(?:(?:${w.answer}|${w.itIs})${E}\\s*)?`, 'iu');
  const notSure = new RegExp(`^\\s*(?:${w.notSure})${E}[,.\\s]*(?=\\S)`, 'iu');
  if (hedge.test(t)) t = t.replace(hedge, (_m, unsure?: string) => `${unsure ? "I don't know, " : ''}maybe `);
  else if (unsureAfter.test(t) && /\d/.test(t)) t = `maybe ${t.replace(unsureAfter, '')}`;
  else if (notSure.test(t)) t = t.replace(notSure, "I don't know, ");
  else if (ask && lead.test(t)) t = t.replace(lead, 'is it ').replace(new RegExp(`^is it (?:${w.answer})${E}\\s*`, 'iu'), 'is it ');
  if (ask) t = `${t.trimEnd()}?`;
  // "It is 12" as the whole message is the value.
  t = t.replace(new RegExp(`^\\s*(?:${w.itIs})${E}\\s+(?=${VALUE}(?:\\/\\d+)?\\s*[%°]?\\s*[.!?]*\\s*$)`, 'iu'), '');
  // The answer named as the answer, and a value given to a name.
  // Before a value or a name only: जवाब दो ("give the answer") names no answer.
  t = t.replace(new RegExp(`${B}(?:${w.answer})${E}\\s*[:=]?\\s*(?=[-\\d(√∠A-Za-z])`, 'giu'), 'the answer is ')
    .replace(new RegExp(`\\s*${B}(?:${w.equals})${E}\\s*`, 'giu'), ' = ')
    // Hindi puts the verb after the value, or leaves it out ("x 4 है", "x 4, y 2"); never the x of "2 x 4".
    .replace(new RegExp(`((?:^|(?<!\\d\\s*)[^\\p{L}\\p{M}\\p{N}])(?:∠[A-Z]{1,3}|[A-Za-z][0-9]?))\\s*${w.close ? `(?:${w.nameIs})?\\s*(?=-?[\\d√(][^\\s,]*\\s*(?:(?:${w.close})${E}|[,;.]|$))` : `${B}(?:${w.nameIs})${E}\\s*(?=-?[\\d√(])`}`, 'giu'), '$1 = ');
  if (w.close) t = t.replace(new RegExp(`(?<=[\\d°%)])\\s*(?:${w.close})${E}`, 'giu'), '');
  t = t.replace(new RegExp(`(?<=\\d[%°]?)\\s+(?:${w.and})\\s+(?=(?:∠[A-Z]{1,3}|[A-Za-z][0-9]?)\\s*=)`, 'giu'), ', ');
  return t.replace(/\s+([.,?])/g, '$1').replace(/[ \t]{2,}/g, ' ').trim();
}
