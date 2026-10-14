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
 * AUDITED-ONLY partners (2026-10-06 — audited-items.ts,
 * `PRACTICE_GEN_AUDITED_ONLY_PARTNERS`): for a listed caller a stored
 * GENERATED bank row (`practice-gen.*`) that is not on the audited list is
 * dropped at the same point, after the withdrawn rule (withdrawn wins), so it
 * is never served and never an anchor; and nothing is generated for that
 * caller (a fresh item is unaudited by definition). Authored bank rows are
 * untouched; any other caller, or an unknown one, gets exactly what it got
 * before.
 *
 * AUDITED LESSON STEPS (2026-10-10 — `isGeneratedCoursePlan`, kill switch
 * `TUTOR_PRACTICE_AUDITED_ALL_STEPS=off`): for a listed caller a try-yourself
 * of a GENERATED COURSE plan (`gen-` id, not private, not student-owned) is
 * served only when its id is on the audited lesson-step list
 * (audited-items.ts) — whichever objective it belongs to, objective 1
 * included, and on every path below: skill scope, a request for one
 * objective, a misfiled gain, topic scope. That covers the "expanded" plan E
 * that holds the lesson text for picker plan P's objectives (step id
 * `E::P.lo-K-try`). Assessments and assigned practice draw through this
 * function, so they get the same rule; a dropped step is never a generation
 * anchor. The try-yourselves of authored, private (review / homework /
 * freestyle) and student-owned plans are untouched, as is every other caller.
 * With the switch off only the steps skill scope draws from objectives 2..N
 * are gated (the rule before this date).
 *
 * SKILL SCOPE (2026-10-08 — `isSkillScopePlan`, kill switch
 * `TUTOR_PRACTICE_SKILL_SCOPE=off`): a generated course plan is ONE skill
 * with 2–8 objectives, and the course node holds only its first LO
 * (`gen-<uuid>.lo-1`). After the per-LO rule (3) above, practice for the
 * skill served objective 1 alone. A request for the FIRST LO of such a plan
 * now draws from every objective of THAT plan — each objective's
 * try-yourselves and the bank rows stored under any of the plan's LO ids —
 * through the same filters as before, spread across objectives
 * (`spreadAcrossObjectives`). Rule (3) is not relaxed between plans: the
 * extra LO ids come from the one plan the requested LO heads, and they are
 * namespaced under its id, so no other plan's item can enter. Every item is
 * returned with `loId` = the requested skill LO (what the portal attributes
 * attempts, mastery and the daily cap to); the objective it came from stays
 * readable in its id (`<planId>::<planId>.lo-K-try`). For an audited-only
 * partner every step must also be on the audited lesson-step list (see
 * AUDITED LESSON STEPS above). A request for any other LO, or for authored
 * content, is unchanged.
 *
 * FIGURE ITEMS (2026-10-09, contract v1.21.0 — figure-items.ts): a bank row
 * that carries a `figure` cannot be answered without it, so it is DEFAULT-
 * DENIED. It is served only when BOTH hold: the request lists `figure` in
 * `accepts`, and the caller of `retrievePractice` passed
 * `options.allowFigures` (the practice route does; nothing else does — so an
 * assessment, assigned practice or any future caller that merely forwards a
 * request can never receive one). It is then returned with its figure
 * attached, after the stored SVG passes the safety check again; a figure that
 * fails is withheld WITH its item. In every other case the row is dropped
 * where the pools are assembled, after the withdrawn and audited-only rules,
 * so it takes no slot and its shortfall is topped up like any other. A figure
 * item is never a generation anchor or avoid-list entry (the generator writes
 * text items), whoever asked. Skill scope and the audited-only gate apply to
 * a figure row exactly as to any other bank row.
 *
 * DRAWN ITEMS (2026-10-14, contract v1.22.0 — drawn-items.ts): a bank row
 * with `responseFormat: 'drawn'` (or any `drawn` value) is answered by
 * drawing on its figure. It is served only when the figure gate above is
 * open AND the request lists `drawn` in `accepts` AND the partner is on
 * `PRACTICE_DRAWN_ANSWER_PARTNERS` — then with its figure drawn now from the
 * stored spec and the frame beside it; a row that does not render or whose
 * key does not grade is withheld. In every other case it is dropped like an
 * unserved figure row, so every other caller gets exactly what it got before.
 *
 * SOURCE DOCUMENTS (2026-10-14, contract v1.22.0 — source-items.ts): an
 * item whose segment / bank row references passages (`passageId`,
 * `passageIds` + `packetLabel`) is returned WITH them (`sources`) when the
 * request lists `sources` in `accepts` AND the caller passed
 * `options.allowSources` (the practice route does; nothing else does). An item
 * on the sources-required list (put back from the withdrawn list after a
 * re-check with its documents shown) is served only then, with every document
 * resolved; for any other caller it is dropped where the pools are assembled,
 * like a withdrawn item, and every other item is returned exactly as before.
 * An item carrying documents is never a generation anchor.
 *
 * MISFILED MARKS (2026-10-17 — misfiled-items.ts, kill switch
 * `TUTOR_PRACTICE_MISFILED_MARKS=off`): some older items are filed under one
 * objective of a course skill (nearly always its first) but test a
 * neighbouring one, and carry a mark naming the objective they test (or none).
 *   - A request for ONE objective (an LO request that is not skill scope)
 *     skips an item marked for anything other than the requested objective,
 *     and gains the items marked for it that are filed under ANOTHER
 *     objective of the same skill plan (`isCourseSkillPlan`). The sibling
 *     objectives are read off the one plan the requested LO belongs to and
 *     are namespaced under its id, a gained bank row must be stored under one
 *     of them and a gained step must be a segment of a plan already servable
 *     for this request — so nothing from another skill or plan can enter. A
 *     gained item passes the same withdrawn / key-check / drawing / essay /
 *     audited-generated / figure filters as any other; a gained step is
 *     also held to the audited lesson-step list for an audited-only partner
 *     (the rule skill scope applies). It is returned
 *     with its own id and the `loId` it is FILED under — neither changes.
 *   - A SKILL request returns exactly the items it did before, every one
 *     with the same id and `loId` (the skill LO). Only `spreadAcrossObjectives`
 *     counts a marked item under the objective it tests, so a short set no
 *     longer spends its "objective 1" slots on items that test objective 2.
 *   - Topic scope, the coverage report (it reports where items are FILED),
 *     grading and the live tutor session do not read the marks.
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
import { generatePracticeItemsDetailed, logPracticeGenEvent, isDrawingOnlyItem, practiceGenDisabledForPartner, type PracticeGenSources, type PracticeGenOutcome } from './practice-gen';
import { essayGenBlockEnabled, isEssayPracticeNode, isGeneratedPracticeItemId } from './essay-practice';
import { isWithdrawnItem, keyCheckUntrusted, logUnverifiedKeySkip, logWithdrawnSkip, withoutWithdrawn } from './withdrawn-items';
import { auditedAllStepsEnabled, auditedOnlyForPartner, servableToPartner, withoutUnauditedGenerated, withoutUnauditedLessonSteps } from './audited-items';
import { acceptsFigures, carriesFigure, logFigureItemSkip, servableFigure } from './figure-items';
import { acceptsDrawn, drawnAnswersForPartner, isDrawnRow, logDrawnItemSkip, servableDrawn } from './drawn-items';
import { acceptsSources, applySourcesGate, carriesPassages, requiresSources, SOURCES_REQUIRED_ITEM_IDS, type PassageRefs } from './source-items';
import type { Passage } from '../passages/types';
import { MISFILED_ITEM_MARKS, idsMarkedFor, misfiledMarksEnabled, spreadObjectiveOf, withoutMisfiledFor, type MisfiledMarks } from './misfiled-items';

