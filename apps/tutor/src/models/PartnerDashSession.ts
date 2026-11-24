/**
 * A signed-in browser of the partner dashboard. The cookie holds a random token; this row holds its SHA-256,
 * so a session is ended on the server (sign-out, or a member removed) by deleting the row. Mongo drops the row
 * at expiry. Collection `partnerdashsessions`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerDashSession {
  tokenHash: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

const PartnerDashSessionSchema = new Schema<IPartnerDashSession>({
  tokenHash: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const PartnerDashSession: Model<IPartnerDashSession> =
  (mongoose.models.PartnerDashSession as Model<IPartnerDashSession>) ||
  mongoose.model<IPartnerDashSession>('PartnerDashSession', PartnerDashSessionSchema);
