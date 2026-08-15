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

import connectDB from '@core/db';
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
  return String(n);
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
): Promise<GenPayload | null> {
  if (gen.responseFormat === 'mcq') {
    const rawChoices = gen.choices ?? [];
    if (rawChoices.length === 0) return null; // malformed mcq — nothing to grade against
    // Strip a generator-baked-in "A) "/"A. "/"(A) "/"A - " label from every
    // choice's text when ALL choices carry one and the letters are
    // sequential from A (see `stripChoiceLetterPrefixes` doc comment) — the
    // portal renders its own A/B/C/D labels, so leaving these in produces a
    // doubled label ("B. B) 10/3"). A no-op (original array back) when the
    // all-or-nothing + sequential condition doesn't hold.
    const choiceTexts = stripChoiceLetterPrefixes(rawChoices);
    if (choiceTexts.some((text) => text.trim().length === 0)) return null; // stripping left a blank choice — reject the whole generation rather than serve mangled text
    const choices = choiceTexts.map((text, i) => ({ letter: String.fromCharCode(65 + i), text }));
    const claimedLetter = resolveMcqLetter(gen.finalAnswer, choices);
    if (!claimedLetter) return null; // claimed answer resolves to no real choice — reject
    const letterIndex = claimedLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    if (letterIndex < 0 || letterIndex >= choices.length) return null; // out-of-bounds letter — reject
    const { agree } = await verify(gen.problemText, claimedLetter, choices);
    if (!agree) return null;
    return { ...gen, finalAnswer: claimedLetter, choices: choiceTexts };
  }
  const normalized = normalizeNumericAnswer(gen.finalAnswer);
  if (!normalized) return null; // ambiguous/non-numeric shape — reject rather than guess
  const { agree } = await verify(gen.problemText, gen.finalAnswer);
  if (!agree) return null;
  return { ...gen, finalAnswer: normalized };
}

/** Generate one candidate (shared generator) then run it through the
 *  answer-shape gate. `hash` is returned even on gate/verify failure (null
 *  only when generation itself didn't produce a candidate at all) so a
 *  retry can exclude it. */
async function attemptGenerateVerified(
  userPrompt: string,
  excludeHashes: string[],
): Promise<{ result: { gen: GenPayload; hash: string } | null; hash: string | null }> {
  const candidate = await generateCandidate(userPrompt, excludeHashes);
  if (!candidate) return { result: null, hash: null };
  const gated = await gateGeneratedAnswer(candidate.gen);
  if (!gated) return { result: null, hash: candidate.hash };
  return { result: { gen: gated, hash: candidate.hash }, hash: candidate.hash };
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
): Promise<{ gen: GenPayload; hash: string } | null> {
  const first = await attemptGenerateVerified(userPrompt, excludeHashes);
  if (first.result) return first.result;
  const retryExcludeHashes = first.hash ? [...excludeHashes, first.hash] : excludeHashes;
  const second = await attemptGenerateVerified(userPrompt, retryExcludeHashes);
  return second.result;
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
  'This is generation 1 of up to 2 for this objective — write a natural, direct framing of the skill.',
  'This is generation 2 of up to 2 for this objective, generated in parallel with a sibling problem that ' +
    'may share the same anchor — make this one STRUCTURALLY distinct from a straightforward retelling: ' +
    'change which quantity is the unknown, the surface context/scenario, the givens/unknown arrangement, ' +
    'or the specific sub-skill angle within this objective. Do not just reuse the same setup with new numbers.',
];

function slotVariationDirective(slotIndex: number): string {
  return SLOT_VARIATION_DIRECTIVES[slotIndex % SLOT_VARIATION_DIRECTIVES.length];
}

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

function buildUserPrompt(opts: GeneratePracticeItemsOptions, anchor: PracticeItem | null, slotIndex: number): string {
  const difficultyLabel = opts.difficulty
    ? `difficulty bucket ${opts.difficulty} of 4 (1 = easier than typical, 4 = extension-grade)`
    : 'a typical practice difficulty for this objective';
  const slotDirective = slotVariationDirective(slotIndex);
  if (anchor) {
    return (
      `ANCHOR problem (do NOT reuse its numbers or context):\n${anchor.problemText}\n` +
      (anchor.expectedAnswer ? `ANCHOR answer (for difficulty calibration): ${anchor.expectedAnswer}\n` : '') +
      `\nLearning objective: ${opts.loId} (topic: ${opts.topic}).\n` +
      `\nWrite ONE fresh problem testing the same skill at ${difficultyLabel}. ${PERCENT_ANSWER_CLAUSE} ` +
      `${slotDirective} Write the problem now.`
    );
  }
  // Fresh-LO edge case: zero existing practice to anchor off of. Practice
  // items carry no free-text LO description at this layer, so the only
  // signal is the LO id + topic — generate from those alone.
  return (
    `There is no existing practice problem yet for this learning objective (brand-new LO).\n` +
    `Learning objective id: ${opts.loId} (topic: ${opts.topic}).\n` +
    `Infer the likely skill this LO id names and write ONE self-contained practice problem testing ` +
    `it at ${difficultyLabel}. ${PERCENT_ANSWER_CLAUSE} ${slotDirective} Write the problem now.`
  );
}

async function generateOne(
  opts: GeneratePracticeItemsOptions,
  anchor: PracticeItem | null,
  sources: PracticeGenSources,
  excludeHashes: string[],
  slotIndex: number,
): Promise<PracticeItem | null> {
  const prompt = buildUserPrompt(opts, anchor, slotIndex);
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

  // One anchor PER SLOT — distinct when the pool has >=2 candidates, so two
  // parallel generations don't converge on the same template (see
  // `pickAnchorsForSlots`'s doc comment for the production defect this
  // fixes). Each slot also gets a different prompt directive
  // (`slotVariationDirective`, applied inside `buildUserPrompt`) so even a
  // pool of exactly 1 anchor still steers the two generations apart.
  const anchors = pickAnchorsForSlots(opts.anchorItems, allowed, opts.difficulty);
  // Exclude-hash seed: every already-known same-LO item's text hash, so a
  // regeneration doesn't just reproduce existing content verbatim. Both
  // parallel generations share this same base list — there is no sibling
  // hash to add up-front (the two calls run concurrently); an in-batch
  // duplicate is instead caught by the post-generation id-dedup below.
  const excludeHashes = opts.anchorItems.map((it) => simpleHash(it.problemText));

  const settled = await Promise.allSettled(
    anchors.map((anchor, i) => generateOne(opts, anchor, sources, excludeHashes, i)),
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
