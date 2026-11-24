/**
 * One emailed sign-in link for the partner dashboard. Only the SHA-256 of the link's token is stored, so a read
 * of this collection signs nobody in. A link works once and for a short time; Mongo drops the row after expiry.
 * A sign-up link carries what the form collected, and the sandbox is created only when the link is used (the
 * email is then proven). Collection `partnerlogintokens`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerLoginToken {
  tokenHash: string;
  email: string;
  purpose: 'signup' | 'login';
  signup?: { name: string; company: string; useCase: string; termsVersion: string };
  ip?: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const PartnerLoginTokenSchema = new Schema<IPartnerLoginToken>({
  tokenHash: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  purpose: { type: String, enum: ['signup', 'login'], required: true },
  signup: { type: Schema.Types.Mixed },
  ip: { type: String },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 3600 } },
  usedAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const PartnerLoginToken: Model<IPartnerLoginToken> =
  (mongoose.models.PartnerLoginToken as Model<IPartnerLoginToken>) ||
  mongoose.model<IPartnerLoginToken>('PartnerLoginToken', PartnerLoginTokenSchema);
