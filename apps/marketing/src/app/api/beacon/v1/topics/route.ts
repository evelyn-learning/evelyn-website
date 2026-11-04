import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@core/db";
import { AutoBlogSettings } from "@/models";
import { beaconGuard } from "@/lib/beacon/guard";
import { parseTopicsBody } from "@/lib/beacon/topics";

export const dynamic = "force-dynamic";

// PUT /api/beacon/v1/topics — replaces the autoblog's Beacon topic queue (max 10).
export async function PUT(request: NextRequest) {
  const denied = beaconGuard(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = parseTopicsBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  await connectDB();
  // One settings doc (getAutoSettings creates it on first use). Update the
  // existing one; if none exists yet, create it with the queue.
  const existing = await AutoBlogSettings.findOne().select("_id").lean<{ _id: unknown } | null>();
  if (existing) {
    await AutoBlogSettings.updateOne({ _id: existing._id }, { $set: { beaconTopics: parsed.topics } });
  } else {
    await AutoBlogSettings.create({ beaconTopics: parsed.topics });
  }

  return NextResponse.json({ ok: true, count: parsed.topics.length });
}
