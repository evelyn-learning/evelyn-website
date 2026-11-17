// Keystone — the review site where Castle Rock Research (SOLARO) reviews the
// AI solutions Evelyn writes for their items. Served at
// https://keystone.evelynlearning.com (src/proxy.ts maps that host onto
// /keystone/*). Own database (`castle_rock_review`), own sign-in, no links
// from the marketing site.

export const KEYSTONE_HOSTS = ["keystone.evelynlearning.com", "keystone.localhost"];
export const KEYSTONE_DB = "castle_rock_review";
export const SESSION_COOKIE = "ks_session";
export const SESSION_DAYS = 30;

export type Role = "reviewer" | "tech" | "evelyn";

export const ROLE_LABEL: Record<Role, string> = {
  reviewer: "Reviewer",
  tech: "Technical",
  evelyn: "Evelyn",
};

/** What each role may do. Uploading items is open to everyone. */
export const can = {
  review: (r: Role) => r === "reviewer" || r === "evelyn",
  edit: (r: Role) => r === "evelyn",
  export: (r: Role) => r === "tech" || r === "evelyn",
  deliver: (r: Role) => r === "tech" || r === "evelyn",
  upload: (_r: Role) => true,
};

/**
 * The life of an item. A new upload is `received`; Evelyn writes the
 * solution (`drafting`) and sends it for review (`in_review`); the reviewer
 * approves or sends it back; approved items are packaged for SOLARO
 * (`delivered`).
 *
 * Sending back says whose job it is (Castle Rock's first review, 2026-11-16,
 * mixed three kinds under one "changes requested"):
 *   changes_requested  the solution needs changes            → Evelyn revises
 *   item_data          the question as exported is incomplete → Castle Rock technical re-sends it,
 *                      or wrong                                 then it returns to Evelyn by itself
 *   rejected           the item itself is wrong / withdrawn   → nobody; closed
 */
export const STAGES = [
  "received",
  "drafting",
  "in_review",
  "changes_requested",
  "item_data",
  "approved",
  "delivered",
  "rejected",
] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  received: "Received",
  drafting: "Drafting",
  in_review: "In review",
  changes_requested: "Solution changes",
  item_data: "Item data needed",
  approved: "Approved",
  delivered: "Delivered to SOLARO",
  rejected: "Rejected",
};

export const STAGE_HELP: Record<Stage, string> = {
  received: "Question received; the solution is not written yet.",
  drafting: "Evelyn is writing the solution.",
  in_review: "Waiting for Castle Rock's review.",
  changes_requested: "Castle Rock asked for changes to the solution; Evelyn is revising.",
  item_data: "The question as exported is incomplete or wrong. Castle Rock re-sends the item (Upload items); it then returns to Evelyn.",
  approved: "Approved by Castle Rock; ready to package for SOLARO.",
  delivered: "Packaged and handed to SOLARO.",
  rejected: "Castle Rock withdrew this item; no solution is needed. Re-sending a corrected item reopens it.",
};

/** Whose move it is at each stage (null: nobody is being waited on). A new team is a new Role, not a redesign. */
export const STAGE_OWNER: Record<Stage, Role | null> = {
  received: "evelyn",
  drafting: "evelyn",
  in_review: "reviewer",
  changes_requested: "evelyn",
  item_data: "tech",
  approved: null,
  delivered: null,
  rejected: null,
};

export const OWNER_LABEL: Record<Role, string> = {
  evelyn: "Evelyn",
  reviewer: "Castle Rock review",
  tech: "Castle Rock technical",
};

/** What a reviewer can decide, the stage it leads to, and how the history words it. */
export const VERDICTS = {
  approved: { stage: "approved", verb: "approved", needsSolution: true, needsNote: "" },
  changes: { stage: "changes_requested", verb: "asked for solution changes on", needsSolution: true, needsNote: "Please say what needs to change in the solution." },
  item_data: { stage: "item_data", verb: "flagged missing item data on", needsSolution: false, needsNote: "Please say what is missing or wrong in the question." },
  rejected: { stage: "rejected", verb: "rejected", needsSolution: false, needsNote: "Please say why the item is rejected." },
} as const satisfies Record<string, { stage: Stage; verb: string; needsSolution: boolean; needsNote: string }>;
export type Verdict = keyof typeof VERDICTS;

/** The five solution sections, in Julie May's order (2026-11-16). */
export const SECTIONS = ["short", "diploma", "extended", "alternate", "errors"] as const;
export type SectionKind = (typeof SECTIONS)[number];

export const SECTION_TITLE: Record<SectionKind, string> = {
  short: "Short answer",
  diploma: "Diploma-style answer",
  extended: "Extended answer",
  alternate: "Alternate answer",
  errors: "Common errors",
};

export const SUBJECTS = ["Mathematics", "Biology", "Chemistry", "Physics"] as const;

export const ITEM_TYPE_LABEL: Record<string, string> = {
  MC: "Multiple choice",
  MS: "Multiple selection",
  NR: "Numerical response",
  WR: "Written response",
  SWR: "Short written response",
  TI: "Text input",
  DDL: "Drag and drop",
};
