/**
 * Repair lead.gmailThreadIds that don't point at the real sent conversation.
 *
 * Background: the console recorded the DRAFT's thread id, but the generated
 * draft was unusable ([DEMO_LINK] unresolved, text/plain), so the operator
 * composed each mail by hand in Gmail. That abandoned the draft's thread, and
 * the sent conversation lives under a different id. Two symptoms:
 *
 *   - stored id 404s   — the draft was later deleted (11 leads)
 *   - stored id exists — but it's the still-unsent draft's own thread, which
 *                        will never carry a reply (1 lead)
 *
 * Either way the real conversation is in Sent and findable by recipient, so
 * the stored id can simply be corrected — no re-sending needed.
 *
 * DRY RUN by default; pass --apply to write.
 *
 *   npx tsx scripts/repair-lead-thread-ids.ts
 *   npx tsx scripts/repair-lead-thread-ids.ts --apply
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

const APPLY = process.argv.includes('--apply');

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(process.env.MONGODB_URI);

  const { getOutreachGmail, httpStatusOf } = await import('../src/lib/outreach/gmail');
  const gmail = await getOutreachGmail();

  const leads = await mongoose.connection
    .collection('leads')
    .find(
      { status: { $in: ['contacted', 'parked'] }, gmailThreadIds: { $exists: true, $ne: [] } },
      { projection: { company: 1, gmailThreadIds: 1, decisionMaker: 1 } },
    )
    .toArray();

  console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} — ${leads.length} leads with recorded threads\n`);

  let repaired = 0;
  let alreadyGood = 0;
  let unresolvable = 0;

  for (const lead of leads) {
    const company = String(lead.company ?? '?');
    const email = String((lead.decisionMaker as { email?: string } | undefined)?.email ?? '');
    const stored: string[] = (lead.gmailThreadIds as string[]) ?? [];

    // The real conversation: the newest message in Sent to this recipient.
    if (!email) {
      console.log(`SKIP  ${company}: no decision-maker email`);
      unresolvable++;
      continue;
    }
    const list = await gmail.users.messages.list({ userId: 'me', q: `in:sent to:${email}`, maxResults: 10 });
    const hits = list.data.messages ?? [];
    if (!hits.length) {
      console.log(`SKIP  ${company}: nothing in Sent to ${email}`);
      unresolvable++;
      continue;
    }

    // messages.list returns newest-first; the intro thread is the OLDEST of
    // that recipient's sent messages, which is what a reply lands on.
    const sentThreadIds: string[] = [];
    for (const h of hits.slice().reverse()) {
      const m = await gmail.users.messages.get({ userId: 'me', id: h.id!, format: 'minimal' });
      if (m.data.threadId && !sentThreadIds.includes(m.data.threadId)) sentThreadIds.push(m.data.threadId);
    }

    // Keep any stored id that IS a real sent thread; replace the rest.
    const keep = stored.filter((id) => sentThreadIds.includes(id));
    const drop = stored.filter((id) => !sentThreadIds.includes(id));

    if (drop.length === 0) {
      alreadyGood++;
      continue;
    }

    // Diagnose each dropped id so the log explains itself.
    for (const id of drop) {
      let why = 'not a sent thread';
      try {
        const t = await gmail.users.threads.get({ userId: 'me', id, format: 'minimal' });
        const msgs = t.data.messages ?? [];
        const allDrafts = msgs.length > 0 && msgs.every((m) => (m.labelIds ?? []).includes('DRAFT'));
        why = allDrafts ? 'points at an unsent draft thread' : 'exists but is not the sent conversation';
      } catch (e) {
        if (httpStatusOf(e) === 404) why = '404 — thread no longer exists';
      }
      console.log(`FIX   ${company}\n        drop ${id}  (${why})`);
    }

    const next = [...keep, ...sentThreadIds.filter((id) => !keep.includes(id))];
    console.log(`        ->   ${next.join(', ')}`);

    if (APPLY) {
      await mongoose.connection
        .collection('leads')
        .updateOne({ _id: lead._id }, { $set: { gmailThreadIds: next } });
    }
    repaired++;
  }

  console.log(
    `\n${APPLY ? 'applied' : 'would repair'}: ${repaired}   already correct: ${alreadyGood}   unresolvable: ${unresolvable}`,
  );
  if (!APPLY) console.log('re-run with --apply to write');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('repair failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
