import type { IOpportunity, Product } from "@/models/Lead";

export interface OpportunityInput {
  product: Product;
  stage: string;
  notes?: string;
  nextActionAt?: string | null;
}

/**
 * Validates `input.stage` against the product's configured `stages` and
 * upserts the matching entry in `opportunities` in place. Mirrors the
 * task-10 brief's inline `setOpportunity` case exactly, factored out so the
 * stage-validation + upsert logic is DB-free and testable without mongoose.
 */
export function applyOpportunity(
  opportunities: IOpportunity[],
  input: OpportunityInput,
  stages: string[],
  now: Date
): { ok: true } | { ok: false; error: string } {
  if (!stages.includes(input.stage)) {
    return { ok: false, error: `stage must be one of: ${stages.join(", ")}` };
  }
  const existing = opportunities.find((o) => o.product === input.product);
  if (existing) {
    existing.stage = input.stage;
    existing.updatedAt = now;
    if (input.notes !== undefined) existing.notes = input.notes;
    if (input.nextActionAt !== undefined) {
      existing.nextActionAt = input.nextActionAt ? new Date(input.nextActionAt) : null;
    }
  } else {
    opportunities.push({
      product: input.product,
      stage: input.stage,
      notes: input.notes,
      nextActionAt: input.nextActionAt ? new Date(input.nextActionAt) : null,
      updatedAt: now,
    });
  }
  return { ok: true };
}
