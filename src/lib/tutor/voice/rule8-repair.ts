/**
 * Rule-8 repair pass (Phase 4.1, humanlike-latency plan).
 *
 * Rule 8 of the tutor contract: anything mathematical the tutor SAYS must
 * also land on the board. The stream route detects violations (narration
 * promised a visual / spoke math, zero tool calls this turn) but until now
 * only logged `RULE8_VIOLATION` and dropped it. This module converts
 * detection → repair: one Haiku call transcribes ONLY what was literally
 * spoken into ≤3 board repairs (`show_equation` / `tutor_handwrite`),
 * each anchored to its introducing sentence so the client's render-sync
 * buffer can still time it (or paint late — late ink beats no ink).
 *
 * Safety shape:
 *  - detector is pure over the turn's REAL sentence list (the route's
 *    `sentence` events — no re-splitting heuristics);
 *  - model output is validated WHOLESALE (any malformed entry rejects the
 *    whole batch — fail-to-nothing, never partial garbage);
 *  - repairs then flow through validateToolCall server-side and the client
 *    validator/dedup stack UNCHANGED — if the brain already drew it, dedup
 *    drops the repair (the brain remains the authority).
 *
 * Tests: npm run test:rule8-repair (pure halves only — no API calls).
 */
import Anthropic from '@anthropic-ai/sdk';
import {
  segment,
  autoWrapUnicodeMath,
  autoWrapLatex,
  decodeHtmlEntities,
} from '../whiteboard/inline-math';

export const RULE8_REPAIR_MODEL = 'claude-haiku-4-5-20251001';

/** Same shape the stream route has always logged RULE8_VIOLATION with —
 *  a first-person promise verb followed by a drawing verb. */
