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
import { getModelClient } from '../ai/model-registry';
import { parseJsonObjects } from '../ai/model-json';
import { ProblemBank, type IProblemBank } from '../../../models/ProblemBank';
import { connectDB } from '@core/db';
import type { LessonPlan, SegmentTryYourself } from '../lesson-plan/types';
import { getTopicById } from '../topic-taxonomy';
import { withoutWithdrawn, isWithdrawnSegment, keyCheckUntrusted, segmentKeyUntrusted, logWithdrawnSkip, logUnverifiedKeySkip } from '../portal/withdrawn-items';
import { compareRelationTexts } from './relation-sampling';

// Layer-2 brain-gen models. Generation + an INDEPENDENT fresh-context solve
// for verification. Same model in fresh context is the design's decorrelation
// (the verifier never sees the generator's claimed answer). Resolved via the
// model-registry (roles 'braingen' / 'braingen-verify'); the legacy
// BRAINGEN_MODEL / BRAINGEN_VERIFY_MODEL env vars still work as aliases.
const braingen = getModelClient('braingen');
const braingenVerify = getModelClient('braingen-verify');
const BRAINGEN_MODEL = braingen.model;
export const BRAINGEN_VERIFY_MODEL = braingenVerify.model;

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
  /** Time budget for Layer 2 (generate + verify), ms. Default
   *  `LIVE_BRAINGEN_BUDGET_MS`; see `brainGenWithinBudget`. */
  brainGenBudgetMs?: number;
  /** Test seam: the model client Layer 2 calls. */
  brainGenClient?: TextCallClient;
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
  // Bank rows withdrawn by the answer-key audit (portal/withdrawn-items.ts)
  // are never served — this query is the one bank read outside
  // retrievePractice (LO-tagged `practice-gen.*` rows are eligible here).
  candidates = withoutWithdrawn(candidates);
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

// The "working" field comes BEFORE "finalAnswer" on purpose (2026-10-05). The
// generator runs with thinking off (see GEN_MAX_TOKENS), so it writes the
// object top to bottom; with "finalAnswer" straight after the problem it
// committed to an answer before working it out — measured on a Riemann-sum
// skill: finalAnswer "54", then a teachingAnswer that computed 42 and went on
// "… recompute …" (4 of 4 candidates rejected by the solver). A place to work
// first costs ~100 output tokens and no thinking budget. The field is read by
// nothing: `parseGenPayloadDetailed` ignores it.
const BRAINGEN_SYSTEM = `You are an expert problem author for a tutoring engine. Given an ANCHOR practice problem, write ONE fresh problem that tests the SAME underlying skill and concept at the requested difficulty, but with a DIFFERENT real-world context and different numbers/specifics — so a returning student doesn't see the same problem twice. Keep it self-contained and unambiguous.
The problem MUST stay within the listed learning objectives. Escalating difficulty means a HARDER problem inside those same objectives — never a more advanced technique from a different topic (if the objectives are about limits, a derivative or implicit-differentiation problem is WRONG at every difficulty). A drifted problem gets rejected and wastes the student's time. The answer MUST be a single clean, checkable value: a number (with units if natural) or a short exact phrase / multiple-choice letter — NOT an open-ended discussion. Output ONLY a JSON object, no fences, no preamble, with the fields in THIS order:
{"problemText": string, "working": string (solve your own problem here, step by step, BEFORE you state the answer — your scratch work, never shown to anyone; keep it brief), "finalAnswer": string (the bare checkable answer, e.g. "48 square inches" or "B" — exactly the result your working reached), "teachingAnswer": string (a one-to-three sentence worked solution the tutor can reference: the clean final version, with no second thoughts or corrections), "responseFormat": "numeric"|"mcq", "hints": string[] (1-3 short hints), "choices"?: string[] (for mcq only)}`;

const BRAINGEN_VERIFY_SYSTEM = `You are a meticulous solver. Solve the problem and reply with ONLY the final answer — a single number (with units if natural) or a short phrase / the correct multiple-choice option. No working, no explanation, no restatement.`;

