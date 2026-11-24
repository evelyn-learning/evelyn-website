/**
 * A person who can sign in to the partner dashboard (tutor-portal/dashboard): one row per email, tied to one
 * partner (`partners._id`). The owner row is written when the sandbox is created; members are added by an owner.
 *
 * Sign-in is by an emailed link (PartnerLoginToken) and a session cookie (PartnerDashSession): no password is
 * kept anywhere. Collection `partneraccounts`.
 */
import mongoose, { Schema, type Model } from 'mongoose';

export interface IPartnerAccount {
  email: string;
  partnerId: string;
  name: string;
  company: string;
  role: 'owner' | 'member';
  /** What they said they are building (the sign-up form), shown to the owner of Evelyn in the notification. */
  useCase?: string;
  /** The sandbox terms they accepted, and when (owner row; a member accepts on first sign-in). */
  termsVersion?: string;
  termsAcceptedAt?: Date;
  signupIp?: string;
  lastLoginAt?: Date;
  /** Owner row only: stamped once, when the partner's first session is charged (the "first session" email). */
  firstSessionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerAccountSchema = new Schema<IPartnerAccount>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  partnerId: { type: String, required: true, index: true },
  name: { type: String, default: '' },
  company: { type: String, default: '' },
  role: { type: String, enum: ['owner', 'member'], default: 'owner' },
  useCase: { type: String },
  termsVersion: { type: String },
  termsAcceptedAt: { type: Date },
  signupIp: { type: String },
  lastLoginAt: { type: Date },
  firstSessionAt: { type: Date },
}, { timestamps: true });

export const PartnerAccount: Model<IPartnerAccount> =
  (mongoose.models.PartnerAccount as Model<IPartnerAccount>) ||
  mongoose.model<IPartnerAccount>('PartnerAccount', PartnerAccountSchema);
