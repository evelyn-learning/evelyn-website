import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonImage extends Document {
  /** Unique filename / identifier, e.g. "water-cycle-diagram-01" */
  filename: string;
  /** Public URL (CDN or /public path) */
  url: string;
  /** Taxonomy tags from image-taxonomy.json, e.g. ["water-cycle", "precipitation"] */
  tags: string[];
  /** Free-text description for semantic search */
  description: string;
  /** Primary subject: math | science | ela | general */
  subject: string;
  /** Grade range this image is appropriate for */
  gradeRange: string[];
  /** CCSS / NGSS standards this image relates to */
  standards: string[];
  /** OpenAI text-embedding-3-small vector (1536 dimensions) */
  embedding: number[];
  /** Source attribution, e.g. "Wikimedia Commons", "NASA", "Unsplash" */
  source: string;
  /** License type, e.g. "CC0", "CC-BY-4.0", "Public Domain" */
  license: string;
  /** Alt text for accessibility */
  altText: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonImageSchema = new Schema<ILessonImage>(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    url: { type: String, required: true },
    tags: [{ type: String, index: true }],
    description: { type: String, required: true },
    subject: { type: String, required: true, enum: ['math', 'science', 'ela', 'general'] },
    gradeRange: [{ type: String }],
    standards: [{ type: String }],
    embedding: [{ type: Number }],
    source: { type: String, default: '' },
    license: { type: String, default: 'CC0' },
    altText: { type: String, default: '' },
  },
  { timestamps: true }
);

// Compound index for efficient tag + subject + grade queries
LessonImageSchema.index({ tags: 1, subject: 1 });
LessonImageSchema.index({ subject: 1, gradeRange: 1 });

export const LessonImage =
  mongoose.models.LessonImage ||
  mongoose.model<ILessonImage>('LessonImage', LessonImageSchema);
