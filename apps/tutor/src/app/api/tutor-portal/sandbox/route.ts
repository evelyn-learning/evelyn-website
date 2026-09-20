/**
 * POST /api/tutor-portal/sandbox — the white-label portal's sandbox request
 * form. Stores the lead in Mongo (TutorSandboxRequest) and emails
 * EMAIL_TO (default info@evelynlearning.com) plus an acknowledgement to the
 * requester, using the same SMTP env the marketing contact form uses.
 *
 * The DB write is the record; email is best-effort. The request only fails
 * (500) when BOTH the DB write and the notification email fail, so a lead is
 * never silently dropped while the form reports success.
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectDB } from '@core/db';
import { TutorSandboxRequest } from '@/models/TutorSandboxRequest';

// Simple in-memory rate limiter (same pattern as api/ai/claude/route.ts)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // 3 requests per hour per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

const NOTIFY_TO = () => process.env.EMAIL_TO || 'info@evelynlearning.com';
const FROM = () => `"Evelyn Learning" <${process.env.EMAIL_FROM || 'info@evelynlearning.com'}>`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

interface SandboxLead {
  name: string;
  email: string;
  company: string;
  region: string;
  volume: string;
  website: string;
  useCase: string;
  ip: string;
}

async function sendNotifications(lead: SandboxLead): Promise<boolean> {
  const configured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!configured) {
    console.warn('[Sandbox Request] SMTP not configured — notification email skipped');
    return false;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const rows: Array<[string, string]> = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Company', lead.company],
    ['Region', lead.region],
    ['Expected volume', lead.volume],
    ['Website', lead.website || '(not provided)'],
    ['IP', lead.ip],
  ];
  await transporter.sendMail({
    from: FROM(),
    to: NOTIFY_TO(),
    replyTo: lead.email,
    subject: `Sandbox request: ${lead.company} (${lead.name})`,
    html:
      `<h2>New Voice Tutor sandbox request</h2>` +
      `<table>${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table>` +
      `<p><strong>Use case:</strong></p><p>${escapeHtml(lead.useCase).replace(/\n/g, '<br>')}</p>` +
      `<hr><p><small>Submitted at ${new Date().toISOString()} via tutor.evelynlearning.com/sandbox</small></p>`,
  });

  // Acknowledgement to the requester — best-effort, failure does not matter.
  try {
    await transporter.sendMail({
      from: FROM(),
      to: lead.email,
      subject: 'Your Voice Tutor sandbox request',
      html:
        `<p>Hi ${escapeHtml(lead.name)},</p>` +
        `<p>Thanks for requesting sandbox access to the Evelyn Learning Voice Tutor for ` +
        `${escapeHtml(lead.company)}. We will review it and send your sandbox keys and ` +
        `documentation within 1–2 business days.</p>` +
        `<p>In the meantime you can read the docs at ` +
        `<a href="https://tutor.evelynlearning.com/docs">tutor.evelynlearning.com/docs</a> ` +
        `and try the live demo at ` +
        `<a href="https://tutor.evelynlearning.com/demo">tutor.evelynlearning.com/demo</a>.</p>` +
        `<p>Reply to this email with any questions.</p>` +
        `<p>— Evelyn Learning<br>info@evelynlearning.com</p>`,
    });
  } catch (err) {
    console.warn('[Sandbox Request] acknowledgement email failed', err);
  }
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const lead: SandboxLead = {
    name: str(body.name, 120),
    email: str(body.email, 254).toLowerCase(),
    company: str(body.company, 200),
    region: str(body.region, 80),
    volume: str(body.volume, 80),
    website: str(body.website, 300),
    useCase: str(body.useCase, 4000),
    ip,
  };

  // Basic validation
  if (!lead.name || !lead.email || !lead.company || !lead.region || !lead.volume || !lead.useCase) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  // Email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  console.log('[Sandbox Request]', { ...lead, timestamp: new Date().toISOString() });

  // 1. Durable record.
  let stored: { _id: unknown } | null = null;
  try {
    await connectDB();
    stored = await TutorSandboxRequest.create({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      region: lead.region,
      volume: lead.volume,
      website: lead.website || undefined,
      useCase: lead.useCase,
      clientIp: ip,
      userAgent: request.headers.get('user-agent')?.slice(0, 512) || undefined,
    });
  } catch (err) {
    console.error('[Sandbox Request] Mongo write failed', err);
  }

  // 2. Notification (best-effort).
  let emailSent = false;
  try {
    emailSent = await sendNotifications(lead);
  } catch (err) {
    console.error('[Sandbox Request] notification email failed', err);
  }
  if (stored && emailSent) {
    TutorSandboxRequest.updateOne({ _id: stored._id }, { $set: { emailSent: true } }).catch(() => {});
  }

  if (!stored && !emailSent) {
    return NextResponse.json(
      { error: 'We could not record your request. Please email info@evelynlearning.com.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
