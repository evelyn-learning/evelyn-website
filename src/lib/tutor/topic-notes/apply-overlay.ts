/**
 * Per-student overlay mutators + persistence for topic notes.
 *
 * All add operations:
 *   1. Validate input shape (reject on missing required fields).
 *   2. Resolve baseline (reject if baseline doesn't exist).
 *   3. Dedup against baseline content — if a baseline entry already
 *      carries the same normalized content, suppress (status:
 *      'duplicate-of-baseline', no overlay created). The student isn't
 *      shown a duplicate of canonical content.
 *   4. Dedup against existing overlays — if a matching overlay exists,
 *      "reinforce" it: bump `lastReinforcedAt` + append the new
 *      sessionId to `reinforcedInSessionIds[]` (no new entry created).
 *      The renderer surfaces "Reinforced: {date1}, {date2}, …".
 *   5. Otherwise create the new overlay with a fresh UUID.
 *
 * Higher-level guardrails (active-topic binding, 3-segment warmup gate,
 * per-session rate limits) are the orchestrator's responsibility — see
 * the topic-notes section of `VoiceTutorRealtime.tsx` (added in Step 8).
 * The mutators here just persist what they're given, with dedup +
 * basic validation.
 *
 * Persistence: Mongo via `StudentTopicNotesModel`, with an in-memory
 * ephemeral fallback when DB is unavailable (matches the
 * student-profile/store.ts pattern).
 */

import { randomUUID } from 'crypto';
import connectDB from '@core/db';
import {
  StudentTopicNotesModel,
  toStudentTopicNotes,
  buildTopicNotesId,
  type IStudentTopicNotesDoc,
} from '@/models/StudentTopicNotes';
import { getTopicNotesBaseline } from './store';
import {
  STUDENT_TOPIC_NOTES_SCHEMA_VERSION,
  type StudentTopicNotes,
  type TheoryOverlay,
  type MethodOverlay,
  type PointerOverlay,
  type DiagramSpec,
} from './types';

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const ephemeralStore = new Map<string, StudentTopicNotes>();

function emptyNotes(
  studentId: string,
  baselineId: string,
  baselineVersion?: number,
): StudentTopicNotes {
  const now = new Date().toISOString();
  return {
    id: buildTopicNotesId(studentId, baselineId),
    studentId,
    baselineId,
    baselineVersionAtFork: baselineVersion,
    theoryOverlays: [],
    methodsAdds: [],
    pointersAdds: [],
    createdAt: now,
    updatedAt: now,
    schemaVersion: STUDENT_TOPIC_NOTES_SCHEMA_VERSION,
  };
}

/** Load a student's overlay doc for a baseline. Returns an empty
 *  in-memory doc when none exists yet (lazy COW — first overlay write
 *  is what persists). Safe to call from read paths (e.g. the resolver). */
export async function loadStudentTopicNotes(
  studentId: string,
  baselineId: string,
): Promise<StudentTopicNotes> {
  if (!studentId || !baselineId) {
    throw new Error('loadStudentTopicNotes: studentId and baselineId required');
  }
  const id = buildTopicNotesId(studentId, baselineId);
  try {
    await connectDB();
    const doc = await StudentTopicNotesModel.findById(id);
    if (doc) return toStudentTopicNotes(doc as IStudentTopicNotesDoc);
  } catch {
    const cached = ephemeralStore.get(id);
    if (cached) return cached;
  }
  return emptyNotes(studentId, baselineId);
}

export async function saveStudentTopicNotes(notes: StudentTopicNotes): Promise<StudentTopicNotes> {
  const next: StudentTopicNotes = {
    ...notes,
    updatedAt: new Date().toISOString(),
    schemaVersion: STUDENT_TOPIC_NOTES_SCHEMA_VERSION,
  };
  try {
    await connectDB();
    await StudentTopicNotesModel.findByIdAndUpdate(
      next.id,
      { $set: next },
      { upsert: true, new: true },
    );
  } catch {
    ephemeralStore.set(next.id, next);
  }
  return next;
}

// ---------------------------------------------------------------------------
// Dedup helpers
// ---------------------------------------------------------------------------

