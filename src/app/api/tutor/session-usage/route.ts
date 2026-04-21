/**
 * Tutor Session Usage API Route
 *
 * Upserts session usage data for tracking tutor sessions.
 * Used internally by the tutor client to send periodic and final updates.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TutorSession } from "@/models/TutorSession";

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

    // Fields that should only be set on insert
    if (body.subject) setOnInsertFields.subject = body.subject;
    if (body.topic) setOnInsertFields.topic = body.topic;
    if (body.level) setOnInsertFields.level = body.level;
    if (body.sessionGoal) setOnInsertFields.sessionGoal = body.sessionGoal;
    if (body.inputMode) setOnInsertFields.inputMode = body.inputMode;
    if (body.startedAt) setOnInsertFields.startedAt = body.startedAt;
    if (body.source) setOnInsertFields.source = body.source;

    // Fields that can be updated on every upsert
    if (body.studentName !== undefined)
      updateFields.studentName = body.studentName;
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
            message: typeof e.message === 'string' ? e.message.slice(0, 500) : '',
            timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
            ...(e.data ? { data: e.data } : {}),
          })
        ),
      };
    }

    // On final save (completed/abandoned), store transcript + whiteboard data
    if (
      (body.status === "completed" || body.status === "abandoned") &&
      Array.isArray(body.transcript)
    ) {
      // Replace transcript entirely (not append) — use $set
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

    if (
      (body.status === "completed" || body.status === "abandoned") &&
      Array.isArray(body.whiteboardCommands)
    ) {
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
