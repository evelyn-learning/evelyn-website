'use client';

/**
 * Whiteboard Canvas
 *
 * Main whiteboard component that renders all visual elements
 * from the AI tutor including equations, graphs, and diagrams.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
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

  // Filter out 'clear' commands for display purposes
  const displayCommands = useMemo(() => {
    return commands.filter((cmd) => cmd.action !== 'clear');
  }, [commands]);

  // Auto-navigate to the newest item when new commands are added
  useEffect(() => {
    if (displayCommands.length > 0) {
      setCurrentIndex(displayCommands.length - 1);
    }
  }, [displayCommands.length]);

  // Navigation
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, displayCommands.length - 1));
  }, [displayCommands.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle clear
  const handleClear = useCallback(() => {
    setCurrentIndex(0);
    onClear?.();
  }, [onClear]);

  if (displayCommands.length === 0) {
    return (
      <div className={`whiteboard-canvas flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-400 p-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">Equations and diagrams will appear here</p>
        </div>
      </div>
    );
  }

  const currentCommand = displayCommands[currentIndex];

  return (
    <div className={`whiteboard-canvas flex flex-col h-full ${className} ${isExpanded ? 'fixed inset-4 z-50 bg-white shadow-2xl rounded-xl' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-600">Whiteboard</span>
        <div className="flex items-center gap-2">
          {/* Navigation */}
          {displayCommands.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 min-w-[40px] text-center">
                {currentIndex + 1} / {displayCommands.length}
              </span>
              <button
                onClick={goNext}
                disabled={currentIndex === displayCommands.length - 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Expand/Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-gray-200"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
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

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <CommandRenderer command={currentCommand} />
      </div>

      {/* Command type indicator */}
      <div className="px-3 py-1 bg-gray-50 border-t text-xs text-gray-400 text-center rounded-b-lg">
        {getCommandTypeLabel(currentCommand.action)}
      </div>
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
    case 'showWorkedExample':
      return 'Worked Example';
    default:
      return action;
  }
}
