/**
 * Design B — generate-on-exhaustion (Task 3).
 *
 * When a student's fresh Practice pool for an LO runs dry, `retrievePractice`
 * (practice.ts) hands the shortfall to `generatePracticeItems` here. It
 * reuses the EXACT same generator the tutor session's Layer-2 brain-gen uses
 * (`generateCandidate` in `../voice/problem-generator` — same model, same
 * prompt shape) rather than forking a second generation path, but applies
 * its OWN stricter answer-shape verification on top (see `gateGeneratedAnswer`
 * below) instead of the tutor-session's blind-solve gate. What's different
 * from the tutor-session path:
 *
 *   - Answer-shape gate (round-1 review fix): the tutor session embeds
 *     answers into conversational context, so a unit-suffixed numeric answer
 *     ("48 square inches") or a blind mcq solve never surfaces as a bug. The
 *     Practice bank is machine-graded (`Number(answer)`), so every generated
 *     numeric answer must reduce to a bare number string and every mcq answer
 *     must resolve, CHOICES-AWARE, to a bare letter matching a real choice —
 *     enforced before persist AND before serve. Anything that fails is
 *     dropped (counts as a failed generation, never served, never banked).
 *   - No plan scoping: generated rows are LO-global (`practice-gen.<loId>.<hash>`,
 *     no `subtopic`), because Practice retrieval has no single owning plan.
 *   - Anchor comes from an ALREADY-FETCHED same-LO item (bank or plan
 *     try-yourself) that the caller passes in, not a live tutoring-session
 *     "last try-yourself" — Practice has no session state.
 *   - Bounded by day-bucketed Mongo counters (`practicegencounters`) instead
 *     of a per-topic brainGen rollout state: ≤2 generations per request (run
 *     in parallel), per-(student,LO)/day cap 20, global/day cap 500.
 *   - Gated by the `PRACTICE_GEN` env kill-switch (anything but the literal
 *     `'on'` is OFF — safe default when unset).
 *
 * Every generated item passes independent verification AND the answer-shape
 * gate before it is ever returned or persisted — mcq/numeric by the blind
 * re-solve (`verifyClaimedAnswer`), free-text by the shared creation-time key
 * verifier (./key-verify.ts, 2026-10-04; free answers used to pass on shape
 * alone and were still stamped as verified). Any failure anywhere in this
 * module (cap check, generation, verification, persistence) degrades to
 * fewer items — it must never throw out of `generatePracticeItems` itself
 * (the one exception being deliberately-injected test doubles that choose to
 * reject their promise, which the parallel-generation Promise.allSettled here
 * already absorbs per-item).
 *
 * The `sources` parameter mirrors `PracticeSources` in practice.ts: the real
 * implementation talks to Anthropic + Mongo; tests inject a stub so the caps,
 * verify-gate, and anchor logic are unit-testable without either.
 */

import connectDB from '@core/db';
import { essayGenBlockEnabled, isEssayPracticeLoId, looksLikeRubricKey } from './essay-practice';
import { ProblemBank } from '@/models/ProblemBank';
import { PracticeGenCounter } from '@/models/PracticeGenCounter';
import {
  generateCandidate,
  verifyClaimedAnswer,
  resolveMcqLetter,
  extractAnswerNumber,
  simpleHash,
  BRAINGEN_VERIFY_MODEL,
  type GenPayload,
} from '../voice/problem-generator';
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { isWithdrawnItem, logWithdrawnSkip } from './withdrawn-items';
import { auditedOnlyForPartner } from './audited-items';
import { findNearDuplicate, type ComparableItem } from './practice-similarity';
import { keyVerifyEnabled, verifyAnswerKey, type VerifyAnswerKeyInput, type VerifyAnswerKeyResult } from './key-verify';

type Difficulty = 1 | 2 | 3 | 4;

/** ≤2 generations per request, run in parallel (spec bound). */
export const MAX_GENERATIONS_PER_REQUEST = 2;
/** Per-(student, LO) daily cap (spec bound). */
export const PER_STUDENT_LO_DAILY_CAP = 20;
/** Global daily cap across all students/LOs (spec bound) — the default. */
export const GLOBAL_DAILY_CAP = 500;
/** Largest value `PRACTICE_GEN_GLOBAL_DAILY_CAP` may set. */
export const GLOBAL_DAILY_CAP_MAX = 5000;

/**
 * The global daily cap in force: `PRACTICE_GEN_GLOBAL_DAILY_CAP` when it is a
 * whole number from 1 to `GLOBAL_DAILY_CAP_MAX`, else the default 500 (unset,
 * empty, not a number, a decimal, zero, negative, or above the maximum — a
 * typo must never remove the cost ceiling or switch generation off). Read on
 * every call, so restarting the process with the variable set is enough.
 */
export function globalDailyCap(env: Record<string, string | undefined> = process.env): number {
  const raw = (env.PRACTICE_GEN_GLOBAL_DAILY_CAP ?? '').trim();
  if (!/^\d+$/.test(raw)) return GLOBAL_DAILY_CAP;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 1 && n <= GLOBAL_DAILY_CAP_MAX ? n : GLOBAL_DAILY_CAP;
}
/** Fallback difficulty bucket when neither the request nor an anchor names
 *  one — mirrors problem-generator.ts's `resolveAbsoluteDifficulty` default. */
const DEFAULT_DIFFICULTY: Difficulty = 2;

function practiceGenEnabled(): boolean {
  // Kill-switch: anything but the literal 'on' is OFF, including unset.
  return process.env.PRACTICE_GEN === 'on';
}

/**
 * Per-partner switch: `PRACTICE_GEN_DISABLED_PARTNERS` = comma-separated
 * partner ids for which on-demand generation never runs (the practice
 * endpoint and the end-of-session top-up then serve stored items only).
 * Read at CALL time, trimmed, case-insensitive, whole ids only; unset or
 * empty ⇒ nobody is disabled. An absent/blank `partnerId` (unknown caller)
 * is never "listed". Independent of the global PRACTICE_GEN kill switch,
 * which still has to be 'on' for anyone to generate.
 */
export function practiceGenDisabledForPartner(
  partnerId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env.PRACTICE_GEN_DISABLED_PARTNERS;
  if (!raw) return false;
  const id = (partnerId ?? '').trim().toLowerCase();
  if (!id) return false;
  return raw.split(',').some((p) => p.trim().toLowerCase() === id);
}

/** A verified generated row ready to persist into ProblemBank. */
export interface PracticeGenPersistRow {
  id: string;
  topic: string;
  /** Optional companion to `topic` — mirrors ProblemBank's `topicId`, so
   *  `bankForTopic`'s `$or: [{topic}, {topicId}]` query matches this row
   *  the same way it matches hand-authored corpus rows. */
  topicId?: string;
  loId: string;
  cedCode?: string;
  difficulty: Difficulty;
  gen: GenPayload;
}

/**
 * Injectable dependencies for `generatePracticeItems`, mirroring how
 * `PracticeSources` makes `retrievePractice` unit-testable without Mongo.
 * The real implementation (`practiceGenSources`) hits Anthropic (via the
 * shared generator + this module's own answer-shape gate) and Mongo; tests
 * supply a stub.
 */
export interface PracticeGenSources {
  /** One generate+verify attempt (with the pipeline's built-in 1 retry)
   *  against a fully-built prompt. `excludeHashes` seeds cross-content dedup
   *  (the caller's already-known same-LO item hashes). Returns null when
   *  generation, verification, or the answer-shape gate failed — caller must
   *  not serve or persist. */
  generateAndVerify(
    userPrompt: string,
    excludeHashes: string[],
    /** Called once per rejected candidate with the gate branch that rejected
     *  it (`GateFailReason`, or 'no_candidate' when generation itself
     *  produced nothing) — the visible-outcome hook (2026-10-02). */
    onGateFailed?: (reason: string) => void,
    /** Aborts the slot's in-flight model calls (the request's hard limit). */
    signal?: AbortSignal,
  ): Promise<{ gen: GenPayload; hash: string } | null>;
  /** Reserve up to `n` generation slots for (studentId, loId) today, honoring
   *  the per-(student,LO) and global daily caps. Returns the number actually
   *  granted (0..n) — 0 means "over cap, generate nothing". */
  reserve(studentId: string, loId: string, n: number): Promise<number>;
  /** Persist one verified generated item permanently into the bank. */
  persist(row: PracticeGenPersistRow): Promise<void>;
  /** Give back `n` of the (student, LO) slots reserved at `reservedAt` — for
   *  a slot that produced nothing because a model call FAILED (HTTP error,
   *  timeout, abort), never for one the gates rejected. Optional: a source
   *  without it keeps the previous behaviour (the slot stays counted). */
  release?(studentId: string, loId: string, n: number, reservedAt: Date): Promise<void>;
}

export interface GeneratePracticeItemsOptions {
  /** The caller established that `loId` is an essay-practice node by its
   *  owning plan (essay-practice.ts `isEssayPracticeNode`) — generate
   *  nothing. The LO-id convention is checked here regardless. */
  essayNode?: boolean;
  /** The requesting partner. Listed in PRACTICE_GEN_AUDITED_ONLY_PARTNERS ⇒
   *  same outcome as below (nothing generated). Listed in PRACTICE_GEN_DISABLED_PARTNERS ⇒
   *  generate nothing (no reservation, no model call). Absent ⇒ unknown
   *  caller, never treated as listed. */
  partnerId?: string;
  studentId: string;
  loId: string;
  /** Topic id (topic-taxonomy vocabulary) — tagged onto generated rows the
   *  same way bank rows are. Derived engine-side by the caller from the LO's
   *  OWNING plan (never the portal's `courseId`, which is a Mongo ObjectId on
   *  the real wire, not a topic id). */
  topic: string;
  /** Companion topicId tag — see `PracticeGenPersistRow.topicId`. */
  topicId?: string;
  cedCode?: string;
  difficulty?: Difficulty;
  /** How many items retrieval alone came up short by. Capped at
   *  `MAX_GENERATIONS_PER_REQUEST` internally. */
  shortfall: number;
  /** Existing same-LO items (bank + plan try-yourself) already fetched by
   *  the caller — sampled for a generation anchor AND seeded as exclude-hash
   *  context (a regeneration shouldn't just reproduce known content
   *  verbatim). Empty for a brand-new LO with zero existing practice (the
   *  fresh-LO edge case: the prompt falls back to the LO id + topic alone,
   *  since Practice items carry no free-text LO description at this layer). */
  anchorItems: PracticeItem[];
  /** True when the LO's authored practice includes drawing-only tasks that
   *  the caller withheld (practice.ts `planToItems` drops them before they can
   *  be anchors, so the generator cannot see them in `anchorItems`). With no
   *  typed-answer anchor to prompt from, the prompt then asks for a
   *  typed/choice question on the same skill (`buildUserPrompt`'s drawing-LO
   *  branch) instead of claiming the LO is brand-new. A drawing instruction
   *  among `anchorItems` sets the same condition without this flag. */
  authoredDrawingTasks?: boolean;
  /** The LO's human title/description, when the caller has one. Used ONLY by
   *  the drawing-LO branch (the LO id alone is often opaque, `<plan>.lo-2`);
   *  the anchor and brand-new-LO prompts are unchanged by it. */
  loTitle?: string;
  /** Visible outcomes (2026-10-02): `practice_gen_empty` (`loId=… topic=…
   *  attempts=N`) when generation ran and produced nothing, and
   *  `practice_gen_gate_failed` (`loId=… reason=…`) per rejected candidate.
   *  Server callers log these (`logPracticeGenEvent`); there is no
   *  debug-event stream server-side. */
  onDebugEvent?: (type: string, message: string) => void;
  /** INTERACTIVE draws only (the practice endpoint): return after this many
   *  ms with whatever verified items are ready. Slots still running are NOT
   *  cancelled — they finish in the background, pass the same gates and are
   *  stored, so the next draw finds them in the bank. Omitted → wait for
   *  every slot (session-end top-up, assessments, scripts). */
  deadlineMs?: number;
}

