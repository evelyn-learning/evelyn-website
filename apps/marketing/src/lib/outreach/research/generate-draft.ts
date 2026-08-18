// Pure helpers backing the per-lead "Generate draft" button
// (POST /api/admin/outreach/leads/:id/generate-draft). Writes the copy for
// whatever step the lead's cadence is on — intro/bump/breakup for email, the
// LinkedIn note, or the contact-form message — from the research already on
// file. No DB, no SDK calls here (same seam as ./backfill-drafts.ts); the
// route wires these to realCallModel/callWithToolLoop/extractJson.
//
// Drafting rules MUST match the pipeline's live candidateParams bullets in
// ./prompts.ts (inmailBody under 500 chars, contactFormBody 100-150 words +
// sign-off, [DEMO_LINK] literal) — keep them in sync.
import type { TouchChannel } from "../enums";
import { applyDemoLink } from "../draft-body";
import { RESEARCH_MODEL } from "./prompts";

export interface GenerateLead {
  company: string;
  website: string;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  notes?: string;
  decisionMaker: { name: string; title: string };
  touches: Array<{ at: Date | string; channel: string; direction: string; summary: string }>;
  currentDraft?: { channel: TouchChannel; subject?: string; body: string; gmailDraftId?: string; gmailThreadId?: string } | null;
  linkedinDraft?: { subject: string; body: string } | null;
  contactFormDraft?: { body: string } | null;
}

export interface GenerateParsed {
  subject: string;
  body: string;
}

export const GENERATE_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
  },
  required: ["subject", "body"],
  additionalProperties: false,
} as const;

// Which email of the sequence this generation is for. The cadence's step
// counter is channel-blind (see ../cadence.ts), but the COPY must not be:
// a lead worked only via LinkedIn/contact-form has never received an email,
// so its first email is an intro regardless of which slot it lands in —
// "floating this back up" bump copy (or a breakup) would reference a thread
// that doesn't exist. Once at least one email has gone out, the slot rules
// apply: final slot → breakup, anything between → bump.
export type EmailStep = "intro" | "bump" | "breakup";
export function emailStepFor(
  touches: Array<{ channel: string; direction: string }>
): EmailStep {
  const outbound = touches.filter((t) => t.direction === "outbound");
  const emailsSent = outbound.filter((t) => t.channel === "email").length;
  if (emailsSent === 0) return "intro";
  if (outbound.length >= 3) return "breakup";
  return "bump";
}

function touchHistoryBlock(lead: GenerateLead): string {
  const outbound = lead.touches.filter((t) => t.direction === "outbound");
  if (outbound.length === 0) return "No outreach sent yet — this is the first touch.";
  const lines = outbound.map((t, i) => {
    const when = new Date(t.at).toISOString().slice(0, 10);
    return `${i + 1}. ${when} — ${t.channel}: ${t.summary}`;
  });
  return `Outreach already sent (oldest first):\n${lines.join("\n")}`;
}

const CHANNEL_BRIEFS: Record<Exclude<TouchChannel, "email">, string> = {
  linkedin:
    `- subject: a short LinkedIn InMail subject.
- body: a LinkedIn InMail to the decision-maker. It MUST be UNDER 500 characters — short and personal, citing the real hook from the research. Include the literal line [DEMO_LINK] on its own line. End with "— Praveen, Evelyn Learning".`,
  form:
    `- subject: return "" (contact forms have no subject line we control).
- body: a self-contained message (100-150 words) suitable for pasting into the organization's own contact/inquiry form — it will NOT be threaded to an email, so it must stand alone: cite the real hook from the research, include the literal line [DEMO_LINK], and end with the sign-off block "Praveen — Evelyn Learning — praveen@evelynlearning.com".`,
};

