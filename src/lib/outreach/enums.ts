// Mongoose-free home for the outreach Lead enums + their derived type
// aliases. `src/models/Lead.ts` imports mongoose at module scope (it runs
// `mongoose.models.Lead || mongoose.model(...)` as a side effect on import),
// so any "use client" component that pulls these constants from `@/models`
// (or from Lead.ts directly) drags the mongoose browser build into the
// client bundle. That build has no `models` property, so the module throws
// at hydration — the whole console goes dead in the browser with no error
// surfaced anywhere except the JS console.
//
// This file has zero runtime dependencies, so client components can import
// it safely. `src/models/Lead.ts` re-exports these same values so existing
// server-side `@/models` importers see no change.
export const LEAD_SEGMENTS = [
  "nursing_program", "testprep_academy", "homeschool_charter", "microschool",
  "school_district", "private_school", "intl_school", "library",
  "publisher", "agency", "corporate_ld", "other",
] as const;
export type LeadSegment = (typeof LEAD_SEGMENTS)[number];

export const LEAD_STATUSES = [
  "staged", "approved", "contacted", "replied", "call_booked", "parked", "dead",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const TOUCH_CHANNELS = ["email", "linkedin", "form"] as const;
export type TouchChannel = (typeof TOUCH_CHANNELS)[number];

export const RESEARCH_JOB_STATUSES = [
  "queued", "running", "done", "failed", "aborted_cost", "cancelled",
] as const;
export type ResearchJobStatus = (typeof RESEARCH_JOB_STATUSES)[number];

export const CANDIDATE_STATUSES = [
  "pending", "inserted", "no_email", "dupe", "discarded", "error",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];
