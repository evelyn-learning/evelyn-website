/**
 * Phase 3(c) — gap-targeted practice retrieval (item → LO).
 *
 * RETRIEVAL, not generation (the brain-gen Layer 2 stays stubbed). A scope
 * resolves to a union of:
 *   - plan try-yourself problems whose plan `los[]` includes the LO code, and
 *   - LO-tagged (or topic-tagged) ProblemBank items, difficulty-filtered.
 *
 * WHICH plans, and which of their try-yourselves (2026-10-04 — a student of
 * one partner was served a wrong-keyed item out of another partner's
 * student's private review plan):
 *   1. A per-student artefact (review / freestyle / homework plan) is never a
 *      SHARED source. It is reachable only through its own plan-scoped LO id
 *      (`<planId>.…`), which only a session on that very plan ever holds.
 *   2. A plan stamped with the partner that created it is served to that
 *      partner only; a caller whose partner is unknown gets none of them.
 *   3. SegmentTryYourself carries no loId, so segment→LO linkage is read off
 *      the segment id (`<loId>-try`, the generated/review convention). A
 *      single-LO plan owns all its segments; in a multi-LO plan a segment
 *      whose id names no LO is served under no LO.
 * These are enforced HERE, in the pure core, so they hold for any
 * `PracticeSources` (production Mongo adapter or a test fake).
 *
 * WITHDRAWN items (2026-10-04 answer-key audit — withdrawn-items.ts): a bank
 * row or plan try-yourself on the withdrawn list is dropped as the pools are
 * assembled, BEFORE de-dup / excludeIds / slicing, so it never takes a slot,
 * never becomes a generation anchor, and the shortfall it leaves is topped up
 * like any other. Grading of an already-issued withdrawn id is untouched
 * (adapters.ts resolvers do not consult the list).
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
import { generatePracticeItems, logPracticeGenEvent, isDrawingOnlyItem, type PracticeGenSources } from './practice-gen';
import { isWithdrawnItem, logWithdrawnSkip, withoutWithdrawn } from './withdrawn-items';

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
  /** Topic id (topic-taxonomy vocabulary). Used to derive the topic tag for
   *  Design B's generate-on-exhaustion path engine-side — NEVER the portal's
   *  `courseId` (a Mongo ObjectId hex on the real wire, not a topic id). */
  topic?: string;
  /** The partner whose request created this plan (`metadata.portalPartnerId`
   *  on a stored plan). Present ⇒ served to that partner only. Curated seed
   *  plans never carry one. */
  partnerId?: string;
  /** Set when the plan is one student's private artefact — see
   *  `classifyPrivatePlan`. A `rev-`/`freestyle-` id is recognised even when
   *  a source leaves this unset. */
  privateKind?: PrivatePlanKind;
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

/** Who is asking. Threaded explicitly from the authenticated portal route
 *  (`withPortalAuth` → `auth.partnerId`); absent/blank = unknown caller. */
export interface PracticeCaller {
  partnerId?: string;
}

export type PrivatePlanKind = 'review' | 'freestyle' | 'homework';

/**
 * Is this plan ONE student's private artefact (never a shared practice
 * source)? Pure — takes the plan id and its stored `metadata`.
 *   - review:    `rev-<uuid>` / `metadata.reviewPlan` (compose-review-plan.ts —
 *                real portal LO ids in `los[]`, question + key written by a
 *                small model with no verification, for one student);
 *   - homework:  `metadata.kind === 'homework-help'` (lesson-plan/homework.ts —
 *                the student's own uploaded problems);
 *   - freestyle: `freestyle-…` / `freestyle-fallback-…` ids
 *                (generate-from-text.ts `mintGeneratedPlanId`).
 * The literals are repeated here rather than imported so this module stays
 * free of the lesson-plan runtime; scripts/test-practice-plan-scoping.ts pins
 * them against the real markers.
 */
export function classifyPrivatePlan(
  planId: string | undefined,
  metadata: Record<string, unknown> | null | undefined,
): PrivatePlanKind | undefined {
  if (metadata?.reviewPlan === true || planId?.startsWith('rev-')) return 'review';
  if (metadata?.kind === 'homework-help') return 'homework';
  if (planId?.startsWith('freestyle-')) return 'freestyle';
  return undefined;
}

/**
 * May `plan` feed practice for this request? `loId` is the requested LO
 * (undefined for a topic-scoped request, which has no single LO).
 *
 * No kill switch on purpose: serving another student's private plan is a
 * correctness + privacy defect, not a tunable.
 */
function planServable(plan: PlanLite, loId: string | undefined, caller: PracticeCaller | undefined): boolean {
  const privateKind = plan.privateKind ?? classifyPrivatePlan(plan.id, undefined);
  if (privateKind) {
    // A review plan's LOs are real, shared portal LO ids — never its own, so
    // it is never served. A homework / freestyle plan is reachable only via
    // its OWN plan-scoped LO (`<planId>.homework-lo-1`, `<planId>.lo-N`),
    // which is what the owner's assigned-practice path asks for.
    if (privateKind === 'review') return false;
    if (!plan.id || !loId || !loId.startsWith(`${plan.id}.`)) return false;
  }
  if (plan.partnerId) {
    // Fail closed: an unknown caller never sees a partner-stamped plan.
    const callerPartner = caller?.partnerId?.trim();
    if (!callerPartner || callerPartner !== plan.partnerId) return false;
  }
  return true;
}

