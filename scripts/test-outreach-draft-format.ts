/**
 * Sends REAL test emails so the draft's rendering can be checked in an inbox.
 *
 * Uses a real generated lead body (the same copy the console would draft) and
 * sends two messages to TEST_TO:
 *   1. BEFORE — bare text/plain with the [DEMO_LINK] token left in, i.e. what
 *      the console produced before this change.
 *   2. AFTER  — multipart/alternative with the demo link resolved.
 *
 * Send them together so the two can be compared side by side in the inbox
 * rather than against a screenshot from days ago.
 *
 *   TEST_TO=someone@example.com npx tsx scripts/test-outreach-draft-format.ts
 *
 * Writes nothing to Mongo. Sends only to TEST_TO — never to a lead.
 */
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';

function loadEnv(path: string): void {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m || line.trimStart().startsWith('#')) continue;
    const [, key, rawValue] = m;
    const value = rawValue.trim().replace(/^(['"])([\s\S]*)\1$/, '$2');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadEnv(process.env.ENV_FILE || '.env.local.production');

const TEST_TO = process.env.TEST_TO;

function b64Part(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
}

async function main(): Promise<void> {
  if (!TEST_TO) throw new Error('TEST_TO is not set — refusing to send');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(process.env.MONGODB_URI);

  const { getOutreachGmail } = await import('../apps/marketing/src/lib/outreach/gmail');
  const { applyDemoLink, demoLinkFor, bodyToHtml } = await import('../apps/marketing/src/lib/outreach/draft-body');
  const gmail = await getOutreachGmail();

  // Real generated copy, so the comparison reflects actual output.
  const lead = await mongoose.connection.collection('leads').findOne(
    { 'currentDraft.channel': 'email', 'currentDraft.body': { $regex: '\\[DEMO_LINK\\]' } },
    { projection: { company: 1, demoToken: 1, currentDraft: 1 } },
  );
  if (!lead) throw new Error('no lead with a [DEMO_LINK] draft found');

  const rawBody: string = lead.currentDraft.body;
  const subject: string = lead.currentDraft.subject || 'Evelyn Learning';
  const demoLink = demoLinkFor(process.env.NEXT_PUBLIC_SITE_URL || '', lead.demoToken as string);
  const fixedBody = applyDemoLink(rawBody, demoLink);

  console.log(`source lead : ${lead.company}`);
  console.log(`demo link   : ${demoLink}`);
  console.log(`sending to  : ${TEST_TO}\n`);

  // 1. BEFORE — exactly the old MIME shape.
  const before = [
    `To: ${TEST_TO}`,
    `Subject: [BEFORE] ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    rawBody,
  ].join('\r\n');
  const beforeRes = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: Buffer.from(before).toString('base64url') },
  });
  console.log(`BEFORE sent: id=${beforeRes.data.id} thread=${beforeRes.data.threadId}`);

  // 2. AFTER — the new MIME shape, mirroring createOutreachDraft.
  const boundary = `evelyn_${randomBytes(16).toString('hex')}`;
  const after = [
    `To: ${TEST_TO}`,
    `Subject: [AFTER] ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Part(fixedBody),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Part(bodyToHtml(fixedBody)),
    `--${boundary}--`,
    '',
  ].join('\r\n');
  const afterRes = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: Buffer.from(after).toString('base64url') },
  });
  console.log(`AFTER  sent: id=${afterRes.data.id} thread=${afterRes.data.threadId}`);

  console.log(`\n[DEMO_LINK] still present? before=${rawBody.includes('[DEMO_LINK]')} after=${fixedBody.includes('[DEMO_LINK]')}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('test send failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
