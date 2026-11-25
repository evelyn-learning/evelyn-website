import { createHmac, timingSafeEqual } from 'node:crypto';
import { EvelynConfigError } from './errors.js';

/** Where the hosted session page lives. */
export const DEFAULT_EMBED_HOST = 'https://tutor.evelynlearning.com';

/**
 * Languages a whole lesson can be taught in, as of this version: English, Japanese, Traditional Chinese
 * (Taiwan), Simplified Chinese, Hindi, Hinglish (spoken Hindi mixed with English; the board stays in English),
 * French and Latin American Spanish. The service's current list comes from `fetchLanguages()`.
 */
export type LessonLanguage = 'en' | 'ja' | 'zh-TW' | 'zh-CN' | 'hi' | 'hi-Latn' | 'fr' | 'es';

/** What the session is for. The service's default is `concept-review`. */
export type SessionGoal = 'homework-help' | 'practice' | 'concept-review' | 'test-prep' | 'catch-up' | 'challenge' | 'general';

/** A teacher persona of your own, in place of a ready-made teacher id. */
export interface TeacherPersona {
  name?: string;
  /** How the teacher introduces themselves. */
  intro?: string;
  /** How the teacher speaks and teaches. */
  style?: string;
  /** A voice code from the Voices and Companions page of the developer docs. */
  voice?: string;
}

/**
 * The claims of a session token. The token is the session's whole configuration: the service reads these
 * and nothing else. `partner_id`, `iat` and `exp` are set by {@link createSessionToken}.
 */
export interface SessionClaims {
  /** Your own stable id for the student. All data kept for the student is keyed on it, scoped to your partner. */
  student_id: string;
  /** `math`, `science`, `ela`, `social-studies` (also `cs`, `languages`). */
  subject?: string;
  /** The grade label, for example `"Grade 8"`. */
  level?: string;
  /** Free text, in the lesson's language. Without `curriculum_module` the tutor builds the lesson on it. */
  topic?: string;
  /** First name; the tutor uses it in conversation. */
  student_name?: string;
  /** `"freestyle"` for a lesson built on `topic`; `"lessonNode"` when `curriculum_module` names a lesson plan. */
  target_kind?: 'freestyle' | 'lessonNode';
  /** A lesson plan id: one returned by the API (a worksheet question, your own material) or a catalogue lesson. Locks the session to that plan. */
  curriculum_module?: string;
  /** What the session is for. Default `concept-review`. */
  session_goal?: SessionGoal;
  /** `"voice"` (default) or `"text"`. In a voice session the student can also type. */
  input_mode?: 'voice' | 'text';
  /**
   * The lesson's language. One code teaches the whole lesson (speech, board, questions) in that language:
   * `['ja']`, `['zh-TW']`, `['zh-CN']`, `['hi']`, `['hi-Latn']` (Hinglish: spoken Hindi mixed with English,
   * board in English), `['fr']`, `['es']`. Leave it out for English. Prefer the codes `languages()` /
   * `fetchLanguages()` return over a list written into your code: the service adds languages.
   */
  tutor_languages?: Array<LessonLanguage | (string & {})>;
  /**
   * The languages the student may change the lesson to in the middle of a lesson, by asking the tutor
   * ("can you explain in Hindi?"): an array of codes, or `true` / `'all'` for every language offered.
   * Leave it out and the lesson's language cannot change.
   */
  switch_languages?: Array<LessonLanguage | (string & {})> | true | 'all';
  /** Hard cap in minutes, 1 to 120, default 30. In the sandbox a session ends at 15 minutes whatever this says. */
  max_duration_minutes?: number;
  /** Your own session id. The service then uses it everywhere (events, session summaries). Otherwise it makes one. */
  session_id?: string;
  /** With the same `session_id`, continue that session (position, transcript, board) instead of starting over. Checkpoints are kept 30 days. */
  resume?: boolean;
  /** A ready-made teacher id, or a persona of your own. Without it the tutor uses its default teacher. */
  teacher?: string | TeacherPersona;
  /** A voice code from the Voices and Companions page. Wins over the persona's own voice. */
  voice?: string;
  /** Text mode only: the tutor opens the session itself instead of waiting for the student to type first. */
  tutor_opens?: boolean;
  /** Lets the tutor open with a line about progress. */
  progress_digest?: { unitsCompleted: number; unitsTotal: number; percentComplete: number; weeksElapsed?: number; paceNote?: string };
  /** Light personal threads the tutor may mention in this session only; the service never stores them. */
  social_memory?: Array<{ id: string; note: string; kind?: string; capturedAt: string }>;
  /** Accent colour and a header logo or name inside the frame. */
  branding?: { primary_color?: string; logo_url?: string; product_name?: string };
  /** Feature switches inside the frame. */
  features?: { homework_upload?: boolean; text_mode?: boolean; voice_mode?: boolean };
  /** Key-value pairs stored with the session for your own reference. */
  metadata?: Record<string, unknown>;
}

/** Who signs a token and for how long it is valid. */
export interface TokenOptions {
  /** Your partner id. */
  partnerId: string;
  /** Your partner secret. Server side only. */
  secret: string;
  /** Seconds until the token expires. Default 7200 (two hours). The service allows a session already running to continue for 4 hours past this. */
  expiresInSeconds?: number;
  /** The `iat` claim in Unix seconds. Default: now. Set it only to produce a reproducible token in a test. */
  issuedAt?: number;
}

/** The decoded payload of a session token. */
export type SessionTokenPayload = SessionClaims & { partner_id: string; iat?: number; exp?: number };

