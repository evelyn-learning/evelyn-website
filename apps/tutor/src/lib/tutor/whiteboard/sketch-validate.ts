/**
 * Structural quality gate for doodler output (the in-loop half of the Q9
 * quality decision; the other half is the offline e2e judge).
 *
 * validateSketch takes the raw parsed tool output from the doodler and returns
 * a clean SketchPrimitive[] or null. Philosophy = "a wrong sketch is worse than
 * none": sanitize each primitive (clamp coords, default bad colors, cap text),
 * DROP individually-broken ones, but return null (→ render nothing) when the
 * result is incoherent — too few survivors, or so many dropped that the doodler
 * was clearly confused. No semantic/vision check here (kept off the hot path).
 *
 * Pure + dependency-free so it runs both server-side (the route) and in tests.
 */
import {
  SKETCH_BOUNDS,
  SKETCH_COLOR_NAMES,
  SKETCH_PRIMITIVE_TYPES,
  ICON_NAMES,
  type IconName,
  type Pt,
  type SketchColor,
  type SketchPrimitive,
} from './sketch-schema';

const {
  minCoord, maxCoord, maxStrokeWidth, maxLabels, maxLabelLen, maxPolyPoints, minPolyPoints,
  minConcentricCount, maxConcentricCount,
  minWaveCycles, maxWaveCycles, maxAmplitude,
  minCoils, maxCoils, maxSpringWidth,
  minStickScale, maxStickScale,
  minGridDim, maxGridDim, maxArcRadius, maxBlobWobble, maxDotsCount, maxSpread,
  maxPulleyRadius, maxLeverLength, maxLeverTilt, maxGaugeRadius,
  minAxisTicks, maxAxisTicks, maxAxisLabels,
  maxMoleculeAtoms, maxMoleculeBonds, maxBars,
  minCycleStages, maxCycleStages, maxCycleRadius,
  minFlowSteps, maxFlowSteps, maxBalanceTilt, minIconSize, maxIconSize,
  minParts, maxParts, minBranches, maxBranches, maxNodes, maxEdges, minEvents, maxEvents,
  maxVennRadius, minLayers, maxLayers, minMatrixDim, maxMatrixDim,
  minTiers, maxTiers, maxIcebergSize, maxVenn3Radius, minFlows, maxFlows,
} = SKETCH_BOUNDS;

/** Trim + cap a list of short text labels (stages, steps) → clean string[]. */
function textList(v: unknown, cap: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((s): s is string => typeof s === 'string')
    .map((s) => s.trim().slice(0, maxLabelLen))
    .filter((s) => s.length > 0)
    .slice(0, cap);
}

const STICK_POSES = ['stand', 'walk', 'run', 'point', 'arms-up'] as const;
const CONTAINER_SHAPES = ['beaker', 'tank', 'battery', 'thermometer'] as const;
const VECTOR_STYLES = ['single', 'double', 'curved', 'block'] as const;
const GRID_STYLES = ['lines', 'dots', 'boxes'] as const;
const BRACE_SIDES = ['left', 'right', 'top', 'bottom'] as const;
const ROPE_DIRS = ['both', 'left', 'right'] as const;

/** A short optional text tag carried by vector/brace (distinct from a `label` primitive). */
function tag(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim().slice(0, maxLabelLen);
  return t || undefined;
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}
function clampCoord(v: number): number {
  return Math.min(maxCoord, Math.max(minCoord, v));
}
function coord(v: unknown): number | null {
  const n = num(v);
  return n === null ? null : clampCoord(n);
}
function color(v: unknown, fallback?: SketchColor): SketchColor | undefined {
  return typeof v === 'string' && (SKETCH_COLOR_NAMES as string[]).includes(v)
    ? (v as SketchColor)
    : fallback;
}
function strokeWidth(v: unknown): number | undefined {
  const n = num(v);
  if (n === null) return undefined;
  return Math.min(maxStrokeWidth, Math.max(0.5, n));
}
function points(v: unknown): Pt[] | null {
  if (!Array.isArray(v)) return null;
  const out: Pt[] = [];
  for (const p of v) {
    const x = coord((p as Pt)?.x);
    const y = coord((p as Pt)?.y);
    if (x === null || y === null) continue;
    out.push({ x, y });
    if (out.length >= maxPolyPoints) break;
  }
  return out.length >= minPolyPoints ? out : null;
}

