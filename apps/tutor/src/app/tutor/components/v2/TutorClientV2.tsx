'use client';
/**
 * Tutor brain v2 — the session client for TEXT sessions (design §4.8).
 *
 * Mounted by TutorSession in place of VoiceTutorRealtime when the session is
 * v2 and typed. The turn loop is useV2Turns; this file is the composer and the
 * handle the parent talks to. The parent keeps doing what it did for v1: it
 * renders the transcript and the board and saves the session.
 *
 * Not here yet: resume from a checkpoint, the agenda rail, the hard time stop.
 */
import { useEffect, type MutableRefObject, type ReactNode } from 'react';
import type { RealtimeHandle } from '@/lib/tutor/orchestrator/types';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';

export interface TutorClientV2Props extends Omit<V2TurnsConfig, 'mode' | 'onSentence' | 'onCut' | 'closeDelayMs'> {
  standby?: boolean;
  prewarm?: boolean;
  composerSlot?: ReactNode;
  handleRef?: MutableRefObject<RealtimeHandle | null>;
}

const noop = () => {};

/** The parts of the v1 handle a v2 client has no use for yet. */
export const V2_HANDLE_STUBS = {
  speakText: noop, stopSpeaking: noop, stepPaceBias: noop, setSpeakingRate: noop, setPracticeOverride: noop,
  setDifficultyBias: noop, getSpokenCaption: () => null, resumeContinue: noop, pushStudentMark: noop, setManualMic: noop,
  getSessionSummary: () => ({ topicsCovered: [], conceptsCovered: [], weakTopics: [] }),
} satisfies Partial<RealtimeHandle>;

export default function TutorClientV2(props: TutorClientV2Props) {
  const turns = useV2Turns({ ...props, mode: 'text' });
  const { open, send, end, abort, isEnding, openedRef } = turns;

  // The tutor opens the session, unless the page is only standing by.
  useEffect(() => {
    if (props.standby || props.prewarm) return;
    open();
    return () => { abort(); openedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.standby, props.prewarm]);

  useEffect(() => {
    const ref = props.handleRef;
    if (!ref) return;
    ref.current = { ...V2_HANDLE_STUBS, sendTextMessage: (text) => send(text), startSession: open, endSession: end, isEnding };
    return () => { ref.current = null; };
  }, [props.handleRef, send, open, end, isEnding]);

  return <V2Composer composerSlot={props.composerSlot} closed={turns.closed} busy={turns.busy} onSend={send} placeholder="Type your answer… Enter to send" autoFocus />;
}

export function V2Composer({ composerSlot, closed, busy, onSend, placeholder, autoFocus }: { composerSlot?: ReactNode; closed: boolean; busy: boolean; onSend: (text: string) => void; placeholder: string; autoFocus?: boolean }) {
  return (
    <form
      className="flex items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('studentText') as HTMLInputElement | null;
        if (!input) return;
        const text = input.value; input.value = '';
        onSend(text);
      }}
    >
      {composerSlot}
      <input
        name="studentText"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-1p-ignore
        data-lpignore="true"
        autoFocus={autoFocus}
        disabled={closed}
        placeholder={closed ? 'This session has ended' : placeholder}
        className="flex-1 min-w-0 text-base sm:text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
      <button type="submit" disabled={closed} className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50">
        {busy ? '…' : 'Send'}
      </button>
    </form>
  );
}
