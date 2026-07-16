'use client';

/**
 * Whiteboard Canvas
 *
 * Main whiteboard component that renders all visual elements
 * from the AI tutor including equations, graphs, and diagrams.
 */

import React, { memo, useState, useCallback, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2, GripVertical, ChevronDown } from 'lucide-react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { EquationRenderer, DerivationRenderer } from './EquationRenderer';
import { SketchRenderer } from './SketchRenderer';
import { SketchFallbackCard } from './SketchFallbackCard';
import type { SketchPrimitive } from '@/lib/tutor/whiteboard/sketch-schema';
import { TryYourselfRenderer } from './TryYourselfRenderer';
import { computeTryYourselfVerdict } from './tryYourselfAnswer';
import EarlyMathRenderer from './EarlyMathRenderer';
import PhonicsRenderer from './PhonicsRenderer';
import GraphicOrganizerRenderer from './GraphicOrganizerRenderer';
import WritingFrameRenderer from './WritingFrameRenderer';
import LabeledImageRenderer from './LabeledImageRenderer';
import SolvedExampleRenderer from './SolvedExampleRenderer';
import QuizRenderer from './QuizRenderer';
import BalancedEquationRenderer from './BalancedEquationRenderer';
import DimensionalCheckRenderer from './DimensionalCheckRenderer';
import CodeRunDispatcher from './CodeRunDispatcher';
import { GraphRenderer, PositionTimeGraph, VelocityTimeGraph, AccelerationTimeGraph } from './GraphRenderer';
import {
  VectorRenderer,
  VectorDiagram,
  FreeBodyDiagram,
  MotionDiagram,
  ProjectileMotionDiagram,
  CoordinateSystemDiagram,
  CircularPathDiagram,
  PipeFlowDiagram,
  SvgDiagram,
  ProblemDiagram,
} from './DiagramRenderer';
import DesmosGraphRenderer from './DesmosGraphRenderer';
import NumberLineRenderer from './NumberLineRenderer';
import { CatalogDispatch } from './CatalogDispatch';
import { solveDiagram, isImplementedKind, DiagramSolverError } from '@/lib/tutor/diagrams/catalog/manifest';
import { solvePassage } from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import GeometryRenderer from './GeometryRenderer';
import UnitCircleRenderer from './UnitCircleRenderer';
import FractionBarRenderer from './FractionBarRenderer';
import TreeRenderer from './TreeRenderer';
import VennDiagramRenderer from './VennDiagramRenderer';
import MatrixRenderer from './MatrixRenderer';
import StatsRenderer from './StatsRenderer';
import TimelineRenderer from './TimelineRenderer';
import MapRenderer from './MapRenderer';
import CircuitRenderer from './CircuitRenderer';
import LewisRenderer from './LewisRenderer';
import PeriodicTableRenderer from './PeriodicTableRenderer';
import AnnotatedPassageRenderer from './AnnotatedPassageRenderer';
import PassageRenderer from './PassageRenderer';
import CallStackRenderer from './CallStackRenderer';
import FlowchartRenderer from './FlowchartRenderer';
import ManipulativeRenderer from './ManipulativeRenderer';
import PunnettRenderer from './PunnettRenderer';
import FreeBodyDiagramRenderer from './FreeBodyDiagramRenderer';
import EnergyBarsRenderer from './EnergyBarsRenderer';
import CollisionRenderer from './CollisionRenderer';
import ReactionCoordinateRenderer from './ReactionCoordinateRenderer';
// Tier-1 structured renderers shipping this batch:
import CoordinatePlaneRenderer from './CoordinatePlaneRenderer';
import ScatterPlotRenderer from './ScatterPlotRenderer';
import CycleDiagramRenderer from './CycleDiagramRenderer';
import ConceptMapRenderer from './ConceptMapRenderer';
import MotionDiagramRenderer from './MotionDiagramRenderer';
import ProjectileMotionRenderer from './ProjectileMotionRenderer';
import SimpleMachineRenderer from './SimpleMachineRenderer';
import PendulumRenderer from './PendulumRenderer';
import SpringMassRenderer from './SpringMassRenderer';
import RayDiagramRenderer from './RayDiagramRenderer';
import WaveRenderer from './WaveRenderer';
// Aliased to avoid collision with legacy `VectorRenderer` already exported from `DiagramRenderer`.
import Vector2DRenderer from './VectorRenderer';
import OrbitalDiagramRenderer from './OrbitalDiagramRenderer';
import PedigreeRenderer from './PedigreeRenderer';
import CellDiagramRenderer from './CellDiagramRenderer';
import DnaRenderer from './DnaRenderer';
import FoodWebRenderer from './FoodWebRenderer';
import { InlineMathText } from './InlineMathText';
import { CellContent } from './CellContent';
import { stripRedundantChoiceLabel } from './choiceLabel';
import dynamic from 'next/dynamic';
import type { StudentMarkEvent, CapturedRect } from '@/lib/tutor/whiteboard/student-marks';
import { useDrawOn, drawOnEnabled } from './useDrawOn';
import { strokeOutline, tickSpine, highlightBand } from '@/lib/tutor/whiteboard/hand-stroke';
import { InkNotesOverlay } from './InkNotesOverlay';
import { inkNotesEnabled, linksEnabled } from '../../hooks/toolDefinitions';
import { shouldFollowNewRender, trailingNavSuppressesFollow } from '@/lib/tutor/whiteboard/view-follow';

const MoleculeRenderer = dynamic(() => import('./MoleculeRenderer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[250px] text-gray-400">Loading chemistry editor...</div>,
});

// CellContent (table cell / header math rendering) moved to ./CellContent so
// the catalog comparison_table renderer can share it. Imported below.

/**
 * Normalize a command title for supersede-matching. Lowercases, strips
 * punctuation, takes the first 3 tokens so "Triangle with Altitude on
 * Coordinate Plane" and "Triangle with Altitude" both collapse to
 * "triangle with altitude".
 */
/** Actions where redraws should supersede earlier versions rather than stack. */
const SUPERSEDABLE_ACTIONS = new Set(['showGeometry', 'showGeometryConstructed', 'showGraph', 'showDiagram', 'showSvgDiagram', 'showCircuit', 'showLewis', 'showFlowchart', 'showTimeline', 'showMap']);

/**
 * Within a single page, drop an earlier whiteboard command when a later
 * command of the same action type has a title that signifies a revision of
 * it (shared 3-word title prefix). Also drops earlier versions when the
 * later one is strictly a super-titled revision ("Triangle with Altitude" →
 * "Triangle with Altitude on Coordinate Plane"). This prevents partial or
 * stale drawings from cluttering the board when the model redraws.
 */
function dedupeSupersededCommands(cmds: WhiteboardCommand[]): WhiteboardCommand[] {
  // Walk from the end: for each supersedable command, check whether a
  // LATER command on the same page supersedes it. If so, drop it.
  //
  // Supersession is LIMITED to two cases so we don't accidentally collapse
  // legitimate side-by-side variants (resonance Form 1 / Form 2, before /
  // after, step A / step B):
  //   1. Titles are identical (normalized) — the later command is a true
  //      redraw of the earlier one.
  //   2. One title is a STRICT prefix of the other — the earlier version was
  //      a stub and the later one elaborates ("Triangle" → "Triangle with
  //      Altitude on Coordinate Plane").
  // The old "shared 3-word signature" rule was too aggressive and caused
  // students to see only one of two resonance structures they had asked for.
  const keep: boolean[] = cmds.map(() => true);
  for (let i = 0; i < cmds.length; i++) {
    const a = cmds[i];
    if (!SUPERSEDABLE_ACTIONS.has(a.action)) continue;
    const aTitle = ((a as { title?: string }).title || '').trim().toLowerCase();
    if (!aTitle) continue;
    for (let j = i + 1; j < cmds.length; j++) {
      const b = cmds[j];
      if (b.action !== a.action) continue;
      const bTitle = ((b as { title?: string }).title || '').trim().toLowerCase();
      if (!bTitle) continue;
      if (
        aTitle === bTitle ||
        bTitle.startsWith(aTitle) ||
        aTitle.startsWith(bTitle)
      ) {
        keep[i] = false;
        break;
      }
    }
  }
  return cmds.filter((_, i) => keep[i]);
}

// Desmos (showGraph / show_function_graph route) and Ketcher (showMolecule)
// render third-party iframes that swallow pointer events; a transparent
// layer above them restores tap-to-point at whole-item granularity. Their
// viewports are locked (DesmosGraphRenderer lockViewport), so intercepting
// pointer input does not remove student-facing interactivity.
function isIframeCommand(cmd: WhiteboardCommand): boolean {
  const a = (cmd as { action?: string }).action;
  if (a === 'showGraph') return true;
  // Interactive molecules keep live Ketcher editing — the tap catcher would
  // swallow the student's pointer input, so those items opt out of marks.
  if (a === 'showMolecule') return !(cmd as { interactive?: boolean }).interactive;
  return false;
}

interface WhiteboardCanvasProps {
  commands: WhiteboardCommand[];
  onClear?: () => void;
  onStudentInput?: (type: 'text' | 'drawing' | 'image', content: string) => void;
  /** When the student submits an answer in a try-yourself card on the
   *  whiteboard, this fires with the submitted text. The parent routes
   *  the answer to the brain as a synthetic student turn so the tutor
   *  can react with personalized feedback (correct → praise + advance,
   *  wrong → gentle correction). */
  onTryYourselfAnswer?: (answer: string, expected: string | undefined, isCorrect: boolean | null) => void;
  /** Fires when the tutor performs an explicit "look at this" action —
   *  scrollTo a different page or a scribble to mark something. The
   *  parent uses this on mobile to auto-switch from the chat tab to
   *  the board tab so the student actually sees what the tutor is
   *  pointing at. */
  onAttentionShift?: () => void;
  className?: string;
  /** When true, the tutor is composing a response (brain busy + nothing
   *  rendered yet on the current page). Drives a skeleton placeholder
   *  at the bottom of the current page so the student knows something
   *  is incoming, instead of staring at an unchanged board. */
  tutorBusy?: boolean;
  /** When true, the built-in "Nothing on the board yet" empty state is
   *  suppressed — the new SessionStage layout renders its own live "tutor
   *  presence" over the empty board instead. (Flag-gated host; default false
   *  keeps the legacy empty state.) */
  suppressEmptyState?: boolean;
  /** Chrome variant. 'full' (default) renders the legacy header (Whiteboard
   *  label · expand · clear · page-nav bar) and the bottom page-label footer.
   *  'minimal' drops both so the full-bleed SessionStage can host its own slim
   *  page switcher (driven by onNavChange) — the board itself becomes pure
   *  content. 'replay' is read-only playback (ReplayPlayer): keeps the header
   *  (title, item count, page-nav) and the Expand affordance so the replayed
   *  board can still go fullscreen, but drops Clear/Trash — there is nothing
   *  to clear in a recording, and its handler resets the live page index, a
   *  footgun with no place in playback. (Flag-gated host; default keeps every
   *  legacy caller identical.) */
  chrome?: 'full' | 'minimal' | 'replay';
  /** Surfaces the internal page navigation state so a host (the SessionStage)
   *  can render its own switcher in 'minimal' chrome. Fires whenever the page
   *  count / current index / titles change. `goTo` is stable.
   *  `pendingIndex` (Task X5): set when a new tutor render landed on a page
   *  OTHER than the current one but the anti-yank grace held the view there
   *  — a host can use it to show a subtle "new content" affordance. null
   *  when there is nothing pending. */
  onNavChange?: (nav: { index: number; count: number; titles: string[]; goTo: (i: number) => void; pendingIndex: number | null }) => void;
  /** On a resumed session the board is seeded with the prior work all at once;
   *  the default view is page 1, but the student left off on the LAST page. When
   *  true, the canvas jumps to the last page ONCE, after the seeded commands
   *  populate the page model (a no-op until pages exist). Subsequent tutor
   *  navigation (goToPage / scrollTo) takes over normally. */
  openOnLastPage?: boolean;
  /** Student marks (Phase 1): fires on a resolved tap on the board. When
   *  absent, no listeners mount and behavior is byte-identical. */
  onStudentMark?: (ev: StudentMarkEvent) => void;
  /** Phase 2 pen mode: while true, the board captures freehand strokes on a
   *  scroll-locking overlay and emits type:'gesture' events via onStudentMark. */
  penMode?: boolean;
  /** Fired after ~45s of pen mode with no strokes — parent should exit pen
   *  mode; spec'd auto-exit. Absent means no idle timer is armed. */
  onPenIdle?: () => void;
  /** Bumped by the parent when a tutor turn completes; ink strokes created
   *  at an earlier epoch fade out. */
  inkEpoch?: number;
  /** Raw tutor-turn-active signal for the student-ink epoch shield. The
   *  existing `tutorBusy` prop is a COMPOSITE (processing && whiteboard
   *  active this turn) used for the drawing skeleton — a stroke drawn
   *  during a no-render composing window would be tagged with the current
   *  epoch and fade the moment that turn ends, before the brain saw the
   *  mark. Falls back to `tutorBusy` when absent. */
  tutorTurnActive?: boolean;
}

// ── Phase 2: pen mode (freehand ink) ────────────────────────────────
// Strokes live at canvas level tagged with pageIndex + inkEpoch; they
// render on their own page and fade once the tutor's next turn completes
// (parent bumps inkEpoch). A stroke drawn while the tutor is mid-turn is
// tagged one epoch ahead so the CURRENT turn's completion doesn't fade
// it before the tutor ever saw it.
// (Module-level, not inside the component body, so the type declaration
// doesn't get re-evaluated on every render.)
//
// `polyline` is NORMALIZED (0..1 of the page wrapper at capture time) — it
// feeds mark emission/resolution, which reasons in the same normalized
// space the brain's rects use, so it must stay untouched. `px` is the same
// stroke captured in outer-host-relative (pageOuterRef) CSS pixels at that same instant, used
// ONLY for rendering: painting from px means a stroke's on-screen position
// is anchored to where the student actually drew it, not re-derived from
// the wrapper's CURRENT height. That matters because content append below
// makes the wrapper taller — normalized coordinates would then re-map old
// strokes onto a bigger canvas and visually drift them away from what they
// annotated. Known accepted limit: content inserted ABOVE existing items,
// or any reflow that shifts earlier content's pixel position, still drifts
// ink — in practice the tutor only appends below, so this is not hit.
// `captureWidth` is the outer host's (pageOuterRef) clientWidth at the
// instant the stroke was finished. `px` points are only correct at that
// width — a window resize / phone rotation reflows content without
// rescaling stored ink, so rendering re-derives a scale factor from
// captureWidth vs. the CURRENT outer width (see the render site below).
interface InkStroke { id: number; pageIndex: number; polyline: { x: number; y: number }[]; px: { x: number; y: number }[]; epoch: number; fading?: boolean; captureWidth: number; }

// Backstop cap on live ink strokes (Fix 3). Epoch fade normally clears
// strokes within a couple of tutor turns; this only bites when the tutor
// never turns again (student keeps drawing with no brain response).
const MAX_INK_STROKES = 40;

/** Callback fan-out for renderers nested inside CommandRenderer. Set
 *  once at the WhiteboardCanvas level; deeply-nested renderers (like
 *  TryYourselfRenderer) read from context instead of threading props
 *  through every intermediate. */
export const WhiteboardCallbackContext = React.createContext<{
  onTryYourselfAnswer?: WhiteboardCanvasProps['onTryYourselfAnswer'];
}>({});

