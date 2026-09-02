/**
 * Pointer-enrichment pass for a topic-notes baseline.
 *
 * Reads an existing baseline TS file (produced by
 * scripts/extract-topic-notes-baselines.ts) plus the corresponding
 * lesson plan, calls Claude Opus 4.7 with a structured-output prompt,
 * and writes the proposed pointers to a sibling JSON draft file for
 * human merge into the baseline.
 *
 * NOT auto-merged — the human reviews the draft, picks the keepers,
 * and pastes them into the `pointers: [...]` block of the baseline.
 * Auto-merge is Phase-2 work once we trust the prompt's output quality.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     scripts/gen-topic-notes-pointers.ts <planId>
 *
 * Example:
 *   ... scripts/gen-topic-notes-pointers.ts evelyn.ap.macro.loanable-funds-market.v1
 *
 * Outputs:
 *   src/lib/tutor/topic-notes/seeds/<filename>.pointers.draft.json
 */

import * as fs from 'fs';
import * as path from 'path';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';
import { getModelClient, prepareParams, resolveModel } from '../src/lib/tutor/ai/model-registry';
import type { RoleClient } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';

let _rc: RoleClient | null = null;
const rc = () => (_rc ??= getModelClient('notes-pointers'));

// Accumulated across every messages.create call in this run — printed at
// the end alongside an informational cost estimate (see main()).
let usageIn = 0;
let usageOut = 0;

interface PointerProposal {
  content: string;
  kind: 'gotcha' | 'frq-vocab' | 'edge-case' | 'common-error' | 'tip' | 'vocab-note';
  rationale: string;
}

// Course slug (from `evelyn.hs.<slug>.` OR `evelyn.testprep.<slug>.`) →
// exact portal course-title string. Kept in sync with the same map in
// extract-topic-notes-baselines.ts — must byte-match the portal course
// title or the Notes tab silently resolves nothing.
const HS_COURSE_NAMES: Record<string, string> = {
  chem: 'Chemistry',
  alg1: 'Algebra 1',
  geom: 'Geometry',
  bio: 'Biology',
  engl: 'HS English',
  whist: 'World History',
  dsat: 'Digital SAT',
  act: 'ACT',
};

// Course slug (from `evelyn.ms.<slug>.`) → exact portal course-title string.
// Kept in sync with the same map in extract-topic-notes-baselines.ts.
const MS_COURSE_NAMES: Record<string, string> = {
  m7math: 'Grade 7 Math',
  m7ela: 'Grade 7 English Language Arts',
  m7sci: 'Grade 7 Science',
  m7geo: 'Grade 7 World Geography',
};

// The MS system prompt names the teacher's subject, so an ELA note never
// arrives written by a math teacher. Keyed by the same course infix.
const MS_SUBJECT_PHRASE: Record<
  string,
  { teacher: string; course: string; imperative: string; slips: string; edges: string }
