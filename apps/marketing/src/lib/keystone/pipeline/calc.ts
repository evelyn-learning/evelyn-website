// Calculation check for the solutions pipeline. A model returns the calculation behind a numeric answer as
// expressions; calc_check.py recomputes them (never executing them as code) and this file compares the results
// with the stated answer, and checks the answer is stated consistently across the solution.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { ItemDoc } from "../db";
import { readNumber, sameAnswer } from "./answers";
import type { Answer } from "./answers";
import { closingCheck, type Draft } from "./write";

export type CalcFinding = {
  code: "calc_mismatch" | "early_rounding" | "answer_inconsistent" | "letter_mismatch" | "unit_missing" | "calc_unparseable";
  detail: string;
};

type PyResult = { ok: boolean; value: string; raw?: string; error: string };

// This module runs under tsx (scripts and tests), never inside the Next bundle: import.meta.url is the real file URL there.
const SCRIPT = fileURLToPath(new URL("./calc_check.py", import.meta.url));
// calc_check.py gives up on its own after 8 s, so its answer (with per-entry errors) always arrives before this kill.
const TIMEOUT_MS = 12_000;

const num = (value: string): Answer => ({ kind: "number", value });

// --- python -----------------------------------------------------------------------------------

function runPython(entries: { expr: string; expect: string; rounding: string }[], python: string): Promise<PyResult[]> {
  return new Promise((resolve, reject) => {
    let out = "", done = false;
    const finish = (fn: () => void) => { if (!done) { done = true; clearTimeout(timer); fn(); } };
    let child;
    try {
      child = spawn(python, ["-I", SCRIPT], { stdio: ["pipe", "pipe", "ignore"] });
    } catch (e) {
      reject(new Error(`could not start ${python}`));
      return;
    }
    const timer = setTimeout(() => { child.kill("SIGKILL"); finish(() => reject(new Error("timed out after 12 s"))); }, TIMEOUT_MS);
    child.on("error", (e) => finish(() => reject(new Error(`could not start ${python}: ${(e as NodeJS.ErrnoException).code ?? e.message}`))));
    child.stdout.on("data", (d) => { out += d; if (out.length > 1_000_000) child.kill("SIGKILL"); });
    child.stdin.on("error", () => { /* surfaced through close/error */ });
    child.on("close", (code) => finish(() => {
      if (code !== 0) return reject(new Error(`python exited with code ${code}`));
      try {
        const parsed = JSON.parse(out);
        if (!Array.isArray(parsed) || parsed.length !== entries.length) throw new Error("wrong shape");
        resolve(parsed as PyResult[]);
      } catch {
        reject(new Error("python printed invalid output"));
      }
    }));
    child.stdin.end(JSON.stringify(entries));
  });
}

// --- number extraction ----------------------------------------------------------------------------

const THIN = "\u2009\u202f\u00a0";
const NUMBER_TOKEN = new RegExp(`(?<![\\w.])[+\\-\\u2212]?(?:\\d+\\/\\d+(?![\\d.])|\\d{1,3}(?:[,${THIN}]\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?|\\.\\d+)`, "g");

/** Exact plain decimal for "2.50e3", "2.50 × 10^3", "2.50 \\times 10^{3}", "2.50*10^3", "2.50 x 10^-3" (any minus sign),
 *  read by answers.ts's readNumber (exponent form); a number with no exponent comes back with its digits as written.
 *  Anything else is null. String arithmetic only, no floats. */
export function toPlainDecimal(text: string): string | null {
  return readNumber(text, { exponent: true })?.plain ?? null;
}

const SCI_IN_TEXT = /(?<![\w.])([+\-\u2212]?(?:\d+\.?\d*|\.\d+))\s*(?:\\times|\\cdot|×|·|x|\*)\s*10\s*\^\s*\{?\s*([+\-\u2212]?\d+)\s*\}?/g;
const E_IN_TEXT = /(?<![\w.])([+\-\u2212]?\d+\.?\d*)[eE]([+\-\u2212]?\d+)(?![\w.])/g;

