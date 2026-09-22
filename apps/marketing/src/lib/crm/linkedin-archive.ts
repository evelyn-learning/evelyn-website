import { parseCsv } from "./csv";
import { normalizeLinkedinUrl } from "./identity";

export interface ArchiveConversation {
  conversationId: string;
  participant: { name: string; profileUrl: string; company?: string; title?: string };
  messages: { from: string; at: Date; body: string; outbound: boolean }[];
}

export interface ArchiveDetailed {
  conversations: ArchiveConversation[];
  skippedNoOwnerMessage: number;
  skippedGroup: number;
}

interface ArchiveRow {
  from: string;
  senderUrl: string;
  outbound: boolean;
  body: string;
  at: Date;
  recipientUrls: string[];
  toRaw: string;
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

/**
 * LinkedIn's export omits a timezone offset on some rows (only " UTC" is
 * ever present when it is present at all). Absent any offset/Z suffix,
 * force UTC rather than letting `Date` fall back to parsing the string as
 * local time on whichever machine runs this.
 */
function parseArchiveDate(raw: string): Date | null {
  let s = (raw ?? "").replace(" UTC", "Z").replace(" ", "T");
  if (s && !/[Zz]$/.test(s) && !/[+-]\d{2}:?\d{2}$/.test(s)) s += "Z";
  const at = new Date(s);
  return Number.isNaN(at.getTime()) ? null : at;
}

export function parseArchiveDetailed(args: { messagesCsv: string; connectionsCsv?: string; ownerProfileUrl: string }): ArchiveDetailed {
  const owner = normalizeLinkedinUrl(args.ownerProfileUrl);
  const rows = parseCsv(args.messagesCsv);
  if (rows.length < 2) return { conversations: [], skippedNoOwnerMessage: 0, skippedGroup: 0 };
  const idx = headerIndex(rows[0]);
  const conns = parseConnections(args.connectionsCsv);
  const byConv = new Map<string, ArchiveRow[]>();

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
    const at = parseArchiveDate(r[idx["DATE"]] ?? "");
    if (!at) continue;
    const recipientUrls = (r[idx["RECIPIENT PROFILE URLS"]] ?? "")
      .split(",")
      .map((u) => normalizeLinkedinUrl(u))
      .filter(Boolean);

    const list = byConv.get(id) ?? [];
    list.push({ from: (r[idx["FROM"]] ?? "").trim(), senderUrl, outbound, body, at, recipientUrls, toRaw: r[idx["TO"]] ?? "" });
    byConv.set(id, list);
  }

  const conversations: ArchiveConversation[] = [];
  let skippedNoOwnerMessage = 0;
  let skippedGroup = 0;

  for (const [id, msgs] of byConv) {
    // A conversation is a GROUP thread (>2 participants) when any row lists
    // more than one recipient, or more than one distinct non-owner sender
    // appears across the thread. Group threads aren't 1:1 outreach — the
    // CRM models one lead per organisation/person, so they're excluded
    // rather than mis-attributed to whichever participant appeared first.
    const nonOwnerSenders = new Set(msgs.filter((m) => !m.outbound).map((m) => m.senderUrl).filter(Boolean));
    const isGroup = msgs.some((m) => m.recipientUrls.length > 1) || nonOwnerSenders.size > 1;
    if (isGroup) { skippedGroup++; continue; }

    if (!msgs.some((m) => m.outbound)) { skippedNoOwnerMessage++; continue; }

    const first = msgs[0];
    const pUrl = first.outbound ? (first.recipientUrls[0] ?? "") : first.senderUrl;
    const pName = first.outbound ? first.toRaw.split(",")[0].trim() : first.from;
    const extra = conns.get(pUrl) ?? {};

    conversations.push({
      conversationId: id,
      participant: { name: pName, profileUrl: pUrl, ...extra },
      messages: msgs
        .map((m) => ({ from: m.from, at: m.at, body: m.body, outbound: m.outbound }))
        .sort((a, b) => a.at.getTime() - b.at.getTime()),
    });
  }

  return { conversations, skippedNoOwnerMessage, skippedGroup };
}

export function parseArchive(args: { messagesCsv: string; connectionsCsv?: string; ownerProfileUrl: string }): ArchiveConversation[] {
  return parseArchiveDetailed(args).conversations;
}
