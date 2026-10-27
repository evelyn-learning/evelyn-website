// src/lib/tutor/orchestrator/advance-request.ts
/**
 * A student's request to move on in a lesson, read from their own words.
 *
 * WHY (lesson portal-fa3e2830, 2026-10-26): the student typed "can we move to
 * the next section?", "no move to the next section", "move on to the next
 * section", "skip", "move on to slope intercept" — and got "Got it, we'll
 * stay on this section", a menu of choices (the pace hint said to OFFER
 * "harder / skip / different topic"), a solved problem to redo, and the same
 * problem twice. The Skip BUTTON advances deterministically; typed words did
 * not. Three pieces here:
 *
 *  · `detectAdvanceRequest` — scope 'objective' for an explicit request for
 *    the next section / topic / objective, a named target ("move on to X"),
 *    or "skip"; scope 'onward' for a bare "move on" / "next" (no target —
 *    the brain moves on, without a menu, but the runtime does not jump).
 *  · `resolveObjectiveTarget` — the first segment of the NEXT objective (LO
 *    group), or of the objective the student named.
 *  · `pacingHintForCue` — an advance cue's hint says to move on now; a
 *    difficulty / pace cue keeps the offer of choices.
 *
 * Generic shapes only — no subject content. Pure; never throws.
 */
import { loGroupOf } from '../lesson-plan/context';

export interface AdvanceRequest {
  /** 'objective': jump to the next (or named) objective. 'onward': move on, no jump. */
  scope: 'objective' | 'onward';
  /** The objective the student named ("move on to X"), else null. */
  named: string | null;
  /** The clause that matched (telemetry). */
  matched: string;
}

