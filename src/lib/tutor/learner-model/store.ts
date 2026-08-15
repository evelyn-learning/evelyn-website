/**
 * Learner-model write path — idempotent evidence append, per-(student, LO)
 * projection recompute, and silent Elo rating updates.
 *
 * `appendEvidence` is the only entry point other subsystems should call
 * (session-end capture, quiz/mock grading, practice grading — Task 8's
 * server append points). It is deliberately best-effort: evidence logging
 * must never take down the caller's request. Contrast with
 * `src/lib/tutor/student-profile/store.ts`, which falls back to an
 * in-memory `ephemeralStore` on DB failure — we do NOT do that here. If the
 * DB write fails, the evidence is lost for that call and logged; callers
 * don't retry and there's no ephemeral shadow copy to reconcile later.
 *
 * `deleteLearnerModelData` is the counterpart erase helper (student-erase
 * flow, Task 10) and is NOT best-effort — callers need to know if the erase
 * actually completed, so it throws on failure like any normal async call.
 */

import connectDB from '@core/db';
import {
  EvidenceEventModel,
  LearnerStateProjectionModel,
  LearnerStateSnapshotModel,
  EloRatingModel,
  buildLearnerStateProjectionId,
} from '@/models';
import { estimateLo, nextReviewAt, type EvidenceSource, type EvidenceLike } from './estimator';

export interface EvidenceInput {
  /** Caller-supplied idempotency key; becomes the EvidenceEvent's `_id`. */
  idempotencyKey: string;
  studentId: string;
  partnerId?: string;
  loId: string;
  source: EvidenceSource;
  sessionId?: string;
  itemId?: string;
  sectionId?: string;
  outcome: number;
  pointsAwarded?: number;
  maxPoints?: number;
  difficulty?: number;
  latencyMs?: number;
  /** Whether the student used a hint before this outcome (M2 — threaded
   *  from the contract evidence item; the portal's practice/quiz UI sends
   *  it). No estimator weighting yet — stored for future use. */
  hintUsed?: boolean;
  signals?: string[];
  streakAtComplete?: number;
  turns?: number;
  occurredAt: Date;
  /** Feeds the Elo student key (`student:<studentId>|<subject ?? 'general'>`). */
  subject?: string;
}

/** USCF-style shrinking K-factor: fast-moving while a rating is new (few
 *  games), settling toward the floor of 8 as `count` grows. Applied
 *  per-rating (item and student each use their own current `count`), not
 *  once globally — the brief's `K = max(8, 32/(1+count/20))` is written as
 *  a single formula because both sides use the identical shape, but item
 *  and student ratings mature independently. */
function eloKFactor(count: number): number {
  return Math.max(8, 32 / (1 + count / 20));
}

function eloItemKey(input: { itemId?: string; loId: string; difficulty?: number }): string | null {
  if (input.itemId) return `item:${input.itemId}`;
  if (input.difficulty != null) return `lo:${input.loId}:d${input.difficulty}`;
  return null;
}

function eloStudentKey(studentId: string, subject: string | undefined): string {
  return `student:${studentId}|${subject ?? 'general'}`;
}

/** Pure read of a student's Elo rating — no upsert, unlike
 *  `getOrCreateEloRating` below (that helper exists to fetch-or-seed a row
 *  mid-write-path so the Elo math always has a rating/count to work from;
 *  here we only ever want to know what's already there). Returns `null`
 *  when the student has no rating row yet for this subject (e.g. never
 *  answered an item-scored evidence event) — callers (Task 11's
 *  `getLearnerHints`) treat that as "no ability signal yet", not an error. */
export async function getStudentElo(
  studentId: string,
  subject?: string,
): Promise<{ rating: number; count: number } | null> {
  await connectDB();
  const doc = await EloRatingModel.findById(eloStudentKey(studentId, subject));
  return doc ? { rating: doc.rating, count: doc.count } : null;
}

/** Fetch-or-create an EloRating row (default rating 1500, count 0) without
 *  applying any delta yet — used to read the pre-update rating/count both
 *  ratings need for the expected-score/K-factor math below. */