> = {
  m7math: {
    teacher: 'middle-school math teacher',
    course: '7th-grade math course',
    imperative: '"Always check the sign before you simplify"',
    slips: 'sign errors, mixing up related terms, dropping units',
    edges: 'zero, negative numbers, non-integer answers',
  },
  m7ela: {
    teacher: 'middle-school English language arts teacher',
    course: '7th-grade English language arts course',
    imperative: '"Always point at the line in the text before you name the trait"',
    slips: 'confusing a summary with a theme, calling every comparison a metaphor, mixing up the narrator and the author',
    edges: 'a character who says one thing and does another, a text with more than one central idea, a word whose everyday meaning differs from its meaning here',
  },
  m7sci: {
    teacher: 'middle-school life-science teacher',
    course: '7th-grade life science course',
    imperative: '"Always say where the energy came from before you say where it went"',
    slips: 'saying a cell part "makes" energy rather than releases it, confusing genotype with phenotype, treating an individual as if it adapts during its lifetime',
    edges: 'organisms that do not fit the usual pattern, traits that are common but recessive, ratios that are probabilities rather than guarantees',
  },
  m7geo: {
    teacher: 'middle-school world geography teacher',
    course: '7th-grade world geography course',
    imperative: '"Always say latitude before longitude"',
    slips: 'swapping latitude and longitude, confusing climate with weather, confusing a country with a continent or a region',
    edges: 'places that sit in two regions at once, a factor that pushes people out of one place and pulls them into another, borders that follow rivers rather than straight lines',
  },
  // Grade 6/8 rows — Task 0.2 scaffolding, mirrored from the m7 rows above
  // with the grade substituted. Phrasing (imperative/slips/edges) is a
  // placeholder carried from m7's course-specific wording; it is generic
  // enough to hold until Phase 1 curriculum authoring may want to tune it
  // per grade, but no MS plans for these courses exist yet so this map is
  // inert until then.
  m6math: {
    teacher: 'middle-school math teacher',
    course: '6th-grade math course',
    imperative: '"Always check the sign before you simplify"',
    slips: 'sign errors, mixing up related terms, dropping units',
    edges: 'zero, negative numbers, non-integer answers',
  },
  m6ela: {
    teacher: 'middle-school English language arts teacher',
    course: '6th-grade English language arts course',
    imperative: '"Always point at the line in the text before you name the trait"',
    slips: 'confusing a summary with a theme, calling every comparison a metaphor, mixing up the narrator and the author',
    edges: 'a character who says one thing and does another, a text with more than one central idea, a word whose everyday meaning differs from its meaning here',
  },
  m6sci: {
    teacher: 'middle-school science teacher',
    course: '6th-grade science course',
    imperative: '"Always say where the energy came from before you say where it went"',
    slips: 'saying a cell part "makes" energy rather than releases it, confusing genotype with phenotype, treating an individual as if it adapts during its lifetime',
    edges: 'organisms that do not fit the usual pattern, traits that are common but recessive, ratios that are probabilities rather than guarantees',
  },
  m6geo: {
    teacher: 'middle-school world geography teacher',
    course: '6th-grade world geography course',
    imperative: '"Always say latitude before longitude"',
    slips: 'swapping latitude and longitude, confusing climate with weather, confusing a country with a continent or a region',
    edges: 'places that sit in two regions at once, a factor that pushes people out of one place and pulls them into another, borders that follow rivers rather than straight lines',
  },
  m8math: {
    teacher: 'middle-school math teacher',
    course: '8th-grade math course',
    imperative: '"Always check the sign before you simplify"',
    slips: 'sign errors, mixing up related terms, dropping units',
    edges: 'zero, negative numbers, non-integer answers',
  },
  m8ela: {
    teacher: 'middle-school English language arts teacher',
    course: '8th-grade English language arts course',
    imperative: '"Always point at the line in the text before you name the trait"',
    slips: 'confusing a summary with a theme, calling every comparison a metaphor, mixing up the narrator and the author',
    edges: 'a character who says one thing and does another, a text with more than one central idea, a word whose everyday meaning differs from its meaning here',
  },
  m8sci: {
    teacher: 'middle-school science teacher',
    course: '8th-grade science course',
    imperative: '"Always say where the energy came from before you say where it went"',
    slips: 'saying a cell part "makes" energy rather than releases it, confusing genotype with phenotype, treating an individual as if it adapts during its lifetime',
    edges: 'organisms that do not fit the usual pattern, traits that are common but recessive, ratios that are probabilities rather than guarantees',
  },
  m8geo: {
    teacher: 'middle-school world geography teacher',
    course: '8th-grade world geography course',
    imperative: '"Always say latitude before longitude"',
    slips: 'swapping latitude and longitude, confusing climate with weather, confusing a country with a continent or a region',
    edges: 'places that sit in two regions at once, a factor that pushes people out of one place and pulls them into another, borders that follow rivers rather than straight lines',
  },
};

function isHS(plan: LessonPlan): boolean {
  return plan.id.startsWith('evelyn.hs.');
}

// Middle-school (MS) courses get their own system prompt variant — same
// "ordinary class work, no exam framing" posture as SYSTEM_HS, but with a
// middle-school teacher persona instead of a high-school one, and with the
// teacher's SUBJECT filled in per course (see msSystem below).
function isMS(plan: LessonPlan): boolean {
  return plan.id.startsWith('evelyn.ms.');
}