/** The practice endpoint's generation deadline: a draw answers in about this
 *  long at worst (the academy proxies it with a 60 s limit). */
export const PRACTICE_DRAW_DEADLINE_MS = 35_000;
/** Hard limit for one request's slots, foreground or background: at this
 *  point the in-flight model calls are aborted. */
export const PRACTICE_GEN_HARD_LIMIT_MS = 150_000;

/** Server-side sink for `onDebugEvent`: one `[practice-gen] <type> <message>`
 *  log line per event (retrievePractice, the session-end draft top-up). */
export function logPracticeGenEvent(type: string, message: string): void {
  console.log(`[practice-gen] ${type} ${message}`);
}

/** UTC calendar day, `YYYY-MM-DD` — the counter collection's bucket key. */
function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/** Real cap check: reserve BEFORE generating, so a slow/failed generation
 *  still counts against the day's cost ceiling instead of being retried
 *  unboundedly. Best-effort under concurrency (see PracticeGenCounter's
 *  doc comment) — an accepted trade-off for a soft cost bound. */
async function mongoReserve(studentId: string, loId: string, n: number, now: Date = new Date()): Promise<number> {
  if (n <= 0) return 0;
  await connectDB();
  const day = utcDay(now);
  const studentKey = `${studentId}::${loId}`;
  const [studentDoc, globalDoc] = await Promise.all([
    PracticeGenCounter.findOne({ scopeKey: studentKey, day }).lean(),
    PracticeGenCounter.findOne({ scopeKey: 'global', day }).lean(),
  ]);
  const studentCount = (studentDoc as { count?: number } | null)?.count ?? 0;
  const globalCount = (globalDoc as { count?: number } | null)?.count ?? 0;
  const studentRoom = Math.max(0, PER_STUDENT_LO_DAILY_CAP - studentCount);
  const globalRoom = Math.max(0, globalDailyCap() - globalCount);
  const allowed = Math.min(n, studentRoom, globalRoom);
  if (allowed <= 0) return 0;
  await Promise.all([
    PracticeGenCounter.updateOne({ scopeKey: studentKey, day }, { $inc: { count: allowed } }, { upsert: true }),
    PracticeGenCounter.updateOne({ scopeKey: 'global', day }, { $inc: { count: allowed } }, { upsert: true }),
  ]);
  return allowed;
}

/**
 * Give back reserved (student, LO) slots whose generation FAILED on the
 * model call itself (2026-10-05). Only the per-(student, LO) counter is
 * decremented: the GLOBAL counter is the cost ceiling, and a failed call may
 * still have been billed, so it stays counted there. Without this, a provider
 * outage or a run of timeouts used up a student's 20 a day for a skill with
 * nothing to show for it. Never below zero; the day is the reservation's.
 */
async function mongoRelease(studentId: string, loId: string, n: number, reservedAt: Date): Promise<void> {
  if (n <= 0) return;
  await connectDB();
  await PracticeGenCounter.updateOne(
    { scopeKey: `${studentId}::${loId}`, day: utcDay(reservedAt), count: { $gte: n } },
    { $inc: { count: -n } },
  );
}

/** The bank/served response format of a GATED payload: `free` items are
 *  graded by the free-response judge; otherwise mcq or numeric as before. */
function bankResponseFormat(gen: GenPayload): 'mcq' | 'numeric' | 'free' {
  if (gen.answerKind === 'free') return 'free';
  return gen.responseFormat === 'mcq' ? 'mcq' : 'numeric';
}

/** Write-back: persist a verified generated item permanently into
 *  ProblemBank. `practice-gen.*` rows are LO-global by design (no
 *  `subtopic`), `license: 'internal-original'`, matching the spec's bank
 *  conventions. Idempotent — keyed on the content-hash id, so a duplicate
 *  generation collapses to a no-op. */
async function mongoPersist(row: PracticeGenPersistRow): Promise<void> {
  await connectDB();
  await ProblemBank.updateOne(
    { id: row.id },
    {
      $setOnInsert: {
        id: row.id,
        topic: row.topic,
        ...(row.topicId ? { topicId: row.topicId } : {}),
        loId: row.loId,
        ...(row.cedCode ? { cedCode: row.cedCode } : {}),
        difficulty: row.difficulty,
        problemText: row.gen.problemText,
        answer: row.gen.finalAnswer,
        solutionText: row.gen.teachingAnswer ?? row.gen.modelResponse,
        hints: row.gen.hints,
        responseFormat: bankResponseFormat(row.gen),
        choices: row.gen.answerKind === 'free' ? undefined : row.gen.choices,
        source: { name: 'Evelyn (practice-gen runtime)' },
        license: 'internal-original',
        verifiedAt: new Date(),
        // The model whose independent solve agreed with the answer — set by
        // the answer gate (`checkGeneratedAnswer`). Never claim a solve that
        // did not happen: a `free` row that reaches here without one (only
        // possible with TUTOR_KEY_VERIFY_AT_CREATION=off, or a caller that
        // bypassed the gate) is stamped 'unverified', the same marker the
        // seed scripts write under --no-verify. (`verifiedAt` is a required
        // column; for such a row it is only the insert time.)
        verifierModel: row.gen.verifierModel ?? (row.gen.answerKind === 'free' ? UNVERIFIED_MODEL : BRAINGEN_VERIFY_MODEL),
      },
    },
    { upsert: true },
  );
}

/** `verifierModel` of a bank row whose answer no independent solve confirmed. */
export const UNVERIFIED_MODEL = 'unverified';

/** Injectable independent key check for `free` answers — defaults to the
 *  shared creation-time verifier (./key-verify.ts); tests inject a fake. */
export type KeyVerifyFn = (input: VerifyAnswerKeyInput) => Promise<Pick<VerifyAnswerKeyResult, 'status' | 'model'>>;

/** Injectable choices-aware/blind verify call, matching
 *  `verifyClaimedAnswer`'s signature — defaults to the real implementation;
 *  tests inject a stub so `gateGeneratedAnswer` is unit-testable without
 *  Anthropic. */
export type VerifyFn = (
  problemText: string,
  claimedAnswer: string,
  choices?: Array<{ letter: string; text: string }>,
) => Promise<{ agree: boolean; solved: string }>;

/** Plain-number regex — the bank/grader convention ("48", "-7", "4.5"). */
const PLAIN_NUMBER_RE = /^-?\d+(?:\.\d+)?$/;

/**
 * Normalize a numeric answer to the bank's plain-number-string convention.
 * Already-plain strings pass through unchanged. A unit suffix or currency/
 * comma-thousands wrapper is stripped ONLY when the string carries exactly
 * one unambiguous numeric value ("48 square inches" -> "48", "$4.50" ->
 * "4.5", "300,000 J" -> "300000") — a simple a/b fraction counts as one
 * unambiguous value too. Percent is its OWN case: the PORTAL grader's
 * `parseNum` (PracticeView.tsx) strips a trailing '%' WITHOUT rescaling, so
 * ANY unambiguous percent-bearing string keeps the bare numeral regardless of
 * surrounding prose ("50%" -> "50", "approximately 50%" -> "50", "a 40%
 * discount" -> "40", ".5%" -> "0.5") — never the /100-divided form
 * `extractAnswerNumber` would otherwise produce for the TUTOR's
 * `answersAgree` (round-3 review: the round-2 fix only caught the EXACT
 * "<number>%" form; prose-wrapped percents were still falling through to the
 * generic path and getting divided). Anything with zero or MORE THAN ONE
 * numeric run (e.g. "between 3 and 5", or a multi-run percent string like
 * "between 30% and 50%") is rejected rather than guessed: the real-bank
 * audit that motivated this gate found a live case where an unnormalized
 * unit-suffixed answer reached `Number(answer)` = NaN in the portal grader,
 * permanently failing every student who saw the item.
 */
export function normalizeNumericAnswer(raw: string): string | null {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return null;
  if (PLAIN_NUMBER_RE.test(trimmed)) return trimmed;

  // Collapse thousands-separator commas ("300,000" -> "300000") and fix a
  // leading-dot decimal (".5%" -> "0.5%") BEFORE counting numeric runs, so
  // neither trips the run-count ambiguity check below (a bare ".5" has no
  // digit before the dot, so the run regex wouldn't otherwise see it as a
  // number at all).
  const collapsed = trimmed
    .replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1')
    .replace(/(^|[^\d.])\.(\d)/g, '$10.$2');

  // An exact fraction of two integers (`5/6`, `\frac{5}{13}`, `-7/3 m/s`)
  // stays a fraction key unless it is a whole number or a terminating
  // decimal — see `exactFractionKey`. ONLY when what follows it is nothing,
  // or a plain unit: "4/3 π" is 4.19, not 4/3 (`isPlainUnit`).
  const fraction = collapsed
    .replace(/[−–]/g, '-')
    .replace(/\\[dt]?frac\{\s*(-?\d+)\s*\}\{\s*(-?\d+)\s*\}/g, '$1/$2')
    .replace(/^\$|\$$/g, '')
    .match(/^(-?\d+)\s*\/\s*(-?\d+)(?:\s+(\S.*))?$/);
  if (fraction && (fraction[3] === undefined || isPlainUnit(fraction[3]))) {
    return exactFractionKey(Number(fraction[1]), Number(fraction[2]));
  }

  const isSimpleFraction = /^-?\d+(?:\.\d+)?\s*\/\s*-?\d+(?:\.\d+)?$/.test(collapsed);
  const runs = collapsed.match(/-?\d+(?:\.\d+)?/g) ?? [];
  if (runs.length === 0) return null; // no number at all
  if (runs.length > 1 && !isSimpleFraction) return null; // ambiguous — reject rather than guess, even if percent-flavored

  // Percent — a single unambiguous run alongside a '%' ANYWHERE in the
  // string (not just an exact "<number>%" match) keeps the bare numeral. Must
  // run AFTER the ambiguity check above, and BEFORE the generic
  // `extractAnswerNumber` call below (which would otherwise divide by 100).
  if (runs.length === 1 && /%/.test(collapsed)) {
    return runs[0];
  }

  const n = extractAnswerNumber(collapsed);
  if (n === null || !Number.isFinite(n)) return null;
  // A value COMPUTED here (a decimal fraction, a multiple of π, a root) is a
  // floating-point number: `String(n)` of a non-terminating one is a 16-digit
  // key ("0.8333333333333334") that no student can type. Such an answer has
  // no plain-number key — reject it (the prompt asks for a stated precision
  // or an exact fraction instead).
  const text = String(n);
  if (!PLAIN_NUMBER_RE.test(text) || decimalPlaces(text) > MAX_KEY_DECIMAL_PLACES) return null;
  return text;
}