async function getOrCreateEloRating(id: string): Promise<{ rating: number; count: number }> {
  const doc = await EloRatingModel.findOneAndUpdate(
    { _id: id },
    { $setOnInsert: { rating: 1500, count: 0, schemaVersion: 1, updatedAt: new Date() } },
    { upsert: true, new: true },
  );
  return { rating: doc.rating, count: doc.count };
}

/** Elo update for one inserted evidence event that carries an itemId or a
 *  difficulty (events with neither have no item to rate against and are
 *  skipped by the caller before this runs).
 *
 *  expected = P(student "beats" the item) from the student's rating vs the
 *  item's rating (standard logistic Elo expectation). Student rating moves
 *  toward outcome; item rating moves the opposite way — an outcome better
 *  than expected nudges the item's difficulty estimate down as well as the
 *  student's skill estimate up. */
async function applyEloUpdate(input: {
  studentId: string;
  subject?: string;
  itemId?: string;
  loId: string;
  difficulty?: number;
  outcome: number;
}): Promise<void> {
  const itemKey = eloItemKey(input);
  if (!itemKey) return;
  const studentKey = eloStudentKey(input.studentId, input.subject);

  const [item, student] = await Promise.all([
    getOrCreateEloRating(itemKey),
    getOrCreateEloRating(studentKey),
  ]);

  const expected = 1 / (1 + 10 ** ((item.rating - student.rating) / 400));
  const delta = input.outcome - expected;
  const kStudent = eloKFactor(student.count);
  const kItem = eloKFactor(item.count);
  const now = new Date();

  await Promise.all([
    EloRatingModel.updateOne(
      { _id: studentKey },
      { $inc: { rating: kStudent * delta, count: 1 }, $set: { updatedAt: now } },
    ),
    EloRatingModel.updateOne(
      { _id: itemKey },
      { $inc: { rating: -kItem * delta, count: 1 }, $set: { updatedAt: now } },
    ),
  ]);
}

/** Recompute + upsert the LearnerStateProjection for one (studentId, loId)
 *  pair from its full evidence history (not just what was just inserted —
 *  the estimate is over all evidence to date). `trend` is left 'flat' here
 *  on purpose: the read path (Task 9) recomputes it against the 14-day-ago
 *  snapshot via `trendOf`, so there's nothing meaningful to store eagerly
 *  at write time. */
async function recomputeProjection(studentId: string, loId: string, now: Date): Promise<void> {
  const events = await EvidenceEventModel.find({ studentId, loId }).lean();
  if (events.length === 0) return;

  const evidenceLike: EvidenceLike[] = events.map((e) => ({
    source: e.source,
    outcome: e.outcome,
    occurredAt: e.occurredAt,
  }));
  const estimate = estimateLo(evidenceLike, now);
  if (!estimate) return;
  const reviewDueAt = nextReviewAt(evidenceLike, estimate.estimate, now);
  const lastEvidenceAt = events.reduce(
    (max, e) => (e.occurredAt.getTime() > max.getTime() ? e.occurredAt : max),
    events[0].occurredAt,
  );

  const update: Record<string, unknown> = {
    $set: {
      studentId,
      loId,
      estimate: estimate.estimate,
      confidence: estimate.confidence,
      trend: 'flat',
      nEff: estimate.nEff,
      lastEvidenceAt,
      updatedAt: now,
    },
    $setOnInsert: { schemaVersion: 1 },
  };
  if (reviewDueAt) {
    (update.$set as Record<string, unknown>).reviewDueAt = reviewDueAt;
  } else {
    update.$unset = { reviewDueAt: '' };
  }

  await LearnerStateProjectionModel.findOneAndUpdate(
    { _id: buildLearnerStateProjectionId(studentId, loId) },
    update,
    { upsert: true },
  );
}

