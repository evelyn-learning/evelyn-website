/**
 * Essay-type practice nodes, and answer keys that are really rubrics.
 *
 * Two rules, both about on-demand GENERATED practice items
 * (practice-gen.ts), neither about authored content:
 *
 * 1. Essay-practice nodes. A unit's FRQ / DBQ / LEQ / SAQ practice node asks
 *    for a rubric-graded essay or multi-part free response. The generator
 *    only writes machine-checkable items (multiple choice, one number, a
 *    short answer), so "filling" such a node produced questions ABOUT essay
 *    writing instead of an essay — and banked them. For these nodes
 *    generation never runs and already-banked generated rows are not served;
 *    the authored rubric items are served as before.
 *
 *    How a node is recognised (measured 2026-10-05 against all 2,269 curated
 *    LOs and the 1,032-skill GreenApple catalogue):
 *      - the LO id's last dot-segment is `u<N>-(frq|dbq|leq|saq)[-…]` — the
 *        id convention every essay-practice node follows: 117 of 117, and no
 *        ordinary lesson;
 *      - fallback for a plan that does not follow the convention: its TITLE
 *        reads "<FRQ|DBQ|LEQ|SAQ> … Practice" AND every try-yourself it holds
 *        is FRQ-format. Neither half is used alone: 107 ordinary lessons have
 *        only FRQ-format try-yourselves, and strategy lessons carry "FRQ" in
 *        their titles.
 *
 * 2. Rubric-shaped keys. A short-answer item is machine-graded against its
 *    key and the key is shown to the student as the answer. A key that
 *    describes what a good answer contains ("Defensible thesis on X + one
 *    accurate specific evidence (e.g. …)", "Answers will vary", "Award 1
 *    point for…") is not an answer; such a candidate is rejected at the gate.
 *
 * Pure: no I/O; one env read (the kill switch). Relative-import only.
 */

/** Kill switch for rule 1 (default ON). `TUTOR_PRACTICE_ESSAY_GEN_BLOCK=off`
 *  restores generation and generated rows on essay nodes. */
export function essayGenBlockEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return (env.TUTOR_PRACTICE_ESSAY_GEN_BLOCK ?? '').trim().toLowerCase() !== 'off';
}

const ESSAY_LO_SEGMENT_RE = /^u\d+-(?:frq|dbq|leq|saq)(?:-|$)/i;
const ESSAY_PLAN_TITLE_RE = /\b(?:FRQ|DBQ|LEQ|SAQ)\b.*\bPractice\b/;

/** The id convention: `<course>.u<N>-frq-practice`, `.u<N>-dbq-practice`,
 *  `.u<N>-frq-argument-essay`, … */
export function isEssayPracticeLoId(loId: string | null | undefined): boolean {
  if (!loId) return false;
  return ESSAY_LO_SEGMENT_RE.test(loId.slice(loId.lastIndexOf('.') + 1));
}

/** The fields of a plan the fallback reads (a `PlanLite` satisfies this). */
export interface EssayPlanLike {
  title?: string;
  los: ReadonlyArray<{ id: string }>;
  segments: ReadonlyArray<{ kind: string; responseFormat?: string | null; offTopic?: boolean; problem?: string }>;
}

/** Is `loId` an essay-practice node? `plans` = the plans that own the LO. */
export function isEssayPracticeNode(loId: string, plans: ReadonlyArray<EssayPlanLike> = []): boolean {
  if (isEssayPracticeLoId(loId)) return true;
  return plans.some((p) => {
    if (!p.title || !ESSAY_PLAN_TITLE_RE.test(p.title)) return false;
    if (!p.los.some((l) => l.id === loId)) return false;
    const tries = p.segments.filter((s) => s.kind === 'try_yourself' && s.offTopic !== true && !!s.problem);
    return tries.length > 0 && tries.every((s) => s.responseFormat === 'frq');
  });
}

/** A ProblemBank row written by the on-demand generator (`practice-gen.<loId>.<hash>`). */
export function isGeneratedPracticeItemId(id: string | null | undefined): boolean {
  return typeof id === 'string' && id.startsWith('practice-gen.');
}

/* ------------------------------------------------------------------ */
/* Rubric-shaped keys                                                  */
/* ------------------------------------------------------------------ */

const TASK_VERBS = 'include|mention|identify|explain|describe|reference|address|state|cite|contain|demonstrate|show|name|give|provide|connect|discuss|note|use|take|support|make';
const QUALITY = 'accurate|specific|relevant|supporting|valid|additional|concrete';

/** Each entry is one way a key reads as a rubric or an instruction rather
 *  than an answer. Deliberately narrow: every pattern needs the rubric
 *  PHRASE, not a single word — "credit", "two points", "a valid argument",
 *  "any real number", "accept electrons" are all genuine answers. */
