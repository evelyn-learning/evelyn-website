/**
 * Praise-then-exclusion: the turn opens by affirming the student and, in the
 * same sentence or the next, says the student's OWN bare value is excluded /
 * not included / does not satisfy / is not a solution.
 *
 * 2026-10-04 (live, student gac-test-001; the student's own problem
 * "x > 5 or x < 3", so no stored key). Asked for a number that satisfies it,
 * the student said "5" and heard: "Right. $5$ isn't included since the
 * inequality is strict — but… anything just past it, like $6$, satisfies
 * $x > 5$. Nice. Since 6 is past 5, it checks out…" — praise for a wrong
 * value and credit for a "6" the student never said. `false_praise_opener`
 * needs a verified key; `detectPraiseContradiction`'s bare-denial branch reads
 * only sentences AFTER the opener's captured clause and wants a denial of the
 * form "isn't it / isn't right"; only the advisory LLM judge noticed.
 *
 * THREE LAYERS, deliberately separate:
 *
 *  1. `detectPraiseThenExclusion` — the text shape. Scoped to a student
 *     utterance that IS a bare value, and an exclusion clause whose subject
 *     is that same value.
 *
 *  2. `asksForSatisfyingValue` — did the tutor's open question ask for a
 *     value that satisfies / works / is a solution, with no negation?
 *
 *  3. `decidePraiseExclusion` — a NOTE for the next brain turn only when 1
 *     and 2 both hold and the exclusion is not scoped to one part of the
 *     problem. Everything else is advisory (a debug event only).
 *
 * THIS GUARD NEVER KILLS (review of the first cut, same day). The first cut
 * killed and re-asked the turn, and an independent run of it found the kill
 * firing on correct tutoring — with the question "Can you give me a number
 * that satisfies x > 5 or x < 3?":
 *     "6" → "Yes! 6 isn't in the gap between 3 and 5, so it's a solution."
 *     "2" → "Correct. 2 isn't in the excluded zone."
 *     "6" → "Right. 6 doesn't make it false."
 *     "6" → "Right — and notice 6 doesn't count as a boundary point."
 *     "2" → "Right. -2 doesn't work."      (the "2" inside "-2")
 * A false kill told the brain to REVERSE a correct affirmation and spent the
 * turn's single retry, which switches the other deterministic guards off for
 * the retry. So: the text is never interrupted; a detection plants a neutral
 * note ("you affirmed <value> and then said it is not included — decide which
 * is true, state one verdict") for the next brain turn, which costs nothing
 * when the detection is wrong. And the detector itself is narrowed to an
 * unmistakable exclusion of the student's value from the ANSWER SET:
 *   - "isn't included", "doesn't satisfy", "doesn't work", "isn't a
 *     solution", "is excluded", "doesn't count" (not "doesn't count as a …");
 *     the loose predicates ("isn't in the…", "isn't one of…", "doesn't
 *     make…", "is outside…") are gone — they are how a tutor says a value is
 *     NOT in the excluded part;
 *   - a clause whose object is itself negative (gap, excluded, boundary,
 *     false, zero, undefined…) is a negated negative: agreement;
 *   - the value must stand alone: never inside a signed or longer number.
 *
 * Why layer 2 gates the note. The shape alone is NOT always a contradiction:
 * "What is the boundary number?" → "5" → "Right. 5 isn't included, since the
 * inequality is strict." is correct tutoring — the affirmation is about the
 * boundary, the exclusion is an added fact. What makes the live turn
 * self-contradictory is that the question asked for a value that satisfies,
 * and the turn affirmed a value it then said does not.
 *
 * Pure; never throws.
 */
import { readOpener } from '@/lib/tutor/voice/affirm-opener';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

/** A bare value: a signed number, decimal, fraction, percent, or a simple
 *  expression with a digit in it ("2x", "x+1", "3/4"). No relation sign, no
 *  prose. */
const BARE_VALUE_RE = /^[-−+]?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*[/^*+\-−]\s*[a-z\d.]+)*[a-z]?%?$|^[-−+]?[a-z](?:\s*[/^*+\-−]\s*[a-z\d.]+)*\s*[/^*+\-−]\s*\d[a-z\d.]*$/i;