/** Units written with ONE letter. Any other lone letter after a fraction is
 *  read as a variable or a constant ("3/4 x", "2/3 e"). */
const ONE_LETTER_UNITS = new Set(['m', 's', 'g', 'L', 'l', 'N', 'J', 'W', 'V', 'A', 'K', 'C', 'F', 'h', 'T', 'Ω', 'μ']);

/**
 * Is the text after a fraction a PLAIN UNIT ("m/s", "rad", "ft/s", "of the
 * pie", "°", "%") — so the fraction is the whole value? (2026-10-05: the
 * first version took ANY trailing text for a unit, and "4/3 π" with an
 * agreeing solver was stored as the key 4/3 — 1.33 for an answer of 4.19.)
 * Only letters, "/", "°", "%", "μ" and spaces; and none of: π or "pi", a
 * root, the constant e, a product or power sign, a digit, or a lone letter
 * that is not a one-letter unit.
 */
export function isPlainUnit(trailing: string): boolean {
  const t = (trailing ?? '').trim();
  if (!t) return true;
  if (!/^[A-Za-zµμΩ°%/\s]+$/.test(t)) return false; // π, √, ×, ·, ^, digits, backslashes, brackets …
  for (const word of t.split(/[\s/]+/).filter(Boolean)) {
    const bare = word.replace(/[°%]/g, '');
    if (!bare) continue;
    if (/^(?:pi|sqrt|e|exp|ln|log|sin|cos|tan|i)$/i.test(bare)) return false;
    if (bare.length === 1 && !ONE_LETTER_UNITS.has(bare)) return false;
  }
  return true;
}

/** Longest decimal tail a generated numeric key may carry. */
export const MAX_KEY_DECIMAL_PLACES = 6;

function decimalPlaces(plain: string): number {
  const dot = plain.indexOf('.');
  return dot < 0 ? 0 : plain.length - dot - 1;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/**
 * The key for an answer given as a fraction of two integers (2026-10-05).
 *
 * `String(5 / 6)` used to be stored — "0.8333333333333334" — and under the
 * exact numeric rule (numeric-answer-rule.ts) a student typing 0.83 or 0.833
 * was marked wrong; only the fraction or the full float passed. The rule
 * already has a FRACTION key form: it accepts an equal fraction (5/6, 10/12)
 * and a decimal of two or more places equal to the key rounded to that many
 * places (0.83, 0.833, 0.8333). So:
 *   whole number            → "4"      (12/3)
 *   terminating decimal     → "0.375"  (3/8 — as before)
 *   anything else           → the reduced fraction, sign on top: "5/6", "-7/3"
 * A zero denominator has no key.
 */
export function exactFractionKey(numerator: number, denominator: number): string | null {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0) return null;
  const g = gcd(numerator, denominator) || 1;
  let num = numerator / g;
  let den = denominator / g;
  if (den < 0) { num = -num; den = -den; }
  if (den === 1) return String(num);
  let rest = den;
  while (rest % 2 === 0) rest /= 2;
  while (rest % 5 === 0) rest /= 5;
  if (rest === 1) {
    const text = String(num / den);
    if (PLAIN_NUMBER_RE.test(text) && decimalPlaces(text) <= MAX_KEY_DECIMAL_PLACES) return text;
  }
  return `${num}/${den}`;
}

const NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const wordOrDigit = (t: string): number => NUMBER_WORDS[t.toLowerCase()] ?? Number(t);

/** The rounding a question asks for, read from its text. */
export type StatedPrecision =
  | { kind: 'places'; n: number }
  | { kind: 'sigfigs'; n: number }
  /** Rounding, an exact form or a working value ("use 3.14 for π") is asked
   *  for, in words this does not size. */
  | { kind: 'stated' }
  /** "Give a decimal" / "as a decimal": a decimal is asked for, with no
   *  rounding — the key must be the EXACT decimal. */
  | { kind: 'decimal' };

/** Decimal places named by "to the nearest <word>" — a CLOSED list. A word
 *  not listed is not a precision at all: "the nearest star is 4.2 light
 *  years away" states none. */
const NEAREST_PLACES: Array<[RegExp, number]> = [
  [/^ten-?thousandths?$/, 4],
  [/^thousandths?$/, 3],
  [/^(?:hundredths?|cents?|pennies|penny)$/, 2],
  [/^tenths?$/, 1],
  [
    /^(?:whole|integer|one|ones|unit|units|ten|tens|hundred|hundreds|thousand|thousands|million|dollar|dollars|percent|percentage|degree|degrees|metre|metres|meter|meters|centimetre|centimetres|centimeter|centimeters|millimetre|millimetres|millimeter|millimeters|kilometre|kilometres|kilometer|kilometers|inch|inches|foot|feet|yard|yards|mile|miles|second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years|gram|grams|kilogram|kilograms|milligram|milligrams|pound|pounds|ounce|ounces|litre|litres|liter|liters|millilitre|millilitres|milliliter|milliliters|gallon|gallons|newton|newtons|joule|joules|watt|watts|volt|volts|amp|amps|ampere|amperes|ohm|ohms|kelvin|mole|moles|pascal|pascals|person|people|item|items|cm|mm|km|m|kg|g|ml|l|s|n|j|w|v|k)$/,
    0,
  ],
];

/** "π = 3.14", "π ≈ 3.14", "take π as 3.14", "use 3.14 for π", "22/7". */
const WORKING_PI_RE =
  /(?:π|\\pi\b|\bpi\b)\s*(?:=|≈|\\approx|as|to be|is)\s*(?:3\.14|22\s*\/\s*7)|(?:3\.14\d*|22\s*\/\s*7)\s+(?:for|as)\s+(?:the value of\s+)?(?:π|\\pi\b|pi\b)/i;

export function statedPrecision(question: string): StatedPrecision | null {
  const q = question ?? '';
  // "at least two decimal places" is a floor, not the precision of the key.
  if (/\bat least\s+(?:\d+|one|two|three|four|five|six)\s+(?:decimal|significant|sig\b|d\.\s?p|s\.\s?f)/i.test(q)) return { kind: 'stated' };
  const places = q.match(/\b(\d+|one|two|three|four|five|six)\s*(?:decimal\s+(?:place|digit)s?|d\.\s?p\.?|dp)(?![a-z])/i);
  if (places) return { kind: 'places', n: wordOrDigit(places[1]) };
  const sig = q.match(/\b(\d+|one|two|three|four|five|six)\s*(?:significant\s+(?:figure|digit)s?|sig(?:nificant)?\.?\s*(?:fig|dig)s?\.?|s\.\s?f\.?|sf)(?![a-z])/i);
  if (sig) return { kind: 'sigfigs', n: wordOrDigit(sig[1]) };
  // "nearest 0.01", "nearest 10"
  const nearestNumber = q.match(/\bnearest\s+(\d+(?:\.\d+)?)(?![\d.])/i);
  if (nearestNumber) return { kind: 'places', n: decimalPlaces(nearestNumber[1]) };
  for (const m of q.matchAll(/\bnearest\s+([a-z-]+)/gi)) {
    const hit = NEAREST_PLACES.find(([re]) => re.test(m[1].toLowerCase()));
    if (hit) return { kind: 'places', n: hit[1] };
  }
  if (/\bround(?:ed|ing)?\b|\bexact (?:value|answer|form)\b|\bas an? (?:simplified |reduced |exact )?fraction\b|\bin simplest form\b/i.test(q) || WORKING_PI_RE.test(q)) {
    return { kind: 'stated' };
  }
  if (/\b(?:as|give|write|express(?:ed)?|answer)\b[^.?!]{0,40}\bdecimal\b|\bto a decimal\b|\bdecimal (?:form|answer|value)\b/i.test(q)) {
    return { kind: 'decimal' };
  }
  return null;
}

function significantFigures(plain: string): number {
  const digits = plain.replace(/^-/, '').replace('.', '').replace(/^0+/, '');
  return digits.length;
}

/** What is known about how a numeric key was arrived at. */
export interface PrecisionEvidence {
  /** The generator's own `finalAnswer`, before normalisation. */
  rawAnswer?: string;
  /** The generator's worked solution. */
  worked?: string;
  /** The independent solver's reply (its own value for the answer). */
  solved?: string;
}

/** A fraction or ratio of two integers, with at most a plain unit after it. */
const INTEGER_RATIO_RE = /^\$?\s*(?:-?\d+\s*\/\s*-?\d+|\\[dt]?frac\{\s*-?\d+\s*\}\{\s*-?\d+\s*\})\s*\$?(?:\s+[A-Za-zµμΩ°%/\s]+)?$/;

