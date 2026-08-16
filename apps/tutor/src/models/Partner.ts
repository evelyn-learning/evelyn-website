/**
 * MongoDB model for the partner registry (M1c, D15).
 *
 * String _id — the partner slug that arrives in the x-evelyn-partner header.
 *
 * `secrets` is an ARRAY so rotation never has a window where neither the old
 * nor the new secret works: add the new one, both verify, retire the old.
 *
 * `kind`:
 *   'partner'     — a real API caller
 *   'first-party' — owns a student namespace but never authenticates
 *                   (the 'evelyn' row for retail /tutor and showcase users)
 *   'test'        — historical fixture prefixes (lmtest, trial, revtest,
 *                   portalA) that need a valid registry reference without
 *                   appearing in partner lists or billing
 * Only 'partner' rows may authenticate; see withPortalAuth.
 */
import mongoose, { Schema } from 'mongoose';

export interface ISealedSecretDoc {
  ciphertext: string;
  keyVersion: number;
  label: string;
  createdAt: string;
  expiresAt?: string;
}

export interface IPartner {
  _id: string;
  name: string;
  kind: 'partner' | 'first-party' | 'test';
  status: 'active' | 'suspended';
  secrets: ISealedSecretDoc[];
  allowedEndpoints: string[];
  limits: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides: Record<string, boolean | string>;
  metering: { plan?: string };
  createdAt: string;
  updatedAt: string;
}

const SealedSecretSchema = new Schema<ISealedSecretDoc>({
  ciphertext: { type: String, required: true },
  keyVersion: { type: Number, required: true },
  label: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiresAt: { type: String },
}, { _id: false });

const PartnerSchema = new Schema<IPartner>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  kind: { type: String, enum: ['partner', 'first-party', 'test'], required: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  secrets: { type: [SealedSecretSchema], default: [] },
  allowedEndpoints: { type: [String], default: [] },
  limits: {
    rpm: { type: Number, default: 600 },
    burst: { type: Number, default: 60 },
    dailyQuota: { type: Number, default: null },
  },
  flagOverrides: { type: Schema.Types.Mixed, default: {} },
  metering: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { _id: false });

export const PartnerModel =
  (mongoose.models.Partner as mongoose.Model<IPartner>) ||
  mongoose.model<IPartner>('Partner', PartnerSchema);
