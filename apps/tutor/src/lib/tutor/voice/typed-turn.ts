/**
 * Typed turn (fixed-script language lessons): the brain returns ONE JSON object
 * per turn instead of prose, and the engine composes speech and whiteboard
 * cards from the fields. This module holds the wire types, the JSON schema,
 * the stable system-prompt block, the per-turn state block, the sentence
 * budgets and the parser. Design: docs/superpowers/specs/2026-11-04-typed-turn-design.md.
 */
import { splitSentences } from '@/lib/tutor/question-gist-text';

export type TypedNextKind = 'retry' | 'question' | 'offer' | 'menu' | 'item' | 'move' | 'close' | 'wait';
export const TYPED_NEXT_KINDS: readonly TypedNextKind[] = ['retry', 'question', 'offer', 'menu', 'item', 'move', 'close', 'wait'];
export type TypedVerdict = 'correct' | 'partly_correct' | 'incorrect' | 'none';
const VERDICTS: readonly TypedVerdict[] = ['correct', 'partly_correct', 'incorrect', 'none'];
export type TypedLevel = '' | 'beginner' | 'intermediate' | 'advanced';
const LEVELS: readonly TypedLevel[] = ['', 'beginner', 'intermediate', 'advanced'];

export interface TypedCorrection { student: string; corrected: string; emphasis: string[]; explain: string }
export interface TypedNext { kind: TypedNextKind; say: string; item: string; level: TypedLevel }
export interface TypedTurn { ack: string; verdict: TypedVerdict; verdict_say: string; correction: TypedCorrection | null; support_ja: string; next: TypedNext }
export type TypedField = 'ack' | 'verdict' | 'verdict_say' | 'correction' | 'support_ja' | 'next';
/** The order the engine speaks / paints the fields in. */
export const TYPED_FIELD_ORDER: readonly TypedField[] = ['ack', 'verdict', 'verdict_say', 'correction', 'support_ja', 'next'];

/** What the client sends in the request body. `state` is the <turn_state …/> line. */
export interface TypedTurnRequest { state: string; allowedNext: TypedNextKind[]; recap: boolean; nudge?: boolean }

export const TYPED_SAY_BUDGET = 3;
export const TYPED_SAY_BUDGET_RECAP = 5;
/** A sentence reduced to what is heard: lowercase, no punctuation / quotes / whitespace (G1 duplicate check). */
export function normalizeSpoken(text: string): string {
  return (text ?? '').toLowerCase().replace(/[\s"'`“”‘’「」『』.,!?;:。、！？…\-—()（）]/g, '');
}
/** The English-sentence budget of a next.say: a recap and a menu (4 choices + its lead) get 5. One rule for engine and rules. */
export function typedSayBudgetFor(kind: TypedNextKind, recap: boolean): number {
  return recap || kind === 'menu' ? TYPED_SAY_BUDGET_RECAP : TYPED_SAY_BUDGET;
}
export const TYPED_ACK_BUDGET = 1;
export const TYPED_VERDICT_SAY_BUDGET = 2;

// Structured outputs reject min/maxLength; every object lists all keys in `required`.
export const TYPED_TURN_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['ack', 'verdict', 'verdict_say', 'correction', 'support_ja', 'next'],
  properties: {
    ack: { type: 'string' },
    verdict: { type: 'string', enum: [...VERDICTS] },
    verdict_say: { type: 'string' },
    correction: {
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['student', 'corrected', 'emphasis', 'explain'],
          properties: {
            student: { type: 'string' },
            corrected: { type: 'string' },
            emphasis: { type: 'array', items: { type: 'string' } },
            explain: { type: 'string' },
          },
        },
        { type: 'null' },
      ],
    },
    support_ja: { type: 'string' },
    next: {
      type: 'object',
      additionalProperties: false,
      required: ['kind', 'say', 'item', 'level'],
      properties: {
        kind: { type: 'string', enum: [...TYPED_NEXT_KINDS] },
        say: { type: 'string' },
        item: { type: 'string' },
        level: { type: 'string', enum: [...LEVELS] },
      },
    },
  },
};

export const TYPED_KIND_MEANING: Record<TypedNextKind, string> = {
  retry: 'ask for the same sentence once more.',
  question: 'ask a new question on this part.',
  offer: 'the one-more-or-move-on proposal.',
  menu: "read the part's choice menu WITH its numbers (\"1) …, 2) …, 3) …, 4) …\") so the student can answer with a number; five sentences at most.",
  item: 'give the next pronunciation sentence from the plan, with next.item set verbatim.',
  move: "one bridge sentence, then the next part's first ask or menu, three sentences at most.",
  close: 'the farewell after the summary.',
  wait: 'nothing is asked; the student is reading. Keep "say" very short.',
};