// Digital SAT (and future test-prep courses) get their own system prompt —
// unlike HS, exam framing is CORRECT here; unlike AP, there's no
// FRQ/rubric/Chief-Reader apparatus. See SYSTEM_DSAT below.
function isDSAT(plan: LessonPlan): boolean {
  return plan.id.startsWith('evelyn.testprep.dsat.');
}

// ACT gets its own variant, not a reuse of SYSTEM_DSAT: it shares the
// "exam framing is correct, no FRQ/rubric apparatus" shape with Digital
// SAT, but the exam itself differs materially — no Desmos, no
// student-produced-response grid-in, a dedicated Science section, a
// stricter no-calculator-on-formula-sheet posture, and different
// section/timing pressure. See SYSTEM_ACT below.
function isACT(plan: LessonPlan): boolean {
  return plan.id.startsWith('evelyn.testprep.act.');
}

function courseFor(plan: LessonPlan): string {
  if (plan.id.startsWith('evelyn.ap.macro.')) return 'AP Macroeconomics';
  const hsMatch = plan.id.match(/^evelyn\.(?:hs|testprep)\.([a-z0-9]+)\./);
  if (hsMatch && HS_COURSE_NAMES[hsMatch[1]]) return HS_COURSE_NAMES[hsMatch[1]];
  const msMatch = plan.id.match(/^evelyn\.ms\.([a-z0-9]+)\./);
  if (msMatch && MS_COURSE_NAMES[msMatch[1]]) return MS_COURSE_NAMES[msMatch[1]];
  return plan.title;
}

// AP courses are exam-prep by design (FRQ rubric vocabulary, CB Chief
// Reader notes, etc.) — that framing is explicitly forbidden for HS
// baselines (no SAT/ACT/AP mentions), so HS gets its own system prompt
// rather than reusing the AP one with substitutions.
const SYSTEM_AP = `You are an AP exam preparation expert producing study-notes "pointers" for a single CED topic.

Pointers are tactical reminders for exam revision — gotchas, FRQ rubric vocabulary, edge cases, common errors, and exam-strategy tips. They are NOT theory (definitions/formulas/laws) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's revision notes; they're the things the student needs to remember the night before the exam.

Given a CED topic + the lesson plan content (theory key ideas, worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", "When the FRQ says 'shift', say 'shift' back").
  - "kind":      one of "gotcha" | "frq-vocab" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - FRQ rubric vocabulary that students get wrong (CED-specific phrasings the rubric gives credit for).
  - Common errors documented in CB Chief Reader notes when you know them.
  - Edge cases the lesson plan touches but doesn't emphasize.
  - Conceptual confusions with adjacent topics in the same unit.

Avoid:
  - Restating theory that's already in the lesson plan.
  - Generic study advice ("review before the exam"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;

// HS variant: same tactical-reminder shape, but framed around ordinary
// class work (homework, quizzes, tests) instead of a named external
// exam. Do NOT mention SAT, ACT, AP, or any exam-prep vocabulary (FRQ,
// Chief Reader, rubric, free-response) — this is core course content,
// not test prep.
const SYSTEM_HS = `You are an experienced high-school teacher producing study-notes "pointers" for a single topic in a course.

Pointers are tactical reminders students actually need — gotchas, precise vocabulary/notation students misuse, edge cases, common errors, and quick self-check tips. They are NOT theory (definitions/formulas/laws) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's notes; they're the things a student needs to remember to avoid the mistakes this class makes over and over.

