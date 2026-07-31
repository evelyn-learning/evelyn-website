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
 * gate before it is ever returned or persisted. Any failure anywhere in this
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

import connectDB from '@/lib/db';
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

type Difficulty = 1 | 2 | 3 | 4;

/** ≤2 generations per request, run in parallel (spec bound). */
export const MAX_GENERATIONS_PER_REQUEST = 2;
/** Per-(student, LO) daily cap (spec bound). */
export const PER_STUDENT_LO_DAILY_CAP = 20;
/** Global daily cap across all students/LOs (spec bound). */
export const GLOBAL_DAILY_CAP = 500;
/** Fallback difficulty bucket when neither the request nor an anchor names
 *  one — mirrors problem-generator.ts's `resolveAbsoluteDifficulty` default. */
const DEFAULT_DIFFICULTY: Difficulty = 2;

function practiceGenEnabled(): boolean {
  // Kill-switch: anything but the literal 'on' is OFF, including unset.
  return process.env.PRACTICE_GEN === 'on';
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
  generateAndVerify(userPrompt: string, excludeHashes: string[]): Promise<{ gen: GenPayload; hash: string } | null>;
  /** Reserve up to `n` generation slots for (studentId, loId) today, honoring
   *  the per-(student,LO) and global daily caps. Returns the number actually
   *  granted (0..n) — 0 means "over cap, generate nothing". */
  reserve(studentId: string, loId: string, n: number): Promise<number>;
  /** Persist one verified generated item permanently into the bank. */
  persist(row: PracticeGenPersistRow): Promise<void>;
}

export interface GeneratePracticeItemsOptions {
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
  const globalRoom = Math.max(0, GLOBAL_DAILY_CAP - globalCount);
  const allowed = Math.min(n, studentRoom, globalRoom);
  if (allowed <= 0) return 0;
  await Promise.all([
    PracticeGenCounter.updateOne({ scopeKey: studentKey, day }, { $inc: { count: allowed } }, { upsert: true }),
    PracticeGenCounter.updateOne({ scopeKey: 'global', day }, { $inc: { count: allowed } }, { upsert: true }),
  ]);
  return allowed;
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
        solutionText: row.gen.teachingAnswer,
        hints: row.gen.hints,
        responseFormat: row.gen.responseFormat === 'mcq' ? 'mcq' : 'numeric',
        choices: row.gen.choices,
        source: { name: 'Evelyn (practice-gen runtime)' },
        license: 'internal-original',
        verifiedAt: new Date(),
        verifierModel: BRAINGEN_VERIFY_MODEL,
      },
    },
    { upsert: true },
  );
}

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
 * percent/comma-thousands wrapper is stripped ONLY when the string carries
 * exactly one unambiguous numeric value ("48 square inches" -> "48", "$4.50"
 * -> "4.5", "300,000 J" -> "300000", "50%" -> "0.5") — a simple a/b fraction
 * counts as one unambiguous value too. Anything with zero or MORE THAN ONE
 * numeric run (e.g. "between 3 and 5") is rejected rather than guessed: the
 * real-bank audit that motivated this gate found a live case where an
 * unnormalized unit-suffixed answer reached `Number(answer)` = NaN in the
 * portal grader, permanently failing every student who saw the item.
 */
export function normalizeNumericAnswer(raw: string): string | null {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return null;
  if (PLAIN_NUMBER_RE.test(trimmed)) return trimmed;
  // Collapse thousands-separator commas ("300,000" -> "300000") before
  // counting distinct numeric runs, so one big number isn't mistaken for two
  // ambiguous ones.
  const collapsed = trimmed.replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1');
  const isSimpleFraction = /^-?\d+(?:\.\d+)?\s*\/\s*-?\d+(?:\.\d+)?$/.test(collapsed);
  const runs = collapsed.match(/-?\d+(?:\.\d+)?/g) ?? [];
  if (runs.length === 0) return null; // no number at all
  if (runs.length > 1 && !isSimpleFraction) return null; // ambiguous — reject rather than guess
  const n = extractAnswerNumber(collapsed);
  if (n === null || !Number.isFinite(n)) return null;
  return String(n);
}

