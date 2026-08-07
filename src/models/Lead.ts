import mongoose, { Schema, Document } from "mongoose";
import { LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS, EMAIL_SOURCES, LINKEDIN_SOURCES } from "@/lib/outreach/enums";
import type { LeadSegment, LeadStatus, TouchChannel, EmailSource, LinkedinSource } from "@/lib/outreach/enums";

// Re-exported for existing server-side `@/models`/`./Lead` importers — no
// breaking change. The canonical source is `@/lib/outreach/enums`, which is
// mongoose-free and safe for client components to import directly (see that
// file's header comment for why this file itself is NOT safe for them).
export { LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS, EMAIL_SOURCES, LINKEDIN_SOURCES };
export type { LeadSegment, LeadStatus, TouchChannel, EmailSource, LinkedinSource };

export interface ITouch {
  at: Date;
  channel: TouchChannel;
  direction: "outbound" | "inbound";
  summary: string;
  gmailMessageId?: string;
}

export interface IDemoVisit {
  at: Date;
  ua: string;
}

export interface ICurrentDraft {
  channel: TouchChannel;
  subject?: string;
  body: string;
  gmailDraftId?: string;
  gmailThreadId?: string;
}

export interface ILead extends Document {
  company: string;
  segment: LeadSegment;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  decisionMaker: {
    name: string;
    title: string;
    linkedinUrl?: string;
    email?: string;
    emailVerified: boolean;
    emailSource?: EmailSource;
    emailProvider?: string;
    linkedinSource?: LinkedinSource;
  };
  website: string;
  source: string;
  status: LeadStatus;
  demoToken?: string;
  demoVisits: IDemoVisit[];
  gmailThreadIds: string[];
  nextActionAt?: Date | null;
  touches: ITouch[];
  currentDraft?: ICurrentDraft | null;
  linkedinDraft?: { subject: string; body: string } | null;
  contactFormDraft?: { body: string } | null;
  contactPageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TouchSchema = new Schema<ITouch>(
  {
    at: { type: Date, required: true },
    channel: { type: String, enum: TOUCH_CHANNELS, required: true },
    direction: { type: String, enum: ["outbound", "inbound"], required: true },
    summary: { type: String, required: true },
    gmailMessageId: String,
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    company: { type: String, required: true, trim: true },
    segment: { type: String, enum: LEAD_SEGMENTS, required: true },
    about: { type: String, default: "" },
    whyFit: { type: String, default: "" },
    useCaseHypothesis: { type: String, default: "" },
    decisionMaker: {
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      linkedinUrl: String,
      email: String,
      emailVerified: { type: Boolean, default: false },
      emailSource: { type: String, enum: EMAIL_SOURCES },
      emailProvider: String,
      linkedinSource: { type: String, enum: LINKEDIN_SOURCES },
    },
    website: { type: String, default: "" },
    source: { type: String, default: "" },
    status: { type: String, enum: LEAD_STATUSES, default: "staged" },
    demoToken: { type: String },
    demoVisits: [{ at: { type: Date, required: true }, ua: { type: String, default: "" }, _id: false }],
    gmailThreadIds: { type: [String], default: [] },
    nextActionAt: { type: Date, default: null },
    touches: { type: [TouchSchema], default: [] },
    currentDraft: {
      type: {
        channel: { type: String, enum: TOUCH_CHANNELS, required: true },
        subject: String,
        body: { type: String, required: true },
        gmailDraftId: String,
        gmailThreadId: String,
      },
      default: null,
      _id: false,
    },
    linkedinDraft: {
      type: {
        subject: { type: String, required: true },
        body: { type: String, required: true },
      },
      _id: false,
    },
    contactFormDraft: {
      type: {
        body: { type: String, required: true },
      },
      _id: false,
    },
    contactPageUrl: String,
    notes: String,
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, nextActionAt: 1 });
LeadSchema.index({ segment: 1, status: 1 });
LeadSchema.index({ demoToken: 1 }, { unique: true, sparse: true });
LeadSchema.index({ company: 1, "decisionMaker.email": 1 });

export const Lead =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
