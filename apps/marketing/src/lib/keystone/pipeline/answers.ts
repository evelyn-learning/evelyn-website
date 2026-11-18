// Pure, deterministic judge for the solutions pipeline: normalise answers, compare them,
// turn the client's key into an Answer, and apply the outcome table. No I/O, no models.
// answerForm and canonicalResponse are the ONE definition of an item's answer form and
// canonical values: parseKey (the key side) and solve.ts (the solver side) both use them.
import type { ItemDoc } from "../db";
import type { Interaction } from "../qti-interactions";

export type Answer =
  | { kind: "choice"; letters: string[] }
  | { kind: "number"; value: string }
  | { kind: "labels"; values: string[] }
  | { kind: "text"; value: string };

export type Decision =
  | { outcome: "pass"; answer: Answer; confirm: boolean; flag?: "solvers_split" }
  | { outcome: "key_query"; answer: Answer }
  | { outcome: "need_third" }
  | { outcome: "hold"; why: "no_agreement" | "written_response" | "unreadable_form" };

const NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)$/;
const LETTERS = /^[A-Z](,[A-Z])*$/i;

const SEP = /[,    ]/;
const GROUPED = /^[+-]?\d{1,3}([,    ]\d{3})+(\.\d*)?$/;
const EXPONENT = /^[+-]?(\d+\.?\d*|\.\d+)e[+-]?\d+$/i;

/** Plain decimal text, or null when the text is not a plain decimal. Separators (comma, thin space, NBSP, space)
 *  are accepted only as thousands groups of three, so "1,2" is never read as 12. A unit or "%" makes it null. */
function toPlain(s: string): string | null {
  let t = s.trim().replace(/^[−–]/, "-");
  if (SEP.test(t)) {
    if (!GROUPED.test(t)) return null;
    t = t.replace(/[,    ]/g, "");
  }
  return NUMBER.test(t) ? t : null;
}
/** True when the text is a plain decimal (thousands groups allowed; no unit, "%", fraction or exponent). */
export const isNumber = (s: string) => toPlain(s) !== null;

/** A typed value as an Answer, read the same way on the key side and the solver side:
 *  a plain decimal is a number; anything else ("1/2", "x = 3", "50%") is one label. */
export function typedAnswer(value: string): Answer {
  const t = value.trim();
  return isNumber(t) ? { kind: "number", value: t } : { kind: "labels", values: [t] };
}

function letters(list: string[]): string[] {
  return [...new Set(list.map((l) => l.trim().toUpperCase()).filter(Boolean))].sort();
}

const WRITTEN = new Set(["WR", "SWR"]);

// --- the answer form: one definition for the key and the solvers ---

type Resp = Exclude<Interaction, { kind: "unsupported" }>;
type MatchLike = Extract<Interaction, { kind: "match" | "gapMatch" }>;

/** One response of the item. `identifiers`: choice / inlineChoice / order identifiers; for match the premises,
 *  for gapMatch the draggable choices. `targets`: match responses or gapMatch gaps. Pairs read identifier→target. */
export type ResponseForm = { responseId: string; kind: Resp["kind"]; identifiers: string[]; targets: string[]; interaction: Resp };

export type AnswerForm = {
  form: "choice-one" | "choice-many" | "number" | "typed" | "labels" | "text";
  /** Sorted by responseId: the order of the values in a "labels" answer. */
  responses: ResponseForm[];
};

type FormInput = { itemType: string; interactions?: Interaction[]; options?: { label: string }[] };

function responseForm(r: Resp): ResponseForm {
  const base = { responseId: r.responseId, kind: r.kind, interaction: r, targets: [] as string[] };
  switch (r.kind) {
    case "choice": return { ...base, identifiers: r.options.map((o) => o.label) };
    case "inlineChoice": case "order": return { ...base, identifiers: r.choices.map((o) => o.label) };
    case "match": return { ...base, identifiers: r.premises.map((o) => o.label), targets: r.responses.map((o) => o.label) };
    case "gapMatch": return { ...base, identifiers: r.choices.map((o) => o.label), targets: r.gaps };
    default: return { ...base, identifiers: [] };
  }
}