/**
 * The LO a segment belongs to, read off the plan itself, or null when it
 * cannot be known.
 *   - one distinct LO → that LO (every segment of the plan is on it);
 *   - several → the LO whose id prefixes the segment id as `<loId>-…`
 *     (generated plans: `<planId>.lo-N-try`; review plans: `<loId>-try`,
 *     `-try2`). Longest LO id wins, so `a-b-try` is `a-b`'s, not `a`'s.
 * Authored multi-LO plans use bare ids (`try-1`) → null.
 */
export function segmentOwnerLoId(los: ReadonlyArray<{ id: string }>, segmentId: string): string | null {
  const loIds = [...new Set(los.map((l) => l.id))];
  if (loIds.length === 0) return null;
  if (loIds.length === 1) return loIds[0];
  let owner: string | null = null;
  for (const id of loIds) {
    if (segmentId.startsWith(`${id}-`) && (owner === null || id.length > owner.length)) owner = id;
  }
  return owner;
}

export interface PracticeSources {
  /** The caller these sources were built for, when the code that calls
   *  `retrievePractice` cannot pass one itself (it only holds the sources).
   *  An explicit `caller` argument to `retrievePractice` takes precedence. */
  caller?: PracticeCaller;
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

/** Extract on-LO try-yourself items from a plan that targets `loId`: only
 *  the try-yourselves that BELONG to `loId` (`segmentOwnerLoId`). With
 *  `fallbackToRequested` (topic scope, where the items are asked for by
 *  topic and the LO is only a hint) an unattributable segment keeps the
 *  requested LO as its best-effort tag and an attributable one is tagged
 *  with its own LO. */
function planToItems(plan: PlanLite, loId: string, fallbackToRequested = false): PracticeItem[] {
  if (!plan.los.some((l) => l.id === loId)) return [];
  // Curated plans list ALIAS standards for one lesson (CCSS + NCERT codes on
  // the same content) and name their segments `try-1`, so no segment is
  // attributable to any LO. For such a plan — unstamped, not private, and
  // with no attributable try-yourself at all — every LO is the same lesson
  // and the items stay served under each, as before. A plan whose segment
  // ids DO name LOs, or that carries a partner/private marker, gets the
  // strict rule.
  const aliasLos = !plan.partnerId && !plan.privateKind
    && !plan.segments.some((sg) => sg.kind === 'try_yourself' && segmentOwnerLoId(plan.los, sg.id) !== null);
  const items: PracticeItem[] = [];
  for (const seg of plan.segments) {
    if (seg.kind !== 'try_yourself' || seg.offTopic === true || !seg.problem) continue;
    const owner = segmentOwnerLoId(plan.los, seg.id);
    if (!fallbackToRequested && !aliasLos && owner !== loId) continue;
    const itemLoId = owner ?? loId;
    const cedCode = plan.los.find((l) => l.id === itemLoId)?.standard;
    const id = plan.id ? `${plan.id}::${seg.id}` : seg.id;
    // Withdrawn by the answer-key audit (wrong key / ill-posed): never served,
    // and — since the anchor pool is built from these items — never an anchor.
    if (isWithdrawnItem(id)) {
      logWithdrawnSkip(id);
      continue;
    }
    // A pure drawing/graphing try-yourself ("Sketch the forces…", "Graph the
    // line.") with no typed-answer cue is a whiteboard task — never serve it
    // as a practice or assessment item (buildAssessment draws from here too).
    if (isDrawingOnlyItem(seg.problem)) {
      console.log(`[practice] dropped drawing item ${id}`);
      continue;
    }
    items.push({
      // Qualify with the plan id so the answer key resolves to THIS plan's
      // segment (segment ids collide across plans). Bare fallback only when a
      // caller supplies an id-less PlanLite (test fixtures).
      id,
      source: 'plan-try-yourself',
      problemText: seg.problem,
      expectedAnswer: seg.expectedAnswer,
      hints: seg.hints,
      responseFormat: seg.responseFormat,
      choices: seg.choices,
      loId: itemLoId,
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
  /** Injectable generate-on-exhaustion dependencies — tests supply a stub;
   *  production omits it (defaults to the real Anthropic+Mongo sources
   *  inside generatePracticeItems). */
  genSources?: PracticeGenSources,
  /** The authenticated caller (partner). Omitted ⇒ `sources.caller`; neither
   *  ⇒ unknown, and partner-stamped plans are not served (fail closed). */
  caller?: PracticeCaller,
): Promise<RetrievePracticeResponse> {
  const who = caller ?? sources.caller;
  const difficulty = req.difficulty;
  const planItems: PracticeItem[] = [];
  const bankItems: PracticeItem[] = [];
  // Hoisted out of the loId branch below so the shortfall/generation section
  // can derive the topic tag from the SAME already-fetched plans (no extra
  // lookup) — empty for a topicId-scoped request.
  let loScopePlans: PlanLite[] = [];

  if ('loId' in req.scope) {
    const loId = req.scope.loId;
    // Scoping happens BEFORE anything else reads the plans: an excluded plan
    // contributes no items, no anchors and no generation topic.
    const plans = (await sources.plansForLoId(loId)).filter((p) => planServable(p, loId, who));
    loScopePlans = plans;
    for (const p of plans) planItems.push(...planToItems(p, loId));
    const bank = await sources.bankForLoId(loId, difficulty);
    bankItems.push(...withoutWithdrawn(bank).map(bankToItem));
  } else {
    const topicId = req.scope.topicId;
    const plans = (await sources.plansForTopic(topicId)).filter((p) => planServable(p, undefined, who));
    // Topic scope: include every non-off-topic try-yourself, tagging each with
    // its own LO where the segment id names one, else its plan's first LO
    // (best-effort) so callers still get a loId hint.
    for (const p of plans) {
      const firstLo = p.los[0]?.id ?? '';
      if (firstLo) planItems.push(...planToItems(p, firstLo, true));
    }
    const bank = await sources.bankForTopic(topicId, difficulty);
    bankItems.push(...withoutWithdrawn(bank).map(bankToItem));
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
  // items the retrieval pool alone couldn't supply. A thin pool degrades to
  // fewer items, never an error.
  const shortfall = Math.max(0, req.count - available.length);

  // Design B (generate-on-exhaustion), Task 3: top up the shortfall with
  // verified runtime-generated items. LO-scope only — generated ids and the
  // per-(student,LO) cap are keyed on a single LO, which a topic scope
  // doesn't have. Any failure (kill-switch, over-cap, generation error)
  // degrades to the retrieval-only result — never an error.
  let generated: PracticeItem[] = [];
  if (shortfall > 0 && 'loId' in req.scope) {
    // Topic tag derived ENGINE-SIDE from the LO's owning plan — never the
    // portal's `courseId`, which is a Mongo ObjectId hex on the real wire,
    // not a topic-taxonomy id (round-1 review fix). `loScopePlans` here is
    // already `SEED_PLANS.filter(p => p.los.some(l => l.id === loId))` (via
    // `sources.plansForLoId`), so `.find(p => p.topic)` IS the owning-plan
    // lookup. `topicId` mirrors `topic` so `bankForTopic`'s
    // `{topic}/{topicId}` OR match finds these rows the same way it finds
    // hand-authored ones. No owning plan (or an owning plan with no topic)
    // → skip generation entirely rather than write an orphan bank row with a
    // bogus tag.
    //
    // `loScopePlans` = `sources.plansForLoId(loId)` — SEED_PLANS matches
    // first, then Mongo-stored plans (Option B: runtime-generated plans,
    // e.g. white-label taxonomy-built courses). For a generated plan
    // (CourseBuildService.buildOne() persists it via engine.generatePlan),
    // `topic` is whatever free-text topic the caller passed at generation
    // time (academy's materialize() passes the LO's own `title` — a
    // per-LO string, NOT a shared topic-taxonomy id) — it will rarely if
    // ever match an existing `bankForTopic` row, but it's still a real,
    // non-empty tag to write fresh generated items under.
    const derivedTopic = loScopePlans.find((p) => p.topic)?.topic;
    if (derivedTopic) {
      try {
        generated = await generatePracticeItems(
          {
            studentId: req.studentId,
            loId: req.scope.loId,
            topic: derivedTopic,
            topicId: derivedTopic,
            cedCode: ordered.find((it) => it.cedCode)?.cedCode,
            difficulty,
            shortfall,
            // Anchor pool: same-LO items already assembled above
            // (pre-exclusion — an anchor is a template, never itself served,
            // so a student-seen item is still a fine anchor).
            anchorItems: ordered,
            // Visible empty/gate-failed outcomes as `[practice-gen] …` log
            // lines (2026-10-02).
            onDebugEvent: logPracticeGenEvent,
          },
          genSources,
        );
      } catch (err) {
        // Belt-and-suspenders: generatePracticeItems already swallows its own
        // failures and returns [], but a thrown error here must still never
        // surface past retrievePractice.
        console.warn('[practice] generate-on-exhaustion failed, degrading to retrieval-only:', err);
        generated = [];
      }
    }
  }

  // Dedup generated items against BOTH the retrieval pool AND the caller's
  // excludeIds — a regeneration that lands on the exact same content
  // (same hash -> same practice-gen.<loId>.<hash> id) as something already
  // banked-and-served to this student must not re-appear in this response.
  const availableIds = new Set(available.map((it) => it.id));
  // A regeneration can also land on a WITHDRAWN `practice-gen.*` id (same
  // content → same hash): the real generator already drops it, this holds
  // for any injected one.
  const generatedDeduped = generated.filter(
    (it) => !availableIds.has(it.id) && !(excludeSet?.has(it.id) ?? false) && !isWithdrawnItem(it.id),
  );
  const combined = [...available, ...generatedDeduped];

  return { items: combined.slice(0, req.count) };
}
