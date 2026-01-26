import mongoose, { Schema, Document } from "mongoose";
import { GeneratedBlogPost } from "@/types/blog-generator";

export interface IBlogQueue extends Document {
  title: string;
  generatedPost: GeneratedBlogPost;
  scheduledFor: Date;
  status: "pending" | "published" | "failed";
  publishedAt?: Date;
  publishedPostId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogQueueSchema = new Schema<IBlogQueue>(
  {
    title: { type: String, required: true },
    generatedPost: {
      type: Schema.Types.Mixed,
      required: true,
    },
    scheduledFor: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "published", "failed"],
      default: "pending",
    },
    publishedAt: { type: Date },
    publishedPostId: { type: String },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

// Index for finding posts due for publishing
BlogQueueSchema.index({ status: 1, scheduledFor: 1 });

export const BlogQueue =
  mongoose.models.BlogQueue ||
  mongoose.model<IBlogQueue>("BlogQueue", BlogQueueSchema);
