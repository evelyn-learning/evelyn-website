/**
 * Numbers a learner SAYS in Hindi, French, Spanish or English words, written as digits.
 *
 * 2026-11-24, with the Hindi, Hinglish, French and Spanish lessons. The recogniser writes a spoken number as a
 * word as often as a digit ("x बराबर चार", "ça fait douze", "la respuesta es treinta y dos", "answer four है"), and
 * everything that reads an answer for its value reads digits (heard-numerals.ts has the same for Chinese and
 * Japanese). A learner in any of these lessons may say a number in English, so English words are read too.
 *
 * A word that is only ever a number (सात, douze, quince, seven) and a number of several words (दो सौ पचास,
 * vingt et un, treinta y dos, twenty one) is always written as digits. A word that is also an ordinary word
 * (एक "a", दो "give", un / une, un / una / uno, neuf "new", one) is a number only where it stands as one: beside
 * an operator or equals word or sign, a variable letter or a digit, after "the answer" with its verb, next to
 * another number, or as the whole of a short reply. "मुझे hint दो", "एक मिनट", "c'est un problème", "es una
 * ecuación", "this one" stay as they are.
 *
 * One table per language; nothing here names a subject. Pure. Client-safe.
 */

export type NumberWordLanguage = 'hi' | 'fr' | 'es' | 'en';

/** A word as the tables key it: lower case, Latin accents and the Devanagari nukta dropped, ँ read as ं
 *  (पाँच / पांच, हज़ार / हजार, dieciséis / dieciseis). */
const norm = (w: string): string => w.toLowerCase().normalize('NFD').replace(/[̀-़ͯ]/g, '').replace(/ँ/g, 'ं');
const setOf = (words: string): Set<string> => new Set(words.split(/\s+/).filter(Boolean).map(norm));

interface NumberWords {
  value: Map<string, number>;
  /** Words that are also ordinary words. */
  weak: Set<string>;
  /** The word that joins two parts of one number (vingt et un, treinta y dos, one hundred and five). */
  joiner?: string;
  /** The word for the decimal mark. */
  point: Set<string>;
  /** Before a number: operator and equals words. `beforePair`: the same as two words ("égal à", "divided by"). */
  before: Set<string>; beforePair: Set<string>;
  /** After a number: operator words, which make it a number when a number, digit or letter follows them in turn
   *  ("uno más dos"; "uno más" alone is "one more"), and `unit`: percent, degree and fraction words. */
  after: Set<string>; unit: Set<string>;
  /** "The answer" / "the value": a number follows when its verb closes it (उत्तर दो है; never जवाब दो, "give the answer"). */
  lead: Set<string>;
  /** What may close a stated value (है, होगा). */
  close: Set<string>;
  /** Every other word a reply that is only a number may hold. */
  small: Set<string>;
  /** Single letters that are words, not variables. */
  notVariable: Set<string>;
}

// 0–100 in Hindi are words of their own. Variants a recogniser writes are listed with |.
const HINDI_0_TO_100 = 'शून्य|ज़ीरो एक दो तीन चार पाँच छह|छः|छे|छै सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह|पन्द्रह सोलह सत्रह अठारह|अट्ठारह उन्नीस बीस '
  + 'इक्कीस बाईस|बाइस तेईस|तेइस चौबीस पच्चीस छब्बीस सत्ताईस|सत्ताइस अट्ठाईस|अठाईस|अट्ठाइस उनतीस|उन्तीस तीस इकतीस|इकत्तीस बत्तीस तैंतीस|तेंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस|उन्तालीस चालीस '
  + 'इकतालीस बयालीस तैंतालीस चौवालीस|चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन|अठावन उनसठ साठ '
  + 'इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी|उन्यासी अस्सी '
  + 'इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी|अठासी नवासी नब्बे इक्यानवे|इक्यानबे बानवे|बानबे तिरानवे|तिरानबे चौरानवे|चौरानबे पचानवे|पंचानवे|पचानबे छियानवे|छियानबे सत्तानवे|सत्तानबे अट्ठानवे|अठानवे|अट्ठानबे निन्यानवे|निन्यानबे सौ';

function valueMap(inOrder: string, more: Record<string, number> = {}): Map<string, number> {
  const m = new Map<string, number>();
  inOrder.split(/\s+/).filter(Boolean).forEach((entry, i) => { for (const w of entry.split('|')) m.set(norm(w), i); });
  for (const [w, v] of Object.entries(more)) for (const x of w.split('|')) m.set(norm(x), v);
  return m;
}

