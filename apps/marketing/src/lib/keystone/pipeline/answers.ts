// Pure, deterministic judge for the solutions pipeline: normalise answers, compare them,
// turn the client's key into an Answer, and apply the outcome table. No I/O, no models.
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
  | { outcome: "hold"; why: "no_agreement" | "written_response" };

const NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)$/;
const LETTERS = /^[A-Z](,[A-Z])*$/i;

function isNumber(s: string): boolean {
  return NUMBER.test(cleanNumber(s));
}
function cleanNumber(s: string): string {
  return s.trim().replace(/[,    ]/g, "");
}

function letters(list: string[]): string[] {
  return [...new Set(list.map((l) => l.trim().toUpperCase()).filter(Boolean))].sort();
}

const WRITTEN = new Set(["WR", "SWR"]);

export function parseKey(item: Pick<ItemDoc, "itemType" | "key" | "keys" | "interactions">): Answer | null {
  const key = (item.key ?? "").trim();
  const keys = item.keys ?? {};
  const keyIds = Object.keys(keys).filter((id) => (keys[id] ?? []).some((v) => String(v).trim()));
  if (!key && !keyIds.length) return null;

  const responses = (item.interactions ?? []).filter((i): i is Exclude<Interaction, { kind: "unsupported" }> => i.kind !== "unsupported");
  if (WRITTEN.has(item.itemType)) return null;
  if (responses.length && responses.every((i) => i.kind === "extendedText")) return null;

  const valuesFor = (id: string): string[] => (keys[id] ?? []).map((v) => String(v).trim()).filter(Boolean);
  const legacy = (): Answer => {
    if (item.itemType === "NR") return { kind: "number", value: key };
    if (LETTERS.test(key)) return { kind: "choice", letters: letters(key.split(",")) };
    return { kind: "labels", values: [key] };
  };

  if (responses.length === 1) {
    const one = responses[0];
    const vals = keys[one.responseId] ? valuesFor(one.responseId) : key ? key.split(",").map((v) => v.trim()).filter(Boolean) : [];
    if (!vals.length) return legacy();
    if (one.kind === "choice") return { kind: "choice", letters: letters(vals) };
    if (one.kind === "textEntry") {
      const text = keys[one.responseId] ? vals.join(",") : key;
      return isNumber(text) ? { kind: "number", value: text.trim() } : { kind: "labels", values: [text.trim()] };
    }
    return { kind: "labels", values: canon(one, vals) };
  }
  if (responses.length > 1) {
    const out: string[] = [];
    for (const r of [...responses].sort((a, b) => a.responseId.localeCompare(b.responseId))) out.push(...canon(r, valuesFor(r.responseId)));
    if (!out.length) return legacy();
    return { kind: "labels", values: out };
  }
  // No interaction info: key-only (legacy) item, or keys without interactions.
  if (keyIds.length === 1 && !key) {
    const vals = valuesFor(keyIds[0]);
    if (item.itemType === "NR") return { kind: "number", value: vals.join(",") };
    return LETTERS.test(vals.join(",")) ? { kind: "choice", letters: letters(vals) } : { kind: "labels", values: vals };
  }
  if (keyIds.length > 1) return { kind: "labels", values: keyIds.sort().flatMap((id) => valuesFor(id)) };
  return legacy();
}

function canon(r: Interaction, vals: string[]): string[] {
  if (r.kind === "match" || r.kind === "gapMatch") return vals.map((v) => v.replace(/\s+/g, "→")).sort();
  return vals;
}

// --- number comparison on digit strings (never binary floating point) ---

type Dec = { neg: boolean; int: string; frac: string };

function parseDec(s: string): Dec | null {
  const t = cleanNumber(s);
  if (!NUMBER.test(t)) return null;
  const neg = t.startsWith("-");
  const body = t.replace(/^[+-]/, "");
  const [i, f = ""] = body.split(".");
  return { neg, int: i, frac: f };
}

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
  // Anything we cannot parse exactly (e.g. 2.50e3) is equal only to the identical text.
  if (!x || !y) return a.trim().toLowerCase() === b.trim().toLowerCase();
  if (precision === undefined) return canonDec(x) === canonDec(y);
  return canonDec(roundTo(x, precision)) === canonDec(roundTo(y, precision));
}

const normLabel = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

export function sameAnswer(a: Answer, b: Answer, precision?: number): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "choice" && b.kind === "choice") {
    const x = letters(a.letters), y = letters(b.letters);
    return x.length === y.length && x.every((l, i) => l === y[i]);
  }
  if (a.kind === "number" && b.kind === "number") return sameNumber(a.value, b.value, precision);
  if (a.kind === "labels" && b.kind === "labels") return a.values.length === b.values.length && a.values.every((v, i) => normLabel(v) === normLabel(b.values[i]));
  return false; // text is judged elsewhere
}

export function decide(s1: Answer, s2: Answer, key: Answer | null, s3?: Answer): Decision {
  if ([s1, s2, key, s3].some((x) => x?.kind === "text")) return { outcome: "hold", why: "written_response" };
  const hold: Decision = { outcome: "hold", why: "no_agreement" };
  if (sameAnswer(s1, s2)) {
    if (key) return sameAnswer(s1, key) ? { outcome: "pass", answer: s1, confirm: false } : { outcome: "key_query", answer: s1 };
    if (!s3) return { outcome: "need_third" };
    return sameAnswer(s1, s3) ? { outcome: "pass", answer: s1, confirm: true } : hold;
  }
  if (!s3) return { outcome: "need_third" };
  if (!key) return hold;
  const winner = sameAnswer(s1, s3) ? s1 : sameAnswer(s2, s3) ? s2 : null;
  return winner && sameAnswer(winner, key) ? { outcome: "pass", answer: winner, confirm: false, flag: "solvers_split" } : hold;
}
