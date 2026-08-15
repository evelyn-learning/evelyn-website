// src/app/api/tutor/voice-harness/[...path]/route.ts
// Dev-only file server for voice-harness artifacts (see render-harness idiom).
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const BASE = path.join(process.cwd(), 'artifacts', 'voice-harness');

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 404 });
  }
  const { path: segs } = await params;

  if (segs.length === 1 && segs[0] === 'index') {
    const list = (kind: string) => {
      const dir = path.join(BASE, kind);
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir).filter((d) => d.startsWith('run-')).sort().reverse();
    };
    return NextResponse.json({ tts: list('tts'), stt: list('stt') });
  }

  const target = path.normalize(path.join(BASE, ...segs));
  if (!target.startsWith(BASE + path.sep)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const buf = fs.readFileSync(target);
  const type = target.endsWith('.json') ? 'application/json'
    : target.endsWith('.wav') ? 'audio/wav'
    : target.endsWith('.jsonl') ? 'text/plain'
    : 'application/octet-stream';
  return new NextResponse(new Uint8Array(buf), { headers: { 'Content-Type': type, 'Cache-Control': 'no-store' } });
}
