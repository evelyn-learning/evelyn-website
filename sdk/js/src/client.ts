import { readFile } from 'node:fs/promises';
import { EvelynApiError, EvelynConfigError, SANDBOX_URL } from './errors.js';
import { signRequest } from './signing.js';
import { createSessionToken, sessionUrl, DEFAULT_EMBED_HOST, type SessionClaims } from './token.js';

/** Where `/api/portal/v1/*` is served. */
export const DEFAULT_API_HOST = 'https://www.evelynlearning.com';

const API_BASE = '/api/portal/v1';
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 8_000_000;
const MAX_SUMMARY_IDS = 50;
const IMAGE_PATH = /\.(jpe?g|png|webp|gif)$/i;

/** How to build a client. Anything left out is read from the environment. */
export interface EvelynTutorOptions {
  /** Your partner id. Default: the `EVELYN_PARTNER_ID` environment variable. */
  partnerId?: string;
  /** Your partner secret. Default: the `EVELYN_PARTNER_SECRET` environment variable. */
  secret?: string;
  /** Host of the API. Default: `EVELYN_API_HOST`, else `https://www.evelynlearning.com`. */
  apiHost?: string;
  /** Host of the session page. Default: `EVELYN_EMBED_HOST`, else `https://tutor.evelynlearning.com`. */
  embedHost?: string;
  /** A `fetch` to use in place of the global one (a test double, a proxy-aware fetch). */
  fetch?: typeof fetch;
}

/** `GET /usage`: your tutoring minute pool. Only `partner_id` and `pooled` are present when no pool applies. */
export interface Usage {
  partner_id: string;
  /** Whether a minute pool applies to this partner. A sandbox has one. */
  pooled: boolean;
  /** Minutes in the pool. */
  cap_minutes?: number;
  /** Minutes used. Wall clock per sitting, from the tutor's start to its end, pauses included. */
  used_minutes?: number;
  /** Minutes left. Hide your start button when this is under 1. */
  remaining_minutes?: number;
  /** The longest one session may run, in minutes. */
  session_max_minutes?: number;
}

/** A photo of a worksheet. */
export interface WorksheetImage {
  /**
   * The image: bytes, a base64 string (a `data:` URL is accepted), or the path of a file ending in
   * `.jpg`, `.jpeg`, `.png`, `.webp` or `.gif`.
   */
  data: Uint8Array | string;
  /** `image/jpeg`, `image/png`, `image/webp` or `image/gif`. Default: read from the image's first bytes. */
  mimeType?: string;
}

/** What to read a worksheet from. */
export interface WorksheetReadInput {
  /** Up to 4 photos, each up to 8 MB. */
  images?: WorksheetImage[];
  /**
   * A short description of the sheet in the lesson's language (at least 3 characters), or, with no images,
   * the questions themselves as typed text. Default with images: `"Worksheet"`.
   */
  text?: string;
  /** `math`, `science`, `ela`, `social-studies` (also `cs`, `languages`). */
  subject: string;
  /** The grade label, for example `"Grade 8"`. */
  grade: string;
  /** The language the sheet's session will be taught in, for example `"zh-TW"`. Leave it out for English. */
  locale?: string;
  /** Your id for the student whose sheet this is. With it, the stored questions are deleted when you erase the student. */
  studentId?: string;
}

/** One question of a worksheet, as printed. */
export interface WorksheetProblem {
  /** The number printed on the sheet, or the position when the sheet has no numbers. */
  n: number;
  text: string;
}

/** `POST /plan-generate` with goal `homework-help`. */
export interface WorksheetReadResult {
  /** The sheet's id. Pass it to `worksheet.prepare`, `worksheet.build` and `worksheet.status`. */
  planId: string;
  title: string;
  mode: 'full' | 'picker';
  los: Array<{ id: string; description: string }>;
  maxPickableLos: number;
  estimatedMinutes: number;
  generatorOk: boolean;
  cached: boolean;
  /** Present when the service split the sheet into questions. */
  kind?: 'homework-help';
  /**
   * The questions, up to 25. Absent when the service could not split the material into questions; `planId`
   * is then an ordinary lesson plan on the material and can be used as `curriculum_module` directly.
   */
  problems?: WorksheetProblem[];
}

/** Whether a question's worked answer has been prepared and checked. */
export type ProblemBuildStatus = 'preparing' | 'ready' | 'unverified';

