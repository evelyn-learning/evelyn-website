/**
 * MongoDB model for StudentProfile.
 *
 * String _id — application-controlled (retail userId, or
 * `${partnerId}:${externalStudentId}` for B2B).
 */

import mongoose, { Schema } from 'mongoose';
import type {
  StudentProfile,
  MasteryEntry,
  GapEntry,
  SessionMemory,
  StudentPreferences,
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
  partnerId?: string;
  metadata?: Record<string, unknown>;
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
    partnerId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
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
  };
}
