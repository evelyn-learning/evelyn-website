'use client';

/**
 * Whiteboard Canvas
 *
 * Main whiteboard component that renders all visual elements
 * from the AI tutor including equations, graphs, and diagrams.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2, GripVertical, ChevronDown } from 'lucide-react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { EquationRenderer, DerivationRenderer } from './EquationRenderer';
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

interface WhiteboardCanvasProps {
  commands: WhiteboardCommand[];
  onClear?: () => void;
  className?: string;
}

export function WhiteboardCanvas({
  commands,
  onClear,
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

  // Group commands into pages, split by 'newPage' markers
  // Commands before the first newPage go on page 0.
  // 'clear', 'newPage', and 'goToPage' are filtered from rendering.
  const pages = useMemo(() => {
    const result: { title?: string; commands: WhiteboardCommand[] }[] = [];
    let current: { title?: string; commands: WhiteboardCommand[] } = { commands: [] };

    for (const cmd of commands) {
      if (cmd.action === 'clear' || cmd.action === 'goToPage') continue;
      if (cmd.action === 'newPage') {
        // Start a new page — only push the previous page if it has content
        if (current.commands.length > 0) {
          result.push(current);
        }
        current = { title: cmd.title, commands: [] };
      } else {
        current.commands.push(cmd);
      }
    }
    // Push the last page if it has content
    if (current.commands.length > 0) {
      result.push(current);
    }
    return result;
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

  if (pages.length === 0) {
    return (
      <div className={`whiteboard-canvas flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-400 p-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">Equations and diagrams will appear here</p>
        </div>
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
        {currentPage.commands.length === 1 ? (
          <CommandRenderer command={currentPage.commands[0]} />
        ) : (
          <div className="space-y-1">
            {currentPage.commands.map((cmd, i) => {
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
                  <CommandRenderer command={cmd} />
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

  return (
    <div className={`whiteboard-canvas flex flex-col h-full ${className}`}>
      {headerContent}
      {bodyContent}
    </div>
  );
}

/**
 * Renders a single whiteboard command
 */
interface CommandRendererProps {
  command: WhiteboardCommand;
}

function CommandRenderer({ command }: CommandRendererProps) {
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

    case 'showGraph':
      const GraphComponent = getGraphComponent(command.type);
      return (
        <GraphComponent
          type={command.type}
          data={command.data}
        />
      );

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

    case 'showProblem':
      // Filter out any givenValues that are missing required fields
      const validGivenValues = (command.problem.givenValues || []).filter(
        (gv) => gv && (gv.symbol || gv.value !== undefined)
      );
      return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            {command.problem.title || 'Problem'}
          </h4>
          <p className="text-gray-800">{command.problem.statement}</p>
          {validGivenValues.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600">Given:</p>
              <ul className="text-sm text-gray-700 ml-4 list-disc">
                {validGivenValues.map((gv, i) => (
                  <li key={i}>
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
        </div>
      );

    case 'showSolution':
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Solution</h4>
          {command.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                {step.stepNumber}
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{step.description}</p>
                {step.equation && (
                  <EquationRenderer latex={step.equation} className="mt-2" />
                )}
                {step.substitution && (
                  <EquationRenderer latex={step.substitution} className="mt-1 text-gray-600" />
                )}
                {step.result && (
                  <EquationRenderer latex={step.result} className="mt-1 font-medium" />
                )}
                {step.explanation && (
                  <p className="text-sm text-gray-500 mt-1 italic">{step.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );

    case 'showTable':
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {command.headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {command.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-4 py-2">
                      {cell}
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
    default:
      return action;
  }
}
