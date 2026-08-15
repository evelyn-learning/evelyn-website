import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { validateLeadRows, insertLeads } from "@/lib/outreach/import-leads";

// POST - paste-JSON lead import. { rows, dryRun } -> counts.
// dryRun validates without writing (mirror of the CLI's default mode).
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const rows = body?.rows;
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: "rows must be a JSON array" }, { status: 400 });
    }
    if (rows.length > 200) {
      return NextResponse.json({ error: "Max 200 rows per import" }, { status: 400 });
    }
    const { docs, counts } = validateLeadRows(rows);
    if (body?.dryRun) {
      return NextResponse.json({ counts, dryRun: true });
    }
    await connectDB();
    const inserted = await insertLeads(docs);
    return NextResponse.json({
      counts: { ...counts, inserted: inserted.inserted, skippedDupes: inserted.skippedDupes },
    });
  } catch (error) {
    console.error("[OUTREACH] import Error:", error);
    return NextResponse.json({ error: "Failed to import leads" }, { status: 500 });
  }
}
