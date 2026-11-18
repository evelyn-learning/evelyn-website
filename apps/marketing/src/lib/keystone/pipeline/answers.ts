// Pure, deterministic judge for the solutions pipeline: normalise answers, compare them,
// turn the client's key into an Answer, and apply the outcome table. No I/O, no models.
// answerForm and canonicalResponse are the ONE definition of an item's answer form and
// canonical values: parseKey (the key side) and solve.ts (the solver side) both use them.
import type { ItemDoc } from "../db";
import type { Interaction } from "../qti-interactions";

export type Answer =
  | { kind: "choice"; letters: string[] }
  | { kind: "number"; value: string }
  /** typedAt: indices of positions that are typed entries (textEntry), set only by the canonicalisation in this
   *  module; between two labels answers the number/fraction and typed-text rules apply only where both sides
   *  mark a position (a number against a single label is always a typed comparison: see sameAnswer). */
  | { kind: "labels"; values: string[]; typedAt?: number[] }
  | { kind: "text"; value: string };

export type Decision =
  | { outcome: "pass"; answer: Answer; confirm: boolean; flag?: "solvers_split" }
  | { outcome: "key_query"; answer: Answer }
  | { outcome: "need_third" }
  /** detail: for our own queue only (e.g. why the form is unreadable); never shown to a solver. */
  | { outcome: "hold"; why: "no_agreement" | "written_response" | "unreadable_form"; detail?: string };

const LETTERS = /^[A-Z](,[A-Z])*$/i;
const EXPONENT = /^[+-]?(\d+\.?\d*|\.\d+)e[+-]?\d+$/i;

// --- the ONE number reader -----------------------------------------------------------------------
// write.ts (numeric literals in a draft) and calc.ts (stated numbers, expected values) read numbers through
// readNumber; the comparison below (sameNumber, fractions, canonical response values) does too. Exact decimal
// strings only: never binary floating point.

/** Every hyphen, dash and minus sign that reads as "-" before a number. */
const MINUS = "\u2010-\u2014\u2212\ufe63\uff0d-";
const LEAD_SIGN = new RegExp(`^([+${MINUS}])[ \t\u00a0\u2009\u202f]*`);
const UNSIGNED = /^(?:\d+\.?\d*|\.\d+)$/;
/** Thousands separators between digit groups: comma, LaTeX "{,}", thin / narrow no-break / no-break space, space. */
const GROUP = "(?:,|\\{,\\}|[ \u00a0\u2009\u202f])";
const GROUPED = new RegExp(`^\\d{1,3}(?:${GROUP}\\d{3})+(?:\\.\\d*)?$`);
const GROUP_ALL = new RegExp(GROUP, "g");
const FRACTION = /^(\d+)\s*\/\s*(\d+)$/;
/** "a × 10^n" (× · * x X \times \cdot; braces optional) or "aEn"; n may carry any minus sign. */
const POWER_OF_TEN = new RegExp(`^(.*?)\\s*(?:[eE]\\s*([+${MINUS}]?\\d+)|(?:\\\\times|\\\\cdot|[\u00d7\u00b7*xX])\\s*10\\s*\\^\\s*\\{?\\s*([+${MINUS}]?\\d+)\\s*\\}?)$`);
const PERCENT = /\s*\\?%$/;
/** The largest power of ten an exponent form may carry (larger is not read: the digits would be unbounded). */
const MAX_EXPONENT = 1000;

/** Which written forms readNumber accepts besides a plain decimal; each is opt-in. */
export type NumberForms = { exponent?: boolean; fraction?: boolean; percent?: boolean };
/** value: the canonical plain decimal (no leading or trailing zeros, "0" for zero), for exact comparison.
 *  plain: the same number as a plain decimal with the digits as written (trailing zeros kept, "4.0", ".5";
 *  thousands groups removed, sign normalised to "-" or none), for display and decimal-place counts. */
export type NumberReading = { value: string; plain: string };

/** Moves the decimal point of a plain decimal string by `exp` places, exactly (no floats). Zero carries no sign. */
export function shiftDecimal(num: string, exp: number): string {
  const neg = num.startsWith("-");
  const [i, f = ""] = num.replace(/^[+-]/, "").split(".");
  const all = i + f;
  const digits = all.replace(/^0+(?=\d)/, "");
  const point = i.length - (all.length - digits.length) + exp;
  let out: string;
  if (point <= 0) out = `0.${"0".repeat(-point)}${digits}`;
  else if (point >= digits.length) out = digits + "0".repeat(point - digits.length);
  else out = `${digits.slice(0, point)}.${digits.slice(point)}`;
  out = out.replace(/^0+(?=\d)/, "");
  return neg && /[1-9]/.test(out) ? `-${out}` : out;
}

