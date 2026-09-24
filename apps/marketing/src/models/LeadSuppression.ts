import mongoose, { Schema, Document } from "mongoose";

// Round 2 §3. Deleting a lead is not enough: every ingest path
// (`upsertLeadWithTouches`) would recreate it on the next run from the same
// Gmail thread / LinkedIn conversation / form submission. A suppression row
// is the tombstone — it carries every identity key the matcher could key on
// plus the full lead document, so a delete is reversible ("Restore") and a
// re-import reports the lead under `suppressed` instead of `created`.
export interface ILeadSuppression extends Document {
  /** The _id the lead had before it was deleted, as a string. */
  leadId: string;
  company: string;
  emails: string[];
  linkedinUrls: string[];
  gmailThreadIds: string[];
  /** LinkedIn conversation keys (profile URL, else the name slug). */
  conversationKeys: string[];
  /** The lead's full `toObject()` at delete time — the restore source. */
  snapshot: unknown;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSuppressionSchema = new Schema<ILeadSuppression>(
  {
    leadId: { type: String, required: true },
    company: { type: String, required: true },
    emails: { type: [String], default: [] },
    linkedinUrls: { type: [String], default: [] },
    gmailThreadIds: { type: [String], default: [] },
    conversationKeys: { type: [String], default: [] },
    snapshot: { type: Schema.Types.Mixed, required: true },
    deletedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// One index per key set: `suppressionQuery` builds an $or over exactly these
// four arrays, and the check runs on every would-be lead creation.
LeadSuppressionSchema.index({ emails: 1 });
LeadSuppressionSchema.index({ linkedinUrls: 1 });
LeadSuppressionSchema.index({ conversationKeys: 1 });
LeadSuppressionSchema.index({ gmailThreadIds: 1 });
LeadSuppressionSchema.index({ deletedAt: -1 });

export const LeadSuppression =
  mongoose.models.LeadSuppression ||
  mongoose.model<ILeadSuppression>("LeadSuppression", LeadSuppressionSchema);
