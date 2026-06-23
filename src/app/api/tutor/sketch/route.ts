/**
 * Doodler service — turns a one-line concept into a rough hand-drawn sketch.
 *
 * The MAIN brain emits show_sketch({concept, labels, title}); the client posts
 * {concept, labels} here. A dedicated Haiku doodler (isolated — sees only the
 * concept, NOT the board/history) returns a SketchPrimitive[] via forced
 * structured output. We validate (fail-to-nothing) and cache by concept+labels.
 *
 * Grilled design 2026-06-22 — see memory project_tutor_sketch_capability.
 * Gated upstream by TUTOR_SKETCH (the tool only exists when the flag is on);
 * this route is harmless if called regardless. The doodler call + prompt live
 * in lib/tutor/whiteboard/doodler.ts (unit-probeable).
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateDoodle } from '@/lib/tutor/whiteboard/doodler';
import type { SketchPrimitive } from '@/lib/tutor/whiteboard/sketch-schema';

// Rate limiting per session.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 40;
const RATE_WINDOW = 60_000;
function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// Exact-hash cache — recurring analogies (same plan re-run) become instant/free.
const sketchCache = new Map<string, SketchPrimitive[]>();
const CACHE_MAX = 500;
const cacheKey = (concept: string, labels: string[]) =>
  `${concept.trim().toLowerCase().replace(/\s+/g, ' ')}|${labels.map((l) => l.trim().toLowerCase()).sort().join(',')}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const concept: string = typeof body?.concept === 'string' ? body.concept.trim() : '';
    const labels: string[] = Array.isArray(body?.labels) ? body.labels.map(String).slice(0, 10) : [];
    const sessionId: string = typeof body?.sessionId === 'string' ? body.sessionId : 'anon';

    if (!concept) return NextResponse.json({ error: 'Missing concept' }, { status: 400 });
    if (!checkRateLimit(sessionId)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const key = cacheKey(concept, labels);
    const cached = sketchCache.get(key);
    if (cached) {
      console.log(`[SKETCH] Session=${sessionId} | CACHE HIT | "${concept.slice(0, 60)}"`);
      return NextResponse.json({ primitives: cached, cached: true });
    }

    const { primitives, usage } = await generateDoodle(concept, labels);
    if (!primitives) {
      console.warn(`[SKETCH] Session=${sessionId} | validation FAILED (render nothing) | "${concept.slice(0, 60)}"`);
      return NextResponse.json({ primitives: null });
    }

    if (sketchCache.size >= CACHE_MAX) sketchCache.clear();
    sketchCache.set(key, primitives);
    console.log(`[SKETCH] Session=${sessionId} | ${primitives.length} primitives | "${concept.slice(0, 60)}"`);
    return NextResponse.json({ primitives, usage });
  } catch (error) {
    console.error('[SKETCH] Error:', error);
    // Fail-to-nothing: the client treats a null/errored sketch as "draw nothing".
    return NextResponse.json({ primitives: null }, { status: 200 });
  }
}
