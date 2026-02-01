/**
 * Tutoring Session MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import type {
  TutoringSession,
  TranscriptEntry,
  ProblemAttempt,
  SessionMetrics,
  SessionStatus,
  SessionGoal,
  SessionState,
} from '../tutor/types';

export interface ITutoringSession extends Document, Omit<TutoringSession, 'id'> {
  _id: mongoose.Types.ObjectId;
}

const TranscriptEntrySchema = new Schema<TranscriptEntry>(
  {
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    role: { type: String, enum: ['student', 'tutor', 'system'], required: true },
    text: { type: String, required: true },
    whiteboardCommands: { type: Schema.Types.Mixed },
    pedagogicalIntent: { type: String },
    sttConfidence: { type: Number },
    detectedIntent: { type: String },
    detectedMisconception: { type: String },
  },
  { _id: false }
);

const ProblemAttemptSchema = new Schema<ProblemAttempt>(
  {
    problemId: { type: String, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
    hintsUsed: { type: Number, default: 0 },
    correct: { type: Boolean, default: false },
    studentWork: { type: String },
    feedbackGiven: { type: String },
  },
  { _id: false }
);

const SessionMetricsSchema = new Schema<SessionMetrics>(
  {
    studentSpeakingTime: { type: Number, default: 0 },
    tutorSpeakingTime: { type: Number, default: 0 },
    questionsAskedByTutor: { type: Number, default: 0 },
    hintsGiven: { type: Number, default: 0 },
    diagramsShown: { type: Number, default: 0 },
    problemsCompleted: { type: Number, default: 0 },
    problemsCorrect: { type: Number, default: 0 },
    averageResponseLatency: { type: Number, default: 0 },
  },
  { _id: false }
);

const TutoringSessionSchema = new Schema<ITutoringSession>(
  {
    config: {
      studentId: { type: String },
      studentName: { type: String },
      subject: { type: String, required: true },
      topic: { type: String, required: true },
      level: { type: String, required: true },
      goal: { type: String },
      specificTopic: { type: String },
      maxDurationMinutes: { type: Number, default: 30 },
      voicePreference: {
        voiceId: { type: String },
        speed: { type: Number },
        pitch: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ['initializing', 'active', 'paused', 'completed', 'abandoned', 'error'],
      default: 'initializing',
    },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },
    transcript: [TranscriptEntrySchema],
    problemsAttempted: [ProblemAttemptSchema],
    conceptsTouched: [{ type: String }],
    misconceptionsDetected: [{ type: String }],
    misconceptionsAddressed: [{ type: String }],
    metrics: SessionMetricsSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes
TutoringSessionSchema.index({ 'config.studentId': 1 });
TutoringSessionSchema.index({ startedAt: -1 });
TutoringSessionSchema.index({ status: 1 });

export const TutoringSessionModel =
  mongoose.models.TutoringSession ||
  mongoose.model<ITutoringSession>('TutoringSession', TutoringSessionSchema);
