/**
 * MongoDB model for StudentTopicNotes — per-student topic-notes overlays.
 *
 * Composite string `_id` of `${studentId}::${baselineId}`. One document
 * per student per CED topic. Lazy-created on first overlay write or
 * first notes view.
 *
 * Baselines do NOT live here — they're TS seed files registered in
 * `src/lib/tutor/topic-notes/store.ts`. Render = baseline content +
 * overlays merged at read time (`src/lib/tutor/topic-notes/resolve.ts`).
 */

import mongoose, { Schema } from 'mongoose';
import type {
  StudentTopicNotes,
  TheoryOverlay,
  MethodOverlay,
  PointerOverlay,
} from '@/lib/tutor/topic-notes/types';

export interface IStudentTopicNotes {
  /** `${studentId}::${baselineId}`. */
  _id: string;
  studentId: string;
  baselineId: string;
  baselineVersionAtFork?: number;
  theoryOverlays: TheoryOverlay[];
  methodsAdds: MethodOverlay[];
  pointersAdds: PointerOverlay[];
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export type IStudentTopicNotesDoc =
  mongoose.Document<string, object, IStudentTopicNotes> & IStudentTopicNotes;

const StudentTopicNotesSchema = new Schema<IStudentTopicNotes>(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    baselineId: { type: String, required: true, index: true },
    baselineVersionAtFork: Number,
    // Mixed for the overlay arrays — runtime validation lives in
    // `apply-overlay.ts`. Matches the StudentProfile pattern.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theoryOverlays: { type: [Schema.Types.Mixed as any], default: [] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodsAdds: { type: [Schema.Types.Mixed as any], default: [] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointersAdds: { type: [Schema.Types.Mixed as any], default: [] },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  {
    _id: false,
    toJSON: {
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

// Compound index for "your notes, recently updated" rail and any future
// "all my topic-notes for course X" query (filter by studentId, sort by
// updatedAt desc).
StudentTopicNotesSchema.index({ studentId: 1, updatedAt: -1 });

export const StudentTopicNotesModel =
  (mongoose.models.StudentTopicNotes as mongoose.Model<IStudentTopicNotes>) ||
  mongoose.model<IStudentTopicNotes>('StudentTopicNotes', StudentTopicNotesSchema);

export function toStudentTopicNotes(doc: IStudentTopicNotesDoc): StudentTopicNotes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = doc.toJSON() as any;
  return {
    id: obj.id,
    studentId: obj.studentId,
    baselineId: obj.baselineId,
    baselineVersionAtFork: obj.baselineVersionAtFork,
    theoryOverlays: obj.theoryOverlays ?? [],
    methodsAdds: obj.methodsAdds ?? [],
    pointersAdds: obj.pointersAdds ?? [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    schemaVersion: obj.schemaVersion,
  };
}

/** Build the composite `_id` from its components. Used at every read
 *  site so the format stays consistent. */
export function buildTopicNotesId(studentId: string, baselineId: string): string {
  return `${studentId}::${baselineId}`;
}
