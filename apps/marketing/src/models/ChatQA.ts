import mongoose, { Schema, Document } from "mongoose";

export interface IChatQA extends Document {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatQASchema = new Schema<IChatQA>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    keywords: { type: [String], default: [] },
    category: { type: String, default: "general" },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

ChatQASchema.index({ enabled: 1, category: 1 });
ChatQASchema.index({ keywords: 1 });

export const ChatQA =
  mongoose.models.ChatQA || mongoose.model<IChatQA>("ChatQA", ChatQASchema);