/** Output caps, thinking and time limits for the generator and its blind
 *  solver (2026-10-05).
 *
 *  The caps were 800 and 400, set when these roles ran a model that did not
 *  think before answering. The default model for both roles now THINKS BY
 *  DEFAULT when the request does not say otherwise, and thinking counts
 *  against `max_tokens`: on five hard skills (Riemann sums, Lewis structures,
 *  pedigrees, phylogenetic trees, sinusoidal models) 55 of 58 generator calls
 *  stopped at exactly 800 output tokens — 38 with a thinking block and NO text
 *  at all — and 3 of 30 slots produced an item.
 *
 *  Raising the cap to 4000 (with a retry at 12000) fixed the yield but not the
 *  cause: the generator then spent ~1,600 output tokens and 15 s (p50) —
 *  32 s p90, 44 s max, 85 s for one practice draw — thinking about a reply
 *  that is ~500 tokens of JSON. Measured on the same skills with thinking
 *  switched off for the GENERATOR: ~480 output tokens, 6.0 s p50 / 7.5 s max,
 *  no reply cut off, same yield (every item is still checked by the
 *  independent solver, which KEEPS its thinking — the key check is where
 *  reasoning matters).
 *
 *  So: the generator sends `thinking: { type: 'disabled' }` (the same switch
 *  the live brain uses — claude-brain.ts) with a cap sized for the reply
 *  alone, and is never re-asked at a higher cap. The solver is unchanged
 *  except that its one retry at `RETRY_MAX_TOKENS` is the caller's choice
 *  (off for the live tutor session). Every call has a hard timeout — the
 *  SDK default is 10 minutes with two silent retries. */
export const GEN_MAX_TOKENS = 2000;
export const VERIFY_MAX_TOKENS = 2500;
/** Cap for the single retry of a SOLVER reply cut off at the first cap. */
export const RETRY_MAX_TOKENS = 12000;
/** Hard per-call timeouts (ms). */
export const GEN_CALL_TIMEOUT_MS = 30_000;
export const VERIFY_CALL_TIMEOUT_MS = 45_000;
/** The live tutor session's whole budget for Layer-2 generation + verify: a
 *  voice turn waits at most this long before the bank / authored fallback. */
export const LIVE_BRAINGEN_BUDGET_MS = 12_000;

/** The slice of the SDK this module's text calls use (tests pass a fake). */
export interface TextCallClient {
  messages: {
    create(
      body: {
        model: string;
        max_tokens: number;
        system: string;
        messages: Array<{ role: 'user'; content: string }>;
        thinking?: { type: 'disabled' };
      },
      options?: { signal?: AbortSignal; timeout?: number; maxRetries?: number },
    ): Promise<{ content: Array<{ type: string; text?: string }>; stop_reason?: string | null }>;
  };
}

export interface TextCallOptions {
  /** 'disabled' sends `thinking: { type: 'disabled' }`; omitted sends no
   *  thinking parameter (the model's default). */
  thinking?: 'disabled';
  /** Ask ONCE more at this cap when the reply stops at the first cap. Omitted
   *  → never re-ask (the cut-off text is returned for the parser to reject). */
  retryMaxTokens?: number;
  /** Aborts the in-flight request (the call rejects). */
  signal?: AbortSignal;
  /** Hard per-request timeout. */
  timeoutMs?: number;
}

/** Per-pipeline call settings threaded through generate / verify. */
export interface GenCallOptions {
  signal?: AbortSignal;
  /** false → a solver reply cut off at the cap is NOT re-asked at
   *  `RETRY_MAX_TOKENS` (live tutor session). Default true. */
  retryCutOff?: boolean;
  /** Test seam: the client for both roles. */
  client?: TextCallClient;
}

/** True for the API's "this model does not take that thinking setting" 400. */
function isThinkingParamRejection(err: unknown): boolean {
  const e = err as { status?: number; message?: string } | null;
  return e?.status === 400 && /thinking/i.test(String(e?.message ?? ''));
}

