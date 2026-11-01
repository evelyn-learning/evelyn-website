// src/lib/tutor/whiteboard/deferred-page-flush.ts
/**
 * Should the deferred segment-advance newPage be prepended to this batch?
 *
 * WHY: a segment advance defers its newPage ("Hook: Graph linear
 * inequalities…") until a batch with fresh teaching content arrives. The
 * flush prepended it unconditionally — also when that same batch had already
 * opened a page of its own (page-grouping's auto_new_page for the student's
 * problem, or a brain newPage). Result: [newPage(deferred), newPage(own),
 * content] — an empty page titled after the segment, in front of the page the
 * content actually landed on.
 *
 * Rule: a page that would receive no content before the next newPage is never
 * emitted. If the batch reaches a newPage before any content, that page — the
 * one titled for the content that follows — is kept and the deferred one is
 * dropped. Content before the batch's first newPage (or no newPage at all)
 * means the deferred page receives that content: prepend, as before.
 *
 * Exception — the batch's own page is a page-grouping CONTINUATION page
 * ("… (cont.)", `isContinuation`, parent = the previous page). That page
 * belongs to the PREVIOUS segment; keeping it would land the new segment's
 * content on a continuation of the old one. There the deferred (segment)
 * page is kept and the continuation page is the one dropped.
 *
 * Exception — the deferred page is an AUTHORED fixed-script part page ("Part
 * 3 · Level check", GDI run 4): it is the page the plan's author put there,
 * and dropping it lost the level-check and summary pages whenever the batch
 * that flushed it also carried a page-grouping break (a held topic-shift
 * mark, a segment-advance break). The authored page is kept and the batch's
 * own page dropped, as for a continuation page.
 */
export type DeferredPageFlushReason = 'flag-off' | 'no-own-page' | 'content-before-own-page' | 'batch-opens-own-page' | 'own-page-is-continuation' | 'deferred-page-is-authored';

/** Actions that put something on a page. Everything else (navigation,
 *  pointers, bookkeeping) leaves a page empty. */
export function isPageContentAction(action: string): boolean {
  return /^show[A-Z]/.test(action) || action === 'handwrite' || action === 'drawVector';
}

export function decideDeferredPageFlush(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_DEFERRED_PAGE_DEDUP !== 'off'). */
  enabled: boolean;
  /** The batch as it stands at the flush (synthetic page-grouping newPage included). */
  batch: ReadonlyArray<{ action: string; title?: string }>;
  /** The batch's own (first) newPage is a page-grouping continuation page. */
  ownPageIsContinuation?: boolean;
  /** The deferred page is an authored fixed-script part page — never dropped. */
  deferredIsAuthored?: boolean;
}): {
  /** 'drop-own-page': remove the batch's newPage at `ownPageIndex`, then prepend the deferred page. */
  action: 'prepend' | 'drop-deferred' | 'drop-own-page';
  reason: DeferredPageFlushReason;
  ownPageTitle?: string;
  ownPageIndex?: number;
} {
  if (!input.enabled) return { action: 'prepend', reason: 'flag-off' };
  let contentSeen = false;
  for (let i = 0; i < input.batch.length; i++) {
    const cmd = input.batch[i];
    const a = String(cmd.action);
    if (a === 'newPage') {
      if (contentSeen) return { action: 'prepend', reason: 'content-before-own-page' };
      const ownPageTitle = typeof cmd.title === 'string' ? cmd.title : '';
      if (input.ownPageIsContinuation === true) {
        return { action: 'drop-own-page', reason: 'own-page-is-continuation', ownPageTitle, ownPageIndex: i };
      }
      if (input.deferredIsAuthored === true) {
        return { action: 'drop-own-page', reason: 'deferred-page-is-authored', ownPageTitle, ownPageIndex: i };
      }
      return { action: 'drop-deferred', reason: 'batch-opens-own-page', ownPageTitle };
    }
    if (isPageContentAction(a)) contentSeen = true;
  }
  return { action: 'prepend', reason: 'no-own-page' };
}

/**
 * Invariant check for a command stream: indexes of every newPage that
 * receives no content before the next newPage (a trailing newPage is not
 * counted — later batches may fill it).
 */
export function emptyPageIndexes(batch: ReadonlyArray<{ action: string }>): number[] {
  const empty: number[] = [];
  let openIdx = -1;
  let hasContent = false;
  batch.forEach((cmd, i) => {
    const a = String(cmd.action);
    if (a === 'newPage') {
      if (openIdx >= 0 && !hasContent) empty.push(openIdx);
      openIdx = i;
      hasContent = false;
    } else if (isPageContentAction(a)) {
      hasContent = true;
    }
  });
  return empty;
}

/**
 * Task 20 §D2 (GDI run 8, 144 s): the client advanced a fixed-script part at
 * the end of a turn, the turn's auto card was (rightly) held on the page being
 * left — and the new part's page then waited for the NEXT render: the rail
 * chip read "Present perfect" while the board stayed on the old page for 49 s.
 * An authored part page still pending when the advancing turn is over (brain
 * idle, audio drained, every buffered render painted) opens at once. Other
 * deferred pages keep waiting for content (the empty-page guard they exist for).
 */
export function flushDeferredPageAtTurnEnd(input: {
  /** `flushAfterNextTurn` (Task 24 §C3): the page waits for the end of the
   *  next brain turn — never flushed at this turn's end. */
  pending: { authored?: boolean; flushAfterNextTurn?: boolean } | null | undefined;
  brainBusy: boolean;
  speaking: boolean;
  bufferedRenders: number;
}): boolean {
  const { pending, brainBusy, speaking, bufferedRenders } = input;
  return !!pending && pending.authored === true && pending.flushAfterNextTurn !== true && !brainBusy && !speaking && bufferedRenders === 0;
}

