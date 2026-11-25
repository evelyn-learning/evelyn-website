/**
 * @evelynlearning/tutor: server-side helpers for the Evelyn Voice Tutor.
 * Sign a session token, get the session URL, call the worksheet and usage API.
 * The browser side (the iframe and its events) is in `@evelynlearning/tutor/embed`.
 */
export {
  createSessionToken,
  createSessionUrl,
  sessionUrl,
  verifySessionToken,
  DEFAULT_EMBED_HOST,
  type LessonLanguage,
  type SessionClaims,
  type SessionGoal,
  type SessionTokenPayload,
  type TeacherPersona,
  type TokenOptions,
} from './token.js';
export { signRequest, type SignRequestInput, type SignedHeaders } from './signing.js';
export {
  EvelynTutor,
  DEFAULT_API_HOST,
  type EvelynTutorOptions,
  type PrepareProblemOptions,
  type ProblemBuildStatus,
  type ProblemOutcome,
  type ProblemPlan,
  type SessionSummary,
  type SessionsApi,
  type Usage,
  type WorksheetApi,
  type WorksheetBuildStatus,
  type WorksheetImage,
  type WorksheetProblem,
  type WorksheetReadInput,
  type WorksheetReadResult,
} from './client.js';
export { EvelynApiError, EvelynConfigError } from './errors.js';
