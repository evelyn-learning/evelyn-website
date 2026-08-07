import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models";
import { enrichLead } from "@/lib/outreach/enrich/chain";
import type { EnrichInput } from "@/lib/outreach/enrich/types";

// POST - manually run the enrichment chain (Apollo -> Hunter -> Prospeo) for
// a single lead's decision-maker. Vendor fields only ever fill in whatever
// the lead is currently missing — never overwrite an existing email/linkedin
// (e.g. a verified-published email survives even if a vendor later disagrees
// with it). Mirrors runCandidate's vendor-merge block in
// src/lib/outreach/research/pipeline.ts (~lines 121-136); duplicated here
// rather than factored out since it's a handful of lines each side and the
// two call sites (auto-enrich mid-pipeline vs. manual re-run from the UI)
// have different enough surrounding control flow that a shared helper would
// need its own parameter surface anyway.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Same trigger condition as runCandidate's auto-enrich gate in
    // pipeline.ts (~line 105: `!row.decisionMaker.email ||
    // !row.decisionMaker.linkedinUrl`) — if both channels are already
    // filled there's nothing a vendor call could add, so skip it entirely
    // rather than burning a capped credit whose result the merge below
    // would just discard. No UI guard exists yet against repeat clicks, so
    // this is the only backstop.
    if (lead.decisionMaker?.email && lead.decisionMaker?.linkedinUrl) {
      return NextResponse.json({
        lead,
        outcome: { result: null, attempts: [] },
        skipped: "nothing_missing",
      });
    }

    let websiteDomain: string;
    try {
      websiteDomain = new URL(lead.website).hostname;
    } catch {
      return NextResponse.json(
        { error: "Lead has no usable website to enrich against" },
        { status: 400 }
      );
    }

    const input: EnrichInput = {
      name: lead.decisionMaker?.name ?? "",
      title: lead.decisionMaker?.title,
      company: lead.company,
      websiteDomain,
    };

    const outcome = await enrichLead(input);
    const { result } = outcome;

    if (result) {
      let merged = false;
      if (!lead.decisionMaker.email && result.email) {
        lead.decisionMaker.email = result.email;
        lead.decisionMaker.emailSource = "vendor";
        lead.decisionMaker.emailVerified = false;
        lead.decisionMaker.emailProvider = result.provider;
        merged = true;
      }
      if (!lead.decisionMaker.linkedinUrl && result.linkedinUrl) {
        lead.decisionMaker.linkedinUrl = result.linkedinUrl;
        lead.decisionMaker.linkedinSource = "vendor";
        merged = true;
      }
      if (merged) {
        await lead.save();
      }
    }

    return NextResponse.json({ lead, outcome });
  } catch (error) {
    console.error("[OUTREACH] enrich Error:", error);
    return NextResponse.json({ error: "Failed to enrich lead" }, { status: 500 });
  }
}
