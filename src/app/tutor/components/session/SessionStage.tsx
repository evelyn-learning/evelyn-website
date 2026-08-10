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

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, Pencil, PenLine, Eraser, Camera, Maximize2, Minimize2,
  MessageSquareText, X, Target, Upload, ArrowDown, Wrench, ListChecks, Loader2,
} from 'lucide-react';
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
import type { MockReviewAgendaItem, MockReviewDrawerRow } from '@/lib/tutor/mock-exam/review-focus';
import { stripLatexForTitle } from '@/lib/tutor/whiteboard/board-title';
import { InlineMathText } from '../whiteboard/InlineMathText';
import {
  captionMeasureProxy,
  tokenizeCaptionMathAtomic,
  holdBackUnbalancedMathTail,
  normalizeCaptionMath,
} from '@/lib/tutor/whiteboard/caption-fit';
import { qpinCollapseDeadline, exceedsDragThreshold, clampQpinFraction, type QpinFraction } from '@/lib/tutor/qpin-behavior';
import { orbIsStartButton } from './prestart-affordances';

// 'manual-held' (R34 T4): Manual mic mode has a buffered, unsent turn —
// the resting state in place of 'listening' while the student owns the
// floor and has words parked waiting for a tap-to-send.
export type VoiceState = 'idle' | 'listening' | 'hearing' | 'processing' | 'speaking' | 'thinking' | 'muted' | 'manual-held' | 'error';

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
  beats?: ReactNode;             // practice meter; legacy plan strip (<LessonPlanProgress/>) only when the agenda rail is off
  /** Agenda rail (2026-08-10): persistent content-labeled progress rail,
   *  horizontal orientation, rendered above the board when not fullscreen.
   *  Absent/undefined ⇒ no rail (flag off, no plan, or single-segment plan). */
  agendaRail?: ReactNode;
  /** Vertical orientation of the same rail data, shown as a left overlay
   *  while the stage is browser-fullscreen. Falls back to `agendaRail` when
   *  absent so callers may pass only one orientation. */
  agendaRailVertical?: ReactNode;
  controls?: ReactNode;          // <SessionControls/> (timer / end / upload)
  adaptiveMenu?: ReactNode;      // the pacing ⋯ menu element
  /** Round-5: compact clock chip for the header row. Rendered sm:hidden so it
   *  complements (never duplicates) the `controls` slot's desktop timer. It is
   *  what let the portal drop its whole countdown ROW on mobile. */
  headerClock?: ReactNode;
  /** R1 (2026-07-14): End/Pause moved OUT of the dock into the header's
   *  right cluster — session-level control, conventional spot, and far from
   *  the textbox where accidental taps happen. Composed by TutorSession
   *  (must run VTR's full endSession teardown via handleRef). */
  endControl?: ReactNode;
  /** Q pin (2026-07-14): gist of the tutor's current question, pinned
   *  top-center over the board after the tutor stops speaking, cleared when
   *  the next turn starts. Composed by TutorSession (owns the gist state). */
  questionPin?: ReactNode;
  /** Turn id of the current question pin — resets collapse/drag state per turn. */
  questionPinKey?: string;
  /** Round-28b: transient voice-hiccup captions pin — board bottom, just
   *  above the floating tutor bar (both voice engines failed a sentence). */
  hiccupPin?: ReactNode;
  // presence
  voiceState: VoiceState;
  /** R35 T-A (demo-polish): show the full-stage "joining" overlay — board +
   *  caption strip + voice dock all dimmed/blocked — while true. Mirrored
   *  from VoiceTutorRealtime's onWarmupOverlayChange via TutorSession; true
   *  only for the first voice mic-click kickoff of a fresh session, cleared
   *  the moment the tutor's audio actually starts (or the 40s warmup
   *  watchdog gives up). Absent/false renders nothing (default no overlay). */
  warmupOverlay?: boolean;
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
   *  its own slim top-center switcher. Undefined / count<=1 → no switcher.
   *  `pendingIndex` (Task X5): a page other than `index` that got new tutor
   *  content while the anti-yank grace held the view here — renders a subtle
   *  dot on the switcher so the student knows to look. null/undefined when
   *  nothing is pending. */
  boardPages?: { index: number; count: number; titles: string[]; goTo: (i: number) => void; pendingIndex?: number | null };
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
  /** Control channel for navigation/selection markers (agenda picks). Unlike
   *  onStudentInput, this does NOT render a "Student wrote:" board card or wrap
   *  the text as a whiteboard action — the marker is relayed verbatim to the
   *  brain and suppressed from the visible transcript. Falls back to
   *  onStudentInput when absent. */
  onControlMessage?: (marker: string) => void;
  /** Mock-review pre-start "review agenda". When non-empty, the generic starter
   *  chips (Upload / Practice / Explain) are REPLACED by a tappable numbered
   *  list of the pinned/missed questions — tapping a row starts the session on
   *  that item (fires its utterance via onStudentInput). Empty ⇒ generic chips. */
  mockAgenda?: MockReviewAgendaItem[];
  /** Muted "+ N more missed in <units>…" line shown under the agenda list;
   *  null when there are no further misses. */
  mockAgendaRemaining?: string | null;
  /** Mid-session Agenda drawer: EVERY miss as a tappable numbered row (focus
   *  items flagged "up next"). Non-empty ⇒ an "Agenda" button appears in the
   *  header that toggles a right-side panel; a row tap fires onPickAgendaItem
   *  and closes the panel. Empty ⇒ no button. */
  mockDrawer?: MockReviewDrawerRow[];
  /** Agenda round 5: drawer rows for every CORRECT (non-miss) item. Rendered
   *  behind a collapsed "Show correct questions too (N)" disclosure below the
   *  miss list; each row taps through the SAME onPickAgendaItem handler. Empty
   *  ⇒ no disclosure. */
  mockCorrectDrawer?: MockReviewDrawerRow[];
  /** Fires with the tapped row's itemId (VoiceTutorRealtime.pickAgendaItem):
   *  switches the tutor to that question, refetching/pinning it when needed. */
  onPickAgendaItem?: (itemId: string) => void;
  /** Agenda round 5: the Agenda drawer's open-state, OWNED by TutorSession
   *  (controlled) so it can auto-open once at mock-review start. When provided,
   *  it overrides the internal state; changes route through
   *  onAgendaDrawerOpenChange. Absent ⇒ SessionStage keeps its own state. */
  agendaDrawerOpen?: boolean;
  onAgendaDrawerOpenChange?: (open: boolean) => void;
  /** One-way latch (agenda round 4): set the instant the student taps a
   *  pre-start agenda row or a drawer row, BEFORE the board renders. While set,
   *  the pre-start hero + starter/agenda cluster collapse to a single muted
   *  "Starting…" line so the list can't be double-tapped in the gap. The board
   *  content appearing (boardEmpty=false) hides the whole overlay as usual. */
  agendaEngaged?: boolean;
  /** Task Y1: true while the "Practice problems" chip's durable override is
   *  set (mirrored from VoiceTutorRealtime via onPracticeOverrideChange).
   *  Drives the chip's active state (Humor ✓ idiom). Absent ⇒ chip never
   *  shows active (caller not wired yet). */
  practiceOverrideActive?: boolean;
  /** Task Y1: fires when a starter chip should flip the durable
   *  practiceOverride — true from "Practice problems", false (clear) from
   *  "Explain a concept". The canned onStudentInput text still fires
   *  alongside this on every click (it cues the brain in-turn); this call
   *  is what makes the mode STICK across turns + resume. */
  onTogglePracticeOverride?: (active: boolean) => void;
  /** E4 (demo feedback R2, user-decided 2026-07-26): true while practice
   *  mode is actually active (derivePracticeMode truth via practiceStats,
   *  OR'd with the override for the pre-stats window). The "Explain a
   *  concept" chip renders ONLY when true — teaching is the default mode,
   *  so pre-practice the chip is redundant; mid-practice it reads as
   *  "back to teaching". */
  practiceModeActive?: boolean;
  // Phase 2 student marks — present only when the feature is enabled
  boardPenActive?: boolean;
  onToggleBoardPen?: () => void;
  /** Start the session from the center orb (2026-07-26 pre-start redesign).
   *  Wired to RealtimeHandle.startSession, which runs the dock mic's own
   *  handler. Absent → the orb stays decorative. Called synchronously from
   *  the orb's onClick so the iOS audio unlock keeps its gesture stack. */
  onOrbStart?: () => void;
}

