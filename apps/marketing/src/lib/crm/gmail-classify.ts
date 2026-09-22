import type { FullMessage } from "@/lib/outreach/gmail";
import type { ContactIdentity } from "./match-lead";
import type { IncomingTouch } from "./touches";
import { isSelfAddress, normalizeEmail } from "./identity";

export const AUTO_REPLY_SUBJECT = "Thank you for contacting Evelyn Learning";
export const SELF_NOTIFICATION_PREFIX = "New Contact Form Submission:";
const MACHINE_RE = /(^|[<\s.@-])(no-?reply|notifications?|billing|calendar|mailer-daemon|postmaster|apollo\.io|hunter\.io|prospeo)/i;

export type SkipReason = "auto_reply_only" | "self_notification" | "internal" | "machine" | "empty";
export type ThreadVerdict =
  | { keep: false; reason: SkipReason }
  | { keep: true; flagReview: boolean; identity: ContactIdentity; touches: IncomingTouch[] };

function displayName(addr: string): string {
  const m = addr.match(/^\s*"?([^"<]+?)"?\s*<[^>]+>/);
  return m ? m[1].trim() : "";
}

function splitAddresses(field: string): string[] {
  return field.split(",").map((s) => s.trim()).filter(Boolean);
}

export function classifyThread(messages: FullMessage[], account: string): ThreadVerdict {
  const msgs = messages.filter((m) => !m.labelIds.includes("DRAFT")).sort((a, b) => a.date - b.date);
  if (msgs.length === 0) return { keep: false, reason: "empty" };

  if (msgs.some((m) => m.subject.trim().startsWith(SELF_NOTIFICATION_PREFIX))) return { keep: false, reason: "self_notification" };

  const all = msgs.flatMap((m) => [...splitAddresses(m.from), ...splitAddresses(m.to)]);
  if (all.some((a) => MACHINE_RE.test(a))) return { keep: false, reason: "machine" };

  const external = all.filter((a) => !isSelfAddress(a));
  if (external.length === 0) return { keep: false, reason: "internal" };

  const selfMsgs = msgs.filter((m) => isSelfAddress(m.from));
  if (selfMsgs.length > 0 && selfMsgs.every((m) => m.subject.trim() === AUTO_REPLY_SUBJECT)) {
    // Kept only if an external person wrote back — otherwise this is just
    // the auto-reply firing with nothing else in the thread.
    const inboundHuman = msgs.some((m) => !isSelfAddress(m.from));
    if (!inboundHuman) return { keep: false, reason: "auto_reply_only" };
  }

  // Identity email = first external participant (the To of our first send,
  // or the From of their first message). Identity name = the first non-empty
  // display name found for that same address anywhere in the thread (R3):
  // our own first send may only have addressed the bare address, with the
  // display name only showing up later, e.g. in their reply's From header.
  const firstExternal = external[0];
  const firstExternalEmail = normalizeEmail(firstExternal);
  let name: string | undefined;
  for (const addr of all) {
    if (normalizeEmail(addr) !== firstExternalEmail) continue;
    const found = displayName(addr);
    if (found) { name = found; break; }
  }
  const identity: ContactIdentity = { email: firstExternalEmail, name };

  const touches: IncomingTouch[] = msgs.map((m) => {
    const outbound = isSelfAddress(m.from);
    return {
      at: new Date(m.date),
      channel: "email",
      direction: outbound ? "outbound" : "inbound",
      summary: `${outbound ? "Sent" : "Received"}: ${m.subject || "(no subject)"} — ${m.text.slice(0, 120).replace(/\s+/g, " ")}`,
      subject: m.subject, body: m.text, from: m.from, to: m.to,
      externalId: `gmail:${m.id}`, gmailMessageId: m.id, account, origin: "gmail_import",
    };
  });

  const flagReview = touches.length === 1 && touches[0].direction === "outbound";
  return { keep: true, flagReview, identity, touches };
}