/** Sanitize one primitive → clean primitive, or null to drop it. */
function sanitize(raw: unknown): SketchPrimitive | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const type = p.type;
  if (typeof type !== 'string' || !(SKETCH_PRIMITIVE_TYPES as string[]).includes(type)) return null;

  const stroke = color(p.stroke);
  const fill = color(p.fill);
  const sw = strokeWidth(p.strokeWidth);
  const styled = {
    ...(stroke ? { stroke } : {}),
    ...(fill ? { fill } : {}),
    ...(sw !== undefined ? { strokeWidth: sw } : {}),
  };

  switch (type) {
    case 'line':
    case 'arrow': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length
      return { type, x1, y1, x2, y2, ...styled };
    }
    case 'curve': {
      const pts = points(p.points);
      if (!pts) return null;
      return { type, points: pts, ...(p.closed === true ? { closed: true } : {}), ...styled };
    }
    case 'polygon': {
      const pts = points(p.points);
      if (!pts || pts.length < 3) return null; // a polygon needs ≥3 vertices
      return { type, points: pts, ...styled };
    }
    case 'ellipse': {
      const cx = coord(p.cx), cy = coord(p.cy), rx = num(p.rx), ry = num(p.ry);
      if (cx === null || cy === null || rx === null || ry === null) return null;
      if (rx <= 0 || ry <= 0) return null;
      return { type, cx, cy, rx: Math.min(maxCoord, rx), ry: Math.min(maxCoord, ry), ...styled };
    }
    case 'concentric': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const spacing = num(p.spacing);
      let count = num(p.count);
      if (cx === null || cy === null || spacing === null || count === null) return null;
      if (spacing <= 0) return null;
      count = Math.round(Math.min(maxConcentricCount, Math.max(minConcentricCount, count)));
      const sq = num(p.squeeze);
      const ang = num(p.angle);
      return {
        type,
        cx, cy, count,
        spacing: Math.min(maxCoord, spacing),
        ...(sq !== null ? { squeeze: Math.min(0.9, Math.max(0, sq)) } : {}),
        ...(ang !== null ? { angle: ang } : {}),
        ...styled,
      };
    }
    case 'wave': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      const cycles = num(p.cycles), amplitude = num(p.amplitude);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (cycles === null || amplitude === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length segment
      if (amplitude <= 0) return null;
      const damping = num(p.damping);
      return {
        type,
        x1, y1, x2, y2,
        cycles: Math.min(maxWaveCycles, Math.max(minWaveCycles, cycles)),
        amplitude: Math.min(maxAmplitude, amplitude),
        ...(damping !== null ? { damping: Math.min(1, Math.max(0, damping)) } : {}),
        ...styled,
      };
    }
    case 'spring': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      let coils = num(p.coils);
      const width = num(p.width);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (coils === null || width === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length segment
      if (width <= 0) return null;
      coils = Math.round(Math.min(maxCoils, Math.max(minCoils, coils)));
      return {
        type,
        x1, y1, x2, y2,
        coils,
        width: Math.min(maxSpringWidth, width),
        ...styled,
      };
    }
    case 'stick_figure': {
      const x = coord(p.x), y = coord(p.y);
      const scale = num(p.scale);
      if (x === null || y === null || scale === null) return null;
      const pose =
        typeof p.pose === 'string' && (STICK_POSES as readonly string[]).includes(p.pose)
          ? (p.pose as (typeof STICK_POSES)[number])
          : undefined;
      return {
        type,
        x, y,
        scale: Math.min(maxStickScale, Math.max(minStickScale, scale)),
        ...(pose ? { pose } : {}),
        ...styled,
      };
    }
    case 'container_fill': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      const fillFrac = num(p.fillFrac);
      if (x === null || y === null || w === null || h === null || fillFrac === null) return null;
      if (w <= 0 || h <= 0) return null;
      const shape =
        typeof p.shape === 'string' && (CONTAINER_SHAPES as readonly string[]).includes(p.shape)
          ? (p.shape as (typeof CONTAINER_SHAPES)[number])
          : undefined;
      const fillColor = color(p.fillColor);
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        fillFrac: Math.min(1, Math.max(0, fillFrac)),
        ...(shape ? { shape } : {}),
        ...(fillColor ? { fillColor } : {}),
        ...styled,
      };
    }
    case 'vector': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length
      const style =
        typeof p.style === 'string' && (VECTOR_STYLES as readonly string[]).includes(p.style)
          ? (p.style as (typeof VECTOR_STYLES)[number])
          : undefined;
      const lbl = tag(p.label);
      return {
        type,
        x1, y1, x2, y2,
        ...(style ? { style } : {}),
        ...(lbl ? { label: lbl } : {}),
        ...styled,
      };
    }
    case 'grid': {
      const x = coord(p.x), y = coord(p.y);
      const cell = num(p.cell);
      let cols = num(p.cols), rows = num(p.rows);
      if (x === null || y === null || cell === null || cols === null || rows === null) return null;
      if (cell <= 0) return null;
      cols = Math.round(Math.min(maxGridDim, Math.max(minGridDim, cols)));
      rows = Math.round(Math.min(maxGridDim, Math.max(minGridDim, rows)));
      const gstyle =
        typeof p.style === 'string' && (GRID_STYLES as readonly string[]).includes(p.style)
          ? (p.style as (typeof GRID_STYLES)[number])
          : undefined;
      const fc = num(p.fillCount);
      return {
        type,
        x, y, cols, rows,
        cell: Math.min(maxCoord, cell),
        ...(gstyle ? { style: gstyle } : {}),
        ...(fc !== null ? { fillCount: Math.round(Math.min(cols * rows, Math.max(0, fc))) } : {}),
        ...styled,
      };
    }
    case 'brace': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length span
      const side =
        typeof p.side === 'string' && (BRACE_SIDES as readonly string[]).includes(p.side)
          ? (p.side as (typeof BRACE_SIDES)[number])
          : undefined;
      const lbl = tag(p.label);
      return {
        type,
        x1, y1, x2, y2,
        ...(side ? { side } : {}),
        ...(lbl ? { label: lbl } : {}),
        ...styled,
      };
    }
    case 'arc': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r), startAngle = num(p.startAngle), endAngle = num(p.endAngle);
      if (cx === null || cy === null || r === null || startAngle === null || endAngle === null) return null;
      if (r <= 0) return null;
      if (startAngle === endAngle) return null; // zero sweep
      return {
        type,
        cx, cy,
        r: Math.min(maxArcRadius, r),
        startAngle, endAngle,
        ...styled,
      };
    }
    case 'blob': {
      const cx = coord(p.cx), cy = coord(p.cy), rx = num(p.rx), ry = num(p.ry);
      if (cx === null || cy === null || rx === null || ry === null) return null;
      if (rx <= 0 || ry <= 0) return null;
      const wobble = num(p.wobble);
      return {
        type,
        cx, cy,
        rx: Math.min(maxCoord, rx),
        ry: Math.min(maxCoord, ry),
        ...(wobble !== null ? { wobble: Math.min(maxBlobWobble, Math.max(0, wobble)) } : {}),
        ...styled,
      };
    }
    case 'dots_cluster': {
      const cx = coord(p.cx), cy = coord(p.cy);
      let count = num(p.count);
      const spread = num(p.spread);
      if (cx === null || cy === null || count === null || spread === null) return null;
      if (spread <= 0) return null;
      count = Math.round(Math.min(maxDotsCount, Math.max(1, count)));
      return {
        type,
        cx, cy, count,
        spread: Math.min(maxSpread, spread),
        ...styled,
      };
    }
    case 'pulley': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      if (cx === null || cy === null || r === null) return null;
      if (r <= 0) return null;
      const ropeDir =
        typeof p.ropeDir === 'string' && (ROPE_DIRS as readonly string[]).includes(p.ropeDir)
          ? (p.ropeDir as (typeof ROPE_DIRS)[number])
          : undefined;
      return {
        type,
        cx, cy,
        r: Math.min(maxPulleyRadius, r),
        ...(ropeDir ? { ropeDir } : {}),
        ...styled,
      };
    }
    case 'lever': {
      const x = coord(p.x), y = coord(p.y);
      const length = num(p.length);
      let pivotFrac = num(p.pivotFrac);
      if (x === null || y === null || length === null || pivotFrac === null) return null;
      if (length <= 0) return null;
      pivotFrac = Math.min(1, Math.max(0, pivotFrac));
      const tilt = num(p.tilt);
      return {
        type,
        x, y,
        length: Math.min(maxLeverLength, length),
        pivotFrac,
        ...(tilt !== null ? { tilt: Math.min(maxLeverTilt, Math.max(-maxLeverTilt, tilt)) } : {}),
        ...styled,
      };
    }
    case 'gauge': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      let frac = num(p.frac);
      if (cx === null || cy === null || r === null || frac === null) return null;
      if (r <= 0) return null;
      frac = Math.min(1, Math.max(0, frac));
      const lbl = tag(p.label);
      return {
        type,
        cx, cy,
        r: Math.min(maxGaugeRadius, r),
        frac,
        ...(lbl ? { label: lbl } : {}),
        ...styled,
      };
    }
    case 'axis': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length axis
      let ticks = num(p.ticks);
      if (ticks !== null) ticks = Math.round(Math.min(maxAxisTicks, Math.max(minAxisTicks, ticks)));
      const labels = Array.isArray(p.labels)
        ? p.labels
            .filter((s): s is string => typeof s === 'string')
            .map((s) => s.trim().slice(0, maxLabelLen))
            .filter((s) => s.length > 0)
            .slice(0, maxAxisLabels)
        : undefined;
      return {
        type,
        x1, y1, x2, y2,
        ...(ticks !== null ? { ticks } : {}),
        ...(labels && labels.length ? { labels } : {}),
        ...styled,
      };
    }
    case 'coordinate_grid': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      const quadrants = p.quadrants === 1 ? 1 : 4; // default 4-quadrant plane
      const xLabel = tag(p.xLabel);
      const yLabel = tag(p.yLabel);
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        quadrants,
        ...(xLabel ? { xLabel } : {}),
        ...(yLabel ? { yLabel } : {}),
        ...styled,
      };
    }
    case 'orbit': {
      const cx = coord(p.cx), cy = coord(p.cy), rx = num(p.rx), ry = num(p.ry);
      if (cx === null || cy === null || rx === null || ry === null) return null;
      if (rx <= 0 || ry <= 0) return null;
      const angle = num(p.angle);
      const satelliteLabel = tag(p.satelliteLabel);
      const centerLabel = tag(p.centerLabel);
      return {
        type,
        cx, cy,
        rx: Math.min(maxCoord, rx),
        ry: Math.min(maxCoord, ry),
        ...(angle !== null ? { angle } : {}),
        ...(satelliteLabel ? { satelliteLabel } : {}),
        ...(centerLabel ? { centerLabel } : {}),
        ...styled,
      };
    }
    case 'molecule': {
      if (!Array.isArray(p.atoms) || !Array.isArray(p.bonds)) return null;
      const atoms: { x: number; y: number; label?: string }[] = [];
      for (const a of p.atoms) {
        const ax = coord((a as { x?: unknown })?.x);
        const ay = coord((a as { y?: unknown })?.y);
        if (ax === null || ay === null) continue;
        const lbl = tag((a as { label?: unknown })?.label);
        atoms.push({ x: ax, y: ay, ...(lbl ? { label: lbl } : {}) });
        if (atoms.length >= maxMoleculeAtoms) break;
      }
      if (atoms.length < 1) return null; // need at least one atom to draw
      const bonds: { a: number; b: number; order?: number }[] = [];
      for (const b of p.bonds) {
        const ai = num((b as { a?: unknown })?.a);
        const bi = num((b as { b?: unknown })?.b);
        if (ai === null || bi === null) continue;
        const a2 = Math.round(ai), b2 = Math.round(bi);
        // drop bonds that reference a missing atom or link an atom to itself
        if (a2 < 0 || b2 < 0 || a2 >= atoms.length || b2 >= atoms.length || a2 === b2) continue;
        const ord = num((b as { order?: unknown })?.order);
        const order = ord === null ? 1 : Math.round(Math.min(3, Math.max(1, ord)));
        bonds.push({ a: a2, b: b2, order });
        if (bonds.length >= maxMoleculeBonds) break;
      }
      return { type, atoms, bonds, ...styled };
    }
    case 'bar_compare': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      const values = Array.isArray(p.values)
        ? p.values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v)).slice(0, maxBars)
        : null;
      if (!values || values.length < 1) return null;
      if (Math.max(...values) <= 0) return null; // nothing to scale against → drop
      const labels = Array.isArray(p.labels)
        ? p.labels
            .filter((s): s is string => typeof s === 'string')
            .map((s) => s.trim().slice(0, maxLabelLen))
            .filter((s) => s.length > 0)
            .slice(0, maxBars)
        : undefined;
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        values,
        ...(labels && labels.length ? { labels } : {}),
        ...styled,
      };
    }
    case 'cycle': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      if (cx === null || cy === null || r === null) return null;
      if (r <= 0) return null;
      const stages = textList(p.stages, maxCycleStages);
      if (stages.length < minCycleStages) return null;
      return {
        type,
        cx, cy,
        r: Math.min(maxCycleRadius, r),
        stages,
        ...(p.clockwise === false ? { clockwise: false } : {}),
        ...styled,
      };
    }
    case 'flow_chain': {
      const x = coord(p.x), y = coord(p.y);
      if (x === null || y === null) return null;
      const steps = textList(p.steps, maxFlowSteps);
      if (steps.length < minFlowSteps) return null;
      return {
        type,
        x, y,
        steps,
        ...(p.direction === 'down' ? { direction: 'down' as const } : {}),
        ...styled,
      };
    }
    case 'balance_scale': {
      const cx = coord(p.cx), cy = coord(p.cy);
      if (cx === null || cy === null) return null;
      const tilt = num(p.tilt);
      const leftLabel = tag(p.leftLabel);
      const rightLabel = tag(p.rightLabel);
      return {
        type,
        cx, cy,
        ...(tilt !== null ? { tilt: Math.min(maxBalanceTilt, Math.max(-maxBalanceTilt, tilt)) } : {}),
        ...(leftLabel ? { leftLabel } : {}),
        ...(rightLabel ? { rightLabel } : {}),
        ...styled,
      };
    }
    case 'icon': {
      const x = coord(p.x), y = coord(p.y);
      const size = num(p.size);
      if (x === null || y === null || size === null) return null;
      if (typeof p.name !== 'string' || !(ICON_NAMES as readonly string[]).includes(p.name)) return null;
      return {
        type,
        name: p.name as IconName,
        x, y,
        size: Math.min(maxIconSize, Math.max(minIconSize, size)),
        ...styled,
      };
    }
    case 'part_whole': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      let parts = num(p.parts);
      if (cx === null || cy === null || r === null || parts === null) return null;
      if (r <= 0) return null;
      parts = Math.round(Math.min(maxParts, Math.max(minParts, parts)));
      const filled = num(p.filled);
      const lbl = tag(p.label);
      return {
        type,
        cx, cy,
        r: Math.min(maxCoord, r),
        parts,
        ...(filled !== null ? { filled: Math.round(Math.min(parts, Math.max(0, filled))) } : {}),
        ...(lbl ? { label: lbl } : {}),
        ...styled,
      };
    }
    case 'tree_diagram': {
      const x = coord(p.x), y = coord(p.y);
      if (x === null || y === null) return null;
      const root = tag(p.root);
      if (!root) return null;
      const branches = textList(p.branches, maxBranches);
      if (branches.length < minBranches) return null;
      return { type, x, y, root, branches, ...styled };
    }
    case 'network': {
      if (!Array.isArray(p.nodes) || !Array.isArray(p.edges)) return null;
      const nodes: { x: number; y: number; label?: string }[] = [];
      for (const nd of p.nodes) {
        const nx = coord((nd as { x?: unknown })?.x);
        const ny = coord((nd as { y?: unknown })?.y);
        if (nx === null || ny === null) continue;
        const lbl = tag((nd as { label?: unknown })?.label);
        nodes.push({ x: nx, y: ny, ...(lbl ? { label: lbl } : {}) });
        if (nodes.length >= maxNodes) break;
      }
      if (nodes.length < 2) return null;
      const edges: { a: number; b: number }[] = [];
      for (const e of p.edges) {
        const ai = num((e as { a?: unknown })?.a);
        const bi = num((e as { b?: unknown })?.b);
        if (ai === null || bi === null) continue;
        const a2 = Math.round(ai), b2 = Math.round(bi);
        if (a2 < 0 || b2 < 0 || a2 >= nodes.length || b2 >= nodes.length || a2 === b2) continue;
        edges.push({ a: a2, b: b2 });
        if (edges.length >= maxEdges) break;
      }
      return { type, nodes, edges, ...styled };
    }
    case 'speech_bubble': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      const text = typeof p.text === 'string' ? p.text.trim().slice(0, maxLabelLen) : '';
      if (x === null || y === null || w === null || h === null || !text) return null;
      if (w <= 0 || h <= 0) return null;
      const tailX = coord(p.tailX);
      const tailY = coord(p.tailY);
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        text,
        ...(tailX !== null ? { tailX } : {}),
        ...(tailY !== null ? { tailY } : {}),
        ...styled,
      };
    }
    case 'timeline': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null;
      const events = Array.isArray(p.events)
        ? p.events
            .map((e) => ({ at: num((e as { at?: unknown })?.at), label: tag((e as { label?: unknown })?.label) }))
            .filter((e): e is { at: number; label: string } => e.at !== null && !!e.label)
            .map((e) => ({ at: Math.min(1, Math.max(0, e.at)), label: e.label }))
            .slice(0, maxEvents)
        : [];
      if (events.length < minEvents) return null;
      return { type, x1, y1, x2, y2, events, ...styled };
    }
    case 'venn': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      if (cx === null || cy === null || r === null) return null;
      if (r <= 0) return null;
      const leftLabel = tag(p.leftLabel), rightLabel = tag(p.rightLabel), bothLabel = tag(p.bothLabel);
      return {
        type,
        cx, cy,
        r: Math.min(maxVennRadius, r),
        ...(leftLabel ? { leftLabel } : {}),
        ...(rightLabel ? { rightLabel } : {}),
        ...(bothLabel ? { bothLabel } : {}),
        ...styled,
      };
    }
    case 'layers': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      const layers = textList(p.layers, maxLayers);
      if (layers.length < minLayers) return null;
      return { type, x, y, w: Math.min(maxCoord, w), h: Math.min(maxCoord, h), layers, ...styled };
    }
    case 'matrix': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      let rows = num(p.rows), cols = num(p.cols);
      if (x === null || y === null || w === null || h === null || rows === null || cols === null) return null;
      if (w <= 0 || h <= 0) return null;
      rows = Math.round(Math.min(maxMatrixDim, Math.max(minMatrixDim, rows)));
      cols = Math.round(Math.min(maxMatrixDim, Math.max(minMatrixDim, cols)));
      const rowLabels = textList(p.rowLabels, rows);
      const colLabels = textList(p.colLabels, cols);
      const cells = textList(p.cells, rows * cols);
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        rows, cols,
        ...(rowLabels.length ? { rowLabels } : {}),
        ...(colLabels.length ? { colLabels } : {}),
        ...(cells.length ? { cells } : {}),
        ...styled,
      };
    }
    case 'pyramid': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      const tiers = textList(p.tiers, maxTiers);
      if (tiers.length < minTiers) return null;
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        tiers,
        ...(p.flip === true ? { flip: true } : {}),
        ...styled,
      };
    }
    case 'iceberg': {
      const cx = coord(p.cx), cy = coord(p.cy);
      if (cx === null || cy === null) return null;
      const size = num(p.size);
      const aboveLabel = tag(p.aboveLabel), belowLabel = tag(p.belowLabel);
      return {
        type,
        cx, cy,
        ...(size !== null && size > 0 ? { size: Math.min(maxIcebergSize, size) } : {}),
        ...(aboveLabel ? { aboveLabel } : {}),
        ...(belowLabel ? { belowLabel } : {}),
        ...styled,
      };
    }
    case 'venn3': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const r = num(p.r);
      if (cx === null || cy === null || r === null) return null;
      if (r <= 0) return null;
      const aLabel = tag(p.aLabel), bLabel = tag(p.bLabel), cLabel = tag(p.cLabel), allLabel = tag(p.allLabel);
      return {
        type,
        cx, cy,
        r: Math.min(maxVenn3Radius, r),
        ...(aLabel ? { aLabel } : {}),
        ...(bLabel ? { bLabel } : {}),
        ...(cLabel ? { cLabel } : {}),
        ...(allLabel ? { allLabel } : {}),
        ...styled,
      };
    }
    case 'sankey': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      const flows = Array.isArray(p.flows)
        ? p.flows
            .map((f) => ({ value: num((f as { value?: unknown })?.value), label: tag((f as { label?: unknown })?.label) }))
            .filter((f): f is { value: number; label: string } => f.value !== null && f.value > 0 && !!f.label)
            .slice(0, maxFlows)
        : [];
      if (flows.length < minFlows) return null;
      const inputLabel = tag(p.inputLabel);
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        flows,
        ...(inputLabel ? { inputLabel } : {}),
        ...styled,
      };
    }
    case 'rect': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        ...(p.rounded === true ? { rounded: true } : {}),
        ...styled,
      };
    }
    case 'label': {
      const x = coord(p.x), y = coord(p.y);
      const text = typeof p.text === 'string' ? p.text.trim().slice(0, maxLabelLen) : '';
      if (x === null || y === null || !text) return null;
      const fontSize = num(p.fontSize);
      const anchor =
        p.anchor === 'start' || p.anchor === 'middle' || p.anchor === 'end' ? p.anchor : undefined;
      return {
        type,
        x, y, text,
        ...(fontSize !== null ? { fontSize: Math.min(12, Math.max(2.5, fontSize)) } : {}),
        ...(anchor ? { anchor } : {}),
        ...(stroke ? { stroke } : {}),
      };
    }
    default:
      return null;
  }
}

/**
 * Validate raw doodler output. Returns clean primitives, or null to render
 * nothing (fail-to-nothing).
 */
export function validateSketch(input: unknown): SketchPrimitive[] | null {
  const arr =
    Array.isArray(input)
      ? input
      : Array.isArray((input as { primitives?: unknown })?.primitives)
        ? (input as { primitives: unknown[] }).primitives
        : null;
  if (!arr || arr.length === 0) return null;

  const cleaned: SketchPrimitive[] = [];
  let labelCount = 0;
  let dropped = 0;
  for (const raw of arr) {
    const s = sanitize(raw);
    if (!s) { dropped++; continue; }
    if (s.type === 'label') {
      if (labelCount >= maxLabels) { dropped++; continue; }
      labelCount++;
    }
    cleaned.push(s);
    if (cleaned.length >= SKETCH_BOUNDS.maxPrimitives) break;
  }

  if (cleaned.length < SKETCH_BOUNDS.minPrimitives) return null;
  // Confusion guard: if the doodler emitted mostly garbage, drop the whole thing.
  if (dropped > cleaned.length) return null;
  // A doodle that is ONLY labels (no actual drawing) isn't a sketch — drop it.
  if (cleaned.every((c) => c.type === 'label')) return null;

  return cleaned;
}
