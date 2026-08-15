import mongoose, { Schema } from 'mongoose';

/**
 * Derived-data sidecar: content labels for a lesson plan's segments, computed
 * once by Haiku and cached. Curated plans are TS seed constants with no Mongo
 * row, so the key is planId + RAIL_LABELS_VERSION (bump the const to re-derive).
 * `atomic: true` rows record "labeler declared this lesson atomic" so we don't
 * re-call Haiku every session for stage-pill lessons.
 *
 * Plain interface (no `extends Document`) — string `_id` override, same
 * pattern as LessonPlan.ts / StudentTopicNotes.ts in this repo (Document's
 * default `_id: ObjectId` is incompatible with a string override).
 */
export interface ILessonPlanRailLabels {
  _id: string;                       // `${planId}::${RAIL_LABELS_VERSION}`
  planId: string;
  labels: Record<string, string>;
  atomic: boolean;
}

const LessonPlanRailLabelsSchema = new Schema<ILessonPlanRailLabels>(
  {
    _id: { type: String, required: true },
    planId: { type: String, required: true, index: true },
    labels: { type: Schema.Types.Mixed, default: {} },
    atomic: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false },
);

export function buildRailLabelsId(planId: string, version: string): string {
  return `${planId}::${version}`;
}

export const LessonPlanRailLabelsModel =
  (mongoose.models.LessonPlanRailLabels as mongoose.Model<ILessonPlanRailLabels>) ||
  mongoose.model<ILessonPlanRailLabels>('LessonPlanRailLabels', LessonPlanRailLabelsSchema, 'lessonplanraillabels');
