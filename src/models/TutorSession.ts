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

export interface IDebugEvent {
  type: 'noise_filtered' | 'duplicate_response' | 'whiteboard_false_claim' | 'whiteboard_validation_pass' | 'context_loss' | 'mic_mute' | 'mic_unmute' | 'image_upload' | 'tool_call' | 'tool_call_error' | 'vad_speech_started' | 'vad_speech_stopped' | 'error' | 'info';
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export interface ITutorSession extends Document {
  sessionId: string;
  studentName?: string;
  subject: string;
  topic: string;
  level: string;
  sessionGoal: "practice" | "homework-help" | "concept-review" | "test-prep" | "catch-up" | "challenge";
  inputMode: "text" | "voice";
  voiceEngine?: "classic" | "realtime" | "realtime-2" | "realtime-validated" | "claude-brain" | "gemini-live";
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  messageCount: number;
  whiteboardItemCount: number;
  transcript: ITranscriptEntry[];
  whiteboardCommands: IWhiteboardEntry[];
  tokenUsage: ITokenUsage[];
  debugEvents: IDebugEvent[];
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  status: "active" | "completed" | "abandoned";
  hasAudio?: boolean;
  source?: "tutor" | "embed" | "showcase";
  // Topics the student struggled with this session, ordered by frequency.
  // Populated on session end from the weakness tracker. Future sessions
  // can use this to surface targeted review at the start.
  weakTopics?: Array<{ topic: string; count: number }>;
  // Topics covered in this session, in order of first appearance.
  topicsCovered?: string[];
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

const DebugEventSchema = new Schema<IDebugEvent>(
  {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: Schema.Types.Mixed,
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
      enum: ["classic", "realtime", "realtime-2", "realtime-validated", "claude-brain", "gemini-live"],
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
    debugEvents: {
      type: [DebugEventSchema],
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
    hasAudio: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["tutor", "embed", "showcase"],
      default: "tutor",
    },
    weakTopics: {
      type: [{ topic: String, count: Number }],
      default: [],
    },
    topicsCovered: {
      type: [String],
      default: [],
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
