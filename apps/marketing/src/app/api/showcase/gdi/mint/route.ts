import { NextRequest, NextResponse } from "next/server";
import { buildGdiEmbedPayload, gdiEmbedUrl, isGdiLessonKey, signEmbedToken } from "@/app/showcase/gdi-communications/_lib/mint";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The deck is passcode-gated, but this route is reachable on its own: a light
// per-IP limit keeps a scraper from minting sessions on the demo engine.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.resetAt < now) { hits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  h.count += 1;
  return h.count > MAX_PER_WINDOW;
}

/** POST { lesson: "starter" | "advanced" | "meeting", studentName?: string } → { url, lesson, studentId, expiresAt } */
export async function POST(req: NextRequest) {
  const secret = process.env.GDI_DEMO_PARTNER_SECRET;
  if (!secret) return NextResponse.json({ error: "Live demo links are not configured on this server." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many demo sessions from this address. Try again in an hour." }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { lesson?: unknown; studentName?: unknown } | null;
  if (!body || !isGdiLessonKey(body.lesson)) return NextResponse.json({ error: "Unknown lesson." }, { status: 400 });
  const studentName = typeof body.studentName === "string" ? body.studentName : "";
  const payload = buildGdiEmbedPayload({ lesson: body.lesson, studentName, nowSec: Math.floor(Date.now() / 1000) });
  const url = gdiEmbedUrl(signEmbedToken(payload, secret));
  console.log(`[showcase/gdi] minted ${body.lesson} for ${payload.student_id}`);
  return NextResponse.json({ url, lesson: body.lesson, studentId: payload.student_id, expiresAt: payload.exp });
}
