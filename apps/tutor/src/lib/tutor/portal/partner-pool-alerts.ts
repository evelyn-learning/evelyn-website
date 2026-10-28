/**
 * Partner minute pool — threshold emails (80% and 100% of the cap).
 *
 * Sent to PARTNER_POOL_ALERT_TO (default praveen@evelynlearning.com) over the
 * same SMTP transport as the sandbox-request notification. Never throws: a
 * mail failure is logged and the usage save that triggered it still succeeds.
 * After a successful send the pool row is stamped (`alerts.pct80At` /
 * `pct100At`) so the ops script can show and clear it.
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md §4.8
 */
import nodemailer from 'nodemailer';
import type { PoolThreshold } from './partner-pool';

const DEFAULT_TO = 'praveen@evelynlearning.com';

export function poolAlertRecipient(env: string | undefined = process.env.PARTNER_POOL_ALERT_TO): string {
  const v = (env ?? '').trim();
  return v || DEFAULT_TO;
}

export function poolAlertSubject(a: { partnerName: string; usedSec: number; capSec: number }): string {
  const usedMin = Math.round(a.usedSec / 6) / 10;
  const capMin = Math.round(a.capSec / 6) / 10;
  return `${a.partnerName} pool: ${usedMin} of ${capMin} minutes used`;
}

export async function sendPoolAlert(a: {
  partnerId: string;
  partnerName: string;
  usedSec: number;
  capSec: number;
  which: PoolThreshold;
}): Promise<void> {
  try {
    const configured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (!configured) {
      console.warn('[partner-pool] alert skipped, SMTP not configured', a.partnerId, a.which);
      return;
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const remainingMin = Math.round(Math.max(0, a.capSec - a.usedSec) / 6) / 10;
    const pct = a.which === 'pct100' ? '100%' : '80%';
    const text = [
      `${a.partnerName} (${a.partnerId}) has used ${pct} of its tutoring minute pool.`,
      '',
      poolAlertSubject(a),
      `Remaining: ${remainingMin} minutes`,
      '',
      a.which === 'pct100'
        ? 'New sessions are refused and open ones end at their next usage report until the pool is topped up.'
        : 'Sessions keep running. Top up before it reaches 100% to avoid refused starts.',
      '',
      `Top up: bash scripts/ops/partner-pool.sh add ${a.partnerId} <minutes>`,
      `Inspect: bash scripts/ops/partner-pool.sh show ${a.partnerId}`,
    ].join('\n');
    await transporter.sendMail({
      from: `"Evelyn Learning" <${process.env.EMAIL_FROM || 'info@evelynlearning.com'}>`,
      to: poolAlertRecipient(),
      subject: poolAlertSubject(a),
      text,
    });
    try {
      const { PartnerPoolModel } = await import('@/models/PartnerPool');
      const key = a.which === 'pct100' ? 'alerts.pct100At' : 'alerts.pct80At';
      await PartnerPoolModel.updateOne({ _id: a.partnerId }, { $set: { [key]: new Date().toISOString() } });
    } catch (err) {
      console.warn('[partner-pool] alert sent but not stamped', a.partnerId, (err as Error)?.message);
    }
  } catch (err) {
    console.error('[partner-pool] alert failed', a.partnerId, a.which, (err as Error)?.message);
  }
}
