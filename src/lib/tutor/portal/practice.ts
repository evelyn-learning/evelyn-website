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
      id: seg.id,
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
 * Assemble practice for a request. Plan try-yourselves first (authored,
 * on-LO), then bank items; de-duplicated by id and capped at `count`.
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

  // De-dup by id, plan items take precedence over bank items.
  const seen = new Set<string>();
  const ordered: PracticeItem[] = [];
  for (const it of [...planItems, ...bankItems]) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    ordered.push(it);
  }
  return { items: ordered.slice(0, req.count) };
}
