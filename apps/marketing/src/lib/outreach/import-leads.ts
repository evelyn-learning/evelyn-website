// Shared lead-import validation/insert used by the CLI script
// (scripts/import-leads.ts) and the console import + research pipeline.
import { Lead } from "@/models/Lead";
import { LeadSuppression } from "@/models";
import { suppressionQuery } from "@/lib/crm/suppression";

export interface ImportCounts {
  valid: number;
  invalid: number;
  inserted: number;
  skippedDupes: number;
  skippedSuppressed: number;
  errors: string[];
}

const emptyCounts = (): ImportCounts =>
  ({ valid: 0, invalid: 0, inserted: 0, skippedDupes: 0, skippedSuppressed: 0, errors: [] });

// Runtime/state fields never accepted from imported rows.
export function sanitizeLeadRow(row: Record<string, unknown>): Record<string, unknown> {
  const r = { ...row };
  delete r.status; delete r.demoToken; delete r.gmailThreadIds;
  delete r.touches; delete r.demoVisits; delete r.approvedAt;
  if (r.currentDraft && typeof r.currentDraft === "object") {
    const d = { ...(r.currentDraft as Record<string, unknown>) };
    delete d.gmailDraftId; delete d.gmailThreadId;
    r.currentDraft = d;
  }
  return r;
}

export function validateLeadRows(rows: unknown[]): {
  docs: InstanceType<typeof Lead>[];
  counts: ImportCounts;
} {
  const counts = emptyCounts();
  const docs: InstanceType<typeof Lead>[] = [];
  rows.forEach((row, i) => {
    const r = sanitizeLeadRow((row ?? {}) as Record<string, unknown>);
    const doc = new Lead({ ...r, status: "staged" });
    const err = doc.validateSync();
    if (err) {
      counts.invalid++;
      counts.errors.push(`row ${i} (${r.company ?? "?"}): ${Object.keys(err.errors).join(", ")}`);
    } else {
      counts.valid++;
      docs.push(doc);
    }
  });
  return { docs, counts };
}

// Real Mongo calls pulled behind `deps` (defaulting to the real model calls,
// mirroring gmail-ingest.ts's `IngestGmailDeps`) so the dupe/suppression/save
// loop can be unit-tested without a database.
export interface InsertLeadsDeps {
  findDupe: (doc: InstanceType<typeof Lead>) => Promise<unknown>;
  suppressionExists: (query: Record<string, unknown>) => Promise<boolean>;
}

const defaultDeps: InsertLeadsDeps = {
  findDupe: (doc) =>
    Lead.findOne({ company: doc.company, "decisionMaker.email": doc.decisionMaker.email ?? null }),
  suppressionExists: async (query) => Boolean(await LeadSuppression.exists(query)),
};

// Caller must have called connectDB() first.
export async function insertLeads(
  docs: InstanceType<typeof Lead>[],
  deps: InsertLeadsDeps = defaultDeps
): Promise<ImportCounts> {
  const counts = emptyCounts();
  counts.valid = docs.length;
  for (const doc of docs) {
    const dupe = await deps.findDupe(doc);
    if (dupe) { counts.skippedDupes++; continue; }

    // Round 2 §3: this is a second lead-creation path (import route +
    // research pipeline), so it must consult the suppression list too, or a
    // re-import/re-research could recreate a lead the operator deleted.
    const sq = suppressionQuery({ email: doc.decisionMaker.email, linkedinUrl: doc.decisionMaker.linkedinUrl });
    if (sq && (await deps.suppressionExists(sq))) { counts.skippedSuppressed++; continue; }

    await doc.save();
    counts.inserted++;
  }
  return counts;
}
