/**
 * Generate an on-the-fly LessonPlan from a student-supplied text blob
 * (a pasted study guide, a chapter excerpt, an exam outline, etc.).
 *
 * Why this exists: a freestyle paste is the most common "off-script"
 * input the tutor gets, and freestyle teaching has no scaffolding —
 * topics get revisited, try-yourself never fires, coverage isn't
 * tracked. By generating a plan up front we let the existing
 * orchestrator drive the session with the same guardrails it applies
 * to curated plans.
 *
 * Two-stage design:
 *
 *   STAGE 1 — extractLearningObjectives(): a fast Haiku call that
 *   ONLY extracts the LO list (no per-LO teaching segments). ~3 s,
 *   returns a small payload. Lets the caller decide upfront how many
 *   LOs the session has time to cover.
 *
 *   STAGE 2 — expandSegmentsForLOs(): expands a chosen subset of LOs
 *   into hook / concept / worked-example / try-yourself segments. Done
 *   after the picker UX (or directly when the LO count fits in T).
 *   Per-LO output is bounded so the JSON never truncates.
 *
 * `generatePlanFromText()` is kept as a one-shot convenience for
 * callers that don't need the picker handshake — it runs Stage 1
 * then Stage 2 internally.
 *
 * Output is normalized into the LessonPlan shape and validated with
 * `parseLessonPlan` so it drops into the orchestrator unchanged.
 *
 * GENERIC by design — every prompt below describes the task
 * structurally (extract objectives, emit hook/concept/example/try-
 * yourself per objective) with NO subject-specific examples. Do not
 * add subject / level / topic anchors to any prompt; that would bloat
 * tokens and regress the prompt-quality discipline tracked in MEMORY.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  LessonPlan,
  LearningObjective,
  Segment,
  SegmentRecap,
} from './types';
import { LESSON_PLAN_SCHEMA_VERSION } from './types';
import { parseLessonPlan } from './parser';

const HAIKU_MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_OBJECTIVES = 12;
const STAGE1_MAX_TOKENS = 1500; // LO list only — small payload.
const STAGE2_MAX_TOKENS = 8192; // Per-LO expansion can be larger.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateFromTextInput {
  /** The raw student-supplied text. */
  text: string;
  /** Subject id from the existing taxonomy. */
  subject: string;
  /** Grade / level id from the existing taxonomy. */
  grade: string;
  /** Optional topic id; passed through to the generated plan when
   *  present so downstream filtering still works. */
  topic?: string;
  /** Optional locale; defaults to 'en'. */
  locale?: string;
}

/* ------------------------------------------------------------------ */
/* STAGE 1 — extract LO list only                                     */
/* ------------------------------------------------------------------ */

export interface ExtractLOsResult {
  titleSuggestion: string;
  los: LearningObjective[];
  ok: boolean;
  reason: string;
}

const STAGE1_SYSTEM = `You extract a list of learning objectives from a student's pasted study-text.

Rules:
1. Identify the distinct learning objectives in the text. An objective is a thing the student is expected to know, understand, or be able to do.
2. Output AT MOST ${MAX_OBJECTIVES} objectives. If the text has more, GROUP related items into a single objective and order objectives so each builds on the previous one. Truncate ruthlessly.
3. Do NOT emit segments — only the LO list. Per-LO teaching content is generated in a separate later step.
4. Keep each LO description ≤ 14 words.
5. Output ONLY valid JSON matching the schema below. No prose, no markdown fences, no commentary.

Schema:
{
  "titleSuggestion": string,          // short plan title (≤ 8 words)
  "los": [
    { "id": "lo-1", "description": string },
    { "id": "lo-2", "description": string },
    ...
  ]
}`;

