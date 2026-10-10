/**
 * Practice-item corrections (older ProblemBank rows) — PURE logic. No I/O, no
 * env, no network, no database. Tested by core.test.ts.
 *
 * A correction is a list of field changes on ONE stored row, identified by
 * its `id`: `problemText`, `answer`, `solutionText` (whole value) and
 * `hints[i]`, `choices[i]` (one array element, by explicit index). Every
 * change carries the exact value it replaces (`old`) and the value it writes
 * (`new`). Nothing is ever added to or removed from an array.
 *
 * What is here:
 *   - applying / classifying changes against a row (also the independent
 *     expectation the generated mongosh script is compared with);
 *   - the offline validation of a fix file against the exported rows (the
 *     structural rules and the item rules — the product's grading is checked
 *     separately, in grading.ts);
 *   - the data file the mongosh script reads, and the review diff.
 *
 * Two text checks are reused by import from the practice job
 * (scripts/practice-extend/ingest-core.ts): `containsVerbatim` and
 * `referencesOptionByLetter`.
 */
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { containsVerbatim, referencesOptionByLetter } from '../practice-extend/ingest-core';

// ── types ───────────────────────────────────────────────────────────────────

export type ScalarField = 'problemText' | 'answer' | 'solutionText';
export type ArrayField = 'hints' | 'choices';
export type Field = ScalarField | ArrayField;
export const SCALAR_FIELDS: readonly ScalarField[] = ['problemText', 'answer', 'solutionText'];
export const ARRAY_FIELDS: readonly ArrayField[] = ['hints', 'choices'];

export interface Change {
  field: Field;
  /** Array position for hints / choices; null for the scalar fields. */
  index: number | null;
  old: string;
  new: string;
}

export interface BankRow {
  id: string;
  loId?: string;
  topic?: string;
  problemText: string;
  answer: string;
  responseFormat: 'mcq' | 'numeric' | 'free';
  choices: string[];
  hints: string[];
  solutionText: string;
  [k: string]: unknown;
}

export interface FixItem {
  id: string;
  suffix: string;
  kind: 'fix' | 'hint-repair';
  subject: string;
  skill: string;
  format: 'mcq' | 'numeric' | 'free';
  readerVerdict?: string;
  category: string;
  confidence: string;
  whatWasWrong: string;
  readerProposal?: string;
  keyChanged: boolean;
  /** The working, required when the key changes. */
  working?: string;
  verified?: string;
  note?: string;
  /** A rule knowingly not met, with the reason. */
  waivers?: { stemContainsKey?: string; hintContainsKey?: string };
  /** Answers the corrected row must reject / accept (beyond the generated ones). */
  wrongAnswers?: string[];
  equivalents?: string[];
  changes: Change[];
}

export interface FixFile {
  formatVersion: 1;
  items: FixItem[];
  borderlineHints?: Array<{ id: string; suffix: string; subject: string; hintIndex: number; hint: string; why: string }>;
}

export interface Issue {
  level: 'error' | 'warning';
  code: string;
  id: string;
  suffix: string;
  path?: string;
  message: string;
}

export interface ResolvedItem {
  item: FixItem;
  before: BankRow;
  after: BankRow;
}

export interface ValidationResult {
  ok: boolean;
  issues: Issue[];
  /** Items whose every change matched the export (others cannot be applied). */
  resolved: ResolvedItem[];
  totals: { items: number; rows: number; fields: number; keyChanges: number; errors: number; warnings: number; byKind: Record<string, { rows: number; fields: number }>; byField: Record<string, number> };
}

// ── applying changes ────────────────────────────────────────────────────────

export const changePath = (c: Pick<Change, 'field' | 'index'>): string => (c.index === null ? c.field : `${c.field}[${c.index}]`);

export type ChangeState = { state: 'change' | 'already' } | { state: 'mismatch'; why: string };

/** One change against a row: can it be made (`change`), is it already made
 *  (`already`), or does the stored value differ from both (`mismatch`)?
 *  `direction` revert swaps old and new. */
