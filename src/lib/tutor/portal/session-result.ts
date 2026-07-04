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
 * `socialMemoryDelta` (Task D3, flag-gated behind NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER):
 * on a fresh TERMINAL commit, when the caller supplies a transcript via
 * `opts.social`, the D2 extractor produces suggested new threads + referenced
 * existing-thread ids and the delta is attached to the result. Engine SUGGESTS;
 * the academy is the system of record (assigns/persists threads, dedupes
 * repeats). Guards: see `buildSocialMemoryDelta` below. Flag off / no
 * transcript carrier / empty extraction ⇒ the field is omitted entirely.
 */

import { randomUUID } from 'crypto';

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
  SocialThreadSchema,
  type SessionEmitRequest,
  type SessionResult,
  type ShowQuizPayload,
  type ShowConceptMapPayload,
  type SocialThread,
  type SocialMemoryDelta,
} from '@evelyn/portal-contract/v1';
import { extractSocialThreads } from './extract-social-threads';
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';

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

/** Transcript turn shape shared with the D2 extractor. */
export type SocialTranscriptTurn = { role: 'tutor' | 'student'; text: string };

/** Task D3 — social-extraction inputs, supplied by the CALLER (the emit
 *  route reads them as loose additive body fields; see
 *  `extractSocialCarrier`). Absent ⇒ no extraction, field omitted. */
export interface SocialEmitOptions {
  /** Full session transcript (the extractor's input). */
  transcript: SocialTranscriptTurn[];
  /** Threads that came IN with this session's StudentContext — the
   *  dedupe/referenced-filter baseline. The engine never stores threads
   *  (context ingest only echoes them), so when the caller can't supply
   *  them the default `[]` means referenced-detection yields nothing and
   *  new-thread dedupe falls to the academy's addThreads (system of
   *  record) — a documented, safe degradation. */
  existingThreads?: SocialThread[];
  /** Injectable extractor (tests); defaults to the real D2 Haiku pass. */
  extract?: typeof extractSocialThreads;
}

export interface EmitOptions {
  /** Optional loader for logged artifacts when the request omits them. */
  loadArtifacts?: (sessionId: string) => Promise<unknown>;
  /** Task D3 — see SocialEmitOptions. */
  social?: SocialEmitOptions;
}

/**
 * Task D3 — defensively pull the ADDITIVE loose social-carrier fields off a
 * raw emit-request body. `transcript` + `socialMemory` are not (yet) part of
 * the contract's SessionEmitRequestSchema — zod strips unknown keys, so the
 * academy can send them today without breaking parse; a future contract
 * minor formalizes them. Malformed/absent input ⇒ undefined (no extraction).
 * Pure.
 */
export function extractSocialCarrier(body: unknown): SocialEmitOptions | undefined {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined;
  const raw = body as Record<string, unknown>;

  if (!Array.isArray(raw.transcript)) return undefined;
  const transcript: SocialTranscriptTurn[] = [];
  for (const t of raw.transcript) {
    if (!t || typeof t !== 'object') continue;
    const role = (t as Record<string, unknown>).role;
    const text = (t as Record<string, unknown>).text;
    if ((role === 'tutor' || role === 'student') && typeof text === 'string' && text.trim()) {
      transcript.push({ role, text });
    }
  }
  if (transcript.length === 0) return undefined;

  const existingThreads: SocialThread[] = [];
  if (Array.isArray(raw.socialMemory)) {
    for (const item of raw.socialMemory) {
      const parsed = SocialThreadSchema.safeParse(item);
      if (parsed.success) existingThreads.push(parsed.data);
    }
  }
  return { transcript, existingThreads };
}