export const TYPED_TURN_INSTRUCTIONS = `TYPED TURN — OUTPUT FORMAT FOR THIS LESSON
Reply with ONE JSON object and nothing else: no prose before or after, no code fence, no tool markup, no stage directions, no "[note]" citations. The engine speaks and paints the fields in the order listed below, so write each field to be heard in that order. All your usual tutor persona and teaching-language rules still apply inside the fields.

{
  "ack": string,
  "verdict": "correct" | "partly_correct" | "incorrect" | "none",
  "verdict_say": string,
  "correction": { "student": string, "corrected": string, "emphasis": string[], "explain": string } | null,
  "support_ja": string,
  "next": { "kind": string, "say": string, "item": string, "level": "" | "beginner" | "intermediate" | "advanced" }
}

Every key is always present. Use "" for an unused string and null for no correction.

FIELDS, in speaking order
- "ack": a short natural reaction to what the student just said. One sentence at most. "" when nothing fits.
- "verdict": your judgment of the student's reply as an answer to the open ask. "correct": the student answered the open ask acceptably (content and grammar). In conversation and level-check parts an acceptable answer in understandable English is "correct" even with small slips you do not correct; leave "correction" null. "partly_correct": answered, but with an error you correct (fill "correction"). "incorrect": answered wrongly. "none": ONLY when the reply is not an answer at all: a question to you, "OK" or "yes" alone, an aside, a request to move on, silence, or a reply in Japanese only. Never use "none" for a reply that answers the ask, however simple. With "none", leave "verdict_say" empty and "correction" null, and answer what they said through "ack" and "next".
- "verdict_say": the spoken verdict, at most 2 sentences. "" when verdict is "none".
- "correction": only when the student's sentence is wrong. "student" is their sentence verbatim. "corrected" is the full model sentence, not a fragment. "emphasis" lists the words that changed, as they appear in "corrected". "explain" is the reason in at most 2 sentences. Otherwise null.
- "support_ja": an extra optional slot of Japanese support, at most 2 sentences. "" unless a short Japanese gloss helps this student.
- "next": what happens next.
  - "kind" MUST be one of the values in allowed_next for this turn. Never use another.
  - "say": what you say for that kind, at most 3 sentences (5 when recap is "yes" in the turn block).
  - "item": for kind "item", the next pronunciation sentence from the plan, verbatim. Otherwise "".
  - "level": only on the level-check close, the level you judge. Otherwise "".

Meaning of each next.kind
${TYPED_NEXT_KINDS.map((k) => `- ${k}: ${TYPED_KIND_MEANING[k]}`).join('\n')}
  A move's "say" ends with the new part's FIRST QUESTION (or its menu), never a readiness check like "Are you ready?" or "Shall we start?".
  next.kind outside allowed_next is rejected and costs the student a second wait; choose from the listed kinds only.

THE TURN BLOCK
The engine sends <turn_state .../> with every turn. Its attributes: part = the kind of lesson part; label = the part's name; turn = typed turns spoken in this part over its maximum; open_ask = what is currently asked of the student (none, retry, question, offer, menu, item); open_ask_text = the words of that ask; offer_made / offer_accepted = whether the one-more-or-move-on offer was made and taken; menu_picked = the menu option chosen, or none; items_practised / items_left = pronunciation sentences already spoken and still to come, separated by |; last_item = whether the final item was already announced; budget_due = whether the part's time or turn budget is spent; post_due (only when budget_due is yes) = turns already spent in this part after its budget ran out; last_turn="yes" (only then) = this part's extra turns are used up: write the move to the next part now when move is allowed (the engine allows nothing else once they are spent); correction_open = whether a correction is still waiting for the student to repeat it; level_known = whether the student's level is already recorded; answered (only when non-empty) = the card questions of this part the student has already answered, separated by | (it fills from correct and partly_correct verdicts only, so an answer marked none leaves its question unanswered); next_part / next_card (only when a move, close or offer is allowed) = the label and the opening card text of the part a move would enter, or next_part="(end)" on the last part. When nudge="yes" the student has been silent: "ack" carries one patient sentence, and "next" repeats the open ask or waits.

Never ask again a question listed in \`answered\`. When the student stalls or gives a non-answer twice, ask a DIFFERENT question on this part (or \`move\` when allowed), never the same one.

WHEN next.kind IS move
"say" is: one bridge sentence (what you learned in the part you are leaving, when next_part follows a bridge part) + the new part's opening ask taken from next_card: its first question verbatim, or, when next_card is a numbered menu, the menu read out WITH its numbers ("1) …, 2) …, 3) …, 4) …", all choices) so the student can answer with a number. Never invent a sentence to repeat, never start an item inside a move.

LANGUAGE
Japanese is allowed in any field under the lesson's teaching-language rules. support_ja is an extra slot, not a replacement for the English fields. Keep to the budgets: ack 1 sentence, verdict_say 2, explain 2, support_ja 2, next.say 3 (5 on a recap). The next.say budget counts English sentences; Japanese sentences in next.say do not count.

EXAMPLE, a correction turn (student said "I go there yesterday" to a past-tense ask; allowed_next includes retry)
{"ack":"Good try.","verdict":"incorrect","verdict_say":"Nearly there. Yesterday is in the past, so the verb changes.","correction":{"student":"I go there yesterday","corrected":"I went there yesterday.","emphasis":["went"],"explain":"Use the past form went for something that already happened."},"support_ja":"","next":{"kind":"retry","say":"Can you say the whole sentence once more?","item":"","level":""}}

EXAMPLE, verdict correct (conversation part; open ask "What did you do last weekend?"; the student said "I cooked dinner with friend and we watched film." The small slip is left uncorrected)
{"ack":"That sounds like a nice weekend.","verdict":"correct","verdict_say":"That is a clear answer.","correction":null,"support_ja":"","next":{"kind":"question","say":"What did you cook together?","item":"","level":""}}

EXAMPLE, verdict none (student asked "What does yesterday mean?" while a sentence was open)
{"ack":"Good question.","verdict":"none","verdict_say":"","correction":null,"support_ja":"yesterday は「昨日」という意味です。","next":{"kind":"retry","say":"Yesterday means the day before today. Now try the sentence once more.","item":"","level":""}}`;

