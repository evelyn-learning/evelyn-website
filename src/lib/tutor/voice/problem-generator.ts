/**
 * Adaptive-pacing problem generator — pipeline orchestrator.
 *
 * Implements the 4-layer waterfall agreed in the v1 design:
 *
 *   Layer 1  Bank fast-path (~50ms)         — student-initiated path.
 *   Layer 2  Brain-gen + Sonnet verify      — Opus 4.7 generation,
 *            (~2.5s, 1 retry on mismatch)     Sonnet 4.6 fresh-context
 *                                             independent solve.
 *   Layer 3  Bank fallback                  — same query as Layer 1
 *                                             after brain-gen exhaustion.
 *   Layer 4  Plan-authored try-yourself     — ULTIMATE fallback. The
 *                                             anchor's lesson-plan
 *                                             try-yourself problem.
 *
 * v1 SCAFFOLD STATE: Layer 2 (brain-gen + verifier) returns null —
 * the actual Opus + Sonnet calls land in Phase 2. The pipeline shape,
 * provenance tagging, telemetry hooks, and Layer 1/3/4 logic are wired
 * now so the brain's `generate_problem` tool dispatch has somewhere to
 * land and produces working output (via Layer 4) from day 1.
 *
 * Source-of-truth contract: returned `canonicalText` is the authoritative
 * problem statement. The brain MUST quote this verbatim in TTS; the
 * board MUST render it via show_problem. Drift between them is a bug.
 */

import Anthropic from '@anthropic-ai/sdk';
import { ProblemBank, type IProblemBank } from '../../../models/ProblemBank';
import { connectDB } from '../../db';
import type { LessonPlan, SegmentTryYourself } from '../lesson-plan/types';
import { getTopicById } from '../topic-taxonomy';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// Layer-2 brain-gen models. Generation + an INDEPENDENT fresh-context solve
// for verification. Same model in fresh context is the design's decorrelation
// (the verifier never sees the generator's claimed answer). Overridable.
const BRAINGEN_MODEL = process.env.BRAINGEN_MODEL || 'claude-sonnet-5';
export const BRAINGEN_VERIFY_MODEL = process.env.BRAINGEN_VERIFY_MODEL || 'claude-sonnet-5';

/** 4-point anchored-relative difficulty scale (v1 design Q6). */
export type Difficulty = 'slightly_easier' | 'same' | 'slightly_harder' | 'much_harder';

export interface GenerateProblemInput {
  /** Plan id the student is currently working through. */
  planId: string;
  /** The lesson plan itself (resolved upstream). */
  plan: LessonPlan;
  /** Anchor problem the student just engaged with — the
   *  immediately-prior try_yourself or worked_example. Required so
   *  brain-gen can produce a "slightly harder than this" generation. */
  anchor: {
    statement: string;
    expectedAnswer?: string;
    /** difficulty bucket assigned by the verifier at ingest, if known. */
    difficulty?: 1 | 2 | 3 | 4;
  };
  /** Requested relative difficulty. */
  difficulty: Difficulty;
  /** Topic id (from topic-taxonomy). Used for bank queries +
   *  brainGen-state lookup. */
  topic: string;
  /** Session-scoped exclusion list — bank IDs already shown this
   *  session, plus problem-text hashes for brain-gen-shown items. */
  excludeIds?: string[];
  excludeHashes?: string[];
  /** Force Layer-2 brain-gen ON even when the per-topic brainGen state is
   *  'disabled'. Set by the route when TUTOR_CONTENT_VARIETY is on so
   *  content-variety gets fresh VERIFIED practice problems regardless of the
   *  per-topic ramp. */
  forceBrainGen?: boolean;
}

export interface GeneratedProblem {
  canonicalText: string;
  expectedAnswer?: string;
  hints?: string[];
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  choices?: Array<{ id: string; text: string; correct?: boolean }>;
  /** Telemetry: where did this problem come from? */
  provenance: 'bank' | 'brain-gen' | 'bank-fallback' | 'plan-authored' | 'none';
  /** ID for dedup tracking — bank's _id for bank rows, content
   *  hash for brain-gen, the segment id for plan-authored. */
  trackingId: string;
}

