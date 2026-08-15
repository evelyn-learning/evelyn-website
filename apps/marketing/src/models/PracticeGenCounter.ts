import mongoose, { Schema, Document } from 'mongoose';

/**
 * Design B (generate-on-exhaustion, Task 3) — day-bucketed cost/volume
 * counters for Practice's runtime generation fallback. Two scope kinds share
 * one collection:
 *   - `${studentId}::${loId}` — per-(student,LO) daily cap (20).
 *   - `'global'`               — whole-deployment daily cap (500).
 *
 * Both counters are reserved BEFORE a generation attempt (optimistic
 * reservation — see practice-gen.ts's `mongoReserve`), so a slow/failed
 * generation still counts against the cap rather than being retried
 * unboundedly. A soft cost ceiling, not a hard financial limit: a
 * reservation race can overshoot slightly under concurrent requests, which
 * is an accepted trade-off for avoiding a distributed-transaction counter.
 *
 * TTL ~48h (not 24h) so a counter created near a UTC day boundary always
 * survives long enough to be read back correctly for its whole `day` bucket
 * before Mongo reaps it.
 */
export interface IPracticeGenCounter extends Document {
  /** `${studentId}::${loId}` or the literal `'global'`. */
  scopeKey: string;
  /** UTC calendar day, `YYYY-MM-DD`. */
  day: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeGenCounterSchema = new Schema<IPracticeGenCounter>(
  {
    scopeKey: { type: String, required: true },
    day: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

PracticeGenCounterSchema.index({ scopeKey: 1, day: 1 }, { unique: true });
// TTL — auto-delete stale day-buckets ~48h after creation.
PracticeGenCounterSchema.index({ createdAt: 1 }, { expireAfterSeconds: 48 * 60 * 60 });

export const PracticeGenCounter =
  mongoose.models.PracticeGenCounter ||
  mongoose.model<IPracticeGenCounter>('PracticeGenCounter', PracticeGenCounterSchema, 'practicegencounters');
