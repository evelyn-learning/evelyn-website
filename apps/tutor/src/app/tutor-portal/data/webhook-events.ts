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
  { event: 'evelyn:session_ended', trigger: 'The student ends the session, the time cap ends it, or the host asks it to end (evelyn:host_end)', category: 'Session lifecycle', keyFields: ['session_id', 'duration (total active seconds across the session, including earlier sittings of a resumed session)', 'message_count', 'whiteboard_items', 'milestone', 'lesson_progress?', 'ended_reason? ("time_limit" | "finished" | "minutes_exhausted" | "no_input" | "idle")', 'end_intent? ("finish" | "discard")'] },
  // Top-level field (no `data` wrapper): { type: 'evelyn:activity', last_student_input_at_ms }.
  { event: 'evelyn:activity', trigger: 'A real student turn (typed or spoken), at most once per 5 s', category: 'Session lifecycle', keyFields: ['last_student_input_at_ms (top-level, not under data)'] },
  { event: 'evelyn:expand', trigger: 'The tutor asks the host for more room', category: 'Layout', keyFields: [] },
  { event: 'evelyn:collapse', trigger: 'The tutor releases the extra room', category: 'Layout', keyFields: [] },
];

/**
 * Messages the HOST posts INTO the embed iframe (iframe.contentWindow.postMessage).
 * Accepted only from the iframe's parent window, origin-checked against the
 * embedding page. Keep in sync with src/app/tutor-portal/embed/page.tsx and
 * src/lib/tutor/portal/host-end.ts.
 */
export const inboundEvents: WebhookEvent[] = [
  { event: 'evelyn:host_end', trigger: 'The host wants the session to end (its own finish button, a usage ceiling, an inactivity timeout). The tutor says a one-line goodbye, saves, then posts evelyn:session_ended with ended_reason = reason. Ignored after the first, and once the session is already ending.', category: 'Host → embed', keyFields: ['reason ("finished" | "minutes_exhausted" | "no_input" | "idle", top-level)'] },
];

export const webhookCategories = [...new Set(webhookEvents.map((e) => e.category))];
