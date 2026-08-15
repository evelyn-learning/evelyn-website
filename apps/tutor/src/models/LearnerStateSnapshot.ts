/**
 * MongoDB model for LearnerStateSnapshot — a daily per-student freeze of
 * every LO estimate, written by the snapshot cron (Task 10). Feeds the
 * 14-day-ago comparison that `trendOf` (`src/lib/tutor/learner-model/estimator.ts`)
 * needs at read time, and any future "progress over time" chart.
 *
 * Not composite-keyed (default ObjectId `_id`) — uniqueness is enforced via
 * the `{studentId, date}` index instead, since a snapshot is looked up by
 * that pair, not addressed directly by id.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ILearnerStateSnapshotLo {
  loId: string;
  estimate: number;
}

// Default ObjectId `_id` (not composite — see file header) — extends
// Document directly rather than the string-`_id` shape the composite
// models below use.
export interface ILearnerStateSnapshot extends Document {
  studentId: string;
  /** 'YYYY-MM-DD', UTC. */
  date: string;
  los: ILearnerStateSnapshotLo[];
  createdAt: Date;
  schemaVersion: number;
}

const LearnerStateSnapshotLoSchema = new Schema<ILearnerStateSnapshotLo>(
  {
    loId: { type: String, required: true },
    estimate: { type: Number, required: true },
  },
  { _id: false },
);

const LearnerStateSnapshotSchema = new Schema<ILearnerStateSnapshot>(
  {
    studentId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    los: { type: [LearnerStateSnapshotLoSchema], default: [] },
    createdAt: { type: Date, required: true, default: () => new Date() },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  {
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

LearnerStateSnapshotSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const LearnerStateSnapshotModel =
  (mongoose.models.LearnerStateSnapshot as mongoose.Model<ILearnerStateSnapshot>) ||
  mongoose.model<ILearnerStateSnapshot>('LearnerStateSnapshot', LearnerStateSnapshotSchema);