/**
 * Task D3 — run the D2 social-thread extraction and shape the contract
 * `SocialMemoryDelta`, or return undefined (field omitted) when any guard
 * trips:
 *   - flag off (isPedagogyOpenerFlagValue on NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER);
 *   - no transcript carrier (`opts.social` absent — demo/logged-out sessions
 *     never reach this authed-portal path at all, and the internal
 *     /api/tutor/student-profile commit is untouched, so the extractor can
 *     never run for them);
 *   - persisted socialMemoryLevel is 'off' OR was never set. The contract
 *     defaults the level to 'off' and the context-ingest route always stamps
 *     it, so "never set" means no portal context was ever ingested for this
 *     student — treat as opted out. Belt-and-suspenders: the academy already
 *     resolves parental opt-out AND trial to no-carrier/empty threads
 *     (SessionEmitRequest has no isTrial discriminator, so trial gating is
 *     the academy's job — it simply doesn't send the transcript carrier for
 *     trial sessions);
 *   - extraction returned nothing (empty delta is NOT sent as {new:[],referenced:[]});
 *   - any unexpected failure (never breaks the result emit).
 *
 * Suggested candidates are mapped to full contract SocialThread shape
 * (SocialMemoryDeltaSchema.new requires id + capturedAt): ids are synthesized
 * (`thr_<uuid>`) and capturedAt = now — the academy's addThreads is the
 * system of record and its dedupe handles repeats. No nulls anywhere on the
 * wire (contract optionals are .optional(), not .nullable()).
 */
async function buildSocialMemoryDelta(
  social: SocialEmitOptions | undefined,
  socialMemoryLevel: 'off' | 'light' | 'warm' | undefined,
): Promise<SocialMemoryDelta | undefined> {
  if (!isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER)) return undefined;
  if (!social || social.transcript.length === 0) return undefined;
  if (socialMemoryLevel === undefined || socialMemoryLevel === 'off') return undefined;
  try {
    const extract = social.extract ?? extractSocialThreads;
    const existing = social.existingThreads ?? [];
    // D2's extractor never throws by contract; the wrap is defensive.
    const { suggestedThreads, referencedThreadIds } = await extract(social.transcript, existing);
    if (suggestedThreads.length === 0 && referencedThreadIds.length === 0) return undefined;
    const capturedAt = new Date().toISOString();
    return {
      new: suggestedThreads.map((c): SocialThread => ({
        id: `thr_${randomUUID()}`,
        note: c.note,
        kind: c.kind,
        capturedAt,
      })),
      referenced: referencedThreadIds,
    };
  } catch {
    // Session-end path — never break the result emit.
    return undefined;
  }
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
    // Task D3 ordering fix: in the LIVE flow the engine runtime's own
    // commit (client → /api/tutor/student-profile, same client sessionId)
    // lands BEFORE the academy's session-ended emit — so this replay branch
    // is the NORMAL path for that emit, not an exceptional retry. Social
    // extraction must still run here or the carrier is dead in production.
    // Safe to repeat: the academy's addThreads dedupes by note and
    // markReferenced recency bumps are idempotent in effect.
    const replaySocialDelta = await buildSocialMemoryDelta(
      opts.social,
      profile.preferences.socialMemoryLevel,
    );
    return {
      ...base,
      learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: masterySnapshot(profile, req.losTouched) },
      ...(replaySocialDelta ? { socialMemoryDelta: replaySocialDelta } : {}),
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

  // Task D3 — social-memory delta (checkpoint path returns above without
  // extraction; the idempotent-replay path above ALSO extracts — see the
  // ordering-fix comment there). The socialMemoryLevel guard reads the
  // PERSISTED preference stamped by the context-ingest route
  // (/api/portal/v1/context).
  const socialMemoryDelta = await buildSocialMemoryDelta(
    opts.social,
    saved.preferences.socialMemoryLevel,
  );

  return {
    ...base,
    learningStateDelta: {
      gaps: { new: newGaps, promoted, resolved },
      mastery: masterySnapshot(saved, req.losTouched),
    },
    // Omit entirely (never {new:[],referenced:[]}) when nothing was extracted.
    ...(socialMemoryDelta ? { socialMemoryDelta } : {}),
  };
}
