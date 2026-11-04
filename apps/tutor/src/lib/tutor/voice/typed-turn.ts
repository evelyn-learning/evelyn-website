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
- "verdict": your judgment of the student's reply as an answer to the open ask. Use "none" whenever the reply is NOT an answer to the open ask: a question to you, an aside, a request, or a reply in Japanese only. With "none", leave "verdict_say" empty and "correction" null, and answer what they said through "ack" and "next".
- "verdict_say": the spoken verdict, at most 2 sentences. "" when verdict is "none".
- "correction": only when the student's sentence is wrong. "student" is their sentence verbatim. "corrected" is the full model sentence, not a fragment. "emphasis" lists the words that changed, as they appear in "corrected". "explain" is the reason in at most 2 sentences. Otherwise null.
- "support_ja": an extra optional slot of Japanese support, at most 2 sentences. "" unless a short Japanese gloss helps this student.
- "next": what happens next.
  - "kind" MUST be one of the values in allowed_next for this turn. Never use another.
  - "say": what you say for that kind, at most 3 sentences (5 when recap is "yes" in the turn block).
  - "item": for kind "item", the next pronunciation sentence from the plan, verbatim. Otherwise "".
  - "level": only on the level-check close, the level you judge. Otherwise "".

Meaning of each next.kind
- retry: ask for the same sentence once more.
- question: ask a new question on this part.
- offer: the one-more-or-move-on proposal.
- menu: read the part's choice menu.
- item: give the next pronunciation sentence from the plan, with next.item set verbatim.
- move: one bridge sentence, then the next part's first ask or menu, three sentences at most.
- close: the farewell after the summary.
- wait: nothing is asked; the student is reading. Keep "say" very short.

LANGUAGE
Japanese is allowed in any field under the lesson's teaching-language rules. support_ja is an extra slot, not a replacement for the English fields. Keep to the budgets: ack 1 sentence, verdict_say 2, explain 2, support_ja 2, next.say 3 (5 on a recap).

EXAMPLE, a correction turn (student said "I go there yesterday" to a past-tense ask; allowed_next includes retry)
{"ack":"Good try.","verdict":"incorrect","verdict_say":"Nearly there. Yesterday is in the past, so the verb changes.","correction":{"student":"I go there yesterday","corrected":"I went there yesterday.","emphasis":["went"],"explain":"Use the past form went for something that already happened."},"support_ja":"","next":{"kind":"retry","say":"Can you say the whole sentence once more?","item":"","level":""}}

EXAMPLE, verdict none (student asked "What does yesterday mean?" while a sentence was open)
{"ack":"Good question.","verdict":"none","verdict_say":"","correction":null,"support_ja":"yesterday は「昨日」という意味です。","next":{"kind":"retry","say":"Yesterday means the day before today. Now try the sentence once more.","item":"","level":""}}`;

export function typedTurnStateBlock(req: TypedTurnRequest): string {
  return `<typed_turn allowed_next="${req.allowedNext.join(',')}" recap="${req.recap ? 'yes' : 'no'}" nudge="${req.nudge ? 'yes' : 'no'}">\n${req.state}\n</typed_turn>`;
}

// splitSentences only breaks Japanese terminators before whitespace + a capital,
// so 「こんにちは。元気ですか？」 stays one piece; split those here as well.
function sentences(text: string): string[] {
  return splitSentences(text ?? '').flatMap((s) => s.split(/(?<=[。！？])\s*/)).filter(Boolean);
}

export function sentenceCount(text: string): number {
  return sentences(text).length;
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

/** Reorders closure-order events into TYPED_FIELD_ORDER: a field is released only once every earlier one has been. */
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
