/**
 * Prompts of the practice-extension job. Pure (no I/O).
 *
 * All wording is subject-agnostic: no topic, no example question, no example
 * answer. The notation rule states what the existing bank rows actually do
 * (checked 2026-10-09 on the six generated courses: 0 of 479 science rows and
 * 46 of 399 maths rows use `$…$`; the rest are plain text with Unicode
 * symbols, and every stored answer is plain text).
 */
import type { Prompt } from '../../src/lib/tutor/portal/key-verify-prompts';
import { FIGURE_QUALITY_CHECKS, QUALITY_CHECKS, type QualityCheck, type QualityCheckId } from './core';

const obj = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

// ── generation ──────────────────────────────────────────────────────────────

export const GENERATE_SYSTEM = `You write practice questions for a secondary-school or college-entry course. You are given one skill and some of its learning objectives; each objective comes with the lesson material that teaches it and with the questions it already has. Write the requested number of NEW questions for each listed objective.

What a question may and may not say
- It practises its own objective — the one whose id it carries — at the level the objective's verb demands: when the objective asks the student to apply, calculate, analyse, compare, predict or explain, the question requires that and not the recall of a fact. Where an objective comes with no lesson material, work from its description, at the level the rest of the skill implies.
- It is self-contained: the student sees only the question text (and the options). Give every value, definition and condition that is needed, and there must be exactly one defensible answer. When the value of a constant, a convention or a rounding rule changes the answer, state it.
- It says what is asked and gives the data — nothing more. It must not state, hint at or lead to the answer, and must not narrow the answer or its form beyond what a student needs in order to respond. So: no clause giving a reason that points to the answer; no naming of the method, rule or formula to use (give a constant's value, not the relation it goes into); no worked hint; no sample of what an answer looks like. Guidance belongs in hints, never in the question.
- The answer itself does not appear in the question text. A question that asks the student to pick among alternatives named in the text is written as multiple choice.
- Text only. Objectives that need a figure have already been set aside, so every objective you are given can be practised in text. Should one nevertheless turn out to need it — practising it honestly requires the student to PRODUCE a figure (sketch, draw, plot, label) or to READ one (a graph, diagram, picture or map that is shown) — write NO question for it and list the objective under needsFigure with a one-sentence reason. Do not substitute a verbal description of the figure, or of what a sketch would show. The one exception: a question that can be done entirely from data written out in the text — a short list or a small table of values — is acceptable.
- You have worked it through before finalising it: the stored answer is exactly what the working gives.

Different tasks, not different numbers
- The questions for one objective are DIFFERENT types of task: each asks the student to do a different thing — another aspect of the objective, the reverse direction of reasoning, another kind of given and unknown. The same task with other values, names or contexts is not a different task.
- Judge sameness by what the student must DO, not by wording: if two questions are answered by the same steps, they are the same task whatever they are called.
- Each objective lists the questions it already has. A new question must be a type of task that none of them — and not the worked example — already uses.
- Label every question with taskType: two to five words that name the kind of task in general terms, without its particular values or names. Two questions for one objective never share a task type.
- The question must need the objective's own idea to answer. A calculation or a reading task that could be done without that idea, dressed in the subject's vocabulary, does not practise the objective.

Formats — use a mix across the skill, choosing for each question the format that suits what it asks
- mcq: exactly four options in choices, exactly one correct; answer is its letter (A, B, C or D). No two options say the same thing in different forms. No option is the correct one with words added. No "all of the above", "none of the above" or combinations of other options. Each wrong option is the outcome of one specific mistake a student could really make, and is plausible to someone who has not mastered the objective. The correct option does not stand out by length, detail or form, and its position varies from question to question. For multiple choice also fill distractorRationales: one entry per option, in the same order — for each wrong option the specific mistake that produces it, each a different mistake, and the single word correct for the right option. (Leave distractorRationales empty for the other formats.)
- numeric: answer is ONE plain number — an integer, a decimal or an a/b fraction — with no unit, word or symbol. The question names the unit expected and, when the value is not exact, says how to round. choices is empty.
- free: a short answer a grader can compare — a value with its unit, an expression, a term, or one short phrase. At most twelve words, and no reason or justification inside the answer: reasoning goes in solutionText. Ask only for what such an answer can carry; a question that needs a sentence of explanation is not a free question — make it multiple choice, or ask for the result alone. choices is empty.

Notation — the style of the existing questions
- Plain text with Unicode symbols: superscripts and subscripts as Unicode characters (a caret only for an exponent that has no Unicode form), and × · − ± √ π ° ≤ ≥ → ⇌ as characters; fractions written inline with a slash and brackets where needed.
- A quantity is a number, a space and its unit symbol.
- LaTeX between single dollar signs is used ONLY in the question text, and only for an expression that cannot be written legibly on one line (a stacked fraction, a sum, an integral, a limit).
- Answers and options never contain LaTeX or dollar signs: an answer is written the way a student would type it.

Each item also carries
- hints: one or two, which point the way without giving the answer;
- solutionText: one to three sentences with the decisive steps;
- difficulty: 1 to 4 (1 = recall or a single step, 4 = several steps or demanding reasoning);
- covers: one line naming the part of the objective the question exercises.

Reply as JSON with items (one entry per question) and needsFigure (one entry per objective you could not write for; an empty list when there is none).`;

