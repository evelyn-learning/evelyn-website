import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAnalysisHistory extends Document {
  teacherId: Types.ObjectId;
  documentName: string;
  source: 'upload' | 'classroom';

  studentName?: string;
  studentEmail?: string;

  courseId?: string;
  courseTitle?: string;
  assignmentId?: string;
  assignmentTitle?: string;
  driveFileId?: string;
  submittedAt?: Date;

  context?: {
    gradeLevel?: number;
    subject?: string;
    assignmentType?: string;
  };

  // Headline numbers, denormalized for fast list queries.
  overallScore: number;
  overallVerdict: string;
  aiScore: number;
  aiVerdict: string;
  plagiarismScore: number;
  plagiarismVerdict: string;

  // Full analysis result (no raw submitted text — see plagiarism/analyze-text.ts).
  // Stored as Mixed since the shape is rich and the model is the source of truth.
  result: Record<string, unknown>;

  createdAt: Date;
}

const AnalysisHistorySchema = new Schema<IAnalysisHistory>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    documentName: { type: String, required: true },
    source: { type: String, enum: ['upload', 'classroom'], required: true, index: true },

    studentName: String,
    studentEmail: String,
    courseId: String,
    courseTitle: String,
    assignmentId: String,
    assignmentTitle: String,
    driveFileId: String,
    submittedAt: Date,

    context: {
      gradeLevel: Number,
      subject: String,
      assignmentType: String,
    },

    overallScore: { type: Number, required: true },
    overallVerdict: { type: String, required: true },
    aiScore: { type: Number, required: true },
    aiVerdict: { type: String, required: true },
    plagiarismScore: { type: Number, required: true },
    plagiarismVerdict: { type: String, required: true },

    result: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AnalysisHistorySchema.index({ teacherId: 1, createdAt: -1 });

export const AnalysisHistory =
  (mongoose.models.AnalysisHistory as mongoose.Model<IAnalysisHistory>) ||
  mongoose.model<IAnalysisHistory>('AnalysisHistory', AnalysisHistorySchema);