const EMAIL_BRIEFS: Record<EmailStep, string> = {
  intro:
    `- subject: a short, specific subject line (no clickbait).
- body: a personalized intro email (120-180 words) from Praveen at Evelyn Learning to the decision-maker (or "Hi there" if no person is on file). Reference the specific real thing from the research. Include this exact line on its own line where the demo link belongs: [DEMO_LINK]. End: "Best,\nPraveen\nEvelyn Learning". No pricing claims, no fake statistics.`,
  bump:
    `- subject: a short follow-up subject (it will usually thread onto the intro email as a reply, so keep it natural as a standalone too).
- body: a SHORT follow-up bump (50-90 words) to the earlier outreach listed above. Do not repeat the intro pitch — add ONE new angle or concrete detail from the research, keep the tone light ("floating this back up"), include the literal line [DEMO_LINK] on its own line, and end: "Best,\nPraveen\nEvelyn Learning".`,
  breakup:
    `- subject: a short closing-the-loop subject.
- body: a polite breakup email (40-80 words): acknowledge they're busy, close the loop ("I'll stop here"), leave the door open with the demo link as the no-pressure option — include the literal line [DEMO_LINK] on its own line — and end: "Best,\nPraveen\nEvelyn Learning". No guilt-tripping.`,
};

export function generateDraftParams(
  lead: GenerateLead,
  channel: TouchChannel
): Record<string, unknown> {
  const brief =
    channel === "email"
      ? EMAIL_BRIEFS[emailStepFor(lead.touches)]
      : CHANNEL_BRIEFS[channel];
  const personLine = lead.decisionMaker.name
    ? `${lead.decisionMaker.name}${lead.decisionMaker.title ? `, ${lead.decisionMaker.title}` : ""}`
    : "no named decision-maker on file";
  return {
    model: RESEARCH_MODEL,
    // 16000 like the pipeline's discovery/candidate calls — the model's
    // adaptive thinking counts toward max_tokens, and a 4k budget can be
    // consumed by reasoning before the JSON completes (RESEARCH_TRUNCATED
    // after the spend).
    max_tokens: 16000,
    output_config: { format: { type: "json_schema", schema: GENERATE_SCHEMA } },
    messages: [{
      role: "user",
      content:
`We already researched this organization as a sales lead for Evelyn Learning (AI voice-tutoring platform: live voice sessions with an AI tutor over an interactive whiteboard; students practice, get diagnostic feedback, and drill weak areas — strong fit for exam prep and skills training). Write the next outreach message. You have NO web-search or web-fetch tool — work only from the research below.

Organization: ${lead.company}
Website: ${lead.website}
About: ${lead.about}
Why Evelyn fits: ${lead.whyFit}
Use-case hypothesis: ${lead.useCaseHypothesis}
Decision-maker: ${personLine}
${lead.notes ? `Owner notes: ${lead.notes}\n` : ""}
${touchHistoryBlock(lead)}

Produce:
${brief}

Accuracy over completeness: never invent facts about the organization that aren't in the research above.`,
    }],
  };
}

// Writes the parsed draft into the right slot on the lead, resolving the
// [DEMO_LINK] placeholder first (same rule as the draft route: the stored
// body backs the copy buttons and must be the one that actually goes out).
// Email drafts land WITHOUT Gmail ids — the operator turns them into a real
// Gmail draft via the existing "Create Gmail draft" button (draft route),
// which owns threading and stale-draft cleanup. Mutates `lead`; returns
// whether anything was written (an empty body from the model writes nothing).
export function applyGeneratedDraft(
  lead: GenerateLead,
  channel: TouchChannel,
  parsed: GenerateParsed,
  demoLink: string | null
): boolean {
  const body = parsed.body?.trim() ? applyDemoLink(parsed.body, demoLink) : "";
  if (!body) return false;
  if (channel === "email") {
    lead.currentDraft = { channel: "email", subject: parsed.subject ?? "", body };
    return true;
  }
  if (channel === "linkedin") {
    // Mirrors mergeBackfill's "both or neither" rule — an InMail with no
    // subject is not a draft the console can render.
    if (!parsed.subject?.trim()) return false;
    lead.linkedinDraft = { subject: parsed.subject, body };
    return true;
  }
  lead.contactFormDraft = { body };
  return true;
}
