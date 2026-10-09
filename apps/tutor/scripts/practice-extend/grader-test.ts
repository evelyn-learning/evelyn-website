/**
 * Offline test of practice answer keys against the product's REAL grading
 * code. No database, no model call, no network (guards below throw on any
 * socket / fetch and the run reports the counters).
 *
 *   npx tsx scripts/practice-extend/grader-test.ts test --rows <rows.json> --out <dir> --data <D>
 *   npx tsx scripts/practice-extend/grader-test.ts fix  --data <D>
 *
 * What grades a practice answer in the product:
 *   mcq      academy card: correctChoiceIdOf (web shared.tsx) + isChoiceCorrect (web lib.ts);
 *            stored grade: gradeItem (api ArtifactService.ts). Deterministic.
 *   numeric  academy card: numericMatch (web lib.ts); stored grade: gradeItem →
 *            numericAnswerVerdict (api numericAnswer.ts). Deterministic.
 *   free     academy posts to the engine /api/portal/v1/grade → gradeFreeResponse:
 *            gradeNumericAnswer when the key is a plain number AND the answer is a
 *            single number; otherwise the model judge. Here the judge is replaced
 *            by a stub that records "deferred" — nothing is called.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { createRequire } from 'node:module';
import { gradeFreeResponse, type GradeDeps } from '../../src/lib/tutor/portal/grade-free-response';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { coverageAfter, referencesOptionByLetter, type Pack } from './ingest-core';

// ── no-network guards ───────────────────────────────────────────────────────
const guard = { sockets: 0, fetches: 0, judgeStubCalls: 0 };
const realConnect = net.Socket.prototype.connect;
(net.Socket.prototype as unknown as { connect: unknown }).connect = function blocked(): never {
  guard.sockets += 1;
  throw new Error('grader-test: a network connection was attempted — refused');
};
void realConnect;
(globalThis as unknown as { fetch: unknown }).fetch = async (): Promise<never> => {
  guard.fetches += 1;
  throw new Error('grader-test: fetch was attempted — refused');
};
for (const k of ['ANTHROPIC_API_KEY', 'DEEPSEEK_API_KEY', 'OPENAI_API_KEY', 'OPENROUTER_API_KEY']) {
  if (process.env[k]) throw new Error(`grader-test: ${k} is set — run with it unset`);
}

// ── the academy's real functions (read-only reference checkout) ─────────────
const ACADEMY = '/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot';
const req = createRequire(__filename);
(req as unknown as { extensions: Record<string, (m: { exports: unknown }) => void> }).extensions['.css'] = (m) => { m.exports = new Proxy({}, { get: (_t, k) => String(k) }); };
type Choice = { id: string; text: string; correct?: boolean };
type CardItem = { id: string; problemText: string; responseFormat: string; expectedAnswer?: string; choices?: Choice[] };
const webLib = req(`${ACADEMY}/apps/web/components/practice/lib.ts`) as {
  isChoiceCorrect(answer: string, correctId?: string): boolean;
  numericMatch(expected: string, answer: string): boolean;
  numericAnswerVerdict(expected: string, answer: string): boolean | null;
  hasTypedAnswer(a: string | undefined | null): boolean;
};
const webShared = req(`${ACADEMY}/apps/web/components/practice/shared.tsx`) as { correctChoiceIdOf(it: { choices?: Choice[]; expectedAnswer?: string }): string | undefined };
const apiArtifact = req(`${ACADEMY}/apps/api/src/services/ArtifactService.ts`) as { gradeItem(item: CardItem, answer: string): { gradable: boolean; correct?: boolean } };

// ── types ───────────────────────────────────────────────────────────────────
interface Row {
  id: string; loId: string; problemText: string; answer: string; responseFormat: 'mcq' | 'numeric' | 'free';
  choices: string[]; hints: string[]; solutionText: string; [k: string]: unknown;
}
interface Grade { id: string; blindAnswer?: string; agreesWithKey?: boolean; grade?: string; reason?: string; file?: string }
type Outcome = 'accepted' | 'rejected' | 'deferred' | 'blocked';
interface Sub { cls: 'key' | 'equiv' | 'wrong' | 'info'; kind: string; text: string }
interface SubResult extends Sub { outcome: Outcome; stored?: Outcome }

const LETTERS = 'ABCD';
const asciiMinus = (s: string) => s.replace(/[−–]/g, '-');
const readJson = <T,>(f: string): T => JSON.parse(fs.readFileSync(f, 'utf8')) as T;

// ── graders ─────────────────────────────────────────────────────────────────
/** A ProblemBank row as the card receives it (engine adapters.ts: choices are
 *  strings in display order, ids are the positional letters). */
function cardItem(r: Row): CardItem {
  return { id: r.id, problemText: r.problemText, responseFormat: r.responseFormat, expectedAnswer: r.answer, choices: r.responseFormat === 'mcq' ? r.choices.map((t, i) => ({ id: LETTERS[i] ?? String(i), text: t })) : undefined };
}
const judgeStub: GradeDeps = {
  gradeRubricPart: async () => { guard.judgeStubCalls += 1; throw new JudgeDeferred(); },
  judgeSingleAnswer: async () => { guard.judgeStubCalls += 1; throw new JudgeDeferred(); },
};
class JudgeDeferred extends Error {}

