/**
 * Keyed verdict (GAC per-problem homework, 2026-10-20): a homework-problem
 * session whose answer key was verified ahead of time checks the student's
 * message against that key HERE, deterministically, with no model call.
 *
 * Total and conservative: a value is taken only when the student offers it as
 * a final value — after `=`, `≈`, "is", "equals", "got", a part label
 * (`a) 8`, `(b) 24`, `part b: 25`), or as the whole message. The LAST such
 * value of an equation chain is the one offered (`x = 60/3 = 20` offers 20).
 * Fractions, exact forms (`3π`, `2√3`), words and text parts are `undecided`
 * (the caller then asks the model check). A message with no explicit final
 * value is never `incorrect`: a value is wrong only when it is offered AS the
 * final answer — assigned to the key's own variable (`x = 25`, `x is 25`),
 * after a part label, after "the answer is", as "it is …", or as the whole
 * message. Intermediate working ("AB is 12", "I got 3 so far", "step 1: …
 * = 60") is `undecided`. A runtime note (a message that starts with `[`,
 * e.g. a correction note quoting the intended answer) is never judged.
 */

import type { AnswerKey, AnswerPart } from '../homework-build/types';
import { numbersAgree } from '../portal/key-compare';
import type { VerdictPrecheckResult } from './verdict-precheck-shared';

export type KeyedVerdict = { verdict: 'correct' | 'incorrect' | 'undecided'; part?: string; matched?: string };

/** The model check's cap when the keyed verdict is undecided. */
export const KEYED_VERDICT_MODEL_TIMEOUT_MS = 4000;

/** Debug event the browser records for each keyed verdict frame. */
export const KEYED_VERDICT_DEBUG_TYPE = 'homework_keyed_verdict';

/** `explicit`: offered as the final answer (see the header) — only such a value can be judged wrong. */
interface Candidate { value: number; text: string; at: number; explicit: boolean }

const NUM_RE = /-?\d+(?:\.\d+)?/g;
/** Words / marks after which a number is an offered value. */
const LEAD_RE = /(?:=|≈|:|\bis|'s|\bare|\bequals?(?:\s+to)?|\bgot|\bget|\bbe|\banswer)\s*$/i;
const UNIT_RE = /^(?:°|º|%|degrees?|deg|cm|mm|km|m|in|inches|ft|feet|yd|mi|miles|units?|sq|kg|g|s|sec|seconds?|min|minutes?|h|hrs?|hours?|mph)(?:\^?[23²³])?(?![A-Za-z])/i;
const OPERATOR_WORD_RE = /^\s+(?:times|plus|minus|over|divided|multiplied|squared|cubed|root|pi|sqrt|π|√)\b/i;

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
  const m = /(?:^|[\s,;(])([A-Za-z]{1,3}\d?)(?:\s*[=≈]|\s+is|'s)\s*$/i.exec(before);
  return m ? m[1].toLowerCase() : null;
}

/** "the answer is 25", "answer: 25", "final answer = 25". */
const ANSWER_LEAD_RE = /\banswers?\s*(?:is|was|=|:|would be|should be)?\s*$/i;

/** A runtime note, not the student's words: the browser's runtime turns
 *  (a correction note, a board-anchor note, "[start lesson]") start with `[`. */
export function isRuntimeNote(text: unknown): boolean {
  return String(text ?? '').trim().startsWith('[');
}

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
    const explicit = (opts.segmentStartIsLead === true && atStart)
      || ANSWER_LEAD_RE.test(before)
      || (lhs !== null && (lhs === opts.keyVar || lhs === 'it'));
    const unit = UNIT_RE.exec(text.slice(end).replace(/^\s+/, ''));
    out.push({ value: Number(m[0]), text: (m[0] + (unit ? ` ${unit[0]}` : '')).trim(), at, explicit });
  }
  return out;
}

