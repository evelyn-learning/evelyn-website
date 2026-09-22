import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseArchiveDetailed } from "@/lib/crm/linkedin-archive";
import { linkedinTouches } from "@/lib/crm/linkedin-paste";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

export const maxDuration = 300;

// A value from FormData that behaves like a File (has an async .text()).
// `instanceof File` also works in the Next.js route runtime, but this
// duck-typed check avoids depending on the ambient File type resolving
// the same way across the Node/edge-adjacent lib configs.
function isFileLike(v: FormDataEntryValue | null): v is File {
  return !!v && typeof v === "object" && typeof (v as { text?: unknown }).text === "function";
}

// POST multipart: messages (csv, required), connections (csv, optional), dryRun ("1" default).
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = process.env.LINKEDIN_OWNER_PROFILE_URL;
  if (!owner) return NextResponse.json({ error: "LINKEDIN_OWNER_PROFILE_URL not set" }, { status: 500 });
  const form = await request.formData();
  const messages = form.get("messages");
  if (!isFileLike(messages)) return NextResponse.json({ error: "messages file required" }, { status: 400 });
  const connections = form.get("connections");
  const dryRun = (form.get("dryRun") ?? "1") !== "0";

  const detail = parseArchiveDetailed({
    messagesCsv: await messages.text(),
    connectionsCsv: isFileLike(connections) ? await connections.text() : undefined,
    ownerProfileUrl: owner,
  });
  const convs = detail.conversations;
  const out = {
    conversations: convs.length,
    imported: 0,
    created: 0,
    touchesAdded: 0,
    skippedNoOwnerMessage: detail.skippedNoOwnerMessage,
    skippedGroup: detail.skippedGroup,
    sample: convs.slice(0, 20).map((c) => `${c.participant.name} (${c.messages.length})`),
  };
  if (dryRun) return NextResponse.json(out);

  for (const c of convs) {
    // Same key passed to linkedinTouches (for stable per-message ids) and as
    // linkedinConversationId (for lead matching) so a re-upload dedupes both
    // the individual touches and the conversation-to-lead mapping.
    const key = c.participant.profileUrl || c.conversationId;
    const touches = linkedinTouches({ participant: c.participant.name, messages: c.messages }, key, "linkedin_archive");
    const r = await upsertLeadWithTouches({
      identity: { linkedinUrl: c.participant.profileUrl || undefined, name: c.participant.name, company: c.participant.company, title: c.participant.title },
      touches,
      source: "linkedin:archive",
      linkedinConversationId: key,
    });
    out.imported++;
    if (r.created) out.created++;
    out.touchesAdded += r.added;
  }
  return NextResponse.json(out);
}
