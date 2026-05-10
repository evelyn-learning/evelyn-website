/**
 * Topic-notes resolver — merges a baseline (TS-seeded global content)
 * with a student's overlay doc (per-student additive deltas) into the
 * `RenderedTopicNotes` shape consumed by the dev page (Phase 1) and the
 * polished reading UI (Phase 2).
 *
 * Render layout follows Q8a/b/c from project_topic_notes_initiative.md:
 *
 *   THEORY
 *     ┌─ Prerequisite refreshers (overlays kind='prereq-refresher')
 *     │
 *     ├─ Per-LO groups, in baseline LO order:
 *     │     [baseline entries for this LO]
 *     │     [overlay expansions anchored to this loId]
 *     │
 *     ├─ From your sessions (overlays kind='student-add')
 *     │
 *     └─ Older-session orphans (overlays whose loId no longer exists in baseline)
 *
 *   METHODS
 *     [baseline methods]
 *     [overlay methods — renderer detects `alternativeTo` for sub-numbering]
 *
 *   POINTERS
 *     [baseline pointers]
 *     [overlay pointers — segregated subsection]
 *
 * Returns null when no baseline is registered for the given id (callers
 * should 404).
 */

import { getTopicNotesBaseline } from './store';
import { loadStudentTopicNotes } from './apply-overlay';
import type {
  RenderedTopicNotes,
  RenderedTheorySection,
  RenderedTheoryOverlay,
  TheoryEntry,
} from './types';

export async function resolveTopicNotes(
  studentId: string,
  baselineId: string,
): Promise<RenderedTopicNotes | null> {
  const baseline = getTopicNotesBaseline(baselineId);
  if (!baseline) return null;
  const notes = await loadStudentTopicNotes(studentId, baselineId);

  // Group baseline theory entries by loId, preserving the order in which
  // each loId first appears. Skip null-loId baseline entries with a warn:
  // v1 baselines aren't expected to author cross-LO theory (overlays are
  // the right home for that). If a future authoring pattern needs it,
  // extend `RenderedTheorySection` rather than mixing it into perLO.
  const baselineLoIds: string[] = [];
  const baselineByLoId = new Map<string, TheoryEntry[]>();
  for (const entry of baseline.theory) {
    if (entry.loId == null) {
      // Authoring lint — surfaced once per server boot per baseline.
      console.warn(
        `[topic-notes] baseline ${baselineId} has a null-loId theory entry; skipped in render`,
      );
      continue;
    }
    if (!baselineByLoId.has(entry.loId)) {
      baselineLoIds.push(entry.loId);
      baselineByLoId.set(entry.loId, []);
    }
    baselineByLoId.get(entry.loId)!.push(entry);
  }
  const baselineLoIdSet = new Set(baselineLoIds);

  // Bucket overlays by render destination.
  const expansionsByLoId = new Map<string, RenderedTheoryOverlay[]>();
  const prereqRefreshers: RenderedTheoryOverlay[] = [];
  const studentAdds: RenderedTheoryOverlay[] = [];
  const orphans: RenderedTheoryOverlay[] = [];
  for (const ov of notes.theoryOverlays) {
    if (ov.kind === 'prereq-refresher') {
      prereqRefreshers.push(ov);
    } else if (ov.kind === 'student-add') {
      studentAdds.push(ov);
    } else {
      // 'expansion' kind. Anchor to baseline LO, or fall through to
      // orphans if the loId no longer exists (per Q8f, baseline drift).
      if (ov.loId != null && baselineLoIdSet.has(ov.loId)) {
        const arr = expansionsByLoId.get(ov.loId) ?? [];
        arr.push(ov);
        expansionsByLoId.set(ov.loId, arr);
      } else {
        orphans.push(ov);
      }
    }
  }

  const perLO = baselineLoIds.map((loId) => ({
    loId,
    baseline: baselineByLoId.get(loId)!,
    expansions: expansionsByLoId.get(loId) ?? [],
  }));

  const theory: RenderedTheorySection = {
    prereqRefreshers,
    perLO,
    studentAdds,
    orphans,
  };

  return {
    baselineId: baseline.baselineId,
    course: baseline.course,
    cedUnit: baseline.cedUnit,
    cedTopic: baseline.cedTopic,
    cedTitle: baseline.cedTitle,
    baselineVersion: baseline.baselineVersion,
    theory,
    methods: {
      baseline: baseline.methods,
      overlays: notes.methodsAdds,
    },
    pointers: {
      baseline: baseline.pointers,
      overlays: notes.pointersAdds,
    },
  };
}
