// Keystone — the review site where Castle Rock Research (SOLARO) reviews the
// AI solutions Evelyn writes for their items. Served at
// https://keystone.evelynlearning.com (src/proxy.ts maps that host onto
// /keystone/*). Own database (`castle_rock_review`), own sign-in, no links
// from the marketing site.

export const KEYSTONE_HOSTS = ["keystone.evelynlearning.com", "keystone.localhost"];
export const KEYSTONE_DB = process.env.KEYSTONE_DB_NAME || "castle_rock_review";
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
 *
 * Two stages for the solutions pipeline (2026-11-17):
 *   ready      the solution passed our checks but is not released to review
 *              yet; Castle Rock sees it as `drafting` (see visibleStage) and
 *              never sees an unreleased version
 *   key_query  our working reaches a different answer from the key; the
 *              reviewer confirms the key or corrects the item
 */
export const STAGES = [
  "received",
  "drafting",
  "ready",
  "in_review",
  "changes_requested",
  "item_data",
  "key_query",
  "approved",
  "delivered",
  "rejected",
] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  received: "Received",
  drafting: "Drafting",
  ready: "Ready",
  in_review: "In review",
  changes_requested: "Solution changes",
  item_data: "Item data needed",
  key_query: "Key query",
  approved: "Approved",
  delivered: "Delivered to SOLARO",
  rejected: "Rejected",
};

export const STAGE_HELP: Record<Stage, string> = {
  received: "Question received; the solution is not written yet.",
  drafting: "Evelyn is writing the solution.",
  ready: "Solution passed our checks; waiting to go to review.",
  in_review: "Waiting for Castle Rock's review.",
  changes_requested: "Castle Rock asked for changes to the solution; Evelyn is revising.",
  item_data: "The question as exported is incomplete or wrong. Castle Rock re-sends the item (Upload items); it then returns to Evelyn.",
  key_query: "Our working reaches a different answer from the key. Castle Rock confirms the key or corrects the item.",
  approved: "Approved by Castle Rock; ready to package for SOLARO.",
  delivered: "Packaged and handed to SOLARO.",
  rejected: "Castle Rock withdrew this item; no solution is needed. Re-sending a corrected item reopens it.",
};

/** Whose move it is at each stage (null: nobody is being waited on). A new team is a new Role, not a redesign. */
export const STAGE_OWNER: Record<Stage, Role | null> = {
  received: "evelyn",
  drafting: "evelyn",
  ready: "evelyn",
  in_review: "reviewer",
  changes_requested: "evelyn",
  item_data: "tech",
  key_query: "reviewer",
  approved: null,
  delivered: null,
  rejected: null,
};

/**
 * The stage as a role sees it. `ready` is our own hold before review, so
 * Castle Rock (reviewer, tech) sees it as `drafting`, the same as any
 * unreleased work.
 */
export function visibleStage(stage: Stage, role: Role): Stage {
  return stage === "ready" && role !== "evelyn" ? "drafting" : stage;
}

type ReleaseState = { version?: number; releasedVersion?: number };

/** Highest solution version released to review. Rows from before releasedVersion existed count as fully released. */
export function releasedVersionOf(item: ReleaseState): number {
  return Math.min(item.releasedVersion ?? item.version ?? 0, item.version ?? 0);
}

/** Whether a solution verdict (approve, fix solution) can be given: the latest version is the released one. */
export function canJudgeSolution(item: ReleaseState): boolean {
  const released = releasedVersionOf(item);
  return released > 0 && (item.version ?? 0) <= released;
}

/** The answer `role` sees: Castle Rock sees the one released with the solution; Evelyn the working one. */
export function answerSeenBy(item: ReleaseState & { evelynAnswer?: string; releasedAnswer?: string }, role: Role): string {
  if (role === "evelyn" || item.releasedVersion === undefined) return item.evelynAnswer ?? "";
  return item.releasedAnswer ?? "";
}

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
  /** Only on a key_query item: our working was wrong, the key stands; back to Evelyn to write the solution. */
  key_right: { stage: "drafting", verb: "confirmed the key of", needsSolution: false, needsNote: "Please say why the key is right." },
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

/** Alberta diploma courses: the only ones whose second section is a "Diploma-style answer". */
export const DIPLOMA_COURSES = ["Math 30-1", "Math 30-2", "Biology 30", "Chemistry 30", "Physics 30", "Science 30"] as const;

/**
 * Second-section title for every other level (2026-11-19: items come without a course, the level is read from the
 * question, so a neutral name is needed; the client has not chosen one). null would hold every such item
 * (section_title_unset). No "exam" in it: rules.md R-no-diploma-wording keeps that word to diploma courses.
 */
export const OTHER_COURSE_SECTION_TITLE: string | null = "Worked answer";

/** Where an item's level came from, as the item page words it. */
export const LEVEL_SOURCE_LABEL: Record<string, string> = {
  sheet: "from the spreadsheet",
  pipeline: "set by Evelyn from the question",
  person: "set in review",
};

/**
 * A course string as the spreadsheet wrote it, mapped to the canonical diploma
 * name when it is one ("Mathematics 30–1", " math 30-1 "); anything else comes
 * back trimmed and unchanged.
 */
export function normaliseCourse(course: string): string {
  const trimmed = course.trim();
  const folded = trimmed
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^mathematics\b/, "math");
  return DIPLOMA_COURSES.find((c) => c.toLowerCase() === folded) ?? trimmed;
}

/** The title of a solution section for an item of `course`; null where the title is not decided (diploma, other courses). */
export function sectionTitle(kind: SectionKind, course: string | undefined | null): string | null {
  if (kind !== "diploma") return SECTION_TITLE[kind];
  return (DIPLOMA_COURSES as readonly string[]).includes(normaliseCourse(course ?? "")) ? SECTION_TITLE.diploma : OTHER_COURSE_SECTION_TITLE;
}

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
