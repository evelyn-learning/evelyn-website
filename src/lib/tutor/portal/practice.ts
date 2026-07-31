/**
 * Phase 3(c) — gap-targeted practice retrieval (item → LO).
 *
 * RETRIEVAL, not generation (the brain-gen Layer 2 stays stubbed). A scope
 * resolves to a union of:
 *   - plan try-yourself problems whose plan `los[]` includes the LO code
 *     (segment→LO linkage is plan-level: SegmentTryYourself carries no loId), and
 *   - LO-tagged (or topic-tagged) ProblemBank items, difficulty-filtered.
 *
 * The assembly core (`retrievePractice`) takes an injectable `PracticeSources`
 * so it is unit-testable without Mongo. Phase 4 supplies concrete Mongo- and
 * lesson-plan-store-backed sources.
 *
 * Difficulty filtering applies to BANK items (which carry a difficulty
 * bucket); plan try-yourselves have no bucket and are always included for an
 * LO scope (they are the authored, on-LO practice).
 */

import type {
  RetrievePracticeRequest,
  RetrievePracticeResponse,
  PracticeItem,
} from '@evelyn/portal-contract/v1';

type Difficulty = 1 | 2 | 3 | 4;

/** Bank row projection the assembler needs. */
export interface BankLite {
  id: string;
  problemText: string;
  answer: string;
  hints?: string[];
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  /** Raw choice texts (as stored on ProblemBank). */
  choices?: string[];
  difficulty?: Difficulty;
  loId?: string;
  cedCode?: string;
}

/** Lesson-plan projection the assembler needs. */
export interface PlanLite {
  /** Plan id. Used to QUALIFY try-yourself item ids as `${planId}::${segId}`
   *  so grading resolves the right plan (segment ids are NOT globally unique
   *  across plans — `try-1` alone appears in 100+ plans). */
  id?: string;
  los: Array<{ id: string; standard?: string }>;
  segments: Array<{
    kind: string;
    id: string;
    problem?: string;
    expectedAnswer?: string;
    hints?: string[];
    responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
    choices?: Array<{ id: string; text: string; correct?: boolean }>;
    offTopic?: boolean;
  }>;
}

export interface PracticeSources {
  /** Plans whose `los[]` include this LO code. */
  plansForLoId(loId: string): Promise<PlanLite[]>;
  /** Plans for a topic id (topic-scope try-yourselves). */
  plansForTopic(topicId: string): Promise<PlanLite[]>;
  /** Bank rows tagged with this LO code, optional difficulty filter. */
  bankForLoId(loId: string, difficulty?: Difficulty): Promise<BankLite[]>;
  /** Bank rows for a topic id (matches `topic` OR `topicId`), optional difficulty. */
  bankForTopic(topicId: string, difficulty?: Difficulty): Promise<BankLite[]>;
}

/** Map a stored bank row to the contract's PracticeItem. */
function bankToItem(b: BankLite): PracticeItem {
  return {
    id: b.id,
    source: 'bank',
    problemText: b.problemText,
    expectedAnswer: b.answer,
    hints: b.hints,
    responseFormat: b.responseFormat,
    choices: b.choices?.map((c, i) => ({ id: String.fromCharCode(65 + i), text: c })),
    difficulty: b.difficulty,
    loId: b.loId,
    cedCode: b.cedCode,
  };
}

/** Extract on-LO try-yourself items from a plan that targets `loId`. */
function planToItems(plan: PlanLite, loId: string): PracticeItem[] {
  const lo = plan.los.find((l) => l.id === loId);
  if (!lo) return [];
  const cedCode = lo.standard;
  const items: PracticeItem[] = [];
  for (const seg of plan.segments) {
    if (seg.kind !== 'try_yourself' || seg.offTopic === true || !seg.problem) continue;
    items.push({
      // Qualify with the plan id so the answer key resolves to THIS plan's
      // segment (segment ids collide across plans). Bare fallback only when a
      // caller supplies an id-less PlanLite (test fixtures).
      id: plan.id ? `${plan.id}::${seg.id}` : seg.id,
      source: 'plan-try-yourself',
      problemText: seg.problem,
      expectedAnswer: seg.expectedAnswer,
      hints: seg.hints,
      responseFormat: seg.responseFormat,
      choices: seg.choices,
      loId,
      cedCode,
    });
  }
  return items;
}

/**
 * Assemble practice for a request. Verified ProblemBank items first (the
 * purpose-built, answer-key-clean, globally-unique-id assessment pool), then
 * plan try-yourselves as supplement/fallback; de-duplicated by id and capped
 * at `count`. Bank-first ensures scored quizzes surface the vetted bank rather
 * than being crowded out by teaching-scaffold try-yourselves.
 */
export async function retrievePractice(
  req: RetrievePracticeRequest,
  sources: PracticeSources,
): Promise<RetrievePracticeResponse> {
  const difficulty = req.difficulty;
  const planItems: PracticeItem[] = [];
  const bankItems: PracticeItem[] = [];

  if ('loId' in req.scope) {
    const loId = req.scope.loId;
    const plans = await sources.plansForLoId(loId);
    for (const p of plans) planItems.push(...planToItems(p, loId));
    const bank = await sources.bankForLoId(loId, difficulty);
    for (const b of bank) bankItems.push(bankToItem(b));
  } else {
    const topicId = req.scope.topicId;
    const plans = await sources.plansForTopic(topicId);
    // Topic scope: include every non-off-topic try-yourself, tagging each with
    // its plan's first LO (best-effort) so callers still get a loId hint.
    for (const p of plans) {
      const firstLo = p.los[0]?.id ?? '';
      if (firstLo) planItems.push(...planToItems(p, firstLo));
    }
    const bank = await sources.bankForTopic(topicId, difficulty);
    for (const b of bank) bankItems.push(bankToItem(b));
  }

  // De-dup by id; bank (verified) items first, then plan try-yourselves.
  const seen = new Set<string>();
  const ordered: PracticeItem[] = [];
  for (const it of [...bankItems, ...planItems]) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    ordered.push(it);
  }

  // Design B (generate-on-exhaustion): drop ids the portal says this student
  // has already been served, BEFORE slicing to count, so a fresh item fills
  // the freed slot instead of a repeat crowding it out.
  const excludeSet = req.excludeIds?.length ? new Set(req.excludeIds) : null;
  const available = excludeSet ? ordered.filter((it) => !excludeSet.has(it.id)) : ordered;

  // Shortfall vs. what was asked for, computed BEFORE slicing — how many more
  // items the retrieval pool alone couldn't supply. Currently unconsumed here
  // (retrieval-only); the Task 3 generation-fallback hook reads this same gap
  // (`req.count - available.length`, floored at 0) to top up the response
  // engine-side before it ever reaches the portal. A thin pool degrades to
  // fewer items, never an error.
  const shortfall = Math.max(0, req.count - available.length);
  if (shortfall > 0) {
    // No-op for now — retrieval degrades to fewer items, never an error.
    // Task 3 (practice-gen.ts) hooks in exactly here: sample an anchor from
    // `available`/the LO, generate+verify up to 2 replacements, and append
    // them to the sliced result before it's returned.
  }

  return { items: available.slice(0, req.count) };
}
