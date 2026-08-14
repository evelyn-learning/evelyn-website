/**
 * List (and optionally delete) leftover OUTREACH drafts in the Gmail mailbox.
 *
 * Context: before the draft generator was fixed (22975c4c — [DEMO_LINK]
 * resolution + multipart/alternative), generated drafts were unusable and
 * were abandoned rather than sent. They are dead weight in the mailbox, and
 * one of them was the cause of the Yakima mis-pointing.
 *
 * TWO conditions must BOTH hold before a draft is a deletion candidate:
 *
 *   1. It is addressed to a known lead contact (decisionMaker.email in the
 *      leads collection). This is what makes it an OUTREACH draft. Without
 *      it the mailbox's ordinary personal drafts — on 2026-08-14 that was 6
 *      of the 7 drafts present, some dating to 2013 — look identical to
 *      generator leftovers and get swept up.
 *   2. Its thread is NOT recorded on an active lead. A draft on a live
 *      thread is queued work, not litter.
 *
 * Read-only by default. Gmail's drafts.delete is PERMANENT — it does not
 * route via Trash — so the listing is the gate and --delete is explicit.
 *
 *   npx tsx scripts/prune-abandoned-drafts.ts
 *   npx tsx scripts/prune-abandoned-drafts.ts --delete
 */
import { readFileSync } from 'node:fs';
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

const DELETE = process.argv.includes('--delete');

/** Pull the bare address out of `Name <addr@host>` or a plain address. */
function bareAddress(header: string): string {
  const angled = /<([^>]+)>/.exec(header);
  return (angled ? angled[1] : header).trim().toLowerCase();
}

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);

  const { getOutreachGmail } = await import('../src/lib/outreach/gmail');
  const gmail = await getOutreachGmail();

  const leads = await mongoose.connection
    .collection('leads')
    .find({}, { projection: { company: 1, status: 1, gmailThreadIds: 1, decisionMaker: 1 } })
    .toArray();

  // Condition 1's lookup: every address the outreach pipeline knows about.
  const leadByEmail = new Map<string, string>();
  // Condition 2's lookup: threads still attached to a lead we are working.
  const activeThreads = new Map<string, string>();
  const ACTIVE = new Set(['staged', 'approved', 'contacted', 'parked']);
  for (const lead of leads) {
    const email = String((lead.decisionMaker as { email?: string } | undefined)?.email ?? '')
      .trim()
      .toLowerCase();
    const tag = `${lead.company} [${lead.status}]`;
    if (email) leadByEmail.set(email, tag);
    if (ACTIVE.has(String(lead.status))) {
      for (const t of (lead.gmailThreadIds as string[]) ?? []) activeThreads.set(t, tag);
    }
  }

  const list = await gmail.users.drafts.list({ userId: 'me', maxResults: 100 });
  const drafts = list.data.drafts ?? [];
  console.log(`${drafts.length} draft(s) in the mailbox\n`);

  const removable: { id: string; label: string }[] = [];
  for (const d of drafts) {
    const full = await gmail.users.drafts.get({ userId: 'me', id: d.id!, format: 'metadata' });
    const msg = full.data.message;
    const header = (name: string) =>
      msg?.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? '';
    const to = header('to');
    const when = msg?.internalDate
      ? new Date(Number(msg.internalDate)).toISOString().slice(0, 10)
      : '?';
    const label = `${when}  to=${to || '(no recipient)'}  subj=${header('subject').slice(0, 60)}`;

    const lead = to ? leadByEmail.get(bareAddress(to)) : undefined;
    if (!lead) {
      console.log(`  SKIP    ${label}\n          not addressed to any known lead — not an outreach draft`);
      continue;
    }
    const owner = activeThreads.get(msg?.threadId ?? '');
    if (owner) {
      console.log(`  KEEP    ${label}\n          thread is live on active lead: ${owner}`);
      continue;
    }
    console.log(`  ${DELETE ? 'DELETE' : 'WOULD DELETE'}  ${label}\n          orphaned outreach draft for: ${lead}`);
    removable.push({ id: d.id!, label });
  }

  if (DELETE) {
    for (const r of removable) {
      await gmail.users.drafts.delete({ userId: 'me', id: r.id });
    }
  }
  console.log(
    `\n${DELETE ? 'deleted' : 'would delete'}: ${removable.length} of ${drafts.length} draft(s)`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('prune failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
