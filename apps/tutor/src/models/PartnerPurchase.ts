/**
 * One paid minute pack. The Stripe checkout session id is unique, and the minutes are added to the partner's
 * pool in the same step that writes `creditedAt`: Stripe sends a paid event more than once, and a pack must be
 * credited exactly once. Collection `partnerpurchases`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerPurchase {
  partnerId: string;
  stripeSessionId: string;
  packId: string;
  minutes: number;
  amountCents: number;
  currency: string;
  /** Who started the checkout (a dashboard account's email). */
  by?: string;
  livemode: boolean;
  receiptUrl?: string;
  createdAt: Date;
  creditedAt?: Date;
  /** How the pack was bought: by the buyer at checkout, or by the automatic top-up. */
  kind?: 'checkout' | 'auto_topup';
  /** When the pack's unused minutes lapse (twelve months after they were added). */
  expiresAt?: Date;
  /** Set once the lapse has been applied: the seconds that were still unused and were taken off the pool. */
  expiredAt?: Date;
  expiredSec?: number;
}

const PartnerPurchaseSchema = new Schema<IPartnerPurchase>({
  partnerId: { type: String, required: true },
  stripeSessionId: { type: String, required: true, unique: true },
  packId: { type: String, required: true },
  minutes: { type: Number, required: true },
  amountCents: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  by: { type: String },
  livemode: { type: Boolean, default: false },
  receiptUrl: { type: String },
  creditedAt: { type: Date },
  kind: { type: String },
  expiresAt: { type: Date },
  expiredAt: { type: Date },
  expiredSec: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
PartnerPurchaseSchema.index({ partnerId: 1, createdAt: -1 });
PartnerPurchaseSchema.index({ expiresAt: 1, expiredAt: 1 });

export const PartnerPurchase: Model<IPartnerPurchase> =
  (mongoose.models.PartnerPurchase as Model<IPartnerPurchase>) ||
  mongoose.model<IPartnerPurchase>('PartnerPurchase', PartnerPurchaseSchema);