/** Map relative difficulty to an absolute bucket given an anchor. */
function resolveAbsoluteDifficulty(
  anchor: GenerateProblemInput['anchor'],
  rel: Difficulty
): IProblemBank['difficulty'] {
  // Default anchor difficulty if not tagged: 2 (the typical
  // try_yourself level).
  const base = anchor.difficulty ?? 2;
  let target = base;
  if (rel === 'slightly_easier') target = base - 1;
  else if (rel === 'slightly_harder') target = base + 1;
  else if (rel === 'much_harder') target = base + 2;
  // Clamp to valid range [1, 4].
  if (target < 1) target = 1;
  if (target > 4) target = 4;
  return target as IProblemBank['difficulty'];
}

/** Layer 1 / 3 — bank query. Returns null if no eligible row.
 *
 *  excludeHashes (2026-07-17, write-back cache): bank rows written back
 *  from runtime brain-gen can also have been SERVED via Layer 2 earlier in
 *  this same session (tracked by content hash, not bank _id). Without the
 *  hash filter, a later request could re-serve the same problem from the
 *  bank because its _id was never in shownProblemIds. Filtered in JS —
 *  candidates are capped at 20. */
async function queryBank(
  topic: string,
  difficulty: IProblemBank['difficulty'],
  excludeIds: string[],
  excludeHashes: string[] = [],
  planScope?: string,
  planLoIds: string[] = []
): Promise<GeneratedProblem | null> {
  await connectDB();
  const filter: Record<string, unknown> = {
    topic,
    difficulty,
    // Mock-form rows (bankScope:'mock') are full-length-exam-only content and
    // must never leak into the adaptive-pacing practice pipeline (Task 2,
    // mock-exams platform).
    bankScope: { $ne: 'mock' },
  };
  // Lesson scoping (Round-18, tightened Round-22 after session
  // portal-cbd93b08 served course-wide corpus items into a limits lesson —
  // the R18 "corpus rows serve as before" rule was itself the regression:
  // removing the bankCoverage gate had unlocked a 422-row LO-TAGGED course
  // corpus that was never meant to serve unscoped). Eligibility:
  //   - write-back rows (id "brain-gen."): only into the lesson (plan id =
  //     subtopic) that generated them;
  //   - LO-tagged corpus rows: only when their loId matches one of THIS
  //     plan's learning objectives (plan LO ids and corpus loIds share the
  //     same vocabulary, e.g. "apcalcbc.limits-algebraic-properties");
  //   - untagged corpus rows (pre-LO-tagging content): serve as before —
  //     excluding them would regress topics whose corpus predates tagging.
  if (planScope || planLoIds.length > 0) {
    filter.$or = [
      { id: /^brain-gen\./, subtopic: planScope ?? '__no_plan__' },
      ...(planLoIds.length > 0 ? [{ id: { $not: /^brain-gen\./ }, loId: { $in: planLoIds } }] : []),
      { id: { $not: /^brain-gen\./ }, loId: { $exists: false } },
      { id: { $not: /^brain-gen\./ }, loId: null },
    ];
  }
  if (excludeIds.length > 0) {
    filter._id = { $nin: excludeIds };
  }
  // Random sampling within the matching set so back-to-back
  // requests don't return the same row.
  let candidates = (await ProblemBank.find(filter)
    .limit(20)
    .lean()) as unknown as IProblemBank[];
  if (excludeHashes.length > 0) {
    candidates = candidates.filter((c) => !excludeHashes.includes(simpleHash(c.problemText)));
  }
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    canonicalText: pick.problemText,
    // Same combined shape brainGenWithVerify returns: the worked solution
    // (when the row has one — write-back rows do) plus the bare checkable
    // answer, so bank-served problems give the tutor identical material.
    expectedAnswer: pick.solutionText
      ? `${pick.solutionText} (answer: ${pick.answer})`
      : pick.answer,
    hints: pick.hints,
    responseFormat: pick.responseFormat,
    choices: pick.choices?.map((c, i) => ({
      id: String.fromCharCode(65 + i),
      text: c,
    })),
    provenance: 'bank',
    trackingId: String(pick._id),
  };
}

