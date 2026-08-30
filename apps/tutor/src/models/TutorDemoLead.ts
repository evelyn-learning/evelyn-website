/**
 * TutorDemoLead — one doc per email address that has started an anonymous
 * voice-tutor demo (demo-abuse restrictions, 2026-08-29). Like Crimsora's
 * DemoLead, it is simultaneously the LEAD RECORD (name + email captured by
 * the now-mandatory gate form) and the PER-EMAIL LIFETIME QUOTA COUNTER
 * (`startCount`, reserved atomically the same way TutorDemoCounter is).
 *
 * Email is stored lowercase/trimmed (schema-enforced) so quota lookups can't
 * be evaded by casing or whitespace.
 */

import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITutorDemoLead extends Document {
  email: string;
  name?: string;
  startCount: number;
  lastStartAt?: Date;
  /** Most recent demo-scoped student_id minted for this email. */
  lastStudentId?: string;
  /** Distinct client IPs seen for this email (capped — admin forensics). */
  ips?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TutorDemoLeadSchema = new Schema<ITutorDemoLead>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    name: { type: String, maxlength: 100 },
    startCount: { type: Number, required: true, default: 0 },
    lastStartAt: { type: Date },
    lastStudentId: { type: String, maxlength: 100 },
    ips: { type: [String], default: undefined },
  },
  { timestamps: true },
);

export const TutorDemoLead: Model<ITutorDemoLead> =
  mongoose.models.TutorDemoLead ||
  mongoose.model<ITutorDemoLead>('TutorDemoLead', TutorDemoLeadSchema);