/** The answer form of an item, or null when it cannot be told (then nothing can be compared safely).
 *  With interactions: from the interactions. Without: MC/MS with options → choice; NR → number; WR/SWR → text. */
export function answerForm(item: FormInput): AnswerForm | null {
  const all = item.interactions ?? [];
  const rs = all.filter((i): i is Resp => i.kind !== "unsupported");
  if (WRITTEN.has(item.itemType) || (rs.length && rs.every((r) => r.kind === "extendedText"))) {
    return { form: "text", responses: rs.map(responseForm) };
  }
  if (rs.length === 1) {
    const r = rs[0];
    const responses = [responseForm(r)];
    if (r.kind === "choice") return { form: r.maxChoices > 1 || item.itemType === "MS" ? "choice-many" : "choice-one", responses };
    if (r.kind === "textEntry") return { form: item.itemType === "NR" ? "number" : "typed", responses };
    return { form: "labels", responses };
  }
  if (rs.length > 1) {
    if (rs.some((r) => r.kind === "extendedText")) return null; // a written part among others: no single form
    return { form: "labels", responses: [...rs].sort((a, b) => a.responseId.localeCompare(b.responseId)).map(responseForm) };
  }
  if (all.length) return null; // only interactions we cannot read
  const opts = item.options ?? [];
  const choiceOf = (maxChoices: number): ResponseForm[] =>
    [responseForm({ kind: "choice", responseId: "RESPONSE", maxChoices, options: opts.map((o) => ({ label: o.label, html: "" })) })];
  if (item.itemType === "MC" && opts.length) return { form: "choice-one", responses: choiceOf(1) };
  if (item.itemType === "MS" && opts.length) return { form: "choice-many", responses: choiceOf(opts.length) };
  if (item.itemType === "NR") return { form: "number", responses: [responseForm({ kind: "textEntry", responseId: "RESPONSE" })] };
  return null;
}

/** Lower-case lookup to the item's own spelling. */
const spelling = (ids: string[]) => new Map(ids.map((id) => [id.trim().toLowerCase(), id.trim()]));

/** Every way to read one pair value as two parts, in order of preference. */
function pairSplits(value: string, hyphenOk: boolean): [string, string][] {
  const v = value.trim();
  const out: [string, string][] = [];
  const arrow = v.match(/^(.+?)\s*(?:→|->|=>|:|\s-\s)\s*(.+)$/);
  if (arrow) out.push([arrow[1], arrow[2]]);
  const ws = v.match(/^(\S+)\s+(\S+)$/);
  if (ws) out.push([ws[1], ws[2]]);
  if (hyphenOk && (v.match(/-/g) ?? []).length === 1) {
    const [a, b] = v.split("-");
    out.push([a, b]);
  }
  return out.map(([a, b]) => [a.trim(), b.trim()] as [string, string]).filter(([a, b]) => a && b);
}

/** A match / gapMatch answer as sorted "X→Y" pairs in the item's own spelling, oriented as
 *  (premise | draggable choice) → (response | gap) whichever way round each pair was written.
 *  Null when a member is not one of the item's identifiers or both members are from the same set. */
export function canonicalPairs(values: string[], interaction: MatchLike): string[] | null {
  const f = responseForm(interaction);
  const from = spelling(f.identifiers), to = spelling(f.targets);
  const hyphenOk = ![...f.identifiers, ...f.targets].some((id) => id.includes("-"));
  const out: string[] = [];
  for (const v of values) {
    let pair: string | null = null;
    for (const [a, b] of pairSplits(v, hyphenOk)) {
      const la = a.toLowerCase(), lb = b.toLowerCase();
      if (from.has(la) && to.has(lb)) pair = `${from.get(la)}→${to.get(lb)}`;
      else if (to.has(la) && from.has(lb)) pair = `${from.get(lb)}→${to.get(la)}`;
      if (pair) break;
    }
    if (!pair) return null;
    out.push(pair);
  }
  return out.sort();
}

