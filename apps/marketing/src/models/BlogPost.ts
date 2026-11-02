import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  quickAnswer?: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  readingTime: number;
  // Beacon flags (all optional; set via /api/beacon/v1, reversed from /admin/blog)
  noindex?: boolean;
  noindexedAt?: Date;
  noindexReason?: string;
  ctaProduct?: "voice-tutor" | "academy" | null;
  /** A human restored this post — Beacon never touches it again. */
  beaconLocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    quickAnswer: { type: String },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: "Evelyn Learning" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date },
    metaTitle: { type: String },
    metaDescription: { type: String },
    readingTime: { type: Number, default: 5 },
    noindex: { type: Boolean },
    noindexedAt: { type: Date },
    noindexReason: { type: String },
    ctaProduct: { type: String, enum: ["voice-tutor", "academy", null], default: undefined },
    beaconLocked: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (slug index created by unique: true)
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });

export const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
