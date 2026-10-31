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
  pending: { authored?: boolean } | null | undefined;
  brainBusy: boolean;
  speaking: boolean;
  bufferedRenders: number;
}): boolean {
  const { pending, brainBusy, speaking, bufferedRenders } = input;
  return !!pending && pending.authored === true && !brainBusy && !speaking && bufferedRenders === 0;
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
