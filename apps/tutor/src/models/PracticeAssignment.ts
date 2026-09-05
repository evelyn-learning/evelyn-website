/**
 * PracticeAssignment — homework the tutor assigned at the close of a session
 * (holistic-pedagogy round, spec §C.3). Engine-owned: the academy reads it
 * (Plan 2's assigned-practice route) and renders the card; next-session
 * status is computed engine-side from EvidenceEvent rows whose itemId is in
 * `los[].items[].id` (practice attempts already emit per-item evidence).
 * One record per session (`sessionId` unique) — a second close call replaces.
 * `locator` absent ⇒ recorded but NEVER spoken about or surfaced (spec §C.6).
 */
import mongoose, { Schema } from 'mongoose';
import type { PracticeItem } from '@evelyn/portal-contract/v1';

export interface IPracticeAssignmentLo { loId: string; title: string; reason: string; items: PracticeItem[] }
export interface IPracticeAssignment {
  _id: string;
  studentId: string;
  partnerId?: string;
  sessionId: string;
  lessonPlanId?: string;
  courseId?: string;
  los: IPracticeAssignmentLo[];
  nextTimeIntent?: string;
  locator?: string;
  /** true when the final-commit fallback assigned it, not the brain tool. */
  auto: boolean;
  assignedAt: Date;
  acknowledgedAt?: Date;
  createdAt: Date;
}

const PracticeAssignmentSchema = new Schema<IPracticeAssignment>(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    partnerId: String,
    sessionId: { type: String, required: true, unique: true },
    lessonPlanId: String,
    courseId: String,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    los: { type: [Schema.Types.Mixed as any], default: [] },
    nextTimeIntent: String,
    locator: String,
    auto: { type: Boolean, required: true, default: false },
    assignedAt: { type: Date, required: true },
    acknowledgedAt: Date,
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);
PracticeAssignmentSchema.index({ studentId: 1, assignedAt: -1 });

export const PracticeAssignmentModel =
  (mongoose.models.PracticeAssignment as mongoose.Model<IPracticeAssignment>) ||
  mongoose.model<IPracticeAssignment>('PracticeAssignment', PracticeAssignmentSchema);