/** Normalize a string for content-equality dedup: lowercase, strip
 *  punctuation, collapse whitespace, trim, take first 100 chars.
 *  Generous enough to suppress brain re-phrasings of the same point;
 *  not so generous that genuinely different content collides. */
function normalizeForDedup(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

/** Bump `lastReinforcedAt` and dedup-append the new sessionId to
 *  `reinforcedInSessionIds`. No-op when sessionId is the same as the
 *  original add or already in the list — this is the same-session re-fire
 *  case (likely an orchestrator caller bug; we don't double-record). */
function reinforceOverlay<T extends {
  addedInSessionId: string;
  reinforcedInSessionIds?: string[];
  lastReinforcedAt?: string;
}>(overlay: T, sessionId: string): T {
  if (sessionId === overlay.addedInSessionId) return overlay;
  const existing = overlay.reinforcedInSessionIds ?? [];
  if (existing.includes(sessionId)) return overlay;
  return {
    ...overlay,
    reinforcedInSessionIds: [...existing, sessionId],
    lastReinforcedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Add operations — public API
// ---------------------------------------------------------------------------

export type AddOverlayStatus =
  | 'added'
  | 'reinforced'
  | 'duplicate-of-baseline'
  | 'baseline-not-found'
  | 'invalid';

export interface AddOverlayResult<T> {
  notes: StudentTopicNotes;
  overlay: T | null;
  status: AddOverlayStatus;
  reason?: string;
}

// --- Theory ----------------------------------------------------------------

export interface ExpandTheoryInput {
  loId: string | null;
  kind: 'expansion' | 'prereq-refresher' | 'student-add';
  conceptLabel?: string;
  title?: string;
  content: string;
  diagram?: DiagramSpec;
  addedInSessionId: string;
  rationale?: string;
  sourceGapId?: string;
}

export async function expandTheoryOverlay(args: {
  studentId: string;
  baselineId: string;
  input: ExpandTheoryInput;
}): Promise<AddOverlayResult<TheoryOverlay>> {
  const { studentId, baselineId, input } = args;
  const baseline = getTopicNotesBaseline(baselineId);
  if (!baseline) {
    return makeResult(studentId, baselineId, 'baseline-not-found');
  }
  if (!input.content?.trim()) {
    return makeResult(studentId, baselineId, 'invalid', 'content required');
  }
  if (input.kind === 'prereq-refresher' && !input.conceptLabel?.trim()) {
    return makeResult(studentId, baselineId, 'invalid', 'conceptLabel required for prereq-refresher');
  }
  if (input.kind === 'expansion') {
    if (input.loId == null) {
      return makeResult(studentId, baselineId, 'invalid', 'loId required for expansion');
    }
    const baselineLoIds = new Set(
      baseline.theory.map((e) => e.loId).filter((id): id is string => !!id),
    );
    if (!baselineLoIds.has(input.loId)) {
      return makeResult(studentId, baselineId, 'invalid', `loId '${input.loId}' not in baseline`);
    }
  }

  const normalized = normalizeForDedup(input.content);
  // Dedup against baseline entries with matching loId bucket (or null bucket).
  const matchingBaseline = baseline.theory.filter(
    (e) => (e.loId ?? null) === (input.loId ?? null),
  );
  for (const b of matchingBaseline) {
    if (normalizeForDedup(b.content) === normalized) {
      return makeResult(studentId, baselineId, 'duplicate-of-baseline');
    }
  }

  const notes = await loadStudentTopicNotes(studentId, baselineId);
  const matchingOverlay = notes.theoryOverlays.find(
    (o) =>
      (o.loId ?? null) === (input.loId ?? null) &&
      o.kind === input.kind &&
      normalizeForDedup(o.content) === normalized,
  );
  if (matchingOverlay) {
    const reinforced = reinforceOverlay(matchingOverlay, input.addedInSessionId);
    const updated: StudentTopicNotes = {
      ...notes,
      theoryOverlays: notes.theoryOverlays.map((o) =>
        o.overlayId === reinforced.overlayId ? reinforced : o,
      ),
    };
    const saved = await saveStudentTopicNotes(updated);
    return { notes: saved, overlay: reinforced, status: 'reinforced' };
  }

  const now = new Date().toISOString();
  const overlay: TheoryOverlay = {
    overlayId: randomUUID(),
    loId: input.loId,
    kind: input.kind,
    conceptLabel: input.conceptLabel,
    title: input.title,
    content: input.content.trim(),
    diagram: input.diagram,
    addedInSessionId: input.addedInSessionId,
    addedAt: now,
    rationale: input.rationale,
    sourceGapId: input.sourceGapId,
    lastReinforcedAt: now,
    reinforcedInSessionIds: [],
  };
  const updated: StudentTopicNotes = {
    ...notes,
    baselineVersionAtFork: notes.baselineVersionAtFork ?? baseline.baselineVersion,
    theoryOverlays: [...notes.theoryOverlays, overlay],
  };
  const saved = await saveStudentTopicNotes(updated);
  return { notes: saved, overlay, status: 'added' };
}

// --- Method ----------------------------------------------------------------

export interface AddMethodInput {
  title: string;
  when_to_use?: string;
  steps: string[];
  example?: { problem: string; solution: string };
  diagram?: DiagramSpec;
  alternativeTo?: string;
  relatedLoIds?: string[];
  addedInSessionId: string;
  rationale?: string;
  sourceGapId?: string;
}

export async function addMethodOverlay(args: {
  studentId: string;
  baselineId: string;
  input: AddMethodInput;
}): Promise<AddOverlayResult<MethodOverlay>> {
  const { studentId, baselineId, input } = args;
  const baseline = getTopicNotesBaseline(baselineId);
  if (!baseline) {
    return makeResult(studentId, baselineId, 'baseline-not-found');
  }
  if (!input.title?.trim()) {
    return makeResult(studentId, baselineId, 'invalid', 'title required');
  }
  const cleanSteps = (input.steps ?? []).map((s) => s.trim()).filter(Boolean);
  if (cleanSteps.length < 2) {
    return makeResult(studentId, baselineId, 'invalid', 'at least 2 non-empty steps required');
  }
  const normalizedTitle = normalizeForDedup(input.title);

  for (const b of baseline.methods) {
    if (normalizeForDedup(b.title) === normalizedTitle) {
      return makeResult(studentId, baselineId, 'duplicate-of-baseline');
    }
  }

  const notes = await loadStudentTopicNotes(studentId, baselineId);
  const matchingOverlay = notes.methodsAdds.find(
    (o) => normalizeForDedup(o.title) === normalizedTitle,
  );
  if (matchingOverlay) {
    const reinforced = reinforceOverlay(matchingOverlay, input.addedInSessionId);
    const updated: StudentTopicNotes = {
      ...notes,
      methodsAdds: notes.methodsAdds.map((o) =>
        o.overlayId === reinforced.overlayId ? reinforced : o,
      ),
    };
    const saved = await saveStudentTopicNotes(updated);
    return { notes: saved, overlay: reinforced, status: 'reinforced' };
  }

  const now = new Date().toISOString();
  const overlay: MethodOverlay = {
    overlayId: randomUUID(),
    title: input.title.trim(),
    when_to_use: input.when_to_use,
    steps: cleanSteps,
    example: input.example,
    diagram: input.diagram,
    alternativeTo: input.alternativeTo,
    relatedLoIds: input.relatedLoIds,
    addedInSessionId: input.addedInSessionId,
    addedAt: now,
    rationale: input.rationale,
    sourceGapId: input.sourceGapId,
    lastReinforcedAt: now,
    reinforcedInSessionIds: [],
  };
  const updated: StudentTopicNotes = {
    ...notes,
    baselineVersionAtFork: notes.baselineVersionAtFork ?? baseline.baselineVersion,
    methodsAdds: [...notes.methodsAdds, overlay],
  };
  const saved = await saveStudentTopicNotes(updated);
  return { notes: saved, overlay, status: 'added' };
}

// --- Pointer ---------------------------------------------------------------

export interface AddPointerInput {
  content: string;
  kind?: string;
  relatedLoIds?: string[];
  addedInSessionId: string;
  rationale?: string;
  sourceGapId?: string;
}

export async function addPointerOverlay(args: {
  studentId: string;
  baselineId: string;
  input: AddPointerInput;
}): Promise<AddOverlayResult<PointerOverlay>> {
  const { studentId, baselineId, input } = args;
  const baseline = getTopicNotesBaseline(baselineId);
  if (!baseline) {
    return makeResult(studentId, baselineId, 'baseline-not-found');
  }
  if (!input.content?.trim()) {
    return makeResult(studentId, baselineId, 'invalid', 'content required');
  }
  const normalized = normalizeForDedup(input.content);

  for (const b of baseline.pointers) {
    if (normalizeForDedup(b.content) === normalized) {
      return makeResult(studentId, baselineId, 'duplicate-of-baseline');
    }
  }

  const notes = await loadStudentTopicNotes(studentId, baselineId);
  const matchingOverlay = notes.pointersAdds.find(
    (o) => normalizeForDedup(o.content) === normalized,
  );
  if (matchingOverlay) {
    const reinforced = reinforceOverlay(matchingOverlay, input.addedInSessionId);
    const updated: StudentTopicNotes = {
      ...notes,
      pointersAdds: notes.pointersAdds.map((o) =>
        o.overlayId === reinforced.overlayId ? reinforced : o,
      ),
    };
    const saved = await saveStudentTopicNotes(updated);
    return { notes: saved, overlay: reinforced, status: 'reinforced' };
  }

  const now = new Date().toISOString();
  const overlay: PointerOverlay = {
    overlayId: randomUUID(),
    content: input.content.trim(),
    kind: input.kind,
    relatedLoIds: input.relatedLoIds,
    addedInSessionId: input.addedInSessionId,
    addedAt: now,
    rationale: input.rationale,
    sourceGapId: input.sourceGapId,
    lastReinforcedAt: now,
    reinforcedInSessionIds: [],
  };
  const updated: StudentTopicNotes = {
    ...notes,
    baselineVersionAtFork: notes.baselineVersionAtFork ?? baseline.baselineVersion,
    pointersAdds: [...notes.pointersAdds, overlay],
  };
  const saved = await saveStudentTopicNotes(updated);
  return { notes: saved, overlay, status: 'added' };
}

// --- Delete ----------------------------------------------------------------

export type OverlayBucket = 'theory' | 'methods' | 'pointers';

/** Remove a single overlay by id from the named bucket. Returns
 *  `deleted: false` when the id isn't found (so the caller can 404). */
export async function deleteOverlay(args: {
  studentId: string;
  baselineId: string;
  overlayId: string;
  bucket: OverlayBucket;
}): Promise<{ notes: StudentTopicNotes; deleted: boolean }> {
  const { studentId, baselineId, overlayId, bucket } = args;
  const notes = await loadStudentTopicNotes(studentId, baselineId);
  const removeFromArray = <T extends { overlayId: string }>(arr: T[]): { next: T[]; removed: boolean } => {
    const next = arr.filter((o) => o.overlayId !== overlayId);
    return { next, removed: next.length !== arr.length };
  };

  let updated: StudentTopicNotes;
  let removed: boolean;
  if (bucket === 'theory') {
    const r = removeFromArray(notes.theoryOverlays);
    updated = { ...notes, theoryOverlays: r.next };
    removed = r.removed;
  } else if (bucket === 'methods') {
    const r = removeFromArray(notes.methodsAdds);
    updated = { ...notes, methodsAdds: r.next };
    removed = r.removed;
  } else {
    const r = removeFromArray(notes.pointersAdds);
    updated = { ...notes, pointersAdds: r.next };
    removed = r.removed;
  }

  if (!removed) return { notes, deleted: false };
  const saved = await saveStudentTopicNotes(updated);
  return { notes: saved, deleted: true };
}

// ---------------------------------------------------------------------------
// internal
// ---------------------------------------------------------------------------

/** Build an early-exit result (overlay = null). Returns
 *  `AddOverlayResult<never>`, which is structurally assignable to any
 *  `AddOverlayResult<T>` because `null` widens to `T | null`. Lets the
 *  three add-functions reuse this helper without per-call generic
 *  annotations. */
async function makeResult(
  studentId: string,
  baselineId: string,
  status: AddOverlayStatus,
  reason?: string,
): Promise<AddOverlayResult<never>> {
  const notes = await loadStudentTopicNotes(studentId, baselineId);
  return { notes, overlay: null, status, reason };
}
