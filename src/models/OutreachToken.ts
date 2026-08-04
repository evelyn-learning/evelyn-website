import mongoose, { Schema, Document } from "mongoose";

export interface IOutreachToken extends Document {
  account: string;
  refreshTokenEnc: string;
  connectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachTokenSchema = new Schema<IOutreachToken>(
  {
    account: { type: String, required: true, unique: true },
    refreshTokenEnc: { type: String, required: true },
    connectedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const OutreachToken =
  mongoose.models.OutreachToken ||
  mongoose.model<IOutreachToken>("OutreachToken", OutreachTokenSchema);
