/**
 * Task 8 (fix round) — per-item mock evidence for the learner model, shared
 * between BOTH mock-completion paths:
 *   - `finalizeOpenModule`'s MCQ-only fast path (service.ts) — the last
 *     section closes with no FRQ items served anywhere in the attempt, so
 *     the attempt goes straight to `status: 'completed'` and NEVER passes
 *     through `gradeAndComplete`.
 *   - `gradeAndComplete` (report.ts) — the FRQ-bearing path, after FRQs are
 *     graded.
 *
 * Originally this per-item build lived inline in `gradeAndComplete` only,
 * which meant every MCQ-only exam (digital-sat / act / hs-* — the
 * highest-volume forms, none of which carry an FRQ item) produced ZERO
 * learner-model evidence. Extracted here so both paths build identical rows
 * off identical `mock:<attemptId>:<itemId>` idempotency keys — that key
 * format is itself the cross-path duplicate guard (via the store's
 * insertMany/ordered:false duplicate-`_id` tolerance), not any new locking.
 *
 * Pure — no I/O.
 */
import type { EvidenceInput } from '@/lib/tutor/learner-model/store';
import { answersMatch } from './scoring';
import type { SeedableItem } from './fixtures';

/** Structural subset of a graded FRQ result this module needs. */
export interface MockFrqGradeLike {
  itemId: string;
  totalPoints: number;
  maxPoints: number;
  /** Set when the grader failed after retries — not student evidence, skipped. */
  ungraded?: boolean;
}

export function buildMockItemEvidence(params: {
  attemptId: string;
  studentId: string;
  servedModules: Array<{ sectionIdx: number; moduleId: string; itemIds: string[] }>;
  items: SeedableItem[];
  responseByItem: Map<string, { answer?: string; frqText?: string }>;
  sectionIdByItem: Map<string, string>;
  /** Absent/empty for an MCQ-only attempt (no FRQ items served at all). */
  frqGrades?: MockFrqGradeLike[];
  occurredAt: Date;
}): EvidenceInput[] {
  const { attemptId, studentId, servedModules, items, responseByItem, sectionIdByItem, frqGrades, occurredAt } = params;
  const itemById = new Map(items.map((it) => [it.id, it]));
  const frqGradeByItem = new Map((frqGrades ?? []).map((g) => [g.itemId, g]));
  const sessionId = `mock:${attemptId}`;
  const evidenceInputs: EvidenceInput[] = [];

  for (const mod of servedModules) {
    for (const id of mod.itemIds) {
      const item = itemById.get(id);
      if (!item) continue;
      const sectionId = sectionIdByItem.get(id);

      if (item.responseFormat === 'frq') {
        const grade = frqGradeByItem.get(id);
        if (!grade || grade.ungraded) continue; // grader failure — not student evidence
        evidenceInputs.push({
          idempotencyKey: `mock:${attemptId}:${id}`,
          studentId,
          loId: item.loId,
          source: 'mock',
          sessionId,
          itemId: id,
          sectionId,
          difficulty: item.difficulty,
          outcome: grade.maxPoints > 0 ? grade.totalPoints / grade.maxPoints : 0,
          pointsAwarded: grade.totalPoints,
          maxPoints: grade.maxPoints,
          occurredAt,
        });
      } else {
        const correct = answersMatch(item, responseByItem.get(id)?.answer);
        evidenceInputs.push({
          idempotencyKey: `mock:${attemptId}:${id}`,
          studentId,
          loId: item.loId,
          source: 'mock',
          sessionId,
          itemId: id,
          sectionId,
          difficulty: item.difficulty,
          outcome: correct ? 1 : 0,
          pointsAwarded: correct ? 1 : 0,
          maxPoints: 1,
          occurredAt,
        });
      }
    }
  }

  return evidenceInputs;
}

/** `sectionId` per served item — sectionIdx → blueprint sectionId, resolved
 *  against the served modules (shared by both completion paths so they build
 *  it identically). */
export function buildSectionIdByItem(
  servedModules: Array<{ sectionIdx: number; moduleId: string; itemIds: string[] }>,
  blueprintSections: Array<{ sectionId: string }>,
): Map<string, string> {
  const sectionIdByItem = new Map<string, string>();
  for (const mod of servedModules) {
    const bpSection = blueprintSections[mod.sectionIdx];
    if (!bpSection) continue;
    for (const id of mod.itemIds) sectionIdByItem.set(id, bpSection.sectionId);
  }
  return sectionIdByItem;
}
