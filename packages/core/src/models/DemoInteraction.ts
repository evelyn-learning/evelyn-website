import mongoose, { Schema, Document } from "mongoose";

export interface IGeoLocation {
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  timezone?: string;
  org?: string; // ISP/Organization
}

export interface IDemoInteraction extends Document {
  productId: string;
  productTitle: string;
  eventType: "view" | "try" | "complete";
  sessionId: string;
  timestamp: Date;
  duration?: number; // seconds spent on demo
  deviceType: "mobile" | "tablet" | "desktop";
  referrer?: string;
  userAgent?: string;
  ipHash?: string; // Hashed IP for uniqueness without storing actual IP
  // Location data (from IP geolocation)
  location?: IGeoLocation;
  // Additional user info
  language?: string; // Browser language
  screenSize?: string; // e.g., "1920x1080"
  browserTimezone?: string; // e.g., "America/New_York"
  metadata?: Record<string, unknown>;
}

const DemoInteractionSchema = new Schema<IDemoInteraction>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["view", "try", "complete"],
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number,
    },
    deviceType: {
      type: String,
      enum: ["mobile", "tablet", "desktop"],
      default: "desktop",
    },
    referrer: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipHash: {
      type: String,
    },
    // Location data from IP geolocation
    location: {
      country: String,
      countryCode: String,
      region: String,
      regionName: String,
      city: String,
      timezone: String,
      org: String,
    },
    // Additional user info
    language: {
      type: String,
    },
    screenSize: {
      type: String,
    },
    browserTimezone: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
DemoInteractionSchema.index({ productId: 1, eventType: 1, timestamp: -1 });
DemoInteractionSchema.index({ timestamp: -1 });

export const DemoInteraction =
  mongoose.models.DemoInteraction ||
  mongoose.model<IDemoInteraction>("DemoInteraction", DemoInteractionSchema);
