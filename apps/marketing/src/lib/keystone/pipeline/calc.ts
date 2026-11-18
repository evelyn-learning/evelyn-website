// Calculation check for the solutions pipeline. A model returns the calculation behind a numeric answer as
// expressions; calc_check.py recomputes them (never executing them as code) and this file compares the results
// with the stated answer, and checks the answer is stated consistently across the solution.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { ItemDoc } from "../db";
import { sameAnswer } from "./answers";
import type { Answer } from "./answers";
import type { Draft } from "./write";

export type CalcFinding = {
  code: "calc_mismatch" | "early_rounding" | "answer_inconsistent" | "letter_mismatch" | "unit_missing" | "calc_unparseable";
  detail: string;
};

type PyResult = { ok: boolean; value: string; raw?: string; error: string };

const SCRIPT = fileURLToPath(new URL("./calc_check.py", import.meta.url));
const TIMEOUT_MS = 10_000;

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
    const timer = setTimeout(() => { child.kill("SIGKILL"); finish(() => reject(new Error("timed out after 10 s"))); }, TIMEOUT_MS);
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

const THIN = "   ";
const NUMBER_TOKEN = new RegExp(`(?<![\\w.])[+\\-\\u2212]?(?:\\d{1,3}(?:[,${THIN}]\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?|\\.\\d+)`, "g");

/** Strip the LaTeX wrapping so the bare numbers are left. */
function plainText(md: string, keepText = false): string {
  let t = md.replace(/\\(?:text|mathrm|textbf|mathbf)\{([^{}]*)\}/g, keepText ? " $1 " : " ");
  t = t.replace(/\\[,;:!]|\\ |~/g, "").replace(/\\circ/g, "°").replace(/\\(?:left|right|times|approx|cdot)\b/g, " ");
  t = t.replace(/\\[a-zA-Z]+/g, " ").replace(/\$+/g, " ").replace(/[{}]/g, " ").replace(/\*\*|__/g, "");
  return t;
}

/** Every number written in the text (LaTeX and units removed). Grouped thousands ("1,000", "1 000" with a thin space) are joined. */
export function statedNumbers(md: string): string[] {
  const out: string[] = [];
  for (const m of plainText(md).matchAll(NUMBER_TOKEN)) {
    out.push(m[0].replace(/−/g, "-").replace(new RegExp(`[,${THIN}]`, "g"), "").replace(/^\+/, ""));
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
  const check = (name: string, text: string, needNumber: boolean) => {
    const nums = statedNumbers(text);
    if (needNumber && !nums.length) return; // a closing sentence with no number says nothing about the value
    if (!nums.some((n) => sameAnswer(num(n), answer))) {
      out.push({
        code: "answer_inconsistent",
        detail: `the ${name} states ${nums.length ? nums.join(", ") : "no number"} but the agreed answer is ${answer.value}`,
      });
    }
  };
  check("short section", short, false);
  check("last sentence of the diploma section", lastSentence, true);
  return out;
}

function letterMismatch(draft: Draft, answer: Extract<Answer, { kind: "choice" }>): CalcFinding[] {
  const short = plainText(draft.sections.find((s) => s.kind === "short")?.md ?? "", true);
  const patterns = [/\boption\s+([A-Z])\b/gi, /\banswer\s+is\s+([A-Z])\b/gi, /\(([A-Z])\)\s*\.?\s*$/gim, /\b([A-Z])\s+is\s+correct\b/gi];
  const found = new Set<string>();
  for (const p of patterns) for (const m of short.matchAll(p)) if (m[1] === m[1].toUpperCase()) found.add(m[1]); // lower case is the article "a"
  const agreed = answer.letters.map((l) => l.trim().toUpperCase());
  const wrong = [...found].filter((l) => !agreed.includes(l));
  if (wrong.length || !agreed.some((l) => found.has(l))) {
    return [{
      code: "letter_mismatch",
      detail: `the short section names ${found.size ? [...found].join(", ") : "no option letter"} but the agreed answer is ${agreed.join(", ")}`,
    }];
  }
  return [];
}

const UNITS = "m\\/s\\^?2?|m\\/s|km\\/h|kg|g|mol\\/L|mol|J|kJ|N|Pa|kPa|V|A|Ω|W|Hz|m|cm|mm|km|s|min|h|°C|K|L|mL";
const STEM_UNIT = new RegExp(`\\bin\\s+(${UNITS})(?![A-Za-z0-9])`);
const AFTER_NUMBER = new RegExp(
  `^\\s*(?:\\^\\s*\\d+\\s*)?(?:(?:${UNITS})(?![A-Za-z0-9])|(?:metres?|meters?|seconds?|minutes?|hours?|grams?|kilograms?|moles?|joules?|newtons?|pascals?|volts?|amps?|amperes?|watts?|litres?|liters?|degrees?|kelvin)\\b)`,
);

function unitMissing(draft: Draft, answer: Extract<Answer, { kind: "number" }>, item: ItemDoc): CalcFinding[] {
  const stem = (item.questionHtml ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const unit = STEM_UNIT.exec(stem)?.[1];
  if (!unit) return [];
  const short = draft.sections.find((s) => s.kind === "short")?.md ?? "";
  const sentence = sentences(short).find((s) => statedNumbers(s).some((n) => sameAnswer(num(n), answer)));
  if (!sentence) return []; // cannot find the sentence: no finding
  const text = sentence.replace(new RegExp(`[${THIN}]`, "g"), " ");
  for (const m of text.matchAll(NUMBER_TOKEN)) {
    const n = m[0].replace(/−/g, "-").replace(/,/g, "");
    if (!sameAnswer(num(n), answer)) continue;
    if (AFTER_NUMBER.test(text.slice((m.index ?? 0) + m[0].length))) return [];
  }
  return [{ code: "unit_missing", detail: `the question asks for the answer in ${unit} but the short section gives ${answer.value} without a unit` }];
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
        if (!sameAnswer(num(r.value), num(e.expect), dp ? Number(dp[1]) : undefined)) {
          findings.push({ code: "calc_mismatch", detail: `calculation ${i + 1} "${e.expr.slice(0, 80)}" computes ${r.value} but the solution states ${e.expect}` });
        }
      });
      // A rounded intermediate value written back in as a literal.
      for (let j = 0; j < entries.length; j++) {
        const rj = results[j];
        if (!entries[j].rounding.trim() || !rj?.ok || rj.raw === undefined || sameAnswer(num(rj.raw), num(entries[j].expect))) continue;
        for (let i = j + 1; i < entries.length; i++) {
          const literals = [...entries[i].expr.matchAll(NUMBER_TOKEN)].map((m) => m[0]);
          if (literals.some((l) => sameAnswer(num(l), num(entries[j].expect)))) {
            findings.push({
              code: "early_rounding",
              detail: `calculation ${i + 1} reuses ${entries[j].expect}, the rounded result of calculation ${j + 1}, whose unrounded value is ${rj.raw}`,
            });
          }
        }
      }
    }
  }

  if (answer.kind === "number") {
    findings.push(...answerInconsistent(draft, answer), ...unitMissing(draft, answer, item));
  } else if (answer.kind === "choice") {
    findings.push(...letterMismatch(draft, answer));
  }
  return findings;
}
