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
import { checkEmbedAuth } from "@/lib/tutor/portal/embed-token";

/**
 * GET /api/tutor/session-usage?sessionId= — read prior session state for the
 * embed's resume boot (contract v1.2.0, E3). Returns just what rehydration
 * needs: the lesson-position checkpoint + transcript + whiteboard. Keyed on the
 * opaque sessionId. The embed enforces RESUME_MAX_AGE_MS on the checkpoint's
 * updatedAt itself.
 *
 * Auth (learner-model Phase C, Task 3): a valid embed token (any partner) is
 * required in `on` mode — no expectedStudentId, since this read is keyed by
 * opaque sessionId rather than per-student; the token just proves a
 * legitimate embed context. Checked BEFORE the sessionId-missing 400 and
 * before connectDB(), so a denied request never touches Mongo.
 */
export async function GET(req: NextRequest) {
  const auth = checkEmbedAuth({
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
      const auth = checkEmbedAuth({
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
    // the insert that creates the session document.
    const isNewSession = !(await TutorSession.exists({ sessionId }));
    const clientIp = isNewSession ? extractClientIp(req.headers) : undefined;
    if (clientIp) setOnInsertFields.clientIp = clientIp.slice(0, 100);

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
    if (body.duration !== undefined) updateFields.duration = body.duration;
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

    // Build the update operation
    const updateOp: Record<string, unknown> = {};
    if (Object.keys(updateFields).length > 0) {
      updateOp.$set = updateFields;
    }
    if (Object.keys(setOnInsertFields).length > 0) {
      updateOp.$setOnInsert = setOnInsertFields;
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

    if (Object.keys(pushOps).length > 0) {
      updateOp.$push = pushOps;
    }

    const session = await TutorSession.findOneAndUpdate(
      { sessionId },
      updateOp,
      { upsert: true, new: true, runValidators: true }
    );

    // Fire-and-forget geolocation — a down ip-api can never sink the save.
    if (clientIp) {
      void lookupGeo(clientIp)
        .then((loc) => {
          if (loc) return TutorSession.updateOne({ sessionId }, { $set: { location: loc } });
        })
        .catch((err) => console.error("Geo lookup failed:", err));
    }

    return NextResponse.json({ success: true, sessionId: session.sessionId });
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