export function classifyChange(row: Record<string, unknown>, c: Change, direction: 'apply' | 'revert' = 'apply'): ChangeState {
  const from = direction === 'apply' ? c.old : c.new;
  const to = direction === 'apply' ? c.new : c.old;
  const v = row[c.field];
  if (c.index === null) {
    if (typeof v !== 'string') return { state: 'mismatch', why: `stored field is not a string: ${JSON.stringify(v)}` };
    if (v === from) return { state: 'change' };
    if (v === to) return { state: 'already' };
    return { state: 'mismatch', why: `stored value differs: ${JSON.stringify(v)}` };
  }
  if (!Array.isArray(v)) return { state: 'mismatch', why: `stored field is not an array: ${JSON.stringify(v)}` };
  if (c.index >= v.length) return { state: 'mismatch', why: `stored array has only ${v.length} element(s)` };
  if (v[c.index] === from) return { state: 'change' };
  if (v[c.index] === to) return { state: 'already' };
  return { state: 'mismatch', why: `stored value differs: ${JSON.stringify(v[c.index])}` };
}

/** The row with the changes made. Throws when any stored value is not `old`.
 *  The input is not modified; untouched fields are carried over as they are. */
export function applyChanges<T extends Record<string, unknown>>(row: T, changes: readonly Change[], direction: 'apply' | 'revert' = 'apply'): T {
  const out = JSON.parse(JSON.stringify(row)) as Record<string, unknown>;
  for (const c of changes) {
    const s = classifyChange(out, c, direction);
    if (s.state !== 'change') throw new Error(`${String(row.id)} ${changePath(c)}: ${'why' in s ? s.why : 'already in its target state'}`);
    const to = direction === 'apply' ? c.new : c.old;
    if (c.index === null) out[c.field] = to;
    else (out[c.field] as string[])[c.index] = to;
  }
  return out as T;
}

// ── item rules ──────────────────────────────────────────────────────────────

const LETTERS = 'ABCDEFGH';
const fold = (s: string): string => (s ?? '').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();

/** The key in words: the correct option's text for mcq, the answer otherwise.
 *  null when an mcq key is not a letter of one of its options. */
export function correctTextOf(row: BankRow): string | null {
  if (row.responseFormat !== 'mcq') return row.answer;
  const k = (row.answer ?? '').trim().toUpperCase();
  const i = k.length === 1 ? LETTERS.indexOf(k) : -1;
  return i >= 0 && i < row.choices.length ? row.choices[i] : null;
}

const SUPERSCRIPTS: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
function normaliseArithmetic(text: string): string {
  return (text ?? '')
    .replace(/[−–]/g, '-')
    .replace(/[×·⋅∙]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[⁰¹²³⁴-⁹⁻]+/g, (m) => `^${m.split('').map((ch) => SUPERSCRIPTS[ch] ?? '').join('')}`)
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
}

/** Value of `a op b op c …` (numbers only), usual precedence; null if not one. */
function evaluateChain(expr: string): number | null {
  const tokens = expr.replace(/\s+/g, '').replace(/\*\*/g, '^').match(/\(-?\d+(?:\.\d+)?\)|\d+(?:\.\d+)?|[-+*/^]/g);
  if (!tokens) return null;
  const out: Array<number | string> = [];
  let expectNumber = true;
  let sign = 1;
  for (const tk of tokens) {
    if (expectNumber) {
      if (tk === '-' || tk === '+') { sign *= tk === '-' ? -1 : 1; continue; }
      if (/^[*/^]$/.test(tk)) return null;
      out.push(sign * Number(tk.replace(/[()]/g, '')));
      sign = 1;
      expectNumber = false;
    } else {
      if (!/^[-+*/^]$/.test(tk)) return null;
      out.push(tk);
      expectNumber = true;
    }
  }
  if (expectNumber || out.length < 3) return null;
  const reduce = (ops: string[], rightToLeft = false): void => {
    for (let i = rightToLeft ? out.length - 2 : 1; rightToLeft ? i > 0 : i < out.length; ) {
      const op = out[i] as string;
      if (!ops.includes(op)) { i += rightToLeft ? -2 : 2; continue; }
      const a = out[i - 1] as number;
      const b = out[i + 1] as number;
      const v = op === '^' ? a ** b : op === '*' ? a * b : op === '/' ? a / b : op === '+' ? a + b : a - b;
      out.splice(i - 1, 3, v);
      if (rightToLeft) i -= 2;
    }
  };
  reduce(['^'], true);
  reduce(['*', '/']);
  reduce(['+', '-']);
  const v = out[0];
  return out.length === 1 && typeof v === 'number' && Number.isFinite(v) ? v : null;
}

