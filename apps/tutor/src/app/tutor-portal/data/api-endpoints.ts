/**
 * The partner API as it runs in production: every route under
 * /api/portal/v1 on www.evelynlearning.com, HMAC-signed (see /docs/authentication).
 * Keep this list equal to src/app/api/portal/v1/** — nothing aspirational.
 */
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: string;
}

export const apiEndpoints: ApiEndpoint[] = [
  // Session facts & learning state
  { method: 'GET', path: '/sessions/summary?ids=a,b,c', description: 'Per-session facts for up to 50 sessions: status, startedAt/endedAt, durationSec (ACTIVE tutoring seconds — the billed number), studentTurns, tutorTurns, boardItems, coarse location.', category: 'Session facts & learning state' },
  { method: 'GET', path: '/session-progress?sessionId=', description: 'Lesson position for one session: { lessonProgress | null, resumable, updatedAt }. Resumable within 30 days.', category: 'Session facts & learning state' },
  { method: 'GET', path: '/gaps?studentId=', description: 'Learning gaps for a student: id, kind (lo | prerequisite), loId, conceptLabel, status, confidence, evidence (signals, observation, student quotes), first/last seen.', category: 'Session facts & learning state' },
  { method: 'GET', path: '/mastery?studentId=', description: 'Mastery per learning objective: { [loId]: { score, exposures, lastTouchedAt, confidence } }.', category: 'Session facts & learning state' },
  { method: 'POST', path: '/learner-state', description: '{ studentId, loIds?, courseTopic? } → per-LO estimate (0–1), confidence, trend, reviewDueAt, gaps, optional score projection, reviewDueCount. GET with the same fields as query params also works.', category: 'Session facts & learning state' },
  { method: 'POST', path: '/assigned-practice', description: '{ studentId, courseId?, includeAcknowledged? } → homework the tutor assigned at the end of a session, with items and answer keys so you can grade locally.', category: 'Session facts & learning state' },
  { method: 'POST', path: '/session-result', description: 'Push your own session record or per-item evidence into the learner model (SessionEmitRequest). Not needed for embed sessions — the engine records those itself.', category: 'Session facts & learning state' },

  // Student context
  { method: 'POST', path: '/context', description: 'Store per-student preferences the tutor applies to every later session: pacing, humour ceiling, tone, modality, interests. Body is a StudentContext.', category: 'Student context' },
  { method: 'POST', path: '/student-erase', description: '{ studentId } → deletes everything the engine holds for that student. Use for parent deletion requests and sandbox cleanup.', category: 'Student context' },

  // Your curriculum
  { method: 'POST', path: '/plan-generate', description: 'Turn your lesson text, assignment, PDF or image into a lesson plan the tutor can teach. Returns planId (use as curriculum_module in the token), objectives, estimated minutes.', category: 'Your curriculum' },
  { method: 'POST', path: '/plan-expand', description: '{ planId, pickedLoIds } → when plan-generate answered mode: "picker" (too many objectives for the session), expand the ones you chose.', category: 'Your curriculum' },
  { method: 'POST', path: '/review-plan', description: '{ studentId, los: [{ loId, title }], sessionMinutes? } → a remediation plan built from a student\'s weak objectives.', category: 'Your curriculum' },
  { method: 'POST', path: '/taxonomy-generate', description: 'Turn a course outline into a draft learning-objective graph you can review and adopt.', category: 'Your curriculum' },

  // Practice & assessment
  { method: 'POST', path: '/practice', description: '{ studentId, courseId, scope: { loId } | { topicId }, count, difficulty?, excludeIds? } → practice items with hints and answer keys.', category: 'Practice & assessment' },
  { method: 'POST', path: '/grade', description: '{ studentId, itemId, response: { text } | { imageRef } } → rubric-based score with per-criterion feedback and a model response.', category: 'Practice & assessment' },
  { method: 'POST', path: '/assessment', description: 'Build a short assessment set for a student across chosen objectives.', category: 'Practice & assessment' },
  { method: 'POST', path: '/assessment/submit', description: 'Submit assessment responses → per-objective scores and review items.', category: 'Practice & assessment' },

  // Notes
  { method: 'GET', path: '/notes', description: 'Rendered study notes for a topic, including tips the tutor added during sessions.', category: 'Notes' },
  { method: 'GET', path: '/notes/unit', description: 'Rendered revision notes for a whole unit.', category: 'Notes' },

  // Mock exams (test prep)
  { method: 'GET', path: '/mock/forms?studentId=&topicId=', description: 'Mock exam forms available to a student.', category: 'Mock exams (test prep)' },
  { method: 'POST', path: '/mock/attempts', description: 'Start an attempt. Companion routes: /mock/attempts/responses (save), /advance, /report, /review (tutor-led review of missed items).', category: 'Mock exams (test prep)' },
];

export const apiCategories = [...new Set(apiEndpoints.map((e) => e.category))];
