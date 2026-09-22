import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { PRODUCTS } from "@/lib/outreach/enums";
import { parseLinkedinConversation, linkedinTouches } from "@/lib/crm/linkedin-paste";
import { normalizeLinkedinUrl } from "@/lib/crm/identity";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

const bodySchema = z.object({
  text: z.string().min(10).max(200_000),
  profileUrl: z.string().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  product: z.enum(PRODUCTS).optional(),
  dryRun: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const b = parsed.data;
  const owner = process.env.LINKEDIN_OWNER_NAME || "Praveen Tyagi";
  const conv = parseLinkedinConversation(b.text, { ownerName: owner });
  const participant = b.name?.trim() || conv.participant;
  if (!participant || conv.messages.length === 0) {
    return NextResponse.json({ error: "Could not find any messages in the pasted text", participant, messages: [] }, { status: 422 });
  }
  const li = b.profileUrl ? normalizeLinkedinUrl(b.profileUrl) : "";
  const key = li || participant.toLowerCase().replace(/\s+/g, "-");
  const touches = linkedinTouches({ ...conv, participant }, key);
  if (b.dryRun) return NextResponse.json({ participant, messages: conv.messages });
  const r = await upsertLeadWithTouches({
    identity: { linkedinUrl: li || undefined, name: participant, company: b.company },
    touches, source: "linkedin:paste", product: b.product, linkedinConversationId: key,
  });
  return NextResponse.json({ participant, messages: conv.messages, ...r });
}
