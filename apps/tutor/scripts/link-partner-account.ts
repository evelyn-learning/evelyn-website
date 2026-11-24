/**
 * Give a person dashboard access to a partner that already exists (one made by hand before self-serve
 * sign-up, e.g. `lumiq`): writes their owner or member row in `partneraccounts`. They then sign in at
 * /dashboard/login with that email. No secret is touched.
 *
 *   npx tsx scripts/link-partner-account.ts --partner lumiq --email a@b.c --name "Ada" --company "Lumiq" [--member] [--write]
 *
 * DRY RUN unless --write. MONGODB_URI decides the database: 127.0.0.1:2710 on the laptop is the PROD tunnel,
 * and a write there needs Praveen's go-ahead.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { PartnerAccount } from '@/models/PartnerAccount';
import { PartnerModel } from '@/models/Partner';
import { cleanEmail, cleanText } from '@/lib/tutor/partner-dashboard/core';

const arg = (k: string) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : undefined);

async function main() {
  const partnerId = arg('partner'); const email = cleanEmail(arg('email'));
  if (!partnerId || !email) { console.error('need --partner and a valid --email'); process.exit(1); }
  const write = process.argv.includes('--write');
  await connectDB();
  const partner = await PartnerModel.findById(partnerId, { name: 1, kind: 1, status: 1 }).lean<{ name?: string; kind?: string; status?: string } | null>();
  if (!partner) { console.error(`no partner row "${partnerId}"`); process.exit(1); }
  if (partner.kind !== 'partner') { console.error(`"${partnerId}" is kind ${partner.kind}: only a partner gets a dashboard`); process.exit(1); }
  const existing = await PartnerAccount.findOne({ email }).lean<{ partnerId: string } | null>();
  if (existing) { console.error(`${email} already has an account (partner ${existing.partnerId})`); process.exit(1); }
  const row = { email, partnerId, name: cleanText(arg('name'), 60), company: cleanText(arg('company'), 80) || partner.name || partnerId, role: process.argv.includes('--member') ? 'member' as const : 'owner' as const };
  console.log(write ? 'WRITE' : 'dry run (pass --write to apply)', JSON.stringify(row));
  if (write) { await PartnerAccount.create(row); console.log('done'); }
  await mongoose.disconnect();
}
void main().catch((err) => { console.error(err); process.exit(1); });