export const RULE8_PROMISE_REGEX =
  /\b(let me|i['’]ll|i will|here['’]s|here is|i['’]m going to)\s+(draw|plot|show|sketch|display|render|graph|create)\b/i;

/** "X is defined as…" / "we call this X" — a definition the student should
 *  see written, not just hear. */
const DEFINITION_REGEX =
  /\b(is defined as|we define|is called|we call (?:this|that|it))\b/i;

/** v2 (round 6: spoken "trap question" never boarded): narration that
 *  ANNOUNCES a problem being posed to the student. Deliberately requires an
 *  announcement phrase — bare Socratic questions ("What do you think?") are
 *  everywhere in tutoring and boarding them all would be noise. The noun must
 *  be singular ("questions" fails the trailing \b), so "any questions?" and
 *  praise like "that's a great question" don't fire (no announcement verb). */
export const POSED_QUESTION_REGEX =
  /\b(let me (?:give|pose|ask) you|i(?:['’]ll| will) (?:give|pose|ask) you|here['’]s|here is|i have|try this|let['’]s try)\b[^.?!]*?\b(question|problem|challenge|exercise|riddle|puzzle|one)\b/i;

export interface Rule8Detection {
  needed: boolean;
  promisedVisual: boolean;
  /** 1-based indices into the turn's sentence list (= anchorM numbering). */
  mathSentences: number[];
  definitionSentences: number[];
  /** v2: sentences announcing a problem posed to the student. */
  posedQuestionSentences: number[];
}

/** Does this sentence carry $…$-worthy math? Same pipeline InlineMathText
 *  renders with, so "spoken math" here means exactly "math the chat bubble
 *  would have typeset" — currency/prose stays prose (looksLikeMath). */
function hasSpokenMath(sentence: string): boolean {
  return segment(autoWrapLatex(autoWrapUnicodeMath(decodeHtmlEntities(sentence))))
    .some((s) => s.kind === 'math');
}

/**
 * End-of-turn detection over the turn's real sentences. Only a turn with
 * ZERO tool calls is repairable — a turn that drew *something* is the
 * brain exercising judgment about what deserves the board (and partial
 * repair would need cross-referencing what was already drawn).
 */
export function detectRepairNeed(sentences: readonly string[], toolCount: number): Rule8Detection {
  const promisedVisual = RULE8_PROMISE_REGEX.test(sentences.join(' '));
  const mathSentences: number[] = [];
  const definitionSentences: number[] = [];
  const posedQuestionSentences: number[] = [];
  for (let i = 0; i < sentences.length; i++) {
    if (hasSpokenMath(sentences[i])) mathSentences.push(i + 1);
    else if (DEFINITION_REGEX.test(sentences[i])) definitionSentences.push(i + 1);
    if (POSED_QUESTION_REGEX.test(sentences[i])) posedQuestionSentences.push(i + 1);
  }
  const needed =
    toolCount === 0 &&
    (promisedVisual || mathSentences.length > 0 || definitionSentences.length > 0 ||
      posedQuestionSentences.length > 0);
  return { needed, promisedVisual, mathSentences, definitionSentences, posedQuestionSentences };
}

export interface Rule8Repair {
  kind: 'show_equation' | 'handwrite';
  anchorSentence: number;
  args: Record<string, unknown>;
}

const MAX_REPAIRS = 3;
const MAX_LATEX_LEN = 500;
const MAX_LABEL_LEN = 120;
const MAX_HANDWRITE_LEN = 120;

const ALLOWED_ARG_KEYS: Record<Rule8Repair['kind'], Set<string>> = {
  show_equation: new Set(['latex', 'label']),
  handwrite: new Set(['text']),
};

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

/**
 * Wholesale validation of the repair model's structured output. Returns the
 * typed repair list, or null if ANYTHING is off — one malformed entry
 * rejects the whole batch (fail-to-nothing, never partial garbage).
 * `maxSentence` = the turn's sentence count (anchors must land in-turn).
 */
export function parseRepairResponse(raw: unknown, maxSentence: number): Rule8Repair[] | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const repairs = (raw as { repairs?: unknown }).repairs;
  if (!Array.isArray(repairs) || repairs.length > MAX_REPAIRS) return null;
  const out: Rule8Repair[] = [];
  for (const r of repairs) {
    if (typeof r !== 'object' || r === null) return null;
    const { kind, anchorSentence, args } = r as {
      kind?: unknown; anchorSentence?: unknown; args?: unknown;
    };
    if (kind !== 'show_equation' && kind !== 'handwrite') return null;
    if (
      typeof anchorSentence !== 'number' ||
      !Number.isInteger(anchorSentence) ||
      anchorSentence < 1 ||
      anchorSentence > maxSentence
    ) return null;
    if (typeof args !== 'object' || args === null) return null;
    const argRec = args as Record<string, unknown>;
    const allowed = ALLOWED_ARG_KEYS[kind];
    if (Object.keys(argRec).some((k) => !allowed.has(k))) return null;
    if (kind === 'show_equation') {
      if (!isNonEmptyString(argRec.latex, MAX_LATEX_LEN)) return null;
      if (argRec.label !== undefined && !isNonEmptyString(argRec.label, MAX_LABEL_LEN)) return null;
    } else {
      if (!isNonEmptyString(argRec.text, MAX_HANDWRITE_LEN)) return null;
    }
    out.push({ kind, anchorSentence, args: argRec });
  }
  return out;
}

// ─── v2: client-initiated repair (net-of-client-drops) ───
// Round 6: the turn HAD a server-side tool (show_equation) but the client
// dedup-dropped it, so the board got nothing while the server saw toolCount=1
// and skipped repair. Only the client knows what actually painted, so the
// dropped-to-zero case is client-initiated: at stream end the client compares
// "tools the server sent" against "renders that painted" and POSTs the turn's
// spoken sentences to /api/tutor/rule8-repair. Mutually exclusive with the
// server pass by construction: server fires ONLY at serverToolCount===0,
// client fires ONLY at serverToolCount>0.

export { shouldClientRequestRepair, type ClientRepairSignals } from './rule8-client';
import { shouldClientRequestRepair } from './rule8-client';

const MAX_REQUEST_SENTENCES = 60;
const MAX_REQUEST_SENTENCE_LEN = 600;

export interface ClientRepairRequest {
  sentences: string[];
  serverToolCount: number;
  paintedCount: number;
}

/** Bounded validation of the client repair POST body — fail-to-null on
 *  anything off, and the request must actually satisfy the client-side
 *  decision predicate (the endpoint re-checks; never trusts the caller). */
export function parseClientRepairRequest(raw: unknown): ClientRepairRequest | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const { sentences, serverToolCount, paintedCount } = raw as Record<string, unknown>;
  if (!Array.isArray(sentences) || sentences.length === 0 || sentences.length > MAX_REQUEST_SENTENCES) return null;
  if (!sentences.every((s) => typeof s === 'string' && s.length <= MAX_REQUEST_SENTENCE_LEN)) return null;
  if (typeof serverToolCount !== 'number' || !Number.isInteger(serverToolCount) || serverToolCount < 0) return null;
  if (typeof paintedCount !== 'number' || !Number.isInteger(paintedCount) || paintedCount < 0) return null;
  if (!shouldClientRequestRepair({ serverToolCount, paintedCount, sentenceCount: sentences.length })) return null;
  return { sentences: sentences as string[], serverToolCount, paintedCount };
}

export interface RepairToolCallFrame {
  name: 'show_equation' | 'tutor_handwrite';
  args: Record<string, unknown>;
  anchorSentence: number;
}

/** Map validated repairs to the tool-call frames the client already knows
 *  how to dispatch (`handwrite` rides the existing tutor_handwrite path). */
export function toToolCallFrames(repairs: readonly Rule8Repair[]): RepairToolCallFrame[] {
  return repairs.map((r) => ({
    name: r.kind === 'handwrite' ? 'tutor_handwrite' : 'show_equation',
    args: r.args,
    anchorSentence: r.anchorSentence,
  }));
}

const REPAIR_TOOL_NAME = 'emit_board_repairs';

const REPAIR_TOOL_SCHEMA = {
  name: REPAIR_TOOL_NAME,
  description: 'Emit the board repairs for equations/definitions the tutor spoke but never drew.',
  input_schema: {
    type: 'object' as const,
    properties: {
      repairs: {
        type: 'array',
        maxItems: MAX_REPAIRS,
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['show_equation', 'handwrite'] },
            anchorSentence: { type: 'number', description: 'The 1-based sentence number that spoke this content.' },
            args: {
              type: 'object',
              properties: {
                latex: { type: 'string', description: 'show_equation only: the spoken relation/expression in LaTeX.' },
                label: { type: 'string', description: 'show_equation only: optional short label.' },
                text: { type: 'string', description: 'handwrite only: the spoken term/definition, ≤80 chars, plain text.' },
              },
            },
          },
          required: ['kind', 'anchorSentence', 'args'],
        },
      },
    },
    required: ['repairs'],
  },
};

