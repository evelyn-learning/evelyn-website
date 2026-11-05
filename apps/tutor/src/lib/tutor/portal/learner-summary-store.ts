/**
 * Learner summary store (GDI learner home, task 2): the summary lives on the
 * TutorSession, written once through an atomic claim; `runSummaryForSession`
 * orchestrates load -> claim -> facts -> generate -> store with injected deps.
 */
import connectDB from '@core/db';
import { TutorSession, type ITutorSession } from '@/models/TutorSession';
import {
  buildSessionFacts, generateLearnerSummary, isLearnerSummarySubject,
  type LearnerSummaryV1, type SessionFactsInput,
} from './learner-summary';
import { resolveModel } from '../ai/model-registry';
import { parseTutorLanguages } from '../voice/tts-language';
import { callGraderJson, type GraderModelClient, type ReplySchema } from './grade-free-response';

export type SummaryState = { status: 'none' | 'pending' | 'ready' | 'failed'; summary?: LearnerSummaryV1; error?: string; version?: number };
/** Why a session gets no summary at all (no claim, no model call). */
export type SummaryRefusal = 'disabled' | 'unsupported' | 'too_short';
export type SummaryRunResult = SummaryState | { status: SummaryRefusal };

/** Minimum transcript turns for a summary (the learner home's listing rule). */
export const MIN_SUMMARY_TURNS = 4;

/** Kill switch, read at call time: TUTOR_LEARNER_SUMMARY=off stops every entry point (default ON). */
export function learnerSummaryEnabled(): boolean {
  return process.env.TUTOR_LEARNER_SUMMARY !== 'off';
}

/**
 * The refusal for a loaded session, or null when it may be summarised.
 * Order: kill switch, then subject (language lessons only), then length.
 */
export function summaryRefusal(session: { subject?: string; transcript?: unknown[] } | null | undefined): SummaryRefusal | null {
  if (!learnerSummaryEnabled()) return 'disabled';
  if (!session) return null;
  if (!isLearnerSummarySubject(session.subject)) return 'unsupported';
  if ((session.transcript?.length ?? 0) < MIN_SUMMARY_TURNS) return 'too_short';
  return null;
}

export function isSummaryRefusal(r: SummaryRunResult): r is { status: SummaryRefusal } {
  return r.status === 'disabled' || r.status === 'unsupported' || r.status === 'too_short';
}

export type LearnerSessionRow = {
  sessionId: string; startedAt: string; endedAt?: string; durationSec: number; status: string; turnCount: number;
  hasAudio: boolean; subject?: string; topic?: string; level?: string; studentName?: string; updatedAt?: string;
  summary: SummaryState; transcript: unknown[]; whiteboardCommands: unknown[]; sessionGoal?: string;
};

type Stored = ITutorSession['learnerSummary'];
export type ClaimDecision = 'claimed' | 'busy' | 'ready';

export const PENDING_STALE_MS = 120_000;
/** A failed summary is not re-claimed until it is this old (Retry cooldown). */
export const FAILED_RETRY_COOLDOWN_MS = 60_000;
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
  if (prev.status === 'failed') {
    return now.getTime() - new Date(prev.updatedAt).getTime() >= FAILED_RETRY_COOLDOWN_MS ? 'claimed' : 'busy';
  }
  if (prev.status === 'pending') {
    return now.getTime() - new Date(prev.updatedAt).getTime() > PENDING_STALE_MS ? 'claimed' : 'busy';
  }
  return prev.turnCount + RESUME_TURNS <= turnCount ? 'claimed' : 'ready';
}

/** Version written by a claim: 1 first, +1 only when re-claiming a ready summary. */
export function claimVersion(prev: Stored | undefined | null): number {
  return (prev?.version ?? 0) + (prev?.status === 'ready' ? 1 : 0) || 1;
}

/**
 * The claim's pipeline update: replaces the sub-document but carries the
 * previous `summary` over (shown while regenerating, and kept readable if the
 * regeneration fails). `error` is dropped. A missing summary stays missing.
 */
