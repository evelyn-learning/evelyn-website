/**
 * Keyed verdict (GAC per-problem homework, 2026-10-20): a homework-problem
 * session whose answer key was verified ahead of time checks the student's
 * message against that key HERE, deterministically, with no model call.
 *
 * Total and conservative: a value is taken only when the student offers it as
 * a final value — after `=`, `≈`, "is", "equals", "got", a part label
 * (`a) 8`, `(b) 24`, `part b: 25`); a bare number (the whole message) only
 * confirms (below). The LAST such value of an equation chain is the one
 * offered (`x = 60/3 = 20` offers 20).
 * Fractions, exact forms (`3π`, `2√3`), words and text parts are `undecided`
 * (the caller then asks the model check) — except that two shapes CONFIRM
 * (never mark wrong): the student's text exactly the key's final after
 * normalisation (`y = 2x + 3`, `2√3`, `x = 2 or x = -3`, a text part), and a
 * simple fraction / mixed number within 1 % of a number part (`x = 3/4`).
 * A question (`…?`, "is it …") is never judged. A message with no NAMED final
 * value is never `incorrect`: a value is wrong only when it is named AS the
 * final answer — assigned to the key's own variable (`x = 25`, `x is 25`;
 * on a multi-part key, the variable of exactly one part), after a part label,
 * after "the answer is", as "it is …" / "it's …", or followed by "as the
 * answer". A bare number (the whole message one value, `12 cm`) and any other
 * unnamed value CONFIRM when they equal the key but never deny: 2026-10-22
 * (hw-14 p5) the tutor asked for the inner square's diagonal, the student
 * typed `12 cm`, and it was denied against the key's `41.10 cm²` — a bare
 * value answers the tutor's last question, which may be an intermediate one,
 * so it goes to the model check. Intermediate working ("AB is 12", "I got 3
 * so far", "step 1: … = 60") is `undecided`. A runtime note (a message that
 * starts with `[`, e.g. a correction note quoting the intended answer) is
 * never judged; one PREPENDED to the student's words is stripped and the rest judged.
 */

import type { AnswerKey, AnswerPart } from '../homework-build/types';
import { numbersAgree } from '../portal/key-compare';
import type { VerdictPrecheckResult } from './verdict-precheck-shared';

export type KeyedVerdict = {
  verdict: 'correct' | 'incorrect' | 'undecided';
  part?: string;
  matched?: string;
  /** A multi-value part (AnswerPart.values): the one named value this verdict is about. */
  value?: string;
};

/** The model check's cap when the keyed verdict is undecided. */
export const KEYED_VERDICT_MODEL_TIMEOUT_MS = 4000;

/** Debug event the browser records for each keyed verdict frame. */
export const KEYED_VERDICT_DEBUG_TYPE = 'homework_keyed_verdict';

/** `explicit`: offered as the final answer (see the header) — only such a value can be judged wrong. */
interface Candidate { value: number; text: string; at: number; explicit: boolean; /** A fraction / mixed number / exact radical: confirms, never marks wrong. */ frac?: boolean; /** The short name in front of the lead ("x = 7" → "x"), when there is one. */ lhs?: string | null }