async function grade(r: Row, text: string): Promise<{ outcome: Outcome; stored?: Outcome }> {
  const it = cardItem(r);
  const b = (x: boolean): Outcome => (x ? 'accepted' : 'rejected');
  if (r.responseFormat === 'mcq') {
    const card = b(webLib.isChoiceCorrect(text, webShared.correctChoiceIdOf(it)));
    return { outcome: card, stored: b(apiArtifact.gradeItem(it, text).correct === true) };
  }
  if (r.responseFormat === 'numeric') {
    if (!webLib.hasTypedAnswer(text)) return { outcome: 'blocked' };
    return { outcome: b(webLib.numericMatch(r.answer, text)), stored: b(apiArtifact.gradeItem(it, text).correct === true) };
  }
  if (!webLib.hasTypedAnswer(text)) return { outcome: 'blocked' }; // the card does not send an empty answer
  try {
    const res = await gradeFreeResponse({ studentId: 'offline', itemId: r.id, response: { text } } as never, { itemId: r.id, expectedAnswer: r.answer, problemText: r.problemText }, judgeStub);
    return { outcome: b(res.totalPoints === res.maxPoints && res.maxPoints > 0) };
  } catch (e) {
    if (e instanceof JudgeDeferred) return { outcome: 'deferred' };
    throw e;
  }
}

// ── submission generators ───────────────────────────────────────────────────
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const roundHalfAway = (v: number, p: number) => (Math.sign(v) * Math.round(Math.abs(v) * 10 ** p + 1e-9)) / 10 ** p;
const WORD_N: Record<string, number> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const numWord = (w: string): number | null => (/^\d+$/.test(w) ? Number(w) : w.toLowerCase() in WORD_N ? WORD_N[w.toLowerCase()] : null);

const UNIT_WORDS = 'newtons?|joules?|watts?|met(?:er|re)s?|centimet(?:er|re)s?|kilomet(?:er|re)s?|millimet(?:er|re)s?|seconds?|minutes?|hours?|days?|years?|grams?|kilograms?|moles?|lit(?:er|re)s?|millilit(?:er|re)s?|kelvins?|degrees(?: Celsius)?|volts?|amperes?|amps|ohms?|pascals?|hertz|coulombs?|radians?|decibels?|kilojoules?|feet|inches|units|square units|cubic units';
const UNIT_SYMS = '(?:[kmcμµnM]?(?:mol|Pa|Hz|eV|atm|dB|min|m|g|s|N|J|W|V|A|C|K|L|M|h|Ω)|°C|°)(?:[\\/·⋅][A-Za-zμµΩ]+)*(?:[²³]|\\^-?\\d)?(?:[\\/·⋅][A-Za-zμµΩ]+(?:[²³]|\\^-?\\d)?)*';
const UNIT_RE = new RegExp(`\\b[Ii]n (?:the |whole |units of )?(${UNIT_WORDS}|${UNIT_SYMS})(?=[\\s,.?;:)]|$)`);
/** A unit the stem names for the answer ("…, in newtons?" / "in m/s"). */
export function stemUnit(stem: string): string | null {
  const tail = stem.slice(Math.max(0, stem.length - 260));
  const m = tail.match(UNIT_RE);
  return m ? m[1] : null;
}
const stemWantsPercent = (stem: string) => /\b(?:as a percent(?:age)?|in percent|what percent(?:age)?|percent(?:age)? (?:of|yield|composition|error|by mass)|\(in %\)|in %)/i.test(stem.slice(-260));

/** Decimal places the stem asks for, or null. */
export function stemPlaces(stem: string): number | null {
  const s = stem;
  let m = s.match(/\b(?:to|correct to|rounded to|round(?:ed)? (?:your answer |the answer |it )?to|accurate to) (\w+) decimal places?/i) ?? s.match(/\b(\w+) decimal places?\b/i);
  if (m) { const n = numWord(m[1]); if (n !== null) return n; }
  m = s.match(/\b(?:to the )?nearest (tenth|hundredth|thousandth|whole number|integer)\b/i);
  if (m) return ({ tenth: 1, hundredth: 2, thousandth: 3, 'whole number': 0, integer: 0 } as Record<string, number>)[m[1].toLowerCase()];
  if (/\bnearest cent\b/i.test(s)) return 2;
  if (/\bnearest (?:whole )?(?:dollar|degree|second|percent|metre|meter|year)\b/i.test(s)) return 0;
  return null;
}
export function stemSigFigs(stem: string): number | null {
  const m = stem.match(/\b(\w+) significant (?:figures?|digits?)\b/i) ?? stem.match(/\b(\d) (?:s\.?f\.?|sig\.? figs?)\b/i);
  return m ? numWord(m[1]) : null;
}
/** [min, max] significant figures a written number can be read as. */
function sigFigRange(t: string): [number, number] {
  const u = t.replace(/^-/, '');
  if (u.includes('.')) { const d = u.replace('.', '').replace(/^0+/, ''); return [d.length || 1, d.length || 1]; }
  const d = u.replace(/^0+/, '');
  const core = d.replace(/0+$/, '');
  return [core.length || 1, d.length || 1];
}

function sciForms(keyText: string): string[] {
  const v = Number(keyText);
  if (!Number.isFinite(v) || v === 0) return [];
  const a = Math.abs(v);
  if (!(a >= 1e5 || a < 1e-3)) return [];
  let digits = keyText.replace(/^-/, '').replace('.', '').replace(/^0+/, '');
  if (!keyText.includes('.')) digits = digits.replace(/0+$/, '') || '0';
  const exp = Math.floor(Math.log10(a) + 1e-12);
  const mant = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
  const sign = v < 0 ? '-' : '';
  return [`${sign}${mant}e${exp}`, `${sign}${mant} × 10^${exp}`, `${sign}${mant}*10^${exp}`];
}

function readerAlternatives(key: string, grades: Grade[]): string[] {
  const out = new Set<string>();
  for (const g of grades) {
    for (const sentence of (g.reason ?? '').split(/(?<=[.;])\s+/)) {
      if (!/match|accept|equivalent|typed|typing|forms?\b/i.test(sentence)) continue;
      if (/wrong|incorrect|distractor|hint/i.test(sentence)) continue;
      for (const m of sentence.matchAll(/"([^"]{1,40})"|“([^”]{1,40})”|'([^']{1,40})'/g)) {
        const t = (m[1] ?? m[2] ?? m[3] ?? '').trim();
        if (t && t !== key) out.add(t);
      }
    }
  }
  return [...out];
}