/**
 * One text call → trimmed reply text.
 *
 * A reply that stops at the token cap (`stop_reason: "max_tokens"`) is
 * incomplete whatever it holds — possibly nothing but thinking. With
 * `retryMaxTokens` it is requested once more at that cap; without, or when
 * the retry is cut off too, whatever text exists is returned and the caller's
 * parser reports it as unusable.
 *
 * `thinking: 'disabled'` is dropped (once, for that call) when the endpoint
 * rejects the parameter by name, so a role pointed at a model that does not
 * take it still answers. Exported for tests.
 */
export async function callTextModel(
  client: TextCallClient,
  model: string,
  system: string,
  user: string,
  maxTokens: number,
  opts: TextCallOptions = {},
): Promise<string> {
  let thinking = opts.thinking;
  const requestOptions = {
    ...(opts.signal ? { signal: opts.signal } : {}),
    ...(opts.timeoutMs ? { timeout: opts.timeoutMs, maxRetries: 1 } : {}),
  };
  const send = (cap: number) =>
    client.messages.create(
      { model, max_tokens: cap, system, messages: [{ role: 'user', content: user }], ...(thinking ? { thinking: { type: thinking } } : {}) },
      requestOptions,
    );
  const ask = async (cap: number) => {
    let res;
    try {
      res = await send(cap);
    } catch (err) {
      if (!thinking || !isThinkingParamRejection(err)) throw err;
      console.warn(`[problem-generator] thinking_param_rejected model=${model} — retrying without it`);
      thinking = undefined;
      res = await send(cap);
    }
    const text = res.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .trim();
    return { text, cut: res.stop_reason === 'max_tokens' };
  };
  const first = await ask(maxTokens);
  const retryCap = opts.retryMaxTokens;
  if (!first.cut) return first.text;
  if (!retryCap || maxTokens >= retryCap) {
    console.warn(`[problem-generator] reply_cut_off model=${model} max_tokens=${maxTokens} text_len=${first.text.length} — not re-asked`);
    return first.text;
  }
  console.warn(`[problem-generator] reply_cut_off model=${model} max_tokens=${maxTokens} text_len=${first.text.length} — retrying once at ${retryCap}`);
  return (await ask(retryCap)).text;
}

/** Cap for the generator when its thinking is left on (see below). */
export const GEN_MAX_TOKENS_THINKING = 4000;

/**
 * Owner's switch back to a THINKING generator, without a deploy:
 * `TUTOR_BRAINGEN_THINKING=on` sends no thinking parameter (the model's
 * default) with the thinking-sized cap. Anything else — including unset — is
 * the fast default: thinking off. Read on every call. The time limits (the
 * practice draw's deadline, the live session's budget, the per-call timeout)
 * apply either way; a thinking generator is slower (15 s p50 measured) and
 * more of its slots will finish in the background.
 */
export function generatorThinkingOn(env: Record<string, string | undefined> = process.env): boolean {
  return env.TUTOR_BRAINGEN_THINKING === 'on';
}

/** The generator call: thinking off, reply-sized cap, never re-asked. The
 *  `thinking` parameter is Anthropic-only, so it is left out when the role
 *  points at another provider. */
async function callGenerator(user: string, opts: GenCallOptions = {}): Promise<string> {
  const thinks = generatorThinkingOn();
  return callTextModel(opts.client ?? (braingen.client as unknown as TextCallClient), BRAINGEN_MODEL, BRAINGEN_SYSTEM, user, thinks ? GEN_MAX_TOKENS_THINKING : GEN_MAX_TOKENS, {
    ...(braingen.native && !thinks ? { thinking: 'disabled' as const } : {}),
    signal: opts.signal,
    timeoutMs: GEN_CALL_TIMEOUT_MS,
  });
}

/** The independent solver call: the model's default thinking, one retry at
 *  the higher cap unless the caller turned it off. */