const APPROX_BEFORE = '(?:≈|≅|\\\\approx|~|\\bapprox(?:imately|\\.)?|\\babout|\\broughly|\\bnearly|\\balmost)';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Is there EVIDENCE that `key` is a rounding of a longer value?
 *  - anywhere (solver's reply, worked solution, the raw answer): the key
 *    itself introduced by an approximation sign or word ("≈ 5.94",
 *    "approximately 34.5"), or followed by an ellipsis;
 *  - in the SOLVER'S reply only — it is the final answer and nothing else —
 *    a number written to MORE decimal places than the key that rounds to it
 *    ("34.4718 m/s" against the key 34.5). The worked solution is not read
 *    this way: its intermediate values (2.54 cm per inch) can round to an
 *    exact key (2.5) by accident.
 * No such trace → no evidence; this never guesses from the question's topic.
 */
export function keyIsRounding(key: string, ev: PrecisionEvidence): boolean {
  if (!PLAIN_NUMBER_RE.test(key)) return false;
  const places = decimalPlaces(key);
  const keyValue = Number(key);
  const scale = 10 ** places;
  const keyPattern = escapeRegExp(key.replace(/^-/, ''));
  const approxKey = new RegExp(`${APPROX_BEFORE}\\s*\\$?\\s*[-−]?${keyPattern}(?![\\d])|(?<![\\d.])${keyPattern}\\s*(?:\\.\\.\\.|…)`, 'i');
  const clean = (raw: string | undefined) => (raw ?? '').replace(/−/g, '-').replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1');
  for (const text of [ev.solved, ev.worked, ev.rawAnswer].map(clean)) {
    if (text && approxKey.test(text)) return true;
  }
  for (const m of clean(ev.solved).matchAll(/-?\d+\.\d+/g)) {
    if (decimalPlaces(m[0]) <= places) continue;
    const value = Number(m[0]);
    if (value === keyValue) continue; // 0.50 for 0.5
    if (Math.abs(Math.round(Math.abs(value) * scale) / scale - Math.abs(keyValue)) < 1e-9) return true;
  }
  return false;
}

/**
 * May this decimal KEY be graded exactly against this QUESTION? (2026-10-05)
 *
 * A decimal key is graded to the precision it is written to. Two of the
 * pre-generation audit's fails were keys rounded further than the question
 * justified, with no rounding stated: 5.94 (from "310 K") and 34.5 (from
 * "45 m/s at 40°") — a student answering 5.9 or 34 was marked wrong.
 *
 * The first version of this gate judged exactness from the question's
 * SUBJECT (any °, any trig or root, more places than the data) and rejected
 * legitimate exact decimals: 3/8 = 0.375, 1 ÷ 8 = 0.125, sin 30° = 0.5, a
 * temperature change of 25.5 °C, π taken as 3.14. It now rejects only what
 * is demonstrably wrong:
 *  - the question states a precision → the key must not be written to MORE
 *    than that (decimal places or significant figures): "correct to 1 d.p."
 *    with the key 0.33 is rejected;
 *  - it states none (or only "give a decimal") → rejected only on EVIDENCE
 *    that the key is a rounding (`keyIsRounding`: the independent solver's
 *    value or the worked solution carries more figures, or marks the key as
 *    approximate). No evidence — nothing to recompute from — passes;
 *  - the generator's own answer was a fraction or ratio of integers → the
 *    decimal is exact by construction; always passes.
 * Whole-number and fraction keys are exact and always pass.
 *
 * `evidence` may be the worked-solution text alone (earlier callers).
 */
export function numericKeyPrecisionOk(question: string, key: string, evidence: string | PrecisionEvidence = {}): boolean {
  if (!PLAIN_NUMBER_RE.test(key)) return true; // a fraction key
  const places = decimalPlaces(key);
  if (places === 0) return true;
  const ev: PrecisionEvidence = typeof evidence === 'string' ? { worked: evidence } : evidence;
  const stated = statedPrecision(question);
  if (stated?.kind === 'places') return places <= stated.n;
  if (stated?.kind === 'sigfigs') return significantFigures(key) <= stated.n;
  if (stated?.kind === 'stated') return true;
  if (ev.rawAnswer !== undefined && INTEGER_RATIO_RE.test(ev.rawAnswer.trim())) return true;
  return !keyIsRounding(key, ev);
}

/**
 * A numeric box takes ONE number: a second task that needs words cannot be
 * typed into it (audit 2026-10-05: "Calculate the water potential … and use
 * it to determine whether water will move into or out of the cell", key
 * -0.6). Only an IMPERATIVE second task counts — a new sentence, or one
 * joined on with and / then / also ("… and explain", "Then determine
 * whether …"). The same words inside the story do not: "A scientist wants to
 * explain a result. If … find F." and "A student must decide whether to buy
 * 3 or 4. If each costs $2, what is the cost of 4?" each ask for one number.
 */
const SECOND_TASK_LEAD = String.raw`(?:[.!?;:]\s+(?:then\s+|also\s+|next,?\s+|finally,?\s+)?|\b(?:and|then|also)\s+(?:then\s+|also\s+)?(?:use\s+(?:it|this|that|them|your\s+(?:answer|result|value))\s+to\s+)?)`;
const NUMERIC_SECOND_PART_RE = new RegExp(
  `${SECOND_TASK_LEAD}(?:briefly\\s+)?(?:(?:determine|state|decide|say|tell)\\s+whether\\b|(?:explain|justify)\\b)` +
    // … and state / name / identify something — unless that something IS the
    // number asked for ("… balance the equation, and state the coefficient of
    // Cu", "… then state how many electrons the ion has").
    `|\\b(?:and|then|also)\\s+(?:state|describe|identify|classify|interpret|predict|name)\\b` +
    `(?!\\s+(?:how\\s+(?:many|much)|(?:the|its)\\s+(?:number|value|coefficient|sum|total|amount|magnitude|mass|charge|ratio|probability|percent|percentage|slope|answer)\\b))`,
  'i',
);

export function numericHasSecondPart(question: string): boolean {
  return NUMERIC_SECOND_PART_RE.test(question ?? '');
}

/**
 * `\( … \)`, `\[ … \]` and `$$ … $$` → `$ … $`. The practice card's maths
 * pipeline is built around single-dollar maths; three generated items in the
 * 2026-10-05 pre-generation showed `\(\sum_{k=1}^{6} …\)` as raw source. The
 * prompt now asks for `$…$` only; this makes the stored text right even when
 * the model does not comply.
 *
 * Three things it must not do (review, same day):
 *  - rewrite inside backticks — `\(x\)` in a code span is literal text;
 *  - leave a bare dollar inside the new maths: `\($5\)` is "$5" typeset, and
 *    `$$5$` would open a second maths span, so it becomes `$\$5$`;
 *  - touch `\\(` — an escaped backslash followed by an ordinary bracket.
 */
export function dollarMathDelimiters(text: string): string {
  const inner = (body: string) => `$${body.trim().replace(/(?<!\\)\$/g, '\\$')}$`;
  const outsideCode = (part: string) =>
    part
      .replace(/(?<!\\)\\\(([\s\S]+?)(?<!\\)\\\)/g, (_m, body: string) => inner(body))
      .replace(/(?<!\\)\\\[([\s\S]+?)(?<!\\)\\\]/g, (_m, body: string) => inner(body))
      .replace(/(?<!\\)\$\$([\s\S]+?)\$\$/g, (_m, body: string) => inner(body));
  // Odd pieces of this split are the code spans (```…``` or `…`), kept as is.
  return (text ?? '')
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) => (i % 2 === 1 ? part : outsideCode(part)))
    .join('');
}

/** `dollarMathDelimiters` over every text field of a payload a student sees. */
function withDollarMath(gen: GenPayload): GenPayload {
  const fix = (t: string | undefined) => (t === undefined ? undefined : dollarMathDelimiters(t));
  return {
    ...gen,
    problemText: dollarMathDelimiters(gen.problemText),
    teachingAnswer: fix(gen.teachingAnswer),
    hints: gen.hints?.map(dollarMathDelimiters),
    choices: gen.choices?.map(dollarMathDelimiters),
    expectedAnswer: fix(gen.expectedAnswer),
    modelResponse: fix(gen.modelResponse),
  };
}

/** Matches a leading MCQ choice-letter prefix a generator baked into its own
 *  choice text: "A) ", "A. ", "A: ", "(A) ", "A - " (flexible whitespace,
 *  matched case-insensitively by the caller). Captures the letter in
 *  whichever alternative matched. */
const CHOICE_LETTER_PREFIX_RE = /^\s*(?:\(([A-Za-z])\)|([A-Za-z])\s*[.):]|([A-Za-z])\s*-)\s*/;

/**
 * Real-bank defect (1-of-3 real generations observed): a generated mcq item
 * came back with choice texts that bake in their own letter prefix —
 * `["A) 2","B) 10/3","C) 5","D) 19/3"]`. The portal renders its OWN A/B/C/D
 * labels next to each choice, so a student would see a doubled label,
 * "B. B) 10/3". When EVERY choice starts with a letter-prefix matching its
 * position (A, B, C, ... sequential from the first choice) the prefix is
 * stripped from each choice's text. Strip only under that all-or-nothing +
 * sequential condition — a PARTIAL match (only some choices prefixed, or the
 * prefixes present but out of A/B/C/... order) is left completely untouched,
 * since that's more likely a legitimate choice that happens to start with a
 * letter-like token (e.g. a chemistry option literally named "A)") than a
 * baked-in label scheme. Returns the original array unchanged (same values)
 * when the condition doesn't hold — callers should not rely on reference
 * identity to detect whether a strip happened.
 */
export function stripChoiceLetterPrefixes(choices: string[]): string[] {
  // A lone choice satisfies "sequential from A" vacuously, so the safeguard
  // below can't tell a label scheme from content that merely opens with
  // "(A) ..." — never strip unless there are at least two choices to compare.
  if (choices.length < 2) return choices;
  const stripped: string[] = [];
  for (let i = 0; i < choices.length; i++) {
    const expectedLetter = String.fromCharCode(65 + i);
    const m = CHOICE_LETTER_PREFIX_RE.exec(choices[i]);
    if (!m) return choices; // not every choice prefixed — leave all untouched
    const letter = (m[1] ?? m[2] ?? m[3] ?? '').toUpperCase();
    if (letter !== expectedLetter) return choices; // out-of-sequence letter — leave all untouched
    stripped.push(choices[i].slice(m[0].length));
  }
  return stripped;
}

/**
 * Answer-shape gate (round-1 review fix, tightened round-2) — runs BEFORE a
 * generated payload is either served or persisted:
 *
 *   - numeric: `finalAnswer` must reduce to a plain-number string via
 *     `normalizeNumericAnswer` (shape check only — the ambiguity gate).
 *     Verification is run against the ORIGINAL claimed answer, NOT the
 *     normalized one: `extractAnswerNumber` (inside `verify`/`answersAgree`,
 *     untouched by this gate) applies its own scaling rules — e.g. percent
 *     divides by 100 — and an independent blind solve naturally produces
 *     answers in THAT scaling convention, not the portal's. Conflating the
 *     two would make verification spuriously disagree on the exact
 *     percent-answer items this gate exists to fix (round-2 review). Only
 *     the STORED/SERVED value uses the bank-safe normalized form.
 *   - mcq: the claimed answer is resolved to a bare letter against the
 *     ACTUAL choices (`resolveMcqLetter`) — bounds-checked HERE against
 *     `choices.length` (round-2 review: `resolveMcqLetter`'s direct-letter
 *     branch accepts any A-E shape without checking it indexes into THESE
 *     choices, so a 4-choice mcq could otherwise bank a claimed "E"; the
 *     bounds-check lives at this call site rather than inside the shared
 *     `resolveMcqLetter` so tutor-session `mcqAnswersAgree` semantics stay
 *     untouched) — then re-verified CHOICES-AWARE (`verify` appends the
 *     choices and asks for a letter-only reply — never a blind solve that
 *     can't see them). The stored/served answer is always that bare letter.
 *
 * Returns the payload with `finalAnswer` normalized to the bank-safe form, or
 * null when the payload fails the gate — the caller must drop the generation
 * (a failed attempt: degrades to fewer items, never served, never banked).
 */
