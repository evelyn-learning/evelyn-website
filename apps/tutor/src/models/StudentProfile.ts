/**
 * MongoDB model for StudentProfile.
 *
 * String _id — a surrogate, never rewritten. M1c: identity is the pair
 * (partnerId, externalStudentId), resolved to this `_id` via
 * `resolveProfileId` in store.ts; `_id` itself is opaque
 * (`crypto.randomUUID()` for new profiles), not a `${partnerId}:${id}`
 * string convention.
 */

import mongoose, { Schema } from 'mongoose';
import type {
  StudentProfile,
  MasteryEntry,
  GapEntry,
  SessionMemory,
  StudentPreferences,
  PlanContentSeen,
} from '@/lib/tutor/student-profile/types';

export interface IStudentProfile {
  _id: string;
  name?: string;
  grade?: string;
  locale?: string;
  curriculum?: string;
  mastery: Record<string, MasteryEntry>;
  gaps: GapEntry[];
  recentSessions: SessionMemory[];
  preferences: StudentPreferences;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  // M1c: identity is (partnerId, externalStudentId); `_id` is a surrogate and
  // is never rewritten, which is what keeps the five collections that reference
  // it from having to migrate. The UNIQUE index on this pair is created by
  // scripts/backfill-partner-namespace.ts AFTER the backfill — declaring it here
  // would make Mongoose auto-build it over 495 rows that all share (null, null).
  /** M1c: which partner this student belongs to. 'evelyn' for retail. */
  partnerId?: string;
  /** M1c: the raw id the partner sent, before namespacing. */
  externalStudentId?: string;
  metadata?: Record<string, unknown>;
  planContentSeen?: Record<string, PlanContentSeen>;
  nextSessionIntent?: { text: string; sessionId: string; at: string };
}

export type IStudentProfileDoc = mongoose.Document<string, object, IStudentProfile> & IStudentProfile;

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    _id: { type: String, required: true },
    name: String,
    grade: { type: String, index: true },
    locale: { type: String, index: true },
    curriculum: { type: String, index: true },
    // Mixed for the maps/arrays — runtime validation via parseStudentProfile.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mastery: { type: Schema.Types.Mixed as any, default: {} },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gaps: { type: [Schema.Types.Mixed as any], default: [] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentSessions: { type: [Schema.Types.Mixed as any], default: [] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preferences: { type: Schema.Types.Mixed as any, default: {} },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    schemaVersion: { type: Number, required: true, default: 1 },
    // M1c: identity is (partnerId, externalStudentId); `_id` is a surrogate and
    // is never rewritten, which is what keeps the five collections that reference
    // it from having to migrate. The UNIQUE index on this pair is created by
    // scripts/backfill-partner-namespace.ts AFTER the backfill — declaring it here
    // would make Mongoose auto-build it over 495 rows that all share (null, null).
    partnerId: { type: String, index: true },
    externalStudentId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planContentSeen: { type: Schema.Types.Mixed as any, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextSessionIntent: { type: Schema.Types.Mixed as any, default: undefined },
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

export const StudentProfileModel =
  (mongoose.models.StudentProfile as mongoose.Model<IStudentProfile>) ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

export function toStudentProfile(doc: IStudentProfileDoc): StudentProfile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = doc.toJSON() as any;
  return {
    id: obj.id,
    name: obj.name,
    grade: obj.grade,
    locale: obj.locale,
    curriculum: obj.curriculum,
    mastery: obj.mastery ?? {},
    gaps: obj.gaps ?? [],
    recentSessions: obj.recentSessions ?? [],
    preferences: obj.preferences ?? {},
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    schemaVersion: obj.schemaVersion,
    partnerId: obj.partnerId,
    metadata: obj.metadata,
    planContentSeen: obj.planContentSeen,
    nextSessionIntent: obj.nextSessionIntent,
  };
}