/** Write-back cache (2026-07-17): persist a runtime-verified brain-gen
 *  problem into the bank so the NEXT request for this topic+difficulty hits
 *  the ~50ms Layer-1 fast-path instead of paying the ~2.5-8s generate+verify
 *  round again. This turns bank seeding into a lazy, demand-driven process —
 *  the bank grows exactly where students actually practice, per course, with
 *  no authoring effort. Fire-and-forget from the Layer-2 success path: a
 *  write failure must never delay or fail the serve. Idempotent — keyed on
 *  the content hash ($setOnInsert upsert), so re-generation collisions are
 *  no-ops. License policy: the generator writes ORIGINAL items (the prompt
 *  forbids reusing anchor numbers/context), matching the 'internal-original'
 *  origin the schema documents. */
async function persistBrainGenProblem(
  topic: string,
  difficulty: IProblemBank['difficulty'],
  gen: GenPayload,
  hash: string,
  planId?: string,
  loId?: string
): Promise<void> {
  try {
    await connectDB();
    await ProblemBank.updateOne(
      { id: `brain-gen.${topic}.${hash}` },
      {
        $setOnInsert: {
          id: `brain-gen.${topic}.${hash}`,
          topic,
          // Round-18: lesson scoping — write-back rows serve only into the
          // plan that generated them (see queryBank's planScope rule).
          ...(planId ? { subtopic: planId } : {}),
          ...(loId ? { loId } : {}),
          difficulty,
          problemText: gen.problemText,
          answer: gen.finalAnswer,
          solutionText: gen.teachingAnswer,
          hints: gen.hints,
          responseFormat: gen.responseFormat === 'mcq' ? 'mcq' : 'numeric',
          choices: gen.choices,
          source: { name: 'Evelyn (brain-gen runtime)' },
          license: 'internal-original',
          verifiedAt: new Date(),
          verifierModel: BRAINGEN_VERIFY_MODEL,
        },
      },
      { upsert: true }
    );
    console.log(`[problem-generator] write-back stored brain-gen.${topic}.${hash}`);
  } catch (err) {
    // Non-fatal by design — the student already has their problem.
    console.warn('[problem-generator] write-back failed (non-fatal):', err);
  }
}

const BRAINGEN_SYSTEM = `You are an expert problem author for a tutoring engine. Given an ANCHOR practice problem, write ONE fresh problem that tests the SAME underlying skill and concept at the requested difficulty, but with a DIFFERENT real-world context and different numbers/specifics — so a returning student doesn't see the same problem twice. Keep it self-contained and unambiguous.
The problem MUST stay within the listed learning objectives. Escalating difficulty means a HARDER problem inside those same objectives — never a more advanced technique from a different topic (if the objectives are about limits, a derivative or implicit-differentiation problem is WRONG at every difficulty). A drifted problem gets rejected and wastes the student's time. The answer MUST be a single clean, checkable value: a number (with units if natural) or a short exact phrase / multiple-choice letter — NOT an open-ended discussion. Output ONLY a JSON object, no fences, no preamble:
{"problemText": string, "finalAnswer": string (the bare checkable answer, e.g. "48 square inches" or "B"), "teachingAnswer": string (a one-to-three sentence worked solution the tutor can reference), "responseFormat": "numeric"|"mcq", "hints": string[] (1-3 short hints), "choices"?: string[] (for mcq only)}`;

const BRAINGEN_VERIFY_SYSTEM = `You are a meticulous solver. Solve the problem and reply with ONLY the final answer — a single number (with units if natural) or a short phrase / the correct multiple-choice option. No working, no explanation, no restatement.`;

/** One Anthropic text call → trimmed string. */
async function callModel(model: string, system: string, user: string, maxTokens: number): Promise<string> {
  const res = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
}

export interface GenPayload {
  problemText: string;
  finalAnswer: string;
  teachingAnswer?: string;
  responseFormat?: 'numeric' | 'mcq';
  hints?: string[];
  choices?: string[];
}