/** Strip the LaTeX wrapping so the bare numbers are left. A × 10^n group becomes one plain number, a \frac of two integers one "a/b". */
const UNIT_BASE = "m\\/s|km\\/h|mol\\/L|kg|g|m|cm|mm|km|s|min|h|kJ|J|N|Pa|kPa|V|A|W|Hz|K|L|mL";
const UNIT_EXP = new RegExp(`((?:\\\\(?:text|mathrm)\\{[^{}]*\\})|(?<![A-Za-z\\\\])(?:${UNIT_BASE}))\\s*\\^\\s*\\{?\\s*[+\\-\\u2212]?\\d+\\s*\\}?`, "g");

function plainText(md: string, keepText = false): string {
  let t = md.replace(/(\d)\{,\}(?=\d{3}(?!\d))/g, "$1,").replace(UNIT_EXP, "$1"); // m/s^2, \text{m}^{2}: the 2 is a unit exponent, not a number (a lone variable such as x^2 is not a unit)
  t = t.replace(/\^\s*\{?\s*(?:\\circ|°)\s*\}?|\\degree|\\textdegree/g, "°");
  t = t.replace(/\\(?:text|mathrm|textbf|mathbf)\{([^{}]*)\}/g, keepText ? " $1 " : " ");
  t = t.replace(/\\[,;:!]|\\ |~/g, "").replace(/\\circ/g, "°");
  t = t.replace(/_\{[^{}]*\}|_[A-Za-z0-9]/g, ""); // subscripts: v_{1}, x_1
  t = t.replace(/\\d?frac\s*\{\s*(\d+)\s*\}\s*\{\s*(\d+)\s*\}/g, " $1/$2 ");
  const sci = (_: string, a: string, n: string) => ` ${toPlainDecimal(`${a}e${n}`) ?? `${a}e${n}`} `;
  t = t.replace(SCI_IN_TEXT, sci).replace(E_IN_TEXT, sci);
  t = t.replace(/(?<![\w.^])10\s*\^\s*\{?\s*([+\-\u2212]?\d+)\s*\}?/g, (_: string, n: string) => ` ${toPlainDecimal(`1e${n}`) ?? "10"} `);
  t = t.replace(/\\(?:left|right|times|approx|cdot)\b/g, " ");
  t = t.replace(/\\[a-zA-Z]+/g, " ").replace(/\$+/g, " ").replace(/[{}]/g, " ").replace(/\*\*|__/g, "");
  return t;
}

/** Every number written in the text (LaTeX and units removed). Grouped thousands ("1,000", "1 000" with a thin space) are joined. */
export function statedNumbers(md: string): string[] {
  const out: string[] = [];
  for (const m of plainText(md).matchAll(NUMBER_TOKEN)) {
    // a fraction token stays "p/q"; every other token is read by readNumber (sign, thousands groups)
    out.push(m[0].includes("/") ? m[0].replace(/^\+/, "").replace(/^\u2212/, "-") : readNumber(m[0])?.plain ?? m[0]);
  }
  return out;
}

