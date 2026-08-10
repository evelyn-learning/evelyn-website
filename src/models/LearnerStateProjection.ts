/**
 * MongoDB model for LearnerStateProjection — the read-optimized, one-row-
 * per-(student, LO) rollup of the EvidenceEvent log. Recomputed by
 * `appendEvidence` (`src/lib/tutor/learner-model/store.ts`, Task 7) via the
 * pure `estimateLo`/`nextReviewAt` functions in
 * `src/lib/tutor/learner-model/estimator.ts` whenever new evidence lands
 * for that pair. `trend` is recomputed lazily on read (Task 9), not stored
 * eagerly here — see the task-7 brief.
 *
 * Composite string `_id` of `${studentId}|${loId}` (one doc per pair, so an
 * upsert-by-id is the natural write shape).
 */

import mongoose, { Schema } from 'mongoose';

export interface ILearnerStateProjection {
  /** `${studentId}|${loId}`. */
  _id: string;
  studentId: string;
  loId: string;
  estimate: number;
  confidence: 'low' | 'medium' | 'high';
  trend: 'up' | 'flat' | 'down';
  nEff: number;
  reviewDueAt?: Date;
  lastEvidenceAt: Date;
  updatedAt: Date;
  schemaVersion: number;
}

export type ILearnerStateProjectionDoc =
  mongoose.Document<string, object, ILearnerStateProjection> & ILearnerStateProjection;

const LearnerStateProjectionSchema = new Schema<ILearnerStateProjection>(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    loId: { type: String, required: true },
    estimate: { type: Number, required: true },
    confidence: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    trend: { type: String, required: true, enum: ['up', 'flat', 'down'] },
    nEff: { type: Number, required: true },
    reviewDueAt: Date,
    lastEvidenceAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true, default: () => new Date() },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  {
    _id: false,
    toJSON: {
      transform(_doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = ret as any;
        r.id = String(r._id);
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  },
);

export const LearnerStateProjectionModel =
  (mongoose.models.LearnerStateProjection as mongoose.Model<ILearnerStateProjection>) ||
  mongoose.model<ILearnerStateProjection>('LearnerStateProjection', LearnerStateProjectionSchema);

/** Build the composite `_id` from its components. Used at every read/write
 *  site so the format stays consistent. */
export function buildLearnerStateProjectionId(studentId: string, loId: string): string {
  return `${studentId}|${loId}`;
}
