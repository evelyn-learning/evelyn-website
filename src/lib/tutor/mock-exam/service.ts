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
  MockCursor,
  MockFormSummary,
  MockResponse,
  MockSectionItem,
  MockSectionPayload,
  StartMockAttemptRequest,
} from '@evelyn/portal-contract/v1';
import { resolvePassage } from '@/lib/tutor/passages/store';
import { connectDB } from '@/lib/db';
import { MockForm } from '@/models/MockForm';
import { MockAttempt, type IMockAttempt } from '@/models/MockAttempt';
import { ProblemBank } from '@/models/ProblemBank';
import { getBlueprint } from './blueprints';
import type { ExamBlueprint } from './blueprints';
import type { SeedableItem } from './fixtures';

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
  loBreakdown?: Array<{ loId: string; correct: number; total: number }>;
  frqGrades?: Array<{
    itemId: string;
    totalPoints: number;
    maxPoints: number;
    parts: Array<{ criterionId: string; pointsAwarded: number; maxPoints: number; feedback: string }>;
    ungraded?: boolean;
  }>;
  footnote?: string;
  gradingStartedAt?: Date;
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
      await MockAttempt.updateOne({ attemptId }, { $set: rest });
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
 * Auto-finalizes a module whose deadline (+ grace) has passed. Wired into
 * startOrResume's deadline check but not implementable until Task 8 grades
 * responses / advances the cursor / applies scoring — until then this is a
 * stub that fails loudly instead of silently mis-serving a blown module.
 */
async function finalizeOpenModule(
  _stores: MockStores,
  _attempt: AttemptDoc,
  _blueprint: ExamBlueprint,
  _now: number
): Promise<MockAttemptState> {
  throw new Error('not_implemented_until_task_8');
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
    inFlight.status = 'expired';
    await stores.saveAttempt(inFlight);
    inFlight = null;
  }

  if (inFlight) {
    if (inFlight.status === 'in_section') {
      const deadline = inFlight.sectionDeadlineAt?.getTime() ?? 0;
      if (now > deadline + GRACE_MS) {
        return finalizeOpenModule(stores, inFlight, blueprint, now);
      }
      const served = inFlight.servedModules[inFlight.cursor.moduleIdx];
      if (!served) throw new Error(`Attempt ${inFlight.attemptId} cursor points past servedModules`);
      return buildInSectionState(stores, blueprint, inFlight, served);
    }

    // at_break: no deadline runs; report the break and what's next.
    const prevSection = blueprint.sections[inFlight.cursor.sectionIdx - 1];
    const nextSection = blueprint.sections[inFlight.cursor.sectionIdx];
    const cursor: MockCursor = inFlight.cursor;
    return {
      attemptId: inFlight.attemptId,
      formId: inFlight.formId,
      status: 'at_break',
      cursor,
      breakMinutes: prevSection?.breakAfterMin ?? 0,
      nextSectionLabel: nextSection?.label ?? '',
    };
  }

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