export function WhiteboardCanvas({
  commands,
  onClear,
  onStudentInput,
  onTryYourselfAnswer,
  onAttentionShift,
  className = '',
  tutorBusy = false,
  suppressEmptyState = false,
  chrome = 'full',
  onNavChange,
  openOnLastPage = false,
  onStudentMark,
  penMode = false,
  onPenIdle,
  inkEpoch,
  tutorTurnActive,
}: WhiteboardCanvasProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track which direction the page-change happened in so the entrance
  // animation slides correctly (forward = next page, backward = prev).
  const prevIndexRef = useRef(0);
  const [pageDir, setPageDir] = useState<'forward' | 'backward'>('forward');
  useEffect(() => {
    if (currentIndex !== prevIndexRef.current) {
      setPageDir(currentIndex > prevIndexRef.current ? 'forward' : 'backward');
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  // Mirror currentIndex in a ref so effects keyed on [commands.length, pages]
  // (NOT currentIndex — re-running them on every manual page flip would be
  // wrong, see the view-follow effect below) can still read the LATEST page
  // synchronously, same convention as pagesLengthRef further down.
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  // ── View-follow anti-yank grace (Task X5) ──────────────────────────
  // Timestamp of the student's last BOARD interaction — page flip (arrows,
  // page pills, the SessionStage switcher's goTo), pen stroke, or panel tap
  // (a resolved tap-to-point). Read by the view-follow effect below via
  // shouldFollowNewRender: a new tutor render pulls the view to its page
  // UNLESS the student interacted within the grace window, in which case a
  // yank would fight a deliberate "let me look at this" action. Plain
  // scrolling within a page does NOT count — only page-level/board-level
  // actions do (see the brief's "define interacted honestly").
  const lastInteractionAtRef = useRef<number | null>(null);
  const markInteraction = useCallback(() => {
    // Replay (chrome='replay') never reads lastInteractionAtRef — its
    // view-follow branch below is unconditional chase-newest, byte-identical
    // to pre-X5 behavior — so marking an interaction from a reviewer's scrub
    // click (goPrev/goToPage's page-pill share this same header with 'full')
    // would be a pure no-op write. Skip it there.
    if (chrome === 'replay') return;
    lastInteractionAtRef.current = Date.now();
  }, [chrome]);
  // Surfaces "new content landed on page N but the anti-yank grace held the
  // view" so a host can show a subtle affordance (SessionStage's switcher).
  // Cleared once the student reaches that page (see the effect right below)
  // or once a later follow actually happens.
  const [pendingFollowIndex, setPendingFollowIndex] = useState<number | null>(null);
  useEffect(() => {
    if (pendingFollowIndex !== null && currentIndex === pendingFollowIndex) {
      setPendingFollowIndex(null);
    }
  }, [currentIndex, pendingFollowIndex]);

  const [isExpanded, setIsExpanded] = useState(false);

  // Resizable expanded panel state
  const expandedRef = useRef<HTMLDivElement>(null);
  const [expandedSize, setExpandedSize] = useState({ width: 0, height: 0 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Initialize expanded size based on viewport
  useEffect(() => {
    if (isExpanded && expandedSize.width === 0) {
      setExpandedSize({
        width: Math.min(window.innerWidth - 64, 900),
        height: Math.min(window.innerHeight - 64, 700),
      });
    }
  }, [isExpanded, expandedSize.width]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: expandedSize.width || 800,
      h: expandedSize.height || 600,
    };

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      setExpandedSize({
        width: Math.max(400, resizeStart.current.w + (ev.clientX - resizeStart.current.x)),
        height: Math.max(300, resizeStart.current.h + (ev.clientY - resizeStart.current.y)),
      });
    };

    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [expandedSize]);

  // Group commands into pages, split by 'newPage' markers.
  // Commands before the first newPage go on page 0.
  // 'clear', 'newPage', and 'goToPage' are filtered from rendering.
  //
  // Within each page we also run a "supersede" pass: if a later command has
  // the same action type AND its title clearly revises an earlier command's
  // (prefix match on the first ~3 words of each), we keep only the later
  // one. This prevents a broken partial drawing ("Triangle with Altitude"
  // with only 1 point) from sitting next to its complete successor
  // ("Triangle with Altitude on Coordinate Plane" with the full shape).
  const pages = useMemo(() => {
    const result: { title?: string; commands: WhiteboardCommand[] }[] = [];
    let current: { title?: string; commands: WhiteboardCommand[] } = { commands: [] };

    // Rollback pre-pass: a 'removeItems' command lists the stamped ids
    // of renders from a killed brain attempt. Collect every removed id
    // up front, then drop those commands (by their stamped `id`) below.
    // Append-only — the markers stay in the stream but render nothing.
    const removedIds = new Set<string>();
    for (const cmd of commands) {
      if (cmd.action === 'removeItems') {
        for (const id of cmd.ids) removedIds.add(id);
      }
    }

    for (const cmd of commands) {
      if (cmd.action === 'clear' || cmd.action === 'goToPage' || cmd.action === 'removeItems' || cmd.action === 'reviseItems') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdId = (cmd as any).id as string | undefined;
      if (cmdId && removedIds.has(cmdId)) continue;
      if (cmd.action === 'newPage') {
        if (current.commands.length > 0) {
          result.push({ ...current, commands: dedupeSupersededCommands(current.commands) });
        }
        current = { title: cmd.title, commands: [] };
      } else {
        current.commands.push(cmd);
      }
    }
    if (current.commands.length > 0) {
      result.push({ ...current, commands: dedupeSupersededCommands(current.commands) });
    }

    // Relocate scribbles tagged with targetPageTitle OR targetPageIndex:
    // the tutor auto-scroll injector stamps these on cross-page scribbles
    // so we can move them into their target bucket. Without this the
    // scribble lives in whichever bucket it was *emitted* into (usually
    // the current page at the time of the tool call), and renders on the
    // wrong item when the student flips to the target page (2026-04-24
    // physics session: "point at start of probability tree" scribble
    // landed on the triangle page because the scribble came after a
    // later newPage). pageIndex fallback added after the 2026-04-24
    // physics scatter-plot session where the vertex-A scribble targeted
    // page 0 (untitled implicit first page) and stayed on the wrong
    // page because title-only relocation had nothing to match.
    const relocated: typeof result = result.map((p) => ({ ...p, commands: [...p.commands] }));
    for (let i = 0; i < relocated.length; i++) {
      const keep: WhiteboardCommand[] = [];
      for (const cmd of relocated[i].commands) {
        if (cmd.action !== 'scribble') { keep.push(cmd); continue; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmdAny = cmd as any;
        const targetId = cmdAny.targetId as string | undefined;
        const targetPageTitle = cmdAny.targetPageTitle as string | undefined;
        const targetPageIndex = cmdAny.targetPageIndex as number | undefined;
        let targetIdx = -1;
        // Prefer the page bucket that actually CONTAINS the target item (by
        // its stable stamped id) — page titles repeat and the stream-walked
        // targetPageIndex drifts from the rendered page list after
        // evolve-in-place / kill-recovery removeItems prune items, sending the
        // scribble to the wrong page bucket (2026-06-19 ellipse "circle the
        // focus" landed on the tangent ellipse's page). See VoiceTutorRealtime
        // pushPageScrollTo for the matching view-nav fix.
        if (targetId) {
          for (let j = 0; j < relocated.length; j++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (relocated[j].commands.some((c) => (c as any).id === targetId)) { targetIdx = j; break; }
          }
        }
        if (targetIdx < 0 && targetPageTitle) {
          const targetLower = targetPageTitle.toLowerCase();
          // Find the LAST matching page — if the title repeats, the most
          // recent one is the intended target.
          for (let j = relocated.length - 1; j >= 0; j--) {
            if (relocated[j].title?.toLowerCase() === targetLower) { targetIdx = j; break; }
          }
        }
        if (targetIdx < 0 && typeof targetPageIndex === 'number'
            && targetPageIndex >= 0 && targetPageIndex < relocated.length) {
          targetIdx = targetPageIndex;
        }
        if (targetIdx < 0 || targetIdx === i) { keep.push(cmd); continue; }
        relocated[targetIdx].commands.push(cmd);
      }
      relocated[i].commands = keep;
    }
    return relocated;
  }, [commands]);

  // Mirror the live page count in a ref so the stable goToPage() jumper (used
  // by the SessionStage's external switcher) can clamp without re-creating its
  // identity on every page change. Set during render — read-only mirror.
  const pagesLengthRef = useRef(0);
  pagesLengthRef.current = pages.length;

  // SmoothDraw draw-on engine (Task 2). Declared here — ahead of the
  // interrupt effects below, which close over `finishAll` — and reused by
  // itemEnterClass/maybeDrawOn further down (near seenAnimIdsRef).
  const { animateItem, finishAll } = useDrawOn();
  const drawOnActive = drawOnEnabled();

  // Kill-recovery phase A: ids currently flagged "revising" (dimmed). Built
  // from reviseItems markers in stream order (revising:true adds, false
  // clears). The item wrappers dim any rendered item whose id is in this set —
  // a content kill dims the killed render during the recovery gap, then it's
  // un-dimmed on confirm or removed on cleanup.
  const revisingIds = useMemo(() => {
    const s = new Set<string>();
    for (const cmd of commands) {
      if (cmd.action === 'reviseItems') {
        if (cmd.revising) for (const id of cmd.ids) s.add(id);
        else for (const id of cmd.ids) s.delete(id);
      }
    }
    return s;
  }, [commands]);

  // SmoothDraw interrupts: kill-recovery (revisingIds change) and turn
  // end (tutorBusy → false, which includes barge-in) fast-forward all
  // running draw-on animations to their final state. Page-switch needs
  // nothing: the subtree remounts and seenAnimIdsRef renders seen items
  // instantly. Spec §2.
  const prevTutorBusyRef = useRef(tutorBusy);
  useEffect(() => {
    if (revisingIds.size > 0) finishAll();
  }, [revisingIds, finishAll]);
  useEffect(() => {
    if (prevTutorBusyRef.current && !tutorBusy) finishAll();
    prevTutorBusyRef.current = tutorBusy;
  }, [tutorBusy, finishAll]);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__tutorFinishDrawOn = finishAll;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { delete (window as any).__tutorFinishDrawOn; };
  }, [finishAll]);

  // Handle goToPage navigation: find the target page by title.
  //
  // Task X5 fix-wave (Finding 1): this used to re-scan the FULL commands
  // array on every commands.length change and unconditionally re-apply
  // whichever goToPage was last in the ENTIRE history — with no "already
  // processed" guard, unlike its scrollTo/view-follow siblings (flagged as
  // a Concern in the original X5 report). That let a stale nav from turn N
  // silently win the render race in an unrelated later commit: whenever
  // the view-follow effect below held the view (anti-yank grace, or its
  // own trailing-nav check), THIS effect was still re-asserting turn N's
  // old goToPage target every single time — pinning the view away from a
  // brand-new render in turn N+3 even though nothing in turn N+3 itself
  // navigated anywhere (the user's incident shape: answer revealed on page
  // 3, view stuck on page 2). `lastProcessedGoToIndexRef` scopes this to
  // goToPage commands added since the last run, exactly like
  // `lastScrollIndexRef` below — a nav is applied ONCE, when it's new.
  const lastProcessedGoToIndexRef = useRef(-1);
  useEffect(() => {
    const pendingGoTos = commands
      .map((cmd, i) => ({ cmd, i }))
      .filter((x) => x.cmd.action === 'goToPage' && x.i > lastProcessedGoToIndexRef.current);
    if (pendingGoTos.length === 0) return;
    lastProcessedGoToIndexRef.current = pendingGoTos[pendingGoTos.length - 1].i;
    const lastGoTo = pendingGoTos[pendingGoTos.length - 1].cmd;
    if (lastGoTo.action === 'goToPage') {
      // Title is the primary handle (the orchestrator translates a Board Map
      // page number → title before this runs). Fall back to the page number
      // as an index only if no title matched.
      const targetTitle = lastGoTo.title?.toLowerCase();
      let targetIndex = targetTitle
        ? pages.findIndex((p) => p.title?.toLowerCase() === targetTitle)
        : -1;
      if (targetIndex < 0 && typeof lastGoTo.page === 'number'
          && lastGoTo.page >= 1 && lastGoTo.page <= pages.length) {
        targetIndex = lastGoTo.page - 1;
      }
      if (targetIndex >= 0) {
        setCurrentIndex(targetIndex);
      }
    }
  // Only re-run when commands array length changes (new command added)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands.length, pages]);

  // Scroll a descendant of the whiteboard's own scroll container into view
  // WITHOUT using Element.scrollIntoView(). scrollIntoView() walks the full
  // scroll-container chain up to (and through) the top-level browsing
  // context — inside the portal-embedded tutor that chain doesn't stop at
  // the iframe boundary, so scrolling a freshly-rendered item also scrolls
  // the HOST page under it (2026-07-09 production bug: every new whiteboard
  // item jumped the partner page's scroll position). Compute the target
  // offset relative to `container` directly and set container.scrollTop /
  // scrollTo so the scroll is fully contained to this pane.
  const scrollElementIntoContainer = (
    container: HTMLElement,
    el: HTMLElement,
    block: 'start' | 'center' = 'start',
  ) => {
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const currentOffset = elRect.top - containerRect.top; // el's position within the visible pane, pre-scroll
    const delta = block === 'center'
      ? currentOffset - (container.clientHeight - elRect.height) / 2
      : currentOffset;
    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
    const target = Math.max(0, Math.min(container.scrollTop + delta, maxScrollTop));
    container.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Handle tutor_scroll_whiteboard — navigate to page/item when the tutor
  // wants to draw the student's attention to existing content. Process
  // ALL unprocessed scrollTos in arrival order, not just the latest: a
  // scribble can auto-inject both a page-switch and an item-scroll, and
  // dropping the page-switch leaves the scribble rendering on the wrong
  // page (2026-04-24 elementary session: "galvanometer" scribble landed
  // on base-10 blocks because the cross-page scrollTo was swallowed).
  const lastScrollIndexRef = useRef(-1);
  useEffect(() => {
    const pending = commands
      .map((cmd, i) => ({ cmd, i }))
      .filter((x) => x.cmd.action === 'scrollTo' && x.i > lastScrollIndexRef.current);
    if (pending.length === 0) return;
    lastScrollIndexRef.current = pending[pending.length - 1].i;
    // Tutor is explicitly redirecting attention — let the parent know
    // so it can auto-switch the mobile tab to the whiteboard if the
    // student is currently on the chat tab.
    onAttentionShift?.();

    // Partition: page switches apply synchronously (state update), item /
    // top / bottom scrolls need a frame after any page switch so new refs
    // are mounted.
    let pageSwitched = false;
    for (const { cmd } of pending) {
      if (cmd.action !== 'scrollTo') continue;
      if (cmd.target !== 'page') continue;
      let idx = -1;
      // Prefer the page that actually CONTAINS the resolved target item —
      // robust against repeated page titles (a lesson segment spanning two
      // pages titles both the same) and pageIndex drift from removed (emptied)
      // page buckets (evolve-in-place / kill-recovery removeItems empties a
      // page → it's dropped here but still counted by the orchestrator's
      // newPage walk). See pushPageScrollTo in VoiceTutorRealtime. Title +
      // index remain fallbacks for targets without a stamped id.
      if (cmd.targetId) {
        for (let i = 0; i < pages.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (pages[i].commands.some((c) => (c as any).id === cmd.targetId)) { idx = i; break; }
        }
      }
      if (idx < 0 && typeof cmd.pageIndex === 'number' && cmd.pageIndex >= 0 && cmd.pageIndex < pages.length) {
        idx = cmd.pageIndex;
      }
      if (idx < 0 && cmd.pageTitle) {
        const title = cmd.pageTitle.toLowerCase();
        for (let i = pages.length - 1; i >= 0; i--) {
          if (pages[i].title?.toLowerCase() === title) { idx = i; break; }
        }
      }
      if (idx >= 0) {
        setCurrentIndex(idx);
        pageSwitched = true;
      }
    }

    const runInPageScrolls = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      for (const { cmd } of pending) {
        if (cmd.action !== 'scrollTo') continue;
        if (cmd.target === 'top') {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (cmd.target === 'bottom') {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } else if (cmd.target === 'item' && (typeof cmd.itemIndex === 'number' || cmd.targetId)) {
          // Resolve the item element by its STABLE stamped id when available
          // (targetItemIndex drifts from the rendered position after
          // evolve-in-place / kill-recovery prune items — same root cause as
          // the page/overlay id fixes). Fall back to the index ref.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const scrollTargetId = (cmd as any).targetId as string | undefined;
          let itemEl: HTMLElement | null = null;
          if (scrollTargetId) {
            const safeId = scrollTargetId.replace(/"/g, '\\"');
            itemEl = container.querySelector(`[data-wb-item-id="${safeId}"]`) as HTMLElement | null;
          }
          if (!itemEl && typeof cmd.itemIndex === 'number') {
            itemEl = itemRefsRef.current[cmd.itemIndex - 1] ?? null;
          }
          if (!itemEl) continue;
          // Prefer scrolling the specific feature into view if the
          // resolver tagged one — lets "scroll to intersection points"
          // land on those points instead of the top of a tall graph.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const targetFeature = (cmd as any).targetFeature as string | undefined;
          let scrolled = false;
          if (typeof targetFeature === 'string' && targetFeature) {
            const safe = targetFeature.replace(/"/g, '\\"');
            const featureEl = itemEl.querySelector(`[data-feature="${safe}"]`) as HTMLElement | null;
            if (featureEl) {
              scrollElementIntoContainer(container, featureEl, 'center');
              scrolled = true;
            }
          }
          if (!scrolled) scrollElementIntoContainer(container, itemEl, 'start');
        }
      }
    };

    if (pageSwitched) {
      // Two frames: one for React to commit the page switch, one for
      // refs to be attached to the newly-rendered page's items.
      requestAnimationFrame(() => requestAnimationFrame(runInPageScrolls));
    } else {
      requestAnimationFrame(runInPageScrolls);
    }
  // Only re-run when the commands array grows.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands.length, pages]);

  // View-follow: switch the view to the page that the NEWEST teaching render
  // landed on. The old behavior only auto-advanced when the page COUNT changed,
  // so a render that GROUPED onto an existing, non-viewed page left the student
  // stranded — 2026-06-19 Img13: "show me the steps to find the latus rectum"
  // resumed work on the hyperbola (page 4) while the view stayed on the ellipse
  // (page 3). Now any batch that adds renders pulls the view to the newest
  // render's page (located by its stable id; falls back to the newest page).
  // Skip when the batch carried an explicit nav (goToPage / scrollTo) — the
  // scrollTo effect above already positioned the view (incl. Board Map jumps
  // and scribble auto-page-switches), so we must not fight it.
  //
  // Task X5 anti-yank grace: even past that check, an unconditional jump
  // fights a student who just, on their own initiative, flipped pages /
  // drew / tapped the board. shouldFollowNewRender (pure, script-tested in
  // scripts/test-view-follow.ts) holds the view when that happened within
  // the last ~10s; otherwise the honest default is to follow (evidence:
  // the tutor revealed a try-yourself ANSWER on page 3 while the student
  // sat on page 2 and the board never advanced — nothing was holding the
  // view, there just wasn't any pull). REPLAY (chrome='replay') keeps its
  // OWN timeline-driven paging: it drives this same effect by growing
  // `commands` as the scrubber advances, and a reviewer's manual scrub
  // must never suppress the recording's next reveal, so the grace is
  // skipped entirely there — chase-newest unconditionally, byte-identical
  // to pre-X5 behavior.
  const prevFollowCountRef = useRef(0);
  useEffect(() => {
    if (commands.length <= prevFollowCountRef.current) {
      prevFollowCountRef.current = commands.length;
      return;
    }
    const added = commands.slice(prevFollowCountRef.current);
    prevFollowCountRef.current = commands.length;
    const META = new Set([
      'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems', 'scribble', 'link', 'scrollTo', 'handwrite',
    ]);
    // Explicit nav (goToPage / scrollTo) suppresses view-follow ONLY when it is
    // the batch's FINAL visual intent. Order matters: a turn shaped
    // [scrollTo(earlier figure) … scribble … NEW render] used to leave the view
    // parked on the earlier page while the new render landed unseen on another
    // page — the student watches a stale example while the tutor narrates the
    // new content (2026-07-08 session portal-9549e3af: "I'm seeing an example
    // of students commuting" while the tutor discussed a different figure). If
    // a teaching render comes AFTER the last nav, the render is what the turn
    // ends on — follow it. Order-only decision lifted to the pure, tested
    // `trailingNavSuppressesFollow` (view-follow.ts) — see its doc comment for
    // why `added` (never the full commands log) is the only safe input here.
    if (trailingNavSuppressesFollow(added.map((c) => c.action))) return;
    for (let k = added.length - 1; k >= 0; k--) {
      const c = added[k];
      if (META.has(c.action)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (c as any).id as string | undefined;
      let target = -1;
      if (id) {
        for (let i = 0; i < pages.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (pages[i].commands.some((x) => (x as any).id === id)) { target = i; break; }
        }
      }
      if (target < 0) target = pages.length - 1; // fallback: newest page
      if (target >= 0) {
        const cur = currentIndexRef.current;
        const follow = chrome === 'replay'
          ? target !== cur // replay: unconditional chase-newest, untouched
          : shouldFollowNewRender({
              targetIndex: target,
              currentIndex: cur,
              lastInteractionAt: lastInteractionAtRef.current,
              now: Date.now(),
            });
        if (follow) {
          setCurrentIndex(target);
          // Only clear the badge for the page IT was surfacing — a follow
          // to some OTHER page (e.g. page 7) must not silently dismiss an
          // unrelated still-unseen pending badge (e.g. page 5's).
          setPendingFollowIndex((prev) => (prev !== null && target === prev ? null : prev));
        } else if (target !== cur) {
          // Anti-yank grace held the view — surface the affordance so a
          // host can hint that new content landed elsewhere.
          setPendingFollowIndex(target);
        }
      }
      break;
    }
  // Only re-run when commands.length increases (chrome is stable per mount).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands.length, pages, chrome]);

  // Resume: jump to the LAST page once, after the seeded board populates the
  // page model. Runs a single time (guarded) so later tutor navigation is not
  // overridden; a no-op until pages exist (seed arrives a tick after mount).
  // Declared AFTER the view-follow effect on purpose: the seed arrives as one
  // big batch, which also triggers view-follow; if a restored render's id
  // collides across pages (legacy boards saved before the id-counter fix),
  // view-follow can resolve to the wrong page. Running last lets this own the
  // initial resumed view (the last page = where the student left off).
  const resumeLastPageDoneRef = useRef(false);
  useEffect(() => {
    if (!openOnLastPage || resumeLastPageDoneRef.current || pages.length === 0) return;
    resumeLastPageDoneRef.current = true;
    setCurrentIndex(pages.length - 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOnLastPage, pages.length]);

  // Auto-scroll to the latest item when a new command is added to the current page
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevCommandCountRef = useRef(commands.length);
  useEffect(() => {
    if (commands.length <= prevCommandCountRef.current) {
      prevCommandCountRef.current = commands.length;
      return;
    }
    const added = commands.slice(prevCommandCountRef.current);
    prevCommandCountRef.current = commands.length;
    if (!scrollContainerRef.current) return;
    // Find the newest TEACHING render in this batch by its STABLE id. We scroll
    // by id (not by itemRefsRef position) so the scroll survives the
    // view-follow page switch: when the new render lands on a DIFFERENT page,
    // the view-follow effect above switches currentIndex, the page subtree
    // remounts (key={currentIndex}), and a position-based ref would point at
    // the OLD page's last item — landing the student on the TOP of the new
    // page instead of the freshly-drawn figure (2026-06-24 Console17: ellipse
    // focal-distance graph). A double rAF waits for that switch + remount to
    // commit so the new page's item ids are queryable.
    const META = new Set([
      'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems', 'scribble', 'link', 'scrollTo', 'handwrite',
    ]);
    // Explicit navigation (goToPage / scrollTo) owns its own scroll ONLY when
    // it is the batch's final visual intent — mirror the view-follow effect's
    // order-aware rule above so both effects follow the same page on a
    // [scrollTo … NEW render] turn.
    let lastNav = -1;
    let lastRender = -1;
    for (let k = added.length - 1; k >= 0; k--) {
      const a = added[k].action;
      if (lastNav < 0 && (a === 'goToPage' || a === 'scrollTo')) lastNav = k;
      if (lastRender < 0 && !META.has(a)) lastRender = k;
      if (lastNav >= 0 && lastRender >= 0) break;
    }
    if (lastNav >= 0 && lastNav > lastRender) return;
    let newestId: string | undefined;
    for (let k = added.length - 1; k >= 0; k--) {
      if (META.has(added[k].action)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (added[k] as any).id as string | undefined;
      if (id) { newestId = id; break; }
    }

    const scrollToNewest = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      // Bring the NEWEST item's TOP into view so its header/title is visible,
      // rather than jumping to the absolute bottom (which left a single tall
      // item scrolled to its middle with the header cut off; 2026-06-23).
      if (newestId) {
        const safe = newestId.replace(/"/g, '\\"');
        const el = container.querySelector(`[data-wb-item-id="${safe}"]`) as HTMLElement | null;
        if (el) { scrollElementIntoContainer(container, el, 'start'); return; }
      }
      // Fallback (render carried no id): newest item by position, else bottom.
      const refs = itemRefsRef.current.filter(Boolean) as HTMLElement[];
      const last = refs[refs.length - 1];
      if (last) scrollElementIntoContainer(container, last, 'start');
      else container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    };

    requestAnimationFrame(() => requestAnimationFrame(scrollToNewest));
  }, [commands.length]);

  // Detect if scroll container has overflow (content taller than viewport)
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) { setHasOverflow(false); return; }
    const check = () => {
      const isOverflowing = el.scrollHeight > el.clientHeight + 8;
      const isScrolledToBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      setHasOverflow(isOverflowing && !isScrolledToBottom);
    };
    check();
    el.addEventListener('scroll', check);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => { el.removeEventListener('scroll', check); observer.disconnect(); };
  }, [currentIndex, commands.length]);

  // Navigation. Each of these is a MANUAL page flip — mark it as a board
  // interaction (Task X5 anti-yank grace) so a tutor render landing
  // elsewhere a moment later doesn't yank the student back off the page
  // they just chose to look at.
  const goNext = useCallback(() => {
    markInteraction();
    setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1));
  }, [pages.length, markInteraction]);

  const goPrev = useCallback(() => {
    markInteraction();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, [markInteraction]);

  // Stable page jumper exposed to a host that renders its own switcher
  // ('minimal' chrome) — also the SessionStage switcher's goTo, and the
  // 'full' chrome page-pill onClick below. Clamped against the live page
  // count at call time.
  const goToPage = useCallback((i: number) => {
    markInteraction();
    const max = pagesLengthRef.current - 1;
    setCurrentIndex(Math.min(Math.max(i, 0), Math.max(max, 0)));
  }, [markInteraction]);

  // Surface page-nav state to a host that renders its own switcher ('minimal'
  // chrome). `pages` is memoized on [commands], so this only fires when the
  // page structure or the current page actually changes — no render loop.
  useEffect(() => {
    if (!onNavChange) return;
    onNavChange({
      index: currentIndex,
      count: pages.length,
      titles: pages.map((p) => p.title || ''),
      goTo: goToPage,
      pendingIndex: pendingFollowIndex,
    });
  }, [onNavChange, currentIndex, pages, goToPage, pendingFollowIndex]);

  // Handle clear
  const handleClear = useCallback(() => {
    setCurrentIndex(0);
    onClear?.();
  }, [onClear]);

  // Animate-once: wb-item-enter replays its 480ms entrance on EVERY page
  // switch because the page subtree remounts (key={currentIndex}) — the
  // whole board "twitches in" when flipping back to a page (2026-07-10
  // perf audit). Track which item ids have already animated (marked in an
  // effect AFTER commit, so StrictMode's dev double-render can't eat a
  // first animation) and skip the class for them. Items without a stamped
  // id (legacy boards) keep the old always-animate behavior.
  const seenAnimIdsRef = useRef<Set<string>>(new Set());
  const itemEnterClass = (cmd: WhiteboardCommand): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (cmd as any).id as string | undefined;
    if (id && seenAnimIdsRef.current.has(id)) return '';
    return drawOnActive ? '' : 'wb-item-enter';
  };
  // Draw-on trigger: runs in the item wrapper's ref callback on first
  // mount. Must check seenAnimIdsRef BEFORE the post-commit effect below
  // marks the id seen — ref callbacks fire pre-effect, so ordering holds.
  const maybeDrawOn = (cmd: WhiteboardCommand, el: HTMLElement | null) => {
    if (!el || !drawOnActive) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (cmd as any).id as string | undefined;
    if (id && seenAnimIdsRef.current.has(id)) return;
    animateItem(el);
  };
  useEffect(() => {
    for (const c of safeCurrentPage.commands) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (c as any).id as string | undefined;
      if (id) seenAnimIdsRef.current.add(id);
    }
  });

  // Animate-once for scribble marks (ticks/highlights), same rationale as
  // seenAnimIdsRef above: ScribbleOverlays lives inside the page subtree
  // (key={currentIndex}), so it remounts on every page switch — a local
  // ref there would replay every mark's 400ms wipe on flip-back. Declared
  // here (survives page remounts) and threaded down as a prop, mirroring
  // how items get their animate-once state from the parent instead of
  // from state local to the remounting subtree.
  const seenMarkSeedsRef = useRef<Set<string>>(new Set());

  // Scribble and scrollTo commands don't render as their own board items —
  // they overlay / navigate. Split them out so the main loop renders real
  // content, and the overlays attach by targetItemIndex (1-indexed).
  //
  // These hooks MUST be called before any early return below; otherwise
  // React's Rules of Hooks are violated (different hook counts across
  // renders). currentPage is safe to reference here — useMemo reads are
  // lazy, and we guard against pages.length === 0 below.
  const safeCurrentPage = pages[Math.min(currentIndex, Math.max(0, pages.length - 1))] ?? { commands: [] };
  const renderableCommands = useMemo(
    () => safeCurrentPage.commands.filter((c) => c.action !== 'scribble' && c.action !== 'link' && c.action !== 'scrollTo' && c.action !== 'handwrite'),
    [safeCurrentPage.commands],
  );
  // Kill-recovery phase A: dim style for an item currently flagged revising.
  const reviseStyle = (cmd: WhiteboardCommand): React.CSSProperties | undefined =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revisingIds.has((cmd as any).id) ? { opacity: 0.4, transition: 'opacity 0.3s ease' } : undefined;
  const scribbles = useMemo(
    () => safeCurrentPage.commands.filter((c): c is Extract<WhiteboardCommand, { action: 'scribble' }> => c.action === 'scribble'),
    [safeCurrentPage.commands],
  );
  const handwrites = useMemo(
    () => safeCurrentPage.commands.filter((c): c is Extract<WhiteboardCommand, { action: 'handwrite' }> => c.action === 'handwrite'),
    [safeCurrentPage.commands],
  );
  // SmoothDraw P4: hand-drawn arrows between two already-rendered board
  // features. Mirrors the scribbles/handwrites memos exactly — filtered
  // once per page-commands change, rendered inside InkNotesOverlay so
  // arrow labels share its placement/occupied space with notes.
  // Kill-switch gate (`NEXT_PUBLIC_TUTOR_LINKS=off`, linksEnabled() false):
  // checked here, not just at emission time, so a resumed session whose
  // PERSISTED whiteboardCommands already contain stamped `link` commands
  // (from before the flag flipped off) doesn't resurface arrows on the
  // live board — same "stray persisted link must not resurface flag-off"
  // rationale as the PDF exporter's meta-skip sets. Read at call time
  // (not module init) so this stays a real rollback lever, not a
  // build-time constant — matches linksEnabled()'s own call-time-read
  // convention.
  const links = useMemo(
    () => (linksEnabled() ? safeCurrentPage.commands.filter((c): c is Extract<WhiteboardCommand, { action: 'link' }> => c.action === 'link') : []),
    [safeCurrentPage.commands],
  );

  // Refs to each rendered item so scrollTo can bring them into view
  // (via scrollElementIntoContainer — see its doc comment above).
  const itemRefsRef = useRef<(HTMLDivElement | null)[]>([]);

  // ── Student marks (Phase 1: tap-to-point) ──────────────────────────
  // Pointer-based tap detection on the page wrapper (bubble phase — taps
  // on interactive elements are filtered, scroll/drag is excluded by a
  // movement threshold). Coordinates + candidate rects are normalized to
  // the page wrapper so downstream resolution is pure math.
  const pageWrapperRef = useRef<HTMLDivElement | null>(null);
  // Outer host for the Phase-2 pen overlay + ink SVG — one level up from
  // pageWrapperRef, wrapping it PLUS the surrounding p-4 padding gutter.
  // The page wrapper's own box ends at the bottom of its last in-flow
  // child (historically the AnnotationStrip, when present — deleted in
  // SmoothDraw P3); the padding around it lives OUTSIDE that box on the
  // scroll container. A pen overlay scoped to pageWrapperRef alone
  // leaves that padding gutter (and any margin between the wrapper and
  // the scroll container's edge) unreachable — hit live 2026-07-05: a
  // student's stroke just past the (then strip-rendered) note text
  // didn't register. Hosting the overlay here instead (this div owns
  // the padding) extends coverage to the full scrollable page content
  // while leaving point NORMALIZATION untouched (still computed against
  // pageWrapperRef below — see penPoint).
  const pageOuterRef = useRef<HTMLDivElement | null>(null);
  const tapStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const [pings, setPings] = useState<{ id: number; pageIndex: number; x: number; y: number }[]>([]);
  const pingIdRef = useRef(0);

  // SmoothDraw P3: height (px) of the in-flow spacer rendered AFTER the
  // page wrapper so margin notes the slot engine placed BELOW the page
  // bottom (ink-placement's exhausted-scan extension) are scrollable
  // instead of clipped — absolutely-positioned notes below the host's
  // content don't grow the host on their own. No feedback loop: the
  // overlay measures placement (and this overflow) against the page
  // WRAPPER's box, which a sibling spacer below it never affects — see
  // InkNotesOverlay's contentRef doc. Flag-off: overlay absent, spacer
  // never renders.
  const [noteOverflowPx, setNoteOverflowPx] = useState(0);
  const handleNoteOverflow = useCallback((px: number) => {
    setNoteOverflowPx((prev) => (prev === px ? prev : px));
  }, []);

  // Fix 1 (ink drift on resize/rotation): track the outer host's live
  // CSS width so ink strokes captured at a different width can be
  // rescaled at render time — see the InkStroke doc comment.
  const [outerWidth, setOuterWidth] = useState(0);
  useEffect(() => {
    const outer = pageOuterRef.current;
    // pageOuterRef only mounts once `pages.length > 0` (see the empty-state
    // early return below) — re-arming on pages.length lets the observer
    // attach once real content (and the ref) exists, instead of running
    // once at mount against a still-null ref.
    if (!outer) return;
    setOuterWidth(outer.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setOuterWidth(w);
    });
    ro.observe(outer);
    return () => ro.disconnect();
  }, [pages.length]);

  const collectRects = useCallback((): CapturedRect[] => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper) return [];
    const wRect = wrapper.getBoundingClientRect();
    if (wRect.width === 0 || wRect.height === 0) return [];
    const out: CapturedRect[] = [];
    const norm = (r: DOMRect) => ({
      x: (r.left - wRect.left) / wRect.width,
      y: (r.top - wRect.top) / wRect.height,
      w: r.width / wRect.width,
      h: r.height / wRect.height,
    });
    wrapper.querySelectorAll<HTMLElement>('[data-wb-item-index]').forEach((itemEl) => {
      const itemIndex = parseInt(itemEl.getAttribute('data-wb-item-index') || '0', 10);
      if (!itemIndex) return;
      const itemId = itemEl.getAttribute('data-wb-item-id') || undefined;
      out.push({ ...norm(itemEl.getBoundingClientRect()), itemIndex, itemId });
      itemEl.querySelectorAll<HTMLElement>('[data-feature]').forEach((featEl) => {
        const feature = featEl.getAttribute('data-feature') || undefined;
        if (!feature) return;
        out.push({ ...norm(featEl.getBoundingClientRect()), itemIndex, itemId, feature });
      });
    });
    // Any [data-wb-note] element living directly inside the wrapper
    // (outside any [data-wb-item-index] scope) is collected separately
    // here. Historically the AnnotationStrip populated this scope; it's
    // deleted in SmoothDraw P3 and tutor notes now mount on pageOuterRef
    // (see the scan below), so this loop is currently a defensive no-op —
    // kept in case any future in-wrapper note UI reuses the attribute.
    // itemIndex 0 is a synthetic page-level slot — there is no real item
    // 0 (the loop above skips falsy itemIndex), so this can't collide
    // with a real item's rect.
    const noteEls = new Set<Element>();
    wrapper.querySelectorAll<HTMLElement>('[data-wb-note]').forEach((noteEl) => {
      noteEls.add(noteEl);
      out.push({
        ...norm(noteEl.getBoundingClientRect()),
        itemIndex: 0,
        feature: 'teacher-note',
        label: noteEl.getAttribute('data-wb-note-text') || undefined,
      });
    });
    // SmoothDraw P3: InkNotesOverlay's notes mount on the SIBLING host
    // pageOuterRef, not inside pageWrapperRef (see pageOuterRef's doc
    // comment above) — the wrapper-scoped scan just above can't see them.
    // Scan pageOuterRef too, deduped against the wrapper scan by element
    // identity (a Set) so nothing doubles up if a note element were ever
    // reachable from both — pageWrapperRef is itself a descendant of
    // pageOuterRef, so a naive pageOuterRef.querySelectorAll would
    // otherwise re-find any [data-wb-note] elements the wrapper scan
    // already collected.
    //
    // Honest scope: this scan makes overlay notes positioned WITHIN the
    // wrapper's box resolvable to taps. Notes placed out in the outer
    // padding gutter ARE visible to the scan, but taps landing there
    // never reach the mark pointer handlers in the first place — tap
    // capture (handleMarkPointerDown/Up) is wired on pageWrapperRef and
    // item descendants only; the Phase-2b re-host to pageOuterRef moved
    // the PEN overlay, not tap capture. Widening tap capture to
    // pageOuterRef is a tracked follow-up decision for the student-marks
    // system (trade-off: gutter taps would then also start resolving as
    // page-level marks), not fixed here.
    //
    // Coordinate space: `norm()` above normalizes any DOMRect against
    // wRect (pageWrapperRef's viewport box) regardless of which subtree
    // supplied it — getBoundingClientRect() always returns
    // viewport-absolute coordinates, so reusing the same wRect-based
    // `norm()` for outer-host rects yields the identical wrapper-relative
    // [0,1] space the rest of collectRects already uses; no separate
    // conversion is needed. Flag-off: the overlay never mounts, so this
    // scan finds nothing new and behavior is byte-identical to before.
    const outer = pageOuterRef.current;
    if (outer && outer !== wrapper) {
      outer.querySelectorAll<HTMLElement>('[data-wb-note]').forEach((noteEl) => {
        if (noteEls.has(noteEl)) return;
        noteEls.add(noteEl);
        out.push({
          ...norm(noteEl.getBoundingClientRect()),
          itemIndex: 0,
          feature: 'teacher-note',
          label: noteEl.getAttribute('data-wb-note-text') || undefined,
        });
      });
    }
    return out;
  }, []);

  const fireStudentTap = useCallback((clientX: number, clientY: number) => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper || !onStudentMark) return;
    const wRect = wrapper.getBoundingClientRect();
    if (wRect.width === 0 || wRect.height === 0) return;
    // A resolved panel tap counts as a board interaction (Task X5 anti-yank
    // grace) — the student is actively engaging with this page right now.
    markInteraction();
    const point = { x: (clientX - wRect.left) / wRect.width, y: (clientY - wRect.top) / wRect.height };
    const id = ++pingIdRef.current;
    // Fix 2 (ping bleed): tag with the page it fired on so a ping still
    // in its 2s life doesn't render at the same coords after a page nav.
    setPings((p) => [...p, { id, pageIndex: currentIndex, x: point.x, y: point.y }]);
    setTimeout(() => setPings((p) => p.filter((q) => q.id !== id)), 2000);
    onStudentMark({
      type: 'point',
      pageIndex: currentIndex,
      pageTitle: safeCurrentPage.title || undefined,
      point,
      rects: collectRects(),
    });
  }, [onStudentMark, collectRects, currentIndex, safeCurrentPage.title, markInteraction]);

  const handleMarkPointerDown = useCallback((e: React.PointerEvent) => {
    // While the pen is active, taps are the pen overlay's business — the
    // overlay sits above this wrapper and stops propagation on its own
    // events, but guard here too in case a pointerdown lands outside it.
    if (penMode) { tapStartRef.current = null; return; }
    tapStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, [penMode]);
  const handleMarkPointerUp = useCallback((e: React.PointerEvent) => {
    if (penMode) { tapStartRef.current = null; return; }
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start || !onStudentMark) return;
    // Movement/duration thresholds: a scroll or drag is not a tap.
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) return;
    if (Date.now() - start.t > 600) return;
    // Interactive elements keep their own semantics — never a mark.
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"]')) return;
    fireStudentTap(e.clientX, e.clientY);
  }, [onStudentMark, fireStudentTap, penMode]);

  // ── Phase 2: pen mode (freehand ink) ────────────────────────────────
  // See the InkStroke doc comment above for the epoch-tagging rationale.
  const [inkStrokes, setInkStrokes] = useState<InkStroke[]>([]);
  const strokeIdRef = useRef(0);
  const activeStrokeRef = useRef<{ x: number; y: number }[] | null>(null);
  const [liveStroke, setLiveStroke] = useState<{ x: number; y: number }[] | null>(null);
  // Pixel-space twin of activeStrokeRef/liveStroke — see the InkStroke doc
  // comment for why rendering uses px while emission stays normalized.
  const activeStrokePxRef = useRef<{ x: number; y: number }[] | null>(null);
  const [liveStrokePx, setLiveStrokePx] = useState<{ x: number; y: number }[] | null>(null);
  // Fix 4 (pen-mode idle auto-exit): bumped whenever a stroke finishes, so
  // the idle-timer effect below (keyed on this) re-arms instead of firing
  // while the student is actively drawing.
  const [penStrokeSeq, setPenStrokeSeq] = useState(0);

  const penPoint = useCallback((clientX: number, clientY: number) => {
    const wrapper = pageWrapperRef.current;
    const outer = pageOuterRef.current;
    if (!wrapper || !outer) return null;
    const r = wrapper.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;
    // Normalized x/y stay WRAPPER-relative (unchanged) — a stroke landing
    // in the padding gutter around the wrapper normalizes to a fraction
    // outside [0,1], which resolveStudentMark already treats as page-only
    // (no item/feature rect contains it). `px` is relative to the OUTER
    // host instead, since that's the element the ink SVG now paints
    // into — see the InkStroke doc comment and pageOuterRef's doc comment.
    const outerRect = outer.getBoundingClientRect();
    return {
      x: (clientX - r.left) / r.width,
      y: (clientY - r.top) / r.height,
      px: { x: clientX - outerRect.left, y: clientY - outerRect.top },
    };
  }, []);

  // Gesture grouping: strokes within GESTURE_QUIET_MS of each other form ONE
  // gesture (a tick = 2 strokes, handwriting = many). The group emits as a
  // single type:'gesture' event when the quiet window elapses. Ink renders
  // per stroke immediately — grouping never delays what the student sees.
  const GESTURE_QUIET_MS = 1200;
  const gestureStrokesRef = useRef<{ x: number; y: number }[][]>([]);
  const gestureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitGesture = useCallback(() => {
    gestureTimerRef.current = null;
    const strokes = gestureStrokesRef.current;
    gestureStrokesRef.current = [];
    if (strokes.length === 0 || !onStudentMark) return;
    onStudentMark({
      type: 'gesture',
      pageIndex: currentIndex,
      pageTitle: safeCurrentPage?.title || undefined,
      strokes,
      rects: collectRects(),
    });
  }, [onStudentMark, collectRects, currentIndex, safeCurrentPage]);

  const finishStroke = useCallback(() => {
    const pts = activeStrokeRef.current;
    const pxPts = activeStrokePxRef.current;
    activeStrokeRef.current = null;
    activeStrokePxRef.current = null;
    setLiveStroke(null);
    setLiveStrokePx(null);
    if (!pts || pts.length < 2 || !onStudentMark) return;
    setPenStrokeSeq((n) => n + 1);
    const id = ++strokeIdRef.current;
    // Fail safe: when px array is missing or mismatched, skip the ink-state
    // push to prevent corrupt ~1px scribbles. The mark still emits via the
    // normalized path (polyline) in the gesture event.
    if (pxPts && pxPts.length === pts.length) {
      setInkStrokes((s) => {
        const next = [...s, {
          id,
          pageIndex: currentIndex,
          polyline: pts,
          px: pxPts,
          epoch: (inkEpoch ?? 0) + ((tutorTurnActive ?? tutorBusy) ? 1 : 0),
          captureWidth: pageOuterRef.current?.clientWidth || 0,
        }];
        // Fix 3 (unbounded accumulation backstop): epoch fade normally
        // clears old strokes once the tutor's next turn or two completes,
        // but if the tutor never turns again (student keeps drawing with
        // no brain response) strokes would accumulate forever. Drop the
        // oldest beyond the cap.
        return next.length > MAX_INK_STROKES ? next.slice(next.length - MAX_INK_STROKES) : next;
      });
    } else {
      console.warn('[student-marks] px/normalized stroke desync — ink render skipped');
    }
    gestureStrokesRef.current.push(pts);
    if (gestureTimerRef.current) clearTimeout(gestureTimerRef.current);
    gestureTimerRef.current = setTimeout(emitGesture, GESTURE_QUIET_MS);
  }, [onStudentMark, currentIndex, inkEpoch, tutorBusy, tutorTurnActive, emitGesture]);

  // Fix 4 (pen-mode idle auto-exit): while pen mode is on and a parent
  // wants to know, arm a 45s timeout that fires onPenIdle. Keyed on
  // penStrokeSeq so every finished stroke re-arms the timer (resets the
  // idle clock) instead of letting a mid-drawing session get cut off.
  // Cleanup covers pen-mode-off, unmount, and each re-arm.
  useEffect(() => {
    if (!penMode || !onPenIdle) return;
    const t = setTimeout(() => { onPenIdle(); }, 45000);
    return () => clearTimeout(t);
  }, [penMode, onPenIdle, penStrokeSeq]);

  const handlePenDown = useCallback((e: React.PointerEvent) => {
    // The overlay is a child of the Phase-1 tap wrapper — stop the event
    // here so a short stroke never also bubbles into handleMarkPointerDown.
    e.stopPropagation();
    const p = penPoint(e.clientX, e.clientY);
    if (!p) return;
    // A pen stroke is a board interaction (Task X5 anti-yank grace) —
    // marked at stroke START so a render landing elsewhere mid-draw
    // doesn't yank the page out from under an in-progress stroke.
    markInteraction();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    activeStrokeRef.current = [{ x: p.x, y: p.y }];
    activeStrokePxRef.current = [p.px];
    setLiveStroke([{ x: p.x, y: p.y }]);
    setLiveStrokePx([p.px]);
  }, [penPoint, markInteraction]);
  const handlePenMove = useCallback((e: React.PointerEvent) => {
    if (!activeStrokeRef.current) return;
    const p = penPoint(e.clientX, e.clientY);
    if (!p) return;
    const pts = activeStrokeRef.current;
    const last = pts[pts.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 0.004) return; // decimate
    pts.push({ x: p.x, y: p.y });
    activeStrokePxRef.current = activeStrokePxRef.current ? [...activeStrokePxRef.current, p.px] : [p.px];
    setLiveStroke([...pts]);
    setLiveStrokePx(activeStrokePxRef.current);
  }, [penPoint]);
  const handlePenUp = useCallback((e: React.PointerEvent) => {
    // See handlePenDown — same double-fire risk on the up edge.
    e.stopPropagation();
    finishStroke();
  }, [finishStroke]);

  // Abort an in-progress stroke on page navigation or pen-mode exit — the
  // capture surface is gone, and finishing against the wrong page would
  // mistag the mark. Discard silently. Also discard any pending gesture —
  // a group that spans a page nav is not one coherent mark, so drop it
  // rather than emit against a stale page.
  useEffect(() => {
    activeStrokeRef.current = null;
    activeStrokePxRef.current = null;
    setLiveStroke(null);
    setLiveStrokePx(null);
    if (gestureTimerRef.current) {
      clearTimeout(gestureTimerRef.current);
      gestureTimerRef.current = null;
    }
    gestureStrokesRef.current = [];
  }, [currentIndex, penMode]);

  // Unmount cleanup — a pending gesture timer must not fire (and touch
  // state) after the component is gone.
  useEffect(() => {
    return () => {
      if (gestureTimerRef.current) clearTimeout(gestureTimerRef.current);
    };
  }, []);

  // Fade — when `inkEpoch` advances two turns past a stroke's epoch (the
  // amended 2-turn slow fade), mark it fading, remove after the CSS opacity
  // transition (4s + slack) completes.
  useEffect(() => {
    if (inkEpoch === undefined) return;
    setInkStrokes((strokes) => {
      if (!strokes.some((s) => !s.fading && s.epoch + 2 <= inkEpoch)) return strokes;
      return strokes.map((s) => (!s.fading && s.epoch + 2 <= inkEpoch ? { ...s, fading: true } : s));
    });
    const t = setTimeout(() => {
      setInkStrokes((strokes) => strokes.filter((s) => !s.fading));
    }, 4300);
    return () => clearTimeout(t);
  }, [inkEpoch]);

  // Dev/test hook: __tutorTestTap(xFrac, yFrac) simulates a student tap at
  // a page-relative position through the REAL capture path (rect
  // collection, resolution, ping, transport). NODE_ENV-guarded like the
  // page-level __tutorTest* hooks. __tutorTestStroke(points) does the same
  // for Phase 2 freehand strokes (it now feeds the gesture buffer and emits
  // after the GESTURE_QUIET_MS window — callers that need an immediate
  // emit, or a multi-stroke gesture, should use __tutorTestGesture instead).
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !onStudentMark) return;
    const w = window as unknown as { __tutorTestTap?: (x: number, y: number) => boolean };
    w.__tutorTestTap = (xFrac: number, yFrac: number) => {
      const wrapper = pageWrapperRef.current;
      if (!wrapper) return false;
      const r = wrapper.getBoundingClientRect();
      fireStudentTap(r.left + xFrac * r.width, r.top + yFrac * r.height);
      return true;
    };
    const wStroke = window as unknown as { __tutorTestStroke?: (pts: [number, number][]) => boolean };
    wStroke.__tutorTestStroke = (fracPts: [number, number][]) => {
      const wrapper = pageWrapperRef.current;
      const outer = pageOuterRef.current;
      if (!wrapper || !outer || fracPts.length < 2 || !onStudentMark) return false;
      const r = wrapper.getBoundingClientRect();
      const outerRect = outer.getBoundingClientRect();
      activeStrokeRef.current = fracPts.map(([x, y]) => ({ x, y }));
      // Convert the injected WRAPPER-relative normalized fractions to px
      // relative to the OUTER host (the ink SVG's actual containing
      // element — see pageOuterRef's doc comment): offset by the
      // wrapper's own position within the outer host, then scale by the
      // wrapper's size, so the dev hook renders ink the same way real
      // capture does (see penPoint / the InkStroke doc comment).
      const offsetX = r.left - outerRect.left;
      const offsetY = r.top - outerRect.top;
      activeStrokePxRef.current = fracPts.map(([x, y]) => ({ x: offsetX + x * r.width, y: offsetY + y * r.height }));
      finishStroke();
      return true;
    };
    const wGesture = window as unknown as { __tutorTestGesture?: (strokes: [number, number][][]) => boolean };
    wGesture.__tutorTestGesture = (strokes) => {
      if (!onStudentMark || strokes.length === 0) return false;
      gestureStrokesRef.current = strokes.map((s) => s.map(([x, y]) => ({ x, y })));
      emitGesture();
      return true;
    };
    return () => { delete w.__tutorTestTap; delete wStroke.__tutorTestStroke; delete wGesture.__tutorTestGesture; };
  }, [onStudentMark, fireStudentTap, finishStroke, emitGesture]);

  if (pages.length === 0) {
    return (
      <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
        <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center">
          {/* Calm empty state — earlier the placeholder was a "preparing
              the board…" skeleton during tutorBusy, but the tutor's
              first turn is often a conversational greeting that doesn't
              touch the board. Showing a "preparing" message there is
              misleading (observed 2026-04-29 trig session). The board
              fills in naturally once a render command lands. */}
          {!suppressEmptyState && (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm">Nothing on the board yet.</p>
              <p className="text-sm">I&apos;ll draw here as we work through things.</p>
            </div>
          )}
        </div>
        {onStudentInput && <StudentInputBar onStudentInput={onStudentInput} />}
      </div>
    );
  }

  const currentPage = pages[Math.min(currentIndex, pages.length - 1)];

  const headerContent = chrome === 'minimal' ? null : (
    <div className="border-b bg-gray-50 rounded-t-lg flex-shrink-0">
      {/* Top row: title + actions */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-600">Whiteboard</span>
          {currentPage.commands.length > 1 && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
              {currentPage.commands.length} items
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Expand/Minimize */}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) setExpandedSize({ width: 0, height: 0 });
            }}
            className="p-1 rounded hover:bg-gray-200"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {/* Clear — a live-session control; replay ('replay' chrome) has
              nothing to clear and handleClear's setCurrentIndex(0) reset
              would be a jarring no-op button on a read-only recording. */}
          {chrome !== 'replay' && (
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-gray-200 text-gray-500"
              title="Clear whiteboard"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Page navigation bar — always visible when multiple pages */}
      {pages.length > 1 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-t border-blue-100">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-1 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:shadow-none"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex flex-wrap items-center justify-center gap-1">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                // Numbered pills (not bare dots) so the brain's spoken
                // "look at Page 4" maps to a visible label on the board.
                className={`min-w-[20px] h-5 px-1 rounded-full text-[10px] font-semibold tabular-nums transition-all ${
                  i === currentIndex
                    ? 'bg-blue-600 text-white scale-110 shadow-sm'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={pages[i].title || `Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-blue-700 min-w-[44px] text-center tabular-nums">
            {currentIndex + 1} / {pages.length}
          </span>
          <button
            onClick={goNext}
            disabled={currentIndex === pages.length - 1}
            className="p-1 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:shadow-none"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const pageLabel = currentPage.title
    || (currentPage.commands.length === 1
      ? getCommandTypeLabel(currentPage.commands[0].action)
      : currentPage.commands.map((c) => getCommandTypeLabel(c.action)).join(' + '));

  const bodyContent = (
    <>
      {/* `key={currentIndex}` re-mounts the inner div on page change so
          the entrance animation fires. Direction-aware: forward slides
          in from the right, backward slides in from the left. */}
      <div
        ref={scrollContainerRef}
        // Legacy 'full' chrome (split-pane): on mobile drop the inner
        // overflow-auto — the page itself scrolls, and a nested scroll feels
        // jarring on small screens; desktop keeps the inner scroll for the
        // side-by-side split. 'minimal' chrome (the full-bleed SessionStage)
        // is hosted in a `fixed overflow-hidden` stage where the PAGE can't
        // scroll, so the board MUST own its scroll at every breakpoint —
        // otherwise tall content is clipped and unreachable on mobile.
        // Use overflow-y-auto (not overflow-auto) so wide renderers (concept
        // maps, diagrams, tables) never trigger a horizontal scrollbar across
        // the pane; renderers that legitimately need horizontal scroll have
        // their own inner overflow-x-auto, so those still work.
        // Pen mode does NOT toggle this to overflow-hidden: on desktop the
        // mouse wheel doesn't conflict with drawing (drawing is pointerdown-
        // driven), so wheel-scrolling must keep working while pen is on.
        // Touch stays safe without a lock too — the pen overlay below sets
        // touchAction: 'none', so a touch-drag draws instead of scrolling.
        // pb-32 (minimal chrome only): scroll HEADROOM = the floating voice
        // bar's height + margin, so the last board item can always be
        // scrolled fully ABOVE the bar and read 100% clearly (2026-07-14
        // live test: bottom ink was permanently stuck under the dock).
        className={`flex-1 ${chrome === 'minimal' ? 'overflow-y-auto overflow-x-hidden pb-32' : 'lg:overflow-y-auto lg:overflow-x-hidden'}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* p-4 padding lives HERE (moved off the scroll container) so this
            div's own box — not the page wrapper's — is the pen overlay /
            ink SVG's containing block. See pageOuterRef's doc comment:
            this makes the padding gutter part of the overlay's coverage
            without changing point normalization (still wrapper-relative,
            below) or the visible layout (same padding, one level down). */}
        <div ref={pageOuterRef} style={{ position: 'relative' }} className="p-4">
        <div
          key={currentIndex}
          ref={pageWrapperRef}
          style={{ position: 'relative' }}
          className={pageDir === 'forward' ? 'wb-page-enter-forward' : 'wb-page-enter-backward'}
          onPointerDown={onStudentMark ? handleMarkPointerDown : undefined}
          onPointerUp={onStudentMark ? handleMarkPointerUp : undefined}
        >
        {renderableCommands.length === 1 ? (
          <div
            className={`relative ${itemEnterClass(renderableCommands[0])} scroll-mt-6`}
            style={reviseStyle(renderableCommands[0])}
            ref={(el) => { itemRefsRef.current[0] = el; maybeDrawOn(renderableCommands[0], el); }}
            data-wb-item-index={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data-wb-item-id={(renderableCommands[0] as any).id ?? undefined}
          >
            <CommandRenderer command={renderableCommands[0]} />
            <ScribbleOverlays scribbles={scribbles.filter((s) => scribbleMatchesItem(s, renderableCommands[0], 1))} seenMarkSeeds={seenMarkSeedsRef} />
            {onStudentMark && isIframeCommand(renderableCommands[0]) && (
              <div
                className="absolute inset-0 z-10"
                onPointerDown={handleMarkPointerDown}
                onPointerUp={handleMarkPointerUp}
              />
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {renderableCommands.map((cmd, i) => {
              const overlays = scribbles.filter((s) => scribbleMatchesItem(s, cmd, i + 1));
              // Key by the stable stamped id (fall back to index for legacy
              // commands) — index keys made React reuse the WRONG subtree
              // when evolve-in-place / kill-recovery removeItems shifted
              // positions (2026-07-10 perf audit).
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const key = ((cmd as any).id as string | undefined) ?? i;
              return (
                <div key={key} className={itemEnterClass(cmd)}>
                  {i > 0 && (
                    // 2026-07-11 user round: a live note struck the "EQUATION"
                    // item-separator label — this row sits BETWEEN item rects
                    // (which InkNotesOverlay's occupied set collects), not
                    // inside either one, so it was invisible to placement and
                    // notes could land right on top of the micro-label text.
                    // data-wb-sep marks it so InkNotesOverlay can add it to
                    // occupied too (see that file's occupied-collection block).
                    <div className="flex items-center gap-2 py-1" data-wb-sep="1">
                      <div className="flex-1 border-t border-dashed border-gray-200" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide flex-shrink-0">
                        {getCommandTypeLabel(cmd.action)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-gray-200" />
                    </div>
                  )}
                  <div
                    className="relative scroll-mt-6"
                    style={reviseStyle(cmd)}
                    ref={(el) => { itemRefsRef.current[i] = el; maybeDrawOn(cmd, el); }}
                    data-wb-item-index={i + 1}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data-wb-item-id={(cmd as any).id ?? undefined}
                  >
                    <CommandRenderer command={cmd} />
                    <ScribbleOverlays scribbles={overlays} seenMarkSeeds={seenMarkSeedsRef} />
                    {onStudentMark && isIframeCommand(cmd) && (
                      <div
                        className="absolute inset-0 z-10"
                        onPointerDown={handleMarkPointerDown}
                        onPointerUp={handleMarkPointerUp}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Drawing skeleton — shown whenever the tutor is composing.
            Empty board: takes center stage. Existing items on the page:
            renders at the bottom as a "next thing coming" hint so the
            student knows the tutor is actively working, not stalled. */}
        {tutorBusy && (
          <div className={`space-y-3 ${renderableCommands.length === 0 ? 'py-8' : 'py-4 mt-4 border-t border-dashed border-gray-200'}`}>
            <div className="wb-skeleton h-5 bg-gray-200 rounded w-2/3" />
            <div className="wb-skeleton h-24 bg-gray-100 rounded" />
            <div className="wb-skeleton h-4 bg-gray-200 rounded w-1/2" />
            <p className="text-xs text-gray-400 italic">✏️ Tutor is preparing something…</p>
          </div>
        )}
        {/* Fix 2: filter by page — a ping still in its 2s life at the
            moment of a page nav would otherwise render at the same
            normalized coords on the newly-current page. */}
        {pings.filter((p) => p.pageIndex === currentIndex).map((p) => (
          <span
            key={p.id}
            className="wb-student-ping"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          />
        ))}
        </div>
        {/* SmoothDraw P3: in-flow spacer revealing margin notes the slot
            engine placed BELOW the page bottom (see noteOverflowPx's doc
            comment above — sibling AFTER the wrapper, so it never feeds
            back into placement). */}
        {inkNotesEnabled() && noteOverflowPx > 0 && (
          <div style={{ height: noteOverflowPx }} aria-hidden="true" />
        )}
        {/* SmoothDraw P3 (closed 2026-07-11): on-board tutor notes are the
            default board behavior — this mount replaces the deleted
            AnnotationStrip entirely, not a variant beside it. Hosted on
            pageOuterRef, same as the student-ink SVG right below, so the
            note slot engine measures against the same coordinate space
            (see InkNotesOverlay's + pageOuterRef's doc comments) and
            gutter placement works. Placement's page rect measures from
            pageWrapperRef (contentRef) — spacer-independent.
            Kill switch (`NEXT_PUBLIC_TUTOR_INK_NOTES=off`, inkNotesEnabled()
            false): this mount is the ONLY place tutor notes render — with
            the strip gone, kill-switch=off means tutor_scribble labels and
            tutor_handwrite text appear NOWHERE on the live board. That is
            accepted rollback behavior (spec §5): the kill switch restores a
            no-notes board, not strip-era notes. */}
        {inkNotesEnabled() && (
          <InkNotesOverlay
            hostRef={pageOuterRef}
            contentRef={pageWrapperRef}
            notes={handwrites}
            labeledScribbles={scribbles}
            links={links}
            onOverflowChange={handleNoteOverflow}
          />
        )}
        {/* Phase 2: ink strokes for THIS page + the in-progress stroke.
            Hosted on pageOuterRef (not the page wrapper) so ink painted in
            the padding gutter around the wrapper still renders; see
            pageOuterRef's doc comment. No viewBox — SVG user units equal
            OUTER-relative CSS px, the same space `penPoint` captures in
            (see its comment), so ink stays put at the spot the student
            drew it even after the wrapper grows taller (content appended
            below). See also the InkStroke doc comment. */}
        {(inkStrokes.some((s) => s.pageIndex === currentIndex) || liveStrokePx) && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            {inkStrokes.filter((s) => s.pageIndex === currentIndex).map((s) => {
              // Fix 1 (ink drift on resize/rotation): a stroke's px points
              // were captured relative to the outer host's width at draw
              // time. If the host has since reflowed to a different width
              // (window resize, phone rotation), rescale every point by
              // currentWidth / captureWidth. This is a proportional
              // approximation — exact for a pure width-driven reflow,
              // where content scales roughly uniformly with width — not a
              // general re-layout solution. Guard to 1 (no-op) when either
              // width is missing/zero so a stroke never collapses to the
              // origin.
              const scale = (outerWidth && s.captureWidth) ? outerWidth / s.captureWidth : 1;
              return (
                <polyline
                  key={s.id}
                  points={s.px.map((p) => `${p.x * scale},${p.y * scale}`).join(' ')}
                  className={s.fading ? 'wb-student-ink wb-student-ink-fading' : 'wb-student-ink'}
                />
              );
            })}
            {/* liveStrokePx needs no scaling — its capture width IS the
                current width (the stroke is being drawn right now). */}
            {liveStrokePx && (
              <polyline points={liveStrokePx.map((p) => `${p.x},${p.y}`).join(' ')} className="wb-student-ink" />
            )}
          </svg>
        )}
        {/* Phase 2: pen-mode capture overlay — blocks item interaction and
            (with touch-action none) touch scrolling while the pen is active.
            Hosted on pageOuterRef so the capture surface spans the ENTIRE
            scrollable page content (items, annotation strip, and the
            padding gutter around them) — not just the page wrapper's own
            box. Marks landing in the padding gutter normalize (via
            penPoint, against pageWrapperRef) to a fraction outside [0,1]
            and resolve page-level, same as any other page-only mark —
            there are no addressable features out there, which is correct:
            the gutter and the annotation strip aren't board content. */}
        {penMode && onStudentMark && (
          <div
            className="absolute inset-0 z-20 cursor-crosshair"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePenDown}
            onPointerMove={handlePenMove}
            onPointerUp={handlePenUp}
            onPointerCancel={handlePenUp}
            onLostPointerCapture={handlePenUp}
          />
        )}
        </div>
      </div>
      {/* Scroll-down hint: visible when multi-item page has overflow */}
      {currentPage.commands.length > 1 && hasOverflow && (
        <div className="flex justify-center py-0.5 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-100 flex-shrink-0">
          <ChevronDown className="w-4 h-4 text-blue-400 animate-bounce" />
        </div>
      )}
      {chrome !== 'minimal' && (
        <div className="px-3 py-1 bg-gray-50 border-t text-xs text-gray-400 text-center rounded-b-lg flex-shrink-0">
          {pageLabel}
        </div>
      )}
    </>
  );

  // Expanded: resizable floating panel
  if (isExpanded) {
    // Floating overlay — portaled to document.body (task R2). Rendered
    // in-place (not portaled) this `fixed inset-0` div would normally cover
    // the viewport, BUT the CSS Transforms spec says any ancestor with a
    // `transform` other than `none` becomes the containing block for its
    // `position: fixed` descendants. The replay modal's whiteboard
    // scale-to-fit wrapper (ReplayPlayer.tsx) does exactly that — it applies
    // `transform: scale()` to shrink the WB pane — so without portaling out,
    // this overlay would render DOUBLE-scaled and mispositioned inside that
    // wrapper's box instead of covering the real viewport at 1:1. Portaling
    // to `document.body` escapes any such ancestor, live board or replay
    // alike, so fullscreen always renders 1:1 regardless of where
    // WhiteboardCanvas happens to be mounted.
    const overlay = (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setIsExpanded(false); }}>
        <div
          ref={expandedRef}
          className="bg-white shadow-2xl rounded-xl flex flex-col relative"
          style={{
            width: expandedSize.width || undefined,
            height: expandedSize.height || undefined,
            maxWidth: '95vw',
            maxHeight: '95vh',
          }}
        >
          {headerContent}
          {bodyContent}
          {/* Resize handle */}
          <div
            onMouseDown={onResizeStart}
            className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize flex items-center justify-center text-gray-300 hover:text-gray-500 transition"
            title="Drag to resize"
          >
            <GripVertical className="w-3 h-3 rotate-[-45deg]" />
          </div>
        </div>
      </div>
    );
    return (
      <>
        {/* Inline placeholder */}
        <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
          {headerContent}
          {bodyContent}
        </div>
        {typeof document !== 'undefined' ? createPortal(overlay, document.body) : overlay}
      </>
    );
  }

  const studentInputBar = onStudentInput ? (
    <StudentInputBar onStudentInput={onStudentInput} />
  ) : null;

  return (
    <WhiteboardCallbackContext.Provider value={{ onTryYourselfAnswer }}>
      <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
        {headerContent}
        {bodyContent}
        {studentInputBar}
      </div>
    </WhiteboardCallbackContext.Provider>
  );
}

/**
 * Student input toolbar for the whiteboard
 * Allows students to: type text, draw/scribble, upload images
 */
function StudentInputBar({ onStudentInput }: { onStudentInput: (type: 'text' | 'drawing' | 'image', content: string) => void }) {
  const [mode, setMode] = useState<'none' | 'text' | 'draw'>('none');
  const [textInput, setTextInput] = useState('');
  const [drawTool, setDrawTool] = useState<'pen' | 'eraser'>('pen');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Scale pointer position to canvas coordinates (CSS size may differ
  // from canvas pixel size). PointerEvent is unified across mouse,
  // touch, and stylus on all modern browsers — using it makes the
  // pencil scribbler work on mobile without separate touch handlers.
  const getCanvasPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Drawing handlers (pointer events — work for mouse + touch + stylus)
  const startDraw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
    // Capture so subsequent move/up events come even if the finger
    // leaves the canvas bounds (which happens often on mobile).
    try { (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); } catch {}
  }, [getCanvasPos]);

  const draw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    // Prevent the page from scrolling while the user draws on mobile.
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d')!;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 16;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
    }
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    lastPosRef.current = pos;
  }, [getCanvasPos, drawTool]);

  const endDraw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    try { (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const submitDrawing = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onStudentInput('drawing', dataUrl);
    // Clear canvas
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setMode('none');
  }, [onStudentInput]);

  const clearDrawing = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  // Image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onStudentInput('image', reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset
  }, [onStudentInput]);

  return (
    <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0">
      {/* Toolbar buttons */}
      <div className="flex items-center gap-1 px-2 py-1">
        <button
          onClick={() => setMode(mode === 'text' ? 'none' : 'text')}
          className={`text-xs px-2 py-1 rounded ${mode === 'text' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Type on whiteboard"
        >
          Aa
        </button>
        <button
          onClick={() => setMode(mode === 'draw' ? 'none' : 'draw')}
          className={`text-xs px-2 py-1 rounded ${mode === 'draw' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Draw on whiteboard"
        >
          ✏️
        </button>
        <label className="text-xs px-2 py-1 rounded text-gray-500 hover:bg-gray-200 cursor-pointer" title="Upload image">
          📷
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <span className="text-[10px] text-gray-400 ml-1">Student input</span>
      </div>

      {/* Text input area */}
      {mode === 'text' && (
        <form
          className="flex items-center gap-2 px-2 pb-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (textInput.trim()) {
              onStudentInput('text', textInput.trim());
              setTextInput('');
              setMode('none');
            }
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer or notes..."
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
            autoFocus
          />
          <button type="submit" className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add
          </button>
        </form>
      )}

      {/* Drawing canvas */}
      {mode === 'draw' && (
        <div className="px-2 pb-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full border border-gray-300 rounded bg-white cursor-crosshair"
            style={{ height: 150, touchAction: 'none' }}
            onPointerDown={startDraw}
            onPointerMove={draw}
            onPointerUp={endDraw}
            onPointerCancel={endDraw}
          />
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setDrawTool('pen')}
              className={`text-xs px-2 py-1 rounded ${drawTool === 'pen' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setDrawTool('eraser')}
              className={`text-xs px-2 py-1 rounded ${drawTool === 'eraser' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              🧹 Eraser
            </button>
            <div className="flex-1" />
            <button onClick={clearDrawing} className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-200 rounded">
              Clear
            </button>
            <button onClick={submitDrawing} className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders a single whiteboard command
 */
/**
 * Overlay layer rendered on top of a whiteboard item to show the tutor's
 * tick / highlight annotations (from the tutor_scribble tool). Each
 * scribble persists until the page is cleared or a newPage fires.
 *
 * Post-redesign (2026-05-13): shape vocab collapsed to `tick` (small ✓
 * just past the feature's right edge) + `highlight` (semi-transparent
 * fill over the feature's bbox). Legacy shapes circle / underline /
 * box / arrow silently render as `tick`. Labels no longer paint on
 * the diagram — they render on-board beside their target via
 * InkNotesOverlay (SmoothDraw P3).
 */
type ScribbleCmd = Extract<WhiteboardCommand, { action: 'scribble' }>;
type ResolvedRegion = { x: number; y: number; w: number; h: number };

/** Bind a scribble to its target render item. Prefer the STABLE stamped id
 *  (scribble.targetId === item.id) — the page-relative targetItemIndex drifts
 *  when the orchestrator's stream walk (resolveTargetFromId) and the rendered
 *  page disagree after evolve-in-place / kill-recovery removeItems prune items
 *  (2026-06-19 ellipse session: "circle the focus" bound to the directrices
 *  equation card instead of the ellipse figure → HTML-mode resolve-miss, no
 *  paint). Fall back to the 1-based index for scribbles without a stamped id. */
function scribbleMatchesItem(
  s: ScribbleCmd,
  item: WhiteboardCommand | undefined,
  idx1: number,
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sid = (s as any).targetId as string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cid = item ? ((item as any).id as string | undefined) : undefined;
  if (sid && cid) return sid === cid;
  return s.targetItemIndex === idx1;
}

function ScribbleOverlays({ scribbles, seenMarkSeeds }: { scribbles: ScribbleCmd[]; seenMarkSeeds: React.MutableRefObject<Set<string>> }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Phase 2: animate each mark on ONCE (WAAPI on the mark's <g>). Marks
  // re-render whenever the scribbles array changes; the seen-set keys on
  // `${shape}:${seed}` (shape + the mark's content seed) so re-renders
  // never replay AND a tick/highlight sharing a target's seed still get
  // independent animations. The ref itself lives in the parent
  // WhiteboardCanvas (seenMarkSeedsRef, passed down as this prop) rather
  // than locally, because ScribbleOverlays remounts on every page switch
  // (page wrapper is key={currentIndex}) — a local ref would replay every
  // mark's wipe on flip-back. Two cases can collide on the SAME key
  // (same shape + same target): a re-emitted tick after kill-recovery
  // re-targets the same feature — the second one is intentionally
  // skipped (no re-animation), not replayed. A different shape on the
  // same target (e.g. a highlight added after a tick) now gets its own
  // key and animates normally.
  const handMarks = drawOnEnabled();
  const animateMark = (el: SVGGElement | null, seed: string) => {
    if (!el || !handMarks || seenMarkSeeds.current.has(seed)) return;
    seenMarkSeeds.current.add(seed);
    el.animate(
      [
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
      ],
      { duration: 400, easing: 'ease-out', fill: 'backwards' },
    );
  };
  // After paint, walk the parent element for data-feature-* markers the
  // target renderer exposed (e.g. <g data-feature="object"
  // data-feature-cx="0.25" data-feature-cy="0.55" data-feature-w="0.08"
  // data-feature-h="0.25">). Resolved regions override the region passed
  // by the tutor — the renderer knows where the feature actually is.
  const [resolvedByFeature, setResolvedByFeature] = useState<Record<string, ResolvedRegion>>({});
  // Bounds of the target SVG within its parent container. We anchor the
  // overlay to the SVG rect (not the full parent), because the parent
  // usually also contains a title / notes div above or below the SVG —
  // mapping our 0-1 coords against the parent would shift the mark
  // vertically (2026-04-24 flowchart regression: "point to Start" landed
  // on the title "Binary Search Algorithm" instead of the Start node).
  const [svgRect, setSvgRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  // Target SVG's viewBox + preserveAspectRatio, read at effect time. The
  // overlay inherits BOTH so the two SVGs letterbox identically inside
  // the same outer rect. Without this, when the target letterboxes (its
  // aspect != rendered container's aspect — common with maxHeight caps),
  // the overlay's preserveAspectRatio="none" stretch-filled the full rect
  // while features sat in the letterboxed content area → visible offset.
  // (2026-04-24 pendulum session: "circle the 20° angle" landed off-mark.)
  const [targetViewBox, setTargetViewBox] = useState<{ w: number; h: number } | null>(null);
  const [targetPAR, setTargetPAR] = useState<string>('xMidYMid meet');
  // useLayoutEffect so the first measurement happens BEFORE the browser
  // paints. Without it, the overlay flashed on page switches because the
  // first paint showed the fallback (overlay spanning the full parent
  // with viewBox 0-100, par="none") and the effect-driven correction came
  // on the next frame — during page transitions the user would catch the
  // flash and then see the circle vanish if the measured rect came back
  // 0×0 (target SVG width:100% before layout settles).
  useLayoutEffect(() => {
    const self = svgRef.current;
    const parent = self?.parentElement;
    if (!parent) return;

    // Re-find the target SVG inside the measure closure so that when
    // CommandRenderer swaps its inner SVG (e.g., a page switch reuses
    // the same overlay component position), subsequent resize/mutation
    // events observe the FRESH SVG rather than a stale reference that
    // has since been detached from the DOM. Only return SVGs that
    // actually carry data-feature attrs — an SVG-without-features is a
    // signal to fall through to HTML mode.
    const findTargetSvg = (): SVGSVGElement | null => {
      const current = svgRef.current;
      if (!current) return null;
      const svgs = Array.from(parent.querySelectorAll('svg'));
      for (const svg of svgs) {
        if (svg === current) continue;
        if (svg.querySelector('[data-feature]')) return svg as SVGSVGElement;
      }
      return null;
    };

    const measure = () => {
      const overlay = svgRef.current;
      const targetSvg = findTargetSvg();

      // Mode selection. SVG mode wins when an inner SVG has data-feature
      // children (every structured renderer). HTML mode kicks in for
      // KaTeX / table / problem-card / solution / code renderers — we
      // walk the parent for any data-feature element, skipping the
      // overlay's own subtree, and resolve via getBoundingClientRect.
      // Same `resolvedByFeature` shape (0–1 fractions of the overlay
      // viewBox), so the render loop below stays unchanged.
      const next: Record<string, ResolvedRegion> = {};
      const seen = new Set<string>();
      const parentBB = parent.getBoundingClientRect();
      let mode: 'svg' | 'html' | 'none' = targetSvg ? 'svg' : 'none';

      if (mode === 'svg' && targetSvg) {
        for (const s of scribbles) {
          if (!s.targetFeature || seen.has(s.targetFeature)) continue;
          seen.add(s.targetFeature);
          const safe = s.targetFeature.replace(/"/g, '\\"');
          const el = targetSvg.querySelector(`[data-feature="${safe}"]`);
          if (!el) {
            console.warn('[Scribble] resolve-miss: data-feature="%s" not in DOM', s.targetFeature);
            continue;
          }
          const cx = Number(el.getAttribute('data-feature-cx'));
          const cy = Number(el.getAttribute('data-feature-cy'));
          const w = Number(el.getAttribute('data-feature-w'));
          const h = Number(el.getAttribute('data-feature-h'));
          if ([cx, cy, w, h].every(Number.isFinite)) {
            next[s.targetFeature] = {
              x: Math.max(0, cx - w / 2),
              y: Math.max(0, cy - h / 2),
              w: Math.min(1, w),
              h: Math.min(1, h),
            };
          } else {
            console.warn(
              '[Scribble] resolve-bad-bbox: data-feature="%s" had non-finite attrs (cx=%s cy=%s w=%s h=%s)',
              s.targetFeature, cx, cy, w, h,
            );
          }
        }
      } else {
        // No SVG-with-features in this item. Try HTML mode: the parent
        // (or its descendants) carries [data-feature] on a div / span.
        const candidates = Array.from(parent.querySelectorAll('[data-feature]'))
          .filter((el) => !overlay || !overlay.contains(el));
        if (candidates.length > 0) mode = 'html';
        if (mode === 'html' && parentBB.width > 0 && parentBB.height > 0) {
          for (const s of scribbles) {
            if (!s.targetFeature || seen.has(s.targetFeature)) continue;
            seen.add(s.targetFeature);
            const safe = s.targetFeature.replace(/"/g, '\\"');
            const el = parent.querySelector(`[data-feature="${safe}"]`);
            if (!el || (overlay && overlay.contains(el))) {
              console.warn('[Scribble] resolve-miss: data-feature="%s" not in HTML DOM', s.targetFeature);
              continue;
            }
            const elRect = el.getBoundingClientRect();
            if (elRect.width <= 0 || elRect.height <= 0) continue;
            next[s.targetFeature] = {
              x: Math.max(0, (elRect.left - parentBB.left) / parentBB.width),
              y: Math.max(0, (elRect.top - parentBB.top) / parentBB.height),
              w: Math.min(1, elRect.width / parentBB.width),
              h: Math.min(1, elRect.height / parentBB.height),
            };
          }
        } else if (mode === 'none') {
          const featuresAsked = scribbles
            .map((s) => s.targetFeature)
            .filter((f): f is string => Boolean(f));
          if (featuresAsked.length > 0) {
            console.warn(
              '[Scribble] no target with data-feature in DOM yet — features=[%s]. Will retry on next measure.',
              featuresAsked.join(','),
            );
          }
        }
      }

      setResolvedByFeature((prev) => {
        const keys = Object.keys(next);
        if (keys.length !== Object.keys(prev).length) return next;
        for (const k of keys) {
          if (!prev[k] || prev[k].x !== next[k].x || prev[k].y !== next[k].y || prev[k].w !== next[k].w || prev[k].h !== next[k].h) return next;
        }
        return prev;
      });

      if (mode === 'svg' && targetSvg) {
        const vb = targetSvg.getAttribute('viewBox');
        if (vb) {
          const parts = vb.split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
            const w = parts[2];
            const h = parts[3];
            if (w > 0 && h > 0) {
              setTargetViewBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
            }
          }
        }
        const par = targetSvg.getAttribute('preserveAspectRatio') || 'xMidYMid meet';
        setTargetPAR((prev) => (prev === par ? prev : par));

        const svgBB = targetSvg.getBoundingClientRect();
        if (svgBB.width < 1 || svgBB.height < 1) return;
        setSvgRect((prev) => {
          const nextRect = {
            top: svgBB.top - parentBB.top,
            left: svgBB.left - parentBB.left,
            width: svgBB.width,
            height: svgBB.height,
          };
          if (
            prev
            && Math.abs(prev.top - nextRect.top) < 0.5
            && Math.abs(prev.left - nextRect.left) < 0.5
            && Math.abs(prev.width - nextRect.width) < 0.5
            && Math.abs(prev.height - nextRect.height) < 0.5
          ) return prev;
          return nextRect;
        });
      } else if (mode === 'html') {
        // HTML mode: overlay covers the parent in CSS-pixel space. Use
        // `preserveAspectRatio="none"` so the overlay's viewBox stretches
        // 1:1 with parentRect, keeping mark positions accurate after
        // letterboxing-free fits.
        if (parentBB.width < 1 || parentBB.height < 1) return;
        setTargetViewBox((prev) => {
          const w = parentBB.width;
          const h = parentBB.height;
          return prev && Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5 ? prev : { w, h };
        });
        setTargetPAR((prev) => (prev === 'none' ? prev : 'none'));
        setSvgRect((prev) => {
          const nextRect = { top: 0, left: 0, width: parentBB.width, height: parentBB.height };
          if (
            prev
            && Math.abs(prev.top - nextRect.top) < 0.5
            && Math.abs(prev.left - nextRect.left) < 0.5
            && Math.abs(prev.width - nextRect.width) < 0.5
            && Math.abs(prev.height - nextRect.height) < 0.5
          ) return prev;
          return nextRect;
        });
      }
    };

    measure();

    // Observe target + parent for size changes. Also observe the parent
    // for DOM mutations so if the CommandRenderer swaps its SVG out from
    // under us (page switch, async renderer mount), we re-measure and
    // re-resolve features against the new SVG without waiting for the
    // next prop change.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(parent);
    const currentTarget = findTargetSvg();
    if (currentTarget) ro?.observe(currentTarget);

    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(measure) : null;
    mo?.observe(parent, { childList: true, subtree: true });

    // Belt + suspenders: rAF retry chain catches the case where the
    // feature DOM is present at first measure but its bbox isn't yet
    // laid out (e.g., HTML-mode parent has width/height < 1 → measure
    // early-returns without setting targetViewBox, and `measured`
    // stays false so scribbles never render). MutationObserver should
    // catch this on subsequent commits, but observed 2026-05-13 (4)
    // Phase 2a session showed scribbles registered in catalog AND
    // no '[Scribble] resolve-miss' warnings, yet no visible paint —
    // suggesting state never made it past the initial 0×0 measure.
    // Same pattern HandwriteOverlays uses (commit 4b1968a).
    const raf1 = requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(() => {
        measure();
        requestAnimationFrame(measure);
      });
    });

    return () => {
      ro?.disconnect();
      mo?.disconnect();
      cancelAnimationFrame(raf1);
    };
  }, [scribbles]);

  if (scribbles.length === 0) return null;
  // The overlay SVG must be in the DOM on first render so svgRef attaches
  // and the useLayoutEffect can walk the parent to find the target SVG —
  // returning null at first render stranded measurement and the mark
  // never appeared live (2026-04-24 vertex-C regression). Instead, render
  // the container SVG immediately with a neutral fallback, and defer only
  // the MARKS until measurement succeeds. When the target SVG doesn't
  // exist (non-SVG item, HTML renderer), the overlay stays empty.
  const measured = !!(targetViewBox && svgRect);
  const vbW = targetViewBox?.w ?? 100;
  const vbH = targetViewBox?.h ?? 100;
  const viewBoxAttr = `0 0 ${vbW} ${vbH}`;
  const parAttr = targetPAR;
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={svgRect
        ? { top: svgRect.top, left: svgRect.left, width: svgRect.width, height: svgRect.height }
        : { top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', visibility: 'hidden' }
      }
      viewBox={viewBoxAttr}
      preserveAspectRatio={parAttr}
    >
      {measured && scribbles.map((s, i) => {
        const color = s.color || '#3b82f6';
        // Region: feature-resolved (via catalog + data-feature lookup) or
        // small-centered default when the target SVG hasn't laid out yet.
        const resolved = s.targetFeature ? resolvedByFeature[s.targetFeature] : undefined;
        const source = resolved || { x: 0.35, y: 0.40, w: 0.30, h: 0.25 };
        // Map 0–1 fractions into the target viewBox's pixel space so
        // positions match features baked into the target SVG itself.
        const r = { x: source.x * vbW, y: source.y * vbH, w: source.w * vbW, h: source.h * vbH };

        // Post-redesign vocabulary: only `tick` and `highlight`. Legacy
        // shapes (circle/underline/box/arrow) silently render as a tick
        // so old session state + cached brain calls keep working.
        const isHighlight = s.shape === 'highlight';
        const seed = `${s.targetFeature ?? s.target ?? 'mark'}`;
        // Seen-set key ONLY — must stay separate from `seed` above, which
        // feeds strokeOutline's wobble RNG and must stay stable per-target
        // for PDF export lockstep (same target → same hand-wobble shape
        // regardless of which mark drew it). Keying on shape too means a
        // tick and a highlight on the same target no longer share an
        // animate-once slot.
        const seenKey = `${s.shape}:${seed}`;

        let mark: React.ReactNode;
        if (isHighlight) {
          // Hand marker swipe when the flag is on and the region is
          // swipe-shaped; translucent rect otherwise (tall regions, flag off).
          const band = handMarks ? highlightBand(r, seed) : null;
          mark = band ? (
            <path d={strokeOutline(band.spine, band.width, seed)} fill={color} fillOpacity="0.3" stroke="none" />
          ) : (
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h}
              fill={color} fillOpacity="0.25" stroke="none"
            />
          );
        } else {
          // Tick anchor: just OUTSIDE the feature's top-right corner — a
          // teacher's ✓ beside the answer. The previous anchor (inside the
          // right edge, vertically centered) sat exactly on the content
          // line: it struck through the "= 1" of an equation and covered a
          // point's coordinate label (2026-07-10 audit). The corner clears
          // the content; visibility is carried by SIZE + the white halo
          // (the 2026-05-13 "barely visible" fix), not by inward placement.
          // Clamped back inside the viewBox when the feature touches the
          // canvas edge so the tick never clips off-canvas.
          const tickSize = Math.max(16, Math.min(vbW, vbH) * 0.06);
          const half = tickSize / 2;
          let tx = r.x + r.w + half * 0.6;
          let ty = r.y - half * 0.2;
          if (tx + half > vbW - 2) tx = r.x + r.w - half * 0.8;
          if (ty - half * 0.6 < 2) ty = r.y + half * 0.8;
          if (handMarks) {
            // Hand-drawn ✓: same spine geometry as the stroked path below,
            // rendered as two filled variable-width outlines (white halo
            // underneath for any-background readability — same rationale
            // as the dual-stroke version).
            const spine = tickSpine(tx, ty, tickSize);
            const inner = Math.max(3, tickSize * 0.25);
            mark = (
              <g>
                <path d={strokeOutline(spine, inner + Math.max(2, tickSize * 0.14) + 2, `${seed}-halo`)} fill="#ffffff" opacity={0.95} stroke="none" />
                <path d={strokeOutline(spine, inner + 1.5, seed)} fill={color} stroke="none" />
              </g>
            );
          } else {
            // Two-segment ✓ path: short stroke from upper-left of the
            // ascender down to the cusp, then long stroke up to upper-right.
            const d = `M ${tx - half} ${ty} L ${tx - half * 0.25} ${ty + half * 0.7} L ${tx + half} ${ty - half * 0.6}`;
            const inner = Math.max(3, tickSize * 0.25);
            // White halo underneath so the colored tick reads on ANY
            // background fill (yellow Na cell, green frayer cell, etc.).
            // 2026-05-13 user feedback (image #62): red tick on yellow
            // Na cell faded into the fill and covered the symbol.
            // Dual-stroke pattern: render a slightly-fatter WHITE path
            // first, then the colored path on top — gives the colored
            // stroke a thin white outline that pops against anything.
            mark = (
              <g>
                <path
                  d={d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={inner + Math.max(2, tickSize * 0.14)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={inner}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          }
        }

        return <g key={i} ref={(el) => animateMark(el, seenKey)}>{mark}</g>;
      })}
    </svg>
  );
}

/** Wraps TryYourselfRenderer with a context-bound onSubmit so the
 *  student's answer flows up to the parent (page.tsx) and back into
 *  the brain as a synthetic student turn — closing the loop on
 *  try-yourself segments. */
function TryYourselfWithBrainHookup(props: {
  title?: string;
  problem: string;
  expectedAnswer?: string;
  responseFormat?: 'mcq' | 'frq' | 'numeric';
  choices?: Array<{ id: string; text: string; correct?: boolean }>;
  hints?: string[];
}) {
  const ctx = React.useContext(WhiteboardCallbackContext);
  return (
    <TryYourselfRenderer
      title={props.title}
      problem={props.problem}
      expectedAnswer={props.expectedAnswer}
      responseFormat={props.responseFormat}
      choices={props.choices}
      hints={props.hints}
      onSubmit={(answer) => {
        // Shared decision seam (src/app/tutor/components/whiteboard/
        // tryYourselfAnswer.ts) — the SAME function TryYourselfRenderer
        // uses for its own ✓/✗ affordance and verdict text, so what's
        // relayed to the brain here can never disagree with what the
        // student sees on the card. For mcq this resolves by OPTION
        // IDENTITY (choices[].correct, or label-vs-expectedAnswer
        // fallback) rather than comparing the submitted choice id
        // against free-text expectedAnswer directly — see that module's
        // header comment for the bug this replaced.
        const isCorrect = computeTryYourselfVerdict(answer, props.expectedAnswer, props.responseFormat, props.choices);
        ctx.onTryYourselfAnswer?.(answer, props.expectedAnswer, isCorrect);
      }}
    />
  );
}

interface CommandRendererProps {
  command: WhiteboardCommand;
}

/**
 * Memoized: `command` objects are append-only stable references, but the
 * commands ARRAY updates once per render-sync sentence-flush (several per
 * turn), which re-rendered every item on the current page — including
 * re-running solveDiagram() and KaTeX for content that hadn't changed
 * (2026-07-10 perf audit). With memo, only genuinely new/changed items
 * render; context-fed callbacks (WhiteboardCallbackContext) still update
 * normally since useContext bypasses memo.
 */
export const CommandRenderer = memo(CommandRendererInner);

function CommandRendererInner({ command }: CommandRendererProps) {
  switch (command.action) {
    case 'showEquation':
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <EquationRenderer
            latex={command.latex}
            label={command.label}
            highlight={command.highlight}
            className="text-xl"
          />
        </div>
      );

    case 'showGraph': {
      // Use Desmos if available (better rendering, handles LaTeX/implicit equations)
      // Fall back to legacy Mafs-based renderer if Desmos hasn't loaded
      const useDemos = typeof window !== 'undefined' && !!window.Desmos;
      if (useDemos) {
        return (
          <DesmosGraphRenderer
            type={command.type}
            data={command.data}
          />
        );
      }
      const GraphComponent = getGraphComponent(command.type);
      return (
        <GraphComponent
          type={command.type}
          data={command.data}
        />
      );
    }

    case 'showDiagram':
      return <DiagramDispatcher type={command.type} params={command.params} />;

    case 'showSketch': {
      // A doodle only renders once its primitives have resolved (async). A
      // request without primitives should never reach here (render-sync holds
      // it pending), but guard defensively.
      const prims = command.primitives as SketchPrimitive[] | undefined;
      // The doodler abstained / failed → render the clean labeled fallback card
      // in place of the sketch (set by the orchestrator). Never a blank board
      // under board-anchored narration.
      if (command.fallbackCard) {
        return (
          <SketchFallbackCard
            title={command.fallbackCard.title}
            concept={command.fallbackCard.concept}
            labels={command.fallbackCard.labels}
          />
        );
      }
      if (!prims || prims.length === 0) return null;
      return (
        <SketchRenderer
          primitives={prims}
          title={command.title}
          description={command.description}
          labels={command.labels}
        />
      );
    }

    case 'drawVector':
      return (
        <VectorRenderer
          from={command.from}
          to={command.to}
          label={command.label}
          color={command.color}
        />
      );

    case 'annotate':
      return (
        <div
          className={`p-4 rounded-lg ${
            command.style === 'highlight'
              ? 'bg-yellow-50 border-2 border-yellow-300'
              : command.style === 'warning'
              ? 'bg-red-50 border-2 border-red-300'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p className="text-lg">{command.text}</p>
        </div>
      );

    case 'showTryYourself':
      return (
        <TryYourselfWithBrainHookup
          title={command.title}
          problem={command.problem}
          expectedAnswer={command.expectedAnswer}
          responseFormat={command.responseFormat}
          choices={command.choices}
          hints={command.hints}
        />
      );

    case 'showProblem': {
      // Filter out any givenValues that are missing required fields
      const validGivenValues = (command.problem.givenValues || []).filter(
        (gv) => gv && (gv.symbol || gv.value !== undefined)
      );
      const problem = command.problem as typeof command.problem & {
        answerChoices?: Array<{ letter: string; text: string }>;
        sourceTag?: string;
        difficultyLabel?: 'easy' | 'medium' | 'hard';
        format?: string;
      };
      const answerChoices = Array.isArray(problem.answerChoices) ? problem.answerChoices : [];
      const difficultyStyle = problem.difficultyLabel === 'hard'
        ? 'bg-red-100 text-red-800'
        : problem.difficultyLabel === 'medium'
        ? 'bg-amber-100 text-amber-800'
        : problem.difficultyLabel === 'easy'
        ? 'bg-emerald-100 text-emerald-800'
        : '';
      return (
        <div
          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          data-feature="problem"
          style={{ position: 'relative' }}
        >
          {(problem.sourceTag || problem.difficultyLabel) && (
            <div className="flex items-center gap-2 mb-2">
              {problem.sourceTag && (
                <span
                  className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                  data-feature="source"
                >
                  {problem.sourceTag}
                </span>
              )}
              {problem.difficultyLabel && (
                <span
                  className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${difficultyStyle}`}
                  data-feature="difficulty"
                >
                  {problem.difficultyLabel}
                </span>
              )}
            </div>
          )}
          <h4 className="font-semibold text-blue-900 mb-2" data-feature="title">
            <InlineMathText text={problem.title || 'Problem'} />
          </h4>
          <p className="text-gray-800 whitespace-pre-wrap" data-feature="statement">
            <InlineMathText text={problem.statement || ''} />
          </p>
          {validGivenValues.length > 0 && (
            <div className="mt-3" data-feature="given">
              <p className="text-sm font-medium text-gray-600">Given:</p>
              <ul className="text-sm text-gray-700 ml-4 list-disc">
                {validGivenValues.map((gv, i) => (
                  <li key={i} data-feature={`given-${i + 1}`}>
                    <EquationRenderer
                      latex={`${gv.symbol || '?'} = ${gv.value ?? '?'} \\text{ ${gv.unit || ''}}`}
                      displayMode={false}
                      className="inline-block"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {answerChoices.length > 0 && (
            <ul className="mt-3 space-y-1.5" data-feature="choices">
              {answerChoices.map((ac, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  data-feature={`choice-${(ac.letter || String.fromCharCode(65 + i)).toLowerCase()}`}
                >
                  <span className="font-semibold text-blue-900 flex-shrink-0 min-w-[1.25rem]">
                    {ac.letter})
                  </span>
                  <span className="text-gray-800"><InlineMathText text={stripRedundantChoiceLabel(ac.text, ac.letter || String.fromCharCode(65 + i))} /></span>
                </li>
              ))}
            </ul>
          )}
          {problem.format === 'grid-in' && answerChoices.length === 0 && (
            <p className="mt-3 text-xs text-gray-500 italic">
              Grid-in — enter a numeric answer.
            </p>
          )}
        </div>
      );
    }

    case 'showSolution':
      return (
        <div className="space-y-4" data-feature="solution" style={{ position: 'relative' }}>
          <h4 className="font-semibold text-gray-800" data-feature="solution-title">Solution</h4>
          {command.steps.map((step, index) => {
            const stepNum = step.stepNumber ?? (index + 1);
            return (
              <div key={index} className="flex gap-3" data-feature={`step-${stepNum}`} style={{ position: 'relative' }}>
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                  {stepNum}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700" data-feature={`step-${stepNum}-description`}>{step.description}</p>
                  {step.equation && (
                    <div data-feature={`step-${stepNum}-equation`}>
                      <EquationRenderer latex={step.equation} className="mt-2" />
                    </div>
                  )}
                  {step.substitution && (
                    <div data-feature={`step-${stepNum}-substitution`}>
                      <EquationRenderer latex={step.substitution} className="mt-1 text-gray-600" />
                    </div>
                  )}
                  {step.result && (
                    <div data-feature={`step-${stepNum}-result`}>
                      <EquationRenderer latex={step.result} className="mt-1 font-medium" />
                    </div>
                  )}
                  {step.explanation && (
                    <p className="text-sm text-gray-500 mt-1 italic" data-feature={`step-${stepNum}-explanation`}>{step.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'showTable':
      return (
        <div className="overflow-x-auto" data-feature="table" style={{ position: 'relative' }}>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100" data-feature="header-row">
                {command.headers.map((header, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 px-4 py-2 text-left font-medium"
                    data-feature={`header-col-${i + 1}`}
                  >
                    <CellContent value={String(header)} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {command.rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  data-feature={`row-${i + 1}`}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 px-4 py-2"
                      data-feature={`cell-r${i + 1}-c${j + 1}`}
                    >
                      <CellContent value={String(cell)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'showSvgDiagram':
      return (
        <SvgDiagram
          svg={command.svg}
          title={command.title}
          description={command.description}
        />
      );

    case 'showCode':
      return (
        <div className="p-4">
          {command.label && (
            <div className="text-sm font-medium text-gray-600 mb-2">{command.label}</div>
          )}
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed font-mono">
            {command.language && (
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{command.language}</div>
            )}
            <code>{command.code}</code>
          </pre>
        </div>
      );

    case 'showImage':
      return (
        <div className="flex flex-col items-center">
          <img
            src={command.url}
            alt={command.alt}
            className="max-w-full h-auto rounded-lg shadow"
          />
          {command.alt && (
            <p className="text-sm text-gray-500 mt-2">{command.alt}</p>
          )}
        </div>
      );

    case 'showWorkedExample':
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">
            {command.example.title || 'Worked Example'}
          </h4>
          {/* All worked-example prose runs through InlineMathText so any
              inline $…$ math renders via KaTeX, matching the equation cards
              around it (2026-07-10 audit: unicode-vs-KaTeX mixing). */}
          {command.example.problem && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><InlineMathText text={command.example.problem.statement || ''} /></p>
            </div>
          )}
          {command.example.walkthrough && command.example.walkthrough.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <p className="text-gray-700"><InlineMathText text={step.tutorSays || ''} /></p>
                {step.checkQuestion && (
                  <p className="text-sm text-blue-600 mt-1 italic">
                    💭 <InlineMathText text={step.checkQuestion} />
                  </p>
                )}
              </div>
            </div>
          ))}
          {command.example.keyTakeaways && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">Key Takeaways:</p>
              <ul className="mt-1 list-disc ml-4 text-gray-700">
                {command.example.keyTakeaways.map((takeaway, i) => (
                  <li key={i}><InlineMathText text={takeaway} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'showPassage': {
      // Defense-in-depth: the tool schema marks `text` required, but a
      // malformed call (missing/empty text) should surface a visible
      // error rather than an empty card. Same try/catch-around-a-solver
      // pattern as showLewisConstructed / showGeometryConstructed above.
      try {
        const solved = solvePassage({
          title: command.title,
          source: command.source,
          text: command.text,
          highlights: command.highlights,
        });
        return (
          <PassageRenderer
            title={solved.title}
            source={solved.source}
            text={solved.text}
            highlights={solved.highlights}
          />
        );
      } catch (err) {
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Passage error: {(err as Error).message}
          </div>
        );
      }
    }

    // ── New structured math diagram tools ──

    case 'showNumberLine':
      return <NumberLineRenderer title={command.title} min={command.min} max={command.max} step={command.step} points={command.points} intervals={command.intervals} segments={command.segments} fractionTicks={command.fractionTicks} />;

    case 'showGeometry':
      return <GeometryRenderer title={command.title} points={command.points} segments={command.segments} polygons={command.polygons} circles={command.circles} arcs={command.arcs} angles={command.angles} conics={command.conics} showGrid={command.showGrid} showAxes={command.showAxes} viewRange={command.viewRange} />;

    case 'showGeometryConstructed': {
      // Solve constructions into a primitive geometry payload, then render
      // through the existing GeometryRenderer. If the solver throws (bad
      // spec), surface a small inline error so the brain sees something
      // failed and can self-correct on retry.
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { solveGeometry } = require('@/lib/tutor/diagrams/geometry-solver') as typeof import('@/lib/tutor/diagrams/geometry-solver');
        const solved = solveGeometry({
          title: command.title,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          given: command.given as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          steps: command.steps as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          display: command.display as any,
        });
        return (
          <GeometryRenderer
            title={solved.title}
            points={solved.points}
            segments={solved.segments}
            polygons={solved.polygons}
            circles={solved.circles}
            arcs={solved.arcs}
            angles={solved.angles}
            conics={solved.conics}
            showGrid={solved.showGrid}
            showAxes={solved.showAxes}
            viewRange={solved.viewRange}
          />
        );
      } catch (err) {
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Construction error: {(err as Error).message}
          </div>
        );
      }
    }

    case 'showUnitCircle':
      return <UnitCircleRenderer title={command.title} highlightAngles={command.highlightAngles} showAllStandard={command.showAllStandard} showRadians={command.showRadians} showDegrees={command.showDegrees} showArc={command.showArc} />;

    case 'showFractionBar':
      return <FractionBarRenderer title={command.title} items={command.items} layout={command.layout} showComparison={command.showComparison} />;

    case 'showMolecule':
      return <MoleculeRenderer
        smiles={command.smiles}
        title={command.title}
        description={command.description}
        interactive={command.interactive}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mode={(command as any).mode}
        onMoleculeChanged={(newSmiles) => {
          // Dispatch custom event so VoiceTutorRealtime can inject it into the AI conversation
          window.dispatchEvent(new CustomEvent('molecule-changed', {
            detail: { smiles: newSmiles, originalSmiles: command.smiles, title: command.title },
          }));
        }}
      />;

    case 'showTree':
      return <TreeRenderer title={command.title} type={command.type} root={command.root} showLeafProbabilities={command.showLeafProbabilities} direction={command.direction} />;

    case 'showVennDiagram':
      return <VennDiagramRenderer title={command.title} sets={command.sets} regions={command.regions} universalLabel={command.universalLabel} />;

    case 'showMatrix':
      return <MatrixRenderer title={command.title} rows={command.rows} brackets={command.brackets} augmented={command.augmented} rowLabels={command.rowLabels} colLabels={command.colLabels} rowOperations={command.rowOperations} resultMatrix={command.resultMatrix} operatorSymbol={command.operatorSymbol} />;

    case 'showStats':
      return <StatsRenderer title={command.title} type={command.type} data={command.data} bins={command.bins} showCounts={command.showCounts} binWidth={command.binWidth} xLabel={command.xLabel} yLabel={command.yLabel} boxplot={command.boxplot} bar={command.bar} pie={command.pie} distribution={command.distribution} points={command.points} regression={command.regression} showTrendLine={command.showTrendLine} rValue={command.rValue} rSquared={command.rSquared} equationLabel={command.equationLabel} highlightPoint={command.highlightPoint} showResiduals={command.showResiduals} />;

    case 'showTimeline':
      return <TimelineRenderer title={command.title} events={command.events} orientation={command.orientation} />;

    case 'showMap':
      return <MapRenderer title={command.title} background={command.background} pins={command.pins} regions={command.regions} caption={command.caption} />;

    case 'showCircuit':
      return <CircuitRenderer title={command.title} nodes={command.nodes} components={command.components} showNodes={command.showNodes} />;

    case 'showLewis':
      return <LewisRenderer title={command.title} atoms={command.atoms} bonds={command.bonds} formula={command.formula} geometry={command.geometry} />;

    case 'showEarlyMath':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <EarlyMathRenderer spec={command.spec as any} />;

    case 'showPhonics':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <PhonicsRenderer spec={command.spec as any} />;

    case 'showGraphicOrganizer':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <GraphicOrganizerRenderer spec={command.spec as any} />;

    case 'showWritingFrame':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <WritingFrameRenderer spec={command.spec as any} />;

    case 'showLabeledImage':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <LabeledImageRenderer spec={command.spec as any} />;

    case 'showSolvedExample':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <SolvedExampleRenderer spec={command.spec as any} />;

    case 'showQuiz':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <QuizRenderer spec={command.spec as any} />;

    case 'showRunCode':
      return (
        <CodeRunDispatcher
          title={command.title}
          code={command.code}
          entry={command.entry}
          language={command.language}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tests={command.tests as any}
          timeoutMs={command.timeoutMs}
        />
      );

    case 'showDimensionalCheck': {
      // Run the existing dimensional validator and render the result.
      // Same pattern as showBalancedEquation: deterministic at canvas
      // dispatch; errors render inline so the brain sees them.
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { checkFormulaDimensions, checkAgainstUnit, dimensionsOf } = require('@/lib/tutor/validation/dimensional') as typeof import('@/lib/tutor/validation/dimensional');
        const fmtDimLocal = (d: readonly number[]) => {
          const labels = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'];
          const parts: string[] = [];
          for (let i = 0; i < 7; i++) {
            if (d[i] !== 0) parts.push(d[i] === 1 ? labels[i] : `${labels[i]}^${d[i]}`);
          }
          return parts.length ? parts.join('·') : '1 (dimensionless)';
        };
        if (command.formula) {
          const res = checkFormulaDimensions(command.formula);
          return (
            <DimensionalCheckRenderer
              title={command.title}
              expression={command.formula}
              match={res.match}
              computed={res.leftDim ? fmtDimLocal(res.leftDim) : '?'}
              expected={res.rightDim ? fmtDimLocal(res.rightDim) : undefined}
              issues={res.issues}
              note={command.note}
            />
          );
        }
        if (command.expression && command.expectedUnit) {
          const res = checkAgainstUnit(command.expression, command.expectedUnit);
          return (
            <DimensionalCheckRenderer
              title={command.title}
              expression={`${command.expression} →? [${command.expectedUnit}]`}
              match={res.match}
              computed={res.computed ? fmtDimLocal(res.computed) : '?'}
              expected={res.expected ? fmtDimLocal(res.expected) : undefined}
              issues={res.issues}
              note={command.note}
            />
          );
        }
        if (command.expression) {
          const r = dimensionsOf(command.expression);
          return (
            <DimensionalCheckRenderer
              title={command.title}
              expression={command.expression}
              match
              computed={fmtDimLocal(r.dim)}
              note={command.note}
            />
          );
        }
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Dimensional check error: provide either `formula` or `expression` (with optional `expectedUnit`).
          </div>
        );
      } catch (err) {
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Dimensional check error: {(err as Error).message}
          </div>
        );
      }
    }

    case 'showBalancedEquation': {
      // Balance deterministically here. Same pattern as
      // showGeometryConstructed → solver → existing renderer.
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { balanceEquation } = require('@/lib/tutor/chemistry/balancer') as typeof import('@/lib/tutor/chemistry/balancer');
        const balanced = balanceEquation(command.equation);
        return (
          <BalancedEquationRenderer
            title={command.title}
            reactants={balanced.reactants}
            products={balanced.products}
            reactionType={command.reactionType}
            note={command.note}
          />
        );
      } catch (err) {
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Equation balance error: {(err as Error).message}
          </div>
        );
      }
    }

    case 'showLewisConstructed': {
      // Solve the declarative spec into a primitive Lewis payload, then
      // route to the existing renderer. Same pattern as
      // showGeometryConstructed → GeometryRenderer.
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { solveLewis } = require('@/lib/tutor/diagrams/lewis-solver') as typeof import('@/lib/tutor/diagrams/lewis-solver');
        const solved = solveLewis({
          title: command.title,
          formula: command.formula,
          geometry: command.geometry,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          atoms: command.atoms as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bonds: command.bonds as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          layout: command.layout as any,
          centerAtomId: command.centerAtomId,
          skipValidation: command.skipValidation,
        });
        return (
          <LewisRenderer
            title={solved.title}
            formula={solved.formula}
            geometry={solved.geometry}
            atoms={solved.atoms}
            bonds={solved.bonds}
          />
        );
      } catch (err) {
        return (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            Lewis construction error: {(err as Error).message}
          </div>
        );
      }
    }

    case 'showPeriodicTable':
      return <PeriodicTableRenderer title={command.title} highlight={command.highlight} highlightGroup={command.highlightGroup} highlightPeriod={command.highlightPeriod} highlightCategory={command.highlightCategory} showMass={command.showMass} />;

    case 'showAnnotatedPassage':
      return <AnnotatedPassageRenderer title={command.title} source={command.source} passage={command.passage} lines={command.lines} startLineNumber={command.startLineNumber} highlights={command.highlights} marginNotes={command.marginNotes} />;

    case 'showCallStack':
      return <CallStackRenderer title={command.title} frames={command.frames} finalReturn={command.finalReturn} />;

    case 'showFlowchart':
      return <FlowchartRenderer title={command.title} nodes={command.nodes} edges={command.edges} layout={command.layout} />;

    case 'showManipulative':
      return <ManipulativeRenderer title={command.title} type={command.type} base10={command.base10} tenFrame={command.tenFrame} areaModel={command.areaModel} />;

    case 'showFreeBodyDiagram':
      return <FreeBodyDiagramRenderer
        title={command.title}
        object={command.object}
        surface={command.surface}
        forces={command.forces}
        notes={command.notes}
      />;

    case 'showEnergyBars':
      return <EnergyBarsRenderer
        title={command.title}
        positions={command.positions}
        yAxisLabel={command.yAxisLabel}
        showTotalLine={command.showTotalLine}
        notes={command.notes}
      />;

    case 'showCollision':
      return <CollisionRenderer
        title={command.title}
        dimension={command.dimension}
        type={command.type}
        before={command.before}
        after={command.after}
        momentumAnnotation={command.momentumAnnotation}
        notes={command.notes}
      />;

    case 'showReactionCoordinate':
      return <ReactionCoordinateRenderer
        title={command.title}
        reactants_energy={command.reactants_energy}
        products_energy={command.products_energy}
        activation_energies={command.activation_energies}
        curve_labels={command.curve_labels}
        reactant_label={command.reactant_label}
        product_label={command.product_label}
        units={command.units}
      />;

    case 'showPunnett':
      return <PunnettRenderer
        parent1={command.parent1}
        parent2={command.parent2}
        title={command.title}
        trait={command.trait}
        showPhenotypeRatio={command.showPhenotypeRatio}
      />;

    // ── Tier-1 structured renderers ──
    case 'showCoordinatePlane':
      return <CoordinatePlaneRenderer {...command} />;
    case 'showScatterPlot':
      return <ScatterPlotRenderer {...command} />;
    case 'showCycleDiagram':
      return <CycleDiagramRenderer {...command} />;
    case 'showConceptMap':
      return <ConceptMapRenderer {...command} />;
    case 'showMotionDiagram':
      return <MotionDiagramRenderer {...command} />;
    case 'showProjectileMotion':
      return <ProjectileMotionRenderer {...command} />;
    case 'showSimpleMachine':
      return <SimpleMachineRenderer {...command} />;
    case 'showPendulum':
      return <PendulumRenderer {...command} />;
    case 'showSpringMass':
      return <SpringMassRenderer {...command} />;
    case 'showRayDiagram':
      return <RayDiagramRenderer {...command} />;
    case 'showWave':
      return <WaveRenderer {...command} />;
    case 'showVector':
      return <Vector2DRenderer {...command} />;
    case 'showOrbitalDiagram':
      return <OrbitalDiagramRenderer {...command} />;
    case 'showPedigree':
      return <PedigreeRenderer {...command} />;
    case 'showCellDiagram':
      return <CellDiagramRenderer {...command} />;
    case 'showDna':
      return <DnaRenderer {...command} />;
    case 'showFoodWeb':
      return <FoodWebRenderer {...command} />;

    case 'highlight':
    case 'clear':
    case 'newPage':
    case 'goToPage':
    case 'removeItems':
    case 'reviseItems':
    case 'handwrite':
      return null;

    default:
      return (
        <div className="p-4 text-gray-500">
          Unknown command type
        </div>
      );
  }
}

/**
 * Dispatches diagram rendering based on type
 */
interface DiagramDispatcherProps {
  type: string;
  params: Record<string, unknown>;
}

function DiagramDispatcher({ type, params }: DiagramDispatcherProps) {
  // Handle missing or incomplete params gracefully with defaults
  switch (type) {
    case 'free-body':
      // Default to simple gravity force if no forces provided
      const defaultForces = [{ magnitude: 10, direction: 270, label: 'W', color: '#dc2626' }];
      return (
        <FreeBodyDiagram
          forces={(params.forces as { magnitude: number; direction: number; label: string; color?: string }[]) || defaultForces}
          objectLabel={(params.objectLabel as string) || 'Object'}
          showNet={params.showNet as boolean}
          scale={(params.scale as number) || 1}
        />
      );

    case 'motion':
      // Default motion positions showing constant velocity
      const defaultPositions = [
        { x: 0, y: 0, t: 0 },
        { x: 2, y: 0, t: 1 },
        { x: 4, y: 0, t: 2 },
        { x: 6, y: 0, t: 3 },
      ];
      return (
        <MotionDiagram
          positions={(params.positions as { x: number; y: number; t: number }[]) || defaultPositions}
          showVelocityVectors={params.showVelocityVectors !== false}
          title={(params.title as string) || (params.description as string) || 'Motion Diagram'}
        />
      );

    case 'projectile':
      return (
        <ProjectileMotionDiagram
          v0={(params.v0 as number) || 20}
          angle={(params.angle as number) || 45}
          g={(params.g as number) || 9.8}
          showComponents={params.showComponents !== false}
          showVelocityAtPoints={params.showVelocityAtPoints !== false}
        />
      );

    case 'coordinate-system':
      return (
        <CoordinateSystemDiagram
          origin={(params.origin as { x: number; y: number }) || { x: 0, y: 0 }}
          showLabels={params.showLabels !== false}
          vectors={(params.vectors as { to: { x: number; y: number }; label: string; color?: string }[]) || []}
        />
      );

    case 'vector':
      // Default to a simple rightward vector if no coordinates provided
      const defaultFrom = { x: 0, y: 0 };
      const defaultTo = { x: 3, y: 2 };
      return (
        <VectorRenderer
          from={(params.from as { x: number; y: number }) || defaultFrom}
          to={(params.to as { x: number; y: number }) || defaultTo}
          label={(params.label as string) || 'v'}
          color={params.color as string}
        />
      );

    case 'vectors':
    case 'velocity':
    case 'vector-addition':
      // Default to showing two example vectors
      const defaultVectors = [
        { magnitude: 5, direction: 0, label: 'v₁' },
        { magnitude: 3, direction: 90, label: 'v₂' },
      ];
      return (
        <VectorDiagram
          title={(params.title as string) || (params.description as string) || 'Vector Diagram'}
          vectors={(params.vectors as Array<{ magnitude: number; direction: number; label: string; color?: string }>) || defaultVectors}
          showResultant={params.showResultant as boolean}
          resultantLabel={params.resultantLabel as string}
          scale={(params.scale as number) || 1}
          showAxes={params.showAxes !== false}
          showAngleLabels={params.showAngleLabels !== false}
        />
      );

    case 'pipe-flow':
    case 'fluid-flow':
    case 'continuity':
      return (
        <PipeFlowDiagram
          title={(params.title as string) || 'Flow Through a Pipe'}
          wideArea={(params.wideArea as number) || (params.area1 as number) || 4}
          narrowArea={(params.narrowArea as number) || (params.area2 as number) || 2}
          wideVelocity={(params.wideVelocity as number) || (params.velocity1 as number) || 2}
          narrowVelocity={(params.narrowVelocity as number) || (params.velocity2 as number) || undefined}
          showPressure={(params.showPressure as boolean) || false}
          widePressure={params.widePressure as string}
          narrowPressure={params.narrowPressure as string}
          description={params.description as string}
        />
      );

    case 'circular-path':
      return (
        <CircularPathDiagram
          radius={(params.radius as number) || 3}
          center={(params.center as { x: number; y: number }) || { x: 0, y: 0 }}
          points={params.points as Array<{ angle: number; label: string; color?: string }>}
          path={params.path as Array<{ from: string; to: string; type: 'straight' | 'arc'; color?: string }>}
          title={(params.title as string) || (params.description as string) || 'Circular Path'}
        />
      );

    case 'problem':
      return (
        <ProblemDiagram
          problemText={(params.problemText as string) || (params.description as string) || ''}
          diagramDescription={params.diagramDescription as string}
          givenValues={params.givenValues as Array<{ symbol: string; value: string; unit?: string }>}
          findValues={params.findValues as string[]}
        />
      );

    default:
      // Catalog dispatch — every kind in the diagram catalog is solved
      // through the manifest and routed to its dedicated renderer.
      // Solver errors render as a small inline message so the brain's
      // validator-feedback loop can pick up the rejection reason.
      if (isImplementedKind(type)) {
        try {
          const figure = solveDiagram(type, params);
          return <CatalogDispatch kind={type} figure={figure} />;
        } catch (err) {
          // Solver rejected the brain's params. Log for debugging and
          // render a subtle "preparing" hint so the user doesn't see
          // a blank board (page badge says "1 item" but the canvas is
          // empty). The orchestrator's validator-feedback retry will
          // re-emit the command with corrected params shortly after.
          const msg = err instanceof DiagramSolverError ? err.message : String(err);
          console.warn('[CommandRenderer] diagram solver rejected:', msg);
          return (
            <div className="space-y-3 py-6 px-2">
              <div className="wb-skeleton h-5 bg-gray-200 rounded w-2/3" />
              <div className="wb-skeleton h-24 bg-gray-100 rounded" />
              <p className="text-xs text-gray-400 italic text-center">✏️ Tutor is figuring out how to draw this…</p>
            </div>
          );
        }
      }

      // For unknown types, show a description if provided
      if (params.description) {
        return (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="text-gray-700">{params.description as string}</p>
            <p className="text-xs text-gray-400 mt-2">Diagram type: {type}</p>
          </div>
        );
      }
      return (
        <div className="p-4 text-gray-500 text-center">
          Diagram type &apos;{type}&apos; not yet implemented
        </div>
      );
  }
}

/**
 * Get the appropriate graph component based on type
 */
function getGraphComponent(type: string) {
  switch (type) {
    case 'position-time':
      return PositionTimeGraph;
    case 'velocity-time':
      return VelocityTimeGraph;
    case 'acceleration-time':
      return AccelerationTimeGraph;
    default:
      return GraphRenderer;
  }
}

/**
 * Get a human-readable label for command types
 */
export function getCommandTypeLabel(action: string): string {
  switch (action) {
    case 'showEquation':
      return 'Equation';
    case 'showGraph':
      return 'Graph';
    case 'showDiagram':
      return 'Diagram';
    case 'drawVector':
      return 'Vector';
    case 'annotate':
      return 'Annotation';
    case 'showProblem':
      return 'Problem';
    case 'showSolution':
      return 'Solution';
    case 'showTable':
      return 'Table';
    case 'showImage':
      return 'Image';
    case 'showSvgDiagram':
      return 'Diagram';
    case 'showWorkedExample':
      return 'Worked Example';
    case 'showCode':
      return 'Code';
    case 'showNumberLine':
      return 'Number Line';
    case 'showGeometry':
      return 'Geometry';
    case 'showUnitCircle':
      return 'Unit Circle';
    case 'showFractionBar':
      return 'Fractions';
    case 'showTree':
      return 'Tree Diagram';
    case 'showMolecule':
      return 'Molecule';
    case 'showVennDiagram':
      return 'Venn Diagram';
    case 'showMatrix':
      return 'Matrix';
    case 'showStats':
      return 'Statistics';
    case 'showTimeline':
      return 'Timeline';
    case 'showMap':
      return 'Map';
    case 'showCircuit':
      return 'Circuit';
    case 'showLewis':
      return 'Lewis Structure';
    case 'showPeriodicTable':
      return 'Periodic Table';
    case 'showAnnotatedPassage':
      return 'Passage';
    case 'showPassage':
      return 'Passage';
    case 'showCallStack':
      return 'Call Stack';
    case 'showFlowchart':
      return 'Flowchart';
    case 'showManipulative':
      return 'Manipulative';
    case 'showFreeBodyDiagram':
      return 'Free Body Diagram';
    case 'showEnergyBars':
      return 'Energy Bar Chart';
    case 'showCollision':
      return 'Collision Diagram';
    case 'showReactionCoordinate':
      return 'Reaction Coordinate';
    case 'showPunnett':
      return 'Punnett Square';
    default: {
      // Unmapped actions must still read as human words — the raw
      // camelCase action leaks straight into student-visible chrome
      // (item separators render it uppercased: "SHOWGEOMETRYCONSTRUCTED",
      // 2026-07-10 audit). Strip the tool-verb prefix and split camelCase.
      const words = action
        .replace(/^(show|draw)(?=[A-Z])/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .trim();
      return words ? words.charAt(0).toUpperCase() + words.slice(1) : action;
    }
  }
}
