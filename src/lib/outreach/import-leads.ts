// Shared lead-import validation/insert used by the CLI script
// (scripts/import-leads.ts) and the console import + research pipeline.
import { Lead } from "@/models/Lead";

export interface ImportCounts {
  valid: number;
  invalid: number;
  inserted: number;
  skippedDupes: number;
  errors: string[];
}

const emptyCounts = (): ImportCounts =>
  ({ valid: 0, invalid: 0, inserted: 0, skippedDupes: 0, errors: [] });

// Runtime/state fields never accepted from imported rows.
export function sanitizeLeadRow(row: Record<string, unknown>): Record<string, unknown> {
  const r = { ...row };
  delete r.status; delete r.demoToken; delete r.gmailThreadIds;
  delete r.touches; delete r.demoVisits;
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

// Caller must have called connectDB() first.
export async function insertLeads(docs: InstanceType<typeof Lead>[]): Promise<ImportCounts> {
  const counts = emptyCounts();
  counts.valid = docs.length;
  for (const doc of docs) {
    const dupe = await Lead.findOne({
      company: doc.company,
      "decisionMaker.email": doc.decisionMaker.email ?? null,
    });
    if (dupe) { counts.skippedDupes++; continue; }
    await doc.save();
    counts.inserted++;
  }
  return counts;
}
