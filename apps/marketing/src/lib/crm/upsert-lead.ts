import { connectDB } from "@core/db";
import { Lead, type ILead, type ITouch, type Product } from "@/models";
import { matchQuery, newLeadFields, pickLead, type ContactIdentity, type MatchBy, type MatchableLead } from "./match-lead";
import { mergeTouches, applyIngestStatus, type IncomingTouch } from "./touches";
import { normalizeEmail } from "./identity";

export interface UpsertArgs {
  identity: ContactIdentity;
  touches: IncomingTouch[];
  source: string;
  product?: Product;
  flagReview?: boolean;
  linkedinConversationId?: string;
}

export async function upsertLeadWithTouches(args: UpsertArgs) {
  await connectDB();

  let lead: ILead | null = null;
  let matchedBy: MatchBy | "new" = "new";

  // A LinkedIn paste/bookmarklet import keys its conversation by the
  // profile URL when known, else the participant-name slug (see the
  // ingest route). Without a profile URL, `matchQuery`/`pickLead` have
  // nothing to match on (no email, no linkedinUrl) and would create a
  // fresh lead on every re-import. The conversation key is itself a
  // stable identity once a lead has been ingested once, so check it
  // first — this intentionally means two different people with the same
  // name and no profile URL share a lead (accepted tradeoff).
  if (args.linkedinConversationId) {
    lead = await Lead.findOne({ linkedinConversationIds: args.linkedinConversationId });
    if (lead) matchedBy = "conversation";
  }

  if (!lead) {
    const q = matchQuery(args.identity);
    const candidates: MatchableLead[] = q
      ? (await Lead.find(q).select("_id emails decisionMaker.email decisionMaker.linkedinUrl website").lean()).map((c) => ({
          _id: String(c._id), emails: c.emails ?? [], decisionMaker: c.decisionMaker ?? {}, website: c.website ?? "",
        }))
      : [];
    const picked = pickLead(args.identity, candidates);
    if (picked) {
      lead = (await Lead.findById(picked.lead._id))!;
      matchedBy = picked.by;
    }
  }

  let created = false;
  if (!lead) {
    lead = await Lead.create(newLeadFields(args.identity, args.source));
    created = true;
    matchedBy = "new";
  }
  if (!lead) throw new Error("upsertLeadWithTouches: unreachable — lead is always found or created above");

  // Grow the identity set so the next ingest matches on email directly.
  const email = args.identity.email ? normalizeEmail(args.identity.email) : "";
  if (email && !lead.emails.includes(email)) lead.emails.push(email);
  if (args.identity.linkedinUrl && !lead.decisionMaker.linkedinUrl) lead.decisionMaker.linkedinUrl = args.identity.linkedinUrl;
  if (args.identity.name && !lead.decisionMaker.name) lead.decisionMaker.name = args.identity.name;
  if (args.linkedinConversationId && !lead.linkedinConversationIds.includes(args.linkedinConversationId)) {
    lead.linkedinConversationIds.push(args.linkedinConversationId);
  }

  const merged = mergeTouches(lead.touches as ITouch[], args.touches);

  // The CRM-label cron re-scans `label:CRM newer_than:3d` every 15 minutes,
  // so a no-op re-ingest (this thread has nothing new) must not re-run
  // status effects: applyIngestStatus would otherwise flip a lead an
  // operator has since moved to parked/contacted back to `replied` on every
  // tick. Only reassign `lead.touches` and run status effects when there's
  // actually something new — reassigning the (content-identical) merged
  // array unconditionally would itself mark the document modified.
  if (merged.added > 0) {
    lead.touches = merged.touches;
    applyIngestStatus(lead, merged.fresh, { created, flagReview: !!args.flagReview });
  }

  // Round 2 §1: one product per lead. The first ingest path that knows the
  // product sets it; later ingests never overwrite it, because the operator
  // may have corrected it in the Pipeline since.
  if (args.product && !lead.product) lead.product = args.product;

  if (lead.isModified()) await lead.save();
  return { leadId: String(lead._id), created, added: merged.added, matchedBy };
}
