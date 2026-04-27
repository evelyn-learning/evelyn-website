/**
 * MongoDB model for LessonPlan documents.
 *
 * Storage shape mirrors the LessonPlan type in
 * `src/lib/tutor/lesson-plan/types.ts`. We use Mixed for the segments
 * array because Mongoose can't validate discriminated unions cleanly;
 * runtime validation happens at the parser layer when plans are
 * ingested.
 */

import mongoose, { Schema } from 'mongoose';
import type { LessonPlan, Segment, LearningObjective } from '@/lib/tutor/lesson-plan/types';

/** Mongoose document shape. We use a string primary key (the application
 *  `id`) — overrides the default ObjectId. */
export interface ILessonPlan {
  _id: string;
  title: string;
  curriculum: string;
  grade: string;
  subject: string;
  topic?: string;
  locale?: string;
  los: LearningObjective[];
  estimatedMinutes: number;
  segments: Segment[];
  prerequisites?: string[];
  followUps?: string[];
  source?: { author?: string; org?: string; license?: string };
  schemaVersion: number;
  metadata?: Record<string, unknown>;
}

export type ILessonPlanDoc = mongoose.Document<string, object, ILessonPlan> & ILessonPlan;

const LearningObjectiveSchema = new Schema<LearningObjective>(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    standard: { type: String },
  },
  { _id: false },
);

const LessonPlanSchema = new Schema<ILessonPlan>(
  {
    _id: { type: String, required: true },                  // application-controlled id
    title: { type: String, required: true },
    curriculum: { type: String, required: true, index: true },
    grade: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, index: true },
    locale: { type: String, default: 'en', index: true },
    los: { type: [LearningObjectiveSchema], default: [] },
    estimatedMinutes: { type: Number, required: true },
    // Mixed array — Mongoose can't validate a discriminated union; runtime
    // validation lives in `parseLessonPlan`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    segments: { type: [Schema.Types.Mixed as any], required: true },
    prerequisites: { type: [String], default: [] },
    followUps: { type: [String], default: [] },
    source: {
      author: String,
      org: String,
      license: String,
    },
    schemaVersion: { type: Number, required: true, default: 1 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    _id: false,                                             // we control _id
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = ret as any;
        r.id = r._id;
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  },
);

LessonPlanSchema.index({ subject: 1, grade: 1, curriculum: 1 });
LessonPlanSchema.index({ los: 1 });

export const LessonPlanModel =
  (mongoose.models.LessonPlan as mongoose.Model<ILessonPlan>) ||
  mongoose.model<ILessonPlan>('LessonPlan', LessonPlanSchema);

/** Cast helper. Mongoose document to plain LessonPlan. */
export function toLessonPlan(doc: ILessonPlanDoc): LessonPlan {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = doc.toJSON() as any;
  return {
    id: obj.id,
    title: obj.title,
    curriculum: obj.curriculum,
    grade: obj.grade,
    subject: obj.subject,
    topic: obj.topic,
    locale: obj.locale,
    los: obj.los,
    estimatedMinutes: obj.estimatedMinutes,
    segments: obj.segments as Segment[],
    prerequisites: obj.prerequisites,
    followUps: obj.followUps,
    source: obj.source,
    schemaVersion: obj.schemaVersion,
    metadata: obj.metadata,
  };
}
