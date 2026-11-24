/** PATCH /api/tutor-portal/dashboard/account { name?, company? }: the signed-in person's own details. The
 *  company name is the owner's to change. */
import { NextResponse, type NextRequest } from 'next/server';
import { cleanText } from '@/lib/tutor/partner-dashboard/core';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  let body: { name?: unknown; company?: unknown };
  try { body = (await req.json()) as { name?: unknown; company?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  const set: { name?: string; company?: string } = {};
  const name = cleanText(body.name, 60); if (name) set.name = name;
  const company = cleanText(body.company, 80); if (company && a.account.role === 'owner') set.company = company;
  if (Object.keys(set).length) await a.store.updateAccount(a.account.email, set);
  return json({ ok: true, ...set });
}
