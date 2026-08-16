/**
 * Per-partner request counters (M1c Task 7).
 *
 * TWO documents per request, distinguished by `windowKind`:
 *   'minute' — burst limiting; expires quickly, never read after its window
 *   'day'    — serves BOTH the daily quota and metering, so billing is a
 *              byproduct of the quota write rather than a second code path
 *
 * Shape mirrors PracticeGenCounter: a unique compound key plus a TTL index.
 * `windowStart` is an ISO string so the key is human-readable in Compass.
 *
 * Deliberately NOT exported from src/models/index.ts (unlike PartnerModel):
 * it has exactly one reader, src/lib/tutor/portal/limits.ts. Exporting it
 * would invite a second write path, which is exactly what the day-document
 * "metering is a byproduct of the quota write" design exists to prevent.
 */
import mongoose, { Schema } from 'mongoose';

export interface IPartnerCounter {
  partnerId: string;
  endpoint: string;
  windowKind: 'minute' | 'day';
  windowStart: string;
  count: number;
  createdAt: Date;
}

const PartnerCounterSchema = new Schema<IPartnerCounter>({
  partnerId: { type: String, required: true },
  endpoint: { type: String, required: true },
  windowKind: { type: String, enum: ['minute', 'day'], required: true },
  windowStart: { type: String, required: true },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PartnerCounterSchema.index(
  { partnerId: 1, endpoint: 1, windowKind: 1, windowStart: 1 },
  { unique: true },
);
// 48h is well past the longest window (a day) and matches PracticeGenCounter.
// The day documents are read for billing before they expire; export them if
// billing ever needs a longer horizon than two days.
PartnerCounterSchema.index({ createdAt: 1 }, { expireAfterSeconds: 48 * 60 * 60 });

export const PartnerCounterModel =
  (mongoose.models.PartnerCounter as mongoose.Model<IPartnerCounter>) ||
  mongoose.model<IPartnerCounter>('PartnerCounter', PartnerCounterSchema);
