/**
 * Batch 2 of the practice-figure kinds (2026-10-09). One list and one
 * dispatcher, so render.ts needs a single import; each kind is a pure
 * function of a typed params object documented at the top of its module:
 *   circuit_diagram (circuit.ts) · phylogenetic_tree (phylo-tree.ts) ·
 *   geometric_figure (geometry.ts) · ray_diagram (ray-diagram.ts) ·
 *   field_diagram (field-diagram.ts) · flow_diagram (flow-diagram.ts) ·
 *   solid_3d (solid-3d.ts, incl. the solid-of-revolution variant) ·
 *   spectrum (spectrum.ts).
 */
import type { Drawn, Reader } from '../spec';
import { renderCircuit } from './circuit';
import { renderFieldDiagram } from './field-diagram';
import { renderFlowDiagram } from './flow-diagram';
import { renderGeometry } from './geometry';
import { renderPhyloTree } from './phylo-tree';
import { renderRayDiagram } from './ray-diagram';
import { renderSolid } from './solid-3d';
import { renderSpectrum } from './spectrum';

export const BATCH2_FIGURE_KINDS = [
  'circuit_diagram',
  'phylogenetic_tree',
  'geometric_figure',
  'ray_diagram',
  'field_diagram',
  'flow_diagram',
  'solid_3d',
  'spectrum',
] as const;
export type Batch2FigureKind = (typeof BATCH2_FIGURE_KINDS)[number];

/** The drawing of a batch-2 kind, or null when `kind` is not one. */
export function renderBatch2(kind: string, r: Reader, uid: string): Drawn | null {
  switch (kind as Batch2FigureKind) {
    case 'circuit_diagram': return renderCircuit(r);
    case 'phylogenetic_tree': return renderPhyloTree(r);
    case 'geometric_figure': return renderGeometry(r, uid);
    case 'ray_diagram': return renderRayDiagram(r);
    case 'field_diagram': return renderFieldDiagram(r);
    case 'flow_diagram': return renderFlowDiagram(r);
    case 'solid_3d': return renderSolid(r, uid);
    case 'spectrum': return renderSpectrum(r);
    default: return null;
  }
}
