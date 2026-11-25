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
  { method: 'GET', path: '/sessions/summary?ids=a,b,c', description: 'Per-session facts for up to 50 sessions: status, startedAt/endedAt, durationSec (active tutoring seconds; see How minutes are counted below), studentTurns, tutorTurns, boardItems, coarse location.', category: 'Session facts & learning state' },
  { method: 'GET', path: '/usage', description: 'Your tutoring minute pool, when one applies: { partner_id, pooled, cap_minutes, used_minutes, remaining_minutes, session_max_minutes }. Minutes are wall clock per sitting (tutor start to end, pauses included). Hide your start button under 1 minute remaining; cache for 60 s.', category: 'Session facts & learning state' },
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

  // Worksheet help (2026-11-24: these five routes were in integration.md and missing here; shapes read from
  // src/app/api/portal/v1/{homework-build,homework-problem-plan,homework-problem-outcome,material-summary}/route.ts)
  { method: 'POST', path: '/homework-build', description: '{ planId, first? } → 202 { started }. After plan-generate has read a worksheet (its response carries problems: [{ n, text }]), prepares every question in the background so that homework-problem-plan answers at once. first is the question number to prepare first.', category: 'Worksheet help' },
  { method: 'GET', path: '/homework-build?planId=', description: 'Progress of that preparation: { planId, done, startedAt, updatedAt, problems: [{ n, status, hasFigure, … }] }. Never carries an answer key.', category: 'Worksheet help' },
  { method: 'POST', path: '/homework-problem-plan', description: '{ planId, n, waitMs?, locale?, priorNote?, priorConfirmed? } → 201 { planId, verified, hasFigure, buildStatus }. Makes the one-question plan a session runs on: put the returned planId in the token as curriculum_module, with session_goal "homework-help". Waits up to waitMs (0 to 8000) for the question to be ready.', category: 'Worksheet help' },
  { method: 'GET', path: '/homework-problem-outcome?sessionId=&planId=', description: 'How one worksheet-question session went: { outcome: "done" | "in_progress" | "needs_review", priorNote, confirmed }. Pass priorNote and confirmed back to homework-problem-plan (as priorNote, priorConfirmed) if the student returns to the question. Never returns an answer.', category: 'Worksheet help' },
  { method: 'POST', path: '/material-summary', description: '{ materials: [ … ] } (the same file objects as plan-generate) → what an upload is about, so your page can show it before a lesson is made. 422 when a file cannot be read, 502 summary_failed when no summary could be made.', category: 'Worksheet help' },

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
