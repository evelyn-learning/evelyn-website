import mongoose, { Schema, Document } from "mongoose";

export interface IWebinar extends Document {
  title: string;
  slug: string;
  description: string;
  date: Date;
  time: string;
  timezone: string;
  duration: string;
  featuredImage?: string;
  videoUrl?: string;
  youtubeId?: string;
  speakers: {
    name: string;
    title: string;
    company?: string;
    image?: string;
  }[];
  status: "upcoming" | "past" | "live";
  registrationUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WebinarSchema = new Schema<IWebinar>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    timezone: { type: String, default: "PST" },
    duration: { type: String, default: "60 minutes" },
    featuredImage: { type: String },
    videoUrl: { type: String },
    youtubeId: { type: String },
    speakers: [
      {
        name: { type: String, required: true },
        title: { type: String },
        company: { type: String },
        image: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "past", "live"],
      default: "upcoming",
    },
    registrationUrl: { type: String },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// slug index created by unique: true
WebinarSchema.index({ status: 1, date: -1 });

export const Webinar =
  mongoose.models.Webinar || mongoose.model<IWebinar>("Webinar", WebinarSchema);
