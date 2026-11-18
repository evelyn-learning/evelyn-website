/**
 * Tutor brain v2 — Task 7p: a short line in the learner's language under question cards and rule notes, for a beginner.
 *
 * Mic test 4 (embed-1795028886172, flag 5c): the testers were beginners who may not read the English on the board. Sentence cards
 * already carry a gloss in the learner's language (sentence-cards.ts); question cards (<board problem>) and rule notes (<board
 * note>) did not. In a spoken lesson that teaches a language through the learner's own language, while the working level is
 * beginner (or not known yet):
 *  1. the facts ask for gloss="…" on those two blocks (CARD_GLOSS_ASK): the question in the learner's language, one line; the
 *     rule's meaning, one short line. A facts line, not a session-part section: it follows the level at each turn, and a lesson
 *     above beginner, or any other lesson, sees nothing new (the session part and the tool list are unchanged everywhere);
 *  2. the gloss rides on the card (`gloss` on show_problem / annotate), kept only under the same gate at that turn and dropped
 *     otherwise (CARD_GLOSS_SHOW); the board draws it under the card in the sentence card's gloss style (CardGloss.tsx);
 *  3. being an attribute, it is never in the words heard, in the card's statement or note text (the ask, the spoken copy), or
 *     in the board record the model and the duplicate checks read;
 *  4. a question card put up without one: the next turn's facts say so (CARD_GLOSS_REMIND). No runtime translation.
 * Keyed on the session's languages and the working level, never on a partner. Pure, client-safe.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { languageNameOf } from '../voice/language-request';
import { boardBlocksIn } from './board-inline';
import { discussionOf } from './discussion';
import { v2LevelCheckOn, v2LevelCheckOver } from './working-level';
import type { V2Session, V2State } from './types';

const base = (code: string) => code.toLowerCase().split(/[-_]/)[0]!;

/** A spoken taught lesson whose teaching language differs from the learner's own (the second teaching language). */
export function v2CardGlossOn(session: V2Session): boolean {
  const l = session.languages ?? [];
  return session.mode === 'voice' && l.length >= 2 && base(l[0]!) !== base(l[1]!) && !discussionOf(session.plan) && !session.homework && !session.homeworkSheet;
}

/** The working level at this turn is the beginner band: beginner, or not known yet. A level check that ended without a level
 *  pitches the lesson at intermediate (working-level.ts facts), and the gloss follows that pitch. */
export function v2GlossLevelOn(session: V2Session, state: V2State, heard: string | null | undefined): boolean {
  const wl = state.workingLevel;
  if (wl) return wl.level === 'beginner';
  return !(v2LevelCheckOn(session) && v2LevelCheckOver(session, state, heard));
}

/** Longer than this, a gloss is no short line: it is dropped rather than cut (the board must not be overloaded). */
export const V2_GLOSS_MAX_CHARS = 100;

/** A gloss as the card carries it: its first line, spaces closed; null when empty or too long. */
export function v2CleanGloss(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const line = (raw.split(/\r?\n/).map((l) => l.trim()).find(Boolean) ?? '').replace(/\s+/g, ' ');
  return line && line.length <= V2_GLOSS_MAX_CHARS ? line : null;
}

const textOf = (m: Anthropic.MessageParam) => (typeof m.content === 'string' ? m.content : m.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '));

const flat = (t: string) => t.replace(/\s+/g, ' ').trim();

/** The last reply put up a question card (a problem block) without a gloss. Fix round 1 (m5): a card the board refused is not
 *  counted (`refused`: the turn's "not painted" list, state.boardProblems, as `problem "<its first 60 characters>": why`), nor one
 *  the board pointed back at because an earlier reply's card with a gloss already holds it. */
export function v2LastQuestionUnglossed(history: V2State['history'], refused: readonly string[] = []): boolean {
  const at = history.map((m) => m.role).lastIndexOf('assistant');
  if (at < 0) return false;
  const earlierGlossed = new Set(history.slice(0, at).filter((m) => m.role === 'assistant').flatMap((m) => boardBlocksIn(textOf(m))).filter((b) => b.kind === 'problem' && b.attrs.gloss?.trim()).map((b) => flat(b.body)));
  return boardBlocksIn(textOf(history[at]!)).some((b) => b.kind === 'problem' && !b.attrs.gloss?.trim()
    && !refused.some((r) => r.startsWith(`problem "${flat(b.body).slice(0, 60)}"`)) && !earlierGlossed.has(flat(b.body)));
}

/** The facts lines (such lessons at the beginner level only). */
export function v2CardGlossFacts(session: V2Session, state: V2State, heard: string | null | undefined, opts: { ask: boolean; remind: boolean }): string[] {
  if (!opts.ask || !v2CardGlossOn(session) || !v2GlossLevelOn(session, state, heard)) return [];
  const S = languageNameOf(base(session.languages![1]!));
  return [
    `cards in ${S} (the learner is at the beginner level${state.workingLevel ? '' : ', or it is not known yet'}): a question card carries gloss="…", the question in ${S}, one line of at most about 40 characters or 12 words: <board problem gloss="the question in ${S}">the question</board>. A note that states a rule carries one too, one short line in ${S} on what the rule means, not a translation of every line: <board note gloss="what the rule means">…</board>. Inside a gloss, quote with 「」, never with a double quote; no other card gets one. A gloss is only read on the board: it is never said aloud`,
    ...(opts.remind && v2LastQuestionUnglossed(state.history, state.boardProblems ?? []) ? [`your last question card had no gloss: at this level each question card carries one`] : []),
  ];
}
