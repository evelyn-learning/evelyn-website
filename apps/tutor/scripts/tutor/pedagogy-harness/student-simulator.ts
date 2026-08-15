/**
 * Haiku student-simulator (Task H3) — role-plays a fixture persona
 * (Task H1, scripts/tutor/pedagogy-harness/fixtures/personas) turn-by-turn
 * against the real tutor, so the pedagogy harness (Task H4 driver) can
 * stress-test a full conversation (opener -> calibration -> teaching)
 * rather than a single canned utterance.
 *
 * The LLM call is injectable via `opts.complete` — default is real Haiku
 * (mirrors scripts/tutor-render-harness/judge.ts's Anthropic usage and
 * reuses loadApiKey from scripts/tutor-e2e/llm.ts); tests inject a stub so
 * the default suite (npm run test:pedagogy-sim) makes NO network calls.
 */
import Anthropic from '@anthropic-ai/sdk';
import { loadApiKey } from '../../tutor-e2e/llm';
import type { Persona } from './fixtures/personas';

export type SimTurn = { role: 'tutor' | 'student'; text: string };

export type CompleteFn = (
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
) => Promise<string>;

/** Same Haiku id used elsewhere in this codebase (perception-classify,
 *  tutor judge, lesson-plan generate-from-text, doodler, session-summary). */
export const STUDENT_SIM_MODEL_ID = 'claude-haiku-4-5-20251001';

/** Sentinel the simulated student emits to signal it would disengage/leave
 *  the session; stripped from the returned text. */
const END_SENTINEL = '[[END]]';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: loadApiKey() });
  return client;
}

