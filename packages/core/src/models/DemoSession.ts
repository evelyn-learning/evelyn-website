import mongoose, { Schema, Document } from "mongoose";
import type { IGeoLocation } from "./DemoInteraction";

export interface IDemoSessionInteraction {
  type: "message" | "click" | "tool_use" | "navigation" | "homework_upload";
  role?: "student" | "tutor";
  content?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface IDemoSessionSummary {
  totalInteractions: number;
  messageCount: number;
  toolsUsed: string[];
  lastActivity: Date;
}

export interface IDemoSession extends Document {
  sessionId: string;
  productId: string;
  productTitle: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  interactions: IDemoSessionInteraction[];
  summary: IDemoSessionSummary;
  deviceType: "mobile" | "tablet" | "desktop";
  ipHash?: string;
  location?: IGeoLocation;
}

const DemoSessionInteractionSchema = new Schema<IDemoSessionInteraction>(
  {
    type: {
      type: String,
      enum: ["message", "click", "tool_use", "navigation", "homework_upload"],
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "tutor"],
    },
    content: {
      type: String,
      maxlength: 2000,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const DemoSessionSchema = new Schema<IDemoSession>(
  {
    sessionId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
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
    interactions: {
      type: [DemoSessionInteractionSchema],
      default: [],
    },
    summary: {
      totalInteractions: { type: Number, default: 0 },
      messageCount: { type: Number, default: 0 },
      toolsUsed: { type: [String], default: [] },
      lastActivity: { type: Date, default: Date.now },
    },
    deviceType: {
      type: String,
      enum: ["mobile", "tablet", "desktop"],
      default: "desktop",
    },
    ipHash: {
      type: String,
    },
    location: {
      country: String,
      countryCode: String,
      region: String,
      regionName: String,
      city: String,
      timezone: String,
      org: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for session + product
DemoSessionSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

// Query indexes
DemoSessionSchema.index({ productId: 1, startedAt: -1 });
DemoSessionSchema.index({ startedAt: -1 });

// TTL index: auto-delete after 90 days
DemoSessionSchema.index({ startedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const DemoSession =
  mongoose.models.DemoSession ||
  mongoose.model<IDemoSession>("DemoSession", DemoSessionSchema);