const TABLES: Readonly<Record<NumberWordLanguage, NumberWords>> = {
  hi: {
    // डेढ़ (1.5) and ढाई (2.5) are said as often as the numbers themselves.
    value: valueMap(HINDI_0_TO_100, { 'हज़ार': 1000, 'लाख': 100000, 'डेढ़': 1.5, 'ढाई|अढ़ाई': 2.5 }),
    weak: setOf('एक दो'),
    point: setOf('दशमलव पॉइंट point'),
    before: setOf('बराबर equals equal plus प्लस minus माइनस गुणा गुना into इनटू बटा भाग जमा घटा times ऋण शायद'),
    beforePair: new Set(['के बराबर', 'लगता है'].map((p) => p.split(' ').map(norm).join(' '))),
    after: setOf('plus प्लस minus माइनस गुणा गुना into इनटू बटा बराबर जमा घटा times equals सही पूर्णांक'),
    unit: setOf('प्रतिशत percent परसेंट डिग्री'),
    lead: setOf('उत्तर जवाब answer आंसर value वैल्यू मान'),
    close: setOf('है हैं होगा होगी आएगा आयेगा आया आता होता ना न क्या तो होना चाहिए'),
    // Not मुझे / ये / तो / ठीक: "मुझे दो", "ये दो", "तो दो" ask to be given something.
    small: setOf('हाँ जी है हैं होगा होगी आएगा आया शायद ना न क्या सर मैम'),
    notVariable: new Set(),
  },
  fr: {
    value: valueMap('zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize', { une: 1, 'vingt|vingts': 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60, septante: 70, 'huitante|octante': 80, nonante: 90, 'cent|cents': 100, mille: 1000 }),
    weak: setOf('un une neuf'),
    joiner: 'et',
    point: setOf('virgule'),
    before: setOf('égale égal égaux fait font donne vaut plus moins sur est fois'),
    beforePair: new Set(['egal a', 'egale a', 'egaux a', 'divise par', 'multiplie par', 'peut etre']),
    after: setOf('plus moins divisé multiplié sur égale égal fois'),
    unit: setOf('degré degrés demi demis tiers quart quarts'),
    lead: new Set(),
    close: setOf('je non'),
    small: setOf('oui ouais euh ben bah alors donc c est ce ça fait je pense crois dirais peut être que on obtient trouve j ai non'),
    notVariable: new Set(['a', 'y']),
  },
  es: {
    value: valueMap('cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve', {
      'un|una': 1, 'veintiún|veintiuna': 21, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90, 'cien|ciento': 100,
      'doscientos|doscientas': 200, 'trescientos|trescientas': 300, 'cuatrocientos|cuatrocientas': 400, 'quinientos|quinientas': 500, 'seiscientos|seiscientas': 600, 'setecientos|setecientas': 700, 'ochocientos|ochocientas': 800, 'novecientos|novecientas': 900, mil: 1000,
    }),
    weak: setOf('un una uno'),
    joiner: 'y',
    point: setOf('punto coma'),
    before: setOf('igual es son da dan más menos por entre sobre vale queda sale quizás quizá'),
    beforePair: new Set(['igual a', 'dividido por', 'dividido entre', 'multiplicado por', 'tal vez']),
    after: setOf('más menos por entre sobre igual'),
    unit: setOf('grado grados medio medios tercio tercios cuarto cuartos'),
    lead: new Set(),
    close: setOf('creo no'),
    small: setOf('sí eh pues es son la creo que pienso da me sale dio entonces ok no sería tal vez quizás mmm'),
    notVariable: new Set(['a', 'y', 'e', 'o', 'u']),
  },
  en: {
    value: valueMap('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen', { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000 }),
    // "a hundred" is not 100 written twice: a multiplier alone is a number only in a number's place.
    weak: setOf('one hundred thousand'),
    joiner: 'and',
    point: setOf('point'),
    before: setOf('equals equal is plus minus times over get got gives makes maybe'),
    beforePair: new Set(['equal to', 'divided by', 'multiplied by']),
    after: setOf('plus minus times over divided equals'),
    unit: setOf('percent squared cubed'),
    lead: setOf('answer value'),
    close: setOf('right i'),
    small: setOf('yes yeah yep no ok okay um uh so it is its s i think guess maybe the would be'),
    notVariable: new Set(['a', 'i']),
  },
};

/** English words that are ordinary words of the lesson's language: "four" is an oven in French, "ten" is "have" in Spanish. */
const ENGLISH_WEAK_IN: Readonly<Partial<Record<NumberWordLanguage, Set<string>>>> = { fr: new Set(['four']), es: new Set(['ten']) };

