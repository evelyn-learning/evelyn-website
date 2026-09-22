// One-off: turn historical contact-form submissions into leads/touches.
// Dry-run unless --apply. Idempotent via externalId `form:<submissionId>`.
//
// Usage:
//   MONGODB_URI=... npx tsx scripts/crm-backfill-contact-submissions.ts            # dry-run
//   MONGODB_URI=... npx tsx scripts/crm-backfill-contact-submissions.ts --apply    # write
import { connectDB } from "@core/db";
import { ContactSubmission, type IContactSubmission } from "@/models";
import { classifyContact, productFromParam } from "@/lib/crm/classify-contact";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

const apply = process.argv.includes("--apply");

(async () => {
  await connectDB();
  const subs = await ContactSubmission.find({}).sort({ createdAt: 1 }).lean<IContactSubmission[]>();
  let careers = 0, leads = 0, touches = 0;
  for (const s of subs) {
    const cls = classifyContact({ reason: s.reason, subject: s.subject ?? "", message: s.message });
    if (cls.isCareers) { careers++; continue; }
    if (!apply) { leads++; continue; }
    const r = await upsertLeadWithTouches({
      identity: { email: s.email, name: s.name, company: s.company }, source: "contact-form", product: productFromParam(s.product ?? null),
      touches: [{
        at: new Date(s.createdAt), channel: "form", direction: "inbound",
        summary: `Contact form (${cls.reason}): ${s.subject ?? ""}`.slice(0, 200),
        subject: s.subject, body: s.message, from: s.email, to: "info@evelynlearning.com",
        externalId: `form:${s._id}`, origin: "backfill",
      }],
    });
    leads++; touches += r.added;
  }
  console.log(`${apply ? "APPLIED" : "DRY RUN"}: submissions ${subs.length}, careers skipped ${careers}, leads touched ${leads}, touches added ${touches}`);
  process.exit(0);
})();