/** Options of `worksheet.prepare`. */
export interface PrepareProblemOptions {
  /** How long the call may wait for the question to be prepared, 0 to 8000 ms. Default 8000. */
  waitMs?: number;
  /** The `priorNote` of an earlier session on this question (from `worksheet.outcome`), when the student returns to it. */
  priorNote?: string;
  /** The `confirmed` list of an earlier session on this question (from `worksheet.outcome`). */
  priorConfirmed?: string[];
  /** The language the session is taught in, for a sheet that was read without a `locale`. */
  locale?: string;
}

/** `POST /homework-problem-plan`: the plan of one question. */
export interface ProblemPlan {
  /** The question's own plan id. Open the session with it as `curriculum_module` (see `worksheet.sessionUrl`). */
  planId: string;
  /** True when the question's answer was prepared and checked before the session. */
  verified: boolean;
  /** True when the question comes with a figure the tutor shows. */
  hasFigure: boolean;
  buildStatus: ProblemBuildStatus;
}

/** `GET /homework-build`: progress of preparing every question of a sheet. */
export interface WorksheetBuildStatus {
  planId: string;
  done: boolean;
  startedAt: string;
  updatedAt: string;
  problems: Array<{
    n: number;
    status: ProblemBuildStatus;
    hasFigure: boolean;
    /** A static SVG of the question's figure, for a thumbnail. */
    figureSvg?: string;
    verify: { agreed: boolean; candidates?: string[] };
    /** The checked final answers, one per part. Keep them on your server; never show them to the student. */
    finals?: string[];
  }>;
}

/** `GET /homework-problem-outcome`: how one question's session went. Never contains an answer. */
export interface ProblemOutcome {
  outcome: 'done' | 'in_progress' | 'needs_review';
  /** A short note on where the student got to (empty when there is nothing to say). Pass it to `worksheet.prepare` as `priorNote`. */
  priorNote: string;
  /** Marks for the parts confirmed so far. Pass them to `worksheet.prepare` as `priorConfirmed`. */
  confirmed: string[];
}

/** Facts about one session. */
export interface SessionSummary {
  sessionId: string;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  endedAt?: string;
  /** Active tutoring seconds. Absent when the session has no transcript. */
  durationSec?: number;
  mode?: 'voice' | 'text';
  studentTurns: number;
  tutorTurns: number;
  boardItems: number;
  location?: { city?: string; region?: string; country?: string };
}

/** The worksheet flow: read a photo, prepare the question the student picked, open a session on it. */
export interface WorksheetApi {
  /** Sends the photos and returns the numbered questions. Uses no tutoring minutes. */
  read(input: WorksheetReadInput): Promise<WorksheetReadResult>;
  /** Prepares question `n` of a sheet and returns that question's plan id. */
  prepare(planId: string, n: number, options?: PrepareProblemOptions): Promise<ProblemPlan>;
  /** Starts preparing every question of a sheet in the background, so `prepare` answers at once. `first` is prepared first. */
  build(planId: string, options?: { first?: number }): Promise<{ started: boolean }>;
  /** Progress of `build`. Answers 404 (`not_found`) until a build has been started. */
  status(planId: string): Promise<WorksheetBuildStatus>;
  /** How the session on one question went. `planId` is the question's plan id; needed only when the session never loaded its plan. */
  outcome(sessionId: string, planId?: string): Promise<ProblemOutcome>;
  /** The session URL for one prepared question: the claims plus `session_goal: "homework-help"` and `curriculum_module`. */
  sessionUrl(problemPlanId: string, claims: Omit<SessionClaims, 'session_goal' | 'curriculum_module'>): string;
}

/** Reads about past sessions. */
export interface SessionsApi {
  /** Facts for up to 50 sessions. Ids that are unknown, or another partner's, are left out of the answer. */
  summary(ids: string[]): Promise<SessionSummary[]>;
}