async function callSolver(user: string, opts: GenCallOptions = {}): Promise<string> {
  return callTextModel(opts.client ?? (braingenVerify.client as unknown as TextCallClient), BRAINGEN_VERIFY_MODEL, BRAINGEN_VERIFY_SYSTEM, user, VERIFY_MAX_TOKENS, {
    ...(opts.retryCutOff === false ? {} : { retryMaxTokens: RETRY_MAX_TOKENS }),
    signal: opts.signal,
    timeoutMs: VERIFY_CALL_TIMEOUT_MS,
  });
}

export interface GenPayload {
  problemText: string;
  finalAnswer: string;
  teachingAnswer?: string;
  responseFormat?: 'numeric' | 'mcq';
  hints?: string[];
  choices?: string[];
  /** Practice-gen only (its prompt asks for these; the tutor-session prompt
   *  does not, so they stay undefined there): the answer kind, and for
   *  `free` the canonical short answer + optional one-line model response. */
  answerKind?: 'numeric' | 'mcq' | 'free';
  expectedAnswer?: string;
  modelResponse?: string;
  /** Practice-gen only: the model whose INDEPENDENT solve agreed with this
   *  payload's answer (set by the answer gate), or 'unverified' when the item
   *  was admitted without one. Stamped as the bank row's `verifierModel`. */
  verifierModel?: string;
}

/** Why a model reply could not be turned into a candidate. */
export type GenParseFailure = 'unparseable_json' | 'missing_problem_text' | 'missing_final_answer';
export type GenParseResult = { ok: true; gen: GenPayload } | { ok: false; reason: GenParseFailure };

/** The reply as a JSON object: the first JSON object in it — the whole reply
 *  when it is one (the prompt asks for exactly that), else the object inside
 *  a sentence or a fenced code block. Shared reader (`ai/model-json.ts`), so
 *  LaTeX backslashes inside the strings are kept as text. */
function replyJsonObject(raw: string): Record<string, unknown> | null {
  return parseJsonObjects(raw)[0] ?? null;
}

/**
 * Parse the generator model's reply, saying WHY when it cannot be used.
 * Tolerant in three ways: prose or a code fence around the JSON object and a
 * numeric `finalAnswer` (2026-10-04); and LaTeX backslashes inside strings
 * (2026-10-05). The last one was first left alone ("guessing at a repair
 * could change the problem's maths") — but NOT repairing is what changed the
 * maths: `\frac`, `\times`, `\nabla`, `\beta`, `\rho` are valid JSON
 * escapes, so they parsed without error into a form feed / tab / newline /
 * backspace / carriage return and the problem text was stored corrupt, while
 * `\sqrt` (not an escape) threw the whole problem away. The repair only
 * doubles the backslash of a LaTeX command; real `\n` line breaks stay.
 */
export function parseGenPayloadDetailed(raw: string): GenParseResult {
  const j = replyJsonObject(raw);
  if (!j) return { ok: false, reason: 'unparseable_json' };
  if (typeof j.problemText !== 'string' || !j.problemText.trim()) return { ok: false, reason: 'missing_problem_text' };
  const answerKind = j.answerKind === 'free' || j.answerKind === 'mcq' || j.answerKind === 'numeric' ? j.answerKind : undefined;
  const expectedAnswer = typeof j.expectedAnswer === 'string' ? j.expectedAnswer.trim() : undefined;
  // `"finalAnswer": 48` — the model answered a numeric problem with a JSON number.
  const claimed =
    typeof j.finalAnswer === 'number' && Number.isFinite(j.finalAnswer)
      ? String(j.finalAnswer)
      : typeof j.finalAnswer === 'string' ? j.finalAnswer.trim() : '';
  // A free-kind payload may carry its answer only in expectedAnswer.
  const finalAnswer = claimed || (answerKind === 'free' && expectedAnswer ? expectedAnswer : '');
  if (!finalAnswer) return { ok: false, reason: 'missing_final_answer' };
  const strArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : undefined;
  return {
    ok: true,
    gen: {
      problemText: j.problemText.trim(),
      finalAnswer,
      teachingAnswer: typeof j.teachingAnswer === 'string' ? j.teachingAnswer.trim() : undefined,
      responseFormat: j.responseFormat === 'mcq' ? 'mcq' : 'numeric',
      hints: strArr(j.hints),
      choices: strArr(j.choices),
      ...(answerKind ? { answerKind } : {}),
      ...(expectedAnswer !== undefined ? { expectedAnswer } : {}),
      ...(typeof j.modelResponse === 'string' && j.modelResponse.trim() ? { modelResponse: j.modelResponse.trim() } : {}),
    },
  };
}

