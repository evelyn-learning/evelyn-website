/**
 * Homework problem ledger (2026-10-19, GreenApple T7).
 *
 * Why: in 6 of 13 scripted homework sessions (2026-10-14) the tutor went back
 * to a problem the student had already solved, asked whether they were ready
 * for it, or called it unfinished when closing. The `<homework_session>`
 * block carried the problem list and a `current` pointer that only moves when
 * the brain calls set_current_problem — nothing recorded that a problem was
 * DONE, so "done" lived only in the model's reading of the conversation, and
 * a later message that mentioned an earlier problem (or a lagging pointer)
 * pulled it back.
 *
 * The ledger is a list of SOLVED problem positions (1-based list positions,
 * the same unit as `homework.current`). It is written by one deterministic
 * rule from the engine's own answer check — never from the tutor's words:
 * a HIGH-confidence check that found the student's message CORRECT and named
 * the listed problem whose complete final answer it states
 * (verdict-precheck.ts `solved_problem` → `PublicVerdictPrecheck.solvedProblem`).
 * Nothing ever moves a problem back to open (a student re-stating a wrong
 * value for a solved problem does not unsolve it).
 *
 * The browser keeps the list for the session and sends it with `homework`
 * every turn (the same durability contract as `current`); the server renders
 * it into `<homework_session>` (claude-brain.ts `formatHomeworkSessionBlock`)
 * for partners on TUTOR_NO_REVEAL_LEDGER_PARTNERS.
 *
 * Pure, browser-safe. `npx tsx scripts/test-no-reveal-ledger.ts`.
 */

/** The fields of a public pre-check the ledger reads (structural, so this
 *  module does not import the pre-check). */
export interface LedgerCheck {
  answers: string;
  verdict: string;
  confidence: string;
  solvedProblem?: number;
  solvedProblems?: number[];
}

/** The problem position a check proves solved, or null. */
export function solvedPositionFromCheck(p: LedgerCheck | null | undefined, total: number): number | null {
  if (!p || p.confidence !== 'high' || p.verdict !== 'correct' || p.answers === 'neither') return null;
  const n = p.solvedProblem;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > total) return null;
  return n;
}

/**
 * 2026-10-15 (GAC staging v5): EVERY position a check proves solved. One
 * message can complete several problems ("<one answer> and <another>"), and
 * a message that is partly right can still complete one of them, so a
 * high-confidence PARTLY_CORRECT check counts too (the check lists only
 * problems whose complete answer is right). [] when none.
 */
export function solvedPositionsFromCheck(p: LedgerCheck | null | undefined, total: number): number[] {
  if (!p || p.confidence !== 'high' || p.answers === 'neither') return [];
  if (p.verdict !== 'correct' && p.verdict !== 'partly_correct') return [];
  const list = p.solvedProblems ?? (p.solvedProblem !== undefined ? [p.solvedProblem] : []);
  return [...new Set(list.filter((n) => Number.isInteger(n) && n >= 1 && n <= total))].sort((a, b) => a - b);
}

/** `solved` with `pos` added (sorted, unique, in range). */
export function recordSolved(solved: readonly number[], pos: number | null, total: number): number[] {
  const out = new Set(solved.filter((n) => Number.isInteger(n) && n >= 1 && n <= total));
  if (pos !== null && Number.isInteger(pos) && pos >= 1 && pos <= total) out.add(pos);
  return [...out].sort((a, b) => a - b);
}

/** A `solved` list that came over the wire, or undefined when it is not one.
 *  Out-of-range entries make the whole list unusable (fail closed). */
export function sanitizeSolvedPositions(raw: unknown, total: number): number[] | undefined {
  if (!Array.isArray(raw) || raw.length > 25) return undefined;
  const out = new Set<number>();
  for (const v of raw) {
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > total) return undefined;
    out.add(v);
  }
  return [...out].sort((a, b) => a - b);
}

/** The first OPEN position at or after `from` (wrapping), or null when all are solved. */
export function nextOpenPosition(total: number, solved: readonly number[], from = 1): number | null {
  const done = new Set(solved);
  for (let k = 0; k < total; k++) {
    const pos = ((from - 1 + k) % total) + 1;
    if (!done.has(pos)) return pos;
  }
  return null;
}

export const LEDGER_SOLVED = '[SOLVED]';
export const LEDGER_OPEN = '[OPEN]';

/** A question unrelated to the homework and its subject is not answered at
 *  all — the redirect alone. Generic. */
export const OFF_TOPIC_NOT_ANSWERED =
  'A question within the subject, or about why the subject matters, is welcome even when it is not one of these problems: give a short helpful answer or guide them, and never call it outside the session. Only a question unrelated to the subject itself is not answered — not briefly, and not as an aside or in passing while steering back: say in a few words that it is outside this session, then return to the work.';

/** A problem the student adds mid-session is taught like the listed ones. */
export const EXTRA_PROBLEM_SAME_RULES =
  'A new problem or question within the subject that the student brings up during the session is taught like the listed ones: help with it, guiding them one step at a time, and never work it to its result for them. Asked to check their answer to it, say whether it is right; when it is not, do not give the right one or the working that reaches it — name the step to look at again and ask them to redo it. When the student asks to stop, wrap up at once: do not finish a problem or state a step first. A one-word sign-off on its own, such as end, stop, done or bye, is a request to stop.';

/** Nothing about the student is kept between sessions. */
export const PERSONAL_DETAILS_RULE =
  'You keep nothing about the student between sessions: never say you will remember them or anything they tell you. Do not repeat back personal details such as a full name, school, address or contact details; if they share them, say kindly that they do not need to share personal details here, then carry on.';

