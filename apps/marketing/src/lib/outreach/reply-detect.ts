export interface ThreadMessageMeta {
  id: string;
  from: string;
  labelIds: string[];
  snippet: string;
  internalDate: number;
}

// Gmail delivers non-delivery reports from mailer-daemon@<host>; other MTAs
// use postmaster@<host>. Anchored on a local-part boundary so a real person
// at "Postmaster General <pg@example.com>" is not swallowed.
const BOUNCE_LOCALPART = /(^|[<\s])(mailer-daemon|postmaster)@/i;

export function isBounceSender(from: string): boolean {
  return BOUNCE_LOCALPART.test(from);
}

export type InboundKind = "reply" | "bounce";

export interface InboundMessage {
  kind: InboundKind;
  gmailMessageId: string;
  from: string;
  snippet: string;
}

/**
 * The first message in the thread that is neither ours nor a draft, tagged
 * with what it actually IS. The previous version returned only the message,
 * so the caller treated a non-delivery report as a reply and flipped the
 * lead to "replied" — the strongest positive signal in the pipeline — on an
 * email that was never delivered (observed on prod 2026-08-14, CCRI).
 *
 * Bounces are scanned for FIRST across the whole list rather than taken in
 * array order: a thread can contain the NDR plus later unrelated traffic,
 * and the delivery failure is the fact that matters.
 */
export function findInboundMessage(
  messages: ThreadMessageMeta[],
  selfEmail: string
): InboundMessage | null {
  const self = selfEmail.toLowerCase();
  const inbound = messages.filter(
    (m) => !m.labelIds.includes("DRAFT") && !m.from.toLowerCase().includes(self)
  );
  const bounce = inbound.find((m) => isBounceSender(m.from));
  const chosen = bounce ?? inbound[0];
  if (!chosen) return null;
  return {
    kind: bounce ? "bounce" : "reply",
    gmailMessageId: chosen.id,
    from: chosen.from,
    snippet: chosen.snippet,
  };
}
