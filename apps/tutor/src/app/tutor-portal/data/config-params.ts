/**
 * Embed token claims as the engine actually reads them — see EmbedConfig in
 * src/app/tutor-portal/embed/page.tsx. Nothing here is aspirational.
 */
export interface ConfigParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export const configParams: ConfigParam[] = [
  { name: 'partner_id', type: 'string', required: true, description: 'Your partner id (issued with your credentials)', example: '"kanzoo"' },
  { name: 'student_id', type: 'string', required: true, description: 'Your stable internal student id. All engine data for the student is keyed on it, scoped to your partner.', example: '"stu_abc123"' },
  { name: 'subject', type: 'string', required: true, description: 'math, science, ela, social-studies (also cs, languages)', example: '"math"' },
  { name: 'level', type: 'string', required: true, description: 'Grade label', example: '"Grade 6"' },
  { name: 'teacher', type: 'object', required: true, description: 'Teacher persona and VOICE — copy an entry from the persona catalog verbatim. The tutor introduces itself by that name, teaches in that style and speaks with that voice. Without it the engine uses its default persona voice.', example: '{ "id": "ms-priya-nair", "name": "Ms. Priya Nair", ... "voice": { "provider": "cartesia", "voiceId": "..." } }' },
  { name: 'student_name', type: 'string', required: false, description: 'First name; the tutor uses it in conversation', example: '"Ayaan"' },
  { name: 'topic', type: 'string', required: false, description: 'Free text. Without curriculum_module the tutor builds a just-in-time lesson on this topic.', example: '"Ratios and unit rates"' },
  { name: 'curriculum_module', type: 'string', required: false, description: 'A lesson plan id — one returned by POST /plan-generate (your material) or one of ours. Locks the session to that plan.', example: '"plan_8f3a…"' },
  { name: 'target_kind', type: 'string', required: false, description: '"lessonNode" when curriculum_module is set, otherwise "freestyle"', example: '"lessonNode"' },
  { name: 'session_goal', type: 'string', required: false, description: 'homework-help, practice, concept-review (default), test-prep, catch-up, challenge, general', example: '"homework-help"' },
  { name: 'input_mode', type: 'string', required: false, description: '"voice" (default) or "text"', example: '"voice"' },
  { name: 'tutor_opens', type: 'boolean', required: false, description: 'Text mode only: the tutor opens the session itself (any session_goal) instead of waiting for the student to type first', example: 'true' },
  { name: 'max_duration_minutes', type: 'number', required: false, description: 'Hard cap, 1–120, default 30. The session wraps up gracefully and session_ended carries ended_reason: "time_limit".', example: '30' },
  { name: 'session_id', type: 'string', required: false, description: 'Supply your own session id and the engine uses it everywhere (events, /sessions/summary). Otherwise the engine mints one.', example: '"duc-sess-9012"' },
  { name: 'resume', type: 'boolean', required: false, description: 'With the same session_id, continue the session (position, transcript, board restored) instead of starting over. Checkpoints kept 30 days.', example: 'true' },
  { name: 'progress_digest', type: 'object', required: false, description: 'Lets the tutor open with a progress line: { unitsCompleted, unitsTotal, percentComplete, weeksElapsed?, paceNote? }', example: '{ "unitsCompleted": 3, "unitsTotal": 12, "percentComplete": 25 }' },
  { name: 'social_memory', type: 'array', required: false, description: 'Light personal threads the tutor may reference this session only; never stored by the engine: [{ id, note, kind?, capturedAt }]', example: '[{ "id": "t1", "note": "has a football match Saturday", "capturedAt": "2026-09-10T10:00:00Z" }]' },
  { name: 'branding', type: 'object', required: false, description: '{ primary_color, logo_url, product_name } — accent colour and a header logo/name inside the frame', example: '{ "primary_color": "#1E40AF", "product_name": "DUC Tutor" }' },
  { name: 'features', type: 'object', required: false, description: '{ homework_upload, text_mode, voice_mode } booleans', example: '{ "homework_upload": false }' },
  { name: 'metadata', type: 'object', required: false, description: 'Arbitrary key-value pairs stored with the session for your own reference', example: '{ "class_id": "math-6b" }' },
  { name: 'exp', type: 'number', required: false, description: 'Unix seconds. Recommended 2 hours. A 4-hour grace after exp keeps long sessions alive.', example: '1789458037' },
  { name: 'iat', type: 'number', required: false, description: 'Unix seconds', example: '1789450837' },
];
