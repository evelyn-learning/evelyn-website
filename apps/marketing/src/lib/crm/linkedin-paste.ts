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

// A calendar day, kept independent of any particular Date's local timezone
// so weekday/month arithmetic is unambiguous whichever mode (server-local
// vs browser-relative, see `tzOffsetMinutes` below) is in play.
interface CivilDay { y: number; mo: number; d: number; dow: number }

function civilFromUTC(t: number): CivilDay {
  const d = new Date(t);
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(), dow: d.getUTCDay() };
}

function addDays(c: CivilDay, days: number): CivilDay {
  return civilFromUTC(Date.UTC(c.y, c.mo, c.d) + days * 86400000);
}

function compareCivil(a: CivilDay, b: CivilDay): number {
  const ta = Date.UTC(a.y, a.mo, a.d), tb = Date.UTC(b.y, b.mo, b.d);
  return ta === tb ? 0 : ta < tb ? -1 : 1;
}

// The calendar day `now` falls on. With no `tzOffsetMinutes`, this is the
// server's local day (original behaviour, exercised by the existing
// tests). With it, `now` (a UTC instant) is shifted by the browser's own
// `Date#getTimezoneOffset()` value first, so "today"/weekday markers
// resolve to the calendar day the person pasting the conversation is
// actually on, not the day the parsing machine happens to be on.
function nowCivil(now: Date, tzOffsetMinutes?: number): CivilDay {
  if (tzOffsetMinutes === undefined) {
    return { y: now.getFullYear(), mo: now.getMonth(), d: now.getDate(), dow: now.getDay() };
  }
  return civilFromUTC(now.getTime() - tzOffsetMinutes * 60000);
}

function resolveDay(marker: string, now: Date, tzOffsetMinutes?: number): CivilDay | null {
  const m = marker.trim().toLowerCase();
  const base = nowCivil(now, tzOffsetMinutes);
  if (m === "today") return base;
  if (m === "yesterday") return addDays(base, -1);
  const wd = WEEKDAYS.indexOf(m);
  if (wd !== -1) { const diff = (base.dow - wd + 7) % 7 || 7; return addDays(base, -diff); }
  const md = m.match(/^([a-z]{3})[a-z]*\.? (\d{1,2})(?:,? (\d{4}))?$/);
  if (md && MONTHS.includes(md[1])) {
    const y = md[3] ? Number(md[3]) : base.y;
    let cand: CivilDay = { y, mo: MONTHS.indexOf(md[1]), d: Number(md[2]), dow: 0 };
    if (!md[3] && compareCivil(cand, base) > 0) cand = { ...cand, y: y - 1 };
    return cand;
  }
  return null;
}

function withTime(day: CivilDay, hhmm: string, tzOffsetMinutes?: number): Date {
  const m = hhmm.match(/(\d{1,2}):(\d{2})\s?([AP]M)/i)!;
  let h = Number(m[1]) % 12; if (m[3].toUpperCase() === "PM") h += 12;
  const mins = Number(m[2]);
  if (tzOffsetMinutes === undefined) {
    const d = new Date(day.y, day.mo, day.d); d.setHours(h, mins, 0, 0); return d;
  }
  // `day`/`h`/`mins` are wall-clock numbers in the browser's timezone.
  // Treating them as UTC via Date.UTC and then adding the offset back
  // converts that wall-clock reading into the real UTC instant it denotes.
  return new Date(Date.UTC(day.y, day.mo, day.d, h, mins) + tzOffsetMinutes * 60000);
}

// True when the next non-blank line looks like a message header, i.e. the
// marker in question is a genuine day divider rather than one-word body
// text (a reply of just "Friday" or "Today") sitting between headers.
function nextNonEmptyIsHeader(lines: string[], start: number): boolean {
  for (let j = start; j < lines.length; j++) {
    const t = lines[j].trim();
    if (t === "") continue;
    return HEADER_LONG.test(t) || HEADER_SHORT.test(lines[j]);
  }
  return false;
}

export function parseLinkedinConversation(
  text: string,
  opts: { ownerName: string; now?: Date; tzOffsetMinutes?: number }
): ParsedLinkedin {
  const now = opts.now ?? new Date();
  const tz = opts.tzOffsetMinutes;
  const owner = opts.ownerName.trim().toLowerCase();
  const lines = text.replace(/\r/g, "").split("\n");
  let day = nowCivil(now, tz);
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

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    const dayHit = resolveDay(line, now, tz);
    if (dayHit && line.length <= 20) {
      const betweenMessages = cur === null && pendingHeader === null;
      const followedByHeader = !betweenMessages && nextNonEmptyIsHeader(lines, i + 1);
      if (betweenMessages || followedByHeader) { day = dayHit; continue; }
      // Otherwise this is body text that happens to read like a day
      // marker (e.g. a one-word reply "Friday") — fall through and treat
      // it as ordinary message content below.
    }
    const long = line.match(HEADER_LONG);
    if (long) { flush(); pendingHeader = { from: long[1].trim(), time: long[2] }; continue; }
    if (VIEW_PROFILE.test(line)) continue;
    const short = raw.match(HEADER_SHORT);
    if (short && (!pendingHeader || short[1].trim() === pendingHeader.from)) {
      flush(); cur = { from: short[1].trim(), at: withTime(day, short[2], tz), lines: [] }; pendingHeader = null; continue;
    }
    if (pendingHeader) { cur = { from: pendingHeader.from, at: withTime(day, pendingHeader.time, tz), lines: [] }; pendingHeader = null; }
    if (!cur) continue; // profile header noise before the first message
    if (NOISE.test(line)) continue;
    cur.lines.push(raw);
  }
  flush();

  const participant = messages.find((m) => !m.outbound)?.from
    ?? lines.map((l) => l.trim()).find((l) => l && l.toLowerCase() !== owner && !NOISE.test(l)) ?? "";
  return { participant, messages };
}

// Normalises a message body before hashing so the SAME conversation
// produces the SAME externalId whether it arrives via the paste flow
// (lines joined, emoji-only lines dropped) or the raw CSV CONTENT column
// of an archive export: lowercase, collapse whitespace, strip emoji.
function normalizeForHash(body: string): string {
  return body
    .toLowerCase()
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function linkedinTouches(parsed: ParsedLinkedin, conversationKey: string, origin: "linkedin_paste" | "linkedin_archive" = "linkedin_paste"): IncomingTouch[] {
  return parsed.messages.map((m) => {
    const minute = new Date(m.at); minute.setSeconds(0, 0);
    const id = createHash("sha1").update(`${conversationKey}|${minute.toISOString()}|${normalizeForHash(m.body)}`).digest("hex").slice(0, 24);
    return {
      at: m.at, channel: "linkedin", direction: m.outbound ? "outbound" : "inbound",
      summary: `${m.outbound ? "Sent" : "Received"} (LinkedIn): ${m.body.slice(0, 140).replace(/\s+/g, " ")}`,
      body: m.body, from: m.from, to: m.outbound ? parsed.participant : "me",
      externalId: `li:${id}`, origin,
    };
  });
}
