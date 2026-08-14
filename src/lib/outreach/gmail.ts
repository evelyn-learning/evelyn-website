import { randomBytes } from "node:crypto";
import { google, gmail_v1 } from "googleapis";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { decryptToken } from "@/lib/crypto/token-encryption";
import { bodyToHtml } from "./draft-body";

export const GMAIL_OUTREACH_SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function getOutreachAccount(): string {
  return process.env.GMAIL_OUTREACH_USER || "praveen@evelynlearning.com";
}

export function getOutreachOAuthClient() {
  const id = process.env.GMAIL_OUTREACH_CLIENT_ID;
  const secret = process.env.GMAIL_OUTREACH_CLIENT_SECRET;
  const callback = process.env.GMAIL_OUTREACH_CALLBACK_URL;
  if (!id || !secret || !callback) throw new Error("GMAIL_OUTREACH_* env not configured");
  return new google.auth.OAuth2(id, secret, callback);
}

export async function getOutreachGmail(): Promise<gmail_v1.Gmail> {
  await connectDB();
  const doc = await OutreachToken.findOne({ account: getOutreachAccount() });
  if (!doc) throw new Error("GMAIL_NOT_CONNECTED");
  const auth = getOutreachOAuthClient();
  auth.setCredentials({ refresh_token: decryptToken(doc.refreshTokenEnc) });
  return google.gmail({ version: "v1", auth });
}

// Subjects are LLM-written cold-email copy (em dashes, curly quotes,
// etc. near-certain) landing directly in a raw MIME header line. A raw
// non-ASCII `Subject:` header is undefined behavior per RFC 5322/2047 — most
// mail clients (Outlook especially) will mangle it into mojibake rather than
// reject it outright, which is worse for a cold-outreach send since it's
// silent. Encode as RFC 2047 "B" (base64) encoded-word when the subject
// contains any non-ASCII byte; leave plain ASCII subjects untouched (no
// reason to pay the encoding overhead when it's not needed).
function encodeMimeSubject(subject: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(subject)) return subject;
  const b64 = Buffer.from(subject, "utf8").toString("base64");
  return `=?UTF-8?B?${b64}?=`;
}

function assertSafeHeaderValue(value: string, field: string): void {
  // `to`/`subject` land straight into raw MIME header lines below. `subject`
  // in particular originates from LLM-generated draft content persisted on
  // Lead — not a trusted constant — so a CR/LF in either would let an
  // attacker inject arbitrary headers (Bcc, Reply-To, ...) or a header/body
  // separator.
  if (/[\r\n]/.test(value)) {
    throw new Error(`Invalid ${field}: contains CR/LF`);
  }
}

export async function createOutreachDraft(args: {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}) {
  assertSafeHeaderValue(args.to, "to");
  assertSafeHeaderValue(args.subject, "subject");

  const gmail = await getOutreachGmail();
  let subject = args.subject;
  const extraHeaders: string[] = [];
  if (args.threadId) {
    // Reply into an existing thread: Re:-subject + In-Reply-To/References
    // from the thread's latest Message-ID. Drafts (including ones this same
    // console left behind) can sit in the thread and are excluded — they're
    // frequently the array's last element, and an unsent draft typically has
    // no Message-ID header (Gmail assigns it at send time), so trusting
    // array position silently degrades the reply to a subject-only stitch.
    const messages = await getThreadMessages(args.threadId);
    const sent = messages.filter((m) => !m.labelIds.includes("DRAFT"));
    const latest = sent.length
      ? sent.reduce((a, b) => (b.internalDate > a.internalDate ? b : a))
      : undefined;
    if (latest?.messageIdHeader) {
      extraHeaders.push(`In-Reply-To: ${latest.messageIdHeader}`);
      extraHeaders.push(`References: ${latest.messageIdHeader}`);
    }
    const original = latest?.subject || args.subject;
    assertSafeHeaderValue(original, "thread subject");
    subject = /^re:/i.test(original) ? original : `Re: ${original}`;
  }
  // multipart/alternative (text + HTML), not bare text/plain.
  //
  // A text/plain message is rendered by Gmail in a narrow fixed-width column
  // with its own wrapping. The generated body has no wrapping of its own —
  // paragraphs run past 400 characters — so drafts arrived looking hard-
  // wrapped and machine-made next to a hand-composed message, which is
  // multipart/alternative. Both parts are base64'd with an explicit
  // Content-Transfer-Encoding: the body is LLM-written and reliably contains
  // em dashes and curly quotes, and 8-bit content on 400-char lines with no
  // declared encoding is exactly what mangles in transit.
  const boundary = `evelyn_${randomBytes(16).toString("hex")}`;
  const b64Part = (s: string) => Buffer.from(s, "utf8").toString("base64").replace(/(.{76})/g, "$1\r\n");
  const mime = [
    `To: ${args.to}`,
    `Subject: ${encodeMimeSubject(subject)}`,
    "MIME-Version: 1.0",
    ...extraHeaders,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64Part(args.body),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64Part(bodyToHtml(args.body)),
    `--${boundary}--`,
    "",
  ].join("\r\n");
  const raw = Buffer.from(mime).toString("base64url");
  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw, ...(args.threadId ? { threadId: args.threadId } : {}) } },
  });
  const draftId = res.data.id ?? "";
  const threadId = res.data.message?.threadId ?? "";
  if (!draftId || !threadId) throw new Error("Draft create returned no id/threadId");
  return { draftId, threadId };
}

export async function getThreadMessages(threadId: string) {
  const gmail = await getOutreachGmail();
  const res = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "metadata",
    metadataHeaders: ["From", "Message-ID", "Subject"],
  });
  const header = (m: gmail_v1.Schema$Message, name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  return (res.data.messages ?? []).map((m) => ({
    id: m.id ?? "",
    from: header(m, "from"),
    subject: header(m, "subject"),
    messageIdHeader: header(m, "message-id"),
    labelIds: m.labelIds ?? [],
    snippet: m.snippet ?? "",
    internalDate: Number(m.internalDate ?? 0),
  }));
}
