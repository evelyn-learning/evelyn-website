import mongoose, { Schema, Document } from "mongoose";

export interface ITokenUsage {
  operation: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: Date;
}

export interface ITutorSession extends Document {
  sessionId: string;
  studentName?: string;
  subject: string;
  topic: string;
  level: string;
  sessionGoal: "practice" | "homework-help" | "concept-review" | "test-prep" | "catch-up" | "challenge";
  inputMode: "text" | "voice";
  voiceEngine?: "classic" | "realtime";
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  messageCount: number;
  whiteboardItemCount: number;
  tokenUsage: ITokenUsage[];
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  status: "active" | "completed" | "abandoned";
}

const TokenUsageSchema = new Schema<ITokenUsage>(
  {
    operation: {
      type: String,
      required: true,
    },
    inputTokens: {
      type: Number,
      required: true,
    },
    outputTokens: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const TutorSessionSchema = new Schema<ITutorSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    sessionGoal: {
      type: String,
      enum: ["practice", "homework-help", "concept-review", "test-prep", "catch-up", "challenge"],
      required: true,
    },
    inputMode: {
      type: String,
      enum: ["text", "voice"],
      required: true,
    },
    voiceEngine: {
      type: String,
      enum: ["classic", "realtime"],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    whiteboardItemCount: {
      type: Number,
      default: 0,
    },
    tokenUsage: {
      type: [TokenUsageSchema],
      default: [],
    },
    totalInputTokens: {
      type: Number,
      default: 0,
    },
    totalOutputTokens: {
      type: Number,
      default: 0,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Query indexes
TutorSessionSchema.index({ status: 1, startedAt: -1 });
TutorSessionSchema.index({ subject: 1, topic: 1 });

// TTL index: auto-delete after 180 days (also serves as startedAt query index)
TutorSessionSchema.index(
  { startedAt: 1 },
  { expireAfterSeconds: 180 * 24 * 60 * 60 }
);

export const TutorSession =
  mongoose.models.TutorSession ||
  mongoose.model<ITutorSession>("TutorSession", TutorSessionSchema);