const N = '\\(?-?\\d+(?:\\.\\d+)?\\)?';
const num = (s: string): number => Number(s.replace(/[()]/g, ''));
const PHRASES: Array<[RegExp, (a: number, b: number) => number]> = [
  [new RegExp(`[Dd]ivid\\w* (?:the )?\\$?(${N})[^\\d.]{0,25}? by \\$?(${N})`, 'g'), (a, b) => a / b],
  [new RegExp(`(${N})[^\\d.]{0,12}? divided by \\$?(${N})`, 'g'), (a, b) => a / b],
  [new RegExp(`[Mm]ultipl\\w* (?:the )?\\$?(${N})[^\\d.]{0,25}? (?:by|and|with) \\$?(${N})`, 'g'), (a, b) => a * b],
  [new RegExp(`(${N})[^\\d.]{0,12}? (?:times|multiplied by) \\$?(${N})`, 'g'), (a, b) => a * b],
  [new RegExp(`[Ss]ubtract\\w* \\$?(${N})[^\\d.]{0,25}? from \\$?(${N})`, 'g'), (a, b) => b - a],
  [new RegExp(`[Aa]dd\\w* \\$?(${N})[^\\d.]{0,25}? (?:and|to|plus) \\$?(${N})`, 'g'), (a, b) => a + b],
  [new RegExp(`(${N}) (?:raised to(?: the)?|to the power(?: of)?) (${N})`, 'g'), (a, b) => (Math.abs(b) < 60 ? a ** b : NaN)],
];

/** Every arithmetic a text spells out with literal numbers ("4 × 6 × 3",
 *  "Divide 3000 by 250", "(30 + 38)/2"), with its value. */
export function spelledArithmetic(text: string): Array<{ text: string; value: number }> {
  const t = normaliseArithmetic(text);
  const out: Array<{ text: string; value: number }> = [];
  const chain = new RegExp(`\\(?${N}(?:\\s*(?:\\^|\\*\\*|[*/+\\-]|\\bx\\b)\\s*${N}\\)?)+(?:\\s*[*/]\\s*${N})*`, 'g');
  for (const m of t.matchAll(chain)) {
    // "(30 + 38)/2": evaluate a leading bracketed sum first
    const g = m[0].match(/^\((.+)\)\s*([*/])\s*(.+)$/);
    let v: number | null;
    if (g) {
      const inner = evaluateChain(g[1].replace(/\bx\b/g, '*'));
      const rest = Number.isFinite(Number(g[3].replace(/[()]/g, ''))) ? Number(g[3].replace(/[()]/g, '')) : evaluateChain(g[3]);
      v = inner === null || rest === null ? null : g[2] === '*' ? inner * rest : inner / rest;
    } else v = evaluateChain(m[0].replace(/\bx\b/g, '*'));
    if (v !== null && Number.isFinite(v)) out.push({ text: m[0].trim(), value: v });
  }
  for (const [re, fn] of PHRASES) {
    for (const m of t.matchAll(re)) {
      const v = fn(num(m[1]), num(m[2]));
      if (Number.isFinite(v)) out.push({ text: m[0], value: v });
    }
  }
  return out;
}

/** Does the text spell out, with literal numbers, the arithmetic that yields
 *  the (numeric) key — exactly, or rounded to the key's places? */
export function spellsFinalArithmetic(text: string, keyText: string): string | null {
  const key = parseNumericKey(keyText);
  if (!key) return null;
  for (const a of spelledArithmetic(text)) {
    const diff = Math.abs(a.value - key.value);
    if (diff <= 1e-9 * Math.max(1, Math.abs(key.value))) return a.text;
    if (key.form === 'decimal' && diff <= 0.5 * 10 ** -key.places + 1e-12) return a.text;
  }
  return null;
}

export interface RuleFinding { code: string; path: string; message: string }

/** The item rules on ONE row as it would be stored: an mcq has distinct
 *  options and a key that is one of them; a numeric key is a bare number;
 *  nothing refers to an option by position; the key is not printed in the
 *  stem or in a hint, and no hint spells out the final arithmetic. */
