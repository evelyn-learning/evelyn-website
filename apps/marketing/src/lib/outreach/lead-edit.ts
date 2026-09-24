import type { EmailSource, LinkedinSource } from "@/lib/outreach/enums";

// Server-authoritative merge for a decision-maker edit. Two callers exist:
// the Review Queue's full form (`ReviewQueueTab.tsx` `EditFields`, which
// sends all five fields every time) and the Pipeline's narrower row editor
// (`PipelineTab.tsx`, which edits only name/title/email but — per round-2
// fix round 1 (C1) — stashes and re-sends the lead's own current
// linkedinUrl/emailVerified so its payload is complete too). Neither form
// has UI for the four vendor-provenance fields (emailSource/emailProvider/
// linkedinSource/linkedinProvider), so a naive `lead.decisionMaker =
// fields.decisionMaker` assignment in the PATCH route would silently wipe
// them on every edit, even a title-only typo fix. This merges the incoming
// sub-fields onto the existing subdoc instead, and only clears provenance
// for the channel whose carrier value (email / linkedinUrl) actually
// changed — an edit that doesn't touch the email shouldn't lose the record
// of which vendor found it, but an edit that *does* change/clear the email
// means whatever provenance was on file no longer describes the new value.
//
// Every field is OPTIONAL on the input and is read with
// `Object.prototype.hasOwnProperty`, not just `!== undefined`: a key the
// payload never mentions is "unchanged" and falls through to the existing
// value, so a caller that only wants to edit a subset of fields (any future
// one, not just today's two) can send just those keys without silently
// clearing everything else to `undefined`. `email`/`linkedinUrl` changed-ness
// is likewise only evaluated when the key is present at all.
export interface DecisionMakerEditInput {
  name?: string;
  title?: string;
  linkedinUrl?: string;
  email?: string;
  emailVerified?: boolean;
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

function has(incoming: DecisionMakerEditInput, key: keyof DecisionMakerEditInput): boolean {
  return Object.prototype.hasOwnProperty.call(incoming, key);
}

export function mergeDecisionMakerEdit(
  existing: DecisionMakerLike,
  incoming: DecisionMakerEditInput
): DecisionMakerLike {
  // Normalize both sides before comparing — an existing `undefined` and an
  // incoming "" (the edit form's empty-field default) both mean "no value",
  // so that's not a change worth clearing provenance over. A key the
  // payload omits entirely is "unchanged", not "changed to undefined".
  const existingEmail = existing.email ?? "";
  const existingLinkedin = existing.linkedinUrl ?? "";
  const emailChanged = has(incoming, "email") && incoming.email !== existingEmail;
  const linkedinChanged = has(incoming, "linkedinUrl") && incoming.linkedinUrl !== existingLinkedin;

  return {
    name: has(incoming, "name") ? incoming.name! : existing.name,
    title: has(incoming, "title") ? incoming.title! : existing.title,
    email: has(incoming, "email") ? incoming.email : existing.email,
    linkedinUrl: has(incoming, "linkedinUrl") ? incoming.linkedinUrl : existing.linkedinUrl,
    emailVerified: has(incoming, "emailVerified") ? incoming.emailVerified! : existing.emailVerified,
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
