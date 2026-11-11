/**
 * Tester's flags for tutor brain v2 — LOCAL DEVELOPMENT ONLY.
 *
 * While testing a live session the tester presses a key, says what went wrong, and carries on; the note, the
 * turn it happened on and the board at that moment are written here, to files in the working copy
 * (apps/tutor/.v2-flags/<session>/), together with any screenshots taken. Nothing goes to a database, so it
 * works when a session fails to save. A production build answers 404.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

const safe = (s: string | null, fallback: string) => (s ?? '').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 80) || fallback;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const url = new URL(req.url);
  const dir = path.join(process.cwd(), '.v2-flags', safe(url.searchParams.get('session'), 'session'));
  await fs.mkdir(dir, { recursive: true });
  if ((req.headers.get('content-type') ?? '').startsWith('image/png')) {
    const name = `${safe(url.searchParams.get('name'), `shot-${Date.now()}`)}.png`;
    await fs.writeFile(path.join(dir, name), Buffer.from(await req.arrayBuffer()));
    return NextResponse.json({ ok: true, file: path.join(dir, name) });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false }, { status: 400 });
  await fs.appendFile(path.join(dir, 'flags.jsonl'), `${JSON.stringify(body)}\n`);
  return NextResponse.json({ ok: true, file: path.join(dir, 'flags.jsonl') });
}
