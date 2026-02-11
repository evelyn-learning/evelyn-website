import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedLesson extends Document {
  title: string;
  gradeLevel: string;
  subject: string;
  language: string;
  duration: string;
  prompt: string;
  lesson: Record<string, unknown>;
  imageUrls: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const SavedLessonSchema = new Schema<ISavedLesson>(
  {
    title: { type: String, required: true, trim: true },
    gradeLevel: { type: String, required: true },
    subject: { type: String, required: true },
    language: { type: String, default: 'en' },
    duration: { type: String, default: '10 min' },
    prompt: { type: String, default: '' },
    lesson: { type: Schema.Types.Mixed, required: true },
    imageUrls: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

SavedLessonSchema.index({ createdAt: -1 });

export const SavedLesson =
  mongoose.models.SavedLesson ||
  mongoose.model<ISavedLesson>('SavedLesson', SavedLessonSchema);
