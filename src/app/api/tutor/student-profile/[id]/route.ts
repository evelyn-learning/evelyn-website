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
  appendSessionMemory,
} from '@/lib/tutor/student-profile/store';
import type { GapSignalCode } from '@/lib/tutor/student-profile/types';
import { renderStudentProfileBlock } from '@/lib/tutor/student-profile/render';
import { generateSessionSummary, type SessionSummaryInput } from '@/lib/tutor/student-profile/session-summary';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const profile = await getOrCreateStudentProfile(id);
  return NextResponse.json({
    profile,
    block: renderStudentProfileBlock(profile),
  });
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
  }>;
  /** Full transcript for the summary generator. */
  transcript?: Array<{ role: 'student' | 'tutor'; text: string }>;
  /** When false, skip summary generation (faster commit). Defaults to true.
   *  Field name kept for backwards compatibility with older clients. */
  generateNotes?: boolean;
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let body: CommitBody;
  try {
    body = (await req.json()) as CommitBody;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  let profile = await getOrCreateStudentProfile(id);

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
      summary = await generateSessionSummary(summaryInput);
    } catch (err) {
      summaryError = (err as Error).message;
      console.error('[student-profile] summary generation failed:', err);
    }
  }

  profile = appendSessionMemory(profile, {
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
  });
  if (body.grade) profile.grade = body.grade;

  const saved = await saveStudentProfile(profile);

  return NextResponse.json({
    profile: saved,
    summary,
    summaryError,
  });
}
