/**
 * Working level (GDI trial, 2026-10-28; design
 * docs/superpowers/specs/2026-10-28-gdi-trial-lesson-design.md §1).
 *
 * The tutor checks the learner's level ONCE (a short spoken check, then the
 * `set_working_level` tool), pitches the rest of the lesson at it, and the
 * level is remembered on the learner's profile so their next lesson
 * continues there instead of testing again. Offered per partner
 * (`levelCheck` in portal/partner-session-options.ts) under the
 * TUTOR_WORKING_LEVEL kill switch; a session without it never sees any of
 * this.
 *
 * Josh's rules this encodes: never announce a definitive level (no score, no
 * CEFR), say it softly in one line, and only once — never re-test.
 *
 * Pure. No env, no I/O, client-safe.
 */
import type { StudentProfile } from '@/lib/tutor/student-profile/types';

export type WorkingLevel = 'beginner' | 'intermediate' | 'advanced';
export const WORKING_LEVELS: readonly WorkingLevel[] = ['beginner', 'intermediate', 'advanced'];

/** A level from untrusted input (tool args, a request body, a stored row).
 *  Case and surrounding space are forgiven; anything else (CEFR codes,
 *  non-strings) is null. */
export function parseWorkingLevel(v: unknown): WorkingLevel | null {
  if (typeof v !== 'string') return null;
  const s = v.trim().toLowerCase();
  return (WORKING_LEVELS as readonly string[]).includes(s) ? (s as WorkingLevel) : null;
}

export const LEVEL_ALREADY_SET_NOTE = 'Level already set this session; do not re-test.';

/** The once-only rule of `set_working_level`. `current` is the level the
 *  session already holds — set earlier this session OR known from the
 *  learner's previous lesson. */
export function decideSetWorkingLevel(
  current: WorkingLevel | null,
  requested: unknown,
): { ok: boolean; level?: WorkingLevel; note?: string } {
  if (current) return { ok: false, note: LEVEL_ALREADY_SET_NOTE };
  const level = parseWorkingLevel(requested);
  if (!level) return { ok: false, note: `Not a level: use beginner, intermediate or advanced.` };
  return {
    ok: true,
    level,
    note: `Level set to ${level}. Tell the learner in one line, softly, which level you suggest working at today, then move on.`,
  };
}

const LANGUAGE_POLICY: Record<WorkingLevel, (second: string) => string> = {
  beginner: (l) => `Give explanations, instructions and corrections in ${l}. Use English only for the phrases the learner is practising, each said on its own.`,
  intermediate: (l) => `Keep the conversation in English. When you correct something, explain the correction briefly in ${l}, then carry on in English.`,
  advanced: (l) => `Teach in English throughout. Use ${l} only when the learner asks for it.`,
};

const QUESTIONS: Record<WorkingLevel, string> = {
  beginner: 'short, concrete questions about the learner\'s own life and work, one idea at a time. Offer a choice or the first few words when that helps them start.',
  intermediate: 'everyday questions that need a full sentence, then one follow-up that asks for one more detail.',
  advanced: 'open questions that ask for reasons, comparisons and longer answers, at a natural pace.',
};

const SUPPORT: Record<WorkingLevel, string> = {
  beginner: 'Model the sentence before you ask for it, help as soon as they hesitate, and keep every step small.',
  intermediate: 'Let them try first, and give a hint only after a real attempt.',
  advanced: 'Give little help: let them work it out, and correct only what matters for what the lesson is teaching.',
};

/** The session-block clause for a level. `known` = the level came from the
 *  learner's previous lesson (one continuation line, no check today);
 *  otherwise it was just chosen this lesson (one soft line, once).
 *  `secondLanguage` = the session's other language by name (e.g. from the
 *  tutor languages); absent ⇒ the clause says nothing about languages. */
export function buildWorkingLevelClause(
  level: WorkingLevel,
  opts: { secondLanguage?: string; known: boolean },
): string {
  const announce = opts.known
    ? `You know this level from the learner's previous lesson, so there is no level check today. In your opening, say in one line${opts.secondLanguage ? ' in the language you explain in' : ''} that you will continue at this level ("Last time we worked at the ${level} level, so let's continue there"), then begin. Never check the level again in this lesson.`
    : `You chose this level from the learner's answers. Tell them only once, softly, in one line${opts.secondLanguage ? ' in the language you explain in' : ''}, as a suggestion ("I'd suggest we work at the ${level} level today"), then move straight on. If you have already said it, do not say it again, and never check the level again in this lesson.`;
  const lines = [
    `\n\n## Working level: ${level}`,
    `Pitch the rest of this lesson at the ${level} level.`,
    announce,
    ...(opts.secondLanguage ? [`- Language: ${LANGUAGE_POLICY[level](opts.secondLanguage)}`] : []),
    `- Questions: ${QUESTIONS[level]}`,
    `- Support: ${SUPPORT[level]}`,
    `- When the lesson material gives versions marked [beginner], [intermediate] and [advanced], teach only the one marked [${level}]. Never read out or mention the others.`,
    `- Never tell the learner a score, a CEFR level or a label such as "you are a beginner" or "you are advanced". The level is how you pitch the lesson, not a verdict on them.`,
  ];
  return `${lines.join('\n')}\n`;
}

/** Record the level on the learner's profile (pure; the caller saves).
 *  Idempotent: the same level again returns the profile unchanged, so every
 *  session commit may carry it. */
export function applyWorkingLevel(
  profile: StudentProfile,
  input: { level: WorkingLevel; planId: string; at?: number },
): StudentProfile {
  if (profile.workingLevel?.level === input.level) return profile;
  return {
    ...profile,
    workingLevel: { level: input.level, planId: input.planId, setAt: input.at ?? Date.now() },
  };
}
