/**
 * What KIND of thing did the student upload, and can a lesson be built from it?
 *
 * WHY THIS EXISTS. Until now the material path had exactly one behaviour for
 * every upload, because nothing ever asked what the material was. The gates in
 * front of it (`policy`, `deriveContainer` / `validateTopic`) run on
 * `topicHint` — the short line the student types — and NEVER on the extracted
 * material text. So the thing that is judged and the thing that drives
 * generation are two different strings, and both failure directions are real:
 *
 *   - a photo of a cat + the hint "explain how to do these questions" passes
 *     every gate, and the pipeline confidently generates a lesson about
 *     nothing;
 *   - a genuinely good chapter + the hint "help" can be refused, because only
 *     the hint was ever read.
 *
 * ⭐ THE RULE THIS RESTORES: **gate whatever will actually drive generation.**
 * On the typed-topic path that already holds — the gate reads the same string
 * the generator will. This module makes it hold on the material path too.
 *
 * A SECOND JOB, and the reason it returns a kind rather than a boolean.
 * Intent differs by material, and the pipeline was treating all of them as
 * "here is some content, teach it":
 *
 *   problem_set       a worksheet — the student wants THESE questions worked
 *   explanatory_text  a chapter — teach the content (today's behaviour, right)
 *   mixed             text + questions — teach it, then work them
 *   diagram           a figure/chart alone — explain THIS
 *   unusable          nothing teachable can be derived
 *
 * Reported live 2026-08-26: an IUPAC-naming worksheet produced a correct but
 * generic alcohols lesson whose practice problems were invented analogues, and
 * which never once referred to the sheet the student had uploaded.
 *
 * ⚠ FAILS OPEN, DELIBERATELY, AND THAT IS A DEPARTURE. `TopicValidator` fails
 * CLOSED. This does not, for one reason: the material path has NO gate today,
 * so proceeding-on-error is exactly the current behaviour and cannot regress
 * anyone, whereas refusing-on-error would turn a transient model blip into a
 * broken feature for a student who did nothing wrong. This is a QUALITY gate,
 * not a security boundary — the same thing `TopicValidator`'s own comment says
 * about itself, and the engine's in-session safety remains the real backstop.
 */

import Anthropic from '@anthropic-ai/sdk';

/** What the student handed over. */
export type MaterialKind = 'problem_set' | 'explanatory_text' | 'mixed' | 'diagram' | 'unusable';

const KINDS: readonly MaterialKind[] = ['problem_set', 'explanatory_text', 'mixed', 'diagram', 'unusable'];

export interface MaterialClassification {
  kind: MaterialKind;
  /** What the material is about, in its own terms. Empty when unusable. */
  topicSummary: string;
  /** Discrete questions found, when there are any. */
  itemCount?: number;
  /** Why nothing teachable could be derived. Only set for `unusable`. */
  reason?: string;
}

/**
 * Below this many characters of extracted text there is nothing to classify,
 * and no point spending a model call to find out.
 *
 * 40 chars is deliberately LOW. This is not a quality bar — it is the point
 * below which extraction has plainly failed (a blank scan, an icon, a photo
 * of a wall). A real one-line question like "Provide an IUPAC name for each
 * of the following alcohols" is 58 characters, and must sail past.
 */
export const MIN_CLASSIFIABLE_CHARS = 40;

export function isTooShortToClassify(combinedText: string): boolean {
  return combinedText.trim().length < MIN_CLASSIFIABLE_CHARS;
}

/**
 * Parse a model response into a classification, or null when it is not usable.
 *
 * Null means "the classifier did not answer" — which, per this module's
 * fail-open stance, must let generation PROCEED. It is deliberately distinct
 * from a successful `kind: 'unusable'`, which means the classifier looked and
 * found nothing teachable, and DOES refuse.
 */
