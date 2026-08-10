/**
 * Mock-exam attempt service — start/resume, lazy expiry, answer-stripped
 * section serving. Dependency-injected on a `MockStores` port so the logic
 * is testable against an in-memory fixture without a Mongo connection;
 * `mongoMockStores()` is the real implementation used in production.
 *
 * Lifecycle (this task owns start/resume + listForms only):
 *   none in-flight        → create attempt, pin+serve first module
 *   in_section, live      → re-serve same module + saved responses
 *   in_section, blown     → finalize the module (Task 8) then return state
 *   at_break              → report break info (no deadline runs)
 *   in-flight but stale   → lazily expire, then treat as none in-flight
 */

import { randomUUID } from 'node:crypto';
import type {
  ListMockFormsResponse,
  MockAttemptState,
  MockAttemptSummary,
  MockAttemptStatus,
  MockFormSummary,
  MockResponse,
  MockSectionItem,
  MockSectionPayload,
  StartMockAttemptRequest,
  SaveMockResponsesRequest,
  AdvanceMockAttemptRequest,
} from '@evelyn/portal-contract/v1';
import { resolvePassage } from '@/lib/tutor/passages/store';
import { connectDB } from '@/lib/db';
import { MockForm } from '@/models/MockForm';
import { MockAttempt, type IMockAttempt } from '@/models/MockAttempt';
import { ProblemBank } from '@/models/ProblemBank';
import { getBlueprint } from './blueprints';
import type { ExamBlueprint } from './blueprints';
import type { SeedableItem } from './fixtures';
import { answersMatch, scoreMcqSections, applyCurves } from './scoring';