/**
 * The student's utterance as a bare value, normalised ("Five." → "5"), or
 * null when it is anything else (a relation, a sentence, filler).
 */
export function bareStudentValue(studentUtterance: string): string | null {
  const raw = spokenNumbersToDigits((studentUtterance || '').trim())
    .replace(/[$*_`]/g, '')
    .replace(/[.!?,;:\s]+$/g, '')
    .trim();
  if (!raw || raw.length > 16) return null;
  if (!/\d/.test(raw)) return null;
  if (!BARE_VALUE_RE.test(raw)) return null;
  return raw.toLowerCase().replace(/\s+/g, '').replace(/−/g, '-');
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&');
}

/** `value` as a standalone token: not part of a longer number, decimal,
 *  fraction or identifier ("5" must not match in "15", "5.5", "0.5", "x5",
 *  "2,500"), not a SIGNED number ("2" must not match in "-2") and not the
 *  right-hand side of an operation or relation ("x - 2", "x > 5"). */
function valueTokenSource(value: string): string {
  const spaced = value.split('').map(escapeRe).join('\\s*');
  return `(?<![\\w.]|\\d,|[-−+*/^<>≤≥]\\s?)${spaced}(?![\\w]|[.,]\\d|\\s*[/^]\\s*\\d)`;
}

const NEG_BE = "(?:is\\s+not|isn'?t)";
const NEG_DO = "(?:does\\s+not|doesn'?t)";
const ADV = '(?:actually\\s+|quite\\s+|really\\s+|even\\s+)?';

/** "<value> [itself] isn't included / doesn't satisfy / doesn't work / isn't
 *  a solution / is excluded / doesn't count". Nothing looser — see the header. */
function exclusionRe(value: string): RegExp {
  const v = valueTokenSource(value);
  return new RegExp(
    `${v}\\s+(?:itself\\s+|alone\\s+|actually\\s+|just\\s+|still\\s+)?(?:` +
      `${NEG_BE}\\s+${ADV}(?:included|a\\s+solution)\\b` +
      `|${NEG_DO}\\s+${ADV}(?:satisfy|work|count(?!\\s+as\\b))\\b` +
      `|is\\s+(?:actually\\s+|also\\s+)?excluded\\b` +
    `)`,
    'i',
  );
}

/** The exclusion's object is itself a NEGATIVE thing ("isn't included in the
 *  gap", "is excluded from the forbidden zone", "doesn't satisfy the excluded
 *  case"): a negated negative — the turn is agreeing with the student. */
const NEGATIVE_OBJECT_RE = /\b(?:gaps?|excluded|exclusion|removed|forbidden|boundar(?:y|ies)|false|zero|undefined|holes?)\b/i;

const READMIT_PREDICATE =
  '(?:satisf\\w+|works?|fits?|counts?|checks\\s+out|is\\s+(?:still\\s+|also\\s+)?(?:included|a\\s+solution|fine|valid|ok(?:ay)?|right|correct|in\\b)|makes?\\s)';
const READMIT_CONTRACTED =
  "(?:it|that)(?:'?s|\\s+is)\\s+(?:still\\s+|also\\s+)?(?:included|a\\s+solution|fine|valid|ok(?:ay)?|right|correct|in\\b)";

/** After the exclusion, the same value is re-admitted ("…doesn't satisfy
 *  x < 3, but it satisfies x ≥ 5, so it works", "…so it's a solution") — the
 *  exclusion was about one PART, and the praise stands.
 *  @param value  null ⇒ only the pronoun forms ("it", "that"). */
export function isReadmitted(after: string, value: string | null): boolean {
  const subject = value ? `(?:\\bit\\b|\\bthat\\b|${valueTokenSource(value)})` : '(?:\\bit\\b|\\bthat\\b)';
  if (new RegExp(
    `\\b(?:but|though|however|yet|still|so)\\b[^.!?]*?(?:` +
      `${subject}\\s+(?:does\\s+|still\\s+|also\\s+)*${READMIT_PREDICATE}` +
      `|\\b${READMIT_CONTRACTED}` +
    `)`,
    'i',
  ).test(after || '')) return true;
  return isReadmittedPlainly(after, value);
}

/**
 * Re-admission with NO conjunction (second review pass, 2026-10-04) — the
 * part-by-part explanation of a compound problem:
 *   "7 doesn't satisfy x < 3. It does satisfy x > 5, which is all we need."
 *   "2 doesn't satisfy x > 5 — it satisfies x < 3, and with or that's enough."
 *   "6 isn't a solution of x < 3; it is one of x > 5."
 * The subject (it / that / the value) must OPEN a clause, so "which number is
 * one that works?" is not read as one, and the predicate list is short on
 * purpose: satisfies / works / is a solution / is one.
 */
export function isReadmittedPlainly(after: string, value: string | null): boolean {
  const subject = value ? `(?:it\\b|that\\b|${valueTokenSource(value)})` : '(?:it\\b|that\\b)';
  return new RegExp(
    `(?:^|[.!?;:,—–…]|\\s-|\\b(?:and|because|since))\\s*${subject}\\s+(?:does\\s+|also\\s+|still\\s+)*` +
      `(?:satisf\\w+|works|is\\s+(?:also\\s+|still\\s+)?(?:a\\s+solution|one)\\b)`,
    'i',
  ).test(after || '');
}

/** A hypothetical / counterfactual exclusion denies nothing about this answer. */
const HYPOTHETICAL_RE = /\b(?:if|would(?:n'?t)?|were|suppose|imagine|had\s+(?:it|we|the)|unless)\b/i;

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

/**
 * The exclusion names WHAT the value is excluded from — one relation or one
 * part ("5 doesn't satisfy x < 3", "isn't in the first piece"). In a compound
 * problem that is a statement about a part, and the next sentence may
 * re-admit the value ("…but it satisfies x ≥ 5"). The orchestrator sees the
 * turn sentence by sentence and cannot wait for that sentence, so a
 * part-scoped exclusion never plants a note.
 */
const PART_SCOPE_RE =
  /[<>≤≥=]|\\(?:le|ge|leq|geq|lt|gt)\b|\b(?:less\s+than|greater\s+than|more\s+than|at\s+least|at\s+most|first|second|other|either|both|one|left|right|every|each|all|part|piece|half|condition|branch|side)\b/i;

/** The exclusion clause's own object: what follows it up to the first clause
 *  break or reason word. */
function exclusionObject(afterClause: string): string {
  return afterClause.split(/[,;:.!?—–…]|\s-\s|\b(?:since|because|as|so|but|though|and)\b/i)[0] ?? '';
}

export interface PraiseThenExclusion {
  /** The student's bare value, normalised. */
  value: string;
  /** The exclusion clause as matched in the tutor's text. */
  clause: string;
  /** The exclusion is from a named relation / part, not from the answer as a
   *  whole. Advisory only. */
  partScoped: boolean;
}

/**
 * The text shape only — see the module header for why this alone is advisory.
 * @param ackExclusion  passed through to the opener reader (acknowledgement
 *   phrases like "Good try." are not affirmations).
 */
export function detectPraiseThenExclusion(
  tutorText: string,
  studentUtterance: string,
  ackExclusion = true,
): PraiseThenExclusion | null {
  const value = bareStudentValue(studentUtterance);
  if (!value) return null;
  const cleaned = spokenNumbersToDigits(
    (tutorText || '').replace(/[*_`$]/g, '').replace(/\\[()]/g, '').replace(/[’‘]/g, "'").replace(/−/g, '-'),
  ).trim();
  if (!cleaned) return null;
  const parts = splitSentences(cleaned);
  if (parts.length === 0) return null;
  // The opener must be the turn's FIRST sentence: this is about the verdict
  // the student hears first.
  if (readOpener(parts[0], ackExclusion) !== 'affirm') return null;
  // Same sentence or the next.
  const window = parts.slice(0, 2);
  const re = exclusionRe(value);
  for (let i = 0; i < window.length; i++) {
    const s = window[i];
    const m = re.exec(s);
    if (!m) continue;
    if (HYPOTHETICAL_RE.test(s)) continue;
    const restOfSentence = s.slice(m.index + m[0].length);
    const object = exclusionObject(restOfSentence);
    // A negated negative is agreement, not an exclusion.
    if (NEGATIVE_OBJECT_RE.test(object)) continue;
    // Re-admission may land one sentence later than the exclusion.
    const after = restOfSentence + ' ' + parts.slice(i + 1, i + 2).join(' ');
    if (isReadmitted(after, value)) continue;
    return { value, clause: m[0].trim(), partScoped: PART_SCOPE_RE.test(object) };
  }
  return null;
}

