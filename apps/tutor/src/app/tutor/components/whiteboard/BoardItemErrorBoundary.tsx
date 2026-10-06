'use client';

import React from 'react';

/**
 * One board item, fenced off.
 *
 * 2026-10-05 (live text session): a single card threw while rendering
 * (`.map` on a list the brain never sent) and, with nothing between the card
 * and the route, React unmounted the whole session — the student saw "This
 * page couldn't load" mid-lesson. Board content is model-authored, so any
 * renderer can meet a shape it did not expect; one bad card must cost one
 * card, not the session.
 *
 * The placeholder is student-facing: neutral, no error text, no stack. The
 * detail goes to the console for us.
 *
 * `resetKey` is the command object: when the item is replaced (evolve in
 * place, kill-recovery) the boundary tries again instead of staying failed.
 */
export class BoardItemErrorBoundary extends React.Component<
  { action?: string; itemId?: string; resetKey?: unknown; children: React.ReactNode },
  { failed: boolean; failedKey: unknown }
> {
  state: { failed: boolean; failedKey: unknown } = { failed: false, failedKey: undefined };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  static getDerivedStateFromProps(
    props: { resetKey?: unknown },
    state: { failed: boolean; failedKey: unknown },
  ): { failed: boolean; failedKey: unknown } | null {
    // Remember which command failed; a different command gets a fresh try.
    if (state.failed && state.failedKey === undefined) return { failed: true, failedKey: props.resetKey ?? null };
    if (state.failed && state.failedKey !== (props.resetKey ?? null)) return { failed: false, failedKey: undefined };
    return null;
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error(
      `[Whiteboard] board item failed to render — action=${this.props.action ?? '?'} id=${this.props.itemId ?? '?'}`,
      error,
      info?.componentStack,
    );
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          className="w-full max-w-[460px] rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-center text-sm text-gray-400"
          data-wb-render-failed="1"
          role="note"
        >
          This part of the board couldn&rsquo;t be shown.
        </div>
      );
    }
    return this.props.children;
  }
}