function sentences(md: string): string[] {
  return plainText(md, true).split(/\n\s*\n|(?<=[.!?])\s+(?=[A-Z$\\(])/).map((s) => s.trim()).filter(Boolean);
}

// --- consistency checks ---------------------------------------------------------------------------

function answerInconsistent(draft: Draft, answer: Extract<Answer, { kind: "number" }>): CalcFinding[] {
  const out: CalcFinding[] = [];
  const short = draft.sections.find((s) => s.kind === "short")?.md ?? "";
  const diploma = draft.sections.find((s) => s.kind === "diploma")?.md ?? "";
  const lastSentence = sentences(diploma).slice(-1)[0] ?? "";
  const nums = statedNumbers(short);
  if (!nums.some((n) => sameAnswer(num(n), answer))) {
    out.push({ code: "answer_inconsistent", detail: `the short section states ${nums.length ? nums.join(", ") : "no number"} but the agreed answer is ${answer.value}` });
  }
  const dn = statedNumbers(lastSentence);
  if (!dn.length) {
    out.push({ code: "answer_inconsistent", detail: "the Diploma answer's last sentence does not state the answer" });
  } else if (!dn.some((n) => sameAnswer(num(n), answer))) {
    out.push({ code: "answer_inconsistent", detail: `the last sentence of the diploma section states ${dn.join(", ")} but the agreed answer is ${answer.value}` });
  }
  return out;
}

/** The closing rule is write.ts's closingCheck (one definition for the author, this check and the render check). */
function letterMismatch(draft: Draft, answer: Extract<Answer, { kind: "choice" }>, item: ItemDoc): CalcFinding[] {
  const r = closingCheck(draft.sections.find((s) => s.kind === "short")?.md ?? "", item, answer, "short");
  return r.ok ? [] : [{ code: "letter_mismatch", detail: `the Short answer ${r.why}` }];
}

const UNITS = "m\\/s\\^?2?|m\\/s|km\\/h|kg|g|mol\\/L|mol|J|kJ|N|Pa|kPa|V|A|Ω|W|Hz|m|cm|mm|km|s|min|h|°C|K|L|mL";
const IN = String.raw`\s+(${UNITS})(?![A-Za-z0-9])`;
/** Case-insensitive word: "give" -> [gG][iI][vV][eE]. The unit group stays case-sensitive ("m" is not "M"). */
const ci = (w: string) => w.replace(/[a-z]/gi, (c) => `[${c.toLowerCase()}${c.toUpperCase()}]`);
// A gap may contain a decimal point only between two digits ("to the nearest 0.1 s").
const GAP = String.raw`(?:[^.?!]|(?<=\d)\.(?=\d))*?`;
// The stem must ask for the answer in a unit: "answer in", "give … in", "express … in", "in units of", "measured in", "to the nearest …".
const STEM_UNIT = new RegExp(
  `(?:\\b${ci("answer")}\\s+${ci("in")}|\\b${ci("give")}\\b${GAP}\\b${ci("in")}|\\b${ci("express")}\\b${GAP}\\b${ci("in")}|\\b${ci("in")}\\s+${ci("units")}\\s+${ci("of")}|\\b${ci("measured")}\\s+${ci("in")})` + IN + "|" +
  `\\b${ci("to")}\\s+${ci("the")}\\s+${ci("nearest")}\\b${GAP}` + IN,
);
const AFTER_NUMBER = new RegExp(
  `^\\s*(?:\\^\\s*\\d+\\s*)?(?:(?:${UNITS.replace("°C", "°\\s*C")})(?![A-Za-z0-9])|(?:metres?|meters?|seconds?|minutes?|hours?|grams?|kilograms?|moles?|joules?|newtons?|pascals?|volts?|amps?|amperes?|watts?|litres?|liters?|degrees?|kelvin)\\b)`,
);

function unitMissing(draft: Draft, answer: Extract<Answer, { kind: "number" }>, item: ItemDoc): CalcFinding[] {
  const stem = (item.questionHtml ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&deg;/g, "°");
  const sm = STEM_UNIT.exec(stem);
  const unit = sm?.[1] ?? sm?.[2];
  if (!unit) return [];
  const short = draft.sections.find((s) => s.kind === "short")?.md ?? "";
  const sentence = sentences(short).find((s) => statedNumbers(s).some((n) => sameAnswer(num(n), answer)));
  if (!sentence) return []; // cannot find the sentence: no finding
  const text = sentence.replace(new RegExp(`[${THIN}]`, "g"), " ");
  for (const m of text.matchAll(NUMBER_TOKEN)) {
    if (!sameAnswer(num(m[0]), answer)) continue; // sameAnswer reads the token with readNumber
    if (AFTER_NUMBER.test(text.slice((m.index ?? 0) + m[0].length))) return [];
  }
  return [{ code: "unit_missing", detail: `the question asks for the answer in ${unit} but the short section gives ${answer.value} without a unit` }];
}

// --- early rounding -------------------------------------------------------------------------------------

const CONSTANTS = ["9.81", "9.8", "3.14", "6.02", "8.31", "1.00", "100", "1000"];
const LITERAL = /(?<![\w.])(?:\d+\.\d*|\.\d+|\d+)/g;
const decimalPlaces = (n: string) => (n.split(".")[1] ?? "").length;
const sigDigits = (n: string) => n.replace(/\./, "").replace(/^[-+]?0+/, "").length;

/** True when the literal at `at` is not a plain quantity: an exponent, or an argument of Rational / binomial / factorial / a log base. */
function notAQuantity(expr: string, at: number, len: number): boolean {
  if (/(?:\^|\*\*)\s*[+-]?\s*\(?\s*$/.test(expr.slice(0, at))) return true;
  let depth = 0;
  for (let k = at - 1; k >= 0; k--) {
    const c = expr[k];
    if (c === ")") depth++;
    else if (c === "(") {
      if (depth === 0) {
        const fn = /([A-Za-z_]\w*)\s*$/.exec(expr.slice(0, k))?.[1];
        if (fn === "Rational" || fn === "binomial" || fn === "factorial") return true;
        if (fn === "log" && /,/.test(expr.slice(k, at))) return true;
        return false;
      }
      depth--;
    }
  }
  void len;
  return false;
}

function earlyRounding(entries: { expr: string; expect: string; rounding: string }[], results: PyResult[], item: ItemDoc): CalcFinding[] {
  const out: CalcFinding[] = [];
  const given = statedNumbers((item.questionHtml ?? "").replace(/<[^>]*>/g, " "));
  for (let j = 0; j < entries.length; j++) {
    const rj = results[j];
    const expect = entries[j].expect.trim();
    if (!entries[j].rounding.trim() || !rj?.ok || rj.raw === undefined || sameAnswer(num(rj.raw), num(expect))) continue;
    // One-digit integers (and 1dp values with one significant digit) are skipped on purpose: a rounded "2" matches
    // exponents, counts and constants far more often than it marks early rounding.
    const plain = readNumber(expect)?.plain;
    if (plain === undefined || (decimalPlaces(plain) < 2 && sigDigits(plain) < 2)) continue;
    if (CONSTANTS.some((c) => sameAnswer(num(c), num(expect)))) continue; // common given constants

    if (given.some((g) => sameAnswer(num(g), num(expect)))) continue; // a quantity the question gives
    for (let i = j + 1; i < entries.length; i++) {
      const expr = entries[i].expr;
      const hit = [...expr.matchAll(LITERAL)].some(
        (m) => decimalPlaces(m[0]) === decimalPlaces(expect) && sameAnswer(num(m[0]), num(expect)) && !notAQuantity(expr, m.index ?? 0, m[0].length),
      );
      if (hit) {
        out.push({ code: "early_rounding", detail: `calculation ${i + 1} reuses ${expect}, the rounded result of calculation ${j + 1}, whose unrounded value is ${rj.raw}` });
      }
    }
  }
  return out;
}

// --- the check ------------------------------------------------------------------------------------

export async function calcCheck(draft: Draft, answer: Answer, item: ItemDoc, opts?: { python?: string }): Promise<CalcFinding[]> {
  const findings: CalcFinding[] = [];
  const calc = draft.calc ?? [];

  if (calc.length) {
    const entries = calc.map((c) => ({ expr: String(c.expr ?? ""), expect: String(c.expect ?? ""), rounding: c.rounding ?? "" }));
    let results: PyResult[] | null = null;
    try {
      results = await runPython(entries, opts?.python ?? "python3");
    } catch (e) {
      findings.push({ code: "calc_unparseable", detail: `calculation check could not run: ${(e as Error).message}` });
    }
    if (results) {
      results.forEach((r, i) => {
        const e = entries[i];
        if (!r || r.ok !== true) {
          findings.push({ code: "calc_unparseable", detail: `calculation ${i + 1} "${e.expr.slice(0, 80)}": ${r?.error || "could not be computed"}` });
          return;
        }
        const dp = /^(\d+)\s*dp$/i.exec(e.rounding.trim());
        const expected = toPlainDecimal(e.expect) ?? e.expect;
        if (!sameAnswer(num(r.value), num(expected), dp ? Number(dp[1]) : undefined)) {
          findings.push({ code: "calc_mismatch", detail: `calculation ${i + 1} "${e.expr.slice(0, 80)}" computes ${r.value} but the solution states ${e.expect}` });
        }
      });
      findings.push(...earlyRounding(entries, results, item));
    }
  }

  if (answer.kind === "number") {
    findings.push(...answerInconsistent(draft, answer), ...unitMissing(draft, answer, item));
  } else if (answer.kind === "choice") {
    findings.push(...letterMismatch(draft, answer, item));
  }
  return findings;
}