export function claimUpdatePipeline(turnCount: number, now: Date) {
  // One $mergeObjects expression, not a nested object literal: a pipeline
  // $set with an object literal MERGES into an existing embedded document
  // (it would keep the old `error`); an expression result replaces it.
  return [{
    $set: {
      learnerSummary: {
        $mergeObjects: [{
          status: 'pending', turnCount, updatedAt: now,
          summary: '$learnerSummary.summary',
          // claimVersion in aggregation form: 1 first, +1 only from a ready summary.
          version: {
            $add: [
              { $ifNull: ['$learnerSummary.version', 0] },
              { $cond: [{ $eq: ['$learnerSummary.status', 'ready'] }, 1, 0] },
              { $cond: [{ $gt: [{ $ifNull: ['$learnerSummary.version', 0] }, 0] }, 0, 1] },
            ],
          },
        }],
      },
    },
  }];
}

export function summaryStateOf(s: Stored | undefined | null): SummaryState {
  if (!s) return { status: 'none' };
  const out: SummaryState = { status: s.status, version: s.version };
  if (s.summary) out.summary = s.summary;
  if (s.error) out.error = s.error;
  return out;
}

/** The verified token's `tutor_languages` claim (array or comma string) as a fallback list, or undefined. */
export function tokenTutorLanguages(claim: unknown): string[] | undefined {
  const parsed = parseTutorLanguages(claim);
  return parsed ? [...parsed] : undefined;
}

export type RunSummaryOptions = {
  /** For rows saved before `tutorLanguages` was stored: the token's languages (route + home pass them; the save hook does not). */
  fallbackTutorLanguages?: string[];
};

export async function runSummaryForSession(
  sessionId: string,
  deps: SummaryStoreDeps = activeDeps(),
  opts: RunSummaryOptions = {},
): Promise<SummaryRunResult> {
  if (!learnerSummaryEnabled()) return { status: 'disabled' };
  const session = await deps.loadSession(sessionId);
  if (!session) return { status: 'none' };
  const refusal = summaryRefusal(session);
  if (refusal) return { status: refusal };
  const turnCount = session.transcript.length;
  const decision = await deps.claim(sessionId, turnCount, deps.now());
  if (decision !== 'claimed') return summaryStateOf(session.learnerSummary);

  let level: Awaited<ReturnType<SummaryStoreDeps['profileLevel']>> = null;
  try {
    if (session.sourcePartnerId && session.studentId) level = await deps.profileLevel(session.sourcePartnerId, session.studentId);
  } catch { level = null; }

  // Support language = session.tutorLanguages[1] ?? fallback[1].
  const tutorLanguages = session.tutorLanguages?.[1] ? session.tutorLanguages : opts.fallbackTutorLanguages ?? session.tutorLanguages;
  const facts = buildSessionFacts({ ...session, tutorLanguages }, level);
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
          { 'learnerSummary.status': 'failed', 'learnerSummary.updatedAt': { $lte: new Date(now.getTime() - FAILED_RETRY_COOLDOWN_MS) } },
          { 'learnerSummary.status': 'pending', 'learnerSummary.updatedAt': { $lt: stale } },
          { 'learnerSummary.status': 'ready', 'learnerSummary.turnCount': { $lte: turnCount - RESUME_TURNS } },
        ],
      };
      const update = claimUpdatePipeline(turnCount, now);
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
        prepare: (params) => prepareParams('judge', { ...params, temperature: 0.2, max_tokens: 1200 }),
      });
    },
    model: resolveModel('judge').model,
    now: () => new Date(),
  };
}

let testDeps: SummaryStoreDeps | null = null;
export function __setLearnerSummaryDepsForTests(deps: SummaryStoreDeps | null): void { testDeps = deps; }
/** The deps in force: the test seam when set, else Mongo. */
export function activeSummaryStoreDeps(): SummaryStoreDeps { return testDeps ?? mongoSummaryStoreDeps(); }
const activeDeps = activeSummaryStoreDeps;

export async function listLearnerSessions(partnerId: string, studentId: string, limit = 20): Promise<LearnerSessionRow[]> {
  await connectDB();
  const docs = await TutorSession.find({ sourcePartnerId: partnerId, studentId, 'transcript.3': { $exists: true } })
    .select('-debugEvents -tokenUsage -attemptSpans -poolCharges').sort({ startedAt: -1 }).limit(limit).lean();
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
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
      studentName: d.studentName,
      summary,
      transcript: d.transcript,
      whiteboardCommands: d.whiteboardCommands ?? [],
      sessionGoal: d.sessionGoal,
    };
  });
}
