/** Phases 6+7+8 — advanced math, ELA, social studies, organizers. */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

// ── unit_circle (Phase 6) ─────────────────────────────────────────────────
export interface UnitCircleFigure {
  angleDegrees: number;
  showSinCos: boolean;
  showRadians: boolean;
  title?: string;
}
export function solveUnitCircle(params: Record<string, unknown>): UnitCircleFigure {
  const angle = typeof params.angleDegrees === 'number' && Number.isFinite(params.angleDegrees) ? params.angleDegrees : 30;
  return {
    angleDegrees: ((angle % 360) + 360) % 360,
    showSinCos: params.showSinCos !== false,
    showRadians: params.showRadians === true,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── transformation (Phase 6) ──────────────────────────────────────────────
export interface TransformationFigure {
  shape: { type: 'triangle' | 'rectangle' | 'polygon'; vertices: Array<{ x: number; y: number }> };
  transform: { type: 'translate' | 'rotate' | 'reflect' | 'scale'; tx?: number; ty?: number; angleDeg?: number; axis?: 'x' | 'y'; sx?: number; sy?: number };
  title?: string;
}
export function solveTransformation(params: Record<string, unknown>): TransformationFigure {
  if (!params.shape || typeof params.shape !== 'object') throw new Error('transformation: shape required');
  const sh = params.shape as Record<string, unknown>;
  const validShape = new Set(['triangle', 'rectangle', 'polygon']);
  if (typeof sh.type !== 'string' || !validShape.has(sh.type)) throw new Error('transformation: shape.type invalid');
  if (!Array.isArray(sh.vertices) || sh.vertices.length < 3) throw new Error('transformation: shape.vertices need at least 3');
  const vertices = (sh.vertices as Array<Record<string, unknown>>).map((v, i) => {
    if (typeof v.x !== 'number' || typeof v.y !== 'number') throw new Error(`transformation: vertices[${i}] needs numeric x,y`);
    return { x: v.x, y: v.y };
  });
  if (!params.transform || typeof params.transform !== 'object') throw new Error('transformation: transform required');
  const tr = params.transform as Record<string, unknown>;
  const validT = new Set(['translate', 'rotate', 'reflect', 'scale']);
  if (typeof tr.type !== 'string' || !validT.has(tr.type)) throw new Error('transformation: transform.type invalid');
  return {
    shape: { type: sh.type as 'triangle' | 'rectangle' | 'polygon', vertices },
    transform: {
      type: tr.type as TransformationFigure['transform']['type'],
      tx: typeof tr.tx === 'number' ? tr.tx : undefined,
      ty: typeof tr.ty === 'number' ? tr.ty : undefined,
      angleDeg: typeof tr.angleDeg === 'number' ? tr.angleDeg : undefined,
      axis: tr.axis === 'x' || tr.axis === 'y' ? tr.axis : undefined,
      sx: typeof tr.sx === 'number' ? tr.sx : undefined,
      sy: typeof tr.sy === 'number' ? tr.sy : undefined,
    },
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── inequality_graph (Phase 6) ────────────────────────────────────────────
export interface InequalityGraphFigure {
  variable: string;
  operator: '<' | '>' | '<=' | '>=';
  value: number;
  title?: string;
}
export function solveInequalityGraph(params: Record<string, unknown>): InequalityGraphFigure {
  const variable = typeof params.variable === 'string' ? params.variable : 'x';
  const op = params.operator;
  if (op !== '<' && op !== '>' && op !== '<=' && op !== '>=') {
    throw new Error('inequality_graph: operator must be <|>|<=|>=');
  }
  if (typeof params.value !== 'number' || !Number.isFinite(params.value)) {
    throw new Error('inequality_graph: value must be a number');
  }
  return {
    variable,
    operator: op as InequalityGraphFigure['operator'],
    value: params.value,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Phase 6 manifests (whiteboard markup initiative) — unit_circle,
// transformation, inequality_graph.
// ═══════════════════════════════════════════════════════════════════

function _slug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── unit_circle manifest ──────────────────────────────────────────
export const unitCircleFeatureNames = {
  circle: 'unit-circle',
  angle: 'angle-ray',
  endpoint: 'endpoint',
  cosLine: 'cos-line',
  sinLine: 'sin-line',
  thetaLabel: 'theta-label',
};

export function buildUnitCircleManifest(figure: UnitCircleFigure): FeatureManifestEntry[] {
  const N = unitCircleFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.circle,
      kind: 'region',
      description: 'unit circle',
      labels: ['unit circle', 'the unit circle', 'the circle', 'the diagram'],
      displayName: figure.title || 'unit circle',
      scribbleable: true,
    },
    {
      name: N.angle,
      kind: 'label',
      description: `radius/ray at θ = ${figure.angleDegrees}°`,
      labels: [
        'angle', 'the angle', 'the ray', 'ray', 'the radius', 'radius',
        `${figure.angleDegrees}°`, `${figure.angleDegrees} degrees`,
        `θ = ${figure.angleDegrees}°`,
        'the angle ray',
        // Verbose description-format (brain copies from description).
        `radius/ray at θ = ${figure.angleDegrees}°`,
      ],
      displayName: `${figure.angleDegrees}°`,
      scribbleable: true,
    },
    {
      name: N.endpoint,
      kind: 'label',
      description: 'endpoint on the unit circle (cos θ, sin θ)',
      labels: [
        'endpoint', 'the endpoint', 'the point', 'point', 'point on the circle',
        '(cos θ, sin θ)', '(cos, sin)',
        'endpoint on the unit circle',
        'endpoint on the unit circle (cos θ, sin θ)',
      ],
      displayName: 'endpoint',
      scribbleable: true,
    },
    {
      name: N.thetaLabel,
      kind: 'label',
      description: `θ = ${figure.angleDegrees}°${figure.showRadians ? ' (with radians)' : ''}`,
      labels: [
        'theta', 'θ', 'theta label', 'the theta label',
        'angle label', 'the angle label',
        `θ = ${figure.angleDegrees}°`,
        `θ = ${figure.angleDegrees}° (with radians)`,
      ],
      displayName: `θ = ${figure.angleDegrees}°`,
      scribbleable: true,
    },
  ];
  if (figure.showSinCos) {
    features.push({
      name: N.cosLine,
      kind: 'label',
      description: 'horizontal cos component',
      labels: [
        'cos', 'cosine', 'cos line', 'the cos', 'the cosine',
        'horizontal component', 'x component', 'adjacent', 'cos θ',
        'horizontal cos component',
      ],
      displayName: 'cos',
      scribbleable: true,
    });
    features.push({
      name: N.sinLine,
      kind: 'label',
      description: 'vertical sin component',
      labels: [
        'sin', 'sine', 'sin line', 'the sin', 'the sine',
        'vertical component', 'y component', 'opposite', 'sin θ',
        'vertical sin component',
      ],
      displayName: 'sin',
      scribbleable: true,
    });
  }
  return features;
}

// ── transformation manifest ───────────────────────────────────────
export const transformationFeatureNames = {
  diagram: 'transformation',
  preimage: 'preimage',
  image: 'image',
  transformLabel: 'transform-label',
};

export function buildTransformationManifest(figure: TransformationFigure): FeatureManifestEntry[] {
  const N = transformationFeatureNames;
  const t = figure.transform.type;
  let transformText: string = t;
  if (t === 'translate') transformText = `translate (${figure.transform.tx ?? 0}, ${figure.transform.ty ?? 0})`;
  else if (t === 'rotate') transformText = `rotate ${figure.transform.angleDeg ?? 0}°`;
  else if (t === 'reflect') transformText = `reflect over ${figure.transform.axis ?? 'x'}-axis`;
  else if (t === 'scale') transformText = `scale (${figure.transform.sx ?? 1}, ${figure.transform.sy ?? 1})`;
  return [
    {
      name: N.diagram,
      kind: 'region',
      description: `${t} transformation`,
      labels: ['transformation', 'the transformation', 'the diagram', `${t}`, `the ${t}`],
      displayName: figure.title || `${t} transformation`,
      scribbleable: true,
    },
    {
      name: N.preimage,
      kind: 'area',
      description: `pre-image (original ${figure.shape.type}, blue)`,
      labels: [
        'pre-image', 'the pre-image', 'preimage', 'the preimage',
        'original', 'the original', 'original shape', 'the original shape',
        'blue shape', 'the blue shape',
        figure.shape.type, `the ${figure.shape.type}`,
        `original ${figure.shape.type}`, `the original ${figure.shape.type}`,
        `pre-image (original ${figure.shape.type}, blue)`,
        `pre-image (original ${figure.shape.type})`,
      ],
      displayName: 'pre-image',
      scribbleable: true,
    },
    {
      name: N.image,
      kind: 'area',
      description: `image (transformed ${figure.shape.type}, red)`,
      labels: [
        'image', 'the image', 'transformed', 'the transformed', 'transformed shape', 'the transformed shape',
        'red shape', 'the red shape',
        `transformed ${figure.shape.type}`,
        `image (transformed ${figure.shape.type}, red)`,
        `image (transformed ${figure.shape.type})`,
      ],
      displayName: 'image',
      scribbleable: true,
    },
    {
      name: N.transformLabel,
      kind: 'label',
      description: `transform label: "${transformText}"`,
      labels: [
        'label', 'the label', 'transform', 'the transform',
        'transform label', 'the transform label',
        transformText, `"${transformText}"`,
        t, `the ${t}`,
        `transform label: "${transformText}"`,
      ],
      displayName: transformText,
      scribbleable: true,
    },
  ];
}

// ── inequality_graph manifest ─────────────────────────────────────
export const inequalityGraphFeatureNames = {
  numberLine: 'number-line',
  ray: 'ray',
  endpoint: 'endpoint',
  inequalityLabel: 'inequality-label',
};

export function buildInequalityGraphManifest(figure: InequalityGraphFigure): FeatureManifestEntry[] {
  const N = inequalityGraphFeatureNames;
  const inequalityText = `${figure.variable} ${figure.operator} ${figure.value}`;
  const closed = figure.operator === '<=' || figure.operator === '>=';
  return [
    {
      name: N.numberLine,
      kind: 'region',
      description: 'number line',
      labels: ['number line', 'the number line', 'the diagram', 'the line'],
      displayName: figure.title || 'number line',
      scribbleable: true,
    },
    {
      name: N.ray,
      kind: 'label',
      description: `solution ray (${inequalityText})`,
      labels: [
        'ray', 'the ray', 'solution', 'the solution', 'solution ray', 'the solution ray',
        'red ray', 'the red ray', 'highlighted ray', 'the highlighted ray',
        `solution ray (${inequalityText})`,
      ],
      displayName: 'solution ray',
      scribbleable: true,
    },
    {
      name: N.endpoint,
      kind: 'label',
      description: `endpoint at ${figure.value} (${closed ? 'closed/filled' : 'open/hollow'})`,
      labels: [
        'endpoint', 'the endpoint', 'point', 'the point',
        `endpoint at ${figure.value}`, `the ${figure.value} endpoint`,
        // Verbose description-format (brain copies from description).
        `endpoint at ${figure.value} (${closed ? 'closed/filled' : 'open/hollow'})`,
        `endpoint at ${figure.value} (${closed ? 'closed' : 'open'})`,
        `endpoint at ${figure.value} (${closed ? 'filled' : 'hollow'})`,
        ...(closed
          ? [
              'closed endpoint', 'the closed endpoint',
              'closed circle', 'filled circle', 'the filled circle', 'solid circle',
              'closed dot', 'the closed dot', 'filled dot', 'the filled dot',
            ]
          : [
              'open endpoint', 'the open endpoint',
              'open circle', 'hollow circle', 'the hollow circle',
              'open dot', 'the open dot', 'hollow dot',
            ]),
      ],
      displayName: `endpoint at ${figure.value}`,
      scribbleable: true,
    },
    {
      name: N.inequalityLabel,
      kind: 'label',
      description: `inequality label: "${inequalityText}"`,
      labels: [
        'label', 'the label', 'inequality', 'the inequality',
        'inequality label', 'the inequality label',
        inequalityText, `"${inequalityText}"`,
        `inequality label: "${inequalityText}"`,
      ],
      displayName: inequalityText,
      scribbleable: true,
    },
  ];
}

// ── sentence_diagram (Phase 7) ────────────────────────────────────────────
export interface SentenceDiagramFigure {
  subject: string;
  verb: string;
  object?: string;
  modifiers?: Array<{ attachTo: 'subject' | 'verb' | 'object'; word: string }>;
  title?: string;
}
export function solveSentenceDiagram(params: Record<string, unknown>): SentenceDiagramFigure {
  if (typeof params.subject !== 'string' || !params.subject.trim()) throw new Error('sentence_diagram: subject required');
  if (typeof params.verb !== 'string' || !params.verb.trim()) throw new Error('sentence_diagram: verb required');
  const modifiers: SentenceDiagramFigure['modifiers'] = Array.isArray(params.modifiers)
    ? (params.modifiers as Array<Record<string, unknown>>).map((m, i) => {
        const at = m.attachTo;
        if (at !== 'subject' && at !== 'verb' && at !== 'object') {
          throw new Error(`sentence_diagram: modifiers[${i}].attachTo must be subject|verb|object`);
        }
        if (typeof m.word !== 'string') throw new Error(`sentence_diagram: modifiers[${i}].word required`);
        return { attachTo: at as 'subject' | 'verb' | 'object', word: m.word };
      })
    : undefined;
  return {
    subject: params.subject,
    verb: params.verb,
    object: typeof params.object === 'string' ? params.object : undefined,
    modifiers,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── argument_structure (Phase 7) ──────────────────────────────────────────
export interface ArgumentFigure {
  claim: string;
  evidence: string[];
  reasoning: string[];
  counter?: string;
  rebuttal?: string;
  title?: string;
}
export function solveArgumentStructure(params: Record<string, unknown>): ArgumentFigure {
  if (typeof params.claim !== 'string' || !params.claim.trim()) throw new Error('argument: claim required');
  const ev = Array.isArray(params.evidence) ? (params.evidence as unknown[]).map(String) : [];
  const re = Array.isArray(params.reasoning) ? (params.reasoning as unknown[]).map(String) : [];
  return {
    claim: params.claim,
    evidence: ev,
    reasoning: re,
    counter: typeof params.counter === 'string' ? params.counter : undefined,
    rebuttal: typeof params.rebuttal === 'string' ? params.rebuttal : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── historical_timeline (Phase 7) ─────────────────────────────────────────
export interface TimelineEvent { date: string; year: number; label: string; description?: string; color?: string }
export interface HistoricalTimelineFigure {
  events: TimelineEvent[];
  title?: string;
}
export function solveHistoricalTimeline(params: Record<string, unknown>): HistoricalTimelineFigure {
  if (!Array.isArray(params.events) || params.events.length === 0) throw new Error('timeline: events required');
  const events = (params.events as Array<Record<string, unknown>>).map((e, i) => {
    const date = typeof e.date === 'string' ? e.date : '';
    if (!date) throw new Error(`timeline: events[${i}].date required (e.g. "1776", "Jul 1776", "10 Jul 1776")`);
    const year = typeof e.year === 'number' ? e.year : parseInt(date.match(/-?\d{1,4}/)?.[0] || '0', 10);
    if (!Number.isFinite(year)) throw new Error(`timeline: events[${i}].year invalid`);
    if (typeof e.label !== 'string') throw new Error(`timeline: events[${i}].label required`);
    return {
      date, year,
      label: e.label,
      description: typeof e.description === 'string' ? e.description : undefined,
      color: typeof e.color === 'string' ? e.color : undefined,
    };
  });
  events.sort((a, b) => a.year - b.year);
  return { events, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── sentence_diagram manifest (Phase 2b — SVG organizer) ──────────────────
export const sentenceDiagramFeatureNames = {
  diagram: 'diagram',
  subject: 'subject',
  verb: 'verb',
  object: 'object',
  modifier: (i: number): string => `modifier-${i + 1}`,
};

export function buildSentenceDiagramManifest(figure: SentenceDiagramFigure): FeatureManifestEntry[] {
  const N = sentenceDiagramFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: figure.title ? `sentence diagram: ${figure.title}` : 'sentence diagram',
      labels: ['diagram', 'the diagram', 'sentence diagram', 'the sentence'],
      displayName: figure.title || 'sentence diagram',
      scribbleable: true,
    },
    {
      name: N.subject,
      kind: 'label',
      description: `subject: "${figure.subject}"`,
      labels: ['subject', 'the subject', figure.subject, `"${figure.subject}"`],
      displayName: figure.subject,
      scribbleable: true,
    },
    {
      name: N.verb,
      kind: 'label',
      description: `verb: "${figure.verb}"`,
      labels: ['verb', 'the verb', 'predicate', 'the predicate', figure.verb, `"${figure.verb}"`],
      displayName: figure.verb,
      scribbleable: true,
    },
  ];
  if (figure.object) {
    features.push({
      name: N.object,
      kind: 'label',
      description: `object: "${figure.object}"`,
      labels: ['object', 'the object', 'direct object', figure.object, `"${figure.object}"`],
      displayName: figure.object,
      scribbleable: true,
    });
  }
  (figure.modifiers ?? []).forEach((m, i) => {
    features.push({
      name: N.modifier(i),
      kind: 'label',
      description: `modifier ${i + 1}: "${m.word}" (on ${m.attachTo})`,
      labels: [
        `modifier ${i + 1}`, `modifier-${i + 1}`,
        m.word, `the ${m.word}`, `"${m.word}"`,
        `${m.attachTo} modifier`,
      ],
      displayName: m.word,
      scribbleable: true,
    });
  });
  return features;
}

// ── historical_timeline manifest (Phase 2b — SVG organizer) ───────────────
export const historicalTimelineFeatureNames = {
  timeline: 'timeline',
  axis: 'axis',
  event: (i: number): string => `event-${i + 1}`,
};

export function buildHistoricalTimelineManifest(figure: HistoricalTimelineFigure): FeatureManifestEntry[] {
  const N = historicalTimelineFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.timeline,
      kind: 'region',
      description: figure.title ? `timeline: ${figure.title}` : 'timeline',
      labels: ['timeline', 'the timeline', 'the diagram'],
      displayName: figure.title || 'timeline',
      scribbleable: true,
    },
    {
      name: N.axis,
      kind: 'label',
      description: 'timeline axis',
      labels: ['axis', 'the axis', 'the line', 'the timeline axis'],
      displayName: 'timeline axis',
      scribbleable: true,
    },
  ];
  figure.events.forEach((e, i) => {
    const label = String(e.label ?? '').trim();
    features.push({
      name: N.event(i),
      kind: 'area',
      description: label ? `event ${i + 1} (${e.date}): "${label}"` : `event ${i + 1} (${e.date})`,
      labels: [
        `event ${i + 1}`, `event-${i + 1}`,
        e.date, `the ${e.date} event`,
        ...(label ? [
          label, `the ${label}`, `"${label}"`,
          `event ${i + 1}: "${label}"`,
        ] : []),
      ],
      displayName: label ? `${e.date} ${label}` : `event ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── government_branches (Phase 7) ─────────────────────────────────────────
export interface GovernmentBranchesFigure {
  country: string;
  branches: Array<{ name: string; bodies?: string[]; powers?: string[] }>;
  title?: string;
}
export function solveGovernmentBranches(params: Record<string, unknown>): GovernmentBranchesFigure {
  const country = typeof params.country === 'string' ? params.country : 'United States';
  const branches = Array.isArray(params.branches)
    ? (params.branches as Array<Record<string, unknown>>).map((b, i) => {
        if (typeof b.name !== 'string') throw new Error(`gov: branches[${i}].name required`);
        return {
          name: b.name,
          bodies: Array.isArray(b.bodies) ? (b.bodies as unknown[]).map(String) : undefined,
          powers: Array.isArray(b.powers) ? (b.powers as unknown[]).map(String) : undefined,
        };
      })
    : [];
  if (branches.length === 0) {
    throw new Error('government_branches: at least one branch required');
  }
  return { country, branches, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── comparison_table (Phase 8) ────────────────────────────────────────────
export interface ComparisonTableFigure {
  items: string[];
  attributes: string[];
  cells: string[][]; // [attribute][item]
  title?: string;
}
export function solveComparisonTable(params: Record<string, unknown>): ComparisonTableFigure {
  if (!Array.isArray(params.items) || params.items.length === 0) throw new Error('comparison_table: items required');
  if (!Array.isArray(params.attributes) || params.attributes.length === 0) throw new Error('comparison_table: attributes required');
  const items = (params.items as unknown[]).map(String);
  const attributes = (params.attributes as unknown[]).map(String);
  if (!Array.isArray(params.cells)) throw new Error('comparison_table: cells must be a 2D array shaped [attributes.length][items.length] (outer = rows = attributes, inner = columns = items).');
  const cells = (params.cells as unknown[][]).map((row, r) => {
    if (!Array.isArray(row) || row.length !== items.length) {
      throw new Error(`comparison_table: cells[${r}] has ${Array.isArray(row) ? row.length : 'n/a'} entries but must have ${items.length} (one per item — items are column headers). Shape required: cells[attributeIndex][itemIndex], so each inner row has items.length entries.`);
    }
    return (row as unknown[]).map(String);
  });
  if (cells.length !== attributes.length) {
    throw new Error(`comparison_table: cells has ${cells.length} rows but must have ${attributes.length} (one row per attribute — attributes are row labels). Shape required: cells[attributeIndex][itemIndex].`);
  }
  return { items, attributes, cells, title: typeof params.title === 'string' ? params.title : undefined };
}

/**
 * Shared naming helper for comparison_table sub-features. The manifest
 * builder and the renderer both call these so feature names and
 * data-feature-id attrs cannot drift. Keep 1-indexed (matches the legacy
 * showTable convention at manifests.ts:492-571).
 */
export const comparisonTableFeatureNames = {
  table: 'table',
  headerRow: 'header-row',
  col: (i: number): string => `col-${i + 1}`,
  row: (i: number): string => `row-${i + 1}`,
  cell: (ri: number, ci: number): string => `cell-r${ri + 1}-c${ci + 1}`,
};

/**
 * Rich manifest for show_diagram(comparison_table). Phase 1 of the
 * whiteboard markup initiative (2026-05-13 audit). Replaces the
 * impoverished single-region catch-all from buildDiagramManifest.
 *
 * Granularity per Q4 grilling decision: structural rows/cols + content
 * aliases on rows/cols only; cells stay structural-index addressable.
 * Rows/cols use FeatureKind 'area' so they pass the snapshot filter
 * (which strips kind 'region') — the brain sees them and can verify
 * before promising a mark.
 */
export function buildComparisonTableManifest(figure: ComparisonTableFigure): FeatureManifestEntry[] {
  const N = comparisonTableFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.table,
      kind: 'region',
      description: figure.title ? `comparison table: ${figure.title}` : 'comparison table',
      labels: ['table', 'the table', 'comparison table', 'the comparison table', 'the grid'],
      displayName: figure.title || 'comparison table',
      scribbleable: true,
    },
    {
      name: N.headerRow,
      kind: 'region',
      description: 'the header row (item names)',
      labels: ['header row', 'the header row', 'headers', 'the headers', 'the top row', 'item headers'],
      displayName: 'header row',
      scribbleable: true,
    },
  ];
  figure.items.forEach((item, ci) => {
    const text = String(item ?? '').trim();
    features.push({
      name: N.col(ci),
      kind: 'area',
      description: `column ${ci + 1}${text ? ` ("${text}")` : ''}`,
      labels: [
        `column ${ci + 1}`, `col ${ci + 1}`, `col-${ci + 1}`,
        ...(text ? [
          `${text} column`, `the ${text} column`, text, `the ${text}`,
          `column ${ci + 1} (${text})`, `column ${ci + 1} ("${text}")`,
          `col ${ci + 1} (${text})`, `col ${ci + 1} ("${text}")`,
          `"${text}" column`, `"${text}"`,
        ] : []),
      ],
      displayName: text || `column ${ci + 1}`,
      scribbleable: true,
    });
  });
  figure.attributes.forEach((attr, ri) => {
    const text = String(attr ?? '').trim();
    features.push({
      name: N.row(ri),
      kind: 'area',
      description: `row ${ri + 1}${text ? ` ("${text}")` : ''}`,
      labels: [
        `row ${ri + 1}`, `row-${ri + 1}`,
        ...(text ? [
          `${text} row`, `the ${text} row`, text, `the ${text}`,
          `row ${ri + 1} (${text})`, `row ${ri + 1} ("${text}")`,
          `"${text}" row`, `"${text}"`,
        ] : []),
      ],
      displayName: text || `row ${ri + 1}`,
      scribbleable: true,
    });
  });
  figure.cells.forEach((row, ri) => {
    row.forEach((cellValue, ci) => {
      const cellText = String(cellValue ?? '').trim();
      const preview = cellText.length > 60 ? `${cellText.slice(0, 57)}...` : cellText;
      const attr = String(figure.attributes[ri] ?? '').trim();
      const item = String(figure.items[ci] ?? '').trim();
      // Intersection aliases for the brain's natural addressing of
      // a cell as a (row, column) pair — e.g. "Compressibility / Solid"
      // or "Solid's Volume". Observed 2026-05-13 session: brain emitted
      // tutor_scribble target="Compressibility / Solid" which silent-
      // dropped because none of the structural labels matched. These
      // intersection forms are how the brain naturally reaches when
      // confirming a student's row-name + column-name answer.
      const intersectionLabels = attr && item ? [
        `${attr} ${item}`, `${item} ${attr}`,
        `${attr} for ${item}`, `${attr} of ${item}`, `${item}'s ${attr}`,
        `${attr}/${item}`, `${attr} / ${item}`,
        `${item}/${attr}`, `${item} / ${attr}`,
        `${attr}-${item}`, `${item}-${attr}`,
        `${attr} × ${item}`, `${item} × ${attr}`,
        `the ${item} ${attr}`, `the ${attr} ${item}`,
        `the ${item}'s ${attr}`,
        `${attr} row ${item} column`,
        `${attr} row, ${item} column`,
        `${item} column ${attr} row`,
        `${item} column, ${attr} row`,
        `row ${ri + 1} column ${ci + 1} (${attr} / ${item})`,
        // Description-echo variants: when the boardSnapshot surfaces
        // the cell description like `cell at row 3 ("Compressibility")
        // × column 3 ("Gas")`, the brain copies that string verbatim
        // as the scribble target. Add these forms as labels so the
        // echo resolves. Observed 2026-05-13 (8) session.
        `cell at row ${ri + 1} ("${attr}") × column ${ci + 1} ("${item}")`,
        `cell at row ${ri + 1} (${attr}) × column ${ci + 1} (${item})`,
        `row ${ri + 1} ("${attr}") × column ${ci + 1} ("${item}")`,
        `row ${ri + 1} (${attr}) × column ${ci + 1} (${item})`,
        `the cell at row ${ri + 1} ("${attr}") × column ${ci + 1} ("${item}")`,
      ] : [];
      // Description carries the RENDERED cell content so the brain's
      // boardSnapshot shows exactly what is on the board. Without this
      // the brain cannot read its own rendered output and re-emits
      // show_diagram to "fill in" content it can't see.
      features.push({
        name: N.cell(ri, ci),
        kind: 'label',
        description: preview
          ? attr && item
            ? `cell at row ${ri + 1} ("${attr}") × column ${ci + 1} ("${item}"): "${preview}"`
            : `cell at row ${ri + 1} column ${ci + 1}: "${preview}"`
          : `cell at row ${ri + 1} column ${ci + 1}`,
        labels: [
          `cell ${ri + 1} ${ci + 1}`, `cell-r${ri + 1}-c${ci + 1}`,
          `row ${ri + 1} column ${ci + 1}`, `row ${ri + 1} col ${ci + 1}`,
          `cell at row ${ri + 1} column ${ci + 1}`,
          `cell at row ${ri + 1} col ${ci + 1}`,
          `the cell at row ${ri + 1} column ${ci + 1}`,
          ...intersectionLabels,
          ...(preview ? [
            preview, `the ${preview}`, `"${preview}"`, `the "${preview}" cell`,
            `${preview} cell`, `cell saying ${preview}`,
          ] : []),
        ],
        displayName: preview || (item && attr ? `${item} / ${attr}` : `cell ${ri + 1},${ci + 1}`),
        scribbleable: true,
      });
    });
  });
  return features;
}

// ═══════════════════════════════════════════════════════════════════
// Phase 2a organizer manifests — t_chart, kwl_chart, frayer_model,
// argument_structure, government_branches. Each follows the
// comparison_table pattern: shared naming helper + manifest builder.
// ═══════════════════════════════════════════════════════════════════

// ── t_chart ───────────────────────────────────────────────────────
export const tChartFeatureNames = {
  chart: 'chart',
  leftHeader: 'left-header',
  rightHeader: 'right-header',
  leftColumn: 'left-column',
  rightColumn: 'right-column',
  leftItem: (i: number): string => `left-item-${i + 1}`,
  rightItem: (i: number): string => `right-item-${i + 1}`,
};

export function buildTChartManifest(figure: OrganizerFigure): FeatureManifestEntry[] {
  const N = tChartFeatureNames;
  const lh = String(figure.leftHeader ?? '').trim();
  const rh = String(figure.rightHeader ?? '').trim();
  const leftItems = figure.leftItems ?? [];
  const rightItems = figure.rightItems ?? [];
  const features: FeatureManifestEntry[] = [
    {
      name: N.chart,
      kind: 'region',
      description: figure.title ? `t-chart: ${figure.title}` : 't-chart',
      labels: ['chart', 'the chart', 't-chart', 'the t-chart', 'the t chart'],
      displayName: figure.title || 't-chart',
      scribbleable: true,
    },
    {
      name: N.leftHeader,
      kind: 'label',
      description: lh ? `left header "${lh}"` : 'left header',
      labels: ['left header', 'the left header', ...(lh ? [lh, `the ${lh}`, `"${lh}"`, `${lh} header`] : [])],
      displayName: lh || 'left header',
      scribbleable: true,
    },
    {
      name: N.rightHeader,
      kind: 'label',
      description: rh ? `right header "${rh}"` : 'right header',
      labels: ['right header', 'the right header', ...(rh ? [rh, `the ${rh}`, `"${rh}"`, `${rh} header`] : [])],
      displayName: rh || 'right header',
      scribbleable: true,
    },
    {
      name: N.leftColumn,
      kind: 'area',
      description: lh ? `left column ("${lh}")` : 'left column',
      labels: ['left column', 'the left column', 'left side', 'the left side', ...(lh ? [`${lh} column`, `the ${lh} column`, `${lh} side`] : [])],
      displayName: lh || 'left column',
      scribbleable: true,
    },
    {
      name: N.rightColumn,
      kind: 'area',
      description: rh ? `right column ("${rh}")` : 'right column',
      labels: ['right column', 'the right column', 'right side', 'the right side', ...(rh ? [`${rh} column`, `the ${rh} column`, `${rh} side`] : [])],
      displayName: rh || 'right column',
      scribbleable: true,
    },
  ];
  leftItems.forEach((item, i) => {
    const text = String(item ?? '').trim();
    const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    features.push({
      name: N.leftItem(i),
      kind: 'label',
      description: preview ? `left item ${i + 1}: "${preview}"` : `left item ${i + 1}`,
      labels: [
        `left item ${i + 1}`, `left-item-${i + 1}`,
        ...(lh ? [`${lh} item ${i + 1}`] : []),
        ...(preview ? [preview, `the ${preview}`, `"${preview}"`] : []),
      ],
      displayName: preview || `left item ${i + 1}`,
      scribbleable: true,
    });
  });
  rightItems.forEach((item, i) => {
    const text = String(item ?? '').trim();
    const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    features.push({
      name: N.rightItem(i),
      kind: 'label',
      description: preview ? `right item ${i + 1}: "${preview}"` : `right item ${i + 1}`,
      labels: [
        `right item ${i + 1}`, `right-item-${i + 1}`,
        ...(rh ? [`${rh} item ${i + 1}`] : []),
        ...(preview ? [preview, `the ${preview}`, `"${preview}"`] : []),
      ],
      displayName: preview || `right item ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── kwl_chart ─────────────────────────────────────────────────────
export const kwlChartFeatureNames = {
  chart: 'chart',
  kColumn: 'k-column',
  wColumn: 'w-column',
  lColumn: 'l-column',
  kItem: (i: number): string => `k-item-${i + 1}`,
  wItem: (i: number): string => `w-item-${i + 1}`,
  lItem: (i: number): string => `l-item-${i + 1}`,
};

export function buildKwlChartManifest(figure: OrganizerFigure): FeatureManifestEntry[] {
  const N = kwlChartFeatureNames;
  const know = figure.know ?? [];
  const want = figure.want ?? [];
  const learned = figure.learned ?? [];
  const features: FeatureManifestEntry[] = [
    {
      name: N.chart,
      kind: 'region',
      description: figure.title ? `KWL chart: ${figure.title}` : 'KWL chart',
      labels: ['chart', 'the chart', 'KWL chart', 'the KWL chart', 'kwl chart'],
      displayName: figure.title || 'KWL chart',
      scribbleable: true,
    },
    {
      name: N.kColumn,
      kind: 'area',
      description: 'K column (what you know)',
      labels: ['K column', 'the K column', 'know column', 'the know column', 'what you know', 'what we know', 'K', 'the K', 'know', 'the know'],
      displayName: 'Know',
      scribbleable: true,
    },
    {
      name: N.wColumn,
      kind: 'area',
      description: 'W column (what you want to know)',
      labels: ['W column', 'the W column', 'want column', 'the want column', 'want to know', 'what we want to know', 'W', 'the W', 'want', 'the want'],
      displayName: 'Want to know',
      scribbleable: true,
    },
    {
      name: N.lColumn,
      kind: 'area',
      description: 'L column (what you learned)',
      labels: ['L column', 'the L column', 'learned column', 'the learned column', 'what we learned', 'L', 'the L', 'learned', 'the learned'],
      displayName: 'Learned',
      scribbleable: true,
    },
  ];
  const addItems = (items: string[], makeName: (i: number) => string, side: string) => {
    items.forEach((item, i) => {
      const text = String(item ?? '').trim();
      const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
      features.push({
        name: makeName(i),
        kind: 'label',
        description: preview ? `${side} item ${i + 1}: "${preview}"` : `${side} item ${i + 1}`,
        labels: [
          `${side} item ${i + 1}`, `${side}-item-${i + 1}`,
          ...(preview ? [preview, `the ${preview}`, `"${preview}"`] : []),
        ],
        displayName: preview || `${side} item ${i + 1}`,
        scribbleable: true,
      });
    });
  };
  addItems(know, N.kItem, 'K');
  addItems(want, N.wItem, 'W');
  addItems(learned, N.lItem, 'L');
  return features;
}

// ── frayer_model ──────────────────────────────────────────────────
export const frayerModelFeatureNames = {
  frayer: 'frayer',
  term: 'term',
  definition: 'definition',
  characteristics: 'characteristics',
  examples: 'examples',
  nonExamples: 'non-examples',
  characteristicItem: (i: number): string => `characteristic-item-${i + 1}`,
  exampleItem: (i: number): string => `example-item-${i + 1}`,
  nonExampleItem: (i: number): string => `non-example-item-${i + 1}`,
};

export function buildFrayerModelManifest(figure: OrganizerFigure): FeatureManifestEntry[] {
  const N = frayerModelFeatureNames;
  const term = String(figure.term ?? '').trim();
  const def = String(figure.definition ?? '').trim();
  const defPreview = def.length > 80 ? `${def.slice(0, 77)}...` : def;
  const chars = figure.characteristics ?? [];
  const examples = figure.examples ?? [];
  const nonExamples = figure.nonExamples ?? [];
  const features: FeatureManifestEntry[] = [
    {
      name: N.frayer,
      kind: 'region',
      description: term ? `Frayer model for "${term}"` : 'Frayer model',
      labels: ['frayer', 'the frayer', 'frayer model', 'the frayer model', 'the diagram'],
      displayName: term ? `Frayer for "${term}"` : 'Frayer model',
      scribbleable: true,
    },
    {
      name: N.term,
      kind: 'label',
      description: term ? `term "${term}" (center)` : 'term (center)',
      labels: ['term', 'the term', 'the center', 'center', ...(term ? [term, `"${term}"`, `the ${term}`, `the word ${term}`] : [])],
      displayName: term || 'term',
      scribbleable: true,
    },
    {
      name: N.definition,
      kind: 'area',
      description: defPreview ? `definition quadrant: "${defPreview}"` : 'definition quadrant',
      labels: ['definition', 'the definition', 'the definition quadrant', 'definition box'],
      displayName: 'Definition',
      scribbleable: true,
    },
    {
      name: N.characteristics,
      kind: 'area',
      description: 'characteristics quadrant',
      labels: ['characteristics', 'the characteristics', 'characteristics quadrant', 'characteristics box', 'features', 'traits'],
      displayName: 'Characteristics',
      scribbleable: true,
    },
    {
      name: N.examples,
      kind: 'area',
      description: 'examples quadrant',
      labels: ['examples', 'the examples', 'examples quadrant', 'examples box'],
      displayName: 'Examples',
      scribbleable: true,
    },
    {
      name: N.nonExamples,
      kind: 'area',
      description: 'non-examples quadrant',
      labels: ['non-examples', 'the non-examples', 'non-examples quadrant', 'non-examples box', 'nonexamples', 'not examples'],
      displayName: 'Non-examples',
      scribbleable: true,
    },
  ];
  const addQuadrantItems = (items: string[], makeName: (i: number) => string, quad: string) => {
    items.forEach((item, i) => {
      const text = String(item ?? '').trim();
      const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
      features.push({
        name: makeName(i),
        kind: 'label',
        description: preview ? `${quad} ${i + 1}: "${preview}"` : `${quad} ${i + 1}`,
        labels: [
          `${quad} ${i + 1}`, `${quad}-${i + 1}`,
          ...(preview ? [
            preview, `the ${preview}`, `"${preview}"`,
            `${quad} ${i + 1}: "${preview}"`, `${quad} ${i + 1}: ${preview}`,
            `${quad}-${i + 1}: "${preview}"`,
          ] : []),
        ],
        displayName: preview || `${quad} ${i + 1}`,
        scribbleable: true,
      });
    });
  };
  addQuadrantItems(chars, N.characteristicItem, 'characteristic');
  addQuadrantItems(examples, N.exampleItem, 'example');
  addQuadrantItems(nonExamples, N.nonExampleItem, 'non-example');
  return features;
}

// ── argument_structure ────────────────────────────────────────────
export const argumentStructureFeatureNames = {
  argument: 'argument',
  claim: 'claim',
  evidence: 'evidence',
  reasoning: 'reasoning',
  counter: 'counter',
  rebuttal: 'rebuttal',
  evidenceItem: (i: number): string => `evidence-item-${i + 1}`,
  reasoningItem: (i: number): string => `reasoning-item-${i + 1}`,
};

export function buildArgumentStructureManifest(figure: ArgumentFigure): FeatureManifestEntry[] {
  const N = argumentStructureFeatureNames;
  const claim = String(figure.claim ?? '').trim();
  const claimPreview = claim.length > 80 ? `${claim.slice(0, 77)}...` : claim;
  const features: FeatureManifestEntry[] = [
    {
      name: N.argument,
      kind: 'region',
      description: figure.title ? `argument structure: ${figure.title}` : 'argument structure',
      labels: ['argument', 'the argument', 'argument structure', 'the diagram'],
      displayName: figure.title || 'argument',
      scribbleable: true,
    },
    {
      name: N.claim,
      kind: 'label',
      description: claimPreview ? `claim: "${claimPreview}"` : 'claim',
      labels: ['claim', 'the claim', 'main claim', 'thesis', 'the thesis', ...(claimPreview ? [claimPreview, `"${claimPreview}"`] : [])],
      displayName: 'Claim',
      scribbleable: true,
    },
    {
      name: N.evidence,
      kind: 'area',
      description: `evidence section (${figure.evidence.length} ${figure.evidence.length === 1 ? 'item' : 'items'})`,
      labels: ['evidence', 'the evidence', 'evidence section', 'evidence box'],
      displayName: 'Evidence',
      scribbleable: true,
    },
    {
      name: N.reasoning,
      kind: 'area',
      description: `reasoning section (${figure.reasoning.length} ${figure.reasoning.length === 1 ? 'item' : 'items'})`,
      labels: ['reasoning', 'the reasoning', 'reasoning section', 'reasoning box', 'warrant', 'the warrant'],
      displayName: 'Reasoning',
      scribbleable: true,
    },
  ];
  figure.evidence.forEach((item, i) => {
    const text = String(item ?? '').trim();
    const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    features.push({
      name: N.evidenceItem(i),
      kind: 'label',
      description: preview ? `evidence ${i + 1}: "${preview}"` : `evidence ${i + 1}`,
      labels: [
        `evidence ${i + 1}`, `evidence-${i + 1}`,
        ...(preview ? [
          preview, `"${preview}"`,
          `evidence ${i + 1}: "${preview}"`, `evidence ${i + 1}: ${preview}`,
        ] : []),
      ],
      displayName: preview || `evidence ${i + 1}`,
      scribbleable: true,
    });
  });
  figure.reasoning.forEach((item, i) => {
    const text = String(item ?? '').trim();
    const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    features.push({
      name: N.reasoningItem(i),
      kind: 'label',
      description: preview ? `reasoning ${i + 1}: "${preview}"` : `reasoning ${i + 1}`,
      labels: [
        `reasoning ${i + 1}`, `reasoning-${i + 1}`,
        ...(preview ? [
          preview, `"${preview}"`,
          `reasoning ${i + 1}: "${preview}"`, `reasoning ${i + 1}: ${preview}`,
        ] : []),
      ],
      displayName: preview || `reasoning ${i + 1}`,
      scribbleable: true,
    });
  });
  if (figure.counter) {
    const c = String(figure.counter).trim();
    const preview = c.length > 80 ? `${c.slice(0, 77)}...` : c;
    features.push({
      name: N.counter,
      kind: 'area',
      description: `counterargument: "${preview}"`,
      labels: ['counter', 'the counter', 'counterargument', 'the counterargument', 'opposing view'],
      displayName: 'Counterargument',
      scribbleable: true,
    });
  }
  if (figure.rebuttal) {
    const r = String(figure.rebuttal).trim();
    const preview = r.length > 80 ? `${r.slice(0, 77)}...` : r;
    features.push({
      name: N.rebuttal,
      kind: 'area',
      description: `rebuttal: "${preview}"`,
      labels: ['rebuttal', 'the rebuttal', 'the response'],
      displayName: 'Rebuttal',
      scribbleable: true,
    });
  }
  return features;
}

// ── government_branches ───────────────────────────────────────────
export const governmentBranchesFeatureNames = {
  branches: 'branches',
  country: 'country',
  branch: (i: number): string => `branch-${i + 1}`,
  branchBodies: (i: number): string => `branch-${i + 1}-bodies`,
  branchPowers: (i: number): string => `branch-${i + 1}-powers`,
};

export function buildGovernmentBranchesManifest(figure: GovernmentBranchesFigure): FeatureManifestEntry[] {
  const N = governmentBranchesFeatureNames;
  const country = String(figure.country ?? '').trim();
  const features: FeatureManifestEntry[] = [
    {
      name: N.branches,
      kind: 'region',
      description: figure.title ? `branches of government: ${figure.title}` : 'branches of government',
      labels: ['branches', 'the branches', 'the diagram', 'branches of government'],
      displayName: figure.title || 'branches of government',
      scribbleable: true,
    },
    {
      name: N.country,
      kind: 'label',
      description: country ? `country: "${country}"` : 'country',
      labels: ['country', 'the country', ...(country ? [country, `the ${country}`] : [])],
      displayName: country || 'country',
      scribbleable: true,
    },
  ];
  figure.branches.forEach((branch, i) => {
    const name = String(branch.name ?? '').trim();
    features.push({
      name: N.branch(i),
      kind: 'area',
      description: name ? `branch ${i + 1}: "${name}"` : `branch ${i + 1}`,
      labels: [
        `branch ${i + 1}`, `branch-${i + 1}`,
        ...(name ? [name, `the ${name}`, `${name} branch`, `the ${name} branch`, `"${name}"`] : []),
      ],
      displayName: name || `branch ${i + 1}`,
      scribbleable: true,
    });
    if (branch.bodies && branch.bodies.length > 0) {
      features.push({
        name: N.branchBodies(i),
        kind: 'label',
        description: `${name || `branch ${i + 1}`} bodies: ${branch.bodies.join(', ')}`,
        labels: [
          `${name} bodies`, `branch ${i + 1} bodies`,
          ...(name ? [`the ${name} bodies`] : []),
        ],
        displayName: `${name || `branch ${i + 1}`} bodies`,
        scribbleable: true,
      });
    }
    if (branch.powers && branch.powers.length > 0) {
      features.push({
        name: N.branchPowers(i),
        kind: 'label',
        description: `${name || `branch ${i + 1}`} powers (${branch.powers.length})`,
        labels: [
          `${name} powers`, `branch ${i + 1} powers`,
          ...(name ? [`the ${name} powers`, `${name} responsibilities`] : []),
        ],
        displayName: `${name || `branch ${i + 1}`} powers`,
        scribbleable: true,
      });
    }
  });
  return features;
}

// ── t_chart / kwl_chart / frayer_model (Phase 8 — organizers) ─────────────
export interface OrganizerFigure {
  kind: 't_chart' | 'kwl_chart' | 'frayer_model';
  // For t_chart:
  leftHeader?: string;
  rightHeader?: string;
  leftItems?: string[];
  rightItems?: string[];
  // For kwl_chart:
  know?: string[];
  want?: string[];
  learned?: string[];
  // For frayer_model:
  term?: string;
  definition?: string;
  characteristics?: string[];
  examples?: string[];
  nonExamples?: string[];
  title?: string;
}
export function solveOrganizer(kind: OrganizerFigure['kind'], params: Record<string, unknown>): OrganizerFigure {
  const out: OrganizerFigure = { kind, title: typeof params.title === 'string' ? params.title : undefined };
  const arr = (v: unknown): string[] | undefined => Array.isArray(v) ? (v as unknown[]).map(String) : undefined;
  if (kind === 't_chart') {
    out.leftHeader = typeof params.leftHeader === 'string' ? params.leftHeader : 'Pros';
    out.rightHeader = typeof params.rightHeader === 'string' ? params.rightHeader : 'Cons';
    out.leftItems = arr(params.leftItems) || [];
    out.rightItems = arr(params.rightItems) || [];
  } else if (kind === 'kwl_chart') {
    out.know = arr(params.know) || [];
    out.want = arr(params.want) || [];
    out.learned = arr(params.learned) || [];
  } else if (kind === 'frayer_model') {
    out.term = typeof params.term === 'string' ? params.term : '';
    if (!out.term) throw new Error('frayer_model: term required');
    out.definition = typeof params.definition === 'string' ? params.definition : '';
    out.characteristics = arr(params.characteristics) || [];
    out.examples = arr(params.examples) || [];
    out.nonExamples = arr(params.nonExamples) || [];
  }
  return out;
}

// ── hierarchy_pyramid (Phase 8) ───────────────────────────────────────────
export interface HierarchyPyramidFigure {
  tiers: Array<{ label: string; description?: string; color?: string }>;
  /** When true, the first tier is rendered at the bottom (food pyramid).
   *  When false, the first tier is at the top. */
  baseFirst: boolean;
  title?: string;
}
export function solveHierarchyPyramid(params: Record<string, unknown>): HierarchyPyramidFigure {
  // Accept `tiers` (canonical) or `levels` (the brain reaches for this
  // word when the schema isn't fresh in its context — observed
  // 2026-05-06 G5 classification session).
  const tiersInput = Array.isArray(params.tiers)
    ? params.tiers
    : Array.isArray(params.levels)
    ? params.levels
    : null;
  if (!tiersInput || tiersInput.length === 0) {
    throw new Error('hierarchy_pyramid: tiers required');
  }
  const tiers = (tiersInput as Array<Record<string, unknown>>).map((t, i) => {
    if (typeof t.label !== 'string') throw new Error(`hierarchy_pyramid: tiers[${i}].label required`);
    return {
      label: t.label,
      description: typeof t.description === 'string' ? t.description : undefined,
      color: typeof t.color === 'string' ? t.color : undefined,
    };
  });
  return {
    tiers,
    baseFirst: params.baseFirst !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── hierarchy_pyramid manifest (Phase 2b — SVG organizer) ─────────────────
export const hierarchyPyramidFeatureNames = {
  pyramid: 'pyramid',
  tier: (i: number): string => `tier-${i + 1}`,
};

/** Manifest mirrors the renderer's `ordered` array exactly so `tier-1`
 *  always refers to the tier the renderer drew FIRST (top of the SVG).
 *  Renderer: `ordered = baseFirst ? tiers : tiers.reverse()`. */
export function buildHierarchyPyramidManifest(figure: HierarchyPyramidFigure): FeatureManifestEntry[] {
  const N = hierarchyPyramidFeatureNames;
  const ordered = figure.baseFirst ? [...figure.tiers] : [...figure.tiers].reverse();
  const features: FeatureManifestEntry[] = [
    {
      name: N.pyramid,
      kind: 'region',
      description: figure.title ? `pyramid: ${figure.title}` : 'pyramid',
      labels: ['pyramid', 'the pyramid', 'the hierarchy', 'the diagram'],
      displayName: figure.title || 'pyramid',
      scribbleable: true,
    },
  ];
  ordered.forEach((t, i) => {
    const label = String(t.label ?? '').trim();
    const ordinal = i === 0 ? 'top' : i === ordered.length - 1 ? 'bottom' : `${i + 1}-th from top`;
    features.push({
      name: N.tier(i),
      kind: 'area',
      description: label ? `tier ${i + 1} (${ordinal}): "${label}"` : `tier ${i + 1} (${ordinal})`,
      labels: [
        `tier ${i + 1}`, `tier-${i + 1}`,
        `${ordinal} tier`, `the ${ordinal} tier`,
        ...(label ? [label, `the ${label}`, `"${label}"`, `${label} tier`] : []),
      ],
      displayName: label || `tier ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}