export function typedTurnStateBlock(req: TypedTurnRequest): string {
  const allowedLine = `allowed_next: ${req.allowedNext.map((k) => `${k} — ${TYPED_KIND_MEANING[k].replace(/\.$/, '')}`).join('; ')}`;
  return `<typed_turn allowed_next="${req.allowedNext.join(',')}" recap="${req.recap ? 'yes' : 'no'}" nudge="${req.nudge ? 'yes' : 'no'}">\n${req.state}\n${allowedLine}\n</typed_turn>`;
}

// splitSentences only breaks Japanese terminators before whitespace + a capital,
// so 「こんにちは。元気ですか？」 stays one piece; split those here as well.
export function sentences(text: string): string[] {
  return splitSentences(text ?? '').flatMap((s) => s.split(/(?<=[。！？])\s*/)).filter(Boolean);
}

export function sentenceCount(text: string): number {
  return sentences(text).length;
}

/** A sentence is Japanese when it has any kana, or its kana+kanji outnumber (or equal) its ASCII letters
 *  (so 「去年」は… went を使います。 and 「I went there.」と言ってください。 are Japanese). The next.say budget counts the rest. */
function isJapaneseSentence(x: string): boolean {
  if (/[\u3040-\u30ff]/.test(x)) return true;
  return (x.match(/[\u3040-\u30ff\u4e00-\u9fff]/g) ?? []).length >= (x.match(/[A-Za-z]/g) ?? []).length && /[\u4e00-\u9fff]/.test(x);
}

export function englishSentenceCount(text: string): number {
  // an English terminator followed by Japanese is not split by splitSentences (it wants a capital next): split it here
  const parts = sentences(text).flatMap((x) => x.split(/(?<=[.!?])\s+(?=[\u3040-\u30ff\u4e00-\u9fff「『])/));
  return parts.filter((x) => !isJapaneseSentence(x)).length;
}

export function truncateToSentences(text: string, max: number): string {
  const s = sentences(text);
  if (s.length <= max) return text;
  return s.slice(0, max).join(' ');
}

const isStr = (v: unknown): v is string => typeof v === 'string';

