/** Phases 6+7+8 — advanced math, ELA, social studies, organizers. */

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
  if (!Array.isArray(params.cells)) throw new Error('comparison_table: cells must be a matrix');
  const cells = (params.cells as unknown[][]).map((row, r) => {
    if (!Array.isArray(row) || row.length !== items.length) {
      throw new Error(`comparison_table: cells[${r}] must have ${items.length} entries`);
    }
    return (row as unknown[]).map(String);
  });
  if (cells.length !== attributes.length) {
    throw new Error(`comparison_table: cells must have ${attributes.length} rows (one per attribute)`);
  }
  return { items, attributes, cells, title: typeof params.title === 'string' ? params.title : undefined };
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
