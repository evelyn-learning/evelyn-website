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
  { name: 'partner_id', type: 'string', required: true, description: 'Your partner id, shown on the API keys page of your dashboard', example: '"acme-learning"' },
  { name: 'student_id', type: 'string', required: true, description: 'Your stable internal student id. All engine data for the student is keyed on it, scoped to your partner.', example: '"stu_abc123"' },
  { name: 'subject', type: 'string', required: true, description: 'math, science, ela, social-studies (also cs, languages)', example: '"math"' },
  { name: 'level', type: 'string', required: true, description: 'Grade label', example: '"Grade 6"' },
  { name: 'teacher', type: 'string | object', required: false, description: 'Teacher persona: a ready-made teacher id, or a persona object of your own (name, intro, style, and a voice code as voice). See Voices and Companions. Without it the tutor uses its default teacher.', example: '"ms-priya-nair"' },
  { name: 'voice', type: 'string', required: false, description: 'Voice code from the Voices and Companions page. Wins over the persona\'s own voice.', example: '"maple"' },
  { name: 'student_name', type: 'string', required: false, description: 'First name; the tutor uses it in conversation', example: '"Ayaan"' },
  { name: 'topic', type: 'string', required: false, description: 'Free text. Without curriculum_module the tutor builds a just-in-time lesson on this topic.', example: '"Ratios and unit rates"' },
  { name: 'curriculum_module', type: 'string', required: false, description: 'A lesson plan id — one returned by POST /plan-generate (your material) or one of ours. Locks the session to that plan.', example: '"plan_8f3a…"' },
  { name: 'target_kind', type: 'string', required: false, description: '"lessonNode" when curriculum_module is set, otherwise "freestyle"', example: '"lessonNode"' },
  { name: 'session_goal', type: 'string', required: false, description: 'homework-help, practice, concept-review (default), test-prep, catch-up, challenge, general', example: '"homework-help"' },
  // 2026-11-24: the three claims below were read by the engine and documented only in integration.md.
  { name: 'tutor_languages', type: 'string[]', required: false, description: 'The language the whole lesson is taught in, as one code in a list: voice, listening, board and screen labels. Leave it out for English. See Languages for the codes.', example: '["hi"]' },
  { name: 'switch_languages', type: 'string[] | "all"', required: false, description: 'The languages the student may change the lesson to by asking the tutor: a list of codes, or "all". Left out, the lesson stays in its language. See Languages.', example: '["hi", "hi-Latn"]' },
  { name: 'speech_rate', type: 'number', required: false, description: 'How fast the tutor speaks, 0.6 to 1.5; 1 is normal. Left out, the tutor sets its own pace.', example: '0.85' },
  { name: 'input_mode', type: 'string', required: false, description: '"voice" (default) or "text"', example: '"voice"' },
  { name: 'tutor_opens', type: 'boolean', required: false, description: 'Text mode only: the tutor opens the session itself (any session_goal) instead of waiting for the student to type first', example: 'true' },
  { name: 'max_duration_minutes', type: 'number', required: false, description: 'Hard cap, 1–120, default 30. The session wraps up gracefully and session_ended carries ended_reason: "time_limit". Your account\'s own session limit applies when it is lower: 15 minutes in the free sandbox, 60 after a first purchase.', example: '15' },
  { name: 'session_id', type: 'string', required: false, description: 'Supply your own session id and the engine uses it everywhere (events, /sessions/summary). Otherwise the engine mints one.', example: '"sess-9012"' },
  { name: 'resume', type: 'boolean', required: false, description: 'With the same session_id, continue the session (position, transcript, board restored) instead of starting over. Checkpoints kept 30 days.', example: 'true' },
  { name: 'progress_digest', type: 'object', required: false, description: 'Lets the tutor open with a progress line: { unitsCompleted, unitsTotal, percentComplete, weeksElapsed?, paceNote? }', example: '{ "unitsCompleted": 3, "unitsTotal": 12, "percentComplete": 25 }' },
  { name: 'social_memory', type: 'array', required: false, description: 'Light personal threads the tutor may reference this session only; never stored by the engine: [{ id, note, kind?, capturedAt }]', example: '[{ "id": "t1", "note": "has a football match Saturday", "capturedAt": "2026-09-10T10:00:00Z" }]' },
  { name: 'branding', type: 'object', required: false, description: '{ primary_color, logo_url, product_name } — accent colour and a header logo/name inside the frame', example: '{ "primary_color": "#1E40AF", "product_name": "Acme Tutor" }' },
  { name: 'features', type: 'object', required: false, description: '{ homework_upload, text_mode, voice_mode } booleans', example: '{ "homework_upload": false }' },
  { name: 'metadata', type: 'object', required: false, description: 'Arbitrary key-value pairs stored with the session for your own reference', example: '{ "class_id": "math-6b" }' },
  { name: 'exp', type: 'number', required: false, description: 'Unix seconds. Recommended 2 hours. A 4-hour grace after exp keeps long sessions alive.', example: '1789458037' },
  { name: 'iat', type: 'number', required: false, description: 'Unix seconds', example: '1789450837' },
];
