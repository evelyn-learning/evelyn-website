/**
 * Phase 4 — session-result emitter (engine side).
 *
 * The authed-portal analog of the internal session-commit POST. It reuses the
 * SAME store functions (applyMasteryDeltas / recordGap / resolveSettledGaps /
 * appendSessionMemory / saveStudentProfile) and then runs the Phase-3 passes:
 *   - reconcileSessionGapLinks  (3a — backfill overlay sourceGapId)
 *   - canonicalizeConceptLabel  (3b — async concept normalize, fail-soft)
 *   - resolveSettledPrereqGaps  (3b — prereq-gap mastery resolution)
 *
 * It assembles a contract-valid `SessionResult` (computing new/promoted/
 * resolved gap ids by diffing pre/post status) and is idempotent on
 * `sessionId` (a second terminal emit returns a no-delta snapshot). The
 * internal `/api/tutor/student-profile` flow is left completely untouched.
 *
 * `socialMemoryDelta` is intentionally omitted until the Phase-2 social-memory
 * behavior ships (the contract field exists so the portal integrates now).
 */

import {
  getOrCreateStudentProfile,
  applyMasteryDeltas,
  recordGap,
  resolveSettledGaps,
  appendSessionMemory,
  saveStudentProfile,
} from '@/lib/tutor/student-profile/store';
import { resolveSettledPrereqGaps } from '@/lib/tutor/concept-registry/resolve-prereq-gaps';
import { canonicalizeConceptLabel } from '@/lib/tutor/concept-registry/normalizer';
import { reconcileSessionGapLinks } from '@/lib/tutor/topic-notes/reconcile-gap-links';
import type { StudentProfile, GapEntry } from '@/lib/tutor/student-profile/types';
import {
  ShowQuizPayloadSchema,
  ShowConceptMapPayloadSchema,
  type SessionEmitRequest,
  type SessionResult,
  type ShowQuizPayload,
  type ShowConceptMapPayload,
} from '@/lib/portal-contract/v1';

/** Loose shape for a logged whiteboard command. */
interface LoggedCommand {
  type?: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any;
}

/** Extract validated show_quiz / show_concept_map payloads from logged
 *  commands; anything malformed is silently dropped. Pure. */
export function extractRenderedArtifacts(commands: unknown): {
  quizzes: ShowQuizPayload[];
  conceptMaps: ShowConceptMapPayload[];
} {
  const quizzes: ShowQuizPayload[] = [];
  const conceptMaps: ShowConceptMapPayload[] = [];
  if (!Array.isArray(commands)) return { quizzes, conceptMaps };
  for (const raw of commands as LoggedCommand[]) {
    const kind = raw?.type ?? raw?.name;
    const data = raw?.payload ?? raw?.args;
    if (kind === 'show_quiz') {
      const r = ShowQuizPayloadSchema.safeParse(data);
      if (r.success) quizzes.push(r.data);
    } else if (kind === 'show_concept_map') {
      const r = ShowConceptMapPayloadSchema.safeParse(data);
      if (r.success) conceptMaps.push(r.data);
    }
  }
  return { quizzes, conceptMaps };
}

export interface EmitOptions {
  /** Optional loader for logged artifacts when the request omits them. */
  loadArtifacts?: (sessionId: string) => Promise<unknown>;
}

function masterySnapshot(profile: StudentProfile, losTouched: string[]) {
  return losTouched
    .map((loId) => profile.mastery[loId])
    .filter((m): m is NonNullable<typeof m> => !!m);
}

export async function emitSessionResult(
  req: SessionEmitRequest,
  opts: EmitOptions = {},
): Promise<SessionResult> {
  const profile = await getOrCreateStudentProfile(req.studentId);

  const artifacts =
    req.renderedArtifacts ??
    (opts.loadArtifacts ? extractRenderedArtifacts(await opts.loadArtifacts(req.sessionId)) : { quizzes: [], conceptMaps: [] });

  const base: Omit<SessionResult, 'learningStateDelta'> = {
    sessionId: req.sessionId,
    studentId: req.studentId,
    courseId: req.courseId,
    status: req.status,
    milestone: req.milestone ?? 'none',
    notesTouched: req.notesTouched,
    renderedArtifacts: artifacts,
  };

  // Checkpoint mode — no mutation, just a current-state snapshot.
  if (req.status === 'in_progress') {
    return {
      ...base,
      learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: masterySnapshot(profile, req.losTouched) },
    };
  }

  // Idempotency: a terminal session already recorded → return a no-delta snapshot.
  if (profile.recentSessions.some((s) => s.sessionId === req.sessionId)) {
    return {
      ...base,
      learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: masterySnapshot(profile, req.losTouched) },
    };
  }

  // --- Commit (reuse the existing store functions) ---
  const before = new Map<string, GapEntry['status']>(profile.gaps.map((g) => [g.id, g.status]));

  let next = applyMasteryDeltas(profile, req.masteryDeltas);
  for (const g of req.gaps) {
    next = recordGap(next, {
      kind: g.kind,
      loId: g.loId,
      conceptLabel: g.conceptLabel,
      observation: g.observation,
      studentQuotes: g.studentQuotes,
      signals: g.signals,
      sessionId: req.sessionId,
    });
  }
  next = resolveSettledGaps(next);

  // Phase 3(b): best-effort concept canonicalization for new prereq gaps,
  // then prereq-gap mastery resolution. Fail-soft (normalizer returns null
  // without a registry / embedder, leaving conceptId empty → resolve skips).
  const canonGaps: GapEntry[] = [];
  for (const g of next.gaps) {
    if (g.kind === 'prerequisite' && g.conceptLabel && !g.conceptId) {
      try {
        const c = await canonicalizeConceptLabel(g.conceptLabel);
        canonGaps.push(c ? { ...g, conceptId: c.conceptId } : g);
      } catch {
        canonGaps.push(g);
      }
    } else {
      canonGaps.push(g);
    }
  }
  next = { ...next, gaps: canonGaps };
  next = resolveSettledPrereqGaps(next);

  // Record the session memory (this is the idempotency lock) + persist.
  next = appendSessionMemory(next, {
    sessionId: req.sessionId,
    endedAt: new Date().toISOString(),
    subject: req.subject,
    topic: req.topic,
    grade: req.grade,
    lessonPlanId: req.lessonPlanId,
    losTouched: req.losTouched,
    masteryDeltas: req.masteryDeltas,
  });
  const saved = await saveStudentProfile(next);

  // Phase 3(a): reconcile notes ↔ gaps links for each touched baseline.
  const gapLinkInputs = saved.gaps.map((g) => ({ id: g.id, kind: g.kind, loId: g.loId, conceptLabel: g.conceptLabel }));
  for (const n of req.notesTouched) {
    try {
      await reconcileSessionGapLinks({ studentId: req.studentId, baselineId: n.baselineId, gaps: gapLinkInputs, sessionId: req.sessionId });
    } catch {
      // non-fatal — linking is best-effort
    }
  }

  // --- Compute deltas (diff pre/post status) ---
  const newGaps: GapEntry[] = [];
  const promoted: string[] = [];
  const resolved: string[] = [];
  for (const g of saved.gaps) {
    const prev = before.get(g.id);
    if (prev === undefined) newGaps.push(g);
    if ((prev === 'candidate' || prev === 'open') && g.status === 'confirmed') promoted.push(g.id);
    if (g.status === 'resolved' && prev !== 'resolved') resolved.push(g.id);
  }

  return {
    ...base,
    learningStateDelta: {
      gaps: { new: newGaps, promoted, resolved },
      mastery: masterySnapshot(saved, req.losTouched),
    },
  };
}
