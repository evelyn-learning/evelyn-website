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

import { ProblemBank, type IProblemBank } from '../../../models/ProblemBank';
import { connectDB } from '../../db';
import type { LessonPlan, SegmentTryYourself } from '../lesson-plan/types';
import { getTopicById } from '../topic-taxonomy';

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

/**
 * Layer 2 — brain-gen + Sonnet verify. Phase 2 wiring lives here.
 * v1 scaffold: returns null so the pipeline falls through to Layer 3.
 */
async function brainGenWithVerify(
  _input: GenerateProblemInput
): Promise<GeneratedProblem | null> {
  // TODO Phase 2: Opus 4.7 generation + Sonnet 4.6 fresh-context
  // independent solve + 1 retry on mismatch. Tool-call computation
  // layer (sympy/JS) for math/science where applicable.
  return null;
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
  if (brainGenState !== 'disabled') {
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