/** Hindi words said before a number that change it by a part: साढ़े तीन (3.5), सवा दो (2.25), पौने तीन (2.75). */
const HINDI_PART: ReadonlyMap<string, number> = new Map([[norm('साढ़े'), 0.5], [norm('सवा'), 0.25], [norm('पौने'), -0.25]]);

/**
 * The value of number words said as one number, or null when they are not one ("दस बीस", "two three").
 * `words`: the tokens as keyed (norm). French builds 70–99 from 60 and 4 × 20; Hindi has a word for each of 0–99.
 */
export function numberWordsValue(words: readonly string[], lang: NumberWordLanguage): number | null {
  const table = TABLES[lang].value;
  let total = 0; let cur = 0; let open = true; // open: nothing below a hundred has been said in this group yet
  let lastBig = Infinity;
  for (let i = 0; i < words.length; i++) {
    const v = table.get(words[i]!);
    if (v === undefined) return null;
    if (!Number.isInteger(v)) { if (i !== 0) return null; cur = v; open = false; continue; }
    if (v >= 1000) {
      if (v >= lastBig || cur >= v) return null;
      total += (cur || 1) * v; cur = 0; open = true; lastBig = v;
      continue;
    }
    if (v === 100) {
      if (cur === 0 && open) cur = 100;
      // "बारह सौ" and "twelve hundred" are 1200; French and Spanish count hundreds with one digit.
      else if (cur > 0 && (cur < 10 || ((lang === 'hi' || lang === 'en') && cur < 100))) cur *= 100;
      else return null;
      open = true;
      continue;
    }
    if (v > 100) { if (cur !== 0 || !open) return null; cur = v; open = true; continue; }
    if (!Number.isInteger(cur)) return null;
    const rem = cur % 100;
    if (rem === 0 && open) cur += v;
    else if (lang === 'fr' && rem === 4 && v === 20 && words[i - 1] === 'quatre') cur += 76;
    else if (lang !== 'hi' && rem >= 20 && rem % 10 === 0 && v > 0 && v < 10) cur += v;
    else if (lang === 'fr' && (rem === 60 || rem === 80) && v >= 10 && v < 20) cur += v;
    else if (lang === 'fr' && rem === 10 && v >= 7 && v <= 9) cur += v;
    else return null;
    open = false;
  }
  return total + cur;
}

/** Whether the joiner may stand between a number so far and the next word (vingt ET un, treinta Y dos, hundred AND five). */
function joins(lang: NumberWordLanguage, soFar: number, next: number): boolean {
  const rem = soFar % 100;
  if (lang === 'fr') return (next === 1 && rem >= 20 && rem <= 60 && rem % 10 === 0) || (next === 11 && rem === 60);
  if (lang === 'es') return rem >= 20 && rem % 10 === 0 && next > 0 && next < 10;
  return soFar > 0 && rem === 0 && next > 0 && next < 100;
}

const PIECE = /[\p{L}\p{M}]+|\d+(?:\.\d+)?|[^\p{L}\p{M}\d]+/gu;
const isWord = (p: string | undefined): p is string => !!p && /^[\p{L}\p{M}]/u.test(p);
const isDigits = (p: string | undefined): boolean => !!p && /^\d/.test(p);
/** Only spaces or a hyphen between two words of one number. */
const WITHIN = /^(?:[ \t]+|[ \t]*[-‑][ \t]*)$/;
/** A mark that ends a clause: what stands across it is no context. */
const BREAK = /[,.;:!?।…()¿¡\n]/;
/** An operator or equals sign between a word and its neighbour. A bare hyphen joins words (एक-एक) and is none. */
const OPERATOR = /[=+×÷*^]|\s[-−](?:\s|$)|^[-−]\s/;
/** "pour cent", "por ciento": the hundred of a percentage is not a number of its own. */
const PERCENT_PAIR: Readonly<Record<string, string>> = { pour: 'cent', por: 'ciento' };

interface Found { from: number; to: number; digits: string; weak: boolean; word: string; lang: NumberWordLanguage; number: boolean }

/** The learner's words with the numbers in them as digits, for a lesson in `langs` (the lesson's own language first,
 *  English after it). Text that holds no number word, and words that are not numbers where they stand, come back
 *  unchanged. */