/** The ask the student is answering: the last question sentence of the tutor
 *  turn, or — when the turn ends on an imperative ("Pick a value that
 *  works.") — its last sentence. */
function lastQuestion(tutorTurn: string): string {
  const cleaned = (tutorTurn || '').replace(/[*_`$]/g, ' ').trim();
  const qs = cleaned.match(/[^.!?]*\?/g);
  if (qs && qs.length > 0) return qs[qs.length - 1].trim();
  const parts = splitSentences(cleaned);
  return parts.length > 0 ? parts[parts.length - 1] : '';
}

/**
 * Second review pass (2026-10-04): any mention of "solution set", "a
 * solution", "satisfy"… counted as an ask for a satisfying value, so the note
 * was planted on CORRECT turns — "Where does the solution set start?" → "5" →
 * "Right. 5 isn't included, though…". The ask must now have the shape
 *   <give | pick | name | choose | tell me | what is | what's> …
 *   <a | any | one | another> <number | value | x>
 *   <that | which> <satisfies | works | makes … true | is a solution>
 * (or "… a number in the solution set", or "what / which number satisfies |
 * works | makes … true"). Anything else is advisory.
 */
const SATISFY_PREDICATE = '(?:satisf(?:y|ies)|works?|fits?|makes?\\s+[^.!?]*?\\btrue|is\\s+a\\s+solution)';
const SATISFY_ASK_RE = new RegExp(
  `\\b(?:give|pick|name|choose|tell\\s+me|what\\s+is|what['’]?s)\\b[^.!?]*?\\b(?:a|an|any|one|another|some)\\s+(?:number|value|x)(?:\\s+(?:of|for)\\s+\\w+)?\\s+` +
    `(?:(?:that|which)\\s+${SATISFY_PREDICATE}|in\\s+the\\s+solution(?:\\s+set)?)\\b` +
  `|\\b(?:what|which)\\s+(?:number|value)\\s+${SATISFY_PREDICATE}\\b`,
  'i',
);
const ASK_NEGATION_RE =
  /\b(?:not|never|no|none|except|excluded?|fails?|outside|wrong|incorrect|boundar(?:y|ies)|endpoints?|extraneous|starts?|edges?|begins?|where)\b|n['’]t\b/i;

/**
 * Did the tutor's open question ask for a value that SATISFIES — positively,
 * with no negation and no talk of the boundary? Reads only the last question
 * sentence of the prior tutor turn (the one the student is answering).
 */
export function asksForSatisfyingValue(tutorQuestionTurn: string): boolean {
  const q = lastQuestion(tutorQuestionTurn);
  if (!q) return false;
  if (ASK_NEGATION_RE.test(q)) return false;
  return SATISFY_ASK_RE.test(q);
}

export interface PraiseExclusionDecision {
  /** 'note' = advisory event AND a correction note for the next brain turn.
   *  There is no kill (see the header). */
  action: 'note' | 'advisory' | 'none';
  value: string | null;
  clause: string | null;
  reason: 'flag-off' | 'no-match' | 'satisfying-value-asked' | 'question-unknown-or-other' | 'part-scoped';
}

/**
 * @param enabled  TUTOR_PRAISE_EXCLUSION_KILL (the name predates the removal
 *   of the kill; it now switches the detection — event and note — on or off).
 * @param tutorQuestion  the tutor's PREVIOUS turn (the open question).
 */
export function decidePraiseExclusion(input: {
  enabled: boolean;
  tutorText: string;
  studentUtterance: string;
  tutorQuestion?: string | null;
  ackExclusion?: boolean;
}): PraiseExclusionDecision {
  if (input?.enabled !== true) return { action: 'none', value: null, clause: null, reason: 'flag-off' };
  const hit = detectPraiseThenExclusion(input.tutorText, input.studentUtterance, input.ackExclusion !== false);
  if (!hit) return { action: 'none', value: null, clause: null, reason: 'no-match' };
  if (hit.partScoped) return { action: 'advisory', value: hit.value, clause: hit.clause, reason: 'part-scoped' };
  if (!asksForSatisfyingValue(input.tutorQuestion ?? '')) {
    return { action: 'advisory', value: hit.value, clause: hit.clause, reason: 'question-unknown-or-other' };
  }
  return { action: 'note', value: hit.value, clause: hit.clause, reason: 'satisfying-value-asked' };
}

const PRAISE_EXCLUSION_NOTE_LEAD =
  '[correction note — not from the student] Your previous reply opened by affirming the student\'s answer';

/**
 * The note planted for the NEXT brain turn. Neutral on purpose: this module
 * cannot tell which half of the turn was the mistake (the affirmation or the
 * exclusion), so it asks the brain to decide and say one thing.
 */
export function buildPraiseExclusionNote(value: string): string {
  const v = (value || '').replace(/\s+/g, ' ').trim().slice(0, 24);
  return (
    `${PRAISE_EXCLUSION_NOTE_LEAD} "${v}" and then said ${v} is not included / does not satisfy. Both cannot be true. ` +
    `Silently decide which is true by checking ${v} against the problem, then open this turn by stating ONE clear verdict on ${v} plainly, in one short sentence, and continue. ` +
    `If your previous reply was in fact consistent, continue naturally and say nothing about it. ` +
    `Do not attribute the correction to the student: they did not point anything out, so never thank or credit them for catching it (no "good catch"). ` +
    `Never narrate this note or the act of checking — the student must only ever hear normal tutoring.`
  );
}

/** What the orchestrator remembers about the note it planted. */
export interface PraiseExclusionNoteRecord {
  note: string;
  /** Ordinal of the brain call during which the note was planted. */
  plantedCall: number;
  /** Problem + page it was planted under. */
  scope: { statement: string; epoch: number; pageKey: string };
}

/**
 * The note says "Your previous reply…", and bracketed turns (idle nudge,
 * cover, start-lesson) do not consume it — so without an expiry it could be
 * delivered several tutor turns later, about a reply that is no longer the
 * previous one. True when the slot still holds this record's note AND
 *   - the brain call now starting is later than the one immediately after
 *     the planting call, or
 *   - the active problem (statement or epoch) or the page has changed.
 * The caller then clears the slot and the record. Mirrors
 * relationStepNoteExpired (relation-step-note.ts). Never throws.
 */
export function praiseExclusionNoteExpired(input: {
  record: PraiseExclusionNoteRecord | null;
  pendingNote: string | null | undefined;
  /** Ordinal of the brain call now running. */
  call: number;
  now: { statement: string | null; epoch: number; pageKey: string };
}): boolean {
  try {
    const r = input?.record;
    if (!r || !input.pendingNote || input.pendingNote !== r.note) return false;
    if (input.call > r.plantedCall + 1) return true;
    const statement = typeof input.now?.statement === 'string' ? input.now.statement.trim() : '';
    return r.scope.statement.trim() !== statement || r.scope.epoch !== input.now.epoch || r.scope.pageKey !== input.now.pageKey;
  } catch {
    return false;
  }
}

/** Is `note` one built by `buildPraiseExclusionNote`? */
export function isPraiseExclusionNote(note: string | null | undefined): boolean {
  return typeof note === 'string' && note.startsWith(PRAISE_EXCLUSION_NOTE_LEAD);
}

/**
 * Should the orchestrator plant the note now?
 * Never over a pending note of any kind, and only for a 'note' decision.
 */
export function shouldPlantPraiseExclusionNote(input: {
  /** TUTOR_PRAISE_EXCLUSION_NOTE. */
  enabled: boolean;
  decision: PraiseExclusionDecision;
  pendingNote: string | null | undefined;
}): boolean {
  if (input?.enabled !== true) return false;
  if (input.decision?.action !== 'note' || !input.decision.value) return false;
  return !input.pendingNote;
}
