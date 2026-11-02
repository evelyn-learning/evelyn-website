import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@core/db";
import { DemoSession, ContactSubmission } from "@/models";
import { beaconGuard } from "@/lib/beacon/guard";
import { bucketFunnel, parseFunnelRange } from "@/lib/beacon/funnel";

export const dynamic = "force-dynamic";

// GET /api/beacon/v1/funnel?from=YYYY-MM-DD&to=YYYY-MM-DD (UTC, inclusive, ≤92 days)
// Sources: demosessions (opens/engaged by productId), tutordemoleads.createdAt,
// contactsubmissions.createdAt. `leads` is outbound prospecting — excluded.
export async function GET(request: NextRequest) {
  const denied = beaconGuard(request);
  if (denied) return denied;

  const sp = request.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");
  const range = parseFunnelRange(from, to);
  if (!range.ok) return NextResponse.json({ error: range.error }, { status: 400 });
  const window = { $gte: range.start, $lt: range.endExclusive };

  await connectDB();
  const db = mongoose.connection.db;
  if (!db) return NextResponse.json({ error: "db unavailable" }, { status: 503 });

  const [demos, signups, contacts] = await Promise.all([
    DemoSession.find({ startedAt: window })
      .select("productId startedAt summary.totalInteractions")
      .lean<Array<{ productId: string; startedAt: Date; summary?: { totalInteractions?: number } }>>(),
    db
      .collection<{ createdAt: Date }>("tutordemoleads")
      .find({ createdAt: window }, { projection: { _id: 0, createdAt: 1 } })
      .toArray(),
    ContactSubmission.find({ createdAt: window }).select("createdAt").lean<Array<{ createdAt: Date }>>(),
  ]);

  const days = bucketFunnel(
    {
      demos: demos.map((d) => ({
        productId: d.productId,
        startedAt: d.startedAt,
        engaged: (d.summary?.totalInteractions ?? 0) > 0,
      })),
      signups,
      contacts,
    },
    from as string,
    to as string
  );

  return NextResponse.json({ days });
}
