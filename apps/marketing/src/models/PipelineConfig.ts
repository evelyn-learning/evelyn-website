import mongoose, { Schema, Document } from "mongoose";
import { PRODUCTS, LEAD_STATUSES } from "@/lib/outreach/enums";
import type { Product } from "@/lib/outreach/enums";

// Per-product stage list (spec §2). Every product starts with the seven
// global lead statuses; a product diverges by editing its row via
// PUT /api/admin/outreach/pipelines. `Lead.opportunities[].stage` is a free
// string validated against this list at the API boundary, not in the schema,
// so renaming a stage never invalidates historical leads.
export const DEFAULT_STAGES: string[] = [...LEAD_STATUSES];

export interface IPipelineConfig extends Document {
  product: Product;
  stages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PipelineConfigSchema = new Schema<IPipelineConfig>(
  {
    product: { type: String, enum: PRODUCTS, required: true, unique: true },
    stages: {
      type: [String],
      default: () => [...DEFAULT_STAGES],
      validate: { validator: (v: string[]) => v.length > 0, message: "stages must not be empty" },
    },
  },
  { timestamps: true }
);

export const PipelineConfig =
  mongoose.models.PipelineConfig ||
  mongoose.model<IPipelineConfig>("PipelineConfig", PipelineConfigSchema);
