import mongoose, { Schema, Document } from 'mongoose';

export interface IIntegrityReport extends Document {
  html: string;
  studentName?: string;
  assignmentName?: string;
  createdAt: Date;
  expiresAt: Date;
}

const IntegrityReportSchema = new Schema<IIntegrityReport>(
  {
    html: { type: String, required: true },
    studentName: { type: String, default: '' },
    assignmentName: { type: String, default: '' },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

export const IntegrityReport =
  mongoose.models.IntegrityReport ||
  mongoose.model<IIntegrityReport>('IntegrityReport', IntegrityReportSchema);