const ORB_STYLE: Record<VoiceState, string> = {
  speaking: 'from-emerald-300 to-emerald-600',
  listening: 'from-sky-300 to-blue-600',
  hearing: 'from-blue-400 to-indigo-600',
  processing: 'from-amber-200 to-amber-400',
  thinking: 'from-amber-300 to-amber-500',
  muted: 'from-slate-300 to-slate-400',
  'manual-held': 'from-sky-300 to-blue-500',
  idle: 'from-slate-300 to-slate-500',
  error: 'from-rose-300 to-rose-600',
};
const STATE_LABEL: Record<VoiceState, string> = {
  speaking: 'Tutor is speaking', listening: 'Listening…', hearing: 'Hearing you…',
  processing: 'Got that — one sec…', thinking: 'Thinking…',
  muted: 'Muted — tap the mic to talk', 'manual-held': 'Held — tap ✓ to send',
  idle: 'Ready', error: 'Connection issue',
};

/** How long the tapped full-title banner stays up. Long enough to read a
 *  two-line lesson name without becoming something you have to dismiss. */
const TITLE_REVEAL_MS = 4000;

export default function SessionStage(props: SessionStageProps) {
  const {
    lessonTitle, subtitle, headerBrand, hasPlan, isFreePractice, objective, beats, agendaRail, agendaRailVertical, controls, adaptiveMenu, headerClock, endControl, questionPin, questionPinKey, hiccupPin,
    voiceState, warmupOverlay = false, micLevelRef, listeningHint, started = false, liveCaption, boardEmpty, board, boardPages, voiceInput, transcript, transcriptCount = 0,
    quickActions, onStudentInput, onControlMessage,
    mockAgenda, mockAgendaRemaining, mockDrawer, mockCorrectDrawer, onPickAgendaItem, agendaEngaged = false,
    agendaDrawerOpen, onAgendaDrawerOpenChange,
    practiceOverrideActive = false, onTogglePracticeOverride, practiceModeActive = false,
    boardPenActive, onToggleBoardPen, onOrbStart,
  } = props;

  // Round-5: transient full-title reveal (see the header markup below).
  const [titleRevealed, setTitleRevealed] = useState(false);
  const titleRevealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTitle = useCallback(() => {
    if (titleRevealTimerRef.current) {
      clearTimeout(titleRevealTimerRef.current);
      titleRevealTimerRef.current = null;
    }
    setTitleRevealed(false);
  }, []);
  const revealTitle = useCallback(() => {
    // Re-tapping RESTARTS the window rather than stacking timers — otherwise an
    // earlier timeout would dismiss the banner mid-read.
    if (titleRevealTimerRef.current) clearTimeout(titleRevealTimerRef.current);
    setTitleRevealed(true);
    titleRevealTimerRef.current = setTimeout(() => {
      titleRevealTimerRef.current = null;
      setTitleRevealed(false);
    }, TITLE_REVEAL_MS);
  }, []);
  // Never leave a timer running past unmount (it would setState on a dead tree).
  useEffect(() => () => {
    if (titleRevealTimerRef.current) clearTimeout(titleRevealTimerRef.current);
  }, []);
  // Native tooltip for pointer devices, where hovering is the natural gesture.
  // Only meaningful when the title is a plain string; ReactNode titles skip it.
  const titleTooltip = typeof lessonTitle === 'string' ? lessonTitle : undefined;

  const showSwitcher = !!boardPages && boardPages.count > 1;

  // Poll the student-mic amplitude into local state ONLY while the mic could be
  // active (listening/hearing), so the VU meter is live without re-rendering
  // the whole stage the rest of the time. Smoothed for a natural feel.
  const [micLevel, setMicLevel] = useState(0);
  // 'manual-held' still reacts — the mic is open, the student just has a
  // buffered turn waiting on tap-to-send, not a mute.
  const reactsToMic = voiceState === 'listening' || voiceState === 'hearing' || voiceState === 'manual-held';
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
  // Round-6e: announce every drawer OPEN so TranscriptView can snap to the
  // latest message. Two rounds of transition-detection (ResizeObserver on
  // the hidden→visible flip, immediate then 220ms-delayed) worked in a
  // minimal Chromium repro yet failed on real devices — engine-specific RO
  // delivery on display:none subtrees is exactly the kind of thing to stop
  // depending on. The opener KNOWS it opened; say so. (Covers the header
  // icon, the caption tap, and the q-pin bridge alike — the q-pin's own
  // entryId deep-link wins inside TranscriptView via its pending marker.)
  useEffect(() => {
    if (drawerOpen) window.dispatchEvent(new Event('evelyn:transcript-drawer-opened'));
  }, [drawerOpen]);
  // Mid-session Agenda drawer (mock-review): a right-side panel listing every
  // miss. Closed by default; the header Agenda button toggles it. Controlled by
  // TutorSession when agendaDrawerOpen is provided (agenda round 5 auto-open),
  // else self-owned. setAgendaOpen routes to whichever owns the state.
  const [agendaOpenInternal, setAgendaOpenInternal] = useState(false);
  const agendaOpen = agendaDrawerOpen ?? agendaOpenInternal;
  const setAgendaOpen = useCallback((open: boolean) => {
    if (onAgendaDrawerOpenChange) onAgendaDrawerOpenChange(open);
    else setAgendaOpenInternal(open);
  }, [onAgendaDrawerOpenChange]);
  // Agenda round 5: the drawer's "show correct questions too" disclosure state.
  const [showCorrectQuestions, setShowCorrectQuestions] = useState(false);
  const showAgendaButton = !!mockDrawer && mockDrawer.length > 0;
  // Pre-start + drawer open ⇒ the center agenda list would DUPLICATE the drawer
  // (both showed side by side, live screenshot). Collapse the center list to a
  // single hint line then; the drawer is the agenda surface.
  const agendaDrawerOpenPreStart = agendaOpen && !started && !agendaEngaged;
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
  // Tools cluster collapse-to-FAB (Task T1, 2026-07-16): the always-expanded
  // icon column occluded board content on phones (IMG_7803). The FAB expands
  // the SAME column in the SAME anchored spot (it only grows downward, never
  // shifting position), and collapses again on a second FAB tap or on
  // launching a tool (Draw / board-pen / Text note / Camera). Fullscreen and
  // the E8 expand button are deliberately NOT wired to auto-collapse — their
  // onClick handlers must stay byte-identical; only their visibility (inside
  // the expanded column) changes.
  // R40 (user call): default OPEN on mount — students never discovered the
  // fullscreen/tools buttons behind the bare wrench. The R35 outside-tap
  // dismiss still collapses it on the first touch anywhere else, so the
  // phone-occlusion concern T1 fixed only lasts until first interaction.
  const [toolsOpen, setToolsOpen] = useState(true);
  // R40b (embed-1785813017376): the Start tap is itself an "outside tap", so
  // the R35 dismiss collapsed the default-open cluster at the exact moment the
  // session began — open pre-start, gone once it mattered. Re-open when the
  // session starts; the student's next outside tap collapses it as usual.
  useEffect(() => {
    if (started) setToolsOpen(true);
  }, [started]);
  // R35 T-C: close the tools cluster on any pointerdown outside its container
  // (FAB + expanded column together — ref-containment pattern matches
  // switcherRef below). Without this, tapping the whiteboard or anywhere
  // else left the wrench cluster open (2026-07 demo feedback). Also mirrors
  // TutorSession's pacing ⋯ menu (pacingMenuOpen/pacingMenuRef): Escape, AND
  // a window 'blur' fallback — in the embedded demo, a click on the PARENT
  // marketing page (outside this iframe entirely) never fires a pointerdown
  // on THIS document, but it does steal window focus, so blur is the only
  // signal reachable here. The plain switcherRef pattern below doesn't need
  // that (its popover isn't the one this feedback item is about).
  const toolsClusterRef = useRef<HTMLDivElement>(null);
  // B4 (embed-1785972176560): the mute button lives in the floating dock — a
  // sibling overlay, not a descendant of toolsClusterRef — so a tap on mute
  // bubbled to this document pointerdown listener, read as "outside", and
  // collapsed the cluster before the button's own onClick fired. The R40b
  // one-shot re-open (above) only covers the Start tap; mute is tapped
  // repeatedly, so it needs a standing exemption. dockRef marks the dock's
  // always-visible controls as never "outside" for this dismiss.
  const dockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toolsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        toolsClusterRef.current &&
        !toolsClusterRef.current.contains(e.target as Node) &&
        !dockRef.current?.contains(e.target as Node)
      ) {
        setToolsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setToolsOpen(false);
    };
    const onBlur = () => setToolsOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
    };
  }, [toolsOpen]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const animate = voiceState === 'speaking' || voiceState === 'listening' || voiceState === 'hearing';
  // 2026-07-26 pre-start redesign: is the center orb the live start button
  // right now? Drives the orb, its "Tap to start" label, the VU meter, and
  // the ghost treatment on the starter chips — one source of truth so they
  // can never disagree about which phase the screen is in.
  const orbStarts = orbIsStartButton({ started, canStart: !!onOrbStart, agendaEngaged });

  // ===== Q-pin collapse/drag (2026-07-23 spec) — the expanded pin auto-
  // collapses to a docked chip after speech-end + 6s (15s hard cap), so it
  // stops covering top-of-board ink for the whole turn. =====
  // User call 2026-07-23 (live test): the pin vanishing into the tools
  // cluster as a "Q" chip felt wrong — auto-collapse is OFF for now and the
  // student manages the pin by dragging/dismissing it. Flip to re-enable
  // the whole collapse cycle (timers + chip).
  const QPIN_AUTO_COLLAPSE = false;
  const [qpinMode, setQpinMode] = useState<'expanded' | 'chip'>('expanded');
  const [qpinShownAt, setQpinShownAt] = useState(0);
  const [qpinSpeechEndedAt, setQpinSpeechEndedAt] = useState<number | null>(null);
  const [qpinDragged, setQpinDragged] = useState(false); // deliberate placement → no auto-collapse this turn
  const qpinJustDragged = useRef(false); // suppress the click that ends a drag

  // New turn's pin → back to expanded at the DEFAULT top-center spot. A
  // dragged position is where the student parked THAT question out of the
  // way — inheriting it would spawn new questions wherever the last one was
  // shoved (user live-test call 2026-07-23), so it resets per turn.
  useEffect(() => {
    if (!questionPinKey) return;
    setQpinMode('expanded');
    setQpinDragged(false);
    setQpinCustomPos(null);
    setQpinShownAt(Date.now());
    setQpinSpeechEndedAt(voiceState !== 'speaking' ? Date.now() : null);
    qpinJustDragged.current = false; // a new pin's turn starts a fresh gesture — never inherit suppression
    // voiceState deliberately not a dep: only the pin's identity resets the cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionPinKey]);

  // Stamp the moment the tutor stops speaking (starts the +6s countdown).
  useEffect(() => {
    if (!QPIN_AUTO_COLLAPSE || !questionPinKey || qpinSpeechEndedAt !== null) return;
    if (voiceState !== 'speaking') setQpinSpeechEndedAt(Date.now());
  }, [voiceState, questionPinKey, qpinSpeechEndedAt]);

  // Schedule the collapse.
  useEffect(() => {
    if (!QPIN_AUTO_COLLAPSE || !questionPin || !questionPinKey || qpinMode !== 'expanded' || qpinDragged) return;
    const deadline = qpinCollapseDeadline(qpinShownAt, qpinSpeechEndedAt);
    const t = window.setTimeout(() => setQpinMode('chip'), Math.max(0, deadline - Date.now()));
    return () => window.clearTimeout(t);
  }, [questionPin, questionPinKey, qpinMode, qpinDragged, qpinShownAt, qpinSpeechEndedAt]);

  // Dragging: pointer events (one path for mouse + touch). A <5px press is a
  // tap and falls through to the pin's own click (transcript). A real drag
  // is a deliberate placement: it cancels auto-collapse for the turn (when
  // enabled) and holds until the next turn's pin resets to top-center.
  const [qpinCustomPos, setQpinCustomPos] = useState<QpinFraction | null>(null);
  const qpinBoxRef = useRef<HTMLDivElement>(null);
  // Round-6e (user call, IMG_7865/7867): whitespace-seeking placement. The
  // fixed top-center spot sat ON TOP of board content nearly every turn on
  // phones. Measure the board's rendered items ([data-wb-item-index] /
  // [data-wb-note] boxes) and, when there's a free vertical band below the
  // lowest visible content (the common case — a fresh turn renders into the
  // top of the viewport), drop the pin there instead. No band → keep the
  // fixed overlay spot (content taller than the viewport means there is no
  // whitespace to find — the pin overlaying is then unavoidable and the
  // student can drag it). Known limitation, accepted: rects are the CONTENT
  // BOXES, so whitespace *inside* a tall sparse component is invisible to
  // this measurement — the fallback is simply today's behavior.
  const [qpinAutoTop, setQpinAutoTop] = useState<number | null>(null);
  useEffect(() => {
    if (!questionPin || qpinMode !== 'expanded' || qpinCustomPos) {
      setQpinAutoTop(null);
      return;
    }
    const raf = requestAnimationFrame(() => {
      const box = qpinBoxRef.current;
      const stageEl = box?.offsetParent as HTMLElement | null;
      if (!box || !stageEl) return;
      const stage = stageEl.getBoundingClientRect();
      const HEADER_CLEARANCE = 56;  // stage header row
      const DOCK_CLEARANCE = 96;    // floating tutor bar + margin
      let lowestBottom = stage.top + HEADER_CLEARANCE;
      stageEl.querySelectorAll<HTMLElement>('[data-wb-item-index], [data-wb-note]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.top >= stage.bottom) return;
        const visibleBottom = Math.min(r.bottom, stage.bottom);
        if (visibleBottom > lowestBottom) lowestBottom = visibleBottom;
      });
      const pinH = box.getBoundingClientRect().height;
      const freeBandTop = lowestBottom + 8;
      if (stage.bottom - DOCK_CLEARANCE - freeBandTop >= pinH) {
        setQpinAutoTop(freeBandTop - stage.top);
      } else {
        setQpinAutoTop(null);
      }
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionPinKey, qpinMode, questionPin, qpinCustomPos]);
  const qpinDrag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number; // pin top-left relative to stage, px, at pointerdown
    originY: number;
    dragging: boolean;
  } | null>(null);

  const onQpinPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only a CAPTURED drag blocks a new press (second-finger hijack). A
    // pre-threshold entry may be stale — pointerup can land off-element
    // before capture starts — so a new press overwrites it (self-healing).
    if (qpinDrag.current?.dragging) return;
    const stage = stageRef.current?.getBoundingClientRect();
    const box = qpinBoxRef.current?.getBoundingClientRect();
    if (!stage || !box) return;
    qpinJustDragged.current = false; // a new press starts a new gesture — never inherit suppression
    qpinDrag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: box.left - stage.left,
      originY: box.top - stage.top,
      dragging: false,
    };
  };

  const onQpinPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = qpinDrag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (!d.dragging && e.buttons === 0) {
      // Button-free move = the press already ended off-element (no capture
      // pre-threshold). Drop the stale entry so hovering can't ghost-drag.
      qpinDrag.current = null;
      return;
    }
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.dragging && !exceedsDragThreshold(dx, dy)) return;
    if (!d.dragging) {
      d.dragging = true;
      // Capture only once it IS a drag — capturing on pointerdown would
      // retarget a plain tap's click away from the pin's inner buttons.
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const stage = stageRef.current?.getBoundingClientRect();
    const box = qpinBoxRef.current?.getBoundingClientRect();
    if (!stage || !box || stage.width === 0 || stage.height === 0) return;
    setQpinCustomPos(
      clampQpinFraction(
        { x: (d.originX + dx) / stage.width, y: (d.originY + dy) / stage.height },
        stage,
        { width: box.width, height: box.height },
      ),
    );
  };

  const onQpinPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = qpinDrag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.dragging) {
      setQpinDragged(true); // no auto-collapse this turn
      // pointercancel never produces a trailing click — arming the click
      // suppressor there would swallow the NEXT legitimate tap instead.
      if (e.type === 'pointerup') qpinJustDragged.current = true;
    }
    qpinDrag.current = null;
  };

  // Custom position survives stage resizes/rotation via re-clamping.
  useEffect(() => {
    if (!qpinCustomPos) return;
    const onResize = () => {
      const stage = stageRef.current?.getBoundingClientRect();
      const box = qpinBoxRef.current?.getBoundingClientRect();
      if (!stage || !box || stage.width === 0 || stage.height === 0) return;
      setQpinCustomPos((p) =>
        p ? clampQpinFraction(p, stage, { width: box.width, height: box.height }) : p,
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [qpinCustomPos !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const stageRef = useRef<HTMLDivElement>(null);
  // Close the board-page dropdown on any pointerdown outside its container
  // (the pill + list). Covers clicks anywhere — board, header, dock — which the
  // old z-layered click-catcher missed (header/dock sat above it). Buttons
  // inside the container manage their own close via onClick.
  const switcherRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!switcherOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      // B4 (embed-1785972176560): same dock exposure as toolsClusterRef
      // above — mute lives in the floating dock, a sibling overlay outside
      // switcherRef's container, so its taps must not read as "outside".
      if (
        switcherRef.current &&
        !switcherRef.current.contains(e.target as Node) &&
        !dockRef.current?.contains(e.target as Node)
      ) {
        setSwitcherOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSwitcherOpen(false);
    };
    // blur: in the embedded iframe, clicks on the PARENT page never reach this
    // document — losing window focus is the only outside-interaction signal.
    const onBlur = () => setSwitcherOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
    };
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

  // Agenda rail (2026-08-10): browser-fullscreen state drives which
  // orientation of the rail renders (horizontal row above the board vs a
  // vertical left overlay while fullscreen, which has no room for a top row).
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFs = () => setIsFullscreen(Boolean((document as any).fullscreenElement || (document as any).webkitFullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
    };
  }, []);

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
      <div className="relative z-10 flex-1 min-h-0 order-3">
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
          // `m-auto` on the inner wrapper (not `justify-center` on the scroll
          // container) so a TALL cluster — the mock-review agenda pushed the
          // whole thing past the stage height — scrolls from the TOP instead of
          // centering and clipping the hero under the header (live-test #1);
          // a short cluster (orb-only presence) still centers. pt-14 keeps the
          // top clear of the floating header even at the scroll origin.
          <div className="absolute inset-0 z-[5] flex flex-col px-6 pt-14 pb-32 overflow-y-auto pointer-events-none">
          <div className="m-auto w-full flex flex-col items-center">
            {objective && !isFreePractice && (
              <span className="ss-cap mb-7 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Target className="w-4 h-4" /> {objective}
              </span>
            )}
            {/* Pre-start the orb IS the start control (2026-07-26 trial
                feedback: the instruction sat in the center of the stage while
                the only action sat at the bottom edge of the frame). Once
                started it reverts to the presence indicator it has always
                been — orbIsStartButton also refuses while an agenda pick is
                in flight, so the brain never gets a duplicate kickoff. */}
            {orbStarts ? (
              <>
                <button
                  type="button"
                  onClick={onOrbStart}
                  data-testid="tutor-orb-start"
                  aria-label="Start the lesson"
                  className="relative mb-3 grid place-items-center pointer-events-auto rounded-full transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  {/* Ring pulse invites the tap. */}
                  <span className="ss-pulse absolute inset-0 m-auto w-28 h-28 rounded-full bg-blue-400/30" />
                  <span className="ss-pulse d absolute inset-0 m-auto w-28 h-28 rounded-full bg-blue-400/30" />
                  <div className="ss-breathe relative w-28 h-28 rounded-full grid place-items-center text-white shadow-xl bg-gradient-to-br from-blue-400 to-blue-600">
                    <Sparkles className="w-12 h-12 drop-shadow" />
                  </div>
                </button>
                {/* The instruction now sits ON the action instead of pointing
                    at the far edge of the frame. aria-hidden + tabIndex -1:
                    the orb button above is the accessible control, and this
                    is its visible label — exposing both would present the
                    same action twice to a screen reader. */}
                <button
                  type="button"
                  onClick={onOrbStart}
                  tabIndex={-1}
                  aria-hidden
                  className="mb-5 pointer-events-auto rounded-full bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700"
                >
                  Tap to start
                </button>
              </>
            ) : (
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
            )}
            {/* The VU meter has nothing to show before the mic opens — and a
                dead meter under a "Tap to start" orb reads as a broken
                control. */}
            {!orbStarts && <div className="mb-6"><MicMeter level={micLevel} speaking={voiceState === 'speaking'} large /></div>}
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
            {agendaEngaged ? (
              // Agenda round 4: a pick has fired; hold a calm placeholder until
              // the board content arrives (which hides this whole overlay).
              <p className="ss-cap max-w-xl text-center text-base text-slate-400">
                Starting… — the tutor is pulling up your question.
              </p>
            ) : started ? (
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
                {/* The old "Tap the mic below to start" heading and its ↓
                    arrow are gone: the instruction lives on the orb button
                    above now, and repeating it here would point at a control
                    that is no longer the primary one. When no orb start path
                    is wired the heading still has a job, so it stays. */}
                {!orbStarts && (
                  <p className="max-w-xl text-center text-2xl sm:text-3xl font-semibold leading-snug text-slate-800">
                    Tap the mic below to start
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                  Just talk — I&apos;ll listen and teach on the board {!orbStarts && <ArrowDown className="w-4 h-4" />}
                </p>
              </>
            )}
            {/* Mock-review "review agenda" (replaces the generic starters when a
                review context is present): a tappable numbered list of the
                pinned/missed questions. Tapping a row starts the session on that
                item; the mic alone takes them in order. Falls back to the generic
                chips for every other session (and degraded mock-review). */}
            {agendaEngaged ? null : mockAgenda && mockAgenda.length > 0 ? (
              agendaDrawerOpenPreStart ? (
              // Drawer is open over the board — don't duplicate the list here.
              <p className="mt-7 ss-cap max-w-md text-center text-sm text-slate-500">
                Your review agenda is open on the right — tap a question to start there, or tap the mic.
              </p>
              ) : (
              <div className="mt-7 w-full max-w-md pointer-events-auto">
                <p className="text-center text-lg font-semibold text-slate-800">Your review agenda</p>
                <p className="mt-1 text-center text-sm text-slate-500">
                  Tap a question to start there — or just tap the mic and we&apos;ll take them in order.
                </p>
                <div className="mt-4 flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                  {mockAgenda.map((item) => (
                    <button
                      key={item.n}
                      onClick={() => {
                        // Navigation, not an answer: send a control marker (no
                        // "Student wrote:" board card). The marker names the
                        // item number so the brain block resolves it. Fall back
                        // to the legacy student-input path when the control
                        // channel isn't wired.
                        const marker = `[Via their review-agenda menu, the student chose to start with Item ${item.n}. Begin working on it now.]`;
                        if (onControlMessage) onControlMessage(marker);
                        else onStudentInput('text', marker);
                      }}
                      className="flex items-start gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left shadow-sm hover:bg-slate-50"
                    >
                      {/* Real EXAM question number (agenda round 4) — students
                          recall "Q18", not the agenda-row position. The tap
                          marker still carries the brain-block "Item n". */}
                      <span className="shrink-0 inline-grid place-items-center h-6 min-w-6 px-1.5 rounded-full bg-slate-100 text-xs font-semibold tabular-nums text-slate-600">Q{item.qNum}</span>
                      <span className="min-w-0 flex-1">
                        {/* Labels carry `$…$` math (live-test #2) — render via
                            InlineMathText, not raw text. */}
                        <InlineMathText text={item.label} className="block text-sm font-medium text-slate-800" />
                        <InlineMathText text={item.result} className="block text-xs text-slate-500" />
                      </span>
                    </button>
                  ))}
                </div>
                {mockAgendaRemaining && (
                  <p className="mt-3 text-center text-xs text-slate-400">{mockAgendaRemaining}</p>
                )}
              </div>
              )
            ) : (
            /* Quick ways in — Upload (de-emphasized, the cluster camera does
                the same), plus generic starters. Shown in every session so the
                student always has something to act on. */
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
              {/* Ghost styling pre-start (2026-07-26): these are secondary
                  ways in and were competing with the start action for the
                  student's first look. Same behavior, quieter presence. */}
              <label className={`inline-flex items-center gap-2 rounded-full border cursor-pointer transition-colors ${
                orbStarts
                  ? 'bg-transparent border-slate-200 text-slate-400 px-3.5 py-1.5 text-xs hover:bg-slate-50 hover:text-slate-600'
                  : 'bg-white border-slate-300 text-slate-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50'
              }`}>
                <Upload className={orbStarts ? 'w-3.5 h-3.5 text-slate-400' : 'w-4 h-4 text-slate-500'} /> Upload a problem
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, onStudentInput)} />
              </label>
              {/* Task Y1: the canned text still fires every click (it cues
                  the brain in-turn) — onTogglePracticeOverride is what makes
                  the mode STICK. "Practice problems" sets the durable
                  override; "Explain a concept" clears it (returns to
                  token-goal behavior). Active state mirrors the Humor ✓
                  idiom (TutorSession.tsx's ⋯ menu).
                  Round-15 Issue 12 (2026-07-16, session portal-d08232c4):
                  the override MUST be set BEFORE the synthetic utterance —
                  onStudentInput → sendTextMessage runs the brain-call
                  request assembly synchronously up to its first await, so
                  with the old order the turn responding to the chip read
                  practiceOverrideRef while still false and went out WITHOUT
                  the <practice_session> block (prod log: turn 1 missing
                  "[practice-mode] practice_session block attached", turns
                  2+ have it) — the tutor ran the regular concept-review
                  lesson over the student's explicit practice request. */}
              <Chip ghost={orbStarts} active={practiceOverrideActive} onClick={() => { onTogglePracticeOverride?.(true); onStudentInput('text', 'Give me some practice problems.'); }}>
                {practiceOverrideActive ? '✓ ' : ''}Practice problems
              </Chip>
              {practiceModeActive && (
                <Chip ghost={orbStarts} onClick={() => { onTogglePracticeOverride?.(false); onStudentInput('text', 'Explain a concept to me.'); }}>Explain a concept</Chip>
              )}
            </div>
            )}
          </div>
          </div>
        )}
      </div>

      {/* Agenda rail (2026-08-10) — horizontal row above the board, hidden in
          fullscreen (no room); vertical variant takes over as a left overlay
          instead (same layer treatment as the tools cluster). */}
      {agendaRail && !isFullscreen ? (
        <div className="relative z-20 shrink-0 order-2 px-2 pt-1.5">{agendaRail}</div>
      ) : null}
      {agendaRail && isFullscreen ? (
        <div className="absolute left-2 top-16 bottom-24 z-20 w-44 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm overflow-hidden">
          {agendaRailVertical ?? agendaRail}
        </div>
      ) : null}

      {/* ===== Top bar (flex row) ===== */}
      <div className="relative z-30 shrink-0 order-1">
        <div className="mx-2 mt-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4 px-2.5 sm:px-4 h-12">
            {/* R39: the chevron-left "back" button is gone — it called the same
                end handler as End/Pause but WITHOUT the R34 two-tap confirm, so
                one stray tap ended a session instantly, and it duplicated a
                control that already exists 200px to the right. Removing it also
                reclaims header width for the title on phones. */}
            {headerBrand && <div className="shrink-0 flex items-center">{headerBrand}</div>}
            {/* Round-5: the header row carries seven controls, so on a phone the
                title truncates to something useless ("U1…"). Tapping it drops a
                transient banner BELOW the row (see below) with the full title —
                a banner rather than an in-row expansion because it floats over
                the board and therefore costs no vertical space, and because it
                can afford the two lines a long lesson name actually needs. */}
            <button
              type="button"
              onClick={revealTitle}
              className="min-w-0 text-left cursor-pointer"
              title={titleTooltip}
              aria-label={titleTooltip ? `Lesson: ${titleTooltip}. Tap to show the full name.` : 'Show the full lesson name'}
            >
              <h1 className="text-sm font-semibold text-slate-900 truncate leading-tight">{lessonTitle}</h1>
              {subtitle && <p className="text-[11px] text-slate-500 truncate leading-tight">{subtitle}</p>}
            </button>
            {/* beats (desktop) */}
            {/* Practice meter (2026-07-17): the beats slot no longer requires a
                plan — plan-less sessions (free practice / upload) render the
                problems-solved meter here; TutorSession passes beats=null when
                there is genuinely nothing to show. */}
            {beats && <div className="hidden lg:flex mx-auto min-w-0 max-w-[46%] overflow-x-auto">{beats}</div>}
            <div className="shrink-0 ml-auto flex items-center gap-1.5 sm:gap-2.5">
              {/* Mock-review Agenda — mid-session jump list of every miss.
                  Shown only in a mock-review session (mockDrawer non-empty).
                  Sits with the header controls; the panel it opens clears the
                  header so End/Pause stay reachable. */}
              {showAgendaButton && (
                <button
                  onClick={() => setAgendaOpen(!agendaOpen)}
                  title="Review agenda"
                  className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full text-sm font-medium ${agendaOpen ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <ListChecks className="w-[18px] h-[18px]" />
                  <span className="hidden sm:inline">Agenda</span>
                </button>
              )}
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
              {/* Round-5: mobile-only clock. Desktop keeps the richer
                  `controls` timer above; showing both would double it. */}
              {headerClock && <span className="sm:hidden">{headerClock}</span>}
              {adaptiveMenu}
              {endControl}
            </div>
          </div>
        </div>
        {/* Transient full-title banner. Absolutely positioned so it overlays the
            board instead of pushing it down — the whole point is that revealing
            the name costs no whiteboard height. Auto-dismisses after
            TITLE_REVEAL_MS; tapping it again dismisses early. */}
        {titleRevealed && (
          <div
            className="absolute left-2 right-2 top-full z-40 mt-1 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md"
            role="status"
            onClick={hideTitle}
            data-testid="lesson-title-reveal"
          >
            <p className="text-sm font-semibold leading-snug text-slate-900">{lessonTitle}</p>
            {subtitle && <p className="mt-0.5 text-xs leading-snug text-slate-500">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* ===== Student tools cluster (top-right) ===== */}
      {/* Drop below the board-page switcher when it's shown — the switcher pill
          (top-center, up to 360px wide) otherwise collides with this cluster on
          narrow screens. Mirrors the board's pt-28/pt-16 padding.
          T1 (2026-07-16): collapsed by default behind a single FAB — the
          always-open column occluded board content on phones (IMG_7803). The
          outer anchor (top/right) never moves; the FAB toggles whether the
          rest of the column renders below it, so expanding never shifts this
          overlay's position, only grows it downward. */}
      <div className={`absolute ${showSwitcher ? 'top-28' : 'top-16'} right-2 z-20`}>
        <div ref={toolsClusterRef} className="flex flex-col items-center gap-1 rounded-2xl bg-white border border-slate-200 shadow-md p-1.5">
          <div className="relative">
            <ToolBtn active={toolsOpen} title={toolsOpen ? 'Close tools' : boardPenActive && !toolsOpen ? 'Tools — pen active' : 'Tools'} onClick={() => setToolsOpen((o) => !o)}>
              <Wrench className="w-[18px] h-[18px]" />
            </ToolBtn>
            {boardPenActive && !toolsOpen && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-600" />
            )}
          </div>
          {toolsOpen && (
            <>
              <div className="w-6 h-px bg-slate-200 my-0.5" />
              <ToolBtn active={tool === 'draw'} title="Draw" onClick={() => { setTool(tool === 'draw' ? null : 'draw'); setToolsOpen(false); }}><Pencil className="w-[18px] h-[18px]" /></ToolBtn>
              {onToggleBoardPen && (
                <ToolBtn active={!!boardPenActive} title="Draw on the board" onClick={() => { onToggleBoardPen(); setToolsOpen(false); }}>
                  <PenLine className="w-[18px] h-[18px]" />
                </ToolBtn>
              )}
              <ToolBtn active={tool === 'text'} title="Text note" onClick={() => { setTool(tool === 'text' ? null : 'text'); setToolsOpen(false); }}><span className="font-bold text-sm">Aa</span></ToolBtn>
              <label title="Upload a problem" className="grid place-items-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer" onClick={() => setToolsOpen(false)}><Camera className="w-[18px] h-[18px]" /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, onStudentInput)} /></label>
              {/* Fullscreen — gate by CAPABILITY, not viewport width: the old
                  `hidden md:` gate also hid it inside the portal's <768px embed
                  iframe (the iframe's own viewport is what md: measures), which
                  is exactly where students need it. document.fullscreenEnabled
                  is false on iPhone Safari (no Fullscreen API on non-video
                  elements) and false in an iframe without allowfullscreen, so
                  the dead-no-op cases stay hidden automatically. Deliberately
                  NOT wired to auto-collapse the cluster (T1) — untouched. */}
              {canFullscreen && (
                <>
                  <div className="w-6 h-px bg-slate-200 my-0.5" />
                  <ToolBtn title="Full screen" onClick={() => { toggleFullscreen(); setToolsOpen(false); }}><Maximize2 className="w-[18px] h-[18px]" /></ToolBtn>
                </>
              )}
              {/* Mobile expand (Task E8) — shown only where the native Fullscreen
                  API can't run (see canExpand above); mutually exclusive with the
                  button above. Toggles to a collapse affordance while expanded;
                  the portal owns the actual visual growth. onClick is byte-
                  identical to pre-T1 — only its parent's visibility changed. */}
              {canExpand && (
                <>
                  <div className="w-6 h-px bg-slate-200 my-0.5" />
                  <ToolBtn active={expanded} title={expanded ? 'Exit expanded view' : 'Expand'} onClick={() => { (expanded ? requestCollapse : requestExpand)(); setToolsOpen(false); }}>
                    {expanded ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
                  </ToolBtn>
                </>
              )}
            </>
          )}
          {QPIN_AUTO_COLLAPSE && questionPin && qpinMode === 'chip' && (
            <button
              type="button"
              aria-label="Show the tutor's question"
              title="Show the tutor's question"
              onClick={() => {
                setQpinShownAt(Date.now());
                setQpinSpeechEndedAt(voiceState !== 'speaking' ? Date.now() : null);
                setQpinMode('expanded');
              }}
              className="ss-cap relative grid place-items-center w-9 h-9 rounded-xl bg-amber-400 text-white text-xs font-bold hover:bg-amber-500 after:absolute after:-inset-1 after:content-['']"
            >
              Q
            </button>
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
              className="relative shrink-0 grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30"
              title="Next board"
            >
              <ChevronRight className="w-4 h-4" />
              {/* Task X5: a subtle unseen-content dot — new tutor render landed
                  on another page while the anti-yank grace held the view here. */}
              {boardPages.pendingIndex != null && boardPages.pendingIndex !== boardPages.index && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              )}
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
                    {boardPages.pendingIndex === i && (
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" title="New content" />
                    )}
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
      {questionPin && qpinMode === 'expanded' && (
        <div
          ref={qpinBoxRef}
          onPointerDown={onQpinPointerDown}
          onPointerMove={onQpinPointerMove}
          onPointerUp={onQpinPointerEnd}
          onPointerCancel={onQpinPointerEnd}
          onClickCapture={(e) => {
            // A drag's trailing click must not open the transcript.
            if (qpinJustDragged.current) {
              qpinJustDragged.current = false;
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          style={
            qpinCustomPos
              // right:auto — the mobile full-width class sets BOTH left and
              // right; a dragged pin must not stay stretched to right-2.
              ? { left: `${qpinCustomPos.x * 100}%`, right: 'auto', top: `${qpinCustomPos.y * 100}%`, transform: 'none' }
              : qpinAutoTop !== null
                ? { top: `${qpinAutoTop}px` }
                : undefined
          }
          // Round-6e (user call, IMG_7867): full-width bar on phones —
          // end-to-end covers less board VERTICALLY (the text wraps into
          // fewer lines) and reads as a banner rather than a floating card.
          // Desktop keeps the centered card.
          className={`absolute ${showSwitcher ? 'top-[100px]' : 'top-16'} inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 sm:max-w-[min(88vw,560px)] touch-none cursor-grab active:cursor-grabbing`}
        >
          {questionPin}
        </div>
      )}

      {/* ===== Voice-hiccup captions pin (round-28b) — board bottom, just
              above the floating tutor bar: the sentence NEITHER voice
              engine could speak, readable where the student is already
              looking. Transient; host clears it when audio resumes. ===== */}
      {hiccupPin && (
        <div className="absolute inset-x-0 bottom-[calc(4.25rem_+_env(safe-area-inset-bottom))] z-20 flex justify-center pointer-events-none">
          <div className="max-w-[min(88vw,560px)] pointer-events-auto">
            {hiccupPin}
          </div>
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
              there's no caption). End/Pause lives in the header.
              OPAQUE (round-6e, user call 2026-07-28, IMG_7869 — supersedes
              the 2026-07-14 "translucent at all times" call): on phones the
              board text behind the 65% bar merged with the dock caption and
              read as garbage. Solid white; board ink can always be scrolled
              fully above the bar (WhiteboardCanvas scroll headroom). */}
          <div ref={dockRef} className="rounded-[24px] bg-white border border-slate-200/80 shadow-lg overflow-hidden">
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

      {/* ===== R35 T-A: warmup "joining" overlay — board + caption + dock,
              until the tutor's audio actually starts. Backdrop starts BELOW
              the header (top-14), same convention as the Agenda backdrop
              right below — the header (z-30) never sits under this overlay's
              rectangle at all, so Back/End stay tappable throughout, with no
              z-index race against it. z-[35]: above the board (z-10) and the
              floating tutor bar (z-30) right above, below the Agenda/
              transcript drawers (z-40) in case one is somehow still open. ===== */}
      {warmupOverlay && (
        <div className="absolute inset-x-0 top-14 bottom-0 z-[35] flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-[2px]">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-base font-semibold text-slate-700">Your tutor is joining…</p>
          <p className="text-sm text-slate-500">hang tight — this takes a few seconds</p>
        </div>
      )}

      {/* ===== Mock-review Agenda panel (mid-session) — a right-side card
              listing EVERY miss. Backdrop starts BELOW the header (top-14) so
              End/Pause stay tappable; the panel itself clears the header
              (top-16). z-40: above the board + overlays + header, below the
              tool modals (z-[45]) and the transcript drawer (z-50). ===== */}
      {agendaOpen && showAgendaButton && mockDrawer && (
        <>
          <div className="absolute inset-x-0 top-14 bottom-0 z-40" onClick={() => setAgendaOpen(false)} />
          <div className="absolute top-16 bottom-2 right-2 z-40 w-[min(88vw,360px)] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><ListChecks className="w-4 h-4 text-slate-400" /> Review agenda</h2>
              <button onClick={() => setAgendaOpen(false)} className="grid place-items-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-2.5 flex flex-col gap-2">
              {mockDrawer.map((row) => (
                <button
                  key={row.itemId}
                  onClick={() => { onPickAgendaItem?.(row.itemId); setAgendaOpen(false); }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm hover:bg-slate-50"
                >
                  <span className="shrink-0 inline-grid place-items-center h-6 min-w-6 px-1.5 rounded-full bg-slate-100 text-xs font-semibold tabular-nums text-slate-600">Q{row.qNum}</span>
                  <span className="min-w-0 flex-1">
                    {row.isFocus && (
                      <span className="mb-0.5 inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">up next</span>
                    )}
                    <InlineMathText text={row.label} className="block text-sm font-medium text-slate-800" />
                    <InlineMathText text={row.result} className="block text-xs text-slate-500" />
                  </span>
                </button>
              ))}
              {/* Agenda round 5: correct questions, behind a collapsed
                  disclosure so the miss list stays visually primary. Rows use
                  the SAME style + pick handler (a correct item can be pinned to
                  revisit — it becomes Item 1). */}
              {!!mockCorrectDrawer && mockCorrectDrawer.length > 0 && (
                <>
                  <button
                    onClick={() => setShowCorrectQuestions((v) => !v)}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
                  >
                    {showCorrectQuestions ? 'Hide' : 'Show'} correct questions too ({mockCorrectDrawer.length})
                  </button>
                  {showCorrectQuestions && mockCorrectDrawer.map((row) => (
                    <button
                      key={row.itemId}
                      onClick={() => { onPickAgendaItem?.(row.itemId); setAgendaOpen(false); }}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm hover:bg-slate-50"
                    >
                      <span className="shrink-0 inline-grid place-items-center h-6 min-w-6 px-1.5 rounded-full bg-emerald-50 text-xs font-semibold tabular-nums text-emerald-600">Q{row.qNum}</span>
                      <span className="min-w-0 flex-1">
                        {row.isFocus && (
                          <span className="mb-0.5 inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">up next</span>
                        )}
                        <InlineMathText text={row.label} className="block text-sm font-medium text-slate-800" />
                        <InlineMathText text={row.result} className="block text-xs text-emerald-600" />
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

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

  // Whether this mounted instance has run the typewriter effect before.
  // The ticker unmounts behind every "Thinking…" status override and
  // remounts after it with revealed=0 — retyping whatever `text` holds at
  // that moment from char 0 with no audio behind it. When the previous
  // turn errored (or the new turn's entry isn't in the transcript yet),
  // that text is the PRIOR turn's caption → a silent fake re-stream that
  // spoils upcoming content (2026-07-24 session). Policy: text present AT
  // MOUNT is history — show it whole; only text that arrives while
  // mounted animates.
  const firstRunRef = useRef(true);

  // ── Legacy typewriter (flag off / unsupported engine) ─────────────
  useEffect(() => {
    if (polling) return;
    if (firstRunRef.current) {
      firstRunRef.current = false;
      prevTextRef.current = text;
      revealedRef.current = text.length;
      setRevealed(text.length);
      return;
    }
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

  // ── Width-fit trailing words, math-atomic (R23) ───────────────────
  // Captions carry the DISPLAY form, so `$…$` math spans reach here intact
  // and must render via KaTeX (Image 24 showed raw `\dfrac{…}$?`). Two
  // consequences for the fitter: a span must never be split mid-`$…$` (an
  // unbalanced `$` renders as literal LaTeX), and raw LaTeX measures far
  // wider as text than its rendered form, so spans are measured on a
  // stripped proxy (commands/braces removed) instead of the raw source.
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
    if (ctx.measureText(captionMeasureProxy(shown)).width <= width) { setDisplay(shown); return; }
    const words = tokenizeCaptionMathAtomic(shown);
    const ell = '… ';
    let tail = '';
    for (let i = words.length - 1; i >= 0; i--) {
      const cand = words[i] + (tail ? ' ' + tail : '');
      if (ctx.measureText(captionMeasureProxy(ell + cand)).width > width) break;
      tail = cand;
    }
    setDisplay(tail ? ell + tail : ell + (words[words.length - 1] ?? shown));
  }, [shown]);

  const capText = normalizeCaptionMath(holdBackUnbalancedMathTail(display));

  return (
    <div ref={ref} className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-sm text-slate-700">
      <InlineMathText text={capText} />
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

/** `ghost` (2026-07-26): pre-start these chips are SECONDARY ways in and were
 *  competing with the start action for the student's first look, so they drop
 *  to a quieter outline treatment. Behavior is identical either way, and an
 *  `active` chip keeps its full weight — a ✓ state must stay legible. */
function Chip({ children, onClick, active, ghost }: { children: ReactNode; onClick: () => void; active?: boolean; ghost?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border transition-colors ${
        active ? 'bg-blue-50 border-blue-200 text-blue-700 px-3.5 py-2 text-sm font-medium shadow-sm'
        : ghost ? 'bg-transparent border-slate-200 text-slate-400 px-3.5 py-1.5 text-xs hover:bg-slate-50 hover:text-slate-600'
        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 text-sm font-medium shadow-sm'
      }`}
    >
      {children}
    </button>
  );
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
