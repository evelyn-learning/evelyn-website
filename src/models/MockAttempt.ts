import mongoose, { Schema, Document } from 'mongoose';

/**
 * MockAttempt — a student's in-progress or completed run through a
 * MockForm: served-module snapshot, responses, routing, and (once
 * graded) scaled scores / LO breakdown / FRQ grades.
 */
export interface IMockAttempt extends Document {
  /** crypto.randomUUID(). */
  attemptId: string;
  studentId: string;
  formId: string;
  examKey: string;
  status: 'in_section' | 'at_break' | 'grading' | 'completed' | 'expired';
  /** moduleIdx indexes servedModules PATH, not blueprint array. */
  cursor: { sectionIdx: number; moduleIdx: number };
  /** Deadline of the currently-open module. */
  sectionDeadlineAt?: Date;
  /** Pinned snapshot, appended as modules are served. */
  servedModules: Array<{
    sectionIdx: number;
    moduleId: string;
    itemIds: string[];
  }>;
  responses: Array<{
    itemId: string;
    answer?: string;
    frqText?: string;
    markedForReview?: boolean;
    struckChoices?: number[];
    annotations?: Array<{ start: number; end: number; note?: string }>;
  }>;
  moduleRouting: Array<{ sectionId: string; variant: 'easy' | 'hard' }>;
  rawSections?: Array<{
    sectionId: string;
    rawCorrect: number;
    rawTotal: number;
    scaled?: number;
  }>;
  scaled?: {
    composite: number;
    compositeMax: number;
    sections: Array<{
      sectionId: string;
      label: string;
      scaled: number;
      scaledMax: number;
      inComposite?: boolean;
    }>;
  };
  loBreakdown?: Array<{ loId: string; correct: number; total: number; sectionId?: string }>;
  frqGrades?: Array<{
    itemId: string;
    totalPoints: number;
    maxPoints: number;
    parts: Array<{
      criterionId: string;
      pointsAwarded: number;
      maxPoints: number;
      feedback: string;
    }>;
    ungraded?: boolean;
  }>;
  footnote?: string;
  /** Grading lock acquired-at (report path). Re-stamped on each acquisition;
   *  a lock older than 10min is treated as a crashed run and re-takeable. */
  gradingStartedAt?: Date;
  /** Unique token of the poll that currently holds the grading lock. Written
   *  then re-read (compare-and-set) so exactly one concurrent poll grades. */
  gradingLockToken?: string;
  /** Idempotency guard for the gaps/mastery feed. */
  gapsFedAt?: Date;
  isRetake: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CursorSchema = new Schema(
  {
    sectionIdx: { type: Number, required: true },
    moduleIdx: { type: Number, required: true },
  },
  { _id: false }
);

const ServedModuleSchema = new Schema(
  {
    sectionIdx: { type: Number, required: true },
    moduleId: { type: String, required: true },
    itemIds: [{ type: String, required: true }],
  },
  { _id: false }
);

const AnnotationSchema = new Schema(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    note: { type: String },
  },
  { _id: false }
);

const ResponseSchema = new Schema(
  {
    itemId: { type: String, required: true },
    answer: { type: String },
    frqText: { type: String },
    markedForReview: { type: Boolean },
    struckChoices: { type: [Number], default: undefined },
    annotations: { type: [AnnotationSchema], default: undefined },
  },
  { _id: false }
);

const ModuleRoutingSchema = new Schema(
  {
    sectionId: { type: String, required: true },
    variant: { type: String, required: true, enum: ['easy', 'hard'] },
  },
  { _id: false }
);

const RawSectionSchema = new Schema(
  {
    sectionId: { type: String, required: true },
    rawCorrect: { type: Number, required: true },
    rawTotal: { type: Number, required: true },
    scaled: { type: Number },
  },
  { _id: false }
);

const ScaledSectionSchema = new Schema(
  {
    sectionId: { type: String, required: true },
    label: { type: String, required: true },
    scaled: { type: Number, required: true },
    scaledMax: { type: Number, required: true },
    inComposite: { type: Boolean },
  },
  { _id: false }
);

const ScaledSchema = new Schema(
  {
    composite: { type: Number, required: true },
    compositeMax: { type: Number, required: true },
    sections: { type: [ScaledSectionSchema], required: true },
  },
  { _id: false }
);

const LoBreakdownSchema = new Schema(
  {
    loId: { type: String, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    sectionId: { type: String },
  },
  { _id: false }
);

const FrqGradePartSchema = new Schema(
  {
    criterionId: { type: String, required: true },
    pointsAwarded: { type: Number, required: true },
    maxPoints: { type: Number, required: true },
    feedback: { type: String, required: true },
  },
  { _id: false }
);

const FrqGradeSchema = new Schema(
  {
    itemId: { type: String, required: true },
    totalPoints: { type: Number, required: true },
    maxPoints: { type: Number, required: true },
    parts: { type: [FrqGradePartSchema], required: true },
    ungraded: { type: Boolean },
  },
  { _id: false }
);

const MockAttemptSchema = new Schema<IMockAttempt>(
  {
    attemptId: { type: String, required: true, trim: true },
    studentId: { type: String, required: true },
    formId: { type: String, required: true },
    examKey: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['in_section', 'at_break', 'grading', 'completed', 'expired'],
    },
    cursor: { type: CursorSchema, required: true },
    sectionDeadlineAt: { type: Date },
    servedModules: { type: [ServedModuleSchema], required: true, default: [] },
    responses: { type: [ResponseSchema], required: true, default: [] },
    moduleRouting: { type: [ModuleRoutingSchema], required: true, default: [] },
    rawSections: { type: [RawSectionSchema], default: undefined },
    scaled: { type: ScaledSchema, required: false, default: undefined },
    loBreakdown: { type: [LoBreakdownSchema], default: undefined },
    frqGrades: { type: [FrqGradeSchema], default: undefined },
    footnote: { type: String },
    gradingStartedAt: { type: Date },
    gradingLockToken: { type: String },
    gapsFedAt: { type: Date },
    isRetake: { type: Boolean, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

MockAttemptSchema.index({ attemptId: 1 }, { unique: true });
MockAttemptSchema.index({ studentId: 1, formId: 1, status: 1 });

export const MockAttempt =
  mongoose.models.MockAttempt ||
  mongoose.model<IMockAttempt>('MockAttempt', MockAttemptSchema);
