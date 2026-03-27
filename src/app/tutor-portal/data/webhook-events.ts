export interface WebhookEvent {
  event: string;
  trigger: string;
  category: string;
  keyFields: string[];
}

export const webhookEvents: WebhookEvent[] = [
  { event: 'session.started', trigger: 'Student begins tutoring', category: 'Session Lifecycle', keyFields: ['session_id', 'student_id', 'subject', 'topic', 'level', 'input_mode', 'timestamp'] },
  { event: 'session.active', trigger: 'First student message sent', category: 'Session Lifecycle', keyFields: ['session_id', 'student_id', 'timestamp'] },
  { event: 'session.paused', trigger: 'Student pauses session', category: 'Session Lifecycle', keyFields: ['session_id', 'pause_reason', 'elapsed_seconds'] },
  { event: 'session.resumed', trigger: 'Student resumes session', category: 'Session Lifecycle', keyFields: ['session_id', 'pause_duration_seconds'] },
  { event: 'session.ended', trigger: 'Session completes or times out', category: 'Session Lifecycle', keyFields: ['session_id', 'duration', 'message_count', 'whiteboard_items', 'token_usage', 'end_reason'] },
  { event: 'session.abandoned', trigger: 'Student leaves without ending', category: 'Session Lifecycle', keyFields: ['session_id', 'last_activity_timestamp', 'duration'] },
  { event: 'session.transcript', trigger: 'Full transcript available (post-session)', category: 'Session Lifecycle', keyFields: ['session_id', 'transcript[]', 'whiteboard_commands[]'] },
  { event: 'usage.summary', trigger: 'End-of-session cost breakdown', category: 'Usage', keyFields: ['session_id', 'input_tokens', 'output_tokens', 'audio_tokens', 'estimated_cost'] },
  { event: 'usage.daily', trigger: 'Daily aggregate for partner', category: 'Usage', keyFields: ['date', 'total_sessions', 'total_minutes', 'total_cost', 'unique_students'] },
  { event: 'whiteboard.generated', trigger: 'Whiteboard visual created', category: 'Content', keyFields: ['session_id', 'command_type', 'page_number', 'timestamp'] },
  { event: 'homework.uploaded', trigger: 'Student uploads homework photo', category: 'Content', keyFields: ['session_id', 'student_id', 'extraction_status', 'problem_count'] },
  { event: 'homework.extracted', trigger: 'Problems extracted from photo', category: 'Content', keyFields: ['session_id', 'problems[]', 'confidence_score'] },
  { event: 'student.milestone', trigger: 'Student demonstrates mastery of a concept', category: 'Learning', keyFields: ['session_id', 'student_id', 'concept_id', 'milestone_type'] },
  { event: 'error.session', trigger: 'Session-level error', category: 'Errors', keyFields: ['session_id', 'error_code', 'error_message', 'recoverable'] },
  { event: 'error.voice', trigger: 'Voice engine error (connection, transcription)', category: 'Errors', keyFields: ['session_id', 'error_type', 'fallback_action'] },
];

export const webhookCategories = [...new Set(webhookEvents.map((e) => e.category))];
