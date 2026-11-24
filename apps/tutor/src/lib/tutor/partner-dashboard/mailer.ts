/**
 * The dashboard's outgoing mail: sign-in links to partners, and notes to us. The same SMTP settings the sandbox
 * form and the pool alerts use. False (and a log line) when mail is not configured or the send fails: a caller
 * decides what that means for it.
 */
import nodemailer from 'nodemailer';
import type { Mail } from './service';

export async function sendDashboardMail(mail: Mail): Promise<boolean> {
  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    console.warn('[partner-dashboard] mail skipped, SMTP not configured:', mail.subject);
    // A developer's machine has no mail: the text (and so the sign-in link) goes to the server log there. Never in
    // production, where a link in a log would sign in whoever reads the log.
    if (process.env.NODE_ENV !== 'production') console.log(`[partner-dashboard] mail to ${mail.to}:\n${mail.text}`);
    return false;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Evelyn Learning" <${process.env.EMAIL_FROM || 'info@evelynlearning.com'}>`,
      to: mail.to, subject: mail.subject, text: mail.text, html: mail.html,
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    });
    return true;
  } catch (err) {
    console.error('[partner-dashboard] mail failed:', mail.subject, (err as Error)?.message);
    return false;
  }
}

/** Where notes about sign-ups and first sessions go. */
export function dashboardOwnerEmail(env: NodeJS.ProcessEnv = process.env): string {
  return env.PARTNER_SIGNUP_NOTIFY_TO || env.PARTNER_POOL_ALERT_TO || 'praveen@evelynlearning.com';
}
