'use client';
/**
 * Tutor brain v2 — the session client for TEXT sessions (design §4.8).
 *
 * Mounted by TutorSession in place of VoiceTutorRealtime when the session is
 * v2 and typed. The turn loop is useV2Turns; this file is the composer and the
 * handle the parent talks to. The parent keeps doing what it did for v1: it
 * renders the transcript and the board and saves the session.
 *
 * Not here yet: resume from a checkpoint, the agenda rail.
 */
import { Mic, MicOff } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { V2FlagBar, V2_FLAGS_ON, type V2FlagState } from './V2FlagBar';
import type { RealtimeHandle } from '@/lib/tutor/orchestrator/types';
import { useV2Turns, type V2TurnsConfig } from './useV2Turns';
import { useSessionStrings } from '@/lib/tutor/i18n/SessionStringsContext';
import type { SessionStrings } from '@/lib/tutor/i18n/session-strings';

export interface TutorClientV2Props extends Omit<V2TurnsConfig, 'mode' | 'onSentence' | 'onCut' | 'closeDelayMs' | 'untilQuiet' | 'speechPending'> {
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
  const S = useSessionStrings();
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
    ref.current = { ...V2_HANDLE_STUBS, sendTextMessage: (text) => send(text), startSession: open, endSession: (opts) => end(opts), isEnding };
    return () => { ref.current = null; };
  }, [props.handleRef, send, open, end, isEnding]);

  // The tester's flag bar (local development only), as in a spoken session.
  const flagRef = useRef<V2FlagState>({ active: false, words: [] });
  const flagSession = useMemo(() => {
    try { return String(JSON.parse(atob((props.embedToken ?? '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).student_id || 'session'); } catch { return 'session'; }
  }, [props.embedToken]);
  const flagSnapshot = useCallback(() => {
    const state = turns.stateRef.current;
    const text = (m: { content: unknown } | undefined) => !m ? '' : typeof m.content === 'string' ? m.content : (m.content as Array<{ type: string; text?: string }>).filter((b) => b.type === 'text').map((b) => b.text).join(' ');
    const last = (role: string) => text([...state.history].reverse().find((m) => m.role === role));
    return { mode: 'text', turns: state.history.length, minutesIn: Math.round((Date.now() - state.startedAtMs) / 6000) / 10, tutorBusy: turns.busy, lastStudent: last('user').slice(-600), lastTutor: last('assistant').slice(-1500), board: state.board };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turns.busy]);

  return (<>
    {V2_FLAGS_ON && <V2FlagBar session={flagSession} flagRef={flagRef} snapshot={flagSnapshot} onStart={() => props.onDebugEvent?.('v2_flag', 'opened')} onStop={() => props.onDebugEvent?.('v2_flag', 'closed')} />}
    <V2Composer composerSlot={props.composerSlot} closed={turns.closed} busy={turns.busy} onSend={send} placeholder={S.typeAnswerPlaceholder} autoFocus status={turns.closed ? undefined : turns.busy ? { state: 'thinking' } : undefined} />
  </>);
}

/** What the tutor is doing right now, for the composer's status chip. `heard`: the student's words so far. */
export interface V2ComposerStatus { state: 'listening' | 'hearing' | 'processing' | 'thinking' | 'speaking' | 'error' | 'idle'; heard?: string; level?: number; /** No sound has come from the microphone yet. */ quiet?: boolean; /** The input device changed and the new one is being opened. */ micChanged?: boolean; /** Other voices have been heard in the room (room-voices.ts). */ room?: boolean; /** The student has switched their microphone off. */ muted?: boolean }
/** The chip of each state, worded for the session's language (session-strings.ts). */
const statusLook = (S: SessionStrings): Record<V2ComposerStatus['state'], { label: string; hint: string; dot: string; chip: string }> => ({
  listening: { label: S.chipListening, hint: S.hintListening, dot: 'bg-emerald-500', chip: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  hearing: { label: S.chipHearing, hint: S.hintHearing, dot: 'bg-emerald-500', chip: 'border-emerald-300 bg-emerald-100 text-emerald-900' },
  processing: { label: S.chipProcessing, hint: S.hintProcessing, dot: 'bg-amber-500', chip: 'border-amber-200 bg-amber-50 text-amber-800' },
  thinking: { label: S.chipThinking, hint: S.hintThinking, dot: 'bg-amber-500', chip: 'border-amber-200 bg-amber-50 text-amber-800' },
  speaking: { label: S.chipSpeaking, hint: S.hintSpeaking, dot: 'bg-blue-500', chip: 'border-blue-200 bg-blue-50 text-blue-800' },
  error: { label: S.chipError, hint: S.hintError, dot: 'bg-rose-500', chip: 'border-rose-200 bg-rose-50 text-rose-800' },
  idle: { label: S.chipIdle, hint: S.hintIdle, dot: 'bg-slate-400', chip: 'border-slate-200 bg-slate-50 text-slate-600' },
});

const mutedLook = (S: SessionStrings) => ({ label: S.chipMicOff, hint: S.hintMicOff, dot: 'bg-rose-500', chip: 'border-rose-200 bg-rose-50 text-rose-800' });

/** The line the student types on, with what the tutor is doing beside it. v1's composer showed "Listening",
 *  "Hearing…" and the rest next to the box and the first v2 one showed nothing: a student could not tell
 *  whether they had been heard (Praveen, 2026-11-12). The chip names the state; while the student speaks, the
 *  box shows their words as they are recognised, so they can see what was heard before the tutor answers. */
export function V2Composer({ composerSlot, closed, busy, onSend, placeholder, autoFocus, status, mic }: { composerSlot?: ReactNode; closed: boolean; busy: boolean; onSend: (text: string) => void; placeholder: string; autoFocus?: boolean; status?: V2ComposerStatus; /** Voice: the student's switch for their microphone. */ mic?: { muted: boolean; onToggle: () => void } }) {
  // Switched off, the microphone is neither listening nor hearing, whatever the tutor is doing.
  const micOff = !!status?.muted && (status.state === 'listening' || status.state === 'hearing' || status.state === 'processing');
  const S = useSessionStrings();
  const MUTED_LOOK = mutedLook(S);
  const look = status && !closed ? (micOff ? MUTED_LOOK : statusLook(S)[status.state]) : null;
  const heard = status?.state === 'hearing' || status?.state === 'processing' ? (status.heard ?? '').trim() : '';
  const bars = [0.45, 0.8, 1, 0.7, 0.4];
  const level = Math.max(0, Math.min(1, status?.level ?? 0));
  return (
    <form
      className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('studentText') as HTMLInputElement | null;
        if (!input) return;
        const text = input.value; input.value = '';
        onSend(text);
      }}
    >
      {composerSlot}
      {mic && !closed && (
        <button type="button" onClick={mic.onToggle} aria-pressed={mic.muted} data-v2-mic={mic.muted ? 'off' : 'on'} title={mic.muted ? S.micTurnOn : S.micTurnOff} aria-label={mic.muted ? S.micTurnOn : S.micTurnOff}
          className={`shrink-0 rounded-lg p-2 ${mic.muted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {mic.muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}
      {look && (
        <span role="status" aria-live="polite" data-v2-status={status?.state} className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${look.chip}`}>
          {!micOff && (status?.state === 'listening' || status?.state === 'hearing') ? (
            <span className="flex items-end gap-[2px] h-3.5" aria-hidden>
              {bars.map((b, i) => <span key={i} className={`w-[3px] rounded-full ${look.dot}`} style={{ height: `${Math.max(18, Math.round(100 * b * (status.state === 'hearing' ? Math.max(0.45, level) : Math.max(0.12, level))))}%`, transition: 'height 120ms ease-out' }} />)}
            </span>
          ) : (
            <span className={`h-2 w-2 rounded-full ${look.dot} ${status?.state === 'thinking' || status?.state === 'processing' || status?.state === 'speaking' ? 'animate-pulse' : ''}`} aria-hidden />
          )}
          {look.label}
        </span>
      )}
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
        placeholder={closed ? S.sessionEnded : micOff ? MUTED_LOOK.hint : status?.muted && status.state === 'speaking' ? S.micOffWhileSpeaking : heard ? `“${heard.slice(-90)}”` : look ? (status?.micChanged ? S.micChanged : status?.quiet && status.state === 'listening' ? S.micNoSound : status?.room && status.state === 'speaking' ? S.roomVoicesSpeaking : status?.room && status.state === 'listening' ? S.roomVoicesListening : look.hint) : placeholder}
        className="flex-1 min-w-0 text-base sm:text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
      <button type="submit" disabled={closed} className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50">
        {S.send}
      </button>
    </form>
  );
}