async function appendEvidenceInner(inputs: EvidenceInput[]): Promise<void> {
  const filtered = inputs.filter((i) => !i.studentId.startsWith('trial:'));
  if (filtered.length === 0) return;

  await connectDB();

  const now = new Date();
  const docs = filtered.map((i) => ({
    _id: i.idempotencyKey,
    studentId: i.studentId,
    partnerId: i.partnerId,
    loId: i.loId,
    source: i.source,
    sessionId: i.sessionId,
    itemId: i.itemId,
    sectionId: i.sectionId,
    outcome: i.outcome,
    pointsAwarded: i.pointsAwarded,
    maxPoints: i.maxPoints,
    difficulty: i.difficulty,
    latencyMs: i.latencyMs,
    hintUsed: i.hintUsed,
    signals: i.signals,
    streakAtComplete: i.streakAtComplete,
    turns: i.turns,
    occurredAt: i.occurredAt,
    subject: i.subject,
    createdAt: now,
    schemaVersion: 1,
  }));

  // insertMany(..., { ordered: false }) attempts every doc even after a
  // duplicate _id (idempotency-key replay) fails on one of them. Mongoose
  // reports partial success via `err.insertedDocs` (its own property, not
  // a driver one) — that's the authoritative "what actually landed this
  // call" set regardless of *why* the rest failed, so we always prefer it
  // when present instead of trying to classify write-error codes.
  let insertedDocs: Array<{ studentId: string; loId: string; itemId?: string; difficulty?: number; outcome: number; subject?: string }>;
  try {
    insertedDocs = await EvidenceEventModel.insertMany(docs, { ordered: false });
  } catch (err) {
    const partial = (err as { insertedDocs?: typeof insertedDocs }).insertedDocs;
    if (!partial) throw err;
    // M1 fix: `partial` is truthy even when insertMany's OWN error carried
    // an EMPTY insertedDocs array (e.g. every doc in the batch collided) —
    // that used to fall through to `insertedDocs.length === 0 → return`
    // below with no log at all. Log here, unconditionally on `partial`'s
    // presence, so a real (non-duplicate-key) batch failure is never
    // silent just because nothing happened to land. The `!partial` branch
    // above re-throws instead — its caller (`appendEvidence`) logs it.
    console.error('[learner-model] evidence append failed', err);
    insertedDocs = partial;
  }

  if (insertedDocs.length === 0) return;

  const pairs = new Map<string, { studentId: string; loId: string }>();
  for (const doc of insertedDocs) {
    pairs.set(`${doc.studentId}|${doc.loId}`, { studentId: doc.studentId, loId: doc.loId });
  }

  await Promise.all(
    [...pairs.values()].map((pair) => recomputeProjection(pair.studentId, pair.loId, now)),
  );

  await Promise.all(
    insertedDocs
      .filter((doc) => doc.itemId != null || doc.difficulty != null)
      .map((doc) =>
        applyEloUpdate({
          studentId: doc.studentId,
          subject: doc.subject,
          itemId: doc.itemId,
          loId: doc.loId,
          difficulty: doc.difficulty,
          outcome: doc.outcome,
        }),
      ),
  );
}

/** Idempotent evidence append → per-(student, LO) projection recompute →
 *  silent Elo update. Best-effort: never throws, always logs on failure.
 *  `trial:`-prefixed studentIds are dropped before any write (demo/trial
 *  sessions don't feed the persistent learner model). */
export async function appendEvidence(inputs: EvidenceInput[]): Promise<void> {
  try {
    await appendEvidenceInner(inputs);
  } catch (err) {
    console.error('[learner-model] evidence append failed', err);
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Erase all learner-model data for a student: evidence log, projections,
 *  snapshots, and their per-subject Elo student rows (item ratings are
 *  shared across students and are left alone). Returns per-collection
 *  deleted-row counts. Not best-effort — throws on failure like any normal
 *  async call, since the caller needs to know whether the erase actually
 *  completed. */
export async function deleteLearnerModelData(studentId: string): Promise<Record<string, number>> {
  await connectDB();

  const [events, projections, snapshots, eloRatings] = await Promise.all([
    EvidenceEventModel.deleteMany({ studentId }),
    LearnerStateProjectionModel.deleteMany({ studentId }),
    LearnerStateSnapshotModel.deleteMany({ studentId }),
    EloRatingModel.deleteMany({ _id: { $regex: `^student:${escapeRegExp(studentId)}\\|` } }),
  ]);

  return {
    evidenceEvents: events.deletedCount ?? 0,
    learnerStateProjections: projections.deletedCount ?? 0,
    learnerStateSnapshots: snapshots.deletedCount ?? 0,
    eloRatings: eloRatings.deletedCount ?? 0,
  };
}
