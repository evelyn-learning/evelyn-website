/**
 * ProblemFigure — the pre-built figure of a one-problem homework session,
 * drawn on the whiteboard as page 1's first item (WhiteboardCanvas
 * `leadItem`; GAC acceptance 2026-10-21, round 5 — the owner wants it on the
 * board, larger than the strip it replaced, with the problem drawer carrying
 * the text only). A geometry figure is solved here and drawn with
 * fit="content" inside a fixed-height box, so a wide, short figure fills the
 * box instead of sitting tiny in its canvas padding and a tall one never
 * swallows the page; a graph goes through the board's own CommandRenderer.
 * Any throw (a bad spec) is the item error boundary's — the caller wraps this.
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
    <div data-testid="problem-figure" className="mx-auto flex h-[280px] sm:h-[400px] justify-center py-1 [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full">
      <GeometryRenderer
        points={solved.points}
        segments={solved.segments}
        polygons={solved.polygons}
        circles={solved.circles}
        arcs={solved.arcs}
        angles={solved.angles}
        conics={solved.conics}
        regions={solved.regions}
        showGrid={solved.showGrid}
        showAxes={solved.showAxes}
        viewRange={solved.viewRange}
        fit="content"
      />
    </div>
  );
}