function parseGenPayload(raw: string): GenPayload | null {
  try {
    const j = JSON.parse(raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim());
    if (typeof j.problemText !== 'string' || !j.problemText.trim()) return null;
    if (typeof j.finalAnswer !== 'string' || !j.finalAnswer.trim()) return null;
    const strArr = (v: unknown): string[] | undefined =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : undefined;
    return {
      problemText: j.problemText.trim(),
      finalAnswer: j.finalAnswer.trim(),
      teachingAnswer: typeof j.teachingAnswer === 'string' ? j.teachingAnswer.trim() : undefined,
      responseFormat: j.responseFormat === 'mcq' ? 'mcq' : 'numeric',
      hints: strArr(j.hints),
      choices: strArr(j.choices),
    };
  } catch {
    return null;
  }
}

export interface GenAndVerifyResult {
  gen: GenPayload;
  hash: string;
}

/**
 * Generate ONE candidate problem from `userPrompt` — NO verification. Parses
 * the model's JSON payload and applies the `excludeHashes` cross-session
 * dedup check. Returns null on parse failure or a hash collision. Exported so
 * a caller needing BESPOKE verification (Practice's answer-shape-aware gate
 * in `practice-gen.ts` — plain-number numeric answers, choices-aware mcq
 * verification) can layer its own check on top of the exact same generator
 * call, without forking the generation prompt/model. `generateAndVerifyOnce`
 * below is just this plus the tutor-session's blind-solve verification.
 */
export async function generateCandidate(
  userPrompt: string,
  excludeHashes: string[] = []
): Promise<GenAndVerifyResult | null> {
  const gen = parseGenPayload(await callModel(BRAINGEN_MODEL, BRAINGEN_SYSTEM, userPrompt, 800));
  if (!gen) return null;
  // Cross-session dedup: never serve a problem already shown.
  const hash = simpleHash(gen.problemText);
  if (excludeHashes.includes(hash)) return null;
  return { gen, hash };
}

/**
 * One generate+verify attempt: author a fresh problem from `userPrompt` via
 * BRAINGEN_MODEL, then INDEPENDENTLY solve it with BRAINGEN_VERIFY_MODEL (the
 * verifier only ever sees the problem text, never the claimed answer) and
 * only return when the two agree (numeric tolerance or short-exact —
 * `answersAgree`). Returns null on parse failure, a hash collision against
 * `excludeHashes`, or verifier disagreement; the caller decides whether to
 * retry. Exported so the tutor-session Layer-2 pipeline (`brainGenWithVerify`
 * below) and Practice's generate-on-exhaustion path share the same generator —
 * no forked pipeline (Practice adds its OWN stricter verify on top of
 * `generateCandidate` instead of calling this one; see practice-gen.ts).
 */
export async function generateAndVerifyOnce(
  userPrompt: string,
  excludeHashes: string[] = []
): Promise<GenAndVerifyResult | null> {
  const candidate = await generateCandidate(userPrompt, excludeHashes);
  if (!candidate) return null;
  const { gen, hash } = candidate;
  // Independent solve — the verifier only sees the problem text.
  const solved = await callModel(BRAINGEN_VERIFY_MODEL, BRAINGEN_VERIFY_SYSTEM, gen.problemText, 400);
  if (!answersAgree(gen.finalAnswer, solved)) return null;
  return { gen, hash };
}

/** `generateAndVerifyOnce` with 1 retry on failure (temperature yields a
 *  different problem the second time). Same retry shape the tutor-session
 *  pipeline has always used. */
export async function generateAndVerifyWithRetry(
  userPrompt: string,
  excludeHashes: string[] = []
): Promise<GenAndVerifyResult | null> {
  const first = await generateAndVerifyOnce(userPrompt, excludeHashes);
  if (first) return first;
  return generateAndVerifyOnce(userPrompt, excludeHashes); // 1 retry
}

/**
 * Layer 2 — brain-gen + independent verify (content-variety Phase 2).
 * Generates a fresh problem testing the anchor's skill, then INDEPENDENTLY
 * solves it in a separate call (the verifier never sees the claimed answer)
 * and only returns the problem when the two answers agree (numeric tolerance
 * or short-exact). 1 retry on mismatch/parse-failure (temperature gives a
 * different problem). On exhaustion returns null → the pipeline falls through
 * to bank / plan-authored, so an UNVERIFIED problem is never served.
 */