/** An unsigned plain decimal as written, thousands groups removed; null when it is not one ("1,2" is never 12). */
function unsignedPlain(t: string): string | null {
  if (UNSIGNED.test(t)) return t;
  return GROUPED.test(t) ? t.replace(GROUP_ALL, "") : null;
}

/** Canonical form of a plain decimal: no leading or trailing zeros, no sign on zero. */
function canonPlain(plain: string): string {
  const neg = plain.startsWith("-");
  const [i, f = ""] = plain.replace(/^[+-]/, "").split(".");
  const int = i.replace(/^0+/, "") || "0";
  const frac = f.replace(/0+$/, "");
  return `${neg && (int !== "0" || frac) ? "-" : ""}${int}${frac ? "." + frac : ""}`;
}

/** A number written in `text` (the whole text, trimmed), or null. Always: a plain decimal with an optional leading
 * sign ("+", "-" or any dash or minus variant, spaces allowed after it: "- 3" is -3) and thousands groups of three
 * ("2,500", "2{,}500", thin or plain spaces; "1,2" is not a number). With forms: `exponent` "2.5e3", "2.50 × 10^{3}",
 * "5 \\times 10^{-1}" (powers up to 1000); `fraction` "p/q" of two integers when its decimal terminates ("1/3" is
 * null: never equal to a written decimal); `percent` "n%" or "n\\%" as n/100. Units or other text make it null. */
export function readNumber(text: string, forms: NumberForms = {}): NumberReading | null {
  let t = text.trim();
  const sign = LEAD_SIGN.exec(t);
  const neg = !!sign && sign[1] !== "+";
  if (sign) t = t.slice(sign[0].length);
  let shift = 0;
  if (forms.percent) {
    const p = PERCENT.exec(t);
    if (p) { shift -= 2; t = t.slice(0, p.index); }
  }
  let plain: string | null = null;
  const frac = forms.fraction ? FRACTION.exec(t) : null;
  if (frac) {
    plain = fractionDecimal(frac[1], frac[2]);
  } else {
    plain = unsignedPlain(t);
    if (plain === null && forms.exponent && t.length <= 200) {
      const e = POWER_OF_TEN.exec(t);
      const n = e ? Number((e[2] ?? e[3]).replace(new RegExp(`^[${MINUS}]`), "-")) : NaN;
      if (e && Number.isInteger(n) && Math.abs(n) <= MAX_EXPONENT) {
        const m = unsignedPlain(e[1]);
        if (m !== null) { plain = shiftDecimal(m, n); }
      }
    }
  }
  if (plain === null) return null;
  if (shift) plain = shiftDecimal(plain, shift);
  if (neg) plain = `-${plain}`;
  const value = canonPlain(plain);
  if (value === "0") plain = plain.replace(/^-/, "");
  return { value, plain };
}

/** True when the text is a plain decimal (thousands groups and a spaced leading sign allowed; no unit, "%",
 *  fraction or exponent). */
export const isNumber = (s: string) => readNumber(s) !== null;

/** A typed value as an Answer, read the same way on the key side and the solver side:
 *  a plain decimal is a number; anything else ("1/2", "x = 3", "50%") is one label marked as typed (typedAt [0]). */
