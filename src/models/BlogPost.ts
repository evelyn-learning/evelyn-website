import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  readingTime: number;
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });

export const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