/**
 * Answer-shape gate (round-1 review fix) — runs BEFORE a generated payload is
 * either served or persisted:
 *
 *   - numeric: `finalAnswer` must reduce to a plain-number string via
 *     `normalizeNumericAnswer`, then an independent blind solve must agree.
 *   - mcq: the claimed answer is resolved to a bare letter against the
 *     ACTUAL choices (`resolveMcqLetter`) and re-verified CHOICES-AWARE
 *     (`verify` appends the choices and asks for a letter-only reply — never
 *     a blind solve that can't see them). The stored/served answer is always
 *     that bare letter.
 *
 * Returns the payload with `finalAnswer` normalized to the bank-safe form, or
 * null when the payload fails the gate — the caller must drop the generation
 * (a failed attempt: degrades to fewer items, never served, never banked).
 */
export async function gateGeneratedAnswer(
  gen: GenPayload,
  verify: VerifyFn = verifyClaimedAnswer,
): Promise<GenPayload | null> {
  if (gen.responseFormat === 'mcq') {
    const rawChoices = gen.choices ?? [];
    if (rawChoices.length === 0) return null; // malformed mcq — nothing to grade against
    const choices = rawChoices.map((text, i) => ({ letter: String.fromCharCode(65 + i), text }));
    const claimedLetter = resolveMcqLetter(gen.finalAnswer, choices);
    if (!claimedLetter) return null; // claimed answer resolves to no real choice — reject
    const { agree } = await verify(gen.problemText, claimedLetter, choices);
    if (!agree) return null;
    return { ...gen, finalAnswer: claimedLetter };
  }
  const normalized = normalizeNumericAnswer(gen.finalAnswer);
  if (!normalized) return null; // ambiguous/non-numeric shape — reject rather than guess
  const { agree } = await verify(gen.problemText, normalized);
  if (!agree) return null;
  return { ...gen, finalAnswer: normalized };
}

/** Generate one candidate (shared generator) then run it through the
 *  answer-shape gate. Null on any failure at either step. */
async function generateVerified(
  userPrompt: string,
  excludeHashes: string[],
): Promise<{ gen: GenPayload; hash: string } | null> {
  const candidate = await generateCandidate(userPrompt, excludeHashes);
  if (!candidate) return null;
  const gated = await gateGeneratedAnswer(candidate.gen);
  if (!gated) return null;
  return { gen: gated, hash: candidate.hash };
}

/** `generateVerified` with 1 retry on failure (temperature yields a
 *  different problem the second time) — the same retry shape the
 *  tutor-session pipeline uses. */
async function generateVerifiedWithRetry(
  userPrompt: string,
  excludeHashes: string[],
): Promise<{ gen: GenPayload; hash: string } | null> {
  const first = await generateVerified(userPrompt, excludeHashes);
  if (first) return first;
  return generateVerified(userPrompt, excludeHashes); // 1 retry
}

/** Real dependencies: Anthropic generate + this module's answer-shape gate +
 *  Mongo caps/persistence. */
export function practiceGenSources(): PracticeGenSources {
  return {
    generateAndVerify: (userPrompt, excludeHashes) => generateVerifiedWithRetry(userPrompt, excludeHashes),
    reserve: (studentId, loId, n) => mongoReserve(studentId, loId, n),
    persist: (row) => mongoPersist(row),
  };
}

/** Sample a generation anchor: an existing same-LO item at the target
 *  difficulty; if none at that difficulty, any same-LO item; null when the
 *  LO has zero existing practice at all (fresh-LO edge case). */
