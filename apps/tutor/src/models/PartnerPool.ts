/**
 * Partner minute pool — one row per pooled partner, `_id` = partner slug.
 *
 * `capSec` is the bank of wall-clock tutoring seconds, `usedSec` what the
 * sittings have debited (incremented atomically by partner-pool-store.ts).
 * A partner without a row is not pooled and sees no behaviour change.
 * `sessionMaxSec` / `idleEndSec` override the defaults in partner-pool.ts.
 * `alerts.*At` record when each threshold email went out; a top-up that
 * drops usage back under the line clears them (scripts/ops/partner-pool.sh).
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md
 */
import mongoose, { Schema } from 'mongoose';

export interface IPartnerPool {
  _id: string;
  capSec: number;
  usedSec: number;
  sessionMaxSec?: number;
  idleEndSec?: number;
  alerts?: { pct80At?: string; pct100At?: string };
  updatedAt: string;
}

const PartnerPoolSchema = new Schema<IPartnerPool>({
  _id: { type: String, required: true },
  capSec: { type: Number, required: true, default: 0 },
  usedSec: { type: Number, required: true, default: 0 },
  sessionMaxSec: { type: Number },
  idleEndSec: { type: Number },
  alerts: {
    pct80At: { type: String },
    pct100At: { type: String },
  },
  updatedAt: { type: String, required: true },
}, { _id: false, collection: 'partnerpools' });

export const PartnerPoolModel =
  (mongoose.models.PartnerPool as mongoose.Model<IPartnerPool>) ||
  mongoose.model<IPartnerPool>('PartnerPool', PartnerPoolSchema);