// ── quality gate ────────────────────────────────────────────────────────────

const FIGURE_REVIEW_NOTE = ` The question is shown to the student together with ONE figure. You cannot see the picture; instead you are given an exact transcription of it, made by a program from the figure's data: first every piece of text that is PRINTED on the figure, then what can be READ OFF it (values at gridlines, marked points, bars, arrows). A value described as lying between two gridlines cannot be read exactly. The student sees the picture, not this transcription — so reading a value off the picture is the intended work, and a value in the transcription's read-off part is not "given away". In the checks, "the question text" always means the Question and its Options only, never the transcription.`;

const qualitySystem = (checks: readonly QualityCheck[], figure: boolean) => `You review one practice question that was written for a stated learning objective of a school or college-entry course. You are shown the objective, the other objectives of the same skill, the question, its options if any, and its stored answer.${figure ? FIGURE_REVIEW_NOTE : ''} You are not asked to check whether the stored answer is right — that is done separately. Judge only the quality of the question, strictly, on what is in front of you.

Answer every check below with flag true or false. ${figure ? 'Give a reason of one short sentence for EVERY check, flagged or not — what in the question decides it.' : 'Give a reason of one short sentence when the flag is true; when it is false, leave reason as an empty string.'} flag true always means a defect.

${checks.map((c) => `- ${c.id}: ${c.question}`).join('\n')}

A check that does not apply to this question (for instance an options check on a question without options) is flag false.

Reply as JSON: one key per check, in the order above, each an object {"flag": true or false, "reason": "${figure ? 'one line' : 'one line, or empty when the flag is false'}"}.`;

export interface QualityView {
  objective: string;
  otherObjectives: string[];
  format: string;
  question: string;
  choices: string[];
  /** For multiple choice: the letter and the option's text. */
  answer: string;
  /** Questions the objective already had before this job (text only). */
  earlier: string[];
  /** Multiple choice: the mistake the author names behind each option, in order. */
  rationales?: string[];
  /** Figure items: the code-made transcription of the figure. */
  figureText?: string;
}

function qualityViewText(v: QualityView): string {
  const parts = [`Objective this question was written for:\n${v.objective}`];
  if (v.otherObjectives.length) parts.push(`Other objectives of the same skill:\n${v.otherObjectives.map((o) => `- ${o}`).join('\n')}`);
  parts.push(`Answer format: ${v.format === 'mcq' ? 'multiple choice' : v.format === 'numeric' ? 'the student types one number' : 'the student types a short answer'}`);
  if (v.figureText) parts.push(`Figure shown with the question (transcription):\n${v.figureText.trim()}`);
  parts.push(`Question:\n${v.question.trim()}`);
  if (v.choices.length) {
    parts.push(`Options:\n${v.choices.map((c, i) => `${'ABCD'[i]}) ${c}`).join('\n')}`);
    if (v.rationales?.length === v.choices.length) parts.push(`Mistake the author names behind each option:\n${v.rationales.map((r, i) => `${'ABCD'[i]}) ${r}`).join('\n')}`);
  }
  parts.push(`Stored answer: ${v.answer}`);
  parts.push(
    v.earlier.length
      ? `Existing questions of the same objective:\n${v.earlier.map((q, i) => `${i + 1}. ${q.replace(/\s+/g, ' ').trim()}`).join('\n')}`
      : 'Existing questions of the same objective: none.',
  );
  return parts.join('\n\n');
}

