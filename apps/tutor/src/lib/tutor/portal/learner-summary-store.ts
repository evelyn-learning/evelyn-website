/**
 * Learner summary store (GDI learner home, task 2): the summary lives on the
 * TutorSession, written once through an atomic claim; `runSummaryForSession`
 * orchestrates load -> claim -> facts -> generate -> store with injected deps.
 */
import connectDB from '@core/db';
import { TutorSession, type ITutorSession } from '@/models/TutorSession';
import {
  buildSessionFacts, generateLearnerSummary,
  type LearnerSummaryV1, type SessionFactsInput,
} from './learner-summary';
import { callGraderJson, type GraderModelClient, type ReplySchema } from './grade-free-response';

export type SummaryState = { status: 'none' | 'pending' | 'ready' | 'failed'; summary?: LearnerSummaryV1; error?: string; version?: number };

export type LearnerSessionRow = {
  sessionId: string; startedAt: string; endedAt?: string; durationSec: number; status: string; turnCount: number;
  hasAudio: boolean; subject?: string; topic?: string; level?: string; studentName?: string;
  summary: SummaryState; transcript: unknown[]; whiteboardCommands: unknown[]; sessionGoal?: string;
};

type Stored = ITutorSession['learnerSummary'];
export type ClaimDecision = 'claimed' | 'busy' | 'ready';

export const PENDING_STALE_MS = 120_000;
export const RESUME_TURNS = 3;

export interface SummaryStoreDeps {
  loadSession(sessionId: string): Promise<(SessionFactsInput & { sessionId: string; studentId?: string; sourcePartnerId?: string; hasAudio?: boolean; learnerSummary?: Stored }) | null>;
  claim(sessionId: string, turnCount: number, now: Date): Promise<ClaimDecision>;
  store(sessionId: string, result: { ok: true; summary: LearnerSummaryV1 } | { ok: false; error: string }, now: Date): Promise<void>;
  profileLevel(partnerId: string, studentId: string): Promise<{ level: 'beginner' | 'intermediate' | 'advanced'; setAt: number } | null>;
  callJson(system: string, user: string, schema: ReplySchema): Promise<Record<string, unknown>>;
  model: string;
  now(): Date;
}

/** The claim rule, pure. `prev` is the stored learnerSummary (or absent). */
export function claimDecision(prev: Stored | undefined | null, turnCount: number, now: Date): ClaimDecision {
  if (!prev) return 'claimed';
  if (prev.status === 'failed') return 'claimed';
  if (prev.status === 'pending') {
    return now.getTime() - new Date(prev.updatedAt).getTime() > PENDING_STALE_MS ? 'claimed' : 'busy';
  }
  return prev.turnCount + RESUME_TURNS <= turnCount ? 'claimed' : 'ready';
}

/** Version written by a claim: 1 first, +1 only when re-claiming a ready summary. */
export function claimVersion(prev: Stored | undefined | null): number {
  return (prev?.version ?? 0) + (prev?.status === 'ready' ? 1 : 0) || 1;
}

export function summaryStateOf(s: Stored | undefined | null): SummaryState {
  if (!s) return { status: 'none' };
  const out: SummaryState = { status: s.status, version: s.version };
  if (s.summary) out.summary = s.summary;
  if (s.error) out.error = s.error;
  return out;
}

export async function runSummaryForSession(sessionId: string, deps: SummaryStoreDeps = activeDeps()): Promise<SummaryState> {
  const session = await deps.loadSession(sessionId);
  if (!session) return { status: 'none' };
  const turnCount = session.transcript.length;
  const decision = await deps.claim(sessionId, turnCount, deps.now());
  if (decision !== 'claimed') return summaryStateOf(session.learnerSummary);

  let level: Awaited<ReturnType<SummaryStoreDeps['profileLevel']>> = null;
  try {
    if (session.sourcePartnerId && session.studentId) level = await deps.profileLevel(session.sourcePartnerId, session.studentId);
  } catch { level = null; }

  const facts = buildSessionFacts(session, level);
  const result = await generateLearnerSummary(facts, { callJson: deps.callJson, model: deps.model, turnCount, now: deps.now() });
  await deps.store(sessionId, result, deps.now());
  const fresh = await deps.loadSession(sessionId);
  return summaryStateOf(fresh?.learnerSummary);
}