Given a topic + the lesson content (theory key ideas, worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", "Always check for Z before you Y").
  - "kind":      one of "gotcha" | "vocab-note" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - Precise vocabulary/notation students get wrong or use loosely (e.g. sign errors, notation students drop or mix up).
  - Common errors this specific topic invites (the ones a teacher sees every year).
  - Edge cases the lesson touches but doesn't emphasize.
  - Conceptual confusions with adjacent topics in the same unit.

Avoid:
  - Restating theory that's already in the lesson content.
  - Any mention of SAT, ACT, AP, standardized tests, exam strategy, FRQs, or rubrics — this is core class content, not test prep.
  - Generic study advice ("review before the test"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;

// Middle-school (MS) variant: same "ordinary class work, no exam framing"
// posture as SYSTEM_HS, but the persona and register are for a 7th
// grader, not a high-schooler — plainer vocabulary, shorter sentences,
// concrete framing over abstraction. Same SAT/ACT/AP/exam-vocabulary ban
// applies (this is core class content, not test prep).
//
// It is a FUNCTION, not a const, because the MS band now spans four
// subjects: the teacher's subject is interpolated from the plan id via
// MS_SUBJECT_PHRASE, so a geography note is never written by a math
// teacher. Adding an MS course means adding a MS_SUBJECT_PHRASE row.
const msSystem = (plan: LessonPlan): string => {
  const infix = plan.id.match(/^evelyn\.ms\.([a-z0-9]+)\./)?.[1] ?? '';
  const s = MS_SUBJECT_PHRASE[infix] ?? {
    teacher: 'middle-school teacher',
    course: '7th-grade course',
    imperative: '"Always name the idea before you use it"',
    slips: 'mixing up related terms, using a word loosely',
    edges: 'the cases the lesson mentions but does not dwell on',
  };
  return `You are an experienced ${s.teacher} producing study-notes "pointers" for a single topic in a ${s.course}.

Pointers are tactical reminders students actually need — gotchas, precise vocabulary/notation students misuse, edge cases, common errors, and quick self-check tips. They are NOT theory (definitions/formulas/rules) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's notes; they're the things a 7th grader needs to remember to avoid the mistakes this class makes over and over.

Given a topic + the lesson content (theory key ideas, worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", ${s.imperative}). Plain, concrete language a 12-year-old reads easily — short sentences, no jargon beyond what the lesson itself introduces.
  - "kind":      one of "gotcha" | "vocab-note" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - Precise vocabulary/notation students get wrong or use loosely (e.g. ${s.slips}).
  - Common errors this specific topic invites (the ones a teacher sees every year at this age).
  - Edge cases the lesson touches but doesn't emphasize (e.g. ${s.edges}).
  - Conceptual confusions with adjacent topics in the same unit.

Avoid:
  - Restating theory that's already in the lesson content.
  - Any mention of SAT, ACT, AP, standardized tests, exam strategy, FRQs, or rubrics — this is core class content, not test prep.
  - Generic study advice ("review before the test"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;
};

// Digital SAT (test-prep) variant: unlike HS, mentioning the exam is
// CORRECT and expected here — the course exists to prepare for it. Unlike
// AP, there is no FRQ/rubric/Chief-Reader apparatus to draw on — this is a
// multiple-choice, time-boxed digital test with its own recurring traps.
// The source lesson plans write their key ideas as named TRAPS rather than
// definitions; pointers should reinforce that trap-first framing rather
// than restate it as a definition.
const SYSTEM_DSAT = `You are an experienced Digital SAT tutor producing study-notes "pointers" for a single topic in a Digital SAT test-prep course (Math or Reading & Writing).

Pointers are tactical, exam-day reminders — named traps the digital SAT repeats on this topic, precise wording/phrasing students misread under time pressure, edge cases, common errors, and quick self-check moves. They are NOT theory (the traps/strategies already spelled out in the lesson) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's notes; they're the things a student needs to remember to avoid the mistakes this exact topic invites on test day.

Given a topic + the lesson content (theory key ideas — often named as TRAPS — worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", "When you see Z, check W first").
  - "kind":      one of "gotcha" | "vocab-note" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - A named SAT trap this topic repeats that the lesson content did NOT already spell out, or a sharper/more specific angle on one it did.
  - Precise wording the test uses to signal this skill (question stems, answer-choice phrasing) that students mis-scan under time pressure.
  - Common errors this specific topic invites on the actual digital SAT.
  - Conceptual confusions with adjacent topics in the same unit that the test exploits.

Avoid:
  - Restating a trap or definition that's already spelled out in the lesson content — say something new, not a rephrase.
  - FRQ, rubric, or "Chief Reader" vocabulary — that's AP framing, not this test. Mentioning the SAT/digital test itself, Desmos, timing, or the exam format is fine and expected here.
  - Generic study advice ("review before test day"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;

// ACT (test-prep) variant: shares the "exam framing is correct" posture
// with SYSTEM_DSAT, but the ACT is a materially different test — no
// Desmos (no calculator is provided or assumed by the test itself; a
// personal calculator is merely allowed on Math), no student-produced-
// response grid-in, a dedicated Science section (data interpretation +
// experimental reasoning, minimal outside science content knowledge),
// no provided formula sheet (unlike the SAT), an optional Writing/essay
// test, and different section-by-section timing (e.g. Math is ~1
// min/question; Science is the tightest-timed section). The source
// lesson plans write their key ideas as named TRAPS/STRATEGY lines,
// same as Digital SAT; pointers should add a new trap or sharper angle,
// not restate one.
const SYSTEM_ACT = `You are an experienced ACT tutor producing study-notes "pointers" for a single topic in an ACT test-prep course (English, Math, Reading, or Science).

Pointers are tactical, exam-day reminders — named traps the ACT repeats on this topic, precise wording/phrasing students misread under time pressure, edge cases, common errors, and quick self-check moves. They are NOT theory (the traps/strategies already spelled out in the lesson) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's notes; they're the things a student needs to remember to avoid the mistakes this exact topic invites on test day.

Given a topic + the lesson content (theory key ideas — often named as TRAPS — worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", "When you see Z, check W first").
  - "kind":      one of "gotcha" | "vocab-note" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - A named ACT trap this topic repeats that the lesson content did NOT already spell out, or a sharper/more specific angle on one it did.
  - Precise wording the test uses to signal this skill (question stems, answer-choice phrasing, Science-section figure/table labeling) that students mis-scan under time pressure.
  - Common errors this specific topic invites on the actual ACT.
  - Conceptual confusions with adjacent topics in the same unit that the test exploits.
  - For Science-section topics specifically: keep pointers grounded in reading figures/tables/experimental setups and comparing viewpoints — the ACT Science section tests data interpretation and experimental reasoning, NOT recalled outside science content. Do not invent a pointer that requires outside science knowledge the passage wouldn't supply.

Avoid:
  - Restating a trap or definition that's already spelled out in the lesson content — say something new, not a rephrase.
  - FRQ, rubric, or "Chief Reader" vocabulary — that's AP framing, not this test.
  - Desmos, student-produced-response / grid-in formatting, or a "the test gives you a formula sheet" claim — those are Digital SAT features the ACT does NOT have. The ACT provides NO formula sheet, and calculator use is Math-only (not the whole test). Mentioning the ACT itself, its section names (English/Math/Reading/Science, optional Writing), timing, or exam format is fine and expected here.
  - Generic study advice ("review before test day"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;

function loadAllPlans(): LessonPlan[] {
  const seedsDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'lesson-plan', 'seeds');
  const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
  const plans: LessonPlan[] = [];
  for (const file of files) {
    const fullPath = path.join(seedsDir, file);
    let mod: Record<string, unknown>;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require(fullPath);
    } catch {
      continue;
    }
    for (const [key, val] of Object.entries(mod)) {
      if (
        key.startsWith('SEED_') &&
        val &&
        typeof val === 'object' &&
        'id' in val &&
        'segments' in val
      ) {
        plans.push(val as LessonPlan);
      }
    }
  }
  return plans;
}

let cachedPlans: LessonPlan[] | null = null;
function findPlan(planId: string): LessonPlan | null {
  if (!cachedPlans) cachedPlans = loadAllPlans();
  return cachedPlans.find((p) => p.id === planId) ?? null;
}

function fileNameFor(plan: LessonPlan): string {
  const cedUnitRaw = (plan.metadata as { cedUnit?: string | number } | undefined)?.cedUnit;
  const cedUnit =
    typeof cedUnitRaw === 'number'
      ? cedUnitRaw
      : typeof cedUnitRaw === 'string'
        ? parseInt(cedUnitRaw, 10) || 0
        : 0;
  const apMatch = plan.id.match(/^evelyn\.ap\.([a-z]+)\./);
  if (apMatch) {
    const slugFromId = plan.id.replace(/^evelyn\.ap\.[a-z]+\./, '').replace(/\.v\d+$/, '');
    return `ap-${apMatch[1]}-u${cedUnit}-${slugFromId}.ts`;
  }
  const hsMatch = plan.id.match(/^evelyn\.(?:hs|testprep)\.([a-z0-9]+)\./);
  if (hsMatch) {
    const slugFromId = plan.id.replace(/^evelyn\.(?:hs|testprep)\.[a-z0-9]+\./, '').replace(/\.v\d+$/, '');
    return `${hsMatch[1]}-u${cedUnit}-${slugFromId}.ts`;
  }
  const msMatch = plan.id.match(/^evelyn\.ms\.([a-z0-9]+)\./);
  if (msMatch) {
    const slugFromId = plan.id.replace(/^evelyn\.ms\.[a-z0-9]+\./, '').replace(/\.v\d+$/, '');
    return `${msMatch[1]}-u${cedUnit}-${slugFromId}.ts`;
  }
  const fallbackSlug = plan.id.replace(/^evelyn\./, '').replace(/\.v\d+$/, '').replace(/\./g, '-');
  return `${fallbackSlug}.ts`;
}

function buildUserMessage(plan: LessonPlan): string {
  const metadata = (plan.metadata ?? {}) as { cedUnit?: string | number; cedTopic?: string; cedTitle?: string };
  const lines: string[] = [];
  lines.push(`Course: ${courseFor(plan)}`);
  lines.push(`CED Unit: ${metadata.cedUnit ?? '?'}`);
  lines.push(`CED Topic: ${metadata.cedTopic ?? '?'}`);
  lines.push(`CED Title: ${metadata.cedTitle ?? plan.title}`);
  lines.push('');

  lines.push('Learning objectives:');
  for (const lo of plan.los) {
    lines.push(`  - [${lo.id}] ${lo.description}`);
  }
  lines.push('');

  for (const seg of plan.segments) {
    if (seg.kind === 'concept') {
      const c = seg as Segment & {
        keyIdeas?: string[];
        vocabulary?: Array<{ term: string; definition: string }>;
      };
      lines.push(`--- Concept segment "${seg.id}" — key ideas:`);
      for (const idea of c.keyIdeas ?? []) lines.push(`  • ${idea}`);
      if ((c.vocabulary ?? []).length > 0) {
        lines.push(`  Vocabulary:`);
        for (const v of c.vocabulary ?? []) lines.push(`    - ${v.term}: ${v.definition}`);
      }
      lines.push('');
    } else if (seg.kind === 'worked_example') {
      const w = seg as Segment & { problem?: string; steps?: string[]; answer?: string };
      lines.push(`--- Worked example "${seg.id}":`);
      if (w.problem) lines.push(`  Problem: ${w.problem}`);
      lines.push(`  Steps:`);
      for (const s of w.steps ?? []) lines.push(`    - ${s}`);
      if (w.answer) lines.push(`  Answer: ${w.answer}`);
      lines.push('');
    } else if (seg.kind === 'try_yourself') {
      const t = seg as Segment & { problem?: string; expectedAnswer?: string };
      lines.push(`--- Try-yourself "${seg.id}":`);
      if (t.problem) lines.push(`  Problem: ${t.problem}`);
      if (t.expectedAnswer) lines.push(`  Expected: ${t.expectedAnswer}`);
      lines.push('');
    } else if (seg.kind === 'misconception_check') {
      const mc = seg as Segment & {
        question?: string;
        commonErrors?: Array<{ answer: string; misconception: string; correctsTo: string }>;
      };
      lines.push(`--- Misconception check "${seg.id}":`);
      if (mc.question) lines.push(`  Question: ${mc.question}`);
      for (const ce of mc.commonErrors ?? []) {
        lines.push(`  - Wrong answer "${ce.answer}": ${ce.misconception} → ${ce.correctsTo}`);
      }
      lines.push('');
    } else if (seg.kind === 'recap') {
      const r = seg as Segment & { mustRemember?: string[] };
      lines.push(`--- Recap takeaways:`);
      for (const item of r.mustRemember ?? []) lines.push(`  • ${item}`);
      lines.push('');
    }
  }

  lines.push('Produce 4-8 pointers as a JSON array. Return JSON only, no prose.');
  return lines.join('\n');
}

async function genPointers(plan: LessonPlan): Promise<PointerProposal[]> {
  const userMessage = buildUserMessage(plan);
  const system = isDSAT(plan)
    ? SYSTEM_DSAT
    : isACT(plan)
      ? SYSTEM_ACT
      : isHS(plan)
        ? SYSTEM_HS
        : isMS(plan)
          ? msSystem(plan)
          : SYSTEM_AP;
  const response = await rc().client.messages.create(
    prepareParams('notes-pointers', {
      model: rc().model,
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  );
  usageIn += response.usage?.input_tokens ?? 0;
  usageOut += response.usage?.output_tokens ?? 0;
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('');
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `pointer-gen returned non-JSON: ${(err as Error).message}\n--- output ---\n${text.slice(0, 600)}`,
    );
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`pointer-gen returned non-array: ${typeof parsed}`);
  }
  return parsed as PointerProposal[];
}

async function genOne(planId: string): Promise<boolean> {
  const plan = findPlan(planId);
  if (!plan) {
    console.error(`✗ plan not found: ${planId}`);
    return false;
  }
  const baselineFile = path.join(
    __dirname,
    '..',
    'src',
    'lib',
    'tutor',
    'topic-notes',
    'seeds',
    fileNameFor(plan),
  );
  if (!fs.existsSync(baselineFile)) {
    console.error(`✗ baseline file not found: ${baselineFile}`);
    console.error(`  run extractor first: scripts/extract-topic-notes-baselines.ts ${planId}`);
    return false;
  }

  console.log(`→ generating pointers for ${planId} via ${rc().model}...`);
  const pointers = await genPointers(plan);
  console.log(`✓ got ${pointers.length} pointer proposals`);

  const draftFile = baselineFile.replace(/\.ts$/, '.pointers.draft.json');
  fs.writeFileSync(draftFile, JSON.stringify(pointers, null, 2), 'utf-8');
  console.log(`✓ wrote draft to ${draftFile}`);
  return true;
}

async function main(): Promise<void> {
  if (!resolveModel('notes-pointers').apiKey) {
    console.error(
      '✗ No API key found for the notes-pointers role (checked TUTOR_MODEL_NOTES_POINTERS_API_KEY, ' +
        'TUTOR_MODEL_API_KEY, and ANTHROPIC_API_KEY). Note: POINTER_GEN_MODEL only selects the model, not the key.',
    );
    process.exit(2);
  }

  // Accepts one or more space-separated planIds. Each still gets its
  // own Opus call (this is the paid step) — batching only amortizes
  // the loadAllPlans() cost and lets a whole course run in one process.
  const planIds = process.argv.slice(2);
  if (planIds.length === 0) {
    console.error('Usage: scripts/gen-topic-notes-pointers.ts <planId> [<planId2> ...]');
    process.exit(2);
  }

  let okCount = 0;
  for (const planId of planIds) {
    const ok = await genOne(planId);
    if (ok) okCount++;
    console.log('');
  }

  const rate = lookupModelRate(rc().model);
  const cost = rate ? (usageIn / 1e6) * rate.input + (usageOut / 1e6) * rate.output : undefined;
  console.log(
    `Token usage: ${usageIn} in / ${usageOut} out.` +
      (cost !== undefined ? ` Est. cost: $${cost.toFixed(3)} (informational)` : ' (no rate row for this model)'),
  );

  console.log(`Done: ${okCount}/${planIds.length} pointer drafts generated.`);
  console.log('Next:');
  console.log('  1. review each JSON draft — keep the strong pointers, drop the weak ones');
  console.log('  2. paste keepers into the pointers: [...] block of the matching baseline seed file');
  console.log('  3. drop the rationale field when pasting (not persisted)');
  console.log('  4. delete the .pointers.draft.json file once merged (gitignored optional)');
  if (okCount < planIds.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error('✗ pointer-gen failed:', err);
  process.exit(1);
});