export async function gateGeneratedAnswer(
  gen: GenPayload,
  verify: VerifyFn = verifyClaimedAnswer,
  verifyKey: KeyVerifyFn = verifyAnswerKey,
): Promise<GenPayload | null> {
  const out = await checkGeneratedAnswer(gen, verify, verifyKey);
  return out.ok ? out.gen : null;
}

/** Which branch of the answer-shape gate rejected a candidate. */
export type GateFailReason =
  | 'mcq_no_choices'
  | 'mcq_blank_choice'
  | 'mcq_unresolved_letter'
  | 'mcq_letter_out_of_range'
  | 'numeric_shape'
  /** A decimal key the question's stated precision / data do not justify
   *  (`numericKeyPrecisionOk`). */
  | 'numeric_precision'
  /** A numeric item that also asks for something that needs words
   *  (`numericHasSecondPart`). */
  | 'numeric_extra_part'
  | 'free_shape'
  /** `free` item whose key reads like a rubric or an instruction ("Defensible
   *  thesis on … + one accurate specific evidence", "Answers will vary") —
   *  not an answer a student can be graded against or shown
   *  (essay-practice.ts `looksLikeRubricKey`). */
  | 'free_rubric_key'
  | 'verify_disagree'
  /** `free` answer: the independent key check could not reach a verdict
   *  (model/parse failure, or the judge could not tell) — fail closed. */
  | 'free_unverified'
  /** `free` item: the independent solver found the question ill-posed. */
  | 'ill_posed'
  /** mcq / numeric item whose text is a pure drawing instruction with nothing
   *  to type (`isDrawingOnlyItem`) — a whiteboard task, never banked. (A
   *  `free` drawing instruction fails 'free_shape', as before.) */
  | 'drawing_task'
  /** Nearly the same item as one the skill already has (practice-similarity.ts). */
  | 'near_duplicate'
  /** Nearly the same item as the other slot of the same request produced. */
  | 'near_duplicate_sibling';

/** Longest canonical answer a `free` generated item may carry. */
export const FREE_ANSWER_MAX_CHARS = 120;

/** `gateGeneratedAnswer` with the rejecting branch named (2026-10-02, so an
 *  empty generation is explainable in the logs). Same checks, same order.
 *
 *  `answerKind: 'free'` (2026-10-02): ordered pairs, expressions, sets and
 *  short phrases are graded by the free-response judge (/grade), so they need
 *  no number/letter shape — a non-empty canonical `expectedAnswer` of at most
 *  FREE_ANSWER_MAX_CHARS and a problem that is not a drawing instruction.
 *
 *  2026-10-04: a `free` item's key is no longer trusted on shape alone. It is
 *  independently verified (`verifyKey` → ./key-verify.ts: a blind solve that
 *  never sees the claimed answer, then an exact / judged comparison) and the
 *  item passes ONLY on `verified`:
 *    mismatch → 'verify_disagree' · ill_posed → 'ill_posed' ·
 *    unverifiable (incl. any model failure) → 'free_unverified'.
 *  With TUTOR_KEY_VERIFY_AT_CREATION=off the check is skipped (the previous
 *  shape-only behaviour) and the payload is marked `verifierModel:
 *  'unverified'` so the bank row never claims a solve.
 *
 *  Every payload that passes carries `verifierModel`: the model whose
 *  independent solve agreed with the answer. */
export async function checkGeneratedAnswer(
  raw: GenPayload,
  verify: VerifyFn = verifyClaimedAnswer,
  verifyKey: KeyVerifyFn = verifyAnswerKey,
): Promise<{ ok: true; gen: GenPayload } | { ok: false; reason: GateFailReason }> {
  // Maths delimiters first, so every check below and the stored row see the
  // text the student will be shown.
  const gen = withDollarMath(raw);
  const fail = (reason: GateFailReason) => ({ ok: false as const, reason });
  if (gen.answerKind === 'free') {
    const expected = (gen.expectedAnswer ?? '').trim();
    if (!expected || expected.length > FREE_ANSWER_MAX_CHARS || isDrawingInstruction(gen.problemText)) {
      return fail('free_shape');
    }
    // Checked before the independent solve: no model call is spent on a key
    // that is a rubric sentence, and a lenient judge can never wave one through.
    if (looksLikeRubricKey(expected)) return fail('free_rubric_key');
    let verifierModel = UNVERIFIED_MODEL;
    if (keyVerifyEnabled()) {
      let checked: Pick<VerifyAnswerKeyResult, 'status' | 'model'>;
      try {
        checked = await verifyKey({ question: gen.problemText, claimedAnswer: expected, answerFormat: 'free' });
      } catch {
        return fail('free_unverified'); // the verifier never throws; an injected one might — fail closed
      }
      if (checked.status === 'mismatch') return fail('verify_disagree');
      if (checked.status === 'ill_posed') return fail('ill_posed');
      if (checked.status !== 'verified') return fail('free_unverified');
      verifierModel = checked.model || UNVERIFIED_MODEL;
    }
    return { ok: true, gen: { ...gen, finalAnswer: expected, expectedAnswer: expected, choices: undefined, verifierModel } };
  }
  // A pure drawing task ("Graph the line.") is not a typed-answer item whatever
  // answer the generator attached to it (2026-10-04) — the same rule that
  // keeps an authored one from being served (practice.ts planToItems).
  if (isDrawingOnlyItem(gen.problemText)) return fail('drawing_task');
  if (gen.responseFormat === 'mcq') {
    const rawChoices = gen.choices ?? [];
    if (rawChoices.length === 0) return fail('mcq_no_choices'); // malformed mcq — nothing to grade against
    // Strip a generator-baked-in "A) "/"A. "/"(A) "/"A - " label from every
    // choice's text when ALL choices carry one and the letters are
    // sequential from A (see `stripChoiceLetterPrefixes` doc comment) — the
    // portal renders its own A/B/C/D labels, so leaving these in produces a
    // doubled label ("B. B) 10/3"). A no-op (original array back) when the
    // all-or-nothing + sequential condition doesn't hold.
    const choiceTexts = stripChoiceLetterPrefixes(rawChoices);
    if (choiceTexts.some((text) => text.trim().length === 0)) return fail('mcq_blank_choice'); // stripping left a blank choice — reject the whole generation rather than serve mangled text
    const choices = choiceTexts.map((text, i) => ({ letter: String.fromCharCode(65 + i), text }));
    const claimedLetter = resolveMcqLetter(gen.finalAnswer, choices);
    if (!claimedLetter) return fail('mcq_unresolved_letter'); // claimed answer resolves to no real choice — reject
    const letterIndex = claimedLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    if (letterIndex < 0 || letterIndex >= choices.length) return fail('mcq_letter_out_of_range'); // out-of-bounds letter — reject
    const { agree } = await verify(gen.problemText, claimedLetter, choices);
    if (!agree) return fail('verify_disagree');
    return { ok: true, gen: { ...gen, finalAnswer: claimedLetter, choices: choiceTexts, verifierModel: BRAINGEN_VERIFY_MODEL } };
  }
  const normalized = normalizeNumericAnswer(gen.finalAnswer);
  if (!normalized) return fail('numeric_shape'); // ambiguous/non-numeric shape — reject rather than guess
  if (numericHasSecondPart(gen.problemText)) return fail('numeric_extra_part');
  // A stated precision the key does not follow needs no solve to reject.
  if (!numericKeyPrecisionOk(gen.problemText, normalized, { rawAnswer: gen.finalAnswer, worked: gen.teachingAnswer })) {
    return fail('numeric_precision');
  }
  const { agree, solved } = await verify(gen.problemText, gen.finalAnswer);
  if (!agree) return fail('verify_disagree');
  // The solver agreed with the answer AS WRITTEN; what is stored is the
  // normalised key. They must be the same value, or a key goes into the bank
  // that no solve ever agreed with ("4/3 π" → "4/3").
  if (!normalizedKeyAgrees(normalized, gen.finalAnswer, solved)) return fail('verify_disagree');
  // With the solver's own value in hand: is the key a rounding of it?
  if (!numericKeyPrecisionOk(gen.problemText, normalized, { rawAnswer: gen.finalAnswer, worked: gen.teachingAnswer, solved })) {
    return fail('numeric_precision');
  }
  return { ok: true, gen: { ...gen, finalAnswer: normalized, verifierModel: BRAINGEN_VERIFY_MODEL } };
}

/** The value of a normalised numeric key ("0.375", "-7", "5/6"). */
function keyValue(key: string): number | null {
  if (PLAIN_NUMBER_RE.test(key)) return Number(key);
  const m = /^(-?\d+)\/(\d+)$/.exec(key);
  return m && Number(m[2]) !== 0 ? Number(m[1]) / Number(m[2]) : null;
}

/**
 * Does the NORMALISED key have the value the solver agreed with?
 *
 * Verification compares the answer as the generator wrote it (the percent
 * convention needs that — see `gateGeneratedAnswer`); the bank gets the
 * normalised key. This closes the gap between the two: the key's value must
 * equal the value verification read from the raw answer (`extractAnswerNumber`,
 * which reads "50%" as 0.5 while the key is the bare 50 — both readings are
 * accepted for a percent answer), and, when the solver's reply carries a
 * number, be within the verifier's own tolerance of it.
 */
export function normalizedKeyAgrees(key: string, rawAnswer: string, solved: string | undefined): boolean {
  const value = keyValue(key);
  if (value === null) return false;
  const percent = /%/.test(rawAnswer ?? '');
  const same = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol || (percent && Math.abs(a / 100 - b) <= tol / 100 + 1e-12);
  const rawValue = extractAnswerNumber(rawAnswer ?? '');
  if (rawValue === null || !same(value, rawValue, 1e-9 * Math.max(1, Math.abs(value)))) return false;
  const solvedValue = extractAnswerNumber(solved ?? '');
  if (solvedValue === null) return true; // nothing more to compare with
  const tol = Math.max(0.01, Math.abs(solvedValue) * 0.01);
  return same(value, solvedValue, tol) || (percent && Math.abs(value - solvedValue * 100) <= tol * 100);
}

/** Generate one candidate (shared generator) then run it through the
 *  answer-shape gate. `hash` is returned even on gate/verify failure (null
 *  only when generation itself didn't produce a candidate at all) so a
 *  retry can exclude it. A FAILED model call (HTTP error, timeout, abort)
 *  throws out of here — that is how the caller tells "the gates said no"
 *  from "the call never answered". */
async function attemptGenerateVerified(
  userPrompt: string,
  excludeHashes: string[],
  onGateFailed?: (reason: string) => void,
  signal?: AbortSignal,
): Promise<{ result: { gen: GenPayload; hash: string } | null; hash: string | null }> {
  const callOpts = signal ? { signal } : {};
  const candidate = await generateCandidate(userPrompt, excludeHashes, callOpts);
  if (!candidate) {
    onGateFailed?.('no_candidate');
    return { result: null, hash: null };
  }
  const gated = await checkGeneratedAnswer(
    candidate.gen,
    (problemText, claimed, choices) => verifyClaimedAnswer(problemText, claimed, choices, callOpts),
    (input) => verifyAnswerKey(input, callOpts),
  );
  if (!gated.ok) {
    onGateFailed?.(gated.reason);
    return { result: null, hash: candidate.hash };
  }
  return { result: { gen: gated.gen, hash: candidate.hash }, hash: candidate.hash };
}

