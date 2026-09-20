/**
 * TutorSandboxRequest — one doc per submission of the white-label portal's
 * "Request Sandbox Access" form (tutor.evelynlearning.com/sandbox). Until
 * 2026-09-14 the handler only console.logged the request, so a lead could be
 * lost with a pm2 log rotation; now it is the durable record, and the email
 * notification is best-effort on top of it.
 */

import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITutorSandboxRequest extends Document {
  name: string;
  email: string;
  company: string;
  region: string;
  volume: string;
  website?: string;
  useCase: string;
  clientIp?: string;
  userAgent?: string;
  status: 'new' | 'provisioned' | 'declined';
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TutorSandboxRequestSchema = new Schema<ITutorSandboxRequest>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    company: { type: String, required: true, trim: true, maxlength: 200 },
    region: { type: String, required: true, trim: true, maxlength: 80 },
    volume: { type: String, required: true, trim: true, maxlength: 80 },
    website: { type: String, trim: true, maxlength: 300 },
    useCase: { type: String, required: true, trim: true, maxlength: 4000 },
    clientIp: { type: String, maxlength: 64 },
    userAgent: { type: String, maxlength: 512 },
    status: { type: String, enum: ['new', 'provisioned', 'declined'], default: 'new' },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TutorSandboxRequestSchema.index({ email: 1, createdAt: -1 });

export const TutorSandboxRequest: Model<ITutorSandboxRequest> =
  mongoose.models.TutorSandboxRequest ||
  mongoose.model<ITutorSandboxRequest>('TutorSandboxRequest', TutorSandboxRequestSchema);
