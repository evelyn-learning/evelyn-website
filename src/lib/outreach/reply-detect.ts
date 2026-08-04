export interface ThreadMessageMeta {
  id: string;
  from: string;
  labelIds: string[];
  snippet: string;
  internalDate: number;
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