/** `attemptGenerateVerified` with 1 retry on failure (temperature yields a
 *  different problem the second time) — the same retry shape the
 *  tutor-session pipeline uses. Round-2 review fix: the first attempt's hash
 *  (even a gate/verify FAILURE has one — it's the hash of the rejected
 *  problem text) is added to the retry's excludeHashes, so a failed retry
 *  can't just regenerate byte-identical content and burn the retry for
 *  nothing. */
async function generateVerifiedWithRetry(
  userPrompt: string,
  excludeHashes: string[],
  onGateFailed?: (reason: string) => void,
  signal?: AbortSignal,
): Promise<{ gen: GenPayload; hash: string } | null> {
  const first = await attemptGenerateVerified(userPrompt, excludeHashes, onGateFailed, signal);
  if (first.result) return first.result;
  const retryExcludeHashes = first.hash ? [...excludeHashes, first.hash] : excludeHashes;
  const second = await attemptGenerateVerified(userPrompt, retryExcludeHashes, onGateFailed, signal);
  return second.result;
}

/** Real dependencies: Anthropic generate + this module's answer-shape gate +
 *  Mongo caps/persistence. */
export function practiceGenSources(): PracticeGenSources {
  return {
    generateAndVerify: (userPrompt, excludeHashes, onGateFailed, signal) => generateVerifiedWithRetry(userPrompt, excludeHashes, onGateFailed, signal),
    reserve: (studentId, loId, n) => mongoReserve(studentId, loId, n),
    persist: (row) => mongoPersist(row),
    release: (studentId, loId, n, reservedAt) => mongoRelease(studentId, loId, n, reservedAt),
  };
}

/** Fisher-Yates shuffle of `[0, n)` using an injectable RNG (defaults to
 *  `Math.random`) — kept separate from `pickAnchorsForSlots` so tests can
 *  supply a deterministic sequence without monkeypatching the global. */
function shuffledIndices(n: number, rng: () => number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/**
 * Sample one generation anchor PER SLOT: an existing same-LO item at the
 * target difficulty; if none at that difficulty, any same-LO item; `null`
 * for every slot when the LO has zero existing practice at all (fresh-LO
 * edge case).
 *
 * Production defect (2026-08-01, prod LO `geom.angles-and-measure`): a
 * 2-slot parallel-generation request sampled ONE anchor and reused it for
 * BOTH slots. Same anchor + same prompt led both parallel calls to converge
 * on the same problem template with only the numbers swapped — hash-dedup
 * can't catch this since it hashes exact text. When the eligible pool has
 * >=2 distinct items, each slot now gets a DIFFERENT one (sampled without
 * replacement — cycling back through the shuffled pool only if there are
 * more slots than pool items, which never happens today since
 * `MAX_GENERATIONS_PER_REQUEST` is 2). A pool of exactly 1 item falls back
 * to that same anchor for every slot (no crash) — variety in that case is
 * carried instead by the per-slot prompt directive (see
 * `slotVariationDirective`).
 *
 * `rng` defaults to `Math.random` (matching this module's prior sampling)
 * but is injectable so tests can assert the distinct-per-slot assignment
 * deterministically.
 */
export function pickAnchorsForSlots(
  items: PracticeItem[],
  slotCount: number,
  difficulty?: Difficulty,
  rng: () => number = Math.random,
): Array<PracticeItem | null> {
  if (slotCount <= 0) return [];
  if (items.length === 0) return Array.from({ length: slotCount }, () => null);
  const sameDifficulty = difficulty ? items.filter((i) => i.difficulty === difficulty) : [];
  const pool = sameDifficulty.length > 0 ? sameDifficulty : items;
  if (pool.length === 1) return Array.from({ length: slotCount }, () => pool[0]);
  const order = shuffledIndices(pool.length, rng);
  return Array.from({ length: slotCount }, (_, i) => pool[order[i % order.length]]);
}

/**
 * Per-slot variation directive appended to the generation prompt when
 * multiple generations run in parallel for the same request. Even WITH a
 * distinct anchor per slot (`pickAnchorsForSlots`), the model can still
 * gravitate to the same "obvious" framing for a given LO — and a pool of
 * exactly 1 anchor gives every slot the identical anchor text. Each slot
 * gets a DIFFERENT instruction so siblings diverge in problem SHAPE, not
 * just the numbers plugged into an identical template.
 */
const SLOT_VARIATION_DIRECTIVES = [
  'This is generation 1 of up to 2 for this objective, written in parallel with a sibling that must NOT resemble it. ' +
    'Yours is the DIRECT one: a plain statement of the task with no story around it. If the skill is practised on a ' +
    'specific example (a substance, an organism, a function, a data set, a case), use a standard one.',
  'This is generation 2 of up to 2 for this objective, written in parallel with a sibling that must NOT resemble it. ' +
    'The sibling is the plain, direct statement of the task on a standard example, so yours must be STRUCTURALLY ' +
    'distinct: change which quantity is the unknown, or work the skill in the reverse direction, or take a different ' +
    'case or sub-skill within this objective, and set it in an applied situation. If the skill is practised on a ' +
    'specific example (a substance, an organism, a function, a data set, a case), do NOT use the most familiar ' +
    'textbook one — choose a different, less common example. Do not just reuse the same setup with new numbers.',
];

function slotVariationDirective(slotIndex: number): string {
  return SLOT_VARIATION_DIRECTIVES[slotIndex % SLOT_VARIATION_DIRECTIVES.length];
}

/** Most existing items listed in a prompt, and the longest each may be. */
const AVOID_LIST_MAX_ITEMS = 8;
const AVOID_ITEM_MAX_CHARS = 280;

/**
 * "Do not repeat" block (2026-10-05): the texts of the skill's existing
 * typed-answer items. Until now a prompt showed at most ONE of them (the
 * anchor), so the generator kept re-asking the skill's other stored
 * questions — and, told only "do not reuse the anchor's numbers or context",
 * the anchor's own question with a clause added. Drawing tasks are left out
 * (the generator mirrors them — see DRAWING_ANCHOR_RE), and so are withdrawn
 * items: a wrong or ill-posed question is never put in front of the
 * generator (they are still compared against by the near-duplicate gate).
 */
function avoidRepeatingClause(existing: PracticeItem[]): string {
  const texts = existing
    .filter((it) => !isWithdrawnItem(it.id) && !isDrawingInstruction(it.problemText))
    .slice(0, AVOID_LIST_MAX_ITEMS)
    .map((it) => `- ${it.problemText.replace(/\s+/g, ' ').trim().slice(0, AVOID_ITEM_MAX_CHARS)}`);
  if (texts.length === 0) return '';
  return (
    `\nThe student already has these questions for this objective. Do NOT repeat or closely paraphrase any of ` +
    `them, and do not ask for the same fact or the same result in other words — a student who has answered them ` +
    `must still have something to work out in yours:\n${texts.join('\n')}\n`
  );
}

/** What a practice item must be, whatever the skill (2026-10-05 audit:
 *  vocabulary questions on a solving skill, stems that state their own
 *  answer, a numeric box with a second "determine whether…" part). */
const SKILL_LEVEL_CLAUSE =
  'The problem must make the student DO the skill the objective names — solve, compute, decide or construct — at ' +
  'the level of the course; never ask only for vocabulary or for the parts of a setup when the skill is to solve. ' +
  'The problem text must not state or describe its own answer. A numeric problem asks for exactly ONE number and ' +
  'nothing else: no second part to explain, justify, interpret or "determine whether" — if that part matters, make ' +
  'the item multiple choice or "free" instead.';

/** Numeric precision (2026-10-05 audit: keys 5.94 and 34.5 graded exactly on
 *  questions that stated no rounding; 5/6 stored as 0.8333333333333334). */
const PRECISION_CLAUSE =
  'If the answer is a number that is not a whole number, the problem text MUST say how to give it: either a ' +
  'rounding precision ("to the nearest tenth", "to 2 decimal places", "to 3 significant figures") with finalAnswer ' +
  'written to exactly that precision, or "as a fraction" with finalAnswer the exact fraction (for example "5/6", ' +
  'never its decimal expansion). Never give an answer to more figures than the problem asks for.';

/** Maths notation (2026-10-05: `\(\sum …\)` printed as raw source on the card). */
const MATH_NOTATION_CLAUSE =
  'Write simple mathematics in plain text or Unicode; when LaTeX is needed, wrap it in single dollar signs, ' +
  '$…$, and nothing else — never \\( … \\), \\[ … \\] or $$ … $$.';

/** The clauses every branch of the prompt carries. */
const COMMON_CLAUSES = `${SKILL_LEVEL_CLAUSE} ${PRECISION_CLAUSE} ${MATH_NOTATION_CLAUSE}`;

// Round-3 review mitigation for the parked bare-decimal residual (a percent
// question answered as "0.5" instead of "50%" would slip past
// `normalizeNumericAnswer`'s percent handling — it looks like an ordinary
// plain number — and bank a value the portal's unscaled `parseNum` would
// grade wrong). No detection heuristic is added (that residual stays
// parked); instead the GENERATOR is steered away from producing it: if the
// answer is a percentage, state it as the percent numeral and phrase the
// problem to explicitly ask for a percent answer.
const PERCENT_ANSWER_CLAUSE =
  'If the correct answer to your problem is a percentage, phrase the problem so it explicitly ' +
  'asks for the answer "as a percent" (or "what percent...") and state finalAnswer as the percent ' +
  'numeral with a % sign (e.g. "50%"), never the decimal form ("0.5").';

/** Free-text answers (2026-10-02): asks the generator to label each candidate
 *  `answerKind` so answers that are not one number or a choice letter (ordered
 *  pairs, expressions, sets, short phrases) become `free` items graded by the
 *  free-response judge instead of failing the numeric shape gate. The
 *  numeric/mcq output is unchanged. */
const ANSWER_KIND_CLAUSE =
  'Also include "answerKind" in your JSON: "numeric" when the answer is a single number: a decimal or a simple ' +
  'fraction (for example "3/2"), never a mixed number (not "1 1/2"); "mcq" for a ' +
  'multiple-choice problem (keep "responseFormat" set to match for these two, exactly as before), or ' +
  '"free" when the answer is anything else short and checkable — an ordered pair, a solution like ' +
  '"x = -1.5 and y = 3", an expression like "(x+2)(x+6)", a set or a short phrase. For "free", also ' +
  'include "expectedAnswer": the concise canonical answer (at most 120 characters, no working), set ' +
  '"finalAnswer" to the same text, give no "choices", and optionally include "modelResponse": a ' +
  'one-line full-credit response. The student types the answer, so never ask them to draw, graph, ' +
  'plot or sketch.';

/** Anchors that ask the student to DRAW (graph, plot, sketch, shade, label a
 *  diagram) can't seed a typed-answer practice item: the generator mirrors
 *  the drawing task and every candidate fails the answer-shape gate.
 *  Observed 2026-10-02: the anchor "Graph y = 2x + 3 and mark where it
 *  crosses both axes" produced zero usable items.
 *  The verb must be an INSTRUCTION — at the start of the text or of a
 *  sentence/clause (after . ! ? : ; or the ")" of "(a)"), or after
 *  please/then/now/and — so a problem that merely mentions a graph ("The
 *  graph of f passes through (1, 2); find f(3)") keeps its anchor. */
export const DRAWING_ANCHOR_RE =
  /(?:^\s*|[.!?:;)]\s*|\b(?:please|then|now|and)\s+)(?:graph(?:s|ing|ed)?|draw(?:n|ing|s)?|sketch(?:es|ing|ed)?|plot(?:s|ting|ted)?|shad(?:e|es|ing|ed)|label (?:the )?(?:diagram|figure))\b/i;

