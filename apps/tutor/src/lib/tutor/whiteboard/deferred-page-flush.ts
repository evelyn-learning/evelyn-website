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
 */
export type DeferredPageFlushReason = 'flag-off' | 'no-own-page' | 'content-before-own-page' | 'batch-opens-own-page' | 'own-page-is-continuation';

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
