/**
 * Browser events the embed posts to its parent window (window.parent.postMessage).
 * These are the ONLY push events today; there is no outbound webhook delivery
 * yet. Keep in sync with src/app/tutor-portal/embed/page.tsx.
 */
export interface WebhookEvent {
  event: string;
  trigger: string;
  category: string;
  keyFields: string[];
}

export const webhookEvents: WebhookEvent[] = [
  { event: 'evelyn:session_started', trigger: 'The student starts the session', category: 'Session lifecycle', keyFields: ['session_id', 'started_at_ms?'] },
  { event: 'evelyn:progress', trigger: 'Every lesson-segment change', category: 'Session lifecycle', keyFields: ['session_id', 'lesson_progress { lessonPlanId, segments[], currentSegmentId, completedSegmentIds[], currentSegmentLabel?, percent? }', 'practice?'] },
  { event: 'evelyn:session_ended', trigger: 'The student ends the session, or the time cap ends it', category: 'Session lifecycle', keyFields: ['session_id', 'duration (wall-clock seconds)', 'message_count', 'whiteboard_items', 'milestone', 'lesson_progress?', 'ended_reason? ("time_limit")', 'end_intent? ("finish" | "discard")'] },
  { event: 'evelyn:expand', trigger: 'The tutor asks the host for more room', category: 'Layout', keyFields: [] },
  { event: 'evelyn:collapse', trigger: 'The tutor releases the extra room', category: 'Layout', keyFields: [] },
];

export const webhookCategories = [...new Set(webhookEvents.map((e) => e.category))];