function safeJsonParse(s: string): unknown | null {
  const cleaned = s
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function extractLearningObjectives(
  input: GenerateFromTextInput,
): Promise<ExtractLOsResult> {
  if (!input.text || input.text.trim().length === 0) {
    return { titleSuggestion: 'Freestyle session', los: [], ok: false, reason: 'empty input' };
  }

  let raw = '';
  try {
    const response = await anthropic.messages.create({
      model: HAIKU_MODEL_ID,
      max_tokens: STAGE1_MAX_TOKENS,
      system: STAGE1_SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Subject: ${input.subject}\nGrade: ${input.grade}${input.topic ? `\nTopic: ${input.topic}` : ''}\n\nStudent's text:\n${input.text.trim()}`,
            },
          ],
        },
      ],
    });
    for (const block of response.content) {
      if (block.type === 'text') raw += block.text;
    }
  } catch (err) {
    return {
      titleSuggestion: 'Freestyle session',
      los: [],
      ok: false,
      reason: `haiku call failed: ${(err as Error).message}`,
    };
  }

  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== 'object') {
    return {
      titleSuggestion: 'Freestyle session',
      los: [],
      ok: false,
      reason: 'haiku returned non-JSON',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = parsed as any;
  const titleSuggestion: string =
    typeof p.titleSuggestion === 'string' && p.titleSuggestion.trim()
      ? p.titleSuggestion.trim()
      : 'Freestyle session';
  const losRaw: unknown = p.los;
  if (!Array.isArray(losRaw) || losRaw.length === 0) {
    return {
      titleSuggestion,
      los: [],
      ok: false,
      reason: 'haiku returned no LOs',
    };
  }
  const los: LearningObjective[] = [];
  for (let i = 0; i < losRaw.length && los.length < MAX_OBJECTIVES; i++) {
    const lo = losRaw[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const li = lo as any;
    const description = typeof li?.description === 'string' ? li.description.trim() : '';
    if (!description) continue;
    const id = typeof li?.id === 'string' && li.id.trim() ? li.id.trim() : `lo-${i + 1}`;
    los.push({ id, description });
  }
  if (los.length === 0) {
    return { titleSuggestion, los: [], ok: false, reason: 'no valid LOs after parsing' };
  }
  return { titleSuggestion, los, ok: true, reason: 'extracted' };
}

/* ------------------------------------------------------------------ */
/* STAGE 2 — expand chosen LOs into segments                          */
/* ------------------------------------------------------------------ */

// Exported (test-only use) so scripts/test-plan-generate.ts can assert the
// E5 number-collision rule text is present without duplicating the prompt.
export const STAGE2_SYSTEM = `You expand a list of learning objectives into teaching segments for a lesson plan, in JSON.

Rules:
1. For every supplied objective, emit exactly four segments in order: a hook, a concept, a worked_example, and a try_yourself.
2. Segment ids are deterministic: "<loId>-hook", "<loId>-concept", "<loId>-worked", "<loId>-try" — using the LO id supplied in the input.
3. KEEP FIELDS TERSE. Hooks: 'goal' ≤ 12 words. Concepts: 'goal' ≤ 12 words; 'keyIdeas' ≤ 3 bullets of ≤ 12 words each. Worked-example: 'problem' ≤ 20 words; 'steps' ≤ 4 steps of ≤ 12 words each; 'answer' ≤ 12 words. Try-yourself: 'problem' ≤ 20 words; 'expectedAnswer' ≤ 12 words. Verbosity will truncate the JSON — be ruthlessly short.
4. Do NOT invent content beyond what the LO description implies. If the LO is bare ("Cell respiration"), use the most central ideas an introductory source would teach.
5. NUMBER-COLLISION MUST: in every hook, worked_example, and try_yourself, no context/setup number (a fee, starting value, coefficient, count, etc.) may be numerically equal to that problem's expected answer ('answer' on worked_example, 'expectedAnswer' on try_yourself), and that expected answer MUST itself be a single unambiguous value — a student's correct spoken answer must never be confusable with a number already sitting in the problem's setup.
6. Output ONLY valid JSON matching the schema below. No prose, no markdown fences, no commentary.

Schema:
{
  "segments": [
    { "id": "<loId>-hook",    "kind": "hook",            "goal": string },
    { "id": "<loId>-concept", "kind": "concept",         "goal": string, "keyIdeas": [string, ...] },
    { "id": "<loId>-worked",  "kind": "worked_example",  "problem": string, "steps": [string, ...], "answer": string },
    { "id": "<loId>-try",     "kind": "try_yourself",    "problem": string, "expectedAnswer": string }
  ]
}`;

export interface ExpandSegmentsResult {
  segments: Segment[];
  ok: boolean;
  reason: string;
}

export async function expandSegmentsForLOs(
  los: ReadonlyArray<LearningObjective>,
  input: GenerateFromTextInput,
): Promise<ExpandSegmentsResult> {
  if (!los || los.length === 0) {
    return { segments: [], ok: false, reason: 'no LOs supplied' };
  }

  const losPayload = los.map((lo) => ({ id: lo.id, description: lo.description }));

  let raw = '';
  try {
    const response = await anthropic.messages.create({
      model: HAIKU_MODEL_ID,
      max_tokens: STAGE2_MAX_TOKENS,
      system: STAGE2_SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Subject: ${input.subject}\nGrade: ${input.grade}${input.topic ? `\nTopic: ${input.topic}` : ''}\n\nLearning objectives to expand (JSON):\n${JSON.stringify(losPayload, null, 2)}`,
            },
          ],
        },
      ],
    });
    for (const block of response.content) {
      if (block.type === 'text') raw += block.text;
    }
  } catch (err) {
    return { segments: [], ok: false, reason: `haiku call failed: ${(err as Error).message}` };
  }

  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== 'object') {
    return { segments: [], ok: false, reason: 'haiku returned non-JSON' };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segments: unknown = (parsed as any).segments;
  if (!Array.isArray(segments)) {
    return { segments: [], ok: false, reason: 'segments field missing or non-array' };
  }
  return { segments: segments as Segment[], ok: true, reason: 'expanded' };
}

/* ------------------------------------------------------------------ */
/* Recap segment (E4)                                                 */
/* ------------------------------------------------------------------ */

/**
 * Build a deterministic recap segment — NO extra LLM call. Every
 * generated plan (full-mode inline build, `expandPlanLos`'s rebuilt
 * segment list, and `fallbackPlan`) must end with one: previously,
 * generated plans ended on the last LO's `-try` segment with nothing
 * after it. In a real session that meant `advance_lesson({ to: 'next'
 * })` off the last try segment had no segment to land on —
 * `resolveAdvanceTarget` (context.ts) returned null, the orchestrator
 * rejected the advance as unresolvable, and the session dangled at
 * end-of-plan instead of closing out.
 *
 * `teacherNote` carries the brain-facing instructions (read, never
 * spoken) rather than `mustRemember` because this is a procedural
 * script ("do this"), not a list of facts to remind the student of;
 * `mustRemember` instead carries the actual LO descriptions as the
 * brain's per-LO takeaway anchors.
 */
export function buildRecapSegment(los: ReadonlyArray<LearningObjective>): SegmentRecap {
  const titles = los.map((lo) => lo.description);
  const n = los.length;
  return {
    id: 'recap',
    kind: 'recap',
    teacherNote: `Recap the ${n} learning objective${n === 1 ? '' : 's'} covered (${titles.join('; ')}). Have the student state one takeaway per LO in their own words, celebrate their progress, and close the session.`,
    mustRemember: titles,
  };
}

/* ------------------------------------------------------------------ */
/* Picker plan (Y > X case)                                           */
/* ------------------------------------------------------------------ */

/**
 * Build a plan whose only teaching segments are an "intro" that
 * acknowledges the LO count and a "picker" concept that hands the LO
 * list to the brain and asks the student to pick X. Once the student
 * picks, the orchestrator calls expandSegmentsForLOs() and upserts a
 * fuller plan in place.
 *
 * The picker segment's `goal` carries the structural instructions for
 * the brain — generic, no subject anchors. The available LOs are
 * encoded into `keyIdeas` as "<id>: <description>" lines so the brain
 * can read them off and quote them to the student.
 */
export function buildPickerPlan(args: {
  input: GenerateFromTextInput;
  titleSuggestion: string;
  los: ReadonlyArray<LearningObjective>;
  allowedMaxLOs: number;
  sessionMinutes: number;
}): LessonPlan {
  const planId = `freestyle-${Date.now()}`;
  const introSegment: Segment = {
    id: 'intro',
    kind: 'hook',
    goal: `Acknowledge that the student supplied ${args.los.length} learning objectives, and that the session has ${args.sessionMinutes} minutes — enough for about ${args.allowedMaxLOs}. Then transition to the picker segment which will present the list and capture the student's pick.`,
  };
  // Picker segment is a TWO-TURN handshake. The brain's goal text must
  // be strictly phase-gated or the brain fires confirm_plan_los in the
  // same turn as the presentation (observed 2026-05-12 — brain
  // confabulated 22 ids when keyIdeas only listed 12). Phase 1 = render
  // the list on the whiteboard + ask the student. Phase 2 = next turn,
  // after the student responds, fire confirm_plan_los with the EXACT
  // ids that appeared in keyIdeas.
  //
  // The TSV reference below carries the LO list in a parse-friendly
  // shape so the brain doesn't have to re-derive numbering. The
  // segment's goal explicitly mandates a show_table call in phase 1 so
  // the student sees the list visually even if the brain's spoken
  // ack is brief.
  const losTsv = args.los
    .map((lo, i) => `${i + 1}\t${lo.id}\t${lo.description}`)
    .join('\n');
  const pickerSegment: Segment = {
    id: 'pick-los',
    kind: 'concept',
    goal: `Two-phase picker segment. Follow the phases STRICTLY — do not collapse them into one turn.

PHASE 1 (THIS turn): You MUST call show_table with the LO list so the student sees the options. Use headers ["#", "Topic"] and one row per item from keyIdeas — the row's "#" cell is the 1-based index, the "Topic" cell is the LO description (the text after "lo-N: "). After emitting show_table, speak briefly: name how many items you see, say the session has time for ${args.allowedMaxLOs} of them, and ask the student which ${args.allowedMaxLOs} they want to focus on. Then STOP and wait. Do NOT call confirm_plan_los in this turn. Do NOT teach any LO content.

PHASE 2 (NEXT turn, after the student responds): When the student names which items they want — by row number, by short phrase, or by saying "all" / "the first N" / etc. — resolve their choices to LO ids by matching against keyIdeas. Call confirm_plan_los with ONLY the LO ids that appear in keyIdeas, and at most ${args.allowedMaxLOs} of them. Do NOT invent ids, do NOT include ids that are not in keyIdeas, do NOT exceed ${args.allowedMaxLOs}. If the student is vague ("just pick the most important"), choose ${args.allowedMaxLOs} ids yourself from keyIdeas — but still pass real keyIdeas-derived ids.`,
    keyIdeas: args.los.map((lo) => `${lo.id}: ${lo.description}`),
    references: [
      {
        kind: 'note',
        content: `LO list (TSV — columns: #, id, description):\n${losTsv}`,
      },
    ],
  };
  const raw = {
    id: planId,
    title: args.titleSuggestion,
    curriculum: 'freestyle',
    grade: args.input.grade,
    subject: args.input.subject,
    topic: args.input.topic,
    locale: args.input.locale ?? 'en',
    los: [...args.los],
    estimatedMinutes: args.sessionMinutes,
    segments: [introSegment, pickerSegment],
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: {
      generatedFromText: true,
      pendingPicker: true,
      availableLOs: args.los.map((lo) => ({ id: lo.id, description: lo.description })),
      allowedMaxLOs: args.allowedMaxLOs,
      sessionMinutes: args.sessionMinutes,
    },
  };
  return parseLessonPlan(raw);
}

/* ------------------------------------------------------------------ */
/* Full plan (Y ≤ X case) — Stage 1 + Stage 2 inline                  */
/* ------------------------------------------------------------------ */

export interface GenerateFromTextResult {
  plan: LessonPlan;
  ok: boolean;
  reason: string;
}

/** Minimal fallback when generation fails. Keeps the orchestrator
 *  running rather than crashing. Exported so callers with their own
 *  Stage 1 / Stage 2 branching (e.g. /api/portal/v1/plan-generate) can
 *  serve this directly on a failure instead of re-running the whole
 *  pipeline through `generatePlanFromText` (which would redundantly
 *  retry the stage that just failed, burning an extra live LLM call at
 *  synchronous request time). */
export function fallbackPlan(input: GenerateFromTextInput, reason: string): LessonPlan {
  const id = `freestyle-fallback-${Date.now()}`;
  const lo: LearningObjective = {
    id: 'lo-1',
    description: 'Cover the material the student supplied.',
  };
  const segments: Segment[] = [
    {
      id: 'lo1-concept',
      kind: 'concept',
      goal: 'Teach the material the student supplied, in their order.',
      keyIdeas: ['The student supplied free text; teach that material directly.'],
    },
    buildRecapSegment([lo]),
  ];
  return {
    id,
    title: 'Freestyle session',
    curriculum: 'freestyle',
    grade: input.grade,
    subject: input.subject,
    topic: input.topic,
    locale: input.locale ?? 'en',
    los: [lo],
    estimatedMinutes: 20,
    segments,
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: {
      generatedFromText: true,
      generatorOk: false,
      fallbackReason: reason,
    },
  };
}

/**
 * One-shot convenience that runs Stage 1 + Stage 2 with no picker.
 * Returns a full plan. Use when the caller knows the LO count will be
 * within the session's budget OR doesn't need the picker handshake.
 *
 * Callers that DO need the picker should use extractLearningObjectives
 * + buildPickerPlan / expandSegmentsForLOs directly so they can branch
 * on Y vs X.
 */
export async function generatePlanFromText(
  input: GenerateFromTextInput,
): Promise<GenerateFromTextResult> {
  const stage1 = await extractLearningObjectives(input);
  if (!stage1.ok || stage1.los.length === 0) {
    return { plan: fallbackPlan(input, stage1.reason), ok: false, reason: stage1.reason };
  }

  const stage2 = await expandSegmentsForLOs(stage1.los, input);
  if (!stage2.ok || stage2.segments.length === 0) {
    return { plan: fallbackPlan(input, stage2.reason), ok: false, reason: stage2.reason };
  }

  const planId = `freestyle-${Date.now()}`;
  const introSegment: Segment = {
    id: 'intro',
    kind: 'hook',
    goal: `Acknowledge the material the student supplied: name how many learning objectives you see, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.`,
  };

  const raw = {
    id: planId,
    title: stage1.titleSuggestion,
    curriculum: 'freestyle',
    grade: input.grade,
    subject: input.subject,
    topic: input.topic,
    locale: input.locale ?? 'en',
    los: stage1.los,
    estimatedMinutes: Math.max(10, stage1.los.length * 5),
    segments: [introSegment, ...stage2.segments, buildRecapSegment(stage1.los)],
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: {
      generatedFromText: true,
      generatorOk: true,
      sourceTextLength: input.text.length,
    },
  };
  try {
    const plan = parseLessonPlan(raw);
    return { plan, ok: true, reason: 'generated ok' };
  } catch (err) {
    return {
      plan: fallbackPlan(input, `parse failed: ${(err as Error).message}`),
      ok: false,
      reason: `parse failed: ${(err as Error).message}`,
    };
  }
}