/** Rules the brain is given with the ledger. Generic: no subject content. */
export const HOMEWORK_LEDGER_RULES =
  `- The ${LEDGER_SOLVED} / ${LEDGER_OPEN} mark beside each problem is the session's record, kept by the software from independent checks of the student's answers. Trust it over your own memory of the conversation.\n` +
  `- A ${LEDGER_SOLVED} problem is finished. Do not go back to it, re-offer it, ask whether they are ready for it, or ask for anything more on it, unless the student asks to return to it. If the student gives an answer to a ${LEDGER_SOLVED} problem again, say in a few words that it is already done and carry on with the next ${LEDGER_OPEN} problem.\n` +
  // 2026-10-15 staging (varied run): doubting a solved answer with a wrong
  // alternative reopened the problem from its first step.
  `- If the student doubts a ${LEDGER_SOLVED} problem or offers a different answer to it, their earlier answer stands: say so briefly, with a short reason, and do not reopen it or ask them to work it again — unless they ask to go through it again.\n` +
  `- When every problem is ${LEDGER_SOLVED}, the homework is done: say so, and offer to stop or to look at something else. Do not invent work left on these problems.\n` +
  `- When you close, wrap up or summarise: name each ${LEDGER_SOLVED} problem as done and only ${LEDGER_OPEN} ones as left for next time. Anything the student brought up during the session that is not on this list is not one of these problems: never give it one of their numbers — mention it separately, as their extra question.\n` +
  // 2026-10-15 staging: an unrelated trivia question was answered "by the way"
  // in two of thirteen sessions while the reply steered back.
  `- ${OFF_TOPIC_NOT_ANSWERED}\n` +
  // 2026-10-15 staging: a new problem the student added mid-session was worked
  // to its result for them in three of thirteen sessions ("check my answer").
  `- ${EXTRA_PROBLEM_SAME_RULES}\n` +
  // 2026-10-15 staging (varied run): told their full name and school, the
  // tutor said it would keep that in mind and used the name.
  `- ${PERSONAL_DETAILS_RULE}\n`;

/** The problem lines and the "Current" line of `<homework_session>` with the
 *  ledger marks. */
export function formatLedgerProblemLines(
  problems: ReadonlyArray<{ n: number; text: string }>,
  current: number,
  solved: readonly number[],
): { lines: string; currentLine: string } {
  const total = problems.length;
  const done = new Set(solved);
  const lines = problems.map((p, i) => `${p.n}. ${done.has(i + 1) ? LEDGER_SOLVED : LEDGER_OPEN} ${p.text}`).join('\n');
  const label = (pos: number) => problems[pos - 1]?.n ?? pos;
  const open = nextOpenPosition(total, solved, current);
  let currentLine: string;
  if (open === null) {
    currentLine = `All ${total} problem${total === 1 ? ' is' : 's are'} ${LEDGER_SOLVED}.`;
  } else if (done.has(current)) {
    currentLine = `Current: Problem ${label(current)} is ${LEDGER_SOLVED}; the next ${LEDGER_OPEN} problem is Problem ${label(open)} (${open} of ${total}).`;
  } else {
    currentLine = `Current: Problem ${label(current)} (${current} of ${total}), ${LEDGER_OPEN}.`;
  }
  return { lines, currentLine };
}

/**
 * The per-turn reminder that sits next to the student's message (the
 * `<homework_session>` block sits far above it, and in the 2026-10-19 replay
 * the reply still followed its own last question about a solved problem in
 * a few runs). '' until a problem is solved. Generic wording.
 */
export function formatProblemLedgerBlock(
  problems: ReadonlyArray<{ n: number; text: string }>,
  solved: readonly number[],
): string {
  const done = solved.filter((pos) => pos >= 1 && pos <= problems.length);
  if (!problems.length || !done.length) return '';
  const status = problems.map((p, i) => `Problem ${p.n} ${done.includes(i + 1) ? LEDGER_SOLVED : LEDGER_OPEN}`).join(', ');
  const all = done.length === problems.length;
  return '<problem_ledger>\n'
    + `Recorded by the software from checked answers: ${status}.${all ? ' Every one of the student\'s problems is solved.' : ''}\n`
    + `In this reply, do not ask about, re-offer, or call unfinished any ${LEDGER_SOLVED} problem — not by its number, and not by asking for a step, a part or a check of it — unless the student has just asked to go back to it. If your last question was about a ${LEDGER_SOLVED} problem, drop that question.\n`
    + `${OFF_TOPIC_NOT_ANSWERED}\n`
    + '</problem_ledger>\n\n';
}

/**
 * The ledger as it stood when the page went away: the `solved=[…]` list of
 * the LAST `homework_problem_solved` debug event the session persisted (the
 * browser emits one each time it records a problem). Read by the session
 * read (session-usage GET) so a resumed page starts from it. No model call.
 * [] when there is none or it cannot be read.
 */
export function homeworkSolvedFromDebugEvents(events: ReadonlyArray<{ type?: unknown; message?: unknown }> | null | undefined): number[] {
  if (!Array.isArray(events)) return [];
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e?.type !== 'homework_problem_solved') continue;
    const m = /solved=\[([\d,\s]*)\]/.exec(String(e.message ?? ''));
    if (!m) continue;
    const list = m[1].split(',').map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n >= 1 && n <= 25);
    return [...new Set(list)].sort((a, b) => a - b);
  }
  return [];
}
