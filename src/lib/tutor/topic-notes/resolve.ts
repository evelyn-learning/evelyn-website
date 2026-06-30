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

import { getTopicNotesBaseline, listTopicNotesBaselinesForUnit } from './store';
import { loadStudentTopicNotes } from './apply-overlay';
import type {
  RenderedTopicNotes,
  RenderedUnitNotes,
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

/** Natural-order comparator for CED topic ids ("1.2" < "1.10" < "1.7-1.8").
 *  Compares the leading numeric components, falling back to string order. */
function compareCedTopic(a: string, b: string): number {
  const parse = (s: string): number[] =>
    s.split(/[.\-–]/).map((p) => parseInt(p, 10)).filter((n) => !Number.isNaN(n));
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? -1) - (pb[i] ?? -1);
    if (d !== 0) return d;
  }
  return a.localeCompare(b);
}

/**
 * Compose a whole CED unit's notes for a student: every registered baseline
 * for `(course, cedUnit)`, each resolved (baseline + that student's overlays)
 * and ordered by cedTopic. Returns null when the unit has no baselines yet,
 * so callers can render an empty/absent unit rather than a 404.
 *
 * Pure render-time composition over the existing per-topic resolver — the
 * storage model stays one-baseline-per-plan (baselineId === planId).
 */
export async function resolveUnitTopicNotes(
  studentId: string,
  course: string,
  cedUnit: number,
): Promise<RenderedUnitNotes | null> {
  const baselines = listTopicNotesBaselinesForUnit(course, cedUnit);
  if (baselines.length === 0) return null;

  const resolved = await Promise.all(
    baselines.map((b) => resolveTopicNotes(studentId, b.baselineId)),
  );
  const topics = resolved
    .filter((t): t is RenderedTopicNotes => t !== null)
    .sort((a, b) => compareCedTopic(a.cedTopic, b.cedTopic));

  return { course, cedUnit, topics };
}
