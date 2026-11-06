/**
 * Typed turn (fixed-script language lessons): the brain returns ONE JSON object
 * per turn instead of prose, and the engine composes speech and whiteboard
 * cards from the fields. This module holds the wire types, the JSON schema,
 * the stable system-prompt block, the per-turn state block, the sentence
 * budgets and the parser. Design: docs/superpowers/specs/2026-11-04-typed-turn-design.md.
 */
import { splitSentences } from '@/lib/tutor/question-gist-text';
import { typedNonTerminalPeriod } from './sentence-spacing';

export type TypedNextKind = 'retry' | 'question' | 'offer' | 'menu' | 'item' | 'move' | 'close' | 'wait';
export const TYPED_NEXT_KINDS: readonly TypedNextKind[] = ['retry', 'question', 'offer', 'menu', 'item', 'move', 'close', 'wait'];
export type TypedVerdict = 'correct' | 'partly_correct' | 'incorrect' | 'none';
const VERDICTS: readonly TypedVerdict[] = ['correct', 'partly_correct', 'incorrect', 'none'];
export type TypedLevel = '' | 'beginner' | 'intermediate' | 'advanced';
const LEVELS: readonly TypedLevel[] = ['', 'beginner', 'intermediate', 'advanced'];

export interface TypedCorrection { student: string; corrected: string; emphasis: string[]; explain: string }
export interface TypedNext { kind: TypedNextKind; say: string; item: string; level: TypedLevel }
/** V1 (fix wave 2): `board` is the brain's clean written form of a correct reply — the only sentence the
 *  engine boards for a correct verdict (it never boards the raw transcript). Not spoken. */
export interface TypedTurn { ack: string; verdict: TypedVerdict; verdict_say: string; board: string; correction: TypedCorrection | null; support_ja: string; next: TypedNext }
export type TypedField = 'ack' | 'verdict' | 'verdict_say' | 'board' | 'correction' | 'support_ja' | 'next';
/** The order the engine speaks / paints the fields in. */
export const TYPED_FIELD_ORDER: readonly TypedField[] = ['ack', 'verdict', 'verdict_say', 'board', 'correction', 'support_ja', 'next'];

/** What the client sends in the request body. `state` is the <turn_state …/> line. */
export interface TypedTurnRequest {
  state: string; allowedNext: TypedNextKind[]; recap: boolean; nudge?: boolean;
  /** W6: the pronunciation items still to practise in this part (verbatim); a `next` item outside it is refused. */
  itemsLeft?: string[];
  /** R3: a `move` this turn needs a real answer — the server refuses move on verdict none (one retry). */
  moveNeedsAnswer?: boolean;
  /** X2 (fix wave 3): the part's required phrases not yet said — a `close` that does not contain each one (this turn's
   *  spoken fields + next.say) is refused once; the retry is taken as it comes. */
  requiredPhrases?: string[];
  /** A (fix wave 6, p3 1118–1141 s): the student's last utterance was English (studentSpokeEnglish) — a turn whose
   *  spoken text has no English sentence is refused once (english_missing). */
  studentEnglish?: boolean;
  /** W11-B: the language the student asked to be spoken to in (English name), when this turn is that re-ask. */
  languageRequest?: string;
  /** W12-B (wave 12, run 8 399 s): the recap's open question holds a required phrase (the check question) and the student
   *  replied this turn — the close may now say the remaining (feedback) phrases itself; W9-C's refusal stands down. */
  checkAnswered?: boolean;
}

