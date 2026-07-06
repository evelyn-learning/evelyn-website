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
const BRAINGEN_VERIFY_MODEL = process.env.BRAINGEN_VERIFY_MODEL || 'claude-sonnet-5';

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

/** Layer 1 / 3 — bank query. Returns null if no eligible row. */
async function queryBank(
  topic: string,
  difficulty: IProblemBank['difficulty'],
  excludeIds: string[]
): Promise<GeneratedProblem | null> {
  await connectDB();
  const filter: Record<string, unknown> = {
    topic,
    difficulty,
  };
  if (excludeIds.length > 0) {
    filter._id = { $nin: excludeIds };
  }
  // Random sampling within the matching set so back-to-back
  // requests don't return the same row.
  const candidates = (await ProblemBank.find(filter)
    .limit(20)
    .lean()) as unknown as IProblemBank[];
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    canonicalText: pick.problemText,
    expectedAnswer: pick.answer,
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

const BRAINGEN_SYSTEM = `You are an expert problem author for a tutoring engine. Given an ANCHOR practice problem, write ONE fresh problem that tests the SAME underlying skill and concept at the requested difficulty, but with a DIFFERENT real-world context and different numbers/specifics — so a returning student doesn't see the same problem twice. Keep it self-contained and unambiguous. The answer MUST be a single clean, checkable value: a number (with units if natural) or a short exact phrase / multiple-choice letter — NOT an open-ended discussion. Output ONLY a JSON object, no fences, no preamble:
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

interface GenPayload {
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
  input: GenerateProblemInput
): Promise<GeneratedProblem | null> {
  const los = input.plan.los.map((lo) => `- ${lo.description}`).join('\n');
  const userPrompt =
    `ANCHOR problem (do NOT reuse its numbers or context):\n${input.anchor.statement}\n` +
    (input.anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${input.anchor.expectedAnswer}\n` : '') +
    `\nLearning objectives of this lesson:\n${los}\n` +
    `\nRequested difficulty relative to the anchor: ${input.difficulty}. Write the fresh problem now.`;

  const attempt = async (): Promise<GeneratedProblem | null> => {
    const gen = parseGenPayload(await callModel(BRAINGEN_MODEL, BRAINGEN_SYSTEM, userPrompt, 800));
    if (!gen) return null;
    // Cross-session/session dedup: never serve a problem already shown.
    const hash = simpleHash(gen.problemText);
    if ((input.excludeHashes ?? []).includes(hash)) return null;
    // Independent solve — the verifier only sees the problem text.
    const solved = await callModel(BRAINGEN_VERIFY_MODEL, BRAINGEN_VERIFY_SYSTEM, gen.problemText, 400);
    if (!answersAgree(gen.finalAnswer, solved)) return null;
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
  };

  const first = await attempt();
  if (first) return first;
  return await attempt(); // 1 retry — temperature yields a different problem
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
  const t = (s ?? '').trim();
  if (!t) return null;
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
  const bankCoverage = topicMeta?.bankCoverage ?? 'none';
  const absDifficulty = resolveAbsoluteDifficulty(input.anchor, input.difficulty);
  const excludeIds = input.excludeIds ?? [];
  const excludeHashes = input.excludeHashes ?? [];

  // Layer 1 — bank fast-path. Skipped if no coverage.
  if (bankCoverage !== 'none') {
    try {
      const hit = await queryBank(input.topic, absDifficulty, excludeIds);
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
  }

  // Layer 2 — brain-gen + verify. Gated by per-topic state.
  // shadow + beta + live all enable runtime brain-gen; only the
  // SHADOW state has the caller suppress the result for the student
  // (handled at the call site, not here — this layer returns the
  // generated problem regardless and lets the caller decide).
  let brainGenFailed = false;
  if (brainGenState !== 'disabled' || input.forceBrainGen) {
    try {
      const gen = await brainGenWithVerify(input);
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
  // brain-gen exhaustion in case difficulty resolution shifted.
  if (bankCoverage !== 'none') {
    try {
      const hit = await queryBank(input.topic, absDifficulty, excludeIds);
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
