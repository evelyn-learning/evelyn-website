/**
 * Phase 3(a) — Notes ↔ gaps link reconciliation (`sourceGapId`).
 *
 * The `sourceGapId` field already exists on every overlay and is already
 * written by the `apply-overlay.ts` mutators — but only when a caller passes
 * it, which they currently never do. This module is a SEPARATE, discrete,
 * idempotent reconciliation pass that runs at session end (AFTER the gap +
 * overlay commits) and backfills `sourceGapId` on overlays that were added
 * this session without one.
 *
 * Matching rules (per the v3 build spec):
 *   - `expansion` (lo-anchored) theory overlays  → `kind:'lo'` gaps, on shared `loId`
 *   - `prereq-refresher` theory overlays         → `kind:'prerequisite'` gaps, on shared `conceptLabel`
 *
 * Scope: theory overlays only (the two kinds above are the only overlays
 * that carry a gap-matchable anchor). `student-add` overlays, methods, and
 * pointers are intentionally left untouched.
 *
 * Guarantees:
 *   - Writes `sourceGapId` ONLY where it is currently empty (never overwrite).
 *   - Never touches overlay content, dedup, or reinforcement metadata.
 *   - Idempotent: a second run links nothing new (everything matched is now
 *     non-empty), and a session with no matching pairs leaves notes untouched.
 */

import connectDB from '@core/db';
import {
  StudentTopicNotesModel,
  toStudentTopicNotes,
  buildTopicNotesId,
  type IStudentTopicNotesDoc,
} from '@/models/StudentTopicNotes';
import { loadStudentTopicNotes, saveStudentTopicNotes } from './apply-overlay';
import type { StudentTopicNotes } from './types';

/** Minimal gap shape the reconciler needs (subset of GapEntry). */
export interface GapLinkInput {
  id: string;
  kind?: 'lo' | 'prerequisite';
  loId?: string;
  conceptLabel?: string;
}

/** Normalize a concept label for matching: lowercase, collapse whitespace,
 *  trim. Mirrors the spirit of apply-overlay's dedup normalization but is
 *  scoped to label equality (no length cap needed for short labels). */
function normLabel(s: string | undefined | null): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export interface ReconcileResult {
  notes: StudentTopicNotes;
  /** Number of overlays newly linked this pass. */
  linked: number;
}

/**
 * PURE reconciliation over an in-memory notes doc. Returns a new notes object
 * with `sourceGapId` backfilled on matching, currently-empty theory overlays.
 *
 * When `sessionId` is provided, only overlays added in that session are
 * considered (so a later session's gaps never retroactively claim an earlier
 * session's overlays). When omitted, every empty-link overlay is eligible.
 */
export function reconcileGapLinks(
  notes: StudentTopicNotes,
  gaps: GapLinkInput[],
  opts: { sessionId?: string } = {},
): ReconcileResult {
  // Build lookup maps. First gap of each key wins (stable, deterministic).
  const loGapByLoId = new Map<string, string>();
  const prereqGapByLabel = new Map<string, string>();
  for (const g of gaps) {
    if (!g?.id) continue;
    if (g.kind === 'lo' && g.loId) {
      if (!loGapByLoId.has(g.loId)) loGapByLoId.set(g.loId, g.id);
    } else if (g.kind === 'prerequisite' && g.conceptLabel) {
      const key = normLabel(g.conceptLabel);
      if (key && !prereqGapByLabel.has(key)) prereqGapByLabel.set(key, g.id);
    }
  }

  if (loGapByLoId.size === 0 && prereqGapByLabel.size === 0) {
    return { notes, linked: 0 };
  }

  let linked = 0;
  const theoryOverlays = notes.theoryOverlays.map((o) => {
    // Only consider this-session overlays (when scoped) that lack a link.
    if (o.sourceGapId) return o;
    if (opts.sessionId && o.addedInSessionId !== opts.sessionId) return o;

    let gapId: string | undefined;
    if (o.kind === 'expansion' && o.loId != null) {
      gapId = loGapByLoId.get(o.loId);
    } else if (o.kind === 'prereq-refresher' && o.conceptLabel) {
      gapId = prereqGapByLabel.get(normLabel(o.conceptLabel));
    }
    if (!gapId) return o;

    linked++;
    return { ...o, sourceGapId: gapId };
  });

  if (linked === 0) return { notes, linked: 0 };
  return { notes: { ...notes, theoryOverlays }, linked };
}

/**
 * Persisted reconciliation: load the student's overlay doc for a baseline,
 * reconcile against this session's gaps, and save only if something changed.
 * Idempotent and safe to call after the existing gap + overlay commits.
 *
 * Respects the ephemeral-fallback pattern by routing through
 * `loadStudentTopicNotes` / `saveStudentTopicNotes`.
 */
export async function reconcileSessionGapLinks(args: {
  studentId: string;
  baselineId: string;
  gaps: GapLinkInput[];
  sessionId?: string;
}): Promise<ReconcileResult> {
  const { studentId, baselineId, gaps, sessionId } = args;

  // Fast path: if there's no overlay doc at all, there's nothing to link.
  // (loadStudentTopicNotes would synthesize an empty in-memory doc.) We avoid
  // creating a row for a student who has no overlays this session.
  let existing: StudentTopicNotes | null = null;
  const id = buildTopicNotesId(studentId, baselineId);
  try {
    await connectDB();
    const doc = await StudentTopicNotesModel.findById(id);
    if (doc) existing = toStudentTopicNotes(doc as IStudentTopicNotesDoc);
  } catch {
    // DB unavailable — fall back to the loader (covers the ephemeral store).
    existing = await loadStudentTopicNotes(studentId, baselineId);
  }
  if (!existing) {
    // No persisted doc. Use the loader once in case an ephemeral doc exists.
    existing = await loadStudentTopicNotes(studentId, baselineId);
  }

  const result = reconcileGapLinks(existing, gaps, { sessionId });
  if (result.linked === 0) return result;

  const saved = await saveStudentTopicNotes(result.notes);
  return { notes: saved, linked: result.linked };
}
