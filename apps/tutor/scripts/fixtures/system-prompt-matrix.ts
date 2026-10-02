import type { SystemPromptContext } from '@/lib/tutor/ai/system-prompt-builder';

const base = { module: null, timeRemainingMinutes: 30, currentState: 'greeting' } as unknown as SystemPromptContext;
const ctx = (o: Record<string, unknown>) => ({ ...base, ...o }) as SystemPromptContext;

/** Mirrors what VoiceTutorRealtime passes. Server-only prompt flags are left
 *  unset, as they are in the browser. */
export const PROMPT_MATRIX: Record<string, SystemPromptContext> = {
  math_g8: ctx({ subject: 'math', topic: 'linear-equations', level: 'grade-8', studentName: 'Alex', sessionGoal: 'concept-review' }),
  physics_ap: ctx({ subject: 'physics', topic: 'kinematics', level: 'ap', studentName: 'Maya', sessionGoal: 'practice' }),
  freetext_subject: ctx({ subject: 'Financial Literacy', topic: 'Own a Piece or Lend the Money?', level: '11th Grade', studentName: 'Praveen', sessionGoal: 'homework-help' }),
  no_name_no_topic: ctx({ subject: 'biology', level: 'High school', sessionGoal: 'general' }),
  text_mode: ctx({ subject: 'math', topic: 'fractions', level: 'grade-6', studentName: 'Sam', sessionGoal: 'homework-help', inputMode: 'text' }),
  open_scope: ctx({ subject: 'cs', topic: 'ap-cs-principles', level: 'ap', studentName: 'Kai', sessionGoal: 'practice', openScope: true }),
  first_turn_flags: ctx({ subject: 'chemistry', topic: 'stoichiometry', level: 'grade-10', studentName: 'Ada', sessionGoal: 'test-prep', firstTurnV2: true, answerRevealGuard: true }),
  humor_override: ctx({ subject: 'math', topic: 'linear-equations', level: 'grade-8', studentName: 'Alex', sessionGoal: 'concept-review', sessionHumorOverride: 'off' }),
  self_report: ctx({ subject: 'ela', topic: 'essay-structure', level: 'grade-7', studentName: 'Noor', sessionGoal: 'catch-up', selfReportRouting: true }),
};