export function parseGenPayload(raw: string): GenPayload | null {
  const parsed = parseGenPayloadDetailed(raw);
  return parsed.ok ? parsed.gen : null;
}

/**
 * The ONE log line for a reply that yielded no candidate: the reason, the
 * reply's length (a reply cut off at the token cap shows as a long reply
 * with reason=unparseable_json) and its first 300 characters on a single
 * line. Model output about a practice problem only — never the prompt.
 */
export function describeUnusableGenReply(reason: GenParseFailure, raw: string): string {
  return `[problem-generator] candidate_unusable reason=${reason} len=${raw.length} head=${JSON.stringify(raw.replace(/\s+/g, ' ').trim().slice(0, 300))}`;
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
  excludeHashes: string[] = [],
  callOpts: GenCallOptions = {},
): Promise<GenAndVerifyResult | null> {
  const raw = await callGenerator(userPrompt, callOpts);
  const parsed = parseGenPayloadDetailed(raw);
  if (!parsed.ok) {
    // The raw reply used to be discarded here, which left a production
    // `practice_gen_gate_failed reason=no_candidate` with nothing to read.
    console.warn(describeUnusableGenReply(parsed.reason, raw));
    return null;
  }
  const gen = parsed.gen;
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
  excludeHashes: string[] = [],
  callOpts: GenCallOptions = {},
): Promise<GenAndVerifyResult | null> {
  const candidate = await generateCandidate(userPrompt, excludeHashes, callOpts);
  if (!candidate) return null;
  const { gen, hash } = candidate;
  // Independent solve — the verifier only sees the problem text.
  const solved = await callSolver(gen.problemText, callOpts);
  if (!answersAgree(gen.finalAnswer, solved)) return null;
  return { gen, hash };
}

/** `generateAndVerifyOnce` with 1 retry on failure (temperature yields a
 *  different problem the second time). Same retry shape the tutor-session
 *  pipeline has always used. */
