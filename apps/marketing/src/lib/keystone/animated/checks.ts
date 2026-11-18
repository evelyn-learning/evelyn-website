// Animated solutions: the checks run before a built page is shown to anyone. Pure functions, no I/O.
//   spokenNumbersCheck  every number shown or spoken comes from the approved written solution or the question
//   packagingCheck      the built page obeys the packaging rules (self-contained, es- classes, no making-of words)
//   earCheck            the voice text is written for the ear (playbook Part 5)
import { BANNED_WORDS } from "../pipeline/checks";
import type { Cue, Spec } from "./spec";

export interface Finding {
  where: string;
  detail: string;
}

// --- numbers -----------------------------------------------------------------------------------------

const SUPERS: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "" };
const ENTITIES: Record<string, string> = { nbsp: " ", thinsp: " ", ensp: " ", emsp: " ", times: "×", minus: "-", middot: "·", deg: "°", sup2: "^2", sup3: "^3", amp: "&", lt: "<", gt: ">" };

/** Text ready for number reading: HTML tags, entities and LaTeX spacing turned into plain characters; subscripts
 * (labels, not values) dropped; superscripts written as ^n. */
export function plainForNumbers(text: string): string {
  return text
    .replace(/<sub\b[^>]*>[\s\S]*?<\/sub>/gi, " ")
    .replace(/<sup\b[^>]*>([\s\S]*?)<\/sup>/gi, "^{$1}")
    .replace(/<(?:br|\/p|\/div|\/li|\/h\d|\/span|\/text|\/tspan)\b[^>]*>/gi, " | ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z0-9]+);/gi, (_, n: string) => ENTITIES[n.toLowerCase()] ?? " ")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => "^" + [...m].map((c) => SUPERS[c]).join(""))
    .replace(/_\{[^{}]*\}|_[A-Za-z0-9]/g, " ") // LaTeX subscripts
    .replace(/\\(?:times|cdot)\b/g, "×")
    .replace(/\\[,;:! ]|~/g, " ")
    .replace(/\{,\}/g, ",")
    .replace(/\\(?:text|mathrm|mathit|mathbf)\s*\{([^{}]*)\}/g, " $1 ")
    .replace(/\^\s*\{\s*([^{}]*?)\s*\}/g, "^$1")
    .replace(/[−–]/g, "-")
    .replace(/[     ]/g, " ");
}

interface Num {
  /** As written. */
  raw: string;
  /** Canonical value key. */
  key: string;
  /** Other keys that would also justify it: the mantissa and exponent of 3.0 × 10^8, the parts of "400 500 900". */
  parts: string[];
}

const canon = (digits: string, exp?: string): string => {
  const n = Number(exp === undefined ? digits : `${digits}e${exp}`);
  return Number.isFinite(n) ? String(Math.abs(n)) : digits;
};

const NUMBER = /(?<![A-Za-z\d.,])(\d{1,3}(?:,\d{3})+(?!\d)|\d{1,3}(?: \d{3})+(?!\d)|\d+)(\.\d+)?(?:\s*[×x]\s*10\s*\^\s*(-?\d+)|[eE](-?\d+)(?![A-Za-z\d]))?/g;

/** The numbers in a text, normalised: thin spaces and thousands separators joined, ×10^n folded in, sign dropped. */
export function numbersIn(text: string): Num[] {
  const out: Num[] = [];
  for (const m of plainForNumbers(text).matchAll(NUMBER)) {
    const whole = m[1].replace(/[ ,]/g, "") + (m[2] ?? "");
    const exp = m[3] ?? m[4];
    const parts: string[] = [];
    if (exp !== undefined) parts.push(canon(whole), canon(exp));
    else if (m[1].includes(" ")) parts.push(...m[1].split(" ").map((p, i, all) => canon(i === all.length - 1 ? p + (m[2] ?? "") : p)));
    out.push({ raw: m[0].trim(), key: canon(whole, exp), parts });
  }
  return out;
}

const cueTexts = (cues: Cue[] | undefined, where: string): [string, string][] =>
  (cues ?? []).filter((c) => c.do === "ink" && c.html).map((c) => [`${where} ink`, c.html as string]);

/** Every text of a spec that a student sees or hears, with where it is. */
export function specTexts(spec: Spec): [string, string][] {
  const out: [string, string][] = [["answer", spec.answer.text]];
  for (const [k, v] of [["board.readoutFresh", spec.board.readoutFresh], ["board.readoutPractice", spec.board.readoutPractice], ["board.readoutEnd", spec.board.readoutEnd]] as const) if (v) out.push([k, v]);
  out.push(...cueTexts(spec.board.fresh, "board.fresh"));
  spec.steps.forEach((st, k) => {
    out.push([`step ${k + 1} title`, st.title]);
    st.lines.forEach((ln, i) => {
      out.push([`step ${k + 1} line ${i + 1} say`, ln.say]);
      if (ln.speak) out.push([`step ${k + 1} line ${i + 1} speak`, ln.speak]);
      out.push(...cueTexts(ln.cues, `step ${k + 1} line ${i + 1}`));
    });
    out.push([`step ${k + 1} body`, st.body]);
  });
  spec.boxes.forEach((b) => {
    out.push([`box ${b.kind} title`, b.title], [`box ${b.kind}`, b.html]);
    if (b.choices) out.push([`box ${b.kind} choices`, b.choices.join(" | ")]);
    if (b.why) out.push([`box ${b.kind} why`, b.why]);
  });
  const p = spec.practice;
  out.push(...cueTexts(p.setup, "practice.setup"), ...cueTexts(p.done, "practice.done"));
  if (p.doneText) out.push(["practice.doneText", p.doneText]);
  if (p.missText) out.push(["practice.missText", p.missText]);
  if (p.kind === "order") {
    if (p.stepText) out.push(["practice.stepText", p.stepText.replace("{n}", "")]);
    p.chips.forEach((c, i) => out.push(...cueTexts(c.placed, `practice chip ${i + 1}`)));
  }
  return out;
}

/**
 * Every number in the answer, the captions (say), the voice text (speak), the ink, the step bodies and the boxes
 * must occur in the approved written solution or in the question. Returns the strays with where they occur.
 * `spec.allowNumbers` lets a number through, with its reason (a step count, a worked intermediate, a spoken rounding).
 */
export function spokenNumbersCheck(spec: Spec, writtenSolutionText: string, questionText: string): Finding[] {
  const known = new Set<string>();
  for (const n of numbersIn(`${writtenSolutionText}\n${questionText}`)) {
    known.add(n.key);
    for (const p of n.parts) known.add(p);
  }
  for (const a of spec.allowNumbers ?? []) for (const n of numbersIn(String(a.n))) known.add(n.key);
  const out: Finding[] = [];
  for (const [where, text] of specTexts(spec)) {
    const seen = new Set<string>();
    for (const n of numbersIn(text)) {
      if (known.has(n.key) || (n.parts.length > 0 && n.parts.every((p) => known.has(p)))) continue;
      if (seen.has(n.key)) continue;
      seen.add(n.key);
      out.push({ where, detail: n.raw });
    }
  }
  return out;
}

// --- packaging ----------------------------------------------------------------------------------------

const FOOTER = "© 2026 Evelyn Learning";

/** The built page as its source reads once the embedded JSON's escapes are undone (so markup inside the spec is checked too). */
const unescaped = (html: string) => html.replace(/\\u003c/gi, "<").replace(/\\u003e/gi, ">").replace(/\\u0026/gi, "&").replace(/\\"/g, '"').replace(/\\n/g, "\n");

/** What a reader could see: scripts that are code and styles removed, tags dropped. */
function visibleText(html: string): string {
  return html
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b(?![^>]*application\/json)[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");
}

/** Packaging rules for a built solution.html. Returns the problems; empty = passes. */
export function packagingCheck(html: string): string[] {
  const errs: string[] = [];
  const src = unescaped(html);
  const once = (re: RegExp, msg: string) => {
    const m = re.exec(src);
    if (m) errs.push(`${msg}: ${JSON.stringify(m[0].slice(0, 80))}`);
  };
  once(/https?:\/\/[^\s"'<>)]*/i, "an outside address (http/https) is in the page");
  once(/(?:src|href|action|poster|data)\s*=\s*["']\s*\/\/[^"']*/i, "a protocol-relative address is in the page");
  once(/url\(\s*["']?\s*(?:\/\/|https?:)[^)]*/i, "a CSS url() points outside the page");
  once(/<details\b|<summary\b/i, "<details>/<summary> is not allowed (use the es-fold block)");
  once(/<link\b[^>]*/i, "<link> is not allowed");
  once(/@import\b[^;]*/i, "@import is not allowed");
  once(/@font-face\b/i, "@font-face is not allowed");
  once(/<(?:iframe|object|embed|form)\b[^>]*/i, "an embedded frame, object or form is not allowed");
  once(/<script\b[^>]*\ssrc\s*=[^>]*/i, "a script loaded from a file is not allowed (everything is inline)");
  once(/\b(?:localStorage|sessionStorage|indexedDB|document\.cookie|XMLHttpRequest|sendBeacon|WebSocket|EventSource)\b|\bfetch\s*\(/, "storage, cookies or network calls are not allowed");
  for (const m of src.matchAll(/<(?:img|audio|video|source|image|use)\b[^>]*?\s(?:src|href|xlink:href)\s*=\s*["']([^"']*)["']/gi)) {
    if (!/^(?:data:|#|audio\/[\w.-]+$)/.test(m[1])) errs.push(`a file reference other than audio/… or inline data is not allowed: ${JSON.stringify(m[1].slice(0, 80))}`);
  }
  const bad = new Set<string>();
  for (const m of src.matchAll(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    for (const c of (m[1] ?? m[2] ?? "").split(/\s+/).filter(Boolean)) if (c !== "ai-solution" && !/^es-[a-z0-9-]+$/.test(c)) bad.add(c);
  }
  if (bad.size) errs.push(`classes must start with "es-" (or be "ai-solution"): ${[...bad].sort().join(", ")}`);
  if (!/class\s*=\s*["'][^"']*\bai-solution\b/.test(src)) errs.push(`the wrapper .ai-solution is missing`);
  if (!src.includes(FOOTER)) errs.push(`the footer "${FOOTER}" is missing`);
  const text = visibleText(src);
  const words = [...new Set(BANNED_WORDS.filter((b) => (text.match(b.re) ?? []).length > 0).map((b) => b.name))];
  if (words.length) errs.push(`words about how it was made are not allowed: ${words.join(", ")}`);
  return errs;
}

// --- written for the ear --------------------------------------------------------------------------------

const SYMBOLS = /[=+×÷/°²³√^_%·→≈<>−π∆Δθλμ]/g;
const UNIT = /\d\s*(?:kg|mg|g|km|cm|mm|nm|m|ms|s|min|h|N|J|kJ|W|kW|V|A|Hz|mol|mL|L|kPa|Pa|K|eV|MeV|C|T|M)(?![A-Za-z\d])/g;
const TRIG = /(?<![A-Za-z])(?:sin|cos|tan|sec|csc|cot)(?![A-Za-z])/g;
const THREE_NUMBERS = /\d[\d.]*(?:(?:\s*,\s*|\s+)(?:and\s+|then\s+)?\d[\d.]*){2,}/g;

/** How many sentences a line holds (a line with no closing mark is one sentence). */
export function sentenceCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/(?<=[.!?]["”’)]?)\s+(?=["“‘(]?[A-Z0-9])/).filter((s) => s.trim()).length;
}

/**
 * The voice text (speak, or say when a line has no speak) must be written for the ear: no symbols, no bare unit
 * abbreviations, no "sin/cos/tan", no three numbers in a row, and as many sentences as the caption it goes with.
 */
export function earCheck(spec: Spec): Finding[] {
  const out: Finding[] = [];
  spec.steps.forEach((st, k) =>
    st.lines.forEach((ln, i) => {
      const where = `step ${k + 1} line ${i + 1}`;
      const voice = ln.speak ?? ln.say;
      const from = ln.speak ? "speak" : "say (no speak given)";
      const symbols = [...new Set(voice.match(SYMBOLS) ?? [])];
      if (symbols.length) out.push({ where, detail: `${from} has symbols the voice cannot read: ${symbols.join(" ")}` });
      const units = [...new Set((voice.match(UNIT) ?? []).map((u) => u.trim()))];
      if (units.length) out.push({ where, detail: `${from} has a unit abbreviation; spell it out ("meters per second"): ${units.join(", ")}` });
      const trig = [...new Set(voice.match(TRIG) ?? [])];
      if (trig.length) out.push({ where, detail: `${from} abbreviates a trig function; write "sine", "cosine", "tangent": ${trig.join(", ")}` });
      const runs = voice.match(THREE_NUMBERS) ?? [];
      if (runs.length) out.push({ where, detail: `${from} reads three or more numbers in a row: ${runs.map((r) => JSON.stringify(r)).join(", ")}` });
      if (ln.speak && sentenceCount(ln.say) !== sentenceCount(ln.speak))
        out.push({ where, detail: `say has ${sentenceCount(ln.say)} sentence(s), speak has ${sentenceCount(ln.speak)}; they must match` });
    }),
  );
  return out;
}
