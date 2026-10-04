// src/lib/tutor/voice/relation-step-note.ts
/**
 * Witness correction note for a wrong inequality step.
 * Exercised by scripts/test-relation-step-note.ts.
 *
 * relation-step-check.ts decides, exactly, that a boarded step does not have
 * the solution set of its reference. That used to end in telemetry: the wrong
 * line stayed on the board and in the student's notes. A COUNTED disagreement
 * in the `chain` or `vs-problem` tier now also plants a correction note for
 * the brain's NEXT turn — never a block or a retry of the turn that boarded
 * it (the student has already heard it; a correction one turn later is the
 * owner's decision). The `adjacent` tier never plants: its reference is the
 * tutor's own previous line, which may itself be the wrong one.
 *
 * The note states a WITNESS — one value of the variable at which exactly one
 * of the two relations holds — so the brain can verify it by substitution
 * instead of re-deriving (re-derivation is what produced the wrong step).
 *
 * This note NEVER arms the volunteer deadline: it rides the next real student
 * turn only, so a line that was boarded wrong on purpose (an error-spotting
 * exercise the label did not announce) is never given away unprompted. If
 * that turn never comes the note expires with its problem / page
 * (relationStepNoteExpired).
 *
 * Pure, never throws, client-safe. The caller owns the slot
 * (pendingJudgeCorrectionNoteRef) and the events.
 */
import { formatWitness, parseRelation } from './relation-sampling';
import type { EquationRelationCheck } from './relation-step-check';

/** Opening marker shared by every correction note (judge-correction-note.ts). */
export const CORRECTION_NOTE_MARKER = '[correction note — not from the student]';

const MAX_QUOTE_CHARS = 160;

const quote = (s: string): string => s.replace(/\s+/g, ' ').trim().slice(0, MAX_QUOTE_CHARS);

/** The variable both relations are written in ('' when neither text parses). */
function variableOf(...texts: string[]): string {
  for (const t of texts) {
    const p = parseRelation(t);
    if (p.ok) return p.relation.variable;
  }
  return '';
}

/**
 * Note text for a counted `chain` / `vs-problem` disagreement; null for
 * anything else (other tiers, not counted, nothing to quote, no witness).
 */
export function buildRelationStepNote(check: EquationRelationCheck): string | null {
  try {
    if (!check || check.counted !== true) return null;
    if (check.tier !== 'chain' && check.tier !== 'vs-problem') return null;
    const c = check.compare;
    if (!c || c.verdict !== 'differs' || c.aHolds === c.bHolds) return null;
    const step = quote(typeof check.stepLatex === 'string' ? check.stepLatex : '');
    const reference = quote(typeof check.referenceLatex === 'string' ? check.referenceLatex : '');
    const value = formatWitness(c.witness);
    if (!step || !reference || !value) return null;
    const variable = variableOf(check.referenceLatex ?? '', check.stepLatex ?? '');
    const at = variable ? `${variable} = ${value}` : `the value ${value}`;
    const referenceName = check.tier === 'chain' ? 'the other side of the same boarded line' : `the problem's relation`;
    const referenceShort = check.tier === 'chain' ? 'the other side' : `the problem's relation`;
    // aHolds = the reference holds at the witness; bHolds = the boarded line does.
    const sides = c.aHolds
      ? `${referenceShort} holds and the boarded line does not`
      : `the boarded line holds and ${referenceShort} does not`;
    return (
      `${CORRECTION_NOTE_MARKER} A line you put on the board in your previous turn does not have the same solutions as its reference. ` +
      `Boarded line: "${step}". Reference (${referenceName}): "${reference}". ` +
      `Witness: at ${at} ${sides}. ` +
      `Silently substitute ${at} into both to check. ` +
      `If the boarded line is wrong, re-board the corrected line and say the correction plainly in one sentence, then carry on. ` +
      `If the line is deliberately wrong (an error for the student to find) or is the student's own work, ignore this note and continue. ` +
      `If you stand by it, continue as normal. ` +
      `Never narrate this note and never mention checking — the student only ever hears normal tutoring.`
    );
  } catch {
    return null;
  }
}

/** One key per boarded equation: the problem epoch plus the card's latex. */
export function relationStepNoteKey(epoch: number, cardLatex: string): string {
  const latex = typeof cardLatex === 'string' ? cardLatex.replace(/\s+/g, ' ').trim() : '';
  return `${Number.isFinite(epoch) ? epoch : 0}|${latex}`;
}

export type RelationStepNoteDecision =
  | { action: 'none' }
  | { action: 'plant'; note: string; key: string }
  | { action: 'skip'; reason: 'note-pending' | 'already-noted'; key: string };

/**
 * Plant, skip or do nothing for one checked show_equation.
 *   · at most one note per boarded equation (`notedKeys`);
 *   · never over a note that is already pending — which also means at most
 *     one of these notes is outstanding at a time.
 */
