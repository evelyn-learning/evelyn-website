export interface ConfigParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export const configParams: ConfigParam[] = [
  { name: 'partner_id', type: 'string', required: true, description: 'Your partner identifier', example: '"algerian-bac"' },
  { name: 'student_id', type: 'string', required: true, description: 'Your internal student ID (for analytics and data retrieval)', example: '"stu_abc123"' },
  { name: 'student_name', type: 'string', required: false, description: 'Student\'s first name (used in conversation)', example: '"Ahmed"' },
  { name: 'subject', type: 'string', required: true, description: 'Subject code (math, science, ela, cs, etc.)', example: '"math"' },
  { name: 'topic', type: 'string', required: false, description: 'Topic ID from taxonomy or custom curriculum module', example: '"algebra-2"' },
  { name: 'level', type: 'string', required: true, description: 'Grade level (K-2, 3-5, 6-8, 9-10, 11-12, AP, college)', example: '"11-12"' },
  { name: 'session_goal', type: 'string', required: false, description: 'practice, homework-help, concept-review, test-prep, catch-up, challenge', example: '"test-prep"' },
  { name: 'engine', type: 'string', required: false, description: 'Voice engine tier: "standard" or "premium" (default: "standard")', example: '"standard"' },
  { name: 'locale', type: 'string', required: false, description: 'BCP 47 locale code for voice language (default: en-US)', example: '"ar-DZ"' },
  { name: 'input_mode', type: 'string', required: false, description: '"voice" (default) or "text"', example: '"voice"' },
  { name: 'voice', type: 'string', required: false, description: 'Voice selection (coral, shimmer, alloy, ash, ballad, echo, sage, verse)', example: '"coral"' },
  { name: 'curriculum_module', type: 'string', required: false, description: 'ID of custom knowledge module to load', example: '"algerian-bac-math-2026"' },
  { name: 'branding', type: 'object', required: false, description: 'Visual customization: { primary_color, logo_url, product_name }', example: '{ "primary_color": "#1E40AF", "product_name": "BAC Tutor" }' },
  { name: 'max_duration_minutes', type: 'number', required: false, description: 'Session time limit for cost control (default: unlimited)', example: '30' },
  { name: 'features', type: 'object', required: false, description: 'Enable/disable: homework_upload, text_mode, voice_mode', example: '{ "homework_upload": true }' },
  { name: 'metadata', type: 'object', required: false, description: 'Arbitrary key-value pairs passed through to webhooks', example: '{ "class_id": "math-11b" }' },
];
