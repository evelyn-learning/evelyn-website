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
  const q = matchQuery(args.identity);
  const candidates: MatchableLead[] = q
    ? (await Lead.find(q).select("_id emails decisionMaker.email decisionMaker.linkedinUrl website").lean()).map((c) => ({
        _id: String(c._id), emails: c.emails ?? [], decisionMaker: c.decisionMaker ?? {}, website: c.website ?? "",
      }))
    : [];
  const picked = pickLead(args.identity, candidates);

  let lead: ILead;
  let created = false;
  let matchedBy: MatchBy | "new";
  if (picked) {
    lead = (await Lead.findById(picked.lead._id))!;
    matchedBy = picked.by;
  } else {
    lead = await Lead.create(newLeadFields(args.identity, args.source));
    created = true;
    matchedBy = "new";
  }

  // Grow the identity set so the next ingest matches on email directly.
  const email = args.identity.email ? normalizeEmail(args.identity.email) : "";
  if (email && !lead.emails.includes(email)) lead.emails.push(email);
  if (args.identity.linkedinUrl && !lead.decisionMaker.linkedinUrl) lead.decisionMaker.linkedinUrl = args.identity.linkedinUrl;
  if (args.identity.name && !lead.decisionMaker.name) lead.decisionMaker.name = args.identity.name;
  if (args.linkedinConversationId && !lead.linkedinConversationIds.includes(args.linkedinConversationId)) {
    lead.linkedinConversationIds.push(args.linkedinConversationId);
  }

  const merged = mergeTouches(lead.touches as ITouch[], args.touches);
  lead.touches = merged.touches;
  applyIngestStatus(lead, lead.touches, { created, flagReview: !!args.flagReview });

  if (args.product) {
    const now = new Date();
    const opp = lead.opportunities.find((o) => o.product === args.product);
    if (opp) { opp.stage = lead.status; opp.updatedAt = now; }
    else lead.opportunities.push({ product: args.product, stage: lead.status, nextActionAt: null, updatedAt: now });
  }

  await lead.save();
  return { leadId: String(lead._id), created, added: merged.added, matchedBy };
}
