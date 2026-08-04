import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead, LEAD_STATUSES, type LeadStatus } from "@/models";

const EDIT_FIELDS = [
  "company",
  "segment",
  "about",
  "whyFit",
  "useCaseHypothesis",
  "decisionMaker",
  "website",
  "source",
  "notes",
  "nextActionAt",
  "currentDraft",
] as const;

// PATCH - approve / kill / edit / setStatus a lead
export async function PATCH(
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

    const body = await request.json();
    const { action, fields, status } = body ?? {};

    switch (action) {
      case "approve": {
        if (lead.status !== "staged") {
          return NextResponse.json(
            { error: "Only staged leads can be approved" },
            { status: 400 }
          );
        }
        lead.status = "approved";
        lead.demoToken = lead.demoToken ?? randomBytes(8).toString("base64url");
        lead.nextActionAt = new Date();
        break;
      }

      case "kill": {
        lead.status = "dead";
        lead.nextActionAt = null;
        break;
      }

      case "edit": {
        if (!fields || typeof fields !== "object") {
          return NextResponse.json({ error: "fields is required" }, { status: 400 });
        }
        for (const key of EDIT_FIELDS) {
          if (Object.prototype.hasOwnProperty.call(fields, key)) {
            (lead as unknown as Record<string, unknown>)[key] = (
              fields as Record<string, unknown>
            )[key];
          }
        }
        break;
      }

      case "setStatus": {
        if (!status || !LEAD_STATUSES.includes(status as LeadStatus)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        lead.status = status as LeadStatus;
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await lead.save();
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[OUTREACH] PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE - remove a staged lead (guard: only staged leads may be deleted)
export async function DELETE(
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

    if (lead.status !== "staged") {
      return NextResponse.json(
        { error: "Only staged leads can be deleted" },
        { status: 400 }
      );
    }

    await lead.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[OUTREACH] DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
