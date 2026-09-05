/**
 * GET /api/tutor/student-profile/:id     — fetch a profile (or empty new one).
 * POST /api/tutor/student-profile/:id    — commit session deltas at end-of-session.
 *
 * The POST body contains the accumulated session events (mastery
 * deltas, gaps recorded, LOs touched, transcript, lesson plan id).
 * The route applies them to the persisted profile, generates the
 * session summary (returned in the response and stamped on the new
 * SessionMemory entry), and saves the result.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateStudentProfile,
  saveStudentProfile,
  applyMasteryDeltas,
  recordGap,
  applyCrossSessionPromotion,
  resolveSettledGaps,
  upsertSessionMemory,
  recordPlanContentSeen,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';
import type { GapSignalCode } from '@/lib/tutor/student-profile/types';
import { renderStudentProfileBlock } from '@/lib/tutor/student-profile/render';
import { isPedagogyOpenerFlagValue } from '@/lib/tutor/ai/opening-behavior';
import { generateSessionRecap, type SessionSummaryInput } from '@/lib/tutor/student-profile/session-summary';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { appendEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { getLearnerContextBlock } from '@/lib/tutor/learner-model/context-block';
import { assignPractice } from '@/lib/tutor/practice-assign/assign';
import { findAssignmentBySession, acknowledgeAssignments } from '@/lib/tutor/practice-assign/store';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = req.headers.get('x-embed-token');
  const auth = await checkEmbedAuthAsync({
    token,
    expectedStudentId: id,
    route: 'student-profile:GET',
  });
  if (!auth.allow) {
    return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  }
  // M1c final review (A-I5 / spec §4.0) — the round-4 rule, applied here
  // too. `!auth.allow` alone is NOT the whole rule: in
  // EMBED_TOKEN_ENFORCE='log' mode checkEmbedAuth returns
  // `{allow: true, reason, payload}` for a token that FAILED verification,
  // so the request would proceed and partnerIdForInternalRoute would
  // degrade it to 'evelyn'. A present-but-invalid token is not retail; it
  // must reject. A genuinely ABSENT token (retail /tutor) still passes
  // through untouched — see embedTokenRejectionReason's doc comment.
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) {
    console.error('[student-profile] embed token present but invalid:', rejection);
    return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  }
  // M1c Task 5 (fix round 2, CRITICAL A / spec §4.0) — resolve ONCE per
  // request under the embedded session's VERIFIED partner (the embed
  // token's partner_id claim), not a hardcoded 'evelyn' — see
  // partnerIdForInternalRoute's doc comment. Every student-keyed read below
  // (the profile, and getLearnerContextBlock's own LearnerStateProjection
  // read) uses this SAME `profileId`, never the raw `id` a second time.
  const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: id });
  const profile = await getOrCreateStudentProfile(profileId);
  const responseBody: Record<string, unknown> = {
    profile,
    // Task D1: interests ride the preferences line only behind the pedagogy
    // opener flag — flag off ⇒ byte-identical block to the pre-D1 output.
    block: renderStudentProfileBlock(profile, {
      includeInterests: isPedagogyOpenerFlagValue(process.env.NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER),
    }),
    // Content variety (phase 1): per-plan seen-memory, read client-side at
    // mount to inject the <content_variety> directive for the current plan.
    planContentSeen: profile.planContentSeen ?? {},
  };
  // Task 17 — learner-context boot block. Server-side flag, read at call
  // time (no NEXT_PUBLIC_ needed: this is a route handler, not client
  // code). Flag off OR no `lessonPlanId` param ⇒ the `learnerContext` key
  // is OMITTED entirely (not even `null`) so the response stays
  // byte-identical to the pre-Task-17 shape for every existing caller.
  const lessonPlanId = new URL(req.url).searchParams.get('lessonPlanId');
  if (process.env.TUTOR_LEARNER_CONTEXT === 'on' && lessonPlanId) {
    responseBody.learnerContext = await getLearnerContextBlock(profileId, lessonPlanId);
  }
  return NextResponse.json(responseBody);
}

interface CommitBody {
  sessionId: string;
  endedAt?: string;
  durationMinutes?: number;
  subject?: string;
  topic?: string;
  grade?: string;
  lessonPlanId?: string;
  losTouched?: string[];
  masteryDeltas?: Array<{ loId: string; delta: number }>;
  /** Rich gap entries from the orchestrator. `signals` is already merged
   *  (brain-emitted signalsObserved + orchestrator-stamped objective signals
   *  like INCORRECT_STREAK_2_PLUS). The store layer computes confidence
   *  and runs candidate→confirmed promotion at write time. */
  gaps?: Array<{
    kind: 'lo' | 'prerequisite';
    loId?: string;
    conceptLabel?: string;
    observation: string;
    studentQuotes?: string[];
    signals?: string[];
    /** Legacy field — old clients may still post this. Mapped to observation. */
    description?: string;
    /** Holistic-pedagogy round: ledger recurrence count this increment. */
    recurrences?: number;
    /** True when the orchestrator inferred this gap from behaviour. */
    inferred?: boolean;
    /** Consent-gated recap outcome for this gap this increment. */
    recap?: { offered: number; outcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling' };
  }>;
  /** Full transcript for the summary generator. */
  transcript?: Array<{ role: 'student' | 'tutor'; text: string }>;
  /** When false, skip summary generation (faster commit). Defaults to true.
   *  Field name kept for backwards compatibility with older clients. */
  generateNotes?: boolean;
  /** Per-bucket count of topic-notes overlay tool calls the orchestrator
   *  allowed through this session. Stamped into SessionMemory for
   *  next-session profile-block priming. Per Q11d. */
  notesOverlaysAddedThisSession?: { theory: number; methods: number; pointers: number };
  /** Content variety (phase 1): when true AND a lessonPlanId is present, the
   *  final-commit summary pass ALSO extracts the fillings used and merges them
   *  into planContentSeen[lessonPlanId]. Client sets it only when its
   *  TUTOR_CONTENT_VARIETY flag is on. */
  captureContentFillings?: boolean;
  /** Task 11 — one entry per EVALUATIVE mark_segment_complete this
   *  increment, used to feed the learner model per-segment evidence rows
   *  (idempotency key `sess:<sessionId>:<segmentId>`). Client-supplied —
   *  validated defensively below (malformed entries skipped, non-evaluative
   *  kinds dropped, outcome range-checked, list capped). */
  segmentOutcomes?: Array<{
    segmentId: string;
    loId: string;
    kind: string;
    completed: boolean;
    /** 1 (streak-confirmed) or 0.5 (attempted, not clearly mastered) —
     *  computed client-side, never hardcoded. Range-validated below. */
    outcome: number;
    streakAtComplete?: number;
    turns?: number;
  }>;
  /** Spec §C.3 — close_session_notes.nextTimeIntent (final commit only). */
  nextSessionIntent?: string;
  /** Spec §C.6 — embed-config practice locator, stamped on any auto-assigned
   *  homework record (Task 10). Absent ⇒ record stays behind the gate. */
  practiceLocator?: string;
  /** Spec §C.4 — assignment ids whose homework line rendered at boot; the
   *  final commit acknowledges them (Task 10). */
  homeworkAcknowledged?: string[];
}

