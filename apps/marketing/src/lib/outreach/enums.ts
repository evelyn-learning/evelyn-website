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
// Round 2 §2: the segment list is OPEN. `LEAD_SEGMENTS` stays as the seed
// list every dropdown starts from and as the key set of the label maps, but
// the type is a plain string — saving a lead with a new value is what adds
// that value to the list (see /api/admin/outreach/options).
export type LeadSegment = string;

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

export const EMAIL_SOURCES = ["published", "vendor"] as const;
export type EmailSource = (typeof EMAIL_SOURCES)[number];

export const LINKEDIN_SOURCES = ["research", "vendor"] as const;
export type LinkedinSource = (typeof LINKEDIN_SOURCES)[number];

export const PRODUCTS = [
  "voice_tutor", "academy", "mock_exams", "white_label", "content_services", "other",
] as const;
// Round 2 §1/§2: one product per lead, and the product list is OPEN — same
// seed-plus-free-string rule as LEAD_SEGMENTS above.
export type Product = string;

// Public contact-form reasons. `demo` is accepted from pre-existing links
// (`/contact?demo=true`) and normalised to `demo_request` by the API.
export const CONTACT_REASONS = [
  "product_inquiry", "demo_request", "partnership", "careers", "support", "other",
] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

// Where a touch came from — distinct from `channel` (the medium). Lets the
// timeline show "imported from info@ sent folder" vs "console mark-sent".
export const TOUCH_ORIGINS = [
  "console", "contact_form", "gmail_import", "gmail_label", "gmail_watcher",
  "linkedin_paste", "linkedin_archive", "backfill",
] as const;
export type TouchOrigin = (typeof TOUCH_ORIGINS)[number];
