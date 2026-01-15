import mongoose, { Schema, Document } from "mongoose";

export interface ISpeaker extends Document {
  name: string;
  slug: string;
  title: string;
  company?: string;
  bio: string;
  image?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  year: number;
  contentType: "webinar" | "interview" | "both";
  contentUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SpeakerSchema = new Schema<ISpeaker>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String },
    bio: { type: String, required: true },
    image: { type: String },
    linkedIn: { type: String },
    twitter: { type: String },
    website: { type: String },
    year: { type: Number, required: true },
    contentType: {
      type: String,
      enum: ["webinar", "interview", "both"],
      default: "webinar",
    },
    contentUrl: { type: String },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// slug index created by unique: true
SpeakerSchema.index({ year: -1, name: 1 });

export const Speaker =
  mongoose.models.Speaker || mongoose.model<ISpeaker>("Speaker", SpeakerSchema);
