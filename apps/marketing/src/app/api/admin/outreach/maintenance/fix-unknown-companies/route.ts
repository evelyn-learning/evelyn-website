import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, type ILead } from "@/models";
import { companyNameFor } from "@/lib/crm/match-lead";

export const maxDuration = 120;

const bodySchema = z.object({ dryRun: z.boolean().optional() });

// Leads whose company was written before the round-2 naming rule: literally
// "Unknown" (any case), empty, or missing.
const UNKNOWN_FILTER = {
  $or: [
    { company: { $regex: "^\\s*unknown\\s*$", $options: "i" } },
    { company: "" },
    { company: { $exists: false } },
  ],
};

// POST - apply the §4 naming rule to existing leads. Dry-run by default: the
// Import tab shows `matched` + samples first, then the operator applies.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const dryRun = parsed.data.dryRun ?? true;

  try {
    await connectDB();
    // Round 2 final fix wave §5: an unbounded scan over every "Unknown"/
    // empty-company lead can grow without limit as more leads accumulate.
    // Cap the batch and report how many are left so the operator can just
    // run it again — `remaining` is computed BEFORE any writes below, so it
    // reflects this batch's starting point, not a moving target.
    const FIX_UNKNOWN_LIMIT = 500;
    const leads = await Lead.find(UNKNOWN_FILTER)
      .select("_id company website emails decisionMaker")
      .limit(FIX_UNKNOWN_LIMIT)
      .lean<Pick<ILead, "_id" | "company" | "website" | "emails" | "decisionMaker">[]>();
    const totalMatched = await Lead.countDocuments(UNKNOWN_FILTER);

    let updated = 0;
    const samples: { id: string; from: string; to: string }[] = [];

    for (const lead of leads) {
      const next = companyNameFor({
        email: lead.decisionMaker?.email || lead.emails?.[0],
        name: lead.decisionMaker?.name,
        website: lead.website,
      });
      // Nothing to learn from this lead — leave it alone rather than
      // rewriting "unknown" to "Unknown".
      if (!next || next === "Unknown" || next === lead.company) continue;
      if (samples.length < 50) samples.push({ id: String(lead._id), from: lead.company ?? "", to: next });
      if (!dryRun) {
        await Lead.updateOne({ _id: lead._id }, { $set: { company: next } });
      }
      updated++;
    }

    const remaining = Math.max(0, totalMatched - leads.length);
    return NextResponse.json({ matched: leads.length, updated, samples, dryRun, remaining });
  } catch (error) {
    console.error("[CRM] fix-unknown-companies Error:", error);
    return NextResponse.json({ error: "Failed to fix company names" }, { status: 500 });
  }
}