export async function generateAndVerifyWithRetry(
  userPrompt: string,
  excludeHashes: string[] = [],
  callOpts: GenCallOptions = {},
): Promise<GenAndVerifyResult | null> {
  const first = await generateAndVerifyOnce(userPrompt, excludeHashes, callOpts);
  if (first) return first;
  return generateAndVerifyOnce(userPrompt, excludeHashes, callOpts); // 1 retry
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
  absDifficulty: IProblemBank['difficulty'],
  callOpts: GenCallOptions = {},
): Promise<GeneratedProblem | null> {
  const los = input.plan.los.map((lo) => `- ${lo.description}`).join('\n');
  const userPrompt =
    `ANCHOR problem (do NOT reuse its numbers or context):\n${input.anchor.statement}\n` +
    (input.anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${input.anchor.expectedAnswer}\n` : '') +
    `\nLearning objectives of this lesson:\n${los}\n` +
    `\nRequested difficulty relative to the anchor: ${input.difficulty}. Write the fresh problem now.`;

  const result = await generateAndVerifyWithRetry(userPrompt, input.excludeHashes ?? [], callOpts);
  if (!result) return null;
  // Finished after the caller's budget ran out (a client that did not honour
  // the abort): the caller has already fallen back — serve and store nothing.
  if (callOpts.signal?.aborted) return null;
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
export function planAuthoredFallback(
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
    // A try-yourself withdrawn by the answer-key audit is never re-served
    // as the fallback problem: this path returns the STORED expectedAnswer
    // (which the client then pins as the verified key), and that key is the
    // thing the audit flagged.
    if (isWithdrawnSegment(plan.id, ty.id)) {
      logWithdrawnSkip(`${plan.id}::${ty.id}`);
      continue;
    }
    // Same rule for a try-yourself whose creation-time key check did not
    // verify the key (mismatch / ill-posed / unverifiable): the stored
    // expectedAnswer would be pinned as the verified key.
    if (keyCheckUntrusted(ty)) {
      logUnverifiedKeySkip(`${plan.id}::${ty.id}`, ty);
      continue;
    }
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

/**
 * The anchor the pipeline may use. When the anchor statement IS one of the
 * plan's withdrawn try-yourselves (answer-key audit) — or one whose
 * creation-time key check did not verify the key — its answer is dropped:
 * the stored key is wrong or unreliable, and Layer 2 quotes the anchor answer
 * to the generator ("for difficulty calibration"), which would seed a fresh
 * problem from it. The statement stays (the question is still presented).
 * Whitespace-insensitive match; any other anchor is returned untouched.
 *
 * Deliberately keyed on the STATEMENT, not on where the answer came from: the
 * brain no longer sees a withdrawn key (formatSegmentTruth), so an
 * `anchorAnswer` it passes is its own working — but nothing verified it
 * either, and "no answer" is always a safe calibration input.
 */
export function effectiveAnchor(
  plan: LessonPlan,
  anchor: GenerateProblemInput['anchor'],
): GenerateProblemInput['anchor'] {
  if (anchor.expectedAnswer === undefined) return anchor;
  const norm = (t: string) => t.replace(/\s+/g, ' ').trim();
  const stmt = norm(anchor.statement);
  const hit = plan.segments.some(
    (s) => s.kind === 'try_yourself' && segmentKeyUntrusted(plan.id, s) && norm(s.problem) === stmt,
  );
  if (!hit) return anchor;
  const { expectedAnswer: _dropped, ...rest } = anchor;
  void _dropped;
  console.log('[problem-generator] anchor is a withdrawn / unverified-key try-yourself — anchor answer dropped');
  return rest;
}

/** extractAnswerNumber / normMcqText / resolveMcqLetter moved VERBATIM to
 *  answer-primitives.ts (2026-08-10 hotfix): this module is server-only
 *  (ProblemBank/connectDB imports), but the R43 client-side comparator needs
 *  those pure primitives — importing them from here dragged mongoose into
 *  the browser bundle and crashed /tutor. Re-exported so existing consumers
 *  are unchanged. */
import { extractAnswerNumber, normMcqText, resolveMcqLetter } from './answer-primitives';
export { extractAnswerNumber, resolveMcqLetter } from './answer-primitives';

/** An inequality comparator: typed, Unicode or LaTeX. `=` is deliberately not
 *  one — "x = 5" is a plain-number answer and keeps the numeric path. */
const INEQUALITY_RE = /<=|>=|[<>≤≥≠]|\\(?:leq?|geq?|lt|gt|neq?)(?![a-zA-Z])/;

/** Notation-only clean-up that KEEPS comparators (unlike the alphanumeric
 *  `norm` below, under which "x > 3" and "x < 3" are the same string). */
function normKeepComparators(s: string): string {
  return (s ?? '')
    .replace(/[−–—]/g, '-')
    .replace(/≤|\\leq?(?![a-zA-Z])/g, '<=')
    .replace(/≥|\\geq?(?![a-zA-Z])/g, '>=')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/≠|\\neq?(?![a-zA-Z])/g, '!=')
    .replace(/\$|\\left|\\right|\\\(|\\\)/g, '')
    .replace(/\s+/g, '')
    .replace(/[.;,]+$/, '')
    .toLowerCase();
}

/** Whether a generated problem's stated answer and an INDEPENDENT solve agree
 *  well enough to serve the problem to a student. Numeric → 1%-or-0.01
 *  tolerance (same rule as portal assessment grading); otherwise normalized
 *  short-exact equality (mcq letters, one-word answers). Anything that can't
 *  be matched this way returns false → the caller falls back to the authored
 *  problem (never serve an unverified generated problem).
 *
 *  INEQUALITIES (2026-10-04): when either answer contains an inequality
 *  comparator the two are compared as SOLUTION SETS (`compareRelationTexts`),
 *  never by their first number — "−4 < x ≤ 2" and "−4 ≤ x < 2" used to
 *  "agree" because both start with −4, and "x > 3" agreed with "x < 3". When
 *  the relation comparator cannot read one side (interval notation, "or"
 *  compounds, a bare number against an inequality) the answers agree only if
 *  they are the same text after notation clean-up: fail closed. Answers with
 *  no comparator are untouched. */
export function answersAgree(genAnswer: string, solveAnswer: string): boolean {
  if (INEQUALITY_RE.test(genAnswer ?? '') || INEQUALITY_RE.test(solveAnswer ?? '')) {
    const cmp = compareRelationTexts(genAnswer ?? '', solveAnswer ?? '');
    if (cmp.verdict === 'equivalent') return true;
    if (cmp.verdict === 'differs') return false;
    const ka = normKeepComparators(genAnswer);
    return !!ka && ka === normKeepComparators(solveAnswer);
  }
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
  choices?: Array<{ letter: string; text: string }>,
  callOpts: GenCallOptions = {},
): Promise<{ agree: boolean; solved: string }> {
  const hasChoices = Array.isArray(choices) && choices.length > 0;
  const solverInput = hasChoices
    ? `${problemText}\n\nAnswer choices:\n${choices!.map((c) => `${c.letter}) ${c.text}`).join('\n')}\n\nThis is multiple-choice: reply with ONLY the letter of the correct choice.`
    : problemText;
  const solved = await callSolver(solverInput, callOpts);
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
 * Layer 2 for the LIVE tutor session, inside a hard time budget (2026-10-05).
 *
 * The session's voice turn awaits this inline (brain/stream `generate_problem`).
 * Before the caps were raised a failing generation gave up in ~10 s and the
 * turn fell back to the bank / authored problem; with thinking-sized caps and
 * the 12000-token re-ask it could hold the turn for 45–85 s. Here the whole
 * of generate + verify (both attempts) gets `budgetMs`; when it runs out the
 * in-flight request is aborted and null is returned — the pipeline's existing
 * fallback — and a cut-off solver reply is never re-asked at the higher cap.
 * Never throws for a timeout. `client` is the test seam.
 */
export async function brainGenWithinBudget(
  input: GenerateProblemInput,
  absDifficulty: IProblemBank['difficulty'],
  budgetMs: number = LIVE_BRAINGEN_BUDGET_MS,
  client?: TextCallClient,
): Promise<GeneratedProblem | null> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const outOfTime = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), budgetMs);
  });
  const work = brainGenWithVerify(input, absDifficulty, { signal: controller.signal, retryCutOff: false, ...(client ? { client } : {}) });
  // Once the budget has won the race nobody awaits `work`; its abort
  // rejection must not surface as an unhandled rejection.
  work.catch(() => {});
  try {
    const first = await Promise.race([work, outOfTime]);
    if (first !== 'timeout') return first;
    controller.abort();
    console.warn(`[problem-generator] brain_gen_budget_exceeded budget_ms=${budgetMs} topic=${input.topic} — falling back`);
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Run the 4-layer pipeline. Always returns a problem (Layer 4 is
 * the ultimate fallback) unless the plan has zero try_yourselves.
 */
export async function generateProblem(
  rawInput: GenerateProblemInput
): Promise<{ result: GeneratedProblem | null; telemetry: PipelineTelemetry }> {
  // One place for both callers (brain stream route + /api/tutor/generate-problem):
  // never anchor on a withdrawn segment's answer.
  const anchor = effectiveAnchor(rawInput.plan, rawInput.anchor);
  const input: GenerateProblemInput = anchor === rawInput.anchor ? rawInput : { ...rawInput, anchor };
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
      const gen = await brainGenWithinBudget(input, absDifficulty, input.brainGenBudgetMs ?? LIVE_BRAINGEN_BUDGET_MS, input.brainGenClient);
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