/** The whole message is one number (optionally with units / a trailing mark). */
function bareNumber(text: string): Candidate | null {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*([A-Za-z°º%²³^23]*)\s*[.!]?\s*$/.exec(text);
  if (!m) return null;
  if (m[2] && !UNIT_RE.test(m[2])) return null;
  return { value: Number(m[1]), text: (m[1] + (m[2] ? ` ${m[2]}` : '')).trim(), at: 0, explicit: true };
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
function judgePart(part: AnswerPart, cands: Candidate[]): KeyedVerdict {
  const label = normLabel(part.label);
  if (part.canonical.kind !== 'number' || cands.length === 0) return { verdict: 'undecided', ...(label ? { part: label } : {}) };
  const want = part.canonical.value;
  const last = cands[cands.length - 1];
  if (numbersAgree(last.value, want)) return { verdict: 'correct', part: label, matched: last.text };
  // An earlier value matches and a later one does not: ambiguous.
  if (cands.some((c) => numbersAgree(c.value, want))) return { verdict: 'undecided', part: label };
  // Wrong only when offered as the final answer; working is for the model check.
  const offered = [...cands].reverse().find((c) => c.explicit);
  if (!offered) return { verdict: 'undecided', part: label };
  return { verdict: 'incorrect', part: label, matched: offered.text };
}

/** One verdict per part the message offers a value for (or the single part). */
export function keyedVerdicts(studentMessage: string, key: AnswerKey): KeyedVerdict[] {
  const text = normalize(studentMessage).trim();
  if (!text || !key?.parts?.length || isRuntimeNote(text)) return [];
  const isQuestion = /\?/.test(text);
  const marks = labelMarks(text, key);
  const byLabel = new Map<string, Candidate[]>();
  const head = marks.length ? text.slice(0, marks[0].at) : text;
  marks.forEach((mk, i) => {
    const seg = text.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : text.length);
    const list = byLabel.get(mk.label) ?? [];
    list.push(...candidates(seg, { segmentStartIsLead: true }));
    byLabel.set(mk.label, list);
  });
  const out: KeyedVerdict[] = [];
  if (key.parts.length === 1) {
    const part = key.parts[0];
    const cands = [
      ...candidates(head, { keyVar: keyVarOf(part) }),
      ...(byLabel.get(normLabel(part.label)) ?? []),
    ];
    const bare = !marks.length && !cands.length ? bareNumber(text) : null;
    const v = judgePart(part, bare ? [bare] : cands);
    out.push(v);
  } else {
    for (const part of key.parts) {
      const cands = byLabel.get(normLabel(part.label));
      if (cands?.length) out.push(judgePart(part, cands));
    }
    // An unlabeled value counts only when it matches exactly one numeric part.
    if (!marks.length) {
      const cands = candidates(head, {});
      const bare = !cands.length ? bareNumber(text) : null;
      const vals = bare ? [bare] : cands;
      const last = vals[vals.length - 1];
      if (last) {
        const hits = key.parts.filter((p) => p.canonical.kind === 'number' && numbersAgree(last.value, p.canonical.value));
        if (hits.length === 1) out.push({ verdict: 'correct', part: normLabel(hits[0].label), matched: last.text });
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
    part: vs.map((v) => v.part ?? '').join(','),
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
  return `The problem's verified final answer: ${keyFinalsLine(key)}`;
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
  const msgs = [...history.filter((m) => m.role === 'user').map((m) => (typeof m.content === 'string' ? m.content : '')), currentMessage];
  for (const msg of msgs) {
    for (const v of keyedVerdicts(msg, key)) if (v.verdict === 'correct') done.add(v.part ?? '');
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
export function formatKeyedVerdictDebug(part: string, verdict: 'correct' | 'incorrect'): string {
  return `keyed part=${normLabel(part)} verdict=${verdict}`;
}

export function parseKeyedVerdictDebug(message: unknown): { part: string; verdict: 'correct' | 'incorrect' } | null {
  const m = /^keyed part=([a-z0-9]*) verdict=(correct|incorrect)\b/.exec(String(message ?? ''));
  return m ? { part: m[1], verdict: m[2] as 'correct' | 'incorrect' } : null;
}