export function heardNumberWords(text: string, langs: readonly NumberWordLanguage[]): string {
  if (!langs.length || !text) return text;
  // Devanagari digits are digits.
  const t = langs.includes('hi') ? text.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966)) : text;
  const pieces = t.match(PIECE) ?? [];
  const keys = pieces.map((p) => (isWord(p) ? norm(p) : ''));
  const langOf = (i: number): NumberWordLanguage | null => (keys[i] ? langs.find((l) => TABLES[l].value.has(keys[i]!)) ?? null : null);
  const extraWeak = ENGLISH_WEAK_IN[langs[0]!];
  const all = <K extends 'point' | 'before' | 'beforePair' | 'after' | 'unit' | 'lead' | 'close' | 'small'>(k: K, w: string) => langs.some((l) => TABLES[l][k].has(w));
  const notVariable = TABLES[langs[0]!].notVariable;
  const isVariable = (p: string | undefined) => !!p && /^[A-Za-z]$/.test(p) && !notVariable.has(p.toLowerCase());

  /** The words of one number starting at piece `i`: the piece after its last word, and its value. */
  const runAt = (i: number, lang: NumberWordLanguage): { to: number; value: number; words: number } | null => {
    const table = TABLES[lang];
    if (!table.value.has(keys[i]!)) return null;
    let words = [keys[i]!]; let to = i + 1;
    let value = numberWordsValue(words, lang);
    if (value === null) return null;
    for (;;) {
      if (!WITHIN.test(pieces[to] ?? '')) break;
      let at = to + 1;
      const joined = !!table.joiner && keys[at] === table.joiner && WITHIN.test(pieces[at + 1] ?? '');
      if (joined) at += 2;
      if (!table.value.has(keys[at] ?? '')) break;
      const more = numberWordsValue([...words, keys[at]!], lang);
      if (more === null || (joined && !joins(lang, value, table.value.get(keys[at]!)!))) break;
      words = [...words, keys[at]!]; value = more; to = at + 1;
    }
    return { to, value, words: words.length };
  };

  /** The digits said after the decimal word: one by one ("one four"), or as one number ("vingt-cinq"). */
  const decimalsAt = (start: number): { digits: string; to: number } | null => {
    const lang = langOf(start);
    if (!lang) return null;
    const one: string[] = []; let i = start; let to = start;
    while (one.length < 6) {
      const v = TABLES[lang].value.get(keys[i] ?? '');
      if (v === undefined || !Number.isInteger(v) || v > 9) break;
      one.push(String(v)); to = i + 1;
      if (!/^[ \t]+$/.test(pieces[i + 1] ?? '')) break;
      i += 2;
    }
    if (one.length) return { digits: one.join(''), to };
    const run = runAt(start, lang);
    return run && Number.isInteger(run.value) ? { digits: String(run.value), to: run.to } : null;
  };

  const found: Found[] = [];
  for (let i = 0; i < pieces.length; i++) {
    let start = i; let part = 0;
    // साढ़े / सवा / पौने before a Hindi number.
    if (langs.includes('hi') && HINDI_PART.has(keys[i]!) && /^[ \t]+$/.test(pieces[i + 1] ?? '') && TABLES.hi.value.has(keys[i + 2] ?? '')) { part = HINDI_PART.get(keys[i]!)!; start = i + 2; }
    const lang = langOf(start);
    if (!lang || (start >= 2 && PERCENT_PAIR[keys[start - 2]!] === keys[start])) continue;
    const run = runAt(start, lang);
    if (!run) continue;
    let { to, value } = run;
    let compound = run.words > 1 || part !== 0;
    if (part) {
      // The part belongs to the first word: साढ़े तीन सौ is 350.
      const first = TABLES.hi.value.get(keys[start]!)!;
      if (first < 1 || first >= 100 || !Number.isInteger(first)) continue;
      value = (value / first) * (first + part);
    }
    let digits = String(Math.round(value * 100) / 100);
    // A decimal part: "three point five", "trois virgule vingt-cinq", "तीन दशमलव पाँच".
    if (Number.isInteger(value) && /^[ \t]+$/.test(pieces[to] ?? '') && all('point', keys[to + 1] ?? '') && /^[ \t]+$/.test(pieces[to + 2] ?? '')) {
      const frac = decimalsAt(to + 3);
      if (frac) { digits = `${digits}.${frac.digits}`; to = frac.to; compound = true; }
    }
    const word = keys[start]!;
    const weak = !compound && (TABLES[lang].weak.has(word) || (lang === 'en' && !!extraWeak?.has(word)));
    found.push({ from: i, to, digits, weak, word, lang, number: !weak });
    i = to - 1;
  }
  if (!found.length) return t;

  const at = new Map<number, Found>(); const endsAt = new Map<number, Found>();
  for (const f of found) { at.set(f.from, f); endsAt.set(f.to - 1, f); }
  const wordPieces = pieces.filter((p) => isWord(p) || isDigits(p)).length;

  /** A weak word standing as a number (the file's header). */
  const standsAsNumber = (f: Found): boolean => {
    // The whole of a short reply: "दो।", "हाँ, एक है", "c'est un", "es uno".
    if (found.length === 1 && wordPieces <= 6 && pieces.every((p, i) => (i >= f.from && i < f.to) || !isWord(p) && !isDigits(p) || (isWord(p) && all('small', keys[i]!)))) return true;
    const sepBefore = f.from > 0 && !isWord(pieces[f.from - 1]) && !isDigits(pieces[f.from - 1]) ? pieces[f.from - 1]! : '';
    const sepAfter = f.to < pieces.length && !isWord(pieces[f.to]) && !isDigits(pieces[f.to]) ? pieces[f.to]! : '';
    const pi = f.from - (sepBefore ? 2 : 1); const ni = f.to + (sepAfter ? 1 : 0);
    const prev = pi >= 0 && !BREAK.test(sepBefore) ? pieces[pi] : undefined;
    const next = ni < pieces.length && !BREAK.test(sepAfter) ? pieces[ni] : undefined;
    const p = prev && isWord(prev) ? keys[pi]! : ''; const n = next && isWord(next) ? keys[ni]! : '';
    const pp = p && pi >= 2 && isWord(pieces[pi - 2]) && !BREAK.test(pieces[pi - 1] ?? '') ? keys[pi - 2]! : '';
    const opBefore = OPERATOR.test(sepBefore); const opAfter = OPERATOR.test(sepAfter);
    // Another number beside it, unless it is the same word said twice (एक-एक, दो-दो: "one by one").
    const numberBefore = !!prev && !!endsAt.get(pi)?.number && endsAt.get(pi)!.word !== f.word;
    const numberAfter = !!next && !!at.get(ni)?.number && at.get(ni)!.word !== f.word;
    const closes = !next || all('close', n);
    // The same word on both sides of "por" is "one by one" (una por una), not a product.
    const byOne = (i: number) => keys[i] === 'por' && keys[i - 2] === f.word && keys[i + 2] === f.word;
    const prevContext = opBefore || isDigits(prev) || isVariable(prev) || numberBefore
      || (!!p && !byOne(pi) && (all('before', p) || (!!pp && all('beforePair', `${pp} ${p}`))
        // उत्तर दो है / answer है दो: the answer named, with its verb.
        || (all('lead', p) && !!n && all('close', n)) || (!!pp && all('lead', pp) && all('close', p))));
    // What an operator word after it leads to: "uno más dos" is a sum, "uno más" is "one more", "una por una" "one by one".
    const li = ni + 2;
    const led = !!n && all('after', n) && !byOne(ni) && !BREAK.test(pieces[ni + 1] ?? '.') && (isDigits(pieces[li]) || isVariable(pieces[li]) || !!at.get(li));
    const nextContext = opAfter || numberAfter || led || (!!n && (all('unit', n) || (!!PERCENT_PAIR[n] && PERCENT_PAIR[n] === keys[li]))) || (f.lang === 'hi' && isVariable(next));
    // An ordinary word straight after it makes it one too: "c'est un problème", "x plus एक मिनट".
    const nextAllows = closes || opAfter || isDigits(next) || isVariable(next) || (!!n && (all('after', n) || all('unit', n))) || !!at.get(ni);
    return nextContext || (prevContext && nextAllows);
  };
  // Twice: a weak word beside another that has just been read as a number (एक दो तीन).
  for (let k = 0; k < 3; k++) {
    let changed = false;
    for (const f of found) if (!f.number && standsAsNumber(f)) { f.number = true; changed = true; }
    if (!changed) break;
  }
  if (!found.some((f) => f.number)) return t;
  let out = ''; let i = 0;
  while (i < pieces.length) {
    const f = at.get(i);
    if (f?.number) { out += f.digits; i = f.to; } else { out += pieces[i]; i += 1; }
  }
  return out;
}

/** The number-word languages of a lesson taught in `base` (voice/lesson-language.ts): its own and English. None for
 *  an English lesson (the recogniser writes English numbers as digits already) and for a language with no table. */
export function numberWordLanguages(base: string | null | undefined): NumberWordLanguage[] {
  return base === 'hi' || base === 'fr' || base === 'es' ? [base, 'en'] : [];
}