/** `only` restricts the checklist (the second reviewer is asked the strict
 *  checks plus whatever the first one raised — nothing else can change the outcome). */
export function buildQualityPrompt(v: QualityView, only?: readonly QualityCheckId[]): Prompt {
  const check = obj({ flag: { type: 'boolean' }, reason: { type: 'string' } });
  const all: readonly QualityCheck[] = v.figureText ? FIGURE_QUALITY_CHECKS : QUALITY_CHECKS;
  const checks = all.filter((c) => !only || only.includes(c.id));
  return {
    system: qualitySystem(checks, !!v.figureText),
    user: qualityViewText(v),
    schema: obj(Object.fromEntries(checks.map((c) => [c.id as QualityCheckId, check]))),
  };
}

// ── is a solver's assumption answer-changing? ───────────────────────────────

const ASSUMPTION_SYSTEM = `A subject expert solved a practice question from a school or college-entry course and noted an assumption they made. Decide whether that assumption is ANSWER-CHANGING.

It is answer-changing when the question leaves something open and a different assumption, which a reasonable student of the course could equally make, would lead to a different final answer.

It is NOT answer-changing when it only restates standard subject knowledge or the conventional reading that the course itself teaches and that every student of it is expected to apply; when it restates what the question already says or plainly implies; when it is a usual idealisation of the subject; or when the expert notes that the alternative would give the same answer.

Do not solve the question again and do not judge whether the expert's answer is right.

Reply as JSON: answer_changing (true or false) and reason (one sentence).`;

export function buildAssumptionPrompt(question: string, choices: string[], assumption: string): Prompt {
  const parts = [`Question:\n${question.trim()}`];
  if (choices.length) parts.push(`Options:\n${choices.map((c, i) => `${'ABCDEFGHIJ'[i]}) ${c}`).join('\n')}`);
  parts.push(`Assumption the expert noted:\n${assumption.trim()}`);
  return { system: ASSUMPTION_SYSTEM, user: parts.join('\n\n'), schema: obj({ answer_changing: { type: 'boolean' }, reason: { type: 'string' } }) };
}

// ── judge: does a solver's answer match the WHOLE key? ──────────────────────

const WHOLE_KEY_JUDGE_SYSTEM = `You compare a reference answer with a second answer to the same question, as a grader would. You are not asked which one is right, and you must not solve the question again to pick a side.

ANSWER 2 matches only when it states EVERYTHING that ANSWER 1 states: every result, every part, every claim of the reference must be present in ANSWER 2 and agree with it. Matching one part of the reference is not a match.

Return exactly one verdict:
- SAME: ANSWER 2 gives the whole of ANSWER 1. Differences of form do not matter (equivalent expressions, fraction and decimal within rounding, units written differently, other wording), and ANSWER 2 may add correct detail beyond the reference.
- DIFFERENT: ANSWER 2 gives a different result, contradicts something in ANSWER 1, or leaves out any part of what ANSWER 1 states.
- KEY_INCOMPLETE: ANSWER 1 itself is a fragment or covers only part of what the question asks, while nothing in it conflicts with ANSWER 2.
- CANNOT_JUDGE: the answers cannot be compared, for instance because they depend on material that is not shown.

Reply as JSON: verdict, and reason (one sentence naming the decisive difference, the missing part, or the equivalence).`;

export function buildWholeKeyJudgePrompt(question: string, key: string, answer: string): Prompt {
  return {
    system: WHOLE_KEY_JUDGE_SYSTEM,
    user: `Question:\n${question.trim()}\n\nANSWER 1 (reference):\n${key.trim()}\n\nANSWER 2:\n${answer.trim()}`,
    schema: obj({ verdict: { type: 'string', enum: ['SAME', 'DIFFERENT', 'KEY_INCOMPLETE', 'CANNOT_JUDGE'] }, reason: { type: 'string' } }),
  };
}

