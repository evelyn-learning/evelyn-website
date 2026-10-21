/**
 * MongoDB model for HomeworkBuild: the per-problem figure + answer key built
 * for one homework upload (keyed by the plan id). Shape mirrors
 * HomeworkBuildDoc in `src/lib/tutor/homework-build/types.ts`.
 */

import mongoose, { Schema } from 'mongoose';
import type { HomeworkBuildDoc } from '@/lib/tutor/homework-build/types';

const ProblemBuildSchema = new Schema(
  {
    n: { type: Number, required: true },
    text: { type: String, required: true },
    hash: { type: String, required: true },
    status: { type: String, enum: ['preparing', 'ready', 'unverified'], default: 'preparing' },
    figure: { type: Schema.Types.Mixed, default: null },
    figureNote: { type: String },
    key: { type: Schema.Types.Mixed, default: null },
    verify: { type: Schema.Types.Mixed, default: () => ({ agreed: false }) },
    ms: { type: Number },
    tokens: { type: Schema.Types.Mixed },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { _id: false, minimize: false },
);

const HomeworkBuildSchema = new Schema<HomeworkBuildDoc>(
  {
    _id: { type: String, required: true },                  // the plan id
    partnerId: { type: String, required: true },
    problems: { type: [ProblemBuildSchema], default: [] },
    startedAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    done: { type: Boolean, default: false },
  },
  { _id: false, minimize: false },
);

// Cache lookup: newest problem with this hash.
HomeworkBuildSchema.index({ 'problems.hash': 1, updatedAt: -1 });

export const HomeworkBuildModel =
  (mongoose.models.HomeworkBuild as mongoose.Model<HomeworkBuildDoc>) ||
  mongoose.model<HomeworkBuildDoc>('HomeworkBuild', HomeworkBuildSchema);