export function ruleFindings(row: BankRow): RuleFinding[] {
  const out: RuleFinding[] = [];
  const add = (code: string, path: string, message: string): void => { out.push({ code, path, message }); };
  const key = correctTextOf(row);
  if (row.responseFormat === 'mcq') {
    if (key === null) add('mcq_key_not_an_option', 'answer', `key ${JSON.stringify(row.answer)} is not the letter of one of the ${row.choices.length} options`);
    if (row.choices.length < 2) add('mcq_too_few_options', 'choices', `${row.choices.length} option(s)`);
    const seen = new Map<string, number>();
    row.choices.forEach((c, i) => {
      const f = fold(c);
      if (!f) add('mcq_empty_option', `choices[${i}]`, 'empty option');
      else if (seen.has(f)) add('mcq_options_not_distinct', `choices[${i}]`, `same text as choices[${seen.get(f)}]`);
      else seen.set(f, i);
    });
    if (row.choices.length !== 4) add('mcq_option_count_not_4', 'choices', `${row.choices.length} options (the product letters A–D)`);
  }
  if (row.responseFormat === 'numeric' && !parseNumericKey(row.answer)) add('numeric_key_not_bare_number', 'answer', `key ${JSON.stringify(row.answer)} is not a bare number`);
  for (const [path, text] of [['problemText', row.problemText], ...row.hints.map((h, i) => [`hints[${i}]`, h]), ['solutionText', row.solutionText]] as Array<[string, string]>) {
    if (typeof text !== 'string' || !text.trim()) { add('empty_text', path, 'empty'); continue; }
    if (row.responseFormat === 'mcq' && referencesOptionByLetter(text)) add('option_referenced_by_position', path, 'refers to an option by letter or position');
  }
  if (key) {
    if (containsVerbatim(row.problemText, key)) add('stem_contains_key', 'problemText', `the stem contains the key ${JSON.stringify(key)}`);
    row.hints.forEach((h, i) => {
      if (containsVerbatim(h, key)) add('hint_contains_key', `hints[${i}]`, `the hint contains the key ${JSON.stringify(key)}`);
      else {
        const a = row.responseFormat === 'mcq' ? null : spellsFinalArithmetic(h, key);
        if (a) add('hint_final_arithmetic', `hints[${i}]`, `the hint spells out the final arithmetic (${a})`);
      }
    });
  }
  return out;
}

// ── validation ──────────────────────────────────────────────────────────────

const ID_RE = /^practice-gen\.gen-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.lo-\d+\.[a-z0-9]+$/;
/** Codes that never block: they describe the row as it already was. */
const PRE_EXISTING_WARNINGS = new Set(['mcq_option_count_not_4']);

export interface ValidationContext {
  rows: ReadonlyMap<string, BankRow>;
  /** Ids of the rows being served (the 768 that were read). */
  servedIds: ReadonlySet<string>;
  /** Ids on the withdraw list: a withdrawn row is not also corrected. */
  withdrawnIds: ReadonlySet<string>;
}

