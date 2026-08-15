/**
 * Student Profile MongoDB Model
 *
 * Tracks student progress across tutoring sessions.
 */

import mongoose, { Schema, Document } from 'mongoose';
import type { StudentModuleProgress, ConceptMastery } from '@core/knowledge/types';

export interface IStudentProfile extends Document {
  studentId: string;
  name?: string;
  email?: string;

  // Progress per module
  moduleProgress: Map<string, StudentModuleProgress>;

  // Global preferences
  preferences: {
    preferredVoiceId: string;
    preferredExplanationStyles: string[];
    pace: 'slow' | 'medium' | 'fast';
    needsMoreEncouragement: boolean;
  };

  // Session history
  totalSessionTime: number; // seconds
  sessionsCompleted: number;
  lastSessionAt?: Date;
  sessionHistory: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const ConceptMasterySchema = new Schema(
  {
    conceptId: { type: String, required: true },
    level: { type: Number, min: 0, max: 4, default: 0 },
    lastAssessed: { type: Date },
    problemsCorrect: { type: Number, default: 0 },
    problemsAttempted: { type: Number, default: 0 },
    evidenceNotes: [{ type: String }],
  },
  { _id: false }
);

const ModuleProgressSchema = new Schema(
  {
    moduleId: { type: String, required: true },
    conceptMastery: { type: Map, of: ConceptMasterySchema },
    identifiedMisconceptions: [{ type: String }],
    correctedMisconceptions: [{ type: String }],
    problemsAttempted: { type: Number, default: 0 },
    problemsCorrect: { type: Number, default: 0 },
    averageHintsUsed: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // seconds
    sessionsCompleted: { type: Number, default: 0 },
    lastSessionAt: { type: Date },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },

    moduleProgress: {
      type: Map,
      of: ModuleProgressSchema,
      default: new Map(),
    },

    preferences: {
      preferredVoiceId: { type: String, default: 'female-1' },
      preferredExplanationStyles: [{ type: String }],
      pace: { type: String, enum: ['slow', 'medium', 'fast'], default: 'medium' },
      needsMoreEncouragement: { type: Boolean, default: false },
    },

    totalSessionTime: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    lastSessionAt: { type: Date },
    sessionHistory: [{ type: Schema.Types.ObjectId, ref: 'TutoringSession' }],
  },
  {
    timestamps: true,
  }
);

// Indexes
StudentProfileSchema.index({ studentId: 1 }, { unique: true });
StudentProfileSchema.index({ email: 1 });
StudentProfileSchema.index({ lastSessionAt: -1 });

// Methods
StudentProfileSchema.methods.getModuleProgress = function (
  moduleId: string
): StudentModuleProgress | undefined {
  return this.moduleProgress.get(moduleId);
};

StudentProfileSchema.methods.updateConceptMastery = function (
  moduleId: string,
  conceptId: string,
  mastery: Partial<ConceptMastery>
): void {
  let moduleProgress = this.moduleProgress.get(moduleId);

  if (!moduleProgress) {
    moduleProgress = {
      moduleId,
      conceptMastery: new Map(),
      identifiedMisconceptions: [],
      correctedMisconceptions: [],
      problemsAttempted: 0,
      problemsCorrect: 0,
      averageHintsUsed: 0,
      totalTimeSpent: 0,
      sessionsCompleted: 0,
      lastSessionAt: new Date(),
    };
    this.moduleProgress.set(moduleId, moduleProgress);
  }

  const existing = moduleProgress.conceptMastery.get(conceptId) || {
    conceptId,
    level: 0,
    lastAssessed: new Date(),
    problemsCorrect: 0,
    problemsAttempted: 0,
    evidenceNotes: [],
  };

  moduleProgress.conceptMastery.set(conceptId, {
    ...existing,
    ...mastery,
    lastAssessed: new Date(),
  });
};

export const StudentProfileModel =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