const REPAIR_SYSTEM_PROMPT = `You are a board-repair transcriber for a voice tutor. The tutor just finished a spoken turn in which it mentioned mathematical content or a definition WITHOUT drawing anything on the whiteboard. Your only job: transcribe what was LITERALLY SPOKEN into at most ${MAX_REPAIRS} small board writes.

Rules — all hard:
- Transcribe ONLY content literally present in the given sentences. NEVER add new equations, steps, values, or explanations the tutor did not say.
- Prefer \`handwrite\` for a term, name, or short definition ("slope = rise over run"); use \`show_equation\` for an actual relation/expression (latex like "b^2 - 4ac = 0").
- \`anchorSentence\` = the 1-based number of the sentence that spoke that content.
- If a sentence only vaguely references math ("this formula", "the equation we saw") with no literal content to transcribe, emit NOTHING for it.
- If the tutor POSED a question or problem to the student ("here's a trap question: …"), \`handwrite\` the question itself — the literally spoken question, trimmed to its core. Anchor to the sentence that contains the question.
- Fewer is better. Zero repairs is a valid answer (empty list).`;

let sharedClient: Anthropic | null = null;

/**
 * The one Haiku call. Any failure — API error, timeout, malformed output —
 * returns [] (fail-to-nothing; the turn already played fine without ink).
 */
export async function generateRule8Repairs(
  sentences: readonly string[],
  detection: Rule8Detection,
  client?: Anthropic,
): Promise<Rule8Repair[]> {
  const numbered = sentences.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const hints = [
    detection.promisedVisual ? 'The tutor verbally promised a visual.' : '',
    detection.mathSentences.length ? `Sentences with spoken math: ${detection.mathSentences.join(', ')}.` : '',
    detection.definitionSentences.length ? `Sentences with definitions: ${detection.definitionSentences.join(', ')}.` : '',
    detection.posedQuestionSentences.length ? `Sentences announcing a question/problem posed to the student: ${detection.posedQuestionSentences.join(', ')} (the question itself may be in the following sentence).` : '',
  ].filter(Boolean).join(' ');
  try {
    const anthropic = client ?? (sharedClient ??= new Anthropic());
    const response = await anthropic.messages.create(
      {
        model: RULE8_REPAIR_MODEL,
        max_tokens: 1000,
        system: REPAIR_SYSTEM_PROMPT,
        tools: [REPAIR_TOOL_SCHEMA],
        tool_choice: { type: 'tool', name: REPAIR_TOOL_NAME },
        messages: [{ role: 'user', content: `Tutor turn sentences:\n${numbered}\n\n${hints}` }],
      },
      // One shot, bounded: the SSE stream is held open while this runs.
      { timeout: 8000, maxRetries: 0 },
    );
    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') return [];
    return parseRepairResponse(toolUse.input, sentences.length) ?? [];
  } catch {
    return [];
  }
}
