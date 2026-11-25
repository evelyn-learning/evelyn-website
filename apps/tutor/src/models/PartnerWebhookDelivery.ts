/**
 * One webhook event sent (or being sent) to a partner, kept two weeks: the dashboard's delivery log, and the
 * guard that an event is sent once (`partnerId` + `event` + `key` is unique: the key of a session's end is its
 * session id, so two saves of the same ending send one event). Collection `partnerwebhookdeliveries`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerWebhookDelivery {
  partnerId: string;
  event: string;
  key: string;
  url: string;
  at: Date;
  attempts: number;
  /** HTTP status of the last attempt; 0 when it never got an answer. */
  status: number;
  ok: boolean;
  error?: string;
  ms?: number;
}

const PartnerWebhookDeliverySchema = new Schema<IPartnerWebhookDelivery>({
  partnerId: { type: String, required: true },
  event: { type: String, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  at: { type: Date, required: true, index: { expireAfterSeconds: 14 * 86400 } },
  attempts: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  ok: { type: Boolean, default: false },
  error: { type: String },
  ms: { type: Number },
}, { versionKey: false });
PartnerWebhookDeliverySchema.index({ partnerId: 1, event: 1, key: 1 }, { unique: true });
PartnerWebhookDeliverySchema.index({ partnerId: 1, at: -1 });

export const PartnerWebhookDelivery: Model<IPartnerWebhookDelivery> =
  (mongoose.models.PartnerWebhookDelivery as Model<IPartnerWebhookDelivery>) ||
  mongoose.model<IPartnerWebhookDelivery>('PartnerWebhookDelivery', PartnerWebhookDeliverySchema);