const NEGATION_RE = /\b(?:don'?t|do\s+not|not|never|no\s+need\s+to|wait)\b|n't\b/i;
/** Leading fillers, including a bare "no" ("no, move to the next section"). */
const FILLER_RE = /^(?:(?:ok(?:ay)?|um+|uh+|so|yeah|yes|yep|no|nope|nah|alright|all\s+right|well|and|hey|please|oh|hmm+|now|then|actually|just)\b[\s,]*)+/i;
/** A request lead addressed to the tutor ("can we", "let's", "I want to"). */
const LEAD_RE = /^(?:(?:can|could|may|shall)\s+(?:we|i|you)\s+(?:please\s+)?|let'?s\s+|let\s+us\s+|i\s+(?:want|wanna|need|would\s+like)\s+to\s+|i'?d\s+like\s+to\s+|please\s+)/i;
const LEVEL_NOUN = String.raw`(?:section|topic|objective|part|lesson|unit|chapter|concept|skill|stage)`;
const MOVE_VERB = String.raw`(?:move\s+on|move|go\s+on|go|skip\s+ahead|skip|jump\s+ahead|jump|get\s+on|head)`;
const TAIL = String.raw`\s*(?:now|please|then)?\s*$`;

const NEXT_LEVEL_RE = new RegExp(String.raw`^(?:${MOVE_VERB}\s+(?:on\s*)?to\s+)?(?:the\s+)?next\s+${LEVEL_NOUN}\b` + TAIL, 'i');
const SKIP_RE = new RegExp(String.raw`^skip(?:\s+(?:ahead|forward|this|it|this\s+${LEVEL_NOUN}))?` + TAIL, 'i');
const NAMED_RE = new RegExp(String.raw`^(?:move\s+on|move|go\s+on|skip\s+ahead|skip|jump\s+ahead|jump)\s+(?:on\s*)?to\s+(?:the\s+)?(.+?)` + TAIL, 'i');
const ONWARD_RE = new RegExp(String.raw`^(?:move\s+on|keep\s+going|go\s+on|next)` + TAIL, 'i');
/** A named target that is really "the next one / problem / question". */
const NOT_A_TARGET_RE = /^(?:next|another|a\s+new|new)?\s*(?:one|problem|question|example|exercise)\b/i;

function clauses(text: string): string[] {
  return text
    .split(/(?<=[.!?;])\s+|[;\n]/)
    .map((c) => c.replace(/[.!?;,\s]+$/g, '').trim())
    .filter(Boolean);
}

function core(clause: string): string {
  return clause.replace(FILLER_RE, '').replace(LEAD_RE, '').replace(FILLER_RE, '').trim();
}

export function detectAdvanceRequest(text: string): AdvanceRequest | null {
  const t = typeof text === 'string' ? text.replace(/[’]/g, "'").trim() : '';
  if (!t || t.length > 200) return null;
  let onward: AdvanceRequest | null = null;
  for (const clause of clauses(t)) {
    if (NEGATION_RE.test(clause.replace(/^(?:no|nope|nah)\b[\s,]*/i, ''))) continue;
    const c = core(clause);
    if (!c) continue;
    if (NEXT_LEVEL_RE.test(c) || SKIP_RE.test(c)) return { scope: 'objective', named: null, matched: clause };
    const named = NAMED_RE.exec(c);
    if (named) {
      const target = named[1].trim();
      const words = target.split(/\s+/);
      if (!NOT_A_TARGET_RE.test(target) && !/[\d=<>+*/^]/.test(target) && words.length <= 6) {
        return { scope: 'objective', named: target, matched: clause };
      }
    }
    if (!onward && ONWARD_RE.test(c)) onward = { scope: 'onward', named: null, matched: clause };
  }
  return onward;
}

interface PlanShape {
  segments: ReadonlyArray<{ id: string; kind?: string; title?: string; offTopic?: boolean }>;
  los?: ReadonlyArray<{ id: string; description?: string }>;
}

const NAME_STOP = new Set(['the', 'and', 'of', 'a', 'an', 'to', 'in', 'on', 'for', 'with', 'from', 'form', 'part', 'section', 'topic', 'objective']);
const nameWords = (s: string): string[] =>
  (s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .map((w) => w.replace(/(?:ies)$/, 'y').replace(/(?<=[a-z]{3})s$/, ''))
    .filter((w) => w.length >= 3 && !NAME_STOP.has(w));

export type ObjectiveMove = { kind: 'move'; target: string } | { kind: 'already'; target: string };

/**
 * Where a request to move on lands.
 *
 * No name: the first on-topic segment of the next objective (LO group) after
 * the current one; the recap when no objective is left.
 *
 * A name ("move on to X"): only the CURRENT objective and the ones after it
 * are candidates — a request to move on never goes back. Words that every
 * objective carries are not distinctive and are left out of the match (unless
 * nothing else is left). The best candidate carrying at least half of the
 * named words wins; a tie goes to the current objective, then the earliest.
 * When the best is the current objective → `already` (stay and continue it).
 * Round 3 (portal-939d545b, 10-27): "move on to slope intercept form" on that
 * very objective went back to objective 1 — "slope" was in every objective
 * and the current one was never scored.
 *
 * Null when nothing resolves — the brain handles it.
 */
export function resolveObjectiveMove(plan: PlanShape, currentSegmentId: string, named: string | null): ObjectiveMove | null {
  const segs = plan.segments.filter((s) => s.offTopic !== true);
  const groups: string[] = [];
  for (const s of segs) {
    const g = loGroupOf(s.id);
    if (g === 'intro' || g === 'recap') continue;
    if (!groups.includes(g)) groups.push(g);
  }
  const firstOf = (g: string): string | null => segs.find((s) => loGroupOf(s.id) === g)?.id ?? null;
  const current = loGroupOf(currentSegmentId || '');
  const curIdx = groups.indexOf(current);
  if (named) {
    const textOf = (g: string): Set<string> => {
      const lo = plan.los?.find((l) => l.id === g);
      return new Set(nameWords([lo?.description ?? '', ...segs.filter((s) => loGroupOf(s.id) === g).map((s) => s.title ?? '')].join(' ')));
    };
    const sets = new Map(groups.map((g) => [g, textOf(g)] as const));
    const asked = [...new Set(nameWords(named))];
    if (!asked.length) return null;
    const distinctive = asked.filter((w) => !groups.every((g) => sets.get(g)!.has(w)));
    const want = distinctive.length ? distinctive : asked;
    const candidates = curIdx >= 0 ? groups.slice(curIdx) : current === 'intro' ? groups : [];
    let best: { g: string; score: number } | null = null;
    for (const g of candidates) {
      const have = sets.get(g)!;
      const score = want.filter((w) => have.has(w)).length / want.length;
      if (score >= 0.5 && (!best || score > best.score)) best = { g, score };
    }
    if (!best) return null;
    if (best.g === current) return { kind: 'already', target: currentSegmentId };
    const target = firstOf(best.g);
    return target ? { kind: 'move', target } : null;
  }
  const next = current === 'intro' ? groups[0] : curIdx >= 0 ? groups[curIdx + 1] : undefined;
  const target = next ? firstOf(next) : current !== 'recap' ? segs.find((s) => s.id === 'recap' || s.kind === 'recap')?.id ?? null : null;
  return target ? { kind: 'move', target } : null;
}

/** The segment to move to, or null (no move: unresolved, or already there). */
export function resolveObjectiveTarget(plan: PlanShape, currentSegmentId: string, named: string | null): string | null {
  const m = resolveObjectiveMove(plan, currentSegmentId, named);
  return m?.kind === 'move' ? m.target : null;
}

/** The fact the brain reads when the student named the objective already in progress. */
export function describeAlreadyOnObjective(input: { named: string; target: string; objective?: string }): string {
  const objective = input.objective ? ` ("${input.objective.replace(/\s+/g, ' ').trim().slice(0, 160)}")` : '';
  return (
    `[Lesson: the student asked to move on to "${input.named.slice(0, 60)}", and the lesson is ALREADY on that objective${objective}, segment "${input.target}". ` +
    `Say so in one short clause and continue this objective from where it is. Never go back to an earlier objective. ` +
    `Do NOT call advance_lesson. Do not offer choices, and do not re-pose or re-check a problem the student has already solved.]`
  );
}

/** A turn whose transcript carries a runtime advance fact (typed request or
 *  Skip button): the student's words are navigation, not an answer — nothing
 *  on it is judged against the previous question. */
export function isAutoAdvancedTurn(transcript: string): boolean {
  return /\[Lesson auto-advanced:|\[Lesson: the student asked to move on/.test(transcript ?? '');
}

/** The fact the brain reads on a turn the runtime already advanced. */
export function describeTypedAdvance(input: { target: string; kind?: string; objective?: string }): string {
  const kind = input.kind ? ` (a ${input.kind} segment)` : '';
  const objective = input.objective ? `, the start of the objective "${input.objective.replace(/\s+/g, ' ').trim().slice(0, 160)}"` : '';
  return (
    `[Lesson auto-advanced: the student asked to move on, and the lesson pointer has ALREADY moved to segment "${input.target}"${kind}${objective}. ` +
    `If their message also answers your last question, give the verdict in one short sentence first. ` +
    `Then say plainly that you are moving on to it — never say you are staying — introduce THAT segment briefly and pose its first question or problem. ` +
    `Do NOT call advance_lesson — the advance is already done. ` +
    `Do not offer choices, and do not re-pose or re-check a problem the student has already solved.]`
  );
}

/** An advance cue (skip / next / move on) as opposed to a difficulty or pace cue. */
export function isAdvanceCue(cue: string | null | undefined): boolean {
  return !!cue && /\b(?:skip|next|move\s+on|keep\s+going)\b/i.test(cue);
}

export const ADVANCE_CUE_HINT =
  'the student has just asked, in their own words, to move on — do it now: go to what comes next, with no choices or menu, ' +
  'and never re-pose or re-check a problem they have already solved';

export const DIFFICULTY_CUE_HINT =
  'the student has just told you in their own words that this pace or level is not right for them — verbally offer "harder / skip / different topic" immediately';

/** The pacing hint for a student cue. */
export function pacingHintForCue(cue: string): string {
  return isAdvanceCue(cue) ? ADVANCE_CUE_HINT : DIFFICULTY_CUE_HINT;
}

/** The overlong-segment note's "finish first" step, and its replacement on a
 *  turn where the student asked to move on. */
export const OVERLONG_FINISH_FIRST =
  'First finish the problem in play — give the student the verdict on what they just said and close that problem out. Then move the lesson forward: ';
export const OVERLONG_ADVANCE_NOW =
  'The student asked to move on: move the lesson forward now — do not finish, re-pose or re-check the problem in play first: ';

export function overlongNoteForTurn(note: string, studentAskedToMoveOn: boolean): string {
  return studentAskedToMoveOn ? note.replace(OVERLONG_FINISH_FIRST, OVERLONG_ADVANCE_NOW) : note;
}
