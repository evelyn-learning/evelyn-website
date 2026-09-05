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
  resolveProfileIdOrRaw,
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
import { appendEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import { findAssignmentBySession } from '@/lib/tutor/practice-assign/store';

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
  /** Final-review fix (C1) — internal callers that already wrote their own
   *  per-item evidence rows (e.g. `submitAssessment`'s `diag:` rows) set this
   *  so `buildEmitEvidence` does NOT ALSO synthesize a `masteryDeltas`
   *  fallback row on top of them (that produced a spurious `emit:<sid>:
   *  lo:<loId>` row double-counting the same outcome — a 50% quiz measured
   *  as estimate 0.6, not 0.5). Only suppresses the fallback; an explicit
   *  `req.evidence[]` (contract-level callers) is never affected. NOT part
   *  of the portal contract — internal engine option only. */
  skipEvidenceFallback?: boolean;
  /** Final-review fix (M3, spec §4.1); REQUIRED as of M1c Task 5 (fix round
   *  2, IMPORTANT C) — the authenticated partner id (`auth.partnerId` from
   *  `withPortalAuth`, or an internal route's `partnerIdForInternalRoute`),
   *  stamped onto every evidence row this call produces AND used to resolve
   *  the profile-store identity below. Was optional with a `?? ''`
   *  fallback; that made the doc comment on `resolveProfileIdOrRaw`'s "every
   *  caller declares partnerId as required" claim false for this function's
   *  own option bag. Required (not just documented) so a caller that forgot
   *  to thread it is a compile error, not a silent runtime path into that
   *  function's catch. */
  partnerId: string;
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

/** Task 8 — evidence for the learner model's server append point. Prefers
 *  the caller-supplied `req.evidence[]` (contract v1.12.0, one row per
 *  index, keyed `emit:<sessionId>:<i>`); when absent AND `skipFallback` is
 *  not set, falls back to one row per `masteryDeltas` entry (keyed
 *  `emit:<sessionId>:lo:<loId>`, source 'session', outcome derived from
 *  delta sign) so pre-v1.12.0 portal callers still feed the learner model.
 *  `skipFallback` (C1 fix) is set by internal callers — e.g.
 *  `submitAssessment` — that already wrote their own per-item evidence for
 *  this outcome and must not have this fallback double-count it; it never
 *  suppresses an explicit `req.evidence[]`. Only ever called from the
 *  commit path (after the idempotency-replay guard above), so a replayed
 *  terminal emit never re-builds this — belt-and-suspenders with the
 *  idempotency keys themselves. Pure. */
function buildEmitEvidence(
  req: SessionEmitRequest,
  skipFallback: boolean,
  partnerId: string | undefined,
  /** M1c Task 5 (fix round 1, CRITICAL 2) — the RESOLVED profile id, used as
   *  the evidence store's `studentId` key. `EvidenceEvent` and
   *  `StudentProfile` are one identity space (`scripts/backfill-evidence.ts`
   *  writes `studentId: profile._id` directly) — using `req.studentId` (raw)
   *  here while the profile store used the resolved id would silently split
   *  a partner's evidence trail from their profile. */
  profileId: string,
): EvidenceInput[] {
  const occurredAt = new Date();
  if (req.evidence && req.evidence.length > 0) {
    return req.evidence.map((e, i) => ({
      idempotencyKey: `emit:${req.sessionId}:${i}`,
      studentId: profileId,
      partnerId,
      loId: e.loId,
      source: e.source,
      sessionId: req.sessionId,
      itemId: e.itemId,
      outcome: e.outcome,
      difficulty: e.difficulty,
      latencyMs: e.latencyMs,
      hintUsed: e.hintUsed,
      occurredAt,
      subject: req.subject,
    }));
  }
  if (skipFallback) return [];
  return req.masteryDeltas.map((m) => ({
    idempotencyKey: `emit:${req.sessionId}:lo:${m.loId}`,
    studentId: profileId,
    partnerId,
    loId: m.loId,
    source: 'session',
    sessionId: req.sessionId,
    outcome: m.delta >= 0 ? 1 : 0,
    occurredAt,
    subject: req.subject,
  }));
}

export async function emitSessionResult(
  req: SessionEmitRequest,
  /** M1c Task 5 (fix round 2, IMPORTANT C) — no default: `partnerId` is a
   *  required field of `EmitOptions`, so an omitted `opts` object could
   *  never satisfy the type anyway. Every real and test call site passes
   *  an explicit options object (see EmitOptions.partnerId's doc comment). */
  opts: EmitOptions,
): Promise<SessionResult> {
  // M1c Task 5 (spec §4.1) — resolve ONCE per request; `profileId` is used
  // for EVERY student-keyed store touched below (the profile itself,
  // buildEmitEvidence's rows, reconcileSessionGapLinks' StudentTopicNotes
  // lookups) — never `req.studentId` again except where the CONTRACT
  // response must echo back the raw external id the portal sent (`base`
  // below): the portal has no concept of our internal surrogate id.
  // Both real callers (session-result/route.ts, assessment.ts's
  // submitAssessment) are portal-only and thread opts.partnerId from
  // auth.partnerId. resolveProfileIdOrRaw still degrades to the raw id on
  // a genuine resolution FAILURE (DB blip) rather than throwing, so a DB
  // blip here can't 500 a session-end commit — but a missing partnerId is
  // now a compile error, not a path that reaches that degrade.
  const profileId = await resolveProfileIdOrRaw({ partnerId: opts.partnerId, externalStudentId: req.studentId });
  const profile = await getOrCreateStudentProfile(profileId);

  const artifacts =
    req.renderedArtifacts ??
    (opts.loadArtifacts ? extractRenderedArtifacts(await opts.loadArtifacts(req.sessionId)) : { quizzes: [], conceptMaps: [] });

  // v1.15.0 — best-effort homework echo (authoritative read = assigned-practice route).
  // Fix round 1 (Important I1) — sessionId is a bare partner-supplied
  // string (SessionEmitRequestSchema has no format constraint), and a
  // session-id collision across students/partners is a known, OBSERVED
  // prod behaviour (see the 2026-09-04 triage's log-only ruling). Scope to
  // the resolved profileId — the same id every other student-keyed store
  // touched by this function uses — so a colliding sessionId can never
  // echo another student's homework (LOs, free-text reason, item ids) or
  // nextSessionIntent back to the caller.
  const rawAssignment = await findAssignmentBySession(req.sessionId).catch(() => null);
  const assignment = rawAssignment && rawAssignment.studentId === profileId ? rawAssignment : null;
  const assignedPractice = assignment && assignment.locator
    ? assignment.los.map((l) => ({ loId: l.loId, title: l.title, itemIds: l.items.map((i) => i.id), reason: l.reason, assignedAt: assignment.assignedAt.toISOString() }))
    : undefined;
  // Fix round 2 (Important I1) — the profile's `nextSessionIntent` is
  // whatever session last wrote it, which can be months old and unrelated
  // to this emit (e.g. a later session that closed with no new intent).
  // The renderer's own `<learner_context>` guard scopes by recency
  // (`context-block.ts`'s INTENT_MAX_AGE_DAYS); this wire echo instead
  // scopes by IDENTITY — only surface the profile fallback when it was
  // this very session's final commit that wrote it (`sessionId` stamped in
  // `student-profile/[id]/route.ts`). Otherwise the profile note is stale
  // for THIS emit and must not be echoed as if it were.
  const nextSessionIntent =
    assignment?.nextTimeIntent ??
    (profile.nextSessionIntent?.sessionId === req.sessionId ? profile.nextSessionIntent.text : undefined);

  const base: Omit<SessionResult, 'learningStateDelta'> = {
    sessionId: req.sessionId,
    studentId: req.studentId,
    courseId: req.courseId,
    status: req.status,
    milestone: req.milestone ?? 'none',
    notesTouched: req.notesTouched,
    renderedArtifacts: artifacts,
    ...(assignedPractice ? { assignedPractice } : {}),
    ...(nextSessionIntent ? { nextSessionIntent } : {}),
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

  // Task 8 — learner-model evidence append. Fire-and-forget (this is a
  // latency-sensitive session-end path); appendEvidence is itself
  // best-effort and never throws, so the .catch is belt-and-suspenders.
  const emitEvidence = buildEmitEvidence(req, opts.skipEvidenceFallback ?? false, opts.partnerId, profileId);
  if (emitEvidence.length > 0) {
    appendEvidence(emitEvidence).catch((err) =>
      console.error('[learner-model] emit evidence append failed', err),
    );
  }

  // Phase 3(a): reconcile notes ↔ gaps links for each touched baseline.
  const gapLinkInputs = saved.gaps.map((g) => ({ id: g.id, kind: g.kind, loId: g.loId, conceptLabel: g.conceptLabel }));
  for (const n of req.notesTouched) {
    try {
      await reconcileSessionGapLinks({ studentId: profileId, baselineId: n.baselineId, gaps: gapLinkInputs, sessionId: req.sessionId });
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
