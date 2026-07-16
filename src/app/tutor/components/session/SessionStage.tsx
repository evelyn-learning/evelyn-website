/**
 * SessionStage — the in-session "Stage + Presence" layout (Direction 4).
 *
 * Flag-gated by NEXT_PUBLIC_TUTOR_NEW_SESSION_UI (see page.tsx). The whiteboard
 * is a full-bleed hero; the top bar, tools cluster, voice dock, and transcript
 * drawer float over it. When the board is empty (very common at kickoff), the
 * stage shows a live "tutor presence" — an animated orb + waveform + the
 * tutor's current sentence — so it never reads as dead space; the first drawing
 * collapses that to a slim persistent caption strip.
 *
 * This is a LAYOUT component: the heavy, already-wired pieces (whiteboard,
 * voice engine, transcript) are passed in as slots so we rearrange rather than
 * re-plumb. Presence is driven by data derived in page.tsx from existing
 * signals (voiceState, liveCaption, boardEmpty) — no change to the voice engine.
 *
 * Spec + decisions: [[project-tutor-session-ui-redesign]].
 */
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, Pencil, PenLine, Eraser, Camera, Maximize2, Minimize2,
  MessageSquareText, X, Target, Upload, ArrowDown,
} from 'lucide-react';
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
import { stripLatexForTitle } from '@/lib/tutor/whiteboard/board-title';

export type VoiceState = 'idle' | 'listening' | 'hearing' | 'processing' | 'speaking' | 'thinking' | 'muted' | 'error';

/** Hide the in-panel Quick-Actions chips for now — the caption + chips + dock
 *  got too crowded (2026-06-24 ear-test, Images 16/17). Flip to true to restore
 *  the Skip / I'm stuck / quick-answer chips above the dock. */
const SHOW_QUICK_ACTIONS = false;

export interface SessionStageProps {
  lessonTitle: string;
  subtitle?: ReactNode;
  /** Optional partner brand lockup (logo / product name) shown at the left of
   *  the top bar — used by the embed; standalone /tutor omits it. */
  headerBrand?: ReactNode;
  hasPlan: boolean;
  isFreePractice: boolean;
  objective?: string;            // current LO / goal chip text
  beats?: ReactNode;             // <LessonPlanProgress/> (restyled host)
  controls?: ReactNode;          // <SessionControls/> (timer / end / upload)
  adaptiveMenu?: ReactNode;      // the pacing ⋯ menu element
  /** R1 (2026-07-14): End/Pause moved OUT of the dock into the header's
   *  right cluster — session-level control, conventional spot, and far from
   *  the textbox where accidental taps happen. Composed by TutorSession
   *  (must run VTR's full endSession teardown via handleRef). */
  endControl?: ReactNode;
  /** Q pin (2026-07-14): gist of the tutor's current question, pinned
   *  top-center over the board after the tutor stops speaking, cleared when
   *  the next turn starts. Composed by TutorSession (owns the gist state). */
  questionPin?: ReactNode;
  // presence
  voiceState: VoiceState;
  /** Live student-mic amplitude (0..1) in a ref, polled here for the "being
   *  heard" meter — a ref so the parent doesn't re-render on every audio frame. */
  micLevelRef?: { current: number };
  /** Transient honesty hint when a clear utterance didn't reach the brain. */
  listeningHint?: 'didnt-catch' | null;
  /** Has the student started the session (clicked the mic / first turn)?
   *  Before this we prompt "tap the mic to start" instead of "Listening…". */
  started?: boolean;
  liveCaption?: string;
  /** Caption word-sync: poll getter for the audio-locked reveal. Absent →
   *  legacy typewriter. Returns null → engine unsupported → legacy typewriter.
   *  live:false → show the full caption instantly (finalized / reload). */
  getSpokenCaption?: () => SpokenCaption | null;
  boardEmpty: boolean;
  // slots
  board: ReactNode;              // <WhiteboardCanvas suppressEmptyState chrome="minimal"/>
  /** Page-nav state surfaced from the chromeless board so the stage can render
   *  its own slim top-center switcher. Undefined / count<=1 → no switcher. */
  boardPages?: { index: number; count: number; titles: string[]; goTo: (i: number) => void };
  voiceInput: ReactNode;         // <VoiceTutorRealtime/> etc — the dock contents
  transcript: ReactNode;         // <TranscriptView/>
  transcriptCount?: number;      // for the drawer badge
  /** True when the tutor is offering the in-session lesson picker (free
   *  practice). Accepted for compatibility; the drawer no longer auto-opens
   *  on it (the picker stays reachable via the Transcript button). */
  nudgeActive?: boolean;
  quickActions?: ReactNode;      // promoted chips (optional)
  // student tools → existing onStudentInput pipeline
  onStudentInput: (type: 'text' | 'drawing' | 'image', content: string) => void;
  onBack?: () => void;
  // Phase 2 student marks — present only when the feature is enabled
  boardPenActive?: boolean;
  onToggleBoardPen?: () => void;
}