/**
 * Task 24 §C3 (GDI run 12, 962–968 s): the budget advance fired on a turn
 * that ended with a question because the one-turn ask hold was spent, and
 * the page flipped at that turn's end — the student's answer and its card
 * then landed on the next part's page. When the advance fires on an ask
 * turn with the hold spent, the part page is flushed at the end of the NEXT
 * brain turn (the transition turn, whose sentence board cards the answer on
 * the part being left first); otherwise at this turn's end, as before.
 */
export function advancePageFlushTiming(input: { askPending: boolean; holdSpent: boolean }): 'next-turn' | 'turn-end' {
  return input.askPending && input.holdSpent ? 'next-turn' : 'turn-end';
}

/**
 * Task 23 §A (GDI run 11, 143 s / 271 s / 1017 s): the advancing turn's card
 * of the STUDENT's sentence (an auto echo / correction / checked / affirmed /
 * recast card, or a brain show_sentence of the student's sentence) painted
 * AFTER the new part's page break — the correction of the answer to the part
 * being left landed on the next part's page. Every student sentence card that
 * follows the page break is moved in front of it (stream order otherwise
 * kept); the segment card and any other render stay after it. `moved` = the
 * cards moved, in order. No newPage in `cmds` ⇒ unchanged.
 */
export function orderStudentCardsBeforePageBreak<T extends { action: string }>(
  cmds: readonly T[],
  isStudentCard: (c: T) => boolean,
): { cmds: T[]; moved: T[] } {
  const breakIdx = cmds.findIndex((c) => c.action === 'newPage');
  if (breakIdx < 0) return { cmds: [...cmds], moved: [] };
  const moved = cmds.filter((c, i) => i > breakIdx && c.action === 'showSentence' && isStudentCard(c));
  if (moved.length === 0) return { cmds: [...cmds], moved: [] };
  const rest = cmds.filter((c) => !moved.includes(c));
  const at = rest.indexOf(cmds[breakIdx]!);
  return { cmds: [...rest.slice(0, at), ...moved, ...rest.slice(at)], moved };
}

/**
 * Task 27 §B (GDI run 14, 493 s): the transition turn's turn-end renders ran
 * in code order — the client's part card (segment_card_auto, a showProblem:
 * fresh teaching, so the deferred part page flushed with it) BEFORE the
 * sentence board — and with the turn's audio over both painted at once: the
 * correction card of the student's answer (planned later, at the sentence
 * board) landed on the NEXT part's page. At 958 s the same shape went right
 * because the break was still buffered and the card moved in front of it.
 *
 * With a part page pending, the turn-end part card waits: the student's
 * sentence cards go first (they stay on the page being left — or, flushing the
 * page themselves, go in front of its break), then the part card (it opens the
 * part page), then any other card (a new model sentence of the new part).
 * No page pending ⇒ the part card first, as before ("the first thing on its
 * page"). `kind` of each planned dispatch: 'segment' (the part card),
 * 'student' (a card of the student's sentence), 'other'.
 */
export function orderTurnEndDispatches<T extends { kind: 'segment' | 'student' | 'other' }>(
  planned: readonly T[],
  pagePending: boolean,
): T[] {
  if (!pagePending) {
    return [...planned.filter((p) => p.kind === 'segment'), ...planned.filter((p) => p.kind !== 'segment')];
  }
  return [
    ...planned.filter((p) => p.kind === 'student'),
    ...planned.filter((p) => p.kind === 'segment'),
    ...planned.filter((p) => p.kind === 'other'),
  ];
}

/**
 * Task 27 §B fallback: the part page already PAINTED earlier in this turn
 * (its break left the render buffer) when a card of the student's sentence is
 * planned — the card goes to the page the student answered on, the page
 * before the break. The board groups commands into pages as WhiteboardCanvas
 * does (newPage splits; clear / goToPage / removeItems / reviseItems and
 * removed ids render nothing; an empty group is no page): the target is that
 * page's title and index. null when the break is not in `commands` or there
 * is no page before it.
 */
export function previousPageTarget(
  commands: ReadonlyArray<{ action: string; title?: string; id?: string; ids?: readonly string[] } & Record<string, unknown>>,
  breakCmd: unknown,
): { targetPageTitle?: string; targetPageIndex: number } | null {
  const breakIdx = commands.indexOf(breakCmd as (typeof commands)[number]);
  if (breakIdx <= 0) return null;
  const removed = new Set<string>();
  for (const c of commands) if (c.action === 'removeItems' && Array.isArray(c.ids)) for (const id of c.ids) removed.add(id);
  let pages = 0;
  let lastTitle: string | undefined;
  let current: { title?: string; n: number } = { n: 0 };
  for (let i = 0; i < breakIdx; i++) {
    const c = commands[i]!;
    if (c.action === 'clear' || c.action === 'goToPage' || c.action === 'removeItems' || c.action === 'reviseItems') continue;
    if (typeof c.id === 'string' && removed.has(c.id)) continue;
    if (c.action === 'newPage') {
      if (current.n > 0) { pages += 1; lastTitle = current.title; }
      current = { title: typeof c.title === 'string' ? c.title : undefined, n: 0 };
    } else {
      current.n += 1;
    }
  }
  if (current.n > 0) { pages += 1; lastTitle = current.title; }
  if (pages === 0) return null;
  return { ...(lastTitle ? { targetPageTitle: lastTitle } : {}), targetPageIndex: pages - 1 };
}
