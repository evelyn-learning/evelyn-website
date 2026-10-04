/**
 * Tutor Session Usage API Route
 *
 * Upserts session usage data for tracking tutor sessions.
 * Used internally by the tutor client to send periodic and final updates.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@core/db";
import { TutorSession, type ITutorSession } from "@/models/TutorSession";
import { extractClientIp } from "@/lib/tutor/recordings/client-ip";
import { lookupGeo } from "@/lib/tutor/recordings/geo";
import { checkEmbedAuthAsync } from "@/lib/tutor/portal/embed-token";
import { demoGateSecret } from "@/lib/tutor/demo-gate/gate";
import { DEMO_GRANT_COOKIE, verifyDemoGrant } from "@/lib/tutor/demo-gate/grant";
import { isStaleSessionReuse } from "@/lib/tutor/portal/session-id-reuse";
import { buildAttemptSpanWrite, durationBehindSpans, planAttemptSave, sessionActiveSeconds, type AttemptSavePlan } from "@/lib/tutor/recordings/active-seconds";

/**
 * GET /api/tutor/session-usage?sessionId= — read prior session state for the
 * embed's resume boot (contract v1.2.0, E3). Returns just what rehydration
 * needs: the lesson-position checkpoint + transcript + whiteboard. Keyed on the
 * opaque sessionId. The embed enforces RESUME_MAX_AGE_MS on the checkpoint's
 * updatedAt itself. `activeSeconds` (additive, 2026-10-03) is the session's
 * active time so far — earlier sittings summed — so a resumed mount can report
 * a cumulative `duration` in evelyn:session_ended from its first second.
 *
 * Auth (learner-model Phase C, Task 3): a valid embed token (any partner) is
 * required in `on` mode — no expectedStudentId, since this read is keyed by
 * opaque sessionId rather than per-student; the token just proves a
 * legitimate embed context. Checked BEFORE the sessionId-missing 400 and
 * before connectDB(), so a denied request never touches Mongo.
 */
