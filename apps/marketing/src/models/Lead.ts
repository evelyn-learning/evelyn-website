import mongoose, { Schema, Document } from "mongoose";
import { LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS, EMAIL_SOURCES, LINKEDIN_SOURCES, PRODUCTS, TOUCH_ORIGINS } from "@/lib/outreach/enums";
import type { LeadSegment, LeadStatus, TouchChannel, EmailSource, LinkedinSource, Product, TouchOrigin } from "@/lib/outreach/enums";

// Re-exported for existing server-side `@/models`/`./Lead` importers — no
// breaking change. The canonical source is `@/lib/outreach/enums`, which is
// mongoose-free and safe for client components to import directly (see that
// file's header comment for why this file itself is NOT safe for them).
export { LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS, EMAIL_SOURCES, LINKEDIN_SOURCES, PRODUCTS, TOUCH_ORIGINS };
export type { LeadSegment, LeadStatus, TouchChannel, EmailSource, LinkedinSource, Product, TouchOrigin };

export interface ITouch {
  at: Date;
  channel: TouchChannel;
  direction: "outbound" | "inbound";
  summary: string;
  gmailMessageId?: string;
  // Full-message fields (spec §1). Absent on touches written before the CRM
  // round, which is why `summary` stays required and the UI falls back to it.
  subject?: string;
  body?: string;
  from?: string;
  to?: string;
  // Stable per-message id used for idempotent ingest: `gmail:<messageId>`,
  // `li:<sha1 of conversation+date+body>`, `form:<submissionId>`.
  externalId?: string;
  // Mailbox the message lives in (praveen@ / info@). Email only.
  account?: string;
  origin?: TouchOrigin;
}

export interface IOpportunity {
  product: Product;
  stage: string;
  nextActionAt?: Date | null;
  notes?: string;
  updatedAt: Date;
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
    linkedinProvider?: string;
    // Owner searched LinkedIn and the person has no findable profile —
    // the Today card should stop suggesting a LinkedIn touch for this lead.
    linkedinNotFound?: boolean;
  };
  website: string;
  source: string;
  status: LeadStatus;
  // The organization's own published general inbox (info@/admissions@/
  // support@), used to reach a lead whose decision-maker has no findable
  // personal address. See lib/outreach/recipient.ts for the send-target and
  // greeting rules that hang off it.
  orgEmail?: string;
  orgEmailSourceUrl?: string;
  demoToken?: string;
  demoVisits: IDemoVisit[];
  gmailThreadIds: string[];
  nextActionAt?: Date | null;
  approvedAt?: Date | null;
  touches: ITouch[];
  currentDraft?: ICurrentDraft | null;
  linkedinDraft?: { subject: string; body: string } | null;
  contactFormDraft?: { body: string } | null;
  contactPageUrl?: string;
  notes?: string;
  // Every address ever seen for this organisation's people, lowercased.
  // Matching input for ingest (lib/crm/match-lead.ts); decisionMaker.email
  // is always included here as well.
  emails: string[];
  opportunities: IOpportunity[];
  // Set by ingest when a thread is one outbound message with no reply — the
  // lead is created `staged` so it shows in Review rather than Pipeline.
  needsReview: boolean;
  linkedinConversationIds: string[];
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
    subject: String,
    body: String,
    from: String,
    to: String,
    externalId: String,
    account: String,
    origin: { type: String, enum: TOUCH_ORIGINS },
  },
  { _id: false }
);

const OpportunitySchema = new Schema<IOpportunity>(
  {
    product: { type: String, enum: PRODUCTS, required: true },
    stage: { type: String, required: true },
    nextActionAt: { type: Date, default: null },
    notes: String,
    updatedAt: { type: Date, required: true },
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
      linkedinProvider: String,
      linkedinNotFound: Boolean,
    },
    website: { type: String, default: "" },
    source: { type: String, default: "" },
    status: { type: String, enum: LEAD_STATUSES, default: "staged" },
    orgEmail: String,
    orgEmailSourceUrl: String,
    // When the owner approved the lead — the Today tab's ordering key
    // (lib/outreach/today-order.ts). Absent on leads approved before this
    // field shipped, which is why that module falls back to createdAt.
    approvedAt: { type: Date, default: null },
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
      default: null,
      _id: false,
    },
    contactFormDraft: {
      type: {
        body: { type: String, required: true },
      },
      default: null,
      _id: false,
    },
    contactPageUrl: String,
    notes: String,
    emails: { type: [String], default: [] },
    opportunities: { type: [OpportunitySchema], default: [] },
    needsReview: { type: Boolean, default: false },
    linkedinConversationIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, nextActionAt: 1 });
LeadSchema.index({ segment: 1, status: 1 });
LeadSchema.index({ demoToken: 1 }, { unique: true, sparse: true });
LeadSchema.index({ company: 1, "decisionMaker.email": 1 });
LeadSchema.index({ emails: 1 });
LeadSchema.index({ "touches.externalId": 1 });
LeadSchema.index({ "decisionMaker.linkedinUrl": 1 });
LeadSchema.index({ "opportunities.product": 1, "opportunities.stage": 1 });

export const Lead =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