export const GRACE_MS = 15_000;
export const ATTEMPT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Plain-object mirror of IMockForm minus Mongoose Document. */
export interface FormDoc {
  formId: string;
  examKey: string;
  topicIds: string[];
  label: string;
  status: 'draft' | 'live';
  sections: Array<{
    sectionId: string;
    modules: Array<{ moduleId: string; itemIds: string[] }>;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Plain-object mirror of IMockAttempt minus Mongoose Document. */
export interface AttemptDoc {
  attemptId: string;
  studentId: string;
  formId: string;
  examKey: string;
  status: MockAttemptStatus;
  cursor: { sectionIdx: number; moduleIdx: number };
  sectionDeadlineAt?: Date;
  servedModules: Array<{ sectionIdx: number; moduleId: string; itemIds: string[] }>;
  responses: Array<{
    itemId: string;
    answer?: string;
    frqText?: string;
    markedForReview?: boolean;
    struckChoices?: number[];
    annotations?: Array<{ start: number; end: number; note?: string }>;
  }>;
  moduleRouting: Array<{ sectionId: string; variant: 'easy' | 'hard' }>;
  rawSections?: Array<{ sectionId: string; rawCorrect: number; rawTotal: number; scaled?: number }>;
  scaled?: {
    composite: number;
    compositeMax: number;
    sections: Array<{
      sectionId: string;
      label: string;
      scaled: number;
      scaledMax: number;
      inComposite?: boolean;
    }>;
  };
  loBreakdown?: Array<{ loId: string; correct: number; total: number; sectionId?: string }>;
  frqGrades?: Array<{
    itemId: string;
    totalPoints: number;
    maxPoints: number;
    parts: Array<{ criterionId: string; pointsAwarded: number; maxPoints: number; feedback: string }>;
    ungraded?: boolean;
  }>;
  footnote?: string;
  gradingStartedAt?: Date;
  gradingLockToken?: string;
  gapsFedAt?: Date;
  isRetake: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MockStores {
  findLiveForms(topicId: string): Promise<FormDoc[]>;
  findForm(formId: string): Promise<FormDoc | null>;
  findAttempt(attemptId: string): Promise<AttemptDoc | null>;
  findAttempts(studentId: string, formIds: string[]): Promise<AttemptDoc[]>;
  findInFlight(studentId: string, formId: string): Promise<AttemptDoc | null>;
  createAttempt(a: AttemptDoc): Promise<void>;
  saveAttempt(a: AttemptDoc): Promise<void>;
  /** Preserves the order of the requested itemIds. */
  getItems(itemIds: string[]): Promise<SeedableItem[]>;
}

// --- mongoMockStores: thin .lean() wrappers over MockForm/MockAttempt/ProblemBank ---

function toFormDoc(doc: Record<string, unknown>): FormDoc {
  const { _id, __v, ...rest } = doc;
  void _id;
  void __v;
  return rest as unknown as FormDoc;
}

function toAttemptDoc(doc: Record<string, unknown>): AttemptDoc {
  const { _id, __v, ...rest } = doc;
  void _id;
  void __v;
  return rest as unknown as AttemptDoc;
}

export function mongoMockStores(): MockStores {
  return {
    async findLiveForms(topicId) {
      await connectDB();
      const docs = await MockForm.find({ topicIds: topicId, status: 'live' }).lean();
      return (docs as unknown as Record<string, unknown>[]).map(toFormDoc);
    },
    async findForm(formId) {
      await connectDB();
      const doc = await MockForm.findOne({ formId }).lean();
      return doc ? toFormDoc(doc as unknown as Record<string, unknown>) : null;
    },
    async findAttempt(attemptId) {
      await connectDB();
      const doc = await MockAttempt.findOne({ attemptId }).lean();
      return doc ? toAttemptDoc(doc as unknown as Record<string, unknown>) : null;
    },
    async findAttempts(studentId, formIds) {
      await connectDB();
      const docs = await MockAttempt.find({ studentId, formId: { $in: formIds } }).lean();
      return (docs as unknown as Record<string, unknown>[]).map(toAttemptDoc);
    },
    async findInFlight(studentId, formId) {
      await connectDB();
      const doc = await MockAttempt.findOne({
        studentId,
        formId,
        status: { $in: ['in_section', 'at_break'] },
      }).lean();
      return doc ? toAttemptDoc(doc as unknown as Record<string, unknown>) : null;
    },
    async createAttempt(a) {
      await connectDB();
      await MockAttempt.create(a as unknown as Partial<IMockAttempt>);
    },
    async saveAttempt(a) {
      await connectDB();
      const { attemptId, ...rest } = a;
      // A blanket $set never clears a field: Mongo drops undefined values, so a
      // transition that must REMOVE a field (e.g. sectionDeadlineAt on entering
      // at_break) would silently keep the stale value. Split defined fields into
      // $set and any explicitly-undefined field into $unset. The memory store
      // has no such trap (structuredClone preserves the undefined key), so this
      // keeps both stores behaviourally identical.
      const set: Record<string, unknown> = {};
      const unset: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v === undefined) unset[k] = '';
        else set[k] = v;
      }
      const update: Record<string, unknown> = {};
      if (Object.keys(set).length) update.$set = set;
      if (Object.keys(unset).length) update.$unset = unset;
      await MockAttempt.updateOne({ attemptId }, update);
    },
    async getItems(itemIds) {
      await connectDB();
      const docs = await ProblemBank.find({ id: { $in: itemIds } }).lean();
      const byId = new Map((docs as unknown as SeedableItem[]).map((d) => [d.id, d]));
      return itemIds.map((id) => byId.get(id)).filter((it): it is SeedableItem => !!it);
    },
  };
}

// --- memoryMockStores: Maps + structuredClone on read/write, for tests + fixture ---

export function memoryMockStores(seed: { forms: FormDoc[]; items: SeedableItem[] }): MockStores {
  const forms = new Map<string, FormDoc>(seed.forms.map((f) => [f.formId, structuredClone(f)]));
  const items = new Map<string, SeedableItem>(seed.items.map((it) => [it.id, structuredClone(it)]));
  const attempts = new Map<string, AttemptDoc>();

  return {
    async findLiveForms(topicId) {
      return Array.from(forms.values())
        .filter((f) => f.status === 'live' && f.topicIds.includes(topicId))
        .map((f) => structuredClone(f));
    },
    async findForm(formId) {
      const f = forms.get(formId);
      return f ? structuredClone(f) : null;
    },
    async findAttempt(attemptId) {
      const a = attempts.get(attemptId);
      return a ? structuredClone(a) : null;
    },
    async findAttempts(studentId, formIds) {
      return Array.from(attempts.values())
        .filter((a) => a.studentId === studentId && formIds.includes(a.formId))
        .map((a) => structuredClone(a));
    },
    async findInFlight(studentId, formId) {
      const a = Array.from(attempts.values()).find(
        (x) => x.studentId === studentId && x.formId === formId && (x.status === 'in_section' || x.status === 'at_break')
      );
      return a ? structuredClone(a) : null;
    },
    async createAttempt(a) {
      attempts.set(a.attemptId, structuredClone(a));
    },
    async saveAttempt(a) {
      attempts.set(a.attemptId, structuredClone(a));
    },
    async getItems(itemIds) {
      return itemIds
        .map((id) => items.get(id))
        .filter((it): it is SeedableItem => !!it)
        .map((it) => structuredClone(it));
    },
  };
}

// --- serving: strip answers/solutions/hints/rubric before an item leaves the service ---

function toSectionItem(item: SeedableItem): MockSectionItem {
  const passage = item.passageId ? resolvePassage(item.passageId) : undefined;
  return {
    itemId: item.id,
    responseFormat: item.responseFormat,
    problemText: item.problemText,
    choices: item.choices,
    passage: item.passageId && passage
      ? { passageId: item.passageId, title: passage.title, text: passage.fullText }
      : undefined,
  };
}

async function buildInSectionState(
  stores: MockStores,
  blueprint: ExamBlueprint,
  attempt: AttemptDoc,
  served: { sectionIdx: number; moduleId: string; itemIds: string[] }
): Promise<MockAttemptState> {
  const blueprintSection = blueprint.sections[served.sectionIdx];
  if (!blueprintSection) throw new Error(`Unknown section index ${served.sectionIdx} in blueprint ${blueprint.examKey}`);
  const blueprintModule = blueprintSection.modules.find((m) => m.moduleId === served.moduleId);
  if (!blueprintModule) throw new Error(`Unknown module ${served.moduleId} in section ${blueprintSection.sectionId}`);
  if (!attempt.sectionDeadlineAt) throw new Error(`Attempt ${attempt.attemptId} is in_section without a deadline`);

  const items = await stores.getItems(served.itemIds);
  const savedResponses: MockResponse[] = attempt.responses.filter((r) => served.itemIds.includes(r.itemId));

  const section: MockSectionPayload = {
    sectionId: blueprintSection.sectionId,
    label: blueprintSection.label,
    moduleLabel: blueprintModule.label,
    timeLimitMin: blueprintModule.timeLimitMin,
    deadlineAt: attempt.sectionDeadlineAt.getTime(),
    tools: blueprintSection.tools,
    items: items.map(toSectionItem),
    savedResponses,
  };

  return {
    attemptId: attempt.attemptId,
    formId: attempt.formId,
    status: 'in_section',
    cursor: attempt.cursor,
    section,
  };
}

/**
 * The served module the cursor currently points at. `cursor.moduleIdx` is
 * SECTION-RELATIVE (the position within this section's served path: m1=0, the
 * routed m2=1), not a global index into servedModules — so filter to the
 * current section first, then index.
 */
function currentServedModule(attempt: AttemptDoc) {
  const inSection = attempt.servedModules.filter((m) => m.sectionIdx === attempt.cursor.sectionIdx);
  return inSection[attempt.cursor.moduleIdx];
}

/** The module a section is entered through: its adaptive from-module, else its
 *  first non-variant (i.e. only-path) module. */
function entryModuleId(section: ExamBlueprint['sections'][number]): string {
  if (section.adaptive) return section.adaptive.fromModuleId;
  const nonVariant = section.modules.find((m) => !m.variant);
  return (nonVariant ?? section.modules[0]).moduleId;
}

/**
 * Mutates `attempt` to open the entry module of `sectionIdx`: pins it into
 * servedModules, stamps a fresh deadline, resets the cursor to that section's
 * first module (moduleIdx 0), and flips status to in_section. Does NOT persist.
 */
function openSection(attempt: AttemptDoc, form: FormDoc, blueprint: ExamBlueprint, sectionIdx: number, now: number): AttemptDoc {
  const bpSection = blueprint.sections[sectionIdx];
  if (!bpSection) throw new Error(`Unknown section index ${sectionIdx} in blueprint ${blueprint.examKey}`);
  const moduleId = entryModuleId(bpSection);
  const bpModule = bpSection.modules.find((m) => m.moduleId === moduleId);
  if (!bpModule) throw new Error(`Unknown module ${moduleId} in section ${bpSection.sectionId}`);
  const formSection = form.sections.find((s) => s.sectionId === bpSection.sectionId);
  const formModule = formSection?.modules.find((m) => m.moduleId === moduleId);
  if (!formModule) throw new Error(`form_module_not_in_blueprint: ${form.formId}/${moduleId}`);

  attempt.servedModules.push({ sectionIdx, moduleId, itemIds: formModule.itemIds });
  attempt.cursor = { sectionIdx, moduleIdx: 0 };
  attempt.sectionDeadlineAt = new Date(now + bpModule.timeLimitMin * 60_000);
  attempt.status = 'in_section';
  return attempt;
}

/** Reads out the current attempt state for the wire, regardless of status. */
async function buildAttemptState(
  stores: MockStores,
  blueprint: ExamBlueprint,
  attempt: AttemptDoc
): Promise<MockAttemptState> {
  if (attempt.status === 'in_section') {
    const served = currentServedModule(attempt);
    if (!served) throw new Error(`Attempt ${attempt.attemptId} cursor points past servedModules`);
    return buildInSectionState(stores, blueprint, attempt, served);
  }
  if (attempt.status === 'at_break') {
    const prevSection = blueprint.sections[attempt.cursor.sectionIdx - 1];
    const nextSection = blueprint.sections[attempt.cursor.sectionIdx];
    return {
      attemptId: attempt.attemptId,
      formId: attempt.formId,
      status: 'at_break',
      cursor: attempt.cursor,
      breakMinutes: prevSection?.breakAfterMin ?? 0,
      nextSectionLabel: nextSection?.label ?? '',
    };
  }
  // completed | grading | expired: no live section payload.
  return {
    attemptId: attempt.attemptId,
    formId: attempt.formId,
    status: attempt.status,
    cursor: attempt.cursor,
  };
}

/**
 * Closes the open module and advances the attempt one step: adaptive routing →
 * next-variant module, else section boundary (break / next section / whole-exam
 * finalize). Persists and returns the updated attempt. Exported for tests and
 * called both by startOrResume (deadline blown) and advance (student Next).
 */
export async function finalizeOpenModule(
  stores: MockStores,
  attempt: AttemptDoc,
  form: FormDoc,
  now: number
): Promise<AttemptDoc> {
  const blueprint = getBlueprint(attempt.examKey);
  const sectionIdx = attempt.cursor.sectionIdx;
  const bpSection = blueprint.sections[sectionIdx];
  if (!bpSection) throw new Error(`Unknown section index ${sectionIdx} in blueprint ${blueprint.examKey}`);
  const closed = currentServedModule(attempt);
  if (!closed) throw new Error(`Attempt ${attempt.attemptId} cursor points past servedModules`);

  // Step 1+2: adaptive routing — closing the from-module serves the routed variant.
  if (bpSection.adaptive && closed.moduleId === bpSection.adaptive.fromModuleId) {
    const items = await stores.getItems(closed.itemIds);
    const responseByItem = new Map(attempt.responses.map((r) => [r.itemId, r]));
    let rawCorrect = 0;
    for (const it of items) {
      if (answersMatch(it, responseByItem.get(it.id)?.answer)) rawCorrect += 1;
    }
    const closedBpModule = bpSection.modules.find((m) => m.moduleId === closed.moduleId);
    const questionCount = closedBpModule?.questionCount ?? closed.itemIds.length;
    const variant: 'easy' | 'hard' =
      questionCount > 0 && rawCorrect / questionCount >= bpSection.adaptive.thresholdFraction ? 'hard' : 'easy';
    attempt.moduleRouting.push({ sectionId: bpSection.sectionId, variant });

    const variantModule = bpSection.modules.find((m) => m.variant === variant);
    if (!variantModule) throw new Error(`${bpSection.sectionId}: no ${variant} variant module`);
    const formSection = form.sections.find((s) => s.sectionId === bpSection.sectionId);
    const formModule = formSection?.modules.find((m) => m.moduleId === variantModule.moduleId);
    if (!formModule) throw new Error(`form_module_not_in_blueprint: ${form.formId}/${variantModule.moduleId}`);

    attempt.servedModules.push({ sectionIdx, moduleId: variantModule.moduleId, itemIds: formModule.itemIds });
    attempt.cursor = { sectionIdx, moduleIdx: attempt.cursor.moduleIdx + 1 };
    attempt.sectionDeadlineAt = new Date(now + variantModule.timeLimitMin * 60_000);
    attempt.status = 'in_section';
    await stores.saveAttempt(attempt);
    return attempt;
  }

  // Step 3: no more modules in this section.
  const nextSectionIdx = sectionIdx + 1;
  const hasNextSection = nextSectionIdx < blueprint.sections.length;

  if (hasNextSection) {
    if (bpSection.breakAfterMin) {
      // Break = save/exit point; no deadline runs. Cursor points at the UPCOMING
      // section so startOrResume/advance can read the break + open it next.
      attempt.status = 'at_break';
      attempt.cursor = { sectionIdx: nextSectionIdx, moduleIdx: 0 };
      attempt.sectionDeadlineAt = undefined;
      await stores.saveAttempt(attempt);
      return attempt;
    }
    openSection(attempt, form, blueprint, nextSectionIdx, now);
    await stores.saveAttempt(attempt);
    return attempt;
  }

  // Last section closed → finalize the whole exam.
  const allItemIds = attempt.servedModules.flatMap((m) => m.itemIds);
  const allItems = await stores.getItems(allItemIds);
  const hasFrq = allItems.some((it) => it.responseFormat === 'frq');
  const { rawSections, loBreakdown } = scoreMcqSections(blueprint, attempt.servedModules, attempt.responses, allItems);
  attempt.rawSections = rawSections;
  attempt.loBreakdown = loBreakdown;
  attempt.sectionDeadlineAt = undefined;

  if (hasFrq) {
    // Curves wait for FRQ points, folded in by Task 9's report/grading path.
    attempt.status = 'grading';
    attempt.gradingStartedAt = new Date(now);
  } else {
    const { scaled } = applyCurves(blueprint, rawSections, attempt.moduleRouting, {});
    attempt.scaled = scaled;
    attempt.status = 'completed';
    attempt.completedAt = new Date(now);
  }
  await stores.saveAttempt(attempt);
  return attempt;
}

/** Merge only the DEFINED fields of an incoming response into a stored one, so
 *  an autosave carrying just `markedForReview` never wipes a saved `answer`. */
function mergeResponse(target: AttemptDoc['responses'][number], src: MockResponse): void {
  if (src.answer !== undefined) target.answer = src.answer;
  if (src.frqText !== undefined) target.frqText = src.frqText;
  if (src.markedForReview !== undefined) target.markedForReview = src.markedForReview;
  if (src.struckChoices !== undefined) target.struckChoices = src.struckChoices;
  if (src.annotations !== undefined) target.annotations = src.annotations;
}

/**
 * Upserts the student's responses for the currently-open module. Rejects unless
 * the attempt is in_section at exactly `req.cursor`; rejects once past the
 * deadline + grace. Merges per itemId (never clobbering unspecified fields) and
 * silently ignores itemIds that aren't in the open module.
 */
export async function saveResponses(
  stores: MockStores,
  req: SaveMockResponsesRequest,
  now: number = Date.now()
): Promise<{ ok: true }> {
  const attempt = await stores.findAttempt(req.attemptId);
  // Attempt lookup is by UUID only; a live attempt must still belong to the
  // caller. Reuse attempt_not_open (not a distinct message) so a wrong owner
  // can't distinguish "not yours" from "not open" and probe for existence.
  if (!attempt || attempt.studentId !== req.studentId) throw new Error('attempt_not_open');
  if (
    attempt.status !== 'in_section' ||
    attempt.cursor.sectionIdx !== req.cursor.sectionIdx ||
    attempt.cursor.moduleIdx !== req.cursor.moduleIdx
  ) {
    throw new Error('attempt_not_open');
  }
  const deadline = attempt.sectionDeadlineAt?.getTime() ?? 0;
  if (now > deadline + GRACE_MS) throw new Error('deadline_passed');

  const openModule = currentServedModule(attempt);
  if (!openModule) throw new Error('attempt_not_open');
  const openItemIds = new Set(openModule.itemIds);
  const byId = new Map(attempt.responses.map((r) => [r.itemId, r]));

  for (const incoming of req.responses) {
    if (!openItemIds.has(incoming.itemId)) continue; // ignore items outside the open module
    const existing = byId.get(incoming.itemId);
    if (existing) {
      mergeResponse(existing, incoming);
    } else {
      const created: AttemptDoc['responses'][number] = { itemId: incoming.itemId };
      mergeResponse(created, incoming);
      attempt.responses.push(created);
      byId.set(incoming.itemId, created);
    }
  }

  await stores.saveAttempt(attempt);
  return { ok: true };
}

/**
 * Advances the attempt one step on a student Next / module-review confirm / a
 * client-noticed deadline. Idempotent: a stale `fromCursor` (already advanced)
 * returns the current state without double-advancing.
 */
export async function advance(
  stores: MockStores,
  req: AdvanceMockAttemptRequest,
  now: number = Date.now()
): Promise<MockAttemptState> {
  const attempt = await stores.findAttempt(req.attemptId);
  // Ownership guard — see saveResponses. Same message, no existence leak.
  if (!attempt || attempt.studentId !== req.studentId) throw new Error('attempt_not_open');
  const form = await stores.findForm(attempt.formId);
  if (!form) throw new Error(`Unknown mock form: ${attempt.formId}`);
  const blueprint = getBlueprint(attempt.examKey);

  // Stale fromCursor → someone already advanced; return current state as-is.
  if (
    req.fromCursor.sectionIdx !== attempt.cursor.sectionIdx ||
    req.fromCursor.moduleIdx !== attempt.cursor.moduleIdx
  ) {
    return buildAttemptState(stores, blueprint, attempt);
  }

  if (attempt.status === 'at_break') {
    openSection(attempt, form, blueprint, attempt.cursor.sectionIdx, now);
    await stores.saveAttempt(attempt);
    return buildAttemptState(stores, blueprint, attempt);
  }

  if (attempt.status === 'in_section') {
    const finalized = await finalizeOpenModule(stores, attempt, form, now);
    return buildAttemptState(stores, blueprint, finalized);
  }

  // completed | grading | expired: terminal, nothing to advance.
  return buildAttemptState(stores, blueprint, attempt);
}

/**
 * Adaptive sections serve m1 + exactly one m2 variant per attempt (easy XOR
 * hard); listing counts questions/time as if the 'easy' variant were served
 * so the two routing outcomes agree (validateBlueprint requires symmetric
 * easy/hard question counts).
 */
function countedModules(section: ExamBlueprint['sections'][number]) {
  return section.modules.filter((m) => !m.variant || m.variant === 'easy');
}

export async function listForms(
  stores: MockStores,
  studentId: string,
  topicId: string,
  // Accepted for signature symmetry with startOrResume/injectable clock, but
  // unused: lazy expiry is deliberately only enforced on the write path
  // (startOrResume, on the attempt a student actually touches), not here.
  _now: number = Date.now()
): Promise<ListMockFormsResponse> {
  const forms = await stores.findLiveForms(topicId);
  const attempts = await stores.findAttempts(studentId, forms.map((f) => f.formId));
  const attemptsByForm = new Map<string, AttemptDoc[]>();
  for (const a of attempts) {
    const list = attemptsByForm.get(a.formId) ?? [];
    list.push(a);
    attemptsByForm.set(a.formId, list);
  }

  const summaries: MockFormSummary[] = forms.map((form) => {
    const blueprint = getBlueprint(form.examKey);
    const sections = blueprint.sections.map((section) => {
      const modules = countedModules(section);
      return {
        sectionId: section.sectionId,
        label: section.label,
        questionCount: modules.reduce((sum, m) => sum + m.questionCount, 0),
        timeLimitMin: modules.reduce((sum, m) => sum + m.timeLimitMin, 0),
      };
    });
    const totalTimeMin = sections.reduce((sum, s) => sum + s.timeLimitMin, 0);

    const attemptSummaries: MockAttemptSummary[] = (attemptsByForm.get(form.formId) ?? []).map((a) => ({
      attemptId: a.attemptId,
      formId: a.formId,
      status: a.status,
      startedAt: a.startedAt.getTime(),
      completedAt: a.completedAt?.getTime(),
      isRetake: a.isRetake,
      scaled: a.scaled,
    }));

    return {
      formId: form.formId,
      examType: blueprint.examType,
      label: form.label,
      sections,
      totalTimeMin,
      attempts: attemptSummaries,
    };
  });

  return { forms: summaries };
}

/**
 * Lazily expire a stale in-flight attempt. Any SECTION the student fully
 * completed before abandoning the attempt is scored (raw MCQ correctness +
 * LO breakdown, no curve/composite) so the report can show partial results;
 * a mid-first-section abandonment scores nothing (report stays not_found).
 *
 * `cursor.sectionIdx` is the section currently open (in_section) or the
 * upcoming one (at_break), so sections `[0, cursor.sectionIdx)` are exactly
 * the completed ones. The gaps/mastery feed deliberately does NOT run for an
 * expired attempt — an abandoned exam is not a graded result to learn from.
 */
async function expireAttempt(stores: MockStores, attempt: AttemptDoc): Promise<void> {
  const completedCount = attempt.cursor.sectionIdx;
  if (completedCount > 0) {
    const blueprint = getBlueprint(attempt.examKey);
    const completedModules = attempt.servedModules.filter((m) => m.sectionIdx < completedCount);
    const items = await stores.getItems(completedModules.flatMap((m) => m.itemIds));
    const { rawSections, loBreakdown } = scoreMcqSections(blueprint, completedModules, attempt.responses, items);
    attempt.rawSections = rawSections;
    attempt.loBreakdown = loBreakdown;
  }
  attempt.status = 'expired';
  attempt.sectionDeadlineAt = undefined;
  await stores.saveAttempt(attempt);
}

export async function startOrResume(
  stores: MockStores,
  req: StartMockAttemptRequest,
  now: number = Date.now()
): Promise<MockAttemptState> {
  const { studentId, topicId, formId } = req;

  const form = await stores.findForm(formId);
  if (!form) throw new Error(`Unknown mock form: ${formId}`);
  if (!form.topicIds.includes(topicId)) throw new Error(`Form ${formId} does not serve topic ${topicId}`);
  const blueprint = getBlueprint(form.examKey);

  let inFlight = await stores.findInFlight(studentId, formId);

  // Expiry is lazy — no cron. A stale in-flight attempt is closed out here,
  // on the next start/resume call that touches it, then treated as none.
  if (inFlight && now - inFlight.startedAt.getTime() > ATTEMPT_TTL_MS) {
    await expireAttempt(stores, inFlight);
    inFlight = null;
  }

  if (inFlight) {
    if (inFlight.status === 'in_section') {
      const deadline = inFlight.sectionDeadlineAt?.getTime() ?? 0;
      if (now > deadline + GRACE_MS) {
        const finalized = await finalizeOpenModule(stores, inFlight, form, now);
        return buildAttemptState(stores, blueprint, finalized);
      }
    }
    // in_section (live) or at_break: report the current state.
    return buildAttemptState(stores, blueprint, inFlight);
  }

  // Starting a NEW attempt requires the form to be live. In-flight attempts
  // (handled above) still finish per the pinned-snapshot rule even if the form
  // was since pulled, but no fresh attempt may begin on a non-live form.
  if (form.status !== 'live') throw new Error('form_not_live');

  // None in-flight: start a fresh attempt at cursor {0,0}, pinning the
  // form's first section/module as servedModules[0].
  const priorAttempts = await stores.findAttempts(studentId, [formId]);
  const isRetake = priorAttempts.some((a) => a.status === 'completed');

  const firstFormSection = form.sections[0];
  const firstFormModule = firstFormSection?.modules[0];
  if (!firstFormModule) throw new Error(`Form ${formId} has no first module to serve`);
  // Match by moduleId, not array position — form/blueprint module ordering
  // could diverge, and every other lookup in this file (buildInSectionState)
  // already matches by id. Positional pairing here would silently stamp the
  // deadline from the wrong module's timeLimitMin.
  const firstBlueprintModule = blueprint.sections[0]?.modules.find((m) => m.moduleId === firstFormModule.moduleId);
  if (!firstBlueprintModule) throw new Error(`form_module_not_in_blueprint: ${formId}/${firstFormModule.moduleId}`);

  const attempt: AttemptDoc = {
    attemptId: randomUUID(),
    studentId,
    formId,
    examKey: form.examKey,
    status: 'in_section',
    cursor: { sectionIdx: 0, moduleIdx: 0 },
    sectionDeadlineAt: new Date(now + firstBlueprintModule.timeLimitMin * 60_000),
    servedModules: [{ sectionIdx: 0, moduleId: firstFormModule.moduleId, itemIds: firstFormModule.itemIds }],
    responses: [],
    moduleRouting: [],
    isRetake,
    startedAt: new Date(now),
  };
  await stores.createAttempt(attempt);

  return buildInSectionState(stores, blueprint, attempt, attempt.servedModules[0]);
}
