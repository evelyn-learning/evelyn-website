'use client';

/**
 * Whiteboard Canvas
 *
 * Main whiteboard component that renders all visual elements
 * from the AI tutor including equations, graphs, and diagrams.
 */

import React, { useState, useCallback, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2, GripVertical, ChevronDown } from 'lucide-react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { EquationRenderer, DerivationRenderer } from './EquationRenderer';
import { SketchRenderer } from './SketchRenderer';
import { SketchFallbackCard } from './SketchFallbackCard';
import type { SketchPrimitive } from '@/lib/tutor/whiteboard/sketch-schema';
import { TryYourselfRenderer } from './TryYourselfRenderer';
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
   *  content. (Flag-gated host; default keeps every legacy caller identical.) */
  chrome?: 'full' | 'minimal';
  /** Surfaces the internal page navigation state so a host (the SessionStage)
   *  can render its own switcher in 'minimal' chrome. Fires whenever the page
   *  count / current index / titles change. `goTo` is stable. */
  onNavChange?: (nav: { index: number; count: number; titles: string[]; goTo: (i: number) => void }) => void;
}

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

  // Handle goToPage navigation: find the target page by title
  useEffect(() => {
    const lastGoTo = [...commands].reverse().find((cmd) => cmd.action === 'goToPage');
    if (lastGoTo && lastGoTo.action === 'goToPage') {
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
              featureEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              scrolled = true;
            }
          }
          if (!scrolled) itemEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const prevFollowCountRef = useRef(0);
  useEffect(() => {
    if (commands.length <= prevFollowCountRef.current) {
      prevFollowCountRef.current = commands.length;
      return;
    }
    const added = commands.slice(prevFollowCountRef.current);
    prevFollowCountRef.current = commands.length;
    if (added.some((c) => c.action === 'goToPage' || c.action === 'scrollTo')) return;
    const META = new Set([
      'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems', 'scribble', 'scrollTo', 'handwrite',
    ]);
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
      if (target >= 0) setCurrentIndex((prev) => (target !== prev ? target : prev));
      break;
    }
  }, [commands.length, pages]);

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
    // Explicit navigation (goToPage / scrollTo) owns its own scroll — the
    // dedicated effects above already position the view; don't fight them.
    if (added.some((c) => c.action === 'goToPage' || c.action === 'scrollTo')) return;

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
      'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems', 'scribble', 'scrollTo', 'handwrite',
    ]);
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
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      }
      // Fallback (render carried no id): newest item by position, else bottom.
      const refs = itemRefsRef.current.filter(Boolean) as HTMLElement[];
      const last = refs[refs.length - 1];
      if (last) last.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Navigation
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1));
  }, [pages.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Stable page jumper exposed to a host that renders its own switcher
  // ('minimal' chrome). Clamped against the live page count at call time.
  const goToPage = useCallback((i: number) => {
    const max = pagesLengthRef.current - 1;
    setCurrentIndex(Math.min(Math.max(i, 0), Math.max(max, 0)));
  }, []);

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
    });
  }, [onNavChange, currentIndex, pages, goToPage]);

  // Handle clear
  const handleClear = useCallback(() => {
    setCurrentIndex(0);
    onClear?.();
  }, [onClear]);

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
    () => safeCurrentPage.commands.filter((c) => c.action !== 'scribble' && c.action !== 'scrollTo' && c.action !== 'handwrite'),
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

  // Refs to each rendered item so scrollTo can scrollIntoView() them.
  const itemRefsRef = useRef<(HTMLDivElement | null)[]>([]);

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
          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-gray-200 text-gray-500"
            title="Clear whiteboard"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
                onClick={() => setCurrentIndex(i)}
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
        className={`flex-1 ${chrome === 'minimal' ? 'overflow-y-auto overflow-x-hidden' : 'lg:overflow-y-auto lg:overflow-x-hidden'} p-4`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          key={currentIndex}
          style={{ position: 'relative' }}
          className={pageDir === 'forward' ? 'wb-page-enter-forward' : 'wb-page-enter-backward'}
        >
        {renderableCommands.length === 1 ? (
          <div
            className="relative wb-item-enter scroll-mt-6"
            style={reviseStyle(renderableCommands[0])}
            ref={(el) => { itemRefsRef.current[0] = el; }}
            data-wb-item-index={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data-wb-item-id={(renderableCommands[0] as any).id ?? undefined}
          >
            <CommandRenderer command={renderableCommands[0]} />
            <ScribbleOverlays scribbles={scribbles.filter((s) => scribbleMatchesItem(s, renderableCommands[0], 1))} />
          </div>
        ) : (
          <div className="space-y-1">
            {renderableCommands.map((cmd, i) => {
              const overlays = scribbles.filter((s) => scribbleMatchesItem(s, cmd, i + 1));
              return (
                <div key={i} className="wb-item-enter">
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1">
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
                    ref={(el) => { itemRefsRef.current[i] = el; }}
                    data-wb-item-index={i + 1}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data-wb-item-id={(cmd as any).id ?? undefined}
                  >
                    <CommandRenderer command={cmd} />
                    <ScribbleOverlays scribbles={overlays} />
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
        {/* Annotation strip: per-page running list of teacher notes built
            from tutor_scribble labels + tutor_handwrite text. Replaces
            the old position-based on-diagram annotations — gives a
            stable home for words and frees the brain from spatial
            reasoning entirely. Resets on page nav (each page has its
            own commands). */}
        <AnnotationStrip scribbles={scribbles} handwrites={handwrites} />
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
    return (
      <>
        {/* Inline placeholder */}
        <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
          {headerContent}
          {bodyContent}
        </div>
        {/* Floating overlay */}
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
 * the diagram — they move to the per-page AnnotationStrip below.
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

function ScribbleOverlays({ scribbles }: { scribbles: ScribbleCmd[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
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

        let mark: React.ReactNode;
        if (isHighlight) {
          mark = (
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h}
              fill={color} fillOpacity="0.25" stroke="none"
            />
          );
        } else {
          // Tick anchor: just INSIDE the right edge of the feature's bbox,
          // vertically centered. A bold ✓ icon — visible without being
          // intrusive. Size scales with the viewBox so the tick stays
          // proportional across tiny and wide items.
          // 2026-05-13 user feedback: outside-right and small was barely
          // visible. Now positioned inward with ~50% larger size and
          // thicker stroke.
          const tickSize = Math.max(16, Math.min(vbW, vbH) * 0.06);
          const tx = r.x + r.w - tickSize * 0.55;
          const ty = r.y + r.h / 2;
          const half = tickSize / 2;
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

        return <g key={i}>{mark}</g>;
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
        // The renderer already runs a format-aware comparison locally;
        // we re-derive the same flag here so the parent gets the trio.
        const isCorrect = props.expectedAnswer
          ? compareAnswer(answer, props.expectedAnswer, props.responseFormat)
          : null;
        ctx.onTryYourselfAnswer?.(answer, props.expectedAnswer, isCorrect);
      }}
    />
  );
}

/** Same comparator as TryYourselfRenderer's matchesAnswer — duplicated
 *  here so the bridge can decide correct/incorrect without forcing
 *  every renderer to expose the result. Keep in sync with that file. */
/** Compare submitted vs expected answer. Returns:
 *   true  — strings/numerics definitively match
 *   false — definitively don't match (only used when we have a reliable signal)
 *   null  — can't tell (FRQ with non-trivial expected, or anything where
 *           string normalization is hopeless). Caller MUST treat null
 *           as "let the brain judge" — don't pre-assert a verdict.
 *
 * Why this returns null for most FRQ cases: free-response answers are
 * routinely written in algebraically-equivalent-but-textually-different
 * forms. The 2026-04-29 pre-calc session showed expected
 * "sin 225° = −√2/2, cos 225° = −√2/2; Q3; reference angle 45°" vs
 * submitted "sin 225=cos 225 = - 1/ root 2, quadrant 3, ref angle 45 deg"
 * — algebraically identical (-1/√2 = -√2/2), but no string normalization
 * can match them. The string-compare verdict was "doesn't match" → the
 * brain saw the pre-judgment in its prompt and HAD to fight against it
 * to tell the student "your value is actually correct, just a different
 * form". Returning null here drops the pre-judgment so the brain can
 * judge equivalence without bias. */
function compareAnswer(submitted: string, expected: string, format: 'mcq' | 'frq' | 'numeric' | undefined): boolean | null {
  const s = submitted.trim();
  const e = expected.trim();
  if (!s || !e) return null;
  const tryParse = (v: string): number | null => {
    const cleaned = v.replace(/,/g, '').replace(/\s+/g, '');
    if (cleaned === '') return null;
    const frac = cleaned.match(/^(-?\d+)\/(-?\d+)$/);
    if (frac) {
      const num = Number(frac[1]); const den = Number(frac[2]);
      if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) return num / den;
      return null;
    }
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const sn = tryParse(s); const en = tryParse(e);
  // Numeric / MCQ: pure-string comparison is reliable.
  if (sn !== null && en !== null) return Math.abs(sn - en) < 1e-9;
  if (format === 'numeric') return null; // numeric expected couldn't parse — defer to brain
  if (format === 'mcq') {
    const norm = (v: string) =>
      v.toLowerCase().replace(/^[a-z]\s*=\s*/, '').replace(/\s+/g, ' ').trim();
    return norm(s) === norm(e);
  }
  // FRQ (or undefined format): string normalization is unreliable — defer
  // to the brain rather than asserting a wrong verdict. Only a strict
  // post-normalization equality returns true; any difference returns null.
  const norm = (v: string) =>
    v.toLowerCase().replace(/^[a-z]\s*=\s*/, '').replace(/\s+/g, ' ').trim();
  if (norm(s) === norm(e)) return true;
  return null;
}

/**
 * Per-page annotation strip. Sits inside the page wrapper at the bottom
 * of the rendered items. Holds the running list of teacher notes built
 * from:
 *   - tutor_scribble commands that carry a `label` — entry is
 *     `{feature display name} → {label}` in the scribble's color.
 *   - tutor_handwrite commands — entry is the full text in the
 *     handwrite's color.
 *
 * Replaces the position-based on-diagram annotation layer
 * (HandwriteOverlays + label-on-scribble) shipped through 2026-05-13.
 * The brain no longer positions anything; the strip is the home for
 * all words. Strip resets on page nav because each page has its own
 * commands. Empty strip renders nothing — no reserved space.
 */
type HandwriteCmd = Extract<WhiteboardCommand, { action: 'handwrite' }>;

const SCRIBBLE_DEFAULT_COLOR = '#3b82f6';
const HANDWRITE_DEFAULT_COLOR = '#a16207';

/** Friendly display name for the strip composition rule
 *  "{feature display name} → {label}". Prefers the feature's first
 *  human label, falls back to the canonical data-feature value if
 *  no labels are registered.
 *
 *  Critical: scopes the DOM lookup to the SCRIBBLE'S TARGET ITEM
 *  (`[data-wb-item-index="N"]`) so that when multiple items on the
 *  same page share a structural feature name (e.g. two
 *  hierarchy_pyramids both have `data-feature="tier-1"`), we read
 *  the friendly label from the RIGHT one. Without this scope the
 *  query returned the first matching DOM element in document order
 *  — the older/upper item won, so the strip displayed labels from
 *  the wrong figure (observed 2026-05-13 session #14 image #46:
 *  scribble targeted Producers in the energy pyramid, but the strip
 *  rendered "All Living Things → ..." from the classification
 *  pyramid that happened to appear earlier on the same page). */
function featureDisplayName(scribble: ScribbleCmd, pageContainer: HTMLElement | null): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayHint = (scribble as any)._displayName as string | undefined;
  if (displayHint && displayHint.trim()) return displayHint.trim();
  const tf = scribble.targetFeature;
  if (!tf) return scribble.target || 'feature';
  if (pageContainer) {
    const safe = tf.replace(/"/g, '\\"');
    const itemIdx = scribble.targetItemIndex;
    // Narrow the search to the item the scribble actually targets.
    // Fall back to the whole page if the scope can't be found (very
    // first render before refs settle, or item index not stamped).
    const scope = typeof itemIdx === 'number'
      ? (pageContainer.querySelector(`[data-wb-item-index="${itemIdx}"]`) ?? pageContainer)
      : pageContainer;
    const el = scope.querySelector(`[data-feature="${safe}"]`);
    const labelAttr = el?.getAttribute('data-feature-label');
    if (labelAttr && labelAttr.trim()) return labelAttr.trim();
  }
  return tf;
}

function AnnotationStrip({
  scribbles,
  handwrites,
}: {
  scribbles: ScribbleCmd[];
  handwrites: HandwriteCmd[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Filter scribbles to only those carrying a label — unlabelled
  // scribbles draw a tick on the diagram and contribute nothing here
  // (locked decision #7).
  const labelledScribbles = scribbles.filter((s) => !!(s.label && s.label.trim()));
  if (labelledScribbles.length === 0 && handwrites.length === 0) return null;
  return (
    <div
      ref={containerRef}
      aria-label="annotation strip"
      className="mt-4 pt-2 border-t border-dashed border-gray-200"
      style={{ pointerEvents: 'none' }}
    >
      <div className="space-y-1" style={{
        // Hand-written feel: Caveat + Kalam (already loaded for the
        // app via next/font in layout.tsx) match the original
        // sticky-note handwrite styling, just without the card chrome.
        // 22px because cursive fonts read less dense than sans-serif —
        // 18px Caveat was still cramped next to surrounding sans-serif
        // (2026-05-13 session #11 feedback).
        fontFamily: 'var(--font-caveat), var(--font-kalam), cursive',
        fontSize: 22,
        lineHeight: 1.3,
      }}>
        {labelledScribbles.map((s, i) => {
          const color = s.color || SCRIBBLE_DEFAULT_COLOR;
          const name = featureDisplayName(s, containerRef.current?.parentElement ?? null);
          return (
            <StripEntry
              key={`s-${i}-${s.targetFeature ?? s.target ?? 'na'}`}
              color={color}
              boldText={name}
              tailText={` → ${s.label}`}
              tailOpacity={0.85}
            />
          );
        })}
        {handwrites.map((h, i) => {
          const color = h.color || HANDWRITE_DEFAULT_COLOR;
          return (
            <StripEntry
              key={`h-${i}-${h.text.slice(0, 24)}`}
              color={color}
              boldText=""
              tailText={h.text}
              tailOpacity={1}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Single strip entry. Renders the color dot immediately, then types
 *  the text left-to-right at ~30ms/char to simulate hand-writing.
 *  Stable key in the parent ensures each entry's animation fires only
 *  once on mount — subsequent re-renders preserve the typewriter state.
 *
 *  2026-05-13 session #11 feedback: entries appeared instantly, breaking
 *  the "tutor is writing this" illusion. The reveal animation gives
 *  the strip a sense of being annotated in real time, matching the
 *  Caveat font + ✓-tick "live tutor" framing. */
function StripEntry({
  color,
  boldText,
  tailText,
  tailOpacity,
}: {
  color: string;
  boldText: string;
  tailText: string;
  tailOpacity: number;
}) {
  const full = boldText + tailText;
  const [revealed, setRevealed] = useState(0);
  // Live refs for current full + position. featureDisplayName's DOM
  // lookup falls back to canonical on the FIRST render (parent ref
  // not yet populated) and extends to the friendly name when the
  // parent re-renders with refs populated. The interval may have
  // ALREADY CLEARED at the canonical length by the time the friendly
  // name arrives — the previous closure-only ref fix tracked the
  // length but didn't restart the interval after it stopped (observed
  // 2026-05-13 session #14 image #42: "chased → the acti" = 17 chars
  // = length of "verb → the action" before "verb"→"chased" extension).
  //
  // Now: dep on `full`. When full extends after the interval cleared,
  // the effect re-runs, sees nRef < new full.length, and resumes
  // from the current position. nRef is a ref so re-entries don't
  // restart at 0.
  const fullRef = useRef(full);
  fullRef.current = full;
  const nRef = useRef(0);
  useEffect(() => {
    if (nRef.current >= full.length) return;
    const id = window.setInterval(() => {
      nRef.current += 1;
      setRevealed(nRef.current);
      if (nRef.current >= fullRef.current.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [full]);
  const boldShown = revealed >= boldText.length ? boldText : full.slice(0, revealed);
  const tailShown = revealed > boldText.length ? full.slice(boldText.length, revealed) : '';
  return (
    <div className="flex items-center gap-2" style={{ color }}>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span>
        {boldText && <span style={{ fontWeight: 600 }}>{boldShown}</span>}
        {tailShown && <span style={{ opacity: tailOpacity }}>{tailShown}</span>}
      </span>
    </div>
  );
}

interface CommandRendererProps {
  command: WhiteboardCommand;
}

export function CommandRenderer({ command }: CommandRendererProps) {
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
            {problem.title || 'Problem'}
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
          {command.example.problem && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p>{command.example.problem.statement}</p>
            </div>
          )}
          {command.example.walkthrough && command.example.walkthrough.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{step.tutorSays}</p>
                {step.checkQuestion && (
                  <p className="text-sm text-blue-600 mt-1 italic">
                    💭 {step.checkQuestion}
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
                  <li key={i}>{takeaway}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

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
function getCommandTypeLabel(action: string): string {
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
    default:
      return action;
  }
}
