import mongoose, { Schema, Document } from "mongoose";
import {
  LEAD_SEGMENTS, RESEARCH_JOB_STATUSES, CANDIDATE_STATUSES,
} from "@/lib/outreach/enums";
import type { LeadSegment, ResearchJobStatus, CandidateStatus } from "@/lib/outreach/enums";

export interface ICandidate {
  company: string;
  website: string;
  status: CandidateStatus;
  note?: string;
}

export interface IResearchJob extends Document {
  segment: LeadSegment;
  niche?: string;
  region?: string;
  count: number;
  status: ResearchJobStatus;
  candidates: ICandidate[];
  progress: { inserted: number; noEmail: number; skippedDupes: number; discarded: number; errors: number };
  costUsd: number;
  tokens: { input: number; output: number };
  error?: string;
  claimedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    company: { type: String, required: true },
    website: { type: String, required: true },
    status: { type: String, enum: CANDIDATE_STATUSES, default: "pending" },
    note: String,
  },
  { _id: false }
);

const ResearchJobSchema = new Schema<IResearchJob>(
  {
    segment: { type: String, enum: LEAD_SEGMENTS, required: true },
    niche: { type: String, default: "" },
    region: { type: String, default: "" },
    count: { type: Number, required: true, min: 1, max: 25 },
    status: { type: String, enum: RESEARCH_JOB_STATUSES, default: "queued" },
    candidates: { type: [CandidateSchema], default: [] },
    progress: {
      inserted: { type: Number, default: 0 },
      noEmail: { type: Number, default: 0 },
      skippedDupes: { type: Number, default: 0 },
      discarded: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
    costUsd: { type: Number, default: 0 },
    tokens: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
    },
    error: String,
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ResearchJobSchema.index({ status: 1, createdAt: -1 });

export const ResearchJob =
  mongoose.models.ResearchJob ||
  mongoose.model<IResearchJob>("ResearchJob", ResearchJobSchema);
