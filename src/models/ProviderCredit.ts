import mongoose, { Schema, Document } from "mongoose";

// Tracks monthly usage against each lead-enrichment provider's free-tier
// cap (Apollo, Hunter, Prospeo). One row per provider+month; `used` is
// incremented as calls are made and clamped to the cap once a provider
// reports exhaustion. See `src/lib/outreach/enrich/ledger.ts` for the
// pure cap logic and the Mongo-backed operations on this model.
export interface IProviderCredit extends Document {
  provider: string;
  month: string;
  used: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderCreditSchema = new Schema<IProviderCredit>(
  {
    provider: { type: String, required: true },
    month: { type: String, required: true },
    used: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProviderCreditSchema.index({ provider: 1, month: 1 }, { unique: true });

export const ProviderCredit =
  mongoose.models.ProviderCredit ||
  mongoose.model<IProviderCredit>("ProviderCredit", ProviderCreditSchema);