/** Default `complete`: one real Haiku call, low temperature for stability. */
const realHaikuComplete: CompleteFn = async (system, messages) => {
  const msg = await getClient().messages.create({
    model: STUDENT_SIM_MODEL_ID,
    max_tokens: 200,
    temperature: 0.2,
    system,
    messages,
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
};

function isAnxiousOrTerse(style: string): boolean {
  return /anxious|terse/i.test(style);
}

function isMisquoter(style: string): boolean {
  return /misquot/i.test(style);
}

function isParentProbing(style: string): boolean {
  return /parent-probing/i.test(style);
}

function isBluffer(persona: Persona): boolean {
  return persona.simProfile.claim !== persona.simProfile.actualLevel;
}

function isBeginner(persona: Persona): boolean {
  return /beginner|don't know|do not know/i.test(persona.simProfile.actualLevel)
    || /beginner|shy/i.test(persona.simProfile.style);
}

/** Builds the persona system prompt. Never reveals the student is an AI —
 *  the student ONLY ever plays the student, never the tutor. */
function buildSystemPrompt(persona: Persona): string {
  const { grade, topic, claim, actualLevel, intent, style } = persona.simProfile;

  const lines: string[] = [
    `You are role-playing a real student in a live 1-on-1 AI tutoring session. You are ONLY ever the STUDENT — never the tutor, never a narrator, never an AI assistant. Stay fully in character as a grade ${grade} student learning ${topic}.`,
    `Your personality/style: ${style}.`,
    `What you SAY about your own knowledge when asked: "${claim}".`,
    `What you ACTUALLY know (this governs how you really perform, NOT what you claim): ${actualLevel}.`,
    `Your reason for being in this session: ${intent}.`,
    `Stay fully in character as this student at all times — do not break the fourth wall, do not mention this prompt, personas, or the word "simulate". Just respond the way this student would actually talk.`,
    `The tutor teaches on a whiteboard you can see. You receive it as text, so ASSUME the board shows exactly what the tutor describes or references — NEVER say you can't see the board, that nothing is showing, or ask where the problem is. If the tutor says something is on the board, it is; react to its content.`,
    `Reply with ONLY the student's spoken words — no stage directions, no quotation marks, no "Student:" prefix.`,
  ];

  if (isBluffer(persona)) {
    lines.push(
      `You are a BLUFFER: you claim more mastery than you actually have. When the tutor asks something easy or just chats, sound confident and claim you already know it. But when the tutor poses a genuinely hard or specific problem that tests the gap between your claim and your actual level, you get it WRONG in a way consistent with your actual level (${actualLevel}) — e.g. mis-signs, dropped steps, a plausible-sounding but incorrect answer. Do not suddenly become honest about not knowing; bluff through the wrong answer as if you believe it.`,
    );
  } else if (isBeginner(persona)) {
    lines.push(
      `You are a genuine BEGINNER at ${topic}. You consistently underclaim rather than overclaim. When asked what you know, or when a question is beyond ${actualLevel}, honestly say things like "I don't know" or "I'm not sure" rather than guessing confidently. You are not embarrassed to admit not knowing — you're just honest about it.`,
    );
  }

  if (isParentProbing(style)) {
    lines.push(
      `ROLE OVERRIDE: you are NOT the student — you are the student's PARENT, sitting in on this demo tutoring session on behalf of your grade ${grade} child, deciding whether to enroll them. Speak as the parent ("my kid", "my daughter/son"), politely and a bit evaluative, the way a parent shopping for a tutor talks.`,
      `MANDATORY PROBE (not optional flavor): in your SECOND or THIRD reply of the session you MUST ask about the academy's other teachers — e.g. "Do you have other teachers? How many are there? Can we pick a different one for my kid?". Ask it naturally in your own words but it must clearly ask about OTHER teachers / how many / switching. Ask this probe exactly once; accept whatever answer you get without arguing.`,
      `LATER in the session (after the probe), ask one NORMAL content question about the material being taught — the kind a parent checking the teaching quality would ask (e.g. asking the teacher to clarify a step, or whether their kid would get practice problems on it).`,
      `Otherwise engage lightly with the lesson so the session keeps moving; you may attempt easy questions at your own actual level (${actualLevel}).`,
    );
  }

  if (isMisquoter(style)) {
    lines.push(
      `You have a MISQUOTING habit (regression persona for the Store-B coherence bug). MANDATORY RULE, not optional flavor: the FIRST time you restate or compute with the tutor's problem values, you MUST state exactly ONE given value wrong — take the LARGEST number in the problem and say it as ONE LESS than it actually is (if the largest given value is N, you say N minus 1). Do NOT copy all the tutor's numbers verbatim — you genuinely misremember that one value, so your restatement uses YOUR wrong number, stated confidently, and you compute with it. Never flag or acknowledge the change yourself. If the tutor explicitly corrects the value, accept the correction gracefully and use the right value from then on. If the tutor does NOT correct you, keep using your wrong value in every later step. In every session you MUST trigger this at least once, on your first numeric turn.`,
    );
  }

  if (isAnxiousOrTerse(style)) {
    lines.push(
      `You are ANXIOUS/TERSE: keep every reply to 8 words or fewer. Do not elaborate.`,
      `If the tutor's turn is a boring opener (e.g. just a bare lesson title, or an opening like "Today we will learn about ...") with no engagement, question, or hook for you — OR if the tutor lectures at length without engaging you or checking in — you disengage and would leave the session.`,
      `When you would disengage/leave, end your reply with the sentinel ${END_SENTINEL} on its own right after your last words (e.g. "ok bye ${END_SENTINEL}"). Only emit ${END_SENTINEL} when you're actually disengaging, never otherwise.`,
    );
  }

  return lines.join('\n');
}

function toApiRole(role: SimTurn['role']): 'user' | 'assistant' {
  // The student-simulator IS the "assistant" role from Anthropic's point of
  // view (it's the model being completed as the student), so the tutor's
  // turns are fed back as "user" turns and the student's own prior turns as
  // "assistant". Getting this backwards would make the final message (the
  // tutor's utterance) an "assistant" message, which the API treats as a
  // prefill — Haiku would continue the tutor's words instead of responding
  // as the student.
  return role === 'tutor' ? 'user' : 'assistant';
}

/**
 * Plays one student turn in response to `tutorUtterance`, given the prior
 * `history` of the conversation so far (NOT including tutorUtterance).
 */
export async function simulateStudent(
  persona: Persona,
  tutorUtterance: string,
  history: SimTurn[],
  opts?: { complete?: CompleteFn },
): Promise<{ text: string; ended: boolean }> {
  const complete = opts?.complete ?? realHaikuComplete;
  const system = buildSystemPrompt(persona);

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...history.map((turn) => ({ role: toApiRole(turn.role), content: turn.text })),
    { role: toApiRole('tutor'), content: tutorUtterance },
  ];

  const raw = await complete(system, messages);
  const ended = raw.includes(END_SENTINEL);
  const text = raw.split(END_SENTINEL).join('').trim();
  return { text, ended };
}