/** JSON.parse + shape check (every key, enums). null on any miss. */
export function parseTypedTurn(json: string): TypedTurn | null {
  let o: any;
  try { o = JSON.parse(json); } catch { return null; }
  if (!o || typeof o !== 'object') return null;
  if (!isStr(o.ack) || !isStr(o.verdict_say) || !isStr(o.support_ja)) return null;
  if (!VERDICTS.includes(o.verdict)) return null;
  const c = o.correction;
  if (c !== null) {
    if (!c || typeof c !== 'object' || !isStr(c.student) || !isStr(c.corrected) || !isStr(c.explain)
      || !Array.isArray(c.emphasis) || !c.emphasis.every(isStr)) return null;
  }
  const n = o.next;
  if (!n || typeof n !== 'object' || !isStr(n.say) || !isStr(n.item)) return null;
  if (!TYPED_NEXT_KINDS.includes(n.kind) || !LEVELS.includes(n.level)) return null;
  return {
    ack: o.ack, verdict: o.verdict, verdict_say: o.verdict_say,
    correction: c === null ? null : { student: c.student, corrected: c.corrected, emphasis: c.emphasis, explain: c.explain },
    support_ja: o.support_ja,
    next: { kind: n.kind, say: n.say, item: n.item, level: n.level },
  };
}

// ---- Incremental field reader (streamed JSON) ----

export type TypedFieldValue =
  | { field: 'ack' | 'verdict_say' | 'support_ja'; value: string }
  | { field: 'verdict'; value: TypedVerdict }
  | { field: 'correction'; value: TypedCorrection | null }
  | { field: 'next'; value: TypedNext };

/** Loose per-field validation of a closed top-level value; undefined = reject (ignored). */
function coerceField(field: TypedField, v: any): TypedFieldValue | undefined {
  switch (field) {
    case 'ack': case 'verdict_say': case 'support_ja':
      return isStr(v) ? { field, value: v } : undefined;
    case 'verdict':
      return VERDICTS.includes(v) ? { field, value: v } : undefined;
    case 'correction':
      if (v === null) return { field, value: null };
      if (!v || typeof v !== 'object' || !isStr(v.student) || !isStr(v.corrected) || !isStr(v.explain)) return undefined;
      return { field, value: { student: v.student, corrected: v.corrected, explain: v.explain,
        emphasis: Array.isArray(v.emphasis) ? v.emphasis.filter(isStr) : [] } };
    case 'next':
      if (!v || typeof v !== 'object' || !isStr(v.say) || !TYPED_NEXT_KINDS.includes(v.kind)) return undefined;
      return { field, value: { kind: v.kind, say: v.say, item: isStr(v.item) ? v.item : '',
        level: LEVELS.includes(v.level) ? v.level : '' } };
  }
}

/** Tokenizes the streamed object and reports each top-level field the moment its value closes. */
export class TypedTurnReader {
  readonly closed: Partial<Record<TypedField, TypedFieldValue>> = {};
  complete = false;
  text = '';
  private pos = 0;
  private depth = 0;
  private inStr = false;
  private esc = false;
  private strStart = 0;
  private strIsKey = false;
  private key: string | null = null;
  private valueStart = -1;

  push(delta: string): TypedFieldValue[] {
    this.text += delta;
    const out: TypedFieldValue[] = [];
    const t = this.text;
    for (; this.pos < t.length; this.pos++) {
      const c = t[this.pos];
      if (this.complete) break;
      if (this.inStr) {
        if (this.esc) { this.esc = false; continue; }
        if (c === '\\') { this.esc = true; continue; }
        if (c !== '"') continue;
        this.inStr = false;
        if (this.depth !== 1) continue;
        if (this.strIsKey) {
          try { this.key = JSON.parse(t.slice(this.strStart, this.pos + 1)); } catch { this.key = ''; }
        } else {
          this.closeValue(this.pos + 1, out);
        }
        continue;
      }
      if (c === '"') {
        this.inStr = true; this.strStart = this.pos;
        if (this.depth === 1) {
          this.strIsKey = this.key === null;
          if (!this.strIsKey) this.valueStart = this.pos;
        }
      } else if (c === '{' || c === '[') {
        this.depth++;
        if (this.depth === 2 && this.key !== null) this.valueStart = this.pos;
      } else if (c === '}' || c === ']') {
        this.depth--;
        if (this.depth === 1) this.closeValue(this.pos + 1, out);
        else if (this.depth === 0) {
          if (this.valueStart >= 0) this.closeValue(this.pos, out);
          this.complete = true;
        }
      } else if (c === ',') {
        if (this.depth === 1 && this.valueStart >= 0) this.closeValue(this.pos, out);
        else if (this.depth === 1) this.key = null;
      } else if (this.depth === 1 && this.key !== null && this.valueStart < 0 && !/\s|:/.test(c)) {
        this.valueStart = this.pos; // literal: null / true / false / number
      }
    }
    return out;
  }