export function mongoSummaryStoreDeps(): SummaryStoreDeps {
  return {
    async loadSession(sessionId) {
      await connectDB();
      const doc = await TutorSession.findOne({ sessionId }).lean();
      return (doc as unknown as Awaited<ReturnType<SummaryStoreDeps['loadSession']>>) ?? null;
    },
    async claim(sessionId, turnCount, now) {
      await connectDB();
      const stale = new Date(now.getTime() - PENDING_STALE_MS);
      const filter = {
        sessionId,
        $or: [
          { learnerSummary: { $exists: false } },
          { learnerSummary: null },
          { 'learnerSummary.status': 'failed' },
          { 'learnerSummary.status': 'pending', 'learnerSummary.updatedAt': { $lt: stale } },
          { 'learnerSummary.status': 'ready', 'learnerSummary.turnCount': { $lte: turnCount - RESUME_TURNS } },
        ],
      };
      // Version: 1 first, +1 only from a ready summary (pipeline update keeps it atomic).
      const update = [{
        $set: {
          learnerSummary: {
            status: 'pending', turnCount, updatedAt: now,
            version: {
              $add: [
                { $ifNull: ['$learnerSummary.version', 0] },
                { $cond: [{ $eq: ['$learnerSummary.status', 'ready'] }, 1, 0] },
                { $cond: [{ $ifNull: ['$learnerSummary.version', false] }, 0, 1] },
              ],
            },
          },
        },
      }];
      const won = await TutorSession.findOneAndUpdate(filter, update, { new: false, timestamps: false }).select('_id').lean();
      if (won) return 'claimed';
      const cur = await TutorSession.findOne({ sessionId }).select('learnerSummary').lean() as { learnerSummary?: Stored } | null;
      return claimDecision(cur?.learnerSummary, turnCount, now) === 'ready' ? 'ready' : 'busy';
    },
    async store(sessionId, result, now) {
      await connectDB();
      const set = result.ok
        ? { 'learnerSummary.status': 'ready', 'learnerSummary.summary': result.summary, 'learnerSummary.updatedAt': now }
        : { 'learnerSummary.status': 'failed', 'learnerSummary.error': result.error, 'learnerSummary.updatedAt': now };
      const unset = result.ok ? { 'learnerSummary.error': '' } : {};
      await TutorSession.updateOne({ sessionId }, { $set: set, ...(result.ok ? { $unset: unset } : {}) }, { timestamps: false });
    },
    async profileLevel(partnerId, studentId) {
      try {
        const { resolveProfileId, getStudentProfile } = await import('../student-profile/store');
        const id = await resolveProfileId({ partnerId, externalStudentId: studentId });
        const wl = (await getStudentProfile(id))?.workingLevel;
        return wl ? { level: wl.level, setAt: wl.setAt } : null;
      } catch { return null; }
    },
    async callJson(system, user, schema) {
      const { getModelClient, prepareParams } = await import('../ai/model-registry');
      const { client, model } = getModelClient('judge');
      return callGraderJson(client as unknown as GraderModelClient, model, system, user, schema, {
        prepare: (params) => prepareParams('judge', params),
      });
    },
    model: 'judge',
    now: () => new Date(),
  };
}

let testDeps: SummaryStoreDeps | null = null;
export function __setLearnerSummaryDepsForTests(deps: SummaryStoreDeps | null): void { testDeps = deps; }
function activeDeps(): SummaryStoreDeps { return testDeps ?? mongoSummaryStoreDeps(); }

export async function listLearnerSessions(partnerId: string, studentId: string, limit = 20): Promise<LearnerSessionRow[]> {
  await connectDB();
  const docs = await TutorSession.find({ sourcePartnerId: partnerId, studentId, 'transcript.3': { $exists: true } })
    .sort({ startedAt: -1 }).limit(limit).lean();
  return (docs as unknown as Array<Record<string, any>>).map((d) => {
    const summary = summaryStateOf(d.learnerSummary);
    return {
      sessionId: d.sessionId,
      startedAt: new Date(d.startedAt).toISOString(),
      endedAt: d.endedAt ? new Date(d.endedAt).toISOString() : undefined,
      durationSec: d.duration ?? 0,
      status: d.status,
      turnCount: d.transcript.length,
      hasAudio: !!d.hasAudio,
      subject: d.subject, topic: d.topic,
      level: summary.summary?.level.value ?? undefined,
      studentName: d.studentName,
      summary,
      transcript: d.transcript,
      whiteboardCommands: d.whiteboardCommands ?? [],
      sessionGoal: d.sessionGoal,
    };
  });
}
