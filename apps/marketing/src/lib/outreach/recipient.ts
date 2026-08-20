// Who an outreach email actually goes to, and how it must therefore open.
//
// The research pipeline only keeps a decision-maker's personal address when
// it is published on a page the server itself fetched (see
// research/verify-email.ts) — correct, but it leaves a large tail of leads
// where we know exactly who to talk to and have no way to reach them. Those
// leads stalled: the Today card hid "Generate intro email" behind
// `dm.email`, and the draft route 400s without a `to`.
//
// The fallback is the organization's own published general inbox
// (`lead.orgEmail` — info@/admissions@/support@ off their contact page). It
// reaches a human at the right organization, which beats not sending.
//
// The catch is the copy. A body written for Martin opens "Hi Martin," — and
// that is plainly wrong arriving at support@, where whoever reads it is not
// Martin. So a generic recipient rewrites the salutation and turns the name
// into a routing request instead.

export interface RecipientLead {
  decisionMaker?: {
    name?: string;
    title?: string;
    email?: string;
  } | null;
  orgEmail?: string;
}

export interface ResolvedRecipient {
  /** The address to send to, or null when the lead has neither. */
  email: string | null;
  /**
   * True when `email` is an organization-level inbox rather than the
   * decision-maker's own — the signal that the draft needs a generic
   * greeting. False when there is no address at all.
   */
  isGeneric: boolean;
}

/** Personal address wins; the org inbox is the fallback. */
export function resolveRecipient(lead: RecipientLead): ResolvedRecipient {
  const personal = lead.decisionMaker?.email?.trim();
  if (personal) return { email: personal, isGeneric: false };
  const org = lead.orgEmail?.trim();
  if (org) return { email: org, isGeneric: true };
  return { email: null, isGeneric: false };
}

// A first line is treated as a salutation when it opens with a greeting word
// AND looks like a salutation rather than a sentence that merely starts with
// one — it ends in `,`/`:`, or it's short. Without that second condition a
// body opening "Hi — I'm writing because your spring cohort intake..." (a
// real sentence, no salutation) would be destroyed.
const SALUTATION_RE = /^(hi|hey|hello|dear|greetings)\b/i;

function isSalutation(line: string): boolean {
  const trimmed = line.trim();
  if (!SALUTATION_RE.test(trimmed)) return false;
  return /[,:]$/.test(trimmed) || trimmed.length <= 40;
}

/** First name only — "Martin Chen" and a body saying just "Martin" still match. */
function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

function mentionsPerson(text: string, name: string): boolean {
  const first = firstNameOf(name);
  if (first.length < 2) return false;
  return new RegExp(`\\b${first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
}

export function routingLineFor(person: { name?: string; title?: string }): string | null {
  const name = person.name?.trim();
  if (!name) return null;
  const title = person.title?.trim();
  return title
    ? `I'm hoping to reach ${name}, your ${title} — if that's not the right person, I'd be grateful for a pointer.`
    : `I'm hoping to reach ${name} — if that's not the right person, I'd be grateful for a pointer.`;
}

/**
 * Rewrite a draft body for delivery to a general inbox.
 *
 * - Any personal salutation becomes "Hello,". A body with no salutation at
 *   all gets one, so the mail never opens mid-pitch.
 * - When we know who we're after and the body doesn't already name them, a
 *   routing sentence goes in right below the greeting — that's what gets a
 *   shared inbox to forward it rather than file it.
 *
 * Idempotent: the routing line names the person, so a second pass sees the
 * name and leaves it alone.
 *
 * This runs deterministically at persist time even though the prompts also
 * ask the model for the right shape, because the recipient can change AFTER
 * the copy is written — verification strips an unpublished personal address,
 * and enrichment adds one. Only a rewrite at save time keeps the salutation
 * and the envelope agreeing.
 */
export function applyGenericGreeting(
  body: string,
  person: { name?: string; title?: string } = {}
): string {
  const normalized = body.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const firstIdx = lines.findIndex((l) => l.trim() !== "");
  if (firstIdx === -1) return body;

  const hadSalutation = isSalutation(lines[firstIdx]!);
  const rest = hadSalutation ? lines.slice(firstIdx + 1) : lines.slice(firstIdx);
  const restText = rest.join("\n");

  const routing = routingLineFor(person);
  const needsRouting = routing !== null && !mentionsPerson(restText, person.name!);

  const out = ["Hello,", ""];
  if (needsRouting) out.push(routing!, "");
  out.push(restText.replace(/^\n+/, ""));

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}