export const TYPED_SAY_BUDGET = 3;
/** V3 (fix wave 2): a recap's review + feedback + check turn needs 2+2+2 English sentences (spec §4.1 said 5). */
export const TYPED_SAY_BUDGET_RECAP = 7;
export const TYPED_SAY_BUDGET_MENU = 5;
/** A sentence reduced to what is heard: lowercase, no punctuation / quotes / whitespace (G1 duplicate check). */
export function normalizeSpoken(text: string): string {
  return (text ?? '').toLowerCase().replace(/[\s"'`“”‘’「」『』.,!?;:。、！？…\-—()（）]/g, '');
}
/** The English-sentence budget of a next.say: a recap gets 7, a menu (4 choices + its lead) 5. One rule for engine and rules. */
export function typedSayBudgetFor(kind: TypedNextKind, recap: boolean, languageRequest = false): number {
  const base = recap ? TYPED_SAY_BUDGET_RECAP : kind === 'menu' ? TYPED_SAY_BUDGET_MENU : TYPED_SAY_BUDGET;
  // W11-B review i4: the language-request re-ask restates the previous turn (≤ 2 sentences) and re-asks — one more.
  return languageRequest ? Math.max(base, TYPED_SAY_BUDGET + 1) : base;
}
export const TYPED_ACK_BUDGET = 1;
export const TYPED_VERDICT_SAY_BUDGET = 2;

// Structured outputs reject min/maxLength; every object lists all keys in `required`.
export const TYPED_TURN_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['ack', 'verdict', 'verdict_say', 'board', 'correction', 'support_ja', 'next'],
  properties: {
    ack: { type: 'string' },
    verdict: { type: 'string', enum: [...VERDICTS] },
    verdict_say: { type: 'string' },
    board: { type: 'string' },
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
  item: 'give the next pronunciation sentence from items_left, with next.item set verbatim.',
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
  "board": string,
  "correction": { "student": string, "corrected": string, "emphasis": string[], "explain": string } | null,
  "support_ja": string,
  "next": { "kind": string, "say": string, "item": string, "level": "" | "beginner" | "intermediate" | "advanced" }
}

Every key is always present. Use "" for an unused string and null for no correction.

FIELDS, in speaking order
- "ack": a short natural reaction to what the student just said. One sentence at most. "" when nothing fits.
- "verdict": your judgment of the student's reply as an answer to the open ask. \`correct\`: the reply answers the open ask and is acceptable as said. In a part that teaches a grammar point (\`part\` is bridge, offer_part or plain), a reply with an error in the target grammar, a missing verb, a missing article/plural that changes the form, or a fragment where a sentence was asked is \`partly_correct\` with a correction. In conversation parts small slips may pass as \`correct\`, but an error in the lesson's target grammar is corrected while \`corrections_left\` is above 0. In the level check nothing is corrected. There every real answer is \`correct\` with \`correction\` null, errors or not (a non-answer is still \`none\`). In the recap part a reply that names a sentence, a grammar point or an answer to the check question is \`correct\` or \`partly_correct\`, never \`none\`. A slip you let pass is "correct" with "correction" null; an acceptable answer is never "none". "partly_correct": answered, but with an error you correct (fill "correction"). "incorrect": answered wrongly. \`none\` ONLY when the reply is not an attempt at the open ask: silence, a greeting, 'OK' / 'thank you', 'I don't understand', a request to repeat or slow down, a question to you, an aside, a request to move on, or a reply in Japanese only. A reply that attempts the question in English is never \`none\`, in any part, even when you will not correct it. A reply that restates one of the question's own options — even as an imperative or a fragment ('Ask them to repeat the words') — is an answer, never a request. With "none", leave "verdict_say" empty and "correction" null, and answer what they said through "ack" and "next".
- "verdict_say": the spoken verdict, at most 2 sentences. "" when verdict is "none".
- "board": when verdict is \`correct\` and the reply is a complete sentence worth keeping, that sentence in its clean written form (capitalised, punctuated, fillers removed, no transcription slips); \`""\` when the reply is a fragment, a bare yes/no, a menu pick, or when a correction is given. The engine shows \`board\` on the whiteboard exactly as written; it never shows the raw transcript. Not spoken. In the level check (part=level_check), \`board\` is the clean corrected form of EVERY answer, whatever the verdict (written only — say nothing about the mistakes there; no correction field). When \`next.kind\` is \`move\` right after the student's answer, judge that answer first (\`verdict\`, \`verdict_say\`, \`board\` when it was clean), then \`next.say\` = one bridge sentence + the new part's opening ask. A correction is always followed by \`retry\` (the student says the corrected sentence once); the move or the next question waits one turn, after that repeat is judged.
- "correction": only when the student's sentence is wrong. "student" is their sentence verbatim. "corrected" is the full model sentence, not a fragment. "emphasis" lists the words that changed, as they appear in "corrected". "explain" is the reason in at most 2 sentences. Otherwise null.
- "support_ja": an extra optional slot of Japanese support, at most 2 sentences. "" unless a short Japanese gloss helps this student.
- "next": what happens next.
  - "kind" MUST be one of the values in allowed_next for this turn. Never use another.
  - "say": what you say for that kind, at most 3 sentences (7 when recap is "yes" in the turn block; 5 for a menu).
    A \`question\` turn asks and stops: never tell the learner which words to begin with ('starting with: …' belongs to a \`retry\` only), and never say 'move on' / 'next question' inside it — ask the question.
  - "item": for kind "item", the next pronunciation sentence from items_left, verbatim. Otherwise "".
  - "level": only on the level-check close, the level you judge. Otherwise "".

Meaning of each next.kind
${TYPED_NEXT_KINDS.map((k) => `- ${k}: ${TYPED_KIND_MEANING[k]}`).join('\n')}
  A move's "say" ends with the new part's FIRST QUESTION (or its menu), never a readiness check like "Are you ready?" or "Shall we start?".
  next.kind outside allowed_next is rejected and costs the student a second wait; choose from the listed kinds only.

THE TURN BLOCK
The engine sends <turn_state .../> with every turn. Its attributes: part = the kind of lesson part; label = the part's name; turn = typed turns spoken in this part over its maximum; open_ask = what is currently asked of the student (none, retry, question, offer, menu, item); open_ask_text = the words of that ask; learner_sentences = the student's own corrected sentences of this lesson, already on the board (recap only); offer_made / offer_accepted = whether the one-more-or-move-on offer was made and taken; menu_picked = the menu option chosen, or none; items_practised / items_left = pronunciation sentences already spoken and still to come, separated by | (after an item's result, work on the weakest word with one more repeat (\`retry\`) before the next item or the offer); last_item = whether the final item was already announced; budget_due = whether the part's time or turn budget is spent; post_due (only when budget_due is yes) = turns already spent in this part after its budget ran out; last_turn="yes" (only then) = this part's extra turns are used up: write the move to the next part now when move is allowed (the engine allows nothing else once they are spent); correction_open = whether a correction is still waiting for the student to repeat it; corrections_left (conversation parts only) = how many more corrections this part allows; at 0 let target-grammar slips pass as "correct"; level_known = whether the student's level is already recorded; move_needs_answer="yes" (only then) = \`move\` only if this reply was a real answer (verdict ≠ none); a non-answer → \`question\`; questions_done="yes" (only then) = every numbered question of this part has been answered — move now; recap_step (recap part only) = the step of the summary, explained below; required_phrases (recap part only) = phrases you have not said yet in this part — your closing turn must contain each one verbatim; answered (only when non-empty) = the card questions of this part the student has already answered, separated by | (it fills from correct and partly_correct verdicts only, so an answer marked none leaves its question unanswered); next_part / next_card (only when a move, close or offer is allowed) = the label and the opening card text of the part a move would enter, or next_part="(end)" on the last part; offer_repeat="allowed" (only then) = the offer was made and the student's reply did not choose — answer what they said and make the offer once more (\`offer\`), or \`move\`; repeat_due="yes" (only then) = the recording of the open pronunciation item could not be measured: \`next\` is \`retry\` of that same sentence — say in one short sentence that the recording was cut, ask for one more repeat and say the sentence again as your last sentence; never say you cannot hear, never say the student did not say it, and do not describe sounds. repeat_due="low_score" (only then) = the open pronunciation item was measured and scored low: \`next\` is \`retry\` of that same word or sentence — name the ONE weakest sound or word from the measured items, show how to say it in one short sentence, and say the word or sentence again as your last sentence; never a new item this turn. language_request="<language>" (only then) = the student asked you to use that language: "ack" is one short sentence agreeing; "next" repeats the open ask (same kind) and its "say" first restates in that language what your previous turn said (the scores, the explanation — at most two sentences), then asks the open ask again (your "say" may have four sentences on that turn); from now on use that language for explanations, instructions and feedback too. When nudge="yes" the student has been silent: "ack" carries one patient sentence, and "next" repeats the open ask or waits.

THE RECAP PART
- \`recap_step=review_feedback_check\`: \`next.say\` reviews what was practised using the student's OWN corrected sentences from this lesson (the card's examples only when they produced none), gives one specific strength and one thing to improve, and asks the part's check question; use every phrase in \`required_phrases\` verbatim.
- \`recap_step=close\`: \`next.kind\` is \`close\`; \`verdict_say\` evaluates their check answer, \`next.say\` explains briefly if needed and closes warmly; ask nothing after the close.
- A close never introduces a required phrase: every phrase in \`required_phrases\` is said on the review turn (feedback) or asked as a \`question\` and answered before the close; a close that would be the first turn to say one is refused, and the check question is asked instead; once the check question has been asked and answered, the close says every remaining phrase itself (a feedback phrase before the goodbye), never asking the check again.
- On the review question, put the two sentences you contrast in \`board\`, separated by ' | ', so the student sees them while you ask.
- \`learner_sentences\` are already on the board when the recap opens: review from them ("these sentences" means those); never refer to sentences that are not listed there or in \`board\`.

When \`move\` is not in \`allowed_next\`, never say the part is over and never announce a move; the engine turns the page, not your words. An \`offer\` turn names the next part as the choice ('…or shall we move on to <next_part>?') — that is not a move.

Never ask again a question listed in \`answered\`. When the student stalls or gives a non-answer twice, ask a DIFFERENT question on this part (or \`move\` when allowed), never the same one.

WHEN next.kind IS move
A \`move\` never asks the student to repeat or say a sentence (that is \`item\` or \`retry\`): its say closes this part in one bridge sentence and asks the next part's opening question.
"say" is: one bridge sentence (what you learned in the part you are leaving, when next_part follows a bridge part) + the new part's opening ask taken from next_card: its first question verbatim, or, when next_card is a numbered menu, the menu read out WITH its numbers ("1) …, 2) …, 3) …, 4) …", all choices) so the student can answer with a number. When \`next_card\` lists key ideas or example sentences (not a question or a numbered menu), \`say\` is: the bridge sentence, ONE sentence that names the card's example(s) as a preview, then the card's practice question. Never invent a sentence to repeat, never start an item inside a move.
On a \`move\` turn the move is announced ONCE, in next.say: \`ack\` and \`support_ja\` do not announce the move or name the next part — the ack acknowledges the reply, the Japanese line supports the teaching point.

LANGUAGE
Japanese is allowed in any field under the lesson's teaching-language rules. support_ja is an extra slot, not a replacement for the English fields. Every turn you speak contains at least one English sentence (in \`verdict_say\` or \`next.say\`); Japanese supports, it never replaces. Keep to the budgets: ack 1 sentence, verdict_say 2, explain 2, support_ja 2, next.say 3 (5 for a menu, 7 on a recap). The next.say budget counts English sentences; Japanese sentences in next.say do not count.

EXAMPLE, a grammar part with an error in the target grammar (part is offer_part and teaches the past simple; the student said "I go there yesterday" to a past-tense ask; allowed_next includes retry)
{"ack":"Good try.","verdict":"partly_correct","verdict_say":"Nearly there. Yesterday is in the past, so the verb changes.","board":"","correction":{"student":"I go there yesterday","corrected":"I went there yesterday.","emphasis":["went"],"explain":"Use the past form went for something that already happened."},"support_ja":"","next":{"kind":"retry","say":"Can you say the whole sentence once more?","item":"","level":""}}

EXAMPLE, verdict correct (conversation part; the lesson's target grammar is the past simple; open ask "What did you do last weekend?"; the student said "I cooked dinner with friend and we watched film." The past forms are right; the missing articles are a small slip that is not the target grammar, left uncorrected)
{"ack":"That sounds like a nice weekend.","verdict":"correct","verdict_say":"That is a clear answer.","board":"I cooked dinner with a friend and we watched a film.","correction":null,"support_ja":"","next":{"kind":"question","say":"What did you cook together?","item":"","level":""}}

EXAMPLE, verdict none (student asked "What does yesterday mean?" while a sentence was open)
{"ack":"Good question.","verdict":"none","verdict_say":"","board":"","correction":null,"support_ja":"yesterday は「昨日」という意味です。","next":{"kind":"retry","say":"Yesterday means the day before today. Now try the sentence once more.","item":"","level":""}}`;

export function typedTurnStateBlock(req: TypedTurnRequest): string {
  const allowedLine = `allowed_next: ${req.allowedNext.map((k) => `${k} — ${TYPED_KIND_MEANING[k].replace(/\.$/, '')}`).join('; ')}`;
  return `<typed_turn allowed_next="${req.allowedNext.join(',')}" recap="${req.recap ? 'yes' : 'no'}" nudge="${req.nudge ? 'yes' : 'no'}">\n${req.state}\n${allowedLine}\n</typed_turn>`;
}

// splitSentences only breaks Japanese terminators before whitespace + a capital,
// so 「こんにちは。元気ですか？」 stays one piece; split those here as well.
// B (fix wave 6): a piece ending in an abbreviation ("Mr.", "Dr.", "No." + digit) is joined to the next (typedNonTerminalPeriod).
export function sentences(text: string): string[] {
  const pieces = splitSentences(text ?? '').flatMap((s) => s.split(/(?<=[。！？])\s*/)).filter(Boolean);
  const out: string[] = [];
  for (const p of pieces) {
    const prev = out[out.length - 1];
    if (prev !== undefined && typedNonTerminalPeriod(prev, ` ${p}`)) out[out.length - 1] = `${prev} ${p}`;
    else out.push(p);
  }
  return out;
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

/** A (fix wave 6): an English utterance — at least 3 ASCII words and no Japanese script. Pure. */
export function studentSpokeEnglish(text: string): boolean {
  const s = String(text ?? '');
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(s)) return false;
  return (s.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).length >= 3;
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
  if (!isStr(o.ack) || !isStr(o.verdict_say) || !isStr(o.board) || !isStr(o.support_ja)) return null;
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
    ack: o.ack, verdict: o.verdict, verdict_say: o.verdict_say, board: o.board,
    correction: c === null ? null : { student: c.student, corrected: c.corrected, emphasis: c.emphasis, explain: c.explain },
    support_ja: o.support_ja,
    next: { kind: n.kind, say: n.say, item: n.item, level: n.level },
  };
}

// ---- Incremental field reader (streamed JSON) ----

export type TypedFieldValue =
  | { field: 'ack' | 'verdict_say' | 'board' | 'support_ja'; value: string }
  | { field: 'verdict'; value: TypedVerdict }
  | { field: 'correction'; value: TypedCorrection | null }
  | { field: 'next'; value: TypedNext };

/** Loose per-field validation of a closed top-level value; undefined = reject (ignored). */
function coerceField(field: TypedField, v: any): TypedFieldValue | undefined {
  switch (field) {
    case 'ack': case 'verdict_say': case 'board': case 'support_ja':
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

const CORRECTION_LEADING_FILLERS = new Set(['uh', 'um', 'so', 'yes', 'no', 'well', 'okay', 'ok']);
const CORRECTION_HESITATIONS = new Set(['uh', 'um', 'er', 'erm', 'ah', 'hmm']);
/** Words of a sentence: lower-case, punctuation stripped (an inner apostrophe kept), whitespace collapsed. */
function correctionWords(text: string): string[] {
  return (text ?? '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}'\s]+/gu, ' ').replace(/(^|\s)'+|'+(\s|$)/g, ' ')
    .split(/\s+/).filter(Boolean);
}

/**
 * Z1 (fix wave 5, p2.txt 310 s / 501 s): true when a correction changes nothing in what the student said —
 * the brain marked a correct sentence partly_correct and armed a retry of the same sentence.
 * (1) the corrected sentence, normalised, equals the student's words (leading uh/um/so/yes/no/well/okay/ok dropped);
 * (2) the fix is already there: TypedCorrection has no explicit from→to pair, so the pair is read from the words —
 *     every `emphasis` word (the "to") occurs in the student's words at least as often as in the corrected sentence,
 *     the student says nothing the corrected sentence drops (no "from" left; hesitations uh/um aside), and the
 *     corrected words appear in the same order. Word order, a missing second article, a wrong form → false.
 */
export function correctionChangesNothing(studentText: string, correction: TypedTurn['correction']): boolean {
  if (!correction) return false;
  const fixed = correctionWords(correction.corrected);
  if (!fixed.length) return false;
  const said = correctionWords(studentText);
  while (said.length && CORRECTION_LEADING_FILLERS.has(said[0])) said.shift();
  if (!said.length) return false;
  if (said.join(' ') === fixed.join(' ')) return true;
  const emphasis = correction.emphasis.flatMap(correctionWords);
  if (!emphasis.length) return false;
  const count = (xs: string[], w: string) => xs.filter((x) => x === w).length;
  if (!emphasis.every((w) => count(said, w) >= count(fixed, w))) return false;
  const kept = said.filter((w) => !CORRECTION_HESITATIONS.has(w));
  return kept.join(' ') === fixed.join(' ');
}

export type TypedRetryReason = 'illegal_kind' | 'say_over_budget' | 'move_needs_answer' | 'missing_required_phrase' | 'english_missing' | 'question_dictates_opening' | 'correction_needs_retry' | 'check_question_unasked' | 'move_reads_as_item';

/** Z2 (fix wave 8, run 4 67 s "Try starting with: I want to…"): a question / offer / menu that tells the learner
 *  which words to begin with. A `retry` is never checked — "starting with: …" is its normal scaffold. */
// Fix round 1 I2: "start with:" + a capital, or "start with" + a quote — never a bare "start with" ("Which part would you
// like to start with?") nor a numbered-menu colon ("begin with: 1, 2 or 3?").
const DICTATES_OPENING_RE = /\b(?:[Ss]tart|[Ss]tarting|[Bb]egin|[Bb]eginning)\s+with\s*(?::\s*(?=[A-Z])|["'‘“])/;
const DICTATES_FULL_SENTENCE_RE = /\b(?:please\s+)?(?:answer|reply|respond)\s+(?:with\s+)?(?:a\s+)?(?:full|complete)\s+sentence\s+(?:starting|beginning)\s+with\b/i;
export function typedQuestionDictatesOpening(next: TypedNext): boolean {
  if (next.kind !== 'question' && next.kind !== 'offer' && next.kind !== 'menu') return false;
  return DICTATES_OPENING_RE.test(next.say) || DICTATES_FULL_SENTENCE_RE.test(next.say);
}

/** W14-B (wave 14, run 11 229 s): "can we do speaking more naturally?" → the brain's `next` was kind "move" with a say that
 *  asked for a repeat ("Here is a sentence … Listen, then repeat after me.") — the engine turned the page to the summary
 *  while the student was told to repeat. A move whose say asks for a repeat is an item turn in disguise. Pure. */
const ITEM_ASK_RE = /\b(?:repeat after me|listen,? then|listen and repeat|say (?:it|that|this|the (?:whole |full |complete )?sentence|the word)(?: once more| again| one more time)?|once more|one more time)\b/i;
export function typedMoveReadsAsItem(next: TypedNext): boolean {
  return next.kind === 'move' && ITEM_ASK_RE.test(next.say);
}

/**
 * The one regeneration request for a refused `next` (spec §4.2, §4.8 "splice"):
 * the first object's spoken fields stand, only `next` is read from the reply.
 */
export function typedTurnRetryMessage(input: {
  reason: TypedRetryReason;
  refused: TypedNext;
  allowedNext: TypedNextKind[];
  alreadySaid: Pick<TypedTurn, 'ack' | 'verdict' | 'verdict_say' | 'board' | 'correction' | 'support_ja'>;
  budget: number;
  /** W6: an `item` refused because next.item is not one of these (the items still to practise). */
  itemNotListed?: string[];
  /** X2: a `close` refused because these required phrases were not said (verbatim, as the plan lists them). */
  missingPhrases?: string[];
  /** Z1: a `retry` refused because the correction changed nothing (dropped before speech; verdict now correct). */
  correctionNoChange?: boolean;
}): string {
  const { reason, refused, allowedNext, alreadySaid, budget, itemNotListed, missingPhrases, correctionNoChange } = input;
  const why = reason === 'check_question_unasked'
    // W9-C (fix wave 9, run 5 997 s): the close wrote the unasked check question in as a statement.
    ? `Your "next" was refused "${refused.kind}" (check_question_unasked): the required phrase${(missingPhrases ?? []).length === 1 ? '' : 's'} ${(missingPhrases ?? []).map((x) => JSON.stringify(x)).join(', ')} ${(missingPhrases ?? []).length === 1 ? 'was' : 'were'} not said in an earlier turn of this part, and a close may not be the first turn to say ${(missingPhrases ?? []).length === 1 ? 'it' : 'them'}. Ask now with next.kind "question": one sentence that uses the phrase, plus the two example sentences when it is the check question (next.say at most ${budget} sentences); the close comes next turn, after the student's answer (allowed: ${allowedNext.join(', ')}).`
    : reason === 'move_reads_as_item'
    // W14-B (wave 14, run 11 229 s): the move's say asked for a repeat — the page turned while the student was told to repeat.
    ? `Your "next" was refused "${refused.kind}" (move_reads_as_item): next.say asks the student to repeat or say a sentence, which is a pronunciation item turn, not a move. Use next.kind "item" with next.item copied from the items still to practise (or "retry" for the open item) and keep that sentence in next.say; a move says goodbye to this part and asks the next part's opening question only (allowed: ${allowedNext.join(', ')}).`
    : reason === 'correction_needs_retry'
    // W9-A (fix wave 9, run 5 101 s): a correction and a move / question in one turn — the learner never said the corrected sentence.
    ? `Your "next" was refused "${refused.kind}" (correction_needs_retry): this turn corrected the student's sentence, so next.kind is "retry" — ask them to say the corrected sentence once (next.say: one short sentence, then the corrected sentence). The ${refused.kind === 'move' || refused.kind === 'close' ? 'move' : 'next question'} comes next turn, after that repeat is judged (allowed: ${allowedNext.join(', ')}).`
    : reason === 'question_dictates_opening'
    ? `Your "next" was refused "${refused.kind}" (question_dictates_opening): the question told the learner which words to begin with. Ask the question plainly and stop; the learner answers in their own words (allowed: ${allowedNext.join(', ')}).`
    : reason === 'english_missing'
    ? `Your "next" was refused "${refused.kind}" (english_missing): the student spoke English, and this turn had no English sentence. Every turn to an English-speaking student contains at least one English sentence. Say the same thing in English in next.say; Japanese may follow as support (allowed: ${allowedNext.join(', ')}).`
    : reason === 'illegal_kind' && correctionNoChange
    ? `Your "next" was refused "${refused.kind}" (correction_no_change): the student's sentence already has that form; no correction, no retry — ask the next question or offer (allowed: ${allowedNext.filter((k) => k !== 'retry').join(', ')}).`
    : reason === 'missing_required_phrase'
    // W9-C: no longer "write the close again with each" — the phrase goes in the right place.
    ? `Your "next" was refused "${refused.kind}" (missing_required_phrase): this turn did not say ${(missingPhrases ?? []).map((x) => JSON.stringify(x)).join(', ')}. Say each missing phrase in the right place: a feedback phrase in next.say before the goodbye; a check question asked as a "question" turn when "question" is allowed (allowed: ${allowedNext.join(', ')}).`
    : reason === 'move_needs_answer'
    ? `Your "next" was refused "${refused.kind}" (move_needs_answer): the student's reply was not an answer (verdict "none"), so this part cannot move on yet. Ask this part's question again with next.kind "question" (allowed: ${allowedNext.join(', ')}).`
    : reason === 'illegal_kind' && itemNotListed
    ? `Your "next" was refused "${refused.kind}" (item_not_listed): next.item ${JSON.stringify(refused.item)} is not one of the sentences still to practise. next.item must be one of these, copied verbatim: ${itemNotListed.map((x) => JSON.stringify(x)).join(' | ')}. Keep next.kind within the allowed set (allowed: ${allowedNext.join(', ')}).`
    : reason === 'illegal_kind'
    ? `Your "next" was refused "${refused.kind}": that kind is not allowed on this turn (allowed: ${allowedNext.join(', ')}). Choose next.kind from the allowed set only.`
      // X3 (fix wave 3, r61b 71 s / 147 s): the retry spoke the refused move inside a question turn.
      + (refused.kind === 'move' || refused.kind === 'close' ? ' Do not announce a move, do not say this part is finished, and do not name the next part — stay in this part and choose from the allowed kinds.' : '')
    : `Your "next" was refused "${refused.kind}" because next.say ran to ${englishSentenceCount(refused.say)} English sentences (Japanese sentences do not count). next.say is at most ${budget} sentences. Keep next.kind within the allowed set (allowed: ${allowedNext.join(', ')}).`;
  const said = [
    `ack: ${JSON.stringify(alreadySaid.ack)}`,
    `verdict: ${JSON.stringify(alreadySaid.verdict)}`,
    `verdict_say: ${JSON.stringify(alreadySaid.verdict_say)}`,
    `board: ${JSON.stringify(alreadySaid.board)}`,
    `correction: ${JSON.stringify(alreadySaid.correction)}`,
    `support_ja: ${JSON.stringify(alreadySaid.support_ja)}`,
  ].join('\n');
  return `[typed turn retry — not from the student]\n${why}\n\n` +
    `These fields were ALREADY SPOKEN to the student. Return them unchanged:\n${said}\n\n` +
    `Only "next" is read from this reply. Reply with the whole JSON object again, with a new "next" ` +
    `that does not repeat what was already said.`;
}