const ORB_STYLE: Record<VoiceState, string> = {
  speaking: 'from-emerald-300 to-emerald-600',
  listening: 'from-sky-300 to-blue-600',
  hearing: 'from-blue-400 to-indigo-600',
  processing: 'from-amber-200 to-amber-400',
  thinking: 'from-amber-300 to-amber-500',
  muted: 'from-slate-300 to-slate-400',
  idle: 'from-slate-300 to-slate-500',
  error: 'from-rose-300 to-rose-600',
};
const STATE_LABEL: Record<VoiceState, string> = {
  speaking: 'Tutor is speaking', listening: 'Listening…', hearing: 'Hearing you…',
  processing: 'Got that — one sec…', thinking: 'Thinking…',
  muted: 'Muted — tap the mic to talk', idle: 'Ready', error: 'Connection issue',
};

export default function SessionStage(props: SessionStageProps) {
  const {
    lessonTitle, subtitle, headerBrand, hasPlan, isFreePractice, objective, beats, controls, adaptiveMenu, endControl, questionPin,
    voiceState, micLevelRef, listeningHint, started = false, liveCaption, boardEmpty, board, boardPages, voiceInput, transcript, transcriptCount = 0,
    quickActions, onStudentInput, onBack,
    boardPenActive, onToggleBoardPen,
  } = props;

  const showSwitcher = !!boardPages && boardPages.count > 1;

  // Poll the student-mic amplitude into local state ONLY while the mic could be
  // active (listening/hearing), so the VU meter is live without re-rendering
  // the whole stage the rest of the time. Smoothed for a natural feel.
  const [micLevel, setMicLevel] = useState(0);
  const reactsToMic = voiceState === 'listening' || voiceState === 'hearing';
  useEffect(() => {
    if (!micLevelRef || !reactsToMic) { setMicLevel(0); return; }
    let smoothed = 0;
    let last = -1;
    const id = setInterval(() => {
      const target = micLevelRef.current || 0;
      smoothed += (target - smoothed) * 0.35;
      // Only re-render on a meaningful change, so a silent listening period
      // settles to 0 and stops churning until the student actually speaks.
      if (Math.abs(smoothed - last) > 0.012) { last = smoothed; setMicLevel(smoothed); }
    }, 60);
    return () => clearInterval(id);
  }, [micLevelRef, reactsToMic]);

  // The transcript drawer is CLOSED by default and only opens on explicit
  // user action (Transcript button / caption tap). We deliberately do NOT
  // auto-open it on the lesson-picker nudge — popping it over the board on
  // session start was disorienting (it dimmed the whole stage). The nudge
  // picker still lives in the transcript, reachable via the Transcript button.
  const [drawerOpen, setDrawerOpen] = useState(false);
  // The dock caption (rendered inside VoiceTutorRealtime via captionSlot —
  // composed in TutorSession, two levels up from this component's slots)
  // opens the transcript drawer through this window-event bridge: the drawer
  // state lives here and threading a callback up-and-back-down would tangle
  // the slot composition.
  useEffect(() => {
    const open = () => setDrawerOpen(true);
    window.addEventListener('evelyn:open-transcript', open);
    return () => window.removeEventListener('evelyn:open-transcript', open);
  }, []);
  const [tool, setTool] = useState<null | 'draw' | 'text'>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const animate = voiceState === 'speaking' || voiceState === 'listening' || voiceState === 'hearing';

  const stageRef = useRef<HTMLDivElement>(null);
  // Close the board-page dropdown on any pointerdown outside its container
  // (the pill + list). Covers clicks anywhere — board, header, dock — which the
  // old z-layered click-catcher missed (header/dock sat above it). Buttons
  // inside the container manage their own close via onClick.
  const switcherRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!switcherOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [switcherOpen]);
  // Fullscreen capability (effect-set: document is not available in SSR).
  const [canFullscreen, setCanFullscreen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    setCanFullscreen(Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled));
  }, []);

  // Mobile "expand" mode (Task E8): the Fullscreen API is unavailable on
  // iPhone Safari (no Fullscreen API on non-video elements) and inside an
  // iframe lacking allowfullscreen — exactly where the embed runs. There the
  // PORTAL does the growing (iframe → fixed inset-0), not the browser; this
  // rail button just asks it to, over the fixed cross-repo contract with
  // portal task P6 ({type:'evelyn:expand'|'evelyn:collapse'} on the same
  // channel as evelyn:progress/evelyn:session_ended). `canFullscreen` is
  // already mutually exclusive with this (see `canExpand` below), so exactly
  // one of the two rail buttons ever shows.
  //
  // SessionStage has no explicit "embed vs standalone" prop — its whole
  // layout IS the embed/minimal-chrome layout (there's no other mode this
  // component renders), and the standalone /tutor route is never iframed in
  // production (only /tutor-portal/embed is — see EngineSelector.tsx, which
  // iframes /embed, not /tutor). So `!canFullscreen && iframed` alone
  // correctly scopes the button to the embed without a separate flag.
  const [iframed, setIframed] = useState(false);
  useEffect(() => {
    try { setIframed(window.self !== window.top); } catch { setIframed(true); }
  }, []);
  const [expanded, setExpanded] = useState(false);
  // TODO: gate this on the embed chrome flag (minimal chrome only) when available.
  // SessionStage's only call site is TutorSession, iframed only via /embed (chrome="minimal").
  // If SessionStage gains a second consumer, add explicit chrome prop to avoid unintended expand
  // button in non-minimal contexts.
  const canExpand = !canFullscreen && iframed;

  // The postMessage sender (with its target-origin handling) lives in
  // tutor-portal/embed/page.tsx — two composition levels up from this deeply
  // nested stage. A window event is the same bridge already used to reach
  // SessionStage FROM up there ('evelyn:open-transcript'); here it runs the
  // other direction, and the embed page relays it out to window.parent.
  const requestExpand = () => { window.dispatchEvent(new Event('evelyn:expand')); setExpanded(true); };
  const requestCollapse = () => { window.dispatchEvent(new Event('evelyn:collapse')); setExpanded(false); };

  // Session end must reset this local state so it can't desync if the
  // student re-enters — belt-and-suspenders: a normal embed end already
  // unmounts SessionStage outright (dropping this state with it), but
  // TutorSession fires this window event at its single onEndSession choke
  // point regardless of how the session ended, so this stays correct even if
  // that assumption ever changes.
  useEffect(() => {
    const reset = () => setExpanded(false);
    window.addEventListener('evelyn:session-ending', reset);
    return () => window.removeEventListener('evelyn:session-ending', reset);
  }, []);

  const toggleFullscreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = stageRef.current as any;
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
      } else {
        // webkit* covers Safari (desktop/iPad). iPhone Safari has no Fullscreen
        // API at all — the button is hidden there (see the tools cluster).
        (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
      }
    } catch { /* unsupported — button is hidden on those devices anyway */ }
  };

  return (
    <div ref={stageRef} className="fixed inset-0 overflow-hidden bg-white select-none session-stage flex flex-col">
      <style>{`
        .session-stage .ss-grid{background-image:linear-gradient(#eef2f7 1px,transparent 1px),linear-gradient(90deg,#eef2f7 1px,transparent 1px);background-size:28px 28px}
        @keyframes ss-pulse{0%{transform:scale(.85);opacity:.5}80%,100%{transform:scale(1.6);opacity:0}}
        .ss-pulse{animation:ss-pulse 2s cubic-bezier(.4,0,.2,1) infinite}
        .ss-pulse.d{animation-delay:1s}
        @keyframes ss-wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
        .ss-wave{transform-origin:center;animation:ss-wave 1s ease-in-out infinite}
        @keyframes ss-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
        .ss-breathe{animation:ss-breathe 3.4s ease-in-out infinite}
        @keyframes ss-cap{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .ss-cap{animation:ss-cap .4s ease both}
      `}</style>

      {/* Full-bleed grid background — behind every row. */}
      <div className="absolute inset-0 ss-grid z-0 pointer-events-none" />

      {/* ===== Board area (flex row — fills everything below the top bar; the
              caption+dock bar FLOATS over its bottom edge, translucent, so the
              board keeps the full height even in a ~600px iframe) ===== */}
      <div className="relative z-10 flex-1 min-h-0 order-2">
        {/* The board CONTENT sits in a centered, readable column (word problems
            / prose shouldn't stretch edge-to-edge). Only small padding is
            needed (plus clearance for the floating switcher when shown) — the
            bottom is deliberately NOT padded to clear the floating bar: ink
            may run behind it and stay readable through the 40% surface. */}
        <div className={`absolute inset-0 ${showSwitcher ? 'pt-12' : 'pt-2'} pb-2 px-2 sm:px-0 flex justify-center`}>
          {/* Once there's content, frame the board as a bounded white "sheet"
              on the grid so the student can see the content boundary BEFORE a
              scrollbar appears (Images 2/3, 2026-06-24). Empty board stays
              transparent — the presence overlay owns that state. */}
          <div className={`w-full max-w-3xl h-full ${boardEmpty ? '' : 'rounded-2xl bg-white/85 border border-slate-200 shadow-sm overflow-hidden'}`}>{board}</div>
        </div>

        {/* presence overlay when the board is empty. pb clears the floating
            caption+dock bar so the starter chips never sit under it. */}
        {boardEmpty && (
          <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 pt-4 pb-32 overflow-y-auto pointer-events-none">
            {objective && !isFreePractice && (
              <span className="ss-cap mb-7 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Target className="w-4 h-4" /> {objective}
              </span>
            )}
            <div className="relative mb-6 grid place-items-center">
              {animate && <><span className="ss-pulse absolute inset-0 m-auto w-28 h-28 rounded-full bg-blue-400/30" /><span className="ss-pulse d absolute inset-0 m-auto w-28 h-28 rounded-full bg-blue-400/30" /></>}
              <div
                className={`ss-breathe relative w-28 h-28 rounded-full grid place-items-center text-white shadow-xl bg-gradient-to-br ${ORB_STYLE[voiceState]}`}
                // While the student speaks, the orb swells with their voice — a
                // direct "I'm hearing you" signal.
                style={reactsToMic ? { transform: `scale(${1 + micLevel * 0.18})` } : undefined}
              >
                <Sparkles className="w-12 h-12 drop-shadow" />
              </div>
            </div>
            <div className="mb-6"><MicMeter level={micLevel} speaking={voiceState === 'speaking'} large /></div>
            {listeningHint === 'didnt-catch' ? (
              <p className="ss-cap text-sm font-medium text-amber-600 mb-2">Didn’t catch that — mind repeating?</p>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                {started ? STATE_LABEL[voiceState] : 'Voice tutor'}
              </p>
            )}
            {/* Once started, the tutor's WORDS live in the small Caption Strip
                at the bottom — NOT as a wall of big text here. The center stays
                calm: orb + waveform + state. Pre-start shows the lesson + CTA. */}
            {started ? (
              isFreePractice && !liveCaption ? (
                <p className="max-w-xl text-center text-xl font-semibold text-slate-700">What would you like to work on?</p>
              ) : null
            ) : (
              <>
                {/* What are we learning today — the top-bar title is small, so
                    surface the lesson here at the start as the focal context. */}
                {hasPlan && (
                  <p className="mb-2 text-sm sm:text-base text-slate-500">
                    Today’s lesson: <span className="font-semibold text-slate-700">{lessonTitle}</span>
                  </p>
                )}
                <p className="max-w-xl text-center text-2xl sm:text-3xl font-semibold leading-snug text-slate-800">
                  Tap the mic below to start
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                  Just talk — I&apos;ll listen and teach on the board <ArrowDown className="w-4 h-4" />
                </p>
              </>
            )}
            {/* Quick ways in — Upload (de-emphasized, the cluster camera does
                the same), plus generic starters. Shown in every session so the
                student always has something to act on. */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
              <label className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-300 text-slate-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 cursor-pointer">
                <Upload className="w-4 h-4 text-slate-500" /> Upload a problem
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, onStudentInput)} />
              </label>
              <Chip onClick={() => onStudentInput('text', 'Give me some practice problems.')}>Practice problems</Chip>
              <Chip onClick={() => onStudentInput('text', 'Explain a concept to me.')}>Explain a concept</Chip>
            </div>
          </div>
        )}
      </div>

      {/* ===== Top bar (flex row) ===== */}
      <div className="relative z-30 shrink-0 order-1">
        <div className="mx-2 mt-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4 px-2.5 sm:px-4 h-12">
            <button onClick={onBack} className="shrink-0 grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
            {headerBrand && <div className="shrink-0 flex items-center">{headerBrand}</div>}
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-900 truncate leading-tight">{lessonTitle}</h1>
              {subtitle && <p className="text-[11px] text-slate-500 truncate leading-tight">{subtitle}</p>}
            </div>
            {/* beats (desktop) */}
            {hasPlan && beats && <div className="hidden lg:flex mx-auto min-w-0 max-w-[46%] overflow-x-auto">{beats}</div>}
            <div className="shrink-0 ml-auto flex items-center gap-1.5 sm:gap-2.5">
              {/* Transcript trigger — header icon at ALL sizes (R1 2026-07-14;
                  the old md+ bottom-left floating chip covered board ink and
                  is gone). */}
              <button
                onClick={() => setDrawerOpen(true)}
                title="Transcript"
                className="relative grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600"
              >
                <MessageSquareText className="w-5 h-5" />
                {transcriptCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">{transcriptCount}</span>
                )}
              </button>
              <div className="hidden sm:block">{controls}</div>
              {adaptiveMenu}
              {endControl}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Student tools cluster (top-right) ===== */}
      {/* Drop below the board-page switcher when it's shown — the switcher pill
          (top-center, up to 360px wide) otherwise collides with this cluster on
          narrow screens. Mirrors the board's pt-28/pt-16 padding. */}
      <div className={`absolute ${showSwitcher ? 'top-28' : 'top-16'} right-2 z-20`}>
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white border border-slate-200 shadow-md p-1.5">
          <ToolBtn active={tool === 'draw'} title="Draw" onClick={() => setTool(tool === 'draw' ? null : 'draw')}><Pencil className="w-[18px] h-[18px]" /></ToolBtn>
          {onToggleBoardPen && (
            <ToolBtn active={!!boardPenActive} title="Draw on the board" onClick={onToggleBoardPen}>
              <PenLine className="w-[18px] h-[18px]" />
            </ToolBtn>
          )}
          <ToolBtn active={tool === 'text'} title="Text note" onClick={() => setTool(tool === 'text' ? null : 'text')}><span className="font-bold text-sm">Aa</span></ToolBtn>
          <label title="Upload a problem" className="grid place-items-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"><Camera className="w-[18px] h-[18px]" /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, onStudentInput)} /></label>
          {/* Fullscreen — gate by CAPABILITY, not viewport width: the old
              `hidden md:` gate also hid it inside the portal's <768px embed
              iframe (the iframe's own viewport is what md: measures), which
              is exactly where students need it. document.fullscreenEnabled
              is false on iPhone Safari (no Fullscreen API on non-video
              elements) and false in an iframe without allowfullscreen, so
              the dead-no-op cases stay hidden automatically. */}
          {canFullscreen && (
            <>
              <div className="w-6 h-px bg-slate-200 my-0.5" />
              <ToolBtn title="Full screen" onClick={toggleFullscreen}><Maximize2 className="w-[18px] h-[18px]" /></ToolBtn>
            </>
          )}
          {/* Mobile expand (Task E8) — shown only where the native Fullscreen
              API can't run (see canExpand above); mutually exclusive with the
              button above. Toggles to a collapse affordance while expanded;
              the portal owns the actual visual growth. */}
          {canExpand && (
            <>
              <div className="w-6 h-px bg-slate-200 my-0.5" />
              <ToolBtn active={expanded} title={expanded ? 'Exit expanded view' : 'Expand'} onClick={expanded ? requestCollapse : requestExpand}>
                {expanded ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
              </ToolBtn>
            </>
          )}
        </div>
      </div>

      {/* ===== Slim board page switcher (top-center) — only when the
              chromeless board has >1 page. Shows the current board's title +
              "n / N" with prev/next; the WhiteboardCanvas's own page bar is
              suppressed (chrome="minimal"). ===== */}
      {showSwitcher && boardPages && (
        <div ref={switcherRef} className="absolute top-[58px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          {/* FIXED-width pill so it never jitters as titles change on page
              turns. The middle label is a button → opens a jump-to-page list. */}
          <div className="flex items-center gap-0.5 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-md pl-1 pr-1 py-1 w-[min(86vw,360px)]">
            <button
              onClick={() => { setSwitcherOpen(false); boardPages.goTo(boardPages.index - 1); }}
              disabled={boardPages.index === 0}
              className="shrink-0 grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30"
              title="Previous board"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-1 h-7 rounded-full hover:bg-slate-50"
              title="Jump to a board"
            >
              <span className="truncate text-xs font-medium text-slate-700">
                {formatBoardTitle(boardPages.titles[boardPages.index]) || `Board ${boardPages.index + 1}`}
              </span>
              <span className="shrink-0 text-[11px] font-semibold tabular-nums text-slate-400">
                {boardPages.index + 1}/{boardPages.count}
              </span>
              <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-slate-400 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => { setSwitcherOpen(false); boardPages.goTo(boardPages.index + 1); }}
              disabled={boardPages.index >= boardPages.count - 1}
              className="shrink-0 grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30"
              title="Next board"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Jump-to-page dropdown. Outside-click close is handled by the
              document pointerdown listener above (keyed to switcherRef). */}
          {switcherOpen && (
            <>
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-[min(86vw,360px)] max-h-[50vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5">
                {boardPages.titles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { boardPages.goTo(i); setSwitcherOpen(false); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs ${
                      i === boardPages.index ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="shrink-0 inline-grid place-items-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold tabular-nums text-slate-500">{i + 1}</span>
                    <span className="truncate">{formatBoardTitle(t) || `Board ${i + 1}`}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* tool overlays */}
      {tool === 'draw' && <DrawPad onClose={() => setTool(null)} onSubmit={(d) => { onStudentInput('drawing', d); setTool(null); }} />}
      {tool === 'text' && <TextNote onClose={() => setTool(null)} onSubmit={(t) => { onStudentInput('text', t); setTool(null); }} />}

      {/* ===== Question pin — gist of the tutor's current ask, top-center
              over the board (drops below the page switcher when shown). An
              overlay, so it never collides with board ink. ===== */}
      {questionPin && (
        <div className={`absolute ${showSwitcher ? 'top-[100px]' : 'top-16'} left-1/2 -translate-x-1/2 z-20 max-w-[min(88vw,560px)]`}>
          {questionPin}
        </div>
      )}

      {/* ===== FLOATING TUTOR BAR — the Caption Strip and the voice dock in
              ONE translucent card OVERLAYING the board's bottom edge. They
              were two stacked flex rows below the board, which starved the
              board of height in laptop-sized iframes (2026-07-14 APUSH live
              test) — now the board row runs to the stage bottom and its ink
              stays readable through the 40%-white surface. Deliberately
              translucent at ALL times (product call, 2026-07-14) — no
              idle-fade behavior. Honors the bottom safe-area inset. ===== */}
      <div className="absolute inset-x-0 bottom-[calc(0.5rem_+_env(safe-area-inset-bottom))] z-30 flex justify-center pointer-events-none">
        <div className="w-[min(96vw,640px)] px-2 pointer-events-auto">
          {/* ONE-LINE slim bar (R1 2026-07-14): [mic][caption][input][send]
              [mute] — the caption rides inside the dock as VTR's captionSlot
              (composed in TutorSession; it doubles as the mic-state line when
              there's no caption). End/Pause lives in the header. NO blur —
              blur is what made board text behind the bar unreadable; plain
              65% white keeps it legible. Board ink can always be scrolled
              fully above the bar (WhiteboardCanvas scroll headroom). */}
          <div className="rounded-[24px] bg-white/65 border border-slate-200/80 shadow-lg overflow-hidden">
          <div className="px-2 sm:px-3 py-0.5">
            {voiceInput}
            {/* Quick-Actions chips (Skip / I'm stuck / quick answers) — HIDDEN
                per 2026-06-24 ear-test; flip SHOW_QUICK_ACTIONS to restore. */}
            {SHOW_QUICK_ACTIONS && quickActions && (
              <div className="flex justify-center px-3 py-2 border-t border-slate-100">
                {quickActions}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* ===== Transcript drawer ===== */}
      {drawerOpen && <div className="absolute inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />}
      {/* On phones the CLOSED drawer is display:none, NOT just translated
          off-canvas. iOS Safari does not reliably clip a translated-off-screen
          child of a `fixed overflow-hidden` ancestor, so a translateY(100%)
          drawer leaked BELOW the dock, grew the document's scroll height (top
          bar scrolled away), and couldn't be dismissed (it was already in the
          "closed" state). `hidden` removes it from layout entirely. Desktop
          keeps the slide-in-from-right via translate-x. */}
      <div className={`absolute z-50 bg-white shadow-2xl flex-col transition-transform duration-300 inset-x-0 top-[16dvh] bottom-0 pb-[env(safe-area-inset-bottom)] rounded-t-3xl md:top-0 md:left-auto md:right-0 md:w-[380px] md:rounded-none md:rounded-l-3xl ${drawerOpen ? 'flex translate-y-0 md:translate-x-0' : 'hidden md:flex translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        <div className="md:hidden flex justify-center pt-2.5 shrink-0"><span className="w-10 h-1.5 rounded-full bg-slate-300" /></div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><MessageSquareText className="w-4 h-4 text-slate-400" /> Transcript</h2>
          <button onClick={() => setDrawerOpen(false)} className="grid place-items-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
        </div>
        {/* TranscriptView is `h-full overflow-y-auto`. A flex-1 parent's
            percentage-height doesn't always resolve (flexbox gotcha), which
            left it unscrollable. Anchor it absolutely inside a relative flex
            item so its parent has a DEFINITE pixel height → h-full + scroll work. */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0">{transcript}</div>
        </div>
      </div>
    </div>
  );
}

/** Caption Strip ticker — shows the END of the tutor's live sentence on a
 *  single line, trimmed at WORD boundaries: a leading "… " then whole words
 *  that fit the available width, ending on a complete word (so nothing is cut
 *  mid-word and the end never slides under the waveform). */
let _capMeasureCanvas: HTMLCanvasElement | null = null;
export function CaptionTicker({ text, getSpoken }: { text: string; getSpoken?: () => SpokenCaption | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('');
  // How many characters of `text` are "revealed" so far (typewriter mode). A
  // typewriter advances this toward text.length at roughly speech pace, so the
  // caption STREAMS in word-by-word as the tutor talks instead of snapping in
  // whole sentences.
  const [revealed, setRevealed] = useState(0);
  // Poll mode substitutes the revealed string wholesale (the tracker's text
  // may differ slightly from `text` mid-turn); typewriter mode reveals a
  // prefix of `text`. `shown` unifies the two for the width-fit effect.
  const [polled, setPolled] = useState<string | null>(null);
  const revealedRef = useRef(0);
  const prevTextRef = useRef('');

  // ── Audio-locked poll mode ────────────────────────────────────────
  // `polling` is STATE (not a ref) so the typewriter effect below re-runs
  // and shuts off as soon as the probe succeeds — a ref read during render
  // would leave both reveal drivers running for a frame.
  const [polling, setPolling] = useState(false);
  useEffect(() => {
    if (!getSpoken) { setPolling(false); return; }
    // Probe once: null = unsupported engine → typewriter path below.
    const probe = getSpoken();
    if (probe === null) { setPolling(false); setPolled(null); return; }
    setPolling(true);
    // Seed from the probe so the first ~100ms doesn't flash the full text
    // (shown falls back to `text` while polled is null).
    setPolled(probe.live ? probe.text : null);
    const id = setInterval(() => {
      const c = getSpoken();
      if (c === null) return; // engine flipped mid-session — hold last
      // live: show the tracker's reveal. Not live (finalized turn, page
      // reload, between turns): show the full caption text instantly.
      setPolled(c.live ? c.text : null);
      if (!c.live) { revealedRef.current = 0; }
    }, 100);
    return () => clearInterval(id);
  }, [getSpoken]);

  // ── Legacy typewriter (flag off / unsupported engine) ─────────────
  useEffect(() => {
    if (polling) return;
    // Reset (retype from 0) ONLY on a genuinely new turn — i.e. the new text
    // shares almost no prefix with the previous one. Same-turn streaming keeps
    // a long common prefix, INCLUDING the case where markdown-stripping removes
    // a mid-string "*" (which makes the caption briefly non-monotonic) — a plain
    // startsWith check would mis-fire there and re-type the sentence repeatedly.
    const prev = prevTextRef.current;
    prevTextRef.current = text;
    let common = 0;
    const n = Math.min(prev.length, text.length);
    while (common < n && prev.charCodeAt(common) === text.charCodeAt(common)) common++;
    const newTurn = prev.length > 8 && common < 8;
    let start = newTurn ? 0 : revealedRef.current;
    if (start > text.length) start = text.length;
    revealedRef.current = start;
    setRevealed(start);
    if (start >= text.length) return;
    // ~14 chars/sec ≈ natural TTS speaking rate, so the caption tracks the audio
    // instead of racing ahead of it (48ms/char read visibly faster than the
    // tutor spoke — 2026-06-24 ear-test). Not perfectly audio-locked (we don't
    // have per-word playback timestamps), but the pace now matches.
    const id = setInterval(() => {
      const next = Math.min(text.length, revealedRef.current + 1);
      revealedRef.current = next;
      setRevealed(next);
      if (next >= text.length) clearInterval(id);
    }, 85);
    return () => clearInterval(id);
  }, [text, polling]);

  const shown = polling ? (polled ?? text) : text.slice(0, revealed);

  // ── Width-fit trailing words (UNCHANGED except reading `shown`) ────
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof document === 'undefined') { setDisplay(shown); return; }
    const width = el.clientWidth;
    if (!width) { setDisplay(shown); return; }
    const cs = window.getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    _capMeasureCanvas ||= document.createElement('canvas');
    const ctx = _capMeasureCanvas.getContext('2d');
    if (!ctx) { setDisplay(shown); return; }
    ctx.font = font;
    if (ctx.measureText(shown).width <= width) { setDisplay(shown); return; }
    const words = shown.split(/\s+/).filter(Boolean);
    const ell = '… ';
    let tail = '';
    for (let i = words.length - 1; i >= 0; i--) {
      const cand = words[i] + (tail ? ' ' + tail : '');
      if (ctx.measureText(ell + cand).width > width) break;
      tail = cand;
    }
    setDisplay(tail ? ell + tail : ell + (words[words.length - 1] ?? shown));
  }, [shown]);

  return (
    <div ref={ref} className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-sm text-slate-700">
      {display}
    </div>
  );
}

/** Tidy a board-page title for the switcher: strip raw LaTeX the brain
 *  sometimes emits without $ delimiters (stripLatexForTitle — see
 *  board-title.ts), then trim + collapse whitespace.
 *  (Stage prefixes — "Hook:", "Concept:", "Try:" … — would need the segment
 *  KIND plumbed onto the page title; not available here yet. This remains
 *  the hook point for that future enrichment.) */
function formatBoardTitle(t: string | undefined): string {
  return stripLatexForTitle(t);
}

/** A small VU meter. When `speaking` (tutor) the bars run a decorative wave;
 *  otherwise the bar heights track `level` (0..1) — the student's live mic
 *  amplitude — so they can SEE they're being heard. `large` = presence size. */
export function MicMeter({ level, speaking, large = false }: { level: number; speaking: boolean; large?: boolean }) {
  const variance = large ? [0.55, 0.85, 1, 0.7, 0.95, 0.6, 0.8] : [0.6, 1, 0.72, 0.9];
  const barW = large ? 'w-1.5' : 'w-1';
  return (
    <div className={`flex items-center shrink-0 ${large ? 'gap-1.5 h-8' : 'gap-0.5 h-4'}`}>
      {variance.map((v, i) => speaking ? (
        <span key={i} className={`${barW} h-full rounded-full bg-blue-500 ss-wave`} style={{ animationDelay: `${i * 0.13}s` }} />
      ) : (
        <span
          key={i}
          className={`${barW} rounded-full bg-blue-500`}
          style={{ height: `${Math.max(14, Math.min(100, 14 + level * 86 * v))}%`, transition: 'height 70ms linear' }}
        />
      ))}
    </div>
  );
}

function Chip({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-full bg-white border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">{children}</button>;
}
function ToolBtn({ children, title, active, onClick }: { children: ReactNode; title: string; active?: boolean; onClick: () => void }) {
  return <button title={title} onClick={onClick} className={`grid place-items-center w-9 h-9 rounded-xl ${active ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}>{children}</button>;
}

function handleImage(e: React.ChangeEvent<HTMLInputElement>, onStudentInput: (t: 'image', c: string) => void) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { if (typeof reader.result === 'string') onStudentInput('image', reader.result); };
  reader.readAsDataURL(file);
  e.target.value = '';
}

/** Overlay drawing pad — student draws, submitted to the tutor as an image. */
function DrawPad({ onClose, onSubmit }: { onClose: () => void; onSubmit: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [pen, setPen] = useState<'pen' | 'eraser'>('pen');
  const penRef = useRef(pen);
  useEffect(() => { penRef.current = pen; }, [pen]);

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };
  const down = (e: React.PointerEvent) => { drawing.current = true; const c = canvasRef.current!; const ctx = c.getContext('2d')!; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!; const p = pos(e);
    if (penRef.current === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = 18; }
    else { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.5; }
    ctx.lineCap = 'round'; ctx.lineTo(p.x, p.y); ctx.stroke();
  };
  const up = () => { drawing.current = false; };
  const clear = () => { const c = canvasRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); };

  return (
    <div className="absolute inset-0 z-[45] grid place-items-center bg-slate-900/20 backdrop-blur-[2px] p-4" onClick={onClose}>
      <div className="w-[min(92vw,640px)] rounded-2xl bg-white border border-slate-200 shadow-2xl p-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-sm font-semibold text-slate-700">Draw your work</span>
          <button onClick={onClose} className="grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
        </div>
        <canvas ref={canvasRef} width={1024} height={420} className="w-full h-[260px] rounded-xl border border-slate-200 bg-white touch-none cursor-crosshair" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => setPen('pen')} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm ${pen === 'pen' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}><Pencil className="w-4 h-4" /> Pen</button>
          <button onClick={() => setPen('eraser')} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm ${pen === 'eraser' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}><Eraser className="w-4 h-4" /> Eraser</button>
          <button onClick={clear} className="ml-auto px-2.5 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100">Clear</button>
          <button onClick={() => onSubmit(canvasRef.current!.toDataURL('image/png'))} className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Send to tutor</button>
        </div>
      </div>
    </div>
  );
}

/** Quick text note overlay. */
function TextNote({ onClose, onSubmit }: { onClose: () => void; onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <div className="absolute inset-0 z-[45] grid place-items-center bg-slate-900/20 backdrop-blur-[2px] p-4" onClick={onClose}>
      <form className="w-[min(92vw,520px)] rounded-2xl bg-white border border-slate-200 shadow-2xl p-3" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (text.trim()) onSubmit(text.trim()); }}>
        <div className="flex items-center justify-between mb-2 px-1"><span className="text-sm font-semibold text-slate-700">Write a note</span><button type="button" onClick={onClose} className="grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button></div>
        <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your answer or notes…" className="w-full h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 resize-none" />
        <div className="flex justify-end mt-2"><button type="submit" disabled={!text.trim()} className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300">Send to tutor</button></div>
      </form>
    </div>
  );
}
