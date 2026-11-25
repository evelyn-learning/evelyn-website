/**
 * GET /api/tutor-portal/dashboard/webhook: the partner's webhook URL and its last deliveries.
 * PUT { url } (empty to remove): owners only. POST: send a test event and answer with what the receiver said.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';
import { saveWebhookUrl, sendTestWebhook, webhookSettings } from '@/lib/tutor/partner-dashboard/webhooks';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  return json(await webhookSettings(a.account.partnerId));
}

export async function PUT(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  if (a.account.role !== 'owner') return json({ error: 'owner_only' }, 403);
  let body: { url?: unknown };
  try { body = (await req.json()) as { url?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  const r = await saveWebhookUrl(a.account.partnerId, body.url ?? '', a.account.email);
  return r.ok ? json({ ok: true, url: r.url }) : json({ error: r.error }, 400);
}

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  return json(await sendTestWebhook(a.account.partnerId));
}