/** The image type named by a file's first bytes, or undefined. */
function sniffImageType(bytes: Uint8Array): string | undefined {
  const head = Buffer.from(bytes.subarray(0, 12));
  if (head.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (head.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return 'image/png';
  if (head.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  if (head.subarray(0, 4).toString('latin1') === 'RIFF' && head.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
  return undefined;
}

/** Turns one image input into the `materials` entry the API takes. */
async function toMaterial(image: WorksheetImage, index: number): Promise<{ kind: 'image'; mimeType: string; data: string }> {
  const label = `images[${index}]`;
  let bytes: Buffer;
  let declared = image?.mimeType;
  const data = image?.data;
  if (typeof data === 'string') {
    if (IMAGE_PATH.test(data)) {
      try {
        bytes = await readFile(data);
      } catch (err) {
        throw new EvelynConfigError(`${label}: could not read the file ${data} (${(err as Error).message}).`);
      }
    } else {
      const dataUrl = /^data:([^;,]+);base64,/.exec(data);
      declared ??= dataUrl?.[1];
      bytes = Buffer.from(dataUrl ? data.slice(dataUrl[0].length) : data, 'base64');
    }
  } else if (data instanceof Uint8Array) {
    bytes = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  } else {
    throw new EvelynConfigError(`${label}: data must be bytes, a base64 string, or the path of a .jpg, .png, .webp or .gif file.`);
  }
  if (bytes.byteLength === 0) throw new EvelynConfigError(`${label}: the image is empty.`);
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new EvelynConfigError(`${label}: the image is larger than 8 MB. Send a smaller photo.`);
  const mimeType = declared ?? sniffImageType(bytes);
  if (!mimeType) throw new EvelynConfigError(`${label}: not a JPEG, PNG, WebP or GIF image. Convert it, or pass mimeType if it is one of those.`);
  return { kind: 'image', mimeType, data: bytes.toString('base64') };
}

function requireId(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string' || !value) throw new EvelynConfigError(`${name} is required.`);
}

/**
 * The server-side client: signs session tokens and calls the API with your partner secret.
 *
 * ```ts
 * const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
 * const url = tutor.sessionUrl({ student_id: 'stu_1', subject: 'math', level: 'Grade 8', topic: 'Linear equations', target_kind: 'freestyle' });
 * ```
 */
export class EvelynTutor {
  /** The partner id every token and request is signed for. */
  readonly partnerId: string;
  /** Host of the API. */
  readonly apiHost: string;
  /** Host of the session page. */
  readonly embedHost: string;
  /** The worksheet flow. */
  readonly worksheet: WorksheetApi;
  /** Reads about past sessions. */
  readonly sessions: SessionsApi;

  // Private fields, so the secret never appears when a client is logged or serialised.
  readonly #secret: string;
  readonly #fetch: typeof fetch;

  /**
   * @throws EvelynConfigError in a browser (the secret must stay on a server), or when the partner id or secret is missing.
   */
  constructor(options: EvelynTutorOptions = {}) {
    if (typeof window !== 'undefined') {
      throw new EvelynConfigError(
        'EvelynTutor must not run in a browser: the partner secret has to stay on your server. Create the session URL in a server route and send only the URL to the page. For the page itself, use mountTutor from "@evelynlearning/tutor/embed".',
      );
    }
    const partnerId = options.partnerId ?? process.env.EVELYN_PARTNER_ID;
    const secret = options.secret ?? process.env.EVELYN_PARTNER_SECRET;
    const missing = [!partnerId && 'EVELYN_PARTNER_ID', !secret && 'EVELYN_PARTNER_SECRET'].filter(Boolean);
    if (!partnerId || !secret) {
      throw new EvelynConfigError(
        `${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set. Sign up at ${SANDBOX_URL} (email, confirm the link), copy the partner id and secret from the dashboard, and set them as environment variables on your server, or pass { partnerId, secret }.`,
      );
    }
    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof fetchImpl !== 'function') throw new EvelynConfigError('No global fetch found. Use Node 18 or later, or pass { fetch }.');
    this.partnerId = partnerId;
    this.#secret = secret;
    this.#fetch = fetchImpl;
    this.apiHost = (options.apiHost ?? process.env.EVELYN_API_HOST ?? DEFAULT_API_HOST).replace(/\/+$/, '');
    this.embedHost = (options.embedHost ?? process.env.EVELYN_EMBED_HOST ?? DEFAULT_EMBED_HOST).replace(/\/+$/, '');

    this.worksheet = {
      read: (input) => this.#readWorksheet(input),
      prepare: async (planId, n, prepareOptions = {}) => {
        requireId(planId, 'planId');
        if (!Number.isInteger(n) || n < 1) throw new EvelynConfigError('n must be the question number, a whole number from 1.');
        return this.#request('POST', '/homework-problem-plan', { planId, n, ...prepareOptions });
      },
      build: async (planId, buildOptions = {}) => {
        requireId(planId, 'planId');
        return this.#request('POST', '/homework-build', { planId, ...buildOptions });
      },
      status: async (planId) => {
        requireId(planId, 'planId');
        return this.#request('GET', `/homework-build?${new URLSearchParams({ planId })}`);
      },
      outcome: async (sessionId, planId) => {
        requireId(sessionId, 'sessionId');
        return this.#request('GET', `/homework-problem-outcome?${new URLSearchParams(planId ? { sessionId, planId } : { sessionId })}`);
      },
      sessionUrl: (problemPlanId, claims) => {
        requireId(problemPlanId, 'problemPlanId');
        return this.sessionUrl({ ...claims, session_goal: 'homework-help', curriculum_module: problemPlanId });
      },
    };
    this.sessions = {
      summary: async (ids) => {
        if (!Array.isArray(ids) || ids.length < 1 || ids.length > MAX_SUMMARY_IDS || ids.some((id) => typeof id !== 'string' || !id || id.includes(','))) {
          throw new EvelynConfigError(`ids must be 1 to ${MAX_SUMMARY_IDS} session ids, none containing a comma.`);
        }
        const answer = await this.#request<{ sessions: SessionSummary[] }>('GET', `/sessions/summary?${new URLSearchParams({ ids: ids.join(',') })}`);
        return answer.sessions;
      },
    };
  }

  /** Signs a session token for one student and one session. */
  sessionToken(claims: SessionClaims, options: { expiresInSeconds?: number } = {}): string {
    return createSessionToken(claims, { partnerId: this.partnerId, secret: this.#secret, expiresInSeconds: options.expiresInSeconds });
  }

  /** Signs a token and returns the session page URL: an iframe's `src`, or the URL a mobile WebView loads. Minutes are used only once the student starts the session. */
  sessionUrl(claims: SessionClaims, options: { expiresInSeconds?: number } = {}): string {
    return sessionUrl(this.sessionToken(claims, options), { host: this.embedHost });
  }

  /** Your tutoring minute pool: minutes used and left. Cache the answer for 60 seconds. */
  usage(): Promise<Usage> {
    return this.#request('GET', '/usage');
  }

  async #readWorksheet(input: WorksheetReadInput): Promise<WorksheetReadResult> {
    if (!input || typeof input !== 'object') throw new EvelynConfigError('worksheet.read takes { images, subject, grade }.');
    const images = input.images ?? [];
    if (!Array.isArray(images) || images.length > MAX_IMAGES) throw new EvelynConfigError(`images must be an array of at most ${MAX_IMAGES} photos.`);
    requireId(input.subject, 'subject');
    requireId(input.grade, 'grade');
    const text = input.text ?? (images.length > 0 ? 'Worksheet' : '');
    if (typeof text !== 'string' || text.trim().length < 3 || text.length > 8000) {
      throw new EvelynConfigError(images.length > 0 ? 'text must be 3 to 8000 characters.' : 'Give at least one image, or the questions as text (3 to 8000 characters).');
    }
    const materials = await Promise.all(images.map(toMaterial));
    return this.#request('POST', '/plan-generate', {
      text,
      subject: input.subject,
      grade: input.grade,
      goal: 'homework-help',
      ...(input.locale ? { locale: input.locale } : {}),
      ...(input.studentId ? { studentId: input.studentId } : {}),
      ...(materials.length > 0 ? { materials } : {}),
    });
  }

  /** One signed call. The body is serialised once; that string is both signed and sent. */
  async #request<T>(method: 'GET' | 'POST', route: string, body?: unknown): Promise<T> {
    const path = `${API_BASE}${route}`;
    const raw = body === undefined ? undefined : JSON.stringify(body);
    const headers: Record<string, string> = { ...signRequest({ method, path, body: raw, partnerId: this.partnerId, secret: this.#secret }) };
    if (raw !== undefined) headers['content-type'] = 'application/json';
    const response = await this.#fetch(`${this.apiHost}${path}`, { method, headers, body: raw });
    const text = await response.text();
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : undefined;
    } catch {
      // Not JSON (a proxy's error page, for example): the raw text is kept as the body.
    }
    if (!response.ok) throw new EvelynApiError(response.status, parsed, `${method} ${path.split('?')[0]}`);
    return parsed as T;
  }
}