/** One response's values in canonical form (the same on both sides), or null when they cannot be read:
 *  choice → identifiers upper-cased, sorted, unique; inlineChoice → the one identifier; order → the sequence;
 *  match/gapMatch → canonicalPairs; textEntry → the one value (a plain decimal in canonical digits). */
export function canonicalResponse(f: ResponseForm, values: string[]): string[] | null {
  const vs = values.map((v) => String(v).trim()).filter(Boolean);
  if (!vs.length) return null;
  const ids = spelling(f.identifiers);
  const known = (v: string) => (f.identifiers.length ? ids.get(v.toLowerCase()) ?? null : v);
  switch (f.kind) {
    case "choice": {
      const mapped = vs.map((v) => (f.identifiers.length ? ids.get(v.toLowerCase()) ?? null : /^[A-Z]$/i.test(v) ? v : null));
      return mapped.every((m): m is string => m !== null) ? letters(mapped) : null;
    }
    case "inlineChoice": {
      if (vs.length !== 1) return null;
      const m = known(vs[0]);
      return m === null ? null : [m];
    }
    case "order": {
      const mapped = vs.map(known);
      return mapped.every((m): m is string => m !== null) ? mapped : null;
    }
    case "match": case "gapMatch":
      return canonicalPairs(vs, f.interaction as MatchLike);
    case "textEntry": {
      if (vs.length !== 1) return null;
      const d = parseDec(vs[0]);
      return [d ? canonDec(d) : vs[0]];
    }
    case "extendedText":
      return null;
  }
}

/** The key as an Answer plus whether it was read exactly in the item's answer form. `exact: false` means
 *  the Answer is a best effort for display only (form unknown, or a value not among the item's identifiers):
 *  comparing a solver's answer with it could raise a false key query. */
export function readKey(item: Pick<ItemDoc, "itemType" | "key" | "keys" | "interactions"> & { options?: { label: string }[] }): { answer: Answer | null; exact: boolean } {
  const key = (item.key ?? "").trim();
  const keys = item.keys ?? {};
  const keyIds = Object.keys(keys).filter((id) => (keys[id] ?? []).some((v) => String(v).trim()));
  if (!key && !keyIds.length) return { answer: null, exact: true };
  const form = answerForm(item);
  if (form?.form === "text") return { answer: null, exact: true };

  const valuesFor = (id: string): string[] => (keys[id] ?? []).map((v) => String(v).trim()).filter(Boolean);
  const loose = (answer: Answer | null) => ({ answer, exact: false });
  // Best effort without a known form (old behaviour).
  const legacy = (): Answer => {
    if (keyIds.length === 1 && !key) {
      const vals = valuesFor(keyIds[0]);
      if (item.itemType === "NR") return typedAnswer(vals[0]);
      return LETTERS.test(vals.join(",")) ? { kind: "choice", letters: letters(vals) } : { kind: "labels", values: vals };
    }
    if (keyIds.length > 1) return { kind: "labels", values: keyIds.sort().flatMap((id) => valuesFor(id)) };
    if (item.itemType === "NR") return typedAnswer(key);
    if (LETTERS.test(key)) return { kind: "choice", letters: letters(key.split(",")) };
    return { kind: "labels", values: [key] };
  };
  if (!form) return loose(legacy());

  const one = form.responses.length === 1 ? form.responses[0] : null;
  // The values for a single response: its own keys, else the only keyed response, else the legacy key.
  const singleValues = (rid: string): string[] =>
    keys[rid] && valuesFor(rid).length ? valuesFor(rid) : keyIds.length === 1 ? valuesFor(keyIds[0]) : [];

  if (form.form === "choice-one" || form.form === "choice-many") {
    const given = singleValues(one!.responseId);
    const vals = given.length ? given : key.split(",");
    const c = canonicalResponse(one!, vals);
    if (c) return { answer: { kind: "choice", letters: c }, exact: true };
    return letters(vals).length ? loose({ kind: "choice", letters: letters(vals) }) : loose(legacy());
  }
  if (form.form === "number" || form.form === "typed") {
    // Several values are alternative accepted answers; the first is the key (see acceptedAnswers).
    const given = singleValues(one!.responseId);
    const text = given.length ? given[0] : key;
    return text ? { answer: typedAnswer(text), exact: true } : loose(legacy());
  }
  // labels
  if (one) {
    const given = keys[one.responseId] ? valuesFor(one.responseId) : [];
    if (!given.length) return loose(key ? { kind: "labels", values: [key] } : legacy());
    const c = canonicalResponse(one, given);
    return c ? { answer: { kind: "labels", values: c }, exact: true } : loose({ kind: "labels", values: canon(one.interaction, given) });
  }
  const out: string[] = [];
  let exact = true;
  for (const r of form.responses) {
    const given = valuesFor(r.responseId);
    const c = canonicalResponse(r, r.kind === "textEntry" ? given.slice(0, 1) : given);
    if (!c) exact = false;
    out.push(...(c ?? canon(r.interaction, given)));
  }
  if (!out.length) return loose(legacy());
  return { answer: { kind: "labels", values: out }, exact };
}

