/**
 * The one rule for "is this a name a tutor may say to a student?".
 *
 * Why: the student name reaches the engine from a host (embed token
 * `student_name`) or a free-text field, and hosts with pseudonymous accounts
 * send the account id there ("stu-4471", "gac-walk-20261005-8"). The tutor
 * then greets and praises the student by an id. Every surface that PROMPTS or
 * SPEAKS with a name goes through `usableStudentName`, so an id, an e-mail or
 * a placeholder behaves exactly like no name at all — the prompt's existing
 * no-name wording applies and no fixed line interpolates anything.
 *
 * Records (session documents, admin lists, PDF headers) keep the raw value:
 * there an id is the useful thing to show.
 *
 * Pure, dependency-free, safe on client and server. Relative-import only.
 */

const MAX_NAME_CHARS = 40;

/** Letters and combining marks of any script, plus the punctuation real
 *  names carry: space, hyphen, apostrophe (straight or typographic), period.
 *  A digit, underscore, `@`, slash, colon, comma, bracket… is never part of a
 *  spoken first name, and is in nearly every id. */
const NAME_CHARS_RE = /^[\p{L}\p{M} '’.-]+$/u;
const STARTS_WITH_LETTER_RE = /^\p{L}/u;

/** Whole-value placeholders a host or a form default sends instead of a name
 *  (compared lower-cased, whitespace collapsed). A real name that merely
 *  CONTAINS one of these words ("Guest Smith") is not affected. */
const PLACEHOLDERS: ReadonlySet<string> = new Set([
  'student', 'the student', 'a student', 'new student', 'trial student', 'demo student', 'test student',
  'student name', 'unknown', 'anonymous', 'anon', 'guest', 'user', 'new user', 'test user', 'demo user',
  'learner', 'test', 'tester', 'demo', 'trial', 'none', 'null', 'undefined', 'nil', 'name', 'your name',
  'first name', 'full name', 'no name', 'visitor',
]);

/** A hyphenated value whose first part is one of these is an account id
 *  ("stu-abc", "user-maya"), not a double-barrelled name. */
const ID_PREFIXES: ReadonlySet<string> = new Set([
  'stu', 'student', 'user', 'usr', 'uid', 'id', 'acct', 'account', 'learner', 'guest', 'anon', 'test', 'demo',
  'tmp', 'temp', 'gac', 'portal', 'session', 'embed',
]);

/**
 * The name as a tutor may say it, or undefined when there is none:
 *   - absent / not a string / blank;
 *   - longer than 40 characters;
 *   - any character outside letters, combining marks, space, hyphen,
 *     apostrophe and period (so: every digit-bearing id, e-mail, slug with
 *     underscores, uuid);
 *   - not starting with a letter ("-walk", "'x");
 *   - a placeholder ("Student", "Unknown", "Guest", …);
 *   - id-shaped without digits: two or more hyphens in one word
 *     ("gac-walk-abc"), an id prefix before a hyphen ("stu-abc"), or eight or
 *     more hex letters ("deadbeef").
 * Otherwise the trimmed value with inner whitespace collapsed — case and
 * spelling untouched ("Anne-Marie", "José", "O'Neil", "Li", "李雷").
 */
export function usableStudentName(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const name = raw.normalize('NFC').trim().replace(/\s+/g, ' ');
  if (!name || name.length > MAX_NAME_CHARS) return undefined;
  if (!NAME_CHARS_RE.test(name) || !STARTS_WITH_LETTER_RE.test(name)) return undefined;
  const lower = name.toLowerCase();
  if (PLACEHOLDERS.has(lower)) return undefined;
  for (const word of lower.split(' ')) {
    const parts = word.split('-');
    if (parts.length > 2) return undefined;
    if (parts.length === 2 && ID_PREFIXES.has(parts[0])) return undefined;
    if (/^[a-f]{8,}$/.test(parts.join(''))) return undefined;
  }
  return name;
}

/** First word of the usable name ("Maya Chen" → "Maya"), for short fixed
 *  greetings. Undefined exactly when `usableStudentName` is. */
export function studentFirstName(raw: unknown): string | undefined {
  return usableStudentName(raw)?.split(' ')[0];
}