const NUM_RE = /-?\d+(?:\.\d+)?/g;
/** Words / marks after which a number is an offered value. */
const LEAD_RE = /(?:=|≈|:|\bis|'s|\bare|\bequals?(?:\s+to)?|\bgot|\bget|\bbe|\banswer)\s*$/i;
const UNIT_RE = /^(?:°|º|%|degrees?|deg|cm|mm|km|m|in|inches|ft|feet|yd|mi|miles|units?|sq|kg|g|s|sec|seconds?|min|minutes?|h|hrs?|hours?|mph)(?:\^?[23²³])?(?![A-Za-z])/i;
// 2026-10-22 (hw-15 p6): a number before a function word ("8 sin 60") is working, not an offer.
const OPERATOR_WORD_RE = /^\s+(?:times|plus|minus|over|divided|multiplied|squared|cubed|root|pi|sqrt|π|√|sin|cos|tan|csc|cot|arcsin|arccos|arctan|log|ln)\b/i;   // not sec: "5 sec" is seconds (UNIT_RE)
/** An exact radical: "4 root 3", "4√3", "4 sqrt 3", "4\\sqrt{3}", "√3". Groups: coefficient?, radicand. */
const RADICAL_RE = /(-?\d+(?:\.\d+)?)?\s*(?:√|\\?sqrt|root)\s*(?:of\s+)?[{(]?\s*(\d+(?:\.\d+)?)\s*[)}]?/gi;

function normalize(s: string): string {
  return String(s ?? '')
    .replace(/[−–—]/g, '-')
    .replace(/~=|≃|≅|~/g, '≈')
    .replace(/[’‘]/g, "'");
}

/** The number at `idx` is followed by more expression (an operator, a fraction bar, a variable, π, √). */
function continuesExpression(text: string, end: number): boolean {
  const rest = text.slice(end);
  if (/^\s*[+\-*/^×÷·√(]/.test(rest)) return true;
  if (/^\s*π/.test(rest)) return true;
  if (OPERATOR_WORD_RE.test(rest)) return true;
  if (/^[A-Za-z°º%]/.test(rest)) return !UNIT_RE.test(rest);
  if (/^°|^º/.test(rest)) return false;
  // "20 x 3": a lone x between numbers is multiplication.
  if (/^\s+[xX]\s*\d/.test(rest)) return true;
  return false;
}

/** The short name directly in front of an `=` / `≈` / "is" / "'s" lead, if any. */
function lhsBefore(before: string): string | null {
  // 2026-10-22 (hw-15 p2): an angle name may carry its prefix ("m∠ACB =", "∠ACB =", "angle ACB is").
  const m = /(?:^|[\s,;(])(?:m\s*∠\s*|∠\s*|angle\s+)?([A-Za-z]{1,3}\d?)(?:\s*[=≈]|\s+is|'s)\s*$/i.exec(before);
  return m ? m[1].toLowerCase() : null;
}

/** "the answer is 25", "answer: 25", "final answer = 25". */
const ANSWER_LEAD_RE = /\banswers?\s*(?:is|was|=|:|would be|should be)?\s*$/i;
/** "I got 12 as the answer" / "12 cm as my final answer": after the value (and its unit). */
const ANSWER_TAIL_RE = /^\s*as\s+(?:the|my)\s+(?:final\s+)?answer\b/i;

/** A runtime note, not the student's words: the browser's runtime turns
 *  (a correction note, a board-anchor note, "[start lesson]") start with `[`. */
export function isRuntimeNote(text: unknown): boolean {
  return String(text ?? '').trim().startsWith('[');
}

/** A runtime note PREPENDED to the student's words (`[… note — not from the
 *  student] …\n\n<student text>`) is removed; what is left is the student's
 *  own text. A message that is only a note → ''. Pure. */
export function stripRuntimeNote(text: unknown): string {
  let t = String(text ?? '').trim();
  while (t.startsWith('[')) {
    const para = /\n\s*\n/.exec(t);
    const line = t.indexOf('\n');
    if (para) t = t.slice(para.index + para[0].length).trim();
    else if (line >= 0) t = t.slice(line + 1).trim();
    else return '';
  }
  return t;
}

/** A question ("…?" at the end, or "is it …", "does …", "would …") offers nothing to judge. */
const QUESTION_FORM_RE = /^(?:so\s+|and\s+|um\s+|uh\s+)?(?:is|isn't|does|doesn't|do|did|would|could|can|should|will|was|were|are|am|has|have|shall|might|may)\b/i;
function isQuestionForm(text: string): boolean {
  return /\?\s*$/.test(text) || QUESTION_FORM_RE.test(text);
}

/** Exact-match normalisation (I3): lowercase, no whitespace, trailing period
 *  dropped, the times signs (× · and the asterisk), the division signs (÷ and the slash) and the unicode minus signs unified. */
function normExact(s: string): string {
  return normalize(s)
    .toLowerCase()
    .replace(/[×·*]/g, '*')
    .replace(/[÷/]/g, '/')
    .replace(/\s+/g, '')
    .replace(/[.!]+$/, '');
}

/** The student's text equals the part's final (or text value) exactly, after normalisation. */
function textMatchesPart(part: AnswerPart, studentText: string): boolean {
  const got = normExact(studentText);
  if (!got) return false;
  const wants = [part.final, ...(part.canonical.kind === 'text' ? [part.canonical.value] : [])].map(normExact).filter(Boolean);
  const v = keyVarOf(part);
  // "x = 3/4" offered for a final written "3/4" (or the reverse): the key's own variable only.
  const strip = (x: string) => (v && x.startsWith(`${v}=`) ? x.slice(v.length + 1) : x);
  return wants.some((w) => w === got || (v !== null && strip(w) === strip(got) && strip(got) !== ''));
}

const FRACTION_RE = /(-?)(\d+)(?:\s+(\d+))?\s*\/\s*(\d+)/g;

/** Offered simple fractions / mixed numbers (`3/4`, `x = 1 1/2`). Used to confirm, never to mark wrong. */
function fractionCandidates(text: string, opts: { segmentStartIsLead?: boolean; keyVar?: string | null }): Candidate[] {
  const out: Candidate[] = [];
  const whole = /^\s*-?\d+(?:\s+\d+)?\s*\/\s*\d+\s*[.!]?\s*$/.test(text);
  for (const m of text.matchAll(FRACTION_RE)) {
    const at = m.index ?? 0;
    const prev = text[at - 1] ?? '';
    if (/[\w.]/.test(prev) || /[+\-*/^×÷·√]/.test(prev)) continue;
    const end = at + m[0].length;
    if (/^\s*[.\d]/.test(text.slice(end)) || continuesExpression(text, end)) continue;
    const before = text.slice(0, at);
    const atStart = /^\s*[:=]?\s*$/.test(before);
    if (!(whole || LEAD_RE.test(before) || (opts.segmentStartIsLead && atStart))) continue;
    const lhs = lhsBefore(before);
    if (opts.keyVar && lhs && lhs !== opts.keyVar && lhs !== 'it') continue;
    const [, sign, a, b, c] = m;
    const den = Number(b !== undefined ? c : c);
    if (!den) continue;
    const mag = b !== undefined ? Number(a) + Number(b) / den : Number(a) / den;
    out.push({ value: sign ? -mag : mag, text: m[0].trim(), at, explicit: false, frac: true });
  }
  return out;
}

/** A fraction agrees with a number key within 1 %. */
const fractionAgrees = (got: number, want: number) => (want === 0 ? got === 0 : Math.abs(got - want) <= Math.abs(want) * 0.01);

/** Offered values in `text`. `segmentStartIsLead`: a number right at the start counts (after a part label). */
function candidates(text: string, opts: { segmentStartIsLead?: boolean; keyVar?: string | null }): Candidate[] {
  const out: Candidate[] = [];
  for (const m of text.matchAll(NUM_RE)) {
    const at = m.index ?? 0;
    const prev = text[at - 1] ?? '';
    if (/[\w.]/.test(prev)) continue; // part of a token ("x2", "3.5" mid-number)
    if (/[+\-*/^×÷·√]/.test(prev)) continue;
    const end = at + m[0].length;
    if (continuesExpression(text, end)) continue;
    const before = text.slice(0, at);
    const atStart = /^\s*[:=]?\s*$/.test(before);
    if (!(LEAD_RE.test(before) || (opts.segmentStartIsLead && atStart))) continue;
    const lhs = lhsBefore(before);
    if (opts.keyVar && lhs && lhs !== opts.keyVar && lhs !== 'it') continue; // "AD = 6" is a given, not x
    const unit = UNIT_RE.exec(text.slice(end).replace(/^\s+/, ''));
    // Named as the final answer (the header): a part label, an answer phrase, the key's variable or "it".
    const explicit = (opts.segmentStartIsLead === true && atStart)
      || ANSWER_LEAD_RE.test(before)
      || ANSWER_TAIL_RE.test(text.slice(end).replace(/^\s+/, '').slice(unit ? unit[0].length : 0))
      || (lhs !== null && (lhs === opts.keyVar || lhs === 'it'));
    out.push({ value: Number(m[0]), text: (m[0] + (unit ? ` ${unit[0]}` : '')).trim(), at, explicit, lhs });
  }
  // 2026-10-22 (hw-15 p6): an exact radical offered after a lead ("h = 4 root 3",
  // "= 4√3") is a value too — its coefficient was skipped above as the start of
  // an expression. Like a fraction it confirms and never denies (`frac`).
  for (const m of text.matchAll(RADICAL_RE)) {
    const at = m.index ?? 0;
    const prev = text[at - 1] ?? '';
    if (/[\w.]/.test(prev) || /[+\-*/^×÷·√]/.test(prev)) continue;
    const end = at + m[0].length;
    if (continuesExpression(text, end)) continue;
    const before = text.slice(0, at);
    const atStart = /^\s*[:=]?\s*$/.test(before);
    if (!(LEAD_RE.test(before) || (opts.segmentStartIsLead && atStart))) continue;
    const lhs = lhsBefore(before);
    if (opts.keyVar && lhs && lhs !== opts.keyVar && lhs !== 'it') continue;
    const value = radicalValue(m);
    if (value === null) continue;
    out.push({ value, text: m[0].trim(), at, explicit: false, frac: true, lhs });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** The numeric value of a RADICAL_RE match: coefficient × √radicand. */
function radicalValue(m: RegExpMatchArray): number | null {
  const coef = m[1] !== undefined ? Number(m[1]) : 1;
  const rad = Number(m[2]);
  if (!Number.isFinite(coef) || !Number.isFinite(rad) || rad < 0) return null;
  return coef * Math.sqrt(rad);
}

/** The whole message is one number (optionally with units / a trailing mark).
 *  Unnamed (2026-10-22, hw-14 p5): it confirms, never denies (the header). */
function bareNumber(text: string): Candidate | null {
  // A message that is one exact radical ("4 root 3") offers that value (hw-15 p6).
  const r = new RegExp(`^\\s*${RADICAL_RE.source}\\s*[.!]?\\s*$`, 'i').exec(text);
  if (r) { const value = radicalValue(r); return value === null ? null : { value, text: r[0].trim(), at: 0, explicit: false, frac: true }; }
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*([A-Za-z°º%²³^23]*)\s*[.!]?\s*$/.exec(text);
  if (!m) return null;
  if (m[2] && !UNIT_RE.test(m[2])) return null;
  return { value: Number(m[1]), text: (m[1] + (m[2] ? ` ${m[2]}` : '')).trim(), at: 0, explicit: false };
}

const normLabel = (s: string) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Where each part label is named in the message: [label, index of the label's end]. */
function labelMarks(text: string, key: AnswerKey): Array<{ label: string; at: number; end: number }> {
  const labels = [...new Set(key.parts.map((p) => normLabel(p.label)).filter(Boolean))];
  const marks: Array<{ label: string; at: number; end: number }> = [];
  for (const label of labels) {
    const L = escapeRe(label);
    const res = [
      new RegExp(`\\bpart\\s*\\(?${L}\\)?\\s*[:=)\\-]?`, 'gi'),
      new RegExp(`\\(${L}\\)\\s*[:=]?`, 'gi'),
      new RegExp(`(?:^|(?<=[\\s,;]))${L}\\)\\s*[:=]?`, 'gi'),
      new RegExp(`(?:^|(?<=[\\s,;]))${L}\\s*:`, 'gi'),
      ...(key.parts.length > 1 && /^[a-z]$/.test(label) ? [new RegExp(`(?:^|(?<=[\\s,;]))${L}\\s*=`, 'gi')] : []),
    ];
    for (const re of res) {
      for (const m of text.matchAll(re)) {
        const at = m.index ?? 0;
        if (marks.some((k) => at < k.end && at + m[0].length > k.at)) continue;
        marks.push({ label, at, end: at + m[0].length });
      }
    }
  }
  return marks.sort((a, b) => a.at - b.at);
}

function keyVarOf(part: AnswerPart): string | null {
  const m = /^\s*([A-Za-z]{1,3}\d?)\s*[=≈]/.exec(part.final);
  return m ? m[1].toLowerCase() : null;
}

/** Judge the offered values for one part: the last offered value decides. */
function judgePart(part: AnswerPart, cands: Candidate[], studentText?: string): KeyedVerdict {
  const v = judgeValues(part, cands);
  // I3: undecided, but the student's text is exactly the key's final (any part kind) → correct.
  if (v.verdict === 'undecided' && studentText !== undefined && textMatchesPart(part, studentText)) {
    return { verdict: 'correct', part: normLabel(part.label), matched: studentText.trim().replace(/[.!]+$/, '') };
  }
  return v;
}

function judgeValues(part: AnswerPart, cands: Candidate[]): KeyedVerdict {
  const label = normLabel(part.label);
  if (part.canonical.kind !== 'number' || cands.length === 0) return { verdict: 'undecided', ...(label ? { part: label } : {}) };
  const want = part.canonical.value;
  const agrees = (c: Candidate) => (c.frac ? fractionAgrees(c.value, want) : numbersAgree(c.value, want));
  const last = cands[cands.length - 1];
  if (agrees(last)) return { verdict: 'correct', part: label, matched: last.text };
  // A fraction that does not match is never judged wrong.
  if (last.frac) return { verdict: 'undecided', part: label };
  // An earlier value matches and a later one does not: ambiguous.
  if (cands.some(agrees)) return { verdict: 'undecided', part: label };
  // Wrong only when offered as the final answer; working is for the model check.
  const offered = [...cands].reverse().find((c) => c.explicit && !c.frac);
  if (!offered) return { verdict: 'undecided', part: label };
  return { verdict: 'incorrect', part: label, matched: offered.text };
}

const normValueName = (s: string) => String(s ?? '').toLowerCase().replace(/\s+/g, '');
/** 2026-10-22 (hw-15 p2): a value named "m∠ACB" in the key is the student's "ACB" / "∠ACB" / "angle ACB". */
const bareValueName = (s: string) => normValueName(s).replace(/^(?:m∠|∠|angle|m(?=∠))/, '');
const sameValueName = (a: string, b: string) => bareValueName(a) === bareValueName(b);

/**
 * 2026-10-21 (hw-11 problem 2): a part with several named values ("x = 7,
 * PA = 17") — one verdict per value the message offers. A candidate with a
 * name ("x = 7", "PA is 20") judges that value; a bare value judges the one
 * value it equals (a value equal to none, with no name, is undecided). The
 * part is confirmed once every value has been confirmed (confirmedKeyParts).
 */
function judgeNamedValues(part: AnswerPart, cands: Candidate[]): KeyedVerdict[] {
  const values = part.values ?? [];
  if (!values.length) return [];
  const label = normLabel(part.label);
  const byName = new Map<string, KeyedVerdict>();
  for (const c of cands) {
    if (c.frac) continue;
    const named = c.lhs ? values.find((v) => sameValueName(v.name, c.lhs!)) : undefined;
    if (named) {
      byName.set(named.name, numbersAgree(c.value, named.value)
        ? { verdict: 'correct', part: label, value: named.name, matched: c.text }
        : { verdict: 'incorrect', part: label, value: named.name, matched: c.text });
      continue;
    }
    if (c.lhs && c.lhs !== 'it') continue;   // "AD = 6": a given, not one of the values
    const hits = values.filter((v) => numbersAgree(c.value, v.value));
    if (hits.length === 1) byName.set(hits[0].name, { verdict: 'correct', part: label, value: hits[0].name, matched: c.text });
  }
  return [...byName.values()];
}

/** One verdict per part the message offers a value for (or the single part). */
export function keyedVerdicts(studentMessage: string, key: AnswerKey): KeyedVerdict[] {
  // A runtime note in front of the student's words is dropped (R19b); a
  // message that is only a note is never judged.
  const text = normalize(stripRuntimeNote(studentMessage)).trim();
  if (!text || !key?.parts?.length || isRuntimeNote(text)) return [];
  // R19a: a question is judged neither right nor wrong.
  if (isQuestionForm(text)) return [];
  const isQuestion = /\?/.test(text);
  const marks = labelMarks(text, key);
  const byLabel = new Map<string, Candidate[]>();
  const segText = new Map<string, string>();
  const head = marks.length ? text.slice(0, marks[0].at) : text;
  const byAt = (a: Candidate, b: Candidate) => a.at - b.at;
  marks.forEach((mk, i) => {
    const seg = text.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : text.length);
    const list = byLabel.get(mk.label) ?? [];
    list.push(...[...candidates(seg, { segmentStartIsLead: true }), ...fractionCandidates(seg, { segmentStartIsLead: true })].sort(byAt));
    byLabel.set(mk.label, list);
    // The labelled segment's own text, for an exact match (one segment per label only).
    segText.set(mk.label, segText.has(mk.label) ? '' : seg.replace(/[,;]\s*$/, ''));
  });
  const out: KeyedVerdict[] = [];
  if (key.parts.length === 1) {
    const part = key.parts[0];
    const keyVar = part.values?.length ? undefined : keyVarOf(part);   // several names: none is "the" variable
    const cands = [
      ...[...candidates(head, { keyVar }), ...fractionCandidates(head, { keyVar })].sort(byAt),
      ...(byLabel.get(normLabel(part.label)) ?? []),
    ];
    const bare = !marks.length && !cands.length ? bareNumber(text) : null;
    const whole = marks.length ? (segText.get(normLabel(part.label)) || undefined) : text;
    const named = part.values?.length ? judgeNamedValues(part, bare ? [bare] : cands) : [];
    if (named.length) out.push(...named);
    else out.push(judgePart(part, bare ? [bare] : cands, whole));
  } else {
    for (const part of key.parts) {
      const cands = byLabel.get(normLabel(part.label));
      const seg = segText.get(normLabel(part.label)) || undefined;
      const named = part.values?.length && cands?.length ? judgeNamedValues(part, cands) : [];
      if (named.length) out.push(...named);
      else if (cands?.length) out.push(judgePart(part, cands, seg));
      else if (seg !== undefined && textMatchesPart(part, seg)) out.push(judgePart(part, [], seg));
    }
    // An unlabeled value counts only when it matches exactly one numeric part
    // (or, named or unique, one value of a multi-value part).
    if (!marks.length) {
      const cands = candidates(head, {});
      const bare = !cands.length ? bareNumber(text) : null;
      const vals = bare ? [bare] : cands;
      const last = vals[vals.length - 1];
      // Named by exactly one part's variable ("x = 20", part a "x = 27"): that part is judged.
      const varParts = last?.lhs ? key.parts.filter((p) => !p.values?.length && keyVarOf(p) === last.lhs) : [];
      if (varParts.length === 1) {
        const keyVar = keyVarOf(varParts[0]);
        out.push(judgePart(varParts[0], [...candidates(head, { keyVar }), ...fractionCandidates(head, { keyVar })].sort(byAt), text));
      } else if (last) {
        const hits = key.parts.filter((p) => p.canonical.kind === 'number' && numbersAgree(last.value, p.canonical.value));
        const multi = key.parts.filter((p) => p.values?.length);
        const namedHits = multi.flatMap((p) => judgeNamedValues(p, [last]).map((v) => ({ ...v, verdict: v.verdict })));
        if (hits.length === 1 && namedHits.length === 0) out.push({ verdict: 'correct', part: normLabel(hits[0].label), matched: last.text });
        else if (hits.length === 0 && namedHits.length === 1) out.push(namedHits[0]);
      }
    }
  }
  // A question is never marked wrong.
  return out.map((v) => (isQuestion && v.verdict === 'incorrect' ? { verdict: 'undecided', ...(v.part !== undefined ? { part: v.part } : {}) } : v));
}

/**
 * The turn's verdict. Every offered part correct → `correct`; every offered
 * part incorrect → `incorrect`; a mix, nothing offered, or anything undecided
 * → `undecided`. `part` = the part labels judged, comma-joined.
 */
export function keyedVerdict(studentMessage: string, key: AnswerKey): KeyedVerdict {
  const vs = keyedVerdicts(studentMessage, key);
  if (!vs.length || vs.some((v) => v.verdict === 'undecided')) return { verdict: 'undecided' };
  const first = vs[0].verdict;
  if (!vs.every((v) => v.verdict === first)) return { verdict: 'undecided' };
  return {
    verdict: first,
    part: [...new Set(vs.map((v) => v.part ?? ''))].join(','),
    matched: vs.map((v) => v.matched ?? '').filter(Boolean).join('; '),
  };
}

const finalLine = (p: AnswerPart) => `${p.label ? `${p.label}) ` : ''}${p.final}`;

/** The key's finals as one line (the expected answer / the model check's facts). */
export function keyFinalsLine(key: AnswerKey): string {
  return key.parts.map(finalLine).join('; ');
}

/** Facts for the model check when the keyed verdict is undecided. */
export function keyedProblemFacts(key: AnswerKey): string {
  const path = solutionPathLines(key);
  return `The problem's verified final answer: ${keyFinalsLine(key)}` +
    (path.length ? `\nVerified intermediate steps: ${path.join('; ')}` : '');
}

/** The key's verified solution path, one line per step (`relation → value`, or
 *  `relation` alone); [] when the key carries no steps. */
export function solutionPathLines(key: AnswerKey): string[] {
  return (key.steps ?? []).map((s) => (s.value ? `${s.relation} → ${s.value}` : s.relation));
}

/**
 * A decided keyed verdict in the pre-check's own result shape, so the
 * `<answer_check>` block, the reveal guards and the browser frame work as
 * for a model check. Null when undecided.
 */
export function keyedPrecheckResult(v: KeyedVerdict, key: AnswerKey): VerdictPrecheckResult | null {
  if (v.verdict === 'undecided') return null;
  const labels = (v.part ?? '').split(',').filter(Boolean);
  const parts = labels.length ? key.parts.filter((p) => labels.includes(normLabel(p.label))) : key.parts;
  const named = labels.length ? `the final answer of part ${labels.map((l) => `(${l})`).join(' and ')}` : 'the final answer of the problem';
  return {
    answers: 'overall_problem',
    target: named,
    proposed: v.matched ?? '',
    verdict: v.verdict,
    confidence: 'high',
    correctValue: (parts.length ? parts : key.parts).map((p) => p.final).join('; '),
    model: 'keyed',
    ms: 0,
    inputTokens: 0,
    outputTokens: 0,
  };
}

/** Parts confirmed correct by any student message so far, this one included. */
export function confirmedKeyParts(
  history: ReadonlyArray<{ role: 'user' | 'assistant'; content: unknown }>,
  currentMessage: string,
  key: AnswerKey,
): Set<string> {
  const done = new Set<string>();
  const values = new Map<string, Set<string>>();   // part → confirmed value names
  const msgs = [...history.filter((m) => m.role === 'user').map((m) => (typeof m.content === 'string' ? m.content : '')), currentMessage];
  // keyedVerdicts drops a runtime note in front of a student's words (R19b).
  for (const msg of msgs) {
    for (const v of keyedVerdicts(msg, key)) {
      if (v.verdict !== 'correct') continue;
      if (v.value) { const set = values.get(v.part ?? '') ?? new Set<string>(); set.add(v.value); values.set(v.part ?? '', set); }
      else done.add(v.part ?? '');
    }
  }
  // A multi-value part is confirmed once every value has been, across messages.
  for (const p of key.parts) {
    const label = normLabel(p.label);
    if (p.values?.length && !done.has(label) && p.values.every((v) => values.get(label)?.has(v.name))) done.add(label);
  }
  return done;
}

export function allKeyPartsConfirmed(
  history: ReadonlyArray<{ role: 'user' | 'assistant'; content: unknown }>,
  currentMessage: string,
  key: AnswerKey,
): boolean {
  if (!key.parts.length) return false;
  const done = confirmedKeyParts(history, currentMessage, key);
  return key.parts.every((p) => done.has(normLabel(p.label)));
}

/** Debug message for a keyed verdict: `keyed part=<label> verdict=<v>`. */
export function formatKeyedVerdictDebug(part: string, verdict: 'correct' | 'incorrect', value?: string): string {
  return `keyed part=${normLabel(part)} verdict=${verdict}${value ? ` value=${normValueName(value)}` : ''}`;
}

export function parseKeyedVerdictDebug(message: unknown): { part: string; verdict: 'correct' | 'incorrect'; value?: string } | null {
  const m = /^keyed part=([a-z0-9]*) verdict=(correct|incorrect)\b(?: value=(\S+))?/.exec(String(message ?? ''));
  return m ? { part: m[1], verdict: m[2] as 'correct' | 'incorrect', ...(m[3] ? { value: m[3] } : {}) } : null;
}