export function validateFixFile(file: FixFile, ctx: ValidationContext): ValidationResult {
  const issues: Issue[] = [];
  const resolved: ResolvedItem[] = [];
  const seenIds = new Set<string>();
  const items = Array.isArray(file?.items) ? file.items : [];
  if (file?.formatVersion !== 1 || !Array.isArray(file?.items)) issues.push({ level: 'error', code: 'file_shape', id: '', suffix: '', message: 'expected { formatVersion: 1, items: [...] }' });
  for (const item of items) {
    const suffix = item?.suffix ?? String(item?.id ?? '').split('.').pop() ?? '';
    const id = String(item?.id ?? '');
    const err = (code: string, message: string, path?: string): void => { issues.push({ level: 'error', code, id, suffix, path, message }); };
    const warn = (code: string, message: string, path?: string): void => { issues.push({ level: 'warning', code, id, suffix, path, message }); };
    const before = issues.filter((i) => i.level === 'error').length;

    if (!ID_RE.test(id)) err('bad_id', `unexpected row id ${JSON.stringify(id)}`);
    if (seenIds.has(id)) err('duplicate_item', 'this row has two entries');
    seenIds.add(id);
    if (item.kind !== 'fix' && item.kind !== 'hint-repair') err('bad_kind', `kind ${JSON.stringify(item.kind)}`);
    if (!Array.isArray(item.changes) || item.changes.length === 0) { err('no_changes', 'no changes listed'); continue; }
    const row = ctx.rows.get(id);
    if (!row) { err('unknown_row', 'row is not in the export'); continue; }
    if (!ctx.servedIds.has(id)) err('not_served', 'row is not among the served rows that were read');
    if (ctx.withdrawnIds.has(id)) err('withdrawn_row', 'row is on the withdraw list — withdraw it or correct it, not both');
    if (item.id.split('.').pop() !== item.suffix) err('suffix_mismatch', `suffix ${JSON.stringify(item.suffix)} is not the id's last segment`);
    if (item.format !== row.responseFormat) err('format_mismatch', `entry says ${item.format}, row is ${row.responseFormat}`);

    const paths = new Set<string>();
    let structural = true;
    for (const c of item.changes) {
      const p = changePath(c ?? ({ field: '?', index: null } as never));
      const isScalar = (SCALAR_FIELDS as readonly string[]).includes(c?.field);
      const isArray = (ARRAY_FIELDS as readonly string[]).includes(c?.field);
      if (!isScalar && !isArray) { err('bad_field', `field ${JSON.stringify(c?.field)} cannot be changed`, p); structural = false; continue; }
      if (isScalar && c.index !== null) { err('bad_index', 'a scalar field takes index null', p); structural = false; continue; }
      if (isArray && (!Number.isInteger(c.index) || (c.index as number) < 0)) { err('bad_index', `array index ${JSON.stringify(c.index)}`, p); structural = false; continue; }
      if (typeof c.old !== 'string' || typeof c.new !== 'string') { err('bad_value', 'old and new must be strings', p); structural = false; continue; }
      if (paths.has(p)) { err('duplicate_change', 'this field is changed twice', p); structural = false; continue; }
      paths.add(p);
      if (c.new === c.old) { err('no_change', 'new equals old', p); structural = false; }
      if (!c.new.trim()) { err('empty_new', 'new value is empty', p); structural = false; }
      if (c.new !== c.new.trim()) warn('untrimmed_new', 'new value has leading or trailing white space', p);
      const s = classifyChange(row, c);
      if (s.state === 'mismatch') { err('old_mismatch', `old does not equal the exported value — ${s.why}`, p); structural = false; }
      else if (s.state === 'already') { err('old_mismatch', 'the exported row already holds the new value', p); structural = false; }
    }
    if (item.kind === 'hint-repair' && item.changes.some((c) => c.field !== 'hints')) err('hint_repair_scope', 'a hint repair changes hints only');
    const changesKey = item.changes.some((c) => c.field === 'answer');
    if (changesKey !== item.keyChanged) err('key_flag', changesKey ? 'the answer changes but keyChanged is not true' : 'keyChanged is true but no answer change is listed');
    if (item.keyChanged && !(item.working ?? '').trim()) err('key_working_missing', 'a key change needs its working');
    if (!structural) continue;

    const after = applyChanges(row, item.changes);
    if (after.choices.length !== row.choices.length || after.hints.length !== row.hints.length) err('array_length_changed', 'an array changed length');
    const changedHints = new Set(item.changes.filter((c) => c.field === 'hints').map((c) => `hints[${c.index}]`));
    const wasThere = new Set(ruleFindings(row).map((f) => `${f.code}@${f.path}`));
    for (const f of ruleFindings(after)) {
      const touched = f.path === 'answer' || f.path === 'choices' || paths.has(f.path) || changedHints.has(f.path) || item.changes.some((c) => c.field === 'answer');
      const waived =
        (f.code === 'stem_contains_key' && item.waivers?.stemContainsKey) ||
        ((f.code === 'hint_contains_key' || f.code === 'hint_final_arithmetic') && item.waivers?.hintContainsKey);
      if (PRE_EXISTING_WARNINGS.has(f.code)) { warn(f.code, `${f.message} — as stored, not changed`, f.path); continue; }
      if (waived) { warn(`waived_${f.code}`, `${f.message} — waived: ${waived}`, f.path); continue; }
      // A full fix answers for the whole row. A hint repair answers for the
      // hints it rewrote; what else the row already had is reported only.
      if (item.kind === 'fix' || (touched && f.path.startsWith('hints'))) err(f.code, f.message, f.path);
      else warn(`${f.code}_as_stored`, `${f.message}${wasThere.has(`${f.code}@${f.path}`) ? ' — as stored, not part of this repair' : ''}`, f.path);
    }
    for (const k of ['stemContainsKey', 'hintContainsKey'] as const) {
      const code = k === 'stemContainsKey' ? ['stem_contains_key'] : ['hint_contains_key', 'hint_final_arithmetic'];
      if (item.waivers?.[k] !== undefined && !ruleFindings(after).some((f) => code.includes(f.code))) err('stale_waiver', `waiver ${k} is not needed`);
    }
    if (issues.filter((i) => i.level === 'error').length === before) resolved.push({ item, before: row, after });
  }
  const errors = issues.filter((i) => i.level === 'error').length;
  const byKind: Record<string, { rows: number; fields: number }> = {};
  const byField: Record<string, number> = {};
  for (const r of resolved) {
    const k = (byKind[r.item.kind] ??= { rows: 0, fields: 0 });
    k.rows += 1;
    k.fields += r.item.changes.length;
    for (const c of r.item.changes) byField[c.field] = (byField[c.field] ?? 0) + 1;
  }
  return {
    ok: errors === 0,
    issues,
    resolved,
    totals: {
      items: items.length,
      rows: resolved.length,
      fields: resolved.reduce((a, r) => a + r.item.changes.length, 0),
      keyChanges: resolved.filter((r) => r.item.keyChanged).length,
      errors,
      warnings: issues.length - errors,
      byKind,
      byField,
    },
  };
}