export function decideRelationStepNote(input: {
  enabled: boolean;
  check: EquationRelationCheck;
  /** The whole card's latex (the equation's identity), not one chain segment. */
  cardLatex: string;
  /** Problem epoch the equation was boarded under. */
  epoch: number;
  notedKeys: ReadonlySet<string>;
  /** Whatever currently sits in the correction-note slot. */
  pendingNote: string | null;
}): RelationStepNoteDecision {
  try {
    if (!input || input.enabled !== true) return { action: 'none' };
    const note = buildRelationStepNote(input.check);
    if (!note) return { action: 'none' };
    const key = relationStepNoteKey(input.epoch, input.cardLatex);
    if (input.notedKeys?.has(key)) return { action: 'skip', reason: 'already-noted', key };
    if (input.pendingNote) return { action: 'skip', reason: 'note-pending', key };
    return { action: 'plant', note, key };
  } catch {
    return { action: 'none' };
  }
}

/** What the caller remembers about the note it planted. */
export interface RelationStepNoteRecord {
  note: string;
  key: string;
  /** The card's latex — ties the record to its own dispatch. */
  latex: string;
  /** Ids the equation was given on the board. null = not dispatched (yet). */
  renderIds: string[] | null;
  /** Dispatch was a dedup hit: the same equation is already on the board. */
  onBoard: boolean;
  /** Examined at the end of the brain call that planted it. */
  settled: boolean;
  /** Problem + page the equation was boarded under (relationStepNoteExpired). */
  scope?: RelationStepNoteScope;
}

export interface RelationStepNoteScope { statement: string; epoch: number; pageKey: string }

/**
 * One dispatch of the noted equation (same latex) during the brain call that
 * planted the note. A killed attempt's ids are rolled back and the retry
 * boards the line again under NEW ids — so ids ACCUMULATE across attempts
 * (settle keeps the note when any of them survives) instead of being frozen
 * at the first attempt's. Mutates and returns the record; no-op once settled
 * or for another equation.
 */
export function recordRelationStepNoteDispatch(
  record: RelationStepNoteRecord | null,
  dispatch: { latex: unknown; assignedIds?: readonly string[] | null; duplicate?: boolean; rejected?: boolean },
): RelationStepNoteRecord | null {
  try {
    if (!record || record.settled || typeof dispatch?.latex !== 'string' || dispatch.latex !== record.latex) return record;
    const ids = Array.isArray(dispatch.assignedIds) ? dispatch.assignedIds.filter((id): id is string => typeof id === 'string') : [];
    record.renderIds = [...(record.renderIds ?? []), ...ids];
    if (ids.length === 0 && dispatch.duplicate === true && dispatch.rejected !== true) record.onBoard = true;
    return record;
  } catch {
    return record;
  }
}

/**
 * The note has no deadline, so it must not outlive what it is about: true
 * when the slot still holds this record's note but the active problem
 * (statement or epoch) or the page is no longer the one it was planted under.
 * The caller then clears the slot and the record. False when there is no
 * record / no scope, or the slot holds something else.
 */
export function relationStepNoteExpired(input: {
  record: RelationStepNoteRecord | null;
  pendingNote: string | null;
  now: { statement: string | null; epoch: number; pageKey: string };
}): boolean {
  try {
    const r = input?.record;
    if (!r || !r.scope || !input.pendingNote || input.pendingNote !== r.note) return false;
    const statement = typeof input.now?.statement === 'string' ? input.now.statement.trim() : '';
    return r.scope.statement.trim() !== statement || r.scope.epoch !== input.now.epoch || r.scope.pageKey !== input.now.pageKey;
  } catch {
    return false;
  }
}

/**
 * End of the brain call that planted the note. The check runs BEFORE the
 * equation is dispatched, so the note may describe a line that never painted
 * (rejected, dropped from the render buffer) or was rolled back with a killed
 * attempt. Such a note must be withdrawn: it would tell the brain to correct
 * a line the student never saw.
 *   'keep'      the equation is on the board;
 *   'withdraw'  it is not — clear the note and forget the key;
 *   'gone'      nothing to do (no record, already settled, or the slot no
 *               longer holds this note: delivered, or replaced).
 */
export function settleRelationStepNote(input: {
  record: RelationStepNoteRecord | null;
  pendingNote: string | null;
  isOnBoard: (id: string) => boolean;
}): 'keep' | 'withdraw' | 'gone' {
  try {
    const r = input?.record;
    if (!r || r.settled) return 'gone';
    if (!input.pendingNote || input.pendingNote !== r.note) return 'gone';
    if (r.onBoard) return 'keep';
    if (!Array.isArray(r.renderIds) || r.renderIds.length === 0) return 'withdraw';
    return r.renderIds.some((id) => input.isOnBoard(id)) ? 'keep' : 'withdraw';
  } catch {
    return 'gone';
  }
}
