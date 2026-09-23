/**
 * Extract the discrete problems a student has to solve from a homework
 * upload's raw text — verbatim, one entry per problem or sub-part.
 *
 * WHY THIS EXISTS. Homework-help mode wraps the student's own questions
 * in a plan (see `homework.ts`) so the orchestrator can hand them back
 * one at a time. The plan can only do that once the questions have been
 * split out of a blob of extracted text ("1) Solve b+5=12  2) ...") — this
 * module is that split.
 *
 * Mirrors `material-classify.ts`'s skeleton on purpose: lazy client
 * getter, an injectable `Deps.complete` so the test needs no network,
 * `parseLastJson`'s fenced-JSON convention, and a never-throw wrapper
 * that fails open. The prompt is subject-agnostic by design — see the
 * comment at the top of `generate-from-text.ts`.
 *
 * ⚠ FAILS OPEN: on any parse failure or model error, `enumerateProblems`
 * returns ONE problem holding the whole trimmed input (capped to
 * HOMEWORK_MAX_PROBLEM_CHARS) rather than refusing, and reports this via
 * `failedOpen: true` so callers can flag `generatorOk` accurately instead
 * of guessing from the result's shape. The alternative — refusing to
 * build a homework plan because the splitter had a bad day — turns a
 * transient model blip into a dead end for a student who uploaded a
 * perfectly good worksheet. Getting to work the sheet as one big problem
 * is strictly better than not proceeding at all.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getModelClient, resolveModel } from '../ai/model-registry';

/** Hard ceiling on how many problems a single homework plan can hold. */
export const HOMEWORK_MAX_PROBLEMS = 25;

/** Hard ceiling on a single problem's `text` length — matches the portal
 *  contract's `PlanProblemSchema.text` cap (v1.19.0). Applied to every
 *  model-returned entry in `parseEnumeration` AND to the fail-open
 *  single-problem text (which can otherwise be the whole extracted
 *  material, well past 4000 chars) — without this, a long worksheet
 *  either from the model or from the fail-open path would fail
 *  `PlanGenerateResponseSchema.parse` in the route with an unhandled
 *  ZodError (500) instead of degrading. */
export const HOMEWORK_MAX_PROBLEM_CHARS = 4000;

export interface HomeworkProblem {
  /** Number as printed on the sheet, or the 1-based position when the
   *  source was unnumbered (or numbering was missing/duplicated). */
  n: number;
  /** The problem's full wording, verbatim, including any given values. */
  text: string;
}

/** Same fast-pass model the rest of this pipeline uses (registry role 'plangen-fast'). */
const HAIKU_MODEL_ID = resolveModel('plangen-fast').model;
const ENUMERATE_MAX_TOKENS = 4096;
/** Only the first N chars of extracted text are sent — bounds cost for a
 *  long worksheet/chapter while keeping every realistic problem set intact. */
const ENUMERATE_SAMPLE_CHARS = 40_000;

const ENUMERATE_SYSTEM_PROMPT = `You extract the discrete problems a student has to solve from the text of their homework. Output ONLY JSON:
{"problems":[{"n":<number as printed, or the 1-based position if unnumbered>,"text":"<the problem's full wording, verbatim, including any given values; keep math as plain text>"}]}
Rules: keep the original order; one entry per problem or sub-part that expects its own answer; do not solve, hint, rephrase or omit; skip headings, instructions like "show your work", and answer keys; at most 25 entries.`;

/** Last parseable JSON block wins — the parseLast convention used by
 *  TopicValidator, OpenContainerDeriver and material-classify.ts. */
function parseLastJson(text: string): unknown {
  const fenced = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]!);
  const candidates = fenced.length > 0 ? fenced : [text];
  for (let i = candidates.length - 1; i >= 0; i--) {
    try { return JSON.parse(candidates[i]!.trim()); } catch { /* try earlier */ }
  }
  try { return JSON.parse(text.trim()); } catch { return null; }
}

