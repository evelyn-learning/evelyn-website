/**
 * READ-ONLY diagnostic for the Reply Watcher's 404s.
 *
 * Answers three questions against the LIVE mailbox, using the same OAuth
 * path the watcher itself uses:
 *   1. Which Gmail account are we actually connected to?
 *   2. For each thread id recorded on a lead, does threads.get succeed?
 *   3. For the ones that 404, does the message still exist in Sent under a
 *      DIFFERENT thread id?
 *
 * Makes no writes to Gmail or Mongo.
 *
 *   set -a; source .env.local.production; set +a
 *   npx tsx scripts/diagnose-reply-watcher.ts
 */
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

// Load the env file directly rather than via `set -a; source`. Values in
// .env.local.production contain spaces (NEXT_PUBLIC_SITE_NAME=Evelyn
// Learning), which the shell splits into a bogus command.
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

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);

  // Imported AFTER loadEnv ran: db.ts caches MONGODB_URI at module scope, so
  // a top-of-file import would capture it before the env file was read.
  const { getOutreachGmail, getOutreachAccount } = await import('../src/lib/outreach/gmail');
  const gmail = await getOutreachGmail();

  // 1. Which mailbox are we really talking to?
  const profile = await gmail.users.getProfile({ userId: 'me' });
  console.log(`configured account : ${getOutreachAccount()}`);
  console.log(`OAuth token resolves to: ${profile.data.emailAddress}`);
  console.log(`  messagesTotal=${profile.data.messagesTotal} threadsTotal=${profile.data.threadsTotal}`);
  console.log(
    profile.data.emailAddress === getOutreachAccount()
      ? '  => SAME account\n'
      : '  => *** DIFFERENT ACCOUNT ***\n',
  );

  const leads = await mongoose.connection
    .collection('leads')
    .find(
      { status: { $in: ['contacted', 'parked'] }, gmailThreadIds: { $exists: true, $ne: [] } },
      { projection: { company: 1, gmailThreadIds: 1, touches: 1, decisionMaker: 1 } },
    )
    .toArray();

  type Row = { company: string; threadId: string; email: string };
  const bad: Row[] = [];
  const good: Row[] = [];

  for (const lead of leads) {
    const email = String((lead.decisionMaker as { email?: string } | undefined)?.email ?? '');
    for (const threadId of (lead.gmailThreadIds as string[]) ?? []) {
      const row: Row = { company: String(lead.company ?? '?'), threadId, email };
      try {
        await gmail.users.threads.get({ userId: 'me', id: threadId, format: 'minimal' });
        good.push(row);
      } catch (e) {
        const status = (e as { status?: number }).status;
        bad.push(row);
        console.log(`status=${status}  ${threadId}  ${row.company.slice(0, 30)}`);
      }
    }
  }
  console.log(`\nthreads.get: ${good.length} ok, ${bad.length} failed\n`);

  // 3. Search Sent by RECIPIENT (exact), not by company name — a name search
  //    matches any message mentioning the phrase and produced false pairings
  //    on the first pass. Runs over failing AND working threads, so the
  //    working ones act as a control.
  console.log('--- stored vs. actual thread id, matched on to:<recipient> ---');
  for (const row of [...bad.map((b) => ({ ...b, failed: true })), ...good.map((g) => ({ ...g, failed: false }))]) {
    if (!row.email) {
      console.log(`  ${row.company.slice(0, 26)}: no email on lead, skipped`);
      continue;
    }
    const res = await gmail.users.messages.list({
      userId: 'me', q: `in:sent to:${row.email}`, maxResults: 5,
    });
    const hits = res.data.messages ?? [];
    if (!hits.length) {
      console.log(`  ${row.company.slice(0, 26)} [${row.failed ? 'FAIL' : ' ok '}]: nothing in Sent to ${row.email}`);
      continue;
    }
    const actual = new Set<string>();
    for (const h of hits) {
      const m = await gmail.users.messages.get({ userId: 'me', id: h.id!, format: 'minimal' });
      if (m.data.threadId) actual.add(m.data.threadId);
    }
    const match = actual.has(row.threadId);
    console.log(
      `  [${row.failed ? 'FAIL' : ' ok '}] ${row.company.slice(0, 26)}\n` +
      `        stored : ${row.threadId}\n` +
      `        in Sent: ${[...actual].join(', ')}  ${match ? '(stored id IS the sent thread)' : '<-- stored id is NOT any sent thread'}`,
    );
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('diagnose failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
