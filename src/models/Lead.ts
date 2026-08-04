import mongoose, { Schema, Document } from "mongoose";

export const LEAD_SEGMENTS = [
  "nursing_program", "testprep_academy", "homeschool_charter", "microschool",
  "school_district", "private_school", "intl_school", "library",
  "publisher", "agency", "corporate_ld", "other",
] as const;
export type LeadSegment = (typeof LEAD_SEGMENTS)[number];

export const LEAD_STATUSES = [
  "staged", "approved", "contacted", "replied", "call_booked", "parked", "dead",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const TOUCH_CHANNELS = ["email", "linkedin", "form"] as const;
export type TouchChannel = (typeof TOUCH_CHANNELS)[number];

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