/**
 * Parse a model response into an ordered problem list, or null when
 * nothing usable is present. Pure — independently testable without a
 * model in the loop.
 *
 * Renumbers the WHOLE list by 1-based position whenever any entry is
 * missing `n` or repeats an `n` already seen — a partially-numbered or
 * inconsistently-numbered list is not trustworthy evidence for ANY of
 * its numbers, so trying to keep the "good" ones would silently mix
 * printed numbering with inferred numbering in the same plan.
 */
export function parseEnumeration(raw: unknown): HomeworkProblem[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const arr = o.problems;
  if (!Array.isArray(arr)) return null;

  const cleaned: Array<{ n: number | undefined; text: string }> = [];
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;
    const it = item as Record<string, unknown>;
    const text = typeof it.text === 'string' ? it.text.trim().slice(0, HOMEWORK_MAX_PROBLEM_CHARS) : '';
    if (!text) continue;
    // A non-integer or < 1 `n` (e.g. sub-parts 1a/1b read back as 1.1/1.2,
    // or a 0-based list) is treated as MISSING: the contract's
    // PlanProblemSchema is `n: int().min(1)`, so keeping it would fail the
    // response parse after the plan is persisted. Missing -> the whole list
    // falls back to sequential 1..N below.
    const n = typeof it.n === 'number' && Number.isInteger(it.n) && it.n >= 1 ? it.n : undefined;
    cleaned.push({ n, text });
  }
  if (cleaned.length === 0) return null;

  const seen = new Set<number>();
  let needsRenumber = false;
  for (const c of cleaned) {
    if (c.n === undefined || seen.has(c.n)) { needsRenumber = true; break; }
    seen.add(c.n);
  }

  const numbered: HomeworkProblem[] = needsRenumber
    ? cleaned.map((c, i) => ({ n: i + 1, text: c.text }))
    : cleaned.map((c) => ({ n: c.n as number, text: c.text }));

  return numbered.slice(0, HOMEWORK_MAX_PROBLEMS);
}

export interface EnumerateDeps {
  /** Injected so the tests need no network. */
  complete(system: string, user: string): Promise<string>;
}

export interface EnumerateResult {
  problems: HomeworkProblem[];
  /** True when the model call/parse failed and `problems` is the
   *  deterministic one-entry fail-open result rather than a real split —
   *  callers use this (not a text-shape heuristic) to decide
   *  `generatorOk`. */
  failedOpen: boolean;
}

/**
 * Split a homework upload's extracted text into discrete problems.
 * NEVER throws — on any parse failure or model error it fails open,
 * returning the whole trimmed input (capped to HOMEWORK_MAX_PROBLEM_CHARS)
 * as a single problem, with `failedOpen: true` (see header).
 */
export async function enumerateProblems(text: string, deps: EnumerateDeps): Promise<EnumerateResult> {
  const trimmed = text.trim();
  try {
    const raw = await deps.complete(ENUMERATE_SYSTEM_PROMPT, trimmed.slice(0, ENUMERATE_SAMPLE_CHARS));
    const parsed = parseEnumeration(parseLastJson(raw));
    if (parsed) return { problems: parsed, failedOpen: false };
    console.warn('[enumerate-problems] fail-open:', 'model response had no usable problems');
  } catch (err) {
    console.warn('[enumerate-problems] fail-open:', (err as Error)?.message ?? err);
  }
  return { problems: [{ n: 1, text: trimmed.slice(0, HOMEWORK_MAX_PROBLEM_CHARS) }], failedOpen: true };
}

/**
 * Lazy singleton, for the same reason material-classify.ts documents: a
 * tsx test script that calls dotenv config() then imports this module
 * would see its import hoisted above that call, so reading the key at
 * module load would find it undefined.
 */
export function getEnumerateClient(): Anthropic {
  return getModelClient('plangen-fast').client;
}

/** Production deps: one cheap Haiku call. */
export function defaultEnumerateDeps(client: Anthropic): EnumerateDeps {
  return {
    async complete(system, user) {
      const res = await client.messages.create({
        model: HAIKU_MODEL_ID,
        max_tokens: ENUMERATE_MAX_TOKENS,
        temperature: 0,
        system,
        messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      });
      const block = res.content.find((b) => b.type === 'text');
      return block && block.type === 'text' ? block.text : '';
    },
  };
}