const RUBRIC_KEY_PATTERNS: ReadonlyArray<RegExp> = [
  // "Answers will vary" / "Responses may vary"
  /\b(?:answers?|responses?|examples?|explanations?|wording)\s+(?:will|may|might|can|could)\s+vary\b/i,
  // "Student should explain…" / "The response must include…" / "Explanation should connect…"
  /^(?:the\s+|a\s+)?(?:students?|responses?|answers?|essays?|thesis|explanations?|writers?)\s+(?:should|must|needs?\s+to|(?:is|are)\s+expected\s+to)\b/i,
  // "Must include a claim…" / "Should mention…" (leading or mid-key)
  new RegExp(`(?:^|\\b)(?:must|should)\\s+(?:${TASK_VERBS})\\b`, 'i'),
  // "Explain in your own words…" — the key repeats the task
  /^(?:explain|describe|discuss|justify|argue|defend)\s+(?:how|why|the|a|an|in|your|whether|what)\b/i,
  // "Award 1 point for…" / "1 point for the thesis" / "Full credit for…" / "Earns the point if…"
  /\b(?:award(?:ed)?|earns?|receives?|gets?|worth|give)\s+(?:\d+|one|two|three|a|the|full|partial|no)\s+(?:points?|marks?|credit)\b/i,
  /\b\d+\s*(?:points?|pts?|marks?)\s+(?:for|if|each|per)\b/i,
  /\b(?:full|partial|half|no)\s+credit\b/i,
  // "Any valid example that…" / "Any two of: …" / "Any of the following"
  /^any\s+(?:valid|reasonable|acceptable|appropriate|accurate|correct|defensible|plausible|relevant|similar|logical|well[- ]supported)\b/i,
  /^any\s+(?:(?:one|two|three|\d+)\s+)?of\b/i,
  // "A response that…" / "An answer that names…" / "A thesis statement that…"
  /^(?:a|an|the)\s+(?:response|answer|essay|paragraph|thesis(?:\s+statement)?|statement|explanation|claim)\s+(?:that|which|identifying|explaining|describing|stating|showing)\b/i,
  // "Accept any answer that…" / "Accept: …" / "Acceptable answers include…"
  /^accept(?:able)?\s*(?::|(?:any|either|all|also|equivalent|answers?|responses?)\b)/i,
  // "Defensible thesis…" / "A well-supported claim…"
  /\b(?:defensible|well[- ]supported|well[- ]reasoned)\s+(?:thesis|claim|argument|position|response|answer)\b/i,
  // "Clear thesis and two pieces of…" / "Correct identification of the trend and…"
  /^(?:a\s+|an\s+)?(?:clear|accurate|correct|complete|specific|valid|relevant)\s+(?:thesis|claim|identification|explanation|description|statement|reasoning|example)\b.*(?:\b(?:and|with|of|that)\b|\+)/i,
  // "Thesis + two specific examples" / "Claim + at least one…" / "Claim + reasoning"
  /\+\s*(?:one|two|three)\s+(?:accurate|specific|relevant|supporting|valid|pieces?|examples?|reasons?|details?)\b/i,
  /\+\s*(?:at\s+least|any)\b/i,
  /\+\s*(?:reasoning|evidence|explanation|justification|analysis|examples?)\b/i,
  // "one accurate specific evidence" / "two pieces of supporting evidence"
  new RegExp(`\\b(?:one|two|three|\\d+)\\s+(?:(?:${QUALITY})\\s+)*(?:pieces?\\s+of\\s+)?(?:(?:${QUALITY})\\s+)*evidence\\b`, 'i'),
  // "See rubric" / "scoring guidelines"
  /\brubric\b/i,
  /\bscoring\s+(?:guide|guidelines|criteria)\b/i,
  // "Sample response: …" / "Model answer: …" / "Possible answers include…"
  /^(?:sample|model|example|exemplar|possible|suggested)\s+(?:answers?|responses?)\b/i,
  // "Open-ended" / "No single correct answer" / "…in your own words"
  /\bopen[- ]ended\b/i,
  /\bno\s+single\s+(?:correct\s+|right\s+)?answer\b/i,
  /\bin\s+(?:your|their|the\s+student'?s)\s+own\s+words\b/i,
];

/** Does this stored KEY read like a rubric or an instruction instead of an
 *  answer? Generic by construction — no topic vocabulary. */
export function looksLikeRubricKey(key: string | null | undefined): boolean {
  const k = (key ?? '').trim();
  if (!k) return false;
  return RUBRIC_KEY_PATTERNS.some((re) => re.test(k));
}
