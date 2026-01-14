import mongoose, { Schema, Document } from "mongoose";

export interface IInterview extends Document {
  title: string;
  slug: string;
  description: string;
  episode: number;
  guest: {
    name: string;
    title: string;
    company?: string;
    image?: string;
    linkedIn?: string;
  };
  youtubeUrl: string;
  youtubeId: string;
  duration?: string;
  publishedAt: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    episode: { type: Number, required: true },
    guest: {
      name: { type: String, required: true },
      title: { type: String },
      company: { type: String },
      image: { type: String },
      linkedIn: { type: String },
    },
    youtubeUrl: { type: String, required: true },
    youtubeId: { type: String, required: true },
    duration: { type: String },
    publishedAt: { type: Date, required: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

InterviewSchema.index({ slug: 1 });
InterviewSchema.index({ episode: -1 });

export const Interview =
  mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", InterviewSchema);
