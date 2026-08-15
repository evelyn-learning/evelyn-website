/**
 * One-off repair for leads the Reply Watcher mislabelled as "replied" when the
 * inbound message was actually a non-delivery report.
 *
 * Before the bounce fix, findInboundReply returned the first thread message
 * that was neither ours nor a draft — which an NDR from mailer-daemon
 * satisfies — so a delivery FAILURE flipped the lead to "replied". This walks
 * every "replied" lead's recorded threads and reclassifies the ones whose
 * thread contains a bounce.
 *
 * Dry run by default; pass --apply to write.
 *
 *   npx tsx scripts/reclassify-bounced-leads.ts
 *   npx tsx scripts/reclassify-bounced-leads.ts --apply
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

const APPLY = process.argv.includes('--apply');

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);

  // Imported AFTER loadEnv ran: gmail.ts reads its OAuth config at module
  // scope, so a top-of-file import would capture it before the env file was.
  const { getThreadMessages } = await import('../apps/marketing/src/lib/outreach/gmail');
  const { isBounceSender } = await import('../apps/marketing/src/lib/outreach/reply-detect');

  const leads = await mongoose.connection
    .collection('leads')
    .find(
      { status: 'replied' },
      { projection: { company: 1, gmailThreadIds: 1, decisionMaker: 1 } },
    )
    .toArray();

  let fixed = 0;
  for (const lead of leads) {
    let bounceFrom: string | null = null;
    for (const t of (lead.gmailThreadIds as string[]) ?? []) {
      try {
        for (const m of await getThreadMessages(t)) {
          if (isBounceSender(m.from)) { bounceFrom = m.from; break; }
        }
      } catch { /* 404s are handled by the watcher's pruning */ }
      if (bounceFrom) break;
    }
    if (!bounceFrom) continue;
    console.log(`RECLASSIFY ${lead.company} — bounce from ${bounceFrom}`);
    if (APPLY) {
      await mongoose.connection.collection('leads').updateOne(
        { _id: lead._id },
        { $set: { status: 'dead', nextActionAt: null, 'decisionMaker.emailVerified': false } },
      );
    }
    fixed++;
  }
  console.log(`\n${APPLY ? 'applied' : 'would reclassify'}: ${fixed} of ${leads.length} 'replied' leads`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('reclassify failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