const RESERVED_CLAIMS = ['partner_id', 'iat', 'exp'] as const;

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hmac(secret: string, text: string): Buffer {
  return createHmac('sha256', secret).update(text).digest();
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/** Refuses the mistakes that would otherwise show up only as a session that does not start as expected. */
function validateClaims(claims: SessionClaims): void {
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) {
    throw new EvelynConfigError('Session claims must be an object, for example { student_id: "stu_1", topic: "Fractions" }.');
  }
  const given = claims as unknown as Record<string, unknown>;
  for (const name of RESERVED_CLAIMS) {
    if (given[name] !== undefined) {
      throw new EvelynConfigError(`Leave "${name}" out of the claims: it is set from the partnerId, issuedAt and expiresInSeconds options.`);
    }
  }
  if (!isNonEmptyString(claims.student_id)) {
    throw new EvelynConfigError('student_id is required: your own stable id for the student, as a non-empty string.');
  }
  if (claims.tutor_languages !== undefined && !(Array.isArray(claims.tutor_languages) && claims.tutor_languages.length > 0 && claims.tutor_languages.every(isNonEmptyString))) {
    throw new EvelynConfigError('tutor_languages must be an array of language codes, for example ["zh-TW"]. Leave it out for English.');
  }
  const switchTo = claims.switch_languages;
  if (switchTo !== undefined && switchTo !== true && switchTo !== 'all' && !(Array.isArray(switchTo) && switchTo.length > 0 && switchTo.every(isNonEmptyString))) {
    throw new EvelynConfigError('switch_languages must be an array of language codes, for example ["hi", "es"], or true / "all" for every language. Leave it out to keep the lesson in one language.');
  }
  const minutes = claims.max_duration_minutes;
  if (minutes !== undefined && !(typeof minutes === 'number' && Number.isFinite(minutes) && minutes >= 1 && minutes <= 120)) {
    throw new EvelynConfigError('max_duration_minutes must be a number from 1 to 120.');
  }
  if (claims.input_mode !== undefined && claims.input_mode !== 'voice' && claims.input_mode !== 'text') {
    throw new EvelynConfigError('input_mode must be "voice" or "text".');
  }
}

/**
 * Signs a session token: a JWT (HS256) whose claims configure one session for one student.
 * Call it on your server for each session; never in a browser or a mobile app.
 *
 * @throws EvelynConfigError when a claim or option is missing or out of range.
 */
export function createSessionToken(claims: SessionClaims, options: TokenOptions): string {
  if (!options || !isNonEmptyString(options.partnerId)) throw new EvelynConfigError('partnerId is required to sign a session token.');
  if (!isNonEmptyString(options.secret)) throw new EvelynConfigError('secret is required to sign a session token.');
  validateClaims(claims);
  const expiresIn = options.expiresInSeconds ?? 7200;
  if (!(Number.isFinite(expiresIn) && expiresIn > 0)) throw new EvelynConfigError('expiresInSeconds must be a positive number of seconds.');
  const issuedAt = options.issuedAt ?? Math.floor(Date.now() / 1000);
  if (!Number.isInteger(issuedAt)) throw new EvelynConfigError('issuedAt must be a whole number of Unix seconds.');

  const payload = { partner_id: options.partnerId, ...claims, iat: issuedAt, exp: issuedAt + Math.floor(expiresIn) };
  const signed = `${base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${base64url(JSON.stringify(payload))}`;
  return `${signed}.${base64url(hmac(options.secret, signed))}`;
}

/**
 * Checks a session token's signature and expiry and returns its claims. For tests and debugging: the service
 * does its own check when the session page opens.
 *
 * @param options.now Unix seconds to judge expiry against. Default: the current time.
 * @throws EvelynConfigError when the token is malformed, signed with another secret, or expired.
 */
export function verifySessionToken(token: string, secret: string, options: { now?: number } = {}): SessionTokenPayload {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3) throw new EvelynConfigError('Not a session token: expected three parts separated by dots.');
  const [headerPart, payloadPart, signaturePart] = parts as [string, string, string];
  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
  } catch {
    throw new EvelynConfigError('Malformed session token: the header or payload is not base64url JSON.');
  }
  if (!header || typeof header !== 'object' || (header as { alg?: unknown }).alg !== 'HS256') {
    throw new EvelynConfigError('Unsupported session token: the algorithm must be HS256.');
  }
  if (!payload || typeof payload !== 'object' || !isNonEmptyString((payload as { partner_id?: unknown }).partner_id)) {
    throw new EvelynConfigError('Malformed session token: the payload has no partner_id.');
  }
  const expected = hmac(secret, `${headerPart}.${payloadPart}`);
  const actual = Buffer.from(signaturePart, 'base64url');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new EvelynConfigError('Bad signature: the token was not signed with this secret.');
  }
  const claims = payload as SessionTokenPayload;
  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (typeof claims.exp === 'number' && claims.exp < now) throw new EvelynConfigError('The session token has expired.');
  return claims;
}

/** The session page URL for a signed token. Put it in an iframe's `src`, or load it in a mobile WebView. */
export function sessionUrl(token: string, options: { host?: string } = {}): string {
  const host = (options.host ?? DEFAULT_EMBED_HOST).replace(/\/+$/, '');
  return `${host}/embed?token=${encodeURIComponent(token)}`;
}

/** Signs a token for the claims and returns the session page URL in one step. */
export function createSessionUrl(claims: SessionClaims, options: TokenOptions & { host?: string }): string {
  return sessionUrl(createSessionToken(claims, options), { host: options.host });
}