/** True when the text INSTRUCTS the student to draw/graph/sketch/plot/shade/
 *  label a diagram (instruction-anchored — see DRAWING_ANCHOR_RE). Such an
 *  is never a generation anchor; a SERVED item is dropped only when it also
 *  has no typed-answer cue (`isDrawingOnlyItem`). */
export function isDrawingInstruction(text: string): boolean {
  return DRAWING_ANCHOR_RE.test(text);
}

/** A typed-answer cue: a question mark or an answer-asking verb. A served
 *  item that also carries one ("Draw the Lewis structure… How many lone
 *  pairs?") still has something to type. */
export const TYPED_ANSWER_CUE_RE =
  /\?|\b(find|calculate|compute|determine|how many|how much|what is|what are|state|identify|list|solve|evaluate|give|write the equation|explain|describe)\b/i;

/** SERVING rule (practice.ts planToItems): drop a try-yourself only when it is
 *  a drawing instruction with NO typed-answer cue — a pure "Sketch/Draw/Graph
 *  …" whiteboard task. (The generator-anchor rule, `usableAnchor`, stays the
 *  broader `isDrawingInstruction`: an anchor only seeds generation.) */
export function isDrawingOnlyItem(text: string): boolean {
  return isDrawingInstruction(text) && !TYPED_ANSWER_CUE_RE.test(text);
}

/** The anchor to prompt with: null for a drawing/graphing anchor, so the
 *  skill-only (no-anchor) branch of `buildUserPrompt` writes a typed-answer
 *  problem for the LO/topic instead. */
export function usableAnchor(anchor: PracticeItem | null): PracticeItem | null {
  if (!anchor) return null;
  return isDrawingInstruction(anchor.problemText) ? null : anchor;
}

/** Longest LO title carried into the drawing-LO prompt. */
const LO_TITLE_MAX_CHARS = 240;

/**
 * Drawing-LO branch (2026-10-04). The LO's authored practice is drawing tasks
 * (graph / sketch / plot / shade), which are never served and never anchors,
 * so until now such an LO fell into the brand-new-LO prompt: "no practice
 * exists, infer the skill from the id", followed by "never ask them to draw"
 * — for a skill that IS drawing, with nothing saying what to ask instead.
 * Live 2026-10-04 (a graphing LO, Needs Support): every attempt came back
 * `no_candidate` and the LO got no practice.
 *
 * This branch states the situation and asks for the typed/choice form of the
 * same skill. It is selected from the STRUCTURE of the LO's items (they are
 * drawing tasks), never from the topic, and names no subject. The drawing
 * tasks' own text is still kept out of the prompt (the generator mirrors it —
 * see DRAWING_ANCHOR_RE).
 */
function buildDrawingLoPrompt(opts: GeneratePracticeItemsOptions, difficultyLabel: string, slotDirective: string): string {
  const title = (opts.loTitle ?? '').replace(/\s+/g, ' ').trim().slice(0, LO_TITLE_MAX_CHARS);
  return (
    `The existing practice tasks for this learning objective are drawing tasks: the student graphs, sketches, ` +
    `plots, shades or labels something on a whiteboard. They cannot be used here, because the student answers ` +
    `ONLY by typing a short answer or choosing an option.\n` +
    `Learning objective id: ${opts.loId} (topic: ${opts.topic}).\n` +
    (title ? `Learning objective: ${title}\n` : '') +
    `Write ONE self-contained practice problem that tests the SAME skill at ${difficultyLabel}, in a form that is ` +
    `answered by typing or choosing. State everything the student needs inside the problem text: describe any ` +
    `graph, figure or diagram fully in words or by its stated values. Then ask the student to interpret or ` +
    `describe it, to decide a property of it (which part or region is included, whether a boundary or endpoint ` +
    `is included or excluded, whether a given point or value satisfies the condition, which of several ` +
    `descriptions matches), or to give a value read or worked out from the stated information. A property ` +
    `decision is a good fit for multiple choice. Do NOT ask the student to draw, sketch, graph, plot, shade or ` +
    `label anything, and do not start the problem or any sentence of it with one of those verbs. ` +
    `${PERCENT_ANSWER_CLAUSE} ${ANSWER_KIND_CLAUSE} ${COMMON_CLAUSES} ${slotDirective} ` +
    `Reply with the JSON object only — no note before or after it — and write mathematics in plain text or ` +
    `Unicode symbols rather than backslash commands. Write the problem now.`
  );
}

