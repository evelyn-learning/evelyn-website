/**
 * What the dashboard shows of a partner's own data: its minute pool, its sessions and its usage by day.
 * Every read is scoped by the signed-in account's partner id (`sourcePartnerId`), never by anything the
 * browser sends. Server only.
 */
import connectDB from '@core/db';
import { TutorSession } from '@/models/TutorSession';
import { readPoolSnapshot } from '@/lib/tutor/portal/partner-pool-store';
import { replayUrl, signReplayToken } from '@/lib/tutor/portal/replay-token';
import { sessionActiveSeconds } from '@/lib/tutor/recordings/active-seconds';
import { usageByDay, type DayUsage } from './core';

export interface PoolSummary { pooled: boolean; capMinutes: number; usedMinutes: number; remainingMinutes: number; sessionMaxMinutes: number; exhausted: boolean }

const tenth = (sec: number) => Math.round(sec / 6) / 10;

export async function poolSummary(partnerId: string): Promise<PoolSummary> {
  const snap = await readPoolSnapshot(partnerId);
  if (!snap.pooled) return { pooled: false, capMinutes: 0, usedMinutes: 0, remainingMinutes: 0, sessionMaxMinutes: 0, exhausted: false };
  return { pooled: true, capMinutes: tenth(snap.capSec), usedMinutes: tenth(snap.usedSec), remainingMinutes: tenth(snap.remainingSec), sessionMaxMinutes: tenth(snap.sessionMaxSec), exhausted: snap.exhausted };
}

export interface SessionListRow {
  sessionId: string; studentId: string; startedAt: string; minutes: number; status: string;
  languages: string[]; subject: string; topic: string; inputMode: string; messages: number; test: boolean;
}

type Doc = {
  sessionId: string; studentId?: string; startedAt?: Date; duration?: number; attemptSpans?: unknown; status?: string;
  tutorLanguages?: string[]; subject?: string; topic?: string; inputMode?: string; messageCount?: number;
};

const FIELDS = { sessionId: 1, studentId: 1, startedAt: 1, duration: 1, attemptSpans: 1, status: 1, tutorLanguages: 1, subject: 1, topic: 1, inputMode: 1, messageCount: 1 } as const;

function row(d: Doc): SessionListRow {
  return {
    sessionId: d.sessionId, studentId: d.studentId || '', startedAt: (d.startedAt ?? new Date(0)).toISOString(),
    minutes: tenth(sessionActiveSeconds(d) ?? 0), status: d.status || 'active',
    languages: Array.isArray(d.tutorLanguages) && d.tutorLanguages.length ? d.tutorLanguages : ['en'],
    subject: d.subject || '', topic: d.topic || '', inputMode: d.inputMode || 'voice', messages: d.messageCount ?? 0,
    test: d.studentId === 'dashboard-test',
  };
}

export const SESSIONS_PAGE_SIZE = 25;

export async function listSessions(partnerId: string, page: number): Promise<{ rows: SessionListRow[]; total: number; page: number; pages: number }> {
  await connectDB();
  const p = Math.max(1, Math.min(400, Math.floor(page) || 1));
  const filter = { sourcePartnerId: partnerId };
  const [docs, total] = await Promise.all([
    TutorSession.find(filter, FIELDS).sort({ startedAt: -1 }).skip((p - 1) * SESSIONS_PAGE_SIZE).limit(SESSIONS_PAGE_SIZE).lean<Doc[]>(),
    TutorSession.countDocuments(filter),
  ]);
  return { rows: docs.map(row), total, page: p, pages: Math.max(1, Math.ceil(total / SESSIONS_PAGE_SIZE)) };
}

export async function usageSummary(partnerId: string, nowMs: number = Date.now()): Promise<{ days: DayUsage[]; sessionsTotal: number; sessions7d: number; minutes7d: number }> {
  await connectDB();
  const since = new Date(nowMs - 30 * 86_400_000);
  const [docs, sessionsTotal] = await Promise.all([
    TutorSession.find({ sourcePartnerId: partnerId, startedAt: { $gte: since } }, { startedAt: 1, duration: 1, attemptSpans: 1 }).lean<Doc[]>(),
    TutorSession.countDocuments({ sourcePartnerId: partnerId }),
  ]);
  const days = usageByDay(docs.map((d) => ({ startedAt: d.startedAt ?? new Date(0), seconds: sessionActiveSeconds(d) ?? 0 })), nowMs, 30);
  const last7 = days.slice(-7);
  return { days, sessionsTotal, sessions7d: last7.reduce((n, d) => n + d.sessions, 0), minutes7d: Math.round(last7.reduce((n, d) => n + d.minutes, 0) * 10) / 10 };
}

/** A one-hour link to the replay of one of the partner's own sessions (transcript, board, PDF). Null when the
 *  session is not this partner's, or has no student id to sign for. */
export async function sessionReplayLink(partnerId: string, sessionId: string, origin: string): Promise<string | null> {
  await connectDB();
  const d = await TutorSession.findOne({ sessionId, sourcePartnerId: partnerId }, { studentId: 1 }).lean<{ studentId?: string } | null>();
  if (!d?.studentId) return null;
  const token = await signReplayToken({ partner_id: partnerId, student_id: d.studentId, session_id: sessionId, ttlSec: 3600 });
  return token ? replayUrl(token, origin) : null;
}