/** Task 11 — client-supplied cap so a runaway/misbehaving client can't
 *  balloon a single commit into an unbounded evidence write. Applied AFTER
 *  validation (not before) so a batch with junk entries ahead of valid ones
 *  can't starve the valid entries out of the cap. */
const MAX_SEGMENT_OUTCOMES_PER_COMMIT = 100;

/** Task 11 (review ruling) — defense-in-depth mirror of the client's
 *  EVALUATIVE_SEGMENT_KINDS gate (VoiceTutorRealtime.tsx): exposure kinds
 *  (hook/concept/worked_example/recap/extension) aren't an assessed
 *  outcome. The server drops them even if a client sends one, rather than
 *  trusting client-side filtering alone. */
const EVALUATIVE_SEGMENT_KINDS = new Set<string>(['try_yourself', 'misconception_check']);

/** Holistic-pedagogy round — allowed recap outcome values. Validated defensively
 *  at the profile commit route to prevent un-narrowed client strings from
 *  reaching the store layer. */
const RECAP_OUTCOMES = new Set(['accepted', 'declined', 'improved', 'still_struggling']);

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let body: CommitBody;
  try {
    body = (await req.json()) as CommitBody;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  // Token comes via the x-embed-token header (GET/POST) or, for POST only,
  // body.embedToken (client keepalive-path symmetry with session-usage).
  // Header wins when both are present. Strip embedToken from body BEFORE any
  // further use so it can never leak into a profile write.
  const bodyWithToken = body as CommitBody & { embedToken?: unknown };
  const token =
    req.headers.get('x-embed-token') ??
    (typeof bodyWithToken.embedToken === 'string' ? bodyWithToken.embedToken : null);
  delete bodyWithToken.embedToken;

  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: id, route: 'student-profile:POST' });
  if (!auth.allow) {
    return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  }
  // M1c final review (A-I5 / spec §4.0) — see the GET handler above for the
  // full reasoning. This is the higher-value half: POST is the session-end
  // commit (mastery deltas, gaps, segmentOutcomes evidence). Without this,
  // a partner session past its token's grace window in
  // EMBED_TOKEN_ENFORCE='log' mode writes its ENTIRE outcome under
  // ('evelyn', rawStudentId).
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) {
    console.error('[student-profile] embed token present but invalid:', rejection);
    return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  // M1c Task 5 (fix round 1 CRITICAL 2 / fix round 2 CRITICAL A) — resolve
  // ONCE, up front, under the embedded session's VERIFIED partner (not a
  // hardcoded 'evelyn' — see partnerIdForInternalRoute), so both the
  // segmentOutcomes evidence rows below AND the profile-store commit use
  // the SAME `profileId`. Round 1 resolved only the profile-store call
  // (further down) and left this evidence write on the raw `id` — two
  // partners sending the same external id would then share one Elo/
  // evidence trail while their profiles correctly split in two.
  const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: id });

  // Task 11 — per-segment learner-model evidence (append point 1).
  // Fire-and-forget: appendEvidence is itself best-effort and never
  // throws, so the .catch is belt-and-suspenders; NOT awaited so a slow
  // evidence write can't add latency to the profile-commit response.
  // segmentOutcomes is client-supplied — validate defensively: skip
  // malformed entries and non-evaluative kinds, range-check outcome, THEN
  // cap the batch (validate-then-cap, not cap-then-validate, so junk
  // entries ahead of valid ones can't crowd valid ones out).
  if (Array.isArray(body.segmentOutcomes) && body.segmentOutcomes.length) {
    const occurredAt = new Date();
    const validated: EvidenceInput[] = [];
    for (const so of body.segmentOutcomes) {
      if (!so || typeof so !== 'object') continue;
      if (typeof so.segmentId !== 'string' || !so.segmentId) continue;
      if (typeof so.loId !== 'string' || !so.loId) continue;
      if (so.completed !== true) continue;
      if (typeof so.kind !== 'string' || !EVALUATIVE_SEGMENT_KINDS.has(so.kind)) continue;
      if (typeof so.outcome !== 'number' || !(so.outcome >= 0 && so.outcome <= 1)) continue;
      validated.push({
        idempotencyKey: `sess:${body.sessionId}:${so.segmentId}`,
        studentId: profileId,
        loId: so.loId,
        source: 'session',
        sessionId: body.sessionId,
        outcome: so.outcome,
        streakAtComplete: typeof so.streakAtComplete === 'number' ? so.streakAtComplete : undefined,
        turns: typeof so.turns === 'number' ? so.turns : undefined,
        occurredAt,
        subject: body.subject,
      });
    }
    const evidenceInputs = validated.slice(0, MAX_SEGMENT_OUTCOMES_PER_COMMIT);
    if (evidenceInputs.length) {
      appendEvidence(evidenceInputs).catch((err) =>
        console.error('[student-profile] segmentOutcomes evidence append failed', err),
      );
    }
  }

  // `profileId` was already resolved above (once per request).
  let profile = await getOrCreateStudentProfile(profileId);

  if (Array.isArray(body.masteryDeltas) && body.masteryDeltas.length) {
    profile = applyMasteryDeltas(profile, body.masteryDeltas);
  }
  // Resolve any LO gap whose mastery has settled into strong/sustained
  // (score >= 0.8, exposures >= 3). Runs after applyMasteryDeltas so
  // this session's deltas count toward resolution. Runs BEFORE recordGap
  // so a gap that's about to be re-fired this session has its
  // re-open-from-resolved path handled correctly: resolveSettledGaps
  // marks it resolved based on historical mastery, then recordGap's
  // matchResolved path re-opens it as candidate when the brain logs the
  // fresh misconception. The contradiction resolves toward the fresh
  // evidence, which is the right behavior.
  profile = resolveSettledGaps(profile);
  if (Array.isArray(body.gaps)) {
    for (const g of body.gaps) {
      const observation = g.observation ?? g.description ?? '';
      if (!observation) continue; // skip malformed entries
      // Default kind for legacy callers that only sent loId+description.
      const kind: 'lo' | 'prerequisite' = g.kind ?? 'lo';
      if (kind === 'lo' && !g.loId) continue;
      if (kind === 'prerequisite' && !g.conceptLabel) continue;
      profile = recordGap(profile, {
        kind,
        loId: g.loId,
        conceptLabel: g.conceptLabel,
        observation,
        studentQuotes: g.studentQuotes ?? [],
        signals: (g.signals ?? []) as GapSignalCode[],
        sessionId: body.sessionId,
        recurrences: typeof g.recurrences === 'number' && g.recurrences > 0 ? Math.min(g.recurrences, 20) : undefined,
        inferred: g.inferred === true,
        recap: g.recap && typeof g.recap.offered === 'number'
          ? {
              offered: Math.max(0, Math.min(g.recap.offered, 5)),
              outcome: typeof g.recap.outcome === 'string' && RECAP_OUTCOMES.has(g.recap.outcome)
                ? (g.recap.outcome as 'accepted' | 'declined' | 'improved' | 'still_struggling')
                : undefined,
            }
          : undefined,
      });
    }
  }
  // Cross-session promotion fallback. Runs AFTER recordGap so a
  // brain-fired re-occurrence (which already includes this sessionId)
  // doesn't double-count — the dedup guard inside applyCrossSessionPromotion
  // skips any gap whose sessionIds already contains body.sessionId.
  if (Array.isArray(body.masteryDeltas) && body.masteryDeltas.length) {
    profile = applyCrossSessionPromotion(profile, body.masteryDeltas, body.sessionId);
  }

  // Persist nextSessionIntent to profile (Spec §C.3). Final commit only.
  if (typeof body.nextSessionIntent === 'string' && body.nextSessionIntent.trim()) {
    profile = {
      ...profile,
      nextSessionIntent: { text: body.nextSessionIntent.trim().slice(0, 200), sessionId: body.sessionId, at: new Date().toISOString() },
    };
  }

  // Spec §C.3 fallback: FINAL commit, nothing assigned this session, and the
  // session produced a recurrence or a well-signalled gap → auto-assign the
  // top LO. Best-effort: a failure here never fails the commit.
  let autoAssigned: Array<{ loId: string; title: string; count: number }> | undefined;
  if (body.generateNotes !== false && Array.isArray(body.gaps) && body.gaps.length) {
    const candidates = body.gaps
      .filter((g) => (g.kind ?? 'lo') === 'lo' && g.loId && ((g.recurrences ?? 0) >= 1 || (g.signals?.length ?? 0) >= 2))
      .sort((a, b) => ((b.recurrences ?? 0) - (a.recurrences ?? 0)) || ((b.signals?.length ?? 0) - (a.signals?.length ?? 0)));
    if (candidates.length) {
      try {
        // `sessionId` is a unique index on PracticeAssignment (Task 9), which
        // is the incidental TOCTOU mitigation between a tool-time
        // practice-assign write and this fallback: if both race, this check
        // can pass for both, but the loser's upsertAssignment hits a
        // duplicate-key error rather than a second record — caught below.
        const existing = await findAssignmentBySession(body.sessionId);
        if (!existing) {
          const plan = body.lessonPlanId ? await getLessonPlan(body.lessonPlanId) : null;
          const lo = plan?.los.find((l) => l.id === candidates[0].loId);
          // Cap the title BEFORE building the sentence so the synthesized
          // reason stays readable rather than truncating mid-sentence when a
          // plan LO has only a long `description` (assignPractice caps the
          // whole reason string too, as a backstop).
          const title = (lo?.shortTitle ?? lo?.description ?? candidates[0].loId!).slice(0, 120);
          const out = await assignPractice({
            profileId, partnerId: partnerIdForInternalRoute(auth), externalStudentId: id, sessionId: body.sessionId,
            lessonPlanId: body.lessonPlanId, loIds: [candidates[0].loId!],
            reason: `Your tutor noticed ${title} needed more practice this session.`,
            locator: body.practiceLocator, nextTimeIntent: body.nextSessionIntent, subject: body.subject, auto: true,
          });
          if (out) { autoAssigned = out.assigned; console.log(`[student-profile] auto-assigned homework session=${body.sessionId} ${JSON.stringify(out.assigned)}`); }
        }
      } catch (e) { console.error('[student-profile] auto-assign failed', e); }
    }
  }
  if (Array.isArray(body.homeworkAcknowledged) && body.homeworkAcknowledged.length) {
    acknowledgeAssignments(body.homeworkAcknowledged.filter((x): x is string => typeof x === 'string').slice(0, 10))
      .catch((e) => console.error('[student-profile] acknowledge failed', e));
  }

  let summaryError: string | undefined;
  let summary: string | undefined;
  if (body.generateNotes !== false && Array.isArray(body.transcript) && body.transcript.length > 0) {
    try {
      const lessonPlan = body.lessonPlanId ? await getLessonPlan(body.lessonPlanId) : null;
      const summaryInput: SessionSummaryInput = {
        transcript: body.transcript,
        lessonPlan,
        subject: body.subject,
        topic: body.topic,
        grade: body.grade,
        losTouched: body.losTouched,
      };
      const recap = await generateSessionRecap(summaryInput, {
        extractFillings: body.captureContentFillings === true && !!body.lessonPlanId,
      });
      summary = recap.summary;
      // Content variety (phase 1): merge the fillings used this session into
      // the per-plan seen-memory so the NEXT session on this plan diverges.
      if (recap.fillings && body.lessonPlanId) {
        profile = recordPlanContentSeen(profile, body.lessonPlanId, recap.fillings);
      }
    } catch (err) {
      summaryError = (err as Error).message;
      console.error('[student-profile] summary generation failed:', err);
    }
  }

  // upsert (not append): the orchestrator commits incrementally — debounced
  // flushes as the session accumulates + a pagehide keepalive commit + the
  // final End-button commit. Merge-by-sessionId keeps one entry per session.
  profile = upsertSessionMemory(profile, {
    sessionId: body.sessionId,
    endedAt: body.endedAt ?? new Date().toISOString(),
    subject: body.subject,
    topic: body.topic,
    grade: body.grade,
    lessonPlanId: body.lessonPlanId,
    losTouched: body.losTouched ?? [],
    summary,
    durationMinutes: body.durationMinutes,
    masteryDeltas: body.masteryDeltas,
    notesOverlaysAddedThisSession: body.notesOverlaysAddedThisSession,
  });
  if (body.grade) profile.grade = body.grade;

  const saved = await saveStudentProfile(profile);

  return NextResponse.json({
    profile: saved,
    summary,
    summaryError,
    ...(autoAssigned ? { assigned: autoAssigned } : {}),
  });
}
