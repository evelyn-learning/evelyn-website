// Pure helpers backing scripts/backfill-channel-drafts.ts — fills in
// linkedinDraft/contactFormDraft/contactPageUrl on leads researched before
// those three-channel fields existed (Outreach v2). No DB, no SDK calls here
// so the CLI (which does both) stays testable; the CLI wires these to
// realCallModel/callWithToolLoop/extractJson from ./claude.
//
// Drafting rules for the two new bodies MUST match the pipeline's live
// candidateParams bullets in ./prompts.ts (inmailBody under 500 chars,
// contactFormBody 100-150 words + sign-off) — keep both in sync.
import { RESEARCH_MODEL } from "./prompts";

export interface BackfillLead {
  status: string;
  company: string;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  website: string;
  decisionMaker: { name: string; title: string };
  linkedinDraft?: { subject: string; body: string } | null;
  contactFormDraft?: { body: string } | null;
  contactPageUrl?: string;
}

export interface BackfillParsed {
  inmailSubject: string;
  inmailBody: string;
  contactFormBody: string;
  contactPageUrl: string;
}

const BACKFILL_STATUSES = new Set(["staged", "approved", "contacted"]);

// Leads eligible for backfill: still in the active pipeline (not yet
// replied/booked/parked/dead) and missing the InMail draft. contactFormDraft
// and contactPageUrl often lag the same rollout, so mergeBackfill fills them
// too whenever we're already re-researching a lead — but linkedinDraft is
// the trigger, matching researchedToLeadRow's "both or neither" rule.
export function needsBackfill(lead: Pick<BackfillLead, "status" | "linkedinDraft">): boolean {
  return BACKFILL_STATUSES.has(lead.status) && !lead.linkedinDraft;
}

export const BACKFILL_SCHEMA = {
  type: "object",
  properties: {
    inmailSubject: { type: "string" },
    inmailBody: { type: "string" },
    contactFormBody: { type: "string" },
    contactPageUrl: { type: "string" },
  },
  required: ["inmailSubject", "inmailBody", "contactFormBody", "contactPageUrl"],
  additionalProperties: false,
} as const;

export function backfillParams(lead: BackfillLead): Record<string, unknown> {
  const personLine = lead.decisionMaker.name
    ? `${lead.decisionMaker.name}${lead.decisionMaker.title ? `, ${lead.decisionMaker.title}` : ""}`
    : "no named decision-maker on file";
  return {
    model: RESEARCH_MODEL,
    max_tokens: 4096,
    output_config: { format: { type: "json_schema", schema: BACKFILL_SCHEMA } },
    messages: [{
      role: "user",
      content:
`We already researched this organization as a sales lead for Evelyn Learning (AI voice-tutoring platform: live voice sessions with an AI tutor over an interactive whiteboard; students practice, get diagnostic feedback, and drill weak areas — strong fit for exam prep and skills training). We're backfilling two channel drafts that didn't exist when this lead was researched. You have NO web-search or web-fetch tool for this — work only from the research below.

Organization: ${lead.company}
Website: ${lead.website}
About: ${lead.about}
Why Evelyn fits: ${lead.whyFit}
Use-case hypothesis: ${lead.useCaseHypothesis}
Decision-maker: ${personLine}

Produce:
- inmailSubject/inmailBody: a LinkedIn InMail to the same person. inmailBody MUST be UNDER 500 characters — short and personal, citing the same real hook from whyFit. Include the literal line [DEMO_LINK] on its own line. End with "— Praveen, Evelyn Learning". If no person was found, leave both "".
- contactFormBody: a self-contained message (100-150 words) suitable for pasting into the organization's own contact/inquiry form — it will NOT be threaded to an email, so it must stand alone: cite the same real hook, include the literal line [DEMO_LINK], and end with the sign-off block "Praveen — Evelyn Learning — praveen@evelynlearning.com".
- contactPageUrl: the organization's contact/inquiry page URL — ONLY if you can confidently derive it from the website above (e.g. a predictable /contact or /contact-us path you're confident exists); you have no browsing tool to verify it, so if you are not confident, return "".

Accuracy over completeness: an empty field is correct; an invented one is a serious failure.`,
    }],
  };
}

// Sets linkedinDraft/contactFormDraft/contactPageUrl ONLY where currently
// absent (never overwrites a human-edited or previously-filled value), and
// only when the parsed value is non-empty. linkedinDraft requires both
// subject and body (mirrors researchedToLeadRow's "both or neither" rule —
// an InMail with no body is not a draft). Mutates `lead` in place; returns
// whether anything changed so the caller knows whether to .save().
export function mergeBackfill(lead: BackfillLead, parsed: BackfillParsed): boolean {
  let changed = false;
  if (!lead.linkedinDraft && parsed.inmailSubject && parsed.inmailBody) {
    lead.linkedinDraft = { subject: parsed.inmailSubject, body: parsed.inmailBody };
    changed = true;
  }
  if (!lead.contactFormDraft && parsed.contactFormBody) {
    lead.contactFormDraft = { body: parsed.contactFormBody };
    changed = true;
  }
  if (!lead.contactPageUrl && parsed.contactPageUrl) {
    lead.contactPageUrl = parsed.contactPageUrl;
    changed = true;
  }
  return changed;
}
