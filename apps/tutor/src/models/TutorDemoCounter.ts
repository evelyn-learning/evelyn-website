/**
 * TutorDemoCounter — durable quota counters for the anonymous demo gate
 * (demo-abuse restrictions, 2026-08-29). Ported from Crimsora's
 * DemoCounter/dailyCounter pattern (academy repo): one doc per counter key,
 * reserved atomically with `findOneAndUpdate({key, count:{$lt:cap}}, {$inc})`.
 *
 * Mongo-backed ON PURPOSE: every other limiter in this app is an in-memory
 * Map, which resets on each pm2 restart/deploy and is invisible to a second
 * process. Quota state has to survive both.
 *
 * Key namespaces (all UTC-day scoped except email, which lives on
 * TutorDemoLead as a lifetime count):
 *   demo:global:<YYYY-MM-DD>
 *   demo:ip:<ip>:<YYYY-MM-DD>
 *   demo:device:<deviceId>:<YYYY-MM-DD>
 *
 * `expiresAt` carries a TTL index so day counters self-clean — no cron.
 */

import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITutorDemoCounter extends Document {
  key: string;
  count: number;
  expiresAt: Date;
}

const TutorDemoCounterSchema = new Schema<ITutorDemoCounter>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL: Mongo removes the doc once expiresAt passes (sweep granularity ~60s).
TutorDemoCounterSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TutorDemoCounter: Model<ITutorDemoCounter> =
  mongoose.models.TutorDemoCounter ||
  mongoose.model<ITutorDemoCounter>('TutorDemoCounter', TutorDemoCounterSchema);