async function brainGenWithVerify(
  input: GenerateProblemInput,
  absDifficulty: IProblemBank['difficulty']
): Promise<GeneratedProblem | null> {
  const los = input.plan.los.map((lo) => `- ${lo.description}`).join('\n');
  const userPrompt =
    `ANCHOR problem (do NOT reuse its numbers or context):\n${input.anchor.statement}\n` +
    (input.anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${input.anchor.expectedAnswer}\n` : '') +
    `\nLearning objectives of this lesson:\n${los}\n` +
    `\nRequested difficulty relative to the anchor: ${input.difficulty}. Write the fresh problem now.`;

  const result = await generateAndVerifyWithRetry(userPrompt, input.excludeHashes ?? []);
  if (!result) return null;
  const { gen, hash } = result;
  // Write-back cache: store the verified problem so future requests for
  // this topic+difficulty hit the bank fast-path. Fire-and-forget.
  void persistBrainGenProblem(input.topic, absDifficulty, gen, hash, input.planId, input.plan.los?.[0]?.id);
  return {
    canonicalText: gen.problemText,
    // The teaching solution is what the tutor references; fall back to the
    // bare final answer. Validation downstream compares the student's
    // response to this, so keep the bare answer recoverable inside it.
    expectedAnswer: gen.teachingAnswer ? `${gen.teachingAnswer} (answer: ${gen.finalAnswer})` : gen.finalAnswer,
    hints: gen.hints,
    responseFormat: gen.responseFormat,
    choices: gen.choices?.map((c, i) => ({ id: String.fromCharCode(65 + i), text: c })),
    provenance: 'brain-gen',
    trackingId: hash,
  };
}

/** Cheap content-token extraction: lowercase words ≥4 chars, no
 *  stopwords (we just rely on length to filter them naturally). Used
 *  by the Layer 4 relevance filter. */
function contentTokenSet(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 4)
  );
}

/** Layer 4 — plan-authored ultimate fallback.
 *
 *  RELEVANCE-FILTERED. Returns a try-yourself ONLY if it shares ≥3
 *  content tokens (≥4 chars each) with the anchor statement. Otherwise
 *  null.
 *
 *  Why: a topically-distant fallback (e.g. returning a bullet+block
 *  momentum problem when the anchor was a rolling-incline acceleration
 *  problem) corrupts the brain's context. The brain semantically
 *  rejects the canonical text and emits its own free-form
 *  show_problem, breaking the verbatim-quoting contract — observed
 *  2026-05-01 JEE Physics session.
 *
 *  When this returns null, the API resolver returns
 *  `{ error: 'no_problem_available' }` and the brain follows the
 *  system-prompt rule: apologize briefly, offer to advance OR ask the
 *  student what they want next. NEVER emit a free-form show_problem
 *  in that case. */
function planAuthoredFallback(
  plan: LessonPlan,
  anchorStatement: string,
  excludeHashes: string[]
): GeneratedProblem | null {
  const tryYourselves = plan.segments.filter(
    (s): s is SegmentTryYourself => s.kind === 'try_yourself'
  );
  if (tryYourselves.length === 0) return null;
  const anchorTokens = contentTokenSet(anchorStatement);
  if (anchorTokens.size === 0) return null;

  // Threshold lowered to ≥1 token. Earlier ≥3 was too strict for
  // prose ↔ math-notation problem pairs in the same plan: the
  // worked-example prose ("A class of 5 students scored 70, 75, 80…")
  // shared only "mean" with the try-yourselves' math notation
  // ("Compute the mean of {2,4,6,8,10}"), so the relevance filter
  // returned null and the brain kept seeing no_problem_available
  // for legitimate practice-injection requests on the same concept
  // (2026-05-02 retest). Within-plan candidates already passed an
  // implicit relevance check by virtue of being in the same plan,
  // so ≥1 token + same-plan is sufficient. Explicit cross-plan
  // candidates would need a stricter check, but the current
  // pipeline only ever fetches from input.plan.
  let best: { ty: SegmentTryYourself; score: number } | null = null;
  for (const ty of tryYourselves) {
    // Skip segments deliberately marked off-topic — they aren't
    // legitimate practice content and would only get returned to be
    // rendered as a wrong-concept problem.
    if (ty.offTopic === true) continue;
    const hash = simpleHash(ty.problem);
    if (excludeHashes.includes(hash)) continue;
    const tyTokens = contentTokenSet(ty.problem);
    let overlap = 0;
    for (const t of anchorTokens) if (tyTokens.has(t)) overlap++;
    if (overlap >= 1 && (!best || overlap > best.score)) {
      best = { ty, score: overlap };
    }
  }
  if (!best) return null;
  return {
    canonicalText: best.ty.problem,
    expectedAnswer: best.ty.expectedAnswer,
    hints: best.ty.hints,
    responseFormat: best.ty.responseFormat,
    choices: best.ty.choices,
    provenance: 'plan-authored',
    trackingId: best.ty.id,
  };
}

/** Extract a comparable number from an answer string. Handles fractions
 *  ("3/4" → 0.75), currency ("$4.50" → 4.5), comma thousands ("300,000" →
 *  300000), and a number embedded in prose / units ("15 square feet" → 15,
 *  "Area = 20" → 20). Returns null when there's no digit. Used by
 *  answersAgree to verify a brain-generated problem's answer. */
export function extractAnswerNumber(s: string): number | null {
  let t = (s ?? '').trim();
  if (!t) return null;
  // Round-24 notation normalization — realistic solver-vs-brain form pairs
  // that must extract the same value: \frac{1}{2} vs 1/2, π/4 vs 0.785,
  // 50% vs 0.5, √2/2 vs 0.707, unicode minus, leading-dot decimals. Order
  // matters: structural forms to plain slashes first, then symbolic
  // constants to numerics, then percent.
  t = t
    .replace(/−/g, '-')
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√$1')
    .replace(/(^|[^\d.])\.(\d)/g, '$10.$2');
  t = t.replace(/(\d*\.?\d*)\s*(?:π|\\pi(?![a-zA-Z])|\bpi\b)/gi, (_m, c: string) =>
    String((c && c.trim() !== '' ? parseFloat(c) : 1) * Math.PI));
  t = t.replace(/√\s*(\d+(?:\.\d+)?)/g, (_m, n: string) => String(Math.sqrt(parseFloat(n))));
  t = t.replace(/(-?\d+(?:\.\d+)?)\s*%/g, (_m, n: string) => String(parseFloat(n) / 100));
  const frac = t.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
  if (frac) {
    const d = parseFloat(frac[2]);
    if (d !== 0) return parseFloat(frac[1]) / d;
  }
  const m = t.replace(/[$,]/g, '').match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Whether a generated problem's stated answer and an INDEPENDENT solve agree
 *  well enough to serve the problem to a student. Numeric → 1%-or-0.01
 *  tolerance (same rule as portal assessment grading); otherwise normalized
 *  short-exact equality (mcq letters, one-word answers). Anything that can't
 *  be matched this way returns false → the caller falls back to the authored
 *  problem (never serve an unverified generated problem). */
export function answersAgree(genAnswer: string, solveAnswer: string): boolean {
  const a = extractAnswerNumber(genAnswer);
  const b = extractAnswerNumber(solveAnswer);
  if (a !== null && b !== null) {
    const tol = Math.max(0.01, Math.abs(b) * 0.01);
    return Math.abs(a - b) <= tol;
  }
  const norm = (s: string) => (s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const na = norm(genAnswer), nb = norm(solveAnswer);
  return !!na && na === nb;
}

/** Normalize for MCQ text comparison — strips LaTeX-ish noise + punctuation. */
function normMcqText(s: string): string {
  return (s ?? '').toLowerCase().replace(/\$|\\[a-z]+|[{}()]/g, ' ').replace(/[^a-z0-9]/g, '');
}

/** Resolve an answer string to a bare choice LETTER — direct letter shapes
 *  ("D", "(D)", "Option D."), else an EXACT normalized match against a
 *  choice's text. Returns null when unresolvable. Text → letter is
 *  deliberately exact-only (no fuzzy/containment matching): MCQ choices
 *  about one concept share most of their words (a negation distractor
 *  differs from the correct choice by one token), so paraphrase matching
 *  would mis-resolve. Shared by `mcqAnswersAgree` (tutor-session) and
 *  Practice's answer-shape gate (`practice-gen.ts`) so both resolve a claimed
 *  MCQ answer to a bank-storable bare letter the exact same way. */
export function resolveMcqLetter(
  answer: string,
  choices: Array<{ letter: string; text: string }>
): string | null {
  const t = (answer ?? '').trim();
  const direct = t.match(/^\(?([A-Ea-e])\)?[.):]?$/);
  if (direct) return direct[1].toUpperCase();
  const prefixed = t.match(/^(?:option|choice|answer(?:\s+is)?)[:\s]+\(?([A-Ea-e])\)?[.):]?\s*$/i);
  if (prefixed) return prefixed[1].toUpperCase();
  const n = normMcqText(t);
  if (!n) return null;
  for (const c of choices) {
    if (normMcqText(c.text) === n) return c.letter.toUpperCase();
  }
  return null;
}

/** Round-17b (2026-07-17): MCQ-aware agreement. Live false-mismatch class
 *  (session portal-ef215ea0): the brain claims a LETTER ("D") while the
 *  blind solver answered with the choice's TEXT. Resolve BOTH sides to a
 *  letter (`resolveMcqLetter`) and compare. Unresolvable sides never agree. */
export function mcqAnswersAgree(
  claimed: string,
  solved: string,
  choices: Array<{ letter: string; text: string }>
): boolean {
  const nClaimed = normMcqText(claimed);
  const nSolved = normMcqText(solved);
  if (nClaimed && nClaimed === nSolved) return true;
  const a = resolveMcqLetter(claimed, choices);
  const b = resolveMcqLetter(solved, choices);
  return !!a && a === b;
}

/** Round-17 (2026-07-17): blind-solve verification for a CLAIMED answer —
 *  the improvised / student-brought coverage of the pipeline's Layer-2
 *  check. The solver gets ONLY the problem text (never the claim) and the
 *  comparison uses the same answersAgree tolerance the pipeline serves
 *  under. Round-17b: for multiple-choice problems the CHOICES are appended
 *  to the solver's problem text (it previously answered free-form text
 *  because it couldn't see them) with a letter-only reply instruction, and
 *  agreement adds the MCQ letter/text resolution. */
export async function verifyClaimedAnswer(
  problemText: string,
  claimedAnswer: string,
  choices?: Array<{ letter: string; text: string }>
): Promise<{ agree: boolean; solved: string }> {
  const hasChoices = Array.isArray(choices) && choices.length > 0;
  const solverInput = hasChoices
    ? `${problemText}\n\nAnswer choices:\n${choices!.map((c) => `${c.letter}) ${c.text}`).join('\n')}\n\nThis is multiple-choice: reply with ONLY the letter of the correct choice.`
    : problemText;
  const solved = await callModel(BRAINGEN_VERIFY_MODEL, BRAINGEN_VERIFY_SYSTEM, solverInput, 400);
  const agree = hasChoices
    ? mcqAnswersAgree(claimedAnswer, solved, choices!) || answersAgree(claimedAnswer, solved)
    : answersAgree(claimedAnswer, solved);
  return { agree, solved };
}

/** Cheap deterministic hash for dedup. Not cryptographic. */
export function simpleHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/**
 * Telemetry record for one pipeline run. The runtime emits these
 * as fire-and-forget metrics so the auto-promotion job (per-topic
 * brainGen state machine) can read them.
 */
export interface PipelineTelemetry {
  topic: string;
  brainGenState: 'disabled' | 'shadow' | 'beta' | 'live';
  difficulty: Difficulty;
  layerReached: 1 | 2 | 3 | 4;
  provenance: GeneratedProblem['provenance'];
  /** wall time milliseconds */
  totalMs: number;
  /** true when Layer 2 ran but verifier rejected. */
  brainGenRetried?: boolean;
  /** true when Layer 2 ran but produced no usable output. */
  brainGenFailed?: boolean;
}

/**
 * Run the 4-layer pipeline. Always returns a problem (Layer 4 is
 * the ultimate fallback) unless the plan has zero try_yourselves.
 */
export async function generateProblem(
  input: GenerateProblemInput
): Promise<{ result: GeneratedProblem | null; telemetry: PipelineTelemetry }> {
  const start = Date.now();
  const topicMeta = getTopicById(input.topic);
  const brainGenState = topicMeta?.brainGen ?? 'disabled';
  const absDifficulty = resolveAbsoluteDifficulty(input.anchor, input.difficulty);
  const excludeIds = input.excludeIds ?? [];
  const excludeHashes = input.excludeHashes ?? [];

  // Layer 1 — bank fast-path. ALWAYS attempted (2026-07-17): the old
  // `bankCoverage !== 'none'` gate predates the write-back cache — with
  // runtime brain-gen persisting its verified output, every topic can
  // accumulate bank rows regardless of its static taxonomy coverage tag,
  // and an empty-collection miss is one cheap indexed find.
  try {
    const hit = await queryBank(input.topic, absDifficulty, excludeIds, excludeHashes, input.planId, (input.plan.los ?? []).map((lo) => lo.id));
    if (hit) {
      return {
        result: hit,
        telemetry: {
          topic: input.topic,
          brainGenState,
          difficulty: input.difficulty,
          layerReached: 1,
          provenance: 'bank',
          totalMs: Date.now() - start,
        },
      };
    }
  } catch (err) {
    // Bank failure is non-fatal — fall through to brain-gen / fallback.
    console.warn('[problem-generator] bank query failed:', err);
  }

  // Layer 2 — brain-gen + verify. Gated by per-topic state.
  // shadow + beta + live all enable runtime brain-gen; only the
  // SHADOW state has the caller suppress the result for the student
  // (handled at the call site, not here — this layer returns the
  // generated problem regardless and lets the caller decide).
  let brainGenFailed = false;
  if (brainGenState !== 'disabled' || input.forceBrainGen) {
    try {
      const gen = await brainGenWithVerify(input, absDifficulty);
      if (gen) {
        return {
          result: gen,
          telemetry: {
            topic: input.topic,
            brainGenState,
            difficulty: input.difficulty,
            layerReached: 2,
            provenance: 'brain-gen',
            totalMs: Date.now() - start,
          },
        };
      }
      brainGenFailed = true;
    } catch (err) {
      console.warn('[problem-generator] brain-gen failed:', err);
      brainGenFailed = true;
    }
  }

  // Layer 3 — bank fallback. Same query as Layer 1, retried after
  // brain-gen exhaustion in case difficulty resolution shifted. Same
  // always-attempt rationale as Layer 1 (write-back cache).
  try {
    const hit = await queryBank(input.topic, absDifficulty, excludeIds, excludeHashes, input.planId, (input.plan.los ?? []).map((lo) => lo.id));
    if (hit) {
      return {
        result: { ...hit, provenance: 'bank-fallback' },
        telemetry: {
          topic: input.topic,
          brainGenState,
          difficulty: input.difficulty,
          layerReached: 3,
          provenance: 'bank-fallback',
          totalMs: Date.now() - start,
          brainGenFailed,
        },
      };
    }
  } catch (err) {
    console.warn('[problem-generator] bank fallback failed:', err);
  }

  // Layer 4 — plan-authored ultimate fallback (relevance-filtered).
  const fallback = planAuthoredFallback(
    input.plan,
    input.anchor.statement,
    excludeHashes
  );
  return {
    result: fallback,
    telemetry: {
      topic: input.topic,
      brainGenState,
      difficulty: input.difficulty,
      layerReached: 4,
      // Accurate label: 'plan-authored' only when fallback returned a
      // real problem; 'none' when the relevance filter rejected every
      // candidate. Previously hard-coded to 'plan-authored' which
      // misled debugging — telemetry would say "Layer 4 returned a
      // plan-authored result" while the actual result was null.
      provenance: fallback ? 'plan-authored' : 'none',
      totalMs: Date.now() - start,
      brainGenFailed,
    },
  };
}