function numericSubs(r: Row, grades: Grade[]): Sub[] {
  const subs: Sub[] = [{ cls: 'key', kind: 'stored-key', text: r.answer }];
  const eq = (kind: string, text: string) => { if (text !== r.answer && !subs.some((s) => s.text === text)) subs.push({ cls: 'equiv', kind, text }); };
  const wr = (kind: string, text: string) => { if (!subs.some((s) => s.text === text)) subs.push({ cls: 'wrong', kind, text }); };
  const k = asciiMinus(r.answer.trim());
  const frac = k.match(/^(-?\d+)\/(\d+)$/);
  if (frac) {
    const n = Number(frac[1]); const d = Number(frac[2]); const v = n / d;
    eq('fraction-unreduced', `${2 * n}/${2 * d}`);
    eq('fraction-as-2dp', roundHalfAway(v, 2).toFixed(2));
    eq('fraction-as-3dp', roundHalfAway(v, 3).toFixed(3));
    eq('surrounding-spaces', ` ${k} `);
    eq('spaced-slash', `${n} / ${d}`);
    if (n < 0) eq('unicode-minus', k.replace('-', '−'));
    if (n > 0) eq('leading-plus', `+${k}`);
    eq('x-equals', `x = ${k}`);
    eq('trailing-period', `${k}.`);
    wr('numerator+1', `${n + 1}/${d}`);
    wr('wrong-sign', `${-n}/${d}`);
    wr('reciprocal', `${n < 0 ? '-' : ''}${d}/${Math.abs(n)}`);
    // a one-place decimal is wrong only when the fraction is not exactly that value (−13/5 IS −2.6)
    if (Math.abs(roundHalfAway(v, 1) - v) > 1e-9) wr('1dp-only', roundHalfAway(v, 1).toFixed(1));
    wr('2dp-off-by-one', (roundHalfAway(v, 2) + 0.01).toFixed(2));
    return subs;
  }
  const v = Number(k);
  const dot = k.indexOf('.');
  const places = dot < 0 ? 0 : k.length - dot - 1;
  eq('trailing-zero', places === 0 ? `${k}.0` : `${k}0`);
  if (v > 0) eq('leading-plus', `+${k}`);
  if (/^-?0\.\d/.test(k)) eq('leading-zero-dropped', k.replace(/^(-?)0\./, '$1.'));
  const intPart = k.replace(/^-/, '').split('.')[0];
  if (intPart.length >= 4) eq('thousands-separator', `${v < 0 ? '-' : ''}${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${dot < 0 ? '' : k.slice(dot)}`);
  if (places >= 1 && places <= 4) {
    const den = 10 ** places; const num = Math.round(v * den); const g = gcd(num, den);
    if (den / g !== 1) eq('exact-fraction', `${num / g}/${den / g}`);
  }
  if (v < 0) eq('unicode-minus', k.replace('-', '−'));
  eq('surrounding-spaces', ` ${k} `);
  if (stemWantsPercent(r.problemText)) eq('percent-sign', `${k}%`);
  const unit = stemUnit(r.problemText);
  if (unit) eq('unit-appended', unit === '°' ? `${k}°` : `${k} ${unit}`);
  if (/\$/.test(r.problemText) && /\b(?:cost|price|dollars?|profit|revenue|pay|paid|charge|fee|balance|worth|value)\b/i.test(r.problemText)) eq('dollar-prefix', v < 0 ? `-$${k.slice(1)}` : `$${k}`);
  const [e1, e2, e3] = sciForms(k);
  if (e1) { eq('scientific-e', e1); eq('scientific-x10^', e2); eq('scientific-*10^', e3); }
  const p = stemPlaces(r.problemText);
  if (p !== null && p < places) eq('rounded-to-stem-places', roundHalfAway(v, p).toFixed(p));
  // a reader's quoted phrase counts as a numeric form only when it holds a digit
  for (const alt of readerAlternatives(r.answer, grades)) if (/\d/.test(alt)) eq('reader-named', alt);
  const unitStep = 10 ** -places;
  wr('last-place+1', (v + unitStep).toFixed(places));
  wr('last-place-1', (v - unitStep).toFixed(places));
  if (v !== 0) wr('wrong-sign', (-v).toFixed(places));
  const near = Math.round(v / 10) * 10;
  wr('neighbouring-round-number', String(near === v ? v + 10 : near === 0 && Math.abs(v) < 5 ? (Math.round(v) === v ? v + 1 : Math.round(v)) : near));
  return subs.filter((s) => s.cls !== 'wrong' || s.text !== k);
}

function mcqSubs(r: Row): Sub[] {
  const key = r.answer.trim();
  const idx = LETTERS.indexOf(key.toUpperCase());
  const subs: Sub[] = [
    { cls: 'key', kind: 'stored-key', text: key },
    { cls: 'equiv', kind: 'lower-case-letter', text: key.toLowerCase() },
    { cls: 'info', kind: 'option-text', text: r.choices[idx] ?? '' },
  ];
  r.choices.forEach((_c, i) => { if (i !== idx) subs.push({ cls: 'wrong', kind: 'other-letter', text: LETTERS[i] }); });
  return subs;
}