export function parseClassification(raw: unknown): MaterialClassification | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const kind = o.kind;
  if (typeof kind !== 'string' || !KINDS.includes(kind as MaterialKind)) return null;

  const topicSummary = typeof o.topicSummary === 'string' ? o.topicSummary.trim().slice(0, 300) : '';
  // A non-unusable kind with no summary is an incoherent answer: every other
  // kind is defined by having identified something to teach. Treated as "no
  // answer" (fail open) rather than as a refusal.
  if (kind !== 'unusable' && !topicSummary) return null;

  const out: MaterialClassification = { kind: kind as MaterialKind, topicSummary };
  if (typeof o.itemCount === 'number' && Number.isFinite(o.itemCount) && o.itemCount > 0) {
    out.itemCount = Math.min(Math.round(o.itemCount), 200);
  }
  if (typeof o.reason === 'string' && o.reason.trim()) out.reason = o.reason.trim().slice(0, 300);
  return out;
}

export type MaterialVerdict =
  | { proceed: true; classification: MaterialClassification | null }
  | { proceed: false; code: 'material_unusable'; message: string };

/**
 * What the student is told when nothing teachable could be found.
 *
 * Must name a NEXT ACTION, not just a refusal. The two things that actually
 * fix this are more context or a better capture, and the student cannot know
 * which unless we say both. `reason` from the classifier is appended when it
 * is specific enough to help.
 */
export const UNUSABLE_BASE_MESSAGE =
  "We could not work out what to teach from that. Add a sentence saying what you would like help with, or try a clearer photo or a text version.";

/**
 * The decision. Pure, so the branch a student actually hits is testable
 * without a model in the loop.
 *
 * `classification` is null when the classifier errored, returned nonsense, or
 * was never run — all of which PROCEED, per the fail-open stance above.
 */
export function materialVerdict(classification: MaterialClassification | null): MaterialVerdict {
  if (classification && classification.kind === 'unusable') {
    const reason = classification.reason;
    return {
      proceed: false,
      code: 'material_unusable',
      // The reason is appended, never substituted: a bare model sentence can
      // be a description ("this is a photo of a cat") with no next step in it.
      message: reason ? `${UNUSABLE_BASE_MESSAGE} (${reason})` : UNUSABLE_BASE_MESSAGE,
    };
  }
  return { proceed: true, classification };
}

/**
 * The instruction the generator gets for a given kind — appended to the
 * existing generation input rather than replacing it.
 *
 * ⚠ `problem_set` deliberately does NOT say "copy the questions verbatim".
 * Vision transcription of drawn structures, graphs and equations is lossy, and
 * a garbled copy presented to the student as THEIR OWN question is worse than
 * a clean analogue: they cannot tell it has been corrupted, and they will
 * trust it over their own sheet. Anchoring to the same skills and item types
 * gets most of the benefit with none of that risk. Lifting items verbatim
 * becomes safe once the source is on the board next to the tutor, which is a
 * later change.
 */
export function generationHintForKind(kind: MaterialKind, itemCount?: number): string {
  switch (kind) {
    case 'problem_set':
      return [
        `The student uploaded a set of practice questions${itemCount ? ` (about ${itemCount})` : ''}.`,
        'They want to learn HOW TO SOLVE THESE, not a survey of the topic.',
        'Teach the method each question needs, then have them work items of the same type and difficulty.',
        'Refer to it as the questions they brought.',
      ].join(' ');
    case 'mixed':
      return [
        'The student uploaded material containing BOTH explanation and questions.',
        'Teach the content first, then work through questions of the kind included.',
        'Refer to it as the material they brought.',
      ].join(' ');
    case 'diagram':
      return [
        'The student uploaded a figure, chart or diagram rather than prose.',
        'Build the lesson around reading and interpreting it: what it shows, how to read it, what it implies.',
        'Refer to it as the figure they brought.',
      ].join(' ');
    case 'explanatory_text':
      return 'The student uploaded explanatory material. Teach its content in its own order. Refer to it as the material they brought.';
    case 'unusable':
      // Never reached — materialVerdict refuses first. Present so the switch
      // is exhaustive and a future kind cannot fall through silently.
      return '';
  }
}

/* ------------------------------------------------------------------ */
/* The model call                                                      */
/* ------------------------------------------------------------------ */

