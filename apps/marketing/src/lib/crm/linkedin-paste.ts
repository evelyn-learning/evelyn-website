import { createHash } from "node:crypto";
import type { IncomingTouch } from "./touches";

export interface ParsedLinkedin {
  participant: string;
  messages: { from: string; at: Date; body: string; outbound: boolean }[];
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const HEADER_LONG = /^(.+?) sent the following messages? at (\d{1,2}:\d{2}\s?[AP]M)\s*$/i;
const HEADER_SHORT = /^(.+?)\s{2,}(\d{1,2}:\d{2}\s?[AP]M)\s*$/i;
const VIEW_PROFILE = /^View .+?[’']s profile/i;
const EMOJI_ONLY = /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\s️]+$/u;
const NOISE = /^(1st degree connection|· ?1st|Message|Save in Sales Navigator|More)$/i;

function resolveDay(marker: string, now: Date): Date | null {
  const m = marker.trim().toLowerCase();
  const d = new Date(now); d.setHours(0, 0, 0, 0);
  if (m === "today") return d;
  if (m === "yesterday") { d.setDate(d.getDate() - 1); return d; }
  const wd = WEEKDAYS.indexOf(m);
  if (wd !== -1) { const diff = (d.getDay() - wd + 7) % 7 || 7; d.setDate(d.getDate() - diff); return d; }
  const md = m.match(/^([a-z]{3})[a-z]*\.? (\d{1,2})(?:,? (\d{4}))?$/);
  if (md && MONTHS.includes(md[1])) {
    const y = md[3] ? Number(md[3]) : now.getFullYear();
    const cand = new Date(y, MONTHS.indexOf(md[1]), Number(md[2]));
    if (!md[3] && cand > now) cand.setFullYear(y - 1);
    return cand;
  }
  return null;
}

function withTime(day: Date, hhmm: string): Date {
  const m = hhmm.match(/(\d{1,2}):(\d{2})\s?([AP]M)/i)!;
  let h = Number(m[1]) % 12; if (m[3].toUpperCase() === "PM") h += 12;
  const d = new Date(day); d.setHours(h, Number(m[2]), 0, 0); return d;
}

export function parseLinkedinConversation(text: string, opts: { ownerName: string; now?: Date }): ParsedLinkedin {
  const now = opts.now ?? new Date();
  const owner = opts.ownerName.trim().toLowerCase();
  const lines = text.replace(/\r/g, "").split("\n");
  let day = new Date(now); day.setHours(0, 0, 0, 0);
  const messages: ParsedLinkedin["messages"] = [];
  let cur: { from: string; at: Date; lines: string[] } | null = null;
  let pendingHeader: { from: string; time: string } | null = null;

  const flush = () => {
    if (!cur) return;
    const body = cur.lines.map((l) => l.trimEnd()).filter((l) => !EMOJI_ONLY.test(l) || l.trim() === "")
      .join("\n").replace(/\n{3,}/g, "\n\n").trim();
    if (body) messages.push({ from: cur.from, at: cur.at, body, outbound: cur.from.toLowerCase() === owner });
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const dayHit = resolveDay(line, now);
    if (dayHit && line.length <= 20) { day = dayHit; continue; }
    const long = line.match(HEADER_LONG);
    if (long) { flush(); pendingHeader = { from: long[1].trim(), time: long[2] }; continue; }
    if (VIEW_PROFILE.test(line)) continue;
    const short = raw.match(HEADER_SHORT);
    if (short && (!pendingHeader || short[1].trim() === pendingHeader.from)) {
      flush(); cur = { from: short[1].trim(), at: withTime(day, short[2]), lines: [] }; pendingHeader = null; continue;
    }
    if (pendingHeader) { cur = { from: pendingHeader.from, at: withTime(day, pendingHeader.time), lines: [] }; pendingHeader = null; }
    if (!cur) continue; // profile header noise before the first message
    if (NOISE.test(line)) continue;
    cur.lines.push(raw);
  }
  flush();

  const participant = messages.find((m) => !m.outbound)?.from
    ?? lines.map((l) => l.trim()).find((l) => l && l.toLowerCase() !== owner && !NOISE.test(l)) ?? "";
  return { participant, messages };
}

export function linkedinTouches(parsed: ParsedLinkedin, conversationKey: string, origin: "linkedin_paste" | "linkedin_archive" = "linkedin_paste"): IncomingTouch[] {
  return parsed.messages.map((m) => {
    const minute = new Date(m.at); minute.setSeconds(0, 0);
    const id = createHash("sha1").update(`${conversationKey}|${minute.toISOString()}|${m.body}`).digest("hex").slice(0, 24);
    return {
      at: m.at, channel: "linkedin", direction: m.outbound ? "outbound" : "inbound",
      summary: `${m.outbound ? "Sent" : "Received"} (LinkedIn): ${m.body.slice(0, 140).replace(/\s+/g, " ")}`,
      body: m.body, from: m.from, to: m.outbound ? parsed.participant : "me",
      externalId: `li:${id}`, origin,
    };
  });
}
