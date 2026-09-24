import { normalizeEmail, normalizeLinkedinUrl } from "./identity";
import type { ContactIdentity } from "./match-lead";

// Round 2 §3. Pure, mongoose-free: the key-derivation and query-shape rules
// live here so they can be asserted without a database, and so the delete
// path (which writes the keys) and the create path (which reads them) can
// never disagree about normalisation.

export interface SuppressionKeys {
  emails: string[];
  linkedinUrls: string[];
  gmailThreadIds: string[];
  conversationKeys: string[];
}

export interface SuppressibleLead {
  emails?: string[];
  decisionMaker?: { email?: string; linkedinUrl?: string };
  gmailThreadIds?: string[];
  linkedinConversationIds?: string[];
}

function uniq(values: (string | undefined | null)[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    const s = (v ?? "").trim();
    if (!s) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

/** Every identity key a future ingest could match this lead on. */
export function suppressionKeysFor(lead: SuppressibleLead): SuppressionKeys {
  return {
    emails: uniq([...(lead.emails ?? []), lead.decisionMaker?.email].map((e) => (e ? normalizeEmail(e) : ""))),
    linkedinUrls: uniq([lead.decisionMaker?.linkedinUrl].map((u) => (u ? normalizeLinkedinUrl(u) : ""))),
    gmailThreadIds: uniq(lead.gmailThreadIds ?? []),
    // Conversation keys are already canonical when written (a normalised
    // profile URL or a name slug), so they are only trimmed/deduped here.
    conversationKeys: uniq(lead.linkedinConversationIds ?? []),
  };
}

/**
 * The Mongo filter that answers "has the operator deleted this contact?".
 * Deliberately EXACT-key only — email, LinkedIn URL, conversation key,
 * Gmail thread id. A domain clause would mean deleting one person's lead
 * silently blocks every future colleague at the same organisation.
 * Returns null when the identity carries no suppressible key, so a caller
 * can never accidentally issue a match-everything query.
 */
export function suppressionQuery(
  identity: ContactIdentity & { conversationKey?: string; gmailThreadIds?: string[] }
): Record<string, unknown> | null {
  const or: Record<string, unknown>[] = [];
  const email = identity.email ? normalizeEmail(identity.email) : "";
  if (email) or.push({ emails: email });
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  if (li) or.push({ linkedinUrls: li });
  const key = identity.conversationKey?.trim();
  if (key) or.push({ conversationKeys: key });
  const threadIds = uniq(identity.gmailThreadIds ?? []);
  if (threadIds.length) or.push({ gmailThreadIds: { $in: threadIds } });
  return or.length ? { $or: or } : null;
}