function pickAnchor(items: PracticeItem[], difficulty?: Difficulty): PracticeItem | null {
  if (items.length === 0) return null;
  const sameDifficulty = difficulty ? items.filter((i) => i.difficulty === difficulty) : [];
  const pool = sameDifficulty.length > 0 ? sameDifficulty : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildUserPrompt(opts: GeneratePracticeItemsOptions, anchor: PracticeItem | null): string {
  const difficultyLabel = opts.difficulty
    ? `difficulty bucket ${opts.difficulty} of 4 (1 = easier than typical, 4 = extension-grade)`
    : 'a typical practice difficulty for this objective';
  if (anchor) {
    return (
      `ANCHOR problem (do NOT reuse its numbers or context):\n${anchor.problemText}\n` +
      (anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${anchor.expectedAnswer}\n` : '') +
      `\nLearning objective: ${opts.loId} (topic: ${opts.topic}).\n` +
      `\nWrite ONE fresh problem testing the same skill at ${difficultyLabel}. Write the problem now.`
    );
  }
  // Fresh-LO edge case: zero existing practice to anchor off of. Practice
  // items carry no free-text LO description at this layer, so the only
  // signal is the LO id + topic — generate from those alone.
  return (
    `There is no existing practice problem yet for this learning objective (brand-new LO).\n` +
    `Learning objective id: ${opts.loId} (topic: ${opts.topic}).\n` +
    `Infer the likely skill this LO id names and write ONE self-contained practice problem testing ` +
    `it at ${difficultyLabel}. Write the problem now.`
  );
}

async function generateOne(
  opts: GeneratePracticeItemsOptions,
  anchor: PracticeItem | null,
  sources: PracticeGenSources,
  excludeHashes: string[],
): Promise<PracticeItem | null> {
  const prompt = buildUserPrompt(opts, anchor);
  const result = await sources.generateAndVerify(prompt, excludeHashes);
  if (!result) return null; // unverified/gate-failed — never served, never banked
  const { gen, hash } = result;
  const id = `practice-gen.${opts.loId}.${hash}`;
  const difficulty: Difficulty = opts.difficulty ?? anchor?.difficulty ?? DEFAULT_DIFFICULTY;
  const cedCode = opts.cedCode ?? anchor?.cedCode;
  const responseFormat = gen.responseFormat === 'mcq' ? 'mcq' : 'numeric';

  await sources.persist({ id, topic: opts.topic, topicId: opts.topicId, loId: opts.loId, cedCode, difficulty, gen });

  return {
    id,
    source: 'bank',
    problemText: gen.problemText,
    // mcq → the bare LETTER, numeric → the bare number string (bank
    // convention) — both already enforced by the answer-shape gate above.
    expectedAnswer: gen.finalAnswer,
    hints: gen.hints,
    responseFormat,
    choices: gen.choices?.map((c, i) => ({ id: String.fromCharCode(65 + i), text: c })),
    difficulty,
    loId: opts.loId,
    cedCode,
  };
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
  if (!practiceGenEnabled()) return [];
  const want = Math.max(0, Math.min(opts.shortfall, MAX_GENERATIONS_PER_REQUEST));
  if (want === 0) return [];

  let allowed: number;
  try {
    allowed = await sources.reserve(opts.studentId, opts.loId, want);
  } catch (err) {
    console.warn('[practice-gen] cap check failed, degrading to zero generations:', err);
    return [];
  }
  if (allowed <= 0) return [];

  const anchor = pickAnchor(opts.anchorItems, opts.difficulty);
  // Exclude-hash seed: every already-known same-LO item's text hash, so a
  // regeneration doesn't just reproduce existing content verbatim. Both
  // parallel generations share this same base list — there is no sibling
  // hash to add up-front (the two calls run concurrently); an in-batch
  // duplicate is instead caught by the post-generation id-dedup below.
  const excludeHashes = opts.anchorItems.map((it) => simpleHash(it.problemText));

  const settled = await Promise.allSettled(
    Array.from({ length: allowed }, () => generateOne(opts, anchor, sources, excludeHashes)),
  );

  const items: PracticeItem[] = [];
  const seenIds = new Set<string>();
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) {
      if (seenIds.has(s.value.id)) {
        // Two parallel generations landed on identical content (same hash ->
        // same id) — drop the repeat rather than return a duplicate id in
        // one response.
        console.warn('[practice-gen] parallel generations produced a duplicate id, dropping the repeat:', s.value.id);
        continue;
      }
      seenIds.add(s.value.id);
      items.push(s.value);
    } else if (s.status === 'rejected') {
      console.warn('[practice-gen] one generation failed (degrading to fewer items):', s.reason);
    }
  }
  return items;
}
