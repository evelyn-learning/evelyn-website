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

export function findInboundReply(
  messages: ThreadMessageMeta[],
  selfEmail: string
): { gmailMessageId: string; from: string; snippet: string } | null {
  const self = selfEmail.toLowerCase();
  for (const m of messages) {
    if (m.labelIds.includes("DRAFT")) continue;
    if (m.from.toLowerCase().includes(self)) continue;
    return { gmailMessageId: m.id, from: m.from, snippet: m.snippet };
  }
  return null;
}
