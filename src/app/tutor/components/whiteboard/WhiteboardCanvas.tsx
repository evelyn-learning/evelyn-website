'use client';

/**
 * Whiteboard Canvas
 *
 * Main whiteboard component that renders all visual elements
 * from the AI tutor including equations, graphs, and diagrams.
 */

import { useState, useCallback, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2, GripVertical, ChevronDown } from 'lucide-react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { EquationRenderer, DerivationRenderer } from './EquationRenderer';
import { TryYourselfRenderer } from './TryYourselfRenderer';
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
import dynamic from 'next/dynamic';

const MoleculeRenderer = dynamic(() => import('./MoleculeRenderer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[250px] text-gray-400">Loading chemistry editor...</div>,
});

// Detect if a string contains LaTeX commands and render accordingly.
// When a cell mixes English prose with math (e.g. "Expression with 2^x"),
// KaTeX in math mode concatenates consecutive letters — it would render
// "Expressionwith2^x". Auto-wrap prose word-runs in \text{} before KaTeX
// so spaces are preserved and letters stay upright.
function CellContent({ value }: { value: string }) {
  if (!value) return null;

  // Explicit $...$ delimiters → use the inline text+math renderer.
  if (/\$.+?\$/.test(value)) {
    return <InlineMathText text={value} />;
  }

  const hasLatexCmd = /\\(?:frac|sqrt|sum|int|prod|binom|left|right|times|div|pm|cdot|leq|geq|neq|approx|infty|alpha|beta|gamma|delta|theta|pi|sigma|omega|text|mathrm|mathbf)/.test(value);
  const hasSubSup = /[_^{}]/.test(value);

  if (!hasLatexCmd && !hasSubSup) {
    return <>{value}</>;
  }

  // Heuristic: does the cell also contain English prose? If so, auto-wrap
  // alphabetic word-runs of length ≥ 2 in \text{} so KaTeX renders them as
  // upright prose. Common filler words (with/and/the/of/...) signal prose.
  // Single-letter variables (x, y, etc.) are untouched.
  const proseSignal = /\b(with|and|the|of|in|to|from|then|for|using|given|or|as|it|is|are|each|both|let|apply|rewrite|simplify|substitution|substitute|multiply|divide|expression|original|result|answer|step|formula|final|combined|limit|upper|lower)\b/i.test(value);
  let latex = value;
  if (proseSignal) {
    // Wrap each 2+ letter alphabetic run in \text{...}. Skip runs that are
    // already inside a \text{} block (simple check: previous char was "{")
    // and skip common math-mode function names (sin, cos, tan, log, ln, exp).
    const mathFns = new Set(['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'exp', 'lim', 'max', 'min', 'arg', 'det', 'dim', 'gcd', 'lcm']);
    latex = value.replace(/(\\?)([a-zA-Z]{2,})/g, (match, slash, word) => {
      if (slash) return match;
      if (mathFns.has(word.toLowerCase())) return match;
      return `\\text{${word}}`;
    });
  }

  return <EquationRenderer latex={latex} displayMode={false} className="inline-block" />;
}

/**
 * Normalize a command title for supersede-matching. Lowercases, strips
 * punctuation, takes the first 3 tokens so "Triangle with Altitude on
 * Coordinate Plane" and "Triangle with Altitude" both collapse to
 * "triangle with altitude".
 */
/** Actions where redraws should supersede earlier versions rather than stack. */
const SUPERSEDABLE_ACTIONS = new Set(['showGeometry', 'showGraph', 'showDiagram', 'showSvgDiagram', 'showCircuit', 'showLewis', 'showFlowchart', 'showTimeline', 'showMap']);

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
  className?: string;
}

export function WhiteboardCanvas({
  commands,
  onClear,
  onStudentInput,
  className = '',
}: WhiteboardCanvasProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

    for (const cmd of commands) {
      if (cmd.action === 'clear' || cmd.action === 'goToPage') continue;
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
        const targetPageTitle = cmdAny.targetPageTitle as string | undefined;
        const targetPageIndex = cmdAny.targetPageIndex as number | undefined;
        let targetIdx = -1;
        if (targetPageTitle) {
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

  // Handle goToPage navigation: find the target page by title
  useEffect(() => {
    const lastGoTo = [...commands].reverse().find((cmd) => cmd.action === 'goToPage');
    if (lastGoTo && lastGoTo.action === 'goToPage') {
      const targetTitle = lastGoTo.title.toLowerCase();
      const targetIndex = pages.findIndex(
        (p) => p.title?.toLowerCase() === targetTitle
      );
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

    // Partition: page switches apply synchronously (state update), item /
    // top / bottom scrolls need a frame after any page switch so new refs
    // are mounted.
    let pageSwitched = false;
    for (const { cmd } of pending) {
      if (cmd.action !== 'scrollTo') continue;
      if (cmd.target !== 'page') continue;
      let idx = -1;
      if (typeof cmd.pageIndex === 'number' && cmd.pageIndex >= 0 && cmd.pageIndex < pages.length) {
        idx = cmd.pageIndex;
      } else if (cmd.pageTitle) {
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
        } else if (cmd.target === 'item' && typeof cmd.itemIndex === 'number') {
          const itemEl = itemRefsRef.current[cmd.itemIndex - 1];
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

  // Auto-navigate to the newest page when new pages are added
  // (but not when goToPage just navigated us)
  const prevPageCountRef = useRef(0);
  useEffect(() => {
    if (pages.length > 0 && pages.length !== prevPageCountRef.current) {
      // Check if the latest command is a goToPage — if so, skip auto-advance
      const lastCmd = commands[commands.length - 1];
      if (lastCmd?.action !== 'goToPage') {
        setCurrentIndex(pages.length - 1);
      }
      prevPageCountRef.current = pages.length;
    }
  }, [pages.length, commands]);

  // Auto-scroll to the latest item when a new command is added to the current page
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevCommandCountRef = useRef(commands.length);
  useEffect(() => {
    if (commands.length > prevCommandCountRef.current) {
      // Scroll the whiteboard pane (not the page) to show the latest item
      const container = scrollContainerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
      }
    }
    prevCommandCountRef.current = commands.length;
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
    () => safeCurrentPage.commands.filter((c) => c.action !== 'scribble' && c.action !== 'scrollTo'),
    [safeCurrentPage.commands],
  );
  const scribbles = useMemo(
    () => safeCurrentPage.commands.filter((c): c is Extract<WhiteboardCommand, { action: 'scribble' }> => c.action === 'scribble'),
    [safeCurrentPage.commands],
  );

  // Refs to each rendered item so scrollTo can scrollIntoView() them.
  const itemRefsRef = useRef<(HTMLDivElement | null)[]>([]);

  if (pages.length === 0) {
    return (
      <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 p-8">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">Your conversation will appear here.</p>
            <p className="text-sm">Start speaking to begin!</p>
          </div>
        </div>
        {onStudentInput && <StudentInputBar onStudentInput={onStudentInput} />}
      </div>
    );
  }

  const currentPage = pages[Math.min(currentIndex, pages.length - 1)];

  const headerContent = (
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
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={pages[i].title || `Page ${i + 1}`}
              />
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
      <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4">
        {renderableCommands.length === 1 ? (
          <div className="relative" ref={(el) => { itemRefsRef.current[0] = el; }}>
            <CommandRenderer command={renderableCommands[0]} />
            <ScribbleOverlays scribbles={scribbles.filter((s) => s.targetItemIndex === 1)} />
          </div>
        ) : (
          <div className="space-y-1">
            {renderableCommands.map((cmd, i) => {
              const overlays = scribbles.filter((s) => s.targetItemIndex === i + 1);
              return (
                <div key={i}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex-1 border-t border-dashed border-gray-200" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide flex-shrink-0">
                        {getCommandTypeLabel(cmd.action)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-gray-200" />
                    </div>
                  )}
                  <div className="relative" ref={(el) => { itemRefsRef.current[i] = el; }}>
                    <CommandRenderer command={cmd} />
                    <ScribbleOverlays scribbles={overlays} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Scroll-down hint: visible when multi-item page has overflow */}
      {currentPage.commands.length > 1 && hasOverflow && (
        <div className="flex justify-center py-0.5 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-100 flex-shrink-0">
          <ChevronDown className="w-4 h-4 text-blue-400 animate-bounce" />
        </div>
      )}
      <div className="px-3 py-1 bg-gray-50 border-t text-xs text-gray-400 text-center rounded-b-lg flex-shrink-0">
        {pageLabel}
      </div>
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
    <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
      {headerContent}
      {bodyContent}
      {studentInputBar}
    </div>
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

  // Scale mouse position to canvas coordinates (CSS size may differ from canvas pixel size)
  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Drawing handlers
  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
  }, [getCanvasPos]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
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

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
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
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
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
 * point / circle / underline / arrow / highlight annotations (from the
 * tutor_scribble tool). Each scribble persists until the page is cleared
 * or a newPage fires — a teacher would leave their marks on the board
 * while explaining.
 */
type ScribbleCmd = Extract<WhiteboardCommand, { action: 'scribble' }>;
type ResolvedRegion = { x: number; y: number; w: number; h: number };

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

    return () => {
      ro?.disconnect();
      mo?.disconnect();
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
        const color = s.color || '#f59e0b';
        // Region: feature-resolved (via catalog + data-feature lookup) or
        // small-centered default when the target SVG hasn't laid out yet.
        const resolved = s.targetFeature ? resolvedByFeature[s.targetFeature] : undefined;
        const source = resolved || { x: 0.35, y: 0.40, w: 0.30, h: 0.25 };
        // Map 0–1 fractions into the target viewBox's pixel space so
        // positions match features baked into the target SVG itself.
        const r = { x: source.x * vbW, y: source.y * vbH, w: source.w * vbW, h: source.h * vbH };
        const cx = r.x + r.w / 2;
        const cy = r.y + r.h / 2;

        // Scale stroke/font constants to viewBox pixel space — same rules
        // the PDF overlay uses so live and PDF match visually.
        const strokeThin = Math.max(1.5, vbW / 500);
        const strokeMed = Math.max(2, vbW / 200);
        const fontSizePx = Math.max(10, vbW / 50);

        let mark: React.ReactNode;
        switch (s.shape) {
          case 'circle':
            mark = (
              <ellipse
                cx={cx} cy={cy}
                rx={Math.max(vbW * 0.015, r.w / 2)} ry={Math.max(vbH * 0.015, r.h / 2)}
                fill="none" stroke={color} strokeWidth={strokeMed}
              />
            );
            break;
          case 'underline':
            mark = (
              <line
                x1={r.x} y1={r.y + r.h}
                x2={r.x + r.w} y2={r.y + r.h}
                stroke={color} strokeWidth={Math.max(2.5, vbW / 170)}
                strokeLinecap="round"
              />
            );
            break;
          case 'box':
            mark = (
              <rect
                x={r.x} y={r.y} width={r.w} height={r.h}
                fill="none" stroke={color} strokeWidth={strokeMed}
              />
            );
            break;
          case 'highlight':
            mark = (
              <rect
                x={r.x} y={r.y} width={r.w} height={r.h}
                fill={color} fillOpacity="0.25" stroke="none"
              />
            );
            break;
          case 'arrow': {
            // Arrow coming in from top-left toward the region's centre.
            const tailX = Math.max(0, r.x - vbW * 0.08);
            const tailY = Math.max(0, r.y - vbH * 0.08);
            const headX = cx;
            const headY = cy;
            const markerId = `scribble-arrow-${i}`;
            mark = (
              <g>
                <defs>
                  <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 Z" fill={color} />
                  </marker>
                </defs>
                <line
                  x1={tailX} y1={tailY} x2={headX} y2={headY}
                  stroke={color} strokeWidth={strokeMed}
                  markerEnd={`url(#${markerId})`}
                />
              </g>
            );
            break;
          }
        }

        // Stagger label y so multiple labels on the same item don't pile
        // up at the same horizontal line. Alternates above / below the
        // region, cycling through a few offsets (scaled to viewBox).
        const staggerSign = i % 2 === 0 ? -1 : 1;
        const staggerBand = Math.floor(i / 2) * vbH * 0.03;
        const labelY = staggerSign < 0
          ? Math.max(vbH * 0.04, r.y - fontSizePx * 0.4 - staggerBand)
          : Math.min(vbH * 0.97, r.y + r.h + fontSizePx + staggerBand);
        return (
          <g key={i}>
            {mark}
            {s.label && (
              <text
                x={cx} y={labelY}
                fontSize={fontSizePx} fill={color} textAnchor="middle"
                fontWeight="700"
                // White halo for readability on busy backgrounds.
                paintOrder="stroke"
                stroke="white"
                strokeWidth={strokeThin}
                strokeLinejoin="round"
              >
                {s.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
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
        <TryYourselfRenderer
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
                  <span className="text-gray-800"><InlineMathText text={ac.text} /></span>
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
      return <StatsRenderer title={command.title} type={command.type} data={command.data} binWidth={command.binWidth} xLabel={command.xLabel} yLabel={command.yLabel} boxplot={command.boxplot} bar={command.bar} pie={command.pie} distribution={command.distribution} />;

    case 'showTimeline':
      return <TimelineRenderer title={command.title} events={command.events} orientation={command.orientation} />;

    case 'showMap':
      return <MapRenderer title={command.title} background={command.background} pins={command.pins} regions={command.regions} caption={command.caption} />;

    case 'showCircuit':
      return <CircuitRenderer title={command.title} nodes={command.nodes} components={command.components} showNodes={command.showNodes} />;

    case 'showLewis':
      return <LewisRenderer title={command.title} atoms={command.atoms} bonds={command.bonds} formula={command.formula} geometry={command.geometry} />;

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
