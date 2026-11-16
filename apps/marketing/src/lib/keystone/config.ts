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
 * approves or asks for changes; a revision goes back to `in_review`; approved
 * items are packaged for SOLARO (`delivered`).
 */
export const STAGES = [
  "received",
  "drafting",
  "in_review",
  "changes_requested",
  "approved",
  "delivered",
] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  received: "Received",
  drafting: "Drafting",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  delivered: "Delivered to SOLARO",
};

export const STAGE_HELP: Record<Stage, string> = {
  received: "Question received; the solution is not written yet.",
  drafting: "Evelyn is writing the solution.",
  in_review: "Waiting for Castle Rock's review.",
  changes_requested: "Castle Rock asked for changes; Evelyn is revising.",
  approved: "Approved by Castle Rock; ready to package for SOLARO.",
  delivered: "Packaged and handed to SOLARO.",
};

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