type Difficulty = 1 | 2 | 3 | 4;

/** Bank row projection the assembler needs. */
export interface BankLite {
  id: string;
  problemText: string;
  answer: string;
  hints?: string[];
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free' | 'drawn';
  /** Raw choice texts (as stored on ProblemBank). */
  choices?: string[];
  difficulty?: Difficulty;
  loId?: string;
  cedCode?: string;
  /** The stored `figure` value, as found (figure-items.ts). Present in ANY
   *  shape ⇒ the row is a figure item and is default-denied; it is validated
   *  (`servableFigure`) before it reaches the wire. Absent ⇒ a text item. */
  figure?: unknown;
  /** The stored drawn spec (drawn-items.ts), as found. A row with it — or
   *  with `responseFormat: 'drawn'` — is a drawn item: served only through
   *  the drawn gate, never as a figure or text item. */
  drawn?: unknown;
  /** The stimulus passage the row is about (passages/store.ts) — sent as
   *  `sources` to a caller that shows documents (source-items.ts). */
  passageId?: string;
}

/** What a bank read is for. `figures: true` only when the request may be
 *  answered with figure items; otherwise a source should leave those rows
 *  out of its query (the core drops any it returns regardless). */
export interface BankQueryOptions {
  figures?: boolean;
  /** `true` only when drawn items may be served (drawn-items.ts); otherwise
   *  a source should leave drawn rows out of its query. */
  drawn?: boolean;
}