// ── a contested quality flag: does the other reviewer clear it? ─────────────

const REBUTTAL_SYSTEM = `Two reviewers looked at the same practice question. One of them raised the concern shown below; the other did not. Look at that one concern again, on its merits.

Reply as JSON: agree (true when the concern is valid for this question, false when it is not) and reason (one sentence — what in the question makes the concern valid, or why it does not apply).`;

export function buildRebuttalPrompt(v: QualityView, check: QualityCheckId, concern: string): Prompt {
  const q = ([...FIGURE_QUALITY_CHECKS, ...QUALITY_CHECKS] as readonly QualityCheck[]).find((c) => c.id === check)!;
  return {
    system: REBUTTAL_SYSTEM,
    user: `${qualityViewText(v)}\n\nThe check: ${q.question}\n\nThe concern raised: ${concern || '(no reason given)'}${v.figureText ? '\n\nagree = true means: yes, this question HAS that defect. agree = false means: the question does not have it.' : ''}`,
    schema: obj({ agree: { type: 'boolean' }, reason: { type: 'string' } }),
  };
}

// ── which objectives cannot be practised without a figure? ──────────────────

const FIGURE_SYSTEM = `You are given the learning objectives of one skill of a school or college-entry course, each with a short note of how the lesson teaches it. Practice questions for these objectives will be TEXT ONLY: no picture, graph, diagram or drawing can be shown to the student, and the student cannot draw.

For each objective decide whether it is FIGURE-DEPENDENT: practising what the objective itself asks for requires the student to produce a figure (sketch, draw, plot, label, construct) or to read one that has to be shown (a graph, diagram, picture, map or chart).

It is NOT figure-dependent when its core can be practised honestly from words, equations or a few values written out in text — even if the topic is usually illustrated, and even if the objective mentions a graph, as long as the thing to be done does not need the graph to be seen or drawn. Describing a figure in words is not an honest substitute for reading it.

Reply as JSON: objectives — one entry per objective, in the order given, with n (its number), figure_dependent (true or false) and reason (one short sentence).`;

export interface FigureView {
  description: string;
  lesson?: string;
}

export function buildFigurePrompt(skillTitle: string, objectives: FigureView[]): Prompt {
  return {
    system: FIGURE_SYSTEM,
    user: `Skill: ${skillTitle}\n\n${objectives.map((o, i) => `${i + 1}. ${o.description}${o.lesson ? `\n   Lesson: ${o.lesson}` : ''}`).join('\n')}`,
    schema: obj({
      objectives: { type: 'array', items: obj({ n: { type: 'integer' }, figure_dependent: { type: 'boolean' }, reason: { type: 'string' } }) },
    }),
  };
}

// ── which accepted questions of one objective are the same task? ────────────

const SAME_TASK_SYSTEM = `Below are practice questions written for ONE learning objective. Find the questions that are the SAME TASK: the student must do the same thing and follow the same steps, and only the values, names, context or answer format differ. Judge by what the student must do, not by wording. Questions that ask for a different unknown, reason in the opposite direction, or exercise a different part of the objective are different tasks.

For each group of two or more same-task questions, name the best one: the clearest, the one that demands most of the objective, and the least leading.

Reply as JSON: groups — a list (empty when all questions are different tasks) of entries with members (the numbers of the questions in the group), best (the number to keep) and reason (one sentence).`;

export function buildSameTaskPrompt(objective: string, questions: string[]): Prompt {
  return {
    system: SAME_TASK_SYSTEM,
    user: `Objective: ${objective}\n\n${questions.map((q, i) => `${i + 1}. ${q.replace(/\s+/g, ' ').trim()}`).join('\n')}`,
    schema: obj({ groups: { type: 'array', items: obj({ members: { type: 'array', items: { type: 'integer' } }, best: { type: 'integer' }, reason: { type: 'string' } }) } }),
  };
}
