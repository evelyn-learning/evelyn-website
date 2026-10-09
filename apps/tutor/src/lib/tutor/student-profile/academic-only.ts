/**
 * The academic-only rule for everything the engine STORES about a student
 * from a session: the session summary, gap observations, stored student
 * quotes and the next-session intent.
 *
 * Why it exists: these records persist on the student's profile, are read
 * back into later sessions, and are surfaced to the partner. "Only what the
 * transcript shows" is not enough of a limit — a transcript also shows
 * whatever a student volunteers about their life, and none of that belongs
 * in a stored record.
 *
 * Deliberately generic (a list of categories, no topic-specific examples)
 * and deliberately a pure module with no imports, so the prompts that carry
 * it (session-summary.ts, the record_gap / flag_prerequisite_gap /
 * close_session_notes tool definitions) and the test that pins it
 * (scripts/test-academic-only-rule.ts) all read the SAME text.
 */

/** Full form — appended to the system prompts that write the stored recap. */
export const ACADEMIC_ONLY_RULE =
  "Record ONLY academic content: what was studied, what the student could and could not do, their misconceptions, and the next academic step. Do NOT record personal details — family, health, location, relationships, mood, hobbies or interests, contact details, or anything else the student says about their life outside the subject matter — even when the student volunteers them. If part of the session was about such things, leave that part out entirely.";

/** Compact form — appended to each tool field whose value is stored. */
export const ACADEMIC_ONLY_FIELD_RULE =
  "Academic content only: never include personal details (family, health, location, relationships, mood, hobbies or interests, contact details, or anything about the student's life outside the subject matter).";

/** For stored verbatim quotes, where the student's own words are kept. */
export const ACADEMIC_ONLY_QUOTE_RULE =
  `${ACADEMIC_ONLY_FIELD_RULE} Omit any quote that contains one, even if it is otherwise diagnostic.`;
