/**
 * The partner hears about its own minute pool. Until 2026-11-24 the 80% and 100% lines emailed only us
 * (portal/partner-pool-alerts.ts); a self-serve partner has nobody at Evelyn watching for it, so its owner is
 * emailed too, with the way to carry on: buy minutes in the dashboard. A partner with no dashboard account
 * (one set up by hand) gets nothing from here, as before. Never throws.
 */
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerAccount } from '@/models/PartnerAccount';
import { PartnerSettings } from '@/models/PartnerSettings';
import { dashboardOrigin } from './core';
import { sendDashboardMail } from './mailer';

export function poolNoticeMail(which: 'pct80' | 'pct100', company: string, usedSec: number, capSec: number, origin: string): { subject: string; text: string } {
  const left = Math.round(Math.max(0, capSec - usedSec) / 6) / 10;
  const cap = Math.round(capSec / 60);
  const who = company || 'Your account';
  return which === 'pct100'
    ? { subject: 'Your Evelyn Voice Tutor minutes are used up', text: `${who} has used all ${cap} of its tutoring minutes. New sessions are refused until minutes are added.\n\nAdd minutes: ${origin}/dashboard/billing\n\nEvelyn Learning` }
    : { subject: 'Your Evelyn Voice Tutor minutes are running low', text: `${who} has used 80% of its ${cap} tutoring minutes; ${left} minutes are left. Sessions keep running until they are used up.\n\nAdd minutes: ${origin}/dashboard/billing\n\nEvelyn Learning` };
}

/** A plain note to every owner of a partner's dashboard (billing events). Never throws. */
export async function mailPartnerOwners(partnerId: string, subject: string, text: string): Promise<void> {
  if (!isDBConfigured()) return;
  try {
    await connectDB();
    const owners = await PartnerAccount.find({ partnerId, role: 'owner' }, { email: 1 }).lean<Array<{ email: string }>>();
    for (const o of owners) await sendDashboardMail({ to: o.email, subject, text, html: `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>` });
  } catch (err) { console.warn('[partner-dashboard] owner mail failed', partnerId, (err as Error)?.message); }
}

export function notifyPartnerOfPoolLine(partnerId: string, which: 'pct80' | 'pct100', usedSec: number, capSec: number): void {
  if (!isDBConfigured()) return;
  void (async () => {
    try {
      await connectDB();
      const [owners, settings] = await Promise.all([
        PartnerAccount.find({ partnerId, role: 'owner' }, { email: 1, company: 1 }).lean<Array<{ email: string; company?: string }>>(),
        PartnerSettings.findById(partnerId, { poolEmails: 1 }).lean<{ poolEmails?: boolean } | null>(),
      ]);
      if (!owners.length || settings?.poolEmails === false) return;
      const m = poolNoticeMail(which, owners[0]!.company || '', usedSec, capSec, dashboardOrigin());
      for (const o of owners) await sendDashboardMail({ to: o.email, subject: m.subject, text: m.text, html: `<p>${m.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>` });
    } catch (err) { console.warn('[partner-dashboard] pool notice failed', partnerId, (err as Error)?.message); }
  })();
}
