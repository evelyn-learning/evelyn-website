/**
 * MongoDB model for EloRating — a shared Elo pool over two kinds of
 * subject: bank items (`item:<itemId>`, fallback `lo:<loId>:d<difficulty>`
 * when an item has no id) and students-per-subject
 * (`student:<studentId>|<subject>`). Updated silently alongside evidence
 * writes — see the Elo update rule in `src/lib/tutor/learner-model/store.ts`
 * (Task 7). Not read by the pure estimator; item difficulty/student skill
 * inference is a later consumer.
 */

import mongoose, { Schema } from 'mongoose';

export interface IEloRating {
  /** `item:<itemId>` | `lo:<loId>:d<difficulty>` | `student:<studentId>|<subject>`. */
  _id: string;
  rating: number;
  count: number;
  updatedAt: Date;
  schemaVersion: number;
}

export type IEloRatingDoc = mongoose.Document<string, object, IEloRating> & IEloRating;

const EloRatingSchema = new Schema<IEloRating>(
  {
    _id: { type: String, required: true },
    rating: { type: Number, required: true, default: 1500 },
    count: { type: Number, required: true, default: 0 },
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

export const EloRatingModel =
  (mongoose.models.EloRating as mongoose.Model<IEloRating>) ||
  mongoose.model<IEloRating>('EloRating', EloRatingSchema);
