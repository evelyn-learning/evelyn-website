import mongoose, { Schema, Document } from "mongoose";
import {
  BlogCategory,
  BlogTone,
  BlogLength,
  TargetMarket,
  ImageStyle,
} from "@/types/blog-generator";

// Track what was used in recent generations to ensure variety
export interface RecentGeneration {
  category: string;
  targetMarket: string;
  topic: string;
  tone: string;
  generatedAt: Date;
}

export interface IAutoBlogSettings extends Document {
  enabled: boolean;
  // Cron interval settings
  intervalType: "hourly" | "daily" | "every2days" | "every3days" | "weekly" | "custom";
  customCronExpression?: string;
  // Generation preferences (optional - if not set, AI decides)
  preferredCategories?: BlogCategory[];
  preferredMarkets?: TargetMarket[];
  preferredTones?: BlogTone[];
  preferredLength?: BlogLength;
  preferredImageStyle?: ImageStyle;
  // Auto-publish settings
  autoPublish: boolean; // If false, saves as draft
  // Tracking
  recentGenerations: RecentGeneration[];
  maxRecentToTrack: number; // How many recent generations to remember for variety
  // Stats
  totalGenerated: number;
  lastGeneratedAt?: Date;
  lastError?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const RecentGenerationSchema = new Schema<RecentGeneration>(
  {
    category: { type: String, required: true },
    targetMarket: { type: String, required: true },
    topic: { type: String, required: true },
    tone: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AutoBlogSettingsSchema = new Schema<IAutoBlogSettings>(
  {
    enabled: { type: Boolean, default: false },
    intervalType: {
      type: String,
      enum: ["hourly", "daily", "every2days", "every3days", "weekly", "custom"],
      default: "daily",
    },
    customCronExpression: { type: String },
    preferredCategories: [{ type: String }],
    preferredMarkets: [{ type: String }],
    preferredTones: [{ type: String }],
    preferredLength: { type: String },
    preferredImageStyle: { type: String },
    autoPublish: { type: Boolean, default: false },
    recentGenerations: [RecentGenerationSchema],
    maxRecentToTrack: { type: Number, default: 10 },
    totalGenerated: { type: Number, default: 0 },
    lastGeneratedAt: { type: Date },
    lastError: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AutoBlogSettings =
  mongoose.models.AutoBlogSettings ||
  mongoose.model<IAutoBlogSettings>("AutoBlogSettings", AutoBlogSettingsSchema);
