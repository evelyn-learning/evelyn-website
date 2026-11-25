/**
 * What a partner sets for itself in the dashboard: today its webhook. One row per partner (`_id` = partner id),
 * written only by the dashboard. Collection `partnersettings`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerSettings {
  _id: string;
  webhookUrl?: string;
  /** Low-balance and empty-pool emails also go to the partner's owner unless this is false. */
  poolEmails?: boolean;
  /** The partner's customer in Stripe, made at its first checkout (one per Stripe mode). */
  stripeCustomerId?: string;
  stripeCustomerLive?: boolean;
  /** Automatic top-up: buy `packId` again when the minutes left fall to the line (billing.ts topUpLineSec).
   *  `pendingAt` is set while one is being charged, so two usage reports cannot start two. */
  autoTopUp?: { enabled: boolean; packId: string; pendingAt?: Date; lastError?: string; lastAt?: Date };
  updatedAt: Date;
  updatedBy?: string;
}

const PartnerSettingsSchema = new Schema<IPartnerSettings>({
  _id: { type: String, required: true },
  webhookUrl: { type: String },
  poolEmails: { type: Boolean },
  stripeCustomerId: { type: String },
  stripeCustomerLive: { type: Boolean },
  autoTopUp: { type: Schema.Types.Mixed },
  updatedAt: { type: Date, required: true },
  updatedBy: { type: String },
}, { _id: false, versionKey: false });

export const PartnerSettings: Model<IPartnerSettings> =
  (mongoose.models.PartnerSettings as Model<IPartnerSettings>) ||
  mongoose.model<IPartnerSettings>('PartnerSettings', PartnerSettingsSchema);
