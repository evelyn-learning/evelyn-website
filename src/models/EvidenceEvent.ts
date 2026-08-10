/**
 * MongoDB model for EvidenceEvent — the append-only learner-model evidence
 * log. One row per graded/observed outcome (a try-yourself, a mock section,
 * a quiz item, ...). `_id` is the caller-supplied idempotency key so the
 * same outcome can be submitted more than once (retries, at-least-once
 * delivery) without double-counting — see `appendEvidence` in
 * `src/lib/tutor/learner-model/store.ts` (Task 7), which does
 * `insertMany(..., { ordered: false })` and swallows duplicate-key errors.
 *
 * `LearnerStateProjection` is the read-optimized rollup derived from this
 * log via `estimateLo`/`nextReviewAt` (`src/lib/tutor/learner-model/estimator.ts`,
 * pure — no import of this file).
 */

import mongoose, { Schema } from 'mongoose';
import type { EvidenceSource } from '@/lib/tutor/learner-model/estimator';

export interface IEvidenceEvent {
  /** Caller-supplied idempotency key, e.g. `${sessionId}:${loId}:${kind}`. */
  _id: string;
  studentId: string;
  partnerId?: string;
  loId: string;
  source: EvidenceSource;
  sessionId?: string;
  itemId?: string;
  sectionId?: string;
  /** 0..1 (clamped by the estimator; stored as submitted). */
  outcome: number;
  pointsAwarded?: number;
  maxPoints?: number;
  difficulty?: number;
  latencyMs?: number;
  signals?: string[];
  streakAtComplete?: number;
  turns?: number;
  occurredAt: Date;
  subject?: string;
  createdAt: Date;
  schemaVersion: number;
}

export type IEvidenceEventDoc =
  mongoose.Document<string, object, IEvidenceEvent> & IEvidenceEvent;

const EvidenceEventSchema = new Schema<IEvidenceEvent>(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    partnerId: String,
    loId: { type: String, required: true, index: true },
    source: {
      type: String,
      required: true,
      enum: ['session', 'assessment', 'quiz', 'practice', 'mock', 'diagnostic'],
    },
    sessionId: String,
    itemId: String,
    sectionId: String,
    outcome: { type: Number, required: true },
    pointsAwarded: Number,
    maxPoints: Number,
    difficulty: Number,
    latencyMs: Number,
    signals: { type: [String], default: undefined },
    streakAtComplete: Number,
    turns: Number,
    occurredAt: { type: Date, required: true },
    subject: String,
    createdAt: { type: Date, required: true, default: () => new Date() },
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

// Primary read path: "this student's evidence for this LO, most recent
// first" — feeds estimateLo/nextReviewAt recompute in store.ts.
EvidenceEventSchema.index({ studentId: 1, loId: 1, occurredAt: -1 });

export const EvidenceEventModel =
  (mongoose.models.EvidenceEvent as mongoose.Model<IEvidenceEvent>) ||
  mongoose.model<IEvidenceEvent>('EvidenceEvent', EvidenceEventSchema);
