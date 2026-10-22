/**
 * MongoDB model for TranscriptionCache: the photo read of one set of uploaded
 * images (material-extract `transcribeImagesBatch`), keyed by
 * `transcriptionCacheKey` — the image bytes and types, the vision model and
 * the read prompt's version. It sits behind the engine's 1 h memory map so a
 * re-upload after a restart reproduces the same text (and every problem hits
 * the homework build cache) instead of reading the page again in new words.
 */

import mongoose, { Schema } from 'mongoose';

export interface TranscriptionCacheDoc {
  _id: string;          // the cache key
  texts: string[];      // one transcription per image, in order
  createdAt: Date;
}

const TranscriptionCacheSchema = new Schema<TranscriptionCacheDoc>(
  {
    _id: { type: String, required: true },
    texts: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false, minimize: false, versionKey: false },
);

/** Retention: a read is kept for a week (a student re-uploading the same
 *  sheet within days); Mongo's TTL monitor removes it after that. */
export const TRANSCRIPTION_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;
TranscriptionCacheSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: TRANSCRIPTION_CACHE_TTL_SECONDS, name: 'transcription_cache_ttl' },
);

export const TranscriptionCacheModel =
  (mongoose.models.TranscriptionCache as mongoose.Model<TranscriptionCacheDoc>) ||
  mongoose.model<TranscriptionCacheDoc>('TranscriptionCache', TranscriptionCacheSchema);
