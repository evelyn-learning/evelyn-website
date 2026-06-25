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
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, Pencil, Eraser, Camera, Maximize2,
  MessageSquareText, X, Target, Upload, ArrowDown, ChevronUp,
} from 'lucide-react';

export type VoiceState = 'idle' | 'listening' | 'hearing' | 'processing' | 'speaking' | 'thinking' | 'muted' | 'error';

/** Hide the in-panel Quick-Actions chips for now — the caption + chips + dock
 *  got too crowded (2026-06-24 ear-test, Images 16/17). Flip to true to restore
 *  the Skip / I'm stuck / quick-answer chips above the dock. */
const SHOW_QUICK_ACTIONS = false;

export interface SessionStageProps {
  lessonTitle: string;
  subtitle?: ReactNode;
  hasPlan: boolean;
  isFreePractice: boolean;
  objective?: string;            // current LO / goal chip text
  beats?: ReactNode;             // <LessonPlanProgress/> (restyled host)
  controls?: ReactNode;          // <SessionControls/> (timer / end / upload)
  adaptiveMenu?: ReactNode;      // the pacing ⋯ menu element
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
   *  practice). Auto-opens the drawer once so the choices aren't buried. */
  nudgeActive?: boolean;
  quickActions?: ReactNode;      // promoted chips (optional)
  // student tools → existing onStudentInput pipeline
  onStudentInput: (type: 'text' | 'drawing' | 'image', content: string) => void;
  onBack?: () => void;
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
    lessonTitle, subtitle, hasPlan, isFreePractice, objective, beats, controls, adaptiveMenu,
    voiceState, micLevelRef, listeningHint, started = false, liveCaption, boardEmpty, board, boardPages, voiceInput, transcript, transcriptCount = 0,
    nudgeActive = false, quickActions, onStudentInput, onBack,
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tool, setTool] = useState<null | 'draw' | 'text'>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const animate = voiceState === 'speaking' || voiceState === 'listening' || voiceState === 'hearing';

  // Auto-open the transcript drawer once when the tutor offers the lesson
  // picker (free practice) — otherwise the topic/lesson choices are hidden.
  const nudgeAutoOpenedRef = useRef(false);
  useEffect(() => {
    if (nudgeActive && !nudgeAutoOpenedRef.current) {
      nudgeAutoOpenedRef.current = true;
      setDrawerOpen(true);
    } else if (!nudgeActive) {
      nudgeAutoOpenedRef.current = false;
    }
  }, [nudgeActive]);
  const stageRef = useRef<HTMLDivElement>(null);
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
    <div ref={stageRef} className="fixed inset-0 overflow-hidden bg-white select-none session-stage">
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

      {/* ===== Board stage (full-bleed grid, readable centered column) ===== */}
      <div className="absolute inset-0 ss-grid">
        {/* The grid is full-bleed, but the board CONTENT sits in a centered,
            readable column (word problems / prose shouldn't stretch edge-to-
            edge). Bottom padding reserves room so the dock + overlays never
            cover board content. */}
        <div className={`absolute inset-0 ${showSwitcher ? 'pt-28' : 'pt-16'} pb-52 px-2 sm:px-0 flex justify-center`}>
          {/* Once there's content, frame the board as a bounded white "sheet"
              on the grid so the student can see the content boundary BEFORE a
              scrollbar appears (Images 2/3, 2026-06-24). Empty board stays
              transparent — the presence overlay owns that state. */}
          <div className={`w-full max-w-3xl h-full ${boardEmpty ? '' : 'rounded-2xl bg-white/85 border border-slate-200 shadow-sm overflow-hidden'}`}>{board}</div>
        </div>

        {/* presence overlay when the board is empty */}
        {boardEmpty && (
          <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 pt-16 pb-32 pointer-events-none">
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

      {/* ===== Floating top bar ===== */}
      <div className="absolute top-0 inset-x-0 z-30">
        <div className="mx-2 mt-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4 px-2.5 sm:px-4 h-12">
            <button onClick={onBack} className="shrink-0 grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-900 truncate leading-tight">{lessonTitle}</h1>
              {subtitle && <p className="text-[11px] text-slate-500 truncate leading-tight">{subtitle}</p>}
            </div>
            {/* beats (desktop) */}
            {hasPlan && beats && <div className="hidden lg:flex mx-auto min-w-0 max-w-[46%] overflow-x-auto">{beats}</div>}
            <div className="shrink-0 ml-auto flex items-center gap-1.5 sm:gap-2.5">
              {/* Transcript trigger lives in the top bar on phones (below md):
                  the bottom-left floating chip below would otherwise sit on top
                  of the dock's full-width text input row and clip its
                  placeholder. The floating chip stays for md+ where the dock is
                  a narrow centered island and the two never collide. */}
              <button
                onClick={() => setDrawerOpen(true)}
                title="Transcript"
                className="md:hidden relative grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600"
              >
                <MessageSquareText className="w-5 h-5" />
                {transcriptCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">{transcriptCount}</span>
                )}
              </button>
              <div className="hidden sm:block">{controls}</div>
              {adaptiveMenu}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Student tools cluster (top-right) ===== */}
      <div className="absolute top-16 right-2 z-20">
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white border border-slate-200 shadow-md p-1.5">
          <ToolBtn active={tool === 'draw'} title="Draw" onClick={() => setTool(tool === 'draw' ? null : 'draw')}><Pencil className="w-[18px] h-[18px]" /></ToolBtn>
          <ToolBtn active={tool === 'text'} title="Text note" onClick={() => setTool(tool === 'text' ? null : 'text')}><span className="font-bold text-sm">Aa</span></ToolBtn>
          <label title="Upload a problem" className="grid place-items-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"><Camera className="w-[18px] h-[18px]" /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, onStudentInput)} /></label>
          {/* Fullscreen — iOS Safari (iPhone) has no Fullscreen API on
              non-video elements, so the button is a dead no-op there. Show it
              only md+ (desktop / iPad, where webkit fullscreen works).
              md:contents keeps the divider+button in the cluster's flex flow. */}
          <div className="hidden md:contents">
            <div className="w-6 h-px bg-slate-200 my-0.5" />
            <ToolBtn title="Full screen" onClick={toggleFullscreen}><Maximize2 className="w-[18px] h-[18px]" /></ToolBtn>
          </div>
        </div>
      </div>

      {/* Board-switcher dropdown click-catcher — at the STAGE ROOT (not inside
          the translated switcher pill) so it actually covers the whole stage,
          incl. the whiteboard. z-10 = above the board, below the switcher (z-20)
          + dock (z-30), so the dropdown list and dock stay clickable. */}
      {switcherOpen && <div className="absolute inset-0 z-10" onClick={() => setSwitcherOpen(false)} />}

      {/* ===== Slim board page switcher (top-center) — only when the
              chromeless board has >1 page. Shows the current board's title +
              "n / N" with prev/next; the WhiteboardCanvas's own page bar is
              suppressed (chrome="minimal"). ===== */}
      {showSwitcher && boardPages && (
        <div className="absolute top-[58px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
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
          {/* Jump-to-page dropdown (the click-catcher lives at the stage root —
              a `fixed` element inside this -translate-x parent would be sized to
              the pill, not the viewport, and never cover the board). */}
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

      {/* ===== TUTOR PANEL — ONE cohesive card above the dock holding the
              Caption Strip (ticker, scrolls to the trailing question) and the
              Quick Actions row. Anchored at a fixed bottom offset so it never
              bobs; chips fade in/out WITHIN the card (one element, not two
              separate popping boxes). Drawn-board only — the empty board shows
              the big presence caption instead. ===== */}
      {/* Caption strip sits just above the dock. The dock is TALLER on phones
          (the text input wraps to its own row below md, ~150px) than on desktop
          (one ~80px row), so the from-bottom offset is larger below md to clear
          it — otherwise the caption tucks behind the dock and the tutor's live
          sentence is hidden. Both honor the bottom safe-area inset. */}
      {liveCaption && (
        <div className="absolute bottom-[calc(176px_+_env(safe-area-inset-bottom))] md:bottom-[calc(124px_+_env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 w-[min(96vw,640px)]">
          <div className="ss-cap w-full rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg overflow-hidden">
            {/* CAPTION STRIP — the tutor's last sentence/question (tap → full
                transcript). Single thin line so the panel never crowds. The
                Quick-Actions chips (Skip / I'm stuck / quick answers) are HIDDEN
                for now per 2026-06-24 ear-test (the panel got too busy, Images
                16/17) — flip SHOW_QUICK_ACTIONS to bring them back. `quickActions`
                still flows in so re-enabling is a one-line change. */}
            <button type="button" onClick={() => setDrawerOpen(true)} title="Open transcript" className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50/70 transition-colors">
              <div className={`shrink-0 w-8 h-8 rounded-full grid place-items-center text-white bg-gradient-to-br ${ORB_STYLE[voiceState]}`}><Sparkles className="w-4 h-4" /></div>
              <CaptionTicker text={liveCaption} />
              {voiceState === 'speaking'
                ? <MicMeter level={0} speaking />
                : <ChevronUp className="w-4 h-4 shrink-0 text-slate-300" />}
            </button>
            {SHOW_QUICK_ACTIONS && quickActions && (
              <div className="flex justify-center px-3 py-2 border-t border-slate-100">
                {quickActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Transcript toggle ===== */}
      <button onClick={() => setDrawerOpen(true)} className="hidden md:inline-flex absolute bottom-4 left-3 z-40 items-center gap-2 rounded-full bg-white border border-slate-200 shadow-md px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <MessageSquareText className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline">Transcript</span>
        {transcriptCount > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">{transcriptCount}</span>}
      </button>

      {/* ===== Voice dock (floating island) ===== */}
      <div className="absolute bottom-[calc(0.75rem_+_env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 w-[min(96vw,640px)]">
        <div className="rounded-[24px] bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl px-2 sm:px-3 py-1.5">
          {/* "Being heard" status row — lives in the dock, next to the mic, so
              the caption strip above stays free for the tutor's question. Shows
              the live mic meter + the perception states the mic button doesn't
              convey (Hearing you / Got that / didn't catch / Muted). The row
              keeps a FIXED height once started so the dock never grows/shrinks
              (and overlaps the caption) as the status appears/disappears. */}
          {started && (
            <div className="flex items-center justify-center gap-2 h-5">
              {(voiceState === 'listening' || voiceState === 'hearing' || voiceState === 'processing' || voiceState === 'muted' || listeningHint === 'didnt-catch') && (<>
                {voiceState !== 'muted' && <MicMeter level={micLevel} speaking={false} />}
                {(() => {
                  if (listeningHint === 'didnt-catch') return <span className="text-xs font-medium text-amber-600">Didn’t catch that — mind repeating?</span>;
                  if (voiceState === 'hearing') return <span className="text-xs font-medium text-blue-600">Hearing you…</span>;
                  if (voiceState === 'processing') return <span className="text-xs font-medium text-amber-600">Got that — one sec…</span>;
                  if (voiceState === 'muted') return <span className="text-xs font-medium text-slate-500">Muted — tap the mic to talk</span>;
                  return <span className="text-xs font-medium text-slate-400">Listening…</span>;
                })()}
              </>)}
            </div>
          )}
          {voiceInput}
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
function CaptionTicker({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('');
  // How many characters of `text` are "revealed" so far. A typewriter advances
  // this toward text.length at roughly speech pace, so the caption STREAMS in
  // word-by-word as the tutor talks instead of snapping in whole sentences.
  const [revealed, setRevealed] = useState(0);
  const revealedRef = useRef(0);
  const prevTextRef = useRef('');

  useEffect(() => {
    const prev = prevTextRef.current;
    prevTextRef.current = text;
    // Reset (retype from 0) ONLY on a genuinely new turn — i.e. the new text
    // shares almost no prefix with the previous one. Same-turn streaming keeps
    // a long common prefix, INCLUDING the case where markdown-stripping removes
    // a mid-string "*" (which makes the caption briefly non-monotonic) — a plain
    // startsWith check would mis-fire there and re-type the sentence repeatedly.
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
  }, [text]);

  // Show the trailing words of the revealed prefix that fit one line.
  useEffect(() => {
    const shown = text.slice(0, revealed);
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
  }, [text, revealed]);

  return (
    <div ref={ref} className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-sm text-slate-700">
      {display}
    </div>
  );
}

/** Tidy a board-page title for the switcher: trim + collapse whitespace.
 *  (Stage prefixes — "Hook:", "Concept:", "Try:" … — would need the segment
 *  KIND plumbed onto the page title; not available here yet, so this is a
 *  no-op normalizer that's the hook for that future enrichment.) */
function formatBoardTitle(t: string | undefined): string {
  return (t || '').replace(/\s+/g, ' ').trim();
}

/** A small VU meter. When `speaking` (tutor) the bars run a decorative wave;
 *  otherwise the bar heights track `level` (0..1) — the student's live mic
 *  amplitude — so they can SEE they're being heard. `large` = presence size. */
function MicMeter({ level, speaking, large = false }: { level: number; speaking: boolean; large?: boolean }) {
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