// ── the data file the mongosh script reads ──────────────────────────────────

export interface ApplyRow {
  id: string;
  suffix: string;
  subject: string;
  kind: string;
  keyChanged: boolean;
  /** Lengths of the stored arrays at export — the script checks them too. */
  arrayLengths: { hints: number; choices: number };
  changes: Change[];
}
export interface ApplyData {
  formatVersion: 1;
  database: 'evelyn';
  collection: 'problembanks';
  counts: { rows: number; fields: number; keyChanges: number };
  rows: ApplyRow[];
}

export function buildApplyData(resolved: readonly ResolvedItem[]): ApplyData {
  const rows = [...resolved]
    .sort((a, b) => (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0))
    .map((r): ApplyRow => ({
      id: r.item.id,
      suffix: r.item.suffix,
      subject: r.item.subject,
      kind: r.item.kind,
      keyChanged: r.item.keyChanged,
      arrayLengths: { hints: r.before.hints.length, choices: r.before.choices.length },
      changes: r.item.changes.map((c) => ({ field: c.field, index: c.index, old: c.old, new: c.new })),
    }));
  return {
    formatVersion: 1,
    database: 'evelyn',
    collection: 'problembanks',
    counts: { rows: rows.length, fields: rows.reduce((a, r) => a + r.changes.length, 0), keyChanges: rows.filter((r) => r.keyChanged).length },
    rows,
  };
}

// ── the review diff ─────────────────────────────────────────────────────────

const SUBJECT_ORDER = ['ALGEBRA_2', 'PRECALCULUS', 'AP_CALCULUS_AB', 'PHYSICS', 'AP_CHEMISTRY', 'AP_BIOLOGY'];
const bySubject = (a: string, b: string): number => (SUBJECT_ORDER.indexOf(a) + 100 * Number(SUBJECT_ORDER.indexOf(a) < 0)) - (SUBJECT_ORDER.indexOf(b) + 100 * Number(SUBJECT_ORDER.indexOf(b) < 0)) || a.localeCompare(b);
const quote = (s: string): string => s.split('\n').map((l) => `> ${l}`).join('\n');
const FIELD_LABEL: Record<string, string> = { problemText: 'Question', answer: 'Key', solutionText: 'Solution', hints: 'Hint', choices: 'Option' };

export interface GradingLine { id: string; ok: boolean; summary: string }

