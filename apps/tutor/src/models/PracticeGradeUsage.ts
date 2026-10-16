import mongoose, { Schema, Document } from 'mongoose';

/**
 * One free-response grade's model usage and cost (see
 * lib/tutor/portal/grade-usage.ts). Internal only: read by
 * /admin/practice-grading, never served to a partner.
 */
export interface IPracticeGradeUsage extends Document {
  partnerId: string;
  studentId: string;
  itemId: string;
  calls: number;
  models: string[];
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  costUsd: number;
  createdAt: Date;
}

const PracticeGradeUsageSchema = new Schema<IPracticeGradeUsage>(
  {
    partnerId: { type: String, required: true },
    studentId: { type: String, required: true },
    itemId: { type: String, required: true },
    calls: { type: Number, required: true },
    models: { type: [String], default: [] },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    cacheReadTokens: { type: Number, default: 0 },
    cacheCreationTokens: { type: Number, default: 0 },
    costUsd: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

PracticeGradeUsageSchema.index({ partnerId: 1, createdAt: -1 });

export const PracticeGradeUsage =
  mongoose.models.PracticeGradeUsage ||
  mongoose.model<IPracticeGradeUsage>('PracticeGradeUsage', PracticeGradeUsageSchema, 'practicegradeusages');
