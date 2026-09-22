import { parseCsv } from "./csv";
import { normalizeLinkedinUrl } from "./identity";

export interface ArchiveConversation {
  conversationId: string;
  participant: { name: string; profileUrl: string; company?: string; title?: string };
  messages: { from: string; at: Date; body: string; outbound: boolean }[];
}

function headerIndex(header: string[]): Record<string, number> {
  const idx: Record<string, number> = {};
  header.forEach((h, i) => { idx[h.trim().toUpperCase()] = i; });
  return idx;
}

/** LinkedIn's Connections.csv starts with a "Notes:" preamble; the real header is the first row containing "First Name". */
function parseConnections(csv?: string): Map<string, { company?: string; title?: string }> {
  const map = new Map<string, { company?: string; title?: string }>();
  if (!csv) return map;
  const rows = parseCsv(csv);
  const hi = rows.findIndex((r) => r.some((c) => c.trim().toLowerCase() === "first name"));
  if (hi === -1) return map;
  const idx = headerIndex(rows[hi]);
  for (const r of rows.slice(hi + 1)) {
    const url = normalizeLinkedinUrl(r[idx["URL"]] ?? "");
    if (!url) continue;
    map.set(url, { company: r[idx["COMPANY"]] || undefined, title: r[idx["POSITION"]] || undefined });
  }
  return map;
}

export function parseArchive(args: { messagesCsv: string; connectionsCsv?: string; ownerProfileUrl: string }): ArchiveConversation[] {
  const owner = normalizeLinkedinUrl(args.ownerProfileUrl);
  const rows = parseCsv(args.messagesCsv);
  if (rows.length < 2) return [];
  const idx = headerIndex(rows[0]);
  const conns = parseConnections(args.connectionsCsv);
  const byConv = new Map<string, ArchiveConversation>();

  for (const r of rows.slice(1)) {
    if (r.length < 5) continue;
    const id = r[idx["CONVERSATION ID"]];
    const folder = idx["FOLDER"] !== undefined ? r[idx["FOLDER"]].trim().toUpperCase() : "INBOX";
    const isDraft = idx["IS MESSAGE DRAFT"] !== undefined && /^yes$/i.test(r[idx["IS MESSAGE DRAFT"]]);
    if (!id || folder !== "INBOX" || isDraft) continue;
    const senderUrl = normalizeLinkedinUrl(r[idx["SENDER PROFILE URL"]] ?? "");
    const outbound = senderUrl === owner;
    const body = (r[idx["CONTENT"]] ?? "").trim();
    if (!body) continue;
    const at = new Date((r[idx["DATE"]] ?? "").replace(" UTC", "Z").replace(" ", "T"));
    if (Number.isNaN(at.getTime())) continue;

    let conv = byConv.get(id);
    if (!conv) {
      const pUrl = outbound ? normalizeLinkedinUrl((r[idx["RECIPIENT PROFILE URLS"]] ?? "").split(",")[0]) : senderUrl;
      const pName = outbound ? (r[idx["TO"]] ?? "").split(",")[0].trim() : (r[idx["FROM"]] ?? "").trim();
      const extra = conns.get(pUrl) ?? {};
      conv = { conversationId: id, participant: { name: pName, profileUrl: pUrl, ...extra }, messages: [] };
      byConv.set(id, conv);
    }
    conv.messages.push({ from: (r[idx["FROM"]] ?? "").trim(), at, body, outbound });
  }

  return [...byConv.values()]
    .filter((c) => c.messages.some((m) => m.outbound))
    .map((c) => ({ ...c, messages: c.messages.sort((a, b) => a.at.getTime() - b.at.getTime()) }));
}
