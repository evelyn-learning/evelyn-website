/**
 * ProblemFigure — the pre-built figure of a one-problem homework session as
 * SessionStage pins it above the board (GAC acceptance 2026-10-21). A
 * geometry figure is solved here and drawn with fit="content", so a wide,
 * short figure fills the strip instead of sitting tiny in its canvas
 * padding; a graph goes through the board's own CommandRenderer. Any throw
 * (a bad spec) is the item error boundary's — the caller wraps this.
 */
'use client';

import type { WhiteboardCommand } from '@core/knowledge/types';
import type { FigureCommand } from '@/lib/tutor/homework-build/types';
import { solveGeometry, type ConstructedGeometrySpec } from '@/lib/tutor/diagrams/geometry-solver';
import { CommandRenderer } from '../whiteboard/WhiteboardCanvas';
import { GeometryRenderer } from '../whiteboard/GeometryRenderer';

export function ProblemFigure({ figure }: { figure: FigureCommand }): JSX.Element {
  if (figure.action !== 'showGeometryConstructed') {
    return <CommandRenderer command={figure as unknown as WhiteboardCommand} />;
  }
  const solved = solveGeometry({ given: figure.given, steps: figure.steps, display: figure.display } as ConstructedGeometrySpec);
  return (
    <GeometryRenderer
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
      fit="content"
    />
  );
}