export function typedAnswer(value: string): Answer {
  const t = value.trim();
  // a number keeps its text as written, with a spaced leading sign closed up ("- 3" → "-3")
  return isNumber(t) ? { kind: "number", value: t.replace(LEAD_SIGN, (m, sign: string) => sign) } : { kind: "labels", values: [t], typedAt: [0] };
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
export type ResponseForm = {
  responseId: string; kind: Resp["kind"]; identifiers: string[]; targets: string[]; interaction: Resp;
  /** choice only: most identifiers allowed; 0 = no limit (as QTI maxChoices 0). */
  maxChoices: number;
};

export type AnswerForm = {
  form: "choice-one" | "choice-many" | "number" | "typed" | "labels" | "text";
  /** Sorted by responseId: the order of the values in a "labels" answer. With more than one response every
   *  value is written "<responseId>=<value>" so positions cannot be confused. */
  responses: ResponseForm[];
};

type FormInput = { itemType: string; interactions?: Interaction[]; options?: { label: string }[] };

function responseForm(r: Resp): ResponseForm {
  const base = { responseId: r.responseId, kind: r.kind, interaction: r, targets: [] as string[], maxChoices: 0 };
  switch (r.kind) {
    case "choice": return { ...base, identifiers: r.options.map((o) => o.label), maxChoices: Math.max(0, r.maxChoices || 0) };
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
    if (r.kind === "choice") {
      const many = r.maxChoices !== 1 || item.itemType === "MS";
      // An MS item whose interaction says maxChoices 1 is read as unlimited (the item type wins).
      if (many && r.maxChoices === 1) responses[0].maxChoices = 0;
      return { form: many ? "choice-many" : "choice-one", responses };
    }
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
      if (!mapped.every((m): m is string => m !== null)) return null;
      const out = letters(mapped);
      return f.maxChoices > 0 && out.length > f.maxChoices ? null : out;
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

/** A multi-response answer's values: each response's canonical values prefixed "<responseId>=", in sorted responseId order. */
export function prefixed(responseId: string, values: string[]): string[] {
  return values.map((v) => `${responseId}=${v}`);
}

/** A multi-response Answer from each response's canonical values (sorted responseId order): values prefixed
 *  "<responseId>=", and typedAt listing the positions of typed entries (textEntry). Used by the key and the solvers. */
export function multiAnswer(parts: { response: ResponseForm; values: string[] }[]): Extract<Answer, { kind: "labels" }> {
  const values: string[] = [];
  const typedAt: number[] = [];
  for (const { response, values: vs } of parts) {
    for (const v of prefixed(response.responseId, vs)) {
      if (response.kind === "textEntry") typedAt.push(values.length);
      values.push(v);
    }
  }
  return typedAt.length ? { kind: "labels", values, typedAt } : { kind: "labels", values };
}

export const formUnknown = (itemType: string) => `form unknown: itemType ${itemType} has no readable interactions`;

export type KeyReading = { answer: Answer | null; exact: boolean; detail?: string };

/** The key as an Answer plus whether it was read exactly in the item's answer form. `exact: false` means
 *  the Answer is a best effort for display only (form unknown, or a value not among the item's identifiers):
 *  comparing a solver's answer with it could raise a false key query. `detail` says why. */
export function readKey(item: Pick<ItemDoc, "itemType" | "key" | "keys" | "interactions"> & { options?: { label: string }[] }): KeyReading {
  const key = (item.key ?? "").trim();
  const keys = item.keys ?? {};
  const keyIds = Object.keys(keys).filter((id) => (keys[id] ?? []).some((v) => String(v).trim()));
  if (!key && !keyIds.length) return { answer: null, exact: true };
  const form = answerForm(item);
  if (form?.form === "text") return { answer: null, exact: true };
  const valuesFor = (id: string): string[] => (keys[id] ?? []).map((v) => String(v).trim()).filter(Boolean);
  const loose = (answer: Answer | null, detail: string): KeyReading => ({ answer, exact: false, detail });
  const own = form ? form.responses.map((r) => r.responseId) : [];
  // Nothing usable for the item's own responses: say where the keys are instead of "(empty)".
  const elsewhere = () => {
    const others = keyIds.filter((id) => !own.includes(id)).sort();
    return others.length ? `key not readable: keys are under ${others.join(", ")}; the item's responses are ${own.join(", ")}` : "key not readable: no key values";
  };
  const unreadable = (vals: string[]) => (vals.some((v) => v.trim()) ? `key not readable: ${vals.join(", ")}` : elsewhere());
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
  if (!form) return loose(legacy(), formUnknown(item.itemType));

  const one = form.responses.length === 1 ? form.responses[0] : null;
  // The values for a single response: its own keys; else, only when exactly ONE response is keyed, that one
  // (legacy rows keyed under another responseId than the interaction's); never one of several keyed responses.
  const singleValues = (rid: string): string[] =>
    keys[rid] && valuesFor(rid).length ? valuesFor(rid) : keyIds.length === 1 ? valuesFor(keyIds[0]) : [];

  if (form.form === "choice-one" || form.form === "choice-many") {
    const given = singleValues(one!.responseId);
    const vals = given.length ? given : key.split(",");
    const n = letters(vals).length;
    if (form.form === "choice-one" && n > 1) return loose({ kind: "choice", letters: letters(vals) }, `key has ${n} letters for a single-choice item`);
    const c = canonicalResponse(one!, vals);
    if (c) return { answer: { kind: "choice", letters: c }, exact: true };
    return loose(n ? { kind: "choice", letters: letters(vals) } : legacy(), unreadable(vals));
  }
  if (form.form === "number" || form.form === "typed") {
    // Several values are alternative accepted answers; the first is the key (see acceptedAnswers).
    const given = singleValues(one!.responseId);
    const text = given.length ? given[0] : key;
    return text ? { answer: typedAnswer(text), exact: true } : loose(legacy(), unreadable([]));
  }
  // labels
  if (one) {
    const given = keys[one.responseId] ? valuesFor(one.responseId) : [];
    if (!given.length) return loose(key ? { kind: "labels", values: [key] } : legacy(), unreadable(key ? [key] : []));
    const c = canonicalResponse(one, given);
    return c ? { answer: { kind: "labels", values: c }, exact: true } : loose({ kind: "labels", values: canon(one.interaction, given) }, unreadable(given));
  }
  // Several responses: each read with its own rule, values prefixed with the responseId.
  const parts: { response: ResponseForm; values: string[] }[] = [];
  let bad: string | null = null;
  for (const r of form.responses) {
    const given = valuesFor(r.responseId);
    const c = canonicalResponse(r, r.kind === "textEntry" ? given.slice(0, 1) : given);
    if (!c && !bad) bad = given.length ? unreadable(prefixed(r.responseId, given)) : elsewhere();
    parts.push({ response: r, values: c ?? canon(r.interaction, given) });
  }
  const answer = multiAnswer(parts);
  if (!answer.values.length) return loose(legacy(), unreadable([key]));
  return bad ? loose(answer, bad) : { answer, exact: true };
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
  const r = readNumber(s);
  if (r === null) return null;
  const neg = r.plain.startsWith("-");
  const [i, f = ""] = r.plain.replace(/^-/, "").split(".");
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

/** p/q of two unsigned integers as an exact plain decimal, or null when q is 0 or the expansion does not terminate. */
function fractionDecimal(p: string, q: string): string | null {
  const num = BigInt(p), den = BigInt(q);
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
  return `${int}${places ? "." + frac : ""}`;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a || B1;
}

export function sameAnswer(a: Answer, b: Answer, precision?: number): boolean {
  // A number and a single label ("0.5" and "1/2", "-3" and "- 3") compare as typed values. A number only ever
  // comes from a typed entry, so the comparison is a typed one even when the label does not carry typedAt
  // (write.ts compares fraction literals this way).
  if (a.kind === "number" && b.kind === "labels") return b.values.length === 1 && sameTyped(a.value, b.values[0], precision);
  if (a.kind === "labels" && b.kind === "number") return a.values.length === 1 && sameTyped(b.value, a.values[0], precision);
  if (a.kind !== b.kind) return false;
  if (a.kind === "choice" && b.kind === "choice") {
    const x = letters(a.letters), y = letters(b.letters);
    return x.length === y.length && x.every((l, i) => l === y[i]);
  }
  if (a.kind === "number" && b.kind === "number") return sameNumber(a.value, b.value, precision);
  if (a.kind === "labels" && b.kind === "labels") {
    if (a.values.length !== b.values.length) return false;
    // The typed rule only where BOTH sides mark the position as a typed entry; identifiers stay exact.
    const typed = (i: number) => !!a.typedAt?.includes(i) && !!b.typedAt?.includes(i);
    return a.values.every((v, i) => (typed(i) ? sameTypedLabel(v, b.values[i], precision) : normLabel(v) === normLabel(b.values[i])));
  }
  return false; // text is judged elsewhere
}

/** Typed text for comparison: lower case, whitespace collapsed, Unicode minus (and an en dash before a digit) as "-",
 *  no spaces around = + - × / % ( ). "x = 3" equals "x=3", "x − 3" equals "x-3", "- 3" equals "-3",
 *  "50 %" equals "50%", but "a b" stays different from "ab". */
const normTyped = (s: string) =>
  s.trim().toLowerCase().replace(/\u2212/g, "-").replace(/\u2013(?=\s*\d)/g, "-").replace(/\s+/g, " ").replace(/ ?([=+\-×/%()]) ?/g, "$1");

/** Two typed values: two numbers by digits only; a number and a fraction exactly; otherwise (never two numbers)
 *  the normalised typed text of both sides. */
function sameTyped(x: string, y: string, precision?: number): boolean {
  const a = typedAnswer(x), b = typedAnswer(y);
  if (a.kind === "number" && b.kind === "number") return sameNumber(a.value, b.value, precision);
  if (a.kind === "number" && b.kind === "labels" && sameFraction(a.value, b.values[0], precision)) return true;
  if (a.kind === "labels" && b.kind === "number" && sameFraction(b.value, a.values[0], precision)) return true;
  const tx = normTyped(x), ty = normTyped(y);
  return !!tx && tx === ty;
}

/** One typed position: equal as labels, or as typed values — whole (single response), or as
 *  "<responseId>=<value>" with the same prefix (several responses). */
function sameTypedLabel(x: string, y: string, precision?: number): boolean {
  if (normLabel(x) === normLabel(y)) return true;
  if (sameTyped(x, y, precision)) return true;
  const px = x.indexOf("="), py = y.indexOf("=");
  if (px <= 0 || py <= 0) return false;
  const prefix = (s: string, p: number) => s.slice(0, p).trim();
  return prefix(x, px) === prefix(y, py) && sameTyped(x.slice(px + 1), y.slice(py + 1), precision);
}

function sameFraction(number: string, label: string, precision?: number): boolean {
  if (!label.includes("/")) return false;
  const d = readNumber(label, { fraction: true });
  return d !== null && sameNumber(number, d.plain, precision);
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