/** Lesson-plan projection the assembler needs. */
export interface PlanLite {
  /** Plan id. Used to QUALIFY try-yourself item ids as `${planId}::${segId}`
   *  so grading resolves the right plan (segment ids are NOT globally unique
   *  across plans — `try-1` alone appears in 100+ plans). */
  id?: string;
  /** Plan title — read only by the essay-practice fallback rule
   *  (essay-practice.ts `isEssayPracticeNode`). */
  title?: string;
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
  /** Set when the plan was built from one student's own material or is a
   *  owner-stamped (`isStudentOwnedPlan`) — never a course skill, so never
   *  skill-scoped. */
  studentOwned?: boolean;
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
    /** Creation-time key check (generated / review plans). Present and not
     *  `verified` ⇒ the segment is never served as a practice item. */
    keyCheck?: { status: string } | null;
    /** The documents the try-yourself is about (source-items.ts). */
    passageId?: string;
    passageIds?: string[];
    packetLabel?: 'source' | 'document';
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
 * Is this stored plan tied to ONE student's material — and so never a course
 * skill? Pure, over the stored `metadata`:
 *   - `sourceKind: 'materials'` — built from an uploaded document;
 *   - `ownerStudentId`          — the owner stamp (homework / materials).
 * (Review / freestyle / homework plans are `classifyPrivatePlan`'s.)
 * `pendingPicker` is deliberately NOT a marker: it only limits how many
 * objectives one live session teaches, and course-skill plans with more
 * objectives than a session holds carry it. A picker plan built from a
 * student's material still carries `sourceKind` (and the owner stamp).
 */
export function isStudentOwnedPlan(metadata: Record<string, unknown> | null | undefined): boolean {
  if (!metadata) return false;
  return metadata.sourceKind === 'materials'
    || (typeof metadata.ownerStudentId === 'string' && metadata.ownerStudentId.trim().length > 0);
}

/** Kill switch for skill scope (default ON). `TUTOR_PRACTICE_SKILL_SCOPE=off`
 *  restores per-LO retrieval for every request. Server-side, read per call. */
export function skillScopeEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return (env.TUTOR_PRACTICE_SKILL_SCOPE ?? '').trim().toLowerCase() !== 'off';
}

/**
 * THE SKILL-SCOPE RULE. Is `loId` the skill handle of `plan` — the first
 * objective of a generated course plan — so that practice for it draws from
 * all of the plan's objectives? All of:
 *   1. the plan id starts with `gen-` (a stored plan minted by plan-generate;
 *      authored seeds, `rev-` and `freestyle-` plans never do);
 *   2. it is not a private artefact (`classifyPrivatePlan`: review /
 *      homework / freestyle) and not student-owned (`isStudentOwnedPlan`:
 *      materials / owner-stamped); a `pendingPicker` flag does not exclude;
 *   3. it has at least two distinct LOs and EVERY one is namespaced under the
 *      plan (`<planId>.…`) — which is what makes a cross-plan leak
 *      impossible: the extra LO ids can only ever name this plan;
 *   4. `loId` is the plan's FIRST LO (`los[0].id`) and that LO is
 *      `<planId>.lo-1` — the id plan-generate mints and a course node adopts.
 * The caller applies `planServable` (partner stamp) first. Pure.
 */
export function isSkillScopePlan(plan: PlanLite, loId: string): boolean {
  if (!isCourseSkillPlan(plan)) return false;
  return plan.los[0].id === loId && loId === `${plan.id}.lo-1`;
}

/**
 * Conditions 1–2 of the skill-scope rule on their own: is `plan` a generated
 * course plan — a `gen-` plan that is not private (review / homework /
 * freestyle) and not student-owned (materials / owner-stamped)? This is the
 * plan whose try-yourselves ("lesson steps") an audited-only partner is
 * served only from the audited lesson-step list (module header, AUDITED
 * LESSON STEPS). It does NOT ask that the LO ids be the plan's own: an
 * expanded plan that carries a picker plan's objective ids is one too, and
 * so is a single-objective plan. Pure.
 */
export function isGeneratedCoursePlan(plan: PlanLite): boolean {
  if (!plan.id || !plan.id.startsWith('gen-')) return false;
  if (plan.privateKind ?? classifyPrivatePlan(plan.id, undefined)) return false;
  return !plan.studentOwned;
}

/**
 * Conditions 1–3 of the skill-scope rule on their own: is `plan` a generated
 * course skill — a `gen-` plan, not private, not student-owned, with at least
 * two distinct LOs that are ALL namespaced under its own id? Its objectives
 * are then siblings of one skill, and no LO id of it can name another plan.
 * Pure.
 */
export function isCourseSkillPlan(plan: PlanLite): boolean {
  if (!isGeneratedCoursePlan(plan)) return false;
  const loIds = [...new Set(plan.los.map((l) => l.id))];
  if (loIds.length < 2) return false;
  return loIds.every((id) => id.startsWith(`${plan.id}.`));
}

/**
 * Order a skill's items so a set covers as many distinct objectives as
 * possible before repeating one, and successive requests work through all of
 * them. Deterministic: each pick takes the next item (pool order — bank
 * first, then try-yourselves) of the objective with the FEWEST items already
 * given to this student — already-seen ones (`seenByObjective`, the request's
 * `excludeIds` that fall in the objective's pool) plus those picked so far —
 * ties going to the earlier objective in plan order. Pure.
 */
export function spreadAcrossObjectives<T extends { id: string }>(
  items: readonly T[],
  objectiveOf: ReadonlyMap<string, string>,
  objectiveOrder: readonly string[],
  seenByObjective: ReadonlyMap<string, number> = new Map(),
): T[] {
  const queues = new Map<string, T[]>();
  for (const o of objectiveOrder) queues.set(o, []);
  for (const it of items) {
    const o = objectiveOf.get(it.id) ?? objectiveOrder[0] ?? '';
    if (!queues.has(o)) queues.set(o, []);
    (queues.get(o) as T[]).push(it);
  }
  const given = new Map<string, number>();
  for (const o of queues.keys()) given.set(o, seenByObjective.get(o) ?? 0);
  const out: T[] = [];
  while (out.length < items.length) {
    let pick: string | null = null;
    for (const [o, q] of queues) {
      if (q.length === 0) continue;
      if (pick === null || (given.get(o) as number) < (given.get(pick) as number)) pick = o;
    }
    if (pick === null) break;
    out.push((queues.get(pick) as T[]).shift() as T);
    given.set(pick, (given.get(pick) as number) + 1);
  }
  return out;
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
  bankForLoId(loId: string, difficulty?: Difficulty, opts?: BankQueryOptions): Promise<BankLite[]>;
  /** Bank rows for a topic id (matches `topic` OR `topicId`), optional difficulty. */
  bankForTopic(topicId: string, difficulty?: Difficulty, opts?: BankQueryOptions): Promise<BankLite[]>;
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

/**
 * THE FIGURE GATE (figure-items.ts). Bank rows → wire items:
 *   - a row with no figure maps as before;
 *   - a row with a figure, `serveFigures` false → dropped (one log line);
 *   - a row with a figure, `serveFigures` true → returned WITH its figure
 *     when `servableFigure` passes it, withheld otherwise (one warning).
 * Applied after the withdrawn / audited-only filters, like them before
 * de-dup, excludeIds and slicing.
 */
function bankRowsToItems(rows: readonly BankLite[], serveFigures: boolean, serveDrawn: boolean, where: string): PracticeItem[] {
  const items: PracticeItem[] = [];
  for (const b of rows) {
    // THE DRAWN GATE (drawn-items.ts) comes first: a drawn row is never
    // served as a figure or text item, only as a drawn one.
    if (isDrawnRow(b)) {
      if (!serveDrawn) {
        logDrawnItemSkip(b.id, where);
        continue;
      }
      const d = servableDrawn(b.id, b);
      if (d) items.push({ ...bankToItem(b), responseFormat: 'drawn', figure: d.figure, drawn: d.drawn });
      continue;
    }
    if (!carriesFigure(b)) {
      items.push(bankToItem(b));
      continue;
    }
    if (!serveFigures) {
      logFigureItemSkip(b.id, where);
      continue;
    }
    const figure = servableFigure(b.id, b.figure);
    if (figure) items.push({ ...bankToItem(b), figure });
  }
  return items;
}

/**
 * Does this plan hold a pure drawing try-yourself ("Graph the line.",
 * `isDrawingOnlyItem`) for `loId`? Those are never served (planToItems drops
 * them), so they never reach the generator as anchors — this is how a caller
 * tells it that the LO's authored practice is drawing tasks
 * (`GeneratePracticeItemsOptions.authoredDrawingTasks`), so it asks for a
 * typed/choice question on the same skill instead of treating the LO as
 * brand-new. True only when the LO OWNS at least one try-yourself
 * (`segmentOwnerLoId`; in a single-LO plan that is every try-yourself) and
 * ALL the try-yourselves it owns are drawing-only. A segment no LO can be
 * named for (a multi-LO curated plan's bare `try-1` ids) counts for nobody:
 * attributing it to every LO sent the drawing-skill prompt to LOs whose own
 * practice is typed. A prompt hint only — it never decides what is served.
 * Pure.
 */
export function loHasDrawingOnlyTask(
  plan: {
    los: ReadonlyArray<{ id: string }>;
    segments: ReadonlyArray<{ kind: string; id: string; problem?: string; offTopic?: boolean }>;
  },
  loId: string,
): boolean {
  if (!plan.los.some((l) => l.id === loId)) return false;
  const owned = (plan.segments ?? []).filter((seg) =>
    seg.kind === 'try_yourself' && seg.offTopic !== true && !!seg.problem
    && segmentOwnerLoId(plan.los, seg.id) === loId);
  return owned.length > 0 && owned.every((seg) => isDrawingOnlyItem(seg.problem as string));
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
    // Key checked at creation and NOT verified (mismatch / ill-posed /
    // unverifiable, incl. a check still running): same treatment as a
    // withdrawn item — a practice item is machine-graded against its key, so
    // an unverified key is never served, nor used as a generation anchor. A
    // segment with no `keyCheck` (legacy / authored) is unaffected.
    if (keyCheckUntrusted(seg)) {
      logUnverifiedKeySkip(id, seg);
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
 * Why a practice response has NO items (2026-10-05, additive — not in the v1
 * contract schema, which ignores unknown keys):
 *   'none_available' — structural: this skill has nothing to serve and
 *       nothing was generated because nothing could be (generation is off,
 *       the scope is a topic, the skill has no owning plan);
 *   'preparing' — transient: generation ran for this request and has nothing
 *       ready yet (the deadline passed with slots still running, both slots
 *       were rejected by the gates, a model call failed, the cap check
 *       failed) — asking again shortly can succeed;
 *   'limit' — the daily generation cap granted no slot.
 * Absent whenever `items` is non-empty.
 */
export type PracticeEmptyReason = 'none_available' | 'preparing' | 'limit';

export type RetrievePracticeResult = RetrievePracticeResponse & { emptyReason?: PracticeEmptyReason };

export interface RetrievePracticeOptions {
  /** Bounded wait for generation (the interactive practice endpoint) — see
   *  `GeneratePracticeItemsOptions.deadlineMs`. */
  genDeadlineMs?: number;
  /** Receives the promise of any generation still running when the response
   *  is returned, so a route can keep it attached to the request (`after`). */
  onBackground?: (work: Promise<void>) => void;
  /** This caller is the practice retrieval surface and may answer with
   *  figure items — when the request ALSO lists `figure` in `accepts`. Left
   *  unset by every other caller (assessment, assigned practice), which is
   *  what keeps a figure item out of them. See the module header. */
  allowFigures?: boolean;
  /** The misfiled marks to apply (misfiled-items.ts). Omitted ⇒ the committed
   *  list; tests inject their own. Ignored when the kill switch is off. */
  misfiledMarks?: MisfiledMarks;
  /** The audited lesson-step list to apply (audited-items.ts). Omitted ⇒ the
   *  committed list; tests inject their own. */
  auditedLessonSteps?: ReadonlySet<string>;
  /** This caller is the practice retrieval surface and shows an item's source
   *  documents — when the request ALSO lists `sources` in `accepts`. Left
   *  unset by every other caller (assessment, assigned practice), which is
   *  what keeps a sources-required item out of them. See the module header. */
  allowSources?: boolean;
  /** The sources-required list (source-items.ts). Omitted ⇒ the committed
   *  list; tests inject their own. */
  sourcesRequired?: ReadonlySet<string>;
  /** Passage lookup (tests). Omitted ⇒ passages/store.ts. */
  resolvePassage?: (id: string) => Passage | undefined;
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
  options: RetrievePracticeOptions = {},
): Promise<RetrievePracticeResult> {
  const who = caller ?? sources.caller;
  const difficulty = req.difficulty;
  // Figure items: default-deny (module header). Both conditions, or none.
  const serveFigures = options.allowFigures === true && acceptsFigures(req);
  // Drawn items: a figure item AND `drawn` in `accepts` AND a listed partner
  // (drawn-items.ts). Anything less: exactly as before drawn rows existed.
  const serveDrawn = serveFigures && acceptsDrawn(req) && drawnAnswersForPartner(who?.partnerId);
  const bankOpts: BankQueryOptions = serveDrawn ? { figures: serveFigures, drawn: true } : { figures: serveFigures };
  // Source documents (module header): both conditions, or none.
  const serveSources = options.allowSources === true && acceptsSources(req);
  const sourcesRequired = options.sourcesRequired ?? SOURCES_REQUIRED_ITEM_IDS;
  // Item id → the passages its segment / row references, for the gate below.
  const refsById = new Map<string, PassageRefs>();
  const notePlanRefs = (plans: readonly PlanLite[]): void => {
    for (const p of plans) {
      for (const sg of p.segments) {
        if (sg.kind === 'try_yourself' && carriesPassages(sg)) refsById.set(p.id ? `${p.id}::${sg.id}` : sg.id, sg);
      }
    }
  };
  const noteBankRefs = (rows: readonly BankLite[]): void => {
    for (const b of rows) if (carriesPassages(b)) refsById.set(b.id, b);
  };
  const planItems: PracticeItem[] = [];
  const bankItems: PracticeItem[] = [];
  // Hoisted out of the loId branch below so the shortfall/generation section
  // can derive the topic tag from the SAME already-fetched plans (no extra
  // lookup) — empty for a topicId-scoped request.
  let loScopePlans: PlanLite[] = [];
  // Set for an LO-scoped request on an essay-practice node: generation is
  // skipped and an empty result reads `none_available`.
  let essayNode = false;
  // Skill scope only: the objective (plan LO id) each pooled item came from,
  // and the plan's objectives in order. Null for every other request.
  let skillObjectives: string[] | null = null;
  const objectiveOf = new Map<string, string>();
  // Misfiled marks (module header). Null ⇒ switched off: nothing below reads them.
  const marks: MisfiledMarks | null = misfiledMarksEnabled() ? (options.misfiledMarks ?? MISFILED_ITEM_MARKS) : null;
  // Audited lesson steps (module header): with the switch on, EVERY step of a
  // generated course plan is held to the audited list for an audited-only
  // caller. Any other caller, or another kind of plan: the same array back.
  const gateEveryStep = auditedAllStepsEnabled();
  const onAuditedList = <T extends { id: string }>(steps: T[], where: string): T[] =>
    withoutUnauditedLessonSteps(steps, who?.partnerId, where, options.auditedLessonSteps);
  const auditedSteps = (p: PlanLite, steps: PracticeItem[], where: string): PracticeItem[] =>
    gateEveryStep && isGeneratedCoursePlan(p) ? onAuditedList(steps, where) : steps;

  if ('loId' in req.scope) {
    const loId = req.scope.loId;
    // Scoping happens BEFORE anything else reads the plans: an excluded plan
    // contributes no items, no anchors and no generation topic.
    const plans = (await sources.plansForLoId(loId)).filter((p) => planServable(p, loId, who));
    loScopePlans = plans;
    notePlanRefs(plans);
    // Skill scope (see the module header): `loId` heads a generated course
    // plan ⇒ draw from every objective of that one plan.
    const skillPlan = skillScopeEnabled() ? plans.find((p) => isSkillScopePlan(p, loId)) : undefined;
    if (skillPlan) skillObjectives = [...new Set(skillPlan.los.map((l) => l.id))];
    // ONE objective asked for (not skill scope): the marks apply. `gainIds`
    // are the items marked as testing it; `siblings` the other objectives of
    // the one course skill plan it belongs to — empty unless both exist.
    const single = marks && !skillObjectives ? marks : null;
    const gainIds = single ? idsMarkedFor(loId, single) : null;
    const homePlan = gainIds && gainIds.size > 0 ? plans.find((p) => isCourseSkillPlan(p) && p.los.some((l) => l.id === loId)) : undefined;
    const siblings = homePlan ? [...new Set(homePlan.los.map((l) => l.id))].filter((o) => o !== loId) : [];
    for (const p of plans) {
      if (p !== skillPlan || !skillObjectives) {
        // One objective asked for — or a second plan that carries the skill
        // LO (an expanded plan's `E::P.lo-1-try`).
        const own = auditedSteps(p, planToItems(p, loId), 'practice-lo');
        planItems.push(...(single ? withoutMisfiledFor(own, loId, single) : own));
        continue;
      }
      for (const objective of skillObjectives) {
        const own = planToItems(p, objective);
        // A step reaches an audited-only partner only when it is on the
        // audited lesson-step list (withdrawn already dropped) — objective 1
        // included. Switch off: objective 1 is not gated, as before.
        const servable = objective === loId && !gateEveryStep ? own : onAuditedList(own, 'practice-skill');
        for (const it of servable) {
          if (objectiveOf.has(it.id)) continue; // one objective per step
          objectiveOf.set(it.id, objective);
          // Attribution stays on the skill the student opened.
          planItems.push({ ...it, loId });
        }
      }
    }
    // Gained lesson steps: a step filed under a sibling objective and marked
    // as testing the requested one, from a plan already servable for this
    // request. The sibling ids are the home plan's own, so only a plan that
    // teaches that same skill can hold one. A gained step must be audited
    // for an audited-only partner, as in skill scope (switch off: objective
    // 1's step is not gated).
    if (homePlan && gainIds) {
      for (const p of plans) {
        // Only a plan that holds a marked segment is read at all (so a
        // sibling's withdrawn step is not logged as skipped on every request).
        if (!p.id || !p.segments.some((sg) => gainIds.has(`${p.id}::${sg.id}`))) continue;
        for (const o of siblings) {
          const marked = planToItems(p, o).filter((it) => gainIds.has(it.id));
          const ungated = o === homePlan.los[0].id && !(gateEveryStep && isGeneratedCoursePlan(p));
          planItems.push(...(ungated ? marked : onAuditedList(marked, 'practice-misfiled')));
        }
      }
    }
    let bank = await sources.bankForLoId(loId, difficulty, bankOpts);
    if (single) {
      bank = withoutMisfiledFor(bank, loId, single);
      if (homePlan && gainIds) {
        // Gained bank rows: stored under a sibling objective (checked on the
        // row itself, whatever the source returned) and marked for this one.
        const more = await Promise.all(siblings.map((o) => sources.bankForLoId(o, difficulty, bankOpts)));
        const gained = more.flatMap((rows, i) => rows.filter((b) => b.loId === siblings[i] && gainIds.has(b.id)));
        if (gained.length > 0) bank = [...bank, ...gained];
      }
    }
    if (skillObjectives) {
      // Bank rows stored under any other objective of the plan. The LO ids
      // are this plan's own (`<planId>.lo-K`), so nothing foreign matches.
      const others = skillObjectives.filter((o) => o !== loId);
      const more = await Promise.all(others.map((o) => sources.bankForLoId(o, difficulty, bankOpts)));
      for (const b of bank) objectiveOf.set(b.id, loId);
      more.forEach((rows, i) => {
        for (const b of rows) if (!objectiveOf.has(b.id)) objectiveOf.set(b.id, others[i]);
      });
      // The row's own `loId` is re-tagged to the skill LO for the wire only.
      bank = [...bank, ...more.flat()].map((b) => ({ ...b, loId }));
      // Misfiled marks: the SPREAD counts a marked item under the objective
      // it tests. `objectiveOf` feeds only the ordering below — which items
      // are pooled, their ids and their `loId` are exactly as without marks.
      if (marks) {
        for (const [id, filed] of objectiveOf) {
          const o = spreadObjectiveOf(id, filed, skillObjectives, marks);
          if (o !== filed) objectiveOf.set(id, o);
        }
      }
    }
    // Essay-practice node (FRQ / DBQ / LEQ / SAQ): rows the on-demand
    // generator banked here earlier are MCQ / one-number / short items, not
    // essays — never served. Authored bank rows and the plan's rubric items
    // are untouched.
    essayNode = essayGenBlockEnabled() && isEssayPracticeNode(loId, plans);
    const servableBank = essayNode
      ? bank.filter((b) => {
          if (!isGeneratedPracticeItemId(b.id)) return true;
          console.log(`[practice] generated item not served on essay node ${b.id}`);
          return false;
        })
      : bank;
    noteBankRefs(servableBank);
    bankItems.push(...bankRowsToItems(withoutUnauditedGenerated(withoutWithdrawn(servableBank), who?.partnerId, 'practice-lo'), serveFigures, serveDrawn, 'practice-lo'));
  } else {
    const topicId = req.scope.topicId;
    const plans = (await sources.plansForTopic(topicId)).filter((p) => planServable(p, undefined, who));
    notePlanRefs(plans);
    // Topic scope: include every non-off-topic try-yourself, tagging each with
    // its own LO where the segment id names one, else its plan's first LO
    // (best-effort) so callers still get a loId hint.
    for (const p of plans) {
      const firstLo = p.los[0]?.id ?? '';
      if (firstLo) planItems.push(...auditedSteps(p, planToItems(p, firstLo, true), 'practice-topic'));
    }
    const bank = await sources.bankForTopic(topicId, difficulty, bankOpts);
    noteBankRefs(bank);
    bankItems.push(...bankRowsToItems(withoutUnauditedGenerated(withoutWithdrawn(bank), who?.partnerId, 'practice-topic'), serveFigures, serveDrawn, 'practice-topic'));
  }

  // THE SOURCES GATE (source-items.ts): attach documents for a caller that
  // shows them; otherwise drop the items that cannot be answered without.
  const gated = applySourcesGate([...bankItems, ...planItems], refsById, serveSources, 'practice', sourcesRequired, options.resolvePassage);

  // De-dup by id; bank (verified) items first, then plan try-yourselves.
  const seen = new Set<string>();
  const ordered: PracticeItem[] = [];
  for (const it of gated) {
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

  // Skill scope: objective spread. `seen` counts, per objective, the pool
  // items this student was already served (excludeIds), so the objectives
  // they have met least come first on every draw.
  let spread = available;
  if (skillObjectives) {
    const seenByObjective = new Map<string, number>();
    if (excludeSet) {
      for (const it of ordered) {
        if (!excludeSet.has(it.id)) continue;
        const o = objectiveOf.get(it.id) ?? skillObjectives[0];
        seenByObjective.set(o, (seenByObjective.get(o) ?? 0) + 1);
      }
    }
    spread = spreadAcrossObjectives(available, objectiveOf, skillObjectives, seenByObjective);
  }

  // Design B (generate-on-exhaustion), Task 3: top up the shortfall with
  // verified runtime-generated items. LO-scope only — generated ids and the
  // per-(student,LO) cap are keyed on a single LO, which a topic scope
  // doesn't have. Any failure (kill-switch, over-cap, generation error)
  // degrades to the retrieval-only result — never an error.
  let generated: PracticeItem[] = [];
  let genOutcome: PracticeGenOutcome | null = null;
  // PRACTICE_GEN_DISABLED_PARTNERS: a listed partner is served stored items
  // only. Skipped here (genOutcome stays null ⇒ an empty result reads
  // `none_available`, never 'preparing' / 'limit') and again inside the
  // generator, which every other caller goes through.
  // PRACTICE_GEN_AUDITED_ONLY_PARTNERS: the same for a caller restricted to
  // audited generated items — a freshly generated item is not on the list.
  const genDisabledForCaller = practiceGenDisabledForPartner(who?.partnerId) || auditedOnlyForPartner(who?.partnerId);
  if (shortfall > 0 && 'loId' in req.scope && !essayNode && !genDisabledForCaller) {
    const loId = req.scope.loId;
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
        genOutcome = await generatePracticeItemsDetailed(
          {
            studentId: req.studentId,
            loId: req.scope.loId,
            topic: derivedTopic,
            topicId: derivedTopic,
            cedCode: ordered.find((it) => it.cedCode)?.cedCode,
            difficulty,
            shortfall,
            ...(who?.partnerId ? { partnerId: who.partnerId } : {}),
            // Anchor pool: same-LO items already assembled above
            // (pre-exclusion — an anchor is a template, never itself served,
            // so a student-seen item is still a fine anchor). Never a figure
            // item: its text leans on a picture the generated item would
            // not have.
            // Nor an item carrying source documents (same reason).
            anchorItems: ordered.filter((it) => !carriesFigure(it) && !it.sources && !requiresSources(it.id, sourcesRequired)),
            // The LO's authored try-yourselves are drawing tasks (dropped by
            // planToItems above, so absent from `ordered`): ask for the
            // typed/choice form of the skill (2026-10-04).
            ...(loScopePlans.some((p) => loHasDrawingOnlyTask(p, loId)) ? { authoredDrawingTasks: true } : {}),
            // Visible empty/gate-failed outcomes as `[practice-gen] …` log
            // lines (2026-10-02).
            onDebugEvent: logPracticeGenEvent,
            ...(options.genDeadlineMs ? { deadlineMs: options.genDeadlineMs } : {}),
          },
          genSources,
        );
        generated = genOutcome.items;
        if (genOutcome.pending > 0) options.onBackground?.(genOutcome.background);
      } catch (err) {
        // Belt-and-suspenders: generatePracticeItems already swallows its own
        // failures and returns [], but a thrown error here must still never
        // surface past retrievePractice.
        console.warn('[practice] generate-on-exhaustion failed, degrading to retrieval-only:', err);
        generated = [];
        genOutcome = null;
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
    (it) => !availableIds.has(it.id) && !(excludeSet?.has(it.id) ?? false) && !isWithdrawnItem(it.id)
      // Audited-only caller: holds for any injected generator too.
      && servableToPartner(it.id, who?.partnerId),
  );
  const combined = [...spread, ...generatedDeduped];

  const items = combined.slice(0, req.count);
  if (items.length > 0 || req.count <= 0) return { items };
  return { items, emptyReason: practiceEmptyReason(genOutcome) };
}

/** See `PracticeEmptyReason`. `outcome` is null when generation was never
 *  attempted for this request (or threw). */
export function practiceEmptyReason(outcome: Pick<PracticeGenOutcome, 'status'> | null): PracticeEmptyReason {
  if (!outcome || outcome.status === 'off') return 'none_available';
  if (outcome.status === 'limit') return 'limit';
  return 'preparing'; // 'ran' with nothing ready, or the cap check failed
}
