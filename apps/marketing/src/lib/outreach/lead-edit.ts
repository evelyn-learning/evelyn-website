import type { EmailSource, LinkedinSource } from "@/lib/outreach/enums";

// Server-authoritative merge for the Review Queue's decision-maker edit
// form (`ReviewQueueTab.tsx` `EditFields`). That form only carries
// name/title/linkedinUrl/email/emailVerified — it has no UI for the four
// vendor-provenance fields (emailSource/emailProvider/linkedinSource/
// linkedinProvider), so a naive `lead.decisionMaker = fields.decisionMaker`
// assignment in the PATCH route would silently wipe them on every edit,
// even a title-only typo fix. This merges the incoming sub-fields onto the
// existing subdoc instead, and only clears provenance for the channel whose
// carrier value (email / linkedinUrl) actually changed — an edit that
// doesn't touch the email shouldn't lose the record of which vendor found
// it, but an edit that *does* change/clear the email means whatever
// provenance was on file no longer describes the new value.

export interface DecisionMakerEditInput {
  name: string;
  title: string;
  linkedinUrl: string;
  email: string;
  emailVerified: boolean;
}

export interface DecisionMakerLike {
  name: string;
  title: string;
  linkedinUrl?: string;
  email?: string;
  emailVerified: boolean;
  emailSource?: EmailSource;
  emailProvider?: string;
  linkedinSource?: LinkedinSource;
  linkedinProvider?: string;
  linkedinNotFound?: boolean;
}

export function mergeDecisionMakerEdit(
  existing: DecisionMakerLike,
  incoming: DecisionMakerEditInput
): DecisionMakerLike {
  // Normalize both sides before comparing — an existing `undefined` and an
  // incoming "" (the edit form's empty-field default) both mean "no value",
  // so that's not a change worth clearing provenance over.
  const existingEmail = existing.email ?? "";
  const existingLinkedin = existing.linkedinUrl ?? "";
  const emailChanged = incoming.email !== existingEmail;
  const linkedinChanged = incoming.linkedinUrl !== existingLinkedin;

  return {
    name: incoming.name,
    title: incoming.title,
    email: incoming.email,
    linkedinUrl: incoming.linkedinUrl,
    emailVerified: incoming.emailVerified,
    emailSource: emailChanged ? undefined : existing.emailSource,
    emailProvider: emailChanged ? undefined : existing.emailProvider,
    linkedinSource: linkedinChanged ? undefined : existing.linkedinSource,
    linkedinProvider: linkedinChanged ? undefined : existing.linkedinProvider,
    // The edit form has no UI for the not-found flag (it's set from the
    // Today card), so preserve it — except when the edit supplies a NEW
    // non-empty LinkedIn URL, which is direct evidence the profile exists.
    linkedinNotFound:
      linkedinChanged && incoming.linkedinUrl
        ? undefined
        : existing.linkedinNotFound,
  };
}
