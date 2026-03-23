import mongoose, { Schema, Document } from "mongoose";

export interface ITokenUsage {
  operation: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: Date;
  // Realtime API audio/text token breakdown
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
}

export interface ITranscriptEntry {
  role: "student" | "tutor" | "system";
  text: string;
  timestamp: Date;
  whiteboardCommands?: Record<string, unknown>[];
  pedagogicalIntent?: string;
}

export interface IWhiteboardEntry {
  action: string;
  data: Record<string, unknown>;
  timestamp: Date;
  sourceMessageIndex?: number;
}

export interface ITutorSession extends Document {
  sessionId: string;
  studentName?: string;
  subject: string;
  topic: string;
  level: string;
  sessionGoal: "practice" | "homework-help" | "concept-review" | "test-prep" | "catch-up" | "challenge";
  inputMode: "text" | "voice";
  voiceEngine?: "classic" | "realtime" | "realtime-validated" | "gemini-live";
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  messageCount: number;
  whiteboardItemCount: number;
  transcript: ITranscriptEntry[];
  whiteboardCommands: IWhiteboardEntry[];
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
    inputAudioTokens: { type: Number },
    outputAudioTokens: { type: Number },
    inputTextTokens: { type: Number },
    outputTextTokens: { type: Number },
  },
  { _id: false }
);

const TranscriptEntrySchema = new Schema<ITranscriptEntry>(
  {
    role: {
      type: String,
      enum: ["student", "tutor", "system"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    whiteboardCommands: {
      type: [Schema.Types.Mixed],
      default: undefined,
    },
    pedagogicalIntent: {
      type: String,
    },
  },
  { _id: false }
);

const WhiteboardEntrySchema = new Schema<IWhiteboardEntry>(
  {
    action: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sourceMessageIndex: {
      type: Number,
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
      enum: ["classic", "realtime", "realtime-validated", "gemini-live"],
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
    transcript: {
      type: [TranscriptEntrySchema],
      default: [],
    },
    whiteboardCommands: {
      type: [WhiteboardEntrySchema],
      default: [],
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