  private closeValue(end: number, out: TypedFieldValue[]): void {
    const key = this.key;
    const raw = this.text.slice(this.valueStart, end).trim();
    this.key = null; this.valueStart = -1;
    if (key === null || !TYPED_FIELD_ORDER.includes(key as TypedField)) return;
    const field = key as TypedField;
    if (this.closed[field]) return;
    let v: unknown;
    try { v = JSON.parse(raw); } catch { return; }
    const ev = coerceField(field, v);
    if (!ev) return;
    (this.closed as Record<string, TypedFieldValue>)[field] = ev;
    out.push(ev);
  }
}

/**
 * Reorders closure-order events into TYPED_FIELD_ORDER: a field is released only once every earlier one has been.
 * CONTRACT: the reader never emits a field that fails validation (e.g. unknown verdict), so later fields stay held
 * behind the gap. The caller MUST call flush() at end of stream, and when the object completes with a gap, to
 * release whatever is still held (in order).
 */
export class OrderedFieldEmitter {
  private held: Partial<Record<TypedField, TypedFieldValue>> = {};
  private nextIdx = 0;

  push(ev: TypedFieldValue): TypedFieldValue[] {
    this.held[ev.field] = ev;
    const out: TypedFieldValue[] = [];
    while (this.nextIdx < TYPED_FIELD_ORDER.length) {
      const f = TYPED_FIELD_ORDER[this.nextIdx];
      const h = this.held[f];
      if (!h) break;
      out.push(h); delete this.held[f]; this.nextIdx++;
    }
    return out;
  }

  /** Whatever is still held, in order (used on truncation). */
  flush(): TypedFieldValue[] {
    const out = TYPED_FIELD_ORDER.map(f => this.held[f]).filter((x): x is TypedFieldValue => !!x);
    this.held = {};
    this.nextIdx = TYPED_FIELD_ORDER.length;
    return out;
  }
}

/**
 * Is this error the endpoint refusing the STRUCTURED-OUTPUT parameter?
 * Only a 400 whose message names it (output_config / format / schema). The
 * first version treated ANY 400 this way — an over-long prompt or a malformed
 * request silently switched the grader to prompt-only JSON.
 */
export function isStructuredOutputRejection(err: unknown): boolean {
  const e = err as { status?: number; message?: string } | null;
  return e?.status === 400 && /output_config|output_format|json_schema|\bschema\b|\bformat\b|structured output/i.test(String(e?.message ?? ''));
}

export type TypedRetryReason = 'illegal_kind' | 'say_over_budget';

/**
 * The one regeneration request for a refused `next` (spec §4.2, §4.8 "splice"):
 * the first object's spoken fields stand, only `next` is read from the reply.
 */
export function typedTurnRetryMessage(input: {
  reason: TypedRetryReason;
  refused: TypedNext;
  allowedNext: TypedNextKind[];
  alreadySaid: Pick<TypedTurn, 'ack' | 'verdict' | 'verdict_say' | 'correction' | 'support_ja'>;
  budget: number;
}): string {
  const { reason, refused, allowedNext, alreadySaid, budget } = input;
  const why = reason === 'illegal_kind'
    ? `Your "next" was refused "${refused.kind}": that kind is not allowed on this turn (allowed: ${allowedNext.join(', ')}). Choose next.kind from the allowed set only.`
    : `Your "next" was refused "${refused.kind}" because next.say ran to ${englishSentenceCount(refused.say)} English sentences (Japanese sentences do not count). next.say is at most ${budget} sentences. Keep next.kind within the allowed set (allowed: ${allowedNext.join(', ')}).`;
  const said = [
    `ack: ${JSON.stringify(alreadySaid.ack)}`,
    `verdict: ${JSON.stringify(alreadySaid.verdict)}`,
    `verdict_say: ${JSON.stringify(alreadySaid.verdict_say)}`,
    `correction: ${JSON.stringify(alreadySaid.correction)}`,
    `support_ja: ${JSON.stringify(alreadySaid.support_ja)}`,
  ].join('\n');
  return `[typed turn retry — not from the student]\n${why}\n\n` +
    `These fields were ALREADY SPOKEN to the student. Return them unchanged:\n${said}\n\n` +
    `Only "next" is read from this reply. Reply with the whole JSON object again, with a new "next" ` +
    `that does not repeat what was already said.`;
}