function buildUserPrompt(
  opts: GeneratePracticeItemsOptions,
  anchor: PracticeItem | null,
  slotIndex: number,
  /** The LO's authored items are drawing tasks (see buildDrawingLoPrompt).
   *  Only consulted when there is no usable anchor. */
  drawingLo = false,
): string {
  const difficultyLabel = opts.difficulty
    ? `difficulty bucket ${opts.difficulty} of 4 (1 = easier than typical, 4 = extension-grade)`
    : 'a typical practice difficulty for this objective';
  const slotDirective = slotVariationDirective(slotIndex);
  const avoid = avoidRepeatingClause(opts.anchorItems);
  if (anchor) {
    return (
      `ANCHOR problem (it shows the skill and the difficulty — do NOT reuse its numbers, its context, its example ` +
      `or its question):\n${anchor.problemText}\n` +
      (anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${anchor.expectedAnswer}\n` : '') +
      `\nLearning objective: ${opts.loId} (topic: ${opts.topic}).\n` +
      avoid +
      `\nWrite ONE fresh problem testing the same skill at ${difficultyLabel}. ${PERCENT_ANSWER_CLAUSE} ` +
      `${ANSWER_KIND_CLAUSE} ${COMMON_CLAUSES} ${slotDirective} Write the problem now.`
    );
  }
  if (drawingLo) return buildDrawingLoPrompt(opts, difficultyLabel, slotDirective);
  // Fresh-LO edge case: zero existing practice to anchor off of. Practice
  // items carry no free-text LO description at this layer, so the only
  // signal is the LO id + topic — generate from those alone.
  return (
    `There is no existing practice problem yet for this learning objective (brand-new LO).\n` +
    `Learning objective id: ${opts.loId} (topic: ${opts.topic}).\n` +
    `Infer the likely skill this LO id names and write ONE self-contained practice problem testing ` +
    `it at ${difficultyLabel}. ${PERCENT_ANSWER_CLAUSE} ${ANSWER_KIND_CLAUSE} ${COMMON_CLAUSES} ${slotDirective} Write the problem now.`
  );
}

/** The answer of an item IN WORDS, for the near-duplicate comparison: a
 *  multiple-choice answer is its option's text, never its letter. */
function comparable(item: Pick<PracticeItem, 'problemText' | 'expectedAnswer' | 'choices'>): ComparableItem {
  const answer = (item.expectedAnswer ?? '').trim();
  const choice = item.choices?.find((c) => c.id === answer);
  return { problemText: item.problemText, answerText: choice ? choice.text : answer, choices: item.choices?.map((c) => c.text) };
}

/** A gated candidate, not yet stored: the item as served and its bank row. */
interface GeneratedCandidate {
  item: PracticeItem;
  row: PracticeGenPersistRow;
}

/** Generate ONE gated candidate for a slot. Nothing is stored here — the
 *  caller stores a candidate only after comparing it with its sibling.
 *
 *  A candidate that nearly duplicates an item the skill already has
 *  (practice-similarity.ts) is dropped and the slot is generated once more,
 *  with the rejected text excluded; a second near-duplicate leaves the slot
 *  empty. */
async function generateOne(
  opts: GeneratePracticeItemsOptions,
  anchor: PracticeItem | null,
  sources: PracticeGenSources,
  excludeHashes: string[],
  slotIndex: number,
  drawingLo = false,
  signal?: AbortSignal,
): Promise<GeneratedCandidate | null> {
  // A drawing/graphing anchor takes the skill-only branch (see usableAnchor):
  // the drawing-LO prompt when the LO's authored items are drawing tasks,
  // else the brand-new-LO prompt.
  // The original anchor still supplies difficulty/cedCode defaults below.
  const prompt = buildUserPrompt(opts, usableAnchor(anchor), slotIndex, drawingLo);
  const onGateFailed = opts.onDebugEvent
    ? (reason: string) => opts.onDebugEvent?.('practice_gen_gate_failed', `loId=${opts.loId} reason=${reason}`)
    : undefined;
  const existing = opts.anchorItems.map(comparable);
  let exclude = excludeHashes;
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await sources.generateAndVerify(prompt, exclude, onGateFailed, signal);
    if (!result) return null; // unverified/gate-failed — never served, never banked
    const { gen, hash } = result;
    const id = `practice-gen.${opts.loId}.${hash}`;
    const difficulty: Difficulty = opts.difficulty ?? anchor?.difficulty ?? DEFAULT_DIFFICULTY;
    const cedCode = opts.cedCode ?? anchor?.cedCode;
    const responseFormat = bankResponseFormat(gen);
    const item: PracticeItem = {
      id,
      source: 'bank',
      problemText: gen.problemText,
      // mcq → the bare LETTER, numeric → the bare number string or exact
      // fraction (bank convention), free → the canonical short answer — all
      // enforced by the answer-shape gate above.
      expectedAnswer: gen.finalAnswer,
      hints: gen.hints,
      responseFormat,
      choices: responseFormat === 'free' ? undefined : gen.choices?.map((c, i) => ({ id: String.fromCharCode(65 + i), text: c })),
      difficulty,
      loId: opts.loId,
      cedCode,
    };
    if (findNearDuplicate(comparable(item), existing)) {
      onGateFailed?.('near_duplicate');
      exclude = [...exclude, hash];
      continue;
    }
    return { item, row: { id, topic: opts.topic, topicId: opts.topicId, loId: opts.loId, cedCode, difficulty, gen } };
  }
  return null;
}

/** What `generatePracticeItemsDetailed` did, for the caller that has to say
 *  WHY a draw is empty. */
export interface PracticeGenOutcome {
  /** Verified, stored items ready when the call returned. */
  items: PracticeItem[];
  /** 'off' — the kill-switch is off or nothing was asked for;
   *  'limit' — the daily cap granted no slot;
   *  'unavailable' — the cap check itself failed;
   *  'ran' — slots were reserved and generation ran. */
  status: 'off' | 'limit' | 'unavailable' | 'ran';
  /** Slots reserved for this request. */
  reserved: number;
  /** Slots still generating when the deadline passed (0 without a deadline). */
  pending: number;
  /** Settles (never rejects) when every background slot has finished and been
   *  stored or dropped. A route hands it to `after()`; tests await it. */
  background: Promise<void>;
}

/**
 * Generate ≤2 verified replacement items to top up a Practice retrieval
 * shortfall. Over-cap, kill-switched, or any internal failure ⇒ `[]` — the
 * caller (`retrievePractice`) degrades to fewer items, never an error.
 */
export async function generatePracticeItems(
  opts: GeneratePracticeItemsOptions,
  sources: PracticeGenSources = practiceGenSources(),
): Promise<PracticeItem[]> {
  return (await generatePracticeItemsDetailed(opts, sources)).items;
}

const DONE: Promise<void> = Promise.resolve();

/**
 * `generatePracticeItems` with the outcome spelled out, and — when
 * `opts.deadlineMs` is set — a bounded wait (2026-10-05).
 *
 * A practice draw measured 15.9 s, 32.9 s and 84.2 s end to end while the
 * portal in front of it gives up at 60 s. With a deadline the call returns
 * the items that are verified AND stored by then; a slot still running is
 * left to finish in the background (this server is a long-running Node
 * process — pm2 `next start` — so work outlives the response), goes through
 * exactly the same acceptance step (withdrawn / duplicate id / sibling
 * near-duplicate / persist) one at a time, and is in the bank for the next
 * draw. Its slot was reserved up front, so it is counted once; the
 * acceptance step is the only writer, so it is never stored twice. Every
 * slot is aborted at `PRACTICE_GEN_HARD_LIMIT_MS`.
 *
 * A slot whose model call FAILED (rejected promise: HTTP error, timeout,
 * abort) gives its (student, LO) reservation back (`sources.release`); a slot
 * the gates rejected does not — it did the work it was reserved for.
 */
export async function generatePracticeItemsDetailed(
  opts: GeneratePracticeItemsOptions,
  sources: PracticeGenSources = practiceGenSources(),
): Promise<PracticeGenOutcome> {
  const nothing = (status: PracticeGenOutcome['status']): PracticeGenOutcome => ({ items: [], status, reserved: 0, pending: 0, background: DONE });
  if (!practiceGenEnabled()) return nothing('off');
  // Per-partner switch — before any slot is reserved.
  if (practiceGenDisabledForPartner(opts.partnerId)) {
    opts.onDebugEvent?.('practice_gen_skipped', `loId=${opts.loId} reason=partner_disabled`);
    return nothing('off');
  }
  // Audited-only partner (audited-items.ts): a freshly generated item is not
  // on the audited list, so it could never be served to this partner — do not
  // generate (or bank) one on its behalf. Also keeps the caller's anchor pool
  // out of any prompt. Before any slot is reserved; covers every caller.
  if (auditedOnlyForPartner(opts.partnerId)) {
    opts.onDebugEvent?.('practice_gen_skipped', `loId=${opts.loId} reason=partner_audited_only`);
    return nothing('off');
  }
  // Essay-practice nodes (FRQ / DBQ / LEQ / SAQ) are never filled by
  // generation — before any slot is reserved. Covers every caller (the
  // practice endpoint and the assigned-practice top-up).
  if (essayGenBlockEnabled() && (opts.essayNode === true || isEssayPracticeLoId(opts.loId))) {
    opts.onDebugEvent?.('practice_gen_skipped', `loId=${opts.loId} reason=essay_node`);
    return nothing('off');
  }
  const want = Math.max(0, Math.min(opts.shortfall, MAX_GENERATIONS_PER_REQUEST));
  if (want === 0) return nothing('off');

  let allowed: number;
  const reservedAt = new Date();
  try {
    allowed = await sources.reserve(opts.studentId, opts.loId, want);
  } catch (err) {
    console.warn('[practice-gen] cap check failed, degrading to zero generations:', err);
    return nothing('unavailable');
  }
  if (allowed <= 0) return nothing('limit');

  // One anchor PER SLOT — distinct when the pool has >=2 candidates, so two
  // parallel generations don't converge on the same template (see
  // `pickAnchorsForSlots`'s doc comment for the production defect this
  // fixes). Each slot also gets a different prompt directive
  // (`slotVariationDirective`, applied inside `buildUserPrompt`) so even a
  // pool of exactly 1 anchor still steers the two generations apart.
  // Drawing/graphing anchors are filtered out of the pool FIRST (see
  // usableAnchor), so a typed-answer anchor wins a slot whenever the pool has
  // one; a pool of only drawing anchors yields null → the skill-only prompt.
  // Withdrawn items (answer-key audit: wrong key / ill-posed —
  // withdrawn-items.ts) are never anchors either: a bad item would seed more
  // bad items. Enforced HERE so it holds for every caller's pool
  // (retrievePractice, the session-end top-up's stored assignment items).
  // They stay in `excludeHashes` below, so their text is not regenerated.
  const anchorPool = opts.anchorItems.filter((a) => !isWithdrawnItem(a.id) && usableAnchor(a) !== null);
  const anchors = pickAnchorsForSlots(anchorPool, allowed, opts.difficulty);
  // Structural, not topical: the LO's authored items are drawing tasks —
  // told by the caller that withheld them (authoredDrawingTasks) or visible
  // as drawing instructions in the pool it passed. Only matters for a slot
  // with no usable anchor (buildUserPrompt).
  const drawingLo = opts.authoredDrawingTasks === true
    || opts.anchorItems.some((a) => !isWithdrawnItem(a.id) && isDrawingInstruction(a.problemText));
  // Exclude-hash seed: every already-known same-LO item's text hash, so a
  // regeneration doesn't just reproduce existing content verbatim. Both
  // parallel generations share this same base list — there is no sibling
  // hash to add up-front (the two calls run concurrently); an in-batch
  // duplicate is instead caught by the acceptance step below.
  const excludeHashes = opts.anchorItems.map((it) => simpleHash(it.problemText));

  type Settled = { ok: true; value: GeneratedCandidate | null } | { ok: false; reason: unknown };
  const hardStop = new AbortController();
  const hardTimer = setTimeout(() => hardStop.abort(), PRACTICE_GEN_HARD_LIMIT_MS);
  (hardTimer as { unref?: () => void }).unref?.();
  const done: Array<Settled | undefined> = anchors.map(() => undefined);
  const slots: Array<Promise<Settled>> = anchors.map((anchor, i) =>
    // `Promise.resolve().then` so a source that throws synchronously is a
    // failed slot, not an exception out of this function.
    Promise.resolve()
      .then(() => generateOne(opts, anchor, sources, excludeHashes, i, drawingLo, hardStop.signal))
      .then(
        (value): Settled => ({ ok: true, value }),
        (reason): Settled => ({ ok: false, reason }),
      )
      .then((s) => { done[i] = s; return s; }),
  );
  const allSlots = Promise.all(slots).then(() => { clearTimeout(hardTimer); });

  // The ONE place an item is accepted and stored. Slot order is the order of
  // preference among slots that are ready together: a later slot that nearly
  // duplicates an earlier one is dropped. Only what survives is stored —
  // until 2026-10-05 each slot stored its own item before the two were ever
  // compared, so both twins of a request went into the bank.
  const items: PracticeItem[] = [];
  const seenIds = new Set<string>();
  const accept = async (s: Settled, inBackground: boolean): Promise<void> => {
    if (!s.ok) {
      console.warn('[practice-gen] one generation failed (degrading to fewer items):', s.reason);
      if (sources.release) {
        try {
          await sources.release(opts.studentId, opts.loId, 1, reservedAt);
        } catch (err) {
          console.warn('[practice-gen] could not release a failed slot (it stays counted):', err);
        }
      }
      return;
    }
    if (!s.value) return;
    const { item, row } = s.value;
    if (isWithdrawnItem(item.id)) {
      // Regenerated the exact content of a withdrawn bank row (same hash →
      // same `practice-gen.<loId>.<hash>` id): never serve it.
      logWithdrawnSkip(item.id);
      return;
    }
    if (seenIds.has(item.id)) {
      // Two parallel generations landed on identical content (same hash ->
      // same id) — drop the repeat rather than return a duplicate id in
      // one response.
      console.warn('[practice-gen] parallel generations produced a duplicate id, dropping the repeat:', item.id);
      return;
    }
    if (findNearDuplicate(comparable(item), items.map(comparable))) {
      opts.onDebugEvent?.('practice_gen_gate_failed', `loId=${opts.loId} reason=near_duplicate_sibling`);
      return;
    }
    try {
      await sources.persist(row);
    } catch (err) {
      console.warn('[practice-gen] one generation failed (degrading to fewer items):', err);
      return;
    }
    seenIds.add(item.id);
    items.push(item);
    if (inBackground) opts.onDebugEvent?.('practice_gen_background_stored', `loId=${opts.loId} id=${item.id}`);
  };

  const deadlineMs = opts.deadlineMs && opts.deadlineMs > 0 ? opts.deadlineMs : null;
  if (deadlineMs !== null) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([allSlots, new Promise<void>((resolve) => { timer = setTimeout(resolve, deadlineMs); })]);
    if (timer) clearTimeout(timer);
  } else {
    await allSlots;
  }

  // Which slots are late is decided ONCE, here, synchronously.
  const late: number[] = [];
  const ready: Settled[] = [];
  done.forEach((s, i) => { if (s) ready.push(s); else late.push(i); });
  for (const s of ready) await accept(s, false);
  const served = [...items];

  let background = DONE;
  if (late.length > 0) {
    opts.onDebugEvent?.('practice_gen_deadline', `loId=${opts.loId} deadline_ms=${deadlineMs} ready=${served.length} pending=${late.length}`);
    // One at a time, in the order they finish; `accept` never throws, and the
    // final catch keeps anything unexpected from becoming an unhandled rejection.
    let chain: Promise<void> = Promise.resolve();
    const lateDone = late.map((i) =>
      slots[i].then((s) => {
        chain = chain.then(() => accept(s, true));
        return chain;
      }),
    );
    background = Promise.all(lateDone).then(
      () => undefined,
      (err) => { console.warn('[practice-gen] background generation failed:', err); },
    );
  } else if (served.length === 0) {
    opts.onDebugEvent?.('practice_gen_empty', `loId=${opts.loId} topic=${opts.topic} attempts=${allowed}`);
  }
  return { items: served, status: 'ran', reserved: allowed, pending: late.length, background };
}
