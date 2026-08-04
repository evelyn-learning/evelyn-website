import { google, gmail_v1 } from "googleapis";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { decryptToken } from "@/lib/crypto/token-encryption";

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
  const mime = [
    `To: ${args.to}`,
    `Subject: ${subject}`,
    ...extraHeaders,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    args.body,
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