export async function GET(req: NextRequest) {
  const auth = await checkEmbedAuthAsync({
    token: req.headers.get("x-embed-token"),
    route: "session-usage:GET",
  });
  if (!auth.allow) {
    return NextResponse.json({ error: "unauthorized", reason: auth.reason }, { status: 401 });
  }

  const sessionId = new URL(req.url).searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  try {
    await connectDB();
    const session = await TutorSession.findOne({ sessionId }).lean<ITutorSession | null>();
    if (!session) {
      return NextResponse.json({ exists: false });
    }
    return NextResponse.json({
      exists: true,
      status: session.status,
      // Identity — lets the standalone /tutor page rebuild its session config
      // (subject/level/topic/plan/goal) on reload-resume from the URL alone.
      subject: session.subject,
      topic: session.topic,
      level: session.level,
      sessionGoal: session.sessionGoal,
      studentName: session.studentName,
      inputMode: session.inputMode,
      startedAt: session.startedAt,
      activeSeconds: sessionActiveSeconds(session) ?? 0,
      lessonProgress: session.lessonProgress ?? null,
      transcript: session.transcript ?? [],
      whiteboardCommands: session.whiteboardCommands ?? [],
    });
  } catch (error) {
    console.error("Session usage read error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Simple in-memory rate limit: max 60 requests per minute per session
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  entry.count++;
  return entry.count <= 60;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sessionId } = body;
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Auth (learner-model Phase C, Task 3): token comes via the
    // x-embed-token header or, for the sendBeacon pagehide path (which can't
    // set headers — see embed/page.tsx:583-584), body.embedToken. Header
    // wins when both are present. Strip embedToken from body BEFORE any
    // further use so it can never leak into a stored session document.
    const token =
      req.headers.get("x-embed-token") ??
      (typeof body.embedToken === "string" ? body.embedToken : null);
    delete body.embedToken;

    // Conditional: only when a studentId is present does this POST need to
    // prove it belongs to that student. Anonymous demo surfaces (the
    // engine's own /tutor page, no partner student identity) post with no
    // studentId and stay unauthenticated by design. Checked BEFORE
    // checkRateLimit/connectDB so a forged flood of studentId-bearing
    // requests gets 401s, not DB-adjacent work.
    if (body.studentId) {
      const auth = await checkEmbedAuthAsync({
        token,
        expectedStudentId: String(body.studentId),
        route: "session-usage:POST",
      });
      if (!auth.allow) {
        return NextResponse.json({ error: "unauthorized", reason: auth.reason }, { status: 401 });
      }
    }

    if (!checkRateLimit(sessionId)) {
      return NextResponse.json(
        { error: "Too many updates, slow down" },
        { status: 429 }
      );
    }

    await connectDB();

    // Build the update payload — only include fields that are present
    const updateFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {};

    // Location capture (admin debugging): resolve the client IP once, on
    // the insert that creates the session document. The same lookup also
    // feeds the cross-sitting reuse check below — one indexed point lookup
    // serving both, rather than two against an identical filter.
    // It also carries what the cumulative-duration arithmetic below needs
    // (startedAt / duration / attemptSpans — small fields).
    type ExistingDoc = { createdAt?: Date; startedAt?: Date; duration?: number; attemptSpans?: unknown } | null;
    const readExisting = () =>
      TutorSession.findOne(
        { sessionId },
        { createdAt: 1, startedAt: 1, duration: 1, attemptSpans: 1 },
      ).lean<ExistingDoc>();
    const existingDoc: ExistingDoc = await readExisting();
    const isNewSession = !existingDoc;
    const clientIp = isNewSession ? extractClientIp(req.headers) : undefined;
    if (clientIp) setOnInsertFields.clientIp = clientIp.slice(0, 100);

    // Demo gate (2026-08-29): stamp the gated email onto the session doc on
    // insert — read from the VERIFIED grant cookie, never from the body, so
    // a client can't attribute its session to someone else's address.
    if (isNewSession) {
      const grant = verifyDemoGrant(req.cookies.get(DEMO_GRANT_COOKIE)?.value, demoGateSecret());
      if (grant) setOnInsertFields.studentEmail = grant.email;
    }

    // Fields that should only be set on insert
    if (body.subject) setOnInsertFields.subject = body.subject;
    if (body.topic) setOnInsertFields.topic = body.topic;
    if (body.level) setOnInsertFields.level = body.level;
    if (body.sessionGoal) setOnInsertFields.sessionGoal = body.sessionGoal;
    if (body.inputMode) setOnInsertFields.inputMode = body.inputMode;
    if (body.startedAt) setOnInsertFields.startedAt = body.startedAt;
    if (body.source) setOnInsertFields.source = body.source;
    // Unauthenticated endpoint → clamp these free-text identity strings (they
    // render in the admin UI and feed distinct() filter chips).
    if (body.sourcePartnerId && typeof body.sourcePartnerId === 'string')
      setOnInsertFields.sourcePartnerId = body.sourcePartnerId.slice(0, 200);
    if (body.sourceHost && typeof body.sourceHost === 'string')
      setOnInsertFields.sourceHost = body.sourceHost.slice(0, 200);

    // Fields that can be updated on every upsert
    if (body.studentName !== undefined)
      updateFields.studentName = body.studentName;
    // A2: stable partner student id (unauthenticated endpoint → clamp).
    if (body.studentId && typeof body.studentId === 'string')
      updateFields.studentId = body.studentId.slice(0, 200);
    if (body.voiceEngine !== undefined)
      updateFields.voiceEngine = body.voiceEngine;
    if (body.endedAt !== undefined) updateFields.endedAt = body.endedAt;
    // `duration` = the session's cumulative ACTIVE seconds (2026-10-03).
    // Each page mount ("attempt") measures `body.duration` from its OWN
    // start, so $set-ing it verbatim made a resumed session store its last
    // sitting only (515 s for a 37-minute session) — and partners, the
    // replay tile and the admin list all read that. The client is trusted
    // for its own attempt's length and nothing more: the total is rebuilt
    // here from the recorded attemptSpans of the OTHER attempts plus this
    // one (planAttemptSave, pure, scripts/test-session-active-seconds.ts).
    // A single-attempt session — and the retail /tutor page, whose resume
    // keeps the original startedAt and so stays one span — stores exactly
    // what it stored before. A save with no usable startedAt keeps the old
    // verbatim behaviour. `duration` is NOT put in updateFields here: it is
    // written together with this mount's span, in the one guarded update
    // at the bottom (see "Single atomic write").
    const attemptStart = typeof body.startedAt === "string" ? new Date(body.startedAt) : null;
    const attemptStartValid = !!attemptStart && Number.isFinite(attemptStart.getTime());
    const attemptDuration =
      typeof body.duration === "number" && Number.isFinite(body.duration) && body.duration >= 0 ? body.duration : null;
    if (body.messageCount !== undefined)
      updateFields.messageCount = body.messageCount;
    if (body.whiteboardItemCount !== undefined)
      updateFields.whiteboardItemCount = body.whiteboardItemCount;
    if (body.totalInputTokens !== undefined)
      updateFields.totalInputTokens = body.totalInputTokens;
    if (body.totalOutputTokens !== undefined)
      updateFields.totalOutputTokens = body.totalOutputTokens;
    if (body.estimatedCost !== undefined)
      updateFields.estimatedCost = body.estimatedCost;
    if (body.status !== undefined) updateFields.status = body.status;
    if (Array.isArray(body.topicsCovered)) updateFields.topicsCovered = body.topicsCovered;
    if (Array.isArray(body.conceptsCovered)) updateFields.conceptsCovered = body.conceptsCovered;
    if (Array.isArray(body.weakTopics)) updateFields.weakTopics = body.weakTopics;

    // Lesson-phase position checkpoint (portal contract v1.2.0 — additive).
    // Persisted on each segment change so the portal's session-progress read
    // and conversation resume have a durable position even on abrupt close.
    if (
      body.lessonProgress &&
      typeof body.lessonProgress === "object" &&
      typeof body.lessonProgress.lessonPlanId === "string"
    ) {
      const lp = body.lessonProgress as {
        lessonPlanId: string;
        currentSegmentId?: string;
        completedSegmentIds?: unknown;
      };
      updateFields.lessonProgress = {
        lessonPlanId: lp.lessonPlanId,
        currentSegmentId: typeof lp.currentSegmentId === "string" ? lp.currentSegmentId : "",
        completedSegmentIds: Array.isArray(lp.completedSegmentIds)
          ? lp.completedSegmentIds.filter((s): s is string => typeof s === "string")
          : [],
        updatedAt: new Date(),
      };
    }

    // Append new token usage entries if provided
    const pushOps: Record<string, unknown> = {};
    if (body.tokenUsage && Array.isArray(body.tokenUsage)) {
      pushOps.tokenUsage = { $each: body.tokenUsage };
    }

    // Append debug events if provided
    if (body.debugEvents && Array.isArray(body.debugEvents)) {
      pushOps.debugEvents = {
        $each: body.debugEvents.map(
          (e: { type: string; message: string; timestamp?: string; data?: Record<string, unknown> }) => ({
            type: e.type,
            // `message` is required by the schema — an empty string fails
            // validation and 400s the WHOLE save (checkpoint + transcript
            // included). Fall back to the event type (or a placeholder) so one
            // empty-message debug event can never sink the save.
            message:
              (typeof e.message === 'string' && e.message.trim() ? e.message.slice(0, 500) : '') ||
              (typeof e.type === 'string' && e.type) ||
              'event',
            timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
            ...(e.data ? { data: e.data } : {}),
          })
        ),
      };
    }

    // Persist transcript + whiteboard on EVERY save that includes them.
    // Was previously gated on completed/abandoned, but that meant
    // sessions ending abnormally (mobile swipe-away, network drop, OS
    // kill before beforeunload fires) lost everything — observed
    // 2026-04-29 physical-science: 2 student msgs visible to the user
    // but no DB record. Periodic active flushes from the client now
    // include the transcript so the DB stays current within ~30s.
    if (Array.isArray(body.transcript)) {
      updateFields.transcript = body.transcript.map(
        (t: { role: string; text: string; timestamp: string; whiteboardCommands?: unknown[]; pedagogicalIntent?: string }) => ({
          role: t.role,
          text: typeof t.text === "string" ? t.text.slice(0, 5000) : "",
          timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
          ...(t.whiteboardCommands?.length ? { whiteboardCommands: t.whiteboardCommands } : {}),
          ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
        })
      );
    }

    if (Array.isArray(body.whiteboardCommands)) {
      updateFields.whiteboardCommands = body.whiteboardCommands.map(
        (cmd: { action: string; data?: Record<string, unknown>; timestamp?: string; sourceMessageIndex?: number }) => ({
          action: cmd.action,
          data: cmd.data || {},
          timestamp: cmd.timestamp ? new Date(cmd.timestamp) : new Date(),
          sourceMessageIndex: cmd.sourceMessageIndex,
        })
      );
    }

    // Cross-sitting reuse DETECTION (portal-85b2c632). The partner mints embed
    // tokens that reuse a session_id across days, so a new session's transcript
    // gets appended onto a document created days earlier — three days of three
    // sessions in one row. The loud log below is the artifact: it is what gets
    // the partner's token-minting fixed, and it costs the student nothing.
    //
    // LOG ONLY — never refuse. This branch previously returned 409, and every
    // client caller ends `.catch(() => {})`, so the refusal was silent. But
    // conversation resume is a first-class feature with a THIRTY-DAY window
    // (RESUME_MAX_AGE_MS in @evelyn/portal-contract/v1, enforced in
    // lib/tutor/portal/resume.ts) and it writes back to the SAME sessionId. A
    // document spanning several days is therefore exactly what a WORKING
    // resume produces, not proof of corruption — and refusing it silently
    // destroyed the whole sitting: transcript, whiteboard, cost, and the
    // lessonProgress checkpoint, so the student's next resume dropped them
    // back to the previous position and they redid work they had finished.
    // Losing a student's session is far worse than a partner's row being
    // muddled, so the write falls through to the normal upsert below.
    // Reuses existingDoc from the isNewSession lookup above — one indexed
    // point query on { sessionId } serving both checks.
    const existingCreatedAt = existingDoc?.createdAt;
    if (isStaleSessionReuse({ existingCreatedAt, now: new Date() })) {
      console.error(
        `[session-usage] stale session-id reuse (writing anyway): ${sessionId} was created ` +
        `${existingCreatedAt?.toISOString()} — partner may be minting a token reusing it, ` +
        `or this is a legitimate multi-day resume. ` +
        `partner=${body.sourcePartnerId ?? 'unknown'}`,
      );
    }

    // Single atomic write (2026-10-04). The session fields, this mount's
    // attempt span (plus the seed span of a pre-spans session) and the
    // cumulative `duration` go out in ONE findOneAndUpdate. They used to be
    // two writes — `$set duration`, then a best-effort span push — and a
    // pre-spans session whose push failed (or raced a concurrent save) kept a
    // cumulative `duration` with no spans, which the next save took for an
    // earlier sitting and added to again, every 30 s.
    //
    // The span part carries a filter guard (buildAttemptSpanWrite): it only
    // matches while the document still has the spans the plan was computed
    // from. A miss means another save got in between — re-read, re-plan,
    // retry. A miss shows up as `null` for an existing document (no upsert)
    // or as a duplicate-key error on the unique sessionId for a brand-new one
    // (two first saves racing the insert).
    //
    // Per-attempt span (additive, 2026-10-03): one entry per page mount, keyed
    // by the mount's start, holding that mount's own duration. `duration` is
    // the wall time covered by at least one of them; replay and tooling read
    // the spans for the wall span and the attempt boundaries
    // (lib/tutor/recordings/session-span.ts).
    const spanEnd = body.endedAt ? new Date(body.endedAt) : null;
    const spanEndMs = spanEnd && Number.isFinite(spanEnd.getTime()) ? spanEnd.getTime() : null;
    const MAX_GUARDED_TRIES = 3;
    let attemptPlan: AttemptSavePlan | null = null;
    let session: { sessionId: string; startedAt?: Date; duration?: number; attemptSpans?: unknown } | null = null;
    let spanWritten = false;
    for (let tryNo = 0; !session; tryNo++) {
      // After MAX_GUARDED_TRIES misses, save everything EXCEPT the span and
      // `duration` (unguarded upsert, cannot miss): the transcript and the
      // checkpoint must never be lost to contention, and a `duration` is
      // never written without the span that explains it. The next periodic
      // save (~30 s) records both.
      const lastResort = tryNo >= MAX_GUARDED_TRIES;
      const current: ExistingDoc = tryNo === 0 ? existingDoc : await readExisting();
      attemptPlan = attemptStartValid && attemptStart
        ? planAttemptSave({ existing: current, attemptStartMs: attemptStart.getTime(), attemptDurationSec: attemptDuration })
        : null;
      const spanWrite = attemptPlan && attemptStart && !lastResort
        ? buildAttemptSpanWrite({ plan: attemptPlan, attemptStartMs: attemptStart.getTime(), endedAtMs: spanEndMs, docExists: !!current })
        : null;

      const setFields: Record<string, unknown> = { ...updateFields, ...(spanWrite?.set ?? {}) };
      // No span write (no usable startedAt, or a non-numeric duration): the
      // old verbatim behaviour.
      if (!spanWrite && !lastResort && body.duration !== undefined) setFields.duration = body.duration;
      const pushFields: Record<string, unknown> = { ...pushOps, ...(spanWrite?.push ?? {}) };
      const op: Record<string, unknown> = {};
      if (Object.keys(setFields).length > 0) op.$set = setFields;
      if (Object.keys(setOnInsertFields).length > 0) op.$setOnInsert = setOnInsertFields;
      if (Object.keys(pushFields).length > 0) op.$push = pushFields;
      if (spanWrite) op.$max = spanWrite.max;

      try {
        session = await TutorSession.findOneAndUpdate(
          { sessionId, ...(spanWrite?.filter ?? {}) },
          op,
          { upsert: spanWrite ? spanWrite.upsert : true, new: true, runValidators: true },
        );
        spanWritten = !!session && !!spanWrite;
      } catch (err) {
        const duplicateKey = (err as { code?: unknown } | null)?.code === 11000;
        if (!duplicateKey || lastResort) throw err;
      }
      if (lastResort) {
        console.error(`[session-usage] attempt span write did not land after ${MAX_GUARDED_TRIES} tries (saved without duration/span): ${sessionId}`);
        attemptPlan = null; // nothing cumulative was stored — answer no figures
        break;
      }
    }

    // Reconcile `duration` with the spans as they stand AFTER this write
    // (durationBehindSpans has the why): a save on an already-recorded span
    // is not guarded on the other mounts' spans, so two mounts saving at the
    // same moment each stored a total built on the other's previous figure
    // (180 stored, spans 130 + 70 — measured against a real MongoDB). The
    // spans are in the document already, so this second write cannot create
    // a `duration` its spans do not explain; `$max`, so it never lowers.
    // Best-effort: the save has landed, and the next one repairs it too.
    if (spanWritten && session && attemptPlan && attemptStart) {
      const behind = durationBehindSpans(session);
      if (behind != null) {
        try {
          await TutorSession.updateOne({ sessionId }, { $max: { duration: behind } });
        } catch (err) {
          console.error("[session-usage] duration reconcile failed:", err);
        }
      }
      // Answer from the document as written, not from the pre-write read:
      // the figures then include whatever another mount saved in between.
      attemptPlan = planAttemptSave({ existing: session, attemptStartMs: attemptStart.getTime(), attemptDurationSec: attemptDuration });
    }

    // Fire-and-forget geolocation — a down ip-api can never sink the save.
    if (clientIp) {
      void lookupGeo(clientIp)
        .then((loc) => {
          if (loc) return TutorSession.updateOne({ sessionId }, { $set: { location: loc } });
        })
        .catch((err) => console.error("Geo lookup failed:", err));
    }

    // Additive response fields (2026-10-03), server-computed:
    //   priorActiveSeconds — active seconds the saving mount does not itself
    //     cover (union of all attempts minus this mount's own duration); the
    //     embed adds its own running duration to this for evelyn:session_ended.
    //   activeSeconds — the cumulative `duration` just stored (present only
    //     when this save carried a duration).
    return NextResponse.json({
      success: true,
      sessionId: session?.sessionId ?? sessionId,
      ...(attemptPlan
        ? {
            priorActiveSeconds: attemptPlan.priorActiveSec,
            ...(attemptPlan.activeSec != null ? { activeSeconds: attemptPlan.activeSec } : {}),
          }
        : {}),
    });
  } catch (error) {
    console.error("Session usage error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Mongoose validation error
    if (
      error instanceof Error &&
      error.name === "ValidationError"
    ) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
