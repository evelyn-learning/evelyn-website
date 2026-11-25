/**
 * One line per call to the partner API (/api/portal/v1/*), kept two weeks: what a developer needs when a call
 * fails ("bad signature", "timestamp too old") and what the dashboard's API log shows. No request or response
 * body is kept, and no query string (it can carry a student id). Collection `partnerapilogs`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerApiLog {
  partnerId: string;
  at: Date;
  method: string;
  path: string;
  status: number;
  /** The `error` code of a refused call (the contract's vocabulary), when there is one. */
  error?: string;
  ms: number;
}

const PartnerApiLogSchema = new Schema<IPartnerApiLog>({
  partnerId: { type: String, required: true },
  at: { type: Date, required: true, index: { expireAfterSeconds: 14 * 86400 } },
  method: { type: String, required: true },
  path: { type: String, required: true },
  status: { type: Number, required: true },
  error: { type: String },
  ms: { type: Number, required: true },
}, { versionKey: false });
PartnerApiLogSchema.index({ partnerId: 1, at: -1 });

export const PartnerApiLog: Model<IPartnerApiLog> =
  (mongoose.models.PartnerApiLog as Model<IPartnerApiLog>) ||
  mongoose.model<IPartnerApiLog>('PartnerApiLog', PartnerApiLogSchema);