export function parseKey(item: Pick<ItemDoc, "itemType" | "key" | "keys" | "interactions">): Answer | null {
  return readKey(item).answer;
}

/** One Answer per accepted alternative (a typed response with several key values); otherwise [parseKey(item)] or []. */
export function acceptedAnswers(item: Pick<ItemDoc, "itemType" | "key" | "keys" | "interactions">): Answer[] {
  const first = parseKey(item);
  if (!first) return [];
  const form = answerForm(item);
  if (form && (form.form === "number" || form.form === "typed")) {
    const keys = item.keys ?? {};
    const rid = form.responses[0].responseId;
    const ids = Object.keys(keys).filter((id) => (keys[id] ?? []).some((v) => String(v).trim()));
    const list = keys[rid] ?? (ids.length === 1 ? keys[ids[0]] : []);
    const vals = (list ?? []).map((v) => String(v).trim()).filter(Boolean);
    if (vals.length > 1) return vals.map(typedAnswer);
  }
  return [first];
}

/** Old best-effort form of a key that canonicalResponse could not read: pairs joined with an arrow and sorted. */
function canon(r: Interaction, vals: string[]): string[] {
  if (r.kind === "match" || r.kind === "gapMatch") return vals.map((v) => v.replace(/\s+/g, "→")).sort();
  return vals;
}

// --- number comparison on digit strings (never binary floating point) ---

type Dec = { neg: boolean; int: string; frac: string };

function parseDec(s: string): Dec | null {
  const t = toPlain(s);
  if (t === null) return null;
  const neg = t.startsWith("-");
  const body = t.replace(/^[+-]/, "");
  const [i, f = ""] = body.split(".");
  return { neg, int: i, frac: f };
}

// Precision rounding is half away from zero on the magnitude: -0.5 -> -1, 0.5 -> 1, -0.4 -> -0 (equals 0).
function roundTo(d: Dec, places: number): Dec {
  if (d.frac.length <= places) return d;
  const up = d.frac.charCodeAt(places) - 48 >= 5; // half-up on the magnitude (half away from zero)
  const kept = d.int + d.frac.slice(0, places);
  const n = (BigInt(kept || "0") + BigInt(up ? 1 : 0)).toString().padStart(places + 1, "0");
  return { neg: d.neg, int: n.slice(0, n.length - places), frac: n.slice(n.length - places) };
}

function canonDec(d: Dec): string {
  const int = d.int.replace(/^0+/, "") || "0";
  const frac = d.frac.replace(/0+$/, "");
  const zero = int === "0" && !frac;
  return `${d.neg && !zero ? "-" : ""}${int}${frac ? "." + frac : ""}`;
}