const STOP = new Set(['which', 'what', 'where', 'there', 'their', 'these', 'those', 'write', 'state', 'name', 'give', 'answer', 'with', 'from', 'that', 'this', 'into', 'have', 'your', 'when', 'then', 'than', 'each', 'will', 'does', 'most', 'likely', 'would', 'should', 'about', 'after', 'before', 'between', 'single', 'word', 'term', 'only', 'form', 'simplest', 'exact']);
function freeSubs(r: Row, grades: Grade[]): Sub[] {
  const key = r.answer;
  const subs: Sub[] = [{ cls: 'key', kind: 'stored-key', text: key }];
  const eq = (kind: string, text: string) => { if (text !== key && !subs.some((s) => s.text === text)) subs.push({ cls: 'equiv', kind, text }); };
  const wr = (kind: string, text: string) => { if (text !== key && !subs.some((s) => s.text === text)) subs.push({ cls: 'wrong', kind, text }); };
  eq('upper-case', key.toUpperCase());
  eq('lower-case', key.toLowerCase());
  eq('surrounding-spaces', `  ${key} `);
  eq('no-internal-spaces', key.replace(/\s+/g, ''));
  eq('spaced-operators', key.replace(/\s*([+\-−=<>])\s*/g, ' $1 ').replace(/^ (-|−) /, '$1').replace(/\( (-|−) /g, '($1').trim());
  eq('ascii-minus', key.replace(/−/g, '-'));
  eq('unicode-minus', key.replace(/-/g, '−'));
  eq('caret-to-superscript', key.replace(/\^2/g, '²').replace(/\^3/g, '³'));
  eq('superscript-to-caret', key.replace(/²/g, '^2').replace(/³/g, '^3'));
  eq('star-to-dot', key.replace(/\*/g, '·'));
  eq('dot-to-star', key.replace(/·/g, '*'));
  eq('juxtaposition-to-star', key.replace(/(\d)([a-zA-Zπ(])/g, '$1*$2'));
  eq('star-to-juxtaposition', key.replace(/(\d)\s*[*·]\s*([a-zA-Zπ(])/g, '$1$2'));
  eq('pi-symbol-to-word', key.replace(/π/g, 'pi'));
  eq('pi-word-to-symbol', key.replace(/\bpi\b/g, 'π'));
  eq('radical-to-sqrt', key.replace(/√\(([^)]+)\)/g, 'sqrt($1)').replace(/√(\w+)/g, 'sqrt($1)'));
  eq('sqrt-to-radical', key.replace(/sqrt\(([^)]+)\)/g, '√$1'));
  const lead = key.match(/^([a-zA-Z])\s*=\s*(.+)$/);
  if (lead) eq('leading-variable-removed', lead[2]);
  else if (/^[-−]?\d/.test(key) && !/[a-zA-Z]/.test(key)) eq('leading-x-equals', `x = ${key}`);
  else if (/x/.test(key) && !/y/.test(key) && /[+\-−^/(]|\dx/.test(key)) eq('leading-y-equals', `y = ${key}`);
  const two = key.match(/^([^+\-−()]+?)\s*([+\-−])\s*([^+\-−()]+)$/);
  if (two && two[1].trim()) {
    const [, a, op, b] = two;
    eq('reordered-terms', op === '+' ? `${b.trim()} + ${a.trim()}` : `-${b.trim()} + ${a.trim()}`);
  }
  eq('trailing-period', `${key}.`);
  const num = parseNumericKey(key);
  if (num && num.form === 'fraction') {
    eq('fraction-as-2dp', roundHalfAway(num.value, 2).toFixed(2));
    eq('fraction-unreduced', key.replace(/^(-?)(\d+)\/(\d+)$/, (_m, s, n, d) => `${s}${2 * Number(n)}/${2 * Number(d)}`));
  }
  const unit = stemUnit(r.problemText);
  if (num && unit) eq('unit-appended', `${key} ${unit}`);
  // "F(x) =" is a quoted prefix, not an answer
  for (const alt of readerAlternatives(key, grades)) if (!/=\s*$/.test(alt)) eq('reader-named', alt);
  wr('empty', '');
  if (num) {
    wr('value+1', num.form === 'fraction' ? key.replace(/^(-?\d+)/, (n) => String(Number(n) + 1)) : String(num.value + 1));
    if (num.value !== 0) wr('wrong-sign', key.startsWith('-') ? key.slice(1) : `-${key}`);
  } else {
    const label = key.match(/^(.*\b)?([A-Z])$/);
    const sibling = label ? [...new Set(r.problemText.match(/\b[A-Z]\b/g) ?? [])].find((l) => l !== label[2] && l !== 'A' && l !== 'I') : undefined;
    if (label && sibling) wr('sibling-label', `${label[1] ?? ''}${sibling}`);
    const pool = `${r.problemText} ${r.hints.join(' ')}`.match(/[A-Za-z][A-Za-z-]{4,}/g) ?? [];
    const other = pool.find((w) => !STOP.has(w.toLowerCase()) && !key.toLowerCase().includes(w.toLowerCase()) && /^[a-z]/.test(w));
    if (other) wr('other-term-from-stem', other);
    if (/[+\-−]/.test(key.slice(1))) wr('operator-flipped', key.replace(/(?<=.)[+]/, '§').replace(/(?<=.)[-−]/, '+').replace('§', '-'));
  }
  return subs;
}

// ── (e) stem form vs key form ───────────────────────────────────────────────
function formContradictions(r: Row): Array<{ kind: string; detail: string; harmful: boolean }> {
  const out: Array<{ kind: string; detail: string; harmful: boolean }> = [];
  const k = asciiMinus(r.answer.trim());
  const isFraction = /^-?\d+\/\d+$/.test(k);
  const dot = k.indexOf('.');
  const places = isFraction || dot < 0 ? 0 : k.length - dot - 1;
  const s = r.problemText;
  if (/\bas an? (?:\w+ )?fraction\b|fraction in (?:lowest|simplest) terms|exact fraction/i.test(s) && !isFraction && places > 0) out.push({ kind: 'stem-asks-fraction-key-is-decimal', detail: `key ${k}`, harmful: false });
  if (/\bas a decimal\b/i.test(s) && isFraction) out.push({ kind: 'stem-asks-decimal-key-is-fraction', detail: `key ${k}`, harmful: false });
  const p = stemPlaces(s);
  if (p !== null && !isFraction && p !== places) out.push({ kind: places > p ? 'key-has-more-places-than-stem-asks' : 'key-has-fewer-places-than-stem-asks', detail: `stem asks ${p} place(s), key ${k} has ${places}`, harmful: places > p });
  const sf = stemSigFigs(s);
  if (sf !== null && !isFraction) {
    const [lo, hi] = sigFigRange(k);
    if (sf < lo || sf > hi) out.push({ kind: sf < lo ? 'key-has-more-sig-figs-than-stem-asks' : 'key-has-fewer-sig-figs-than-stem-asks', detail: `stem asks ${sf} s.f., key ${k} has ${lo === hi ? lo : `${lo}–${hi}`}`, harmful: sf < lo });
  }
  if (/\bnearest (?:ten|hundred|thousand)\b/i.test(s) && places > 0) out.push({ kind: 'stem-asks-rounded-tens-key-is-decimal', detail: `key ${k}`, harmful: true });
  return out;
}

// ── the test run ────────────────────────────────────────────────────────────
function loadGrades(data: string, ids: Set<string>): Map<string, Grade[]> {
  const dir = path.join(data, 'read');
  const m = new Map<string, Grade[]>();
  for (const f of fs.readdirSync(dir).filter((x) => /-grades\.json$/.test(x)).sort()) {
    for (const g of readJson<Grade[]>(path.join(dir, f))) if (ids.has(g.id)) m.set(g.id, [...(m.get(g.id) ?? []), { ...g, file: f }]);
  }
  return m;
}

const countBy = <T,>(list: T[], key: (x: T) => string): Record<string, number> => {
  const o: Record<string, number> = {};
  for (const x of list) o[key(x)] = (o[key(x)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(o).sort());
};

async function runTest(rowsFile: string, out: string, data: string) {
  const rows = readJson<Row[]>(rowsFile);
  const grades = loadGrades(data, new Set(rows.map((r) => r.id)));
  fs.mkdirSync(out, { recursive: true });
  const results: Array<{ id: string; format: string; key: string; subs: SubResult[] }> = [];
  for (const r of rows) {
    const g = grades.get(r.id) ?? [];
    const subs = r.responseFormat === 'mcq' ? mcqSubs(r) : r.responseFormat === 'numeric' ? numericSubs(r, g) : freeSubs(r, g);
    const done: SubResult[] = [];
    for (const s of subs) done.push({ ...s, ...(await grade(r, s.text)) });
    results.push({ id: r.id, format: r.responseFormat, key: r.answer, subs: done });
  }
  fs.writeFileSync(path.join(out, 'results.jsonl'), results.map((x) => JSON.stringify(x)).join('\n') + '\n');
  const byId = new Map(rows.map((r) => [r.id, r]));
  const flat = results.flatMap((x) => x.subs.map((s) => ({ id: x.id, format: x.format, key: x.key, ...s })));

  const a = flat.filter((s) => s.cls === 'key' && s.outcome === 'rejected');
  const aDeferred = flat.filter((s) => s.cls === 'key' && s.outcome === 'deferred');
  const b = flat.filter((s) => s.cls === 'equiv' && (s.outcome === 'rejected' || s.stored === 'rejected'));
  const equivDeferred = flat.filter((s) => s.cls === 'equiv' && s.outcome === 'deferred');
  const c = flat.filter((s) => s.cls === 'wrong' && (s.outcome === 'accepted' || s.stored === 'accepted'));
  const cardVsStored = flat.filter((s) => s.stored !== undefined && s.stored !== s.outcome);
  const freeRows = results.filter((x) => x.format === 'free');
  const d = freeRows.filter((x) => x.subs.find((s) => s.cls === 'key')!.outcome === 'deferred');
  const freeDeterministic = freeRows.filter((x) => x.subs.find((s) => s.cls === 'key')!.outcome !== 'deferred');
  const e = rows.filter((r) => r.responseFormat === 'numeric').flatMap((r) => formContradictions(r).map((x) => ({ id: r.id, key: r.answer, ...x, stem: r.problemText.slice(-200) })));
  const info = flat.filter((s) => s.cls === 'info');

  const idsOf = (l: Array<{ id: string }>) => [...new Set(l.map((x) => x.id))];
  const write = (name: string, v: unknown) => fs.writeFileSync(path.join(out, name), JSON.stringify(v, null, 2));
  write('a-keys-not-accepted.json', { rejected: a, note: 'free keys that are not plain numbers are never decided deterministically — they are in d-free-judge-only.json, not here' });
  write('b-equivalent-rejected.json', { rows: idsOf(b).length, byFormat: countBy(idsOf(b).map((id) => ({ id })), (x) => byId.get(x.id)!.responseFormat), submissionsByCause: countBy(b, (s) => `${s.format}:${s.kind}`), rowsByCause: Object.fromEntries(Object.entries(countBy(b, (s) => `${s.format}:${s.kind}`)).map(([k]) => [k, idsOf(b.filter((s) => `${s.format}:${s.kind}` === k))])), items: b });
  write('c-wrong-accepted.json', { rows: idsOf(c).length, byCause: countBy(c, (s) => `${s.format}:${s.kind}`), items: c });
  write('d-free-judge-only.json', {
    rows: d.length,
    note: 'engine gradeFreeResponse has no text normalisation: a key that is not a plain number is sent to the model judge for EVERY answer, the stored key included',
    items: d.map((x) => ({ id: x.id, key: x.key, multiForm: /[+\-−*/^()=<>√π²³]|\d[a-zA-Z]/.test(x.key), stem: byId.get(x.id)!.problemText.slice(0, 160) })),
    freeRowsWithANumericKey: freeDeterministic.map((x) => ({ id: x.id, key: x.key, deferredSubmissions: x.subs.filter((s) => s.outcome === 'deferred').map((s) => `${s.kind}: ${s.text}`) })),
  });
  write('e-stem-form-vs-key.json', { rows: idsOf(e).length, byKind: countBy(e, (x) => x.kind), harmfulRows: idsOf(e.filter((x) => x.harmful)).length, items: e });
  write('mcq-option-text.json', { note: 'the card renders radio buttons that submit the option id; typed option text cannot be submitted. Shown for completeness: what the comparison returns if the text were submitted.', outcomes: countBy(info, (s) => s.outcome) });
  write('card-vs-stored-disagreements.json', cardVsStored);
  const summary = {
    rowsFile, at: new Date().toISOString(), rows: rows.length, byFormat: countBy(rows, (r) => r.responseFormat),
    submissions: flat.length, submissionsByClassAndOutcome: countBy(flat, (s) => `${s.format}:${s.cls}:${s.outcome}`),
    a_keysRejected: a.length, a_ids: idsOf(a),
    freeKeysDeferredToJudge: aDeferred.length,
    b_rowsWithAnEquivalentRejected: idsOf(b).length, b_byFormat: countBy(idsOf(b).map((id) => ({ id })), (x) => byId.get(x.id)!.responseFormat), b_rowsByCause: Object.fromEntries(Object.entries(countBy(b, (s) => `${s.format}:${s.kind}`)).map(([k]) => [k, idsOf(b.filter((s) => `${s.format}:${s.kind}` === k)).length])),
    c_rowsWithAWrongAccepted: idsOf(c).length, c_byCause: countBy(c, (s) => `${s.format}:${s.kind}`),
    d_freeRowsJudgeOnly: d.length, freeRowsWithANumericKey: freeDeterministic.length, freeEquivalentsDeferred: equivDeferred.length,
    e_rows: idsOf(e).length, e_byKind: countBy(e, (x) => x.kind), e_harmfulRows: idsOf(e.filter((x) => x.harmful)).length,
    cardVsStoredDisagreements: cardVsStored.length,
    unitDetectedRows: rows.filter((r) => r.responseFormat === 'numeric' && stemUnit(r.problemText)).length,
    guard,
  };
  write('summary.json', summary);
  console.log(JSON.stringify(summary, null, 1));
  return { rows, results, grades, b, c, a };
}

// ── fixes → v2 ──────────────────────────────────────────────────────────────
const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
/** Sort key for a pure position label, or null when the option is not one. */
function ordinalKey(c: string): { word: string; n: number } | null {
  let m = c.match(/^([A-Za-z]+) (\d+)$/);
  if (m) return { word: m[1], n: Number(m[2]) };
  m = c.match(/^([A-Za-z]+) (I|II|III|IV|V|VI)$/);
  if (m) return { word: m[1], n: ROMAN[m[2]] };
  m = c.match(/^([A-Za-z]+) ([A-Z])$/);
  if (m) return { word: m[1], n: m[2].charCodeAt(0) };
  m = c.match(/^Row (\d+), column (\d+)$/);
  if (m) return { word: 'Row,column', n: Number(m[1]) * 100 + Number(m[2]) };
  return null;
}

/** Rows whose reader said key and solution disagree on rounding: the value a
 *  student reaches by following the SOLUTION'S OWN rounded intermediate. */
const ROUNDING_CASES: Array<{ suffix: string; derivation: string; values: () => string[] }> = [
  { suffix: '.lo-3.1jnkac', derivation: 'solution: 3.75 − 0.03 (log term rounded to 2 places)', values: () => [(3.75 - 0.03).toFixed(2)] },
  { suffix: '.lo-3.vxywre', derivation: 'solution rounds [H+] to 2.2e-5; −log10(2.2e-5) to 2 places', values: () => [roundHalfAway(-Math.log10(2.2e-5), 2).toFixed(2)] },
  { suffix: '.lo-4.yeyky1', derivation: 'solution rounds [OH−] to 1.8e-5; pOH = −log10(1.8e-5) to 2 places; pH = 14.00 − pOH', values: () => [(14 - roundHalfAway(-Math.log10(1.8e-5), 2)).toFixed(2)] },
  { suffix: '.lo-4.1ut4bnt', derivation: 'solution quotes T ≈ 8.55e4 s; 8.55e4/3600 h to 1 place', values: () => [roundHalfAway(8.55e4 / 3600, 1).toFixed(1)] },
];

async function runFix(data: string) {
  const fin = path.join(data, 'final');
  const out = path.join(fin, 'grader-test');
  fs.mkdirSync(out, { recursive: true });
  const v1File = path.join(fin, 'problem-bank-rows.json');
  const before = await runTest(v1File, path.join(out, 'v1'), data);
  const rows = before.rows.map((r) => JSON.parse(JSON.stringify(r)) as Row);
  const fixes: Array<Record<string, unknown>> = [];
  const dropped = new Map<string, Record<string, unknown>>();
  const stemOf = (r: Row) => r.problemText.slice(0, 200);

  // 1. free → numeric (the key is a bare number; the stem states the form; no unit is involved)
  for (const r of rows) {
    if (r.responseFormat !== 'free') continue;
    const num = parseNumericKey(r.answer);
    if (!num) continue;
    const s = r.problemText;
    const exact = num.form !== 'decimal';
    const formStated = num.form === 'fraction' ? /fraction/i.test(s) : num.form === 'integer' ? /\b(?:number|how many|integer|whole number)\b/i.test(s) : stemPlaces(s) === num.places;
    const unitNeeded = stemUnit(s) !== null;
    if (!formStated || (!exact && stemPlaces(s) === null)) { fixes.push({ id: r.id, kind: 'free-to-numeric-SKIPPED', reason: 'the stem does not state the form / rounding', key: r.answer }); continue; }
    const beforeV = { responseFormat: r.responseFormat, answer: r.answer };
    r.responseFormat = 'numeric';
    r.answer = num.text;
    r.choices = [];
    fixes.push({ id: r.id, kind: 'free-to-numeric', before: beforeV, after: { responseFormat: 'numeric', answer: r.answer }, keyForm: num.form, stemUnit: unitNeeded ? stemUnit(s) : null, stem: stemOf(r) });
  }

  // 2. free rows where the deterministic layer REJECTS a plausible equivalent form and that stayed free
  for (const x of before.results) {
    const r = rows.find((y) => y.id === x.id)!;
    if (r.responseFormat !== 'free') continue;
    const rej = x.subs.filter((s) => s.cls === 'equiv' && s.outcome === 'rejected');
    const keyRej = x.subs.filter((s) => s.cls === 'key' && s.outcome !== 'accepted' && s.outcome !== 'deferred');
    if (rej.length + keyRej.length > 0) dropped.set(r.id, { id: r.id, format: 'free', key: r.answer, reason: 'the deterministic layer rejects equivalent written forms and the row cannot be made numeric', rejectedForms: rej.map((s) => `${s.kind}: ${s.text}`), stem: stemOf(r) });
  }

  // 3. ordinal option labels → natural order
  for (const r of rows) {
    if (r.responseFormat !== 'mcq') continue;
    const keys = r.choices.map(ordinalKey);
    if (!keys.every(Boolean) || new Set(keys.map((k) => k!.word)).size !== 1) continue;
    const correctText = r.choices[LETTERS.indexOf(r.answer)];
    const sorted = [...r.choices].sort((p, q) => ordinalKey(p)!.n - ordinalKey(q)!.n);
    if (sorted.join('|') === r.choices.join('|')) continue;
    if (referencesOptionByLetter(`${r.problemText} ${r.solutionText} ${r.hints.join(' ')}`)) throw new Error(`${r.id}: text refers to an option by letter — cannot reorder`);
    const letter = LETTERS[sorted.indexOf(correctText)];
    if (sorted[LETTERS.indexOf(letter)] !== correctText || sorted.filter((c) => c === correctText).length !== 1) throw new Error(`${r.id}: letter no longer points at the same option`);
    fixes.push({ id: r.id, kind: 'mcq-ordinal-order', before: { choices: r.choices, answer: r.answer }, after: { choices: sorted, answer: letter }, correctText });
    r.choices = sorted;
    r.answer = letter;
  }

  // 4. the ambiguous-radical item
  for (const r of rows) {
    if (/\.lo-3\.1733y0l$/.test(r.id)) dropped.set(r.id, { id: r.id, format: r.responseFormat, key: r.answer, reason: 'the stem writes f(x) = √(x + 3)/(x − 2), which also reads as a root over the whole quotient; option B "(−∞, −3] ∪ (2, ∞)" is the domain under that reading', stem: stemOf(r), choices: r.choices });
  }

  // 5. key vs the solution's own rounding
  const roundingChecks: Array<Record<string, unknown>> = [];
  for (const c of ROUNDING_CASES) {
    const r = rows.find((x) => x.id.endsWith(c.suffix));
    if (!r) throw new Error(`rounding case ${c.suffix} not found`);
    const values = c.values();
    const verdicts = values.map((v) => ({ value: v, card: webLib.numericMatch(r.answer, v), stored: apiArtifact.gradeItem(cardItem(r), v).correct === true }));
    const reject = verdicts.some((v) => !v.card || !v.stored);
    roundingChecks.push({ id: r.id, key: r.answer, derivation: c.derivation, verdicts, action: reject ? 'dropped' : 'kept', readerNote: (before.grades.get(r.id) ?? []).map((g) => g.reason).join(' ## ') });
    if (reject) dropped.set(r.id, { id: r.id, format: r.responseFormat, key: r.answer, reason: `following the solution's own rounding gives ${values.join(', ')}, which the numeric rule rejects for key ${r.answer} (${c.derivation})`, stem: stemOf(r) });
  }

  const v2 = rows.filter((r) => !dropped.has(r.id));
  for (const d of dropped.values()) fixes.push({ id: d.id, kind: 'dropped', before: { present: true }, after: { present: false }, reason: d.reason });
  const v2File = path.join(fin, 'problem-bank-rows.v2.json');
  fs.writeFileSync(v2File, JSON.stringify(v2, null, 2));
  const write = (name: string, v: unknown) => fs.writeFileSync(path.join(out, name), JSON.stringify(v, null, 2));
  write('fixes.json', { total: fixes.length, byKind: countBy(fixes, (f) => String(f.kind)), fixes });
  write('dropped-free.json', [...dropped.values()].filter((d) => d.format === 'free'));
  write('dropped.json', [...dropped.values()]);
  write('rounding-checks.json', roundingChecks);

  const after = await runTest(v2File, path.join(out, 'v2'), data);

  // ── invariants on v2 ──────────────────────────────────────────────────────
  const problems: string[] = [];
  const seen = new Set<string>();
  const stored = new Map<string, { correctText: string; subject: string; responseFormat: string }>();
  for (const line of fs.readFileSync(path.join(data, 'checked', 'items.jsonl'), 'utf8').split('\n')) if (line.trim()) { const o = JSON.parse(line); stored.set(o.id, o); }
  const tutor = path.resolve(__dirname, '..', '..');
  const withdrawn = new Set(Object.keys(readJson<{ items: Record<string, string> }>(path.join(tutor, 'src/data/withdrawn-practice-items.json')).items));
  const audited = new Set(Object.keys(readJson<{ items: Record<string, string> }>(path.join(tutor, 'src/data/audited-generated-items.json')).items));
  const v1ById = new Map(before.rows.map((r) => [r.id, r]));
  let readerConfirmed = 0;
  for (const r of v2) {
    if (seen.has(r.id)) problems.push(`${r.id}: duplicate id`);
    seen.add(r.id);
    const m = r.id.match(/^practice-gen\.(.+)\.([a-z0-9]+)$/);
    if (!m || m[1] !== r.loId) problems.push(`${r.id}: id does not match practice-gen.<loId>.<hash> (loId ${r.loId})`);
    if ('figure' in r) problems.push(`${r.id}: has a figure`);
    if (withdrawn.has(r.id)) problems.push(`${r.id}: on the withdrawn list`);
    if (audited.has(r.id)) problems.push(`${r.id}: already on the audited list`);
    const rec = stored.get(r.id);
    if (!rec) { problems.push(`${r.id}: not in checked/items.jsonl`); continue; }
    if (r.responseFormat === 'mcq') {
      const norm = r.choices.map((c) => c.trim().toLowerCase().replace(/\s+/g, ' '));
      if (r.choices.length !== 4 || new Set(norm).size !== 4) problems.push(`${r.id}: not exactly 4 distinct options`);
      if (!/^[A-D]$/.test(r.answer) || r.choices[LETTERS.indexOf(r.answer)] !== rec.correctText) problems.push(`${r.id}: letter ${r.answer} does not point at the stored correct text`);
      // reader-confirmed: a reader's blind answer (given against the v1 display order) names the same option text
      const v1 = v1ById.get(r.id)!;
      const gs = (after.grades.get(r.id) ?? []).filter((g) => g.agreesWithKey === true);
      const ok = gs.some((g) => {
        const bl = (g.blindAnswer ?? '').trim();
        const text = /^[A-Da-d]$/.test(bl) ? v1.choices[LETTERS.indexOf(bl.toUpperCase())] : bl;
        return text === r.choices[LETTERS.indexOf(r.answer)];
      });
      if (ok) readerConfirmed += 1; else problems.push(`${r.id}: no reader blind answer names the keyed option text`);
    } else if (r.choices.length !== 0) problems.push(`${r.id}: non-mcq row carries choices`);
    if (r.responseFormat === 'numeric' && !parseNumericKey(r.answer)) problems.push(`${r.id}: numeric key is not a bare number`);
  }
  fs.writeFileSync(path.join(fin, 'audited-item-ids.v2.json'), JSON.stringify(v2.map((r) => r.id), null, 2));

  const exportedByObjective = new Map<string, number>();
  for (const r of v2) exportedByObjective.set(r.loId, (exportedByObjective.get(r.loId) ?? 0) + 1);
  const packs = fs.readdirSync(path.join(data, 'packs')).filter((f) => /^\d{3}\.json$/.test(f)).sort().map((f) => ({ pack: f.slice(0, 3), ...readJson<Pack>(path.join(data, 'packs', f)) }));
  const coverage = coverageAfter(packs, exportedByObjective);
  const packLo = new Set(packs.flatMap((p) => p.objectives.map((o) => o.objectiveLoId)));
  for (const r of v2) if (!packLo.has(r.loId)) problems.push(`${r.id}: loId is in no pack`);
  fs.writeFileSync(path.join(fin, 'coverage-after.v2.json'), JSON.stringify(coverage, null, 2));
  const v1Cov = readJson<{ objectives: Array<{ objectiveLoId: string; meetsTarget: boolean }> }>(path.join(fin, 'coverage-after.json'));
  const v1Met = new Set(v1Cov.objectives.filter((o) => o.meetsTarget).map((o) => o.objectiveLoId));
  const lost = coverage.objectives.filter((o) => v1Met.has(o.objectiveLoId) && !o.meetsTarget).map((o) => ({ objectiveLoId: o.objectiveLoId, subject: o.subject, skill: o.skill, have: o.have, exported: o.exported }));
  const subjectOf = (r: Row) => stored.get(r.id)?.subject ?? '?';
  const inv = {
    rows: v2.length, byFormat: countBy(v2, (r) => r.responseFormat), bySubject: countBy(v2, subjectOf), bySubjectAndFormat: countBy(v2, (r) => `${subjectOf(r)}:${r.responseFormat}`),
    mcqRows: v2.filter((r) => r.responseFormat === 'mcq').length, mcqReaderConfirmed: readerConfirmed,
    problems,
    coverage: { target: coverage.target, all: coverage.all, textOnly: coverage.textOnly, figureDependent: coverage.figureDependent, bySubject: coverage.bySubject },
    objectivesThatFellBelowTargetBecauseOfV2Drops: lost,
    guard,
  };
  write('v2-invariants-and-coverage.json', inv);
  console.log('── v2 invariants ──');
  console.log(JSON.stringify({ ...inv, objectivesThatFellBelowTargetBecauseOfV2Drops: lost.length }, null, 1));
  console.log('fixes by kind', countBy(fixes, (f) => String(f.kind)));
  const freeInB = after.b.filter((s) => s.format === 'free').length;
  console.log(`v2 re-run: (a) ${after.a.length}  (c) ${after.c.length}  free submissions in (b) ${freeInB}`);
  if (after.a.length || after.c.length || freeInB || problems.length) process.exitCode = 1;
}

// ── cli ─────────────────────────────────────────────────────────────────────
async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const arg = (n: string) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : undefined; };
  const data = arg('data');
  if (!data) throw new Error('--data <practice-depth folder> is required');
  if (cmd === 'test') await runTest(arg('rows') ?? path.join(data, 'final', 'problem-bank-rows.json'), arg('out') ?? path.join(data, 'final', 'grader-test', 'adhoc'), data);
  else if (cmd === 'fix') await runFix(data);
  else throw new Error('usage: grader-test.ts test|fix --data <dir> [--rows <file>] [--out <dir>]');
  console.log('network guard:', JSON.stringify(guard));
}
main().then(() => process.exit(process.exitCode ?? 0), (e) => { console.error(e); process.exit(1); });
