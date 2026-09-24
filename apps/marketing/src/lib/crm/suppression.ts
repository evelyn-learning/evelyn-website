import { normalizeEmail, normalizeLinkedinUrl } from "./identity";
import type { ContactIdentity } from "./match-lead";

// Round 2 §3. Pure, mongoose-free: the key-derivation and query-shape rules
// live here so they can be asserted without a database, and so the delete
// path (which writes the keys) and the create path (which reads them) can
// never disagree about normalisation.
//
// `suppressionQuery` has exactly three query keys: email, LinkedIn URL, and
// LinkedIn conversation key. Gmail thread id is deliberately excluded (round
// 2 final fix wave §4) — see the comment on `suppressionKeysFor`.

export interface SuppressionKeys {
  emails: string[];
  linkedinUrls: string[];
  /** Informational only — see the comment on `suppressionKeysFor` below.
   *  NOT one of `suppressionQuery`'s query keys. */
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
    // Round 2 final fix wave §4 (ruling): stored on the tombstone for the
    // record — which console-sent threads this lead was reachable on — but
    // NOT a `suppressionQuery` key. Wiring it in would mean every future
    // ingest path has to persist `gmailThreadIds` on the lead just so a
    // delete can suppress by it, which enlarges the reply watcher's
    // `label:CRM newer_than:3d` scan (a shared, quota-limited Gmail read)
    // for no operator-visible benefit — a deleted contact is still caught
    // by the email/linkedin/conversation-key arms below.
    gmailThreadIds: uniq(lead.gmailThreadIds ?? []),
    // Conversation keys are already canonical when written (a normalised
    // profile URL or a name slug), so they are only trimmed/deduped here.
    conversationKeys: uniq(lead.linkedinConversationIds ?? []),
  };
}

/**
 * The Mongo filter that answers "has the operator deleted this contact?".
 * Deliberately EXACT-key only, over exactly three keys: email, LinkedIn URL,
 * conversation key. A domain clause would mean deleting one person's lead
 * silently blocks every future colleague at the same organisation. Gmail
 * thread id is NOT a query key — see the comment on `suppressionKeysFor`.
 * Returns null when the identity carries no suppressible key, so a caller
 * can never accidentally issue a match-everything query.
 */
export function suppressionQuery(
  identity: ContactIdentity & { conversationKey?: string }
): Record<string, unknown> | null {
  const or: Record<string, unknown>[] = [];
  const email = identity.email ? normalizeEmail(identity.email) : "";
  if (email) or.push({ emails: email });
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  if (li) or.push({ linkedinUrls: li });
  const key = identity.conversationKey?.trim();
  if (key) or.push({ conversationKeys: key });
  return or.length ? { $or: or } : null;
}