function sameNumber(a: string, b: string, precision?: number): boolean {
  const x = parseDec(a), y = parseDec(b);
  // Unparseable text (empty, "abc", "0.5%", "12 m/s") is never equal to anything. The one exception is
  // identical exponent-form text (e.g. "2.50e3" vs "2.50E3"), which we do not evaluate but can recognise as the same.
  if (!x || !y) return EXPONENT.test(a.trim()) && a.trim().toLowerCase() === b.trim().toLowerCase();
  if (precision === undefined) return canonDec(x) === canonDec(y);
  return canonDec(roundTo(x, precision)) === canonDec(roundTo(y, precision));
}

const normLabel = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

const B0 = BigInt(0), B1 = BigInt(1), B2 = BigInt(2), B5 = BigInt(5), B10 = BigInt(10);
const FRACTION = /^([+-]?)(\d+)\s*\/\s*(\d+)$/;

/** "a/b" of integers as an exact decimal, or null when it is not such a fraction or its expansion does not terminate. */
function fractionDecimal(s: string): string | null {
  const m = s.trim().replace(/^[−–]/, "-").match(FRACTION);
  if (!m) return null;
  const num = BigInt(m[2]), den = BigInt(m[3]);
  if (den === B0) return null;
  let rest = den, twos = 0, fives = 0;
  const g = gcd(num, den);
  rest = den / g;
  while (rest % B2 === B0) { rest /= B2; twos++; }
  while (rest % B5 === B0) { rest /= B5; fives++; }
  if (rest !== B1) return null; // repeating decimal: never equal to a written decimal
  const places = Math.max(twos, fives);
  const scaled = ((num / g) * B10 ** BigInt(places)) / (den / g);
  const digits = scaled.toString().padStart(places + 1, "0");
  const int = digits.slice(0, digits.length - places), frac = digits.slice(digits.length - places);
  return `${m[1] === "-" ? "-" : ""}${int}${places ? "." + frac : ""}`;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a || B1;
}

export function sameAnswer(a: Answer, b: Answer, precision?: number): boolean {
  // A number and a single fraction label ("0.5" and "1/2") are equal when the fraction's decimal is exactly the number.
  if (a.kind === "number" && b.kind === "labels") return b.values.length === 1 && sameFraction(a.value, b.values[0], precision);
  if (a.kind === "labels" && b.kind === "number") return a.values.length === 1 && sameFraction(b.value, a.values[0], precision);
  if (a.kind !== b.kind) return false;
  if (a.kind === "choice" && b.kind === "choice") {
    const x = letters(a.letters), y = letters(b.letters);
    return x.length === y.length && x.every((l, i) => l === y[i]);
  }
  if (a.kind === "number" && b.kind === "number") return sameNumber(a.value, b.value, precision);
  if (a.kind === "labels" && b.kind === "labels") return a.values.length === b.values.length && a.values.every((v, i) => normLabel(v) === normLabel(b.values[i]));
  return false; // text is judged elsewhere
}

function sameFraction(number: string, label: string, precision?: number): boolean {
  const d = fractionDecimal(label);
  return d !== null && sameNumber(number, d, precision);
}

export function decide(s1: Answer, s2: Answer, key: Answer | null, s3?: Answer, alsoAccepted: Answer[] = []): Decision {
  const matchesKey = (x: Answer) => !!key && (sameAnswer(x, key) || alsoAccepted.some((a) => sameAnswer(x, a)));
  if ([s1, s2, key, s3].some((x) => x?.kind === "text")) return { outcome: "hold", why: "written_response" };
  const hold: Decision = { outcome: "hold", why: "no_agreement" };
  if (sameAnswer(s1, s2)) {
    if (key) return matchesKey(s1) ? { outcome: "pass", answer: s1, confirm: false } : { outcome: "key_query", answer: s1 };
    if (!s3) return { outcome: "need_third" };
    return sameAnswer(s1, s3) ? { outcome: "pass", answer: s1, confirm: true } : hold;
  }
  if (!s3) return { outcome: "need_third" };
  if (!key) return hold;
  const winner = sameAnswer(s1, s3) ? s1 : sameAnswer(s2, s3) ? s2 : null;
  return winner && matchesKey(winner) ? { outcome: "pass", answer: winner, confirm: false, flag: "solvers_split" } : hold;
}