export function renderDiffMarkdown(result: ValidationResult, generatedAt: string, grading: ReadonlyMap<string, GradingLine> = new Map()): string {
  const L: string[] = [];
  const res = result.resolved;
  L.push('# Practice-item corrections — review diff', '');
  L.push(`Generated ${generatedAt} by apps/tutor/scripts/practice-fix/validate-fixes.ts from fixes.json. Collection \`problembanks\`; every "old" below is the exported row's current value.`, '');
  L.push(`**${res.length} rows · ${result.totals.fields} field values · ${result.totals.keyChanges} key change(s) · validation: ${result.totals.errors} error(s), ${result.totals.warnings} warning(s).**`, '');
  const cats = [...new Set(res.map((r) => (r.item.kind === 'fix' ? r.item.category : 'hint repair')))].sort((a, b) => (a === 'hint repair' ? 1 : b === 'hint repair' ? -1 : a.localeCompare(b)));
  const subjects = [...new Set(res.map((r) => r.item.subject))].sort(bySubject);
  L.push('## Summary — rows by subject and category', '');
  L.push(`| Subject | ${cats.join(' | ')} | Rows | Fields | Key changes |`, `|---|${cats.map(() => '--:').join('|')}|--:|--:|--:|`);
  const cell = (rs: ResolvedItem[], cat: string): number => rs.filter((r) => (r.item.kind === 'fix' ? r.item.category : 'hint repair') === cat).length;
  for (const s of subjects) {
    const rs = res.filter((r) => r.item.subject === s);
    L.push(`| ${s} | ${cats.map((c) => cell(rs, c) || '').join(' | ')} | ${rs.length} | ${rs.reduce((a, r) => a + r.item.changes.length, 0)} | ${rs.filter((r) => r.item.keyChanged).length || ''} |`);
  }
  L.push(`| **Total** | ${cats.map((c) => cell(res, c)).join(' | ')} | ${res.length} | ${result.totals.fields} | ${result.totals.keyChanges} |`, '');
  L.push(`Fields by kind: ${Object.entries(result.totals.byField).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}.`, '');
  const keyRows = res.filter((r) => r.item.keyChanged);
  if (keyRows.length) {
    L.push('### Key changes', '');
    for (const r of keyRows) {
      const c = r.item.changes.find((x) => x.field === 'answer') as Change;
      L.push(`- \`…${r.item.suffix}\` (${r.item.subject}): \`${c.old}\` → \`${c.new}\` — ${r.item.working ?? ''}`);
    }
    L.push('');
  }
  const section = (title: string, list: ResolvedItem[]): void => {
    if (!list.length) return;
    L.push(`## ${title}`, '');
    for (const s of subjects) {
      const rs = list.filter((r) => r.item.subject === s).sort((a, b) => a.item.skill.localeCompare(b.item.skill) || a.item.suffix.localeCompare(b.item.suffix));
      if (!rs.length) continue;
      L.push(`### ${s}`, '');
      for (const r of rs) {
        const it = r.item;
        L.push(`#### …${it.suffix} — ${it.skill}`, '');
        L.push(`- **What was wrong:** ${it.whatWasWrong}`);
        L.push(`- Format ${it.format} · category ${it.kind === 'fix' ? it.category : 'hint repair'} · key changed: **${it.keyChanged ? 'YES' : 'no'}** · reader confidence ${it.confidence}${it.readerProposal && it.readerProposal !== 'n/a' ? ` · reader's proposal: ${it.readerProposal}` : ''}`);
        if (it.keyChanged) L.push(`- **Working:** ${it.working}`);
        if (it.verified) L.push(`- Re-verified: ${it.verified}`);
        if (it.note) L.push(`- Note: ${it.note}`);
        for (const [k, v] of Object.entries(it.waivers ?? {})) L.push(`- Waiver (${k}): ${v}`);
        const g = grading.get(it.id);
        if (g) L.push(`- Grading check: ${g.ok ? 'passed' : '**FAILED**'} — ${g.summary}`);
        L.push('');
        for (const c of it.changes) {
          const label = `${FIELD_LABEL[c.field] ?? c.field}${c.index === null ? '' : ` ${c.field === 'choices' ? LETTERS[c.index] ?? c.index + 1 : c.index + 1}`}${c.field === 'choices' && correctTextOf(r.before) === c.old ? ' (the correct option)' : ''}`;
          L.push(`**${label}** — old:`, '', quote(c.old), '', 'new:', '', quote(c.new), '');
        }
      }
    }
  };
  section('Fixes (the readers\' `fix` items)', res.filter((r) => r.item.kind === 'fix'));
  section('Hints that gave the answer (only the hint is rewritten)', res.filter((r) => r.item.kind === 'hint-repair'));
  return `${L.join('\n')}\n`;
}