/** Same Haiku id the rest of this pipeline uses for its cheap passes. */
const HAIKU_MODEL_ID = 'claude-haiku-4-5-20251001';
const CLASSIFY_MAX_TOKENS = 400;
/** Only the head of the material is needed to tell WHAT it is. Bounded so a
 *  30-page PDF costs the same as a one-page worksheet. */
const CLASSIFY_SAMPLE_CHARS = 4000;

const CLASSIFY_SYSTEM_PROMPT = [
  'You classify study material a student uploaded to a tutoring product, so the tutor knows what kind of lesson to build.',
  '',
  'Choose exactly one kind:',
  '- "problem_set": mostly questions/exercises for the student to solve.',
  '- "explanatory_text": mostly explanation, notes, or a chapter.',
  '- "mixed": substantial amounts of both.',
  '- "diagram": a figure, chart, graph or table with little prose.',
  '- "unusable": nothing teachable can be derived — blank or failed capture, an unrelated photo, or content with no academic or skill subject in it.',
  '',
  'Be GENEROUS about teachability. Almost anything with a subject in it is teachable, including messy notes, a single question, or a topic you consider basic.',
  'Reserve "unusable" for material where you genuinely cannot name a subject to teach.',
  'A student typing a vague hint is NOT a reason to call it unusable — judge the MATERIAL.',
  '',
  'Return ONLY JSON:',
  '{"kind":"<one of the above>","topicSummary":"<what it is about, 3-12 words>","itemCount":<number of distinct questions, omit if none>}',
  'or {"kind":"unusable","reason":"<what you actually see, one short clause>"}',
].join('\n');

/** Last parseable JSON block wins — the parseLast convention used by
 *  TopicValidator and OpenContainerDeriver. */
function parseLastJson(text: string): unknown {
  const fenced = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]!);
  const candidates = fenced.length > 0 ? fenced : [text];
  for (let i = candidates.length - 1; i >= 0; i--) {
    try { return JSON.parse(candidates[i]!.trim()); } catch { /* try earlier */ }
  }
  try { return JSON.parse(text.trim()); } catch { return null; }
}

export interface ClassifyDeps {
  /** Injected so the tests need no network. */
  complete(system: string, user: string): Promise<string>;
}

/**
 * Classify extracted material. NEVER throws and NEVER rejects on error —
 * returns null, which `materialVerdict` treats as "proceed" (see the fail-open
 * note in this file's header).
 *
 * `topicHint` rides along only as context for the summary; it must not be able
 * to make unusable material look usable, which is why the prompt says to judge
 * the MATERIAL. That is the whole point of this gate: the hint is what the old
 * gates read, and reading it is what let a cat photo through.
 */
export async function classifyMaterial(
  combinedText: string,
  topicHint: string,
  deps: ClassifyDeps,
): Promise<MaterialClassification | null> {
  if (isTooShortToClassify(combinedText)) {
    return { kind: 'unusable', topicSummary: '', reason: 'we could not read any text from that' };
  }
  try {
    const sample = combinedText.slice(0, CLASSIFY_SAMPLE_CHARS);
    const user = `The student typed this hint: ${JSON.stringify(topicHint)}\n\nExtracted material:\n${sample}`;
    return parseClassification(parseLastJson(await deps.complete(CLASSIFY_SYSTEM_PROMPT, user)));
  } catch (err) {
    console.warn('[material-classify] failed, proceeding without a classification:', (err as Error)?.message ?? err);
    return null;
  }
}

/**
 * Lazy singleton, for the same reason material-extract.ts documents: a tsx
 * test script that calls dotenv config() then imports this module would see
 * its import hoisted above that call, so reading the key at module load would
 * find it undefined.
 */
let anthropicClient: Anthropic | null = null;
export function getClassifierClient(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

/** Production deps: one cheap Haiku call. */
export function defaultClassifyDeps(client: Anthropic): ClassifyDeps {
  return {
    async complete(system, user) {
      const res = await client.messages.create({
        model: HAIKU_MODEL_ID,
        max_tokens: CLASSIFY_MAX_TOKENS,
        temperature: 0,
        system,
        messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      });
      const block = res.content.find((b) => b.type === 'text');
      return block && block.type === 'text' ? block.text : '';
    },
  };
}
